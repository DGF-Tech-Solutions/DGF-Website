---
client: Nexia Home
title: Il gestionale che un amministratore di condominio usa tutti i giorni
summary: >-
  Piattaforma SaaS per studi di amministrazione condominiale: contabilità in
  partita doppia, riparti millesimali, adempimenti fiscali, assemblee e portale
  per i condòmini. È il nostro prodotto, lo sviluppiamo e lo manteniamo noi.
category: Software gestionale
year: "2026"
kind: interno
cover: /src/assets/mockups/nexia.webp
coverFull: /src/assets/mockups/nexia-full.webp
services:
  - Software su misura
  - UI/UX Design
  - Automazione
stack:
  - Next.js
  - React
  - Django
  - PostgreSQL
  - Celery
  - Redis
  - Docker
  - Stripe
metrics:
  - value: "13"
    label: Moduli backend, dalle anagrafiche al backoffice
  - value: "196"
    label: Pagine applicative nel frontend
  - value: "28"
    label: Pagine del portale condòmini
  - value: RLS
    label: Isolamento dei dati a livello di database
challenge: >-
  Uno studio di amministrazione condominiale lavora spesso con software che ha
  vent'anni di età anagrafica, installato su un PC, difficile da condividere
  fra collaboratori, senza un canale verso i condòmini. Il risultato è che la
  contabilità sta in un programma, i documenti in una cartella di rete, le
  comunicazioni nella posta personale, e ogni domanda di un condomino diventa
  una telefonata.
approach:
  - Partire dalla contabilità, perché è la parte che non ammette errori. Partita doppia rigorosa, importi in Decimal e non in virgola mobile, tutti i calcoli di riparto eseguiti nel backend, mai nel browser.
  - Isolare i dati di ogni studio a livello di database con la Row Level Security di PostgreSQL, non con un filtro applicativo che si può dimenticare in una query.
  - Costruire il portale dei condòmini come parte dello stesso sistema, non come sito separato che va tenuto allineato a mano.
  - >-
    Spostare su code asincrone tutto ciò che è lento: generazione PDF, batch
    fiscali, riparti pesanti, invii massivi. Così l'interfaccia non si blocca
    mai ad aspettare.
solution: Un'applicazione web multi-tenant e multi-condominio con contabilità, fiscalità, assemblee, lavori straordinari, servizi a consumo, archivio documentale e portale per i residenti con pagamento delle rate online. Un solo posto per lo studio, un solo posto per il condomino.
faq:
  - q: Posso vedere Nexia Home dal vivo?
    a: >-
      Sì. Il prodotto ha un sito suo, nexiahome.it, con le schermate reali dei
      moduli e la prova gratuita. Quello che vedi in questa pagina è il dietro
      le quinte tecnico, non la vetrina commerciale.
  - q: Potete costruire un gestionale così anche per il mio settore?
    a: >-
      Sì, ed è il motivo per cui questa scheda esiste. Il dominio cambia, il
      metodo no. Prima di preventivare vogliamo capire quale parte del tuo
      lavoro è davvero ripetitiva, perché spesso conviene automatizzarne una
      sola e farla bene invece di rifare tutto.
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

## Perché un altro gestionale

Un amministratore di condominio non ha un lavoro solo: fa il contabile, il fiscalista, il segretario d'assemblea, il direttore lavori e il centralino. Ogni condominio che gestisce moltiplica tutto: piano dei conti, esercizio, tabelle millesimali, scadenze, fornitori, verbali.

I gestionali storici del settore risolvono la contabilità e si fermano lì. Tutto quello che sta intorno resta lavoro manuale: mandare l'avviso di rata, rispondere al condomino che chiede a che punto è la perdita in garage, ritrovare il verbale del 2019. Nexia Home nasce per coprire il ciclo intero, dalla registrazione della fattura del fornitore fino al condomino che paga la rata dal telefono.

## Com'è strutturato

Il backend è diviso in tredici moduli, ognuno con una responsabilità sua: anagrafiche e immobili, contabilità, fiscalità, gestione operativa, legale e sinistri, processi (assemblee, lavori, segnalazioni), servizi a consumo, sistema, engine di migrazione dai gestionali concorrenti, portale condòmini, backoffice. Non è una divisione estetica: significa che la logica dei riparti millesimali sta in un posto solo e la si può testare da sola.

Il frontend è un'unica applicazione Next.js che serve tre pubblici diversi con permessi diversi: lo studio, il condomino e il backoffice di chi mantiene la piattaforma. Le pagine di elenco seguono tutte lo stesso schema: barra filtri, tabella, paginazione. Un gestionale con quaranta schermate diverse è un gestionale che nessuno impara.

## Le scelte tecniche, e perché

**Nessun calcolo finanziario nel browser.** I riparti millesimali, i conguagli e i calcoli fiscali stanno solo nel backend Python, con aritmetica decimale. La virgola mobile in contabilità produce differenze di centesimi che nel rendiconto di un condominio diventano una contestazione in assemblea.

**Multi-tenancy a livello di database.** Ogni studio vede solo i propri dati perché è PostgreSQL a impedirlo, tramite Row Level Security. Un filtro dimenticato in una query non diventa una fuga di dati.

**Lavoro pesante fuori dalla richiesta HTTP.** La generazione dei PDF nominali, i batch fiscali, l'invio delle convocazioni e i riparti su molte unità girano su code Celery. L'utente riceve subito una risposta e il risultato quando è pronto.

**Validazione due volte.** Schema Zod nel frontend per dare all'utente un errore immediato e leggibile, serializer nel backend perché il frontend non è mai la barriera di sicurezza.

**Stato nell'URL.** Filtri, ordinamento e pagina vivono nella barra degli indirizzi. Una lista filtrata si può salvare nei preferiti e mandare a un collega: dettaglio piccolo che in un gestionale usato otto ore al giorno si sente.

> [!ATTENZIONE]
> La virgola mobile in contabilità è la trappola più costosa del settore. Non sbaglia il totale di poco: lo sbaglia in modo diverso a ogni ricalcolo, quindi il rendiconto non torna mai due volte allo stesso modo e nessuno riesce a capire dove sia l'errore.

## Come si registra una fattura

È il percorso che un amministratore ripete decine di volte al mese, ed è il primo che abbiamo reso indolore.

1. **Si importa il documento.** Dal cassetto fiscale o caricando il file XML della fattura elettronica. I dati si leggono da soli, senza ridigitare partita IVA, importi e scadenze.
2. **Il fornitore si riconosce da solo.** Se la partita IVA è già in anagrafica il collegamento è automatico; se è nuova si crea al volo senza uscire dalla schermata.
3. **Si sceglie la tabella di riparto.** L'importo si divide fra i condòmini secondo la tabella giusta per quel tipo di spesa, con i millesimi presi dall'anagrafica e non riscritti a mano.
4. **Le quote finiscono nelle rate.** Da lì entrano nella situazione contabile di ogni condomino e compaiono nel suo portale, senza un solo passaggio manuale.

## Cosa vede il condomino

Il portale non è un contentino. Da lì un residente vede la propria situazione contabile, paga la rata con carta tramite Stripe, scarica bilanci e verbali, apre una segnalazione con la foto del guasto, prenota la sala comune, inserisce l'autolettura del contatore e consulta le convocazioni d'assemblea. Ogni cosa che il condomino fa da solo è una telefonata in meno allo studio.

> [!BUONA PRATICA]
> Il modo più rapido per capire se un gestionale è fatto bene è guardare cosa succede quando l'utente sbaglia. Noi abbiamo messo la validazione due volte, davanti e dietro: davanti perché l'errore vada corretto subito, dietro perché il dato sporco non entri mai nel database.
