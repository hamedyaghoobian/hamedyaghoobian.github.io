// Raising Reachy (projects/raising-reachy.md): a line drawing of Reachy
// Mini whose eyes follow the pointer. Across the figure, its posture runs
// through the three ways it could be framed — a tool, a peer, a learner —
// settling on the learner, the framing the study uses. Posture only; it
// says nothing about the study's findings.

(function () {
  const root = document.getElementById('reachy-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  const FRAMES = [
    'A tool? · not how it’s framed here',
    'A peer? · not how it’s framed here',
    'A learner that needs guidance · how students meet it in this study'
  ];

  // Posture: head tilt (deg), antenna angles (deg from upright), antenna
  // bend, head lift. Rest, then one per framing.
  const REST = { tilt: 0, aL: -12, aR: 12, bend: 5, lift: 0 };
  const POSE = [
    { tilt: 0, aL: 0, aR: 0, bend: 0, lift: 2 },
    { tilt: 0, aL: -22, aR: 22, bend: 8, lift: 0 },
    { tilt: -11, aL: -30, aR: 4, bend: 14, lift: 3 }
  ];

  const svg = makeSvg(root, '-110 -152 220 172',
    'A line drawing of Reachy Mini, a small desktop robot with a rounded head, two round eyes and two antennas, standing on a base.');

  el('ellipse', { class: 'lf-solid', cx: 0, cy: 2, rx: 72, ry: 16 }, svg);
  el('path', { class: 'lf-solid', d: 'M -34 0 L -26 -40 A 26 8 0 0 1 26 -40 L 34 0 A 34 10 0 0 1 -34 0 Z' }, svg);
  el('ellipse', { class: 'lf-solid', cx: 0, cy: -40, rx: 26, ry: 8 }, svg);
  const neck = el('line', { class: 'lf-line', x1: 0, y1: -44, x2: 0, y2: -58 }, svg);

  const head = el('g', {}, svg);
  const antennas = [-14, 14].map(bx => ({
    bx,
    stem: el('path', { class: 'lf-line' }, head),
    tip: el('circle', { class: 'lf-solid', r: 2.6 }, head)
  }));
  el('rect', { class: 'lf-solid', x: -34, y: -22, width: 68, height: 44, rx: 22 }, head);
  const eyes = [-15, 15].map(cx => {
    el('circle', { class: 'lf-solid', cx, cy: 0, r: 8.5 }, head);
    return { cx, pupil: el('circle', { class: 'lf-dot', cx, cy: 0, r: 3 }, head) };
  });

  // The eyes follow the pointer; at rest they look slightly down and out.
  let look = [0, 0.4];
  let api = null;
  svg.addEventListener('pointermove', e => {
    const [x, y] = api.toView(e);
    const dx = x, dy = y + 78;
    const d = Math.max(1, Math.hypot(dx, dy));
    look = [dx / d * Math.min(1, d / 60), dy / d * Math.min(1, d / 60)];
    lookAt();
  });
  svg.addEventListener('pointerleave', () => { look = [0, 0.4]; lookAt(); });
  function lookAt() {
    eyes.forEach(eye => {
      eye.pupil.setAttribute('cx', eye.cx + look[0] * 4);
      eye.pupil.setAttribute('cy', look[1] * 4);
    });
  }

  api = interact({
    root, svg,
    count: FRAMES.length,
    rest: 'Reachy Mini · framed as a learner, not a tool or a peer',
    describe: i => FRAMES[i],
    // Left, middle and right thirds of the figure.
    pick: x => Math.max(0, Math.min(2, Math.floor((x + 110) / (220 / 3)))),
    draw: (glow, active) => {
      const p = {};
      for (const k in REST) {
        p[k] = REST[k] + POSE.reduce((sum, pose, i) => sum + glow[i] * (pose[k] - REST[k]), 0);
      }
      const hy = -80 - p.lift;
      head.setAttribute('transform', `translate(0 ${hy.toFixed(2)}) rotate(${p.tilt.toFixed(2)})`);
      neck.setAttribute('y2', hy + 22);
      antennas.forEach((a, i) => {
        const ang = (i === 0 ? p.aL : p.aR) * Math.PI / 180;
        const len = 30;
        const x0 = a.bx, y0 = -20;
        const x1 = x0 + len * Math.sin(ang), y1 = y0 - len * Math.cos(ang);
        // Bend outward, away from the head's centre.
        const side = a.bx < 0 ? -1 : 1;
        const cx = (x0 + x1) / 2 + side * p.bend * Math.cos(ang);
        const cy = (y0 + y1) / 2 + side * p.bend * Math.sin(ang);
        a.stem.setAttribute('d', `M ${x0} ${y0} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`);
        a.tip.setAttribute('cx', x1); a.tip.setAttribute('cy', y1);
      });
      svg.classList.toggle('is-lit', active === 2);
    }
  });
  lookAt();
})();
