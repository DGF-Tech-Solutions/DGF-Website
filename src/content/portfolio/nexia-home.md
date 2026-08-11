---
client: Nexia Home
title: Il gestionale che un amministratore di condominio usa tutti i giorni
summary: Piattaforma SaaS per studi di amministrazione condominiale — contabilità in partita doppia, riparti millesimali, adempimenti fiscali, assemblee e portale per i condòmini. È il nostro prodotto, lo sviluppiamo e lo manteniamo noi.
category: Software gestionale
year: "2026"
kind: cliente
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
  vent'anni di età anagrafica — installato su un PC, difficile da condividere
  fra collaboratori, senza un canale verso i condòmini. Il risultato è che la
  contabilità sta in un programma, i documenti in una cartella di rete, le
  comunicazioni nella posta personale, e ogni domanda di un condomino diventa
  una telefonata.
approach:
  - Partire dalla contabilità, perché è la parte che non ammette errori. Partita doppia rigorosa, importi in Decimal e non in virgola mobile, tutti i calcoli di riparto eseguiti nel backend — mai nel browser.
  - Isolare i dati di ogni studio a livello di database con la Row Level Security di PostgreSQL, non con un filtro applicativo che si può dimenticare in una query.
  - Costruire il portale dei condòmini come parte dello stesso sistema, non come sito separato che va tenuto allineato a mano.
  - Spostare tutto ciò che è lento — generazione PDF, batch fiscali, riparti pesanti, invii massivi — su code asincrone, così che l'interfaccia non si blocchi mai ad aspettare.
solution: Un'applicazione web multi-tenant e multi-condominio con contabilità, fiscalità, assemblee, lavori straordinari, servizi a consumo, archivio documentale e portale per i residenti con pagamento delle rate online. Un solo posto per lo studio, un solo posto per il condomino.
featured: true
order: 1
---

## Il problema che risolve

Un amministratore di condominio non ha un lavoro solo: fa il contabile, il fiscalista, il segretario d'assemblea, il direttore lavori e il centralino. Ogni condominio che gestisce moltiplica tutto — piano dei conti, esercizio, tabelle millesimali, scadenze, fornitori, verbali.

I gestionali storici del settore risolvono la contabilità e si fermano lì. Tutto quello che sta intorno — mandare l'avviso di rata, rispondere al condomino che chiede a che punto è la perdita in garage, ritrovare il verbale del 2019 — resta lavoro manuale. Nexia Home nasce per coprire il ciclo intero, dalla registrazione della fattura del fornitore fino al condomino che paga la rata dal telefono.

## Com'è strutturato

Il backend è diviso in tredici moduli, ognuno con una responsabilità sua: anagrafiche e immobili, contabilità, fiscalità, gestione operativa, legale e sinistri, processi (assemblee, lavori, segnalazioni), servizi a consumo, sistema, engine di migrazione dai gestionali concorrenti, portale condòmini, backoffice. Non è una divisione estetica: significa che la logica dei riparti millesimali sta in un posto solo e la si può testare da sola.

Il frontend è un'unica applicazione Next.js che serve tre pubblici diversi con permessi diversi: lo studio, il condomino e il backoffice di chi mantiene la piattaforma. Le pagine di elenco seguono tutte lo stesso schema — barra filtri, tabella, paginazione — perché un gestionale con quaranta schermate diverse è un gestionale che nessuno impara.

## Le scelte tecniche, e perché

**Nessun calcolo finanziario nel browser.** I riparti millesimali, i conguagli e i calcoli fiscali stanno solo nel backend Python, con aritmetica decimale. La virgola mobile in contabilità produce differenze di centesimi che nel rendiconto di un condominio diventano una contestazione in assemblea.

**Multi-tenancy a livello di database.** Ogni studio vede solo i propri dati perché è PostgreSQL a impedirlo, tramite Row Level Security. Un filtro dimenticato in una query non diventa una fuga di dati.

**Lavoro pesante fuori dalla richiesta HTTP.** La generazione dei PDF nominali, i batch fiscali, l'invio delle convocazioni e i riparti su molte unità girano su code Celery. L'utente riceve subito una risposta e il risultato quando è pronto.

**Validazione due volte.** Schema Zod nel frontend per dare all'utente un errore immediato e leggibile, serializer nel backend perché il frontend non è mai la barriera di sicurezza.

**Stato nell'URL.** Filtri, ordinamento e pagina vivono nella barra degli indirizzi. Una lista filtrata si può salvare nei preferiti e mandare a un collega — dettaglio piccolo che in un gestionale usato otto ore al giorno si sente.

## Cosa vede il condomino

Il portale non è un contentino. Da lì un residente vede la propria situazione contabile, paga la rata con carta tramite Stripe, scarica bilanci e verbali, apre una segnalazione con la foto del guasto, prenota la sala comune, inserisce l'autolettura del contatore e consulta le convocazioni d'assemblea. Ogni cosa che il condomino fa da solo è una telefonata in meno allo studio.
