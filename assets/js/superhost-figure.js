// Noisy Stars (projects/superhost-rating-reliability.md): the 4.8 line
// stands across a plate that runs from 4.5 to 5.0 stars. Each row is a
// listing: a pin at its displayed rating, and on the floor the range its
// true quality could plausibly sit in. Most ranges cross the line — the
// page's point that a displayed rating can't reliably sort listings. The
// listings are schematic, not measured; only 4.8 and 0.37 are the study's.

(function () {
  const root = document.getElementById('superhost-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, edgeLabel, interact } = window.LineFigure;

  // [displayed rating, half-width of its plausible range]
  const LISTINGS = [
    [4.58, 0.18], [4.71, 0.2], [4.77, 0.18], [4.82, 0.2],
    [4.86, 0.17], [4.91, 0.2], [4.97, 0.15]
  ];
  const LINE = 4.8;
  const LO = 4.5, HI = 5.0;

  const SCALE = 400;                   // world units per star
  const D = 64;                        // plate depth
  const T = 6;                         // plate thickness
  const ROW = k => 6 + k * 8.5;        // a listing's row across the plate
  const PIN = 10;                      // pin height at rest
  const LIFT = 8;                      // how far a lit pin rises
  const FENCE = 34;                    // height of the 4.8 line
  const uOf = r => (Math.max(LO, Math.min(HI, r)) - LO) * SCALE;
  const fmt = r => Math.max(LO, Math.min(HI, r)).toFixed(2);

  const svg = makeSvg(root, '-12 -114 252 172',
    'Seven listings on a scale from 4.5 to 5.0 stars, with a fence at 4.8. Each listing\'s plausible range is drawn on the floor; five of the seven ranges cross the 4.8 line.');

  box(svg, 'lf-solid').set(0, 0, -T, uOf(HI), D, 0);
  [[4.5, '4.5'], [4.8, '4.8'], [5.0, '5.0']].forEach(([r, text]) => {
    const [x, y] = iso(uOf(r), D, -T);
    el('line', { class: 'lf-line', x1: x, y1: y, x2: x, y2: y + 4 }, svg);
    edgeLabel(svg, text, uOf(r) + 1.7, D, -T - 13);
  });

  // Rows behind the fence first, then the fence, then rows in front of it
  // — the fence is see-through, so plain row order is enough.
  const rows = LISTINGS.map(([r, w], k) => {
    const g = el('g', {}, svg);
    const v = ROW(k);
    const a = iso(uOf(r - w), v), b = iso(uOf(r + w), v);
    el('line', { class: 'lf-line lf-strong', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, g);
    [r - w, r + w].forEach(end => {
      if (end < LO || end > HI) return;
      const p = iso(uOf(end), v - 2), q = iso(uOf(end), v + 2);
      el('line', { class: 'lf-line lf-faint', x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, g);
    });
    const stem = el('line', { class: 'lf-line' }, g);
    const head = el('circle', { class: 'lf-solid', r: 2.6 }, g);
    return { g, stem, head, u: uOf(r), v };
  });

  const fu = uOf(LINE);
  el('polygon', {
    class: 'lf-shade',
    points: pts([iso(fu, 0), iso(fu, D), iso(fu, D, FENCE), iso(fu, 0, FENCE)])
  }, svg);
  el('polyline', {
    class: 'lf-line lf-strong',
    points: pts([iso(fu, D), iso(fu, D, FENCE), iso(fu, 0, FENCE), iso(fu, 0)])
  }, svg);

  const pinTop = rows.map(row => iso(row.u, row.v, PIN));

  interact({
    root, svg,
    count: LISTINGS.length,
    rest: 'Reliability at the median listing: 0.37 · most ranges cross 4.8',
    describe: k => {
      const [r, w] = LISTINGS[k];
      const lo = r - w, hi = r + w;
      const verdict = lo < LINE && hi > LINE
        ? 'can’t be told apart from 4.8'
        : hi <= LINE ? 'clearly below the line' : 'clearly above the line';
      return `Shown ${r.toFixed(2)}★ · plausible ${fmt(lo)}–${fmt(hi)} · ${verdict}`;
    },
    // Nearest pin head on screen.
    pick: (x, y) => {
      let best = -1, dist = 30;
      pinTop.forEach(([px, py], k) => {
        const d = Math.hypot(px - x, py - y);
        if (d < dist) { best = k; dist = d; }
      });
      return best;
    },
    draw: (glow, active) => {
      rows.forEach((row, k) => {
        const [x0, y0] = iso(row.u, row.v, 0);
        const y1 = iso(row.u, row.v, PIN + LIFT * glow[k])[1];
        row.stem.setAttribute('x1', x0); row.stem.setAttribute('y1', y0);
        row.stem.setAttribute('x2', x0); row.stem.setAttribute('y2', y1);
        row.head.setAttribute('cx', x0); row.head.setAttribute('cy', y1);
        row.g.classList.toggle('is-lit', k === active);
      });
    }
  });
})();
