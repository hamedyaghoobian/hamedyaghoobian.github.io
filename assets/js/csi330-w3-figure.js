// CSI 330 · Week 3 · Gaussian naive Bayes. A board draws each species'
// bell curve for bill length; a marker picks a length. Beside it, three
// spring scales hang from one beam: each pan carries a block whose width is
// the species' prior and whose height is its curve's height at that length,
// so the block's area weighs prior × likelihood and the spring stretches
// with it. The heaviest pan is the prediction; the tape along the plinth is
// the posterior (each
// weight over the total). P switches between the data's priors and equal
// ones. Means, spreads and priors are GaussianNB's own, fitted on the 342
// birds, so 50 mm gives Gentoo 0.60 (data priors) or Chinstrap 0.55 (equal).
// Drawn flat, in front elevation, with the kit (csi330-kit.js). Also on
// /tools/ (tools.md), where it runs without the parts list.

(function () {
  const root = document.getElementById('w3-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const K = window.CSIKit, NB = window.CSI330.w3, el = K.el;
  const SP = ['Adelie', 'Chinstrap', 'Gentoo'];
  const pdf = (x, s) => Math.exp(-0.5 * ((x - NB[s].mu) / NB[s].sd) ** 2) / (NB[s].sd * Math.sqrt(2 * Math.PI));

  const svg = K.svg(root,
    'A board with three bell curves for penguin bill length and a marker; beside it three spring scales whose pans carry blocks sized by prior and likelihood, and a posterior tape along the front.');

  const G = 100, S = K.stage(svg);                    // G: the plinth's top
  K.bench(S, -6, 196, G);

  // The curves board.
  const b = K.board(S, 0, 26, 100, 66, G);
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

  // The frame of the scales: a beam on two posts; the scales hang from it
  // in a group redrawn on every change.
  const XS = [124, 150, 176], BEAM = G - 78;      // the beam's underside
  const SG = el('g', {}, S);                        // the scales, to name as a part
  [108, 188].forEach(x => {
    el('rect', { class: 'lf-solid', x: x - 1.5, y: BEAM, width: 3, height: G - 1.2 - BEAM }, SG);
    el('rect', { class: 'lf-solid', x: x - 3.5, y: G - 1.2, width: 7, height: 1.2 }, SG);
  });
  el('rect', { class: 'lf-solid', x: 104, y: BEAM - 4, width: 88, height: 4, rx: 0.5 }, SG);
  const hang = el('g', {}, SG);

  // The posterior tape and the priors switch, on the plinth's face.
  const TG = el('g', {}, S);
  el('rect', { class: 'lf-line lf-faint', x: 110, y: G + 1.6, width: 78, height: 6.4 }, TG);
  const tape = el('g', {}, TG);
  // wide enough for its longest label, EQUAL PRIORS, with room either side
  const swK = K.toggle(S, 20, G + 1.3, 38, 8.4);
  const sw = swK.el, swText = swK.text;

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
    SP.forEach((s, i) => {
      const cx = XS[i], g = el('g', { class: i === win ? 'lf-hot' : '' }, hang);
      const pan = G - (30 - 18 * w[i] / WMAX);               // the pan's top: lower when heavier
      const bw = 20 * pri[i], bh = 16 * like[i] / HMAX;      // width ∝ prior, height ∝ likelihood
      const hook = pan - 22;
      el('path', { class: 'lf-line' + (i === win ? ' lf-strong' : ''), d: K.spring(cx, BEAM, hook - 3, 1.6, 2.2) + ` L${cx} ${hook}` }, g);
      el('path', { class: 'lf-line', d: `M${cx - 9} ${pan} L${cx} ${hook} L${cx + 9} ${pan}` }, g);
      el('circle', { class: 'lf-line', cx, cy: hook, r: 0.6 }, g);
      el('rect', { class: 'lf-solid', x: cx - 10, y: pan, width: 20, height: 1.5, rx: 0.3 }, g);
      el('rect', { class: 'lf-solid', x: cx - bw / 2, y: pan - Math.max(bh, 0.4), width: bw, height: Math.max(bh, 0.4) }, g);
      el('text', { x: cx, y: pan + 4, 'font-size': 1.8, 'text-anchor': 'middle', 'letter-spacing': 0.15 }, g).textContent = s.toUpperCase();
    });

    tape.replaceChildren();
    let u = 110;
    post.forEach((p, i) => {
      const len = 78 * p;
      if (len < 0.3) return;
      const g = el('g', { class: i === win ? 'lf-hot' : '' }, tape);
      el('rect', { class: 'lf-solid', x: u, y: G + 1.6, width: len, height: 6.4 }, g);
      if (len > 18) el('text', { x: u + len / 2, y: G + 5.6, 'font-size': 2.2, 'text-anchor': 'middle' }, g).textContent = `${SP[i].toLowerCase()} ${p.toFixed(2)}`;
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
