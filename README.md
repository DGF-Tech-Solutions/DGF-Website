# DGF Tech Solutions — sito

Sito vetrina di [DGF Tech Solutions](https://dgftechsolutions.com).
**Astro**, export statico, pubblicato su GitHub Pages.

---

## Comandi

```bash
npm install      # una volta
npm run dev      # sviluppo su http://localhost:4321
npm run build    # build statica in ./dist
npm run preview  # anteprima locale della build
npm run check    # controllo dei tipi e dei contenuti
```

Node 20 o successivo (vedi `.nvmrc`).

---

## Come è fatto

| | |
|---|---|
| Framework | Astro — le pagine escono come HTML già dipinto |
| Stile | Tailwind CSS v4 + design system in `src/styles/global.css` |
| Contenuti | Content collections markdown, validate a build time |
| Font | Inter + JetBrains Mono, self-hostati e sottoinsiemi da Astro |
| Immagini | Ottimizzate a build time da sharp (AVIF/WebP, misure multiple) |
| Redazione | Sveltia CMS su `/admin` |
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

**Blog e progetti** → dal pannello su `/admin`, oppure modificando i file in
`src/content/`. Sono la stessa cosa: vedi
[docs/PANNELLO-REDAZIONE.md](docs/PANNELLO-REDAZIONE.md).

**Testi delle pagine fisse** → nei rispettivi file `.astro` in `src/pages/`.

**Contatti, P.IVA, voci di menu** → `src/data/site.ts`. Cambiati lì si
aggiornano ovunque: header, footer, meta tag, dati strutturati.

**I cinque servizi** → `src/data/services.ts`.

---

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

---

## Deploy

Ogni push su `main` fa partire
[.github/workflows/deploy.yml](.github/workflows/deploy.yml): build, verifica
dell'artefatto, pubblicazione su GitHub Pages. Circa un minuto.

Il workflow si interrompe se mancano `CNAME`, `.nojekyll`, `index.html`,
`404.html`, la sitemap o il pannello: meglio non pubblicare che pubblicare un
sito rotto.

Salvare un articolo dal pannello è un commit su `main`, quindi fa partire lo
stesso processo.

---

## Documentazione

- [Pannello di redazione](docs/PANNELLO-REDAZIONE.md) — come scrivere e come creare il token
- [Design system](docs/DESIGN-SYSTEM.md) — token, tipografia, componenti
- [Architettura](docs/ARCHITETTURA.md) — scelte tecniche e perché
