#!/bin/sh
# ============================================================================
# Simula in locale quello che farà GitHub Actions al deploy.
#
# Perché esiste: la build gira su Ubuntu con la versione di Node indicata in
# .nvmrc, mentre lo sviluppo avviene su Windows. Le differenze fra i due
# ambienti — in particolare i binari nativi di sharp e del bundler — hanno
# già fatto fallire una build. Meglio scoprirlo qui che dopo un push.
#
# Uso:
#   docker run --rm -v "${PWD}:/src:ro" node:22-bookworm-slim sh /src/scripts/ci-check.sh
# ============================================================================
set -e

echo "== Simulazione GitHub Actions =="
echo "node $(node -v) / npm $(npm -v)"
echo ""

# Copia pulita, come farebbe actions/checkout
rm -rf /ci
mkdir -p /ci
cd /src
tar --exclude=node_modules --exclude=dist --exclude=.astro --exclude=.git -cf - . | (cd /ci && tar -xf -)
cd /ci

echo "-- npm ci --"
npm ci --no-audit --no-fund 2>&1 | tail -3
echo ""

echo "-- npm run build --"
npm run build 2>&1 | tail -4
echo ""

echo "-- verifica artefatto (gli stessi controlli del workflow) --"
for f in CNAME .nojekyll index.html 404.html sitemap-index.xml admin/index.html; do
  if [ -f "dist/$f" ]; then
    echo "  OK        dist/$f"
  else
    echo "  MANCANTE  dist/$f"
    exit 1
  fi
done
echo "  Pagine HTML generate: $(find dist -name '*.html' | wc -l)"
echo ""
echo "== La build passerebbe su GitHub Actions =="
