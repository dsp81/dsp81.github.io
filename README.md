# dsp81.github.io

My portfolio, laid out like a streaming service because I like films more than I like
résumé templates. Four titles, one continuing series, and a top-ten list that happens to be
a skills section.

```
index.html    structure only
data.js       all the content — titles, rows, profiles. Edit this, not the markup.
app.js        rails, profile gate, detail modal. No framework, no build step.
styles.css    tokens, layout, the red
assets/art/   posters and billboards, built from the projects' own outputs
```

## Editing

Everything a visitor reads lives in `data.js`. A new project is one object in `TITLES` plus
its id in whichever `ROWS` should carry it. Card art is 16:10; billboards are wide mosaics
built from the project's own imagery (`assets/art/hero_*.jpg`).

## Links that do something

- `?p=recruiter` · `?p=researcher` · `?p=engineer` · `?p=browsing` — open a specific cut,
  skipping the profile picker. Handy for sending someone a tailored link.
- `?intro=1` replays the opening titles, `?intro=0` skips them. They play once per tab
  session otherwise, and never on a deep link.
- `#flowsat`, `#povrl`, `#yourtts`, `#diffusion-guide`, `#thesis`, `#zelite` — open straight
  into a title's detail view.

## Credits

Layout inspired by Netflix's browse UI. Not affiliated with or endorsed by Netflix; no
Netflix assets, logotype or code are used here.
