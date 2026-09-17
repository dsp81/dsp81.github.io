#!/usr/bin/env python3
"""Stamp a version onto the asset URLs so a deploy can never be half-cached.

GitHub Pages serves everything with `cache-control: max-age=600` and gives no way to change
it, so a browser can hold a stale app.js for ten minutes after a deploy — long enough to
show the previous build's behaviour on the current build's markup. A query string that
changes every deploy sidesteps it: the HTML may be a few minutes stale, but the moment it
refreshes it pulls assets nobody has cached.

Run this before committing; it rewrites index.html in place.
"""
import pathlib, re, time

p = pathlib.Path(__file__).with_name("index.html")
s = p.read_text()
v = time.strftime("%Y%m%d-%H%M%S")
s, n = re.subn(r'(href|src)="(styles\.css|app\.js|data\.js)(\?v=[^"]*)?"',
               lambda m: f'{m.group(1)}="{m.group(2)}?v={v}"', s)
p.write_text(s)
print(f"stamped {n} asset references with v={v}")
