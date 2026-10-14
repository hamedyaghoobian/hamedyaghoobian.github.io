// CSI 330 · Week 4 · Least squares. Forty penguins on a board, body mass
// against flipper length, and a straight rod pivoting on the birds' mean
// point (every least-squares line passes through it). Each bird is tied to
// the rod by a vertical spring, its residual. A spring's energy grows with
// the square of its stretch, so the rod's resting place — the line with the
// least total energy — is the least-squares line. Turn the rod and the
// gauge reads the RMSE; F lets go and the rod settles on the fitted line.

(function () {
  const root = document.getElementById('w4-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, P = window.CSI330.w4.pts;

  const svg = makeSvg(root, '0 0 100 100',
    'A board plotting forty penguins, body mass against flipper length, with a straight rod pivoting on their mean point and a vertical spring from each bird to the rod. Turning the rod changes the springs and the error gauge; the least-squares line is where the springs rest.');

  K.bench(svg, -6, -4, 180, 64);
  K.plate(svg, 'PALMER PENGUINS · 40 BIRDS · BODY MASS ~ FLIPPER LENGTH', 4, 64);

  const b = K.board(svg, 0, 132, 24, 6, 96);
  const sx = K.scale(170, 235, 16, 126), sy = K.scale(2500, 6500, 77, 8);
  K.axes(b.g, sx, sy, [170, 190, 210, 230], [3000, 4000, 5000, 6000], 'flipper length (mm)', 'body mass (g)', 2.8);

  // Least squares on the forty, closed form.
  const xm = K.mean(P.map(p => p[0])), ym = K.mean(P.map(p => p[1]));
  const best = P.reduce((s, p) => s + (p[0] - xm) * (p[1] - ym), 0) / P.reduce((s, p) => s + (p[0] - xm) ** 2, 0);
  const rmse = m => Math.sqrt(K.mean(P.map(p => (p[1] - (ym + m * (p[0] - xm))) ** 2)));
  const RBEST = rmse(best);

  const springs = el('g', { class: 'lf-line' }, b.g);
  P.forEach(([x, y]) => el('circle', { class: 'lf-dot', cx: sx(x), cy: sy(y), r: 1 }, b.g));
  const rod = el('g', { class: 'lf-hot' }, b.g);
  const rodLine = el('line', { class: 'lf-line lf-strong' }, rod);
  const pivot = el('circle', { class: 'lf-line lf-strong', cx: sx(xm), cy: sy(ym), r: 1.6 }, rod);
  const ghost = el('line', { class: 'lf-line lf-faint', 'stroke-dasharray': '1.2 1' }, b.g);

  const setR = K.gauge(svg, 146, 34, 'RMSE (g)', 300, 1300, v => Math.round(v) + ' g', 20);
  const setRatio = K.gauge(svg, 146, 56, '× BEST', 1, 3, v => v.toFixed(2) + '×', 8);

  function spring(x1, y1, y2) {
    const n = Math.max(4, Math.round(Math.abs(y2 - y1) / 1.4)), w = 0.9;
    let d = `M${x1.toFixed(2)} ${y1.toFixed(2)}`;
    for (let k = 1; k < n; k++) d += ` L${(x1 + (k % 2 ? w : -w)).toFixed(2)} ${(y1 + (y2 - y1) * k / n).toFixed(2)}`;
    return d + ` L${x1.toFixed(2)} ${y2.toFixed(2)}`;
  }
  const lineAt = (m, x) => ym + m * (x - xm);
  const st = { m: 20 };
  function update() {
    const m = st.m;
    rodLine.setAttribute('x1', sx(170)); rodLine.setAttribute('y1', sy(lineAt(m, 170)));
    rodLine.setAttribute('x2', sx(235)); rodLine.setAttribute('y2', sy(lineAt(m, 235)));
    springs.replaceChildren();
    P.forEach(([x, y]) => el('path', { d: spring(sx(x), sy(y), sy(lineAt(m, x))) }, springs));
    ghost.setAttribute('x1', sx(170)); ghost.setAttribute('y1', sy(lineAt(best, 170)));
    ghost.setAttribute('x2', sx(235)); ghost.setAttribute('y2', sy(lineAt(best, 235)));
    const r = rmse(m);
    setR(r); setRatio(r / RBEST);
    const at = Math.abs(m - best) < 0.6 ? ' · the least-squares line' : '';
    ctl.calc(`<var>ŷ</var> = ȳ + <var>m</var>(<var>x</var> − x̄) = ${Math.round(ym)} + ${m.toFixed(1)}(<var>x</var> − ${xm.toFixed(1)}) &nbsp;·&nbsp; <var>RMSE</var> = √( Σ (<var>y</var> − <var>ŷ</var>)² ÷ 40 ) = <span class="hot">${Math.round(r)} g</span><br>` +
      `least squares: <var>m</var>* = Σ(<var>x</var> − x̄)(<var>y</var> − ȳ) ÷ Σ(<var>x</var> − x̄)² = <b>${best.toFixed(1)} g/mm</b>, RMSE ${Math.round(RBEST)} g · this line is ${(r / RBEST).toFixed(2)}× worse`);
    ctl.say(`slope ${m.toFixed(1)} g per mm · RMSE ${Math.round(r)} g (best ${Math.round(RBEST)} g at ${best.toFixed(1)} g/mm)${at}`);
  }

  // Let go: the rod swings to rest on the best slope.
  let anim = 0;
  function settle() {
    cancelAnimationFrame(anim);
    if (ctl.still.matches) { st.m = best; return update(); }
    const tick = () => {
      st.m += (best - st.m) * 0.12;
      if (Math.abs(best - st.m) < 0.05) st.m = best; else anim = requestAnimationFrame(tick);
      update();
    };
    anim = requestAnimationFrame(tick);
  }

  const TOUR = [5, 90, 30, null];
  let t = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const s = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
      if (s) { cancelAnimationFrame(anim); st.m = Math.max(-20, Math.min(120, st.m + s)); update(); return true; }
      if (e.key === 'f' || e.key === 'F') { settle(); return true; }
      return false;
    },
    step: () => { t = (t + 1) % TOUR.length; if (TOUR[t] === null) settle(); else { cancelAnimationFrame(anim); st.m = TOUR[t]; update(); } },
    every: 2400
  });
  // Turn the rod by pointing: it passes through the pivot and the pointer.
  svg.addEventListener('pointermove', e => {
    const [x, y] = b.toFace(e);
    if (x < 16 || x > 126 || y < 8 || y > 77) return;
    const dx = sx.inv(x) - xm;
    if (Math.abs(dx) < 4) return;
    cancelAnimationFrame(anim);
    st.m = Math.max(-20, Math.min(120, (sy.inv(y) - ym) / dx)); update();
  });
  svg.addEventListener('pointerleave', () => { if (!ctl.still.matches) settle(); });
  // Parts, in the entry's order; the slope by hand.
  K.parts(root, svg, [b.el, pivot, rodLine, springs, [setR.el, setRatio.el]]);
  ctl.after = K.panel(root, [
    { label: 'Slope', type: 'range', min: -20, max: 120, step: 0.5, get: () => st.m, set: v => { cancelAnimationFrame(anim); st.m = v; update(); }, fmt: v => v.toFixed(1) + ' g/mm' },
    { label: 'Try', type: 'seg', options: [[0, 'flat'], [90, 'steep'], ['best', 'let it settle (F)']],
      get: () => Math.abs(st.m - best) < 0.05 ? 'best' : st.m, set: v => { if (v === 'best') settle(); else { cancelAnimationFrame(anim); st.m = v; update(); } } }
  ]);
  update();
  K.fit(svg);
})();
