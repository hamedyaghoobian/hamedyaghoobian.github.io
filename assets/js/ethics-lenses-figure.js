// AI and Data Ethics (tools.md): a bench with six lens discs in front of a
// board. Picking a lens (pointer, arrow keys, or 1–6) lifts it, and the
// board shows the question that lens asks of a case — the "practical
// ethical frameworks" the platform is built around, as something to try.
//
// The six lenses follow the Markkula Center for Applied Ethics' framework
// for ethical decision-making (rights, justice, utilitarian, common good,
// virtue, care); the questions are paraphrased, not quoted. They are this
// figure's choice, not the course's syllabus — swap them for the course's
// own frameworks when it has them. The board also says when it opens.

(function () {
  const root = document.getElementById('ethics-figure');
  if (!root || !window.LineFigure) return;
  const { iso, el, svg: makeSvg, box, onTop, onNear, face, nearest, interact } = window.LineFigure;

  // [lens, the question it asks of a case]
  const LENSES = [
    ['rights', 'Which option best respects the rights of everyone with a stake?'],
    ['justice', 'Which option treats people fairly, sharing benefits and burdens?'],
    ['consequences', 'Which option does the most good and the least harm?'],
    ['common good', 'Which option serves the community as a whole?'],
    ['virtue', 'Which option makes me the kind of person I want to be?'],
    ['care', 'Which option attends to the relationships and needs of those involved?']
  ];
  const OPENING = 'opening Spring 2027';

  const W = 88, D = 40, T = 4;         // bench
  const BU0 = 8, BU1 = 72;             // board, along u
  const BV0 = 4, BV1 = 6, BH = 34;     // board depth and height
  const DV = 25, DR = 4.4;             // discs: row and radius
  const DT = 1.6;                      // disc thickness
  const LIFT = 5;
  const duOf = i => 11 + i * 12.8;     // spaced so a long name clears the next disc

  const svg = makeSvg(root, '-4 -74 118 102',
    'A lab bench with six lens discs in front of a board: rights, justice, consequences, common good, virtue and care. Picking a lens shows on the board the question it asks of a case. The board says the platform opens in Spring 2027.');

  // The bench.
  box(svg, 'lf-solid').set(0, 0, -T, W, D, 0);

  // The board, and what it says.
  box(svg, 'lf-solid').set(BU0, BV0, 0, BU1, BV1, BH);
  const board = face(svg, onNear(BU0, BV1, BH));
  const bw = BU1 - BU0;
  const heading = el('text', { x: bw / 2, y: 7, 'text-anchor': 'middle', 'font-size': 3.6 }, board);
  el('line', { x1: 6, y1: 9.5, x2: bw - 6, y2: 9.5, class: 'lf-line lf-faint' }, board);
  const lines = [0, 1, 2].map(n => el('text', { x: bw / 2, y: 15 + n * 4, 'text-anchor': 'middle', 'font-size': 2.7 }, board));
  el('text', { x: bw / 2, y: BH - 3, 'text-anchor': 'middle', 'font-size': 1.9, 'letter-spacing': 0.2 }, board)
    .textContent = `AI AND DATA ETHICS · ${OPENING.toUpperCase()}`;

  // Wrap a question onto at most three lines of about `width` characters.
  function wrap(text, width) {
    const out = [''];
    text.split(' ').forEach(w => {
      const cur = out[out.length - 1];
      if ((cur + ' ' + w).trim().length > width && cur) out.push(w);
      else out[out.length - 1] = (cur + ' ' + w).trim();
    });
    return out.slice(0, 3);
  }

  function say(i) {
    const [h, q] = i < 0 ? ['Pick a lens', 'Each one asks a different question of the same case.'] : [LENSES[i][0], LENSES[i][1]];
    heading.textContent = h;
    const w = wrap(q, 34);
    lines.forEach((t, n) => { t.textContent = w[n] || ''; });
  }

  // Discs, farthest first (larger u is farther back).
  const discs = [];
  for (let i = LENSES.length - 1; i >= 0; i--) {
    const g = el('g', {}, svg);
    const under = face(g, '');
    el('circle', { class: 'lf-solid', cx: DR, cy: DR, r: DR }, under);
    const over = face(g, '');
    el('circle', { class: 'lf-solid', cx: DR, cy: DR, r: DR }, over);
    el('circle', { class: 'lf-line lf-faint', cx: DR, cy: DR, r: DR * 0.62 }, over);
    el('text', { x: DR, y: DR + 1, 'text-anchor': 'middle', 'font-size': 2.8 }, over).textContent = i + 1;
    discs[i] = { g, under, over };
  }

  // Each lens's name, set flat and centred straight under its disc on
  // screen, drawn after the discs so none hides a name; a two-word name
  // takes two lines so neighbours never touch. (A face group with no
  // transform, so the names take the face text style and light with it.)
  const plaque = face(svg, 'matrix(1 0 0 1 0 0)');
  const names = LENSES.map(([name], i) => {
    const [x, y] = iso(duOf(i), DV, 0);
    const t = el('text', { x: x.toFixed(2), y: (y + DR * 0.71 + 3.6).toFixed(2), 'text-anchor': 'middle', 'font-size': 1.5 }, plaque);
    name.split(' ').forEach((word, n) => {
      el('tspan', { x: x.toFixed(2), dy: n ? 1.7 : 0 }, t).textContent = word;
    });
    return t;
  });

  const discX = LENSES.map((_, i) => iso(duOf(i), DV, DT)[0]);

  const api = interact({
    root, svg,
    count: LENSES.length,
    rest: `Six lenses on one case · pick one to see its question · ${OPENING}`,
    describe: i => `${LENSES[i][0][0].toUpperCase() + LENSES[i][0].slice(1)} lens · ${LENSES[i][1]}`,
    pick: x => nearest(x, discX, 6),
    onChange: say,
    draw: (glow, active) => {
      LENSES.forEach((_, i) => {
        const d = discs[i], u = duOf(i) - DR, v = DV - DR, h = LIFT * glow[i];
        d.under.setAttribute('transform', onTop(u, v, h));
        d.over.setAttribute('transform', onTop(u, v, DT + h));
        d.g.classList.toggle('is-lit', i === active);
        names[i].classList.toggle('is-lit', i === active);
      });
    }
  });

  root.addEventListener('keydown', e => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= LENSES.length) { e.preventDefault(); api.set(n - 1); }
  });
  say(-1);
})();
