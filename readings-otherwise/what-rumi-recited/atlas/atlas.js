// The Shams atlas, from noghte/shams-quran-link (build_shams_atlas.py), in the site's frame.
(async () => {
const root = document.getElementById('shams-atlas'), $ = id => root.querySelector('#sa-' + id);
const D = await fetch('data.json?v=' + (window.ATLAS_V || 1)).then(r => r.json());
if (!window.d3) { $('count').textContent = 'The chart library could not load. Allow cdn.jsdelivr.net and reload the page.'; return; }
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (v == null) continue; if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e[k] = v; else e.setAttribute(k, v); }
  for (const k of kids) if (k != null) e.append(k); return e; };
const css = v => getComputedStyle(root).getPropertyValue(v).trim();
const fa = x => String(x).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);   // every number is shown in Persian digits

// ---------- model ----------
const THEME = Object.fromEntries(D.taxonomy.themes.map(t => [t.key, t]));
const FIG = Object.fromEntries(D.taxonomy.figures.map(t => [t.key, t]));
const FAM_OF = {}; D.families.forEach((f, i) => { f.i = i; f.themes.forEach(t => FAM_OF[t] = f.key); });
const FAM = Object.fromEntries(D.families.map(f => [f.key, f]));
const RELS = [
  {key: 'quotation', en: 'Quotation', fa: 'اقتباس لفظی', dash: null, w: 1.4},
  {key: 'paraphrase', en: 'Paraphrase', fa: 'بازگویی', dash: null, w: 1},
  {key: 'allusion', en: 'Allusion', fa: 'تلمیح', dash: '0.1 3.4', w: 1.5},
  {key: 'thematic', en: 'Thematic', fa: 'هم‌مضمونی', dash: '1.5 3', w: 1}];
const REL = Object.fromEntries(RELS.map(r => [r.key, r]));
const PRESENT = new Set(D.links.map(l => l.rel));
const STR = {strong: 2, moderate: 1, weak: 0, '': 0};
const SEC_FA = {ghazalsh: 'غزل', robaeesh: 'رباعی', tarjeeat: 'ترجیع'};
for (const [ref, v] of Object.entries(D.verses)) { v.ref = ref; v.rf = fa(ref); v.fam = FAM_OF[v.th[0]] || 'divine'; v.links = []; }
for (const [pid, p] of Object.entries(D.poems)) { p.id = pid; p.label = `${SEC_FA[p.sec] || p.sec} ${fa(p.num)}`; p.links = []; }
D.links.forEach((l, i) => { l.i = i; l.v = D.verses[l.q]; l.po = D.poems[l.p]; l.v.links.push(l); l.po.links.push(l); });
const famColor = k => css(['--sa-f1', '--sa-f2', '--sa-f3'][FAM[k].i]);
const mode = () => $('color').value;
const color = v => mode() === 'rev' ? css(v.rev === 'meccan' ? '--sa-r1' : '--sa-r2') : mode() === 'family' ? famColor(v.fam) : css('--sa-mark');
const norm = s => (s || '').toLowerCase().replace(/[ً-ْٰـ‌]/g, '').replace(/ي/g, 'ی').replace(/ك/g, 'ک')
  .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[،]/g, ' ');
for (const l of D.links) l.hay = norm([l.q, l.v.name, l.v.ar, l.v.fa, l.v.ten, l.v.tfa, l.po.label, `${l.po.sec} ${l.po.num}`, l.po.ten, l.po.tfa, ...l.h, l.gfa, l.gen,
  ...l.v.th.map(t => THEME[t]?.en + ' ' + THEME[t]?.fa), FIG[l.v.fig]?.en, FIG[l.v.fig]?.fa].join(' '));

// ---------- state ----------
const S = {view: 'atlas', fams: new Set(D.families.map(f => f.key)), rels: new Set(RELS.map(r => r.key)), q: '', theme: '', figure: '', strength: 0, review: '', sel: null};
function visible() {
  const q = norm(S.q.trim());
  return D.links.filter(l => S.fams.has(l.v.fam) && (!l.rel || S.rels.has(l.rel)) && STR[l.str] >= S.strength && (!S.review || l.rv) &&
    (!S.theme || l.v.th.includes(S.theme)) && (!S.figure || l.v.fig === S.figure) && (!q || q.split(/\s+/).every(t => l.hay.includes(t))));
}
function selLinks() {
  if (!S.sel) return [];
  return (S.sel.type === 'verse' ? D.verses[S.sel.id]?.links : S.sel.type === 'poem' ? D.poems[S.sel.id]?.links : [D.links[S.sel.id]]) || [];
}
function selectionSet() { const vis = new Set(visible()), on = selLinks().filter(l => vis.has(l)); return on.length ? new Set(on) : null; }
// tracing: each verse in the selection gets its own colour and number, in Quran order
const TRACE_VARS = ['--sa-t1', '--sa-t2', '--sa-t3', '--sa-t4', '--sa-t5', '--sa-t6', '--sa-t7', '--sa-t8'];
function traceMap() {
  const vs = [...new Set(selLinks().map(l => l.v))].sort((a, b) => a.x - b.x);
  return vs.length ? new Map(vs.map((v, i) => [v, {n: fa(i + 1), color: css(TRACE_VARS[i % 8])}])) : null;
}

// ---------- controls ----------
const nP = Object.keys(D.poems).length, nV = Object.keys(D.verses).length, nS = new Set(Object.values(D.verses).map(v => v.name)).size;
$('stats').replaceChildren(...[[D.links.length, 'couplets'], [nP, 'poems'], [nV, 'verses'], [nS, 'surahs']]
  .flatMap(([n, t], i) => [i ? ' · ' : '', el('b', {text: fa(n)}), ' ' + t]));
function chips() {
  const m = mode();
  $('legend').replaceChildren(...D.families.map(f => el('button', {class: 'sa-chip', type: 'button', 'aria-pressed': S.fams.has(f.key), title: `Show or hide ${f.en}`,
    onclick: () => { toggle(S.fams, f.key); update(); }}, m === 'family' ? el('span', {class: 'sa-sw', style: `background:${famColor(f.key)}`}) : null, f.en, el('span', {class: 'sa-fa', lang: 'fa', text: f.fa}))));
  $('rel').replaceChildren(...RELS.filter(r => PRESENT.has(r.key)).map(r => el('button', {class: 'sa-chip', type: 'button', 'aria-pressed': S.rels.has(r.key), title: `Show or hide ${r.en.toLowerCase()}s`,
    onclick: () => { toggle(S.rels, r.key); update(); }}, dashSwatch(r), r.en)));
  const active = (S.fams.size < D.families.length) + (S.rels.size < RELS.length) + !!S.theme + !!S.figure + !!S.strength + !!S.review + (m !== 'none');
  $('ftoggle').textContent = active ? `Filters · ${fa(active)}` : 'Filters';
}
function dashSwatch(r) { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('width', 22); s.setAttribute('height', 8); s.setAttribute('aria-hidden', 'true');
  const ln = document.createElementNS(s.namespaceURI, 'line'); Object.entries({x1: 2, x2: 20, y1: 4, y2: 4, stroke: 'currentColor', 'stroke-width': r.w + .5, 'stroke-dasharray': r.dash || '', 'stroke-linecap': 'round'}).forEach(([k, v]) => ln.setAttribute(k, v)); s.append(ln); return s; }
function toggle(set, k) { if (set.has(k) && set.size === 1) return; set.has(k) ? set.delete(k) : set.add(k); }
const count = pred => D.links.filter(pred).length;
$('theme').replaceChildren(el('option', {value: '', text: 'All'}), ...D.families.map(f => { const g = el('optgroup', {label: f.en});
  f.themes.forEach(t => g.append(el('option', {value: t, text: `${THEME[t].en} (${fa(count(l => l.v.th.includes(t)))})`}))); return g; }));
$('figure').replaceChildren(el('option', {value: '', text: 'All'}), ...D.taxonomy.figures.filter(f => f.key !== 'none')
  .map(f => [f, count(l => l.v.fig === f.key)]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]).map(([f, n]) => el('option', {value: f.key, text: `${f.en} (${fa(n)})`})));
$('ftoggle').onclick = () => { const open = $('fpanel').hidden; $('fpanel').hidden = !open; $('ftoggle').setAttribute('aria-expanded', open); };
$('search').oninput = e => { S.q = e.target.value; update(); };
$('strength').onchange = e => { S.strength = +e.target.value; update(); };
$('review').onchange = e => { S.review = e.target.value; update(); };
$('theme').onchange = e => { S.theme = e.target.value; update(); };
$('figure').onchange = e => { S.figure = e.target.value; update(); };
$('color').onchange = () => { netKey = ''; update(); };
$('clear').onclick = () => select(null);
$('reset').onclick = () => { Object.assign(S, {q: '', theme: '', figure: '', strength: 0, review: '', fams: new Set(D.families.map(f => f.key)), rels: new Set(RELS.map(r => r.key))});
  $('search').value = ''; $('theme').value = ''; $('figure').value = ''; $('strength').value = '0'; $('review').value = ''; $('color').value = 'none'; netKey = ''; update(); };
root.querySelectorAll('[role=tab]').forEach(b => b.onclick = () => setView(b.dataset.view));
function setView(v) { S.view = v; root.querySelectorAll('[role=tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.view === v));
  ['atlas', 'network', 'themes'].forEach(k => $('view-' + k).hidden = k !== v); save(); update(); }

// ---------- tooltip ----------
const tip = $('tip');
function showTip(ev, html) { tip.innerHTML = html; tip.hidden = false; const box = root.querySelector('.sa-viz').getBoundingClientRect();
  let x = ev.clientX - box.left + 16, y = ev.clientY - box.top + 16; if (x + 310 > box.width) x = Math.max(0, x - 330); tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
const hideTip = () => tip.hidden = true;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const plural = (n, w) => `${fa(n)} ${w}${n === 1 ? '' : 's'}`;
const verseTip = v => `<div class="t">${v.rf} · <span lang="ar">${esc(v.name)}</span></div><div class="m">${esc(v.ten)}</div><div class="m">${plural(v.links.length, 'couplet')} in ${plural(new Set(v.links.map(l => l.p)).size, 'poem')}</div>`;
const poemTip = p => `<div class="t" dir="rtl" lang="fa">${esc(p.label)}</div><div class="m">${esc(p.ten)}</div><div class="m">${plural(p.links.length, 'cited couplet')}</div>`;
const linkTip = l => `<div class="t">${l.v.rf} → <span dir="rtl" lang="fa">${esc(l.po.label)}</span></div><div dir="rtl" lang="fa">${esc(l.h[0])}<br>${esc(l.h[1])}</div><div class="m">${REL[l.rel]?.en || ''}${l.str ? ', ' + l.str : ''}</div>`;
function key(g, x, y, t, label, anchor = 'start') {   // a tracing key in a chart: coloured dot, number and reference
  const dir = anchor === 'end' ? -1 : 1;
  g.append('circle').attr('cx', x).attr('cy', y).attr('r', 4.5).attr('fill', t.color);
  g.append('text').attr('class', 'sa-label').attr('x', x + dir * 9).attr('y', y + 4).attr('text-anchor', anchor).text(`${t.n}  ${label}`);
}

// ---------- atlas ----------
const asvg = d3.select($('atlas'));
let threadSel = null;
function drawAtlas(links) {
  const W = $('atlas').clientWidth || 900, H = $('atlas').clientHeight || 600, m = {l: 4, r: 4};
  const yQ = 46, yP = H - 46;
  const totalQ = D.surahs.reduce((a, s) => a + s.len, 0);
  const qx = d3.scaleLinear([0, totalQ], [m.l, W - m.r]);
  const minW = 40, gap = 14, avail = W - m.l - m.r - gap * (D.sections.length - 1), raw = D.sections.map(s => s.size), tot = d3.sum(raw);
  let widths = raw.map(n => Math.max(minW, avail * n / tot)); const extra = d3.sum(widths) - avail;
  const big = widths.map((w, i) => w > minW ? raw[i] : 0), bigTot = d3.sum(big); widths = widths.map((w, i) => big[i] ? w - extra * big[i] / bigTot : w);
  let acc = m.l; const secX = {}; D.sections.forEach((s, i) => { secX[s.key] = {x0: acc, w: widths[i], s}; acc += widths[i] + gap; });
  const px = p => { const g = secX[p.sec]; return g.x0 + g.w * (p.num - .5) / g.s.size; };
  asvg.selectAll('*').remove();
  const ax = asvg.append('g').attr('class', 'sa-axis');
  // Quran axis: hairline with a tick at each surah boundary, numbers every ten
  ax.append('text').attr('class', 'sa-axtitle').attr('x', m.l).attr('y', 14).text('Quran');
  ax.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', yQ).attr('y2', yQ);
  let off = 0, lastLabel = -99;
  D.surahs.forEach(s => { const x0 = qx(off), x1 = qx(off + s.len); off += s.len;
    const tenth = s.n === 1 || s.n % 10 === 0;
    ax.append('line').attr('x1', x0).attr('x2', x0).attr('y1', yQ - (tenth ? 6 : 3)).attr('y2', yQ);
    ax.append('rect').attr('x', x0).attr('y', yQ - 8).attr('width', Math.max(1, x1 - x0)).attr('height', 10).attr('fill', 'transparent')
      .on('mousemove', ev => showTip(ev, `<div class="t">Surah ${fa(s.n)} · <span lang="ar">${esc(s.ar)}</span></div><div class="m">${esc(s.en)}, ${fa(s.len)} ayahs</div>`)).on('mouseleave', hideTip);
    if (tenth && x0 - lastLabel > 22) { ax.append('text').attr('x', x0).attr('y', yQ - 11).attr('text-anchor', s.n === 1 ? 'start' : 'middle').text(fa(s.n)); lastLabel = x0; } });
  // Divan axis: one hairline per section
  for (const g of Object.values(secX)) {
    ax.append('line').attr('x1', g.x0).attr('x2', g.x0 + g.w).attr('y1', yP).attr('y2', yP);
    ax.append('text').attr('x', g.x0 + g.w / 2).attr('y', yP + 24).attr('text-anchor', 'middle').text(g.w > 100 ? `${g.s.fa} · ${g.s.en}` : g.s.fa); }
  ax.append('text').attr('class', 'sa-axtitle').attr('x', m.l).attr('y', H - 2).text('Divan-e Shams');

  const sel = selectionSet(), trace = sel ? traceMap() : null;
  const neutral = mode() === 'none';
  const dens = Math.max(.45, Math.min(1, W / 900));   // fewer pixels, same lines: lighten on narrow screens
  const base = l => dens * (neutral ? (l.str === 'strong' ? .16 : .1) : (l.str === 'strong' ? .55 : l.str === 'moderate' ? .38 : .26));
  const opac = (l, focus) => focus ? (focus.has(l) ? .95 : .035) : base(l);
  const strokeOf = l => trace && sel.has(l) ? trace.get(l.v).color : (trace ? css('--sa-quiet') : color(l.v));
  const ordered = [...links].sort((a, b) => (sel ? sel.has(a) - sel.has(b) : 0) || STR[a.str] - STR[b.str]);
  const y0 = yQ + 2, y1 = yP - 2, mid = (y0 + y1) / 2;
  threadSel = asvg.append('g').selectAll('path').data(ordered).join('path').attr('class', 'sa-thread')
    .attr('d', l => { const a = qx(l.v.x + .5), b = px(l.po); return `M${a},${y0} C${a},${mid} ${b},${mid} ${b},${y1}`; })
    .attr('stroke', strokeOf).attr('stroke-width', l => (REL[l.rel]?.w || 1) + (sel?.has(l) ? .7 : 0)).attr('stroke-dasharray', l => REL[l.rel]?.dash)
    .attr('stroke-opacity', l => opac(l, sel))
    .on('mousemove', (ev, l) => { showTip(ev, linkTip(l)); preview(new Set([l])); })
    .on('mouseleave', () => { hideTip(); preview(null); })
    .on('click', (ev, l) => select({type: 'link', id: l.i}));
  function preview(focus) { threadSel.attr('stroke-opacity', l => opac(l, focus || sel)); }
  const marks = asvg.append('g');
  const vs = [...new Set(links.map(l => l.v))], ps = [...new Set(links.map(l => l.po))];
  const vr = v => 1.4 + Math.sqrt(v.links.length) * .9;
  marks.selectAll('rect.p').data(ps).join('rect').attr('class', 'p').attr('x', p => px(p) - .6).attr('y', yP - 5).attr('width', 1.2).attr('height', 10)
    .attr('fill', p => sel && p.links.some(l => sel.has(l)) ? css('--sa-ink') : css('--sa-ink3')).attr('opacity', p => !sel || p.links.some(l => sel.has(l)) ? 1 : .4).style('cursor', 'pointer')
    .on('mousemove', (ev, p) => { showTip(ev, poemTip(p)); preview(new Set(p.links)); }).on('mouseleave', () => { hideTip(); preview(null); })
    .on('click', (ev, p) => select({type: 'poem', id: p.id}));
  marks.selectAll('circle.v').data(vs.sort((a, b) => (trace?.has(a) ?? 0) - (trace?.has(b) ?? 0) || b.links.length - a.links.length)).join('circle').attr('class', 'v')
    .attr('cx', v => qx(v.x + .5)).attr('cy', yQ).attr('r', v => vr(v) + (trace?.has(v) ? 1.2 : 0))
    .attr('fill', v => trace ? (trace.has(v) ? trace.get(v).color : css('--sa-ink3')) : color(v)).attr('opacity', v => trace && !trace.has(v) ? .35 : 1)
    .attr('stroke', css('--sa-bg')).attr('stroke-width', 1).style('cursor', 'pointer')
    .on('mousemove', (ev, v) => { showTip(ev, verseTip(v)); preview(new Set(v.links)); }).on('mouseleave', () => { hideTip(); preview(null); })
    .on('click', (ev, v) => select({type: 'verse', id: v.ref}));
  if (trace) {   // keys below each traced verse, stacked when they would collide
    const placed = [];
    for (const [v, t] of trace) { if (!vs.includes(v)) continue;
      const x = qx(v.x + .5), right = x + 80 > W; let y = yQ + 22;
      while (placed.some(([a, b]) => Math.abs(a - x) < 80 && Math.abs(b - y) < 18)) y += 18; placed.push([x, y]);
      marks.append('line').attr('x1', x).attr('x2', x).attr('y1', yQ + vr(v) + 2).attr('y2', y - 6).attr('stroke', t.color).attr('stroke-width', 1);
      key(marks, x, y, t, v.rf, right ? 'end' : 'start'); }
  } else {
    const placed = [];
    for (const v of vs.slice(0, 7)) { const x = qx(v.x + .5); if (placed.some(p => Math.abs(p - x) < 46)) continue; placed.push(x);
      marks.append('text').attr('class', 'sa-label').attr('x', x).attr('y', yQ + vr(v) + 15).attr('text-anchor', 'middle').text(v.rf); }
  }
  if (S.sel?.type === 'poem' && D.poems[S.sel.id] && ps.includes(D.poems[S.sel.id])) { const p = D.poems[S.sel.id]; marks.append('circle').attr('class', 'sa-ring').attr('cx', px(p)).attr('cy', yP).attr('r', 7); }
}

// ---------- network ----------
const nsvg = d3.select($('network')), nlayer = nsvg.append('g');
let netK = 1;   // labels keep a constant on-screen size whatever the zoom
const labelT = d => `translate(${d.x || 0},${d.y || 0}) scale(${1 / netK})`;
const zoom = d3.zoom().scaleExtent([.15, 8]).on('zoom', e => { nlayer.attr('transform', e.transform); netK = e.transform.k; netLabels?.selectAll('g.sa-nl').attr('transform', labelT); })
  .on('end', () => { if (netLabels && S.view === 'network') styleNetwork(); }); nsvg.call(zoom);
let sim, netKey = '', nodesCache = [], netLabels = null, lastNetSel = '', netPending = false;
function drawNetwork(links) {
  const pairs = $('pairs').checked;
  const deg = new Map(); links.forEach(l => { deg.set('q' + l.q, (deg.get('q' + l.q) || 0) + 1); deg.set('p' + l.p, (deg.get('p' + l.p) || 0) + 1); });
  const ls = pairs ? links : links.filter(l => deg.get('q' + l.q) > 1 || deg.get('p' + l.p) > 1);
  const key_ = ls.map(l => l.i).join(',') + mode();
  if (key_ !== netKey) {
    netKey = key_; sim?.stop();
    const prev = new Map(nodesCache.map(n => [n.id, n]));
    const nodes = new Map();
    const node = (id, kind, ref) => nodes.get(id) || (nodes.set(id, Object.assign(prev.get(id) ? {x: prev.get(id).x, y: prev.get(id).y} : {}, {id, kind, ref})), nodes.get(id));
    const edges = new Map();
    for (const l of ls) { const a = node('q' + l.q, 'v', l.v), b = node('p' + l.p, 'p', l.po);
      const k = a.id + '|' + b.id; if (!edges.has(k)) edges.set(k, {source: a.id, target: b.id, ls: []}); edges.get(k).ls.push(l); }
    nodesCache = [...nodes.values()]; const es = [...edges.values()];
    const W = $('network').clientWidth || 900, H = $('network').clientHeight || 620;
    nlayer.selectAll('*').remove();
    const e = nlayer.append('g').selectAll('line').data(es).join('line').attr('class', 'sa-thread')
      .attr('stroke-width', d => (REL[d.ls[0].rel]?.w || 1) * .9 + (d.ls.length - 1) * .6).attr('stroke-dasharray', d => REL[d.ls[0].rel]?.dash).style('cursor', 'pointer')
      .on('mousemove', (ev, d) => showTip(ev, linkTip(d.ls[0]))).on('mouseleave', hideTip).on('click', (ev, d) => select({type: 'link', id: d.ls[0].i}));
    const r = d => d.kind === 'v' ? 2.4 + Math.sqrt(d.ref.links.length) * 1.3 : 2;
    const nd = nlayer.append('g').selectAll('circle').data(nodesCache).join('circle').attr('class', d => d.kind === 'v' ? 'sa-vdot' : 'sa-pdot').attr('r', r).style('cursor', 'pointer')
      .on('mousemove', (ev, d) => showTip(ev, d.kind === 'v' ? verseTip(d.ref) : poemTip(d.ref))).on('mouseleave', hideTip)
      .on('click', (ev, d) => select(d.kind === 'v' ? {type: 'verse', id: d.ref.ref} : {type: 'poem', id: d.ref.id}))
      .call(d3.drag().on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(.2).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (ev, d) => { d.fx = ev.x; d.fy = ev.y; }).on('end', (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = d.fy = null; }));
    netLabels = nlayer.append('g');   // labels last, so no node covers them
    sim = d3.forceSimulation(nodesCache).force('link', d3.forceLink(es).id(d => d.id).distance(24).strength(.9))
      .force('charge', d3.forceManyBody().strength(d => d.kind === 'v' ? -55 : -16)).force('x', d3.forceX(W / 2).strength(.045)).force('y', d3.forceY(H / 2).strength(.06))
      .force('collide', d3.forceCollide(d => r(d) + 1.5)).on('tick', () => {
        e.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        nd.attr('cx', d => d.x).attr('cy', d => d.y);
        netLabels.selectAll('g.sa-nl').attr('transform', labelT); });
    nodesCache.r = r;
    // settle the layout before drawing, so the view never drifts and framing is exact
    sim.stop(); for (let i = 0; i < 300; i++) sim.tick(); sim.on('tick')();
    netPending = true;
  }
  styleNetwork();
}
function styleNetwork() {
  const sel = selectionSet(), trace = sel ? traceMap() : null, r = nodesCache.r;
  const neutral = mode() === 'none';
  nlayer.selectAll('line.sa-thread').attr('stroke', d => trace && d.ls.some(l => sel.has(l)) ? trace.get(d.ls[0].v).color : (trace ? css('--sa-quiet') : color(d.ls[0].v)))
    .attr('stroke-opacity', d => sel ? (d.ls.some(l => sel.has(l)) ? 1 : .08) : (neutral ? .22 : .5));
  nlayer.selectAll('.sa-vdot').attr('fill', d => trace ? (trace.has(d.ref) ? trace.get(d.ref).color : css('--sa-ink3')) : color(d.ref)).attr('opacity', d => trace && !trace.has(d.ref) ? .35 : 1);
  nlayer.selectAll('.sa-pdot').attr('fill', d => sel && d.ref.links.some(l => sel.has(l)) ? css('--sa-ink') : css('--sa-ink3')).attr('opacity', d => !sel || d.ref.links.some(l => sel.has(l)) ? .9 : .3);
  const selKey = sel ? [...sel].map(l => l.i).join(',') : '';
  if (selKey !== lastNetSel) { lastNetSel = selKey; if (sel && !netPending) frame(sel); }
  if (netPending) { netPending = false; sel ? frame(sel, true) : fit(true); }
  if (!netLabels || !r) return;
  const labelled = nodesCache.filter(d => d.kind === 'v' && (trace ? trace.has(d.ref) : d.ref.links.length >= 12));
  let cx = 0, cy = 0;
  if (trace) { const ids = new Set([...sel].flatMap(l => ['q' + l.q, 'p' + l.p])), ns = nodesCache.filter(d => ids.has(d.id)); cx = d3.mean(ns, d => d.x); cy = d3.mean(ns, d => d.y); }
  netLabels.selectAll('g.sa-nl').data(labelled, d => d.id).join(enter => enter.append('g').attr('class', 'sa-nl'), u => u, x => x.remove())
    .attr('transform', labelT)
    .each(function (d) { const g = d3.select(this); g.selectAll('*').remove(); const rr = r(d) * netK;
      if (trace) { const t = trace.get(d.ref), i = [...trace.keys()].indexOf(d.ref);
        let a = Math.atan2(d.y - cy, d.x - cx); if (Math.hypot(d.x - cx, d.y - cy) < 1) a = -Math.PI / 2 + i * 2 * Math.PI / trace.size;
        const ux = Math.cos(a), uy = Math.sin(a), br = rr + 14;
        g.append('line').attr('x1', ux * (rr + 2)).attr('y1', uy * (rr + 2)).attr('x2', ux * (br - 5)).attr('y2', uy * (br - 5)).attr('stroke', t.color).attr('stroke-width', 1);
        key(g, ux * br, uy * br, t, d.ref.rf, ux >= 0 ? 'start' : 'end'); }
      else g.append('text').attr('class', 'sa-label').attr('y', -rr - 6).attr('text-anchor', 'middle').text(d.ref.rf); });
}
function frame(sel, now) {
  const ids = new Set([...sel].flatMap(l => ['q' + l.q, 'p' + l.p])), ns = nodesCache.filter(d => ids.has(d.id) && isFinite(d.x));
  if (!ns.length) return; const W = $('network').clientWidth, H = $('network').clientHeight;
  const [x0, x1] = d3.extent(ns, d => d.x), [y0, y1] = d3.extent(ns, d => d.y);
  const k = Math.min(2.4, .7 * Math.min(W / Math.max(60, x1 - x0), H / Math.max(60, y1 - y0)));
  const t = d3.zoomIdentity.translate(W / 2 - k * (x0 + x1) / 2, H / 2 - k * (y0 + y1) / 2).scale(k);
  (REDUCED || now ? nsvg : nsvg.transition().duration(450)).call(zoom.transform, t); }
function fit(now) { if (!nodesCache.length) return; const W = $('network').clientWidth, H = $('network').clientHeight;
  const [x0, x1] = d3.extent(nodesCache, d => d.x), [y0, y1] = d3.extent(nodesCache, d => d.y);
  const k = Math.min(3, .92 * Math.min(W / Math.max(1, x1 - x0), H / Math.max(1, y1 - y0)));
  const t = d3.zoomIdentity.translate(W / 2 - k * (x0 + x1) / 2, H / 2 - k * (y0 + y1) / 2).scale(k);
  (REDUCED || now ? nsvg : nsvg.transition().duration(450)).call(zoom.transform, t); }
$('fit').onclick = () => fit(); $('pairs').onchange = () => update();

// ---------- themes ----------
function drawThemes(links) {
  const byTheme = d3.rollup(links.flatMap(l => l.v.th.map(t => [t, l])), v => v.length, d => d[0]);
  const byFig = d3.rollup(links.filter(l => l.v.fig && l.v.fig !== 'none'), v => v.length, l => l.v.fig);
  const max = Math.max(1, ...byTheme.values()), bar = k => mode() === 'family' && k ? famColor(k) : 'var(--sa-ink)';
  const row = (label, sub, n, w, bg, pressed, onclick) => el(onclick ? 'button' : 'div', onclick ? {class: 'sa-trow', type: 'button', 'aria-pressed': pressed, onclick} : {class: 'sa-trow'},
    el('span', {}, label, el('small', {lang: 'fa', dir: 'rtl', text: sub})),
    el('span', {}, el('div', {class: 'sa-tbar', style: `width:${w}%;background:${bg}`})), el('span', {class: 'sa-tnum', text: fa(n)}));
  const groups = D.families.map(f => {
    const rows = f.themes.map(t => [t, byTheme.get(t) || 0]).sort((a, b) => b[1] - a[1]);
    return el('div', {class: 'sa-tgroup'}, el('h4', {}, mode() === 'family' ? el('span', {class: 'sa-sw', style: `background:${famColor(f.key)}`}) : null, f.en, el('span', {class: 'sa-fa', lang: 'fa', text: f.fa})),
      ...rows.map(([t, n]) => row(THEME[t].en, THEME[t].fa, n, Math.max(n ? 1 : 0, 100 * n / max), bar(f.key), S.theme === t,
        () => { S.theme = S.theme === t ? '' : t; $('theme').value = S.theme; setView('atlas'); })));
  });
  const fmax = Math.max(1, ...byFig.values());
  const figs = [...byFig].sort((a, b) => b[1] - a[1]).slice(0, 16);
  const figCol = el('div', {class: 'sa-tgroup'}, el('h4', {text: 'Figures and stories'}),
    ...figs.map(([k, n]) => row(FIG[k].en, FIG[k].fa, n, 100 * n / fmax, 'var(--sa-ink3)', S.figure === k,
      () => { S.figure = S.figure === k ? '' : k; $('figure').value = S.figure; setView('atlas'); })));
  const relCounts = d3.rollup(links, v => v.length, l => l.rel || 'unrated'), rmax = Math.max(1, ...relCounts.values());
  const relCol = el('div', {class: 'sa-tgroup'}, el('h4', {text: 'How Rumi borrows'}),
    ...RELS.filter(r => PRESENT.has(r.key)).map(r => row(r.en, r.fa, relCounts.get(r.key) || 0, 100 * (relCounts.get(r.key) || 0) / rmax, 'var(--sa-ink3)')));
  $('themes').replaceChildren(el('div', {class: 'sa-twocol'}, el('div', {class: 'sa-tcol'}, ...groups), el('div', {class: 'sa-tcol'}, figCol, relCol)),
    el('p', {class: 'sa-hint', text: 'Counts are cited couplets. A verse can carry two themes, so totals overlap. Choose a row to filter the atlas.'}));
}

// ---------- reading panel ----------
let TRACE = null;
const keyEl = v => { const t = TRACE?.get(v); return t && TRACE.size > 1 ? el('span', {class: 'sa-key'}, el('i', {style: `background:${t.color}`}), t.n) : null; };
function hl(text, span) { if (!span || !text.includes(span)) return [text]; const a = text.indexOf(span); return [text.slice(0, a), el('mark', {text: span}), text.slice(a + span.length)]; }
function bayt(l) { const t = TRACE?.get(l.v);
  return el('div', {class: 'sa-bayt', lang: 'fa', dir: 'rtl', style: t ? `--sa-hl:${t.color}` : null}, el('div', {}, ...hl(l.h[0], l.span)), el('div', {}, ...hl(l.h[1], l.span))); }
function meta(l) { return el('div', {class: 'sa-meta'}, l.rel ? el('span', {text: REL[l.rel].en}) : null, l.str ? el('span', {text: `${l.str[0].toUpperCase()}${l.str.slice(1)} link`}) : null); }
const RV = {confirmed_not_unique: 'Review: an adjacent ayah fits as well', weak: 'Review: weak link', unsupported: 'Review: not supported', better_ref_elsewhere: 'Review: another ayah fits better'};
function review(l) {
  const r = l.rc, rv = l.rv ? el('b', {text: RV[l.rv] + (l.alt?.length ? ` (${l.alt.map(fa).join('، ')})` : '')}) : null;
  if (!r) return l.rv ? el('p', {class: 'sa-review'}, rv, fa(l.why)) : null;
  const say = {keep: 'kept', replace: `moved to ${fa(r.ref)}`, keep_and_add: r.added ? `added beside ${fa(l.q)}: the couplet uses both` : `kept, and ${fa(r.ref)} added beside it`, drop: 'dropped'}[r.v];
  const head = r.agree ? `Second reading: ${say}. Claude Opus 5.5 and Claude Sonnet 5.5 agree.`
    : `Second reading: Claude Opus 5.5 would have it ${say}, Claude Sonnet 5.5 ${({keep: 'kept', replace: `moved to ${fa(r.sref)}`, keep_and_add: `kept with ${fa(r.sref)}`, drop: 'dropped'})[r.sv]}. Left for a human.`;
  return el('p', {class: 'sa-review'}, rv, l.why ? el('span', {text: fa(l.why)}) : null, el('b', {text: head, style: 'margin-top:6px'}),
    el('span', {class: 'sa-ai', text: 'AI'}), ' ' + r.en, el('span', {lang: 'fa', dir: 'rtl', style: 'display:block;margin-top:4px', text: fa(r.fa)}));
}
function gloss(l) { return l.gfa ? [el('p', {class: 'sa-gloss', lang: 'fa', dir: 'rtl'}, el('span', {class: 'sa-ai', text: 'AI'}), ' ', fa(l.gfa)), el('p', {class: 'sa-gloss-en', text: fa(l.gen)})] : []; }
function verseHead(v) {
  return [el('h3', {}, el('span', {text: v.rf}), el('span', {lang: 'ar', text: v.name})),
    el('div', {class: 'sa-meta'}, el('span', {text: v.rev === 'meccan' ? 'Meccan' : 'Medinan'}),
      ...v.th.map(t => el('button', {type: 'button', title: 'Filter by this theme', onclick: () => { S.theme = t; $('theme').value = t; update(); }}, THEME[t].en)),
      v.fig && v.fig !== 'none' ? el('button', {type: 'button', title: 'Filter by this figure', onclick: () => { S.figure = v.fig; $('figure').value = v.fig; update(); }}, FIG[v.fig].en) : null),
    el('p', {class: 'sa-ayah', lang: 'ar', dir: 'rtl', text: v.ar}),
    el('p', {class: 'sa-tr', lang: 'fa', dir: 'rtl', text: fa(v.fa)}),
    v.ten ? el('p', {class: 'sa-note'}, el('span', {class: 'sa-ai', text: 'AI'}), ' ' + fa(v.ten)) : null];
}
function poemLink(p) { return el('a', {href: p.url, target: '_blank', rel: 'noopener noreferrer', dir: 'rtl', lang: 'fa', text: p.label}); }
function starts() {
  const topV = Object.values(D.verses).sort((a, b) => b.links.length - a.links.length)[0];
  const multi = Object.values(D.poems).map(p => [p, new Set(p.links.map(l => l.q)).size]).sort((a, b) => b[1] - a[1]);
  const example = Object.values(D.poems).find(p => p.sec === 'tarjeeat' && p.num === 21) || multi[1][0];
  const item = (title, sub, s) => el('button', {class: 'sa-start', type: 'button', onclick: () => select(s)}, el('b', {text: title}), el('span', {text: sub}));
  return el('div', {class: 'sa-starts'},
    item(topV.rf, `most cited verse · ${plural(new Set(topV.links.map(l => l.p)).size, 'poem')}`, {type: 'verse', id: topV.ref}),
    item(example.label, `${plural(new Set(example.links.map(l => l.q)).size, 'verse')} from different surahs`, {type: 'poem', id: example.id}),
    item(multi[0][0].label, `most verses in one poem · ${fa(multi[0][1])}`, {type: 'poem', id: multi[0][0].id}));
}
function renderDetail() {
  const box = $('detail'), s = S.sel;
  TRACE = traceMap();
  $('clear').hidden = !s;
  if (!s) { box.replaceChildren(el('h3', {text: 'Trace a verse or poem'}),
    el('p', {class: 'sa-empty', text: 'Select anything in the chart. Each verse involved gets its own colour, here and in the chart.'}), starts()); return; }
  if (s.type === 'verse') { const v = D.verses[s.id];
    const byPoem = d3.groups(v.links, l => l.p);
    box.replaceChildren(...verseHead(v), el('h4', {text: `Cited in ${plural(byPoem.length, 'poem')}`}),
      ...byPoem.map(([pid, ls]) => el('section', {class: 'sa-cite'}, el('header', {}, poemLink(D.poems[pid]), el('button', {class: 'sa-link', type: 'button', text: 'Open poem', onclick: () => select({type: 'poem', id: pid})})),
        ...ls.flatMap(l => [bayt(l), meta(l), review(l), ...gloss(l)])))); }
  else if (s.type === 'poem') { const p = D.poems[s.id];
    const legend = TRACE.size > 1 ? el('div', {class: 'sa-meta'}, ...[...TRACE].map(([v, t]) => el('button', {type: 'button', title: 'Open this verse', onclick: () => select({type: 'verse', id: v.ref})},
      el('span', {class: 'sa-key'}, el('i', {style: `background:${t.color}`}), t.n), `${v.rf}`))) : null;
    box.replaceChildren(el('h3', {}, poemLink(p)), p.ten ? el('p', {class: 'sa-note'}, el('span', {class: 'sa-ai', text: 'AI'}), ' ' + fa(p.ten)) : null,
      el('h4', {text: `${plural(p.links.length, 'cited couplet')} · ${plural(TRACE.size, 'verse')}`}), legend,
      ...[...p.links].sort((a, b) => a.c - b.c).map(l => el('section', {class: 'sa-cite'}, el('header', {},
        el('span', {class: 'sa-meta'}, keyEl(l.v), el('span', {lang: 'fa', dir: 'rtl', text: `بیت ${fa(l.c + 1)}`})),
        el('button', {class: 'sa-link', type: 'button', text: `${l.v.rf} · ${l.v.name}`, onclick: () => select({type: 'verse', id: l.q})})), bayt(l), meta(l), review(l), ...gloss(l),
        el('p', {class: 'sa-ayah', lang: 'ar', dir: 'rtl', style: 'font-size:19px', text: l.v.ar})))); }
  else { const l = D.links[s.id];
    box.replaceChildren(...verseHead(l.v), el('section', {class: 'sa-cite'}, el('header', {}, poemLink(l.po), el('span', {class: 'sa-note', lang: 'fa', text: `بیت ${fa(l.c + 1)}`})), bayt(l), meta(l), review(l), ...gloss(l)),
      el('div', {class: 'sa-meta'}, el('button', {type: 'button', text: `All ${fa(l.v.links.length)} citations of ${l.v.rf}`, onclick: () => select({type: 'verse', id: l.q})}),
        el('button', {type: 'button', text: `All citations in ${l.po.label}`, onclick: () => select({type: 'poem', id: l.p})}))); }
  box.scrollTop = 0;
}
function select(s) { S.sel = s; save(); update(); }

// ---------- host widget state ----------
function save() { const st = {view: S.view, sel: S.sel, q: S.q, theme: S.theme, figure: S.figure}; window.openai?.setWidgetState?.({modelContent: st, privateContent: st})?.catch?.(() => {}); }

// ---------- update ----------
function update() {
  chips(); const links = visible();
  const nv = new Set(links.map(l => l.q)).size, np = new Set(links.map(l => l.p)).size;
  $('count').replaceChildren(...(links.length === D.links.length ? ['All ', el('b', {text: fa(links.length)}), ' cited couplets']
    : [el('b', {text: fa(links.length)}), ` of ${fa(D.links.length)} couplets · ${plural(nv, 'verse')} · ${plural(np, 'poem')}`]));
  if (S.view === 'atlas') drawAtlas(links); else if (S.view === 'network') drawNetwork(links); else drawThemes(links);
  renderDetail();
}
const st = window.openai?.widgetState?.privateContent;
if (st) Object.assign(S, {sel: st.sel || null, q: st.q || '', theme: st.theme || '', figure: st.figure || ''});
$('search').value = S.q; $('theme').value = S.theme; $('figure').value = S.figure;
new ResizeObserver(() => { if (S.view === 'atlas') drawAtlas(visible()); }).observe($('atlas'));
document.fonts?.ready.then(() => { if (S.view === 'atlas') drawAtlas(visible()); });
setView(st?.view || 'atlas');
window.addEventListener('openai:set_globals', ev => { const w = ev.detail?.globals?.widgetState?.privateContent; if (!w) return;
  Object.assign(S, {sel: w.sel || S.sel, q: w.q || '', theme: w.theme || '', figure: w.figure || ''});
  $('search').value = S.q; $('theme').value = S.theme; $('figure').value = S.figure; setView(w.view || S.view); });
})();
