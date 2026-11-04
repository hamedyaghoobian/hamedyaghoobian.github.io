// What Ferdowsi Let In: the Shahnameh with only its Arabic words left, and its deaths.
//
// The whole book is laid out as a manuscript of columns, read right to left, two half-lines to
// a row, and drawn dark. The Persian is there only as a ghost, close up. What shows is the
// Arabic: every word Ferdowsi took from Arabic, set where it falls on its line. A second layer
// marks the couplets where someone dies.
//
// Three layers, each on its own canvas: 1 the Persian (the ghost of the verse), 2 the Arabic
// words, 3 the deaths. l takes the book apart into them, seen from above; 1–3 show one alone.

const GUTTER = 1.4;            // between the two halves of a couplet, in em
const COL_GAP = 4.5;           // between columns of the book
const MARGIN = 6;
const ASPECT = 1.45;           // the book is laid out to roughly this width over height
const MAX_PX_PER_EM = 110;     // closest zoom
const READ_PX_PER_EM = 7;      // from here on the Persian shows, faintly, and the couplets can be read
const WORD_PX_PER_EM = 3;      // from here on the Arabic words are written out, not marked
const DEATHS_KEY = "what-ferdowsi-let-in:deaths";

// The field is cobalt in both themes (the frame's ground is CSS: --ro-sky); the Arabic words and
// the ghost of the Persian are cream. The deaths are red, as the wall label says: the one red in
// the piece. The site's tokens, as numbers: cream #F2EBDA, red #E0362C.
const CREAM = [242, 235, 218], RED = [224, 54, 44];
const PALETTE = { word: CREAM, ghost: CREAM, ghostA: .2, title: CREAM, death: RED };

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const frame = document.getElementById("frame");
const ghostCanvas = document.getElementById("ghost");
const deathCanvas = document.getElementById("death");
const platesCanvas = document.getElementById("plates");
const wordCanvas = document.getElementById("words");
const panel = document.getElementById("panel");
const hint = document.getElementById("hint");

let T, rows, perCol, cols, W, H, COL_W, ROW_H, BASE, COL_PITCH;
let lineX, lineY, lineS, lineRow, lineWords, lineAr, deathLine;
let arLine, arWord, arX0, arX1, arForm;
let cw = 1, ch = 1, dpr = 1;
let view = { s: 1, x: 0, y: 0 };
let pointer = null, shown = "";
const palette = PALETTE;
let showDeaths = (() => { try { return localStorage.getItem(DEATHS_KEY) === "1"; } catch (_) { return false; } })();
let dirty = true;

// ---------- layout: the book as a manuscript, columns read right to left ----------

const colEdge = c => W - MARGIN - c * COL_PITCH;
const colAt = x => Math.floor((W - MARGIN - x) / COL_PITCH);
const slotLeft = (c, h) => colEdge(c) - (h + 1) * COL_W - h * GUTTER;
const colCentre = c => colEdge(c) - COL_W - GUTTER / 2;
const bare = s => s.replace(/[\s‌]/g, "");

function layout() {
  ({ colW: COL_W, rowH: ROW_H, base: BASE } = T.page);
  COL_PITCH = 2 * COL_W + GUTTER + COL_GAP;
  rows = [];
  T.sections.forEach((s, si) => {
    rows.push({ kind: 2, si });
    s.poems.forEach((p, pi) => {
      const same = pi === 0 && (bare(p.title).startsWith(bare(s.title)) || bare(s.title).startsWith(bare(p.title)));
      if (!same) rows.push({ kind: 1, si, pi });
      for (let l = p.start; l < p.end; l += 2) rows.push({ kind: 0, l, si, pi });
    });
  });
  cols = Math.max(1, Math.round(Math.sqrt(ASPECT * ROW_H * rows.length / COL_PITCH)));
  perCol = Math.ceil(rows.length / cols);
  W = cols * COL_PITCH - COL_GAP + 2 * MARGIN;
  H = perCol * ROW_H + 2 * MARGIN;

  const n = T.lines.length;
  lineX = new Float32Array(n); lineY = new Float32Array(n); lineS = new Float32Array(n);
  lineRow = new Int32Array(n);
  rows.forEach((r, i) => {
    r.col = Math.floor(i / perCol);
    r.row = i % perCol;
    if (r.kind !== 0) return;
    for (let h = 0; h < 2 && r.l + h < n; h++) {
      const l = r.l + h;
      const w = T.widths[l] / T.upem;
      const s = Math.min(1, (COL_W - .4) / w);
      lineX[l] = slotLeft(r.col, h) + COL_W / 2 - w * s / 2;   // half-lines centred in their slots
      lineY[l] = MARGIN + r.row * ROW_H + BASE;
      lineS[l] = s;
      lineRow[l] = i;
    }
  });

  // the Arabic words, by line
  const a = T.arabic, k = a.length / 5;
  arLine = new Int32Array(k); arWord = new Int16Array(k); arX0 = new Float32Array(k); arX1 = new Float32Array(k); arForm = new Int32Array(k);
  lineAr = new Int32Array(n + 1);
  for (let i = 0; i < k; i++) {
    arLine[i] = a[i * 5]; arWord[i] = a[i * 5 + 1]; arForm[i] = a[i * 5 + 4];
    const l = arLine[i], f = lineS[l] / T.upem;
    arX0[i] = lineX[l] + a[i * 5 + 2] * f;
    arX1[i] = lineX[l] + a[i * 5 + 3] * f;
    lineAr[l + 1]++;
  }
  for (let l = 0; l < n; l++) lineAr[l + 1] += lineAr[l];
  lineWords = [];
  deathLine = new Uint8Array(n);
  // 1: a section headed with a killing or a death; 2: a couplet in it that says it
  for (const d of T.deaths) {
    for (let l = d.start; l < d.end; l++) deathLine[l] = 1;
    for (const l of d.lines) { deathLine[l] = 2; if (l + 1 < n) deathLine[l + 1] = 2; }
  }
}

// ---------- view ----------

const fitScale = () => Math.min(cw / W, ch / H);

function clampView() {
  view.s = Math.min(MAX_PX_PER_EM, Math.max(fitScale(), view.s));
  const pw = W * view.s, ph = H * view.s;
  view.x = pw <= cw ? (cw - pw) / 2 : Math.min(0, Math.max(cw - pw, view.x));
  view.y = ph <= ch ? (ch - ph) / 2 : Math.min(0, Math.max(ch - ph, view.y));
  dirty = true;
}

function fit() { view.s = fitScale(); clampView(); }

function resize() {
  const r = frame.getBoundingClientRect();
  const wasFit = Math.abs(view.s - fitScale()) < 1e-6;
  const cx = (cw / 2 - view.x) / view.s, cy = (ch / 2 - view.y) / view.s;
  cw = Math.max(1, r.width); ch = Math.max(1, r.height);
  dpr = Math.min(2, devicePixelRatio || 1);
  for (const c of [ghostCanvas, deathCanvas, wordCanvas, platesCanvas]) { c.width = Math.round(cw * dpr); c.height = Math.round(ch * dpr); }
  plates = null;
  if (wasFit || !T) fit();
  else { view.x = cw / 2 - cx * view.s; view.y = ch / 2 - cy * view.s; clampView(); }
  ghost.key = words.key = deaths.key = "";
}

function zoomAt(px, py, f) {
  const s = Math.min(MAX_PX_PER_EM, Math.max(fitScale(), view.s * f));
  view.x = px - (px - view.x) * s / view.s;
  view.y = py - (py - view.y) * s / view.s;
  view.s = s;
  clampView();
}

// the wheel, the buttons and the keys set where the zoom is going; each frame eases toward it
let zoomGoal = null;
function zoomTo(px, py, f) {
  const s = Math.min(MAX_PX_PER_EM, Math.max(fitScale(), (zoomGoal ? zoomGoal.s : view.s) * f));
  zoomGoal = { s, px, py };
}

// ---------- what a stretch of the book looks like at one scale ----------

// the rows of the book inside a box of the page, at scale s, offset (ox, oy), w by h css px
function eachRow(s, ox, oy, w, h, fn) {
  const x0 = -ox / s, x1 = (w - ox) / s, y0 = -oy / s, y1 = (h - oy) / s;
  const cFrom = Math.max(0, Math.min(colAt(x0), colAt(x1)));
  const cTo = Math.min(cols - 1, Math.max(colAt(x0), colAt(x1)));
  const rFrom = Math.max(0, Math.floor((y0 - MARGIN) / ROW_H) - 1);
  const rTo = Math.min(perCol - 1, Math.ceil((y1 - MARGIN) / ROW_H) + 1);
  for (let c = cFrom; c <= cTo; c++) for (let rr = rFrom; rr <= rTo; rr++) {
    const row = rows[c * perCol + rr];
    if (!row) break;
    fn(row, c);
  }
}

const wordsOf = l => lineWords[l] || (lineWords[l] = T.lines[l].split(" "));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// the ghost: the Persian, and the headings of the books and their sections. From far off, where
// letters would be smaller than a pixel, each half-line is a faint bar the length it is set.
const ghostA = () => solo === 0 ? .6 : palette.ghostA;     // alone, the Persian comes up
function setGhost(ctx, s, ox, oy, w, h) {
  ctx.direction = "rtl"; ctx.textBaseline = "alphabetic";
  let size = 0;
  if (s < READ_PX_PER_EM * .6) {
    ctx.fillStyle = rgba(palette.ghost, solo === 0 ? .42 : .3);
    eachRow(s, ox, oy, w, h, row => {
      if (row.kind !== 0) return;
      for (let l = row.l; l < row.l + 2 && l < T.lines.length; l++) {
        const ww = T.widths[l] / T.upem * lineS[l] * s;
        ctx.fillRect(lineX[l] * s + ox, (lineY[l] - .5) * s + oy, ww, Math.max(.8, .45 * s));
      }
    });
    return;
  }
  eachRow(s, ox, oy, w, h, (row, c) => {
    if (row.kind === 0) {
      ctx.textAlign = "left";
      ctx.fillStyle = rgba(palette.ghost, ghostA());
      for (let l = row.l; l < row.l + 2 && l < T.lines.length; l++) {
        const px = Math.round(s * lineS[l] * 100) / 100;
        if (px !== size) { ctx.font = `${px}px "Hand"`; size = px; }
        ctx.fillText(T.lines[l], lineX[l] * s + ox, lineY[l] * s + oy);
      }
    } else {
      const sec = T.sections[row.si];
      const title = row.kind === 2 ? sec.title : sec.poems[row.pi].title;
      ctx.font = `${s * (row.kind === 2 ? 1.25 : .85)}px "Hand"`; size = 0;
      ctx.textAlign = "center";
      ctx.fillStyle = rgba(palette.title, row.kind === 2 ? .8 : .55);
      ctx.fillText(title, colCentre(c) * s + ox, (MARGIN + row.row * ROW_H + BASE) * s + oy);
    }
  });
}

// the deaths: the sections that name one
function setDeaths(ctx, s, ox, oy, w, h) {
  // A wash alone turns mauve on cobalt, so each death section also gets a solid red rule down its
  // right edge, where its lines begin: rows run on into one red line the length of the section.
  const death = rgba(palette.death, 1), shade = rgba(palette.death, .1);
  eachRow(s, ox, oy, w, h, (row, c) => {
    if (row.kind !== 0) return;
    if (deathLine[row.l]) {   // the section shaded red; the couplet that says it, a red rule
      const x = slotLeft(c, 1) * s + ox, w = (2 * COL_W + GUTTER) * s;
      const y0 = (MARGIN + row.row * ROW_H) * s + oy;
      ctx.fillStyle = shade;
      ctx.fillRect(x, y0, w, ROW_H * s + .5);
      ctx.fillStyle = death;
      const rw = Math.max(2, .22 * s);
      ctx.fillRect(x + w + Math.max(1.5, .35 * s), y0, rw, ROW_H * s + .5);
      if (deathLine[row.l] === 2) {
        ctx.fillStyle = death;
        ctx.fillRect(x, (MARGIN + row.row * ROW_H + BASE + .18) * s + oy, w, Math.max(1.2, .12 * s));
      }
    }
  });
}

// what is left: the Arabic words, marked from far off and written out close up
function setWords(ctx, s, ox, oy, w, h, far) {
  ctx.direction = "rtl"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  const write = !far && s >= WORD_PX_PER_EM;
  const word = rgba(palette.word, 1);
  if (write) ctx.font = `${s}px "Hand"`;
  let size = s;
  eachRow(s, ox, oy, w, h, (row, c) => {
    if (row.kind !== 0) return;
    ctx.fillStyle = word;
    for (let l = row.l; l < row.l + 2 && l < T.lines.length; l++) {
      for (let i = lineAr[l]; i < lineAr[l + 1]; i++) {
        const x = arX0[i] * s + ox, y = lineY[l] * s + oy;
        if (write) {
          const px = Math.round(s * lineS[l] * 100) / 100;
          if (px !== size) { ctx.font = `${px}px "Hand"`; size = px; }
          ctx.fillText(wordsOf(l)[arWord[i]], x, y);
        } else {   // a mark the width of the word, never smaller than a pixel or so
          const ww = Math.max(1.4, (arX1[i] - arX0[i]) * s), hh = Math.max(1.4, .42 * s);
          ctx.fillRect(x + ((arX1[i] - arX0[i]) * s - ww) / 2, y - .38 * s - hh / 2, ww, hh);
        }
      }
    }
  });
}

// ---------- tiles: each layer is set at whole steps of scale, the way a map is, and kept ----------

const TILE = 256;                // css px a side
const TILE_MS = 6;               // time to spend setting tiles in a frame

function TileLayer(canvas, set, tag) {
  return { canvas, ctx: canvas.getContext("2d"), set, tag, tiles: new Map(), for: "", pending: false, key: "" };
}
const ghost = TileLayer(ghostCanvas, setGhost, () => `${solo === 0}`);
const deaths = TileLayer(deathCanvas, setDeaths, () => "");
const words = TileLayer(wordCanvas, setWords, () => "");

function tile(L, ts, tx, ty, make, keep) {
  const k = `${ts} ${tx} ${ty}`;
  const t = L.tiles.get(k);
  if (t) { L.tiles.delete(k); L.tiles.set(k, t); return t; }     // the most recently used go last
  if (!make) return null;
  let c;
  if (L.tiles.size >= keep) { const old = L.tiles.keys().next().value; c = L.tiles.get(old); L.tiles.delete(old); }
  else c = document.createElement("canvas");
  c.width = c.height = Math.round(TILE * dpr);                   // also clears it
  const x = c.getContext("2d");
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  L.set(x, ts, -tx * TILE, -ty * TILE, TILE, TILE);
  L.tiles.set(k, c);
  return c;
}

function drawLayer(L, alpha, until) {
  const key = `${view.s.toFixed(3)} ${view.x.toFixed(1)} ${view.y.toFixed(1)} ${alpha.toFixed(3)} ${cw} ${ch}`;
  if (key === L.key && !L.pending) return;
  L.key = key;
  const lctx = L.ctx;
  lctx.setTransform(1, 0, 0, 1, 0, 0);
  lctx.clearRect(0, 0, L.canvas.width, L.canvas.height);
  L.pending = false;
  if (alpha < .005) return;
  const tag = `${L.tag()} ${dpr}`;
  if (tag !== L.for) { L.tiles.clear(); L.for = tag; }
  const ts = Math.min(128, 2 ** Math.round(Math.log2(view.s)));
  const step = TILE / ts * view.s;                               // a tile on screen, css px
  const tx0 = Math.floor(-view.x / step), tx1 = Math.floor((cw - view.x) / step);
  const ty0 = Math.floor(-view.y / step), ty1 = Math.floor((ch - view.y) / step);
  const keep = 3 * (tx1 - tx0 + 1) * (ty1 - ty0 + 1);
  const px = v => Math.round(v * dpr);
  lctx.globalAlpha = alpha;
  for (let ty = ty0; ty <= ty1; ty++) {
    const Y0 = px(view.y + ty * step), Y1 = px(view.y + (ty + 1) * step);
    for (let tx = tx0; tx <= tx1; tx++) {
      const X0 = px(view.x + tx * step), X1 = px(view.x + (tx + 1) * step);
      const c = tile(L, ts, tx, ty, performance.now() < until, keep);
      if (c) { lctx.drawImage(c, X0, Y0, X1 - X0, Y1 - Y0); continue; }
      L.pending = true;
      const p = tile(L, ts / 2, tx >> 1, ty >> 1, false);         // a quarter of the coarser step's tile
      if (p) { const q = p.width / 2; lctx.drawImage(p, (tx & 1) * q, (ty & 1) * q, q, q, X0, Y0, X1 - X0, Y1 - Y0); continue; }
      const XM = X0 + Math.round((X1 - X0) / 2), YM = Y0 + Math.round((Y1 - Y0) / 2);
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {   // or the finer step's four
        const f = tile(L, ts * 2, tx * 2 + i, ty * 2 + j, false);
        if (f) lctx.drawImage(f, i ? XM : X0, j ? YM : Y0, i ? X1 - XM : XM - X0, j ? Y1 - YM : YM - Y0);
      }
    }
  }
  lctx.globalAlpha = 1;
}

// ---------- the couplet under the pointer ----------

const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

// the Arabic word nearest the pointer, within a few pixels; or, close up, the line under it
function under(px, py) {
  const x = (px - view.x) / view.s, y = (py - view.y) / view.s;
  const c = colAt(x);
  if (c < 0 || c >= cols) return null;
  const reach = 9 / view.s;
  const r0 = Math.max(0, Math.floor((y - reach - MARGIN) / ROW_H)), r1 = Math.min(perCol - 1, Math.floor((y + reach - MARGIN) / ROW_H));
  let best = -1, bd = reach;
  for (let rr = r0; rr <= r1; rr++) {
    const row = rows[c * perCol + rr];
    if (!row || row.kind !== 0) continue;
    for (let l = row.l; l < row.l + 2 && l < T.lines.length; l++) for (let i = lineAr[l]; i < lineAr[l + 1]; i++) {
      const dx = x < arX0[i] ? arX0[i] - x : x > arX1[i] ? x - arX1[i] : 0;
      const d = Math.hypot(dx, y - (lineY[l] - .38));
      if (d < bd) { bd = d; best = i; }
    }
  }
  if (best >= 0) return { l: arLine[best], i: best };
  if (view.s < READ_PX_PER_EM * .6) return null;
  const rr = Math.floor((y - MARGIN) / ROW_H), row = rows[c * perCol + rr];
  if (!row || row.kind !== 0) return null;
  for (let h = 0; h < 2; h++) if (x >= slotLeft(c, h) && x <= slotLeft(c, h) + COL_W) return { l: row.l + h, i: -1 };
  return null;
}

function showPanel(u) {
  const key = u ? `${u.l} ${u.i}` : "";
  if (key === shown) return;
  shown = key;
  if (!u) { panel.classList.remove("show"); return; }
  const row = rows[lineRow[u.l]];
  const sec = T.sections[row.si], poem = sec.poems[row.pi];
  const half = l => {
    const ws = wordsOf(l).map(esc);
    for (let i = lineAr[l]; i < lineAr[l + 1]; i++) ws[arWord[i]] = `<b${i === u.i ? ' class="this"' : ""}>${ws[arWord[i]]}</b>`;
    return ws.join(" ");
  };
  document.getElementById("where").textContent =
    `${sec.title}${poem.title !== sec.title ? " · " + poem.title : ""}`;
  // the couplet in the site's verse form: each hemistich a line, its count of Arabic words at the end
  const line = l => l < T.lines.length
    ? `<p class="line"><span class="t">${half(l)}</span><span class="n" title="Arabic words">${lineAr[l + 1] - lineAr[l]}</span></p>` : "";
  document.getElementById("couplet").innerHTML = line(row.l) + line(row.l + 1);
  let what = `couplet ${(row.l / 2 + 1).toLocaleString("en")} of ${(T.lines.length / 2).toLocaleString("en")}`;
  if (deathLine[row.l] === 2) what += " · a death";
  const g = document.getElementById("gloss");
  if (u.i >= 0) {
    const [form, rom, sense, src] = T.forms[arForm[u.i]];
    g.innerHTML = `<span lang="fa">${esc(form)}</span>${rom ? `<i>${esc(rom)}</i>` : ""}${sense ? `<span>${esc(sense)}</span>` : ""}` +
      `<small>from Arabic${src === "w" ? " · sense from Wiktionary" : ""}</small>`;
  } else g.innerHTML = "";
  document.getElementById("count").textContent = what;
  panel.classList.add("show");
}

// ---------- input ----------

const pts = new Map();
let pinch = null, dragFrom = null;
const local = e => { const r = frame.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

wordCanvas.addEventListener("pointerdown", e => {
  if (explodeTarget) return;
  wordCanvas.setPointerCapture(e.pointerId);
  zoomGoal = viewGoal = null;
  pts.set(e.pointerId, local(e));
  if (pts.size === 1) { dragFrom = local(e); wordCanvas.classList.add("dragging"); }
  if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) }; }
});
wordCanvas.addEventListener("pointermove", e => {
  const p = local(e);
  pointer = p;
  if (!pts.has(e.pointerId)) return;
  const prev = pts.get(e.pointerId);
  pts.set(e.pointerId, p);
  if (pts.size === 2 && pinch) {
    const [a, b] = [...pts.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, d / pinch.d);
    pinch.d = d;
  } else if (pts.size === 1) {
    if (dragFrom && Math.hypot(p[0] - dragFrom[0], p[1] - dragFrom[1]) < 3) return;
    dragFrom = null;
    view.x += p[0] - prev[0]; view.y += p[1] - prev[1];
    clampView();
  }
});
function release(e) {
  pts.delete(e.pointerId);
  if (pts.size < 2) pinch = null;
  if (pts.size === 0) wordCanvas.classList.remove("dragging");
  if (e.pointerType !== "mouse" && pts.size === 0) pointer = null;
}
wordCanvas.addEventListener("pointerup", release);
wordCanvas.addEventListener("pointercancel", release);
wordCanvas.addEventListener("pointerleave", () => { if (!pts.size) pointer = null; });
wordCanvas.addEventListener("wheel", e => {
  e.preventDefault();
  if (explodeTarget) return;
  const [x, y] = local(e);
  const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  viewGoal = null;
  zoomTo(x, y, Math.exp(-dy * (e.ctrlKey ? .01 : .0022)));   // ctrl: a trackpad pinch
}, { passive: false });

const centre = () => [cw / 2, ch / 2];
document.getElementById("zoom-in").onclick = () => { viewGoal = null; zoomTo(...centre(), 1.8); };
document.getElementById("zoom-out").onclick = () => { viewGoal = null; zoomTo(...centre(), 1 / 1.8); };
document.getElementById("reset").onclick = () => { if (explodeTarget) setExplode(false); zoomGoal = viewGoal = null; fit(); };

const deathsBtn = document.getElementById("deaths");
function useDeaths(on) {
  showDeaths = on;
  deathsBtn.setAttribute("aria-pressed", on);
  document.body.classList.toggle("deaths", on);
  try { localStorage.setItem(DEATHS_KEY, on ? "1" : "0"); } catch (_) {}
  shown = ""; dirty = true;
  if (ui) ui.render();
}
deathsBtn.onclick = () => useDeaths(!showDeaths);

// ---------- the layers: taken apart, seen from above; or one alone ----------

const LAYERS = [
  ["the Persian", "the verse, faint, every word of it"],
  ["the Arabic", "6,409 words he let in"],
  ["the deaths", "166 sections that name one"],
];
let explode = 0, explodeTarget = 0, solo = -1, peek = -1, soloAmt = 0, soloShown = -1, plates = null;
const layersBtn = document.getElementById("layers");
const soloChip = document.getElementById("solo");

// each layer drawn once, whole, at about the size the stack shows it
function buildPlates() {
  const k = Math.min(3, 4096 / W, 4096 / H, Math.max(1, fitScale() * dpr * 1.25));   // and never a canvas too large to keep
  plates = [setGhost, setWords, setDeaths].map(fn => {
    const c = document.createElement("canvas");
    c.width = Math.ceil(W * k); c.height = Math.ceil(H * k);
    const x = c.getContext("2d");
    fn(x, k, 0, 0, c.width, c.height, true);
    return c;
  });
}
// a plane's affine map, part way (t) from the book as it is on screen to taken apart:
// x' = a x + e, y' = b x + d y + f(z); vertical lines stay vertical, the rows slope down to the left
function plane(z, t) {
  const A = 1, B = .12, D = .26, n = LAYERS.length;
  const gapK = 1.12;                                          // a plane's gap, in plane heights
  const k = Math.min(cw * .64 / (A * W), ch * .88 / (B * W + D * H * (1 + gapK * (n - 1))));
  const G = gapK * D * k * H;
  const ex = { a: A * k, b: -B * k, d: D * k, e: cw * .4 - A * k * W / 2,
               f: ch / 2 + (B * k * W - D * k * H) / 2 - (z - (n - 1) / 2) * G };
  const fl = { a: view.s, b: 0, d: view.s, e: view.x, f: view.y };
  const m = v => fl[v] + (ex[v] - fl[v]) * t;
  return { a: m("a"), b: m("b"), d: m("d"), e: m("e"), f: m("f") };
}
const at = (p, x, y) => [p.a * x + p.e, p.b * x + p.d * y + p.f];

const labels = LAYERS.map(([title, sub], z) => {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "layer-label";
  el.title = "See this layer alone";
  el.innerHTML = `<span class="fp-k">${z + 1}</span><b>${title}</b><small>${sub}</small>`;
  el.tabIndex = -1;
  el.onpointerenter = el.onfocus = () => peekAt(z);
  el.onpointerleave = el.onblur = () => { if (peek === z) peekAt(-1); };
  el.onclick = () => chooseLayer(z);
  frame.appendChild(el);
  return el;
});
function peekAt(z) { peek = z; labels.forEach((el, i) => el.classList.toggle("is-peek", i === z)); }
function setExplode(on) {
  explodeTarget = on ? 1 : 0;
  if (on && !plates) buildPlates();
  document.body.classList.toggle("exploded", on);
  layersBtn.setAttribute("aria-pressed", on);
  labels.forEach(el => el.tabIndex = on ? 0 : -1);
  if (on) { sel = -1; pointer = null; } else peekAt(-1);
  if (ui) ui.render();
}
function chooseLayer(z) {
  if (z >= LAYERS.length) return;
  solo = z;
  peekAt(-1);
  if (z >= 0) {
    const [title, sub] = LAYERS[z];
    soloChip.querySelector(".what").innerHTML = `<span class="fp-k">${z + 1}</span>${title} alone<small>${sub}</small>`;
    if (explodeTarget) setExplode(false);
  }
  soloChip.hidden = z < 0;
  dirty = true;
  try {
    const url = new URL(location.href);
    if (z >= 0) url.searchParams.set("layer", z + 1); else url.searchParams.delete("layer");
    history.replaceState(null, "", url);
  } catch (_) {}
  if (ui) ui.render();
}
layersBtn.onclick = () => setExplode(!explodeTarget);
soloChip.querySelector("button").onclick = () => chooseLayer(-1);

function drawPlates(e) {
  const x = platesCanvas.getContext("2d");
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.clearRect(0, 0, platesCanvas.width, platesCanvas.height);
  platesCanvas.style.opacity = Math.min(1, e * 3);
  if (e < .001 || !plates) return;
  const want = peek >= 0 ? peek : solo;
  for (let z = 0; z < LAYERS.length; z++) {
    const p = plane(z, e);
    x.setTransform(p.a * dpr, p.b * dpr, 0, p.d * dpr, p.e * dpr, p.f * dpr);
    x.globalAlpha = want >= 0 && want !== z ? .12 : 1;
    x.drawImage(plates[z], 0, 0, W, H);
    x.globalAlpha = .45 * e;                                  // the plane's edge, so you can see where it sits
    x.strokeStyle = rgba(CREAM, 1);
    x.lineWidth = 1 / Math.max(p.d, .001);
    x.strokeRect(0, 0, W, H);
    const [lx, ly] = at(p, W, H);
    labels[z].style.opacity = e * e;
    labels[z].style.transform = `translate(${lx + 12}px, ${ly}px) translateY(-50%)`;
  }
  x.globalAlpha = 1;
}

// ---------- keys: the page's until the frame has focus, then the piece's (see ../piece.js) ----------

// j / k read the Arabic words one by one, in the order of the book: the view comes close, the
// word is underlined in yellow (your hand), and its couplet and its sense show below.
let sel = -1, viewGoal = null;
const selRule = document.getElementById("sel-rule");
function readStep(d) {
  if (!T) return;
  const k = arLine.length;
  if (sel >= 0) sel = Math.max(0, Math.min(k - 1, sel + d));
  else {                                         // the first word at or after the line in the middle of the view
    const x = (cw / 2 - view.x) / view.s, y = (ch * .4 - view.y) / view.s;
    const c = Math.min(cols - 1, Math.max(0, colAt(x)));
    let r = c * perCol + Math.min(perCol - 1, Math.max(0, Math.floor((y - MARGIN) / ROW_H)));
    while (r < rows.length - 1 && rows[r].kind !== 0) r++;
    const l = rows[r].l;
    sel = Math.min(k - 1, lineAr[l]);
  }
  const l = arLine[sel];
  const s = Math.min(MAX_PX_PER_EM, Math.max(view.s, READ_PX_PER_EM * 2));
  const cx = (arX0[sel] + arX1[sel]) / 2, cy = lineY[l] - .38;
  const pw = W * s, ph = H * s;
  let x = cw / 2 - cx * s, y = ch * .4 - cy * s;
  x = pw <= cw ? (cw - pw) / 2 : Math.min(0, Math.max(cw - pw, x));
  y = ph <= ch ? (ch - ph) / 2 : Math.min(0, Math.max(ch - ph, y));
  zoomGoal = null;
  viewGoal = { s, x, y };
}
function readRule() {
  if (sel < 0) { selRule.hidden = true; return; }
  const l = arLine[sel];
  selRule.hidden = false;
  selRule.style.width = Math.max(4, (arX1[sel] - arX0[sel]) * view.s) + "px";
  selRule.style.transform = `translate(${arX0[sel] * view.s + view.x}px, ${(lineY[l] + .18) * view.s + view.y}px)`;
}

const ui = window.Piece({
  frame,
  keys: () => explodeTarget
    ? [["j k", "look at a layer"], ["1–3", "one layer alone"], ["enter", "see it alone"], ["l", "put it back"], ["esc", "put it back"]]
    : [["j k", "the next Arabic word"], ["d", showDeaths ? "the deaths: on" : "the deaths"], ["l", "layers"], ["1–3", "one layer alone"],
       ["+ − 0", "zoom · whole book"], ["← →", "move"],
       ["esc", solo >= 0 ? "the whole book back" : sel >= 0 ? "stop reading" : "give the keys back"]],
  help: () => [
    ["j k", "the next / previous Arabic word, in the order of the book: its couplet and its sense show below"],
    ["d", "the deaths: the sections that name a death, shaded red"],
    ["l", "take the book apart into its layers (≋)"],
    ["1–3", "one layer alone: 1 the Persian · 2 the Arabic · 3 the deaths"],
    ["+ − 0", "come closer · go back · see the whole book (◻)"],
    ["← ↑ → ↓", "move across the book"],
    ["", "taken apart: j k look at a layer, enter shows it alone, esc puts the book back"],
  ],
  key(e) {
    const k = e.key, step = 80, n = LAYERS.length;
    if (explodeTarget) {
      if (k === "j" || k === "ArrowDown") { peekAt(peek <= 0 ? n - 1 : peek - 1); return true; }
      if (k === "k" || k === "ArrowUp") { peekAt(peek < 0 || peek >= n - 1 ? 0 : peek + 1); return true; }
      if (/^[1-3]$/.test(k)) { chooseLayer(+k - 1); return true; }
      if (k === "Enter" && peek >= 0) { chooseLayer(peek); return true; }
      return false;
    }
    if (/^[1-3]$/.test(k)) { chooseLayer(solo === +k - 1 ? -1 : +k - 1); return true; }
    if (k === "j" || k === "k") { readStep(k === "j" ? 1 : -1); return true; }
    if (k.startsWith("Arrow")) {
      viewGoal = null;
      view.x += k === "ArrowLeft" ? step : k === "ArrowRight" ? -step : 0;
      view.y += k === "ArrowUp" ? step : k === "ArrowDown" ? -step : 0;
      clampView();
      return true;
    }
    return false;
  },
  escape() {
    if (explodeTarget) { setExplode(false); return true; }
    if (solo >= 0) { chooseLayer(-1); return true; }
    if (sel >= 0) { sel = -1; return true; }
    return false;
  },
});

// ---------- the loop ----------

let then = performance.now(), running = true;
const t0 = then;

function frameLoop(now) {
  if (!running) return;
  const dt = Math.min(100, now - then);
  then = now;
  if (viewGoal) {
    const k = 1 - Math.pow(1e-4, dt / 1000);
    view.s += (viewGoal.s - view.s) * k; view.x += (viewGoal.x - view.x) * k; view.y += (viewGoal.y - view.y) * k;
    clampView();
    if (Math.abs(viewGoal.s - view.s) < .01 && Math.abs(viewGoal.x - view.x) < .5 && Math.abs(viewGoal.y - view.y) < .5) viewGoal = null;
  }
  if (zoomGoal) {
    const r = zoomGoal.s / view.s;
    if (Math.abs(Math.log(r)) < 1e-3) { zoomAt(zoomGoal.px, zoomGoal.py, r); zoomGoal = null; }
    else zoomAt(zoomGoal.px, zoomGoal.py, Math.pow(r, 1 - Math.pow(1e-6, dt / 1000)));
  }
  if (dirty) { ghost.key = words.key = deaths.key = ""; dirty = false; }
  explode += (explodeTarget - explode) * (1 - Math.pow(.02, dt / 1000));
  if (Math.abs(explodeTarget - explode) < .0005) explode = explodeTarget;
  const e = explode * explode * (3 - 2 * explode);
  if (soloShown !== solo && solo >= 0) { soloShown = solo; dirty = true; }
  soloAmt += ((solo >= 0 ? 1 : 0) - soloAmt) * (1 - Math.pow(.01, dt / 1000));
  if (soloAmt < .001 && solo < 0) soloShown = -1;
  // what each layer shows on its own terms, then with one chosen
  const near = Math.min(1, Math.max(0, (view.s - READ_PX_PER_EM * .6) / (READ_PX_PER_EM * .4)));
  const normal = [near, 1, showDeaths ? 1 : 0];
  const mixA = z => (soloShown < 0 ? normal[z] : normal[z] + ((soloShown === z ? 1 : 0) - normal[z]) * soloAmt) * (1 - e);
  const until = performance.now() + TILE_MS;
  drawLayer(deaths, mixA(2), until);
  drawLayer(words, mixA(1), until);
  drawLayer(ghost, mixA(0), until);
  drawPlates(e);
  const hov = pointer && !pts.size && !explodeTarget ? under(...pointer) : null;
  showPanel(hov || (sel >= 0 ? { l: arLine[sel], i: sel } : null));
  readRule();
  if (view.s > fitScale() * 1.5 && now - t0 > 4000) hint.classList.add("gone");
  requestAnimationFrame(frameLoop);
}

function wake() {
  const visible = !document.hidden && frameVisible;
  if (visible && !running) { running = true; then = performance.now(); requestAnimationFrame(frameLoop); }
  else if (!visible) running = false;
}
let frameVisible = true;
new IntersectionObserver(([en]) => { frameVisible = en.isIntersecting; wake(); }).observe(frame);
document.addEventListener("visibilitychange", wake);

// ---------- start ----------

(async () => {
  const [text] = await Promise.all([
    fetch("data/text.json").then(r => r.json()),
    new FontFace("Hand", "url(data/hand.woff2)").load().then(f => document.fonts.add(f)).catch(() => {}),
  ]);
  T = text;
  layout();
  frame.parentElement.style.setProperty("--aspect", (W / H).toFixed(3));   // the stage: the frame and the keys under it
  resize();
  useDeaths(showDeaths || new URLSearchParams(location.search).get("deaths") === "1");
  const z0 = +new URLSearchParams(location.search).get("layer") - 1;
  if (z0 >= 0) chooseLayer(z0);
  new ResizeObserver(resize).observe(frame);
  requestAnimationFrame(frameLoop);
})().catch(err => {
  console.error(err);
  frame.insertAdjacentHTML("beforeend", `<p class="fallback">The book could not be loaded.</p>`);
});
