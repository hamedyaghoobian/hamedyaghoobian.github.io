// Walter Benjamin's correspondence (projects/walter-benjamin.md): the 326
// letters in the dataset, one sheet each, piled by year from 1910 to
// 1940, drawn flat as a front elevation. Exile, from 1933, is shaded on
// the plate. Counts and places are real, taken from the letters dataset
// (Date and City columns, City being where Benjamin wrote from; letters
// with no place are counted but not named).

(function () {
  const root = document.getElementById('benjamin-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, rect, line, nearest, interact } = window.LineFigure;

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

  // A front elevation: a plate along time, and on it a pile of sheets per
  // year seen edge-on, one hairline a letter.
  const STEP = 9;                      // viewBox units per year
  const W = 6;                         // a sheet's width along time
  const T = 5;                         // the plate's height
  const GAP = 2.4;                     // sheet spacing in a closed pile
  const FAN = 0.5;                     // how far a lit pile fans open
  const L = YEARS.length * STEP;
  const xOf = i => i * STEP;

  const svg = makeSvg(root, '-12 -92 300 116',
    'Walter Benjamin\'s 326 letters from 1910 to 1940, piled by year. The piles peak in 1913, rise again in the early 1920s, and are tallest in exile, from 1933, with 22 letters in 1935.');

  rect(svg, -STEP / 2, 0, L + STEP / 2, T);
  const exileAt = YEARS.findIndex(y => y[0] === EXILE);
  const exile = rect(svg, xOf(exileAt) - 1.5, 0, L - xOf(exileAt) + 1.5, T, 'lf-shade');

  [1910, 1920, 1933, 1940].forEach(year => {
    const x = xOf(year - 1910) + W / 2;
    line(svg, x, T, x, T + 4);
    const t = el('text', { class: 'lf-text', x, y: T + 14, 'text-anchor': 'middle' }, svg);
    t.textContent = year;
  });

  const stacks = YEARS.map((y, i) => {
    const g = el('g', {}, svg);
    const sheets = Array.from({ length: y[1] }, () => line(g, xOf(i), 0, xOf(i) + W, 0, 'lf-line lf-sheet'));
    return { g, sheets };
  });

  const stackX = YEARS.map((_, i) => xOf(i) + W / 2);

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
        stacks[i].sheets.forEach((sheet, k) => {
          const y = (-(k + 1) * gap).toFixed(2);
          sheet.setAttribute('y1', y);
          sheet.setAttribute('y2', y);
        });
        stacks[i].g.classList.toggle('is-lit', i === active);
      });
      exile.classList.toggle('is-lit', active >= exileAt);
    }
  });
})();
