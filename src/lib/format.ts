/** Utilità di formattazione condivise. Tutto in italiano, tutto a build time. */

const DATE_FMT = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "12 maggio 2026" */
export function formatDate(date: Date): string {
  return DATE_FMT.format(date);
}

/** "2026-05-12" — per l'attributo datetime e i dati strutturati. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Indice di sezione a tre cifre: 1 → "001". */
export function idx(n: number): string {
  return String(n).padStart(3, "0");
}

/**
 * Stima dei minuti di lettura quando il campo non è indicato nel frontmatter.
 * 200 parole al minuto è la media comunemente usata per la prosa italiana.
 */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
