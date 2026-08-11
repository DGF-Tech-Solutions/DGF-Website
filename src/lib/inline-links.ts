/**
 * Link dentro alle risposte delle FAQ.
 *
 * Le risposte sono testo semplice: stanno nel frontmatter di src/content e in
 * src/data/services.ts, e non passano da Markdown. Per renderle cliccabili
 * serviva un modo di scrivere un link che non obbligasse a mettere HTML nei
 * contenuti: se il testo finisse in pagina con set:html, un giorno un tag
 * qualsiasi copiato da fuori diventerebbe codice eseguito.
 *
 * Quindi: sintassi Markdown, `[etichetta](url)`, e qui la si spezza in pezzi.
 * Il componente stampa i pezzi come nodi normali, con Astro che continua a
 * fare l'escape del testo. Nessuna stringa di HTML attraversa il confine.
 */

export interface TextPart {
  /** Il testo da mostrare. */
  text: string;
  /** Presente solo quando la porzione è un link valido. */
  href?: string;
  /** Vero quando il link porta fuori dal sito: va aperto in una scheda nuova. */
  external?: boolean;
}

/** `[etichetta](url)` — niente parentesi né spazi dentro all'url. */
const LINK_RE = /\[([^\]\n]+)\]\(([^()\s]+)\)/g;

/**
 * Destinazioni ammesse. Tutto il resto — a partire da `javascript:` — resta
 * testo: un contenuto non deve poter creare un link che esegue qualcosa.
 */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;

const isExternal = (href: string) => /^https?:/i.test(href);

/** Spezza il testo in porzioni normali e porzioni-link, nell'ordine originale. */
export function parseInlineLinks(source: string): TextPart[] {
  const parts: TextPart[] = [];
  let cursor = 0;

  for (const match of source.matchAll(LINK_RE)) {
    const [raw, label, href] = match;
    const at = match.index ?? 0;

    // Url non ammesso: si lascia stare tutto, markup compreso. Chi scrive vede
    // le parentesi rimaste in pagina e capisce subito che c'è da correggere.
    if (!SAFE_HREF.test(href)) continue;

    if (at > cursor) parts.push({ text: source.slice(cursor, at) });
    parts.push({ text: label, href, external: isExternal(href) });
    cursor = at + raw.length;
  }

  if (cursor < source.length) parts.push({ text: source.slice(cursor) });
  return parts;
}

/**
 * La stessa risposta senza il markup: serve ai dati strutturati e ai meta,
 * dove Google si aspetta la frase così come la legge una persona.
 */
export function stripInlineLinks(source: string): string {
  return source.replace(LINK_RE, (raw, label: string, href: string) =>
    SAFE_HREF.test(href) ? label : raw,
  );
}
