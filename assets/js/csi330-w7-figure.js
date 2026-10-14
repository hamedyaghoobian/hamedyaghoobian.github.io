// CSI 330 · Week 7 · Regression metrics. Thirty typical NHANES participants on a
// board, insulin against glucose, and a fixed least-squares line (fitted on
// everyone). Each person's residual is a stick from their point to the line.
// Grab any point and drag it up or down: three gauges read MAE, RMSE and R².
// MAE grows with the size of the miss; RMSE squares it first, so a single
// outlier moves it far more; R² compares the misses with simply guessing
// the mean, and can fall below zero. R puts everyone back.

(function () {
  const root = document.getElementById('w7-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, D = window.CSI330.w7;
  const P0 = D.pts.map(p => p.slice());

  const svg = makeSvg(root, '0 0 100 100',
    'A board plotting thirty people, insulin against glucose, with a fixed regression line and a residual stick from each point to the line. Dragging a point changes the MAE, RMSE and R-squared gauges.');

  K.bench(svg, -6, -4, 212, 64);
  K.plate(svg, 'NHANES · 30 PEOPLE · INSULIN ~ GLUCOSE · LINE FITTED ON EVERYONE', 4, 64);

  const b = K.board(svg, 0, 132, 24, 6, 96);
  const sx = K.scale(4, 12, 16, 126), sy = K.scale(0, 150, 77, 8);
  K.axes(b.g, sx, sy, [4, 6, 8, 10, 12], [0, 50, 100, 150], 'glucose (mmol/L)', 'insulin (µU/mL)', 2.8);
  const yhat = x => D.b0 + D.b1 * x;
  const fitLine = el('line', { class: 'lf-line lf-strong', x1: sx(4), y1: sy(yhat(4)), x2: sx(12), y2: sy(yhat(12)) }, b.g);
  const sticks = P0.map(() => el('line', { class: 'lf-line' }, b.g));
  const dots = P0.map(() => el('circle', { class: 'lf-dot', r: 1.1 }, b.g));

  // three gauges side by side, none behind another
  const gMAE = K.gauge(svg, 142, 40, 'MAE', 0, 40, v => v.toFixed(1), 16);
  const gRMSE = K.gauge(svg, 164, 40, 'RMSE', 0, 40, v => v.toFixed(1), 16);
  const gR2 = K.gauge(svg, 186, 40, 'R²', -1, 1, v => v.toFixed(2), 16);

  const st = { pts: P0.map(p => p.slice()), pick: P0.reduce((bi, p, i, a) => p[0] > a[bi][0] ? i : bi, 0) };
  function update() {
    const P = st.pts, res = P.map(([x, y]) => y - yhat(x)), ym = K.mean(P.map(p => p[1]));
    const mae = K.mean(res.map(Math.abs)), rmse = Math.sqrt(K.mean(res.map(r => r * r)));
    const r2 = 1 - res.reduce((s, r) => s + r * r, 0) / P.reduce((s, p) => s + (p[1] - ym) ** 2, 0);
    P.forEach(([x, y], i) => {
      const hot = i === st.pick;
      dots[i].setAttribute('cx', sx(x)); dots[i].setAttribute('cy', sy(y));
      dots[i].setAttribute('class', hot ? 'lf-dot lf-hot' : 'lf-dot');
      sticks[i].setAttribute('x1', sx(x)); sticks[i].setAttribute('x2', sx(x));
      sticks[i].setAttribute('y1', sy(y)); sticks[i].setAttribute('y2', sy(yhat(x)));
      sticks[i].setAttribute('class', hot ? 'lf-line lf-strong lf-hot' : 'lf-line');
    });
    gMAE(mae); gRMSE(rmse); gR2(Math.max(-1, r2));
    const p = P[st.pick];
    const sabs = res.reduce((a, r) => a + Math.abs(r), 0), ssq = res.reduce((a, r) => a + r * r, 0), sst = P.reduce((a, q) => a + (q[1] - ym) ** 2, 0);
    ctl.calc(`<var>MAE</var> = Σ|<var>e</var>| ÷ 30 = ${sabs.toFixed(0)} ÷ 30 = <b>${mae.toFixed(1)}</b><br>` +
      `<var>RMSE</var> = √( Σ<var>e</var>² ÷ 30 ) = √( ${ssq.toFixed(0)} ÷ 30 ) = <span class="hot">${rmse.toFixed(1)}</span> &nbsp;— squaring lets the biggest misses dominate<br>` +
      `<var>R</var>² = 1 − Σ<var>e</var>² ÷ Σ(<var>y</var> − ȳ)² = 1 − ${ssq.toFixed(0)} ÷ ${sst.toFixed(0)} = <b>${r2.toFixed(2)}</b> &nbsp;— below 0 means worse than guessing the mean`);
    ctl.say(`MAE ${mae.toFixed(1)} · RMSE ${rmse.toFixed(1)} · R² ${r2.toFixed(2)} · picked: glucose ${p[0].toFixed(1)}, insulin ${p[1].toFixed(0)} (miss ${(p[1] - yhat(p[0])).toFixed(0)})`);
  }

  // Tour: lift the picked point step by step, then let it fall back.
  let t = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const P = st.pts;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const order = P.map((p, i) => i).sort((a, c) => P[a][0] - P[c][0]), at = order.indexOf(st.pick);
        st.pick = order[Math.max(0, Math.min(order.length - 1, at + (e.key === 'ArrowRight' ? 1 : -1)))]; update(); return true;
      }
      const s = { ArrowUp: 5, ArrowDown: -5 }[e.key];
      if (s) { P[st.pick][1] = Math.max(0, Math.min(150, P[st.pick][1] + s)); update(); return true; }
      if (e.key === 'r' || e.key === 'R') { st.pts = P0.map(p => p.slice()); update(); return true; }
      return false;
    },
    step: () => {
      t = (t + 1) % 6;
      const i = st.pick;
      st.pts[i][1] = t === 0 ? P0[i][1] : Math.min(150, P0[i][1] + t * 22);
      update();
    },
    every: 1500
  });
  let drag = false;
  svg.addEventListener('pointerdown', e => {
    const [x, y] = b.toFace(e);
    let best = -1, bd = 6;
    st.pts.forEach((p, i) => { const d = Math.hypot(sx(p[0]) - x, sy(p[1]) - y); if (d < bd) { bd = d; best = i; } });
    if (best < 0) return;
    st.pick = best; drag = true; svg.setPointerCapture(e.pointerId); update();
  });
  svg.addEventListener('pointermove', e => {
    if (!drag) return;
    const [, y] = b.toFace(e);
    st.pts[st.pick][1] = Math.max(0, Math.min(150, sy.inv(y))); update();
  });
  svg.addEventListener('pointerup', () => { drag = false; });
  svg.addEventListener('dblclick', () => { st.pts = P0.map(p => p.slice()); update(); });
  // Parts, in the entry's order; the outlier by hand.
  const SG = el('g', {}, b.g);
  sticks.forEach(n => SG.appendChild(n));
  b.g.appendChild(SG); dots.forEach(n => b.g.appendChild(n));     // keep the dots above the sticks
  K.parts(root, svg, [b.el, fitLine, SG, [gMAE.el, gRMSE.el, gR2.el]]);
  const far = P0.reduce((bi, p, i, a) => p[0] > a[bi][0] ? i : bi, 0);
  const state = () => st.pts.every((p, i) => p[1] === P0[i][1]) ? 'none'
    : st.pts.every((p, i) => i === far ? p[1] === 150 : p[1] === P0[i][1]) ? 'one' : '';
  ctl.after = K.panel(root, [
    { label: 'Data', type: 'seg', options: [['none', 'as measured'], ['one', 'one outlier: 10.5 → 150']], get: state,
      set: v => { st.pts = P0.map(p => p.slice()); st.pick = far; if (v === 'one') st.pts[far][1] = 150; update(); } },
    { label: 'Picked point', type: 'range', min: 0, max: 150, step: 1, get: () => Math.round(st.pts[st.pick][1]),
      set: v => { st.pts[st.pick][1] = v; update(); }, fmt: v => 'insulin ' + v }
  ]);
  update();
  K.fit(svg);
})();
