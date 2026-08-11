# Pannello di redazione — guida pratica

Il pannello serve a scrivere articoli del blog e schede di progetto **senza aprire
l'editor di codice**. Vive su:

```
https://dgftechsolutions.com/admin
```

Funziona da computer, tablet e telefono.

---

## Come funziona (in due righe)

Il pannello è un'applicazione che gira **nel tuo browser**. Quando salvi, parla
direttamente con GitHub e scrive un file markdown nel repository — esattamente
come se avessi fatto un commit a mano. GitHub Actions se ne accorge, ricostruisce
il sito e lo pubblica.

```
Scrivi nel pannello
      ↓
Il pannello scrive il file .md nel repo GitHub
      ↓
GitHub Actions ricostruisce il sito
      ↓
Online in circa un minuto
```

Non esiste nessun server nostro, nessun database, nessun canone. I contenuti
restano **file markdown dentro il tuo repository**: se un domani il pannello
sparisse, gli articoli sarebbero ancora lì e il sito continuerebbe a funzionare.

---

## Primo accesso: creare il token

Serve una volta sola (poi il token resta salvato nel browser fino alla scadenza).

1. Vai su GitHub → **Settings** (menu del tuo profilo, in alto a destra)
2. In fondo alla colonna di sinistra: **Developer settings**
3. **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
4. Compila così:

   | Campo | Valore |
   |---|---|
   | Token name | `Pannello DGF` |
   | Expiration | fino a 366 giorni |
   | Repository access | **Only select repositories** → `DGF-Tech-Solutions/DGF-Website` |
   | Repository permissions → **Contents** | **Read and write** |

   Non serve nient'altro. Lascia tutti gli altri permessi su "No access".

5. **Generate token**, copia il codice che appare (lo mostra una volta sola)
6. Vai su `https://dgftechsolutions.com/admin`, clicca **Sign In with Token**,
   incolla e conferma

### Perché un token e non una password

Quel token **apre una porta sola**: può leggere e scrivere i file di questo
repository, e nient'altro. Non permette di entrare su github.com, non permette di
cambiare la password, non permette di toccare gli altri repository.

Una password farebbe il contrario: aprirebbe tutto l'account.

Se un giorno sospetti un problema, torna in *Fine-grained tokens*, clicca sul
token e **Revoke**. Trenta secondi, e quell'accesso non esiste più — senza toccare
nient'altro.

### Quando scade

Alla scadenza il pannello ti dirà che il token non è più valido: rigenerane uno
ripetendo i passaggi qui sopra. Il sito nel frattempo continua a funzionare
normalmente: la scadenza riguarda solo la scrittura dal pannello.

---

## Scrivere un articolo

1. Apri il pannello → **Articoli del blog** → **New Articolo**
2. Compila i campi. Quelli che contano:

   | Campo | Nota |
   |---|---|
   | **Titolo** | È anche il titolo che appare su Google. Massimo 120 caratteri. |
   | **Riassunto** | Due righe. Compare nell'elenco del blog e nei risultati di ricerca. |
   | **Data** | Determina l'ordine: i più recenti stanno in cima. |
   | **Categoria** | Guide, Strategia, Tecnica o Notizie. |
   | **Minuti di lettura** | Lascia vuoto: viene calcolato da solo. |
   | **Bozza** | Se attivo, l'articolo **non** compare sul sito. |
   | **Contenuto** | Il testo. Usa "Titolo 2" per le sezioni. |

3. **Save**

L'indirizzo della pagina nasce dal nome del file. Scrivilo in minuscolo con i
trattini: `come-scegliere-un-cms` diventa `/blog/come-scegliere-un-cms`.

### Scrivere con calma

Attiva **Bozza** e salva quando vuoi: il pezzo resta nel repository ma non
compare sul sito. Quando è pronto, togli la spunta e salva di nuovo.

### Link interni

Scrivi il percorso senza dominio:

```
[scrivici](/contatti)
[i nostri servizi](/servizi/siti-web)
```

---

## Aggiungere un progetto

Stessa procedura, sezione **Progetti**. Un campo merita attenzione particolare:

### Natura del progetto

| Valore | Cosa succede in pagina |
|---|---|
| **Dimostrativo** | Compare una nota di trasparenza, e i numeri vengono presentati come *obiettivi di progetto* |
| **Cliente reale** | Nessuna nota, e i numeri vengono presentati come *risultati* |

Scegli **Cliente reale** solo per lavori realmente commissionati e consegnati.
Presentare un concept come lavoro su commessa è una scorciatoia che si paga al
primo cliente che chiede una referenza.

### Immagini

Trascinale nel campo immagine: vengono caricate in `src/assets/mockups/` e Astro
le ottimizza automaticamente a build time (AVIF/WebP, più misure per i diversi
schermi). Non serve comprimerle prima — carica pure l'originale.

Formato consigliato per l'anteprima: **16:10**.

---

## Cosa NON si modifica dal pannello

Per scelta, il pannello gestisce solo blog e progetti. Restano nel codice:

- i testi delle pagine fisse (home, servizi, chi siamo, contatti)
- le descrizioni dei cinque servizi (`src/data/services.ts`)
- contatti, P.IVA, link del footer (`src/data/site.ts`)

Il motivo è che un errore di battitura nella home si vede subito da tutti,
mentre un articolo sbagliato è meno grave e più facile da correggere. Se in
futuro vuoi gestire anche quelli dal pannello, si aggiunge: sono una decina di
righe di configurazione.

---

## Se qualcosa non funziona

| Sintomo | Causa probabile |
|---|---|
| "Not Found" o errore di accesso | Il token non ha il permesso *Contents: Read and write*, o non include questo repository |
| Il pannello si apre ma non vede i contenuti | Il branch configurato non è `main` — controlla `public/admin/config.yml` |
| Ho salvato ma il sito non cambia | Aspetta un minuto. Se non basta, guarda la tab **Actions** su GitHub: la build potrebbe essere fallita |
| La build è fallita | Di solito è un campo obbligatorio vuoto. Il messaggio in Actions dice quale |

Il controllo che la build fa sui contenuti è voluto: meglio una pubblicazione che
si ferma con un messaggio chiaro, che una pagina rotta online.
