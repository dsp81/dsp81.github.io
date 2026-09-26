#!/usr/bin/env python3
"""Prepare a deploy: version the asset URLs, and prerender the text for readers without JS.

1. Cache-busting. GitHub Pages serves everything with `cache-control: max-age=600` and gives
   no way to change it, so a browser can hold a stale app.js for ten minutes after a deploy —
   long enough to show the previous build's behaviour on the current build's markup. A query
   string that changes every deploy sidesteps it.

2. Prerendering. The page is built by app.js, and crawlers, link unfurlers and LLM fetchers
   do not run scripts — so they would see an empty shell. This evaluates data.js with node and
   writes the same content as plain HTML into the <noscript> block of index.html (between the
   PRERENDER markers) and as Markdown into llms.txt. Edit data.js, never those outputs.

Run this before committing; it rewrites index.html and llms.txt in place.
"""
import html, json, pathlib, re, subprocess, time

ROOT = pathlib.Path(__file__).parent
INDEX = ROOT / "index.html"

NAMES = "PROFILE,SERIES,TITLES,EXPERIENCE,ACADEMICS,HONOURS,SKILLS,FAQ,SEASONS,COURSES,INTERESTS"
JS = f"""
const fs = require("fs"), vm = require("vm");
const src = fs.readFileSync({json.dumps(str(ROOT / "data.js"))}, "utf8") + ";({{{NAMES}}})";
process.stdout.write(JSON.stringify(vm.runInNewContext(src, {{}})));
"""
D = json.loads(subprocess.check_output(["node", "-e", JS]))
P, e = D["PROFILE"], html.escape


def link(label, href):
    return f'<a href="{e(href)}">{e(label)}</a>'


def build_html():
    out = [f"<h1>{e(P['name'])}</h1>",
           f"<p><b>{e(P['tagline'])}</b> · {e(P['location'])}</p>",
           f"<p>{e(P['blurb'])}</p><p>{e(P['availability'])}</p>",
           "<p>" + " · ".join([link(P["email"], "mailto:" + P["email"]), link("LinkedIn", P["linkedin"]),
                               link("GitHub", P["github"]), link("Résumé (PDF)", P["resume"])]) + "</p>",
           "<h2>Projects</h2>"]
    for t in D["TITLES"]:
        links = " · ".join(link(l[0], l[1]) for l in t.get("links", []))
        stats = "; ".join(f"{a} — {b}" for a, b in t.get("stats", []))
        out.append(f"<h3>{e(t['title'])} ({e(t['year'])}, {e(t['rating'])})</h3>"
                   f"<p><i>{e(t['sub'])}.</i> {e(t['synopsis'])}</p>"
                   + (f"<p>Key numbers: {e(stats)}</p>" if stats else "")
                   + (f"<p>Credits: {e(t.get('cast', ''))}</p>" if t.get("cast") else "")
                   + (f"<p>{links}</p>" if links else ""))
    out.append("<h2>Experience</h2>")
    for x in D["EXPERIENCE"]:
        out.append(f"<h3>{e(x['role'])} — {e(x['org'])} ({e(x['when'])})</h3><ul>"
                   + "".join(f"<li>{e(p)}</li>" for p in x["points"]) + "</ul>")
    out.append("<h2>Education</h2><ul>" + "".join(
        f"<li>{e(a)}, {e(b)} ({e(c)}) — {e(d)}</li>" for a, b, c, d in D["ACADEMICS"]) + "</ul>")
    out.append("<h2>Honours</h2><ul>" + "".join(
        f"<li><b>{e(a)}</b> — {e(b)}</li>" for a, b in D["HONOURS"]) + "</ul>")
    out.append("<h2>Skills</h2><ul>" + "".join(
        f"<li><b>{e(s[0])}</b> — {e(s[1])}</li>" for s in D["SKILLS"]) + "</ul>")
    out.append("<h2>FAQ</h2>" + "".join(f"<h3>{e(q)}</h3><p>{e(a)}</p>" for q, a in D["FAQ"]))
    return "\n".join(out)


def build_md():
    md = [f"# {P['name']}", "", f"> {P['tagline']}. {P['blurb']}", "",
          f"{P['availability']}", "",
          f"- Email: {P['email']}", f"- LinkedIn: {P['linkedin']}", f"- GitHub: {P['github']}",
          f"- Résumé: {P['resume']}", f"- Site: https://dsp81.github.io/", "", "## Projects", ""]
    for t in D["TITLES"]:
        md += [f"### {t['title']} ({t['year']}, {t['rating']})", "", f"*{t['sub']}.* {t['synopsis']}", ""]
        md += [f"- **{a}** — {b}" for a, b in t.get("stats", [])]
        if t.get("cast"):
            md.append(f"- Credits: {t['cast']}")
        md += [f"- {l[0]}: {l[1]}" for l in t.get("links", [])]
        md.append("")
    md += ["## Experience", ""]
    for x in D["EXPERIENCE"]:
        md += [f"### {x['role']} — {x['org']} ({x['when']})", ""] + [f"- {p}" for p in x["points"]] + [""]
    md += ["## Education", ""] + [f"- {a}, {b} ({c}) — {d}" for a, b, c, d in D["ACADEMICS"]] + [""]
    md += ["## Honours", ""] + [f"- **{a}** — {b}" for a, b in D["HONOURS"]] + [""]
    md += ["## Skills", ""] + [f"- **{s[0]}** — {s[1]}" for s in D["SKILLS"]] + [""]
    md += ["## FAQ", ""] + sum(([f"**{q}**", "", a, ""] for q, a in D["FAQ"]), [])
    return "\n".join(md)


s = INDEX.read_text()
v = time.strftime("%Y%m%d-%H%M%S")
s, n = re.subn(r'(href|src)="(styles\.css|app\.js|data\.js)(\?v=[^"]*)?"',
               lambda m: f'{m.group(1)}="{m.group(2)}?v={v}"', s)
s, k = re.subn(r"(<!-- PRERENDER:START -->).*?(<!-- PRERENDER:END -->)",
               lambda m: m.group(1) + "\n" + build_html() + "\n" + m.group(2), s, flags=re.S)
INDEX.write_text(s)
(ROOT / "llms.txt").write_text(build_md())
(ROOT / "plain.html").write_text(f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(P['name'])} — one-page view</title>
<meta name="description" content="{e(P['blurb'])}">
<link rel="canonical" href="https://dsp81.github.io/plain.html">
<style>body{{margin:0 auto;max-width:760px;padding:40px 20px 80px;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1a1a1a;background:#fff}}
h1{{font-size:34px;margin:0 0 8px}}h2{{margin:36px 0 8px;border-bottom:2px solid #e50914;padding-bottom:4px}}h3{{margin:22px 0 4px;font-size:18px}}
a{{color:#b20710}}.back{{display:inline-block;margin-bottom:24px;font-size:14px}}@media print{{.back{{display:none}}}}</style></head>
<body><a class="back" href="./">← Back to the streaming version</a>
{build_html()}
</body></html>
""")
print(f"stamped {n} asset references with v={v}; prerendered {k} block(s), llms.txt and plain.html")
