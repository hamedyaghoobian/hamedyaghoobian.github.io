// Shared drawing kit for the line figures at the head of project pages
// (assets/js/*-figure.js, placed with _includes/project-figure.html).
//
// Each figure is an isometric ink drawing in the Mashhad footer's palette:
// colours live in main.scss (.project-figure), never here, so every figure
// flips with body.dark on its own. A figure is a list of items (eras,
// crews, listings, years…); the pointer or the arrow keys pick one, it
// lights and lifts, and the caption under the figure names it.

// Guarded: a page with several figures loads this file more than once.
window.LineFigure = window.LineFigure || (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const C = Math.cos(Math.PI / 6);
  const S = 0.5;

  // World: u runs left-to-right and climbs (time, stages), v is depth
  // toward the viewer, h is height.
  const iso = (u, v, h = 0) => [(u + v) * C, (v - u) * S - h];
  const pts = list => list.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function svg(root, viewBox, label) {
    return el('svg', { viewBox, role: 'img', 'aria-label': label }, root);
  }

  // A box from (u0, v0, h0) to (u1, v1, h1). Only the three faces that face
  // the viewer are drawn — the near side (v1), the left end (u0), the top —
  // each filled with paper so it hides whatever stands behind it.
  function box(parent, cls) {
    const g = el('g', { class: cls }, parent);
    const near = el('polygon', {}, g);
    const end = el('polygon', {}, g);
    const top = el('polygon', {}, g);
    g.set = (u0, v0, h0, u1, v1, h1) => {
      near.setAttribute('points', pts([iso(u0, v1, h0), iso(u1, v1, h0), iso(u1, v1, h1), iso(u0, v1, h1)]));
      end.setAttribute('points', pts([iso(u0, v0, h0), iso(u0, v1, h0), iso(u0, v1, h1), iso(u0, v0, h1)]));
      top.setAttribute('points', pts([iso(u0, v0, h1), iso(u1, v0, h1), iso(u1, v1, h1), iso(u0, v1, h1)]));
      return g;
    };
    return g;
  }

  // A label lying in a vertical face that runs along u, so it reads as
  // printed on the near edge of a plate.
  function edgeLabel(parent, text, u, v, h, cls = 'lf-text') {
    const [x, y] = iso(u, v, h);
    const t = el('text', { class: cls, transform: `matrix(${C} ${-S} 0 1 ${x.toFixed(2)} ${y.toFixed(2)})` }, parent);
    t.textContent = text;
    return t;
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

    if (readout) readout.textContent = o.rest;
    o.draw(glow, -1);
    return { set, toView };
  }

  return { iso, pts, el, svg, box, edgeLabel, nearest, interact };
})();
