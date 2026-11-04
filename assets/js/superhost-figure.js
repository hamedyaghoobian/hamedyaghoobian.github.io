// Noisy Stars (projects/superhost-rating-reliability.md), Plate I.
//
// Top: how reliable a displayed rating is against how many reviews it
// averages. One review's reliability r1 comes from the study's 0.37 at the
// median listing's 45 reviews, and the Spearman–Brown formula projects it:
//   r1 = .37 / (45 − .37·44),   R(n) = n·r1 / (1 + (n − 1)·r1)
// which crosses the conventional 0.70 floor at 179 (the paper reports 181).
//
// Below: seven schematic listings near the 4.8 Superhost line, each with the
// range its true quality could sit in at n reviews: ±1.96 standard errors,
// where the error follows from R(n) and a spread of true quality of 0.10
// stars (the study finds 0.07–0.14).
//
// The slider is the control (← → when it has focus); dragging on the curve
// moves it too. Colours come from CSS classes only (_project.scss).

(function () {
  const curve = document.getElementById('ns-curve');
  const pins = document.getElementById('ns-pins');
  const input = document.getElementById('ns-n');
  const out = document.getElementById('ns-read');
  if (!curve || !pins || !input) return;

  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs, parent, text) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  };

  const MEDIAN = 45, AT_MEDIAN = 0.37, FLOOR = 0.70, PAPER = 181, MAX = 300;
  const r1 = AT_MEDIAN / (MEDIAN - AT_MEDIAN * (MEDIAN - 1));
  const R = n => n * r1 / (1 + (n - 1) * r1);
  let NEED = 1; while (R(NEED) < FLOOR) NEED++;          // 179

  // ── the curve ──
  const L = 44, Rt = 584, T = 14, B = 164;
  const xN = n => L + (n / MAX) * (Rt - L);
  const yR = r => B - r * (B - T);
  const nOfX = x => Math.round(Math.max(1, Math.min(MAX, (x - L) / (Rt - L) * MAX)));

  el('line', { class: 'ns-axis', x1: L, y1: B, x2: Rt, y2: B }, curve);
  el('line', { class: 'ns-axis', x1: L, y1: T, x2: L, y2: B }, curve);
  [0, 0.37, 0.7, 1].forEach(v => {
    el('line', { class: 'ns-tick', x1: L - 4, x2: L, y1: yR(v), y2: yR(v) }, curve);
    el('text', { class: 'ns-t', x: L - 8, y: yR(v) + 3.5, 'text-anchor': 'end' }, curve, v === 0 || v === 1 ? String(v) : v.toFixed(2));
  });
  [0, MEDIAN, 100, 200, MAX].forEach(v => {
    el('line', { class: 'ns-tick', x1: xN(v), x2: xN(v), y1: B, y2: B + 4 }, curve);
    el('text', { class: 'ns-t', x: xN(v), y: B + 16, 'text-anchor': 'middle' }, curve, v);
  });
  el('text', { class: 'ns-t ns-t--soft', x: Rt, y: B + 30, 'text-anchor': 'end' }, curve, 'reviews →');
  el('text', { class: 'ns-t ns-t--soft', x: L + 8, y: T + 4 }, curve, 'reliability ↑');

  // the 0.70 floor
  el('line', { class: 'ns-floor', x1: L, x2: Rt, y1: yR(FLOOR), y2: yR(FLOOR) }, curve);
  el('text', { class: 'ns-t ns-t--soft', x: L + 8, y: yR(FLOOR) - 6 }, curve, 'conventional floor 0.70');

  // the curve itself
  let d = '';
  for (let n = 1; n <= MAX; n++) d += (n === 1 ? 'M' : 'L') + xN(n).toFixed(1) + ',' + yR(R(n)).toFixed(1);
  el('path', { class: 'ns-line', d }, curve);

  // the two numbers the page gives: the median listing, and the paper's 181
  const mark = (n, r, label, dy) => {
    el('line', { class: 'ns-drop', x1: xN(n), x2: xN(n), y1: B, y2: yR(r) }, curve);
    el('circle', { class: 'ns-mark', cx: xN(n), cy: yR(r), r: 3 }, curve);
    el('text', { class: 'ns-t', x: xN(n) + 6, y: yR(r) + dy }, curve, label);
  };
  mark(MEDIAN, AT_MEDIAN, 'median listing · 45 → 0.37', 16);
  mark(PAPER, R(PAPER), 'the paper: 181', 18);

  // the reader's n: the lit part
  const cur = el('g', { class: 'ns-cur' }, curve);
  const curLine = el('line', { class: 'ns-cur__line', y1: T, y2: B }, cur);
  const curDot = el('circle', { class: 'ns-cur__dot', r: 4.5 }, cur);

  // a wide, invisible hit area so the curve can be dragged
  const hit = el('rect', { class: 'ns-hit', x: L, y: T - 8, width: Rt - L, height: B - T + 16 }, curve);

  // ── the listings ──
  const LISTINGS = [4.58, 4.71, 4.77, 4.82, 4.86, 4.91, 4.97];
  const LINE = 4.8, LO = 4.5, HI = 5.0, SPREAD = 0.10;
  const PL = 44, PR = 584;
  const xS = v => PL + (Math.max(LO, Math.min(HI, v)) - LO) / (HI - LO) * (PR - PL);
  const rowY = i => 22 + i * 12.5;

  [4.5, 4.6, 4.7, 4.8, 4.9, 5.0].forEach(v => {
    el('text', { class: 'ns-t', x: xS(v), y: 124, 'text-anchor': 'middle' }, pins, v.toFixed(1));
  });
  el('line', { class: 'ns-axis', x1: PL, x2: PR, y1: 108, y2: 108 }, pins);
  el('line', { class: 'ns-four8', x1: xS(LINE), x2: xS(LINE), y1: 4, y2: 108 }, pins);
  el('text', { class: 'ns-t', x: xS(LINE) - 6, y: 11, 'text-anchor': 'end' }, pins, 'the Superhost line · 4.8');
  const rows = LISTINGS.map((v, i) => {
    const g = el('g', { class: 'ns-row' }, pins);
    const span = el('line', { class: 'ns-span', y1: rowY(i), y2: rowY(i) }, g);
    el('circle', { class: 'ns-pin', cx: xS(v), cy: rowY(i), r: 3.2 }, g);
    return { v, g, span };
  });

  // ── draw ──
  function draw() {
    const n = +input.value, r = R(n);
    curLine.setAttribute('x1', xN(n)); curLine.setAttribute('x2', xN(n));
    curDot.setAttribute('cx', xN(n)); curDot.setAttribute('cy', yR(r));

    const se = SPREAD * Math.sqrt((1 - r) / r);
    let cross = 0;
    rows.forEach(row => {
      const a = row.v - 1.96 * se, b = row.v + 1.96 * se;
      const c = a < LINE && b > LINE;
      if (c) cross++;
      row.span.setAttribute('x1', xS(a)); row.span.setAttribute('x2', xS(b));
      row.g.classList.toggle('is-crossing', c);
    });

    const left = NEED - n;
    out.innerHTML =
      `<span><span class="fp-label">reviews</span><b>${n}</b></span>` +
      `<span><span class="fp-label">reliability</span><b>${r.toFixed(2)}</b></span>` +
      (left > 0
        ? `<span><span class="fp-label">to 0.70</span><b>+${left}</b></span>`
        : `<span><span class="fp-label">0.70 floor</span><b>reached</b></span>`) +
      `<span><span class="fp-label">cross 4.8</span><b>${cross} / 7</b></span>`;
    input.setAttribute('aria-valuetext', `${n} reviews, reliability ${r.toFixed(2)}, ${cross} of 7 ranges cross 4.8`);
  }
  input.addEventListener('input', draw);

  // drag on the curve
  const toN = e => {
    const p = curve.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(curve.getScreenCTM().inverse());
    input.value = nOfX(q.x); draw();
  };
  let dragging = false;
  hit.addEventListener('pointerdown', e => { dragging = true; try { hit.setPointerCapture(e.pointerId); } catch (_) {} toN(e); });
  hit.addEventListener('pointermove', e => { if (dragging) toN(e); });
  hit.addEventListener('pointerup', () => { dragging = false; input.focus({ preventScroll: true }); });
  hit.addEventListener('pointercancel', () => { dragging = false; });

  draw();
})();
