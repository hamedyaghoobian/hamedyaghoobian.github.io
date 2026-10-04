// Walter Benjamin's correspondence (projects/walter-benjamin.md): the 326
// letters in the dataset, one sheet each, stacked by year from 1910 to
// 1940. Exile, from 1933, is shaded on the plate. Counts and places are
// real, taken from the letters dataset (Date and City columns, City being
// where Benjamin wrote from; letters with no place are counted but not
// named).

(function () {
  const root = document.getElementById('benjamin-figure');
  if (!root || !window.LineFigure) return;
  const { iso, pts, el, svg: makeSvg, box, edgeLabel, nearest, interact } = window.LineFigure;

  // [year, letters, place most written from, letters from there]
  const YEARS = [
    [1910, 3, 'St. Moritz', 2], [1911, 3, 'Wengen', 2], [1912, 3, 'Freiburg', 2],
    [1913, 20, 'Freiburg', 14], [1914, 8, 'Berlin', 8], [1915, 6, 'Berlin', 3],
    [1916, 4, 'Munich', 3], [1917, 12, 'Bern', 5], [1918, 13, 'Bern', 6],
    [1919, 13, 'Bern', 5], [1920, 8, 'Berlin', 2], [1921, 17, 'Heidelberg', 4],
    [1922, 3, 'Berlin', 1], [1923, 14, 'Berlin', 11], [1924, 12, 'Berlin', 6],
    [1925, 10, 'Berlin', 6], [1926, 10, 'Paris', 6], [1927, 8, 'Berlin', 4],
    [1928, 14, 'Berlin', 12], [1929, 11, 'Berlin', 7], [1930, 6, 'Berlin', 3],
    [1931, 7, 'Berlin', 4], [1932, 5, 'Ibiza', 3], [1933, 16, 'Ibiza', 8],
    [1934, 19, 'Svendborg', 8], [1935, 22, 'Paris', 14], [1936, 12, 'Paris', 8],
    [1937, 8, 'Paris', 5], [1938, 14, 'Paris', 8], [1939, 18, 'Paris', 13],
    [1940, 7, 'Lourdes', 4]
  ];
  const EXILE = 1933;

  const STEP = 9;                      // world units per year
  const W = 6;                         // a sheet's length along time
  const V0 = 9, V1 = 21;               // a sheet's span across the plate
  const D = 30;                        // plate depth
  const T = 6;                         // plate thickness
  const GAP = 2.6;                     // sheet spacing in a closed stack
  const FAN = 0.5;                     // how far a lit stack fans open
  const L = YEARS.length * STEP;
  const uOf = i => i * STEP;

  const svg = makeSvg(root, '-14 -200 300 245',
    'Walter Benjamin\'s 326 letters from 1910 to 1940, stacked by year. The stacks peak in 1913, rise again in the early 1920s, and are tallest in exile, from 1933, with 22 letters in 1935.');

  box(svg, 'lf-solid').set(-STEP / 2, 0, -T, L, D, 0);
  const exileAt = YEARS.findIndex(y => y[0] === EXILE);
  const exile = el('polygon', {
    class: 'lf-shade',
    points: pts([iso(uOf(exileAt) - 1.5, 0), iso(L, 0), iso(L, D), iso(uOf(exileAt) - 1.5, D)])
  }, svg);

  [1910, 1920, 1933, 1940].forEach(year => {
    const u = uOf(year - 1910) + W / 2;
    const [x, y] = iso(u, D, -T);
    el('line', { class: 'lf-line', x1: x, y1: y, x2: x, y2: y + 4 }, svg);
    edgeLabel(svg, year, u + 1.7, D, -T - 13);
  });

  // Farther stacks first, so nearer ones overlap them.
  const stacks = YEARS.map(() => null);
  for (let i = YEARS.length - 1; i >= 0; i--) {
    const g = el('g', {}, svg);
    stacks[i] = Array.from({ length: YEARS[i][1] }, () => el('polygon', { class: 'lf-solid lf-sheet' }, g));
    stacks[i].group = g;
  }

  const stackX = YEARS.map((_, i) => iso(uOf(i) + W / 2, (V0 + V1) / 2)[0]);

  interact({
    root, svg,
    count: YEARS.length,
    rest: '326 letters, 1910–1940 · shaded: exile, from 1933',
    describe: i => {
      const [year, n, place, fromPlace] = YEARS[i];
      return `${year} · ${n} letter${n === 1 ? '' : 's'} · ${fromPlace} from ${place}`;
    },
    pick: x => nearest(x, stackX, STEP * 0.6),
    draw: (glow, active) => {
      YEARS.forEach((_, i) => {
        const gap = GAP * (1 + FAN * glow[i]);
        const u0 = uOf(i), u1 = u0 + W;
        stacks[i].forEach((sheet, k) => {
          const h = k * gap;
          sheet.setAttribute('points', pts([iso(u0, V0, h), iso(u1, V0, h), iso(u1, V1, h), iso(u0, V1, h)]));
        });
        stacks[i].group.classList.toggle('is-lit', i === active);
      });
      exile.classList.toggle('is-lit', active >= exileAt);
    }
  });
})();
