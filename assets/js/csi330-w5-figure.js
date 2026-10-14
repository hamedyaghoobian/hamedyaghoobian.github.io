// CSI 330 · Week 5 · k-NN regression. All 342 penguins on a board, body
// mass against flipper length. A carriage slides along the flipper axis:
// the k birds nearest it light up, and a bar sets at their mean mass — the
// prediction. The dashed trace is the whole prediction curve for this k:
// k = 1 jumps from bird to bird (variance), a large k flattens toward the
// overall mean (bias). The faint straight line is week 4's least squares.

(function () {
  const root = document.getElementById('w5-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, D = window.CSI330.w4, A = D.all;

  const svg = makeSvg(root, '0 0 100 100',
    'A board plotting all 342 penguins, body mass against flipper length, with a carriage that slides along the flipper axis; the k nearest birds light up and a bar marks their mean mass, the prediction. A selector sets k.');

  K.bench(svg, -6, -4, 168, 64);
  K.plate(svg, 'PALMER PENGUINS · 342 BIRDS · KNEIGHBORSREGRESSOR', 4, 64);

  const b = K.board(svg, 0, 132, 24, 6, 96);
  const sx = K.scale(170, 235, 16, 126), sy = K.scale(2500, 6500, 77, 8);
  K.axes(b.g, sx, sy, [170, 190, 210, 230], [3000, 4000, 5000, 6000], 'flipper length (mm)', 'body mass (g)', 2.8);
  const ols = el('line', { class: 'lf-line lf-faint', x1: sx(170), y1: sy(D.b0 + D.b1 * 170), x2: sx(235), y2: sy(D.b0 + D.b1 * 235) }, b.g);
  const dots = A.map(([x, y]) => el('circle', { class: 'lf-line lf-faint', cx: sx(x), cy: sy(y), r: 0.8 }, b.g));
  const trace = el('path', { class: 'lf-line', 'stroke-dasharray': '1.2 0.8' }, b.g);
  const hot = el('g', { class: 'lf-hot' }, b.g);
  const qline = el('line', { class: 'lf-line', y1: 8, y2: 77, 'stroke-dasharray': '0.8 1' }, hot);
  const bar = el('line', { class: 'lf-line lf-strong' }, hot);
  const band = el('rect', { class: 'lf-line', y: 8, height: 69, 'stroke-dasharray': '0.5 1' }, hot);
  // the carriage: a pointer riding the flipper axis (drawn on the board, so it
  // lines up with the query exactly)
  const carriage = el('path', { class: 'lf-line lf-strong' }, hot);

  const KS = [1, 3, 5, 15, 45, 150];
  const sel = K.selector(svg, 24, 48, KS, 'K NEIGHBOURS');

  const nearest = (q, k) => A.map((p, i) => [Math.abs(p[0] - q), i]).sort((a, c) => a[0] - c[0]).slice(0, k).map(p => p[1]);
  const predict = (q, k) => K.mean(nearest(q, k).map(i => A[i][1]));
  const st = { q: 200, k: 2 };
  let traceK = -1;
  function update() {
    const k = KS[st.k], idx = nearest(st.q, k), set = new Set(idx);
    const yhat = K.mean(idx.map(i => A[i][1]));
    dots.forEach((d, i) => d.setAttribute('class', set.has(i) ? 'lf-line lf-hot' : 'lf-line lf-faint'));
    const xs = idx.map(i => A[i][0]), lo = Math.min(...xs), hi = Math.max(...xs);
    band.setAttribute('x', sx(lo) - 0.6); band.setAttribute('width', sx(hi) - sx(lo) + 1.2);
    qline.setAttribute('x1', sx(st.q)); qline.setAttribute('x2', sx(st.q));
    bar.setAttribute('x1', sx(st.q) - 5); bar.setAttribute('x2', sx(st.q) + 5);
    bar.setAttribute('y1', sy(yhat)); bar.setAttribute('y2', sy(yhat));
    if (traceK !== k) {
      traceK = k;
      let d = '';
      for (let q = 172; q <= 231; q += 0.5) d += `${d ? 'L' : 'M'}${sx(q).toFixed(2)} ${sy(predict(q, k)).toFixed(2)}`;
      trace.setAttribute('d', d);
    }
    const cx = sx(st.q);
    carriage.setAttribute("d", `M${cx} 77 L${cx - 1.6} 74.2 L${cx + 1.6} 74.2 Z`);
    sel.set(st.k);
    const ys = idx.map(i => A[i][1]);
    const sum = ys.reduce((a, c) => a + c, 0);
    const shown = ys.length <= 5 ? `(${ys.join(' + ')})` : `(${ys.slice(0, 3).join(' + ')} + … ${ys.length - 3} more)`;
    ctl.calc(`<var>ŷ</var> = (<var>y</var>₁ + … + <var>y</var><sub>k</sub>) ÷ <var>k</var> = ${shown} ÷ ${k} = ${sum.toLocaleString('en-US')} ÷ ${k} = <span class="hot">${Math.round(yhat).toLocaleString('en-US')} g</span><br>` +
      `k = 1 copies one bird; k = 342 would predict the overall mean, ${Math.round(K.mean(A.map(p => p[1]))).toLocaleString('en-US')} g, for everyone`);
    ctl.say(`flipper ${st.q.toFixed(0)} mm · k ${k} · predicts ${Math.round(yhat).toLocaleString('en-US')} g, the mean of ${k} bird${k > 1 ? 's' : ''} from ${lo} to ${hi} mm`);
  }

  const TOUR = [[185, 0], [205, 0], [215, 0], [215, 2], [215, 4], [195, 4], [195, 5], [200, 2]];
  let t = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const s = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (s) { st.q = Math.max(172, Math.min(231, st.q + s)); update(); return true; }
      const kk = { ArrowUp: 1, ArrowDown: -1 }[e.key];
      if (kk) { st.k = Math.max(0, Math.min(KS.length - 1, st.k + kk)); update(); return true; }
      return false;
    },
    step: () => { t = (t + 1) % TOUR.length; [st.q, st.k] = TOUR[t]; update(); },
    every: 2000
  });
  svg.addEventListener('pointermove', e => {
    if (e.buttons && sel.pick(e) >= 0) { st.k = sel.pick(e); return update(); }
    const [x, y] = b.toFace(e);
    if (x < 16 || x > 126 || y < 8 || y > 77) return;
    st.q = Math.max(172, Math.min(231, Math.round(sx.inv(x)))); update();
  });
  svg.addEventListener('pointerdown', e => { const k = sel.pick(e); if (k >= 0) { st.k = k; update(); } });
  // Parts, in the entry's order; the flipper length and k by hand.
  K.parts(root, svg, [b.el, [carriage, qline], band, bar, trace, ols]);
  ctl.after = K.panel(root, [
    { label: 'Flipper', type: 'range', min: 172, max: 231, step: 1, get: () => st.q, set: v => { st.q = v; update(); }, fmt: v => v + ' mm' },
    { label: 'k', type: 'seg', options: KS.map((k, i) => [i, String(k)]), get: () => st.k, set: i => { st.k = i; update(); } }
  ]);
  update();
  K.fit(svg);
})();
