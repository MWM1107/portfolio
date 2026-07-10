"""
Single source of truth for the App Store metrics shown on product cards
(star rating + downloads). The same numbers appear on index.html and
projects.html; edit STATS here, then run from the repo root:

    python3 tools/sync_stats.py

Policy: rating None means the app has no public rating yet, downloads None
means the figure isn't strong enough to show. Both render as invisible
placeholders that keep card heights aligned (see .is-placeholder in
components.css). Platforms stay hand-authored in the HTML.
"""
import glob
import os
import re

STATS = {
    "KanaCard":         {"rating": None, "downloads": None},
    "Rogue Roll":       {"rating": 5.0,  "downloads": None},
    "Stock Market Sim": {"rating": 5.0,  "downloads": "2.36K"},
    "Kodou":            {"rating": 5.0,  "downloads": None},
    "Type Kana":        {"rating": 5.0,  "downloads": "452"},
    "Wordly":           {"rating": 5.0,  "downloads": None},
    "Idea Vault":       {"rating": 5.0,  "downloads": None},
}

FILES = ["index.html", "projects.html"]

META_BLOCK = re.compile(
    r'(?P<indent>[ ]*)<div class="app-meta">\n(?P<body>.*?)(?P<tail>[ ]*<div class="app-platforms">)',
    re.S,
)
H3 = re.compile(r"<h3>([^<]+)</h3>")


def rating_html(i1, i2, rating):
    if rating is None:
        head = i1 + '<span class="app-rating is-placeholder" aria-hidden="true">\n'
        stars = i2 + '<span class="stars stars--5" aria-hidden="true"></span>\n'
        num = "5.0"
    else:
        label = "{0:g}".format(rating)
        head = i1 + '<span class="app-rating" role="img" aria-label="Rated {0} out of 5 stars">\n'.format(label)
        if rating == 5.0:
            stars = i2 + '<span class="stars stars--5" aria-hidden="true"></span>\n'
        else:
            fill = "{0:g}".format(rating / 5 * 100)
            stars = i2 + '<span class="stars" style="--fill: {0}%" aria-hidden="true"></span>\n'.format(fill)
        num = "{0:.1f}".format(rating)
    return (head + stars
            + i2 + '<span class="rating-num">{0}</span>\n'.format(num)
            + i1 + "</span>\n")


def downloads_html(i1, downloads):
    if downloads is None:
        return i1 + '<span class="app-downloads is-placeholder" aria-hidden="true">0 downloads</span>\n'
    return i1 + '<span class="app-downloads">{0} downloads</span>\n'.format(downloads)


def main():
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    for path in FILES:
        with open(path, encoding="utf-8") as f:
            html = f.read()

        def replace(m):
            names = H3.findall(html[: m.start()])
            if not names or names[-1] not in STATS:
                raise SystemExit("{0}: app-meta block without a known app <h3> before it "
                                 "(saw {1!r}); add it to STATS".format(path, names[-1:]))
            app = names[-1]
            i1 = m.group("indent") + "    "
            i2 = m.group("indent") + "        "
            body = (rating_html(i1, i2, STATS[app]["rating"])
                    + downloads_html(i1, STATS[app]["downloads"]))
            return m.group("indent") + '<div class="app-meta">\n' + body + m.group("tail")

        new = META_BLOCK.sub(replace, html)
        with open(path, "w", encoding="utf-8") as f:
            f.write(new)
        print("synced", path)


if __name__ == "__main__":
    main()
