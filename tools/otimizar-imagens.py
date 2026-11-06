#!/usr/bin/env python3
"""
Gera as versões otimizadas (AVIF + WebP, 1x/2x/3x) das imagens do site.

Uso (na pasta do projeto):
    python3 tools/otimizar-imagens.py

Rode sempre que trocar:
  - assets/astronauta-hero.png  (PNG transparente, 2400px ou mais de largura)
  - assets/logo.png             (de preferência 1024px ou mais, quadrado)
  - fotos da galeria em assets/galeria/originais/*.jpg|png (opcional)

Requer Pillow com suporte a AVIF:  pip install "pillow>=11"
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
OUT = ASSETS / "img"
OUT.mkdir(exist_ok=True)


def export(src: Path, name: str, widths, q_webp=88, q_avif=70):
    im = Image.open(src).convert("RGBA")
    for w in widths:
        if w > im.width:
            print(f"  aviso: {src.name} tem {im.width}px; {w}px será ampliado (use um arquivo maior)")
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=q_webp, method=6)
        r.save(OUT / f"{name}-{w}.avif", "AVIF", quality=q_avif)
        print(f"  {name}-{w}.webp / .avif  ({w}x{h})")


print("Astronauta do hero:")
export(ASSETS / "astronauta-hero.png", "astronauta", [800, 1600, 2400])

print("Logo:")
export(ASSETS / "logo.png", "logo", [128, 256, 512], q_webp=92, q_avif=80)

orig = ASSETS / "galeria" / "originais"
if orig.exists():
    print("Galeria:")
    fotos = sorted(p for p in orig.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"})
    for i, p in enumerate(fotos, 1):
        im = Image.open(p).convert("RGB")
        if im.width > 1400:
            im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
        dest = ASSETS / "galeria" / f"{i:02d}.webp"
        im.save(dest, "WEBP", quality=84, method=6)
        print(f"  {p.name} -> {dest.name} ({im.width}x{im.height})  * atualize width/height no index.html")

print("Pronto!")
