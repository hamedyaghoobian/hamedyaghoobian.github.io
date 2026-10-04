// TimeCapsule expert evaluation (projects/timecapsule-18th-century-llm.md):
// the ten topics, each with one real Victorian passage and one TimeCapsule
// passage, and both experts' calls on each. A soft dot is a right call; a
// ringed cross is a wrong one — so the real column's crosses are genuine
// prose taken for the machine's. Calls are the experts' origin judgments
// (Q1) from the study's response sheet; sources are the answer key's.

(function () {
  const root = document.getElementById('experts-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  // [topic, real passage's source, calls on it (A, B), calls on the
  // generated passage (A, B)]; H = judged human-written, M = machine.
  const ROWS = [
    ['The British Museum', 'William Makepeace Thackeray, The Newcomes (1855)', 'MM', 'MH'],
    ['A walk through London', 'Charles Dickens, Sketches by Boz (1836)', 'HH', 'MH'],
    ['The London season', 'Anthony Trollope, The Way We Live Now (1875)', 'MM', 'MM'],
    ['The working poor', 'Henry Mayhew, London Labour and the London Poor (1851)', 'HM', 'MM'],
    ['Country parish life', 'George Eliot, Scenes of Clerical Life (1857)', 'MH', 'MH'],
    ['Sunday observance', 'Charles Dickens, Little Dorrit (1857)', 'HM', 'MM'],
    ['Education', 'Matthew Arnold, Culture and Anarchy (1869)', 'HH', 'MM'],
    ['The countryside in autumn', 'Anthony Trollope, The Small House at Allington (1864)', 'MM', 'MH'],
    ['The English gentleman', 'John Henry Newman, The Idea of a University (1852)', 'HH', 'MM'],
    ['The railways', 'Samuel Smiles, Lives of the Engineers (1862)', 'HH', 'MM']
  ];

  const LABEL_X = 168;
  const COLS = [{ x: 236, truth: 'H', name: 'Real passage' }, { x: 346, truth: 'M', name: 'TimeCapsule' }];
  const GAP = 16;                      // between Expert A and B in a column
  const TOP = 58, ROW = 20;
  const rowY = r => TOP + r * ROW;

  const svg = makeSvg(root, '0 0 420 300',
    'For ten topics, a real Victorian passage and a TimeCapsule passage, with each expert\'s call. Expert A got all ten TimeCapsule passages right but called 4 of 10 real passages machine-written; Expert B accepted 4 TimeCapsule passages as human and called 5 real passages machine-written.');

  // Column heads.
  COLS.forEach(c => {
    const head = el('text', { class: 'lf-label lf-label--head', x: c.x, y: 18, 'text-anchor': 'middle' }, svg);
    head.textContent = c.name;
    ['A', 'B'].forEach((who, j) => {
      const t = el('text', { class: 'lf-label', x: c.x + (j - 0.5) * GAP, y: 36, 'text-anchor': 'middle' }, svg);
      t.textContent = who;
    });
  });
  el('line', { class: 'lf-line lf-faint', x1: 0, y1: 44, x2: 420, y2: 44 }, svg);

  // A band per row and column, lit when picked.
  const bands = [];
  ROWS.forEach((row, r) => COLS.forEach((c, k) => {
    bands[r * 2 + k] = el('rect', { class: 'lf-band', x: c.x - 34, y: rowY(r) - ROW / 2, width: 68, height: ROW, rx: 3 }, svg);
  }));

  ROWS.forEach((row, r) => {
    const label = el('text', { class: 'lf-label', x: LABEL_X, y: rowY(r) + 3.5, 'text-anchor': 'end' }, svg);
    label.textContent = row[0];
    COLS.forEach((c, k) => {
      [...row[k + 2]].forEach((call, j) => {
        const x = c.x + (j - 0.5) * GAP, y = rowY(r);
        if (call === c.truth) {
          el('circle', { class: 'lf-dot', cx: x, cy: y, r: 2.6 }, svg);
        } else {
          const g = el('g', { class: 'is-lit' }, svg);
          el('circle', { class: 'lf-line lf-strong', cx: x, cy: y, r: 5.5 }, g);
          el('path', { class: 'lf-line lf-strong', d: `M ${x - 2.6} ${y - 2.6} L ${x + 2.6} ${y + 2.6} M ${x + 2.6} ${y - 2.6} L ${x - 2.6} ${y + 2.6}` }, g);
        }
      });
    });
  });

  // Totals: wrong calls per expert, per column.
  const footY = rowY(ROWS.length - 1) + 26;
  el('line', { class: 'lf-line lf-faint', x1: 0, y1: footY - 13, x2: 420, y2: footY - 13 }, svg);
  const foot = el('text', { class: 'lf-label', x: LABEL_X, y: footY + 3.5, 'text-anchor': 'end' }, svg);
  foot.textContent = 'wrong calls (of 10)';
  COLS.forEach((c, k) => [0, 1].forEach(j => {
    const wrong = ROWS.filter(row => row[k + 2][j] !== c.truth).length;
    const t = el('text', { class: 'lf-label lf-label--head', x: c.x + (j - 0.5) * GAP, y: footY + 3.5, 'text-anchor': 'middle' }, svg);
    t.textContent = wrong;
  }));

  // Key.
  el('circle', { class: 'lf-dot', cx: 10, cy: footY + 22, r: 2.6 }, svg);
  const k1 = el('text', { class: 'lf-label', x: 18, y: footY + 25.5 }, svg);
  k1.textContent = 'right call';
  const kg = el('g', { class: 'is-lit' }, svg);
  el('circle', { class: 'lf-line lf-strong', cx: 86, cy: footY + 22, r: 5.5 }, kg);
  el('path', { class: 'lf-line lf-strong', d: `M 83.4 ${footY + 19.4} L 88.6 ${footY + 24.6} M 88.6 ${footY + 19.4} L 83.4 ${footY + 24.6}` }, kg);
  const k2 = el('text', { class: 'lf-label', x: 97, y: footY + 25.5 }, svg);
  k2.textContent = 'wrong call';

  const word = call => (call === 'H' ? 'human' : 'machine');
  const mark = (call, truth) => `${word(call)} ${call === truth ? '✓' : '✗'}`;

  interact({
    root, svg,
    count: ROWS.length * 2,
    rest: 'Hover a passage for its source and both experts’ calls',
    describe: i => {
      const row = ROWS[Math.floor(i / 2)], k = i % 2, c = COLS[k];
      const calls = row[k + 2];
      const what = k === 0 ? `real: ${row[1]}` : 'TimeCapsule passage';
      return `${row[0]} · ${what} · A: ${mark(calls[0], c.truth)} · B: ${mark(calls[1], c.truth)}`;
    },
    pick: (x, y) => {
      const r = Math.round((y - TOP) / ROW);
      if (r < 0 || r >= ROWS.length) return -1;
      return r * 2 + (x < (COLS[0].x + COLS[1].x) / 2 ? 0 : 1);
    },
    draw: (glow, active) => bands.forEach((b, i) => b.classList.toggle('is-lit', i === active))
  });
})();
