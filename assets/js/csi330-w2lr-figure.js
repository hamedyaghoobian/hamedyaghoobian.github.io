// CSI 330 · Week 2 · Logistic regression (Lecture 2.2). Every penguin on a
// board by bill length, Adelie on the top row (1) and the rest on the
// bottom (0), with the model's S-curve, P(Adelie) = σ(w₀ + w₁x). Point at a
// bill length: the curve gives the probability, and the squash dial beside
// the board shows the two steps — the needle stands at z on an even scale of
// log-odds, and the same needle reads p on the squeezed scale inside it.
// ↑ ↓ change the steepness w₁, [ ] slide the curve (w₀), F lets the model
// fit itself again, T moves the threshold. A gauge reads the log loss over
// all 342 birds: the fitted weights are the ones that make it smallest.
// Weights are scikit-learn's, unregularised, as in the lecture: z = 51.11 − 1.192x.

(function () {
  const root = document.getElementById('w2lr-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, box, cylinder, face, onNear, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, B = window.CSI330.w2.birds, FIT = window.CSI330.w2lr;
  const Y = B.map(b => (b[2] === 0 ? 1 : 0));               // Adelie = 1

  const svg = makeSvg(root, '0 0 100 100',
    'A board plotting all 342 penguins by bill length, Adelie on the top row and the rest below, with an S-curve for the probability of Adelie; beside it a dial whose needle shows z on a log-odds scale and the probability on a squeezed scale, and a log-loss gauge.');

  K.bench(svg, -6, -4, 206, 64);
  K.plate(svg, 'PALMER PENGUINS · 342 BIRDS · P(ADELIE) FROM BILL LENGTH', 4, 64);

  const b = K.board(svg, 0, 132, 24, 6, 96);
  const sx = K.scale(32, 60, 16, 126), sy = K.scale(-0.12, 1.12, 77, 8);
  K.axes(b.g, sx, sy, [35, 40, 45, 50, 55, 60], [0, 0.5, 1], 'bill length (mm)', 'P(Adelie)', 2.8);
  el('text', { x: 125, y: sy(1) - 2.4, 'font-size': 2.4, 'text-anchor': 'end' }, b.g).textContent = 'Adelie = 1';
  el('text', { x: 125, y: sy(0) + 4.2, 'font-size': 2.4, 'text-anchor': 'end' }, b.g).textContent = 'Chinstrap or Gentoo = 0';
  const jit = i => (((i * 7919) % 97) / 97 - 0.5) * 0.09;
  B.forEach((r, i) => el('circle', { class: 'lf-line lf-faint', cx: sx(r[0]), cy: sy(Y[i] + jit(i)), r: 0.8 }, b.g));
  const tline = el('line', { class: 'lf-line lf-faint', 'stroke-dasharray': '1 1' }, b.g);
  const curve = el('path', { class: 'lf-line lf-strong' }, b.g);
  const hot = el('g', { class: 'lf-hot' }, b.g);
  const cut = el('line', { class: 'lf-line', y1: 8, y2: 77, 'stroke-dasharray': '1.4 1' }, hot);
  const cutTxt = el('text', { 'font-size': 2.3, 'text-anchor': 'middle' }, hot);
  const qline = el('line', { class: 'lf-line', y2: 77 }, hot);
  const qdot = el('circle', { class: 'lf-line lf-strong', r: 1.4 }, hot);

  // The squash dial: z from −6 to 6 evenly on the outer scale; inside, the
  // probability each z means, its ticks crowding toward both ends.
  const DU = 142, DV = 36, DH = 22;
  const DG = el('g', {}, svg);                      // the dial, to name as a part
  cylinder(DG, 'lf-solid lf-shaded').set(DU + 17, DV - 2, 0, DH, 1.4);
  box(DG, 'lf-solid lf-shaded').set(DU, DV - 4, DH, DU + 34, DV, DH + 29);
  const f = face(DG, onNear(DU, DV, DH + 29));
  const cx = 17, cy = 16.5, R = 12, ZMAX = 6;
  const ang = z => Math.PI * (1 - (Math.max(-ZMAX, Math.min(ZMAX, z)) + ZMAX) / (2 * ZMAX));
  const at = (z, rr) => [cx + rr * Math.cos(ang(z)), cy - rr * Math.sin(ang(z))];
  el('path', { class: 'lf-line', d: `M${at(-ZMAX, R)} A${R} ${R} 0 0 1 ${at(ZMAX, R)}` }, f);
  el('path', { class: 'lf-line lf-faint', d: `M${at(-ZMAX, R - 4)} A${R - 4} ${R - 4} 0 0 1 ${at(ZMAX, R - 4)}` }, f);
  for (let z = -6; z <= 6; z += 1) {
    const [a, c] = at(z, R), [d, e] = at(z, R + (z % 2 ? 0.8 : 1.4));
    el('line', { class: 'lf-line', x1: a, y1: c, x2: d, y2: e }, f);
    if (z % 3 === 0) { const [tx, ty] = at(z, R + 3); el('text', { x: tx, y: ty + 0.8, 'font-size': 1.9, 'text-anchor': 'middle' }, f).textContent = z; }
  }
  // the inner scale squeezes toward both ends, so only three of its ticks are named
  [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99].forEach(p => {
    const z = Math.log(p / (1 - p)), [a, c] = at(z, R - 4), [d, e] = at(z, R - 5.2);
    el('line', { class: 'lf-line', x1: a, y1: c, x2: d, y2: e }, f);
    if ([0.1, 0.5, 0.9].includes(p)) {
      const [tx, ty] = at(z, R - 7.2);
      el('text', { x: tx, y: ty + 0.7, 'font-size': 1.8, 'text-anchor': 'middle' }, f).textContent = p;
    }
  });
  el('text', { x: 1.4, y: 3, 'font-size': 1.8 }, f).textContent = 'z (log-odds)';
  el('text', { x: 32.6, y: 3, 'font-size': 1.8, 'text-anchor': 'end' }, f).textContent = 'p inside';
  const needle = el('line', { class: 'lf-line lf-strong lf-hot', x1: cx, y1: cy }, f);
  el('circle', { class: 'lf-dot', cx, cy, r: 0.9 }, f);
  const dialTxt = el('text', { class: 'lf-hot', x: cx, y: 22.4, 'font-size': 2.4, 'text-anchor': 'middle' }, f);
  el('text', { x: cx, y: 26.2, 'font-size': 1.8, 'text-anchor': 'middle', 'letter-spacing': 0.2 }, f).textContent = 'THE SQUASH  σ(z)';

  const gLoss = K.gauge(svg, 182, 46, 'LOG LOSS', 0, 0.7, v => v.toFixed(3), 14);

  const sig = z => 1 / (1 + Math.exp(-z));
  const loss = (w0, w1) => -K.mean(B.map((r, i) => {
    const p = Math.min(1 - 1e-12, Math.max(1e-12, sig(w0 + w1 * r[0])));
    return Y[i] ? Math.log(p) : Math.log(1 - p);
  }));
  const BEST = loss(FIT.w0, FIT.w1);
  const TS = [0.5, 0.2, 0.8];
  // The model is held as its steepness w₁ and its midpoint m = −w₀/w₁, so
  // [ ] slide the curve without changing its shape.
  const st = { x: 41, w1: FIT.w1, mid: -FIT.w0 / FIT.w1, t: 0 };
  const w0 = () => -st.w1 * st.mid;

  function update() {
    const W0 = w0(), W1 = st.w1, T = TS[st.t];
    let d = '';
    for (let x = 32; x <= 60.01; x += 0.25) d += `${d ? 'L' : 'M'}${sx(x).toFixed(2)} ${sy(sig(W0 + W1 * x)).toFixed(2)}`;
    curve.setAttribute('d', d);
    const z = W0 + W1 * st.x, p = sig(z);
    qline.setAttribute('x1', sx(st.x)); qline.setAttribute('x2', sx(st.x)); qline.setAttribute('y1', sy(p));
    qdot.setAttribute('cx', sx(st.x)); qdot.setAttribute('cy', sy(p));
    // where the curve crosses the threshold: z = ln(T / (1 − T))
    const xc = (Math.log(T / (1 - T)) - W0) / W1, xcOn = xc >= 32 && xc <= 60;
    cut.style.display = cutTxt.style.display = xcOn ? '' : 'none';
    if (xcOn) {
      cut.setAttribute('x1', sx(xc)); cut.setAttribute('x2', sx(xc));
      cutTxt.setAttribute('x', sx(xc)); cutTxt.setAttribute('y', 6.6);
      cutTxt.textContent = `${xc.toFixed(1)} mm`;
    }
    tline.setAttribute('x1', 16); tline.setAttribute('x2', 126); tline.setAttribute('y1', sy(T)); tline.setAttribute('y2', sy(T));
    const [nx, ny] = at(z, R - 1.2);
    needle.setAttribute('x2', nx.toFixed(2)); needle.setAttribute('y2', ny.toFixed(2));
    dialTxt.textContent = `z ${z.toFixed(2)} → p ${p.toFixed(2)}`;
    const L = loss(W0, W1);
    gLoss(L);
    const call = p >= T ? 'Adelie' : 'not Adelie';
    const fitted = Math.abs(W1 - FIT.w1) < 1e-3 && Math.abs(W0 - FIT.w0) < 0.05;
    ctl.say(`bill ${st.x.toFixed(1)} mm · z ${z.toFixed(2)} · p ${p.toFixed(2)} · threshold ${T} → ${call}${fitted ? ' · fitted weights' : ''}`);
    const sign = v => (v < 0 ? '− ' + Math.abs(v).toFixed(3) : '+ ' + v.toFixed(3));
    ctl.calc(`<var>z</var> = <var>w</var>₀ + <var>w</var>₁<var>x</var> = ${W0.toFixed(2)} ${sign(W1)} × ${st.x.toFixed(1)} = <b>${z.toFixed(2)}</b> &nbsp;·&nbsp; ` +
      `<var>p</var> = 1 ÷ (1 + <var>e</var><sup>−z</sup>) = <span class="hot">${p.toFixed(2)}</span> → ${call} (<var>p</var> ${p >= T ? '≥' : '<'} ${T})<br>` +
      `odds = <var>p</var> ÷ (1 − <var>p</var>) = ${(p / (1 - p)).toFixed(2)} · each extra mm multiplies the odds by <var>e</var><sup>w₁</sup> = ${Math.exp(W1).toFixed(2)} · undecided (<var>p</var> = 0.5) at ${(-W0 / W1).toFixed(1)} mm<br>` +
      `log loss = −mean[ <var>y</var> ln <var>p</var> + (1 − <var>y</var>) ln(1 − <var>p</var>) ] = <b>${L.toFixed(3)}</b> &nbsp;— the fitted weights give the smallest, ${BEST.toFixed(3)}`);
  }

  // F: the curve eases back to the fitted weights.
  let anim = 0;
  function settle() {
    cancelAnimationFrame(anim);
    const goal = { w1: FIT.w1, mid: -FIT.w0 / FIT.w1 };
    if (ctl.still.matches) { Object.assign(st, goal); return update(); }
    const tick = () => {
      st.w1 += (goal.w1 - st.w1) * 0.14; st.mid += (goal.mid - st.mid) * 0.14;
      if (Math.abs(goal.w1 - st.w1) < 0.002 && Math.abs(goal.mid - st.mid) < 0.02) Object.assign(st, goal);
      else anim = requestAnimationFrame(tick);
      update();
    };
    anim = requestAnimationFrame(tick);
  }

  const TOUR = [() => { st.x = 38; }, () => { st.x = 42; }, () => { st.x = 43; }, () => { st.x = 46; },
    () => { st.w1 = -0.3; }, () => { st.w1 = -3; }, () => settle(), () => { st.t = 1; }, () => { st.t = 0; st.x = 41; }];
  let tour = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const mv = { ArrowRight: 0.5, ArrowLeft: -0.5 }[e.key];
      if (mv) { st.x = Math.min(60, Math.max(32, st.x + mv)); update(); return true; }
      const s = { ArrowUp: -0.1, ArrowDown: 0.1 }[e.key];           // up = steeper
      if (s) { cancelAnimationFrame(anim); st.w1 = Math.max(-4, Math.min(1, st.w1 + s)); update(); return true; }
      const sh = { '[': -0.5, ']': 0.5 }[e.key];
      if (sh) { cancelAnimationFrame(anim); st.mid = Math.min(58, Math.max(34, st.mid + sh)); update(); return true; }
      if (e.key === 'f' || e.key === 'F') { settle(); return true; }
      if (e.key === 't' || e.key === 'T') { st.t = (st.t + 1) % TS.length; update(); return true; }
      return false;
    },
    step: () => { TOUR[tour](); tour = (tour + 1) % TOUR.length; update(); },
    every: 2200
  });
  svg.addEventListener('pointermove', e => {
    const [x, y] = b.toFace(e);
    if (x < 16 || x > 126 || y < 4 || y > 77) return;
    st.x = Math.round(sx.inv(x) * 2) / 2; update();
  });
  // Parts, in the entry's order; the weights, the pointer and the threshold by hand.
  K.parts(root, svg, [b.el, curve, DG, [qline, qdot], [cut, cutTxt, tline], gLoss.el]);
  const fitted = () => Math.abs(st.w1 - FIT.w1) < 1e-3 && Math.abs(st.mid + FIT.w0 / FIT.w1) < 0.02;
  ctl.after = K.panel(root, [
    { label: 'Bill', type: 'range', min: 32, max: 60, step: 0.5, get: () => st.x, set: v => { st.x = v; update(); }, fmt: v => v.toFixed(1) + ' mm' },
    { label: 'w₁ steepness', type: 'range', min: -4, max: 1, step: 0.01, get: () => st.w1, set: v => { cancelAnimationFrame(anim); st.w1 = v; update(); }, fmt: v => v.toFixed(2) },
    { label: 'Undecided at', type: 'range', min: 34, max: 58, step: 0.1, get: () => st.mid, set: v => { cancelAnimationFrame(anim); st.mid = v; update(); }, fmt: v => v.toFixed(1) + ' mm' },
    { label: 'Threshold', type: 'seg', options: TS.map((T, i) => [i, String(T)]), get: () => st.t, set: i => { st.t = i; update(); } },
    { label: 'Weights', type: 'seg', options: [[true, 'fitted by scikit-learn (F)']], get: fitted, set: () => settle() }
  ]);
  update();
  K.fit(svg);
})();
