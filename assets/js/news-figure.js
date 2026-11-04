// News (news.md): a four-track sequencer over the log. Months run left to
// right on one line, January of the first year to December of this one;
// each kind has its own track (talks, panels, papers, press), so the track
// says the kind and the mark only has to say when. An item is a step at
// the month it is listed under. Where its text puts the event in a later
// month, the step is held: a line runs on to a hollow step at the month
// it happened, a note with its length. A thin red line is now.
//
// Everything is read from the log on the page (data-kind, data-listed,
// data-held), so the figure and the counts can't drift from the list.
// The log stays the primary list: j / k step through it, and pointing at
// either side lights both. t p a n solo one track; x brings them all back.

(function () {
  const log = document.getElementById('nw-log');
  const cal = document.getElementById('nw-cal');
  const svg = document.getElementById('nw-svg');
  const seg = document.getElementById('nw-seg');
  const out = document.getElementById('nw-readout');
  if (!log || !cal || !svg || !seg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const KINDS = {
    talk:  { key: 't', one: 'talk',  many: 'talks' },
    panel: { key: 'p', one: 'panel', many: 'panels' },
    paper: { key: 'a', one: 'paper', many: 'papers' },
    press: { key: 'n', one: 'press', many: 'press' }
  };
  const ORDER = Object.keys(KINDS);
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const ym = s => { const [y, m] = (s || '').split('-').map(Number); return y && m ? { y, m } : null; };
  const say = d => `${MON[d.m - 1]} ${d.y}`;
  const gap = (a, b) => (b.y - a.y) * 12 + b.m - a.m;

  const items = [...log.querySelectorAll('.nw-item')].map((li, i) => ({
    li, i,
    kind: li.dataset.kind,
    at: ym(li.dataset.listed),
    held: ym(li.dataset.held),
    text: (li.querySelector('.nw-t') || li).textContent.trim()
  })).filter(it => KINDS[it.kind] && it.at);
  if (!items.length) return;

  const counts = {};
  items.forEach(it => { counts[it.kind] = (counts[it.kind] || 0) + 1; });
  const lanes = ORDER.filter(k => counts[k]);

  // ── the plate ──
  const now = new Date();
  const NOW = { y: now.getFullYear(), m: now.getMonth() + 1 };
  const years = items.map(it => it.at.y).concat(items.filter(it => it.held).map(it => it.held.y), NOW.y);
  const Y0 = Math.min(...years), Y1 = Math.max(...years);
  const N = (Y1 - Y0 + 1) * 12;
  const R = 8, TOP = 22, LH = 30;
  let W, L, CW, H, BOT, narrow;
  const col = d => (d.y - Y0) * 12 + d.m - 1;        // 0-based month index
  const x0 = d => L + col(d) * CW;                    // left edge of a month
  const ly = k => TOP + lanes.indexOf(k) * LH;        // top of a track

  const make = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  const labels = {};
  // Drawn at the width it is shown, so its type is the page's own size.
  function draw() {
  W = Math.max(300, Math.round(cal.clientWidth || 640));
  narrow = W < 560;                 // a phone: no key letters, a slimmer label
  L = narrow ? 62 : 84;
  CW = (W - L - R) / N;
  BOT = TOP + lanes.length * LH;
  H = BOT + 18;
  svg.textContent = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const grid = make('g', { class: 'nw-grid', 'aria-hidden': 'true' }, svg);
  // tracks: a name and its count on the left, a hairline under each
  lanes.forEach((k, n) => {
    const y = ly(k);
    if (n % 2 === 0) make('rect', { x: L, y, width: W - L - R, height: LH, class: 'nw-lane' }, grid);
    const t = make('text', { x: 0, y: y + LH / 2 + 3.5, class: 'nw-tr' }, grid);
    if (!narrow) make('tspan', { class: 'nw-tr__k' }, t).textContent = KINDS[k].key + ' ';
    make('tspan', {}, t).textContent = counts[k] === 1 ? KINDS[k].one : KINDS[k].many;
    make('tspan', { class: 'nw-tr__c', x: L - 10, 'text-anchor': 'end' }, t).textContent = counts[k];
    labels[k] = t;
  });
  make('line', { x1: L, x2: W - R, y1: BOT, y2: BOT, class: 'nw-axis' }, grid);
  // years: a full rule at each January, the year and its count above
  for (let y = Y0; y <= Y1; y++) {
    const x = x0({ y, m: 1 });
    make('line', { x1: x, x2: x, y1: TOP - 14, y2: BOT + 5, class: 'nw-yrule' }, grid);
    const n = items.filter(it => it.at.y === y).length;
    const t = make('text', { x: x + 4, y: TOP - 6, class: 'nw-yr' }, grid);
    t.textContent = y;
    if (!narrow) make('tspan', { class: 'nw-yr__c' }, t).textContent = n ? ` · ${n}` : '';
    // month ticks under the axis, quarters a little longer
    for (let m = 1; m <= 12; m++) {
      const mx = x0({ y, m }) + CW / 2;
      make('line', { x1: mx, x2: mx, y1: BOT, y2: BOT + (m % 3 === 1 ? 4 : 2), class: 'nw-mt' }, grid);
    }
  }
  const xe = W - R;
  make('line', { x1: xe, x2: xe, y1: TOP - 14, y2: BOT + 5, class: 'nw-yrule' }, grid);
  // what each month's quarter ticks mean, once, under the first year
  ['jan', 'apr', 'jul', 'oct'].forEach((s, q) => {
    make('text', { x: x0({ y: Y0, m: q * 3 + 1 }) + CW / 2, y: BOT + 14, 'text-anchor': 'middle', class: 'nw-mo' }, grid).textContent = s[0];
  });

  // now: a thin red line through every track, at today's place in its month
  const days = new Date(NOW.y, NOW.m, 0).getDate();
  const nx = x0(NOW) + CW * (now.getDate() - .5) / days;
  const nowG = make('g', { class: 'nw-now', 'aria-hidden': 'true' }, svg);
  make('line', { x1: nx, x2: nx, y1: TOP - 14, y2: BOT + 6, class: 'nw-now__l' }, nowG);
  make('text', { x: nx, y: BOT + 15, 'text-anchor': 'middle', class: 'nw-now__t' }, nowG).textContent = 'now';

  // steps
  const marks = make('g', { class: 'nw-marks' }, svg);
  const SH = 12;                                     // a step's height
  items.forEach(it => {
    const y = ly(it.kind), cy = y + LH / 2;
    const xa = x0(it.at), xb = it.held ? x0(it.held) : xa;
    const later = it.held ? gap(it.at, it.held) : 0;
    const held = it.held ? `, happened ${say(it.held)}, ${later} months later` : '';
    const a = make('a', { href: `#${it.li.id}`, class: 'nw-g', 'data-i': it.i, 'aria-label': `${KINDS[it.kind].one}, listed ${say(it.at)}${held}` }, marks);
    // the hand's ground: the whole note, a little proud of it
    make('rect', { x: xa - 2, y: y + 3, width: xb - xa + CW + 4, height: LH - 6, rx: 3, class: 'nw-bg' }, a);
    if (it.held) {
      make('line', { x1: xa + CW - 1, x2: xb + 1, y1: cy, y2: cy, class: 'nw-hold' }, a);
      make('rect', { x: xb + 1, y: cy - SH / 2, width: CW - 2, height: SH, rx: 1.5, class: 'nw-step nw-step--held' }, a);
    }
    make('rect', { x: xa + 1, y: cy - SH / 2, width: CW - 2, height: SH, rx: 1.5, class: 'nw-step' }, a);
    if (it.li.classList.contains('is-newest')) make('circle', { cx: xa + CW / 2, cy: y + 2, r: 3, class: 'nw-live' }, a);
    it.g = a;
  });
  }

  // ── filter: solo one track ──
  let filt = null;
  const buttons = {};
  lanes.forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span class="fp-seg__k">${KINDS[k].key}</span>${counts[k] === 1 ? KINDS[k].one : KINDS[k].many}<span class="fp-seg__c">${counts[k]}</span>`;
    b.addEventListener('click', () => setFilter(filt === k ? null : k));
    seg.appendChild(b);
    buttons[k] = b;
    window.FP && FP.add({ key: KINDS[k].key, label: `${KINDS[k].many} only · ${counts[k]}`, run: () => setFilter(filt === k ? null : k) });
  });
  window.FP && FP.add({ key: 'x', label: 'show every kind', run: () => setFilter(null), when: () => !!filt });

  function setFilter(k) {
    filt = k;
    Object.entries(buttons).forEach(([kk, b]) => b.setAttribute('aria-pressed', String(kk === k)));
    Object.entries(labels).forEach(([kk, t]) => t.classList.toggle('is-dim', !!k && kk !== k));
    items.forEach(it => {
      const off = !!k && it.kind !== k;
      it.li.hidden = off;
      it.g.classList.toggle('is-dim', off);
    });
    if (at && at.li.hidden) { window.FP && FP.setAt && FP.setAt(null); at = null; }
    light(at);
  }

  // ── one item lit on both sides ──
  let at = null;       // where j / k or a click left us
  let lit = null;
  const REST = 'point at a step, or step with j / k';
  function light(it) {
    if (lit) { lit.li.classList.remove('is-on'); lit.g.classList.remove('is-on'); }
    lit = it;
    if (!it) { out.textContent = REST; return; }
    it.li.classList.add('is-on'); it.g.classList.add('is-on');
    out.innerHTML = '';
    const meta = document.createElement('span');
    meta.className = 'nw-readout__m';
    const later = it.held ? gap(it.at, it.held) : 0;
    meta.textContent = `${KINDS[it.kind].one} · listed ${say(it.at)}${it.held ? ` · happened ${say(it.held)}, ${later} month${later === 1 ? '' : 's'} later` : ''}`;
    out.append(meta, document.createTextNode(it.text));
  }
  const byLi = li => items.find(it => it.li === li);
  const byG = g => items.find(it => it.i === +g.dataset.i);

  log.addEventListener('pointerover', e => { const li = e.target.closest('.nw-item'); if (li) light(byLi(li)); });
  log.addEventListener('pointerleave', () => light(at));
  svg.addEventListener('pointerover', e => { const g = e.target.closest('.nw-g'); light(g ? byG(g) : at); });
  svg.addEventListener('pointerleave', () => light(at));
  svg.addEventListener('focusin', e => { const g = e.target.closest('.nw-g'); if (g) light(byG(g)); });
  svg.addEventListener('focusout', () => light(at));
  // A step takes you to its line in the log, and j / k carry on from there.
  svg.addEventListener('click', e => {
    const g = e.target.closest('.nw-g'); if (!g) return;
    const it = byG(g);
    if (window.FP && FP.setAt) { e.preventDefault(); FP.setAt(it.li); }
  });
  document.addEventListener('fp-at', e => {
    const it = e.detail ? byLi(e.detail) : null;
    at = it || null;
    light(at);
  });

  // The log is the keyboard's list (j / k light the figure from it), so
  // the steps stay out of the tab order rather than doubling every stop.
  function settle() {
    items.forEach(it => it.g.setAttribute('tabindex', '-1'));
    if (filt) setFilter(filt); else light(at);
  }
  cal.hidden = false;
  seg.hidden = false;
  draw(); settle();
  let rw = cal.clientWidth;
  new ResizeObserver(() => {
    if (Math.abs(cal.clientWidth - rw) < 2) return;
    rw = cal.clientWidth;
    if (lit) lit.li.classList.remove('is-on');
    lit = null; draw(); settle();
  }).observe(cal);
})();
