// Shared parts for the Learning Machines figures (CSI 330): flat line
// drawings in front elevation, with hairlines. A plinth to stand things on
// (its front face carries the selectors and a printed label), upright boards
// that carry an ordinary 2-D plot, half-dial gauges on posts, a selector
// rail with detents, switches and tubes, and a figure's own controls
// (pointer, keys, an idle tour, the caption, the parts list). No isometric
// projection and no shaded faces: every solid is paper with a hairline
// edge, and only the live parts take the one glow accent.
//
// Coordinates are the SVG's own: x to the right, y down. Each figure draws
// into stage(svg), a group whose strokes stay hairline however the drawing
// is scaled, and whose text takes the figure type (.lm-study, in
// _sass/legacy/_learning-machines.scss).

window.CSIKit = window.CSIKit || (function () {
  const NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // The figure's <svg> (made by the line kit when it is loaded, which adds
  // the page's one glow filter for the dark theme), and the group to draw in.
  function svg(root, label) {
    if (window.LineFigure && window.LineFigure.svg) return window.LineFigure.svg(root, '0 0 100 100', label);
    return el('svg', { viewBox: '0 0 100 100', role: 'img', 'aria-label': label }, root);
  }
  const stage = s => el('g', { class: 'lm-study' }, s);

  // A plinth from x0 to x1, its top at y (where everything stands), its
  // front face 15 deep: selectors and switches sit in its upper part, the
  // printed label (plate) along its lower edge, under a faint line.
  function bench(g, x0, x1, y) {
    el('rect', { class: 'lf-solid', x: x0, y, width: x1 - x0, height: 15, rx: 0.8 }, g);
    el('line', { class: 'lf-line lf-faint', x1: x0, y1: y + 11, x2: x1, y2: y + 11 }, g);
  }

  // A label printed along the plinth's lower edge (y is the plinth's top).
  function plate(g, text, x, y, size = 2.2) {
    const t = el('text', { x, y: y + 13.8, 'font-size': size, 'letter-spacing': 0.3 }, g);
    t.textContent = text;
    return t;
  }

  // A post from y0 down to the plinth top at base, on a foot.
  function post(g, x, y0, base) {
    el('line', { class: 'lf-line', x1: x, y1: y0, x2: x, y2: base - 1.2 }, g);
    el('rect', { class: 'lf-solid', x: x - 3, y: base - 1.2, width: 6, height: 1.2 }, g);
  }

  // An upright board with its top-left at (x, y), w by h, on two posts
  // (inset from its ends) down to the plinth top at base. Returns { g, w, h, el, toFace(e) }: g is a
  // group in the board's own units (x from 0 to w, y down from 0 to h) to
  // draw an ordinary plot into; toFace maps a pointer event into those units.
  function board(g0, x, y, w, h, base, inset = 7) {
    const part = el('g', {}, g0);                 // the whole board, to name as a part
    if (base != null && base > y + h) [x + inset, x + w - inset].forEach(px => post(part, px, y + h, base));
    el('rect', { class: 'lf-solid', x, y, width: w, height: h, rx: 1 }, part);
    const g = el('g', { transform: `translate(${x} ${y})` }, part);
    el('rect', { class: 'lf-line lf-faint', x: 1.5, y: 1.5, width: w - 3, height: h - 3, rx: 0.6 }, g);
    return {
      g, w, h, el: part,
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

  // A dial gauge: a half dial on a small panel (18 × 16) with its top-left
  // at (x, y), from lo to hi, on a post down to the plinth top at base. The
  // reading sits under the dial, the name under the reading, clear of the
  // needle's sweep. Returns set(value), with set.el the whole gauge.
  function gauge(g0, x, y, label, lo, hi, fmt = v => v.toFixed(2), base) {
    const part = el('g', {}, g0);
    if (base != null && base > y + 16) post(part, x + 9, y + 16, base);
    el('rect', { class: 'lf-solid', x, y, width: 18, height: 16, rx: 0.8 }, part);
    const f = el('g', { transform: `translate(${x} ${y})` }, part);
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
    const set = v2 => {
      const t = Math.max(0, Math.min(1, (v2 - lo) / (hi - lo)));
      const [nx, ny] = at(t, R - 1);
      needle.setAttribute('x2', nx.toFixed(2)); needle.setAttribute('y2', ny.toFixed(2));
      val.textContent = fmt(v2);
    };
    set.el = part;
    return set;
  }

  // A selector rail on the plinth's face: a slot with detents, one label
  // under each, and the knob (a ring) in the chosen detent. The first detent
  // is at x0; y is the rail's top. Returns { set(i), pick(e) → i or -1 }.
  function selector(g0, x0, y, labels, title) {
    const part = el('g', {}, g0);
    const step = 7, span = step * (labels.length - 1);
    const f = el('g', { transform: `translate(${x0 - 4} ${y})` }, part);
    el('rect', { class: 'lf-solid', x: 0, y: 0, width: span + 8, height: 9.4, rx: 0.8 }, f);
    el('rect', { class: 'lf-line lf-faint', x: 3, y: 3.4, width: span + 2, height: 1.2, rx: 0.6 }, f);
    labels.forEach((t, i) => {
      el('line', { class: 'lf-line lf-faint', x1: 4 + i * step, y1: 3, x2: 4 + i * step, y2: 5 }, f);
      el('text', { x: 4 + i * step, y: 8.3, 'font-size': 2.1, 'text-anchor': 'middle' }, f).textContent = t;
    });
    if (title) el('text', { x: 0.8, y: 2.2, 'font-size': 1.7, 'letter-spacing': 0.3 }, f).textContent = title;
    const knob = el('circle', { class: 'lf-solid', cy: 4, r: 1.7 }, el('g', { class: 'lf-hot' }, f));
    const hit = el('rect', { x: 0, y: 0, width: span + 8, height: 9.4, fill: 'transparent' }, f);
    return {
      set(i) { knob.setAttribute('cx', 4 + i * step); },
      pick(e) {
        const p = f.ownerSVGElement.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(f.getScreenCTM().inverse());
        if (q.y < -2 || q.y > 11 || q.x < -2 || q.x > span + 10) return -1;
        return Math.max(0, Math.min(labels.length - 1, Math.round((q.x - 4) / step)));
      },
      hit, el: part
    };
  }

  // A two-way switch: a plate with its top-left at (x, y), w by h, naming
  // its setting. Paper-filled, so a click anywhere on it lands. Returns
  // { el, text }: set text.textContent to the current setting.
  function toggle(g0, x, y, w, h, title, size = 2.4) {
    const part = el('g', { style: 'cursor:pointer' }, g0);
    el('rect', { class: 'lf-solid', x, y, width: w, height: h, rx: 0.8 }, part);
    if (title) el('text', { x, y: y - 1, 'font-size': 1.7, 'letter-spacing': 0.3 }, part).textContent = title;
    const text = el('text', { x: x + w / 2, y: y + h / 2 + size * 0.36, 'font-size': size, 'text-anchor': 'middle', 'letter-spacing': 0.25 }, part);
    return { el: part, text };
  }

  // A glass tube on a stand, in elevation: open at the top, round at the
  // bottom; x its centre, from top down to the plinth top at base. Returns
  // { el, wrap, set(frac) }: the fill (in wrap) rises to frac of the tube.
  function tube(g0, x, top, base, r = 3.4) {
    const part = el('g', {}, g0);
    const bot = base - 3;
    el('rect', { class: 'lf-solid', x: x - 5, y: bot, width: 10, height: 3, rx: 0.5 }, part);
    const wrap = el('g', {}, part);
    const fill = el('rect', { class: 'lm-fill', x: x - r + 0.8, width: 2 * r - 1.6 }, wrap);
    el('path', { class: 'lf-line', d: `M${x - r} ${top} L${x - r} ${bot - r} A${r} ${r} 0 0 0 ${x + r} ${bot - r} L${x + r} ${top}` }, part);
    el('line', { class: 'lf-line', x1: x - r - 0.8, y1: top, x2: x + r + 0.8, y2: top }, part);
    const inner = bot - 0.8 - top;
    return {
      el: part, wrap,
      set(frac) {
        const hh = Math.max(0, inner * frac);
        fill.setAttribute('y', (bot - 0.8 - hh).toFixed(2)); fill.setAttribute('height', hh.toFixed(2));
        fill.setAttribute('rx', Math.min(r - 0.8, hh / 2).toFixed(2));
        fill.style.display = hh > 0.05 ? '' : 'none';
      }
    };
  }

  // A coil spring drawn flat: a zigzag from (x, y1) to (x, y2).
  function spring(x, y1, y2, w = 0.9, pitch = 1.4) {
    const n = Math.max(4, Math.round(Math.abs(y2 - y1) / pitch));
    let d = `M${x.toFixed(2)} ${y1.toFixed(2)}`;
    for (let k = 1; k < n; k++) d += ` L${(x + (k % 2 ? w : -w)).toFixed(2)} ${(y1 + (y2 - y1) * k / n).toFixed(2)}`;
    return d + ` L${x.toFixed(2)} ${y2.toFixed(2)}`;
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
    // after: set to a panel's sync(), so buttons follow every change of state
    const api = { say: t => { if (readout) readout.textContent = t; if (api.after) api.after(); }, calc: html => { if (calcEl) calcEl.innerHTML = html; }, still, after: null };
    return api;
  }

  // Frame the drawing: the viewBox hugs what was drawn, plus a margin.
  function fit(svg, pad = 4) {
    const b = svg.getBBox();
    if (!b.width) return;
    svg.setAttribute('viewBox', [b.x - pad, b.y - pad, b.width + 2 * pad, b.height + 2 * pad].map(v => v.toFixed(1)).join(' '));
  }

  // A control panel under the figure, inside its card: rows of labelled
  // segmented buttons and sliders, so every setting the keys reach can also
  // be set by hand. controls: [{ label, type: 'seg', options: [[value,
  // text], …], get, set } | { label, type: 'range', min, max, step, get,
  // set, fmt }]. Returns sync(), to call after every change.
  function panel(root, controls) {
    const host = document.createElement('div');
    host.className = 'lm-panel';
    root.insertAdjacentElement('afterend', host);
    const rows = controls.map(c => {
      const row = document.createElement('div');
      row.className = 'lm-panel__row';
      const lab = document.createElement('span');
      lab.className = 'lm-panel__label';
      lab.textContent = c.label;
      row.appendChild(lab);
      if (c.type === 'seg') {
        const seg = document.createElement('div');
        seg.className = 'lm-seg';
        seg.setAttribute('role', 'group');
        seg.setAttribute('aria-label', c.label);
        c.buttons = c.options.map(([v, text]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = text;
          b.addEventListener('click', () => { c.set(v); sync(); });
          seg.appendChild(b);
          return [v, b];
        });
        row.appendChild(seg);
      } else {
        const input = document.createElement('input');
        Object.assign(input, { type: 'range', min: c.min, max: c.max, step: c.step });
        input.setAttribute('aria-label', c.label);
        const out = document.createElement('output');
        input.addEventListener('input', () => { c.set(+input.value); sync(); });
        c.input = input; c.out = out;
        row.appendChild(input); row.appendChild(out);
      }
      host.appendChild(row);
      return c;
    });
    function sync() {
      rows.forEach(c => {
        const v = c.get();
        if (c.buttons) c.buttons.forEach(([bv, b]) => b.setAttribute('aria-pressed', String(bv === v)));
        else { c.input.value = v; c.out.textContent = c.fmt ? c.fmt(v) : v; }
      });
    }
    sync();
    return sync;
  }

  // The figure's parts, in the order the entry lists them: each is an
  // element (or a list) that stays in place while the figure redraws. A
  // part can be focused from the entry's list (a 'lm-part' event on root):
  // it takes the accent and everything else fades; Esc or the same part
  // again clears it. Hovering the drawing names the part under the pointer
  // in the card's hint, and marks it in the list.
  function parts(root, svg, list, names) {
    list.forEach((els, i) => [].concat(els).forEach(n => n && n.setAttribute('data-part', i)));
    names = names || [...document.querySelectorAll('.lm-parts__name')].map(n => n.textContent);
    const hint = root.parentElement.querySelector('.figure-card__hint');
    const plain = hint ? hint.textContent : '';
    let on = -1;
    function focus(i) {
      on = i === on ? -1 : i;
      svg.classList.toggle('lm-focusing', on >= 0);
      svg.querySelectorAll('.lm-focus-on').forEach(n => n.classList.remove('lm-focus-on'));
      if (on >= 0) svg.querySelectorAll(`[data-part="${on}"]`).forEach(n => n.classList.add('lm-focus-on'));
      root.dispatchEvent(new CustomEvent('lm-part-focused', { detail: on, bubbles: true }));
    }
    root.addEventListener('lm-part', e => focus(e.detail));
    root.addEventListener('keydown', e => { if (e.key === 'Escape' && on >= 0) focus(on); });
    svg.addEventListener('pointermove', e => {
      const n = e.target.closest && e.target.closest('[data-part]');
      const i = n ? +n.getAttribute('data-part') : -1;
      if (hint) hint.textContent = i >= 0 && names[i] ? `${String(i + 1).padStart(2, '0')} ${names[i]}` : plain;
      root.dispatchEvent(new CustomEvent('lm-part-hover', { detail: i, bubbles: true }));
    });
    svg.addEventListener('pointerleave', () => {
      if (hint) hint.textContent = plain;
      root.dispatchEvent(new CustomEvent('lm-part-hover', { detail: -1, bubbles: true }));
    });
    return { focus };
  }

  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;

  return { el, svg, stage, bench, plate, post, board, scale, axes, gauge, selector, toggle, tube, spring, controls, fit, mean, panel, parts };
})();
