// Shared parts for the CSI 330 study figures (csi-330.md): a bench on
// feet, an upright board whose near face carries an ordinary 2-D plot, dial
// gauges on posts, a selector with detents, and a figure's own controls
// (pointer, keys, an idle tour, the caption). Drawn with the site's line kit
// (line-figure.js) in the manner of Ryan's Anatomy figures (github.com/
// wheresryan22/anatomy, MIT); live parts carry the one glow accent.

window.CSIKit = window.CSIKit || (function () {
  const LF = window.LineFigure;
  const { el, box, cylinder, screw, face, onNear, onTop } = LF;

  // A bench from (u0, v0) to (u1, v1), top at h = 0, on four round feet.
  function bench(svg, u0, v0, u1, v1, t = 5) {
    [[u0 + 4, v0 + 4], [u1 - 4, v0 + 4], [u0 + 4, v1 - 4], [u1 - 4, v1 - 4]].forEach(([u, v]) =>
      cylinder(svg, 'lf-solid lf-shaded').set(u, v, -t - 4, -t, 2));
    box(svg, 'lf-solid lf-shaded').set(u0, v0, -t, u1, v1, 0);
    [[u0 + 3, v0 + 3], [u1 - 3, v0 + 3], [u0 + 3, v1 - 3], [u1 - 3, v1 - 3]].forEach(([u, v]) => screw(svg, u, v, 0));
  }

  // A label printed on the bench's near edge.
  function plate(svg, text, u, v, size = 2.6) {
    const f = face(svg, onNear(u, v, -0.9));
    el('text', { x: 0, y: size, 'font-size': size, 'letter-spacing': 0.35 }, f).textContent = text;
    return f;
  }

  // An upright board standing on the bench along u, its near face at v,
  // from h0 to h1, with two feet. Returns { g, w, h, toFace(e) }: g is a group
  // on the near face (x along u from 0 to w, y down from 0 to h) to draw an
  // ordinary plot into; toFace maps a pointer event into those units.
  function board(svg, u0, u1, v, h0, h1, d = 3) {
    box(svg, 'lf-solid lf-shaded').set(u0 + 4, v - 10, 0, u0 + 10, v + 4, 2);
    box(svg, 'lf-solid lf-shaded').set(u1 - 10, v - 10, 0, u1 - 4, v + 4, 2);
    // a board raised off the bench stands on two posts
    if (h0 > 4) [u1 - 7, u0 + 7].forEach(u => cylinder(svg, 'lf-solid lf-shaded').set(u, v - d / 2, 2, h0, 1.6));
    box(svg, 'lf-solid lf-shaded').set(u0, v - d, h0, u1, v, h1);
    const g = face(svg, onNear(u0, v, h1));
    const w = u1 - u0, h = h1 - h0;
    el('rect', { class: 'lf-line lf-faint', x: 1.5, y: 1.5, width: w - 3, height: h - 3, rx: 1 }, g);
    return {
      g, w, h,
      toFace(e) {
        const p = g.ownerSVGElement.createSVGPoint();
        p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(g.getScreenCTM().inverse());
        return [q.x, q.y];
      }
    };
  }

  // Linear scales for a plot inside a board: data → face units.
  function scale(d0, d1, r0, r1) {
    const f = v => r0 + (v - d0) / (d1 - d0) * (r1 - r0);
    f.inv = x => d0 + (x - r0) / (r1 - r0) * (d1 - d0);
    f.r0 = r0; f.r1 = r1;
    return f;
  }

  // Axes along the plot's bottom and left edges (the ends of the scales'
  // ranges, so no point falls outside them), ticks with labels, the x title
  // centred under the tick labels and the y title turned along its axis.
  function axes(g, sx, sy, xt, yt, xl, yl, fs = 2.4) {
    const x0 = Math.min(sx.r0, sx.r1), x1 = Math.max(sx.r0, sx.r1);
    const y0 = Math.max(sy.r0, sy.r1), y1 = Math.min(sy.r0, sy.r1);
    el('path', { class: 'lf-line', d: `M${x0} ${y0} L${x1} ${y0}` + (yt.length ? ` M${x0} ${y0} L${x0} ${y1}` : '') }, g);
    xt.forEach(t => {
      el('line', { class: 'lf-line', x1: sx(t), y1: y0, x2: sx(t), y2: y0 + 1.2 }, g);
      el('text', { x: sx(t), y: y0 + 1.6 + fs, 'font-size': fs, 'text-anchor': 'middle' }, g).textContent = t;
    });
    yt.forEach(t => {
      el('line', { class: 'lf-line', x1: x0 - 1.2, y1: sy(t), x2: x0, y2: sy(t) }, g);
      el('text', { x: x0 - 1.8, y: sy(t) + fs * 0.35, 'font-size': fs, 'text-anchor': 'end' }, g).textContent = t;
    });
    if (xl) el('text', { x: (x0 + x1) / 2, y: y0 + 2.4 + fs * 2.25, 'font-size': fs, 'text-anchor': 'middle' }, g).textContent = xl;
    if (yl) {
      const widest = Math.max(0, ...yt.map(t => String(t).length)) * fs * 0.56;
      const x = x0 - 2.6 - widest - fs * 0.4, y = (y0 + y1) / 2;
      el('text', { x, y, 'font-size': fs, 'text-anchor': 'middle', transform: `rotate(-90 ${x.toFixed(2)} ${y.toFixed(2)})` }, g).textContent = yl;
    }
  }

  // A dial gauge on a post at (u, v): a half dial on a small panel facing
  // the viewer, from lo to hi. The reading sits under the dial, the name
  // under the reading, clear of the needle's sweep. Returns set(value).
  function gauge(svg, u, v, label, lo, hi, fmt = x => x.toFixed(2), hPost = 16) {
    cylinder(svg, 'lf-solid lf-shaded').set(u + 9, v - 2, 0, hPost, 1.1);
    box(svg, 'lf-solid lf-shaded').set(u, v - 4, hPost, u + 18, v, hPost + 16);
    const f = face(svg, onNear(u, v, hPost + 16));
    const cx = 9, cy = 8.6, R = 6.2, at = (t, rr) => [cx - rr * Math.cos(t * Math.PI), cy - rr * Math.sin(t * Math.PI)];
    el('path', { class: 'lf-line', d: `M${at(0, R)} A${R} ${R} 0 0 1 ${at(1, R)}` }, f);
    for (let k = 0; k <= 10; k++) {
      const [a, b] = at(k / 10, R), [c, d] = at(k / 10, R - (k % 5 ? 0.9 : 1.6));
      el('line', { class: 'lf-line', x1: a, y1: b, x2: c, y2: d }, f);
    }
    el('line', { class: 'lf-line lf-faint', x1: cx - R, y1: cy, x2: cx + R, y2: cy }, f);
    const needle = el('line', { class: 'lf-line lf-strong lf-hot', x1: cx, y1: cy }, f);
    el('circle', { class: 'lf-dot', cx, cy, r: 0.8 }, f);
    const val = el('text', { class: 'lf-hot', x: cx, y: 11.8, 'font-size': 2.3, 'text-anchor': 'middle' }, f);
    el('text', { x: cx, y: 14.6, 'font-size': 1.8, 'text-anchor': 'middle', 'letter-spacing': 0.2 }, f).textContent = label;
    return v2 => {
      const t = Math.max(0, Math.min(1, (v2 - lo) / (hi - lo)));
      const [nx, ny] = at(t, R - 1);
      needle.setAttribute('x2', nx.toFixed(2)); needle.setAttribute('y2', ny.toFixed(2));
      val.textContent = fmt(v2);
    };
  }

  // A selector on the bench: a slot with detents along u, a knob riding in
  // it. Returns { set(i), pick(e) → i or -1 }.
  function selector(svg, u0, v, labels, title) {
    const step = 7, u1 = u0 + step * (labels.length - 1);
    box(svg, 'lf-solid lf-shaded').set(u0 - 4, v - 4, 0, u1 + 4, v + 4, 1.2);
    const top = face(svg, onTop(u0 - 4, v - 4, 1.2));
    el('rect', { class: 'lf-line lf-faint', x: 3, y: 3.4, width: u1 - u0 + 2, height: 1.2, rx: 0.6 }, top);
    labels.forEach((t, i) => {
      el('text', { x: 4 + i * step, y: 7.6, 'font-size': 2.1, 'text-anchor': 'middle' }, top).textContent = t;
    });
    if (title) el('text', { x: 0.8, y: 2.2, 'font-size': 1.7, 'letter-spacing': 0.3 }, top).textContent = title;
    const knob = cylinder(el('g', { class: 'lf-hot' }, svg), 'lf-solid lf-shaded');
    const hit = el('rect', { x: 0, y: 0, width: u1 - u0 + 8, height: 8, fill: 'transparent' }, top);
    return {
      set(i) { knob.set(u0 + i * step, v, 1.2, 4.2, 1.6); },
      pick(e) {
        const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(top.getScreenCTM().inverse());
        if (q.y < -2 || q.y > 10 || q.x < -2 || q.x > u1 - u0 + 10) return -1;
        return Math.max(0, Math.min(labels.length - 1, Math.round((q.x - 4) / step)));
      },
      hit
    };
  }

  // A figure's controls: the caption, keys, and an idle tour that runs only
  // while the figure is on screen, untouched for 5 s, motion allowed, and
  // the pointer elsewhere. step() advances the tour one move.
  function controls(root, svg, { keys, step, every = 1600 }) {
    const readout = document.getElementById(root.id + '-readout');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    root.tabIndex = 0;
    let quiet = performance.now(), inside = false, visible = false;
    const touched = () => { quiet = performance.now(); };
    svg.addEventListener('pointerenter', () => { inside = true; touched(); });
    svg.addEventListener('pointerleave', () => { inside = false; touched(); });
    svg.addEventListener('pointerdown', touched);
    root.addEventListener('keydown', e => { touched(); if (keys && keys(e)) e.preventDefault(); });
    if (step && window.IntersectionObserver) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(root);
      setInterval(() => {
        if (!visible || inside || still.matches || document.activeElement === root) return;
        if (performance.now() - quiet < 5000) return;
        step();
      }, every);
    }
    const calcEl = document.getElementById(root.id + '-calc');
    return { say: t => { if (readout) readout.textContent = t; }, calc: html => { if (calcEl) calcEl.innerHTML = html; }, still };
  }

  // Frame the drawing: the viewBox hugs what was drawn, plus a margin.
  function fit(svg, pad = 4) {
    const b = svg.getBBox();
    if (!b.width) return;
    svg.setAttribute('viewBox', [b.x - pad, b.y - pad, b.width + 2 * pad, b.height + 2 * pad].map(v => v.toFixed(1)).join(' '));
  }

  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;

  return { bench, plate, board, scale, axes, gauge, selector, controls, fit, mean };
})();
