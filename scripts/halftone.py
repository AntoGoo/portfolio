"""Régénère le portrait du Hero en trame de points (halftone) à partir de portrait.webp.

Usage : uv run --with pillow --with numpy python3 scripts/halftone.py
        uv run --with pillow --with numpy python3 scripts/halftone.py --steps 3,4,5 --color "#4387f4" --gray "#9299aa"
"""
import argparse

import numpy as np
from PIL import Image, ImageDraw

# Bleu principal (--primary: 217 89% 61%) et gris neutre (--muted-foreground: 218 12% 62%)
# du thème, dans src/index.css, convertis en RGB.
DEFAULT_COLOR = (67, 135, 244)
DEFAULT_GRAY = (146, 155, 170)

SUPERSAMPLE = 4
RETINA = 2
MIN_RADIUS = 0.4
# Le rayon suit la luminance brute (cf. docstring), mais la couleur suit une courbe plus
# raide : sans ça, les tons moyens virent déjà au bleu et le dégradé ne se voit pas.
COLOR_GAMMA = 5
# Taille des blocs (en px source) qui tirent chacun l'un des --steps. Elle doit rester >= au
# plus grand step mélangé : sinon ce step déborderait de son propre bloc sur les voisins.
BLOCK_SIZE = 5


def parse_color(value):
    value = value.lstrip("#")
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def build_halftone(source, steps, gray, color, seed):
    rgba = np.asarray(source.convert("RGBA"), dtype=np.float64)
    height, width, _ = rgba.shape
    alpha = rgba[:, :, 3] / 255.0
    luminance = (0.2126 * rgba[:, :, 0] + 0.7152 * rgba[:, :, 1] + 0.0722 * rgba[:, :, 2]) / 255.0

    scale = SUPERSAMPLE * RETINA
    canvas = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    # Mélange par petits blocs : chaque bloc (BLOCK_SIZE source px) tire au hasard l'un des
    # steps et se subdivise en cellules de cette taille (dernière cellule du bloc raccourcie
    # si ça ne tombe pas juste, comme au bord de l'image). Des blocs plus grands que le plus
    # grand step feraient un patchwork visible ; plus petits, le mélange reste discret.
    block_size = BLOCK_SIZE
    rng = np.random.default_rng(seed)
    block_rows = (height + block_size - 1) // block_size
    block_cols = (width + block_size - 1) // block_size

    for bj in range(block_rows):
        by0, by1 = bj * block_size, min((bj + 1) * block_size, height)
        for bi in range(block_cols):
            bx0, bx1 = bi * block_size, min((bi + 1) * block_size, width)
            step = int(rng.choice(steps))
            sub_rows = -(-(by1 - by0) // step)
            sub_cols = -(-(bx1 - bx0) // step)
            for sj in range(sub_rows):
                y0, y1 = by0 + sj * step, min(by0 + (sj + 1) * step, by1)
                for si in range(sub_cols):
                    x0, x1 = bx0 + si * step, min(bx0 + (si + 1) * step, bx1)
                    cell_alpha = alpha[y0:y1, x0:x1]
                    mean_alpha = cell_alpha.mean()
                    if mean_alpha <= 0:
                        continue
                    cell_lum = luminance[y0:y1, x0:x1]
                    mean_lum = (cell_lum * cell_alpha).sum() / cell_alpha.sum()
                    radius = (step / 2) * mean_lum * mean_alpha
                    if radius < MIN_RADIUS:
                        continue
                    color_t = mean_lum ** COLOR_GAMMA
                    dot_color = tuple(round(g + (b - g) * color_t) for g, b in zip(gray, color))
                    cx = (x0 + (x1 - x0) / 2) * scale
                    cy = (y0 + (y1 - y0) / 2) * scale
                    r = radius * scale
                    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=dot_color + (255,))

    # Downscale par moyenne (facteur SUPERSAMPLE) sur alpha prémultiplié, canal par canal
    # via Image.reduce (implémentation C, peu gourmande en mémoire) : évite les liserés de
    # couleur d'un redimensionnement classique sur du RGBA transparent, et les tableaux
    # numpy géants (le canevas suréchantillonné fait plusieurs dizaines de Mpx).
    r, g, b, a = canvas.split()
    del canvas
    a_frac = np.asarray(a, dtype=np.float32) / 255.0
    premultiplied = []
    for channel in (r, g, b):
        c_arr = np.asarray(channel, dtype=np.float32) * a_frac
        premultiplied.append(Image.fromarray(np.clip(c_arr, 0, 255).astype(np.uint8), mode="L"))
        del c_arr
    del a_frac

    factor = SUPERSAMPLE
    pr, pg, pb = (channel.reduce(factor) for channel in premultiplied)
    a_small = a.reduce(factor)

    alpha_small = np.asarray(a_small, dtype=np.float32)
    denom = np.maximum(alpha_small / 255.0, 1e-6)
    channels_out = []
    for channel in (pr, pg, pb):
        c_arr = np.asarray(channel, dtype=np.float32) / denom
        channels_out.append(Image.fromarray(np.clip(c_arr, 0, 255).astype(np.uint8), mode="L"))
    return Image.merge("RGBA", (*channels_out, a_small))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="public/images/portrait.webp")
    parser.add_argument("--output", default="public/images/portrait-dots.webp")
    parser.add_argument("--steps", default="3,4,5", help="Pas mélangés par blocs, séparés par des virgules.")
    parser.add_argument("--seed", type=int, default=0, help="Graine du tirage aléatoire des blocs.")
    parser.add_argument("--color", default="#{:02x}{:02x}{:02x}".format(*DEFAULT_COLOR))
    parser.add_argument("--gray", default="#{:02x}{:02x}{:02x}".format(*DEFAULT_GRAY))
    args = parser.parse_args()

    steps = [int(s) for s in args.steps.split(",")]
    color = parse_color(args.color)
    gray = parse_color(args.gray)
    source = Image.open(args.input)
    result = build_halftone(source, steps, gray, color, args.seed)
    result.save(args.output, "WEBP", quality=90)
    print(f"{args.output} : {result.size[0]}x{result.size[1]} px")


if __name__ == "__main__":
    main()
