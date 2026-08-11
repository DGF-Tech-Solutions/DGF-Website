import type { CollectionEntry } from "astro:content";

type Kind = CollectionEntry<"portfolio">["data"]["kind"];

/**
 * Etichetta che dichiara la natura di un progetto.
 *
 * Sta in un file suo perché la usano la scheda, la pagina del caso e il
 * riepilogo per gli assistenti conversazionali: se la scrivessimo tre volte,
 * prima o poi una delle tre direbbe qualcosa di diverso dalle altre, ed è
 * esattamente il tipo di divergenza che trasforma una precisazione onesta in
 * una mezza bugia.
 *
 * Per il prodotto interno il nome finisce nell'etichetta: "Progetto interno"
 * da solo lascerebbe intendere un esercizio di stile, mentre Nexia Home è
 * software in produzione, semplicemente non commissionato da un cliente.
 */
export function kindLabel(kind: Kind, client: string): string {
  if (kind === "dimostrativo") return "Progetto dimostrativo";
  if (kind === "interno") return `Progetto interno ${client}`;
  return "Progetto per un cliente";
}

/** Versione distesa, per i dati destinati alle macchine. */
export function kindDescription(kind: Kind): string {
  if (kind === "dimostrativo") return "progetto dimostrativo, non un lavoro su commessa";
  if (kind === "interno") return "prodotto interno di DGF, in produzione, non una commessa";
  return "progetto realizzato per un cliente";
}
