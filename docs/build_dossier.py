# -*- coding: utf-8 -*-
"""Build FishyFinds technical dossier HTML + PDFs (EN / SR)."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess

import markdown

ROOT = pathlib.Path(__file__).resolve().parent
DOSSIER = ROOT / "dossier"
PDF_DIR = DOSSIER
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
EDGE = pathlib.Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")

CSS = r"""
:root {
  --ink: #1a1a1a;
  --muted: #5a5a5a;
  --line: #e8e0e0;
  --accent: #ed1c24;
  --coral: #c41218;
  --gold: #c9a227;
  --sage: #3e7a55;
  --sky: #2f6aa0;
  --cream: #fafafa;
  --soft: #fde8e9;
}
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: #fff;
  color: var(--ink);
  font-family: Cambria, Constantia, "Times New Roman", serif;
  font-size: 10.5pt;
  line-height: 1.5;
  font-variant-ligatures: none;
}
.page-footer {
  position: fixed; left: 0; right: 0; bottom: 0;
  height: 8mm; padding: 2mm 1mm 0 1mm;
  border-top: 2.2pt solid #e8b84a;
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 7.4pt;
  color: #fff;
  display: flex; justify-content: space-between; gap: 8pt;
  background: linear-gradient(90deg, #ed1c24 0%, #c41218 70%, #8a1014 100%);
  z-index: 10;
}
.page-footer span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.shell { width: 100%; border-collapse: collapse; }
.shell > thead > tr > td,
.shell > tbody > tr > td,
.shell > tfoot > tr > td {
  border: 0 !important; background: transparent !important;
  padding: 0 !important; margin: 0; vertical-align: top;
}
.shell > thead { display: table-header-group; }
.shell > tfoot { display: table-footer-group; }
.foot-space { height: 12mm; }
.wrap { padding: 0 2mm; }

.cover { page-break-after: always; break-after: page; padding: 0 0 4mm 0; }
.cover-hero {
  background: linear-gradient(135deg, #ed1c24 0%, #c41218 55%, #8a1014 100%);
  color: #fff; padding: 16mm 12mm 14mm 12mm; margin: 0 0 12mm 0;
  border-radius: 0 0 10pt 10pt;
}
.cover-kicker {
  font-family: Calibri, "Segoe UI", sans-serif; font-size: 9pt; color: #fde8e9; margin: 0 0 10mm 0;
}
.cover h1 {
  page-break-before: auto !important; break-before: auto !important;
  font-family: "Calibri Light", Calibri, "Segoe UI", sans-serif;
  font-weight: 300; font-size: 28pt; letter-spacing: -0.3pt; color: #fff;
  margin: 0 0 4pt 0; border: 0; padding: 0;
}
.cover-rule {
  width: 28mm; height: 3pt; background: #e8b84a;
  margin: 8mm 0 0 0; border-radius: 2pt;
}
.cover-body { padding: 0 6mm; }
.cover-product {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 18pt; font-weight: 700; color: var(--accent); margin: 0 0 2pt 0;
}
.cover-english {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 12pt; color: var(--sky); margin: 0 0 6pt 0;
}
.cover-version {
  display: inline-block;
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 9.5pt; color: #fff; background: var(--coral);
  padding: 4pt 10pt; border-radius: 10pt; margin: 0 0 8mm 0; line-height: 1.4;
}
.cover-lede { font-size: 12pt; max-width: 155mm; margin: 0 0 10mm 0; }
.cover-meta {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 10.5pt; color: var(--muted);
}
.cover-meta p { margin: 0.15em 0; }
.people { display: flex; flex-wrap: wrap; gap: 6mm; margin-top: 8mm; }
.person {
  min-width: 55mm; padding: 8pt 12pt; border-radius: 6pt;
  background: var(--soft); border-left: 4pt solid var(--accent);
}
.person.alt { background: #eef3f8; border-left-color: var(--sky); }
.person.alt2 { background: #eef6f0; border-left-color: var(--sage); }
.pname {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 12pt; font-weight: 600;
}
.pmeta { font-size: 9.5pt; color: var(--muted); margin: 1pt 0 0 0; }
.cover-inst {
  margin-top: 10mm;
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 10pt; color: var(--muted);
}

.toc-page { page-break-after: always; break-after: page; padding: 4mm 0 0 0; }
.toc-page > h1 {
  page-break-before: auto !important; break-before: auto !important;
  font-family: "Calibri Light", Calibri, sans-serif;
  font-weight: 300; font-size: 24pt; border: 0; margin: 0 0 4mm 0; padding: 0;
  color: var(--accent);
}
.toc-page > h1:after {
  content: ""; display: block; width: 28mm; height: 3pt;
  background: var(--coral); margin-top: 6pt; border-radius: 2pt;
}
.toc { list-style: none; margin: 4pt 0 0 0; padding: 0; counter-reset: toc; }
.toc li { margin: 0; counter-increment: toc; page-break-inside: avoid; }
.toc li:nth-child(odd) a { background: #faf3f3; }
.toc a {
  display: block; padding: 3.6pt 8pt; border-left: 3.5pt solid var(--accent);
  text-decoration: none; color: var(--ink);
  font-family: Calibri, "Segoe UI", sans-serif; font-size: 10pt;
}
.toc a::before {
  content: counter(toc, decimal-leading-zero);
  color: var(--coral); font-weight: 700; font-size: 9.5pt; margin-right: 8pt;
}
.toc li:nth-child(3n) a { border-left-color: var(--gold); }
.toc li:nth-child(3n+2) a { border-left-color: var(--sky); }

h1, h2 {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 13pt; font-weight: 600; color: var(--accent);
  margin: 16pt 0 7pt 0; page-break-after: avoid;
  padding-left: 8pt; border-left: 3.5pt solid var(--coral);
}
h3 {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 11pt; font-weight: 600; color: var(--sky);
  margin: 12pt 0 5pt 0; page-break-after: avoid;
}
p { margin: 0 0 8pt 0; }
ul, ol { margin: 0 0 10pt 0; padding-left: 18pt; }
li { margin: 0 0 3pt 0; }
table {
  width: 100%; border-collapse: collapse; margin: 0 0 12pt 0;
  font-size: 9.5pt; page-break-inside: avoid;
}
th, td {
  border: 1pt solid var(--line); padding: 4pt 6pt; text-align: left; vertical-align: top;
}
th { background: var(--soft); color: var(--ink); font-family: Calibri, sans-serif; }
code, pre {
  font-family: Consolas, "Cascadia Mono", monospace; font-size: 8.5pt;
}
pre {
  background: #f6f6f6; border: 1pt solid var(--line); padding: 8pt;
  overflow: hidden; white-space: pre-wrap; page-break-inside: avoid;
}
figure {
  margin: 10pt 0 14pt 0; padding: 0; page-break-inside: avoid;
  border: 1pt solid var(--line); background: #fff;
}
figure img { display: block; width: 100%; height: auto; }
figure.diagram img { max-height: 140mm; object-fit: contain; background: #fafafa; }
figcaption {
  font-family: Calibri, "Segoe UI", sans-serif;
  font-size: 9pt; color: var(--muted);
  padding: 6pt 8pt; border-top: 1pt solid var(--line); background: #fcfcfc;
}
strong { font-weight: 700; }
a { color: var(--coral); }
@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
"""

HTML_TMPL = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8"/>
<title>{html_title}</title>
<style>{css}</style>
</head>
<body>
<div class="page-footer">
  <span>{footer_l}</span>
  <span>{footer_r}</span>
</div>
<table class="shell">
<thead><tr><td></td></tr></thead>
<tfoot><tr><td><div class="foot-space"></div></td></tr></tfoot>
<tbody><tr><td>
<section class="cover">
  <div class="cover-hero">
    <p class="cover-kicker">{kicker}</p>
    <h1>{title}</h1>
    <div class="cover-rule"></div>
  </div>
  <div class="cover-body">
    <p class="cover-product">{product}</p>
    <p class="cover-english">{subtitle}</p>
    <p class="cover-version">{version}</p>
    <p class="cover-lede">{lede}</p>
    <div class="cover-meta">{meta_html}</div>
    <div class="people">
      <div class="person"><div class="pname">Natalija Simin</div><div class="pmeta">Guest / Customer</div></div>
      <div class="person alt"><div class="pname">Laslo Uri</div><div class="pmeta">Bungalow / Boat owner</div></div>
      <div class="person alt2"><div class="pname">David Jandrić</div><div class="pmeta">Instructor / Admin</div></div>
    </div>
    <p class="cover-inst">{inst}</p>
  </div>
</section>
<nav class="toc-page">
  <h1>{toc_title}</h1>
  {toc_html}
</nav>
<div class="wrap">
{body}
</div>
</td></tr></tbody>
</table>
</body>
</html>
"""

COVERS = {
    "en": {
        "kicker": "Faculty of Technical Sciences, University of Novi Sad",
        "title": "Technical Dossier",
        "product": "FishyFinds",
        "subtitle": "Internet Software Architectures (ISA) · 2021/22",
        "version": "Dossier 1.0.0  ·  verified 9 September 2026  ·  smoke 66/66",
        "lede": "Full technical write-up of the fishing-tourism marketplace: purpose of the subject and project, stack, architecture, domain rules, role UI with annotated screenshots, concurrency, tests, scalability, and summary.",
        "meta": ["Spring Boot 2.5.7 + Vue 2 + PostgreSQL", "Local: http://localhost:8080"],
        "inst": "Computing and Control Engineering",
        "footer_l": "Technical Dossier — FishyFinds",
        "footer_r": "ISA FTN UNS  |  2021/22  |  EN",
        "html_title": "Technical Dossier — FishyFinds (EN)",
        "toc_title": "Contents",
        "lang": "en",
    },
    "sr": {
        "kicker": "Fakultet tehničkih nauka, Univerzitet u Novom Sadu",
        "title": "Tehnički dosije",
        "product": "FishyFinds",
        "subtitle": "Internet softverske arhitekture (ISA) · 2021/22",
        "version": "Dosije 1.0.0  ·  provereno 9. septembra 2026.  ·  smoke 66/66",
        "lede": "Potpuni tehnički zapis marketplace-a za ribolovni turizam: cilj predmeta i projekta, stek, arhitektura, domenska pravila, UI po ulogama sa objašnjenim snimcima, konkurentnost, testovi, skalabilnost i rezime.",
        "meta": ["Spring Boot 2.5.7 + Vue 2 + PostgreSQL", "Lokalno: http://localhost:8080"],
        "inst": "Računarstvo i automatika",
        "footer_l": "Tehnički dosije — FishyFinds",
        "footer_r": "ISA FTN UNS  |  2021/22  |  SR",
        "html_title": "Tehnicki dosije — FishyFinds (SR)",
        "toc_title": "Sadržaj",
        "lang": "sr",
    },
}


def fix_paths(text: str) -> str:
    text = text.replace("](../screenshots/", "](screenshots/")
    text = text.replace("](../assets/", "](assets/")
    return text


def md_to_html(text: str) -> str:
    return markdown.markdown(
        fix_paths(text),
        extensions=["tables", "fenced_code", "sane_lists", "nl2br", "md_in_html"],
    )


def add_ids(html: str) -> str:
    n = {"h2": 0}

    def h2(m):
        n["h2"] += 1
        return f'<h2 id="s{n["h2"]}">{m.group(1)}</h2>'

    html = re.sub(r"<h2>(.*?)</h2>", h2, html, flags=re.S)

    def fig(m):
        attrs, cap = m.group(1), m.group(2)
        kind = "diagram" if "diagrams/" in attrs else "shot"
        return f'<figure class="{kind}"><img{attrs}><figcaption>{cap}</figcaption></figure>'

    html = re.sub(
        r"<p><img([^>]+)></p>\s*<p><em>(.*?)</em></p>",
        fig,
        html,
        flags=re.S,
    )
    return html


def toc_from(html: str) -> str:
    items = []
    for m in re.finditer(r'<h2 id="([^"]+)">(.*?)</h2>', html, re.S):
        hid, raw = m.group(1), m.group(2)
        title = re.sub(r"<[^>]+>", "", raw).strip()
        items.append(
            f'<li><a href="#{hid}"><span class="toc-title">{title}</span></a></li>'
        )
    return '<ol class="toc">\n' + "\n".join(items) + "\n</ol>"


def build_html(ed: str, md_text: str) -> str:
    c = COVERS[ed]
    body = add_ids(md_to_html(md_text))
    toc_html = toc_from(body)
    meta = "".join(f"<p>{m}</p>" for m in c["meta"])
    return HTML_TMPL.format(
        css=CSS,
        body=body,
        toc_html=toc_html,
        meta_html=meta,
        **c,
    )


def print_pdf(html_path: pathlib.Path, pdf_path: pathlib.Path) -> None:
    browser = CHROME if CHROME.exists() else EDGE
    if not browser.exists():
        raise SystemExit("Chrome or Edge not found for PDF export")
    subprocess.run(
        [
            str(browser),
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path.resolve().as_uri(),
        ],
        check=True,
    )


def write_interactive() -> None:
    """Browser dossier with EN/SR toggle; paths relative to dossier/."""
    en_body = add_ids(
        markdown.markdown(
            (DOSSIER / "DOSSIER_EN.md").read_text(encoding="utf-8"),
            extensions=["tables", "fenced_code", "sane_lists", "nl2br", "md_in_html"],
        )
    )
    sr_body = add_ids(
        markdown.markdown(
            (DOSSIER / "DOSSIER_SR.md").read_text(encoding="utf-8"),
            extensions=["tables", "fenced_code", "sane_lists", "nl2br", "md_in_html"],
        )
    )
    # Fix figure wrapping already done; ensure relative paths stay as ../ from dossier/
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FishyFinds — Technical Dossier</title>
  <style>
    :root {{ --ink:#1a1a1a; --muted:#5a5a5a; --line:#e5e5e5; --accent:#ed1c24; --bg:#fafafa; }}
    * {{ box-sizing: border-box; }}
    body {{ margin:0; font-family: Cambria, Georgia, serif; color:var(--ink); background:var(--bg); line-height:1.55; }}
    .bar {{
      position:sticky; top:0; z-index:10; display:flex; gap:.75rem; align-items:center;
      justify-content:space-between; padding:.75rem 1.25rem; background:#fff; border-bottom:1px solid var(--line);
      font-family: Calibri, "Segoe UI", sans-serif;
    }}
    .bar h1 {{ margin:0; font-size:1rem; }}
    .brand {{ color:var(--accent); font-weight:700; }}
    .langs button {{
      border:1px solid var(--ink); background:#fff; padding:.35rem .75rem; cursor:pointer; font-weight:600;
    }}
    .langs button.active {{ background:var(--ink); color:#fff; }}
    main {{ max-width:920px; margin:0 auto; padding:1.5rem 1.25rem 3rem; background:#fff; }}
    h2 {{ margin-top:2rem; border-left:4px solid var(--accent); padding-left:.6rem; font-size:1.2rem;
      font-family: Calibri, "Segoe UI", sans-serif; color:var(--accent); }}
    h3 {{ margin-top:1.25rem; font-size:1.05rem; font-family: Calibri, "Segoe UI", sans-serif; color:#2f6aa0; }}
    table {{ width:100%; border-collapse:collapse; margin:.75rem 0 1rem; font-size:.92rem; }}
    th, td {{ border:1px solid var(--line); padding:.45rem .55rem; text-align:left; vertical-align:top; }}
    th {{ background:#fde8e9; }}
    pre {{ background:#f6f6f6; border:1px solid var(--line); padding:.75rem; overflow-x:auto; font-size:.82rem; }}
    figure {{ margin:1rem 0 1.5rem; border:1px solid var(--line); background:#fff; }}
    figure img {{ display:block; width:100%; height:auto; }}
    figcaption {{ padding:.5rem .75rem; font-size:.85rem; color:var(--muted); border-top:1px solid var(--line); background:#fcfcfc;
      font-family: Calibri, "Segoe UI", sans-serif; }}
    .lang {{ display:none; }}
    .lang.show {{ display:block; }}
    @media print {{
      .bar {{ display:none !important; }}
      .lang {{ display:none !important; }}
      .lang.print-show {{ display:block !important; }}
      main {{ max-width:none; padding:0; }}
    }}
  </style>
</head>
<body>
  <div class="bar">
    <h1><span class="brand">FISHYFINDS</span> · Technical dossier</h1>
    <div class="langs">
      <button type="button" id="btn-en" class="active" onclick="setLang('en')">English</button>
      <button type="button" id="btn-sr" onclick="setLang('sr')">Srpski</button>
      <button type="button" onclick="window.print()">Print / PDF</button>
    </div>
  </div>
  <main>
    <section id="lang-en" class="lang show print-show">{en_body}</section>
    <section id="lang-sr" class="lang">{sr_body}</section>
  </main>
  <script>
    function setLang(l) {{
      document.getElementById('lang-en').classList.toggle('show', l === 'en');
      document.getElementById('lang-sr').classList.toggle('show', l === 'sr');
      document.getElementById('lang-en').classList.toggle('print-show', l === 'en');
      document.getElementById('lang-sr').classList.toggle('print-show', l === 'sr');
      document.getElementById('btn-en').classList.toggle('active', l === 'en');
      document.getElementById('btn-sr').classList.toggle('active', l === 'sr');
    }}
  </script>
</body>
</html>
"""
    (DOSSIER / "dossier.html").write_text(html, encoding="utf-8")
    print("wrote dossier.html")


def main() -> int:
    jobs = [
        ("en", DOSSIER / "DOSSIER_EN.md", "fishyfinds-dossier-en.pdf", "print-en.html"),
        ("sr", DOSSIER / "DOSSIER_SR.md", "fishyfinds-dossier-sr.pdf", "print-sr.html"),
    ]
    for ed, md_path, pdf_name, print_name in jobs:
        md = md_path.read_text(encoding="utf-8")
        html = build_html(ed, md)
        html_path = ROOT / f"_dossier_{ed}.html"
        html_path.write_text(html, encoding="utf-8")
        # Keep printable copy next to markdown
        shutil.copyfile(html_path, DOSSIER / print_name)
        pdf_path = PDF_DIR / pdf_name
        print_pdf(html_path, pdf_path)
        print("wrote", pdf_path.name, pdf_path.stat().st_size)
        html_path.unlink(missing_ok=True)

    write_interactive()
    (DOSSIER / "README.md").write_text(
        """# FishyFinds technical dossier

| File | Description |
|------|-------------|
| [DOSSIER_EN.md](DOSSIER_EN.md) | English technical dossier (full) |
| [DOSSIER_SR.md](DOSSIER_SR.md) | Serbian Latin technical dossier (full) |
| [dossier.html](dossier.html) | Interactive EN ↔ SR browser view |
| [fishyfinds-dossier-en.pdf](fishyfinds-dossier-en.pdf) | English PDF |
| [fishyfinds-dossier-sr.pdf](fishyfinds-dossier-sr.pdf) | Serbian PDF |
| [print-en.html](print-en.html) / [print-sr.html](print-sr.html) | Print sources |

Diagrams: `../assets/diagrams/`. Screenshots: `../screenshots/`.

Rebuild PDFs from `docs/`:

```text
python build_dossier.py
```
""",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
