// News (news.md): every item on the News page, June 2022 to July 2026, as
// a desk calendar — months run along the plate, one row per year with 2022
// at the back and 2026 nearest. Each item stands in its month's cell as a
// thing of its kind: a lectern for a talk, a table with its chairs for a
// panel organized, a stack of sheets for a paper accepted, a folded
// newspaper for press. The back rows hold lecterns and a table; from
// autumn 2024 the paper stacks arrive.
//
// Data: news.md itself. Each item sits at the month it is listed under on
// the page (the bold date), which for some is when it was announced, not
// when it happened — the caption gives the event date where the page does.
// NEWS below repeats the page's bullets: add a bullet, add a line here
// (and a year row, START…END, when a new year begins).

(function () {
  const root = document.getElementById('news-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, edgeLabel, interact } = window.LineFigure;

  // Kind → [its word in the caption, one in the tally, several].
  const KINDS = {
    talk: ['talk', 'talk', 'talks'],
    panel: ['panel organized', 'panel', 'panels'],
    paper: ['paper accepted', 'paper', 'papers'],
    press: ['press', 'press mention', 'press mentions']
  };

  // [year, month, kind, what the page says, in short: titles cut at the
  // colon, the page has them in full]. Oldest first, so the
  // arrow keys walk forward in time. An optional fifth value nudges an item
  // across its row's depth (dv, world units, + is toward the viewer): the
  // two lecterns a month apart in early 2025 stand back and front so they
  // don't merge on screen (checked with the skill's iso_overlap.py).
  const NEWS = [
    [2022, 6, 'talk', '“Phenomenology of Generative/Predictive Word Processing” · Oxford Connected Life 2022 Conference'],
    [2022, 8, 'talk', 'AI and the Democratization of Art · Dana Forum, October 17, 2022'],
    [2023, 3, 'panel', '“Configuring the (w)hole” · 4S 2023, Honolulu'],
    [2023, 6, 'talk', '“Plasticity of Data and the Problematics of Containment” · 4S 2023, Honolulu'],
    [2024, 9, 'paper', '“Data-Body Machine” · Journal of Somatechnics'],
    [2024, 11, 'paper', '“The Writer In-between” · Journal of Human-Technology Relations'],
    [2024, 12, 'panel', '“Perforating echos,” co-organized with Rachel Horst · 4S 2025, Seattle'],
    [2025, 2, 'talk', '“From Java to Python,” with Proyash Podder · SIGCSE 2025 affiliated event, Pittsburgh', -2],
    [2025, 3, 'talk', '“The Recursive Enactment of AI” · 4S 2025, Seattle, September 2025', 3],
    [2025, 11, 'paper', '“MASFIN,” with Sebastian Montalvo (Class of ’28) · NeurIPS 2025, Generative AI in Finance Workshop'],
    [2026, 4, 'paper', '“TimeCapsule,” with Hayk Grigorian (Class of ’26) · ACM Creativity & Cognition 2026'],
    [2026, 7, 'press', 'Quoted in “Are LLMs Stuck in Time?” by Samuel Greengard · Communications of the ACM']
  ];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  const START = 2022, END = 2026;      // one row per year
  const CU = 10;                       // a month's width along u
  const CV = 14;                       // a year row's depth along v
  const T = 4;                         // plate thickness
  const LIFT = 3;                      // how far a lit thing rises
  const L = 12 * CU, D = (END - START + 1) * CV;

  const items = NEWS.map(([year, month, kind, text, dv = 0]) => ({
    year, month, kind, text,
    r: year - START,
    u: (month - 0.5) * CU,
    v: (year - START + 0.5) * CV + dv
  }));
  const count = k => items.filter(it => it.kind === k).length;
  const tally = Object.keys(KINDS).map(k => `${count(k)} ${KINDS[k][count(k) === 1 ? 1 : 2]}`).join(', ');

  const svg = makeSvg(root, '-16 -66 186 118',
    `A desk calendar of the ${items.length} items on this page, June 2022 to July 2026, each standing in its month as a lectern for a talk, a table for a panel, a stack of sheets for an accepted paper or a newspaper for press. The 2022 and 2023 rows hold talks and an organized panel; 2024 is quiet until autumn, when two accepted papers and a second panel arrive; 2025 brings two talks and a paper, and 2026 a paper and a press mention.`);

  box(svg, 'lf-solid').set(0, 0, -T, L, D, 0);

  // The calendar's grid, faint: year rows dashed, month columns dotted.
  for (let r = 1; r <= END - START; r++) {
    const [a, b] = [iso(0, r * CV), iso(L, r * CV)];
    el('line', { class: 'lf-line lf-faint', x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'stroke-dasharray': '1.5 2.5' }, svg);
  }
  for (let m = 1; m < 12; m++) {
    const [a, b] = [iso(m * CU, 0), iso(m * CU, D)];
    el('line', { class: 'lf-line lf-faint', x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'stroke-dasharray': '0.4 3' }, svg);
  }

  // Each item's cell, lit with it.
  const cells = items.map(it => {
    const u0 = (it.month - 1) * CU, v0 = it.r * CV;
    return el('polygon', {
      class: 'lf-band',
      points: pts([iso(u0, v0), iso(u0 + CU, v0), iso(u0 + CU, v0 + CV), iso(u0, v0 + CV)])
    }, svg);
  });

  // Years just before each row; month initials along the near edge.
  const yearLabels = [];
  for (let y = START; y <= END; y++) {
    const [x, yy] = iso(-5, (y - START + 0.5) * CV);
    const t = el('text', { class: 'lf-text lf-text--small', x: x.toFixed(2), y: (yy + 2.5).toFixed(2), 'text-anchor': 'end' }, svg);
    t.textContent = y;
    yearLabels.push(t);
  }
  const monthLabels = MONTHS.map((name, m) =>
    edgeLabel(svg, name[0], (m + 0.5) * CU - 1.2, D, -T - 8, 'lf-text lf-text--small'));

  // A paper-filled face through the given [u, v, h] corners, and a line.
  const face = (g, cls) => {
    const p = el('polygon', { class: cls }, g);
    return corners => p.setAttribute('points', pts(corners.map(c => iso(...c))));
  };
  const line = (g, cls) => {
    const l = el('line', { class: cls }, g);
    return (a, b) => {
      const [p, q] = [iso(...a), iso(...b)];
      l.setAttribute('x1', p[0]); l.setAttribute('y1', p[1]);
      l.setAttribute('x2', q[0]); l.setAttribute('y2', q[1]);
    };
  };

  // Objects, each built around its cell's middle (u, v) and redrawn at a
  // lift l. Parts are created farthest first so nearer ones hide them.
  // A cell is 10 × 14; every object keeps inside about 8 × 10.
  const BUILD = {
    // A lectern facing the viewer: plinth, post, a desk sloping down
    // toward the audience, a sheet of notes on it.
    talk(g) {
      const plinth = box(g, 'lf-solid'), post = box(g, 'lf-solid');
      const end = face(g, 'lf-solid'), front = face(g, 'lf-solid'), top = face(g, 'lf-solid');
      const notes = face(g, 'lf-solid lf-sheet');
      return (u, v, l) => {
        plinth.set(u - 2.4, v - 3, l, u + 2.4, v + 3, l + 1.2);
        post.set(u - 1.3, v - 1.6, l + 1.2, u + 1.3, v + 1.6, l + 11);
        const u0 = u - 2.8, u1 = u + 2.8, v0 = v - 3.4, v1 = v + 3.4;
        const h0 = l + 11, hb = l + 14.5, hf = l + 12;      // desk underside, back, front
        end([[u0, v0, h0], [u0, v1, h0], [u0, v1, hf], [u0, v0, hb]]);
        front([[u0, v1, h0], [u1, v1, h0], [u1, v1, hf], [u0, v1, hf]]);
        top([[u0, v0, hb], [u1, v0, hb], [u1, v1, hf], [u0, v1, hf]]);
        const on = (du, t) => [u + du, v0 + (v1 - v0) * t, hb + (hf - hb) * t + 0.15];
        notes([on(-1.8, 0.15), on(1.8, 0.15), on(1.8, 0.8), on(-1.8, 0.8)]);
      };
    },
    // A panel table along the month, three chairs behind it.
    panel(g) {
      const seats = [2.6, 0, -2.6];                     // farthest (larger u) first
      const chairs = seats.map(() => ({ back: box(g, 'lf-solid'), seat: box(g, 'lf-solid') }));
      const legs = [box(g, 'lf-solid'), box(g, 'lf-solid')];
      const top = box(g, 'lf-solid');
      return (u, v, l) => {
        seats.forEach((du, i) => {
          chairs[i].back.set(u + du - 1, v - 4.6, l + 3, u + du + 1, v - 4, l + 7);
          chairs[i].seat.set(u + du - 1, v - 4.6, l, u + du + 1, v - 2.6, l + 3);
        });
        legs[0].set(u + 3.2, v - 0.8, l, u + 3.8, v + 2.8, l + 5.5);
        legs[1].set(u - 3.8, v - 0.8, l, u - 3.2, v + 2.8, l + 5.5);
        top.set(u - 4.2, v - 1.4, l + 5.5, u + 4.2, v + 3.4, l + 6.5);
      };
    },
    // A folded newspaper standing like a tent, its fold along u; a
    // masthead and lines of type on the side facing the viewer.
    press(g) {
      const far = face(g, 'lf-solid'), near = face(g, 'lf-solid');
      const mast = line(g, 'lf-line lf-strong');
      const cols = [0, 1, 2, 3].map(() => line(g, 'lf-line lf-faint'));
      return (u, v, l) => {
        const u0 = u - 3.8, u1 = u + 3.8, H = 7, W = 3.4;
        far([[u0, v, l + H], [u1, v, l + H], [u1, v - W, l], [u0, v - W, l]]);
        near([[u0, v, l + H], [u1, v, l + H], [u1, v + W, l], [u0, v + W, l]]);
        const at = (t, du) => [u + du, v + W * t, l + H * (1 - t)];
        mast(at(0.18, -3), at(0.18, 3));
        cols.forEach((c, i) => c(at(0.4 + i * 0.14, -3), at(0.4 + i * 0.14, i === 3 ? 0.5 : 3)));
      };
    },
    // A small stack of sheets, a little askew; a title and lines of text
    // on the top one.
    paper(g) {
      const turns = [0.14, -0.1, 0.03];                 // each sheet's turn, radians
      const sheets = turns.map(() => face(g, 'lf-solid lf-sheet'));
      const title = line(g, 'lf-line');
      const text = [0, 1, 2, 3].map(() => line(g, 'lf-line lf-faint'));
      return (u, v, l) => {
        const turn = (a, du, dv, h) => [u + du * Math.cos(a) - dv * Math.sin(a), v + du * Math.sin(a) + dv * Math.cos(a), h];
        turns.forEach((a, i) => {
          const h = l + 0.6 + i * 0.8;
          sheets[i]([[-2.8, -3.8], [2.8, -3.8], [2.8, 3.8], [-2.8, 3.8]].map(([du, dv]) => turn(a, du, dv, h)));
        });
        const top = (du, dv) => turn(turns[2], du, dv, l + 0.6 + 2 * 0.8 + 0.05);
        title(top(-1.8, -2.6), top(1.8, -2.6));
        text.forEach((t, i) => t(top(-1.8, -1 + i * 1.2), top(i === 3 ? 0 : 1.8, -1 + i * 1.2)));
      };
    }
  };

  // Farther = larger u, smaller v: build in that order.
  const groups = [];
  items.map((_, i) => i)
    .sort((a, b) => (items[a].v - items[a].u) - (items[b].v - items[b].u))
    .forEach(i => {
      const g = el('g', {}, svg);
      groups[i] = { g, set: BUILD[items[i].kind](g) };
    });

  // Picking: the object whose middle is nearest on screen, within reach.
  const MID = { talk: 7, panel: 3.5, press: 3.5, paper: 1 };
  const centres = items.map(it => iso(it.u, it.v, MID[it.kind]));

  const when = it => `${MONTHS[it.month - 1]} ${it.year}`;

  interact({
    root, svg,
    count: items.length,
    rest: `${when(items[0])} – ${when(items[items.length - 1])} · ${tally}`,
    describe: i => `${when(items[i])} · ${KINDS[items[i].kind][0]} · ${items[i].text}`,
    pick: (x, y) => {
      let best = -1, dist = 11;
      centres.forEach(([cx, cy], i) => {
        const d = Math.hypot(cx - x, cy - y);
        if (d < dist) { best = i; dist = d; }
      });
      return best;
    },
    draw: (glow, active) => {
      const it = items[active];
      items.forEach((item, i) => {
        groups[i].set(item.u, item.v, LIFT * glow[i]);
        groups[i].g.classList.toggle('is-lit', i === active);
        cells[i].classList.toggle('is-lit', i === active);
      });
      yearLabels.forEach((t, r) => t.classList.toggle('is-lit', !!it && it.r === r));
      monthLabels.forEach((t, m) => t.classList.toggle('is-lit', !!it && it.month === m + 1));
    }
  });
})();
