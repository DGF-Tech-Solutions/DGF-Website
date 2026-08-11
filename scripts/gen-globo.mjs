/*
 * Genera i dati del globo della home: `src/data/globo.json`.
 *
 * Gira a mano (`node scripts/gen-globo.mjs`), non a ogni build: l'output è
 * versionato, quindi il sito non dipende né da questo script né dai dati
 * cartografici per compilare.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PERCHÉ ESISTE
 *
 * Il vecchio sito disegnava il globo proiettando la mappa a ogni fotogramma
 * (d3-geo + React che ridipingeva ~1000 nodi SVG 60 volte al secondo): da lì
 * i rallentamenti. Qui la proiezione è calcolata UNA volta, adesso, e il
 * browser deve solo far scorrere delle immagini già pronte.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * COME SI OTTIENE UNA SFERA SENZA CALCOLARE NULLA A RUNTIME
 *
 * Una sfera vista da lontano (proiezione ortografica) fa due cose alla mappa:
 *
 *   1. la comprime in orizzontale man mano che si sale di latitudine
 *      (il parallelo a 60° è largo la metà dell'equatore: cos 60° = 0,5);
 *   2. la comprime in verticale avvicinandosi ai poli
 *      (la latitudine φ finisce all'altezza sin φ, non φ).
 *
 * Entrambe dipendono SOLO dalla latitudine — cioè dalla riga dello schermo —
 * e non dalla rotazione. Quindi se taglio il globo in strisce orizzontali,
 * ogni striscia ha un fattore di compressione fisso: basta una `<svg>` per
 * striscia, larga quanto il parallelo di quella latitudine, e la rotazione
 * diventa una sola traslazione orizzontale condivisa. Zero JavaScript, zero
 * lavoro per fotogramma: se ne occupa il compositore della GPU.
 *
 * L'approssimazione che resta: dentro la striscia la longitudine avanza in
 * modo lineare, mentre sulla sfera vera rallenta verso il bordo (x = sin λ).
 * Per questo la finestra visibile è 360/π ≈ 114,6° invece di 180°: è
 * l'ampiezza per cui la scala al centro del disco è ESATTA e la mappa non
 * risulta né schiacciata né stirata. Quello che si perde è il pezzetto di
 * emisfero più radente al bordo, che è comunque coperto dalla dissolvenza.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

/* ── Parametri ─────────────────────────────────────────────────────────── */

/** Larghezza del `viewBox` di ogni striscia, in gradi di longitudine.
 *  360° (un giro completo, quanto scorre l'animazione) + una finestra di
 *  margine, così il ciclo si richiude senza stacchi. */
const VIEW_W = 480;

/** Quanti gradi di longitudine sono visibili nel disco. Vedi sopra: 360/π. */
const LON_WINDOW = 360 / Math.PI;

/** Confine fra le strisce "equatoriali" e le due calotte polari. Sopra questa
 *  latitudine una striscia da 3° sarebbe alta meno di un pixel: non vale un
 *  livello di composizione in più. */
const CAP_LAT = 76;
const BAND_STEP = (CAP_LAT * 2) / 50; // 50 strisce fra i due confini

const MESSINA = { lon: 15.55, lat: 38.19 };

/*
 * ── Quanto dettaglio, e dove ──────────────────────────────────────────────
 *
 * I dati di partenza sono a 1:50 milioni. Presi così sarebbero 60.000 punti:
 * troppi da mettere dentro all'HTML della home. Ma non serve la stessa
 * precisione dappertutto — l'occhio va dove c'è il puntino.
 *
 * Quindi la semplificazione è VARIABILE con la distanza da Messina: attorno
 * all'Italia si tiene tutto (lo Stretto, le Eolie, la Sardegna, la costa
 * dalmata), e più ci si allontana più la costa si sintetizza, fino al livello
 * di una carta da parete dall'altra parte del mondo.
 *
 * Non ci sono cuciture fra le due zone: è sempre lo stesso disegno, con una
 * soglia che cambia con continuità lungo la costa. Alla dimensione massima
 * del globo 1° ≈ 8,7 px, quindi 0,05° è un ventesimo di pixel e 0,4° tre pixel.
 */
const FUOCO = { lon: 15.55, lat: 38.19 };
const SIMPLIFY_VICINO = 0.05;
const SIMPLIFY_LONTANO = 0.45;
/** Fra questi due raggi (in gradi) la tolleranza sale con continuità. */
const RAGGIO_NITIDO = 14;
const RAGGIO_SINTESI = 45;

/** Isole più piccole di così sparirebbero nell'antialiasing. Anche questa
 *  soglia si allarga con la distanza: Ischia vicino sì, un atollo lontano no. */
const MIN_FEATURE_VICINO = 0.1;
const MIN_FEATURE_LONTANO = 1.2;

/** Nodi della rete: candidati distribuiti uniformemente sulla sfera, poi
 *  tenuti solo quelli che cadono su terraferma. */
const NODE_CANDIDATES = 700;
const NODE_NEIGHBOURS = 3;
/** Un collegamento che scavalca mezzo mondo non è un collegamento: è una
 *  riga che attraversa il disegno. Sopra questa distanza si scarta. */
const MAX_EDGE_LON = 38;
const MAX_EDGE_LAT = 26;
/** Linee diritte che partono da Messina. */
const MESSINA_LINKS = 10;
/** Le linee non partono dal puntino ma da un anello attorno, in gradi: dodici
 *  raggi che convergono nello stesso punto formano una macchia che copre
 *  proprio la Sicilia, cioè l'unica cosa che deve restare leggibile. */
const MESSINA_STACCO = 3;

/* ── TopoJSON → anelli in (lon, lat) ───────────────────────────────────── */

/*
 * Decodifica a mano invece di importare `topojson-client`: sono venti righe e
 * ci risparmiano una dipendenza per uno script che gira due volte l'anno.
 * Il formato: coordinate intere delta-compresse, da rimettere in scala con
 * `transform`.
 */
function decodeArcs(topology) {
  const { scale, translate } = topology.transform;
  return topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

/** Un anello è una lista di indici di arco; l'indice negativo significa
 *  "questo arco, al contrario" (e vale ~i, non -i). */
function ringToPoints(ring, arcs) {
  const points = [];
  for (const index of ring) {
    const arc = index < 0 ? [...arcs[~index]].reverse() : arcs[index];
    // Il primo punto di ogni arco coincide con l'ultimo del precedente.
    for (let i = points.length ? 1 : 0; i < arc.length; i++) points.push(arc[i]);
  }
  return points;
}

/* ── Semplificazione (Douglas–Peucker) ─────────────────────────────────── */

function perpendicularDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/**
 * Quanto è lontano un punto da Messina, in gradi (la longitudine pesata per il
 * coseno della latitudine, altrimenti verso i poli le distanze mentono).
 */
function distanzaDalFuoco([lon, lat]) {
  let dLon = Math.abs(lon - FUOCO.lon);
  if (dLon > 180) dLon = 360 - dLon;
  return Math.hypot(dLon * Math.cos((lat * Math.PI) / 180), lat - FUOCO.lat);
}

/** 0 vicino a Messina, 1 dall'altra parte del mondo, con una rampa in mezzo. */
function lontananza(punto) {
  const d = distanzaDalFuoco(punto);
  return Math.min(1, Math.max(0, (d - RAGGIO_NITIDO) / (RAGGIO_SINTESI - RAGGIO_NITIDO)));
}

function tolleranza(punto) {
  return SIMPLIFY_VICINO + (SIMPLIFY_LONTANO - SIMPLIFY_VICINO) * lontananza(punto);
}

/**
 * Douglas–Peucker con soglia variabile, scritto con una pila esplicita.
 *
 * Iterativo e non ricorsivo perché con i dati a 50 milioni un singolo anello
 * (l'Eurasia) arriva a decine di migliaia di punti: la versione ricorsiva
 * esaurirebbe lo stack di Node.
 */
function simplify(points) {
  const n = points.length;
  if (n < 3) return points;

  const tieni = new Uint8Array(n);
  tieni[0] = 1;
  tieni[n - 1] = 1;

  const pila = [[0, n - 1]];
  while (pila.length) {
    const [a, b] = pila.pop();
    let peggiore = 0;
    let indice = -1;
    for (let i = a + 1; i < b; i++) {
      const d = perpendicularDistance(points[i], points[a], points[b]);
      if (d > peggiore) {
        peggiore = d;
        indice = i;
      }
    }
    // La soglia è quella del punto in esame: la stessa costa può essere
    // dettagliata da un lato e sintetica dall'altro senza spezzarsi.
    if (indice >= 0 && peggiore > tolleranza(points[indice])) {
      tieni[indice] = 1;
      pila.push([a, indice], [indice, b]);
    }
  }

  return points.filter((_, i) => tieni[i]);
}

/* ── Geometria sferica ─────────────────────────────────────────────────── */

const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

/** Un punto è dentro l'anello? Ray casting classico, in gradi. */
function insideRing([lon, lat], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** Regola pari-dispari sull'intero poligono: l'anello esterno mette dentro,
 *  i buchi (laghi, mari interni) rimettono fuori. */
function insidePolygon(point, rings) {
  let inside = false;
  for (const ring of rings) if (insideRing(point, ring)) inside = !inside;
  return inside;
}

/* ── Assemblaggio ──────────────────────────────────────────────────────── */

const topology = JSON.parse(
  readFileSync(join(HERE, "data", "land-50m.json"), "utf8")
);
const arcs = decodeArcs(topology);

/** Poligoni di terraferma (ognuno: anello esterno + eventuali buchi). */
const polygons = topology.objects.land.geometries.flatMap((geometry) =>
  geometry.type === "Polygon"
    ? [geometry.arcs.map((ring) => ringToPoints(ring, arcs))]
    : geometry.arcs.map((polygon) => polygon.map((ring) => ringToPoints(ring, arcs)))
);

/**
 * Spezza una polilinea dove scavalca l'antimeridiano.
 *
 * Sulla mappa i ±180° sono lo stesso posto, ma in coordinate sono agli
 * antipodi: senza tagliare, Russia e Antartide disegnerebbero una riga dritta
 * attraverso tutto il planisfero. Tagliando, il pezzo mancante ricompare da
 * solo nella copia successiva della mappa — che è esattamente ciò che serve
 * per un motivo che si ripete.
 */
function splitAtAntimeridian(points) {
  const out = [];
  let current = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (Math.abs(points[i][0] - points[i - 1][0]) > 180) {
      out.push(current);
      current = [];
    }
    current.push(points[i]);
  }
  out.push(current);
  return out.filter((line) => line.length > 1);
}

const coastlines = polygons
  .flatMap((rings) => rings)
  .flatMap((ring) => splitAtAntimeridian(ring))
  .map((line) => simplify(line))
  .filter((line) => {
    if (line.length < 2) return false;
    const lons = line.map((p) => p[0]);
    const lats = line.map((p) => p[1]);
    const w = Math.max(...lons) - Math.min(...lons);
    const h = Math.max(...lats) - Math.min(...lats);
    const soglia =
      MIN_FEATURE_VICINO +
      (MIN_FEATURE_LONTANO - MIN_FEATURE_VICINO) * lontananza(line[0]);
    return Math.hypot(w, h) >= soglia;
  });

/* Nodi: distribuzione a spirale di Fibonacci (punti equidistanti sulla
   sfera, senza addensamenti ai poli), tenuti solo se cadono sulla terra. */
const nodes = [];
{
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_CANDIDATES; i++) {
    const y = 1 - (i / (NODE_CANDIDATES - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const lat = toDeg(Math.asin(y));
    const lon = toDeg(Math.atan2(Math.sin(theta) * radius, Math.cos(theta) * radius));
    // L'Antartide riempirebbe di puntini tutta la fascia inferiore.
    if (lat < -58 || lat > 80) continue;
    if (polygons.some((rings) => insidePolygon([lon, lat], rings))) {
      nodes.push([lon, lat]);
    }
  }
}

/* Maglia: ogni nodo si collega ai vicini più prossimi. Le distanze sono
   calcolate in 3D (altrimenti vicino al polo la longitudine mente), ma i
   collegamenti troppo lunghi si scartano: sulla mappa piatta diventerebbero
   corde che tagliano il disegno invece di seguirlo. */
const meshEdges = [];
{
  const seen = new Set();
  const xyz = nodes.map(([lon, lat]) => {
    const p = toRad(lat);
    const l = toRad(lon);
    return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
  });
  for (let i = 0; i < nodes.length; i++) {
    const distances = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = xyz[i][0] - xyz[j][0];
      const dy = xyz[i][1] - xyz[j][1];
      const dz = xyz[i][2] - xyz[j][2];
      distances.push([j, dx * dx + dy * dy + dz * dz]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    for (let n = 0; n < NODE_NEIGHBOURS && n < distances.length; n++) {
      const j = distances[n][0];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      const dLon = Math.abs(nodes[i][0] - nodes[j][0]);
      const dLat = Math.abs(nodes[i][1] - nodes[j][1]);
      if (dLon > MAX_EDGE_LON || dLat > MAX_EDGE_LAT) continue;
      seen.add(key);
      meshEdges.push([nodes[i], nodes[j]]);
    }
  }
}

/* Le linee che partono da Messina: non le più vicine (starebbero tutte in
   Sicilia), ma una ogni N in ordine di distanza, così si aprono a ventaglio. */
const messinaLinks = [];
{
  const ranked = nodes
    .map((node) => ({
      node,
      d: (node[0] - MESSINA.lon) ** 2 + (node[1] - MESSINA.lat) ** 2,
    }))
    .sort((a, b) => a.d - b.d);
  const step = Math.max(1, Math.floor(ranked.length / (MESSINA_LINKS * 3)));
  for (let i = 0; i < MESSINA_LINKS && i * step < ranked.length; i++) {
    const meta = ranked[i * step].node;
    const dLon = meta[0] - MESSINA.lon;
    const dLat = meta[1] - MESSINA.lat;
    const lunghezza = Math.hypot(dLon, dLat);
    if (lunghezza <= MESSINA_STACCO * 1.6) continue;
    const t = MESSINA_STACCO / lunghezza;
    const partenza = [MESSINA.lon + dLon * t, MESSINA.lat + dLat * t];
    messinaLinks.push([partenza, meta]);
  }
}

/* ── Taglio in strisce ─────────────────────────────────────────────────── */

/** Confini delle strisce, dal polo nord al polo sud. */
const boundaries = [90];
for (let i = 0; i <= 50; i++) boundaries.push(CAP_LAT - i * BAND_STEP);
boundaries.push(-90);

/** Coordinate del `viewBox`: x = longitudine da sinistra, y = da nord. */
const vx = (lon) => lon + 180;
const vy = (lat) => 90 - lat;
const round = (n) => Math.round(n * 100) / 100;
/** Percentuale con due decimali, senza code di virgola mobile nel JSON. */
const pct = (fraction) => Math.round(fraction * 10000) / 100;

/*
 * Scrittura compatta dei path.
 *
 * Questo testo finisce dentro l'HTML della home, quindi ogni carattere è
 * banda: si scrive in coordinate RELATIVE (`m`/`l`), con un decimale, e senza
 * lo zero iniziale (`.3` invece di `0.3`). Un decimale è un decimo di grado,
 * cioè meno di un pixel alla dimensione massima del globo.
 *
 * L'accortezza importante: ogni spostamento è calcolato dall'ultimo punto
 * EFFETTIVAMENTE SCRITTO (già arrotondato) verso quello esatto. Sommando
 * differenze arrotondate una dopo l'altra, invece, l'errore si accumulerebbe
 * lungo la costa fino a spostarla di parecchi pixel.
 */
const num = (n) => {
  const s = (Math.round(n * 10) / 10).toString();
  return s.startsWith("0.") ? s.slice(1) : s.startsWith("-0.") ? "-" + s.slice(2) : s;
};

/** I pallini: uno spostamento e un tratto di lunghezza zero, che il
 *  `stroke-linecap: round` trasforma in un punto tondo. */
function encodeDots(points) {
  let out = "";
  let cx = 0;
  let cy = 0;
  for (const [x, y] of points) {
    const dx = num(x - cx);
    const dy = num(y - cy);
    out += `m${dx},${dy}h0`;
    cx += Number(dx);
    cy += Number(dy);
  }
  return out;
}

function encodePath(runs) {
  let out = "";
  let cx = 0;
  let cy = 0;
  let first = true;
  for (const run of runs) {
    for (let i = 0; i < run.length; i++) {
      const [x, y] = run[i];
      const dx = num(x - cx);
      const dy = num(y - cy);
      // Il comando si omette quando è uguale al precedente: dopo una `l` i
      // numeri successivi sono già interpretati come altri `l`.
      out += (i === 0 ? (first ? "M" : "m") : i === 1 ? "l" : " ") + dx + "," + dy;
      cx += Number(dx);
      cy += Number(dy);
      first = false;
    }
  }
  return out;
}

/**
 * Taglia una polilinea sulla fascia di latitudine [latLo, latHi] e la scrive
 * come dati di path. I punti di attraversamento sono interpolati, così le
 * coste non si spezzano da una striscia all'altra.
 */
function clipToBand(line, latLo, latHi) {
  const inside = (p) => p[1] >= latLo && p[1] <= latHi;
  const cross = (a, b, lat) => {
    const t = (lat - a[1]) / (b[1] - a[1]);
    return [a[0] + (b[0] - a[0]) * t, lat];
  };
  const runs = [];
  let run = inside(line[0]) ? [line[0]] : [];
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1];
    const b = line[i];
    const aIn = inside(a);
    const bIn = inside(b);
    if (aIn && bIn) {
      run.push(b);
    } else if (aIn && !bIn) {
      run.push(cross(a, b, b[1] > latHi ? latHi : latLo));
      runs.push(run);
      run = [];
    } else if (!aIn && bIn) {
      run = [cross(a, b, a[1] > latHi ? latHi : latLo), b];
    } else if (a[1] > latHi !== b[1] > latHi) {
      // Attraversa la fascia da parte a parte senza avere punti dentro.
      runs.push([cross(a, b, latHi), cross(a, b, latLo)]);
    }
  }
  if (run.length > 1) runs.push(run);
  return runs
    .filter((r) => r.length > 1)
    .map((r) => r.map(([lon, lat]) => [vx(lon), vy(lat)]));
}

const bands = [];
for (let i = 0; i < boundaries.length - 1; i++) {
  const latHi = boundaries[i];
  const latLo = boundaries[i + 1];

  // Posizione a schermo: è QUI che entra la sfera. La latitudine φ non finisce
  // all'altezza φ ma a sin φ — ecco lo schiacciamento verso i poli.
  const top = (1 - Math.sin(toRad(latHi))) / 2;
  const bottom = (1 - Math.sin(toRad(latLo))) / 2;

  // Larghezza del parallelo. Si prende il coseno del bordo PIÙ VICINO
  // all'equatore, non quello centrale: così la striscia sborda appena dal
  // cerchio e viene ritagliata, invece di lasciare uno spiraglio vuoto lungo
  // il profilo del globo.
  const w = Math.cos(toRad(Math.min(Math.abs(latHi), Math.abs(latLo))));

  const coast = encodePath(coastlines.flatMap((l) => clipToBand(l, latLo, latHi)));
  const mesh = encodePath(meshEdges.flatMap((e) => clipToBand(e, latLo, latHi)));
  const links = encodePath(messinaLinks.flatMap((e) => clipToBand(e, latLo, latHi)));
  // I nodi sono tratti di lunghezza zero: con `stroke-linecap: round` il
  // browser li disegna come pallini perfettamente tondi, mentre un `<circle>`
  // diventerebbe un'ellisse schiacciata insieme alla striscia.
  const dots = encodeDots(
    nodes
      .filter(([, lat]) => lat >= latLo && lat < latHi)
      .map(([lon, lat]) => [vx(lon), vy(lat)])
  );

  if (!coast && !mesh && !links && !dots) continue;

  bands.push({
    top: pct(top), // percentuale del disco
    // L'altezza si ricava dai valori GIÀ arrotondati del bordo superiore e di
    // quello inferiore: così una striscia comincia esattamente dove finisce la
    // precedente e non resta la riga chiara di un decimo di pixel in mezzo.
    h: Math.round((pct(bottom) - pct(top)) * 100) / 100,
    w: Math.round(w * 10000) / 10000,
    y: round(vy(latHi)),
    dy: round(vy(latLo) - vy(latHi)),
    coast,
    mesh,
    links,
    dots,
  });
}

/* ── Messina ───────────────────────────────────────────────────────────── */

/*
 * Il puntino non sta dentro le strisce: lì verrebbe stirato insieme alla
 * mappa (e l'etichetta con lui). Sta su un livello suo, che scorre con la
 * stessa animazione. La quota è quella esatta della proiezione — sin φ —
 * mentre la posizione orizzontale segue la longitudine come nelle strisce.
 */
const messina = {
  lon: MESSINA.lon,
  lat: MESSINA.lat,
  /** Quota a schermo, in percentuale del diametro. */
  top: pct((1 - Math.sin(toRad(MESSINA.lat))) / 2),
  /** Compressione orizzontale del parallelo di Messina. */
  w: Math.round(Math.cos(toRad(MESSINA.lat)) * 10000) / 10000,
  /** Posizione nel nastro, in percentuale della sua larghezza. */
  x: pct(vx(MESSINA.lon) / VIEW_W),
};

/*
 * Sfasamento iniziale: l'animazione parte già a metà corsa, con Messina al
 * centro del disco. Chi apre la pagina la trova lì; poi il globo se la porta
 * via e la riporta a ogni giro.
 */
const centred = vx(MESSINA.lon) - LON_WINDOW / 2; // gradi da scorrere
const delayFraction = Math.round((1 - centred / 360) * 10000) / 10000;

const out = {
  generatedBy: "scripts/gen-globo.mjs",
  viewWidth: VIEW_W,
  lonWindow: round(LON_WINDOW),
  /** Larghezza del nastro in percentuale della striscia che lo contiene. */
  stripWidth: pct(VIEW_W / LON_WINDOW),
  /** Quanto scorre il nastro in un giro: 360° sui VIEW_W° totali. */
  spinShift: pct(360 / VIEW_W),
  delayFraction,
  messina,
  bands,
};

mkdirSync(join(ROOT, "src", "data"), { recursive: true });
writeFileSync(join(ROOT, "src", "data", "globo.json"), JSON.stringify(out));

const bytes = JSON.stringify(out).length;
console.log(
  `globo.json: ${bands.length} strisce, ${coastlines.length} coste, ` +
    `${nodes.length} nodi, ${meshEdges.length} collegamenti, ` +
    `${(bytes / 1024).toFixed(1)} kB`
);
