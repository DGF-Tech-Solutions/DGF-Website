---
client: Sale
title: Un sito ristorante con prenotazioni che riempiono le serate
summary: Sito per un ristorante d'autore con menù digitale, racconto della cucina e prenotazione del tavolo in pochi tap.
category: Sito + prenotazioni
year: "2024"
kind: dimostrativo
cover: ../../assets/mockups/ristorazione.webp
coverFull: ../../assets/mockups/ristorazione-full.webp
services:
  - Sito web
  - UI/UX Design
  - Integrazioni
stack:
  - Astro
  - TheFork API
  - Tailwind CSS
metrics:
  - value: "< 60 s"
    label: Obiettivo tempo di prenotazione
  - value: Sempre
    label: Menù aggiornabile dal ristorante
  - value: "24/7"
    label: Prenotazioni anche a locale chiuso
challenge: In molti ristoranti le prenotazioni passano tutte dal telefono, spesso proprio durante il servizio. Il vecchio sito non comunica l'identità della cucina e da telefono è scomodo, quindi non toglie lavoro alla sala — semmai ne aggiunge.
approach:
  - Raccontare visivamente la cucina e chi la fa, mettendo la fotografia in primo piano invece che in una galleria secondaria.
  - Menù digitale aggiornabile dal ristorante in autonomia, perché un menù vecchio è peggio di nessun menù.
  - Prenotazione del tavolo integrata e completabile in meno di un minuto, senza registrazione.
solution: Un sito immersivo e leggero che trasmette l'esperienza del locale e sposta le prenotazioni online, liberando la sala dalle telefonate nei momenti di punta e raccogliendo richieste anche quando il ristorante è chiuso.
order: 4
---

## Il punto di partenza

Il telefono che squilla alle 20:30 è il nemico naturale di una sala piena. Ogni chiamata sottrae una persona al servizio, e in quel momento nessuno ha il tempo di descrivere il menù o di spiegare dov'è il parcheggio. Le stesse domande, tutte le sere.

## Le scelte progettuali

La prima cosa che si vede non è il logo: è il cibo. La fotografia occupa lo spazio che merita, perché in questo settore è l'argomento di vendita principale.

Il menù è gestito dal ristorante, e questo non è un dettaglio: un menù non aggiornato mina la fiducia più di quanto un menù assente la mancherebbe. La prenotazione è pensata per essere completata con una mano sola, in piedi, mentre si decide dove andare a cena.

## La parte tecnica

Sito statico, quindi immediato anche sulla rete mobile scadente di un centro storico. L'integrazione con il sistema di prenotazione avviene lato client solo quando l'utente apre il modulo, così chi visita il sito per vedere il menù non paga il costo di caricare nulla di più.
