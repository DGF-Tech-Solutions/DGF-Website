# ============================================================================
# Immagine di ANTEPRIMA del sito DGF.
#
# Compila il sito e lo serve con nginx configurato come GitHub Pages: è il
# modo più fedele di vedere cosa succederà online prima di pubblicare.
#
#   docker compose up preview   ->  http://localhost:8080
#
# Nota: questa immagine NON serve al deploy. Il deploy vero lo fa GitHub
# Actions, che compila e carica la cartella dist/ su Pages. Questo container
# esiste per il test locale.
# ============================================================================

# ── Fase 1: build ───────────────────────────────────────────────────────────
# Debian slim e non Alpine: sharp (l'ottimizzatore di immagini) ha i binari
# precompilati per glibc, e su musl dovrebbe ricompilarli.
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Prima solo i manifest: se le dipendenze non cambiano, Docker riusa questo
# strato e salta l'installazione.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Fase 2: servizio ────────────────────────────────────────────────────────
FROM nginx:1.29-alpine AS preview

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1 e non "localhost": dentro il container il nome risolve prima su
# IPv6 (::1), dove nginx non ascolta, e il controllo fallirebbe segnalando
# "unhealthy" un sito che invece funziona.
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
