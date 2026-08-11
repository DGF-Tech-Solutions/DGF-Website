# Design system

Direzione: **"light institutional trust"** — la stessa della landing di Nexia,
adattata al brand DGF. Tutto vive in
[`src/styles/global.css`](../src/styles/global.css).

> Nota storica: la prima versione di questo sito seguiva una direzione
> Swiss/tecnica (griglia esposta, bianco dominante, colore rarissimo).
> Corretta ma fredda: su un sito che deve dare fiducia a chi ti sta valutando
> comunicava "documentazione tecnica" invece che "azienda affidabile". È stata
> sostituita, non ritoccata.

---

## I tre principi

### 1. Bianco e azzurro chiaro si alternano

Ogni sezione cambia fondo rispetto alla precedente: `--color-paper` e
`.band-soft`. **Una sola fascia scura per pagina** (`.on-dark`), mai due.

### 2. Ogni concetto ha un segno

Un'icona dentro un riquadro azzurro, o un'illustrazione. Il testo da solo non
fa capire in fretta, e questo è un sito che viene scansionato, non letto.

### 3. Angoli morbidi, ombre leggere

Niente bordi taglienti, niente ombre nere: tutte tinte di navy. È la
differenza fra un sito "caldo" e uno "tecnico".

---

## Colore

| Token | Valore | Uso |
|---|---|---|
| `--color-navy` | `#054b77` | Voce principale, bottoni, icone |
| `--color-navy-deep` | `#0a2233` | Unica fascia scura + footer |
| `--color-blue` | `#1575a4` | Collegamenti, stati |
| `--color-cyan` | `#3d9cc7` | Accento su fondo scuro, dettagli |
| `--color-soft` | `#e8f1f8` | Riquadri icona, badge, superfici tenui |
| `--color-soft-2` | `#d4e6f2` | Stessa cosa, un gradino più marcato |
| `--color-ink` | `#0f172a` | Titoli |
| `--color-ink-2` | `#334155` | Testo corrente |
| `--color-ink-3` | `#526074` | Testo secondario — **verificato 6,4:1 su bianco** |
| `--color-line` | `#e2e8f0` | Bordi |
| `--color-paper-2` | `#f8fafc` | Fasce alternate |

Corrispondenza con Nexia: il loro `#24438f` diventa il nostro `#054b77`, il
loro `#eaf0fb` diventa `#e8f1f8`. Neutri, fasce e bordi sono identici.

---

## Tipografia

**Inter**, self-hostato e sottoinsieme da Astro, pesi 400–800. Titoli grassi
(700–800), non semibold: devono "atterrare".

| Classe | Uso |
|---|---|
| `.t-display` | Titolo dell'hero, una volta per pagina |
| `.t-h1` | Titolo delle pagine interne |
| `.t-h2` | Titolo di sezione |
| `.t-h3` | Titolo di scheda |
| `.t-lead` | Occhiello sotto il titolo |
| `.t-body` / `.t-small` | Testo e note |
| `.t-eyebrow` | `11px` grassetto maiuscolo spaziato, in navy |
| `.t-dim` | Seconda metà del titolo in grigio chiaro |

`.t-dim` è la firma tipografica presa da Nexia: crea contrasto **dentro la
stessa frase**, senza aggiungere un colore.

```html
<h2 class="t-h2">Cinque cose, <span class="t-dim">fatte bene.</span></h2>
```

---

## Componenti

| Classe | Note |
|---|---|
| `.card` | Il mattone: bordo tenue, `radius-lg`, ombra appena accennata. All'hover si alza di 3px |
| `.icon-tile` | Riquadro azzurro dell'icona. Dentro un `.group` si riempie di navy all'hover |
| `.btn-primary` | Pillola navy. `.btn-ghost`, `.btn-soft`, `.btn-on-dark` le varianti |
| `.chip` | Badge azzurro. `.chip-line` la versione con solo bordo |
| `.link-arrow` | Link con freccia che avanza |
| `.band-soft` | Fascia alternata |
| `.on-dark` | Ridefinisce i token: ogni componente si adatta da solo |
| `.glow-bg` | Aloni azzurri sfocati dietro gli hero, senza immagini |

Gli hover stanno tutti dentro `@media (hover: hover)`: su touch un hover
"appiccicato" è un difetto, non un effetto.

---

## Movimento

### La regola che vale più di tutte

**L'elemento LCP non parte mai da `opacity: 0`.** Chrome non conteggia per
l'LCP un elemento a opacità zero, quindi ogni dissolvenza d'ingresso
posticipa la metrica di tutta la sua durata. Nell'hero si anima solo
`transform` (`.anim-rise`).

È la stessa regola scritta nel CSS marketing di Nexia, arrivata per la stessa
strada.

### Scroll-driven animations

Tutto il movimento legato allo scroll usa `animation-timeline`, nativa del
CSS: nessun JavaScript, nessun listener, tutto sul thread di composizione.
Dove non è supportata il blocco `@supports` non si applica e gli elementi
restano visibili e fermi — nessun fallback da scrivere.

| Classe | Effetto |
|---|---|
| `.reveal` / `.reveal-left` / `.reveal-right` / `.reveal-zoom` | Entrata quando l'elemento arriva in vista |
| `.parallax-slow` / `.parallax-fast` / `.parallax-drift` | Parallasse |
| `.read-progress` | Barra di avanzamento lettura (articoli) |
| `.float` / `.float-slow` / `.float-fast` | Oscillazione dei cartellini sull'hero |

Cascata: si imposta `--i` (0, 1, 2…) sull'elemento e le tessere entrano una
dopo l'altra.

```html
<div class="card reveal" style="--i:2">…</div>
```

La parallasse è **spenta sotto i 768px**: su mobile lo spazio verticale è poco
e il movimento diventa fastidioso invece che elegante. E tutto si spegne con
`prefers-reduced-motion`.

---

## Illustrazioni

Generate con ComfyUI, stessa pipeline degli "omini" di Nexia ma con soggetti
diversi: **scene e oggetti, mai persone**. La scelta è deliberata — persone
generate dall'AI su un sito aziendale vengono lette come il team o come
clienti, ed è una bugia difficile da smentire.

Vivono in `src/assets/illustrazioni/`. Vedi
[ARCHITETTURA.md](ARCHITETTURA.md#illustrazioni) per la generazione e per il
ritaglio dello sfondo, che ha una storia sua.
