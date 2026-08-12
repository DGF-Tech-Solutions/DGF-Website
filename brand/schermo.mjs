/**
 * Incolla una schermata vera dentro allo schermo di una foto generata.
 *
 * Perche': il modello non sa scrivere. Lasciato libero riempie i monitor di
 * lettere inventate; imbavagliato li lascia bianchi, e uno schermo spento su
 * una scrivania e' la cosa che piu' di ogni altra fa dire "e' finta".
 *
 * La via d'uscita e' quella di un vero servizio fotografico: si fotografa lo
 * schermo neutro e ci si mette dentro il prodotto in post-produzione. Qui il
 * prodotto e' Nexia Home, che esiste davvero — quindi l'immagine finale mostra
 * software vero, non un'invenzione.
 *
 * Le foto sorgente vanno scattate (cioe' generate) con il portatile frontale e
 * lo schermo bianco: cosi' l'area e' quasi un rettangolo e basta un
 * ridimensionamento, senza raddrizzamenti prospettici.
 *
 * Uso: node brand/schermo.mjs
 */

import sharp from "sharp";
import { resolve } from "node:path";

/** Angoli dell'area bianca dello schermo, misurati sulla foto sorgente. */
const LAVORI = [
  {
    foto: "brand/render/06-prova-vera/V3-monitor-frontale.png",
    schermata: "src/assets/mockups/nexia.webp",
    out: "brand/render/08-schermi/V3-con-nexia.png",
    area: { left: 297, top: 129, width: 574, height: 349 },
  },
];

for (const { foto, schermata, out, area } of LAVORI) {
  const base = sharp(resolve(foto));

  /* La schermata va adattata all'area e poi spenta un po': un rettangolo
     stampato a piena forza sopra una foto si vede che e' incollato. Un velo
     di luminosita' in meno e un soffio di sfocatura la fanno appartenere
     alla stessa inquadratura. */
  const dentro = await sharp(resolve(schermata))
    .resize(area.width, area.height, { fit: "cover" })
    .modulate({ brightness: 1.04, saturation: 0.92 })
    .blur(0.4)
    .toBuffer();

  await base
    .composite([{ input: dentro, left: area.left, top: area.top, blend: "over" }])
    .toFile(resolve(out));

  console.log(`${out}  <- ${schermata} dentro ${foto}`);
}
