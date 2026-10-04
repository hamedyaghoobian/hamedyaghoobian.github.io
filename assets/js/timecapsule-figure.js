// TimeCapsule (projects/timecapsule-18th-century-llm.md): the model's
// whole world is a shelf of volumes from 1800 to 1875 that ends at a cliff.
// Past the edge, to scale, the ground runs on to 1969 with the paper's
// eight post-1875 technologies standing on it in dashed outline (dates as
// in the paper's horizon figure). For the three the page probes —
// airplane, computer, internet — the caption quotes how TimeCapsule
// completes them.

(function () {
  const root = document.getElementById('timecapsule-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, edgeLabel, nearest, interact } = window.LineFigure;

  const START = 1800;
  const CLIFF = 1875;
  const END = 1980;
  const YR = 1.5;                      // world units per year, both sides
  const uOf = year => (year - START) * YR;

  // Dates and notes from the paper (generate_paper_figures.py and
  // epistemological_comparison.json); quotes from the page's own table.
  // Each object is a few boxes [u0, v0, h0, u1, v1, h1] in local units
  // around its year. The three just past the cliff stand in rows stepping
  // toward the viewer, clear of the shelf's last volumes and of each other;
  // radio and television, seven years apart, take front and back rows.
  const TECH = [
    {
      name: 'Telephone', year: 1876, note: 'Bell’s patent',
      // a candlestick phone: base, stem, mouthpiece, hung receiver
      parts: [[-1, 24, 0, 3, 30, 2], [0.4, 26.4, 2, 1.6, 27.6, 16], [-0.6, 25.4, 16, 2.6, 28.6, 18.5], [3, 26, 8, 4.2, 28, 14]]
    },
    {
      name: 'Electric light', year: 1879, note: 'Edison’s practical bulb',
      // a bulb on its screw base
      parts: [[-1.4, 36.2, 0, 1.4, 39, 3.5], [-2.6, 35, 3.5, 2.6, 40.2, 5.5], [-3.6, 34, 5.5, 3.6, 41.2, 11], [-2.4, 35.2, 11, 2.4, 40, 13.5]]
    },
    {
      name: 'Automobile', year: 1886, note: 'Benz Patent-Motorwagen',
      // the three-wheeler: body, seat back, two rear wheels, one front
      parts: [[-7, 42, 3.5, 7, 49, 7], [1, 42.5, 7, 3.5, 48.5, 12], [-6, 41, 0, -1, 42, 5], [-6, 49, 0, -1, 50, 5], [5.5, 45, 0, 9.5, 46, 4]]
    },
    {
      name: 'Airplane', year: 1903, note: 'TimeCapsule: “quite useless in open air… an air-pump”',
      // fuselage, wing, tail fin, flying
      parts: [[-12, 12, 18, 14, 18, 23], [-4, -3, 21, 3, 33, 22.5], [-12, 13.5, 23, -8, 16.5, 31]]
    },
    {
      name: 'Radio', year: 1920,
      // a cabinet set: case, rounded top, speaker on the near face
      parts: [[-4, 30, 0, 4, 38, 9], [-3, 31, 9, 3, 37, 12], [-2.5, 38, 3, 2.5, 38.6, 7]]
    },
    {
      name: 'Television', year: 1927, note: 'Farnsworth',
      // a cabinet with its screen on the near face
      parts: [[-6, 2, 0, 6, 12, 14], [-4, 12, 4, 4, 12.7, 11]]
    },
    {
      name: 'Computer', year: 1945, note: 'TimeCapsule: “the right lung is enlarged and hypertrophied”',
      // a cabinet
      parts: [[-7, 8, 0, 7, 28, 30]]
    },
    {
      name: 'Internet', year: 1969, note: 'TimeCapsule: “the sea, and the sea is its great enemy”',
      // three nodes, linked
      parts: [[-12, 4, 0, -5, 11, 7], [3, 17, 0, 10, 24, 7], [-10, 30, 0, -3, 37, 7]],
      links: [[0, 1], [1, 2]]
    }
  ];

  const D = 30;                        // depth of the shelf
  const DT = 50;                       // depth of the ground past it
  const T = 12;                        // the shelf's edge, a cliff
  const BOOKS = 22;
  const BW = 3.4;                      // a volume's thickness along u
  const LIFT = 6;                      // how far a lit thing rises
  const L = uOf(CLIFF);

  const svg = makeSvg(root, '-14 -190 312 252',
    'A shelf of Victorian volumes from 1800 to 1875 ending at a cliff. Beyond it, to scale and in dashed outline: a telephone (1876), an electric light bulb (1879), a three-wheeled automobile (1886), an airplane (1903), a radio (1920), a television (1927), a computer cabinet (1945) and linked network nodes (1969) — things the model cannot know.');

  // Terra incognita: the ground past the edge, only outlined, with ticks.
  el('polygon', {
    class: 'lf-ghost lf-line',
    points: pts([iso(L + 1, 0), iso(uOf(END), 0), iso(uOf(END), DT), iso(L + 1, DT)])
  }, svg);
  [1900, 1950].forEach(year => {
    const [x, y] = iso(uOf(year), DT);
    el('line', { class: 'lf-line lf-faint', x1: x, y1: y, x2: x, y2: y + 4 }, svg);
    edgeLabel(svg, year, uOf(year) + 1.7, DT, -13);
  });

  // Farthest first, so nearer things overlap them.
  const marks = [];
  for (let i = TECH.length - 1; i >= 0; i--) {
    const t = TECH[i];
    const g = el('g', { class: 'lf-ghost' }, svg);
    marks[i] = {
      g,
      parts: t.parts.map(() => box(g, '')),
      links: (t.links || []).map(() => el('line', { class: 'lf-line' }, g))
    };
  }

  // The shelf and its cliff, then the volumes on it, farthest first.
  box(svg, 'lf-solid').set(0, 0, -T, L, D, 0);
  edgeLabel(svg, '1800', 2, D, -T - 11);
  edgeLabel(svg, '1875', L - 16, D, -T - 11);
  const shelf = el('g', {}, svg);
  const books = [];
  for (let i = BOOKS - 1; i >= 0; i--) books[i] = box(shelf, 'lf-solid');
  const bookH = i => 16 + ((i * 37) % 13);

  const shelfEnd = iso(L - 2, D / 2)[0];
  const techX = TECH.map(t => {
    const vs = t.parts.map(q => (q[1] + q[4]) / 2);
    return iso(uOf(t.year), vs.reduce((a, b) => a + b) / vs.length)[0];
  });
  const past = year => {
    const n = year - CLIFF;
    return `${n} year${n === 1 ? '' : 's'} past the horizon`;
  };

  interact({
    root, svg,
    count: TECH.length + 1,
    rest: 'Trained on 1800–1875 · nothing after it exists for the model',
    describe: i => {
      if (i === 0) return '1800–1875 · 136,302 documents, 16.06 billion words · everything it has read';
      const t = TECH[i - 1];
      return `${t.name} · ${t.year}, ${past(t.year)}` + (t.note ? ` · ${t.note}` : '');
    },
    // Anywhere over the shelf picks it; past the cliff, the nearest date.
    pick: x => {
      if (x < shelfEnd) return 0;
      const i = nearest(x, techX, 25);
      return i < 0 ? -1 : i + 1;
    },
    draw: (glow, active) => {
      books.forEach((b, i) => {
        const u = i * (L / BOOKS) + 1;
        b.set(u, 8, 0, u + BW, 22, bookH(i) + LIFT * glow[0]);
      });
      shelf.classList.toggle('is-lit', active === 0);
      TECH.forEach((t, i) => {
        const m = marks[i];
        const lift = LIFT * glow[i + 1];
        const at = uOf(t.year);
        m.parts.forEach((p, j) => {
          const [a, b, c, d, e, f] = t.parts[j];
          p.set(at + a, b, c + lift, at + d, e, f + lift);
        });
        (t.links || []).forEach(([p, q], n) => {
          const centre = k => {
            const [a, b, , d, e] = t.parts[k];
            return iso(at + (a + d) / 2, (b + e) / 2, 4 + lift);
          };
          const [x1, y1] = centre(p), [x2, y2] = centre(q);
          m.links[n].setAttribute('x1', x1); m.links[n].setAttribute('y1', y1);
          m.links[n].setAttribute('x2', x2); m.links[n].setAttribute('y2', y2);
        });
        m.g.classList.toggle('is-lit', active === i + 1);
      });
    }
  });
})();
