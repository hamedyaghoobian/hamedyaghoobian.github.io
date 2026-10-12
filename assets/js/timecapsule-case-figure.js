// TimeCapsule (projects/timecapsule-18th-century-llm.md), beside the corpus
// table: the model's vocabulary as a compositor's type case. Its eight
// compartments are sized by the corpus categories (the table's
// percentages, to area), each filled with sorts. In front, a composing
// stick: pick one of the three prompt slips — airplane, computer, internet —
// and the stick sets, letter by letter, words from TimeCapsule's actual
// completion (Case B), while the modern word stands on a stick of its own in
// dashed outline, the word it has no type for.
//
// Drawn in the manner of Ryan's Anatomy figures (github.com/wheresryan22/
// anatomy, MIT): a dense real object, shaded faces, fittings, a framed card.
// The code and kit are this site's own.

(function () {
  const root = document.getElementById('timecapsule-case-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, box, cylinder, screw, onTop, onNear, face, interact } = window.LineFigure;

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

  // The case: inner floor u 2..100, v 2..32, laid out like a treemap —
  // Parliamentary takes a full-depth column, Periodicals over Other the
  // next, the five small categories stacked in the last — every
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

  const WALL = 5, DIV = 4, LIFT = 6, PITCH = 3.4, SORT = 2.2;
  const STICK = { u0: 6, u1: 82, v0: 44, v1: 52 };
  const GHOST = { u0: 6, u1: 52, v0: 80, v1: 88 };
  const SW = 5;                                 // a sort's width on the stick

  const svg = makeSvg(root, '-14 -66 202 134',
    'A compositor’s type case on a bench, its eight compartments sized by TimeCapsule’s corpus categories, from Parliamentary and Legal (37.1%) down to Religious and Theological (2.9%). In front, a composing stick sets words from TimeCapsule’s completions — AN AIR-PUMP for airplane, THE RIGHT LUNG for computer, THE SEA for internet — beside the modern word in dashed outline.');

  // The bench, on round feet, with screws at its corners.
  [[-2, -2], [111, -2], [-2, 92], [111, 92]].forEach(([fu, fv]) =>
    cylinder(svg, 'lf-solid lf-shaded').set(fu, fv, -9, -5, 2));
  box(svg, 'lf-solid lf-shaded').set(-6, -6, -5, 115, 96, 0);
  [[-3.5, -3.5], [112.5, -3.5], [-3.5, 93.5], [112.5, 93.5]].forEach(([su, sv]) => screw(svg, su, sv, 0));
  const plate = face(svg, onNear(14, 96, -0.8));
  el('text', { x: 0, y: 3, 'font-size': 2.9, 'letter-spacing': 0.4 }, plate).textContent = '1800 – 1875 · 136,302 DOCUMENTS · 16.06 BILLION WORDS';

  // The case: its base, the far and right walls, then each compartment
  // (farthest first) with its sorts and its own near and left walls, and
  // last the case's near and left walls.
  box(svg, 'lf-solid lf-shaded').set(0, 0, 0, 102, 34, 1);
  box(svg, 'lf-solid lf-shaded').set(0, 0, 1, 102, 2, WALL + 1);
  box(svg, 'lf-solid lf-shaded').set(100, 0, 1, 102, 34, WALL + 1);

  const order = CATS.map((c, i) => i).sort((a, b) => (CATS[a].v0 - CATS[a].u0) - (CATS[b].v0 - CATS[b].u0));
  const slots = [];
  order.forEach(i => {
    const c = CATS[i];
    const slot = el('g', {}, svg);          // keeps the compartment's place
    const sorts = el('g', {}, slot);
    // Fill the floor with sorts, a few missing, farthest first.
    const nu = Math.floor((c.u1 - c.u0 - 1) / PITCH), nv = Math.floor((c.v1 - c.v0 - 1) / PITCH);
    const ou = c.u0 + (c.u1 - c.u0 - nu * PITCH) / 2, ov = c.v0 + (c.v1 - c.v0 - nv * PITCH) / 2;
    for (let b = 0; b < nv; b++) {
      for (let a = nu - 1; a >= 0; a--) {
        if ((a * 7 + b * 13 + i * 5) % 17 === 0) continue;
        const su = ou + a * PITCH + (PITCH - SORT) / 2, sv = ov + b * PITCH + (PITCH - SORT) / 2;
        box(sorts, 'lf-solid lf-shaded').set(su, sv, 1, su + SORT, sv + SORT, 2.6);
      }
    }
    const walls = el('g', {}, slot);
    if (c.v1 < IN.v1 - 0.1) box(walls, 'lf-solid lf-shaded').set(c.u0, c.v1 - 0.5, 1, c.u1, c.v1 + 0.5, DIV + 1);
    if (c.u0 > IN.u0 + 0.1) box(walls, 'lf-solid lf-shaded').set(c.u0 - 0.5, c.v0, 1, c.u0 + 0.5, c.v1, DIV + 1);
    slots[i] = { slot, sorts, walls };
  });
  const lifted = el('g', {}, svg);           // a lit compartment's sorts rise here
  box(svg, 'lf-solid lf-shaded').set(0, 0, 1, 2, 34, WALL + 1);
  box(svg, 'lf-solid lf-shaded').set(0, 32, 1, 102, 34, WALL + 1);
  // A brass label holder and two pulls on the case's near face.
  const holder = face(svg, onNear(39, 34, 4.6));
  el('rect', { class: 'lf-solid', x: 0, y: 0, width: 24, height: 3.4, rx: 0.4 }, holder);
  el('text', { x: 12, y: 2.55, 'font-size': 2.2, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, holder).textContent = 'TIMECAPSULE · 1875';
  [12, 90].forEach(pu => cylinder(svg, 'lf-solid lf-shaded').set(pu, 34.6, 2.2, 3.4, 1.1));

  // Three prompt slips, farthest first.
  const slips = PROBES.map(() => null);
  for (let k = PROBES.length - 1; k >= 0; k--) {
    const v0 = 36 + k * 8;
    const g = el('g', {}, svg);
    box(g, 'lf-solid lf-shaded').set(92, v0, 0, 111, v0 + 6, 0.6);
    const f = face(g, onTop(92, v0, 0.6));
    el('text', { x: 9.5, y: 4, 'font-size': 2.4, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, f).textContent = PROBES[k].word;
    slips[k] = g;
  }

  // A composing stick: back wall, base, the knee that follows the line,
  // the sorts (farthest first, so the nearer cover them), the fixed head.
  function stick(s, cls, n, title) {
    const g = el('g', { class: cls }, svg);
    box(g, 'lf-solid lf-shaded').set(s.u0, s.v0 - 1, 0, s.u1, s.v0 + 0.5, 12);
    // Its title engraved along the back wall, above the line of type.
    const f0 = face(g, onNear(s.u0 + 3.5, s.v0 + 0.5, 12));
    el('text', { x: 0.6, y: 2.4, 'font-size': 2.2, 'letter-spacing': 0.35 }, f0).textContent = title;
    box(g, 'lf-solid lf-shaded').set(s.u0, s.v0, 0, s.u1, s.v1, 1.2);
    const knee = box(g, 'lf-solid lf-shaded');
    const sorts = [];
    for (let k = n - 1; k >= 0; k--) {
      const su = s.u0 + 3.5 + k * SW;
      const sg = el('g', {}, g);
      box(sg, 'lf-solid lf-shaded').set(su, s.v0 + 1, 1.2, su + SW - 0.4, s.v1 - 1, 9.2);
      const f = face(sg, onNear(su, s.v1 - 1, 9.2));
      const t = el('text', { x: (SW - 0.4) / 2, y: 5.4, 'font-size': 4.6, 'text-anchor': 'middle' }, f);
      sorts[k] = { g: sg, t };
    }
    box(g, 'lf-solid lf-shaded').set(s.u0, s.v0 - 1, 0, s.u0 + 3, s.v1, 13);
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
    st.knee.set(end, st.s.v0 - 0.5, 1.2, end + 1.6, st.s.v1, 9.8);
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

  // From the view back to the bench top (h = 0).
  const C = Math.cos(Math.PI / 6);
  const toUV = (x, y) => { const a = x / C, b = y / 0.5; return [(a - b) / 2, (a + b) / 2]; };

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
      const [pu, pv] = toUV(x, y + 1);
      const c = CATS.findIndex(c => pu >= c.u0 && pu < c.u1 && pv >= c.v0 && pv < c.v1);
      if (c >= 0) return c;
      if (pu >= 90 && pu <= 113) {
        const k = Math.floor((pv - 36) / 8);
        if (k >= 0 && k < PROBES.length) return N + k;
      }
      return -1;
    },
    onChange: i => { if (i >= N) compose(i - N); },
    draw: (glow, active) => {
      CATS.forEach((c, i) => {
        const s = slots[i], g = glow[i];
        // The lit compartment's sorts leave their slot and rise above the walls.
        const up = g > 0.01;
        if (up && s.sorts.parentNode !== lifted) lifted.appendChild(s.sorts);
        if (!up && s.sorts.parentNode !== s.slot) s.slot.insertBefore(s.sorts, s.walls);
        s.sorts.setAttribute('transform', `translate(0 ${(-g * LIFT).toFixed(2)})`);
        s.sorts.classList.toggle('is-lit', i === active);
      });
    }
  });
})();
