#!/usr/bin/env python
"""
Genera le illustrazioni del sito DGF con ComfyUI.

Riusa la pipeline della skill `comfy` (Z-Image Turbo + Qwen CLIP), la stessa
con cui sono stati creati gli "omini" di Nexia, così i due siti parlano la
stessa lingua visiva. Due famiglie di immagini:

  FIGURE  (--set figure)  un professionista del software in varie pose.
                          Ritaglio aggressivo: nessun bianco legittimo nella
                          figura, quindi si toglie anche quello intrappolato
                          fra un braccio e il corpo.

  SCENE   (--set scena)   oggetti e situazioni: schermi, carrelli, grafici,
                          reti di nodi. Qui il bianco DENTRO l'immagine è
                          legittimo (schermi, fogli), quindi si rimuove solo
                          lo sfondo esterno.

Ogni render richiede qualche minuto: lo script mette tutto in coda e poi
aspetta, invece di generare uno alla volta.

Uso:
    python scripts/gen-illustrazioni.py                  # tutto ciò che manca
    python scripts/gen-illustrazioni.py --set scena      # solo le scene
    python scripts/gen-illustrazioni.py hero app         # solo alcune
    python scripts/gen-illustrazioni.py --force          # rigenera tutto
"""

from __future__ import annotations

import os
import sys
import time
import random

SKILL = os.path.expanduser("~/.claude/skills/comfy")
sys.path.insert(0, SKILL)

import comfy_gen as cg  # noqa: E402

OUT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets", "illustrazioni")
)

# ── Ricetta FIGURE ─────────────────────────────────────────────────────────
# Derivata dagli omini Nexia: stesso stile, ma il soggetto è un professionista
# del software e la camicia è cyan del brand invece che teal.
FIG_PREFIX = (
    "flat vector editorial illustration in corporate memphis humaaans style, "
    "a professional software developer standing "
)
FIG_SUFFIX = (
    ", navy blue blazer and trousers with a cyan shirt, natural skin tone, "
    "simple minimal facial features with subtle eyes and a friendly smile, "
    "subtle grain texture shading, plain solid white background, modern clean "
    "professional editorial illustration, full body from head to shoes, "
    "centered single person"
)
FIG_NEGATIVE = (
    "ugly, deformed hands, extra fingers, mutated hands, extra limbs, "
    "distorted face, cropped head, blurry, low quality, photo, realistic 3d, "
    "watermark, text, cluttered, extra people, red, pink, orange, purple, "
    "background scenery, buildings, city"
)

# ── Ricetta SCENE ──────────────────────────────────────────────────────────
# Niente persone: oggetti e diagrammi, con la palette del brand imposta.
SCN_PREFIX = "flat vector editorial illustration in corporate memphis style, "
SCN_SUFFIX = (
    ", color palette strictly limited to deep navy blue, medium blue, bright "
    "cyan, pale ice blue and white, soft rounded geometric shapes, subtle "
    "grain texture shading, plain solid white background, centered composition, "
    "modern clean professional editorial illustration, generous negative space"
)
SCN_NEGATIVE = (
    "text, letters, words, numbers, watermark, logo, ui labels, "
    "red, pink, orange, purple, yellow, green, brown, "
    "photo, realistic 3d, gradient mesh, cluttered, busy, noisy, "
    "people, faces, hands, blurry, low quality"
)

WIDTH, HEIGHT = 896, 1152
SCENE_W, SCENE_H = 1152, 896  # le scene stanno meglio in orizzontale

# nome -> (posa, seed)
FIGURE: dict[str, tuple[str, int]] = {
    "hero":      ("presenting with one open hand, confident and friendly, welcoming gesture", 4471),
    "siti-web":  ("gesturing toward a simple rectangular browser window shape", 8812),
    "ecommerce": ("holding a simple shopping bag in one hand", 2394),
    "app":       ("holding a smartphone with both hands, looking at the screen", 7156),
    "software":  ("gesturing toward a simple rectangular dashboard panel shape", 3620),
    "ai":        ("gesturing toward a simple glowing geometric sphere", 9047),
    "chi-siamo": ("with arms crossed, confident and approachable", 5583),
    "contatti":  ("wearing a headset with a microphone, waving hello", 1268),
    "processo":  ("holding a clipboard and pointing forward", 6710),
    "garanzie":  ("giving a thumbs up, reassuring smile", 4029),
}

# nome -> (soggetto, seed)
SCENA: dict[str, tuple[str, int]] = {
    "scena-blog": (
        "an open laptop seen from above on a desk, next to a coffee cup and a "
        "small stack of paper sheets, and a pencil",
        3311,
    ),
    "scena-progetti": (
        "a desktop computer monitor displaying an abstract website layout made "
        "of simple blocks, with two small floating rounded cards beside it",
        7742,
    ),
    "scena-siti-web": (
        "a browser window frame containing a simple abstract webpage layout of "
        "rounded blocks, with a mouse cursor arrow",
        5129,
    ),
    "scena-ecommerce": (
        "a shopping cart with two stacked parcel boxes inside and a credit card "
        "floating beside it",
        6480,
    ),
    "scena-app": (
        "two smartphones side by side at slightly different heights, each "
        "showing a simple abstract app interface of rounded blocks",
        2957,
    ),
    "scena-software": (
        "a dashboard interface panel with a simple bar chart, a line chart and "
        "a small data table, made of rounded blocks",
        8065,
    ),
    # NB: il primo tentativo era "rete di nodi collegati da linee sottili".
    # Non funziona: le linee sono troppo fini e il ritaglio dello sfondo se le
    # mangia, lasciando in pagina un cerchio blu solo. Per questa pipeline i
    # soggetti devono avere MASSA — forme piene e tratti spessi.
    "scena-ai": (
        "a large rounded square microchip seen from above with thick connector "
        "pins on all four sides, and three small rounded squares floating around it",
        7391,
    ),
    "scena-contatti": (
        "an open envelope with a rounded speech bubble rising out of it",
        9614,
    ),
    "scena-processo": (
        "a horizontal roadmap path with four round milestone markers along it, "
        "each with a simple check mark",
        1873,
    ),
    "scena-sicurezza": (
        "a rounded shield with a check mark inside, next to a closed padlock",
        5506,
    ),
}


def build(name: str, kind: str) -> tuple[str, str, int, int, int, int, bool]:
    """Restituisce (positivo, negativo, w, h, seed, steps, white_key)."""
    if kind == "figure":
        pose, seed = FIGURE[name]
        return FIG_PREFIX + pose + FIG_SUFFIX, FIG_NEGATIVE, WIDTH, HEIGHT, seed, 9, True
    subject, seed = SCENA[name]
    # white_key=False: negli schermi e nei fogli il bianco è parte del disegno,
    # toglierlo bucherebbe l'illustrazione.
    return SCN_PREFIX + subject + SCN_SUFFIX, SCN_NEGATIVE, SCENE_W, SCENE_H, seed, 8, False


def main() -> None:
    argv = sys.argv[1:]
    force = "--force" in argv
    only = None
    if "--set" in argv:
        only = argv[argv.index("--set") + 1]
    names = [a for a in argv if not a.startswith("--") and a not in ("figure", "scena")]

    catalog: list[tuple[str, str]] = []
    if only in (None, "figure"):
        catalog += [(n, "figure") for n in FIGURE]
    if only in (None, "scena"):
        catalog += [(n, "scena") for n in SCENA]
    if names:
        catalog = [(n, k) for n, k in catalog if n in names]
        unknown = set(names) - {n for n, _ in catalog}
        if unknown:
            sys.exit(f"Nomi sconosciuti: {', '.join(sorted(unknown))}")

    base = cg.discover(None)
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"[dgf] ComfyUI su {base}", flush=True)

    todo = []
    for name, kind in catalog:
        out = os.path.join(OUT_DIR, f"{name}.png")
        if os.path.exists(out) and not force:
            print(f"[dgf] {name}: già presente, salto", flush=True)
            continue
        todo.append((name, kind, out))

    if not todo:
        print("[dgf] niente da generare.", flush=True)
        return

    queued = []
    for name, kind, out in todo:
        pos, neg, w, h, seed, steps, wkey = build(name, kind)
        wf = cg.build_workflow(pos, neg, w, h, seed, steps=steps)
        pid = cg.queue(base, wf, f"dgf-{random.randint(1000, 999999)}")
        queued.append((name, out, pid, wkey))
        print(f"[dgf] in coda  {name:18s} {kind:7s} seed={seed}", flush=True)

    print(f"\n[dgf] {len(queued)} render in coda, attendo...\n", flush=True)
    for name, out, pid, wkey in queued:
        t0 = time.time()
        try:
            fn, sub, ftype = cg.wait_for_image(base, pid, timeout_s=1800)
        except SystemExit as exc:
            print(f"[dgf] {name}: FALLITO — {exc}", flush=True)
            continue
        cg.download(base, fn, sub, ftype, out, transparent=True, white_key=wkey)
        kb = os.path.getsize(out) // 1024
        print(f"[dgf] fatto   {name:18s} {kb:4d} kB  ({time.time() - t0:.0f}s)", flush=True)

    print("\n[dgf] completato.", flush=True)


if __name__ == "__main__":
    main()
