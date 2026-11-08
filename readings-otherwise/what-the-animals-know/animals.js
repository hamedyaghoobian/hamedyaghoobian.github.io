// What the Animals Know: three books of Persian literature with only their animals lit, each by how
// much mind the text gives it, in the terms of Steven Wagschal's Minding Animals (2018).
//
// A book is laid out as a manuscript of columns, read right to left: verse two half-lines to a row,
// Kalila's prose in lines a couplet wide. The words are drawn dark; the animals are lit where they
// fall. The light is the spectrum: dim for an animal treated as a thing, plain for one that only does
// what its kind does, warm for a mind read truly from the animal, bright for human faculties given to
// it. An animal said of a person, a figure of speech, is drawn in a colour of its own.

const COL_GAP = 4.5;
const MARGIN = 6;
const ASPECT = 1.45;
const MAX_PX_PER_EM = 110;
const READ_PX_PER_EM = 7;      // from here on the text shows, faintly
const WORD_PX_PER_EM = 3;      // from here on the animals are written out, not marked
const THEME_KEY = "what-the-animals-know:theme";
const BOOK_KEY = "what-the-animals-know:book";
const BOOKS = ["kalila", "attar", "shahnameh"];
const NAMES = { kalila: "Kalila wa Dimna", attar: "The Conference of the Birds", shahnameh: "The Shahnameh" };
const FACULTIES = ["speech", "reasoning", "knowledge", "emotion", "deception", "perception", "desire", "memory", "moral judgement", "devotion"];
const SPECTRUM = ["", "no mind", "what its kind does", "a mind read from the animal", "a human mind"];
const FIGURE = ["", "an animal", "an animal as a person", "said of a person or thing"];
// the classes of light: 0 not judged, 1-4 the spectrum, 5 a figure of speech
const CLASS_OF = r => r[1] === 3 ? 5 : r[4];

const PALETTES = {
  dark: {
    ghost: [236, 226, 208], ghostA: .16, title: [214, 172, 96],
    light: [[128, 122, 114], [138, 131, 122], [128, 176, 206], [240, 164, 60], [255, 248, 228], [184, 156, 240]],
  },
  light: {
    ghost: [42, 33, 28], ghostA: .2, title: [140, 94, 20],
    light: [[170, 162, 152], [176, 168, 158], [60, 108, 140], [196, 110, 10], [20, 14, 10], [112, 70, 176]],
  },
};

const frame = document.getElementById("frame");
const ghostCanvas = document.getElementById("ghost");
const wordCanvas = document.getElementById("words");
const panel = document.getElementById("panel");
const hint = document.getElementById("hint");

let T, book, rows, perCol, cols, W, H, COL_W, ROW_H, BASE, GUTTER, COL_PITCH;
let lineX, lineY, lineS, lineRow, lineWords, lineMk;
let mkLine, mkWord, mkX0, mkX1, mkRow;
let cw = 1, ch = 1, dpr = 1;
let view = { s: 1, x: 0, y: 0 };
let pointer = null, shown = "";
let palette = PALETTES[document.documentElement.dataset.theme] || PALETTES.dark;
let only = -1;                  // a class shown alone, or -1 for all
let dirty = true, switching = false;

// ---------- layout ----------

const colEdge = c => W - MARGIN - c * COL_PITCH;
const colAt = x => Math.floor((W - MARGIN - x) / COL_PITCH);
const slotLeft = (c, h) => colEdge(c) - (h + 1) * COL_W - h * GUTTER;
const colCentre = c => colEdge(c) - COL_W - GUTTER / 2;
const bare = s => s.replace(/[\s‌]/g, "");

function layout() {
  ({ colW: COL_W, rowH: ROW_H, base: BASE, gutter: GUTTER } = T.page);
  COL_PITCH = 2 * COL_W + GUTTER + COL_GAP;
  rows = [];
  for (const b of T.blocks) {
    if (b[0] === 1) {   // a section heading, unless it only repeats the chapter's
      const sec = T.sections[b[1]], p = sec.poems[b[2]];
      if (b[2] === 0 && (bare(p.title).startsWith(bare(sec.title)) || bare(sec.title).startsWith(bare(p.title)))) continue;
    }
    rows.push(b);
  }
  cols = Math.max(1, Math.round(Math.sqrt(ASPECT * ROW_H * rows.length / COL_PITCH)));
  perCol = Math.ceil(rows.length / cols);
  W = cols * COL_PITCH - COL_GAP + 2 * MARGIN;
  H = perCol * ROW_H + 2 * MARGIN;

  const n = T.lines.length;
  lineX = new Float32Array(n); lineY = new Float32Array(n); lineS = new Float32Array(n); lineRow = new Int32Array(n);
  const full = 2 * COL_W + GUTTER;
  rows.forEach((r, i) => {
    const c = Math.floor(i / perCol), rr = i % perCol, base = MARGIN + rr * ROW_H + BASE;
    if (r[0] === 0) {          // a couplet: half-lines centred in their slots, the first on the right
      for (let h = 0; h < r.length - 1; h++) {
        const l = r[1 + h], w = T.widths[l] / T.upem, s = Math.min(1, (COL_W - .4) / w);
        lineX[l] = slotLeft(c, h) + COL_W / 2 - w * s / 2; lineY[l] = base; lineS[l] = s; lineRow[l] = i;
      }
    } else if (r[0] === 3) {   // a line of prose, set from the right edge
      const l = r[1], w = T.widths[l] / T.upem, s = Math.min(1, (full - .2) / w);
      lineX[l] = slotLeft(c, 1) + full - w * s; lineY[l] = base; lineS[l] = s; lineRow[l] = i;
    }
  });

  const m = T.marks, k = m.length / 5;
  mkLine = new Int32Array(k); mkWord = new Int16Array(k); mkX0 = new Float32Array(k); mkX1 = new Float32Array(k); mkRow = new Int32Array(k);
  lineMk = new Int32Array(n + 1);
  const order = [...Array(k).keys()].sort((a, b) => m[a * 5] - m[b * 5] || m[a * 5 + 2] - m[b * 5 + 2]);
  order.forEach((j, i) => {
    const l = m[j * 5], f = lineS[l] / T.upem;
    mkLine[i] = l; mkWord[i] = m[j * 5 + 1]; mkRow[i] = m[j * 5 + 4];
    mkX0[i] = lineX[l] + m[j * 5 + 2] * f; mkX1[i] = lineX[l] + m[j * 5 + 3] * f;
    lineMk[l + 1]++;
  });
  for (let l = 0; l < n; l++) lineMk[l + 1] += lineMk[l];
  lineWords = [];
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
  const wasFit = !T || Math.abs(view.s - fitScale()) < 1e-6;
  const cx = (cw / 2 - view.x) / view.s, cy = (ch / 2 - view.y) / view.s;
  cw = Math.max(1, r.width); ch = Math.max(1, r.height);
  dpr = Math.min(2, devicePixelRatio || 1);
  for (const c of [ghostCanvas, wordCanvas]) { c.width = Math.round(cw * dpr); c.height = Math.round(ch * dpr); }
  if (!T) return;
  if (wasFit) fit();
  else { view.x = cw / 2 - cx * view.s; view.y = ch / 2 - cy * view.s; clampView(); }
  ghost.key = words.key = "";
}
function zoomAt(px, py, f) {
  const s = Math.min(MAX_PX_PER_EM, Math.max(fitScale(), view.s * f));
  view.x = px - (px - view.x) * s / view.s; view.y = py - (py - view.y) * s / view.s; view.s = s;
  clampView();
}
let zoomGoal = null;
function zoomTo(px, py, f) {
  const s = Math.min(MAX_PX_PER_EM, Math.max(fitScale(), (zoomGoal ? zoomGoal.s : view.s) * f));
  zoomGoal = { s, px, py };
}

// ---------- drawing a stretch of the book at one scale ----------

function eachRow(s, ox, oy, w, h, fn) {
  const x0 = -ox / s, x1 = (w - ox) / s, y0 = -oy / s, y1 = (h - oy) / s;
  const cFrom = Math.max(0, Math.min(colAt(x0), colAt(x1))), cTo = Math.min(cols - 1, Math.max(colAt(x0), colAt(x1)));
  const rFrom = Math.max(0, Math.floor((y0 - MARGIN) / ROW_H) - 1), rTo = Math.min(perCol - 1, Math.ceil((y1 - MARGIN) / ROW_H) + 1);
  for (let c = cFrom; c <= cTo; c++) for (let rr = rFrom; rr <= rTo; rr++) {
    const row = rows[c * perCol + rr];
    if (!row) break;
    fn(row, c, rr);
  }
}
const lineList = row => row[0] === 0 ? row.slice(1) : row[0] === 3 ? [row[1]] : [];
const wordsOf = l => lineWords[l] || (lineWords[l] = T.lines[l].split(" "));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function setGhost(ctx, s, ox, oy, w, h) {
  ctx.direction = "rtl"; ctx.textBaseline = "alphabetic";
  let size = 0;
  eachRow(s, ox, oy, w, h, (row, c, rr) => {
    if (row[0] === 0 || row[0] === 3) {
      ctx.textAlign = "left"; ctx.fillStyle = rgba(palette.ghost, palette.ghostA);
      for (const l of lineList(row)) {
        const px = Math.round(s * lineS[l] * 100) / 100;
        if (px !== size) { ctx.font = `${px}px "Hand"`; size = px; }
        ctx.fillText(T.lines[l], lineX[l] * s + ox, lineY[l] * s + oy);
      }
    } else {
      const sec = T.sections[row[1]], title = row[0] === 2 ? sec.title : sec.poems[row[2]].title;
      ctx.font = `${s * (row[0] === 2 ? 1.25 : .85)}px "Hand"`; size = 0;
      ctx.textAlign = "center"; ctx.fillStyle = rgba(palette.title, row[0] === 2 ? .8 : .55);
      ctx.fillText(title, colCentre(c) * s + ox, (MARGIN + rr * ROW_H + BASE) * s + oy);
    }
  });
}

function setWords(ctx, s, ox, oy, w, h) {
  ctx.direction = "rtl"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  const write = s >= WORD_PX_PER_EM;
  const fills = palette.light.map((c, k) => rgba(c, only < 0 || only === k ? 1 : .12));
  let size = 0;
  eachRow(s, ox, oy, w, h, row => {
    for (const l of lineList(row)) for (let i = lineMk[l]; i < lineMk[l + 1]; i++) {
      const r = T.table[mkRow[i]], k = CLASS_OF(r), x = mkX0[i] * s + ox, y = lineY[l] * s + oy;
      ctx.fillStyle = fills[k];
      if (write) {
        const px = Math.round(s * lineS[l] * 100) / 100;
        if (px !== size) { ctx.font = `${px}px "Hand"`; size = px; }
        ctx.fillText(wordsOf(l)[mkWord[i]], x, y);
        if (k === 5) { ctx.fillRect(x, y + .2 * s, (mkX1[i] - mkX0[i]) * s, Math.max(.6, .05 * s)); }   // a figure, underlined
      } else {
        const ww = Math.max(1.8, (mkX1[i] - mkX0[i]) * s), hh = Math.max(1.8, .42 * s);
        const xx = x + ((mkX1[i] - mkX0[i]) * s - ww) / 2, yy = y - .38 * s - hh / 2;
        if (k === 5 && hh >= 3.5) {   // a figure of speech: an outline, an animal the text does not mean
          ctx.strokeStyle = fills[k]; ctx.lineWidth = Math.max(.7, .06 * s);
          ctx.strokeRect(xx + ctx.lineWidth / 2, yy + ctx.lineWidth / 2, Math.max(.6, ww - ctx.lineWidth), Math.max(.6, hh - ctx.lineWidth));
        } else ctx.fillRect(xx, yy, ww, hh);
      }
    }
  });
}

// ---------- tiles, as in No. 3 ----------

const TILE = 256, TILE_MS = 6;
function TileLayer(canvas, set, tag) { return { canvas, ctx: canvas.getContext("2d"), set, tag, tiles: new Map(), for: "", pending: false, key: "" }; }
const ghost = TileLayer(ghostCanvas, setGhost, () => `${book} ${document.documentElement.dataset.theme}`);
const words = TileLayer(wordCanvas, setWords, () => `${book} ${document.documentElement.dataset.theme} ${only}`);

function tile(L, ts, tx, ty, make, keep) {
  const k = `${ts} ${tx} ${ty}`, t = L.tiles.get(k);
  if (t) { L.tiles.delete(k); L.tiles.set(k, t); return t; }
  if (!make) return null;
  let c;
  if (L.tiles.size >= keep) { const old = L.tiles.keys().next().value; c = L.tiles.get(old); L.tiles.delete(old); }
  else c = document.createElement("canvas");
  c.width = c.height = Math.round(TILE * dpr);
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
  lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, L.canvas.width, L.canvas.height);
  L.pending = false;
  if (alpha < .005 || !T) return;
  const tag = `${L.tag()} ${dpr}`;
  if (tag !== L.for) { L.tiles.clear(); L.for = tag; }
  const ts = Math.min(128, 2 ** Math.round(Math.log2(view.s)));
  const step = TILE / ts * view.s;
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
      const p = tile(L, ts / 2, tx >> 1, ty >> 1, false);
      if (p) { const q = p.width / 2; lctx.drawImage(p, (tx & 1) * q, (ty & 1) * q, q, q, X0, Y0, X1 - X0, Y1 - Y0); continue; }
      const XM = X0 + Math.round((X1 - X0) / 2), YM = Y0 + Math.round((Y1 - Y0) / 2);
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
        const f = tile(L, ts * 2, tx * 2 + i, ty * 2 + j, false);
        if (f) lctx.drawImage(f, i ? XM : X0, j ? YM : Y0, i ? X1 - XM : XM - X0, j ? Y1 - YM : YM - Y0);
      }
    }
  }
  lctx.globalAlpha = 1;
}

// ---------- the animal under the pointer ----------

const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

function under(px, py) {
  if (!T) return -1;
  const x = (px - view.x) / view.s, y = (py - view.y) / view.s, c = colAt(x);
  if (c < 0 || c >= cols) return -1;
  const reach = 9 / view.s;
  const r0 = Math.max(0, Math.floor((y - reach - MARGIN) / ROW_H)), r1 = Math.min(perCol - 1, Math.floor((y + reach - MARGIN) / ROW_H));
  let best = -1, bd = reach;
  for (let rr = r0; rr <= r1; rr++) {
    const row = rows[c * perCol + rr];
    if (!row) continue;
    for (const l of lineList(row)) for (let i = lineMk[l]; i < lineMk[l + 1]; i++) {
      if (only >= 0 && CLASS_OF(T.table[mkRow[i]]) !== only) continue;
      const dx = x < mkX0[i] ? mkX0[i] - x : x > mkX1[i] ? x - mkX1[i] : 0;
      const d = Math.hypot(dx, y - (lineY[l] - .38));
      if (d < bd) { bd = d; best = i; }
    }
  }
  return best;
}

function showPanel(i) {
  const key = i >= 0 ? `${book} ${i}` : "";
  if (key === shown) return;
  shown = key;
  if (i < 0) { panel.classList.remove("show"); return; }
  const r = T.table[mkRow[i]], l = mkLine[i], row = rows[lineRow[l]];
  const [species, fig, mode, fac, spec, evidence, pi, unsure, unjudged] = r;
  // the section this line is in: the last heading row above it
  let si = 0, sp = 0;
  for (let j = lineRow[l]; j >= 0; j--) { const b = rows[j]; if (b[0] === 1) { si = b[1]; sp = b[2]; break; } if (b[0] === 2) { si = b[1]; sp = 0; break; } }
  const sec = T.sections[si], poem = sec.poems[sp] || sec.poems[0];
  const p = T.passages[pi];
  const word = wordsOf(l)[mkWord[i]];
  const mark = t => esc(t).split(esc(word)).join(`<b>${esc(word)}</b>`);
  const passage = Array.isArray(p) ? p.map(x => mark(T.lines[x])).join('<span class="sep">✦</span>') : mark(p);
  document.getElementById("where").innerHTML = `${esc(NAMES[book])} · <span lang="fa">${esc(sec.title)}${poem && poem.title !== sec.title ? " · " + esc(poem.title) : ""}</span>`;
  document.getElementById("couplet").innerHTML = passage;
  const fs = FACULTIES.filter((_, k) => fac & (1 << k));
  document.getElementById("gloss").innerHTML = unjudged ? `<span class="sp">${esc(species)}</span> <small>not yet judged</small>` :
    `<span class="sp k${CLASS_OF(r)}">${esc(species)}</span> · ${FIGURE[fig]}${mode !== "none" ? ` · ${esc(mode)}` : ""}` +
    `${spec ? ` · <em>${SPECTRUM[spec]}</em>` : ""}${fs.length ? ` · ${fs.join(", ")}` : ""}${unsure ? " · <small>unsure</small>" : ""}`;
  document.getElementById("count").innerHTML = evidence ? `<span lang="fa">«${esc(evidence)}»</span>` : "";
  panel.classList.add("show");
  if (poem) panel.dataset.url = poem.url;
}

// ---------- input ----------

const pts = new Map();
let pinch = null, dragFrom = null;
const local = e => { const r = frame.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
wordCanvas.addEventListener("pointerdown", e => {
  wordCanvas.setPointerCapture(e.pointerId); zoomGoal = null;
  pts.set(e.pointerId, local(e));
  if (pts.size === 1) { dragFrom = local(e); wordCanvas.classList.add("dragging"); }
  if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) }; }
});
wordCanvas.addEventListener("pointermove", e => {
  const p = local(e); pointer = p;
  if (!pts.has(e.pointerId)) return;
  const prev = pts.get(e.pointerId); pts.set(e.pointerId, p);
  if (pts.size === 2 && pinch) {
    const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, d / pinch.d); pinch.d = d;
  } else if (pts.size === 1) {
    if (dragFrom && Math.hypot(p[0] - dragFrom[0], p[1] - dragFrom[1]) < 3) return;
    dragFrom = null; view.x += p[0] - prev[0]; view.y += p[1] - prev[1]; clampView();
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
  const [x, y] = local(e), dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  zoomTo(x, y, Math.exp(-dy * (e.ctrlKey ? .01 : .0022)));
}, { passive: false });

const centre = () => [cw / 2, ch / 2];
document.getElementById("zoom-in").onclick = () => zoomTo(...centre(), 1.8);
document.getElementById("zoom-out").onclick = () => zoomTo(...centre(), 1 / 1.8);
document.getElementById("reset").onclick = () => { zoomGoal = null; fit(); };

function useOnly(k) {
  only = only === k ? -1 : k;
  for (const b of document.querySelectorAll("[data-class]")) b.setAttribute("aria-pressed", +b.dataset.class === only);
  shown = ""; dirty = true;
}
for (const b of document.querySelectorAll("[data-class]")) b.onclick = () => useOnly(+b.dataset.class);

addEventListener("keydown", e => {
  if (e.target.closest && e.target.closest("input, textarea")) return;
  const r = frame.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  const k = e.key, step = 80;
  if (k === "+" || k === "=") zoomTo(...centre(), 1.5);
  else if (k === "-" || k === "_") zoomTo(...centre(), 1 / 1.5);
  else if (k === "0") { zoomGoal = null; fit(); }
  else if (k === "Escape" && only >= 0) useOnly(only);
  else if (k.startsWith("Arrow")) {
    e.preventDefault();
    view.x += k === "ArrowLeft" ? step : k === "ArrowRight" ? -step : 0;
    view.y += k === "ArrowUp" ? step : k === "ArrowDown" ? -step : 0;
    clampView();
  }
});

const themeBtn = document.getElementById("theme");
function labelTheme() { themeBtn.textContent = document.documentElement.dataset.theme === "light" ? "dark" : "light"; }
themeBtn.onclick = () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  palette = PALETTES[next]; labelTheme(); shown = ""; dirty = true;
};
labelTheme();

// ---------- the books ----------

const loaded = {};
const fetchBook = b => loaded[b] || (loaded[b] = fetch(`data/${b}.json`).then(r => r.json()));

async function useBook(b) {
  if (b === book || switching) return;
  switching = true;
  for (const x of document.querySelectorAll("[data-book]")) x.setAttribute("aria-pressed", x.dataset.book === b);
  T = await fetchBook(b);
  book = b;
  layout();
  frame.style.setProperty("--aspect", (W / H).toFixed(3));
  resize(); fit();
  ghost.key = words.key = ""; shown = "";
  try { localStorage.setItem(BOOK_KEY, b); } catch (_) {}
  const url = new URL(location.href); url.searchParams.set("book", b); history.replaceState(null, "", url);
  switching = false;
}
for (const x of document.querySelectorAll("[data-book]")) x.onclick = () => useBook(x.dataset.book);

// ---------- the loop ----------

let then = performance.now(), running = true;
const t0 = then;
function frameLoop(now) {
  if (!running) return;
  const dt = Math.min(100, now - then); then = now;
  if (zoomGoal && T) {
    const r = zoomGoal.s / view.s;
    if (Math.abs(Math.log(r)) < 1e-3) { zoomAt(zoomGoal.px, zoomGoal.py, r); zoomGoal = null; }
    else zoomAt(zoomGoal.px, zoomGoal.py, Math.pow(r, 1 - Math.pow(1e-6, dt / 1000)));
  }
  if (dirty) { ghost.key = words.key = ""; dirty = false; }
  const until = performance.now() + TILE_MS;
  drawLayer(words, 1, until);
  drawLayer(ghost, Math.min(1, Math.max(0, (view.s - READ_PX_PER_EM * .6) / (READ_PX_PER_EM * .4))), until);
  showPanel(pointer && !pts.size ? under(...pointer) : -1);
  if (T && view.s > fitScale() * 1.5 && now - t0 > 4000) hint.classList.add("gone");
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

(async () => {
  await new FontFace("Hand", "url(data/hand.woff2)").load().then(f => document.fonts.add(f)).catch(() => {});
  const q = new URLSearchParams(location.search).get("book");
  let start = BOOKS.includes(q) ? q : null;
  if (!start) try { const s = localStorage.getItem(BOOK_KEY); if (BOOKS.includes(s)) start = s; } catch (_) {}
  new ResizeObserver(resize).observe(frame);
  await useBook(start || "kalila");
  requestAnimationFrame(frameLoop);
})().catch(err => {
  console.error(err);
  frame.insertAdjacentHTML("beforeend", `<p class="fallback">The books could not be loaded.</p>`);
});
