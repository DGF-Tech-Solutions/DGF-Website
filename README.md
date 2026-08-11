# DGF Tech Solutions — sito

Sito vetrina di [DGF Tech Solutions](https://dgftechsolutions.com).
**Astro**, export statico, pubblicato su GitHub Pages.

---

## Comandi

### Mentre lavori

```bash
npm install      # una volta
npm run dev      # http://localhost:4321
npm run build    # build statica in ./dist
npm run check    # controllo dei tipi e dei contenuti
```

Node 22 (vedi `.nvmrc`).

### Prima di pubblicare — anteprima fedele

```bash
docker compose up --build    # http://localhost:8080
```

Compila il sito e lo serve con nginx configurato come GitHub Pages. **Non è
la stessa cosa di `npm run dev`**: mostra comportamenti che il dev server
nasconde —

- indirizzi risolti come su Pages, anche senza barra finale
- risposte compresse con gzip
- pagina 404 del sito, non quella di nginx
- immagini realmente ottimizzate dalla build

Per verificare che la build passerà su GitHub Actions, prima del push:

```bash
docker run --rm -v "${PWD}:/src:ro" node:22-bookworm-slim sh /src/scripts/ci-check.sh
```

---

## Come è fatto

| | |
|---|---|
| Framework | Astro — le pagine escono come HTML già dipinto |
| Stile | Tailwind CSS v4 + design system in `src/styles/global.css` |
| Contenuti | Content collections markdown, validate a build time |
| Font | Inter + JetBrains Mono, self-hostati e sottoinsiemi da Astro |
| Immagini | Ottimizzate a build time da sharp (AVIF/WebP, misure multiple) |
| Redazione | File markdown, modificabili da VS Code o dall'editor di GitHub |
| Hosting | GitHub Pages, dominio custom, deploy via GitHub Actions |

**JavaScript spedito al browser: 0 kB su tutte le pagine tranne `/contatti`,
che ne usa 2,5 kB per il modulo.** Non è un vezzo: è la ragione per cui il sito
tiene 100/100/100/100 su Lighthouse anche su mobile.

---

## Struttura

```
src/
├── assets/          immagini processate da Astro (mockup, logo, upload)
├── components/      componenti .astro riusabili
├── content/         CONTENUTI EDITORIALI (markdown)
│   ├── blog/            un file = un articolo
│   └── portfolio/       un file = un progetto
├── content.config.ts    schema dei contenuti, validato a build time
├── data/
│   ├── site.ts          identità, contatti, navigazione — fonte unica
│   └── services.ts      i cinque servizi
├── layouts/         Base (SEO + shell), Legal
├── lib/             utilità di formattazione
├── pages/           LE ROTTE (le cartelle diventano URL)
└── styles/          design system
```

### Mappa delle rotte

```
/                                    home
/servizi                             hub
/servizi/[slug]                      5 pagine servizio
/portfolio                           hub
/portfolio/[slug]                    dettaglio progetto
/chi-siamo
/blog                                hub
/blog/[slug]                         articolo
/contatti
/contatti/inviato                    conferma (solo senza JS)
/privacy  /cookie  /termini
/404  /robots.txt  /llms.txt  /sitemap-index.xml  /manifest.webmanifest
```

---

## Modificare i contenuti

**Blog e progetti** → i file markdown in `src/content/blog/` e
`src/content/portfolio/`. Si modificano da VS Code oppure direttamente
dall'editor di GitHub: il commit su `main` fa partire il deploy.

**Testi delle pagine fisse** → nei rispettivi file `.astro` in `src/pages/`.

**Contatti, P.IVA, voci di menu** → `src/data/site.ts`. Cambiati lì si
aggiornano ovunque: header, footer, meta tag, dati strutturati.

**I cinque servizi** → `src/data/services.ts`.

---

## Illustrazioni

Vivono in `src/assets/illustrazioni/` e si generano con ComfyUI:

```bash
python scripts/gen-illustrazioni.py            # tutte quelle mancanti
python scripts/gen-illustrazioni.py --set scena
python scripts/gen-illustrazioni.py --force    # rigenera anche le esistenti
```

**Attenzione**: sono import statici. Se un file manca, la pagina che lo usa
**non compila** — non è che si vede un'immagine rotta, è che il sito non parte.
Genera prima le immagini, poi apri il sito.

Se una non convince, cambia il suo `seed` in `scripts/gen-illustrazioni.py` e
rigenera solo quella: `python scripts/gen-illustrazioni.py scena-ai --force`.

## Regole da non rompere

Sono le scelte che tengono il sito veloce. Se le si perde, si perdono i punteggi.

1. **Niente librerie JavaScript lato client** senza una ragione misurata.
   Menu, accordion e tab si fanno con `<details>`, che il browser già sa fare.
2. **L'elemento LCP non si anima in opacità.** Il titolo dell'hero usa solo
   `transform` (`.anim-rise`): un `opacity: 0` iniziale sposterebbe l'LCP di
   tutta la durata dell'animazione.
3. **`loading="eager"` solo sopra la piega.** Un'immagine eager più in basso
   ruba banda al primo caricamento senza che nessuno la veda.
4. **Immagini in `src/assets/`, non in `public/`.** Solo così Astro le
   ottimizza. In `public/` finiscono solo i file che devono avere un indirizzo
   stabile (og-image, favicon, CNAME).
5. **Contrasto minimo 4,5:1 sul testo.** Il cyan del brand a 11px non lo
   raggiunge: per il testo piccolo si usa il blu.
6. **Il `package-lock.json` va rigenerato su Linux, mai su Windows.**
   Un lock generato su Windows contiene solo i binari nativi Windows di
   `sharp` e del bundler, e `npm ci` su Linux — cioè su GitHub Actions e nel
   container — fallisce con *"Missing: … from lock file"*. Quando cambi le
   dipendenze:

   ```bash
   docker run --rm -v "${PWD}:/app" -w /app node:22-bookworm-slim sh scripts/regen-lock.sh
   ```

   Lo script stampa i binari inclusi: devono comparire sia `linux-x64` sia
   `win32-x64`.

---

## Deploy

Ogni push su `main` fa partire
[.github/workflows/deploy.yml](.github/workflows/deploy.yml): build, verifica
dell'artefatto, pubblicazione su GitHub Pages. Circa un minuto.

Il workflow si interrompe se mancano `CNAME`, `.nojekyll`, `index.html`,
`404.html` o la sitemap: meglio non pubblicare che pubblicare un sito rotto.

Anche modificare un file dall'editor di GitHub è un commit su `main`, quindi
fa partire lo stesso processo.

---

## Documentazione

- [Design system](docs/DESIGN-SYSTEM.md) — token, tipografia, componenti
- [Architettura](docs/ARCHITETTURA.md) — scelte tecniche e perché
