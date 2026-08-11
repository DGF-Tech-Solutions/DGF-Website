#!/bin/sh
# ============================================================================
# Rigenera package-lock.json in modo che contenga i binari nativi di TUTTE le
# piattaforme, non solo di quella su cui gira chi lo genera.
#
# Il problema: npm scrive nel lock i pacchetti opzionali risolti nell'albero
# che vede. Un lock generato su Windows non contiene i binari Linux di sharp
# e rolldown, e `npm ci` su Linux — cioè dentro il container E su GitHub
# Actions — si rifiuta di partire con "Missing: ... from lock file".
#
# La trappola: non basta generarlo dentro un container Linux, perché se la
# cartella del progetto è montata npm trova il node_modules di Windows già
# presente e ci basa sopra la risoluzione. Per questo qui si lavora in una
# directory pulita, con il solo package.json.
#
# Uso:
#   docker run --rm -v "${PWD}:/app" -w /app node:22-bookworm-slim sh scripts/regen-lock.sh
# ============================================================================
set -e

WORK=/tmp/lockgen
rm -rf "$WORK"
mkdir -p "$WORK"
cp package.json "$WORK/"

cd "$WORK"
npm install --include=optional --package-lock-only --no-audit --no-fund >/dev/null 2>&1

cp "$WORK/package-lock.json" /app/package-lock.json
cd /app

echo "Generato con npm $(npm -v) su $(node -p 'process.platform + "/" + process.arch')"
echo ""
echo "--- binding rolldown (il bundler di Astro) ---"
grep -o '"node_modules/@rolldown/binding-[^"]*"' package-lock.json | sort -u || echo "NESSUNO"
echo ""
echo "--- binari sharp (ottimizzazione immagini) ---"
grep -o '"node_modules/@img/sharp-[a-z0-9_-]*"' package-lock.json | sort -u || echo "NESSUNO"
