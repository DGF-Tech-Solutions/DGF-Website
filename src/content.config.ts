import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// In Astro 7 il `z` riesportato da "astro:content" è deprecato:
// zod va importato direttamente.
import { z } from "zod";

/**
 * Content collections: blog e portfolio.
 *
 * I contenuti vivono come file markdown in src/content/. Due conseguenze
 * importanti:
 *  - lo schema qui sotto è validato a BUILD TIME: se un articolo ha un campo
 *    sbagliato o mancante, la build fallisce invece di pubblicare una pagina
 *    rotta;
 *  - si scrivono da VS Code o direttamente dall'editor di GitHub: sono
 *    normalissimi file markdown, il commit fa partire il deploy.
 */

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      excerpt: z.string().max(320),
      date: z.coerce.date(),
      category: z.string(),
      author: z.string().default("DGF Tech Solutions"),
      /** Minuti di lettura. Se assente lo stimiamo dal testo. */
      readingTime: z.number().int().positive().optional(),
      /**
       * Fotografia della testata, tagliata sul bordo destro della fascia blu
       * come nelle altre pagine interne. Facoltativa: un articolo che non la
       * dichiara riceve comunque quella generica del blog, così la testata
       * non cambia forma da un pezzo all'altro.
       */
      cover: image().optional(),
      /**
       * Descrizione della fotografia. Se manca, l'immagine resta decorativa e
       * viene tolta dalla lettura assistita: meglio muta che descritta male.
       */
      coverAlt: z.string().default(""),
      /**
       * Le fotografie del sito sono generate con IA e vanno dichiarate
       * (art. 50 AI Act). Sta a `true` di default perché è il caso normale
       * qui: chi pubblica uno scatto reale lo mette a `false`.
       */
      coverAi: z.boolean().default(true),
      /** Nasconde l'articolo dal sito senza cancellarlo. */
      draft: z.boolean().default(false),
    }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      client: z.string(),
      title: z.string().max(140),
      summary: z.string().max(320),
      category: z.string(),
      year: z.string(),
      /**
       * Etichetta di natura del progetto. Va dichiarata sempre: presentare
       * un concept come lavoro su commessa è una bugia che si paga cara.
       *
       * `interno` è il prodotto costruito da noi per noi: è software vero e
       * in produzione, ma non è stato commissionato da un cliente, e
       * confonderlo con una commessa gonfierebbe il curriculum.
       */
      kind: z.enum(["dimostrativo", "cliente", "interno"]).default("dimostrativo"),
      cover: image(),
      coverFull: image().optional(),
      /** Indirizzo pubblico del progetto, se è online e visitabile. */
      liveUrl: z.string().url().optional(),
      /** Testo del pulsante che porta al sito. */
      liveLabel: z.string().optional(),
      services: z.array(z.string()).min(1),
      stack: z.array(z.string()).min(1),
      metrics: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .max(4)
        .default([]),
      challenge: z.string(),
      approach: z.array(z.string()).min(1),
      solution: z.string(),
      /**
       * Domande frequenti sul progetto. Facoltative: se mancano, la sezione
       * non compare invece di restare vuota.
       */
      faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      featured: z.boolean().default(false),
      order: z.number().int().default(99),
    }),
});

export const collections = { blog, portfolio };
