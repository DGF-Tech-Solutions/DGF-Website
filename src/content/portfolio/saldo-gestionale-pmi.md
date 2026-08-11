---
client: Saldo
title: Un gestionale su misura che sostituisce cinque fogli di calcolo
summary: Piattaforma per clienti, fatture e scadenze di una PMI di servizi — un'unica fonte di verità, accessibile da qualsiasi browser.
category: Software gestionale
year: "2025"
kind: dimostrativo
cover: ../../assets/mockups/gestionale.webp
coverFull: ../../assets/mockups/gestionale-full.webp
services:
  - Software su misura
  - UI/UX Design
  - Automazione
stack:
  - Next.js
  - PostgreSQL
  - Prisma
  - tRPC
metrics:
  - value: "1"
    label: Fonte di verità al posto di 5
  - value: "0"
    label: Doppie digitazioni previste
  - value: Ruoli
    label: Permessi differenziati per team
challenge: L'amministrazione di una PMI di servizi vive spesso su fogli di calcolo scollegati — dati duplicati, scadenze che sfuggono, nessuna visione d'insieme. Ogni report diventa un lavoro manuale di ore, e ogni errore si propaga silenziosamente.
approach:
  - Mappare i processi reali insieme a chi li esegue ogni giorno, non solo insieme a chi li descrive nelle riunioni.
  - Definire un modello dati unico per clienti, preventivi, fatture e pagamenti, così che ogni informazione esista in un posto solo.
  - Automatizzare i promemoria sulle scadenze e costruire una dashboard che risponda alla domanda del lunedì mattina — cosa devo fare oggi.
solution: Un gestionale web responsivo con permessi per ruolo, ricerca istantanea e automazioni che eliminano la doppia digitazione. Tutto in un posto, raggiungibile dal browser senza installare niente.
order: 2
---

## Il punto di partenza

I fogli di calcolo non falliscono di colpo: degradano. Funzionano benissimo finché li usa una persona, cominciano a scricchiolare quando diventano due, e a cinque sono un rischio operativo. Il momento in cui conviene sostituirli è quello in cui nessuno sa più con certezza quale versione sia quella giusta.

## Le scelte progettuali

Il modello dati viene prima dell'interfaccia. Se clienti, preventivi, fatture e pagamenti sono modellati correttamente, l'interfaccia diventa quasi ovvia. Se sono modellati male, nessuna grafica salva il progetto.

I permessi sono per ruolo e non per persona: quando qualcuno entra o esce dal team non bisogna riconfigurare niente a mano. Ogni modifica lascia traccia di chi l'ha fatta e quando.

## La parte tecnica

Tipizzazione end-to-end tra database e interfaccia: se cambia la forma di un dato, il progetto non compila finché tutte le parti che lo usano non sono aggiornate. È una rete di sicurezza che vale molto più del tempo che costa costruirla.
