/**
 * Genera le icone PNG del sito a partire da public/favicon.svg.
 *
 * Da rilanciare solo se cambia il favicon:
 *     node scripts/make-icons.mjs
 *
 * Le icone risultanti vengono committate in public/: non fanno parte della
 * build, così `npm run build` resta veloce e deterministico.
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public/favicon.svg"));

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(svg, { density: 512 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(root, "public", file));
  console.log(`OK  ${file}  ${size}x${size}`);
}
