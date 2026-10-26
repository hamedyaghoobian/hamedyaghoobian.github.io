// AI Seasons (projects/ai-seasons.md): what the 2024 scrapers gathered.
// A row per source and a column per year; each square's area is the number
// of documents that source gave for that year, and the total stands at the
// row's end.
//
// What the text does not show: how uneven the collection is in time. The
// Verge runs evenly from 2011, The Next Web thins out after 2012, PubMed
// Central arrives almost all at once in 2023–24, and the smaller sources
// are a scatter. That shape decides what the corpus can be asked about any
// one year. Point at a square, a source or a year; ← → steps through the
// years. Data: counts from the corpus (scripts/ai_seasons_corpus.py).
//
// On a narrow screen the chart is redrawn narrower rather than shrunk.

(function () {
  const root = document.getElementById('seasons-figure');
  if (!root || !window.AISEASONS_CORPUS || !window.LineFigure) return;
  const { el, svg: makeSvg } = window.LineFigure;
  const S = window.AISEASONS_CORPUS.sources, R = S.length;
  const Y0 = 2007, Y1 = 2025, YN = Y1 - Y0 + 1;
  const fmt = n => n.toLocaleString('en-US');
  const words = n => (n >= 1e6 ? `${Math.round(n / 1e6)} million` : fmt(n)) + ' words';

  let on = null, F = null;   // { r, i } — a row, a year, or both; the drawn figure

  function draw(narrow) {
    if (F) F.svg.remove();
    // ── Layout ──────────────────────────────────────────────────────────
    const VW = narrow ? 400 : 760, X0 = narrow ? 104 : 118, X1 = narrow ? 344 : 690, CW = (X1 - X0) / YN;
    const TOP = 30, RH = 30;
    const colX = i => X0 + CW * i + CW / 2;
    const rowY = r => TOP + RH * r + RH / 2;
    const max = Math.max(...S.flatMap(s => Object.values(s.years)));
    const side = n => Math.max(1.6, Math.sqrt(n / max) * (CW - 3));   // area ∝ documents

    const svg = makeSvg(root, `0 0 ${VW} ${TOP + R * RH + 6}`,
      `A chart of the documents the 2024 scrapers gathered: one row per source (${S.map(s => s.name).join(', ')}), one column per year from ${Y0} to ${Y1}, each square sized by the number of documents.`);
    svg.classList.add('ac-figure');
    svg.classList.toggle('ac-narrow', narrow);

    const cols = [];
    for (let i = 0; i < YN; i++) {
      const g = el('g', { class: 'ac-col' }, svg);
      el('rect', { class: 'ac-colbg', x: X0 + CW * i + 1, y: 4, width: CW - 2, height: TOP + R * RH - 2 }, g);
      const y = Y0 + i;
      if (narrow ? y % 4 === 3 : y % 2 === 1 || i === 0) el('text', { class: 'ac-year', x: colX(i), y: 18, 'text-anchor': 'middle' }, g).textContent = y;
      cols.push(g);
    }
    if (!narrow) el('text', { class: 'ac-year', x: VW - 6, y: 18, 'text-anchor': 'end' }, svg).textContent = 'documents';

    const rows = S.map((s, r) => {
      const g = el('g', { class: 'ac-row' }, svg), y = rowY(r);
      el('rect', { class: 'ac-rowbg', x: 0, y: y - RH / 2, width: X0 - 4, height: RH }, g);
      el('line', { class: 'ac-base', x1: X0, x2: X1, y1: y, y2: y }, g);
      el('text', { class: 'ac-name', x: X0 - 10, y: y + 4, 'text-anchor': 'end' }, g).textContent = s.name;
      el('text', { class: 'ac-total', x: VW - 6, y: y + 4, 'text-anchor': 'end' }, g).textContent = fmt(s.docs);
      const cells = {};
      Object.entries(s.years).forEach(([yr, n]) => {
        const i = +yr - Y0;
        if (i < 0 || i >= YN) return;
        const a = side(n);
        cells[i] = el('rect', { class: 'ac-cell', x: colX(i) - a / 2, y: y - a / 2, width: a, height: a }, g);
      });
      return { g, s, cells };
    });

    svg.querySelectorAll('.ac-rowbg, .ac-colbg').forEach(n => { n.style.pointerEvents = 'all'; });
    svg.addEventListener('pointermove', e => {
      const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(svg.getScreenCTM().inverse());
      const r = Math.floor((q.y - TOP) / RH), i = Math.floor((q.x - X0) / CW);
      const inRow = r >= 0 && r < R, inCol = q.x >= X0 && i >= 0 && i < YN;
      const next = inRow && q.x < X0 ? { r } : inCol ? (inRow ? { r, i } : { i }) : null;
      if (JSON.stringify(next) !== JSON.stringify(on)) { on = next; show(); }
    });
    svg.addEventListener('pointerleave', () => { on = null; show(); });
    F = { svg, rows, cols, narrow };
    show();
  }

  // ── The caption ─────────────────────────────────────────────────────
  const readout = document.getElementById(root.id + '-readout');
  function say(t) { if (readout) readout.textContent = t; }
  const docs = S.reduce((a, s) => a + s.docs, 0), allWords = S.reduce((a, s) => a + s.words, 0);
  const early = S.reduce((a, s) => a + Object.entries(s.years).filter(([y]) => +y < Y0).reduce((b, [, n]) => b + n, 0), 0);
  const span = s => { const ys = Object.keys(s.years).map(Number); return ys.length ? `${Math.min(...ys)}–${Math.max(...ys)}` : 'undated'; };
  const rest = `${fmt(docs)} documents, about ${words(allWords)}, from ${R} sources` + (early ? ` (${early} dated before ${Y0}, not drawn)` : '') + '.';

    function show() {
    const { svg, rows, cols } = F;
    svg.classList.toggle('ac-picking', !!on);
    rows.forEach((R_, r) => {
      R_.g.classList.toggle('is-on', !!on && (on.r === r || on.r === undefined));
      Object.entries(R_.cells).forEach(([i, c]) => c.classList.toggle('is-on', !!on && (on.i === undefined || +i === on.i) && (on.r === undefined || on.r === r)));
    });
    cols.forEach((g, i) => g.classList.toggle('is-on', !!on && on.i === i));
    if (!on) return say(rest);
    if (on.r !== undefined && on.i !== undefined) {
      const s = S[on.r], y = Y0 + on.i, n = s.years[y] || 0;
      return say(`${s.name}, ${y}: ${n ? fmt(n) + ' document' + (n > 1 ? 's' : '') : 'nothing gathered'}.`);
    }
    if (on.r !== undefined) {
      const s = S[on.r];
      return say(`${s.name}: ${fmt(s.docs)} documents, ${words(s.words)}, dated ${span(s)}` + (s.undated ? `; ${s.undated} undated` : '') + '.');
    }
    const y = Y0 + on.i, here = S.filter(s => s.years[y]).sort((a, b) => b.years[y] - a.years[y]);
    say(`${y}: ${fmt(here.reduce((a, s) => a + s.years[y], 0))} documents` + (here.length ? ' — ' + here.map(s => `${s.name} ${fmt(s.years[y])}`).join(', ') : '') + '.');
  }

  root.tabIndex = 0;
  root.addEventListener('keydown', e => {
    const s = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (s) { e.preventDefault(); const i = on && on.i !== undefined ? on.i : -1; on = { i: i < 0 ? (s > 0 ? 0 : YN - 1) : Math.max(0, Math.min(YN - 1, i + s)) }; show(); }
    else if (e.key === 'Escape') { on = null; show(); }
  });
  root.addEventListener('blur', () => { on = null; show(); });

  // Redraw only when the figure crosses the narrow/wide line.
  const isNarrow = () => root.clientWidth < 520;
  draw(isNarrow());
  new ResizeObserver(() => { if (isNarrow() !== F.narrow) draw(isNarrow()); }).observe(root);
})();
