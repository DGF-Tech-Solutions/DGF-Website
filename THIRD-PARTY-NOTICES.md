# Componenti di terze parti

Il file `LICENSE` riserva tutti i diritti sul codice, il design e i testi di
questo sito. **Fanno eccezione i componenti elencati qui**, che appartengono ad
altri e sono usati secondo le rispettive licenze.

Questo documento esiste perché due di quelle licenze — ISC e SIL OFL — chiedono
che la nota accompagni le copie, e questo sito le copie le distribuisce davvero:
i font vengono serviti dal nostro dominio, e alcuni tracciati delle icone sono
identici agli originali.

---

## Icone — Lucide (ISC)

`src/components/Icon.astro` contiene tracciati SVG presi da
[Lucide](https://lucide.dev), a sua volta derivato da Feather.

> ISC License
>
> Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part
> of Feather (MIT). All other copyright (c) for Lucide are held by Lucide
> Contributors 2022.
>
> Permission to use, copy, modify, and/or distribute this software for any
> purpose with or without fee is hereby granted, provided that the above
> copyright notice and this permission notice appear in all copies.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
> REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
> AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
> INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
> LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
> OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
> PERFORMANCE OF THIS SOFTWARE.

---

## Caratteri tipografici — SIL Open Font License 1.1

Entrambi i font sono scaricati e ridotti a sottoinsieme durante la compilazione
(vedi `fonts:` in `astro.config.mjs`) e **serviti da questo dominio**: è a tutti
gli effetti una ridistribuzione, ed è il caso in cui la OFL chiede che la
licenza accompagni i file.

- **Inter** — Copyright © 2016 The Inter Project Authors
  (<https://github.com/rsms/inter>)
- **JetBrains Mono** — Copyright © 2020 The JetBrains Mono Project Authors
  (<https://github.com/JetBrains/JetBrainsMono>)

Entrambi sono rilasciati sotto **SIL Open Font License, Version 1.1**, il cui
testo integrale è disponibile su <https://openfontlicense.org>.

I punti che ci riguardano:

- i font possono essere usati, studiati, modificati e ridistribuiti liberamente;
- **non possono essere venduti da soli**, e non lo sono: fanno parte del sito;
- i file modificati (qui: i sottoinsiemi generati in fase di build) **non
  possono usare il nome originale come Nome Riservato** — infatti Astro li
  rinomina con un'impronta (`5288773a5a229461.woff2`);
- questa nota di licenza deve accompagnare i file, ed è il motivo per cui esiste
  questo documento.

---

## Librerie di sviluppo

Astro, Tailwind CSS, sharp e le altre dipendenze dichiarate in `package.json`
hanno licenze proprie (MIT, Apache-2.0, ISC). Non vengono ridistribuite come
tali: entrano nel sito solo come risultato della compilazione. L'elenco completo
e aggiornato si ottiene con:

```bash
npx license-checker --summary
```
