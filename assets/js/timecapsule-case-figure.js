// TimeCapsule (projects/timecapsule-18th-century-llm.md), beside the corpus
// table: the model's vocabulary as a compositor's type case. Its eight
// compartments are sized by the corpus categories (the table's
// percentages, to area), each filled with sorts. In front, a composing
// stick: pick one of the three prompt slips — airplane, computer, internet —
// and the stick sets, letter by letter, words from TimeCapsule's actual
// completion (Case B), while the modern word stands on a stick of its own in
// dashed outline, the word it has no type for.
//
// Drawn flat, as a plan seen from straight above: the case's compartments
// are already areas, so the plan shows the shares exactly. The framed card
// follows Ryan's Anatomy figures (github.com/wheresryan22/anatomy, MIT);
// the code and kit are this site's own.

(function () {
  const root = document.getElementById('timecapsule-case-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, rect, line, text, interact } = window.LineFigure;

  // The corpus table, largest first.
  const CATS = [
    { name: 'Parliamentary / Legal', n: 50627, pct: 37.1 },
    { name: 'Periodicals', n: 22208, pct: 16.3 },
    { name: 'Other', n: 23314, pct: 17.1 },
    { name: 'Medical', n: 10121, pct: 7.4 },
    { name: 'Poetry', n: 10109, pct: 7.4 },
    { name: 'Literary Fiction', n: 9318, pct: 6.8 },
    { name: 'Biography / Memoir', n: 6668, pct: 4.9 },
    { name: 'Religious / Theological', n: 3937, pct: 2.9 }
  ];

  // Case B's table: what TimeCapsule set for each word, and what a modern
  // model says. The stick sets words taken from its completion.
  const PROBES = [
    { word: 'AIRPLANE', set: 'AN AIR-PUMP', quote: '“…quite useless in open air…an air-pump”', modern: '“soaring high above the clouds”' },
    { word: 'COMPUTER', set: 'THE RIGHT LUNG', quote: '“the right lung is enlarged and hypertrophied…”', modern: '“running much more slowly than usual today”' },
    { word: 'INTERNET', set: 'THE SEA', quote: '“the sea, and the sea is its great enemy”', modern: '“a vast, constantly evolving network”' }
  ];

  // The case, in plan: inner floor x 2..100, y 2..32, laid out like a
  // treemap — Parliamentary takes a full-depth column, Periodicals over
  // Other the next, the five small categories stacked in the last — every
  // compartment's area in proportion to its share.
  const IN = { u0: 2, v0: 2, u1: 100, v1: 32 };
  const depth = IN.v1 - IN.v0;
  const per = (IN.u1 - IN.u0) * depth / 100;     // floor area per percent
  const cols = [[0], [1, 2], [3, 4, 5, 6, 7]];
  let u = IN.u0;
  cols.forEach(col => {
    const total = col.reduce((s, i) => s + CATS[i].pct, 0);
    const w = total * per / depth;
    let v = IN.v0;
    col.forEach(i => {
      const d = CATS[i].pct / total * depth;
      Object.assign(CATS[i], { u0: u, u1: u + w, v0: v, v1: v + d });
      v += d;
    });
    u += w;
  });

  const PITCH = 3.4, SORT = 2.2;
  const STICK = { u0: 4, u1: 84, v0: 42, v1: 52 };
  const GHOST = { u0: 4, u1: 50, v0: 60, v1: 70 };
  const SLIP = { u0: 90, u1: 111, v0: 41, h: 7, step: 9 };
  const SW = 5;                                 // a sort's width on the stick

  const svg = makeSvg(root, '-10 -10 135 92',
    'A compositor’s type case on a bench, seen from above, its eight compartments sized by TimeCapsule’s corpus categories, from Parliamentary and Legal (37.1%) down to Religious and Theological (2.9%). In front, a composing stick sets words from TimeCapsule’s completions — AN AIR-PUMP for airplane, THE RIGHT LUNG for computer, THE SEA for internet — beside the modern word in dashed outline.');

  svg.classList.add('lf-flat');

  // The bench, with a screw at each corner and its plate along the near edge.
  rect(svg, -6, -6, 121, 84, 'lf-solid', 1.5);
  [[-3.5, -3.5], [112.5, -3.5], [-3.5, 75.5], [112.5, 75.5]].forEach(([x, y]) => {
    el('circle', { class: 'lf-solid', cx: x, cy: y, r: 1.1 }, svg);
    line(svg, x - 0.7, y, x + 0.7, y, 'lf-line lf-faint');
  });
  text(svg, '1800 – 1875 · 136,302 DOCUMENTS · 16.06 BILLION WORDS', 54.5, 75.9, 2.6, { 'text-anchor': 'middle', 'letter-spacing': 0.3 });

  // The case: its rim, then each compartment — a ground that fills when
  // lit, its sorts in rows, its dividing walls.
  rect(svg, 0, 0, 102, 34, 'lf-solid', 0.6);
  rect(svg, IN.u0, IN.v0, IN.u1 - IN.u0, IN.v1 - IN.v0, 'lf-line');
  const slots = CATS.map((c, i) => {
    const g = el('g', {}, svg);
    const band = rect(g, c.u0 + 0.5, c.v0 + 0.5, c.u1 - c.u0 - 1, c.v1 - c.v0 - 1, 'lf-band');
    // Fill the floor with sorts, a few missing.
    const nu = Math.floor((c.u1 - c.u0 - 1) / PITCH), nv = Math.floor((c.v1 - c.v0 - 1) / PITCH);
    const ou = c.u0 + (c.u1 - c.u0 - nu * PITCH) / 2, ov = c.v0 + (c.v1 - c.v0 - nv * PITCH) / 2;
    for (let b = 0; b < nv; b++) {
      for (let a = 0; a < nu; a++) {
        if ((a * 7 + b * 13 + i * 5) % 17 === 0) continue;
        rect(g, ou + a * PITCH + (PITCH - SORT) / 2, ov + b * PITCH + (PITCH - SORT) / 2, SORT, SORT, 'lf-solid', 0.3);
      }
    }
    return { g, band };
  });
  // Dividing walls, a unit thick, over the compartments' edges.
  CATS.forEach(c => {
    if (c.v1 < IN.v1 - 0.1) rect(svg, c.u0, c.v1 - 0.5, c.u1 - c.u0, 1, 'lf-solid');
    if (c.u0 > IN.u0 + 0.1) rect(svg, c.u0 - 0.5, c.v0, 1, c.v1 - c.v0, 'lf-solid');
  });
  // A label holder on the near wall, and two pulls below it.
  rect(svg, 35, 32.4, 32, 3.4, 'lf-solid', 0.4);
  text(svg, 'TIMECAPSULE · 1875', 51, 34.95, 2.2, { 'text-anchor': 'middle', 'letter-spacing': 0.3 });
  [12, 90].forEach(x => el('path', { class: 'lf-solid', d: `M ${x - 2.6} 34 A 2.6 2.6 0 0 0 ${x + 2.6} 34 Z` }, svg));

  // Three prompt slips.
  const slips = PROBES.map((p, k) => {
    const y = SLIP.v0 + k * SLIP.step;
    const g = el('g', {}, svg);
    rect(g, SLIP.u0, y, SLIP.u1 - SLIP.u0, SLIP.h, 'lf-solid', 0.4);
    text(g, p.word, (SLIP.u0 + SLIP.u1) / 2, y + SLIP.h / 2 + 0.9, 2.6, { 'text-anchor': 'middle', 'letter-spacing': 0.3 });
    return g;
  });

  // A composing stick, from above: its title, the back wall, the bed, the
  // fixed head at the left, the sorts with their letters, and the knee that
  // closes up behind the last one.
  function stick(s, cls, n, title) {
    const g = el('g', { class: cls }, svg);
    text(g, title, s.u0 + 3.5, s.v0 - 1.6, 2.2, { 'letter-spacing': 0.35 });
    rect(g, s.u0, s.v0 + 1.5, s.u1 - s.u0, s.v1 - s.v0 - 1.5, 'lf-solid');
    rect(g, s.u0, s.v0, s.u1 - s.u0, 1.5, 'lf-solid');
    rect(g, s.u0, s.v0, 3, s.v1 - s.v0, 'lf-solid');
    const sorts = [];
    for (let k = 0; k < n; k++) {
      const x = s.u0 + 3.5 + k * SW;
      const sg = el('g', {}, g);
      rect(sg, x, s.v0 + 2.5, SW - 0.4, s.v1 - s.v0 - 3.5, 'lf-solid', 0.3);
      const t = text(sg, '', x + (SW - 0.4) / 2, s.v0 + 2.5 + (s.v1 - s.v0 - 3.5) / 2 + 1.6, 4.6, { 'text-anchor': 'middle' });
      sorts[k] = { g: sg, t };
    }
    const knee = rect(g, s.u0 + 3.5, s.v0 + 1.5, 1.6, s.v1 - s.v0 - 1.5, 'lf-solid');
    return { g, knee, sorts, s };
  }
  const set = stick(STICK, '', Math.max(...PROBES.map(p => p.set.length)), 'SET FROM ITS COMPLETION');
  const ghost = stick(GHOST, 'lf-ghost', 8, 'NO TYPE FOR IT');
  function show(st, text, count) {
    st.sorts.forEach((sort, k) => {
      const on = k < count && k < text.length;
      sort.g.style.display = on ? '' : 'none';
      if (on) sort.t.textContent = text[k] === ' ' ? '' : text[k];
      // The line being set is the figure's output: its letters wear the accent.
      sort.t.classList.toggle('lf-hot', st === set);
    });
    const end = st.s.u0 + 3.5 + Math.min(count, text.length) * SW + 0.2;
    st.knee.setAttribute('x', end.toFixed(2));
  }

  // Setting a word, one sort at a time (all at once under reduced motion).
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0;
  function compose(p) {
    clearTimeout(timer);
    const text = PROBES[p].set;
    show(ghost, PROBES[p].word, 8);
    slips.forEach((g, k) => g.classList.toggle('is-lit', k === p));
    if (still.matches) return show(set, text, text.length);
    let n = 0;
    (function step() {
      show(set, text, n);
      if (n++ < text.length) timer = setTimeout(step, text[n - 1] === ' ' ? 60 : 130);
    })();
  }
  show(set, PROBES[0].set, PROBES[0].set.length);
  show(ghost, PROBES[0].word, 8);

  const N = CATS.length;
  interact({
    root, svg,
    count: N + PROBES.length,
    tour: 2800,
    rest: 'its whole vocabulary, in eight cases · pick a slip to set a word',
    describe: i => {
      if (i < N) {
        const c = CATS[i];
        return `${c.name} · ${c.n.toLocaleString('en-US')} documents · ${c.pct}% of the corpus`;
      }
      const p = PROBES[i - N];
      return `${p.word.toLowerCase()} → ${p.quote} · GPT-5.1: ${p.modern}`;
    },
    pick: (x, y) => {
      const c = CATS.findIndex(c => x >= c.u0 && x < c.u1 && y >= c.v0 && y < c.v1);
      if (c >= 0) return c;
      if (x >= SLIP.u0 && x <= SLIP.u1) {
        const k = Math.floor((y - SLIP.v0) / SLIP.step);
        if (k >= 0 && k < PROBES.length && y - SLIP.v0 - k * SLIP.step <= SLIP.h) return N + k;
      }
      return -1;
    },
    onChange: i => { if (i >= N) compose(i - N); },
    draw: (glow, active) => {
      slots.forEach((s, i) => {
        s.g.classList.toggle('is-lit', i === active);
        s.band.classList.toggle('is-lit', i === active);
      });
    }
  });
})();
