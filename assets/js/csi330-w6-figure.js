// CSI 330 · Week 6 · Classification metrics. A logistic regression gives
// each of 517 held-out NHANES participants a probability of diabetes from
// their glucose level. The board lines them up by that probability, the ones
// who have diabetes on the top row and the ones who don't below. Slide the
// threshold: everyone to its right is predicted "yes" (filled). Four trays
// on the bench count the confusion matrix — true positives, false negatives,
// false positives, true negatives — and three gauges read accuracy,
// precision and recall. Moving the threshold trades one error for the other.

(function () {
  const root = document.getElementById('w6-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, box, face, onNear, onTop, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, D = window.CSI330.w6, S = D.scores;

  const svg = makeSvg(root, '0 0 100 100',
    'A board lining up 517 people by their predicted probability of diabetes, those with diabetes on the top row; a threshold divides predicted yes from no. Four trays count true and false positives and negatives, and three gauges read accuracy, precision and recall.');

  K.bench(svg, -6, -4, 188, 72);
  K.plate(svg, `NHANES · ${D.n} HELD-OUT PEOPLE · LOGISTIC REGRESSION ON GLUCOSE`, 4, 72);

  const b = K.board(svg, 0, 132, 20, 34, 96);
  const sx = K.scale(0, 1, 18, 126);
  K.axes(b.g, sx, K.scale(0, 1, 53, 53), [0, 0.25, 0.5, 0.75, 1], [], 'predicted probability of diabetes', '', 2.6);
  el('text', { x: 16, y: 18, 'font-size': 2.4, 'text-anchor': 'end' }, b.g).textContent = 'has diabetes';
  el('text', { x: 16, y: 42, 'font-size': 2.4, 'text-anchor': 'end' }, b.g).textContent = 'does not';
  el('line', { class: 'lf-line lf-faint', x1: 18, y1: 30, x2: 126, y2: 30 }, b.g);
  // deterministic jitter inside each row
  const jit = i => ((i * 7919) % 97) / 97;
  const dots = S.map(([p, y], i) => el('circle', { cx: sx(p), cy: (y ? 8 : 31) + 2 + jit(i) * 17.5, r: 0.75 }, b.g));
  const blade = el('g', { class: 'lf-hot' }, b.g);
  const bladeLine = el('line', { class: 'lf-line lf-strong', y1: 5, y2: 53 }, blade);
  const bladeTxt = el('text', { y: 4, 'font-size': 2.4, 'text-anchor': 'middle' }, blade);

  // The trays: the confusion matrix's four cells in a row along the bench,
  // paired by the truth (actual yes: TP, FN · actual no: FP, TN). In a row
  // no stack can hide another, as a tall TN would in a 2 × 2 grid. Farthest
  // first; each cell's name and count are printed in front of its tray.
  const TRAY = [
    { key: 'TN', name: 'true negative', u: 84 }, { key: 'FP', name: 'false positive', u: 62 },
    { key: 'FN', name: 'false negative', u: 36 }, { key: 'TP', name: 'true positive', u: 14 }
  ];
  const TV = 40;
  TRAY.forEach(t => {
    box(svg, 'lf-solid lf-shaded').set(t.u, TV, 0, t.u + 18, TV + 14, 1.5);
    t.g = el('g', {}, svg);
    const f = face(svg, onTop(t.u, TV + 15, 0));
    t.count = el('text', { x: 9, y: 3, 'font-size': 2.8, 'text-anchor': 'middle' }, f);
    el('text', { x: 9, y: 5.8, 'font-size': 1.9, 'text-anchor': 'middle' }, f).textContent = t.name;
  });
  // the truth each pair shares, printed in front of the counts
  const pair = face(svg, onTop(14, 62.5, 0));
  el('text', { x: 20, y: 3.4, 'font-size': 2.4, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, pair).textContent = 'ACTUAL YES';
  el('text', { x: 70, y: 3.4, 'font-size': 2.4, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, pair).textContent = 'ACTUAL NO';
  el('path', { class: 'lf-line lf-faint', d: 'M0 0.4 L40 0.4 M48 0.4 L88 0.4' }, pair);

  const gA = K.gauge(svg, 114, 40, 'ACCURACY', 0, 1);
  const gP = K.gauge(svg, 138, 40, 'PRECISION', 0, 1);
  const gR = K.gauge(svg, 162, 40, 'RECALL', 0, 1);

  const st = { t: 0.5 };
  function update() {
    const c = { TP: 0, FN: 0, FP: 0, TN: 0 };
    S.forEach(([p, y], i) => {
      const yes = p >= st.t;
      c[y ? (yes ? 'TP' : 'FN') : (yes ? 'FP' : 'TN')]++;
      dots[i].setAttribute('class', yes ? 'lf-dot' : 'lf-line lf-faint');
    });
    const MAX = Math.max(...Object.values(c), 1);
    TRAY.forEach(t => {
      t.g.replaceChildren();
      const h = 1.5 + 0.6 + 20 * c[t.key] / MAX, err = t.key[0] === 'F';
      const g = el('g', { class: err ? 'lf-hot' : '' }, t.g);
      box(g, 'lf-solid lf-shaded').set(t.u + 3, TV + 3, 1.5, t.u + 15, TV + 11, h);
      t.count.textContent = `${t.key} ${c[t.key]}`;
      t.count.setAttribute('class', err ? 'lf-hot' : '');
    });
    const acc = (c.TP + c.TN) / S.length, prec = c.TP / Math.max(1, c.TP + c.FP), rec = c.TP / Math.max(1, c.TP + c.FN);
    gA(acc); gP(prec); gR(rec);
    bladeLine.setAttribute('x1', sx(st.t)); bladeLine.setAttribute('x2', sx(st.t));
    // the label leans away from the board's edges so it never runs off
    bladeTxt.setAttribute('x', sx(st.t) + (st.t > 0.8 ? -1 : st.t < 0.2 ? 1 : 0));
    bladeTxt.setAttribute('text-anchor', st.t > 0.8 ? 'end' : st.t < 0.2 ? 'start' : 'middle');
    bladeTxt.textContent = `threshold ${st.t.toFixed(2)}`;
    ctl.calc(`accuracy = (TP + TN) ÷ <var>n</var> = (${c.TP} + ${c.TN}) ÷ ${S.length} = <b>${acc.toFixed(2)}</b> &nbsp;— a model that always says “no” scores ${(1 - (c.TP + c.FN) / S.length).toFixed(2)}<br>` +
      `precision = TP ÷ (TP + FP) = ${c.TP} ÷ ${c.TP + c.FP} = <b>${prec.toFixed(2)}</b> &nbsp;— of those flagged, how many have diabetes<br>` +
      `recall = TP ÷ (TP + FN) = ${c.TP} ÷ ${c.TP + c.FN} = <span class="hot">${rec.toFixed(2)}</span> &nbsp;— of those with diabetes, how many were caught`);
    ctl.say(`threshold ${st.t.toFixed(2)} · TP ${c.TP} FN ${c.FN} FP ${c.FP} TN ${c.TN} · accuracy ${acc.toFixed(2)} · precision ${prec.toFixed(2)} · recall ${rec.toFixed(2)}`);
  }

  const TOUR = [0.5, 0.3, 0.15, 0.7, 0.9, 0.5];
  let t = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const s = { ArrowRight: 0.01, ArrowUp: 0.05, ArrowLeft: -0.01, ArrowDown: -0.05 }[e.key];
      if (!s) return false;
      st.t = Math.round(Math.max(0.01, Math.min(0.99, st.t + s)) * 100) / 100; update(); return true;
    },
    step: () => { t = (t + 1) % TOUR.length; st.t = TOUR[t]; update(); },
    every: 2200
  });
  svg.addEventListener('pointermove', e => {
    const [x, y] = b.toFace(e);
    if (x < 18 || x > 126 || y < 2 || y > 58) return;
    st.t = Math.round(Math.max(0.01, Math.min(0.99, sx.inv(x))) * 100) / 100; update();
  });
  update();
  K.fit(svg);
})();
