/**
 * I cinque servizi, ognuno con la sua pagina dedicata (/servizi/[slug]).
 *
 * Sono dati e non file markdown perché la loro struttura è fissa e ricca:
 * un editor da CMS su questi campi darebbe più danni che benefici. Blog e
 * portfolio, che cambiano spesso, vivono invece in src/content/.
 */

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  /** Indice mostrato in pagina: 001, 002… */
  index: string;
  title: string;
  /** Titolo lungo per l'H1 della pagina dedicata. */
  headline: string;
  /** Una riga: compare nelle card e nei meta. */
  summary: string;
  /** Paragrafo d'apertura della pagina. */
  intro: string;
  /**
   * A chi serve davvero.
   *
   * Situazioni, non categorie di mestiere: in "studi professionali,
   * artigiani, aziende di servizi" non si riconosce nessuno, in "il sito da
   * telefono si legge solo allargando con le dita" si riconosce chi ha quel
   * problema. È la differenza fra un elenco e uno specchio.
   */
  bestFor: string[];
  /**
   * Cosa comprende concretamente.
   *
   * Il titolo è l'etichetta della fase, ma il testo deve dire cosa cambia per
   * chi compra — non cosa facciamo noi. "Design su misura" descrive il nostro
   * lavoro; "il tuo sito non somiglia a quello del concorrente" descrive il
   * suo risultato.
   */
  includes: { title: string; text: string }[];
  /** Tecnologie usate, mostrate come dati. */
  stack: string[];
  /**
   * Le domande vere, quattro per servizio.
   *
   * Devono coprire quello che una persona si chiede prima di scrivere —
   * quanto costa, quanto ci vuole, cosa serve da me, cosa succede dopo — e non
   * quello che fa comodo a noi raccontare. Nessuna cifra: DGF non ha ancora lo
   * storico per dire "in media", e un numero inventato qui varrebbe meno di
   * zero. Si spiega da cosa dipende il prezzo, che è più utile e si può dire.
   */
  faq: ServiceFaq[];
}

export const SERVICES: readonly Service[] = [
  {
    slug: "siti-web",
    index: "001",
    title: "Siti web",
    headline: "Un sito non deve stupire: deve farti contattare",
    summary:
      "Siti vetrina e istituzionali: veloci da caricare, chiari da leggere, trovabili su Google.",
    intro:
      "Un sito vetrina ha un compito solo: far capire cosa fai, per chi, e come ti si scrive. Se una sezione non serve a quello, è peso che rallenta la pagina e distrae chi la legge. Noi partiamo da lì, e il resto lo togliamo.",
    bestFor: [
      "Ti cercano su Google e trovano la tua pagina Facebook ferma a qualche anno fa",
      "Il sito ce l'hai, ma da telefono si legge solo allargando con le dita",
      "Al telefono spieghi ogni volta le stesse cose, perché il sito non le dice",
    ],
    includes: [
      {
        title: "Progettazione dei contenuti",
        text: "Decidiamo cosa dire e in che ordine prima di disegnare qualsiasi cosa. Chi arriva trova la risposta alla sua domanda in cima, non a metà pagina.",
      },
      {
        title: "Niente tema ricolorato",
        text: "L'impaginazione nasce dai tuoi contenuti veri. Il risultato è che il tuo sito non somiglia a quello del tuo concorrente, che ha comprato lo stesso modello.",
      },
      {
        title: "Si apre subito",
        text: "Codice leggero e immagini compresse: chi ti cerca dalla strada, con una tacca di rete, fa in tempo a vedere la pagina prima di stancarsi.",
      },
      {
        title: "Trovabile su Google",
        text: "Struttura, titoli, dati strutturati e sitemap messi come Google li legge. Non compra posizioni, toglie i motivi per cui oggi non ti trova.",
      },
    ],
    stack: [
      "Astro",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "Sharp",
      "Zod",
      "Schema.org",
      "Web3Forms",
      "GitHub Actions",
      "GitHub Pages",
    ],
    faq: [
      {
        q: "Quanto costa un sito?",
        a: "Non abbiamo un listino, perché il prezzo dipende quasi solo da due cose: quante pagine davvero diverse servono, e se testi e foto ci sono già o vanno fatti da zero. Un sito di quattro pagine con i contenuti pronti sta in una fascia; uno con dieci schede di servizio da scrivere una per una sta in un'altra. Dopo una chiacchierata ti mandiamo una cifra chiusa e l'elenco di cosa comprende, per iscritto.",
      },
      {
        q: "Quanto tempo ci vuole?",
        a: "La parte che dipende da noi è la più prevedibile: deciso cosa dire, costruire e mettere online una vetrina è un lavoro con una fine. Quello che allunga i tempi sono quasi sempre i contenuti: il testo del «chi siamo» che nessuno ha voglia di scrivere, le foto da rifare. Ti diamo una data e ti diciamo esattamente quali pezzi dipendono da te per rispettarla.",
      },
      {
        q: "Cosa vi serve da parte mia?",
        a: "Il minimo è cosa fai e a chi, raccontato come lo diresti a voce. Poi il logo, le foto dei tuoi lavori o del posto dove lavori, e gli accessi al dominio se ne hai già uno. I testi possiamo scriverli noi partendo dalla conversazione, ma le foto vere del tuo lavoro valgono più di qualsiasi immagine d'archivio comprata.",
      },
      {
        q: "Il sito è mio?",
        a: "Sì: codice, dominio, contenuti e accessi. Te li consegniamo e non esiste nessun canone che serva a tenerteli. Se un giorno vuoi affidarlo a qualcun altro, se ne va con te senza dover chiedere niente a noi.",
      },
    ],
  },
  {
    slug: "ecommerce",
    index: "002",
    title: "E-commerce",
    headline: "Un negozio online, non un sito con il carrello",
    summary:
      "Catalogo, pagamenti e spedizioni: un negozio che sai gestire da solo e che si compra bene da telefono.",
    intro:
      "Un e-commerce deve tenere insieme catalogo, giacenze, pagamenti, spedizioni e resi, e restare semplice per chi ci lavora dentro ogni giorno. La parte difficile non è mettere un carrello in pagina: è che tutto questo regga quando gli ordini arrivano tutti insieme. Per questo prima di scrivere una riga guardiamo come vendi adesso.",
    bestFor: [
      "Vendi già su un marketplace e ti accorgi che la commissione si mangia il margine su ogni ordine",
      "Hai prodotti pronti da spedire, ma oggi li compra solo chi passa davanti al negozio",
      "Prendi gli ordini per messaggio e passi le sere a copiare indirizzi e a rincorrere i pagamenti",
    ],
    includes: [
      {
        title: "Catalogo e schede prodotto",
        text: "Categorie, filtri e campi decisi prima di caricare: aggiungere un prodotto diventa riempire caselle, non inventarsi ogni volta dove metterlo.",
      },
      {
        title: "Checkout senza sorprese",
        text: "Meno passaggi possibile e spedizione calcolata prima dell'ultimo click. Chi arriva a pagare ha già visto quanto paga davvero.",
      },
      {
        title: "Pannello di gestione",
        text: "Prezzi, giacenze e ordini li cambi tu, anche dal telefono, senza aspettare noi. Se un prodotto finisce, sparisce dal negozio quando lo segni.",
      },
      {
        title: "Spedizioni e ordini",
        text: "Corrieri collegati e costi calcolati da soli: l'ordine arriva già pronto da preparare, senza ricopiare indirizzi a mano.",
      },
    ],
    stack: [
      "Shopify",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Stripe",
      "PayPal",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Algolia",
      "Docker",
    ],
    faq: [
      {
        q: "Quanto costa un e-commerce?",
        a: "Sul prezzo pesa quasi tutto il catalogo: quanti prodotti sono, quanto sono diversi fra loro, e quante integrazioni servono con gestionale, corrieri e fatturazione. Poi c'è la strada. La piattaforma pronta costa meno da costruire ma ha un canone mensile; su misura il canone non c'è, e il costo si sposta tutto all'inizio. Ti diamo una cifra sola, scritta, dopo aver visto il catalogo e capito come lavori. E se dal discorso viene fuori che ti basta una [vetrina](/servizi/siti-web), te lo diciamo: costa meno.",
      },
      {
        q: "Quanto tempo serve per aprirlo?",
        a: "Dipende quasi solo dal catalogo. Costruire il negozio è un lavoro che possiamo pianificare; caricare foto, misure e descrizioni di ogni prodotto no, perché quel materiale deve arrivare da te. Ti diamo i tempi delle due parti separati, così vedi qual è quella che dipende da noi e quale da te, e fissiamo insieme la data di apertura.",
      },
      {
        q: "Dopo la consegna chi se ne occupa?",
        a: "Il negozio di tutti i giorni — prodotti, prezzi, ordini, resi — lo gestisci tu: ti facciamo vedere come, e restiamo raggiungibili. Il software però si muove anche quando tu non lo tocchi, perché i sistemi di pagamento e i corrieri cambiano le loro integrazioni e vanno seguite. Cosa copriamo dopo la consegna, e a quali condizioni, lo mettiamo per iscritto prima di partire. Non ti leghiamo a un canone per poterti rispondere.",
      },
      {
        q: "Quanto trattengono sui pagamenti?",
        a: "Su ogni incasso il fornitore di pagamento trattiene una percentuale più una quota fissa: non la decidiamo noi e non la incassiamo noi. Le tariffe sono pubblicate sui loro siti e cambiano a seconda del metodo (carta, PayPal, bonifico) e del paese di chi compra. Prima di sceglierlo le confrontiamo sui tuoi numeri: su un carrello piccolo pesa la quota fissa, su uno grosso pesa la percentuale. È comunque una voce diversa dalla commissione di un marketplace, che si prende una fetta del prezzo di vendita.",
      },
    ],
  },
  {
    slug: "app",
    index: "003",
    title: "App",
    headline: "App per chi ha il telefono in mano più del computer",
    summary:
      "App iOS e Android per chi ha bisogno di notifiche, uso offline, fotocamera o lettura di codici.",
    intro:
      "Un'app si giustifica quando le stesse persone la apriranno ogni giorno e serve qualcosa che il browser non sa fare: notifiche che arrivano davvero, lavoro anche senza rete, fotocamera e GPS. Dentro quel perimetro è lo strumento giusto e si vede subito. Fuori, costa più di un sito e va mantenuta ogni anno: la prima cosa che guardiamo insieme è da che parte cade il tuo caso.",
    bestFor: [
      "I tuoi tecnici compilano i rapporti su carta e la sera li ricopiano al computer",
      "Devi avvisare le stesse persone in giornata, e la mail la leggono il giorno dopo",
      "Chi la userà lavora dove la rete va e viene: cantieri, capannoni, furgoni in strada",
    ],
    includes: [
      {
        title: "Analisi di fattibilità onesta",
        text: "Un documento breve che mette a confronto app e sito sul tuo caso: cosa guadagni, cosa costa in più, cosa resta uguale.",
      },
      {
        title: "Sviluppo multipiattaforma",
        text: "Un solo codice per iOS e Android: una correzione si scrive una volta sola e arriva su entrambi i telefoni.",
      },
      {
        title: "Pubblicazione sugli store",
        text: "Account sviluppatore, schede, informativa privacy, schermate e risposte alla revisione: le prepariamo noi, restano intestate a te.",
      },
      {
        title: "Aggiornamenti nel tempo",
        text: "Ogni anno iOS e Android alzano i requisiti minimi: adeguiamo l'app prima che gli store rifiutino i nuovi caricamenti.",
      },
    ],
    stack: [
      "React Native",
      "Expo",
      "EAS Build",
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "SQLite",
      "Firebase",
      "Reanimated",
      "Zustand",
      "Sentry",
    ],
    faq: [
      {
        q: "Quanto costa un'app?",
        a: "Il salto più grosso non lo fanno le schermate, lo fa quello che c'è dietro: un'app che mostra dati costa una frazione di una che li scrive anche quando il telefono è senza rete e poi li sincronizza. Contano poi quante funzioni entrano nella prima versione e con quanti sistemi che usi già deve parlare. La cifra te la diamo dopo l'analisi di fattibilità, quando sappiamo cosa stiamo costruendo: un numero detto al telefono non varrebbe niente.",
      },
      {
        q: "Quanto tempo serve prima di averla sullo store?",
        a: "Non esiste una durata standard, e chi te la dà prima di aver visto il progetto sta indovinando. Sul calendario pesano quante funzioni entrano nella prima versione, quanto in fretta arrivano da te contenuti, accessi e decisioni, e la revisione degli store, che non dipende da nessuno dei due. Le date le trovi scritte nel preventivo, funzione per funzione, e le aggiorniamo insieme se il perimetro cambia in corsa.",
      },
      {
        q: "E se Apple rifiuta l'app?",
        a: "Capita, e non è un incidente raro: la revisione respinge spesso al primo invio, per un'informativa privacy incompleta, un permesso chiesto senza motivo evidente o una funzione che il regolamento non ammette. In quel caso correggiamo e ricarichiamo, e questo lavoro è compreso nel progetto. Quello che nessuno può garantirti è la data esatta di pubblicazione, perché la decisione è loro. Gli account sviluppatore Apple e Google restano intestati a te e li paghi direttamente a loro.",
      },
      {
        q: "Quanto costa mantenerla?",
        a: "Va messa in conto una spesa ricorrente, e dipende da tre voci: gli account degli store, il server se l'app ne ha uno (dati, accessi, notifiche) e l'adeguamento annuale ai nuovi requisiti di iOS e Android. Un'app lasciata ferma non è un risparmio: prima smette di funzionare su alcuni telefoni, poi rischia di essere tolta dagli store. La quantifichiamo insieme al preventivo iniziale, e se un domani vuoi affidarla a qualcun altro il codice è già tuo.",
      },
    ],
  },
  {
    slug: "software-su-misura",
    index: "004",
    title: "Software su misura",
    headline: "Gestionali che sostituiscono i fogli di calcolo sparsi",
    summary:
      "Piattaforme costruite sul tuo processo reale, quando i programmi già pronti non ci stanno dentro.",
    intro:
      "Il software su misura ha senso quando il modo in cui lavori è il tuo vantaggio, e piegarlo a un programma standard significherebbe perderlo. Tutte le altre volte conviene comprare qualcosa di già fatto: costa una frazione e funziona da domani mattina. Il primo lavoro che facciamo insieme è capire in quale dei due casi sei.",
    bestFor: [
      "Lo stesso ordine lo riscrivi a mano in tre punti diversi, e a fine mese i numeri non tornano",
      "Paghi ogni mese un programma di cui usi tre schermate, e per tutto il resto apri comunque un foglio di calcolo",
      "Il pezzo di lavoro che ti distingue sta in un file che sa aggiornare una persona sola: quando è in ferie, ci si ferma",
    ],
    includes: [
      {
        title: "Mappatura del processo reale",
        text: "Passiamo del tempo accanto a chi il lavoro lo fa, con il suo schermo davanti. Così lo strumento segue i passaggi che fate davvero, comprese le eccezioni che nessuno ha mai messo per iscritto.",
      },
      {
        title: "Modello dati unico",
        text: "Un dato lo scrivi una volta e compare ovunque serva. Correggi un indirizzo in un punto solo, e smettono di esistere due versioni dello stesso numero a seconda di chi te lo dice.",
      },
      {
        title: "Permessi per ruolo",
        text: "Ognuno apre lo strumento e trova il proprio lavoro, non trenta voci che non lo riguardano. Di ogni modifica resta scritto chi l'ha fatta e quando: le discussioni su chi ha cambiato cosa finiscono lì.",
      },
      {
        title: "Automazioni mirate",
        text: "I calcoli, i promemoria e i riepiloghi che oggi rifai a mano ogni settimana li prepara lo strumento. Tu passi dal produrli al controllarli.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Django",
      "Python",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Celery",
      "Docker",
      "Nginx",
      "GitHub Actions",
    ],
    faq: [
      {
        q: "Quanto costa?",
        a: "Il prezzo lo muovono tre cose: quante persone diverse devono usarlo, quanti dati esistenti vanno recuperati e con quanti sistemi già tuoi deve parlare (banca, fatturazione, corrieri). Il primo incontro serve a misurare quelle tre cose; poi ricevi una cifra scritta, con l'elenco di cosa comprende e di cosa resta fuori.",
      },
      {
        q: "Quanto passa prima che sia usabile?",
        a: "Non ti consegniamo tutto alla fine. Si parte dal pezzo che oggi ti fa perdere più tempo, e quello va in mano a chi dovrà usarlo mentre il resto è ancora da scrivere: è l'unico modo per accorgersi di un errore di impostazione quando correggerlo costa poco. Il calendario dei rilasci, con la data del primo pezzo funzionante, sta nel preventivo e non arriva dopo la firma.",
      },
      {
        q: "E se un domani cambiamo fornitore?",
        a: "Il codice sorgente è tuo e sta in un archivio intestato a te: un altro sviluppatore se lo porta via senza dover chiedere niente a noi. I dati stanno in un database standard e si esportano quando vuoi, in un formato che si legge anche fuori dallo strumento. Ci teniamo i clienti perché conviene restare, non perché andarsene è complicato. L'unico software che resta nostro è [Nexia Home](/portfolio/nexia-home), che è un prodotto che vendiamo noi: quello che costruiamo su tua commessa, no.",
      },
      {
        q: "Cosa succede ai dati che ho già?",
        a: "Li importiamo, e la migrazione fa parte del progetto: non è una voce che compare alla fine. Prima però li guardiamo insieme, perché un foglio cresciuto in cinque anni contiene quasi sempre doppioni, date scritte in tre formati diversi e righe che nessuno sa più a cosa servano. Quella pulizia va fatta una volta sola e non la può fare il software da solo. Se qualcosa non è recuperabile lo scopri prima, non dopo aver spento il vecchio sistema.",
      },
    ],
  },
  {
    slug: "intelligenza-artificiale",
    index: "005",
    title: "Intelligenza artificiale",
    headline: "Prima il compito, poi l'intelligenza artificiale",
    summary:
      "Automazioni e assistenti costruiti su un compito ripetitivo, con una misura che dice se funzionano.",
    intro:
      "L'intelligenza artificiale conviene su un compito stretto: ripetitivo, con criteri decidibili, che oggi occupa ore di qualcuno. Più il compito è largo, meno il modello è affidabile e più diventa difficile accorgersi quando sbaglia. Per questo la prima cosa che cerchiamo non è la tecnologia: è il compito.",
    bestFor: [
      "Ogni mattina qualcuno apre cinquanta email e le smista a mano in quattro caselle",
      "La stessa domanda arriva venti volte a settimana e la risposta è sempre la stessa",
      "I documenti ci sono tutti, ma per trovare una clausola bisogna aprirne trenta",
    ],
    includes: [
      {
        title: "Scelta del compito",
        text: "Un compito solo, definito abbastanza stretto da poter dire se una risposta è giusta o sbagliata. Se non ne troviamo uno, il progetto non parte.",
      },
      {
        title: "Prototipo verificabile",
        text: "Il modello lavora sui tuoi dati veri e confrontiamo le sue risposte con quelle che avresti dato tu. La soglia sotto la quale ci si ferma la fissi prima del test, non dopo aver visto i risultati.",
      },
      {
        title: "Integrazione nei tuoi strumenti",
        text: "L'AI entra nella casella di posta, nel gestionale o nel programma che già apri ogni giorno. Se diventa una scheda in più da ricordarsi, dopo due settimane non la apre più nessuno.",
      },
      {
        title: "Controllo umano",
        text: "Il modello propone, una persona conferma, e resta scritto chi ha confermato cosa. Dove la decisione ha conseguenze quel passaggio non lo togliamo, nemmeno quando il modello sta andando bene.",
      },
    ],
    stack: [
      "Claude API",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Qdrant",
      "Whisper",
      "Celery",
      "Redis",
      "Docker",
      "Langfuse",
      "TypeScript",
    ],
    faq: [
      {
        q: "Quanto costa, in concreto?",
        a: "Il costo ha due parti e vanno guardate separate. La prima è la costruzione, che si preventiva come qualsiasi progetto e finisce. La seconda è il consumo: ogni domanda che lo strumento gira al modello si paga, quindi quella spesa continua finché lo usi e cresce se lo usi di più. Nel preventivo mettiamo una stima del consumo mensile calcolata sui volumi che ci dai, così la vedi prima di decidere.",
      },
      {
        q: "I miei dati finiscono nell'addestramento di qualcuno?",
        a: "Non con i fornitori che usiamo: scegliamo servizi le cui condizioni contrattuali escludono l'uso dei dati dei clienti per addestrare i modelli, e ti mostriamo dov'è scritto prima di firmare. Se ci sono dati che non possono uscire dall'azienda, l'alternativa è un modello su infrastruttura dedicata: costa di più, e lo mettiamo in conto all'inizio. In ogni caso quello che il modello vede lo decidi tu, campo per campo.",
      },
      {
        q: "E quando sbaglia?",
        a: "Sbaglia, e va progettato sapendolo. Un modello non segnala l'errore: dà una risposta sbagliata con lo stesso tono di una giusta, quindi «me ne accorgo se sembra strana» non è un controllo. Dove l'errore costa mettiamo una verifica umana obbligatoria prima che l'azione parta; dove costa poco, l'errore si accetta e si misura. Quale dei due sia il tuo caso si decide prima di scrivere il codice.",
      },
      {
        q: "Finita la consegna, è finita la spesa?",
        a: "No, e chi lo lascia intendere ti sta preparando una sorpresa. Oltre al consumo dei modelli c'è la manutenzione: i fornitori pubblicano nuove versioni, ritirano le vecchie e cambiano i listini, e a ogni cambio il comportamento va riverificato sul tuo caso. Se il tempo che lo strumento ti fa risparmiare non copre questa spesa ricorrente, il segnale è che quel compito non andava automatizzato.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
