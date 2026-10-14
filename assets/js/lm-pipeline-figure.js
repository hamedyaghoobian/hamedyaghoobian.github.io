// Learning Machines · the whole pipeline. One penguin at a time goes
// through six panels, read left to right like a line of type: 1 the data,
// 2 the split and the scaling (mean and spread from the training birds
// only), 3 one score per species (a logit: bias + weight × each scaled
// measurement), 4 softmax turns the scores into probabilities, 5 where the
// bird falls on the map those weights draw, 6 the running confusion matrix
// of all the test birds so far. → steps to the next bird and a pulse runs
// through the panels; 1–6 (or a click) focus a stage and the text under the
// card explains it with this bird's numbers. Three-class logistic
// regression on bill length and depth, fitted by scikit-learn
// (scripts/csi330_data.py); the page recomputes it and agrees on all 103
// test birds. Layout after the "next-token flow" figures of the LLM anatomy
// studies; drawn with this site's line kit.

(function () {
  const root = document.getElementById('pipeline-figure');
  if (!root || !window.CSI330 || !window.LineFigure) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const P = window.CSI330.pipe, SP = ['Adelie', 'Chinstrap', 'Gentoo'];
  const N = P.test.length;
  const BASE = (window.LM_BASE || '/tools/learning-machines/');

  const svg = makeSvg(root, '0 0 760 612',
    'The machine-learning pipeline in six panels, following one penguin: the data, the train/test split and scaling, one score per species, softmax probabilities, the decision map, and the running confusion matrix.');
  svg.classList.add('lm-flow');

  // Panels in two rows of three, read left to right, then down:
  // x, y, width, number, name, a line under the name.
  const PANELS = [
    [0, 44, 230, 1, 'DATA', 'test birds, one at a time'],
    [240, 44, 230, 2, 'SPLIT · SCALE', 'μ and σ from training birds only'],
    [480, 44, 280, 3, 'SCORES · LOGITS', 'b + w₁·bill + w₂·depth'],
    [0, 336, 230, 4, 'SOFTMAX', 'eᶻ ÷ Σ eᶻ'],
    [240, 336, 230, 5, 'MAP', 'the regions the weights draw'],
    [480, 336, 280, 6, 'SCORE', 'confusion matrix so far']
  ];
  const H = 276;
  const t = (x, y, s, size = 9, cls = 'lm-t', anchor = 'start', g = svg) => {
    const n = el('text', { class: cls, x, y, 'font-size': size, 'text-anchor': anchor }, g);
    n.textContent = s; return n;
  };
  const head = el('g', {}, svg);
  const sentence = t(0, 24, '', 19, 'lm-t lm-big', 'start', head);
  const panels = PANELS.map(([x, y, w, n, name, sub], i) => {
    const g = el('g', { 'data-stage': i, style: 'cursor:pointer' }, svg);
    el('rect', { class: 'lm-frame', x, y, width: w, height: H, rx: 4 }, g);
    t(x + 9, y + 16, `${n} ${name}`, 10, 'lm-t lm-cap', 'start', g);
    t(x + 9, y + 29, sub, 8.5, 'lm-t lm-sub', 'start', g);
    if (i % 3) t(x - 5, y + H / 2 + 4, '›', 13, 'lm-t lm-sub', 'middle', svg);
    return g;
  });
  t(760, 334, '↓ then the second row', 8, 'lm-t lm-sub', 'end');
  const fx = i => PANELS[i][0], fy = i => PANELS[i][1], fw = i => PANELS[i][2];

  // 1 · Data: a window of nine test birds, the current one in the middle.
  const rows = [];
  const Y1 = fy(0), COLS = [10, 46, 96, 146];
  ['#', 'bill', 'depth', 'species'].forEach((h, c) => t(fx(0) + COLS[c], Y1 + 50, h, 8.5, 'lm-t lm-sub'));
  for (let r = 0; r < 9; r++) {
    const g = el('g', {}, svg), y = Y1 + 72 + r * 22;
    const box = el('rect', { class: 'lm-row', x: fx(0) + 5, y: y - 14, width: fw(0) - 10, height: 19, rx: 2 }, g);
    rows.push({ g, box, c: COLS.map(cx => t(fx(0) + cx, y, '', 10, 'lm-t', 'start', g)) });
  }

  // 2 · Split and scale.
  const Y2 = fy(1), sx2 = fx(1) + 10, sw2 = fw(1) - 20, trW = sw2 * P.ntrain / (P.ntrain + N);
  el('rect', { class: 'lm-bar lm-soft', x: sx2, y: Y2 + 42, width: trW - 1, height: 11 }, svg);
  el('rect', { class: 'lm-frame', x: sx2 + trW, y: Y2 + 42, width: sw2 - trW, height: 11 }, svg);
  t(sx2, Y2 + 66, `train ${P.ntrain}`, 8.5, 'lm-t lm-sub');
  t(sx2 + sw2, Y2 + 66, `test ${N}`, 8.5, 'lm-t lm-sub', 'end');
  const splitMark = el('line', { class: 'lm-hot-line', y1: Y2 + 38, y2: Y2 + 57 }, el('g', { class: 'lf-hot' }, svg));
  const feat = ['bill', 'depth'].map((name, j) => {
    const y = Y2 + 98 + j * 90, g = el('g', {}, svg);
    const a = t(sx2, y, '', 10.5, 'lm-t lm-b', 'start', g);
    const b = t(sx2, y + 16, '', 9.5, 'lm-t', 'start', g);
    const c = t(sx2, y + 31, '', 9.5, 'lm-t', 'start', g);
    const cx = sx2 + sw2 / 2, by = y + 42;
    el('line', { class: 'lm-axis', x1: sx2, x2: sx2 + sw2, y1: by + 5, y2: by + 5 }, g);
    el('line', { class: 'lm-axis', x1: cx, x2: cx, y1: by - 2, y2: by + 12 }, g);
    t(sx2, by + 23, '−2.5', 8, 'lm-t lm-sub', 'start', g); t(cx, by + 23, '0', 8, 'lm-t lm-sub', 'middle', g);
    t(sx2 + sw2, by + 23, '+2.5', 8, 'lm-t lm-sub', 'end', g);
    const bar = el('rect', { class: 'lm-bar', y: by, height: 10 }, el('g', { class: 'lf-hot' }, g));
    return { a, b, c, bar, cx, half: sw2 / 2 };
  });

  // 3 · One score per species.
  const x3 = fx(2) + 10, w3 = fw(2) - 20, Y3 = fy(2);
  const logit = SP.map((name, k) => {
    const y = Y3 + 56 + k * 70, g = el('g', {}, svg);
    const n = t(x3, y, name, 11, 'lm-t lm-b', 'start', g);
    const eq = t(x3, y + 17, '', 9.5, 'lm-t', 'start', g);
    const cx = x3 + w3 / 2, by = y + 27;
    el('line', { class: 'lm-axis', x1: x3, x2: x3 + w3, y1: by + 5, y2: by + 5 }, g);
    el('line', { class: 'lm-axis', x1: cx, x2: cx, y1: by - 2, y2: by + 12 }, g);
    const hot = el('g', {}, g);
    const bar = el('rect', { class: 'lm-bar', y: by, height: 10 }, hot);
    const val = t(x3 + w3, y, '', 11, 'lm-t lm-b', 'end', hot);
    return { g, hot, n, eq, bar, val, cx, half: w3 / 2 };
  });
  t(x3, Y3 + H - 12, 'bar: the score, −8 … +8 · lit: the highest', 8.5, 'lm-t lm-sub');

  // 4 · Softmax.
  const x4 = fx(3) + 10, w4 = fw(3) - 20, Y4 = fy(3);
  const soft = SP.map((name, k) => {
    const y = Y4 + 58 + k * 70, g = el('g', {}, svg);
    t(x4, y, name, 11, 'lm-t lm-b', 'start', g);
    const truth = t(x4 + w4, y, '', 9, 'lm-t lm-sub', 'end', g);
    el('rect', { class: 'lm-frame', x: x4, y: y + 9, width: w4, height: 14 }, g);
    const hot = el('g', {}, g);
    const bar = el('rect', { class: 'lm-bar', x: x4, y: y + 9, height: 14 }, hot);
    const val = t(x4, y + 38, '', 10.5, 'lm-t', 'start', hot);
    return { g, hot, truth, bar, val };
  });

  // 5 · The map: training birds in scaled units, the boundaries the
  // weights draw, and this bird.
  const x5 = fx(4) + 10, w5 = fw(4) - 20, y5 = fy(4) + 40, h5 = 206, R = 2.6;
  const mx = z => x5 + (z + R) / (2 * R) * w5, my = z => y5 + h5 - (z + R) / (2 * R) * h5;
  el('rect', { class: 'lm-frame', x: x5, y: y5, width: w5, height: h5 }, svg);
  const argmax = (a, d) => { let best = 0, bv = -1e9; P.W.forEach((w, k) => { const v = P.b[k] + w[0] * a + w[1] * d; if (v > bv) { bv = v; best = k; } }); return best; };
  // Each border is where two species' scores tie, a straight line,
  // drawn only where those two beat the third.
  let seg = '';
  [[0, 1], [0, 2], [1, 2]].forEach(([k, j]) => {
    const dw = [P.W[k][0] - P.W[j][0], P.W[k][1] - P.W[j][1]], db = P.b[k] - P.b[j];
    let run = '';
    for (let n = 0; n <= 400; n++) {
      const tt = -R + 2 * R * n / 400;
      // walk along whichever axis the line is less steep against
      const steep = Math.abs(dw[1]) < Math.abs(dw[0]);
      const a = steep ? -(db + dw[1] * tt) / dw[0] : tt, d = steep ? tt : -(db + dw[0] * tt) / dw[1];
      const inside = Math.abs(a) <= R && Math.abs(d) <= R && argmax(a, d) !== 3 - k - j;
      if (inside) run += `${run ? 'L' : 'M'}${mx(a).toFixed(1)} ${my(d).toFixed(1)}`;
      else if (run) { seg += run; run = ''; }
    }
    seg += run;
  });
  el('path', { class: 'lm-edge', d: seg }, svg);
  const z = (v, j) => (v - P.mean[j]) / P.sd[j];
  const glyph = (k, x, y, g, r = 1.4) => k === 0 ? el('circle', { cx: x, cy: y, r }, g)
    : k === 1 ? el('path', { d: `M${x} ${y - r * 1.2}L${x + r * 1.1} ${y + r * 0.8}L${x - r * 1.1} ${y + r * 0.8}Z` }, g)
    : el('rect', { x: x - r * 0.9, y: y - r * 0.9, width: r * 1.8, height: r * 1.8 }, g);
  const dots = el('g', { class: 'lm-dots' }, svg);
  P.train.forEach(([a, d, k]) => glyph(k, mx(z(a, 0)), my(z(d, 1)), dots));
  // region names where each class is surely itself
  [[-1.5, 1.9, 0], [1.6, 1.9, 1], [1.2, -2.1, 2]].forEach(([a, d, k]) => t(mx(a), my(d), SP[k], 9, 'lm-t lm-b', 'middle'));
  t(x5, y5 + h5 + 14, 'bill (scaled) →', 8.5, 'lm-t lm-sub');
  t(x5 + w5, y5 + h5 + 14, '↑ depth (scaled)', 8.5, 'lm-t lm-sub', 'end');
  const me = el('g', { class: 'lf-hot' }, svg);
  el('circle', { class: 'lm-hot-line', r: 5 }, me);
  el('path', { class: 'lm-hot-line', d: 'M-9 0H-5M5 0H9M0 -9V-5M0 5V9' }, me);

  // 6 · Running confusion matrix.
  const x6 = fx(5) + 10, w6 = fw(5) - 20, cs = 46, y6 = fy(5) + 66;
  t(x6 + 22 + cs * 1.5, y6 - 20, 'predicted', 8.5, 'lm-t lm-sub', 'middle');
  const cells = [];
  for (let r = 0; r < 3; r++) {
    t(x6 + 14, y6 + r * cs + cs / 2 + 3, SP[r].slice(0, 4), 9, 'lm-t lm-sub', 'end');
    t(x6 + 22 + r * cs + cs / 2, y6 - 6, SP[r].slice(0, 4), 9, 'lm-t lm-sub', 'middle');
    cells.push([0, 1, 2].map(c => {
      const g = el('g', {}, svg);
      const box = el('rect', { class: r === c ? 'lm-cell lm-diag' : 'lm-cell', x: x6 + 22 + c * cs, y: y6 + r * cs, width: cs - 3, height: cs - 3, rx: 2 }, g);
      const n = t(x6 + 22 + c * cs + cs / 2 - 1.5, y6 + r * cs + cs / 2 + 3, '0', 12, 'lm-t', 'middle', g);
      return { g, box, n };
    }));
  }
  t(x6 + 22 + cs * 3 + 8, y6 + 12, 'rows:', 8.5, 'lm-t lm-sub');
  t(x6 + 22 + cs * 3 + 8, y6 + 24, 'true', 8.5, 'lm-t lm-sub');
  t(x6 + 22 + cs * 3 + 8, y6 + 36, 'species', 8.5, 'lm-t lm-sub');
  const accT = t(x6, y6 + cs * 3 + 26, '', 11, 'lm-t lm-b');
  const accT2 = t(x6, y6 + cs * 3 + 42, '', 9, 'lm-t lm-sub');

  // ── The model, recomputed ──────────────────────────────────────────────
  function run(i) {
    const [a, d, y] = P.test[i];
    const zs = [z(a, 0), z(d, 1)];
    const lg = P.W.map((w, k) => P.b[k] + w[0] * zs[0] + w[1] * zs[1]);
    const m = Math.max(...lg), e = lg.map(v => Math.exp(v - m)), s = e.reduce((p, q) => p + q, 0);
    const p = e.map(v => v / s), pred = p.indexOf(Math.max(...p));
    return { a, d, y, zs, lg, e, s, p, pred };
  }
  const RESULTS = P.test.map((_, i) => run(i));

  const ST = { i: 0, stage: -1, pulse: -1 };
  const f2 = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
  const sgn = v => (v < 0 ? ' − ' : ' + ') + Math.abs(v).toFixed(2);

  function draw() {
    const R0 = RESULTS[ST.i], lit = ST.pulse >= 0 ? ST.pulse : ST.stage;
    sentence.textContent = `Bird ${ST.i + 1} of ${N}: bill ${R0.a.toFixed(1)} mm, depth ${R0.d.toFixed(1)} mm → ${SP[R0.pred]} ${R0.p[R0.pred].toFixed(2)} ${R0.pred === R0.y ? '✓' : `✗ (it is ${SP[R0.y]})`}`;
    panels.forEach((g, k) => g.classList.toggle('lm-focus', k === lit));
    // 1
    rows.forEach((r, k) => {
      const j = (ST.i + k - 4 + N) % N, b = P.test[j], cur = k === 4;
      r.g.setAttribute('class', cur ? 'lf-hot' : '');
      r.box.style.display = cur ? '' : 'none';
      r.c[0].textContent = j + 1; r.c[1].textContent = b[0].toFixed(1); r.c[2].textContent = b[1].toFixed(1); r.c[3].textContent = SP[b[2]];
    });
    // 2
    const mxk = sx2 + trW + (sw2 - trW) * (ST.i + 0.5) / N;
    splitMark.setAttribute('x1', mxk); splitMark.setAttribute('x2', mxk);
    feat.forEach((f, j) => {
      const raw = j ? R0.d : R0.a, zz = R0.zs[j];
      f.a.textContent = `${j ? 'depth' : 'bill'} ${raw.toFixed(1)} mm`;
      f.b.textContent = `(${raw.toFixed(1)} − ${P.mean[j].toFixed(1)}) ÷ ${P.sd[j].toFixed(2)}`;
      f.c.textContent = `= ${f2(zz)} σ`;
      const wpx = Math.max(-1, Math.min(1, zz / 2.5)) * f.half;
      f.bar.setAttribute('x', wpx < 0 ? f.cx + wpx : f.cx); f.bar.setAttribute('width', Math.abs(wpx));
    });
    // 3
    logit.forEach((L, k) => {
      const w = P.W[k];
      L.eq.textContent = `${f2(P.b[k])}${sgn(w[0])}×${f2(R0.zs[0])}${sgn(w[1])}×${f2(R0.zs[1])}`;
      L.val.textContent = f2(R0.lg[k]);
      const wpx = Math.max(-1, Math.min(1, R0.lg[k] / 8)) * L.half;
      L.bar.setAttribute('x', wpx < 0 ? L.cx + wpx : L.cx); L.bar.setAttribute('width', Math.abs(wpx));
      L.hot.setAttribute('class', k === R0.pred ? 'lf-hot' : '');
      L.n.setAttribute('class', k === R0.pred ? 'lm-t lm-b lm-hot-t' : 'lm-t');
    });
    // 4
    soft.forEach((S, k) => {
      S.bar.setAttribute('width', (w4 * R0.p[k]).toFixed(1));
      S.val.textContent = R0.p[k] < 0.005 ? '<0.01' : R0.p[k].toFixed(2);
      S.hot.setAttribute('class', k === R0.pred ? 'lf-hot' : '');
      S.truth.textContent = k === R0.y ? 'true' : '';
    });
    // 5
    me.setAttribute('transform', `translate(${mx(R0.zs[0]).toFixed(1)} ${my(R0.zs[1]).toFixed(1)})`);
    // 6: every test bird up to and including this one
    const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let ok = 0;
    for (let j = 0; j <= ST.i; j++) { M[RESULTS[j].y][RESULTS[j].pred]++; if (RESULTS[j].y === RESULTS[j].pred) ok++; }
    cells.forEach((row, r) => row.forEach((c, k) => {
      c.n.textContent = M[r][k];
      c.g.setAttribute('class', r === R0.y && k === R0.pred ? 'lf-hot' : '');
    }));
    accT.textContent = `accuracy ${(ok / (ST.i + 1)).toFixed(2)}`;
    accT2.textContent = `${ok} of ${ST.i + 1} right · all ${N}: ${P.acc.toFixed(2)}`;
    explain(R0, ok, lit);
  }

  // ── "This step": the stage in words, with this bird's numbers ─────────
  const link = (slug, text) => `<a href="${BASE}${slug}/">${text} →</a>`;
  function explain(R0, ok, s) {
    const nm = SP[R0.pred];
    const say = [
      `Bird ${ST.i + 1} is one row: two measurements the model may use, and its species, the answer it has to guess. It is a <b>test</b> bird, so the model never saw it while learning. ${link('k-nearest-neighbors', 'the penguins')}`,
      `${P.ntrain} birds trained the model and ${N} were held back to test it. Each measurement is rescaled with the <b>training</b> birds' mean and spread: bill (${R0.a.toFixed(1)} − ${P.mean[0].toFixed(2)}) ÷ ${P.sd[0].toFixed(2)} = <b>${f2(R0.zs[0])}</b>, depth (${R0.d.toFixed(1)} − ${P.mean[1].toFixed(2)}) ÷ ${P.sd[1].toFixed(2)} = <b>${f2(R0.zs[1])}</b>. Using the test birds' own mean would leak the answer in. ${link('cross-validation', 'splitting and validating')}`,
      `Each species has a bias and one weight per measurement. Its score is z = b + w₁·bill + w₂·depth: ${SP.map((n, k) => `${n} <b>${f2(R0.lg[k])}</b>`).join(', ')}. The highest score is ${nm}'s. A score is a log-odds, so only differences between scores matter. ${link('logistic-regression', 'logistic regression')}`,
      `Softmax turns scores into probabilities: p = eᶻ ÷ Σ eᶻ. Here Σ eᶻ = ${R0.s.toFixed(2)} (after subtracting the largest score), so ${SP.map((n, k) => `${n} <b>${R0.p[k].toFixed(2)}</b>`).join(', ')}. The prediction is the largest: <span class="hot">${nm}</span>. ${link('logistic-regression', 'from scores to probabilities')}`,
      `The weights carve the plane of scaled measurements into three regions, with straight borders, because each score is a straight line in bill and depth. Bird ${ST.i + 1} lands in ${nm}'s region${R0.pred === R0.y ? '' : `, though it is a ${SP[R0.y]}: it sits near a border, or on the wrong side of one`}. ${link('k-nearest-neighbors', 'compare with k-NN, which draws no straight lines')}`,
      `Each test bird adds one count: its row is the true species, its column the prediction. After ${ST.i + 1} birds, ${ok} are on the diagonal: accuracy <b>${(ok / (ST.i + 1)).toFixed(2)}</b>. Over all ${N} test birds it is <b>${P.acc.toFixed(2)}</b>; scikit-learn reports the same. ${link('classification-metrics', 'reading a confusion matrix')}`
    ];
    if (s >= 0) ctl.calc(`<b>${PANELS[s][3]} · ${PANELS[s][4].toLowerCase()}</b> &nbsp; ${say[s]}`);
    else ctl.calc(`<b>This step</b> &nbsp; ${say[ST.lastStage ?? 3]}`);
    ctl.say(`bird ${ST.i + 1} of ${N} · ${nm} ${R0.p[R0.pred].toFixed(2)}${R0.pred === R0.y ? ' · right' : ` · wrong, it is ${SP[R0.y]}`}${s >= 0 ? ` · stage ${s + 1}` : ''}`);
  }

  // A pulse through the panels whenever a new bird arrives.
  let timer = 0;
  function next(step) {
    ST.i = (ST.i + step + N) % N;
    clearTimeout(timer);
    if (ctl.still.matches) { ST.pulse = -1; return draw(); }
    ST.pulse = 0;
    (function go() {
      draw();
      if (ST.pulse < 5) { ST.pulse++; timer = setTimeout(go, 220); }
      else timer = setTimeout(() => { ST.pulse = -1; draw(); }, 420);
    })();
  }
  function focus(s) { ST.stage = s; if (s >= 0) ST.lastStage = s; ST.pulse = -1; clearTimeout(timer); draw(); }

  const K = window.CSIKit;
  const ctl = K.controls(root, svg, {
    keys: e => {
      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N' || e.key === ' ') { next(1); return true; }
      if (e.key === 'ArrowLeft') { next(-1); return true; }
      if (/^[1-6]$/.test(e.key)) { focus(+e.key - 1 === ST.stage ? -1 : +e.key - 1); return true; }
      if (e.key === 'Escape') { focus(-1); return true; }
      return false;
    },
    step: () => next(1),
    every: 3000
  });
  svg.addEventListener('click', e => {
    const g = e.target.closest('[data-stage]');
    if (g) { const s = +g.dataset.stage; focus(s === ST.stage ? -1 : s); }
    else next(1);
  });
  ST.lastStage = 3;
  draw();
})();
