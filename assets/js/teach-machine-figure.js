// Teach The Machine (tools.md): a classifier small enough to see whole.
// The plate is a grid of squares holding a few taught examples — coins and
// cubes. Pointing at a square, the machine guesses which it is from the
// nearest example (a dashed line shows which one) and its screen says so;
// the shading on the plate is its whole picture of the world (shaded:
// coin). Clicking a square teaches it there — the machine's keys pick coin
// or cube — and the shading redraws at once. This is real one-nearest-
// neighbour classification, the idea the tool teaches by doing.

(function () {
  const root = document.getElementById('machine-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, onTop, onNear, face, interact } = window.LineFigure;

  const N = 8;                         // squares per side
  const CELL = 9;                      // a square's size
  const W = N * CELL;
  const T = 4;                         // plate thickness
  const START = [                      // [column (u), row (v), kind]
    [1, 1, 'coin'], [2, 0, 'coin'], [0, 3, 'coin'],
    [6, 5, 'cube'], [5, 7, 'cube'], [7, 6, 'cube']
  ];
  const MX0 = -44, MX1 = -22, MV0 = 50, MV1 = 72, MH = 14;  // the machine, clear of the plate

  let examples = START.map(e => e.slice());
  let kind = 'coin';
  let active = -1;

  const svg = makeSvg(root, '-2 -48 136 112',
    'A small classifier: an eight-by-eight plate with a few taught examples, coins and cubes, beside a machine with a screen and three keys. The plate is shaded where the machine would guess coin. Point at a square to see its guess; click to teach it.');

  const centre = (c, r) => [c * CELL + CELL / 2, r * CELL + CELL / 2];
  const at = i => [i % N, Math.floor(i / N)];

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

  // The plate, its squares, the reasoning line, the examples.
  box(svg, 'lf-solid').set(0, 0, -T, W, W, 0);
  const tiles = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const u = c * CELL, v = r * CELL;
      tiles[r * N + c] = el('polygon', {
        class: 'lf-band',
        points: pts([iso(u, v), iso(u + CELL, v), iso(u + CELL, v + CELL), iso(u, v + CELL)])
      }, svg);
    }
  }
  for (let k = 1; k < N; k++) {
    const a = iso(k * CELL, 0), b = iso(k * CELL, W), c = iso(0, k * CELL), d = iso(W, k * CELL);
    el('line', { class: 'lf-line lf-faint', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, svg);
    el('line', { class: 'lf-line lf-faint', x1: c[0], y1: c[1], x2: d[0], y2: d[1] }, svg);
  }
  const cursor = el('polygon', { class: 'lf-line lf-strong is-lit' }, svg);
  const reason = el('line', { class: 'lf-line is-lit', 'stroke-dasharray': '2 2' }, svg);
  const things = el('g', {}, svg);

  // The machine: body, screen on the near face, three keys on top.
  box(svg, 'lf-solid').set(MX0, MV0, 0, MX1, MV1, MH);
  const screen = face(svg, onNear(MX0, MV1, MH));
  el('rect', { x: 3, y: 3, width: 16, height: 8, rx: 1, class: 'lf-line' }, screen);
  const screenText = el('text', { x: 11, y: 8.2, 'text-anchor': 'middle', 'font-size': 3 }, screen);
  const KEYS = [
    { id: 'coin', u: MX0 + 3, v: MV0 + 3 },
    { id: 'cube', u: MX0 + 3, v: MV0 + 12 },
    { id: 'reset', u: MX0 + 12, v: MV0 + 3 }
  ];
  const keys = KEYS.map(k => {
    const g = el('g', { 'data-key': k.id, style: 'cursor: pointer' }, svg);
    const body = box(g, 'lf-solid');
    const label = face(g, '');
    el('text', { x: 3.5, y: 4.3, 'text-anchor': 'middle', 'font-size': k.id === 'reset' ? 1.9 : 2.3 }, label).textContent = k.id;
    return { ...k, g, body, label };
  });

  function drawKeys() {
    keys.forEach(k => {
      const down = k.id === kind ? 1 : 2;   // the chosen kind's key sits pressed
      k.body.set(k.u, k.v, MH, k.u + 7, k.v + 7, MH + down);
      k.label.setAttribute('transform', onTop(k.u, k.v, MH + down));
      k.g.classList.toggle('is-lit', k.id === kind);
    });
  }

  // Examples, farthest first; and the shading of the whole plate.
  function drawWorld() {
    things.replaceChildren();
    examples.slice().sort((a, b) => (a[1] * CELL - a[0] * CELL) - (b[1] * CELL - b[0] * CELL)).forEach(e => {
      const [u, v] = centre(e[0], e[1]);
      const g = el('g', {}, things);
      if (e[2] === 'cube') {
        box(g, 'lf-solid').set(u - 2.6, v - 2.6, 0, u + 2.6, v + 2.6, 5.2);
      } else {
        el('circle', { class: 'lf-solid', cx: 3, cy: 3, r: 3 }, face(g, onTop(u - 3, v - 3, 0)));
        el('circle', { class: 'lf-solid', cx: 3, cy: 3, r: 3 }, face(g, onTop(u - 3, v - 3, 1.4)));
        el('circle', { class: 'lf-line lf-faint', cx: 3, cy: 3, r: 1.6 }, face(g, onTop(u - 3, v - 3, 1.4)));
      }
    });
    tiles.forEach((t, i) => {
      const [c, r] = at(i), g = guess(c, r);
      t.setAttribute('class', g && g.kind === 'coin' ? 'lf-shade' : 'lf-band');
    });
  }

  function drawCursor() {
    if (active < 0) {
      cursor.setAttribute('points', '');
      reason.setAttribute('x1', 0); reason.setAttribute('x2', 0); reason.setAttribute('y1', 0); reason.setAttribute('y2', 0);
      screenText.textContent = examples.length ? '…' : 'teach me';
      return;
    }
    const [c, r] = at(active), u = c * CELL, v = r * CELL;
    cursor.setAttribute('points', pts([iso(u, v), iso(u + CELL, v), iso(u + CELL, v + CELL), iso(u, v + CELL)]));
    const g = guess(c, r);
    if (g && g.dist > 0) {
      const [a, b] = [iso(...centre(c, r)), iso(...centre(g.from[0], g.from[1]))];
      reason.setAttribute('x1', a[0]); reason.setAttribute('y1', a[1]);
      reason.setAttribute('x2', b[0]); reason.setAttribute('y2', b[1]);
    } else {
      reason.setAttribute('x1', 0); reason.setAttribute('x2', 0); reason.setAttribute('y1', 0); reason.setAttribute('y2', 0);
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
    // Back from screen to the plate's own squares (at h = 0).
    pick: (x, y) => {
      const s = x / 0.8660254, u = (s - 2 * y) / 2, v = (s + 2 * y) / 2;
      const c = Math.floor(u / CELL), r = Math.floor(v / CELL);
      return c >= 0 && c < N && r >= 0 && r < N ? r * N + c : -1;
    },
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
    const [x, y] = api.toView(e);
    const s = x / 0.8660254, u = (s - 2 * y) / 2, v = (s + 2 * y) / 2;
    const c = Math.floor(u / CELL), r = Math.floor(v / CELL);
    if (c >= 0 && c < N && r >= 0 && r < N) teach(r * N + c);
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
