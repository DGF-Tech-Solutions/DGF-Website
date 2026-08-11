import type { APIRoute } from "astro";
import { SITE } from "@/data/site";

/*
 * robots.txt generato a build time.
 *
 * Scelta di fondo: tutti i crawler, compresi quelli delle AI (GPTBot,
 * ClaudeBot, PerplexityBot, Google-Extended per AI Overview, Bingbot per
 * Copilot) possono leggere e CITARE il sito. Per un'azienda che vive di
 * reputazione tecnica, essere citati dagli assistenti è visibilità, non furto.
 *
 * Bloccato solo Bytespider: scraper aggressivo che consuma banda senza
 * restituire alcuna visibilità.
 *
 * Il pannello CMS è escluso: non ha senso indicizzare una schermata di login.
 */
export const GET: APIRoute = () => {
  const body = `# ${SITE.name}
User-agent: *
Allow: /
Disallow: /admin

User-agent: Bytespider
Disallow: /

Sitemap: ${SITE.url}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
