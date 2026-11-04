# The faceplate

A redesign of hamedyaghoobian.github.io after the "Long Weekend" bag: cream body, cobalt webbing, a red zipper, yellow pull cords. The site reads like a piece of hardware in the manner of teenage engineering: a plate of numbered keys and a knob, set in MoMA-style grotesque type. Two rules decide everything:

1. **Every element has a reason.** Nothing is decoration. A dot is red because something is live. A key exists because it does something. If you can't say what an element is for, remove it.
2. **Design never costs usability.** Every key is a real link or button that also works by pointer, by Tab, and on a phone. Keyboard shortcuts are extras, never the only way to reach anything.

This folder is a copy of the site. The live repo is untouched.

## Colour: four inks, one job each

| token | light | dark | job |
|---|---|---|---|
| `--paper` | cream `#F2EBDA` | deep cobalt `#1F2A9E` | the ground |
| `--ink` | cobalt `#2B3BD1` | cream | all type, every line |
| `--ink-soft` | `#6E76D0` | `#AAA9C6` | labels, secondary lines |
| `--rule` / `--rule-strong` / `--faint` | cobalt at 24% / 55% / 7% | cream at the same | hairlines, faint fills |
| `--live` (= `--glow`) | red `#E0362C` | brighter red `#FF6B5E` | **live**: the clock, the newest item, the lit part of a figure, today's date, the light on the held key. Only ever a dot or a thin line. Red in both themes, so yellow only ever means your hand |
| `--hand` / `--on-hand` | yellow / cobalt | yellow / cobalt | **your hand**: hover, focus, selection. Always yellow ground under cobalt text |

Never hard-code a hex colour in page CSS or figure JS. Use the tokens. Figures draw with `--ink`, `--ink-soft`, `--rule`, `--paper` and `--glow` (which is `--live`), so they follow the theme automatically. `body.dark` and `:root[data-theme="dark"]` are both set in dark mode.

## Type

- **Libre Franklin** (`--sans`) is the interface and the body. Headlines are weight 800, lowercase, tracked tight (`-0.03` to `-0.055em`). Body text is 400.
- **JetBrains Mono** (`--mono`) is for every label, number, date, count and key.
- **Newsreader** (`--serif`) is for long reading and for other people's words: project prose, Learning Machines entries, quotations, poem translations. A Readings wall label is the site's own voice, so it is Franklin.
- **Persian pairs the same way.** IBM Plex Sans Arabic (`--fa`) sits beside Franklin: the interface, labels, names, dates, headings (700), and the site's own sentences. Amiri (`--fa-serif`) sits beside Newsreader: the poets' words, i.e. verse and quoted lines. Load Amiri with `fa_serif: true` in front matter. The Readings pieces carry their own Amiri subset (`data/…/hand.woff2`) for the canvas; it is the same face. A Persian word inside an English sentence follows the sentence (`--fa`).
- **Lalezar** sets the Persian name on the home page and nothing else: it is a mark, not text.

## The plate (shared files: don't change them in page passes)

- `_includes/header.html` holds the eight section keys, the theme knob (L · D · A) and the breadcrumb (`hamed yaghoobian / 02 research / noisy stars`, with the keys that work on this page).
- `_includes/fp-section.html` works out which section a page is in (`fp_key`), how deep it is (`fp_depth`, 0–2), what is up one level (`fp_up`), and its siblings (`fp_prev` / `fp_next`, for projects from `_data/faceplate.yml`).
- `_layouts/page.html` sets the page's number, its title (big, lowercase), and an optional `dek:` from front matter (one line saying what the page is for). `heading:` gives the plate a shorter title than `title:`, which stays in the browser tab, search results and link previews. The body is a 680px reading column; front matter `wide: true` frees it to the plate's full 1120px.
- `_includes/footer.html` has the Mashhad clock (red dot), scholar · github · email, the colophon and `?`. The home page also gets the mountain range. On a phone, pages below a section get a thumb bar: ‹ prev · up · next ›.
- `assets/js/faceplate.js` is the keys.

## Keys

Three levels use the same keys:

| level | keys |
|---|---|
| site | `0`–`7` press a section key · `\` turns the knob · `?` lists this page's keys |
| section | `j` / `k` step through the list · `enter` opens · `/` finds · letters filter |
| page | `j` / `k` step through the parts · `[` `]` go to the previous / next page · `esc` goes up |

- `j` / `k` step through elements marked `data-fp-part`. Without any, they step through the body's numbered `h2` sections. A page can set `FP.partsSelector`.
- `enter` opens the current part: its first link, or toggles it if it is a `<details>`.
- `/` focuses an input inside an element with `data-fp-find`. Only pages with something to find have one.
- Page letters: `FP.add({ key: 't', label: 'talks only', run(){…}, when(){…} })`. They appear in the `?` help automatically. This works from inline scripts too, because calls are queued until faceplate.js loads.
- Keys never fire while you type. When a figure has focus (`.project-figure__canvas`, `[data-fp-own-keys]`, `figure [tabindex]`), its own keys come first, and `esc` gives the keys back to the page.
- Don't bind a page letter that the site already uses: `0`–`7`, `j`, `k`, `[`, `]`, `/`, `?`, `\`.

## Components (`_sass/faceplate/_components.scss`)

- `.fp-label` is a mono label.
- `.fp-k` is an inline keycap. `.fp-keyhint` marks a line that only explains keys; both hide on touch screens.
- `.fp-live` is the live dot.
- `.fp-index` › `.fp-row` (a `<details>` or `<li>`) › `.fp-row__head` (`__n` number · `__t` title · `__m` meta · `__x` plus) and `.fp-row__body`: a numbered index that opens in place.
- `.fp-spec` is a `<dl>` of label/value pairs.
- `.fp-seg` is a segmented filter: buttons with `aria-pressed`, `.fp-seg__k` key and `.fp-seg__c` count.
- `.fp-toolbar` is the row above a list (filter on the left, find on the right).
- `.fp-find` is the find input.
- `.fp-tag` is a small tag (a student, a kind); `--solid` fills it.
- `.fp-panel` is a frame with labels in its corners (`__tl` `__tr` `__bl` `__br`).
- Body `h2`s are numbered automatically (`01`, `02` …), with a cobalt rule above.

## Page passes

Each page owns `_sass/faceplate/pages/_<page>.scss` and its own markdown and JS. Inline `<style>` blocks in markdown pages move into the partial. **The content's words stay as they are.** Only structure, markup and presentation change.

Check every page:

- in light and dark;
- at 375px wide;
- with only the keyboard;
- for a clean build (`bundle exec jekyll build`).

## Reference previews

Earlier design previews (HTML fragments) are in `_design/previews/`: home, interior/tools, poems v2, readings index and piece, student research, publications, project page (Noisy Stars), navigation model and news. The full Birds piece preview is `what-the-birds-leave-faceplate.html`.
