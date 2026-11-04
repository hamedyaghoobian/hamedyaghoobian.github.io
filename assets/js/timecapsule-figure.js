// TimeCapsule (projects/timecapsule-18th-century-llm.md): the model's
// whole world is a shelf of volumes from 1800 to 1875 that ends at a cliff.
// Past the edge the ground runs on to 1969 with the paper's eight post-1875
// technologies standing on it in dashed outline (dates as in the paper's
// horizon figure). Drawn flat, as a front elevation over a timeline that is
// to scale: each object stands in its own slot, a leader running down to
// its year on the scale, since the first three (1876, 1879, 1886) would
// otherwise stand on top of one another. For the three the page probes —
// airplane, computer, internet — the caption quotes how TimeCapsule
// completes them.

(function () {
  const root = document.getElementById('timecapsule-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, rect, line, nearest, interact } = window.LineFigure;

  const START = 1800;
  const CLIFF = 1875;
  const END = 1980;
  const X0 = 0, YR = 1.9;              // viewBox units per year, both sides
  const xOf = year => X0 + (year - START) * YR;

  // Dates and notes from the paper (generate_paper_figures.py and
  // epistemological_comparison.json); quotes from the page's own table.
  // Each object is drawn in front elevation around its foot at (0, 0),
  // y up being negative, as a list of [shape, …attributes].
  const TECH = [
    {
      name: 'Telephone', year: 1876, note: 'Bell’s patent',
      // a candlestick phone: base, stem, mouthpiece, receiver on its hook
      parts: [['rect', -6, -3, 12, 3], ['rect', -1.2, -24, 2.4, 21], ['rect', -3.5, -28, 7, 4], ['path', 'M 1.2 -20 L 5 -20'], ['rect', 4.5, -21, 3, 11, 1.2]]
    },
    {
      name: 'Electric light', year: 1879, note: 'Edison’s practical bulb',
      // a bulb on its screw base
      parts: [['rect', -3, -5, 6, 5], ['path', 'M -3 -3.4 L 3 -3.4 M -3 -1.8 L 3 -1.8'], ['path', 'M -3.6 -5 L -3.6 -9 C -9 -12 -9 -26 0 -26 C 9 -26 9 -12 3.6 -9 L 3.6 -5 Z'], ['path', 'M -1.6 -9 L -1.6 -15 L 0 -18 L 1.6 -15 L 1.6 -9']]
    },
    {
      name: 'Automobile', year: 1886, note: 'Benz Patent-Motorwagen',
      // the three-wheeler, side on: body, seat back, big rear wheel, small front one
      parts: [['rect', -10, -12, 19, 5, 1], ['rect', -6, -19, 4, 7], ['path', 'M 7 -12 L 5 -20 L 8 -20'], ['circle', -6, -5, 5], ['circle', 8, -3, 3]]
    },
    {
      name: 'Airplane', year: 1903, note: 'TimeCapsule: “quite useless in open air… an air-pump”',
      // a biplane in flight, side on: two wings, struts, the elevator ahead
      parts: [['rect', -9, -46, 18, 1.4], ['rect', -9, -37, 18, 1.4], ['path', 'M -7 -44.6 L -7 -37 M 0 -44.6 L 0 -37 M 7 -44.6 L 7 -37 M 9 -41 L 16 -41 M 13 -43 L 16 -43 L 16 -39 L 13 -39 M -9 -41 L -14 -41 L -14 -45']]
    },
    {
      name: 'Radio', year: 1920,
      // a cathedral cabinet set: arched case, speaker cloth, a dial
      parts: [['path', 'M -8 0 L -8 -14 C -8 -24 8 -24 8 -14 L 8 0 Z'], ['circle', 0, -12, 4], ['circle', 0, -4, 1.2]]
    },
    {
      name: 'Television', year: 1927, note: 'Farnsworth',
      // a cabinet with its round-cornered screen and two knobs
      parts: [['rect', -9, -22, 18, 22], ['rect', -6.5, -19, 13, 11, 2.5], ['circle', -3, -4, 1.3], ['circle', 3, -4, 1.3]]
    },
    {
      name: 'Computer', year: 1945, note: 'TimeCapsule: “the right lung is enlarged and hypertrophied”',
      // a cabinet with two tape reels and a panel of lamps
      parts: [['rect', -9, -36, 18, 36], ['circle', -4, -29, 3.2], ['circle', 4, -29, 3.2], ['rect', -6.5, -21, 13, 8], ['circle', -3.5, -17, 1], ['circle', 0, -17, 1], ['circle', 3.5, -17, 1], ['path', 'M -6.5 -9 L 6.5 -9']]
    },
    {
      name: 'Internet', year: 1969, note: 'TimeCapsule: “the sea, and the sea is its great enemy”',
      // three nodes, linked
      parts: [['rect', -9, -7, 7, 7], ['rect', 2, -19, 7, 7], ['rect', -7, -31, 7, 7], ['path', 'M -5.5 -7 L 5.5 -12 M 5.5 -19 L -3.5 -24']]
    }
  ];

  const BASE = 12;                     // the timeline, under everything
  const T = 14;                        // the shelf stands this far above the ground: the cliff
  const BOOKS = 22;
  const BW = 3.6;                      // a volume's thickness
  const L = xOf(CLIFF);
  // Slots past the cliff, one per object, evenly spaced to the end.
  const S0 = L + 14, S1 = xOf(END) - 14;
  const K = 1.1;                       // the objects' drawing scale
  const slotX = TECH.map((_, i) => S0 + i * (S1 - S0) / (TECH.length - 1));

  const svg = makeSvg(root, '-6 -62 360 92',
    'A shelf of Victorian volumes from 1800 to 1875 ending at a cliff. Beyond it, over a timeline to scale and in dashed outline: a telephone (1876), an electric light bulb (1879), a three-wheeled automobile (1886), an airplane (1903), a radio (1920), a television (1927), a computer cabinet (1945) and linked network nodes (1969) — things the model cannot know.');

  // The scale, under everything.
  line(svg, X0, BASE, xOf(END), BASE, 'lf-line lf-faint');
  [[1800, 'start'], [1875, 'middle'], [1900, 'middle'], [1950, 'middle']].forEach(([year, anchor]) => {
    line(svg, xOf(year), BASE, xOf(year), BASE + 4, 'lf-line');
    const t = el('text', { class: 'lf-text', x: xOf(year), y: BASE + 14, 'text-anchor': anchor }, svg);
    t.textContent = year;
  });

  // Terra incognita: the ground past the edge, only outlined.
  line(svg, L, 0, xOf(END), 0, 'lf-line lf-ghost');

  // The objects, each in its slot with a leader down to its year.
  const marks = TECH.map((t, i) => {
    const g = el('g', { class: 'lf-ghost' }, svg);
    line(g, slotX[i], 0, xOf(t.year), BASE, 'lf-line lf-faint');
    line(g, xOf(t.year), BASE - 2.5, xOf(t.year), BASE + 2.5, 'lf-line');
    const body = el('g', { class: 'lf-face', transform: `translate(${slotX[i].toFixed(2)} 0) scale(${K})` }, g);
    t.parts.forEach(([kind, ...a]) => {
      if (kind === 'rect') rect(body, a[0], a[1], a[2], a[3], 'lf-line', a[4]);
      else if (kind === 'circle') el('circle', { class: 'lf-line', cx: a[0], cy: a[1], r: a[2] }, body);
      else el('path', { class: 'lf-line', d: a[0] }, body);
    });
    return g;
  });

  // The shelf: a block standing T above the ground, its right end the
  // cliff, and the volumes on it.
  rect(svg, X0, -T, L - X0, T + BASE);
  const shelf = el('g', {}, svg);
  const bookH = i => 16 + ((i * 37) % 13);
  for (let i = 0; i < BOOKS; i++) {
    const x = X0 + 2 + i * ((L - X0 - 4) / BOOKS);
    const h = bookH(i);
    const g = el('g', {}, shelf);
    rect(g, x, -T - h, BW, h, 'lf-solid', 0.6);
    line(g, x + 0.6, -T - h + 3, x + BW - 0.6, -T - h + 3, 'lf-line lf-faint');
    line(g, x + 0.6, -T - 4, x + BW - 0.6, -T - 4, 'lf-line lf-faint');
  }

  const past = year => {
    const n = year - CLIFF;
    return `${n} year${n === 1 ? '' : 's'} past the horizon`;
  };

  interact({
    root, svg,
    count: TECH.length + 1,
    rest: 'Trained on 1800–1875 · nothing after it exists for the model',
    describe: i => {
      if (i === 0) return '1800–1875 · 136,302 documents, 16.06 billion words · everything it has read';
      const t = TECH[i - 1];
      return `${t.name} · ${t.year}, ${past(t.year)}` + (t.note ? ` · ${t.note}` : '');
    },
    // Anywhere over the shelf picks it; past the cliff, the nearest slot.
    pick: x => {
      if (x < L) return 0;
      const i = nearest(x, slotX, 16);
      return i < 0 ? -1 : i + 1;
    },
    draw: (glow, active) => {
      shelf.classList.toggle('is-lit', active === 0);
      marks.forEach((m, i) => m.classList.toggle('is-lit', active === i + 1));
    }
  });
})();
