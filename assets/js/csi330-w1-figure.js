// CSI 330 · Week 1 · Bias and variance. A board shows forty points from a
// noisy curve: twenty to train on (filled) and twenty held back to test
// (rings). A selector on the bench sets the polynomial's degree, 1 to 12;
// the fitted curve redraws as a lit wire, two gauges read the training and
// test error (RMSE), and a small board behind traces both against degree —
// the training error only falls, the test error falls and then climbs.
// Simulated data; the fits are scikit-learn's (scripts/csi330_data.py).

(function () {
  const root = document.getElementById('w1-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, D = window.CSI330.w1;

  const svg = makeSvg(root, '0 0 100 100',
    'A board with forty points from a noisy curve and a fitted polynomial; a selector sets its degree from 1 to 12, two gauges read training and test error, and a small board traces both errors against degree.');

  K.bench(svg, -6, -4, 196, 62);
  K.plate(svg, 'SIMULATED · 20 TO TRAIN · 20 TO TEST', 4, 62);

  // The error-against-degree board, behind the gauges.
  // clear of the main board's top corner, which would otherwise cover its left edge
  const small = K.board(svg, 142, 192, 8, 32, 66);
  const ex = K.scale(1, 12, 10, 46), ey = K.scale(0.2, 0.7, 23, 4);
  K.axes(small.g, ex, ey, [1, 4, 8, 12], [0.2, 0.7], 'degree', 'RMSE', 2);
  const clip = v => Math.min(0.7, v);
  const line = key => D.fits.map((f, i) => `${i ? 'L' : 'M'}${ex(f.deg).toFixed(2)} ${ey(clip(f[key])).toFixed(2)}`).join(' ');
  el('path', { class: 'lf-line', d: line('train') }, small.g);
  el('path', { class: 'lf-line', d: line('test'), 'stroke-dasharray': '1.4 1' }, small.g);
  // name each line where the two run apart, clear of the marker's usual stops
  el('text', { x: ex(6), y: ey(D.fits[5].train) + 2.6, 'font-size': 1.9, 'text-anchor': 'middle' }, small.g).textContent = 'train';
  el('text', { x: ex(6), y: ey(D.fits[5].test) - 1.4, 'font-size': 1.9, 'text-anchor': 'middle' }, small.g).textContent = 'test';
  const mark = el('g', { class: 'lf-hot' }, small.g);
  const markLine = el('line', { class: 'lf-line', y1: 4, y2: 23 }, mark);

  // The main board and its plot.
  const b = K.board(svg, 0, 120, 24, 6, 88);
  const sx = K.scale(0, 1, 14, 112), sy = K.scale(-1.8, 1.8, 71, 6);
  K.axes(b.g, sx, sy, [0, 0.5, 1], [-1.5, 0, 1.5], 'x', 'y');
  D.x.forEach((x, i) => {
    const cx = sx(x), cy = sy(D.y[i]);
    el('circle', { class: D.train[i] ? 'lf-dot' : 'lf-line', cx, cy, r: 1.2 }, b.g);
  });
  // key, top-left, where the curve has not yet risen
  el('circle', { class: 'lf-dot', cx: 18, cy: 9.2, r: 1.1 }, b.g);
  el('text', { x: 20, y: 10.1, 'font-size': 2.6 }, b.g).textContent = 'train';
  el('circle', { class: 'lf-line', cx: 31, cy: 9.2, r: 1.1 }, b.g);
  el('text', { x: 33, y: 10.1, 'font-size': 2.6 }, b.g).textContent = 'test';
  const wire = el('path', { class: 'lf-line lf-strong lf-hot' }, b.g);

  const setTrain = K.gauge(svg, 138, 42, 'TRAIN RMSE', 0, 0.7);
  const setTest = K.gauge(svg, 164, 42, 'TEST RMSE', 0, 0.7, v => v > 0.7 ? v.toFixed(1) + '!' : v.toFixed(2));
  const sel = K.selector(svg, 22, 46, D.fits.map(f => f.deg), 'DEGREE');

  let i = 0;
  const verdict = d => d <= 2 ? 'too simple: misses the curve (bias)' : d <= 9 ? 'about right' : 'chases the noise (variance)';
  const ctl = K.controls(root, svg, {
    keys: e => {
      const s = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (!s) return false;
      set(Math.max(0, Math.min(11, i + s))); return true;
    },
    step: () => set((i + 1) % 12)
  });
  function set(k) {
    i = k;
    const f = D.fits[i];
    wire.setAttribute('d', f.curve.map((y, j) => `${j ? 'L' : 'M'}${sx(D.grid[j]).toFixed(2)} ${sy(y).toFixed(2)}`).join(' '));
    sel.set(i);
    setTrain(f.train); setTest(f.test);
    markLine.setAttribute('x1', ex(f.deg)); markLine.setAttribute('x2', ex(f.deg));
    const why = f.deg <= 2 ? 'both errors high: the curve is too stiff to follow the data — <b>bias</b>'
      : f.deg <= 9 ? `test error near its lowest (${Math.min(...D.fits.map(g => g.test)).toFixed(3)}, at degree 5)`
      : 'training error still falls, test error leaps: it is memorising the noise — <b>variance</b>';
    ctl.calc(`<var>RMSE</var> = √( Σ (<var>y</var> − <var>ŷ</var>)² ÷ <var>n</var> ) &nbsp;·&nbsp; train <b>${f.train.toFixed(3)}</b> on the 20 points it fitted · test <span class="hot">${f.test.toFixed(3)}</span> on the 20 it never saw<br>gap ${(f.test - f.train).toFixed(3)} · ${why}`);
    ctl.say(`degree ${f.deg} · train ${f.train.toFixed(2)} · test ${f.test.toFixed(2)} · ${verdict(f.deg)}`);
  }
  svg.addEventListener('pointerdown', e => { const k = sel.pick(e); if (k >= 0) set(k); });
  svg.addEventListener('pointermove', e => { if (e.buttons) { const k = sel.pick(e); if (k >= 0) set(k); } });
  set(2);
  K.fit(svg);
})();
