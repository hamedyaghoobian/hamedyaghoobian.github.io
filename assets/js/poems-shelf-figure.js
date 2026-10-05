// Collected Poems (poems.md): a thousand years on one shelf. Every poem on
// the page is a slim volume standing at its poet's time — Ferdowsi alone
// near the right-hand end, then Iraqi, Hafez, Bidel, and a crowd from the
// last century at the left. Time runs right to left, as the page reads.
// Picking a volume (pointer or arrow keys) lifts it; the caption gives the
// poet, their years, the poem's first line and when it was written down
// here; clicking (or Enter) scrolls to the poem.
//
// Data: the poems come live from poems.json, so a newly added poem appears
// on the shelf by itself. Poets' years are below (checked against
// standard references, Oct 2026); a poet not listed stands at today as
// "contemporary" — add them here when their dates are known. Years are
// given in both calendars, Solar Hijri (ش) first, as the page gives its
// dates. For modern poets the Solar Hijri years come from their actual
// birth and death days; the classical poets are known only by year, so
// their Solar Hijri years are converted (Gregorian − 621) and marked
// approximate. The shelf carries both scales. Each volume
// stands at the middle of its poet's life (birth to today for the living);
// volumes too close to stand apart are set side by side around that point.

(function () {
  const root = document.getElementById('poems-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  // English name (as in poems.json) → [born, died or null, approximate
  // Gregorian years?, Solar Hijri born, Solar Hijri died]. A missing Solar
  // Hijri pair is converted from the Gregorian years and marked approximate.
  const POETS = {
    'Ferdowsi': [940, 1020, true],
    'Iraqi': [1213, 1289],
    'Hafez': [1315, 1390, true],
    'Bidel Dehlavi': [1642, 1720],
    'T. S. Eliot': [1888, 1965, false, 1267, 1343],
    'Nima Yooshij': [1897, 1960, false, 1276, 1338],
    'Nosrat Rahmani': [1930, 2000, false, 1308, 1379],
    'Ahmadreza Ahmadi': [1940, 2023, false, 1319, 1402],
    'Abbas Kiarostami': [1940, 2016, false, 1319, 1395],
    'Mahmoud Darwish': [1941, 2008, false, 1319, 1387],
    'Shams Langeroodi': [1950, null, false, 1329, null],
    'Rasool Yoonan': [1969, null, false, 1348, null]
  };
  const SH = 621;                      // Gregorian − 621 ≈ Solar Hijri, for most of a year

  const NOW = new Date().getFullYear();
  const Y0 = 920, Y1 = NOW + 6;        // the shelf's span, in years
  const X0 = 22, X1 = 598;             // …and in drawing units (newest at X0)
  const SHELF = 108;                   // the shelf's top edge
  const SH_TICKS = [400, 600, 800, 1000, 1200, 1400];   // Solar Hijri centuries on the second scale
  const BW = 8;                        // a volume's width
  const GAP = 9.6;                     // closest two volumes may stand
  const LIFT = 9;                      // how far a picked volume rises
  const xOf = year => X1 - (year - Y0) / (Y1 - Y0) * (X1 - X0);

  const fa = s => String(s).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const strip = html => {
    const box = document.createElement('div');
    box.innerHTML = html;
    // A translated poem keeps its own line beside an inline translation;
    // the shelf quotes the poem in its own language.
    box.querySelectorAll('.inline-translation').forEach(t => t.remove());
    return box.textContent.trim();
  };

  // "۱۲۷۶–۱۳۳۸ ش / ۱۸۹۷–۱۹۶۰ م", Solar Hijri first.
  function years(name) {
    const p = POETS[name];
    if (!p) return 'معاصر';
    const [b, d, approx, sb, sd] = p;
    const shKnown = sb !== undefined;
    const shB = shKnown ? sb : b - SH, shD = shKnown ? sd : (d && d - SH);
    const span = (x, y) => (y ? `${fa(x)}–${fa(y)}` : fa(x));
    const sh = `${shKnown ? '' : 'حدود '}${span(shB, shD)} ش`;
    const gr = `${approx ? 'حدود ' : ''}${span(b, d)} م`;
    return `${d ? '' : 'زادهٔ '}${sh} / ${gr}`;
  }

  // Wrap a run in a bidi isolate, so an English line or date keeps its own
  // direction inside the right-to-left caption.
  const iso2 = t => `\u2068${t}\u2069`;

  // A date written as "2026-01-30" is a calendar day, not an instant: read
  // as one (new Date("2026-01-30") would be midnight UTC, which is still the
  // day before anywhere west of London).
  function bothCalendars(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const day = new Date(y, m - 1, d);
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    return `${day.toLocaleDateString('fa-IR-u-ca-persian', opts)} / ${iso2(day.toLocaleDateString('en-US', opts))}`;
  }

  function middle(name) {
    const p = POETS[name];
    if (!p) return NOW;
    return (p[0] + (p[1] || NOW)) / 2;
  }

  // Spread volumes that would overlap, keeping each group centred on its
  // members' true positions.
  function pack(targets) {
    const order = targets.map((x, i) => i).sort((a, b) => targets[a] - targets[b]);
    let groups = order.map(i => ({ items: [i], centre: targets[i] }));
    let merged = true;
    while (merged) {
      merged = false;
      for (let g = 0; g < groups.length - 1; g++) {
        const a = groups[g], b = groups[g + 1];
        const aRight = a.centre + (a.items.length - 1) * GAP / 2;
        const bLeft = b.centre - (b.items.length - 1) * GAP / 2;
        if (bLeft - aRight < GAP) {
          const items = a.items.concat(b.items);
          const centre = items.reduce((s, i) => s + targets[i], 0) / items.length;
          groups.splice(g, 2, { items, centre });
          merged = true;
          break;
        }
      }
    }
    const xs = [];
    groups.forEach(g => g.items.forEach((i, k) => {
      xs[i] = g.centre + (k - (g.items.length - 1) / 2) * GAP;
    }));
    return xs;
  }

  function draw(poems) {
    const items = poems.map(p => {
      const [faName, enName] = (p.poet || '').split(' / ').map(s => s.trim());
      const first = strip((p.verses || [''])[0]);
      return {
        p, faName: faName || enName, enName: enName || faName,
        first: first.length > 40 ? first.slice(0, 38).trim() + '…' : first,
        // Both calendars, as the page's own date headers have them.
        posted: p.date ? bothCalendars(p.date) : ''
      };
    });
    // Oldest poets first, so the arrow keys walk forward in time; within a
    // poet, in the order the poems were written down here.
    items.sort((a, b) => middle(a.enName) - middle(b.enName) || String(a.p.date).localeCompare(String(b.p.date)));
    const xs = pack(items.map(it => xOf(middle(it.enName))));

    const svg = makeSvg(root, '-6 36 626 112',
      `A long shelf spanning about a thousand years, from Ferdowsi to today, with ${items.length} slim volumes, one per poem, each standing at its poet's time: a few classical poets spread far apart on the right, and a dense row of modern poets on the left.`);

    // The shelf, its brackets, and the centuries beneath it.
    el('path', { class: 'lf-line lf-strong', d: `M${X0 - 12} ${SHELF} H${X1 + 12} M${X0 - 12} ${SHELF + 4} H${X1 + 12} M${X0 - 12} ${SHELF} V${SHELF + 4} M${X1 + 12} ${SHELF} V${SHELF + 4}` }, svg);
    // Two scales under the shelf: Gregorian centuries (م), then Solar Hijri
    // centuries (ش) at their own places, each named at its left end.
    const labels = el('g', { class: 'lf-face' }, svg);
    for (let y = 1000; y <= 2000; y += 200) {
      const x = xOf(y);
      el('line', { class: 'lf-line lf-faint', x1: x, y1: SHELF + 4, x2: x, y2: SHELF + 8 }, svg);
      el('text', { x, y: SHELF + 17, 'text-anchor': 'middle', 'font-size': 7.5 }, labels).textContent = fa(y);
    }
    SH_TICKS.forEach(y => {
      const x = xOf(y + SH);
      el('line', { class: 'lf-line lf-faint', x1: x, y1: SHELF + 20, x2: x, y2: SHELF + 23 }, svg);
      el('text', { x, y: SHELF + 31, 'text-anchor': 'middle', 'font-size': 7.5 }, labels).textContent = fa(y);
    });
    el('text', { x: X0 - 14, y: SHELF + 17, 'text-anchor': 'end', 'font-size': 7.5 }, labels).textContent = 'م';
    el('text', { x: X0 - 14, y: SHELF + 31, 'text-anchor': 'end', 'font-size': 7.5 }, labels).textContent = 'ش';

    // Volumes, each a spine with two bands; heights vary a little, as books do.
    const books = items.map((it, i) => {
      const g = el('g', { style: 'cursor: pointer' }, svg);
      const h = 38 + ((i * 37 + it.enName.length * 11) % 19);
      const spine = el('rect', { class: 'lf-solid', width: BW, height: h, rx: 0.8 }, g);
      const bands = el('path', { class: 'lf-line lf-faint' }, g);
      return { g, spine, bands, h, x: xs[i] };
    });

    function place(glow) {
      books.forEach((b, i) => {
        const top = SHELF - b.h - LIFT * glow[i];
        b.spine.setAttribute('x', (b.x - BW / 2).toFixed(2));
        b.spine.setAttribute('y', top.toFixed(2));
        const x0 = (b.x - BW / 2 + 1).toFixed(2), x1 = (b.x + BW / 2 - 1).toFixed(2);
        b.bands.setAttribute('d', `M${x0} ${(top + 5).toFixed(2)}H${x1}M${x0} ${(top + b.h - 5).toFixed(2)}H${x1}`);
      });
    }

    // The caption line reads right to left, like the page (the English
    // note under it stays left to right).
    const readout = document.getElementById(root.id + '-readout');
    if (readout) readout.dir = 'rtl';
    let current = -1;

    const api = interact({
      root, svg,
      count: items.length,
      rest: `هزار سال بر یک قفسه · ${fa(items.length)} شعر، هر کدام در زمانهٔ شاعرش`,
      describe: i => {
        const it = items[i];
        return `${it.faName} · ${years(it.enName)} · «${iso2(it.first)}» · ${it.posted}`;
      },
      pick: x => {
        let best = -1, dist = GAP * 0.7;
        books.forEach((b, i) => { const d = Math.abs(b.x - x); if (d < dist) { best = i; dist = d; } });
        return best;
      },
      onChange: i => { current = i; },
      draw: (glow, active) => {
        place(glow);
        books.forEach((b, i) => b.g.classList.toggle('is-lit', i === active));
      }
    });

    // Clicking a volume, or Enter, scrolls to its poem on the page.
    function open(i) {
      const it = items[i];
      const cards = [...document.querySelectorAll(`.poem-card[data-date="${it.p.date}"]`)];
      const card = cards.find(c => c.textContent.includes(it.faName)) || cards[0];
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    svg.addEventListener('click', e => {
      const [x] = api.toView(e);
      let best = -1, dist = GAP * 0.7;
      books.forEach((b, i) => { const d = Math.abs(b.x - x); if (d < dist) { best = i; dist = d; } });
      if (best >= 0) open(best);
    });
    root.addEventListener('keydown', e => {
      if (e.key === 'Enter' && current >= 0) { e.preventDefault(); open(current); }
    });
  }

  // The same places the page itself looks for poems.json.
  (async () => {
    for (const path of ['/poems.json', 'poems.json', '../poems.json']) {
      try {
        const res = await fetch(path);
        if (res.ok) return draw(await res.json());
      } catch (e) { /* try the next */ }
    }
  })();
})();
