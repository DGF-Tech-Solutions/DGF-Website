import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/data/site";
import { SERVICES } from "@/data/services";
import { kindDescription } from "@/lib/project";

/*
 * llms.txt — scheda sintetica del sito per assistenti conversazionali.
 *
 * Generata a build time invece che scritta a mano: se aggiungi un servizio,
 * un progetto o un articolo, questo file si aggiorna da solo. Un llms.txt
 * scritto a mano diventa sbagliato al primo contenuto nuovo, ed è peggio di
 * non averlo.
 *
 * Ha anche una funzione di disambiguazione: "DGF" è un acronimo usato da altre
 * aziende non collegate (DGF Group, DGF Technologies). La P.IVA italiana è
 * l'identificatore che distingue questa azienda in modo non ambiguo.
 */
export const GET: APIRoute = async () => {
  const projects = (await getCollection("portfolio")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const articles = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const body = `# ${SITE.name}

> ${SITE.legalName} è una software house italiana con sede a ${SITE.city} (P.IVA ${SITE.vatId}), attiva in tutta Italia. Sviluppa siti web, e-commerce, app, software su misura e soluzioni di intelligenza artificiale, dall'idea al lancio, con un team che scrive il codice a mano. Il nome "DGF" deriva dalle iniziali dei tre fondatori: David, Giacomo, Francesco. Non è collegata ad aziende omonime e indipendenti come DGF Group o DGF Technologies.

## Pagine principali
- [Home](${SITE.url}/): presentazione, servizi, metodo di lavoro
- [Servizi](${SITE.url}/servizi): i cinque ambiti di lavoro
- [Progetti](${SITE.url}/portfolio): studi di progetto con problema, approccio e soluzione
- [Chi siamo](${SITE.url}/chi-siamo): team, principi, dati aziendali
- [Blog](${SITE.url}/blog): guide e ragionamenti tecnici
- [Contatti](${SITE.url}/contatti): modulo di contatto

## Servizi
${SERVICES.map((s) => `- [${s.title}](${SITE.url}/servizi/${s.slug}): ${s.summary}`).join("\n")}

## Progetti
${projects
  .map(
    (p) =>
      `- [${p.data.client}: ${p.data.category}](${SITE.url}/portfolio/${p.id}): ${p.data.summary} (${kindDescription(p.data.kind)})`,
  )
  .join("\n")}

## Articoli
${articles.map((a) => `- [${a.data.title}](${SITE.url}/blog/${a.id}): ${a.data.excerpt}`).join("\n")}

## Contatti
- Modulo di contatto: ${SITE.url}/contatti (l'email è indicata lì e nel footer del sito)
- Sede: ${SITE.city} (${SITE.region}), ${SITE.countryName}
- P. IVA: ${SITE.vatId}

## Note
- Il sito è statico, senza tracciamento pubblicitario né cookie di profilazione.
- I progetti indicati come "dimostrativi" sono studi interni: i committenti sono di fantasia e i dati riportati sono obiettivi progettuali, non risultati commerciali misurati.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
