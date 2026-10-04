// TimeCapsule semantic shift (projects/timecapsule-18th-century-llm.md):
// where "time" lands on a nature → factory axis in each model. Values are
// the study's projections (semantic_axis_results.json). One projection per
// model, so no intervals are drawn — the paper's PNG drew ±0.8 bars that
// were placeholders, not measurements.

(function () {
  const root = document.getElementById('axis-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  const MODELS = [
    { name: 'BERT', era: 'modern baseline', value: 6.665, shape: 'circle' },
    { name: 'TimeCapsule', era: '1800–1875', value: 14.148, shape: 'square' }
  ];
  const MIN = 0, MAX = 20;
  const X0 = 30, X1 = 390, Y = 70;
  const xOf = v => X0 + (v - MIN) / (MAX - MIN) * (X1 - X0);

  const svg = makeSvg(root, '0 20 420 94',
    'A line from nature to factory. The modern BERT model places "time" at 6.7; TimeCapsule places it at 14.1, 7.5 units closer to factory — 2.1 times as far along.');

  el('line', { class: 'lf-line lf-strong', x1: X0, y1: Y, x2: X1, y2: Y }, svg);
  for (let v = MIN; v <= MAX; v += 5) {
    el('line', { class: 'lf-line', x1: xOf(v), y1: Y - 3, x2: xOf(v), y2: Y + 3 }, svg);
    const t = el('text', { class: 'lf-label', x: xOf(v), y: Y + 16, 'text-anchor': 'middle' }, svg);
    t.textContent = v;
  }
  [['NATURE', X0, 'start'], ['FACTORY', X1, 'end']].forEach(([text, x, anchor]) => {
    const t = el('text', { class: 'lf-label lf-label--head', x, y: Y + 36, 'text-anchor': anchor }, svg);
    t.textContent = text;
  });

  // The shift between them, as a bracket above the line.
  const a = xOf(MODELS[0].value), b = xOf(MODELS[1].value);
  el('path', { class: 'lf-line', d: `M ${a} ${Y - 26} L ${a} ${Y - 32} L ${b} ${Y - 32} L ${b} ${Y - 26}` }, svg);
  const delta = el('text', { class: 'lf-label', x: (a + b) / 2, y: Y - 38, 'text-anchor': 'middle' }, svg);
  delta.textContent = `Δ ${(MODELS[1].value - MODELS[0].value).toFixed(1)} · ${(MODELS[1].value / MODELS[0].value).toFixed(1)}×`;

  const marks = MODELS.map(m => {
    const g = el('g', {}, svg);
    const x = xOf(m.value);
    if (m.shape === 'circle') el('circle', { class: 'lf-solid', cx: x, cy: Y, r: 6 }, g);
    else el('rect', { class: 'lf-solid', x: x - 5.5, y: Y - 5.5, width: 11, height: 11 }, g);
    const t = el('text', { class: 'lf-label lf-label--head', x, y: Y - 13, 'text-anchor': 'middle' }, g);
    t.textContent = m.name;
    return { g, x };
  });

  interact({
    root, svg,
    count: MODELS.length,
    rest: '“time” on the nature → factory axis, one projection per model',
    describe: i => {
      const m = MODELS[i];
      return `${m.name} (${m.era}) · “time” projects to ${m.value.toFixed(2)}`;
    },
    pick: x => (Math.abs(x - marks[0].x) < Math.abs(x - marks[1].x) ? 0 : 1),
    draw: (glow, active) => marks.forEach((m, i) => m.g.classList.toggle('is-lit', i === active))
  });
})();
