#!/usr/bin/env python3
"""Fetch the Google Scholar profile into _data/scholar.json.

Run weekly by .github/workflows/scholar.yml (and by hand: python3
scripts/fetch_scholar.py). Scholar has no official API and sometimes blocks
automated requests; when that happens this exits cleanly and leaves the last
good _data/scholar.json in place, so the site never loses its list.

What it writes is Scholar's data only. How each paper is presented — its
section (student research / my own / collaborations), student names, links,
whether it's hidden — lives in _data/publications.yml, which this script
never touches. Papers it finds that aren't in that file yet are listed in
a new-publications note (for the workflow to open an issue), with a suggested
section: "student" when a co-author's surname matches someone in
_data/students.yml.

Author lists cost one request per paper, so they are fetched only for papers
not already in the saved file; citation counts come with the profile.
"""

import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
SCHOLAR_ID = "5Ax8m6sAAAAJ"
OUT = ROOT / "_data" / "scholar.json"
NOTES = ROOT / "_data" / "publications.yml"
STUDENTS = ROOT / "_data" / "students.yml"
# Outside the site, so Jekyll never publishes it; the workflow names it.
NEW = Path(os.environ.get("NEW_PUBLICATIONS", Path(tempfile.gettempdir()) / "new_publications.md"))


def load(path, default):
    try:
        if path.suffix == ".json":
            return json.loads(path.read_text())
        return yaml.safe_load(path.read_text()) or default
    except FileNotFoundError:
        return default


def authors_of(bib):
    raw = bib.get("author") or ""
    return [a.strip() for a in raw.split(" and ") if a.strip()]


def fetch(previous):
    from scholarly import scholarly  # imported here so a failed install is caught too

    author = scholarly.search_author_id(SCHOLAR_ID)
    author = scholarly.fill(author, sections=["basics", "indices", "counts", "publications"])
    known = {p["id"]: p for p in previous.get("publications", [])}

    pubs = []
    for p in author.get("publications", []):
        pid = p.get("author_pub_id")
        bib = p.get("bib", {})
        entry = known.get(pid)
        if entry is None:
            # New to us: one extra request for its authors, venue and link.
            full = scholarly.fill(p)
            fb = full.get("bib", {})
            entry = {
                "id": pid,
                "authors": authors_of(fb),
                "venue": fb.get("journal") or fb.get("conference") or fb.get("booktitle") or fb.get("publisher") or "",
                "url": full.get("pub_url") or full.get("eprint_url") or "",
            }
        year = bib.get("pub_year")
        entry = {
            **entry,
            "title": bib.get("title", entry.get("title", "")),
            "year": int(year) if str(year).isdigit() else None,
            "citation": bib.get("citation", ""),
            "cites": p.get("num_citations", 0),
        }
        pubs.append(entry)

    return {
        "profile": f"https://scholar.google.com/citations?user={SCHOLAR_ID}",
        "name": author.get("name"),
        "citedby": author.get("citedby", 0),
        "hindex": author.get("hindex", 0),
        "i10index": author.get("i10index", 0),
        "cites_per_year": {str(k): v for k, v in sorted((author.get("cites_per_year") or {}).items())},
        "publications": pubs,
    }


def suggest(pub, students):
    if pub.get("authors") and not any("yaghoobian" in a.lower() for a in pub["authors"]):
        return "hidden", None   # Scholar attached someone else's paper
    surnames = {s["name"].split()[-1].lower(): s for s in students}
    for a in pub.get("authors", []):
        hit = surnames.get(a.split()[-1].lower())
        if hit:
            return "student", hit["name"]
    return "mine" if len(pub.get("authors", [])) <= 1 else "collaboration", None


def main():
    previous = load(OUT, {})
    try:
        data = fetch(previous)
    except Exception as e:  # blocked, captcha, network, parse change…
        print(f"Scholar fetch failed, keeping the saved data: {e!r}", file=sys.stderr)
        return 0
    if not data["publications"]:
        print("Scholar returned no publications; keeping the saved data.", file=sys.stderr)
        return 0

    # Only rewrite when something changed, so "last updated" means the data moved.
    comparable = {k: v for k, v in previous.items() if k != "updated"}
    if comparable == data:
        print("No change.")
    else:
        data["updated"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
        OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
        print(f"Updated {OUT.relative_to(ROOT)}: {len(data['publications'])} publications, {data['citedby']} citations.")

    noted = {n["id"] for n in load(NOTES, []) if isinstance(n, dict) and n.get("id")}
    students = load(STUDENTS, [])
    fresh = [p for p in data["publications"] if p["id"] not in noted]
    if fresh:
        NEW.parent.mkdir(parents=True, exist_ok=True)
        lines = ["New on Google Scholar, not yet in `_data/publications.yml`:", ""]
        for p in fresh:
            cat, who = suggest(p, students)
            lines += [
                f"- **{p['title']}** ({p.get('year') or 'n.d.'}) — {', '.join(p.get('authors', []))}",
                "  ```yaml",
                f"  - id: \"{p['id']}\"",
                (f"    hidden: true   # you aren't among Scholar's authors — check before hiding"
                 if cat == "hidden" else
                 f"    category: {cat}" + ("" if cat != "student" else f"\n    students: [\"{who}\"]")),
                "  ```",
            ]
        lines += ["", "Until they're added they show under “New, to sort” on the Publications page."]
        NEW.write_text("\n".join(lines) + "\n")
        print(f"{len(fresh)} new publication(s) listed in {NEW}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
