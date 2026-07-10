"""
Regenerate sitemap.xml with lastmod dates.

lastmod is each page's last git commit date; a page with uncommitted changes
gets today's date (commit it the same day you run this). Priorities are
hand-tuned below. Run from the repo root after content changes:

    python3 tools/sync_sitemap.py
"""
import datetime
import os
import subprocess

BASE = "https://kevinstruna.dev/"

# (page, priority); index.html is listed as the bare domain
PAGES = [
    ("index.html", "1.0"),
    ("projects.html", "0.9"),
    ("kanacard.html", "0.8"),
    ("about.html", "0.8"),
    ("resume.html", "0.8"),
    ("contact.html", "0.7"),
    ("blog.html", "0.7"),
    ("apple-developer-fee.html", "0.6"),
    ("uses.html", "0.5"),
]


def lastmod(page):
    dirty = subprocess.run(["git", "status", "--porcelain", "--", page],
                           capture_output=True, text=True).stdout.strip()
    if dirty:
        return datetime.date.today().isoformat()
    committed = subprocess.run(["git", "log", "-1", "--format=%cs", "--", page],
                               capture_output=True, text=True).stdout.strip()
    return committed or datetime.date.today().isoformat()


def main():
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    urls = []
    for page, priority in PAGES:
        loc = BASE if page == "index.html" else BASE + page
        urls.append("  <url>\n"
                    "    <loc>{0}</loc>\n"
                    "    <lastmod>{1}</lastmod>\n"
                    "    <priority>{2}</priority>\n"
                    "  </url>".format(loc, lastmod(page), priority))
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(urls) + "\n</urlset>\n")
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(xml)
    print("wrote sitemap.xml ({0} urls)".format(len(urls)))


if __name__ == "__main__":
    main()
