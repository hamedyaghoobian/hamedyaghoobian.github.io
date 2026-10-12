// CSI 330 · Week 8 · k-fold cross-validation. Two hundred wines stand in
// a card tray, one card per five, divided into k folds (half red, tabbed;
// stratified, so every fold keeps that mix). Each round lifts one fold out to validate on while
// the model trains on the rest; the board behind records that fold's
// accuracy as a bar. After k rounds every wine has been tested exactly
// once, and the estimate is the mean of the k scores — with their spread,
// which a single train/test split would hide. Scores are scikit-learn's:
// logistic regression on alcohol and density, StratifiedKFold.

(function () {
  const root = document.getElementById('w8-figure');
  if (!root || !window.CSI330 || !window.CSIKit) return;
  const { el, box, iso, pts, face, onNear, svg: makeSvg } = window.LineFigure;
  const K = window.CSIKit, D = window.CSI330.w8;

  const svg = makeSvg(root, '0 0 100 100',
    'A tray of 200 wine cards divided into k folds; each round lifts one fold out to validate on while the rest train, and a board records each fold’s accuracy as a bar with the mean. A selector sets k to 3, 5 or 10.');

  K.bench(svg, -6, -4, 150, 66);
  K.plate(svg, `WINE · ${D.n} BOTTLES, ONE CARD PER FIVE · RED OR WHITE FROM ALCOHOL AND DENSITY`, 4, 66);

  const b = K.board(svg, 6, 136, 16, 22, 86);
  const by = K.scale(0.5, 1, 52, 8);
  const bars = el('g', {}, b.g);
  el('path', { class: 'lf-line', d: `M12 ${by(0.5)} L122 ${by(0.5)} M12 ${by(0.5)} L12 ${by(1)}` }, b.g);
  [0.5, 0.75, 1].forEach(t => {
    el('line', { class: 'lf-line', x1: 10.8, x2: 12, y1: by(t), y2: by(t) }, b.g);
    el('text', { x: 10.2, y: by(t) + 0.9, 'font-size': 2.4, 'text-anchor': 'end' }, b.g).textContent = t;
  });
  el('text', { x: 13.5, y: by(1) - 1.2, 'font-size': 2.4 }, b.g).textContent = 'accuracy on the held-out fold';

  // The tray and its cards, farthest first; each fold is a group that lifts.
  const U0 = 4, U1 = 128, V0 = 34, V1 = 44;
  box(svg, 'lf-solid lf-shaded').set(U0 - 2, V0 - 2, 0, U1 + 2, V1 + 2, 1.5);
  const tray = el('g', {}, svg);
  box(svg, 'lf-solid lf-shaded').set(U0 - 2, V1, 0, U1 + 2, V1 + 2, 4);   // the tray's near lip
  const KS = [3, 5, 10];
  const sel = K.selector(svg, 50, 56, KS, 'K FOLDS');

  const st = { k: 1, fold: 0 };
  let groups = [];
  function build() {
    tray.replaceChildren();
    // one card stands for five wines, so the folds read at a glance
    const k = KS[st.k], CARDS = D.n / 5, step = (U1 - U0) / CARDS;
    const start = f => Math.round(f * CARDS / k);            // folds as even as they can be
    groups = [];
    for (let f = k - 1; f >= 0; f--) {
      const g = el('g', {}, tray);
      for (let i = start(f + 1) - 1; i >= start(f); i--) {
        const u = U0 + i * step + 0.6, red = i % 2 === 0;
        el('polygon', { class: 'lf-solid', points: pts([iso(u, V0, 1.5), iso(u, V1, 1.5), iso(u, V1, 11), iso(u, V0, 11)]) }, g);
        if (red) el('polygon', { class: 'lf-solid', points: pts([iso(u, V0 + 1, 11), iso(u, V0 + 3, 11), iso(u, V0 + 3, 12.5), iso(u, V0 + 1, 12.5)]) }, g);
      }
      // a numbered divider at the fold's near end
      const u = U0 + start(f) * step;
      el('polygon', { class: 'lf-solid lf-shaded', points: pts([iso(u, V0 - 1, 1.5), iso(u, V1 + 1, 1.5), iso(u, V1 + 1, 14), iso(u, V0 - 1, 14)]) }, g);
      el('text', { x: 0, y: 2.6, 'font-size': 2.4 }, face(g, onNear(u + 0.6, V1 + 1, 16))).textContent = `${f + 1}`;
      groups[f] = g;
    }
  }
  function update() {
    const k = KS[st.k], scores = D.folds[k];
    groups.forEach((g, f) => {
      const on = f === st.fold;
      g.setAttribute('class', on ? 'lf-hot' : '');
      g.setAttribute('transform', on ? 'translate(0 -10)' : '');
    });
    bars.replaceChildren();
    const w = 110 / k, done = scores.slice(0, st.fold + 1);
    scores.forEach((s, f) => {
      const x = 12 + f * w + w * 0.18, bw = w * 0.64;
      const g = el('g', { class: f === st.fold ? 'lf-hot' : '' }, bars);
      if (f <= st.fold) el('rect', { class: 'lf-line' + (f === st.fold ? ' lf-strong' : ''), x, y: by(s), width: bw, height: by(0.5) - by(s) }, g);
      else el('rect', { class: 'lf-line lf-faint', x, y: by(0.5) - 0.6, width: bw, height: 0.6 }, g);
      el('text', { x: x + bw / 2, y: by(0.5) + 3.2, 'font-size': 2.2, 'text-anchor': 'middle' }, g).textContent = f <= st.fold ? s.toFixed(2) : `fold ${f + 1}`;
    });
    const m = K.mean(done), sd = Math.sqrt(K.mean(done.map(s => (s - m) ** 2)));
    el('line', { class: 'lf-line', x1: 12, x2: 122, y1: by(m), y2: by(m), 'stroke-dasharray': '1.2 1' }, bars);
    el('text', { x: 122, y: by(m) - 1.2, 'font-size': 2.4, 'text-anchor': 'end' }, bars).textContent = `mean ${m.toFixed(3)} ± ${sd.toFixed(3)}`;
    sel.set(st.k);
    const all = st.fold === k - 1;
    const size = Math.floor(D.n / k) + (st.fold < D.n % k ? 1 : 0);   // as scikit-learn sizes its folds
    ctl.calc(`CV accuracy = (<var>a</var>₁ + … + <var>a</var><sub>k</sub>) ÷ <var>k</var> = (${done.map(v => v.toFixed(3)).join(' + ')}) ÷ ${done.length} = <span class="hot">${m.toFixed(3)}</span>` +
      (done.length > 1 ? ` &nbsp;·&nbsp; spread (sd) ${sd.toFixed(3)}, from ${Math.min(...done).toFixed(2)} to ${Math.max(...done).toFixed(2)}` : '') +
      `<br>each round trains on ${D.n - size} wines and tests on the other ${size}; after all ${k} rounds every wine has been tested exactly once`);
    ctl.say(`k = ${k} · round ${st.fold + 1}: train on ${D.n - size}, validate on fold ${st.fold + 1} (${size}) · accuracy ${scores[st.fold].toFixed(3)}` +
      (all ? ` · mean of all ${k}: ${m.toFixed(3)} ± ${sd.toFixed(3)}` : ''));
  }
  function setK(i) { st.k = i; st.fold = 0; build(); update(); }

  const ctl = K.controls(root, svg, {
    keys: e => {
      const s = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (s) { st.fold = Math.max(0, Math.min(KS[st.k] - 1, st.fold + s)); update(); return true; }
      const kk = { ArrowUp: 1, ArrowDown: -1 }[e.key];
      if (kk) { setK(Math.max(0, Math.min(KS.length - 1, st.k + kk))); return true; }
      return false;
    },
    step: () => {
      if (st.fold < KS[st.k] - 1) { st.fold++; update(); }
      else setK((st.k + 1) % KS.length);
    },
    every: 1400
  });
  svg.addEventListener('pointerdown', e => {
    const i = sel.pick(e);
    if (i >= 0) return setK(i);
    const f = groups.findIndex(g => g.contains(e.target));
    if (f >= 0) { st.fold = f; update(); }
  });
  setK(1);
  K.fit(svg);
})();
