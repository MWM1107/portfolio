"""
Generate the 1200x630 social share image at img/og-image.png.

Apple-style card: gradient background + soft blue glow, circular profile photo,
name/title, tagline, and a row of the six real App Store icons.

Everything is rendered at SS times the final size and downscaled once with
LANCZOS, so all mask edges (rounded icon corners, the circular photo) and text
are antialiased.

Run from the repo root:  python tools/make_og.py
Requires Pillow (PIL).
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

W, H = 1200, 630
SS = 3                      # supersample factor for antialiasing
WW, WH = W * SS, H * SS
PAD_L, PAD_T = 72, 66

ICON_DIRS = [
    "rogue-roll-dice-deck-builder",
    "kodou-memory-grid-game",
    "type-kana",
    "wordly-puzzle-game-solver",
    "stock-market-sim",
    "idea-vault-notes-journal",
]


def s(v):
    """Scale a design-space value into supersampled pixels."""
    return round(v * SS)


def font(weight, size):
    """Load a font by weight ('bold' or 'semibold'), per-platform.

    On macOS uses the San Francisco variable font (closest to the site's
    -apple-system stack); on Windows falls back to Segoe UI."""
    if sys.platform == "darwin":
        f = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", s(size))
        f.set_variation_by_name("Bold" if weight == "bold" else "Semibold")
        return f
    name = "segoeuib.ttf" if weight == "bold" else "seguisb.ttf"
    return ImageFont.truetype("C:/Windows/Fonts/" + name, s(size))


def gradient_bg():
    top, bottom = (255, 255, 255), (242, 242, 246)
    img = Image.new("RGB", (WW, WH))
    d = ImageDraw.Draw(img)
    for y in range(WH):
        t = y / (WH - 1)
        d.line(
            [(0, y), (WW, y)],
            fill=tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )
    img = img.convert("RGBA")
    # Soft blue glow, top-right
    glow = Image.new("RGBA", (WW, WH), (0, 0, 0, 0))
    cx, cy, r = s(1060), s(-40), s(520)
    ImageDraw.Draw(glow).ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 122, 255, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(s(120)))
    return Image.alpha_composite(img, glow)


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0], size[1]], radius=radius, fill=255)
    return m


def circle_mask(size):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).ellipse([0, 0, size[0], size[1]], fill=255)
    return m


def shadow(base, box, radius, blur, alpha, dy):
    """Composite a soft drop shadow for a rounded box (work-space coords)."""
    layer = Image.new("RGBA", (WW, WH), (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    ImageDraw.Draw(layer).rounded_rectangle(
        [x0, y0 + dy, x1, y1 + dy], radius=radius, fill=(0, 0, 0, alpha)
    )
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(base, layer)


def main():
    img = gradient_bg()

    # --- Profile photo (circular, white ring) ---
    photo_d, ring = s(188), s(6)
    px, py = s(PAD_L), s(PAD_T)
    img = shadow(img, (px, py, px + photo_d, py + photo_d), photo_d // 2, s(26), 70, s(16))

    src = ImageOps.fit(Image.open("img/profile.png").convert("RGBA"), (photo_d, photo_d), Image.LANCZOS)
    disc = Image.new("RGBA", (photo_d + ring * 2, photo_d + ring * 2), (255, 255, 255, 255))
    disc.putalpha(circle_mask(disc.size))
    disc.paste(src, (ring, ring), circle_mask((photo_d, photo_d)))
    img.alpha_composite(disc, (px - ring, py - ring))

    # --- Name / title ---
    draw = ImageDraw.Draw(img)
    tx = px + photo_d + s(40)
    draw.text((tx, py + s(18)), "Kevin Struna", font=font("bold", 82), fill=(29, 29, 31))
    draw.text((tx, py + s(116)), "Software Engineer", font=font("semibold", 38), fill=(0, 122, 255))

    # --- URL, top-right ---
    draw.text((WW - s(PAD_L), s(64)), "kevinstruna.dev", font=font("semibold", 26),
              fill=(134, 134, 139), anchor="ra")

    # --- Tagline ---
    draw.text((s(PAD_L), s(372)), "Six apps on the App Store. Built with Swift & SwiftUI.",
              font=font("semibold", 36), fill=(58, 58, 60))

    # --- App icon row ---
    size, gap, radius = s(108), s(22), s(25)
    y = WH - s(PAD_T) - size + s(6)
    for i, d in enumerate(ICON_DIRS):
        ic = ImageOps.fit(Image.open(f"img/{d}/icon.webp").convert("RGBA"), (size, size), Image.LANCZOS)
        x = s(PAD_L) + i * (size + gap)
        img = shadow(img, (x, y, x + size, y + size), radius, s(14), 55, s(12))
        img.paste(ic, (x, y), rounded_mask((size, size), radius))

    out = img.convert("RGB").resize((W, H), Image.LANCZOS)
    out.save("img/og-image.png", "PNG")
    print("wrote img/og-image.png", out.size, "(rendered at", f"{WW}x{WH})")


if __name__ == "__main__":
    main()
