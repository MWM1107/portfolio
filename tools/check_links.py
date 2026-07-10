"""
Static integrity checks; CI runs this on every push (see
.github/workflows/check.yml), and it can run locally from the repo root:

    python3 tools/check_links.py

Checks: every local href/src/poster (and video-lightbox argument) resolves
to a real file, JSON-LD blocks parse, no page has duplicate element ids,
sitemap.xml entries map to real files and cover every indexable page, and
no image on disk is orphaned. Exits non-zero listing any problems.
"""
import glob
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

BASE = "https://kevinstruna.dev/"

# On disk but intentionally unreferenced by any page.
ORPHAN_ALLOWLIST = {
    "img/profile.png",  # source asset for tools/make_og.py
}


def local_path(url):
    """Map a URL to a repo-relative path, or None if it's external."""
    if url.startswith(BASE):
        url = url[len(BASE):]
    elif url.startswith(("http://", "https://", "mailto:", "#", "data:")):
        return None
    path = url.lstrip("/").split("#")[0].split("?")[0]
    return path or "index.html"


class IdCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = {}

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k == "id":
                self.ids[v] = self.ids.get(v, 0) + 1


def main():
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    pages = sorted(glob.glob("*.html"))
    issues = []
    referenced = set()

    for page in pages:
        html = open(page, encoding="utf-8").read()

        for attr, url in re.findall(r'(href|src|poster)="([^"]+)"', html):
            path = local_path(url)
            if path is None:
                continue
            referenced.add(path)
            if not os.path.exists(path):
                issues.append("{0}: broken {1} -> {2}".format(page, attr, url))

        # Absolute self-URLs in meta content (og:image, og:url, twitter:image, ...)
        for url in re.findall(r'content="({0}[^"]*)"'.format(re.escape(BASE)), html):
            path = local_path(url)
            referenced.add(path)
            if not os.path.exists(path):
                issues.append("{0}: broken meta content -> {1}".format(page, url))

        for args in re.findall(r"openVideoModal\(event,\s*'([^']+)'.*?'([^']+)'\)", html):
            for f in args:
                if "/" in f:
                    referenced.add(f)
                    if not os.path.exists(f):
                        issues.append("{0}: broken lightbox asset -> {1}".format(page, f))

        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
            try:
                json.loads(block)
            except ValueError as e:
                issues.append("{0}: invalid JSON-LD: {1}".format(page, e))

        collector = IdCollector()
        collector.feed(html)
        for element_id, count in collector.ids.items():
            if count > 1:
                issues.append("{0}: duplicate id '{1}' x{2}".format(page, element_id, count))

    for css in glob.glob("css/*.css"):
        text = open(css, encoding="utf-8").read()
        for url in re.findall(r'url\(["\']?([^)"\']+)["\']?\)', text):
            if url.startswith(("http", "data:")):
                continue
            path = os.path.normpath(os.path.join(os.path.dirname(css), url))
            referenced.add(path.replace(os.sep, "/"))
            if not os.path.exists(path):
                issues.append("{0}: broken url() -> {1}".format(css, url))

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    listed = set()
    try:
        for loc in ET.parse("sitemap.xml").getroot().findall(".//sm:loc", ns):
            path = local_path(loc.text.strip())
            listed.add(path)
            if not os.path.exists(path):
                issues.append("sitemap.xml: entry without a file -> {0}".format(loc.text))
    except ET.ParseError as e:
        issues.append("sitemap.xml: not well-formed: {0}".format(e))
    for page in set(pages) - listed - {"404.html"}:
        issues.append("sitemap.xml: indexable page missing -> {0}".format(page))

    orphans = ({f.replace(os.sep, "/") for f in glob.glob("img/**/*.*", recursive=True)}
               - referenced - ORPHAN_ALLOWLIST)
    for orphan in sorted(orphans):
        issues.append("orphaned image (unreferenced): {0}".format(orphan))

    if issues:
        print("{0} problem(s):".format(len(issues)))
        for issue in issues:
            print(" -", issue)
        sys.exit(1)
    print("all checks passed ({0} pages, {1} referenced assets)".format(len(pages), len(referenced)))


if __name__ == "__main__":
    main()
