# kevinstruna.dev

Personal portfolio of **Kevin Struna** — software engineer and CS student at
Colorado State University, with six apps shipped to the App Store.

**Live site:** [kevinstruna.dev](https://kevinstruna.dev/)

## Stack

Deliberately simple: static HTML, hand-written CSS, and a little vanilla
JavaScript, hosted on GitHub Pages. No framework, no build pipeline, no
dependencies to rot.

- `css/` — modular stylesheets (`style.css` imports the rest); light/dark
  theming via CSS custom properties and `data-theme`
- `js/` — theme toggle (`theme.js`), back-to-top button (`layout.js`),
  page-specific scripts
- `img/` — optimized WebP/JPEG assets; App Store screenshots per app folder
- `tools/` — maintenance scripts (see below)

## Maintenance scripts

**`tools/sync_chrome.py`** — the nav, footer, and skip link are static HTML
generated into every page from this script (single source of truth). After
changing the chrome, run from the repo root:

```sh
python3 tools/sync_chrome.py
```

Don't hand-edit the markup between the `chrome:` comment markers in the HTML
files; the next sync overwrites it.

**`tools/make_og.py`** — regenerates the social share card
(`img/og-image.png`). Requires Pillow:

```sh
python3 -m venv .venv && .venv/bin/pip install pillow
.venv/bin/python tools/make_og.py
```

## Local development

No build step — serve the folder and go:

```sh
python3 -m http.server 8000
```

## License

Code is MIT licensed (see `LICENSE`). Content, images, and app assets are
© Kevin Struna.
