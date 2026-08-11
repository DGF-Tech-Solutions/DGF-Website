#!/usr/bin/env python
"""
Ritaglia lo sfondo delle illustrazioni recuperando gli originali da ComfyUI.

PERCHÉ ESISTE. La skill `comfy` usa `rembg`, che è addestrato su fotografie:
su un'illustrazione piatta segmenta male e lascia un alone. Sull'immagine del
monitor l'alone era un'ombra grigio-azzurra su tutto il perimetro, inutilizzabile.

COME FUNZIONA. Riempimento a partire dai BORDI: si parte dai pixel del
perimetro e ci si espande finché il colore cambia poco da un pixel al
successivo. Due proprietà che servono entrambe:

  - segue le sfumature, perché il confronto è col pixel vicino e non con un
    colore di riferimento fisso;
  - non tocca i bianchi INTERNI (lo schermo di un monitor, un foglio), perché
    non sono collegati al bordo. È esattamente il caso in cui `white_key`
    della skill bucava l'illustrazione.

Uso:
    python scripts/ritaglia.py                 # tutte le scene
    python scripts/ritaglia.py scena-progetti  # solo una
"""

from __future__ import annotations

import io
import json
import os
import sys
import urllib.parse
import urllib.request
from collections import deque

import numpy as np
from PIL import Image

SKILL = os.path.expanduser("~/.claude/skills/comfy")
sys.path.insert(0, SKILL)
import comfy_gen as cg  # noqa: E402

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module  # noqa: E402

gen = import_module("gen-illustrazioni".replace("-", "_")) if False else None

OUT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets", "illustrazioni")
)

# Tolleranza del riempimento: quanto può cambiare il colore da un pixel al
# successivo restando "sfondo".
#
# Trovata provando, e il margine è stretto: a 20 il riempimento "saltava"
# dentro gli elementi chiari del soggetto e si mangiava la scheda azzurra
# accanto al monitor; a 10 si ferma sul bordo e tiene tutto. Se un'immagine
# nuova mostra ancora un alone, meglio ritoccare il prompt che alzare questo
# numero.
TOLL = int(os.environ.get("RITAGLIO_TOLL", "10"))
# Rifinitura: i pixel rimasti quasi trasparenti sul bordo diventano
# completamente trasparenti, altrimenti restano come frangia biancastra.
SOGLIA_FRANGIA = 24


def ritaglia(png_bytes: bytes, toll: int = TOLL) -> bytes:
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape

    sfondo = np.zeros((h, w), dtype=bool)
    coda: deque[tuple[int, int]] = deque()

    # Semi: tutto il perimetro.
    for x in range(w):
        for y in (0, h - 1):
            if not sfondo[y, x]:
                sfondo[y, x] = True
                coda.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if not sfondo[y, x]:
                sfondo[y, x] = True
                coda.append((y, x))

    while coda:
        y, x = coda.popleft()
        c = a[y, x]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not sfondo[ny, nx]:
                if int(np.abs(a[ny, nx] - c).max()) <= toll:
                    sfondo[ny, nx] = True
                    coda.append((ny, nx))

    alpha = np.where(sfondo, 0, 255).astype(np.uint8)

    # Ammorbidisce il contorno di un pixel: senza, il bordo risulta seghettato.
    from PIL import ImageFilter

    am = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(am).copy()
    alpha[alpha < SOGLIA_FRANGIA] = 0

    out = np.dstack([np.asarray(im).astype(np.uint8), alpha])
    buf = io.BytesIO()
    Image.fromarray(out, "RGBA").save(buf, "PNG", optimize=True)
    return buf.getvalue()


def storia(base: str) -> list[tuple[str, str, str]]:
    """Restituisce (prompt_positivo, filename, subfolder) dalla cronologia."""
    raw = urllib.request.urlopen(f"{base}/history?max_items=200", timeout=30).read()
    data = json.loads(raw)
    fuori = []
    for entry in data.values():
        prompt_node = entry.get("prompt", [None, None, {}])[2]
        pos = ""
        if isinstance(prompt_node, dict):
            n4 = prompt_node.get("4", {})
            pos = (n4.get("inputs", {}) or {}).get("prompt", "") or ""
        for node in entry.get("outputs", {}).values():
            for img in node.get("images", []):
                fuori.append((pos, img["filename"], img.get("subfolder", "")))
    return fuori


def main() -> None:
    voluti = [a for a in sys.argv[1:] if not a.startswith("-")]

    # I soggetti li leggiamo dallo script di generazione, così restano in un
    # posto solo e non divergono.
    percorso_gen = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gen-illustrazioni.py")
    spazio: dict = {"__file__": percorso_gen, "__name__": "gen_illustrazioni"}
    with open(percorso_gen, encoding="utf-8") as fh:
        codice = fh.read()
    exec(compile(codice.split("def build(")[0], percorso_gen, "exec"), spazio)  # noqa: S102
    SCENA: dict[str, tuple[str, int]] = spazio["SCENA"]

    base = cg.discover(None)
    tutte = storia(base)
    print(f"[ritaglio] {len(tutte)} immagini in cronologia su {base}")

    for nome, (soggetto, _seed) in SCENA.items():
        if voluti and nome not in voluti:
            continue
        # La corrispondenza si fa sul soggetto, che compare dentro il prompt.
        chiave = soggetto[:60]
        trovate = [t for t in tutte if chiave in t[0]]
        if not trovate:
            print(f"[ritaglio] {nome}: originale non trovato in cronologia, salto")
            continue
        _, filename, subfolder = trovate[-1]  # la più recente

        q = urllib.parse.urlencode({"filename": filename, "subfolder": subfolder, "type": "output"})
        originale = urllib.request.urlopen(f"{base}/view?{q}", timeout=60).read()

        tagliata = ritaglia(originale)
        dest = os.path.join(OUT_DIR, f"{nome}.png")
        with open(dest, "wb") as fh:
            fh.write(tagliata)
        print(f"[ritaglio] {nome:20s} da {filename}  →  {len(tagliata)//1024} kB")

    print("[ritaglio] completato.")


if __name__ == "__main__":
    main()
