// MASFIN (projects/multi-agents-llm-financial-trading-framework.md): the
// five-crew pipeline as a card-sorting line on a bench. A hopper feeds
// ticker cards onto a moving belt that runs through one station per crew:
//   Postmortem — a loupe over a tray of delisted cards (survivorship bias)
//   Screening  — a comb gate; rejected cards are pushed aside into a tray
//   Analysis   — a dial gauge reading each card
//   Timing     — a clock: entry points from historical signals only
//   Portfolio  — a 30-slot rack, the 15-card minimum marked
// with a human-checkpoint button between stations, and a return gauge with
// the 8-week result. Everything named is from the page: the crews' jobs, the
// 15–30 portfolio, and the returns (MASFIN 7.33%, S&P 500 4.92%,
// NASDAQ-100 5.36%, Dow Jones 4.11%). The cards are a picture of flow, not
// counts. After the craft rules of Ryan's Anatomy skill (MIT).

(function () {
  const root = document.getElementById('masfin-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, cylinder, screw, onTop, onNear, face, nearest, interact } = window.LineFigure;

  const ITEMS = [
    ['Postmortem', 'analyzes delisted or failed firms to counter survivorship bias'],
    ['Screening', 'filters candidate equities using sentiment and real-time data'],
    ['Analysis', 'evaluates financial ratios and technical indicators across tickers'],
    ['Timing', 'determines entry points using historical-only signals'],
    ['Portfolio', 'constructs a 15–30 stock portfolio with risk-adjusted allocations'],
    ['Result', '8 weeks live: 7.33% vs S&P 500 4.92%, NASDAQ-100 5.36%, Dow 4.11%']
  ];
  const RETURNS = { masfin: 7.33, sp: 4.92, ndx: 5.36, dow: 4.11 };

  // World: u along the line, v toward the viewer, h up. Units ~ 1 px.
  const BENCH = { u0: -10, u1: 204, v0: 0, v1: 58, t: 6 };
  const BELT = { u0: 12, u1: 168, v0: 19, v1: 33, h: 4 };
  const STATIONS = [46, 74, 102, 130];          // gantries for crews 1–4
  const POST_V = [13, 39];                       // gantry posts, far and near
  const BAR_H = 31;                              // crossbar height
  const RACK = { u0: 172, u1: 200, v0: 14, v1: 40, h: 4 };
  const CARD = { w: 6, d: 9 };

  const svg = makeSvg(root, '-16 -172 250 226',
    'A card-sorting line on a bench: a hopper feeds ticker cards onto a moving belt through five stations — a loupe over delisted cards, a comb gate that pushes rejects aside, a dial gauge, a clock, and a 30-slot portfolio rack — with human checkpoint buttons between them and a return gauge reading 7.33% against the S&P 500 at 4.92%.');

  // ── Bench: feet, slab, groove, screws, label plate ─────────────────────
  [[BENCH.u0 + 6, 6], [BENCH.u1 - 6, 6]].forEach(([u, v]) => cylinder(svg, 'lf-solid lf-shaded').set(u, v, -BENCH.t - 8, -BENCH.t, 2.6));
  box(svg, 'lf-solid lf-shaded').set(BENCH.u0, BENCH.v0, -BENCH.t, BENCH.u1, BENCH.v1, 0);
  [[BENCH.u0 + 6, BENCH.v1 - 6], [BENCH.u1 - 6, BENCH.v1 - 6]].forEach(([u, v]) => cylinder(svg, 'lf-solid lf-shaded').set(u, v, -BENCH.t - 8, -BENCH.t, 2.6));
  {
    const a = iso(BENCH.u0 + 4, BENCH.v1 - 3), b = iso(BENCH.u1 - 4, BENCH.v1 - 3);
    el('line', { class: 'lf-line lf-faint', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, svg);
  }
  [[BENCH.u0 + 3, 3], [BENCH.u1 - 3, 3], [BENCH.u0 + 3, BENCH.v1 - 6], [BENCH.u1 - 3, BENCH.v1 - 6]]
    .forEach(([u, v]) => screw(svg, u, v, 0));
  box(svg, 'lf-solid lf-shaded').set(2, 46, 0, 30, 54, 0.7);
  {
    const plate = face(svg, onTop(2, 46, 0.7));
    [2.2, 4.1, 6].forEach((y, i) => el('line', { class: 'lf-line lf-faint', x1: 2.5, y1: y, x2: i ? 18 : 25, y2: y }, plate));
  }
  // A ruler along the front edge: a tick every 4, a longer one every 20.
  {
    const r = face(svg, onNear(BENCH.u0, BENCH.v1, 0));
    for (let u = 8; u < BENCH.u1 - BENCH.u0 - 4; u += 4) {
      el('line', { class: 'lf-line lf-faint', x1: u, y1: 0, x2: u, y2: u % 20 === 8 ? 3 : 1.6 }, r);
    }
  }

  // ── Far side: delisted tray (Postmortem) and reject tray (Screening) ───
  const tray = (u0, u1) => {
    box(svg, 'lf-solid lf-shaded').set(u0, 2, 0, u1, 11, 3);
    box(svg, 'lf-solid').set(u0 + 1, 3, 3, u1 - 1, 10, 3.01);
  };
  tray(STATIONS[0] - 9, STATIONS[0] + 9);
  for (let k = 0; k < 6; k++) {                                   // delisted cards, lying
    const u = STATIONS[0] - 6 + k * 2.1;
    el('polygon', { class: 'lf-solid lf-sheet lf-delisted', points: pts([iso(u, 4, 3.2 + k * 0.5), iso(u + CARD.w, 4, 3.2 + k * 0.5), iso(u + CARD.w, 9, 3.2 + k * 0.5), iso(u, 9, 3.2 + k * 0.5)]) }, svg);
  }
  tray(STATIONS[1] - 9, STATIONS[1] + 9);
  const rejectPile = el('g', {}, svg);

  // ── Return gauge, standing at the far right on two posts ───────────────
  const gaugeG = el('g', {}, svg);
  [178, 196].forEach(u => cylinder(gaugeG, 'lf-solid lf-shaded').set(u, 4, 0, 30, 1.2));
  box(gaugeG, 'lf-solid lf-shaded').set(173, 2, 30, 201, 6, 52);
  {
    const f = face(gaugeG, onNear(173, 6, 52));
    const cx = 14, cy = 17, R = 11;
    const ang = p => Math.PI * (1 - p / 10);                   // 0–10% on a half circle
    const at = (p, r) => [cx + r * Math.cos(ang(p)), cy - r * Math.sin(ang(p))];
    el('path', { class: 'lf-line', d: `M${cx - R} ${cy}A${R} ${R} 0 0 1 ${cx + R} ${cy}` }, f);
    for (let p = 0; p <= 10; p++) {
      const [x1, y1] = at(p, R), [x2, y2] = at(p, p % 5 ? R - 1.4 : R - 2.6);
      el('line', { class: 'lf-line' + (p % 5 ? ' lf-faint' : ''), x1, y1, x2, y2 }, f);
    }
    // The three benchmarks as small marks inside the scale…
    [RETURNS.dow, RETURNS.sp, RETURNS.ndx].forEach(p => {
      const [x1, y1] = at(p, R - 3.2), [x2, y2] = at(p, R - 5.4);
      el('line', { class: 'lf-line lf-strong', x1, y1, x2, y2 }, f);
    });
    // …and MASFIN as the needle, the one accent.
    const [nx, ny] = at(RETURNS.masfin, R - 1.8);
    el('line', { class: 'lf-line lf-strong lf-hot gauge-needle', x1: cx, y1: cy, x2: nx, y2: ny }, f);
    el('circle', { class: 'lf-dot', cx, cy, r: 1.1 }, f);
    el('text', { x: cx, y: cy + 3.6, 'text-anchor': 'middle', 'font-size': 1.9, 'letter-spacing': 0.2 }, f).textContent = '8 WK %';
  }

  // ── Belt: drums, belt with moving cleats, hopper ───────────────────────
  box(svg, 'lf-solid lf-shaded').set(BELT.u0 - 6, BELT.v0 - 2, 0, BELT.u0, BELT.v1 + 2, BELT.h + 1.5);
  box(svg, 'lf-solid lf-shaded').set(BELT.u0, BELT.v0, 0, BELT.u1, BELT.v1, BELT.h);
  box(svg, 'lf-solid lf-shaded').set(BELT.u1, BELT.v0 - 2, 0, BELT.u1 + 6, BELT.v1 + 2, BELT.h + 1.5);
  const cleats = el('g', {}, svg);
  const cleatLines = Array.from({ length: 20 }, () => el('line', { class: 'lf-line lf-faint' }, cleats));

  // Gantries' far posts stand behind the cards.
  STATIONS.forEach(u => cylinder(svg, 'lf-solid lf-shaded').set(u, POST_V[0], 0, BAR_H, 1.5));

  // ── Cards in flight (moved every frame) ────────────────────────────────
  const START = 18, RUN = BELT.u1 - 4 - START;     // born inside the hopper
  const N = 8, SPACING = RUN / N;
  const cards = Array.from({ length: N }, () => el('polygon', { class: 'lf-solid lf-sheet lf-card' }, svg));

  // The hopper at the head of the belt, drawn after the cards: each card
  // starts inside it and slides out from under its far side.
  box(svg, 'lf-solid lf-shaded').set(14, 15, BELT.h, 30, 37, 28);
  box(svg, 'lf-solid').set(16, 17, 28, 28, 35, 28.01);
  for (let k = 0; k < 3; k++) el('polygon', { class: 'lf-solid lf-sheet', points: pts([iso(18, 20, 24 + k * 1.3), iso(26, 20, 24 + k * 1.3), iso(26, 32, 24 + k * 1.3), iso(18, 32, 24 + k * 1.3)]) }, svg);


  // ── Rack: 30 slots, cards filling them, the 15 minimum marked ──────────
  const rackG = el('g', {}, svg);
  box(rackG, 'lf-solid lf-shaded').set(RACK.u0, RACK.v0, 0, RACK.u1, RACK.v1, RACK.h);
  const slotU = k => RACK.u0 + 1 + (k % 15) * 1.8, slotV = k => (k < 15 ? RACK.v0 + 2 : RACK.v0 + 14);
  const rackCards = [];
  for (let k = 29; k >= 0; k--) {                    // farthest first
    rackCards[k] = el('polygon', { class: 'lf-solid lf-sheet', points: pts([iso(slotU(k), slotV(k), RACK.h), iso(slotU(k), slotV(k) + 10, RACK.h), iso(slotU(k), slotV(k) + 10, RACK.h + 9), iso(slotU(k), slotV(k), RACK.h + 9)]) }, rackG);
  }
  {
    const m = iso(slotU(14) + 0.9, RACK.v1, RACK.h), n = iso(slotU(14) + 0.9, RACK.v1, 0);
    el('line', { class: 'lf-line lf-strong', x1: m[0], y1: m[1], x2: n[0], y2: n[1] }, rackG);
  }

  // ── Human checkpoints: a button between stations, on the near side ─────
  const checks = [60, 88, 116, 150].map(u => {
    const g = el('g', {}, svg);
    cylinder(g, 'lf-solid lf-shaded').set(u, 47, 0, 6, 2.4);
    const cap = cylinder(g, 'lf-solid').set(u, 47, 6, 7.2, 1.5);
    return { g, cap, u };
  });

  // ── Station tools, above the belt (drawn after the cards) ──────────────
  const stations = STATIONS.map(() => el('g', {}, svg));
  STATIONS.forEach((u, i) => {
    const g = stations[i];
    box(g, 'lf-solid lf-shaded').set(u - 2, POST_V[0] - 1, BAR_H, u + 2, POST_V[1] + 1, BAR_H + 3);
    [POST_V[0], POST_V[1]].forEach(v => screw(g, u, v, BAR_H + 3, 0.5));
    if (i === 0) {                                    // loupe on an arm, over the delisted tray
      box(g, 'lf-solid lf-shaded').set(u - 1, 6, BAR_H - 1, u + 1, POST_V[0] - 1, BAR_H + 1);
      cylinder(g, 'lf-solid lf-shaded').set(u, 7, 14, 16, 4.6);
      el('ellipse', { class: 'lf-line lf-faint', cx: iso(u, 7, 16)[0], cy: iso(u, 7, 16)[1], rx: 3 * Math.SQRT2 * 0.866, ry: 3 * Math.SQRT2 * 0.5 }, g);
      const a = iso(u, 7, 16), b = iso(u, 7, BAR_H - 1);
      el('line', { class: 'lf-line', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, g);
    }
    if (i === 1) {                                    // comb gate across the belt
      for (let v = BELT.v0 + 1; v <= BELT.v1 - 1; v += 2.4) {
        const a = iso(u, v, BAR_H), b = iso(u, v, BELT.h + 4);
        el('line', { class: 'lf-line', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, g);
      }
      box(g, 'lf-solid lf-shaded').set(u - 1.2, BELT.v0, BELT.h + 2.5, u + 1.2, BELT.v1, BELT.h + 4);
    }
    if (i === 2 || i === 3) {                         // dial gauge / clock in a housing
      cylinder(g, 'lf-solid lf-shaded').set(u, 26, 18, BAR_H, 1.2);
      box(g, 'lf-solid lf-shaded').set(u - 7, 23, 14, u + 7, 29, 26);
      const f = face(g, onNear(u - 7, 29, 26));
      el('circle', { class: 'lf-line', cx: 7, cy: 6, r: 4.6 }, f);
      for (let k = 0; k < 12; k++) {
        const t = k / 12 * Math.PI * 2;
        el('line', { class: 'lf-line lf-faint', x1: 7 + Math.cos(t) * 3.7, y1: 6 + Math.sin(t) * 3.7, x2: 7 + Math.cos(t) * 4.4, y2: 6 + Math.sin(t) * 4.4 }, f);
      }
      g.hand = el('line', { class: 'lf-line lf-strong', x1: 7, y1: 6, x2: 7, y2: 2.2 }, f);
      el('circle', { class: 'lf-dot', cx: 7, cy: 6, r: 0.6 }, f);
      if (i === 3) g.minute = el('line', { class: 'lf-line', x1: 7, y1: 6, x2: 9.4, y2: 6 }, f);
    }
  });

  // Gantries' near posts stand in front of everything on the belt.
  STATIONS.forEach(u => cylinder(svg, 'lf-solid lf-shaded').set(u, POST_V[1], 0, BAR_H, 1.5));

  // ── Motion ─────────────────────────────────────────────────────────────
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let t0 = performance.now(), visible = false, frame = 0;
  const SPEED = 9;                     // world units per second
  const REJECT = k => k % 3 === 1;     // a picture of filtering, not a count

  function cardAt(k, t) {
    const u = START + ((t * SPEED + k * SPACING) % RUN);
    let v = (BELT.v0 + BELT.v1) / 2 - CARD.d / 2, h = BELT.h + 0.2, gone = false;
    if (REJECT(k) && u > STATIONS[1]) {                // pushed aside at the comb
      const s = Math.min(1, (u - STATIONS[1]) / 8);
      v -= s * 20; h = BELT.h + 0.2 - s * 1.2 + Math.sin(s * Math.PI) * 3;
      if (s >= 1) gone = true;
    }
    return { u, v, h, gone };
  }

  function draw(t) {
    const sec = t / 1000;
    const shift = (sec * SPEED) % 8;
    cleatLines.forEach((ln, i) => {
      const u = BELT.u0 + 2 + ((i * 8 + shift) % (BELT.u1 - BELT.u0 - 4));
      const a = iso(u, BELT.v0 + 0.5, BELT.h), b = iso(u, BELT.v1 - 0.5, BELT.h);
      ln.setAttribute('x1', a[0]); ln.setAttribute('y1', a[1]); ln.setAttribute('x2', b[0]); ln.setAttribute('y2', b[1]);
    });
    cards.forEach((c, k) => {
      const p = cardAt(k, sec);
      c.style.display = p.gone ? 'none' : '';
      c.setAttribute('points', pts([iso(p.u, p.v, p.h), iso(p.u + CARD.w, p.v, p.h), iso(p.u + CARD.w, p.v + CARD.d, p.h), iso(p.u, p.v + CARD.d, p.h)]));
    });
    // A checkpoint lights as a card passes it.
    checks.forEach(ch => {
      const near = cards.some((_, k) => { const p = cardAt(k, sec); return !p.gone && Math.abs(p.u + CARD.w / 2 - ch.u) < 3; });
      ch.g.classList.toggle('is-lit', near);
    });
    // The rack fills to its 30 and starts again.
    const filled = Math.floor((sec * SPEED / SPACING) % 31);
    rackCards.forEach((c, k) => { c.style.visibility = k < filled ? 'visible' : 'hidden'; });
    // The dial reads each card; the clock runs.
    const dial = stations[2].hand, clock = stations[3].hand;
    const da = -60 + 120 * (0.5 + 0.5 * Math.sin(sec * 1.7));
    dial.setAttribute('transform', `rotate(${da.toFixed(1)} 7 6)`);
    clock.setAttribute('transform', `rotate(${(sec * 30 % 360).toFixed(1)} 7 6)`);
    stations[3].minute.setAttribute('transform', `rotate(${(sec * 2.5 % 360).toFixed(1)} 7 6)`);
  }

  function loop(t) {
    draw(t - t0);
    frame = visible && !still.matches ? requestAnimationFrame(loop) : 0;
  }
  if (window.IntersectionObserver) {
    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && !frame && !still.matches) frame = requestAnimationFrame(loop);
    }).observe(root);
  }
  draw(4000);                          // a still frame mid-run, for reduced motion and first paint

  // ── Picking: a station by its place along the line ─────────────────────
  const itemX = [...STATIONS.map(u => iso(u, 26)[0]), iso(186, 27)[0], iso(187, 4, 40)[0] + 18];
  const groups = [...stations, rackG, gaugeG];
  interact({
    root, svg,
    count: ITEMS.length,
    tour: 2800,
    rest: 'five crews in sequence · a human checkpoint between each',
    describe: i => `${ITEMS[i][0].toLowerCase()} · ${ITEMS[i][1]}`,
    pick: (x, y) => {
      if (x > iso(170, 0)[0] && y < iso(186, 4, 30)[1]) return 5;     // the gauge, up high
      return nearest(x, itemX.slice(0, 5), 16);
    },
    draw: (glow, active) => groups.forEach((g, i) => g.classList.toggle('is-lit', i === active))
  });
})();
