---
client: Nexia Home
title: Il gestionale che un amministratore di condominio usa tutti i giorni
summary: >-
  Piattaforma SaaS per studi di amministrazione condominiale: contabilità,
  adempimenti, assemblee e portale per i condòmini. È nata dai problemi
  concreti di uno studio, lo Studio Mattaliano, ed è diventata un prodotto
  aperto a chiunque faccia lo stesso mestiere.
category: Software gestionale
year: "2026"
kind: interno
cover: /src/assets/mockups/nexia.webp
coverFull: /src/assets/mockups/nexia-full.webp
liveUrl: https://nexiahome.it
liveLabel: Vai a nexiahome.it
services:
  - Software su misura
  - UI/UX Design
  - Automazione
stack:
  - Next.js
  - React
  - Django
  - PostgreSQL
metrics:
  - value: "13"
    label: Moduli backend, dalle anagrafiche al backoffice
  - value: "196"
    label: Pagine applicative nel frontend
  - value: "28"
    label: Pagine del portale condòmini
  - value: "3"
    label: Pubblici sulla stessa piattaforma, con permessi separati
challenge: >-
  Uno studio di amministrazione condominiale lavora spesso con software che ha
  vent'anni di età anagrafica, installato su un PC, difficile da condividere
  fra collaboratori, senza un canale verso i condòmini. Il risultato è che la
  contabilità sta in un programma, i documenti in una cartella di rete, le
  comunicazioni nella posta personale, e ogni domanda di un condomino diventa
  una telefonata.
approach:
  - >-
    Partire da un caso vero. Nexia Home nasce affiancando lo Studio Mattaliano
    nel suo lavoro quotidiano: prima abbiamo guardato come si amministra
    davvero un condominio, poi abbiamo scritto il software.
  - Partire dalla contabilità, perché è la parte che non ammette errori. Aritmetica decimale e non virgola mobile, e tutti i riparti eseguiti dal server, mai nel browser.
  - >-
    Tenere separati i dati di ogni studio nello strato più profondo del
    sistema, dove la separazione è una proprietà del dato e non un controllo
    che qualcuno può dimenticare di scrivere.
  - Costruire il portale dei condòmini come parte dello stesso sistema, non come sito separato che va tenuto allineato a mano.
  - >-
    Spostare fuori dalla richiesta tutto ciò che è lento: documenti da
    generare, elaborazioni di fine periodo, riparti pesanti, invii massivi.
    Così l'interfaccia non si blocca mai ad aspettare.
solution: Un'applicazione web multi-tenant e multi-condominio con contabilità, fiscalità, assemblee, lavori straordinari, servizi a consumo, archivio documentale e portale per i residenti con pagamento delle rate online. Un solo posto per lo studio, un solo posto per il condomino.
faq:
  - q: Posso vedere Nexia Home dal vivo?
    a: >-
      Sì. Il prodotto ha un sito suo,
      [nexiahome.it](https://nexiahome.it), con le schermate reali dei moduli
      e la prova gratuita. Quello che vedi in questa pagina è come è stato
      costruito, non la vetrina commerciale.
  - q: Che ruolo ha avuto lo Studio Mattaliano?
    a: >-
      Quello che di solito manca: il mestiere. Loro amministrano condomìni tutti
      i giorni e hanno portato i casi veri, comprese le eccezioni che nessun
      manuale racconta; noi abbiamo portato il software. Senza quel confronto
      sarebbe uscito un gestionale scritto da chi il lavoro se lo immagina
      invece di averlo visto.
  - q: Potete costruire un gestionale così anche per il mio settore?
    a: >-
      Sì, ed è il motivo per cui questa scheda esiste. Il dominio cambia, il
      metodo no: si parte da chi quel lavoro lo fa davvero. Prima di
      preventivare vogliamo capire quale parte del tuo lavoro è ripetitiva,
      perché spesso conviene automatizzarne una sola e farla bene invece di
      rifare tutto.
  - q: Se commissiono un software a voi, il codice resta mio?
    a: >-
      Sì. Nexia Home è un'eccezione perché è un prodotto nostro, che vendiamo
      noi. Sui lavori su commessa il codice sorgente, il dominio e gli accessi
      restano di chi paga, e li consegniamo alla fine del progetto.
  - q: Perché due linguaggi, Python e TypeScript?
    a: >-
      Perché fanno due mestieri diversi. I calcoli contabili stanno in Python
      con aritmetica decimale, dove un centesimo di differenza non esiste;
      l'interfaccia sta in TypeScript perché deve girare nel browser. Un solo
      linguaggio ovunque avrebbe significato rinunciare a una delle due cose.
featured: true
order: 1
---

## Da un problema solo a un prodotto

Nexia Home non nasce da un'analisi di mercato. Nasce da uno studio di amministrazione condominiale in carne e ossa, lo **Studio Mattaliano**, e dal tempo passato a guardare come lavorava davvero: quante volte riapriva lo stesso file, quante telefonate riceveva per informazioni che erano già scritte da qualche parte, quanto tempo se ne andava a rimettere in fila numeri che il computer poteva tenere in fila da solo.

Da lì il salto. Quei problemi non erano di quello studio: erano del mestiere. La stessa giornata, con nomi diversi, la fa ogni amministratore d'Italia. Un software costruito bene per uno solo, se è costruito bene, scioglie gli stessi nodi a tutti. Ed è esattamente il percorso che abbiamo fatto: dal caso singolo al prodotto aperto a chiunque.

È anche il motivo per cui l'abbiamo costruito **insieme** allo Studio Mattaliano, non per conto loro. Le eccezioni del lavoro reale non stanno in nessun manuale: il condòmino che vende a metà esercizio, la spesa da ripartire su una tabella che vale solo per una scala. Le conosce solo chi ci ha lavorato dentro.

## Perché un altro gestionale

Un amministratore di condominio non ha un lavoro solo: fa il contabile, il fiscalista, il segretario d'assemblea, il direttore lavori e il centralino. Ogni condominio che gestisce moltiplica tutto: piano dei conti, esercizio, tabelle millesimali, scadenze, fornitori, verbali.

I gestionali storici del settore risolvono la contabilità e si fermano lì. Tutto quello che sta intorno resta lavoro manuale: mandare l'avviso di rata, rispondere al condomino che chiede a che punto è la perdita in garage, ritrovare il verbale del 2019. Nexia Home copre il ciclo intero, dalla registrazione della fattura del fornitore fino al condomino che paga la rata dal telefono.

## Com'è strutturato

Il backend è diviso in tredici moduli, ognuno con una responsabilità sua. Non è una divisione estetica: significa che la logica dei riparti millesimali sta in un posto solo, e la si può verificare da sola invece di doverla inseguire in mezzo a tutto il resto.

Il frontend è un'unica applicazione che serve tre pubblici diversi con permessi diversi: lo studio, il condomino e chi mantiene la piattaforma. Le pagine di elenco seguono tutte lo stesso schema: barra filtri, tabella, paginazione. Un gestionale con quaranta schermate diverse è un gestionale che nessuno impara.

## Le scelte tecniche, e perché

**Nessun calcolo finanziario nel browser.** I riparti millesimali, i conguagli e i calcoli fiscali stanno solo sul server, con aritmetica decimale. La virgola mobile in contabilità produce differenze di centesimi che nel rendiconto di un condominio diventano una contestazione in assemblea.

**Separazione fra studi il più in basso possibile.** Ogni studio vede solo i propri dati, e la regola vive nello strato dei dati: non è un controllo che un pezzo di codice può dimenticare di applicare.

**Lavoro pesante fuori dalla richiesta.** Documenti da generare, elaborazioni di fine periodo, riparti su molte unità e invii massivi girano in coda. L'utente riceve subito una risposta, e il risultato quando è pronto.

**Controlli davanti e dietro.** L'interfaccia segnala l'errore subito, perché sia comodo correggerlo; il server ricontrolla comunque, perché l'interfaccia non è mai la barriera che protegge i dati.

**Stato nell'URL.** Filtri, ordinamento e pagina vivono nella barra degli indirizzi. Una lista filtrata si può salvare nei preferiti e mandare a un collega: dettaglio piccolo che in un gestionale usato otto ore al giorno si sente.

> [!ATTENZIONE]
> La virgola mobile in contabilità è la trappola più costosa del settore. Non sbaglia il totale di poco: lo sbaglia in modo diverso a ogni ricalcolo, quindi il rendiconto non torna mai due volte allo stesso modo e nessuno riesce a capire dove sia l'errore.

## Come si registra una fattura

È il percorso che un amministratore ripete decine di volte al mese, ed è il primo che abbiamo reso indolore. L'ordine dei passaggi è quello che ci ha mostrato lo Studio Mattaliano, non quello che avremmo immaginato noi.

1. **Si importa il documento.** Dal cassetto fiscale o caricando il file della fattura elettronica. I dati si leggono da soli, senza ridigitare partita IVA, importi e scadenze.
2. **Il fornitore si riconosce da solo.** Se la partita IVA è già in anagrafica il collegamento è automatico; se è nuova si crea al volo senza uscire dalla schermata.
3. **Si sceglie la tabella di riparto.** L'importo si divide fra i condòmini secondo la tabella giusta per quel tipo di spesa, con i millesimi presi dall'anagrafica e non riscritti a mano.
4. **Le quote finiscono nelle rate.** Da lì entrano nella situazione contabile di ogni condomino e compaiono nel suo portale, senza un solo passaggio manuale.

## Cosa vede il condomino

Il portale non è un contentino. Da lì un residente vede la propria situazione contabile, paga la rata con carta, scarica bilanci e verbali, apre una segnalazione con la foto del guasto, prenota la sala comune, inserisce l'autolettura del contatore e consulta le convocazioni d'assemblea. Ogni cosa che il condomino fa da solo è una telefonata in meno allo studio.

> [!BUONA PRATICA]
> Il modo più rapido per capire se un gestionale è fatto bene è guardare cosa succede quando l'utente sbaglia. Un errore va intercettato subito, con parole comprensibili, e va ricontrollato comunque più a valle: il dato sporco non deve mai arrivare in archivio.
