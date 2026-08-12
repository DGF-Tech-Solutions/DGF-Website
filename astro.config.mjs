// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import satteriCallout from "./src/lib/satteri-callout.mjs";

/*
 * DGF Tech Solutions — configurazione Astro.
 *
 * Il sito è puramente statico: `astro build` produce `dist/` con solo
 * HTML/CSS/JS, che GitHub Pages serve così com'è. Nessun server Node.
 *
 * Differenza chiave rispetto al vecchio setup Next: qui NON viene spedito
 * alcun runtime di framework. Le pagine escono come HTML già dipinto; il
 * JavaScript esiste solo dove lo dichiariamo esplicitamente (menu mobile,
 * form, accordion) e pesa qualche kB in tutto.
 */

// Serve SOLO se il sito vive in una sottocartella (GitHub "project page",
// es. https://utente.github.io/DGF-Website/). Con dominio custom resta vuoto.
const base = process.env.PAGES_BASE_PATH || undefined;

export default defineConfig({
  site: "https://dgftechsolutions.com",
  ...(base ? { base } : {}),

  /*
   * Pagine ritirate.
   *
   * /come-lavoriamo è stata eliminata, ma il dominio è pubblico e l'indirizzo
   * può essere già indicizzato o citato altrove. Senza questa riga chi ci
   * arriva trova un 404; con questa arriva in home, dove le quattro fasi ci
   * sono comunque nella sezione del metodo.
   *
   * In build statica Astro genera una paginetta con il rimando: non è un 301
   * lato server, ma è quanto di meglio si possa fare su GitHub Pages.
   */
  redirects: {
    "/come-lavoriamo": "/",
  },

  build: {
    // `directory` → ogni pagina diventa /percorso/index.html: GitHub Pages
    // serve gli URL senza estensione e senza 404.
    format: "directory",
    // Il CSS viaggia dentro l'HTML invece che in un file a parte.
    // Motivo: un foglio di stile esterno blocca il rendering e costa un giro
    // di rete completo prima che il browser possa dipingere qualsiasi cosa.
    // Inlinandolo, la prima risposta contiene già tutto il necessario.
    // Il costo è che il CSS non viene messo in cache fra una pagina e l'altra,
    // ma su un sito vetrina la prima visita è quella che conta.
    inlineStylesheets: "always",
  },
  trailingSlash: "ignore",

  /*
   * Font self-hostati e sottoinsiemi da Astro a build time.
   * Astro genera anche i "fallback metrics" (size-adjust, ascent-override…):
   * il font di sistema mostrato prima del caricamento occupa esattamente lo
   * stesso spazio → CLS pari a zero durante lo swap.
   *
   * Due famiglie soltanto, come vuole la direzione Swiss:
   *  - Inter        → testo e titoli (neo-grottesco, il cavallo di battaglia svizzero)
   *  - JetBrains Mono → etichette, numeri di sezione, dati
   */
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-sans",
      // Font VARIABILE: un solo file copre tutti i pesi da 400 a 700.
      // Con i pesi statici Astro precaricava otto file diversi, che si
      // contendevano la banda proprio mentre il browser doveva dipingere
      // il titolo. Così il preload è uno solo.
      // Fino a 800: i titoli di questa direzione sono grassi, e il peso è
      // uno dei modi in cui si crea gerarchia senza aggiungere colore.
      weights: ["400 800"],
      styles: ["normal"],
      // Solo `latin`: l'italiano (à è é ì ò ù) sta tutto in U+0000-00FF.
      // `latin-ext` serve alle lingue dell'Europa orientale e raddoppierebbe
      // i file per niente.
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: ["400 500"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],

  markdown: {
    /*
     * Le citazioni con marcatore `> [!ATTENZIONE]` diventano riquadri colorati.
     * Sta qui e non in un componente perché il corpo dei contenuti è markdown
     * puro: chi scrive un articolo non deve conoscere altro che il markdown,
     * e il marcatore è la stessa convenzione degli avvisi di GitHub.
     *
     * Si aggancia al processore Sätteri, che in Astro 7 è quello di serie.
     * La strada alternativa (`markdown.rehypePlugins`) obbligherebbe a
     * installare la vecchia catena unified: una dipendenza in più e un build
     * più lento per ottenere esattamente la stessa cosa.
     */
    processor: satteri({ hastPlugins: [satteriCallout()] }),
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Asset piccoli inlinati: meno richieste HTTP al primo caricamento.
      assetsInlineLimit: 2048,
    },
  },

  image: {
    // sharp ottimizza a build time: con l'export statico funziona benissimo
    // (era esattamente ciò che Next NON poteva fare con output: "export").
    responsiveStyles: true,
    layout: "constrained",
  },

  // In Astro 7 il default è 'jsx'; teniamo la compressione HTML-aware, che non
  // mangia gli spazi fra elementi inline.
  compressHTML: true,
});
