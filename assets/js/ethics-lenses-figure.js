// AI and Data Ethics (tools.md): six lenses in a rack under a board, drawn
// flat, as a front elevation in hairlines. Picking a lens (pointer, arrow
// keys, or 1–6) marks it, and the board shows the question that lens asks
// of a case — the "practical ethical frameworks" the platform is built
// around, as something to try.
//
// The six lenses follow the Markkula Center for Applied Ethics' framework
// for ethical decision-making (rights, justice, utilitarian, common good,
// virtue, care); the questions are paraphrased, not quoted. They are this
// figure's choice, not the course's syllabus — swap them for the course's
// own frameworks when it has them. The board also says when it opens.
//
// Plain SVG: only el / svg / interact come from LineFigure. Styles are the
// .tlf-* rules in _sass/faceplate/pages/_tools.scss.

(function () {
  const root = document.getElementById('ethics-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

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

  const BX0 = 8, BX1 = 112, BY0 = 3, BY1 = 43;  // the board
  const CY = 55, R = 7;                          // lenses: centre line and radius
  const LEDGE = CY + R;                          // the rack they stand on
  const xOf = i => 13 + i * 18.8;

  function nearest(x, xs, reach) {
    let best = -1, dist = reach;
    xs.forEach((xi, i) => { const d = Math.abs(xi - x); if (d < dist) { best = i; dist = d; } });
    return best;
  }

  const svg = makeSvg(root, '0 0 120 76',
    'A board above a rack of six lenses, drawn flat: rights, justice, consequences, common good, virtue and care. Picking a lens shows on the board the question it asks of a case. The board says the platform opens in Spring 2027.');
  svg.classList.add('tlf');

  // The board, and what it says.
  const cx = (BX0 + BX1) / 2;
  el('rect', { class: 'tlf-solid', x: BX0, y: BY0, width: BX1 - BX0, height: BY1 - BY0, rx: 1 }, svg);
  const heading = el('text', { x: cx, y: BY0 + 9.5, 'text-anchor': 'middle', 'font-size': 4.4, class: 'tlf-head' }, svg);
  el('line', { class: 'tlf-line tlf-faint', x1: BX0 + 6, y1: BY0 + 13, x2: BX1 - 6, y2: BY0 + 13 }, svg);
  const lines = [0, 1, 2].map(n => el('text', { x: cx, y: BY0 + 19.5 + n * 4.6, 'text-anchor': 'middle', 'font-size': 3.3 }, svg));
  el('text', { x: cx, y: BY1 - 3, 'text-anchor': 'middle', 'font-size': 2.3, class: 'tlf-mono' }, svg)
    .textContent = `CSI 205 · AI AND DATA ETHICS · ${OPENING.toUpperCase()}`;

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
    const w = wrap(q, 56);
    lines.forEach((t, n) => { t.textContent = w[n] || ''; });
  }

  // The rack: one ledge the lenses stand on.
  el('line', { class: 'tlf-line', x1: 3, y1: LEDGE, x2: 117, y2: LEDGE }, svg);

  // The lenses, face on: a rim, an inner ring, a number; the name under
  // the ledge (a two-word name takes two lines). A thin live line joins the
  // picked lens to the board.
  const lenses = LENSES.map(([name], i) => {
    const x = xOf(i);
    const lead = el('line', { class: 'tlf-live', x1: x, y1: BY1, x2: x, y2: CY - R, opacity: 0 }, svg);
    const g = el('g', {}, svg);
    el('circle', { class: 'tlf-solid', cx: x, cy: CY, r: R }, g);
    el('circle', { class: 'tlf-line tlf-faint', cx: x, cy: CY, r: R * 0.62 }, g);
    el('text', { x, y: CY + 1.2, 'text-anchor': 'middle', 'font-size': 3.4, class: 'tlf-mono' }, g).textContent = i + 1;
    const t = el('text', { x, y: LEDGE + 4.2, 'text-anchor': 'middle', 'font-size': 2.9 }, svg);
    name.split(' ').forEach((word, n) => {
      el('tspan', { x, dy: n ? 3.3 : 0 }, t).textContent = word;
    });
    return { g, lead, name: t };
  });

  const api = interact({
    root, svg,
    count: LENSES.length,
    rest: `Six lenses on one case · pick one to see its question · ${OPENING}`,
    describe: i => `${LENSES[i][0][0].toUpperCase() + LENSES[i][0].slice(1)} lens · ${LENSES[i][1]}`,
    pick: x => nearest(x, LENSES.map((_, i) => xOf(i)), 9.4),
    onChange: say,
    draw: (glow, active) => {
      lenses.forEach((l, i) => {
        l.lead.setAttribute('opacity', glow[i].toFixed(2));
        l.g.classList.toggle('tlf-picked', i === active);
        l.name.classList.toggle('tlf-on', i === active);
      });
    }
  });

  root.addEventListener('keydown', e => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= LENSES.length) { e.preventDefault(); api.set(n - 1); }
  });
  say(-1);
})();
