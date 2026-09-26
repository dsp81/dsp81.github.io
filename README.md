# dsp81.github.io

My portfolio, laid out like a streaming service because I like films more than I like
résumé templates. The billboard is a series about me; the catalogue is the work; there is a
45-second trailer, a Top 5, a "Coming soon" row, and a season-by-season episode guide.

```
index.html    structure only (plus a prerendered <noscript> copy — generated, do not edit)
data.js       all the content — series, trailer, titles, rows, profiles, FAQ. Edit this.
app.js        billboard, rails, hover previews, modals, trailer player, search. No framework.
styles.css    tokens, layout, the red
bump.py       run before every commit: cache-busts assets, prerenders <noscript> + llms.txt
llms.txt      the whole site as Markdown, for LLM fetchers (generated)
assets/art/   posters and billboards, built from the projects' own outputs
assets/og.jpg the link-preview card
```

## Deploying

Run `python bump.py` before committing. It does two things:

- stamps a fresh `?v=` onto the asset URLs — GitHub Pages serves everything with
  `cache-control: max-age=600`, so without it a browser can run the previous build's
  `app.js` against the new build's markup for ten minutes after a push;
- evaluates `data.js` with node and writes the same content as plain HTML into the
  `<noscript>` block and as Markdown into `llms.txt`, so crawlers, link unfurlers and LLMs
  (none of which run scripts) see the real content rather than an empty shell.

## Editing

Everything a visitor reads lives in `data.js`. A new project is one object in `TITLES`, its
trait weights in `TRAIT_MAP`, and its id in whichever `ROWS` should carry it. Card art is
16:9, posters 2:3, billboards are wide mosaics. Set `PROFILE.photo` to a headshot path and it
replaces the monogram in the cast list.

## Links that do something

- `?p=recruiter` · `?p=researcher` · `?p=engineer` · `?p=browsing` — open a specific cut,
  skipping the profile picker. Handy for sending someone a tailored link.
- `#trailer` — straight into the trailer. `#about` — the series page (seasons, cast).
- `#flowsat`, `#flowsat-c`, `#povrl`, `#yourtts`, `#diffusion-guide`, `#hsi`, `#zelite`
  — open a title's detail view.
- `?q=diffusion` — open with a search.
- `?intro=1` replays the opening titles, `?intro=0` skips them.

Keyboard: `/` searches, `Esc` closes things; in the trailer, space pauses and ← → skip shots.

## Credits

Layout inspired by Netflix's browse UI. Not affiliated with or endorsed by Netflix; no
Netflix assets, logotype or code are used here. The "% match" figures are decoration.
