// Collected Poems (poems.md): form across a thousand years. A small piece
// of distant reading, in the manner of quantitative formalism, on the
// poems collected here. Each poem is a column at its poet's time; each of
// its lines a dot at its length in letters, the column's hairline running
// from its shortest line to its longest. A pale band marks the range every
// classical hemistich here falls inside. The marked year is 1316 ش (1937),
// Nima's «ققنوس», the usual date for the birth of she'r-e now: after it the
// lines come loose from the metre, and the dots spill out of the band.
//
// Measured on the excerpts as copied here (one to sixteen lines each), so
// it describes this notebook, not Persian poetry; it is computed live from
// poems.json, so each new poem joins the picture. Letters, not syllables:
// Persian and Arabic script leave short vowels unwritten, and scanning the
// classical metres (ʿarūz) by machine is beyond a page script; letters per
// line track a line's length closely enough for this comparison. The
// variation reported for each poem is the coefficient of variation of its
// line lengths (standard deviation ÷ mean); the second view plots it.
//
// Time runs right to left, as the page reads, on a broken axis: the
// classical centuries compressed on the right, the last century and a half
// spread out on the left. Under the axis, Gregorian years and their Solar
// Hijri equivalents; the lit poem's poet gets their lifetime drawn on it.
//
// The figure and the list below it are one instrument. The page (poems.md)
// owns the data and the list; it calls PoemsFigure.mount() and is told,
// through callbacks, when the figure picks or opens a poem. The figure is
// drawn in real pixels at the width it is given, so its type stays legible
// on a phone, and redrawn when that width changes.
//
// Keys while the figure has focus (it keeps them; esc gives them back to
// the page): ← → step through the columns as drawn, home / end jump to
// either end, j / k step in the list's order, enter opens the poem, v
// switches between letters per line and variation.
//
// Colour: ink and paper only, from the page's tokens. The lit column stands
// on the yellow hand; the newest poem's dots wear the live colour; the
// Qoqnus line is a thin live line. Nothing here names a hex value.

(function () {
  const NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // English name (as in poems.json) → [born, died or null]. A poem stands
  // at its poet's working years, about forty years after birth (or midway
  // through a shorter life). Poets not listed are placed as contemporary.
  const POETS = {
    'Ferdowsi': [940, 1020], 'Iraqi': [1213, 1289], 'Hafez': [1315, 1390], 'Bidel Dehlavi': [1642, 1720],
    'T. S. Eliot': [1888, 1965], 'Nima Yooshij': [1897, 1960], 'Nosrat Rahmani': [1930, 2000],
    'Ahmadreza Ahmadi': [1940, 2023], 'Abbas Kiarostami': [1940, 2016], 'Mahmoud Darwish': [1941, 2008],
    'Shams Langeroodi': [1950, null], 'Rasool Yoonan': [1969, null]
  };
  const CONTEMPORARY = 2012;
  const BREAK = 1937;                   // «ققنوس», Qoqnus
  const SH = 621;                       // Gregorian − 621 ≈ Solar Hijri
  const fa = s => String(s).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const when = name => {
    const p = POETS[name];
    if (!p) return CONTEMPORARY;
    return Math.min(p[0] + 40, p[1] ? (p[0] + p[1]) / 2 + 8 : p[0] + 40);
  };
  const isClassical = name => !!(POETS[name] && POETS[name][0] < 1850);

  function plain(html) {
    const box = document.createElement('div');
    box.innerHTML = html;
    box.querySelectorAll('.inline-translation').forEach(t => t.remove());
    return box.textContent.trim();
  }
  // Letters only: no spaces, joiners, short-vowel marks or punctuation.
  const letters = line => line.replace(/[\s‌ً-ْٰ.,:;!?؟،«»"'\-—–…()]/g, '').length;
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  const cv = a => (a.length < 2 ? null : Math.sqrt(mean(a.map(v => (v - mean(a)) ** 2))) / mean(a));

  // What the page and the figure both need to know about one poem.
  // `perVerse` lines up with poem.verses (0 for an empty verse); `lens` is
  // the same without the empties, which is what the figure plots.
  function measure(p) {
    const [faName, enName] = String(p.poet || '').split(' / ').map(s => s.trim());
    const perVerse = (p.verses || []).map(v => letters(plain(v)));
    const lens = perVerse.filter(n => n > 0);
    const en = enName || faName || '';
    return {
      faName: faName || enName || '', enName: en,
      perVerse, lens, v: cv(lens),
      min: lens.length ? Math.min(...lens) : 0, max: lens.length ? Math.max(...lens) : 0,
      year: when(en), classical: isClassical(en), era: POETS[en] || null
    };
  }

  function mount(root, poems, opts) {
    opts = opts || {};
    const canvas = root.querySelector('[data-pf-canvas]');
    const readout = root.querySelector('[data-pf-readout]');
    const summary = root.querySelector('[data-pf-summary]');
    const viewBtns = [...root.querySelectorAll('[data-pf-view]')];
    if (!canvas) return null;

    const items = poems.map((p, i) => Object.assign({ i, p }, measure(p)));
    const newest = opts.newest == null ? -1 : opts.newest;
    // The classical band: the range of every classical line here.
    const clLens = items.filter(it => it.classical).flatMap(it => it.lens);
    const band = clLens.length ? [Math.min(...clLens), Math.max(...clLens)] : null;
    const inBand = it => band ? it.lens.filter(n => n >= band[0] && n <= band[1]).length : 0;

    let view = 'len';
    let cur = -1, hover = -1, line = -1, hoverLine = -1;
    let shown = new Set(items.map(it => it.i));
    let cols = [], xs = [], order = [];     // order: item indices left → right as drawn
    let svg = null, W = 0;

    // ── Layout: a broken time axis, right to left, in real pixels ──────
    function geometry(w) {
      const narrow = w < 520;
      const H = narrow ? 236 : 264;
      const L = 10, R = w - (narrow ? 28 : 36);
      const T = narrow ? 44 : 40, B = H - 46;
      const span = R - L;
      const MOD = { from: 1870, to: 2030, x0: L + span * .66, x1: L };
      const CLA = { from: 900, to: 1760, x0: R, x1: L + span * .73 };
      const xOf = y => (y >= MOD.from
        ? MOD.x0 + (y - MOD.from) / (MOD.to - MOD.from) * (MOD.x1 - MOD.x0)
        : CLA.x0 + (Math.max(y, CLA.from) - CLA.from) / (CLA.to - CLA.from) * (CLA.x1 - CLA.x0));
      const maxLen = Math.max(40, ...items.map(it => it.max));
      const LMAX = Math.ceil(maxLen / 10) * 10;
      const maxCv = Math.max(.4, ...items.map(it => it.v || 0));
      const CMAX = Math.ceil(maxCv * 10) / 10;
      const yLen = n => B - Math.min(n, LMAX) / LMAX * (B - T);
      const yCv = c => B - Math.min(c, CMAX) / CMAX * (B - T);
      const GAP = narrow ? 10 : 12;
      return { narrow, H, L, R, T, B, MOD, CLA, xOf, LMAX, CMAX, yLen, yCv, GAP, bx: (MOD.x0 + CLA.x1) / 2 };
    }

    // Columns too close to stand apart are set side by side about their year.
    function place(g) {
      const target = items.map(it => g.xOf(it.year));
      const ord = target.map((x, i) => i).sort((a, b) => target[b] - target[a] || items[a].p.date.localeCompare(items[b].p.date));
      const out = []; let last = Infinity;
      ord.forEach(i => { out[i] = Math.min(target[i], last - g.GAP); last = out[i]; });
      for (let a = 0; a < ord.length;) {
        let b = a;
        while (b + 1 < ord.length && Math.abs(out[ord[b + 1]] - out[ord[b]] + g.GAP) < 0.01) b++;
        const run = ord.slice(a, b + 1), shift = mean(run.map(i => target[i])) - mean(run.map(i => out[i]));
        run.forEach(i => { out[i] += shift; });
        a = b + 1;
      }
      // never past the plot's ends
      const lo = Math.min(...out), hi = Math.max(...out);
      const push = lo < g.L + 6 ? g.L + 6 - lo : hi > g.R - 6 ? g.R - 6 - hi : 0;
      return { xs: out.map(x => x + push), order: ord.slice().reverse() };
    }

    function draw() {
      W = Math.round(canvas.clientWidth);
      if (!W) return;
      const g = geometry(W);
      const placed = place(g);
      xs = placed.xs; order = placed.order;
      canvas.textContent = '';
      svg = el('svg', {
        viewBox: `0 0 ${W} ${g.H}`, width: W, height: g.H, class: 'pf-figure', role: 'img',
        'aria-label': `${items.length} poems by the length of their lines in letters, set against their poets' time from about 1000 to today, time running right to left. The classical poems' lines fall within a narrow band${band ? ` (${band[0]} to ${band[1]} letters)` : ''}; after 1937, the year of Nima's «Qoqnus», the modern poems' lines spread far above and below it.`
      }, canvas);

      // the classical band, in the letters view
      if (view === 'len' && band) {
        el('rect', { class: 'pf-band', x: g.L, width: g.R - g.L, y: g.yLen(band[1]), height: g.yLen(band[0]) - g.yLen(band[1]) }, svg);
      }

      // axes: the measure on the right, time beneath
      const ax = el('g', { class: 'pf-axis' }, svg);
      el('line', { x1: g.L, x2: g.R, y1: g.B, y2: g.B }, ax);
      const yTicks = view === 'len'
        ? [10, 20, 30, 40, 50, 60].filter(n => n <= g.LMAX).map(n => [g.yLen(n), String(n)])
        : [.1, .2, .3, .4, .5, .6, .8, 1].filter(c => c <= g.CMAX + 1e-9).map(c => [g.yCv(c), Math.round(c * 100) + '%']);
      yTicks.forEach(([y, t]) => {
        el('line', { class: 'pf-grid', x1: g.L, x2: g.R, y1: y, y2: y }, ax);
        el('text', { class: 'pf-tick', x: g.R + 5, y: y + 3.5 }, ax).textContent = t;
      });
      el('text', { class: 'pf-tick', x: W, y: g.T - 14, 'text-anchor': 'end' }, ax).textContent = view === 'len' ? 'letters' : 'cv';
      const ticks = g.narrow ? [1000, 1321, 1721, 1921, 2021] : [1000, 1321, 1721, 1921, 1971, 2021];
      ticks.forEach(y => {
        const x = g.xOf(y);
        el('line', { x1: x, x2: x, y1: g.B, y2: g.B + 4 }, ax);
        el('text', { class: 'pf-tick', x, y: g.B + 16, 'text-anchor': 'middle' }, ax).textContent = y;
        el('text', { class: 'pf-fa pf-tick', x, y: g.B + 31, 'text-anchor': 'middle' }, ax).textContent = fa(y - SH);
      });
      el('text', { class: 'pf-tick', x: g.L, y: g.T - 14 }, ax).textContent = '← now';
      // the second row of years is Solar Hijri
      el('text', { class: 'pf-fa pf-tick', x: g.R + 5, y: g.B + 31 }, ax).textContent = 'ش';
      // the break in the axis between the two eras
      el('rect', { class: 'pf-gap', x: g.bx - 5, y: g.B - 2, width: 10, height: 4 }, ax);
      el('path', { class: 'pf-break', d: `M${g.bx - 7} ${g.B + 5} l4 -10 M${g.bx + 1} ${g.B + 5} l4 -10` }, ax);

      // the poet's lifetime, drawn on the axis for the lit poem
      el('g', { class: 'pf-era' }, svg);

      // the poems
      cols = items.map((it, k) => {
        const x = xs[k];
        const gc = el('g', { class: 'pf-col' + (it.classical ? ' is-classical' : '') + (it.i === newest ? ' is-newest' : ''), 'data-i': it.i }, svg);
        el('rect', { class: 'pf-ground', x: x - g.GAP / 2, y: g.T - 8, width: g.GAP, height: g.B - g.T + 8, rx: 2 }, gc);
        if (view === 'len') {
          if (it.lens.length > 1) el('line', { class: 'pf-range', x1: x, x2: x, y1: g.yLen(it.max), y2: g.yLen(it.min) }, gc);
          it.perVerse.forEach((n, j) => { if (n > 0) el('circle', { class: 'pf-dot', cx: x, cy: g.yLen(n), r: 2.8, 'data-j': j }, gc); });
        } else if (it.v != null) {
          el('line', { class: 'pf-range', x1: x, x2: x, y1: g.B, y2: g.yCv(it.v) }, gc);
          el('circle', { class: 'pf-dot', cx: x, cy: g.yCv(it.v), r: 3.2 }, gc);
        } else {
          // one line: no variation to measure
          el('line', { class: 'pf-range pf-one', x1: x - 3, x2: x + 3, y1: g.B - 4, y2: g.B - 4 }, gc);
        }
        el('rect', { class: 'pf-hit', x: x - g.GAP / 2, y: g.T - 8, width: g.GAP, height: g.B - g.T + 12 }, gc);
        return gc;
      });
      // the break in form: Nima's Qoqnus, drawn over the columns so a lit
      // column's ground never hides it
      const nx = g.xOf(BREAK);
      const nima = el('g', { class: 'pf-nima' }, svg);
      el('line', { x1: nx, x2: nx, y1: g.T - 26, y2: g.B }, nima);
      el('text', { class: 'pf-fa', x: nx - 5, y: g.T - 17, direction: 'rtl', 'text-anchor': 'end' }, nima).textContent = `«ققنوس»، نیما، ${fa(BREAK - SH)}`;
      el('text', { class: 'pf-fa pf-sub', x: nx - 5, y: g.T - 2, direction: 'rtl', 'text-anchor': 'end' }, nima).textContent = 'آغاز شعر نو';

      paint();
    }

    // ── State → classes. Cheap; runs on every hover. ───────────────────
    const lit = () => (hover >= 0 ? hover : cur);
    function paint() {
      if (!svg) return;
      // a hovered verse line wins; otherwise the line the keys are on, when
      // the lit poem is the current one
      const l = lit(), ln = hoverLine >= 0 ? hoverLine : (l === cur ? line : -1);
      cols.forEach((gc, k) => {
        const i = items[k].i;
        gc.classList.toggle('is-lit', i === l);
        gc.classList.toggle('is-out', !shown.has(i));
        gc.querySelectorAll('.pf-dot').forEach(d => {
          const on = i === l && view === 'len' && +d.dataset.j === ln;
          d.classList.toggle('is-line', on);
          if (view === 'len') d.setAttribute('r', on ? 5 : 2.8);
        });
      });
      svg.classList.toggle('pf-picking', root.classList.contains('is-picking'));
      drawEra(l);
      say(l, ln);
    }

    function drawEra(i) {
      const g = geometry(W), era = svg.querySelector('.pf-era');
      era.textContent = '';
      const it = items.find(x => x.i === i);
      if (!it || !it.era) return;
      const [b, d] = it.era;
      const x0 = g.xOf(b), x1 = g.xOf(d || new Date().getFullYear());
      el('line', { x1: x0, x2: x1, y1: g.B, y2: g.B }, era);
      el('line', { class: 'pf-era__end', x1: x0, x2: x0, y1: g.B - 4, y2: g.B + 4 }, era);
      if (d) el('line', { class: 'pf-era__end', x1: x1, x2: x1, y1: g.B - 4, y2: g.B + 4 }, era);
    }

    // The caption: five readings of the lit poem. Never a line of verse.
    function say(i, ln) {
      if (!readout) return;
      const it = items.find(x => x.i === i);
      if (!it) { readout.hidden = true; return; }
      readout.hidden = false;
      const cell = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
      const yr = Math.round(it.year);
      const era = it.era ? `${it.era[0]}–${it.era[1] || ''}` : 'contemporary';
      const lineBit = ln >= 0 && it.perVerse[ln] ? ` · line ${ln + 1}: ${it.perVerse[ln]}` : '';
      readout.innerHTML =
        cell('poet', `<span lang="fa" dir="rtl" class="pf-r-fa">${esc(it.faName)}</span> ${esc(it.enName.toLowerCase())}${it.i === newest ? ' <span class="fp-live" title="newest"></span>' : ''}`) +
        cell('placed at', `${yr} <span lang="fa">≈ ${fa(yr - SH)}</span> · ${era}`) +
        cell('lines · letters', `${it.lens.length} · ${it.min !== it.max ? it.min + '–' + it.max : it.max}${lineBit}`) +
        cell('variation', it.v == null ? 'one line' : Math.round(it.v * 100) + '%') +
        cell('in the classical band', band ? `${inBand(it)} of ${it.lens.length}` : '—');
    }
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    // the band's range, named in the legend (the plot has no empty room for it)
    const bandOut = root.querySelector('[data-pf-band]');
    if (bandOut && band) bandOut.textContent = `${band[0]}–${band[1]}`;

    if (summary) {
      const m = items.filter(it => !it.classical && it.v !== null), c = items.filter(it => it.classical && it.v !== null);
      const avg = a => a.length ? Math.round(mean(a.map(it => it.v)) * 100) : 0;
      summary.textContent = `${fa(items.length)} شعر — پراکندگیِ طولِ سطرها: کلاسیک ${fa(avg(c))}٪، معاصر ${fa(avg(m))}٪`;
    }

    // ── Pointer ────────────────────────────────────────────────────────
    const colAt = e => { const gc = e.target.closest && e.target.closest('.pf-col'); return gc && !gc.classList.contains('is-out') ? +gc.dataset.i : -1; };
    canvas.addEventListener('pointermove', e => {
      const i = colAt(e);
      if (i !== hover) {
        hover = i; hoverLine = -1;
        root.classList.toggle('is-picking', i >= 0);
        paint();
        opts.onHover && opts.onHover(i);
      }
    });
    canvas.addEventListener('pointerleave', () => {
      hover = -1; root.classList.remove('is-picking'); paint();
      opts.onHover && opts.onHover(-1);
    });
    canvas.addEventListener('click', e => {
      const i = colAt(e);
      if (i >= 0) { cur = i; line = -1; paint(); opts.onOpen && opts.onOpen(i); }
    });

    // ── Keys, while the figure has focus ───────────────────────────────
    const visibleOrder = () => order.map(k => items[k].i).filter(i => shown.has(i));
    canvas.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const ord = visibleOrder();
      const at = ord.indexOf(cur);
      let to = null;
      if (e.key === 'ArrowLeft') to = at < 0 ? ord[ord.length - 1] : ord[Math.max(0, at - 1)];
      else if (e.key === 'ArrowRight') to = at < 0 ? ord[0] : ord[Math.min(ord.length - 1, at + 1)];
      else if (e.key === 'Home') to = ord[0];
      else if (e.key === 'End') to = ord[ord.length - 1];
      else if (e.key === 'j' || e.key === 'k') { e.preventDefault(); opts.onStep && opts.onStep(e.key === 'j' ? 1 : -1); return; }
      else if (e.key === 'Enter' && cur >= 0) { e.preventDefault(); opts.onOpen && opts.onOpen(cur); return; }
      else if (e.key === 'v') { e.preventDefault(); setView(view === 'len' ? 'cv' : 'len'); return; }
      if (to != null) {
        e.preventDefault();
        cur = to; line = -1; root.classList.add('is-picking'); paint();
        opts.onPick && opts.onPick(to);
      }
    });
    canvas.addEventListener('blur', () => { root.classList.remove('is-picking'); paint(); });

    function setView(v) {
      view = v;
      viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pfView === v)));
      draw();
    }
    viewBtns.forEach(b => b.addEventListener('click', () => setView(b.dataset.pfView)));

    if ('ResizeObserver' in window) {
      let last = 0;
      new ResizeObserver(() => { const w = Math.round(canvas.clientWidth); if (w && w !== last) { last = w; draw(); } }).observe(canvas);
    } else {
      window.addEventListener('resize', draw);
    }
    draw();

    return {
      // the page's current poem (and, optionally, one of its lines)
      pick(i, j) { cur = i; line = j == null ? -1 : j; paint(); },
      // a passing hover from the list: a poem, or one of its lines
      hover(i, j) { hover = i; hoverLine = j == null ? -1 : j; paint(); },
      filter(set) { shown = new Set(set); paint(); },
      toggleView() { setView(view === 'len' ? 'cv' : 'len'); },
      focus() { canvas.focus(); },
      band
    };
  }

  window.PoemsFigure = { measure, mount, POETS };
})();
