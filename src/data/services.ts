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
  /** A chi serve davvero. L'onestà qui vale più di un elenco di funzionalità. */
  bestFor: string[];
  /** Cosa comprende concretamente. */
  includes: { title: string; text: string }[];
  /** Tecnologie usate, mostrate come dati. */
  stack: string[];
  /** Indicazione di tempi realistici. */
  timeline: string;
  faq: ServiceFaq[];
}

export const SERVICES: readonly Service[] = [
  {
    slug: "siti-web",
    index: "001",
    title: "Siti web",
    headline: "Siti che si aprono subito e dicono chiaramente chi sei",
    summary:
      "Vetrine aziendali e siti istituzionali costruiti per essere veloci, leggibili e trovabili.",
    intro:
      "Un sito vetrina ha un compito preciso: far capire in pochi secondi cosa fai, per chi, e perché dovrebbero scegliere te. Tutto il resto — animazioni, effetti, sezioni infinite — o serve a quell'obiettivo o è peso morto.",
    bestFor: [
      "Attività che vogliono essere trovate e contattate, non vendere online",
      "Studi professionali, artigiani, aziende di servizi",
      "Chi ha un sito vecchio che non si vede bene da telefono",
    ],
    includes: [
      {
        title: "Progettazione dei contenuti",
        text: "Prima della grafica decidiamo cosa dire e in che ordine. È la parte che determina se il sito funziona.",
      },
      {
        title: "Design su misura",
        text: "Nessun tema comprato e ricolorato: l'impaginazione nasce dai tuoi contenuti reali.",
      },
      {
        title: "Sviluppo e ottimizzazione",
        text: "Codice pulito, immagini compresse, caricamento immediato anche da rete mobile.",
      },
      {
        title: "SEO tecnica di base",
        text: "Struttura, titoli, dati strutturati e sitemap perché Google capisca di cosa parli.",
      },
    ],
    stack: ["Astro", "Next.js", "TypeScript", "Tailwind CSS"],
    timeline: "3–6 settimane",
    faq: [
      {
        q: "Posso aggiornare i testi da solo?",
        a: "Sì. Dove ha senso installiamo un pannello di redazione gratuito che ti permette di modificare testi e immagini senza toccare il codice e senza canoni mensili.",
      },
      {
        q: "Il sito è mio?",
        a: "Completamente: codice, dominio e contenuti. Non c'è nessun vincolo che ti obbliga a restare con noi.",
      },
    ],
  },
  {
    slug: "ecommerce",
    index: "002",
    title: "E-commerce",
    headline: "Negozi online costruiti attorno al modo in cui vendi davvero",
    summary:
      "Cataloghi, pagamenti e spedizioni: un negozio che il cliente gestisce da solo e che converte da telefono.",
    intro:
      "Un e-commerce non è un sito con un carrello attaccato. È un sistema che deve reggere catalogo, magazzino, pagamenti, spedizioni e resi — e restare semplice per chi lo usa ogni giorno.",
    bestFor: [
      "Chi ha prodotti standardizzati pronti alla spedizione",
      "Chi vende già offline e vuole aprire un canale diretto",
      "Chi paga troppe commissioni su un marketplace",
    ],
    includes: [
      {
        title: "Architettura del catalogo",
        text: "Categorie e filtri organizzati come li cerca il cliente, non come li archivi tu.",
      },
      {
        title: "Checkout senza attriti",
        text: "Meno passaggi possibile, pagamenti sicuri, costi di spedizione chiari prima dell'ultimo click.",
      },
      {
        title: "Pannello di gestione",
        text: "Prodotti, prezzi, disponibilità e ordini gestiti da te, in autonomia.",
      },
      {
        title: "Schede prodotto che vendono",
        text: "Testi e foto pensati per rispondere ai dubbi che fanno abbandonare il carrello.",
      },
    ],
    stack: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
    timeline: "6–12 settimane",
    faq: [
      {
        q: "Meglio partire da un e-commerce o da una vetrina?",
        a: "Dipende da cosa vendi e da quanto pubblico hai già. Se il preventivo nasce dal contatto diretto, una vetrina rende di più e costa meno. Se hai un catalogo pronto e clienti che cercano di comprare, allora il negozio ha senso subito.",
      },
      {
        q: "Gestite anche le spedizioni?",
        a: "Integriamo i corrieri e automatizziamo il calcolo dei costi. La logistica fisica resta tua, ma il software la segue.",
      },
    ],
  },
  {
    slug: "app",
    index: "003",
    title: "App",
    headline: "Applicazioni mobili quando il browser non basta più",
    summary:
      "App iOS e Android per chi ha bisogno di notifiche, uso offline o accesso all'hardware del telefono.",
    intro:
      "Un'app costa più di un sito e va mantenuta nel tempo. Ha senso quando serve davvero qualcosa che il browser non può dare: notifiche push affidabili, funzionamento offline, fotocamera, GPS, lettori di codici.",
    bestFor: [
      "Servizi usati spesso dalle stesse persone",
      "Chi ha bisogno di notifiche o uso offline",
      "Team sul campo che lavorano da telefono o tablet",
    ],
    includes: [
      {
        title: "Analisi di fattibilità onesta",
        text: "Se il tuo problema si risolve con un sito, te lo diciamo prima di iniziare.",
      },
      {
        title: "Sviluppo multipiattaforma",
        text: "Una base di codice per iOS e Android: metà del costo di mantenimento.",
      },
      {
        title: "Pubblicazione sugli store",
        text: "Ti accompagniamo nelle procedure di App Store e Google Play, che sono la parte noiosa.",
      },
      {
        title: "Aggiornamenti nel tempo",
        text: "Le app vanno mantenute: i sistemi operativi cambiano ogni anno.",
      },
    ],
    stack: ["React Native", "Expo", "TypeScript", "Supabase"],
    timeline: "8–16 settimane",
    faq: [
      {
        q: "Serve davvero un'app o basta un sito?",
        a: "Nella maggior parte dei casi basta un sito ben fatto, installabile sulla schermata home. L'app si giustifica quando servono notifiche affidabili, uso offline o accesso all'hardware.",
      },
      {
        q: "Quanto costa mantenerla?",
        a: "Va messa in conto una manutenzione annuale per stare al passo con gli aggiornamenti di iOS e Android. Te la quantifichiamo prima di partire, non dopo.",
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
      "Il software su misura ha senso quando il tuo processo è il tuo vantaggio competitivo, e piegarlo a un gestionale standard significherebbe perderlo. Non quando serve solo fare fatture.",
    bestFor: [
      "Chi lavora su fogli di calcolo scollegati e duplicati",
      "Chi paga licenze per strumenti usati al 10%",
      "Chi ha un processo particolare che nessun software standard copre",
    ],
    includes: [
      {
        title: "Mappatura del processo reale",
        text: "Passiamo tempo con chi il lavoro lo fa davvero, non solo con chi lo descrive.",
      },
      {
        title: "Modello dati unico",
        text: "Una sola fonte di verità: basta con lo stesso dato scritto in quattro posti diversi.",
      },
      {
        title: "Permessi per ruolo",
        text: "Ognuno vede e modifica quello che gli compete, e resta traccia di chi ha fatto cosa.",
      },
      {
        title: "Automazioni mirate",
        text: "Promemoria, calcoli e report che eliminano il lavoro manuale ripetitivo.",
      },
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Docker"],
    timeline: "10–20 settimane",
    faq: [
      {
        q: "Non conviene un gestionale già pronto?",
        a: "Spesso sì, e in quel caso te lo diciamo. Il software su misura conviene quando il costo di adattare l'azienda a un programma standard supera quello di costruire lo strumento giusto.",
      },
      {
        q: "Cosa succede ai dati che ho già?",
        a: "Li importiamo. La migrazione dai fogli di calcolo o dal vecchio gestionale fa parte del progetto, non è un extra a sorpresa.",
      },
    ],
  },
  {
    slug: "intelligenza-artificiale",
    index: "005",
    title: "Intelligenza artificiale",
    headline: "AI applicata a un problema concreto, non messa lì per dire",
    summary:
      "Automazioni e assistenti costruiti su un compito specifico e misurabile della tua azienda.",
    intro:
      "L'intelligenza artificiale è utile quando c'è un compito ripetitivo, con criteri chiari, che oggi occupa ore di persone. Fuori da questa condizione diventa una spesa che fa notizia e non risultato.",
    bestFor: [
      "Chi smista, classifica o riassume grandi quantità di documenti",
      "Chi risponde ogni giorno alle stesse domande dei clienti",
      "Chi ha dati aziendali che nessuno riesce a interrogare",
    ],
    includes: [
      {
        title: "Individuazione del caso d'uso",
        text: "Partiamo da dove si perde tempo davvero, e stimiamo quanto se ne può recuperare.",
      },
      {
        title: "Prototipo verificabile",
        text: "Prima un test su dati veri e misurabile. Se non funziona, si ferma lì.",
      },
      {
        title: "Integrazione nei tuoi strumenti",
        text: "L'AI deve stare dove già lavori, non essere l'ennesima scheda del browser da ricordarsi.",
      },
      {
        title: "Controllo umano",
        text: "Su decisioni che contano l'ultima parola resta a una persona. Sempre.",
      },
    ],
    stack: ["Claude API", "Python", "PostgreSQL", "Vector DB"],
    timeline: "4–12 settimane",
    faq: [
      {
        q: "I miei dati finiscono nell'addestramento di qualcuno?",
        a: "No. Usiamo servizi con clausole contrattuali che escludono l'addestramento sui dati dei clienti, e dove serve li teniamo su infrastruttura dedicata.",
      },
      {
        q: "E se l'AI sbaglia?",
        a: "Sbaglia, e va progettato per questo. Per questo costruiamo sempre un passaggio di verifica umana dove l'errore avrebbe conseguenze reali.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
