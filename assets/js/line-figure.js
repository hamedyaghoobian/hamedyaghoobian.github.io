// Shared drawing kit for the line figures at the head of project pages
// (assets/js/*-figure.js, placed with _includes/project-figure.html).
//
// Each figure is a flat hairline drawing: a front elevation, a plan or a
// plain chart, ink on paper, no projection and no faked depth. Colours live
// in the stylesheets (_sass/legacy/_figures.scss), never here, so every
// figure flips with the theme on its own. A figure is a list of items
// (eras, crews, years…); the pointer or the arrow keys pick one, it lights,
// and the caption under the figure names it.
//
// The kit: svg, el, pts, rect, line, text, nearest, interact. (The old
// isometric helpers — iso, box, cylinder, screw, plane, onTop/onNear/onEnd,
// face, edgeLabel — are retired; no figure uses them.)

// Guarded: a page with several figures loads this file more than once.
window.LineFigure = window.LineFigure || (function () {
  const NS = 'http://www.w3.org/2000/svg';

  const pts = list => list.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // ── Flat helpers ────────────────────────────────────────────────────
  // A rectangle at (x, y), w by h, in viewBox units.
  function rect(parent, x, y, w, h, cls = 'lf-solid', rx) {
    const a = { class: cls, x: +x.toFixed(2), y: +y.toFixed(2), width: +w.toFixed(2), height: +h.toFixed(2) };
    if (rx) a.rx = rx;
    return el('rect', a, parent);
  }

  // A straight hairline.
  function line(parent, x1, y1, x2, y2, cls = 'lf-line') {
    return el('line', { class: cls, x1: +x1.toFixed(2), y1: +y1.toFixed(2), x2: +x2.toFixed(2), y2: +y2.toFixed(2) }, parent);
  }

  // Type set in the drawing's own units: `size` is a font-size in viewBox
  // units (class lf-type takes the face from CSS, not the size), so labels
  // scale with the figure. Extra attributes (text-anchor, letter-spacing)
  // pass through.
  function text(parent, str, x, y, size, attrs = {}) {
    const t = el('text', Object.assign({ class: 'lf-type', x, y, 'font-size': size }, attrs), parent);
    t.textContent = str;
    return t;
  }

  // One glow filter for the whole page, referenced by CSS as url(#lf-glow)
  // on lit parts in the dark theme: a soft halo in the accent colour under
  // the part itself.
  function glowFilter() {
    if (document.getElementById('lf-glow')) return;
    const host = el('svg', { width: 0, height: 0, 'aria-hidden': 'true', style: 'position:absolute' }, document.body);
    const f = el('filter', { id: 'lf-glow', x: '-30%', y: '-30%', width: '160%', height: '160%', 'color-interpolation-filters': 'sRGB' }, el('defs', {}, host));
    el('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: 1.6, result: 'b' }, f);
    el('feFlood', { 'flood-opacity': 0.85, result: 'c' }, f);   // colour from CSS (--glow)
    el('feComposite', { in: 'c', in2: 'b', operator: 'in', result: 'g' }, f);
    const m = el('feMerge', {}, f);
    el('feMergeNode', { in: 'g' }, m);
    el('feMergeNode', { in: 'SourceGraphic' }, m);
  }

  function svg(root, viewBox, label) {
    glowFilter();
    return el('svg', { viewBox, role: 'img', 'aria-label': label }, root);
  }

  // Index of the x in xs nearest to x, or -1 if none is within reach.
  function nearest(x, xs, reach) {
    let best = -1, dist = reach;
    xs.forEach((xi, i) => {
      const d = Math.abs(xi - x);
      if (d < dist) { best = i; dist = d; }
    });
    return best;
  }

  // Wires a drawn figure to the pointer, the keyboard and its caption.
  //   root      the figure's container (its id + '-readout' is the caption)
  //   svg       the figure's <svg>
  //   count     how many items can be picked
  //   pick      (x, y) in viewBox units → item index, or -1
  //   describe  item index → caption text
  //   rest      caption when nothing is picked
  //   draw      (glow, active) → redraws; glow[i] eases 0…1 as i lights
  function interact(o) {
    const readout = document.getElementById(o.root.id + '-readout');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const glow = new Array(o.count).fill(0);
    let active = -1;
    let frame = 0;

    function tick() {
      let moving = false;
      for (let i = 0; i < glow.length; i++) {
        const target = i === active ? 1 : 0;
        const next = still.matches ? target : glow[i] + (target - glow[i]) * 0.18;
        const settled = Math.abs(target - next) < 0.002;
        glow[i] = settled ? target : next;
        if (!settled) moving = true;
      }
      o.draw(glow, active);
      frame = moving ? requestAnimationFrame(tick) : 0;
    }

    function set(index) {
      if (index === active) return;
      active = index;
      if (readout) readout.textContent = index < 0 ? o.rest : o.describe(index);
      if (o.onChange) o.onChange(index);
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function toView(e) {
      const box = o.svg.getBoundingClientRect();
      const vb = o.svg.viewBox.baseVal;
      return [
        vb.x + (e.clientX - box.left) / box.width * vb.width,
        vb.y + (e.clientY - box.top) / box.height * vb.height
      ];
    }

    const fromPointer = e => set(o.pick(...toView(e)));
    o.svg.addEventListener('pointermove', fromPointer);
    o.svg.addEventListener('pointerdown', fromPointer);
    o.svg.addEventListener('pointerleave', () => set(-1));

    // Arrow keys walk the items; Escape lets go.
    o.root.tabIndex = 0;
    o.root.addEventListener('keydown', e => {
      if (e.key === 'Escape') return set(-1);
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const from = active < 0 ? (step > 0 ? -1 : o.count) : active;
      set(Math.max(0, Math.min(o.count - 1, from + step)));
    });
    o.root.addEventListener('blur', () => set(-1));

    // An idle tour: while the figure is on screen and nobody has touched it
    // for a while, walk the items slowly (o.tour = ms per item). Never under
    // reduced motion, and never while the pointer rests on the figure.
    if (o.tour && window.IntersectionObserver) {
      let visible = false, inside = false, quietSince = performance.now();
      const touched = () => { quietSince = performance.now(); };
      o.svg.addEventListener('pointerenter', () => { inside = true; touched(); });
      o.svg.addEventListener('pointerleave', () => { inside = false; touched(); });
      o.svg.addEventListener('pointerdown', touched);
      o.root.addEventListener('keydown', touched);
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(o.root);
      setInterval(() => {
        if (!visible || inside || still.matches || document.activeElement === o.root) return;
        if (performance.now() - quietSince < 5000) return;
        set((active + 1) % o.count);
      }, o.tour);
    }

    if (readout) readout.textContent = o.rest;
    o.draw(glow, -1);
    return { set, toView };
  }

  return { el, pts, svg, rect, line, text, nearest, interact };
})();
