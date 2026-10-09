// Raising Reachy (projects/raising-reachy.md): a line drawing of Reachy
// Mini as it actually looks — a tall rounded body on a dark base ring, a
// wide rounded head resting off-centre and tilted on top, two big dark
// lenses joined by a bridge like goggles, and two long thin antennas on
// coiled springs. Its eyes follow the pointer (a glint moves in each lens),
// it blinks now and then and its antennas sway on their springs; across the
// figure its posture runs through the three ways it could be framed — a
// tool, a peer, a learner — settling on the learner, the framing the study
// uses. Posture only; it says nothing about the study's findings.

(function () {
  const root = document.getElementById('reachy-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  const FRAMES = [
    'A tool? · not how it’s framed here',
    'A peer? · not how it’s framed here',
    'A learner that needs guidance · how students meet it in this study'
  ];

  // Posture: head tilt (deg), antenna angles from upright (deg, negative
  // leans left), head lift. At rest it holds the photo's curious tilt.
  const REST = { tilt: -9, aL: -30, aR: 22, lift: 0 };
  const POSE = [
    { tilt: 0, aL: -8, aR: 8, lift: 2 },        // tool: upright, stiff
    { tilt: 3, aL: -24, aR: 24, lift: 0 },      // peer: level, open
    { tilt: -15, aL: -38, aR: 14, lift: 3 }     // learner: head cocked, curious
  ];

  const HEAD = { x: -5, y: -104, w: 74, h: 48, r: 19 };  // head centre and size
  const ANT = 62;                      // antenna length
  const COIL = 11;                     // the spring at its base
  const EYE = { dx: 16, y: 2, r: 10 };

  const svg = makeSvg(root, '-92 -206 184 216',
    'A line drawing of Reachy Mini: a tall rounded white body on a dark base, a wide rounded head tilted on top with two large dark round eyes joined like goggles, and two long thin antennas on coiled springs.');

  // Base ring, then the body, its seam, and the head over them.
  el('ellipse', { class: 'lf-solid reachy-base', cx: 0, cy: 2, rx: 27, ry: 5.5 }, svg);
  el('path', {
    class: 'lf-solid',
    d: 'M -30 -2 C -37 -36 -37 -70 -25 -88 Q 0 -101 25 -88 C 37 -70 37 -36 30 -2 A 30 6.5 0 0 1 -30 -2 Z'
  }, svg);
  el('path', { class: 'lf-line lf-faint', d: 'M -34.2 -24 A 34.2 7 0 0 0 34.2 -24' }, svg);

  const head = el('g', {}, svg);
  const antennas = [-1, 1].map(side => ({
    side,
    coil: el('path', { class: 'lf-line' }, head),
    rod: el('line', { class: 'lf-line' }, head),
    tip: el('line', { class: 'lf-line lf-strong' }, head)
  }));
  el('rect', { class: 'lf-solid', x: -HEAD.w / 2, y: -HEAD.h / 2, width: HEAD.w, height: HEAD.h, rx: HEAD.r }, head);
  el('line', { class: 'reachy-bridge', x1: -EYE.dx + EYE.r - 1, y1: EYE.y, x2: EYE.dx - EYE.r + 1, y2: EYE.y }, head);
  const eyes = [-1, 1].map(side => {
    const g = el('g', { transform: `translate(${side * EYE.dx} ${EYE.y})` }, head);
    const lids = el('g', {}, g);                         // squashed to blink
    el('circle', { class: 'reachy-lens', r: EYE.r }, lids);
    el('circle', { class: 'reachy-rim', r: EYE.r - 2.6 }, lids);
    const glint = el('circle', { class: 'reachy-glint', r: 1.9 }, lids);
    return { lids, glint };
  });

  // A coiled spring from (0,0) along angle `a`, as a short zigzag.
  function coilPath(x0, y0, a) {
    const ux = Math.sin(a), uy = -Math.cos(a);           // along the antenna
    const px = Math.cos(a), py = Math.sin(a);            // across it
    let d = `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
    const turns = 7;
    for (let k = 1; k <= turns * 2; k++) {
      const t = (k / (turns * 2)) * COIL, s = (k % 2 ? 2.4 : -2.4);
      d += ` L ${(x0 + ux * t + px * s).toFixed(2)} ${(y0 + uy * t + py * s).toFixed(2)}`;
    }
    return d;
  }

  // The eyes follow the pointer; at rest they look slightly down and out.
  let look = [0.15, 0.35];
  let pose = { ...REST };
  let sway = 0, blink = 1;

  function render() {
    const hy = HEAD.y - pose.lift;
    head.setAttribute('transform', `translate(${HEAD.x} ${hy.toFixed(2)}) rotate(${pose.tilt.toFixed(2)})`);
    antennas.forEach(a => {
      const deg = (a.side < 0 ? pose.aL : pose.aR) + sway * (a.side < 0 ? 1 : -0.8);
      const ang = deg * Math.PI / 180;
      const x0 = a.side * (HEAD.w / 2 - 12), y0 = -HEAD.h / 2 + 1;
      const ux = Math.sin(ang), uy = -Math.cos(ang);
      const x1 = x0 + ux * COIL, y1 = y0 + uy * COIL;
      const x2 = x0 + ux * ANT, y2 = y0 + uy * ANT;
      a.coil.setAttribute('d', coilPath(x0, y0, ang));
      Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => a.rod.setAttribute(k, v.toFixed(2)));
      Object.entries({ x1: x2 - ux * 3.5, y1: y2 - uy * 3.5, x2, y2 }).forEach(([k, v]) => a.tip.setAttribute(k, v.toFixed(2)));
    });
    eyes.forEach(e => {
      e.lids.setAttribute('transform', `scale(1 ${blink.toFixed(3)})`);
      e.glint.setAttribute('cx', (look[0] * 4.2 + 2).toFixed(2));
      e.glint.setAttribute('cy', (look[1] * 4.2 - 3).toFixed(2));
    });
  }

  let api = null;
  svg.addEventListener('pointermove', e => {
    const [x, y] = api.toView(e);
    const dx = x - HEAD.x, dy = y - HEAD.y;
    const d = Math.max(1, Math.hypot(dx, dy));
    look = [dx / d * Math.min(1, d / 70), dy / d * Math.min(1, d / 70)];
    render();
  });
  svg.addEventListener('pointerleave', () => { look = [0.15, 0.35]; render(); });

  api = interact({
    root, svg,
    count: FRAMES.length,
    rest: 'Reachy Mini · framed as a learner, not a tool or a peer',
    describe: i => FRAMES[i],
    // Left, middle and right thirds of the figure.
    pick: x => Math.max(0, Math.min(2, Math.floor((x + 92) / (184 / 3)))),
    draw: (glow, active) => {
      for (const k in REST) {
        pose[k] = REST[k] + POSE.reduce((sum, p, i) => sum + glow[i] * (p[k] - REST[k]), 0);
      }
      render();
      svg.classList.toggle('is-lit', active === 2);
    }
  });

  // Idle life, only while on screen and only for those who allow motion:
  // the antennas sway on their springs, and now and then it blinks.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false, frame = 0, nextBlink = 0;
  function idle(t) {
    sway = Math.sin(t / 900) * 2.2 + Math.sin(t / 2300) * 1.2;
    if (!nextBlink) nextBlink = t + 2500 + Math.random() * 3000;
    const since = t - nextBlink;
    if (since > 0) {
      blink = since < 90 ? 1 - since / 90 * 0.9 : since < 180 ? 0.1 + (since - 90) / 90 * 0.9 : 1;
      if (since >= 180) nextBlink = t + 3000 + Math.random() * 4000;
    }
    render();
    frame = visible && !still.matches ? requestAnimationFrame(idle) : 0;
  }
  if (window.IntersectionObserver) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !frame && !still.matches) frame = requestAnimationFrame(idle);
    }).observe(root);
  }
  render();
})();
