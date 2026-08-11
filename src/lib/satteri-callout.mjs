/**
 * Trasforma una citazione markdown in un riquadro colorato.
 *
 * Chi scrive dal pannello /admin non deve imparare nessun componente: scrive
 * una citazione normale e mette un marcatore sulla prima riga.
 *
 *     > [!ATTENZIONE]
 *     > Usare la tabella sbagliata è la causa numero uno delle contestazioni.
 *
 * diventa un riquadro ambra con icona e titolo "Attenzione". È la stessa
 * convenzione degli avvisi di GitHub, quindi è già nelle mani di chiunque
 * abbia scritto un README. Senza marcatore la citazione resta una citazione.
 *
 * Perché un plugin e non un componente: il corpo dei contenuti è markdown
 * puro, non MDX. Passare a MDX significherebbe che il pannello salva un
 * formato che sa modificare solo a metà, e a rimetterci sarebbe chi scrive.
 *
 * È un plugin hast di Sätteri, il processore markdown di Astro 7: si aggancia
 * a `markdown.processor` e non richiede di installare la vecchia catena
 * unified, che sarebbe una dipendenza in più e un build più lento.
 */

/** Marcatori riconosciuti, con etichetta mostrata e icona. */
const KINDS = {
  NOTA: { tone: "note", label: "Nota", icon: "info" },
  ATTENZIONE: { tone: "warn", label: "Attenzione", icon: "warn" },
  "BUONA PRATICA": { tone: "good", label: "Buona pratica", icon: "bulb" },
};

/* Tracciati Lucide, coerenti con le altre icone del sito. Sono descritti come
   dati e non come stringhe HTML: così restano nodi veri dell'albero, senza
   dipendere da come il processore tratta l'HTML grezzo. */
const ICONS = {
  info: [
    ["circle", { cx: 12, cy: 12, r: 10 }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }],
  ],
  warn: [
    ["path", { d: "m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" }],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }],
  ],
  bulb: [
    ["path", { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }],
    ["path", { d: "M9 18h6" }],
    ["path", { d: "M10 22h4" }],
  ],
};

function el(tagName, properties, children = []) {
  return { type: "element", tagName, properties, children };
}

function iconNode(name) {
  return el(
    "svg",
    {
      className: ["callout-icon"],
      width: 18,
      height: 18,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      /* In kebab-case perché il processore lascia passare questi due nomi
         così come sono, senza convertirli: scritti in camelCase finirebbero
         nell'HTML come `strokeLinecap`, che il browser ignora. */
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      ariaHidden: "true",
    },
    ICONS[name].map(([tag, props]) => el(tag, props)),
  );
}

/**
 * Copia il sottoalbero togliendo il marcatore dal primo testo utile.
 * `state.done` fa sì che venga tolto una volta sola: il marcatore sta
 * all'inizio, e una seconda occorrenza più avanti sarebbe testo dell'autore.
 */
function stripMarker(node, state) {
  if (node.type === "text") {
    if (!state.done && node.value.trim()) {
      state.done = true;
      return { ...node, value: node.value.replace(state.marker, "") };
    }
    return node;
  }
  if (!node.children) return node;
  return { ...node, children: node.children.map((c) => stripMarker(c, state)) };
}

/** Primo testo non vuoto: è lì che sta il marcatore, se c'è. */
function firstText(node) {
  if (node.type === "text") return node.value.trim() ? node : null;
  for (const child of node.children ?? []) {
    const found = firstText(child);
    if (found) return found;
  }
  return null;
}

/** Un paragrafo diventa vuoto se conteneva solo il marcatore. */
function isEmptyParagraph(node) {
  return node.type === "element" && node.tagName === "p" && firstText(node) === null;
}

export default function satteriCallout() {
  return {
    name: "dgf-callout",
    element: {
      filter: ["blockquote"],
      visit(node) {
        const text = firstText(node);
        if (!text) return;

        const match = text.value.match(/^\s*\[!([A-ZÀ-Ù ]+)\]\s*/);
        if (!match) return;

        const kind = KINDS[match[1].trim().toUpperCase()];
        if (!kind) return;

        const state = { marker: match[0], done: false };
        const children = node.children
          .map((child) => stripMarker(child, state))
          .filter((child) => !isEmptyParagraph(child));

        return el("aside", { className: ["callout", `callout-${kind.tone}`] }, [
          el("p", { className: ["callout-label"] }, [
            iconNode(kind.icon),
            { type: "text", value: kind.label },
          ]),
          ...children,
        ]);
      },
    },
  };
}
