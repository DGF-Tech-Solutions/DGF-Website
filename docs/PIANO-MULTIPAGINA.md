# Architettura informativa

Come è organizzato il sito e perché. Per le scelte tecniche vedi
[ARCHITETTURA.md](ARCHITETTURA.md); per il linguaggio visivo
[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

---

## Il principio: due livelli, mai di più

```
/                          home breve — presenta e smista
│
├── /servizi               hub
│   ├── /servizi/siti-web
│   ├── /servizi/ecommerce
│   ├── /servizi/app
│   ├── /servizi/software-su-misura
│   └── /servizi/intelligenza-artificiale
│
├── /portfolio             hub
│   └── /portfolio/[slug]  dettaglio progetto
│
├── /chi-siamo
│
├── /blog                  hub
│   └── /blog/[slug]       articolo
│
├── /contatti
│   └── /contatti/inviato  conferma (raggiunta solo senza JavaScript)
│
└── /privacy  /cookie  /termini
```

Nessuna pagina è a più di due click dalla home. Ogni hub elenca i suoi figli,
ogni figlio rimanda all'hub e ai fratelli.

---

## Da one-page a multipagina: cosa è cambiato

Prima la home conteneva nove sezioni e tutto il contenuto del sito. Adesso è
**una vetrina breve**: presenta, dà le prove, e smista.

| Sezione | Prima | Adesso |
|---|---|---|
| Servizi | Sezione della home | 5 pagine + hub |
| Processo | Sezione della home | Quattro fasi in home, dettagli nelle pagine servizio |
| Portfolio | Sezione della home | Hub + dettaglio |
| Garanzie | Sezione della home | "Impegni" in home, fascia scura |
| Contatti | Sezione della home | Pagina dedicata |
| Legali | Assenti | Tre pagine |

### Perché conviene

**SEO.** Una pagina che parla solo di e-commerce compete per "sviluppo
e-commerce" molto meglio di una sezione dentro una home che parla di cinque
cose. Cinque pagine servizio sono cinque porte d'ingresso invece di una.

**Chiarezza.** Chi arriva dal passaparola cerca conferme, non tutto il
catalogo. Una home breve che rimanda è più rispettosa di una che chiede di
scorrere per nove schermate.

**Manutenzione.** Aggiungere un servizio è aggiungere una voce in
`src/data/services.ts`: hub, pagina, footer, sitemap, 404 e `llms.txt` si
aggiornano da soli.

---

## Struttura di una pagina

Ricorrente e volutamente prevedibile: chi naviga impara dove guardare.

```
briciole di pane
indice numerico + etichetta mono
TITOLO
occhiello
[scheda tecnica: tempi, tecnologie, dati]
───────────────────────────────────────
A · sezione
B · sezione
C · domande frequenti
───────────────────────────────────────
chiusura scura + rimando ai fratelli
```

---

## Contenuti

| Cosa | Dove | Chi lo modifica |
|---|---|---|
| Articoli del blog | `src/content/blog/*.md` | Markdown, anche da GitHub |
| Progetti | `src/content/portfolio/*.md` | Markdown, anche da GitHub |
| I cinque servizi | `src/data/services.ts` | Nel codice |
| Contatti, menu, P.IVA | `src/data/site.ts` | Nel codice |
| Testi delle pagine fisse | I rispettivi `.astro` | Nel codice |

La divisione non è arbitraria: nei markdown sta ciò che cambia spesso e il cui
errore è circoscritto. Un refuso in un articolo si corregge; un refuso nella
home lo vedono tutti subito.

---

## Trasparenza sul portfolio

I progetti hanno un campo `kind`:

| Valore | Effetto in pagina |
|---|---|
| `dimostrativo` | Nota di trasparenza, e i numeri sono presentati come **obiettivi di progetto** |
| `cliente` | Nessuna nota, i numeri sono presentati come **risultati** |

Sull'hub compare una nota generale quando c'è almeno un progetto dimostrativo.

Non è scrupolo eccessivo. Presentare un concept come lavoro su commessa regge
finché il primo cliente non chiede una referenza, e a quel punto il danno alla
credibilità è molto più grande del vantaggio.

---

## SEO per pagina

Ogni pagina dichiara `title`, `description` e canonical propri, più lo schema
JSON-LD adatto:

| Pagina | Schema |
|---|---|
| Ovunque | `Organization` + `WebSite` (grafo globale) |
| Servizio | `Service` + `FAQPage` |
| Progetto | `CreativeWork` |
| Articolo | `BlogPosting` |
| Hub | `ItemList` / `CollectionPage` / `Blog` |
| Interne | `BreadcrumbList` |

Le pagine legali sono `noindex`: servono agli utenti, non ai motori.
