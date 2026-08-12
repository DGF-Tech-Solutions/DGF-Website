# ============================================================================
# Immagine di VERIFICA del sito DGF.
#
# Compila il sito dentro un container Linux pulito, come fa GitHub Actions, e
# lo serve con nginx. Non è l'anteprima di tutti i giorni: quella è
# `npm run preview`, che monta la cartella dist/ del computer ed è immediata.
#
# Questa serve a una cosa sola, ma importante: accorgersi di dipendenze
# mancanti per Linux nel package-lock, un errore che sul computer non si vede
# e che fa fallire il deploy.
#
#   npm run verifica   ->  http://localhost:7001
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
