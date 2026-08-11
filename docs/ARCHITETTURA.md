# Architettura — scelte tecniche e perché

Documento di riferimento per chi mette mano al sito. Ogni scelta qui dentro ha
una ragione misurata: se la si cambia, si cambia anche un numero.

---

## Il problema di partenza

Il sito precedente era in Next.js 15 con export statico. Funzionava, ma:

| Sintomo | Causa |
|---|---|
| Punteggio Performance basso su mobile | 214 kB di JavaScript al primo caricamento |
| LCP oltre 4 secondi | Un'intro a canvas copriva la pagina per 4,2 s |
| CPU costantemente occupata | Un globo disegnato su canvas, ridisegnato a ogni frame |
| Crash occasionali del browser | 4 video autoplay (6,1 MB) + 2 canvas + listener di scroll |
| Immagini pesanti | `output: "export"` **disabilita** l'ottimizzatore di Next |

L'architettura informativa era buona. Il problema era il costo a runtime.

---

## Perché Astro

Next.js, anche con `output: "export"`, produce HTML che è **React addormentato**:
il browser deve comunque scaricare il runtime (~90 kB), leggere il payload RSC,
ricostruire l'albero dei componenti e riagganciarlo all'HTML già dipinto.
Succede anche su una pagina senza un solo `"use client"`.

Su mobile Lighthouse simula una CPU quattro volte più lenta. Quei 90 kB
diventano 400–700 ms di thread principale bloccato, contro un budget TBT di
circa 200 ms. Si parte oltre budget prima di scrivere una riga.

Astro esegue i componenti **a build time** e non spedisce nessun runtime. Il
JavaScript esiste solo dove lo si dichiara.

**Risultato: 0 kB di JavaScript su tutte le pagine tranne `/contatti` (2,5 kB).**

---

## Sostituzioni degli effetti

### L'intro

| Prima | Adesso |
|---|---|
| Canvas a schermo intero, 4,2 s, ~600 righe di TypeScript | Animazioni CSS, ~1,2 s, 0 kB |
| Copriva il contenuto → LCP dopo la fine dell'intro | Il contenuto è dipinto subito, si animano solo gli elementi di struttura |

Il principio: **non si copre mai il contenuto**. I filetti si disegnano, le
etichette entrano, il titolo sale — ma il titolo è visibile dal primo frame.

### Il globo

| Prima | Adesso |
|---|---|
| `d3-geo` + `topojson-client` + `world-atlas/land-110m.json` | 11 `<div>` con un bordo |
| ~110 kB di JSON nel bundle | 0 kB |
| Canvas ridisegnato a ogni frame → CPU costante | Una sola animazione `transform`, gestita dalla GPU |

I meridiani e i paralleli sono posizionati nello spazio 3D dal browser
(`transform-style: preserve-3d`). La geometria è quella della sfera: per la
latitudine φ il cerchio ha raggio `cos(φ)` e quota `sin(φ)`.

Il reticolo è anche più coerente con la direzione Swiss dei continenti pieni:
è un disegno tecnico.

### I video

Rimossi. Erano 6,1 MB e quattro decoder video attivi contemporaneamente: la
causa più probabile dei crash su Safari iOS, dove la pressione di memoria fa
terminare la scheda.

---

## Le decisioni che tengono i punteggi

### 1. L'elemento LCP non si anima in opacità

Il titolo dell'hero usa `.anim-rise`, che anima **solo `transform`**.

Se partisse da `opacity: 0`, il browser registrerebbe come "dipinto" solo il
fotogramma finale, e l'LCP slitterebbe di tutta la durata dell'animazione.
Gli elementi decorativi possono invece usare `.anim-fade-rise` senza problemi:
non sono candidati LCP.

### 2. CSS inlinato

`build.inlineStylesheets: "always"`. Un foglio di stile esterno blocca il
rendering e costa un giro di rete completo prima di poter dipingere.

Costo: il CSS non è condiviso in cache fra le pagine. Su un sito vetrina, dove
la prima visita è quella che conta, il baratto conviene.

### 3. Font variabile, solo subset latino

Con i pesi statici Astro precaricava **otto file** (~200 kB) che si contendevano
la banda proprio mentre il browser doveva dipingere il titolo.

Un font variabile copre tutti i pesi in un file solo. E `latin-ext` serve alle
lingue dell'Europa orientale: l'italiano (à è é ì ò ù) sta tutto in `latin`.

**12 file / 291 kB → 2 file / 87 kB. Preload: da 8 a 1.**

I "fallback metrics" generati da Astro (`size-adjust`, `ascent-override`…) fanno
sì che il font di sistema mostrato prima del caricamento occupi esattamente lo
stesso spazio: **CLS pari a 0** durante lo scambio.

### 4. Palette di Tailwind spenta

`--color-*: initial` in `@theme`. Tailwind emette in `:root` l'intera palette di
default (red, lime, fuchsia…) che qui non si usa mai, perché si lavora con i
token del brand. Sono ~10 kB di CSS in meno.

### 5. `loading="eager"` solo sopra la piega

Un'immagine `eager` a 4579 px dall'alto stava scaricando 33 kB sul percorso
critico senza che nessuno la vedesse. Rimosso: è bastato a portare la
Performance da 99 a 100.

### 6. Contrasto: il cyan non va sul testo piccolo

`#3d9cc7` su bianco a 11px dà **3,09:1**, sotto la soglia AA di 4,5:1.
Per il testo si usa `#1575a4` (5,11:1). Il cyan resta per il fondo scuro e per
gli elementi non testuali.

Anche `--color-ink-3` è stato scurito da `#64768a` a `#5f7183`: il primo dava
4,42:1 sul fondo chiaro, appena sotto soglia.

### 7. Interattività senza JavaScript

- **Menu mobile** → `<details>`/`<summary>`. Apertura, chiusura, tastiera e
  semantica ARIA sono native. E poiché il sito è multipagina vero, cliccando
  una voce si naviga e il menu si chiude da solo.
- **Accordion FAQ** → stesso meccanismo.
- **Rivelazione allo scroll** → `animation-timeline: view()`, nativa. Dove non
  è supportata, il blocco `@supports` non si applica e il contenuto resta
  semplicemente visibile. Nessun IntersectionObserver, nessun fallback.

### 8. hCaptcha caricato solo all'uso

Lo script di hCaptcha è pesante e di terze parti. Viene iniettato al **primo
tocco su un campo del modulo**, non al caricamento della pagina: chi il modulo
non lo compilerà mai non ne paga il costo.

### 9. Il modulo funziona anche senza JavaScript

È un normale `<form method="POST">` verso Web3Forms, che reindirizza a
`/contatti/inviato`. Il JavaScript si limita a intercettare l'invio per mostrare
la conferma in linea. Se lo script non parte, il modulo funziona lo stesso.

---

## Illustrazioni

Generate in locale con **ComfyUI** (Z-Image Turbo + Qwen CLIP), la stessa
pipeline con cui sono stati creati gli "omini" del sito Nexia — così i due
siti parlano la stessa lingua visiva.

```bash
python scripts/gen-illustrazioni.py --set scena
python scripts/ritaglia.py                     # ritaglio dello sfondo
```

### Soggetti: scene, non persone

La prima serie erano figure di professionisti in stile corporate-memphis.
Sostituite da oggetti e scene. Il motivo non è estetico: persone generate
dall'AI su un sito aziendale vengono lette dal visitatore come il team o come
clienti, ed è una bugia più difficile da smentire di un progetto finto.

### Il ritaglio dello sfondo

`rembg`, usato dalla skill, è addestrato su **fotografie**: su un'illustrazione
piatta segmenta male e lascia un alone. Sull'immagine del monitor l'alone era
un'ombra grigio-azzurra su tutto il perimetro, inutilizzabile.

`scripts/ritaglia.py` la sostituisce con un **riempimento a partire dai bordi**:
si parte dai pixel del perimetro e ci si espande finché il colore cambia poco
da un pixel al successivo. Due proprietà che servono entrambe:

- **segue le sfumature**, perché il confronto è col pixel vicino e non con un
  colore di riferimento fisso;
- **non tocca i bianchi interni** (lo schermo di un monitor, un foglio), perché
  non sono collegati al bordo. È esattamente il caso in cui il `white_key`
  della skill bucava l'illustrazione.

La tolleranza (`TOLL = 10`) ha un margine stretto: a 20 il riempimento saltava
dentro gli elementi chiari e si mangiava una scheda accanto al monitor. Se una
nuova immagine mostra un alone, conviene ritoccare il prompt invece di alzare
quel numero.

Gli originali restano su ComfyUI: `ritaglia.py` li ripesca dalla cronologia
associandoli al soggetto, quindi si può riprocessare tutto senza rigenerare.

### Soggetti che non funzionano

Servono forme con **massa**. Il primo tentativo per l'AI era "rete di nodi
collegati da linee sottili": le linee erano troppo fini, il ritaglio se le è
mangiate e in pagina è rimasto un cerchio blu solo. Sostituito con un chip
dai contorni spessi.

## Il mega-menu

La prima versione era CSS puro (`:hover` sul contenitore) e aveva un difetto
che si vedeva subito: fra la voce e il pannello c'è uno stacco visivo, e
attraversandolo col mouse il `:hover` si perdeva — il pannello si chiudeva
mentre ci si stava andando.

La soluzione è quella di Nexia: **chiusura ritardata di 160 ms**, che copre il
tragitto, più i gestori del mouse anche sul pannello (che, essendo in
posizione assoluta, esce dal flusso del genitore). In più qui il varco è
coperto da un ponte invisibile, così nella maggior parte dei casi il ritardo
non serve nemmeno.

Resta usabile senza JavaScript: `:focus-within` apre il pannello da tastiera,
e la voce "Servizi" è comunque un link alla pagina indice.

## Contenuti

`src/content.config.ts` definisce lo schema con Zod. Due conseguenze:

1. **Validazione a build time.** Un articolo con un campo mancante fa fallire
   la build, invece di pubblicare una pagina rotta.
2. **Stessi file per il pannello.** Sveltia CMS legge e scrive esattamente
   quei markdown: scrivere dall'editor o da VS Code è la stessa cosa.

Il campo `kind` (`dimostrativo` / `cliente`) governa come la pagina presenta i
numeri: **obiettivi di progetto** oppure **risultati**. Non è un dettaglio
cosmetico, è una questione di correttezza.

---

## SEO

- `metadata` per pagina con canonical, Open Graph e Twitter Card
- JSON-LD a grafo: `Organization` + `WebSite` globali, più lo schema specifico
  della pagina (`Service`, `CreativeWork`, `BlogPosting`, `FAQPage`,
  `BreadcrumbList`)
- La P.IVA nell'`Organization` è l'identificatore che distingue l'azienda dalle
  omonime estere (DGF Group, DGF Technologies)
- `sitemap-index.xml` generato, con `/admin` escluso
- `llms.txt` **generato a build time** dai contenuti reali: un file scritto a
  mano diventa sbagliato al primo contenuto nuovo

---

## Risultati misurati

Lighthouse su build di produzione servita con gzip.

| | Prima (Next) | Adesso (Astro) |
|---|---|---|
| JavaScript, home | 214 kB | **0 kB** |
| Asset video | 6,1 MB | **0** |
| Font | 12 file / 291 kB | **2 file / 87 kB** |
| Byte totali, home | — | **108 kB** |
| TBT | — | **0 ms** |
| CLS | — | **0** |
