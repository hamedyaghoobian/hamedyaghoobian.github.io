// CSI 330 · Week 6 · Classification metrics. A logistic regression gives
// each of 517 held-out NHANES participants a probability of diabetes from
// their glucose level. The board lines them up by that probability, the ones
// who have diabetes on the top row and the ones who don't below. Slide the
// threshold: everyone to its right is predicted "yes" (filled). Four trays
// under the board count the confusion matrix — true positives, false negatives,
// false positives, true negatives — and three gauges read accuracy,
// precision and recall. Moving the threshold trades one error for the other.
// Drawn flat, in front elevation: each tray in section, its stack rising
// with its count, so the four read as a bar chart (csi330-kit.js).

(function () {
  const root = document.getElementById('w6-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const K = window.CSIKit, D = window.CSI330.w6, S = D.scores, el = K.el;

  const svg = K.svg(root,
    'A board lining up 517 people by their predicted probability of diabetes, those with diabetes on the top row; a threshold divides predicted yes from no. Four trays count true and false positives and negatives, and three gauges read accuracy, precision and recall.');

  const G = 100, F = K.stage(svg);                    // G: the plinth's top
  K.bench(F, -6, 208, G);
  K.plate(F, `NHANES · ${D.n} HELD-OUT PEOPLE · LOGISTIC REGRESSION ON GLUCOSE`, 4, G);

  // The board stands high on its posts; the trays sit on the plinth under it.
  const b = K.board(F, 0, 4, 132, 62, G);
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

  // The trays: the confusion matrix's four cells in a row on the plinth,
  // paired by the truth (actual yes: TP, FN · actual no: FP, TN), each drawn
  // in section with a stack that rises with its count. Each cell's count and
  // name are printed on the plinth's face under its tray.
  const TRAY = [
    { key: 'TP', name: 'true positive', x: 14 }, { key: 'FN', name: 'false negative', x: 36 },
    { key: 'FP', name: 'false positive', x: 62 }, { key: 'TN', name: 'true negative', x: 84 }
  ];
  const TG = el('g', {}, F);                        // the trays, to name as a part
  TRAY.forEach(t => {
    t.g = el('g', {}, TG);
    const x = t.x, w = 18;
    el('path', { class: 'lf-solid', d: `M${x} ${G - 3.5} L${x} ${G} L${x + w} ${G} L${x + w} ${G - 3.5} L${x + w - 1} ${G - 3.5} L${x + w - 1} ${G - 1.2} L${x + 1} ${G - 1.2} L${x + 1} ${G - 3.5} Z` }, TG);
    t.count = el('text', { x: x + w / 2, y: G + 3.4, 'font-size': 2.4, 'text-anchor': 'middle' }, TG);
    el('text', { x: x + w / 2, y: G + 5.9, 'font-size': 1.7, 'text-anchor': 'middle' }, TG).textContent = t.name;
  });
  // the truth each pair shares, printed under the counts
  el('path', { class: 'lf-line lf-faint', d: `M14 ${G + 7.2} L54 ${G + 7.2} M62 ${G + 7.2} L102 ${G + 7.2}` }, TG);
  el('text', { x: 34, y: G + 9.9, 'font-size': 2, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, TG).textContent = 'ACTUAL YES';
  el('text', { x: 82, y: G + 9.9, 'font-size': 2, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, TG).textContent = 'ACTUAL NO';

  const gA = K.gauge(F, 140, 62, 'ACCURACY', 0, 1, undefined, G);
  const gP = K.gauge(F, 162, 62, 'PRECISION', 0, 1, undefined, G);
  const gR = K.gauge(F, 184, 62, 'RECALL', 0, 1, undefined, G);

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
      const h = 0.6 + 20 * c[t.key] / MAX, err = t.key[0] === 'F';
      const g = el('g', { class: err ? 'lf-hot' : '' }, t.g);
      el('rect', { class: 'lf-solid', x: t.x + 3, y: G - 1.2 - h, width: 12, height: h }, g);
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
  // Parts, in the entry's order; the threshold by hand.
  K.parts(root, svg, [b.el, blade, TG, [gA.el, gP.el, gR.el]]);
  ctl.after = K.panel(root, [
    { label: 'Threshold', type: 'range', min: 0.01, max: 0.99, step: 0.01, get: () => st.t, set: v => { st.t = v; update(); }, fmt: v => v.toFixed(2) },
    { label: 'Try', type: 'seg', options: [0.1, 0.2, 0.3, 0.5, 0.7].map(T => [T, String(T)]), get: () => st.t, set: v => { st.t = v; update(); } }
  ]);
  update();
  K.fit(svg);
})();
