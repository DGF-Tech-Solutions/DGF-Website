---
client: Erba
title: Un e-commerce botanico che converte la passione in vendite
summary: Negozio online per un vivaio urbano — catalogo curato, checkout in tre passi e schede prodotto che raccontano ogni pianta.
category: E-commerce
year: "2025"
kind: dimostrativo
cover: ../../assets/mockups/ecommerce.webp
coverFull: ../../assets/mockups/ecommerce-full.webp
services:
  - E-commerce
  - UI/UX Design
  - Sviluppo
stack:
  - Next.js
  - Stripe
  - Sanity
  - Tailwind CSS
metrics:
  - value: 3 passi
    label: Lunghezza del checkout
  - value: "< 2 s"
    label: Obiettivo Largest Contentful Paint
  - value: 100%
    label: Catalogo gestito dal cliente
challenge: Un vivaio urbano che vende solo in negozio e su un marketplace generico ha due problemi insieme — le commissioni erodono il margine e il brand non esiste agli occhi di chi compra. Serve un canale diretto, veloce e riconoscibile.
approach:
  - Raggruppare il catalogo per esigenza reale (luce, cura, spazio disponibile) invece che per famiglia botanica, perché è così che il cliente formula la domanda.
  - Schede prodotto con guida alla cura e fotografia reale, per abbassare i resi dovuti ad aspettative sbagliate.
  - Checkout in tre passi con pagamento Stripe e costo di spedizione calcolato prima dell'ultimo click.
solution: Un e-commerce headless in cui il catalogo è gestito interamente dal cliente, le pagine prodotto sono costruite per la ricerca organica e l'acquisto resta fluido anche da telefono con rete lenta.
featured: true
order: 1
---

## Il punto di partenza

Chi vende piante ha un problema di comunicazione prima che di tecnologia: una foto quadrata e due righe di descrizione non bastano a far capire come si cura una pianta, quanta luce le serve e se sopravvivrà in quel bagno senza finestre. Il risultato sono resi, recensioni tiepide e clienti che non tornano.

## Le scelte progettuali

L'architettura del catalogo è il vero lavoro di design di questo progetto. Le categorie botaniche sono utili a chi le piante le coltiva, inutili a chi le compra. La navigazione è quindi costruita su tre domande pratiche: quanta luce hai, quanto tempo vuoi dedicarci, quanto spazio hai.

Le schede prodotto rispondono in anticipo alle obiezioni che fanno abbandonare il carrello, e il checkout è ridotto all'osso: tre passi, nessuna registrazione obbligatoria, costo di spedizione visibile prima di inserire i dati di pagamento.

## La parte tecnica

L'impianto è headless: il contenuto vive in un CMS che il cliente gestisce da solo, il sito lo consuma e genera pagine statiche velocissime. Nessuna dipendenza da noi per cambiare un prezzo o aggiungere un prodotto.
