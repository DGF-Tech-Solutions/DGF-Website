# Design system — Tecnico / Swiss

Direzione visiva del sito, derivata dallo *International Typographic Style*.
Tutto vive in [`src/styles/global.css`](../src/styles/global.css).

---

## I tre principi

Ogni scelta discende da questi. Se una proposta li contraddice, di norma è la
proposta a essere sbagliata.

### 1. La struttura è visibile

La griglia non è un'impalcatura da nascondere: è parte del linguaggio. Filetti,
indici numerici (`001`, `002`…) e allineamenti dichiarati apertamente.

L'utilità `.grid-lines` disegna colonne verticali appena percettibili sullo
sfondo, con un gradiente ripetuto: zero elementi nel DOM, zero costo. Si
spengono sotto i 768 px, dove diventerebbero rumore.

### 2. La gerarchia nasce da scala e peso, non dal colore

Il testo è quasi sempre inchiostro su bianco. Un titolo si impone perché è
grande, non perché è colorato. Il salto fra `.t-display` e `.t-body` è netto e
voluto.

### 3. Il colore è un segnale, non una decorazione

Il cyan compare solo dove c'è azione o stato: link attivo, focus, indice della
sezione corrente. **Se il cyan è ovunque, non significa più niente.**

---

## Colore

### Brand

| Token | Valore | Uso |
|---|---|---|
| `--color-navy` | `#054b77` | Voce principale, riempimento dei bottoni |
| `--color-blue` | `#1575a4` | Collegamenti, indici, accenti su testo piccolo |
| `--color-cyan` | `#3d9cc7` | Accento raro: stato attivo, equatore del globo, fondi scuri |

### Inchiostro e carta

| Token | Valore | Uso |
|---|---|---|
| `--color-ink` | `#0a1622` | Testo primario |
| `--color-ink-2` | `#33465a` | Testo secondario |
| `--color-ink-3` | `#5f7183` | Didascalie, etichette |
| `--color-hairline` | `#e3e9ef` | Filetti e bordi |
| `--color-paper` | `#ffffff` | Fondo principale |
| `--color-paper-2` | `#f7f9fb` | Fasce alternate |

I neutri sono tinti di blu, mai grigi puri: appartengono alla stessa famiglia
del brand anche quando non sembrano colorati.

### Regola di contrasto

**Minimo 4,5:1 sul testo.** Verificata, non stimata:

- il cyan su bianco a 11px dà **3,09:1** → non si usa sul testo piccolo
- `--color-ink-3` è stato scurito da `#64768a` (4,42:1) a `#5f7183` (4,77:1)

Sul fondo scuro (`.on-dark`) i token vengono ridefiniti in blocco e il cyan
torna ammissibile, perché lì il rapporto è ampio.

---

## Tipografia

**Inter** per tutto, **JetBrains Mono** per etichette, indici e dati.
Due famiglie sole, self-hostate e sottoinsiemi da Astro a build time.

| Classe | Dimensione | Uso |
|---|---|---|
| `.t-display` | `clamp(2.75rem → 6.5rem)` | Titolo dell'hero, una volta per pagina |
| `.t-h1` | `clamp(2.25rem → 4.25rem)` | Titolo delle pagine interne |
| `.t-h2` | `clamp(1.75rem → 2.875rem)` | Titolo di sezione |
| `.t-h3` | `clamp(1.19rem → 1.5rem)` | Titolo di scheda |
| `.t-lead` | `clamp(1.06rem → 1.31rem)` | Occhiello sotto il titolo |
| `.t-body` | `1rem` | Testo corrente |
| `.t-small` | `0.875rem` | Note, didascalie |
| `.t-label` | `0.6875rem` mono, maiuscoletto, `letter-spacing 0.16em` | Etichetta di sezione |
| `.t-index` | `0.6875rem` mono, blu | Indice numerico |

Le cifre usano `font-variant-numeric: tabular-nums`: è un sito tecnico, i numeri
si incolonnano.

---

## Struttura

| Utilità | Cosa fa |
|---|---|
| `.wrap` | Contenitore, max `78rem`, padding responsivo. **Ogni pagina si allinea a questo.** |
| `.section` | Ritmo verticale, `clamp(3.5rem → 7.5rem)` |
| `.section-sm` | Versione ridotta, per le chiusure |
| `.grid-lines` | Colonne verticali di sfondo |
| `.prose-measure` | Colonna di lettura, max `42rem` (~68 caratteri) |
| `.rule` | Filetto orizzontale standard |
| `.row-tech` | Riga indice + contenuto, separata da un filetto |

---

## Componenti

| Classe | Note |
|---|---|
| `.surface` | Scheda: filetto netto, raggio 4px. **Bordi, non nuvole.** |
| `.surface-hover` | Solleva di 2px all'hover — solo su dispositivi con puntatore |
| `.btn-primary` | Riempimento navy: l'unico blocco di colore pieno in pagina |
| `.btn-ghost` | Bordo, nessun riempimento |
| `.btn-on-dark` | Bianco pieno, per le fasce scure |
| `.link-underline` | Sottolineatura che cresce da sinistra |
| `.on-dark` | Ridefinisce i token per le fasce scure. Una o due per pagina, non di più |

Gli effetti hover stanno tutti dentro `@media (hover: hover)`: su touch un hover
"appiccicato" è un difetto, non un effetto.

---

## Movimento

### La regola che vale più di tutte

**L'elemento LCP non parte mai da `opacity: 0`.**

Il titolo dell'hero usa `.anim-rise`, che anima solo `transform`. Un `opacity: 0`
iniziale farebbe considerare al browser "dipinto" solo il fotogramma finale, e
l'LCP slitterebbe di tutta la durata dell'animazione.

| Classe | Anima | Per |
|---|---|---|
| `.anim-rise` | solo `transform` | **Titolo dell'hero** (candidato LCP) |
| `.anim-fade-rise` | `opacity` + `transform` | Elementi non LCP |
| `.anim-draw-x` | `scaleX` | Filetti che si disegnano |
| `.anim-fade` | `opacity` | Decorazioni |
| `.reveal` | `animation-timeline: view()` | Rivelazione allo scroll, **senza JS** |

Ritardi in cascata: `.delay-1` … `.delay-6` (80 ms → 560 ms).

Si animano solo `transform` e `opacity`, mai proprietà che ricalcolano il
layout.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` azzera tutte le durate. Il globo si
ferma in posa. Non è un ripiego: chi soffre di motion sickness non deve subire
nulla.

---

## Fasce scure

`.on-dark` ridefinisce i token invece di sovrascrivere le regole. Significa che
qualsiasi componente ci finisca dentro si adatta da solo, senza varianti
dedicate.

Vanno usate con parsimonia: una o due per pagina, per cambiare respiro. Il sito
è a dominanza bianca — è una scelta, non un default.
