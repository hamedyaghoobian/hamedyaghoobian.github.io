// CSI 330 · Week 2 · k-nearest neighbours. A board plots all 342 penguins
// by bill length and depth (circle Adelie, triangle Chinstrap, square
// Gentoo). Move the query bird over the board: threads run to its k nearest
// neighbours and three tubes on the bench fill with their votes; the fullest
// tube is the prediction. A selector sets k; a switch measures distance in
// raw millimetres or in standardised units (what StandardScaler does), and
// the neighbours change — units decide who counts as near.

(function () {
  const root = document.getElementById('w2-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, box, cylinder, face, onTop, onNear, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, D = window.CSI330.w2;
  const SP = D.species, B = D.birds;

  const svg = makeSvg(root, '0 0 100 100',
    'A board plotting 342 penguins by bill length and bill depth. A query bird moves over the board; threads run to its k nearest neighbours and three tubes fill with their votes. A selector sets k and a switch chooses raw or standardised distance.');

  K.bench(svg, -6, -4, 190, 66);
  K.plate(svg, 'PALMER PENGUINS · 342 BIRDS · BILL LENGTH × BILL DEPTH', 4, 66);

  const b = K.board(svg, 0, 132, 24, 6, 96);
  const sx = K.scale(32, 60, 16, 126), sy = K.scale(13, 22, 77, 8);
  K.axes(b.g, sx, sy, [35, 40, 45, 50, 55, 60], [14, 16, 18, 20, 22], 'bill length (mm)', 'bill depth (mm)', 2.8);

  const glyph = (s, x, y, g) => s === 0 ? el('circle', { cx: x, cy: y, r: 1.1 }, g)
    : s === 1 ? el('path', { d: `M${x} ${y - 1.4} L${x + 1.3} ${y + 0.9} L${x - 1.3} ${y + 0.9} Z` }, g)
    : el('rect', { x: x - 1, y: y - 1, width: 2, height: 2 }, g);
  const dots = B.map(([a, d, s]) => glyph(s, sx(a), sy(d), el('g', { class: 'lf-line lf-faint' }, b.g)));
  // the key, bottom-left: short, deep-billed birds don't exist, so it's empty
  SP.forEach((name, s) => {
    const g = el('g', { class: 'lf-line' }, b.g);
    glyph(s, 20, 62 + s * 4.4, g);
    el('text', { x: 23, y: 63.1 + s * 4.4, 'font-size': 2.8 }, b.g).textContent = name;
  });
  const threads = el('path', { class: 'lf-line lf-hot' }, b.g);
  const ellipse = el('ellipse', { class: 'lf-line lf-hot', 'stroke-dasharray': '1 1' }, b.g);
  const cross = el('g', { class: 'lf-hot' }, b.g);
  el('path', { class: 'lf-line lf-strong', d: 'M-3 0 L3 0 M0 -3 L0 3' }, cross);
  el('circle', { class: 'lf-line lf-strong', r: 1.6 }, cross);

  // Three vote tubes on the bench, the k selector, the units switch.
  const TU = [146, 160, 174], TV = 34;
  const tubes = TU.map((u, s) => {
    box(svg, 'lf-solid lf-shaded').set(u - 5, TV - 5, 0, u + 5, TV + 5, 2);
    const fill = cylinder(el('g', {}, svg), 'lf-solid lf-shaded');
    const glass = cylinder(svg, 'lf-solid');
    glass.querySelectorAll('path, ellipse').forEach(n => { n.style.fill = 'none'; });
    // the species printed on the front of its tube's stand
    const lab = face(svg, onNear(u - 5, TV + 5, 2));
    el('text', { x: 5, y: 1.55, 'font-size': 1.5, 'text-anchor': 'middle', 'letter-spacing': 0.1 }, lab).textContent = SP[s].toUpperCase();
    glass.set(u, TV, 2, 30, 3.4);
    return { fill, wrap: fill.parentNode };
  });
  const KS = [1, 3, 5, 7, 9, 15, 25];
  const sel = K.selector(svg, 22, 48, KS, 'K NEIGHBOURS');
  const sw = el('g', { style: 'cursor:pointer' }, svg);
  box(sw, 'lf-solid lf-shaded').set(148, 50, 0, 180, 58, 2.4);
  const swTop = face(sw, onTop(148, 50, 2.4));
  const swText = el('text', { x: 16, y: 5.3, 'font-size': 2.6, 'text-anchor': 'middle', 'letter-spacing': 0.3 }, swTop);

  // Standardising: each feature minus its mean, over its spread (as StandardScaler).
  const m = [0, 1].map(j => K.mean(B.map(r => r[j])));
  const sd = [0, 1].map(j => Math.sqrt(K.mean(B.map(r => (r[j] - m[j]) ** 2))));

  const st = { q: [45, 17], k: 2, scaled: true };
  function update() {
    const [qa, qd] = st.q, k = KS[st.k];
    const dist = r => st.scaled ? Math.hypot((r[0] - qa) / sd[0], (r[1] - qd) / sd[1]) : Math.hypot(r[0] - qa, r[1] - qd);
    const order = B.map((r, i) => [dist(r), i]).sort((x, y) => x[0] - y[0]).slice(0, k).map(p => p[1]);
    const near = new Set(order);
    dots.forEach((d, i) => d.parentNode.setAttribute('class', near.has(i) ? 'lf-line lf-hot' : 'lf-line lf-faint'));
    const qx = sx(qa), qy = sy(qd);
    cross.setAttribute('transform', `translate(${qx.toFixed(2)} ${qy.toFixed(2)})`);
    threads.setAttribute('d', order.map(i => `M${qx.toFixed(2)} ${qy.toFixed(2)} L${sx(B[i][0]).toFixed(2)} ${sy(B[i][1]).toFixed(2)}`).join(' '));
    // the reach of the k-th neighbour: a circle in raw mm, an ellipse once standardised
    const far = B[order[order.length - 1]], rr = dist(far);
    const ux = st.scaled ? sd[0] : 1, uy = st.scaled ? sd[1] : 1;
    ellipse.setAttribute('rx', Math.abs(sx(qa + rr * ux) - qx).toFixed(2));
    ellipse.setAttribute('ry', Math.abs(sy(qd + rr * uy) - qy).toFixed(2));
    ellipse.setAttribute('cx', qx); ellipse.setAttribute('cy', qy);
    const votes = [0, 0, 0]; order.forEach(i => votes[B[i][2]]++);
    // ties go to the nearest neighbour's class, as scikit-learn's do in practice
    const top = Math.max(...votes);
    const win = votes.filter(v => v === top).length > 1 ? B[order.find(i => votes[B[i][2]] === top)][2] : votes.indexOf(top);
    tubes.forEach((t, s) => {
      t.fill.set(TU[s], TV, 2, 2 + 28 * votes[s] / k, 3);
      t.wrap.setAttribute('class', s === win ? 'lf-hot' : '');
    });
    sel.set(st.k);
    swText.textContent = st.scaled ? 'STANDARDISED' : 'RAW MM';
    const rule = st.scaled
      ? `<var>d</var> = √( (Δlength ÷ ${sd[0].toFixed(2)})² + (Δdepth ÷ ${sd[1].toFixed(2)})² ) &nbsp;— each difference in standard deviations`
      : '<var>d</var> = √( Δlength² + Δdepth² ) &nbsp;— in millimetres, so a 1 mm change in length counts as much as 1 mm in depth';
    ctl.calc(`${rule}<br>the ${k} nearest vote: ${SP.map((s, i) => `${s} <b>${votes[i]}</b>`).join(' · ')} → <span class="hot">${SP[win]}</span> (${votes[win]} of ${k})`);
    ctl.say(`bill ${qa.toFixed(1)} × ${qd.toFixed(1)} mm · k ${k} · ${st.scaled ? 'standardised' : 'raw mm'} · votes ${votes.join('/')} → ${SP[win]}`);
  }

  const TOUR = [[38, 18.5], [46, 18.5], [50, 19], [47, 15], [44, 16.5], [53, 17], [42, 20]];
  let tourAt = 0;
  const ctl = K.controls(root, svg, {
    keys: e => {
      const mv = { ArrowRight: [0.5, 0], ArrowLeft: [-0.5, 0], ArrowUp: [0, 0.25], ArrowDown: [0, -0.25] }[e.key];
      if (mv) { st.q = [Math.min(60, Math.max(32, st.q[0] + mv[0])), Math.min(22, Math.max(13, st.q[1] + mv[1]))]; update(); return true; }
      if (e.key === 'k' || e.key === 'K') { st.k = (st.k + 1) % KS.length; update(); return true; }
      if (e.key === 's' || e.key === 'S') { st.scaled = !st.scaled; update(); return true; }
      return false;
    },
    step: () => { tourAt = (tourAt + 1) % (TOUR.length + 1); if (tourAt === TOUR.length) st.scaled = !st.scaled; else st.q = TOUR[tourAt]; update(); },
    every: 1800
  });
  svg.addEventListener('pointermove', e => {
    if (e.buttons && sel.pick(e) >= 0) return;
    const [x, y] = b.toFace(e);
    if (x < 16 || x > 126 || y < 8 || y > 77) return;
    st.q = [sx.inv(x), sy.inv(y)]; update();
  });
  svg.addEventListener('pointerdown', e => {
    const k = sel.pick(e);
    if (k >= 0) { st.k = k; update(); return; }
    if (e.target.closest('g') === sw || sw.contains(e.target)) { st.scaled = !st.scaled; update(); }
  });
  update();
  K.fit(svg);
})();
