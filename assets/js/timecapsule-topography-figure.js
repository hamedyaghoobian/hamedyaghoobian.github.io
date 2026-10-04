// TimeCapsule bias topography (projects/timecapsule-18th-century-llm.md):
// the paper's 50 terms of empire, class, industry and nature, laid out by
// t-SNE for each model side by side. Coordinates were recomputed from the
// study's embeddings with the paper's settings (cosine, perplexity 30,
// PCA init, seed 42); the layout differs in detail from the printed
// figure, the neighbourhoods hold. Hovering a term finds it in both maps
// and names its three closest terms by cosine similarity in each model.

(function () {
  const root = document.getElementById('topography-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

  const DATA = {"words":["native","savage","empire","colony","progress","industry","civilization","barbarous","heathen","primitive","backward","enlightened","christian","infidel","missionary","conquest","dominion","subject","servant","poor","working","gentleman","lady","peasant","labourer","master","slave","negro","hindoo","irish","gypsy","steam","railway","manufacture","machine","telegraph","factory","commerce","trade","improvement","science","invention","modern","nature","natural","organic","earth","land","rural","agricultural"],"cat":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3],"tc":{"xy":[[-0.85,4.34],[-0.98,3.6],[-0.04,0.84],[-0.22,1.3],[0.89,0.43],[0.65,1.28],[0.34,0.9],[-1.14,4.04],[-1.65,3.3],[-1.32,4.77],[-1.73,4.97],[-1.7,4.13],[-1.76,3.52],[-1.52,3.71],[-1.46,2.92],[0.67,0.44],[0.55,0.43],[-0.23,0.56],[-1.2,1.6],[-0.58,3.47],[0.66,2.6],[-1.23,1.58],[-1.33,1.67],[-0.85,2.76],[-0.94,1.9],[-1.25,1.59],[-0.45,2.52],[-0.83,2.92],[-0.44,-0.69],[-1.0,-0.09],[-0.55,-0.09],[-1.75,0.36],[1.07,2.11],[0.19,1.5],[-0.11,1.47],[-2.32,1.43],[0.09,2.04],[0.63,1.12],[0.84,1.6],[1.0,0.9],[0.21,1.03],[0.14,0.98],[-1.32,4.64],[0.21,0.39],[-1.18,5.17],[-0.67,5.36],[-0.64,0.88],[-0.59,0.75],[-0.01,4.17],[0.36,4.0]],"nn":[[9,7,27],[7,27,23],[6,16,15],[2,33,6],[39,16,6],[40,37,6],[2,37,40],[1,13,27],[13,27,12],[42,7,0],[9,44,13],[13,9,19],[13,14,8],[8,7,12],[13,27,12],[16,2,6],[15,2,6],[41,40,2],[21,25,24],[27,11,23],[36,33,38],[18,24,22],[21,18,25],[27,24,26],[18,21,27],[18,21,24],[27,23,36],[23,26,1],[30,17,24],[30,2,3],[2,3,29],[32,34,26],[36,34,31],[41,34,3],[41,33,36],[32,14,34],[33,34,3],[6,38,5],[37,33,5],[4,33,37],[6,5,41],[33,34,40],[9,7,13],[40,6,16],[9,42,10],[44,9,49],[2,47,34],[46,3,2],[49,1,7],[48,20,36]]},"bert":{"xy":[[1.1,-3.63],[1.63,-3.38],[0.09,-2.92],[-0.05,-3.53],[-2.16,-3.09],[-1.26,-3.8],[0.15,-3.69],[-0.07,-0.46],[1.06,-0.81],[1.29,-3.86],[2.27,-4.82],[1.13,-0.57],[1.24,-2.4],[1.07,-0.64],[1.13,-2.58],[0.09,-2.58],[0.1,-2.92],[-1.22,-4.84],[2.11,-2.64],[2.49,-4.01],[-1.14,-3.26],[2.32,-2.18],[2.04,-2.23],[2.0,-3.67],[0.06,-1.82],[1.93,-2.42],[2.45,-2.84],[3.04,-2.8],[-0.34,-0.53],[1.11,-1.94],[2.15,-2.98],[-1.25,-2.29],[-1.22,-2.23],[-1.36,-3.83],[-0.81,-3.15],[-1.1,-2.23],[-0.79,-3.51],[-1.66,-3.91],[-1.71,-3.94],[-1.91,-3.02],[-0.79,-4.32],[-1.09,-3.41],[1.79,-5.13],[-0.24,-4.97],[0.88,-4.72],[0.8,-4.45],[0.19,-4.56],[0.1,-4.66],[1.67,-4.41],[1.32,-4.44]],"nn":[[44,45,1],[9,0,23],[16,6,15],[36,16,6],[39,20,37],[36,38,33],[9,2,3],[8,38,13],[13,11,12],[6,1,0],[9,0,42],[13,8,12],[14,8,0],[8,11,12],[12,0,18],[2,16,6],[2,3,15],[40,20,43],[26,25,23],[23,48,49],[33,36,41],[18,22,25],[18,21,25],[48,49,18],[23,5,20],[18,20,21],[18,30,1],[26,1,21],[7,10,1],[0,12,35],[26,23,18],[32,35,34],[35,31,5],[36,5,41],[36,41,40],[32,31,34],[33,5,34],[38,5,49],[37,5,33],[41,4,20],[41,6,43],[34,40,33],[9,44,10],[44,40,45],[0,45,43],[44,0,9],[47,6,45],[46,48,43],[49,23,44],[48,23,45]]}};
  const CATS = ['Colonial/Imperial', 'Social hierarchy', 'Industrial progress', 'Nature/Rural'];
  const KEY = ['progress', 'civilization', 'empire', 'savage', 'slave'];
  const PANELS = [
    { key: 'tc', title: 'TimeCapsule (1800–1875)', x: 0 },
    { key: 'bert', title: 'BERT (modern)', x: 310 }
  ];
  const PW = 290, PH = 230, TOP = 26;

  const svg = makeSvg(root, '0 0 600 290',
    'Two t-SNE maps of 50 terms. In TimeCapsule, "progress" sits beside "conquest" and "dominion"; in modern BERT, beside "improvement", "trade" and "commerce".');

  // A shape per category, so the maps need no colour.
  function shape(parent, c, x, y, r) {
    if (c === 0) return el('circle', { class: 'lf-solid', cx: x, cy: y, r }, parent);
    if (c === 1) return el('rect', { class: 'lf-solid', x: x - r * 0.9, y: y - r * 0.9, width: r * 1.8, height: r * 1.8 }, parent);
    if (c === 2) return el('polygon', { class: 'lf-solid', points: `${x},${y - r * 1.15} ${x + r},${y + r * 0.75} ${x - r},${y + r * 0.75}` }, parent);
    return el('polygon', { class: 'lf-solid', points: `${x},${y - r * 1.2} ${x + r},${y} ${x},${y + r * 1.2} ${x - r},${y}` }, parent);
  }

  const n = DATA.words.length;
  const dots = PANELS.map(p => {
    const xy = DATA[p.key].xy;
    const xs = xy.map(q => q[0]), ys = xy.map(q => q[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const pad = 14;
    const sx = v => p.x + pad + (v - x0) / (x1 - x0) * (PW - 2 * pad);
    const sy = v => TOP + pad + (y1 - v) / (y1 - y0) * (PH - 2 * pad);

    el('rect', { class: 'lf-line lf-faint', x: p.x, y: TOP, width: PW, height: PH, rx: 4 }, svg);
    const title = el('text', { class: 'lf-label lf-label--head', x: p.x + PW / 2, y: TOP - 9, 'text-anchor': 'middle' }, svg);
    title.textContent = p.title;

    return xy.map(([vx, vy], i) => {
      const g = el('g', { class: 'tg-dot' }, svg);
      const x = sx(vx), y = sy(vy);
      shape(g, DATA.cat[i], x, y, 3.4);
      const label = el('text', { class: 'lf-label', x: x + 6, y: y + 3.5 }, g);
      label.textContent = DATA.words[i];
      label.style.display = KEY.includes(DATA.words[i]) ? '' : 'none';
      return { g, label, x, y };
    });
  });

  // Key.
  CATS.forEach((name, c) => {
    const x = 6 + c * 150, y = TOP + PH + 22;
    shape(svg, c, x, y - 3.5, 3.4);
    const t = el('text', { class: 'lf-label', x: x + 8, y }, svg);
    t.textContent = name;
  });

  const near = (key, i) => DATA[key].nn[i].map(j => DATA.words[j]).join(', ');

  interact({
    root, svg,
    count: n,
    rest: 'Hover a term to find it in both maps',
    describe: i => `“${DATA.words[i]}” · closest by cosine — TimeCapsule: ${near('tc', i)} · BERT: ${near('bert', i)}`,
    // The nearest dot in whichever map the pointer is over.
    pick: (x, y) => {
      const p = x < PANELS[1].x ? 0 : 1;
      let best = -1, dist = 18;
      dots[p].forEach((d, i) => {
        const dd = Math.hypot(d.x - x, d.y - y);
        if (dd < dist) { best = i; dist = dd; }
      });
      return best;
    },
    draw: (glow, active) => {
      const related = new Set();
      if (active >= 0) PANELS.forEach(pn => DATA[pn.key].nn[active].forEach(j => related.add(pn.key + j)));
      dots.forEach((panel, p) => panel.forEach((d, i) => {
        const on = i === active;
        const rel = related.has(PANELS[p].key + i);
        d.g.classList.toggle('is-lit', on || rel);
        d.g.classList.toggle('lf-faint', active >= 0 && !on && !rel);
        d.label.style.display = on || rel || (active < 0 && KEY.includes(DATA.words[i])) ? '' : 'none';
        d.label.classList.toggle('lf-label--head', on);
        // The picked term's label sits above its dot, clear of neighbours'.
        d.label.setAttribute('x', on ? d.x : d.x + 6);
        d.label.setAttribute('y', on ? d.y - 7 : d.y + 3.5);
        d.label.setAttribute('text-anchor', on ? 'middle' : 'start');
        if (on) d.g.parentNode.appendChild(d.g);
      }));
    }
  });
})();
