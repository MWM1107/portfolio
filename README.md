# kevinstruna.dev

Personal portfolio of **Kevin Struna**, software engineer and CS student at
Colorado State University, with six apps shipped to the App Store.

**Live site:** [kevinstruna.dev](https://kevinstruna.dev/)

## Stack

Deliberately simple: static HTML, hand-written CSS, and a little vanilla
JavaScript, hosted on GitHub Pages. No framework, no build pipeline, no
dependencies to rot.

- `css/`: modular stylesheets, linked per page in cascade order by
  `tools/sync_chrome.py`; light/dark theming via CSS custom properties
  and `data-theme`
- `js/`: theme toggle (`theme.js`), back-to-top button (`layout.js`),
  page-specific scripts
- `img/`: optimized WebP/JPEG assets; App Store screenshots per app folder
- `tools/`: maintenance scripts (see below)

## Maintenance scripts

**`tools/sync_chrome.py`**: the shared chrome is static HTML generated into
every page from this script (single source of truth): the head block (theme
colors, icons, stylesheet links, script tags), the nav, the footer, and the
skip link. After changing the chrome, run from the repo root:

```sh
python3 tools/sync_chrome.py
```

Don't hand-edit the markup between the `chrome:` comment markers in the HTML
files; the next sync overwrites it. The script also stamps every local
css/js URL with a short content hash (`?v=...`), so a changed asset always
busts Cloudflare's four-hour browser cache.

**`tools/sync_stats.py`**: the App Store ratings and download counts shown
on the index and projects cards live in one `STATS` dict here. Edit the
numbers, then:

```sh
python3 tools/sync_stats.py
```

**`tools/sync_sitemap.py`**: regenerates `sitemap.xml` with `lastmod` dates
taken from each page's git history. Run it after content changes, in the
same commit.

**`tools/check_links.py`**: static integrity checks: broken refs, orphaned
images, JSON-LD validity, duplicate ids, sitemap coverage. CI runs it on
every push, plus a drift check that the generated chrome and stats match
the committed HTML (`.github/workflows/check.yml`).

**`tools/make_og.py`**: regenerates the social share card
(`img/og-image.png`). Requires Pillow:

```sh
python3 -m venv .venv && .venv/bin/pip install pillow
.venv/bin/python tools/make_og.py
```

## Local development

No build step. Serve the folder and go:

```sh
python3 -m http.server 8000
```

## License

Code is MIT licensed (see `LICENSE`). Content, images, and app assets are
© Kevin Struna.
