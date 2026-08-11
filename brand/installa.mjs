/**
 * Porta i render scelti dentro al sito.
 *
 * I PNG che escono da ComfyUI pesano mezzo mega l'uno: dentro al repository
 * sarebbero sette mega di roba che Astro ricomprime comunque a ogni build.
 * Qui si convertono una volta sola in webp di qualita' alta, e nel repository
 * finisce solo quello.
 *
 * La mappa e' esplicita, nome di render -> nome nel sito: chi legge capisce
 * quale foto sta in quale pagina senza aprire le pagine.
 *
 * Uso: node brand/installa.mjs
 */

import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SRC = "brand/render";
const DEST = "src/assets/foto";

/** [file di origine, nome nel sito, dove si vede] */
const SCELTE = [
  ["02-serie-A/siti-web-a.png", "siti-web", "servizi/siti-web"],
  ["02-serie-A/ecommerce-a.png", "ecommerce", "servizi/ecommerce"],
  ["02-serie-A/app-a.png", "app", "servizi/app"],
  ["03-ascolto/software-a2.png", "software", "servizi/software-su-misura"],
  ["02-serie-A/ai-b.png", "ai", "servizi/intelligenza-artificiale"],
  ["03-ascolto/servizi-generali-a.png", "servizi", "servizi (elenco)"],
  ["02-serie-A/progetti-a.png", "progetti", "portfolio (elenco)"],
  ["02-serie-A/blog-a.png", "blog", "blog (elenco)"],
  ["02-serie-A/chi-siamo-b.png", "chi-siamo", "chi siamo"],
  ["02-serie-A/processo-a.png", "processo", "chi siamo (secondo blocco)"],
  // La silhouette al telefono e' l'immagine piu' forte del gruppo: sta in
  // testa alla pagina dei contatti, non ridotta a decorazione da 180 px.
  ["02-serie-A/contatti-a.png", "contatti", "contatti"],
  ["03-ascolto/ascolto-c.png", "ascolto", "come lavoriamo"],
  ["04-metodo/metodo-01-ascolto.png", "fase-1-ascolto", "home, metodo"],
  ["04-metodo/metodo-02-proposta.png", "fase-2-proposta", "home, metodo"],
  ["04-metodo/metodo-03-costruzione.png", "fase-3-costruzione", "home, metodo"],
  ["04-metodo/metodo-04-consegna.png", "fase-4-consegna", "home, metodo"],
];

const esiste = async (p) => access(p).then(() => true).catch(() => false);

let fatte = 0;
const mancanti = [];

for (const [origine, nome, dove] of SCELTE) {
  const src = resolve(SRC, origine);
  if (!(await esiste(src))) {
    mancanti.push(`${origine} (serve per ${dove})`);
    continue;
  }
  const out = resolve(DEST, `${nome}.webp`);
  await mkdir(dirname(out), { recursive: true });
  const info = await sharp(src).webp({ quality: 82 }).toFile(out);
  console.log(`${nome}.webp  ${(info.size / 1024).toFixed(0)} kB  <- ${origine}`);
  fatte++;
}

console.log(`\nInstallate ${fatte} su ${SCELTE.length}.`);
if (mancanti.length) {
  console.log("Non ancora generate:");
  for (const m of mancanti) console.log(`  - ${m}`);
  process.exitCode = 1;
}
