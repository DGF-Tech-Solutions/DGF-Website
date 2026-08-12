/**
 * Fonte unica per identità, contatti e navigazione.
 *
 * Tutto ciò che compare in più di un posto vive qui: cambiando un valore in
 * questo file si aggiorna ovunque (header, footer, meta tag, dati strutturati).
 */

export const SITE = {
  name: "DGF Tech Solutions",
  legalName: "DGF Tech Solutions S.r.l.",
  url: "https://dgftechsolutions.com",
  /** Claim breve, usato nei meta e nel footer. */
  tagline: "Dall'idea al lancio, parli sempre con chi scrive il codice.",
  description:
    "Software house a Messina, attiva in tutta Italia: siti web, e-commerce, app, software su misura e soluzioni di intelligenza artificiale.",
  locale: "it_IT",
  lang: "it",
  email: "founders.dgftechsolutions@gmail.com",
  vatId: "IT03882320835",
  taxId: "03882320835",
  /* Sede legale. Serve ai documenti legali, dove il titolare del trattamento
     va identificato per intero, e ai dati strutturati dell'organizzazione.
     Stessa sede dichiarata nelle pagine legali di Nexia: è la stessa società. */
  street: "Via Leonardo Sciascia 24",
  zip: "98168",
  city: "Messina",
  region: "ME",
  country: "IT",
  countryName: "Italia",
  logo: "/logo-dgf-trasparente.png",
  ogImage: "/og-image.jpg",
  themeColor: "#054b77",
} as const;

/**
 * Navigazione principale.
 *
 * L'ordine non è casuale: prima cosa facciamo (Servizi), poi come lo
 * facciamo (Come lavoriamo), poi le prove (Progetti), poi i contenuti
 * (Blog), infine chi siamo. È il percorso di chi ci sta valutando.
 *
 * "Servizi" è l'unica voce con un pannello: cinque sottopagine sono troppe
 * per un link semplice. Le altre sono link piatti.
 */
export const NAV = [
  { label: "Servizi", href: "/servizi" },
  { label: "Progetti", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Chi siamo", href: "/chi-siamo" },
] as const;

/** Voce di azione, separata perché ha un trattamento visivo diverso. */
export const NAV_CTA = { label: "Contatti", href: "/contatti" } as const;

/**
 * Profili social, mostrati nel footer.
 *
 * Le voci con `href` vuoto vengono rese come icona NON cliccabile: si vede il
 * segnaposto ma non si va da nessuna parte. È la stessa scelta fatta sul
 * footer di Nexia per LinkedIn — meglio un'icona spenta che un link che porta
 * a una pagina inesistente.
 *
 * Per attivarne una basta incollare l'indirizzo del profilo.
 */
export const SOCIAL = [
  { name: "LinkedIn", icon: "linkedin", href: "" },
  { name: "Instagram", icon: "instagram", href: "" },
  { name: "Facebook", icon: "facebook", href: "" },
  { name: "GitHub", icon: "github", href: "" },
] as const;

export const FOOTER_LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie", href: "/cookie" },
  { label: "Termini", href: "/termini" },
] as const;

/**
 * Configurazione del form di contatto (Web3Forms).
 *
 * Il sito è statico: nessun server nostro invia le email, lo fa Web3Forms.
 * Questa chiave è PUBBLICA per costruzione (finisce comunque nel browser):
 * non è una password e va bene che stia nel repo.
 */
export const CONTACT = {
  web3formsKey: "f2873aaa-7263-4b3b-8f1e-8a06dccb49d3",
  /** Sitekey hCaptcha pubblica e gratuita di Web3Forms. "" per disattivare. */
  hcaptchaSiteKey: "50b2fe65-b00b-4b9e-ad62-3ba471098be2",
  subjectPrefix: "Nuova richiesta dal sito",
  fromName: "Sito DGF Tech Solutions",
} as const;
