#!/usr/bin/env python
"""
Generatore di immagini di marca su ComfyUI.

Perche' non lo script della skill `comfy`: quello e' tarato sulle illustrazioni
piatte (stile memphis) e ha un'attesa corta. Qui servono foto, quindi prompt
grezzi, e le attese sono lunghe perche' il modello va caricato una volta sola.

Uso:
    python brand/gen.py brand/jobs/<file>.json

Ogni job del JSON:
    {"name": "ufficio-01", "prompt": "...", "seed": 101,
     "width": 1152, "height": 896, "steps": 8, "out": "brand/render/..."}

Le immagini gia' presenti su disco non vengono rigenerate: il file si puo'
rilanciare dopo un'interruzione senza rifare tutto da capo.
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.request

BASE = os.environ.get("COMFY_URL", "http://127.0.0.1:8188")

UNET = "z_image_turbo_bf16.safetensors"
CLIP = "qwen_3_4b.safetensors"
VAE = "ae.safetensors"

# Tutto cio' che nelle immagini di marca non deve esserci. Il primo blocco
# tiene lontano il disegno, il secondo le facce sbagliate, il terzo l'aspetto
# "stock photo" da banca immagini.
NEGATIVE = (
    "cartoon, illustration, vector art, flat design, anime, painting, sketch, "
    "3d render, cgi, video game, plastic skin, waxy skin, "
    "distorted face, deformed hands, extra fingers, "
    # Il modello, lasciato libero, riempie schermi e fogli di lettere finte:
    # da vicino si legge che sono scarabocchi e l'immagine perde credibilita'.
    "text, watermark, logo, signature, caption, "
    "letters, words, writing, typography, gibberish text, fake brand logo, "
    "readable user interface labels, menu bar with text, "
    "oversaturated, hdr, heavy vignette, lens flare, cluttered, messy"
)


def build_workflow(prompt: str, seed: int, width: int, height: int, steps: int) -> dict:
    """Grafo Z-Image Turbo, lo stesso della skill comfy ma con prompt grezzo."""
    return {
        "1": {"class_type": "UNETLoader",
              "inputs": {"unet_name": UNET, "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": CLIP, "type": "qwen_image"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "TextEncodeZImageOmni",
              "inputs": {"clip": ["2", 0], "prompt": prompt, "auto_resize_images": False}},
        "5": {"class_type": "TextEncodeZImageOmni",
              "inputs": {"clip": ["2", 0], "prompt": NEGATIVE, "auto_resize_images": False}},
        "6": {"class_type": "EmptySD3LatentImage",
              "inputs": {"width": width, "height": height, "batch_size": 1}},
        "7": {"class_type": "ModelSamplingAuraFlow",
              "inputs": {"model": ["1", 0], "shift": 3.0}},
        "8": {"class_type": "KSampler",
              "inputs": {"model": ["7", 0], "positive": ["4", 0], "negative": ["5", 0],
                         "latent_image": ["6", 0], "seed": seed, "steps": steps,
                         "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple",
                         "denoise": 1.0}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "SaveImage",
               "inputs": {"images": ["9", 0], "filename_prefix": "dgf"}},
    }


def post(path: str, payload: dict) -> dict:
    req = urllib.request.Request(
        f"{BASE}{path}", data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def get(path: str) -> dict:
    with urllib.request.urlopen(f"{BASE}{path}", timeout=60) as r:
        return json.load(r)


def wait_for(prompt_id: str, timeout: int = 900) -> dict | None:
    """Il primo render paga il caricamento del modello: qui si aspetta davvero."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        hist = get(f"/history/{prompt_id}")
        if prompt_id in hist:
            return hist[prompt_id]
        time.sleep(3)
    return None


def save_output(entry: dict, out_path: str) -> bool:
    for node in entry.get("outputs", {}).values():
        for img in node.get("images", []):
            qs = urllib.parse.urlencode({
                "filename": img["filename"],
                "subfolder": img.get("subfolder", ""),
                "type": img.get("type", "output"),
            })
            with urllib.request.urlopen(f"{BASE}/view?{qs}", timeout=120) as r:
                data = r.read()
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "wb") as fh:
                fh.write(data)
            return True
    return False


def main() -> int:
    import urllib.parse as _up  # noqa: F401  (usato in save_output via urllib.parse)

    jobs = json.load(open(sys.argv[1], encoding="utf-8"))
    done = 0
    for job in jobs:
        out = job["out"]
        if os.path.exists(out):
            print(f"[skip] {out} c'e' gia'")
            continue
        started = time.time()
        wf = build_workflow(
            job["prompt"], job.get("seed", 0),
            job.get("width", 1152), job.get("height", 896), job.get("steps", 8))
        pid = post("/prompt", {"prompt": wf})["prompt_id"]
        print(f"[queue] {job['name']} -> {pid}", flush=True)
        entry = wait_for(pid)
        if entry is None:
            print(f"[FAIL] {job['name']}: scaduto il tempo di attesa")
            continue
        if save_output(entry, out):
            done += 1
            print(f"[ok] {out}  ({time.time() - started:.0f}s)", flush=True)
        else:
            print(f"[FAIL] {job['name']}: nessuna immagine nel risultato")
    print(f"\nFatte {done}/{len(jobs)}")
    return 0


if __name__ == "__main__":
    import urllib.parse
    sys.exit(main())
