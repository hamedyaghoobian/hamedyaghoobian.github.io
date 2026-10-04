// Teaching (pedagogy.md): every section taught at Muhlenberg, Fall 2021 to
// Fall 2026. Semesters run along the plate, one row per course; each
// section is a block, so a semester with two sections of a course stacks
// two. Picking a block lights its course's whole row and the caption gives
// the course's run. Kept in step with the list on the page by hand.

(function () {
  const root = document.getElementById('teaching-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, edgeLabel, interact } = window.LineFigure;

  const SEMESTERS = ['F21', 'S22', 'F22', 'S23', 'F23', 'S24', 'F24', 'S25', 'F25', 'S26', 'F26'];
  const FULL = s => (s[0] === 'F' ? 'Fall' : 'Spring') + ' 20' + s.slice(1);

  // [label on the plate, full name, { semester: sections }, pilot note].
  // Each pilot sits in the row just before the course it became, and a
  // dashed line on the plate runs from one to the other.
  const COURSES = [
    ['102', 'Intro to Game Programming with Python (CSI 102)', { F21: 2, S22: 2, F22: 2, S23: 1, F23: 2, F26: 2 }],
    ['109', 'Introduction to Data Science (CSI 109)', { S24: 1, F24: 1, F25: 1 }],
    ['111', 'Computer Science II (CSI 111)', { F23: 1, S24: 1, F24: 1, S25: 1, F25: 1 }],
    ['240', 'Computer Organization (CSI 240)', { S22: 1, S23: 1, S24: 1, S25: 1, S26: 1 }],
    ['386', 'Human-Computer Interaction (CSI 386)', { S23: 1 }, 'new pilot, special topics; became Human-AI Interaction (CSI 320)'],
    ['320', 'Human-AI Interaction (CSI 320)', { F25: 1 }, 'grew from the CSI 386 pilot'],
    ['387', 'Introduction to Machine Learning (CSI 387)', { F24: 1 }, 'new pilot, special topics; became Machine Learning (CSI 330)'],
    ['330', 'Machine Learning (CSI 330)', { F26: 1 }, 'grew from the CSI 387 pilot'],
    ['345', 'Web Development (CSI 345)', { F22: 1 }],
    ['355', 'Computer Networks (CSI 355)', { F21: 1 }],
    ['370', 'CUE Computer Science Seminar (CSI 370)', { S25: 1, S26: 1 }]
  ];
  // Pilot row → the row of the course it became.
  const LINEAGE = [[4, 5], [6, 7]];
  const family = r => {
    const pair = LINEAGE.find(p => p.includes(r));
    return pair || [r];
  };

  const CU = 14;                       // a semester's width along u
  const CV = 12;                       // a course row's depth along v
  const BU = 9, BV = 8;                // a block's footprint
  const SH = 6;                        // height of one section
  const LIFT = 4;                      // how far a lit row rises
  const T = 4;                         // plate thickness
  const W = SEMESTERS.length * CU, D = COURSES.length * CV;

  const sections = COURSES.reduce((n, c) => n + Object.values(c[2]).reduce((a, b) => a + b, 0), 0);

  const svg = makeSvg(root, '-24 -112 290 210',
    `Every course section taught from Fall 2021 to Fall 2026 as blocks on a grid of semesters and courses: ${sections} sections of ${COURSES.length} courses. Intro to Game Programming runs through most semesters, often with two sections; Computer Organization recurs every spring from 2022 to 2026.`);

  box(svg, 'lf-solid').set(0, 0, -T, W, D, 0);

  // A band per course row, lit with its course.
  const bands = COURSES.map((_, r) => el('polygon', {
    class: 'lf-band',
    points: pts([iso(0, r * CV), iso(W, r * CV), iso(W, (r + 1) * CV), iso(0, (r + 1) * CV)])
  }, svg));

  // Pilot → successor, on the plate between their first blocks.
  const firstAt = r => SEMESTERS.findIndex(sm => COURSES[r][2][sm]);
  const links = LINEAGE.map(([p, q]) => {
    const a = iso(firstAt(p) * CU + CU / 2, p * CV + CV / 2);
    const b = iso(firstAt(q) * CU + CU / 2, q * CV + CV / 2);
    return el('line', { class: 'lf-ghost lf-line', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, svg);
  });

  // Course numbers, flat, just before each row;
  // years along the near edge, under each fall.
  const labels = COURSES.map(([short], r) => {
    const [x, y] = iso(-5, r * CV + CV / 2);
    const t = el('text', { class: 'lf-text lf-text--small', x: x.toFixed(2), y: (y + 2.5).toFixed(2), 'text-anchor': 'end' }, svg);
    t.textContent = short;
    return t;
  });
  SEMESTERS.forEach((s, i) => {
    if (s[0] !== 'F') return;
    const [x, y] = iso(i * CU + CU / 2, D, -T);
    el('line', { class: 'lf-line lf-faint', x1: x, y1: y, x2: x, y2: y + 4 }, svg);
    edgeLabel(svg, '20' + s.slice(1), i * CU + CU / 2 - 6, D, -T - 13);
  });

  // Blocks, farthest first: larger u and smaller v are farther away.
  const blocks = [];
  COURSES.forEach((c, r) => SEMESTERS.forEach((s, i) => {
    const n = c[2][s] || 0;
    for (let k = 0; k < n; k++) blocks.push({ r, i, k, u: i * CU + (CU - BU) / 2, v: r * CV + (CV - BV) / 2 });
  }));
  blocks.sort((a, b) => (a.v - a.u) - (b.v - b.u) || a.k - b.k);
  blocks.forEach(b => { b.g = box(svg, 'lf-solid'); });

  const blockCentre = b => iso(b.u + BU / 2, b.v + BV / 2, SH * (b.k + 0.5));

  const runOf = c => {
    const taught = SEMESTERS.filter(s => c[2][s]);
    const n = taught.reduce((a, s) => a + c[2][s], 0);
    const span = taught.length === 1 ? FULL(taught[0]) : `${FULL(taught[0])} – ${FULL(taught[taught.length - 1])}`;
    return `${taught.length} semester${taught.length === 1 ? '' : 's'}, ${n} section${n === 1 ? '' : 's'} · ${span}`;
  };

  interact({
    root, svg,
    count: COURSES.length,
    rest: `Fall 2021 – Fall 2026 · ${sections} sections of ${COURSES.length} courses`,
    describe: r => `${COURSES[r][1]} · ${runOf(COURSES[r])}` + (COURSES[r][3] ? ` · ${COURSES[r][3]}` : ''),
    // The nearest block on screen picks its course.
    pick: (x, y) => {
      let best = -1, dist = 12;
      blocks.forEach(b => {
        const [bx, by] = blockCentre(b);
        const d = Math.hypot(bx - x, by - y);
        if (d < dist) { best = b.r; dist = d; }
      });
      return best;
    },
    draw: (glow, active) => {
      const lit = active < 0 ? [] : family(active);
      blocks.forEach(b => {
        const lift = LIFT * Math.max(...family(b.r).map(r => glow[r]));
        b.g.set(b.u, b.v, SH * b.k + lift, b.u + BU, b.v + BV, SH * (b.k + 1) + lift);
        b.g.classList.toggle('is-lit', lit.includes(b.r));
      });
      bands.forEach((band, r) => band.classList.toggle('is-lit', lit.includes(r)));
      links.forEach((line, i) => line.classList.toggle('is-lit', LINEAGE[i].includes(active)));
      labels.forEach((t, r) => t.classList.toggle('is-lit', lit.includes(r)));
    }
  });
})();
