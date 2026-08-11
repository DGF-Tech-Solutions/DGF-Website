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
 *  - sono gli stessi file che il pannello Sveltia CMS legge e scrive, quindi
 *    scrivere dall'editor o da VS Code è esattamente la stessa cosa.
 */

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().max(120),
    excerpt: z.string().max(320),
    date: z.coerce.date(),
    category: z.string(),
    author: z.string().default("DGF Tech Solutions"),
    /** Minuti di lettura. Se assente lo stimiamo dal testo. */
    readingTime: z.number().int().positive().optional(),
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
      services: z.array(z.string()).min(1),
      stack: z.array(z.string()).min(1),
      metrics: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .max(4)
        .default([]),
      challenge: z.string(),
      approach: z.array(z.string()).min(1),
      solution: z.string(),
      featured: z.boolean().default(false),
      order: z.number().int().default(99),
    }),
});

export const collections = { blog, portfolio };
