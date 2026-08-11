import type { APIRoute } from "astro";
import { SITE } from "@/data/site";

/*
 * Web app manifest: abilita "Aggiungi a schermata Home" e dà coerenza di
 * branding (nome, colori) quando il sito viene installato su mobile.
 */
export const GET: APIRoute = () => {
  const manifest = {
    name: SITE.name,
    short_name: "DGF",
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: SITE.lang,
    background_color: "#ffffff",
    theme_color: SITE.themeColor,
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
};
