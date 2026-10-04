// AI Seasons (projects/ai-seasons.md): AI's summers and winters, 1950 to
// today. One thin slat per year stands on a plate, its height following a
// hand-drawn hype curve; winters are shaded on the plate. The curve is
// schematic, not measured — the project collected the data, it did not
// chart it.

(function () {
  const root = document.getElementById('seasons-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, edgeLabel, interact } = window.LineFigure;

  const START = 1950;
  const END = 2026;
  const ERAS = [
    { from: 1956, to: 1973, name: 'first summer', note: 'Dartmouth and symbolic AI' },
    { from: 1974, to: 1979, name: 'first AI winter', note: 'funding cuts after the Lighthill report', winter: true },
    { from: 1980, to: 1986, name: 'second summer', note: 'expert systems' },
    { from: 1987, to: 1993, name: 'second AI winter', note: 'the Lisp machine market collapses', winter: true },
    { from: 1994, to: 2011, name: 'long thaw', note: 'statistical machine learning' },
    { from: 2012, to: 2021, name: 'third summer', note: 'deep learning' },
    { from: 2022, to: END, name: 'LLM summer', note: 'large language models' }
  ];

  // Hype by year, 0…1. Eased between these points.
  const KEYS = [
    [1950, 0.05], [1956, 0.18], [1962, 0.45], [1968, 0.6], [1972, 0.55],
    [1975, 0.2], [1979, 0.15], [1983, 0.55], [1986, 0.68], [1988, 0.3],
    [1992, 0.12], [1997, 0.22], [2005, 0.2], [2011, 0.32], [2015, 0.62],
    [2019, 0.72], [2021, 0.66], [2023, 1.0], [END, 0.95]
  ];

  function hype(year) {
    for (let i = 1; i < KEYS.length; i++) {
      const [y1, v1] = KEYS[i];
      if (year <= y1) {
        const [y0, v0] = KEYS[i - 1];
        const t = (year - y0) / (y1 - y0);
        return v0 + (v1 - v0) * (1 - Math.cos(Math.PI * t)) / 2;
      }
    }
    return KEYS[KEYS.length - 1][1];
  }

  const STEP = 4;                      // world units per year
  const L = (END - START) * STEP;
  const D = 56;                        // plate depth
  const RIB = D / 2;                   // the ribbon stands mid-plate
  const H = 100;                       // tallest slat
  const LIFT = 0.14;                   // how far the lit era rises
  const T = 6;                         // plate thickness
  const uOf = year => (year - START) * STEP;

  const svg = makeSvg(root, '-12 -262 340 318',
    'An isometric timeline of AI\'s summers and winters from 1950 to today: hype rises in the 1960s, falls in the 1970s winter, rises with expert systems, falls again around 1990, and climbs with deep learning and large language models.');

  box(svg, 'lf-solid').set(0, 0, -T, L, D, 0);

  const bands = ERAS.map(era => el('polygon', {
    class: era.winter ? 'lf-shade' : 'lf-band',
    points: pts([iso(uOf(era.from), 0), iso(uOf(era.to + 1), 0), iso(uOf(era.to + 1), D), iso(uOf(era.from), D)])
  }, svg));

  [1956, 1974, 1987, 2012, 2022].forEach(year => {
    const [x, y] = iso(uOf(year), D, -T);
    el('line', { class: 'lf-line', x1: x, y1: y, x2: x, y2: y + 4 }, svg);
    edgeLabel(svg, year, uOf(year) + 1.5 / 0.866, D, -T - 13);
  });

  const years = [];
  for (let y = START; y <= END; y++) years.push(y);
  const eraOf = year => ERAS.findIndex(e => year >= e.from && year <= e.to);
  const eraOfYear = years.map(eraOf);

  // A paper-filled wall under the curve hides the plate's far edge behind it.
  const wall = el('polygon', { class: 'lf-wall' }, svg);
  const slats = years.map(() => el('line', { class: 'lf-line lf-faint' }, svg));
  const curve = el('polyline', { class: 'lf-line lf-strong' }, svg);
  const litCurve = el('polyline', { class: 'lf-line lf-strong is-lit', 'stroke-width': 1.6 }, svg);

  const slatX = years.map(year => iso(uOf(year), RIB)[0]);

  interact({
    root, svg,
    count: ERAS.length,
    rest: '1956–today · seven decades of summers and winters',
    describe: i => {
      const e = ERAS[i];
      return `${e.from}–${e.to === END ? 'today' : String(e.to).slice(2)} · ${e.name}, ${e.note}`;
    },
    // The pointer's position along the ribbon picks the year, then its era.
    pick: x => {
      const year = Math.round(START + (x / 0.866 - RIB) / STEP);
      return year < START || year > END ? -1 : eraOf(year);
    },
    draw: (glow, active) => {
      const tops = years.map((year, i) => {
        const era = eraOfYear[i];
        const h = hype(year) * H * (1 + LIFT * (era >= 0 ? glow[era] : 0));
        const [x0, y0] = iso(uOf(year), RIB, 0);
        const y1 = iso(uOf(year), RIB, h)[1];
        const s = slats[i];
        s.setAttribute('x1', x0); s.setAttribute('y1', y0);
        s.setAttribute('x2', x0); s.setAttribute('y2', y1);
        s.classList.toggle('is-lit', active >= 0 && era === active);
        return [x0, y1];
      });
      curve.setAttribute('points', pts(tops));
      litCurve.setAttribute('points', active < 0 ? '' : pts(tops.filter((_, i) => eraOfYear[i] === active)));
      wall.setAttribute('points', pts([iso(0, RIB), ...tops, iso(L, RIB)]));
      bands.forEach((b, i) => b.classList.toggle('is-lit', i === active));
    }
  });
})();
