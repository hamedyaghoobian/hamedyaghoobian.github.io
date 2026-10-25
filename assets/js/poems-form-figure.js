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
// line lengths (standard deviation ÷ mean).
//
// Time runs right to left, as the page reads, on a broken axis: the
// classical centuries compressed on the right, the last century and a half
// spread out on the left. Hover or the arrow keys pick a poem; the caption
// gives its numbers; a click or Enter scrolls to the poem.

(function () {
  const root = document.getElementById('poems-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg } = window.LineFigure;

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
  const classical = name => POETS[name] && POETS[name][0] < 1850;

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

  // ── Layout: a broken time axis, right to left. ───────────────────────
  const Y0 = 26, Y1 = 196;              // plot top and bottom
  const LMAX = 40;                      // letters at the top of the scale
  const yOf = n => Y1 - Math.min(n, LMAX) / LMAX * (Y1 - Y0);
  const MOD = { from: 1870, to: 2030, x0: 470, x1: 40 };   // modern: wide, on the left
  const CLA = { from: 900, to: 1760, x0: 640, x1: 510 };   // classical: compressed, on the right
  const xOf = y => (y >= MOD.from
    ? MOD.x0 + (y - MOD.from) / (MOD.to - MOD.from) * (MOD.x1 - MOD.x0)
    : CLA.x0 + (y - CLA.from) / (CLA.to - CLA.from) * (CLA.x1 - CLA.x0));
  const GAP = 11;                       // closest two columns may stand

  function draw(poems) {
    const items = poems.map(p => {
      const [faName, enName] = (p.poet || '').split(' / ').map(s => s.trim());
      const lines = (p.verses || []).map(plain).filter(Boolean);
      const lens = lines.map(letters);
      return { p, faName: faName || enName, enName: enName || faName, lines, lens, v: cv(lens), year: when(enName || faName) };
    }).sort((a, b) => a.year - b.year || String(a.p.date).localeCompare(String(b.p.date)));

    // Columns too close to stand apart are set side by side about their year.
    const target = items.map(it => xOf(it.year));
    const order = target.map((x, i) => i).sort((a, b) => target[b] - target[a]);
    const xs = []; let last = Infinity;
    order.forEach(i => { xs[i] = Math.min(target[i], last - GAP); last = xs[i]; });
    // re-centre each run of pushed columns on its members' true places
    for (let a = 0; a < order.length;) {
      let b = a;
      while (b + 1 < order.length && Math.abs(xs[order[b + 1]] - xs[order[b]] + GAP) < 0.01) b++;
      const run = order.slice(a, b + 1), shift = mean(run.map(i => target[i])) - mean(run.map(i => xs[i]));
      run.forEach(i => { xs[i] += shift; });
      a = b + 1;
    }

    const svg = makeSvg(root, '0 -8 690 240',
      `A chart of ${items.length} poems by the length of their lines in letters, set against their poets' time from about 1000 to today, time running right to left. The classical poems' lines all fall within a narrow band; after 1937, the year of Nima's first free-verse poem, the modern poems' lines spread far above and below it.`);
    svg.classList.add('pf-figure');

    // The classical band: the range of every classical line here.
    const cl = items.filter(it => classical(it.enName)).flatMap(it => it.lens);
    const band = cl.length ? [Math.min(...cl), Math.max(...cl)] : null;
    if (band) {
      el('rect', { class: 'pf-band', x: 34, width: 612, y: yOf(band[1]), height: yOf(band[0]) - yOf(band[1]) }, svg);
      // named in the empty decades between the axis break and Qoqnus
      const lx = (xOf(1880) + xOf(BREAK)) / 2 + 6, ly = (yOf(band[1]) + yOf(band[0])) / 2;
      el('text', { class: 'pf-sub', x: lx, y: ly - 5, 'text-anchor': 'middle', direction: 'rtl' }, svg).textContent = 'مصراع‌های کلاسیک';
      el('text', { class: 'pf-sub', x: lx, y: ly + 13, 'text-anchor': 'middle', direction: 'rtl' }, svg)
        .textContent = `${fa(band[0])} تا ${fa(band[1])} حرف`;
    }

    // Axes: letters per line on the right; time beneath, in Solar Hijri.
    const ax = el('g', { class: 'pf-axis' }, svg);
    el('line', { x1: 34, x2: 646, y1: Y1, y2: Y1 }, ax);
    [10, 20, 30, 40].forEach(n => {
      el('line', { class: 'pf-grid', x1: 34, x2: 646, y1: yOf(n), y2: yOf(n) }, ax);
      el('text', { class: 'pf-tick', x: 652, y: yOf(n) + 4 }, ax).textContent = fa(n);
    });
    el('text', { class: 'pf-note', x: 672, y: Y0 - 19, 'text-anchor': 'start', direction: 'rtl' }, ax).textContent = 'حرف در هر سطر';
    const ticks = [[1000, 400], [1321, 700], [1721, 1100], [1921, 1300], [1971, 1350], [2021, 1400]];
    ticks.forEach(([g, sh]) => {
      const x = xOf(g);
      el('line', { x1: x, x2: x, y1: Y1, y2: Y1 + 4 }, ax);
      el('text', { class: 'pf-tick', x, y: Y1 + 18, 'text-anchor': 'middle' }, ax).textContent = fa(sh);
    });
    el('text', { class: 'pf-tick', x: 20, y: Y1 + 18, 'text-anchor': 'middle' }, ax).textContent = 'ش';
    // the break in the axis between the two eras
    const bx = (CLA.x1 + MOD.x0) / 2;
    el('path', { class: 'pf-break', d: `M${bx - 6} ${Y1 + 5} l4 -10 M${bx + 2} ${Y1 + 5} l4 -10` }, ax);
    el('rect', { x: bx - 5, y: Y1 - 1, width: 8, height: 2, class: 'pf-gap' }, ax);

    // The break: Nima's Qoqnus.
    const nx = xOf(BREAK);
    const nima = el('g', { class: 'pf-nima' }, svg);
    el('line', { x1: nx, x2: nx, y1: Y0 - 4, y2: Y1 }, nima);
    el('text', { x: nx - 4, y: Y0 + 1, direction: 'rtl', 'text-anchor': 'end' }, nima).textContent = `«ققنوس»، نیما، ${fa(BREAK - SH)}`;
    el('text', { class: 'pf-sub', x: nx - 4, y: Y0 + 19, direction: 'rtl', 'text-anchor': 'end' }, nima).textContent = 'آغاز شعر نو';

    // The poems: a hairline from shortest to longest line, a dot per line.
    const cols = items.map((it, i) => {
      const g = el('g', { class: 'pf-col' + (classical(it.enName) ? ' is-classical' : ''), 'data-i': i }, svg);
      const x = xs[i];
      el('rect', { class: 'pf-hit', x: x - GAP / 2, y: Y0 - 6, width: GAP, height: Y1 - Y0 + 12 }, g);
      if (it.lens.length > 1) el('line', { class: 'pf-range', x1: x, x2: x, y1: yOf(Math.max(...it.lens)), y2: yOf(Math.min(...it.lens)) }, g);
      it.lens.forEach(n => el('circle', { class: 'pf-dot', cx: x, cy: yOf(n), r: 3 }, g));
      return g;
    });

    // The caption, right to left; ' — ' between parts (a middle dot reads as ۰).
    const readout = document.getElementById(root.id + '-readout');
    if (readout) readout.dir = 'rtl';
    const rest = () => {
      const m = items.filter(it => !classical(it.enName) && it.v !== null), c = items.filter(it => classical(it.enName) && it.v !== null);
      const avg = a => Math.round(mean(a.map(it => it.v)) * 100);
      return `${fa(items.length)} شعر — پراکندگیِ طولِ سطرها: کلاسیک ${fa(avg(c))}٪، معاصر ${fa(avg(m))}٪`;
    };
    function say(i) {
      if (!readout) return;
      if (i < 0) { readout.textContent = rest(); return; }
      const it = items[i];
      const first = it.lines[0] || '';
      readout.textContent = `${it.faName} — ${fa(it.lines.length)} سطر — ${it.lens.map(fa).join('، ')} حرف — پراکندگی ${it.v === null ? 'تک‌سطر' : fa(Math.round(it.v * 100)) + '٪'} — «⁨${first.length > 34 ? first.slice(0, 33) + '…' : first}⁩»`;
    }

    let cur = -1;
    function pick(i) {
      cur = i;
      cols.forEach((g, k) => g.classList.toggle('is-lit', k === i));
      svg.classList.toggle('pf-picking', i >= 0);
      say(i);
    }
    function open(i) {
      const it = items[i];
      const cards = [...document.querySelectorAll(`.poem-card[data-date="${it.p.date}"]`)];
      const card = cards.find(c => c.textContent.includes(it.faName)) || cards[0];
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    svg.addEventListener('pointermove', e => {
      const g = e.target.closest('.pf-col');
      pick(g ? +g.dataset.i : -1);
    });
    svg.addEventListener('pointerleave', () => pick(-1));
    svg.addEventListener('click', e => { const g = e.target.closest('.pf-col'); if (g) open(+g.dataset.i); });
    root.tabIndex = 0;
    root.addEventListener('keydown', e => {
      // Time runs right to left: ← goes forward in time.
      const s = { ArrowLeft: 1, ArrowRight: -1 }[e.key];
      if (s) { e.preventDefault(); pick(cur < 0 ? (s > 0 ? 0 : items.length - 1) : Math.max(0, Math.min(items.length - 1, cur + s))); }
      else if (e.key === 'Enter' && cur >= 0) { e.preventDefault(); open(cur); }
      else if (e.key === 'Escape') pick(-1);
    });
    root.addEventListener('blur', () => pick(-1));
    say(-1);
  }

  (async () => {
    for (const path of ['/poems.json', 'poems.json', '../poems.json']) {
      try {
        const res = await fetch(path);
        if (res.ok) return draw(await res.json());
      } catch (e) { /* try the next */ }
    }
  })();
})();
