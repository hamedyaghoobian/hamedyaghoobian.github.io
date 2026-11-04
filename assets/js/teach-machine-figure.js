// Teach The Machine (tools.md): a classifier small enough to see whole,
// drawn flat. The plate, in plan, is a grid of squares holding a few
// taught examples — coins (circles) and cubes (squares). Pointing at a
// square, the machine guesses which it is from the nearest example (a thin
// dashed line shows which one) and its screen says so; the shading on the
// plate is its whole picture of the world (shaded: coin). Clicking a square
// teaches it there — the machine's keys, drawn face on beside the plate,
// pick coin or cube — and the shading redraws at once. This is real one-
// nearest-neighbour classification, the idea the tool teaches by doing.
//
// Plain SVG: only el / svg / interact come from LineFigure. Styles are the
// .tlf-* rules in _sass/faceplate/pages/_tools.scss.

(function () {
  const root = document.getElementById('machine-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  const N = 8;                         // squares per side
  const CELL = 9;                      // a square's size
  const W = N * CELL;
  const GX = 2, GY = 2;                // the plate's top-left corner
  const START = [                      // [column, row, kind]
    [1, 1, 'coin'], [2, 0, 'coin'], [0, 3, 'coin'],
    [6, 5, 'cube'], [5, 7, 'cube'], [7, 6, 'cube']
  ];
  const MX0 = 84, MX1 = 122, MY0 = 2, MY1 = 48;  // the machine, face on

  let examples = START.map(e => e.slice());
  let kind = 'coin';
  let active = -1;

  const svg = makeSvg(root, '0 0 124 76',
    'A small classifier, drawn flat: an eight-by-eight plate in plan with a few taught examples, coins as circles and cubes as squares, beside the face of a machine with a screen and three keys. The plate is shaded where the machine would guess coin. Point at a square to see its guess; click to teach it.');
  svg.classList.add('tlf');

  const centre = (c, r) => [GX + c * CELL + CELL / 2, GY + r * CELL + CELL / 2];
  const at = i => [i % N, Math.floor(i / N)];
  // From the drawing to the plate's own squares.
  function cellAt(x, y) {
    const c = Math.floor((x - GX) / CELL), r = Math.floor((y - GY) / CELL);
    return c >= 0 && c < N && r >= 0 && r < N ? r * N + c : -1;
  }

  // One nearest neighbour, in squares.
  function guess(c, r) {
    let best = null, dist = Infinity;
    examples.forEach(e => {
      const d = Math.hypot(e[0] - c, e[1] - r);
      if (d < dist) { dist = d; best = e; }
    });
    return best ? { kind: best[2], from: best, dist } : null;
  }
  const here = (c, r) => examples.find(e => e[0] === c && e[1] === r);

  // The plate: shading, the grid, its frame; then the reasoning line, the
  // examples, and the square under the pointer.
  const tiles = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      tiles[r * N + c] = el('rect', { class: 'tlf-band', x: GX + c * CELL, y: GY + r * CELL, width: CELL, height: CELL }, svg);
    }
  }
  for (let k = 1; k < N; k++) {
    el('line', { class: 'tlf-line tlf-faint', x1: GX + k * CELL, y1: GY, x2: GX + k * CELL, y2: GY + W }, svg);
    el('line', { class: 'tlf-line tlf-faint', x1: GX, y1: GY + k * CELL, x2: GX + W, y2: GY + k * CELL }, svg);
  }
  el('rect', { class: 'tlf-line', x: GX, y: GY, width: W, height: W }, svg);
  const reason = el('line', { class: 'tlf-live', 'stroke-dasharray': '2 2', visibility: 'hidden' }, svg);
  const things = el('g', {}, svg);
  const cursor = el('rect', { class: 'tlf-line tlf-strong', width: CELL, height: CELL, visibility: 'hidden' }, svg);

  // The machine: a face with a screen and three keys.
  el('rect', { class: 'tlf-solid', x: MX0, y: MY0, width: MX1 - MX0, height: MY1 - MY0, rx: 1.2 }, svg);
  el('rect', { class: 'tlf-line', x: MX0 + 4, y: MY0 + 4, width: MX1 - MX0 - 8, height: 15, rx: 1 }, svg);
  const screenText = el('text', { x: (MX0 + MX1) / 2, y: MY0 + 13.4, 'text-anchor': 'middle', 'font-size': 4.4, class: 'tlf-head' }, svg);
  const KEYS = ['coin', 'cube', 'reset'];
  const KW = 9, KG = 1.5, KY = MY0 + 26, KH = 9;
  const keys = KEYS.map((id, n) => {
    const x = MX0 + 4 + n * (KW + KG);
    const g = el('g', { 'data-key': id, style: 'cursor: pointer' }, svg);
    el('rect', { class: 'tlf-solid', x, y: KY, width: KW, height: KH, rx: 0.8 }, g);
    el('text', { x: x + KW / 2, y: KY + 5.6, 'text-anchor': 'middle', 'font-size': 2.6, class: 'tlf-mono' }, g).textContent = id;
    return { id, g };
  });
  el('text', { x: MX0 + 4, y: MY1 - 3.5, 'font-size': 2.4, class: 'tlf-mono' }, svg).textContent = '1 · 2 · R';

  // A key: what the plate's marks mean.
  const LY = MY1 + 9;
  el('rect', { class: 'tlf-shade', x: MX0, y: LY - 3, width: 4, height: 4 }, svg);
  el('text', { x: MX0 + 6, y: LY, 'font-size': 2.7 }, svg).textContent = 'shaded: guess coin';
  el('circle', { class: 'tlf-solid', cx: MX0 + 2, cy: LY + 7, r: 2 }, svg);
  el('text', { x: MX0 + 6, y: LY + 8, 'font-size': 2.7 }, svg).textContent = 'coin';
  el('rect', { class: 'tlf-solid', x: MX0 + 19.5, y: LY + 5, width: 4, height: 4 }, svg);
  el('text', { x: MX0 + 25.5, y: LY + 8, 'font-size': 2.7 }, svg).textContent = 'cube';

  function drawKeys() {
    keys.forEach(k => k.g.classList.toggle('tlf-picked', k.id === kind));
  }

  // The examples; and the shading of the whole plate.
  function drawWorld() {
    things.replaceChildren();
    examples.forEach(e => {
      const [x, y] = centre(e[0], e[1]);
      if (e[2] === 'cube') {
        el('rect', { class: 'tlf-solid tlf-mark', x: x - 2.8, y: y - 2.8, width: 5.6, height: 5.6 }, things);
      } else {
        el('circle', { class: 'tlf-solid tlf-mark', cx: x, cy: y, r: 3 }, things);
        el('circle', { class: 'tlf-line tlf-faint', cx: x, cy: y, r: 1.6 }, things);
      }
    });
    tiles.forEach((t, i) => {
      const [c, r] = at(i), g = guess(c, r);
      t.setAttribute('class', g && g.kind === 'coin' ? 'tlf-shade' : 'tlf-band');
    });
  }

  function drawCursor() {
    if (active < 0) {
      cursor.setAttribute('visibility', 'hidden');
      reason.setAttribute('visibility', 'hidden');
      screenText.textContent = examples.length ? '…' : 'teach me';
      return;
    }
    const [c, r] = at(active);
    cursor.setAttribute('x', GX + c * CELL);
    cursor.setAttribute('y', GY + r * CELL);
    cursor.setAttribute('visibility', 'visible');
    const g = guess(c, r);
    if (g && g.dist > 0) {
      const [a, b] = [centre(c, r), centre(g.from[0], g.from[1])];
      reason.setAttribute('x1', a[0]); reason.setAttribute('y1', a[1]);
      reason.setAttribute('x2', b[0]); reason.setAttribute('y2', b[1]);
      reason.setAttribute('visibility', 'visible');
    } else {
      reason.setAttribute('visibility', 'hidden');
    }
    screenText.textContent = g ? `${g.kind}?` : 'teach me';
  }

  const api = interact({
    root, svg,
    count: N * N,
    rest: 'Point at a square: the machine guesses from its nearest example · click to teach it',
    describe: i => {
      const [c, r] = at(i), e = here(c, r);
      if (e) return `Taught here: a ${e[2]} · click to take it back`;
      const g = guess(c, r);
      if (!g) return `Nothing taught yet · click to teach a ${kind}`;
      return `Guess: ${g.kind} · nearest example is ${g.dist.toFixed(1)} squares away · click to teach a ${kind}`;
    },
    pick: cellAt,
    onChange: i => { active = i; },
    draw: () => drawCursor()
  });

  // After the world changes, redraw it and re-read the square under the
  // pointer (setting it again rewrites the caption from the new examples).
  function refresh() {
    drawWorld();
    const was = active;
    if (was >= 0) { api.set(-1); api.set(was); }
    drawCursor();
  }

  function teach(i) {
    const [c, r] = at(i), e = here(c, r);
    if (e) examples = examples.filter(x => x !== e);
    else examples.push([c, r, kind]);
    refresh();
  }
  function choose(id) {
    if (id === 'reset') { examples = START.map(e => e.slice()); kind = 'coin'; }
    else kind = id;
    drawKeys();
    refresh();
  }

  svg.addEventListener('click', e => {
    const key = e.target.closest('[data-key]');
    if (key) return choose(key.dataset.key);
    const i = cellAt(...api.toView(e));
    if (i >= 0) teach(i);
  });
  root.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if ((e.key === 'Enter' || e.key === ' ') && active >= 0) { e.preventDefault(); teach(active); }
    else if (e.key === '1') choose('coin');
    else if (e.key === '2') choose('cube');
    else if (e.key === 'r' || e.key === 'R') choose('reset');
  });

  drawKeys();
  drawWorld();
  drawCursor();
})();
