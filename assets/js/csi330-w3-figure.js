// CSI 330 · Week 3 · Gaussian naive Bayes. A board draws each species'
// bell curve for bill length; a marker picks a length. Beside it, three
// spring scales: each pan carries a block whose footprint is the species'
// prior and whose height is its curve's height at that length, so the block
// weighs prior × likelihood and the spring stretches with it. The heaviest
// pan is the prediction; the tape along the front is the posterior (each
// weight over the total). P switches between the data's priors and equal
// ones. Means, spreads and priors are GaussianNB's own, fitted on the 342
// birds, so 50 mm gives Gentoo 0.60 (data priors) or Chinstrap 0.55 (equal).

(function () {
  const root = document.getElementById('w3-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, box, cylinder, face, onNear, onTop, iso, pts, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, NB = window.CSI330.w3;
  const SP = ['Adelie', 'Chinstrap', 'Gentoo'];
  const pdf = (x, s) => Math.exp(-0.5 * ((x - NB[s].mu) / NB[s].sd) ** 2) / (NB[s].sd * Math.sqrt(2 * Math.PI));

  const svg = makeSvg(root, '0 0 100 100',
    'A board with three bell curves for penguin bill length and a marker; beside it three spring scales whose pans carry blocks sized by prior and likelihood, and a posterior tape along the front.');

  K.bench(svg, -6, -4, 196, 66);

  // The curves board.
  const b = K.board(svg, 0, 100, 22, 8, 74);
  const sx = K.scale(32, 60, 12, 94), HMAX = Math.max(...SP.map(s => pdf(NB[s].mu, s)));
  const sy = K.scale(0, HMAX * 1.08, 56, 6);
  K.axes(b.g, sx, sy, [35, 40, 45, 50, 55, 60], [0], 'bill length (mm)', 'likelihood', 2.6);
  const DASH = ['', '2 1', '0.6 1'];
  SP.forEach((s, i) => {
    let d = '';
    for (let x = 32; x <= 60.01; x += 0.25) d += `${d ? 'L' : 'M'}${sx(x).toFixed(2)} ${sy(pdf(x, s)).toFixed(2)}`;
    el('path', { class: 'lf-line', d, 'stroke-dasharray': DASH[i] }, b.g);
    // Chinstrap's and Gentoo's peaks almost touch: set their names to either side
    const side = { Adelie: ['middle', 0], Chinstrap: ['start', 1.2], Gentoo: ['end', -1.2] }[s];
    el('text', { x: sx(NB[s].mu) + side[1], y: sy(pdf(NB[s].mu, s)) - 1.4, 'font-size': 2.4, 'text-anchor': side[0] }, b.g).textContent = s;
  });
  const marker = el('g', { class: 'lf-hot' }, b.g);
  const mline = el('line', { class: 'lf-line lf-strong', y1: 6, y2: 56 }, marker);
  const mdots = SP.map(() => el('circle', { class: 'lf-line lf-strong', r: 1 }, marker));

  // The frame of the scales: a crossbar on two posts; the scales hang in a
  // group redrawn on every change; the near post goes in front of them.
  const XS = [124, 150, 176], V = 30, BAR = 78;
  const SG = el('g', {}, svg);                      // the scales, to name as a part
  cylinder(SG, 'lf-solid lf-shaded').set(188, V, 0, BAR, 2);
  box(SG, 'lf-solid lf-shaded').set(106, V - 2, BAR, 190, V + 2, BAR + 4);
  const hang = el('g', {}, SG);
  cylinder(SG, 'lf-solid lf-shaded').set(108, V, 0, BAR, 2);

  // The posterior tape, the priors switch.
  const TG = el('g', {}, svg);
  box(TG, 'lf-solid lf-shaded').set(108, 53, 0, 190, 61, 2);
  const tape = el('g', {}, TG);
  const sw = el('g', { style: 'cursor:pointer' }, svg);
  // wide enough for its longest label, EQUAL PRIORS, with room either side
  box(sw, 'lf-solid lf-shaded').set(20, 40, 0, 58, 50, 2.4);
  const swText = el('text', { x: 19, y: 6.3, 'font-size': 2.8, 'text-anchor': 'middle', 'letter-spacing': 0.25 }, face(sw, onTop(20, 40, 2.4)));

  const grid = []; for (let x = 32; x <= 60; x += 0.5) grid.push(x);
  const WMAX = Math.max(...SP.flatMap(s => grid.flatMap(x => [NB[s].prior, 1 / 3].map(p => p * pdf(x, s)))));

  const st = { x: 50, equal: false };
  function update() {
    const pri = SP.map(s => st.equal ? 1 / 3 : NB[s].prior);
    const like = SP.map(s => pdf(st.x, s));
    const w = like.map((l, i) => l * pri[i]), tot = w.reduce((a, c) => a + c, 0), post = w.map(v => v / tot);
    const win = post.indexOf(Math.max(...post));

    mline.setAttribute('x1', sx(st.x)); mline.setAttribute('x2', sx(st.x));
    mdots.forEach((d, i) => { d.setAttribute('cx', sx(st.x)); d.setAttribute('cy', sy(like[i])); });

    hang.replaceChildren();
    for (let i = SP.length - 1; i >= 0; i--) {             // farthest scale first
      const cx = XS[i], g = el('g', { class: i === win ? 'lf-hot' : '' }, hang);
      const pan = 30 - 18 * w[i] / WMAX;                     // pan top: lower when heavier
      const bw = 20 * pri[i], bh = 16 * like[i] / HMAX;      // footprint ∝ prior, height ∝ likelihood
      const hook = pan + 22;
      let d = `M${pts([iso(cx, V, BAR)])}`;
      for (let k = 1; k <= 12; k++) {
        const [x, y] = iso(cx + (k % 2 ? 1.6 : -1.6), V, BAR - (BAR - hook - 3) * k / 12);
        d += ` L${x.toFixed(2)},${y.toFixed(2)}`;
      }
      d += ` L${pts([iso(cx, V, hook)])}`;
      el('path', { class: 'lf-line' + (i === win ? ' lf-strong' : '') }, g).setAttribute('d', d);
      el('path', { class: 'lf-line', d: `M${pts([iso(cx - 9, V, pan)])} L${pts([iso(cx, V, hook)])} L${pts([iso(cx + 9, V, pan)])}` }, g);
      box(g, 'lf-solid lf-shaded').set(cx - 10, V - 7, pan - 1.5, cx + 10, V + 7, pan);
      box(g, 'lf-solid lf-shaded').set(cx - bw / 2, V - 5, pan, cx + bw / 2, V + 5, pan + Math.max(bh, 0.4));
      el('text', { x: 10, y: 1.25, 'font-size': 1.4, 'text-anchor': 'middle', 'letter-spacing': 0.1 }, face(g, onNear(cx - 10, V + 7, pan))).textContent = SP[i].toUpperCase();
    }

    tape.replaceChildren();
    let u = 110;
    post.forEach((p, i) => {
      const len = 78 * p;
      if (len < 0.3) return;
      const g = el('g', { class: i === win ? 'lf-hot' : '' }, tape);
      box(g, 'lf-solid lf-shaded').set(u, 54, 2, u + len, 60, 5.2);
      if (len > 18) el('text', { x: len / 2, y: 2.3, 'font-size': 2.2, 'text-anchor': 'middle' }, face(g, onNear(u, 60, 5.2))).textContent = `${SP[i].toLowerCase()} ${p.toFixed(2)}`;
      u += len;
    });
    swText.textContent = st.equal ? 'EQUAL PRIORS' : 'DATA PRIORS';
    const f4 = v => v < 0.0001 ? v.toExponential(1) : v.toFixed(4);
    ctl.calc(`<var>P</var>(species | ${st.x.toFixed(1)} mm) = prior × likelihood ÷ Σ<br>` +
      SP.map((s, i) => `${s.padEnd(9, '\u00a0')} ${pri[i].toFixed(3)} × ${f4(like[i])} = ${f4(w[i])} → ${i === win ? `<span class="hot">${post[i].toFixed(2)}</span>` : post[i].toFixed(2)}`).join('<br>') +
      `<br>Σ = ${f4(tot)}; each weight ÷ Σ is its posterior`);
    ctl.say(`bill ${st.x.toFixed(1)} mm · ${st.equal ? 'equal priors' : 'priors from the data'} · ` +
      SP.map((s, i) => `${s} ${post[i].toFixed(2)}`).join(' · ') + ` → ${SP[win]}`);
  }

  const TOUR = [[42, false], [42, true], [50, false], [50, true], [56, false], [56, true]];
  let t = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const s = { ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5 }[e.key];
      if (s) { st.x = Math.min(60, Math.max(32, st.x + s)); update(); return true; }
      if (e.key === 'p' || e.key === 'P') { st.equal = !st.equal; update(); return true; }
      return false;
    },
    step: () => { t = (t + 1) % TOUR.length; [st.x, st.equal] = TOUR[t]; update(); },
    every: 2200
  });
  svg.addEventListener('pointermove', e => {
    const [x, y] = b.toFace(e);
    if (x < 12 || x > 94 || y < 4 || y > 60) return;
    st.x = Math.round(sx.inv(x) * 2) / 2; update();
  });
  svg.addEventListener('pointerdown', e => { if (sw.contains(e.target)) { st.equal = !st.equal; update(); } });
  // Parts, in the entry's order; the length and the priors by hand.
  K.parts(root, svg, [b.el, marker, SG, sw, TG]);
  ctl.after = K.panel(root, [
    { label: 'Bill', type: 'range', min: 32, max: 60, step: 0.5, get: () => st.x, set: v => { st.x = v; update(); }, fmt: v => v.toFixed(1) + ' mm' },
    { label: 'Weigh', type: 'seg', options: [[42, '42'], [50, '50'], [56, '56 mm']], get: () => st.x, set: v => { st.x = v; update(); } },
    { label: 'Priors', type: 'seg', options: [[false, 'from the data'], [true, 'equal']], get: () => st.equal, set: v => { st.equal = v; update(); } }
  ]);
  update();
  K.fit(svg);
})();
