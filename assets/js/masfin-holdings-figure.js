// MASFIN (projects/multi-agents-llm-financial-trading-framework.md): what
// the crews actually held during the eight live weeks. Every stock that
// passed through the portfolio is a row; in each week it was held, a bar
// whose thickness is its allocation, joined to the next week it stayed.
// Rows are ordered by how long a stock lasted, so the five held from first
// week to last stand at the top and the one-week visitors at the bottom.
// Under the holdings, each week's return: MASFIN's bar against the three
// indexes' ticks.
//
// What the text does not show: how much the portfolio turned over (44
// stocks through a 15–24 stock portfolio), which picks lasted, and how each
// week's return sat against each index (MASFIN beat each of them in five
// weeks of eight). Point at a week to see what came in, what went out and
// how it did; point at a stock to follow it. Data: the project's own
// portfolio and returns sheets (scripts/masfin_data.py).

(function () {
  const root = document.getElementById('masfin-figure');
  if (!root || !window.MASFIN || !window.LineFigure) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const D = window.MASFIN, H = D.holdings, W = H.length;
  const IDX = ['S&P 500', 'NASDAQ-100', 'Dow Jones'];

  // Every stock ever held: weeks held, first week, average weight.
  const tick = {};
  H.forEach((wk, w) => Object.entries(wk).forEach(([t, a]) => {
    (tick[t] = tick[t] || { t, weeks: [], w: {} }).weeks.push(w);
    tick[t].w[w] = a;
  }));
  const rows = Object.values(tick).sort((a, b) =>
    b.weeks.length - a.weeks.length || a.weeks[0] - b.weeks[0] ||
    Object.values(b.w).reduce((s, v) => s + v, 0) / b.weeks.length - Object.values(a.w).reduce((s, v) => s + v, 0) / a.weeks.length);
  const N = rows.length;

  // ── Layout ──────────────────────────────────────────────────────────
  const X0 = 64, X1 = 716, CW = (X1 - X0) / W, BW = CW - 18;
  const TOP = 44, RH = 11, YH = TOP + N * RH;     // holdings rows
  const R0 = YH + 34, RHt = 92;                     // returns panel
  const LO = -4, HI = 5;
  const colX = w => X0 + CW * w + CW / 2;
  const rowY = i => TOP + RH * i + RH / 2;
  const thick = a => 1 + a * 0.5;                  // allocation % → bar height
  const ry = v => R0 + (HI - v) / (HI - LO) * RHt;
  const pct = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2) + '%';
  const short = s => s.replace('June', 'Jun').replace('July', 'Jul').replace('August', 'Aug').replace(' to ', '–');

  const svg = makeSvg(root, `0 0 760 ${R0 + RHt + 44}`,
    `A chart of the ${N} stocks MASFIN held over its eight live weeks: one row per stock, a bar in each week it was held with thickness by allocation; five stocks were held all eight weeks. Below, each week's return for MASFIN against the S&P 500, NASDAQ-100 and Dow Jones.`);
  svg.classList.add('mh-figure');

  // Week columns: a faint band per week to point at, its name above.
  const cols = [];
  for (let w = 0; w < W; w++) {
    const g = el('g', { class: 'mh-col', 'data-w': w }, svg);
    el('rect', { class: 'mh-colbg', x: X0 + CW * w + 2, y: 6, width: CW - 4, height: R0 + RHt + 22 }, g);
    el('text', { class: 'mh-week', x: colX(w), y: 19, 'text-anchor': 'middle' }, g).textContent = `Week ${w + 1}`;
    el('text', { class: 'mh-date', x: colX(w), y: 33, 'text-anchor': 'middle' }, g).textContent = short(D.dates[w]);
    cols.push(g);
  }

  // Holdings: a row per stock.
  const rowEls = rows.map((r, i) => {
    const g = el('g', { class: 'mh-row' + (r.weeks.length === W ? ' is-core' : ''), 'data-t': r.t }, svg);
    const y = rowY(i);
    el('rect', { class: 'mh-rowbg', x: 4, y: y - RH / 2, width: X1 + 36, height: RH }, g);
    el('text', { class: 'mh-tick', x: X0 - 8, y: y + 3.4, 'text-anchor': 'end' }, g).textContent = r.t;
    // joins between consecutive weeks held
    r.weeks.forEach((w, k) => {
      if (r.weeks[k + 1] === w + 1) el('line', { class: 'mh-join', x1: colX(w) + BW / 2, x2: colX(w + 1) - BW / 2, y1: y, y2: y }, g);
    });
    const bars = {};
    r.weeks.forEach(w => {
      const h = thick(r.w[w]);
      bars[w] = el('rect', { class: 'mh-bar', x: colX(w) - BW / 2, y: y - h / 2, width: BW, height: h, rx: Math.min(1.5, h / 2) }, g);
    });
    el('text', { class: 'mh-count', x: X1 + 10, y: y + 3.4 }, g).textContent = r.weeks.length;
    return { g, r, bars, y };
  });
  el('text', { class: 'mh-date', x: X1 + 4, y: 33, 'text-anchor': 'start' }, svg).textContent = 'weeks';
  el('line', { class: 'mh-rule', x1: X0, x2: X1, y1: TOP + 5 * RH, y2: TOP + 5 * RH }, svg);

  // Marks for the stocks a week let go: a small cross where the bar was.
  const outs = el('g', { class: 'mh-outs' }, svg);

  // Returns: MASFIN's bar, the three indexes as ticks.
  el('line', { class: 'mh-zero', x1: X0, x2: X1, y1: ry(0), y2: ry(0) }, svg);
  [-4, -2, 2, 4].forEach(v => {
    el('line', { class: 'mh-grid', x1: X0, x2: X1, y1: ry(v), y2: ry(v) }, svg);
    el('text', { class: 'mh-date', x: X0 - 8, y: ry(v) + 3, 'text-anchor': 'end' }, svg).textContent = (v > 0 ? '+' : '−') + Math.abs(v) + '%';
  });
  el('text', { class: 'mh-date', x: X0 - 8, y: ry(0) + 3, 'text-anchor': 'end' }, svg).textContent = '0';
  el('text', { class: 'mh-week', x: 4, y: R0 - 12 }, svg).textContent = 'Weekly return';
  const DASH = { 'S&P 500': '', 'NASDAQ-100': '3 2', 'Dow Jones': '1 1.6' };
  const retEls = D.returns.MASFIN.map((m, w) => {
    const g = el('g', { class: 'mh-ret' }, svg);
    el('rect', { class: 'mh-mbar', x: colX(w) - 9, width: 18, y: Math.min(ry(m), ry(0)), height: Math.abs(ry(m) - ry(0)) }, g);
    IDX.forEach(k => el('line', { class: 'mh-itick', x1: colX(w) - 20, x2: colX(w) + 20, y1: ry(D.returns[k][w]), y2: ry(D.returns[k][w]), 'stroke-dasharray': DASH[k] }, g));
    el('text', { class: 'mh-rval', x: colX(w), y: R0 + RHt + 17, 'text-anchor': 'middle' }, g).textContent = pct(m);
    return g;
  });
  // the key, under the bars
  const kx = X0, ky = R0 + RHt + 36;
  el('rect', { class: 'mh-mbar', x: kx, y: ky - 7, width: 10, height: 8 }, svg);
  el('text', { class: 'mh-date', x: kx + 14, y: ky }, svg).textContent = 'MASFIN';
  IDX.forEach((k, i) => {
    const x = kx + 80 + i * 110;
    el('line', { class: 'mh-itick', x1: x, x2: x + 18, y1: ky - 3, y2: ky - 3, 'stroke-dasharray': DASH[k] }, svg);
    el('text', { class: 'mh-date', x: x + 22, y: ky }, svg).textContent = k;
  });

  // ── The caption ─────────────────────────────────────────────────────
  const readout = document.getElementById(root.id + '-readout');
  const compound = k => (D.returns[k].reduce((p, v) => p * (1 + v / 100), 1) - 1) * 100;
  const wins = k => D.returns.MASFIN.filter((m, w) => m > D.returns[k][w]).length;
  const core = rows.filter(r => r.weeks.length === W).map(r => r.t);
  const list = (a, n = 6) => (a.length > n ? a.slice(0, n).join(', ') + ` +${a.length - n}` : a.join(', '));
  const rest = `${N} stocks over ${W} weeks; ${core.length} held throughout (${core.join(', ')}) · compounded: MASFIN ${pct(compound('MASFIN'))}, S&P ${pct(compound('S&P 500'))}, NASDAQ ${pct(compound('NASDAQ-100'))}, Dow ${pct(compound('Dow Jones'))} · MASFIN beat each index in ${wins('S&P 500')} of ${W} weeks`;
  function say(t) { if (readout) readout.textContent = t; }

  // ── Picking a week or a stock ────────────────────────────────────────
  let wk = -1, tk = null;
  function show() {
    svg.classList.toggle('mh-picking', wk >= 0 || tk !== null);
    cols.forEach((g, w) => g.classList.toggle('is-on', w === wk));
    retEls.forEach((g, w) => g.classList.toggle('is-on', w === wk));
    outs.replaceChildren();
    rowEls.forEach(R => R.g.classList.remove('is-gone'));
    rowEls.forEach(R => {
      const lit = tk === R.r.t || (wk >= 0 && R.r.w[wk] !== undefined);
      R.g.classList.toggle('is-on', lit);
      Object.entries(R.bars).forEach(([w, b]) => b.classList.toggle('is-new', wk >= 0 && +w === wk && wk > 0 && R.r.w[wk - 1] === undefined));
    });
    if (wk > 0) {
      const gone = Object.keys(H[wk - 1]).filter(t => H[wk][t] === undefined);
      gone.forEach(t => {
        const R = rowEls.find(x => x.r.t === t), x = colX(wk);
        el('path', { class: 'mh-out', d: `M${x - 3} ${R.y - 3} L${x + 3} ${R.y + 3} M${x + 3} ${R.y - 3} L${x - 3} ${R.y + 3}` }, outs);
        R.g.classList.add('is-gone');
      });
    }
    if (wk >= 0) {
      const now = Object.keys(H[wk]), prev = wk ? Object.keys(H[wk - 1]) : [];
      const inn = wk ? now.filter(t => !prev.includes(t)) : now, out = prev.filter(t => !now.includes(t));
      const r = D.returns;
      say(`Week ${wk + 1} · ${D.dates[wk]} · ${now.length} stocks` + (wk ? ` · in: ${inn.length ? list(inn) : 'none'} · out: ${out.length ? list(out) : 'none'}` : '') +
        ` · MASFIN ${pct(r.MASFIN[wk])}, S&P ${pct(r['S&P 500'][wk])}, NASDAQ ${pct(r['NASDAQ-100'][wk])}, Dow ${pct(r['Dow Jones'][wk])}`);
    } else if (tk) {
      const R = tick[tk];
      say(`${tk} · held ${R.weeks.length} of ${W} weeks · ` + H.map((_, w) => (R.w[w] === undefined ? '–' : R.w[w].toFixed(1) + '%')).join(' → '));
    } else say(rest);
  }
  svg.querySelectorAll('.mh-rowbg').forEach(n => { n.style.pointerEvents = 'all'; });
  svg.addEventListener('pointermove', e => {
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    const w = Math.floor((q.x - X0) / CW), i = Math.floor((q.y - TOP) / RH);
    // over a stock's name or its row: follow the stock; elsewhere in a column: the week
    if (q.x < X0 && i >= 0 && i < N) { tk = rows[i].t; wk = -1; }
    else if (w >= 0 && w < W) { wk = w; tk = null; }
    else { wk = -1; tk = null; }
    show();
  });
  svg.addEventListener('pointerleave', () => { wk = -1; tk = null; show(); });
  root.tabIndex = 0;
  root.addEventListener('keydown', e => {
    const s = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (s) { e.preventDefault(); tk = null; wk = wk < 0 ? (s > 0 ? 0 : W - 1) : Math.max(0, Math.min(W - 1, wk + s)); show(); }
    else if (e.key === 'Escape') { wk = -1; tk = null; show(); }
  });
  root.addEventListener('blur', () => { wk = -1; tk = null; show(); });
  show();
})();
