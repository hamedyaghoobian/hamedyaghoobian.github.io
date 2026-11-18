// What the Poets Answered: every ghazal on Ganjoor as a firefly.
//
// Each of 62,744 ghazals is a point, set where its poet lived (left to right, 1050 to 1980;
// up and down means nothing) and lit once the year comes round. Each flashes on its own beat.
// When a poet answers an earlier one (same metre, same rhyme, an opening couplet that takes up
// the earlier one's words), the answer falls into step with what it answers, and the two flash
// together from then on, centuries apart, a line between them. Chains of answers flash as one.
//
// The strip at the foot counts it: the share of each century's ghazals that answer an earlier
// poet, against the share the same test finds when the rhymes are shuffled (chance).
//
// Keys (piece.js gives them to the piece): space play · ← → twenty years · 1–9 a century ·
// 0 the end · j k the next or previous answer · c contemporaries · s the same openings.

(function () {
  const YEAR0 = 1050, YEAR1 = 1990, RUN = 75;              // the whole span, in seconds of play
  let STRIP = 66, SIZE = 1, THIN = 1;                                 // the counts at the foot, in px; a flash's size
  const PAD = 14;
  const SYNC_YEARS = 18;                                    // how long an answer takes to fall into step
  const CREAM = "242,235,218", YELLOW = "242,197,0";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tr = s => (window.RO ? RO.tr(s) : s);
  const fa = () => window.RO && RO.fa();
  const num = n => (window.RO ? RO.num(n) : Number(n).toLocaleString("en-US"));
  const $ = s => document.querySelector(s);

  const frame = $("#frame"), cv = $("#field"), cx = cv.getContext("2d");
  const base = document.createElement("canvas"), bx = base.getContext("2d");
  const panel = $("#panel"), where = $("#where"), couplet = $("#couplet"), foot = $("#foot");
  const clock = $("#clock"), playBtn = $("#play");

  let D, N, gx, gy, gyear, gpoet, chain, root, isRoot, ownP, ownF, k0;
  let links = [], answers = [];          // [a, to, tier, shared, titled]
  let tiers = { 1: false, 2: false };    // contemporaries, the same openings (answers are always on)
  let T = reduce ? YEAR1 : YEAR0, playing = !reduce, last = 0, t = 0;
  let cw = 1, ch = 1, dpr = 1, baseUpTo = -1;
  let sel = -1, hover = -1, step = -1;
  const texts = {};

  // a seeded random, so the field is the same field every time
  let seed = 7;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

  fetch("data/field.json?v=2").then(r => r.json()).then(d => { D = d; build(); resize(); requestAnimationFrame(loop); })
    .catch(() => frame.insertAdjacentHTML("beforeend", `<p class="fallback">${tr("The ghazals could not be loaded.")}</p>`));

  function build() {
    N = D.poet.length;
    gx = new Float32Array(N); gy = new Float32Array(N); gyear = new Float32Array(N); gpoet = D.poet;
    ownP = new Float32Array(N); ownF = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const [, bornCE, diedCE] = D.poets[gpoet[i]];
      const start = bornCE ? Math.max(bornCE + 20, diedCE - 45) : diedCE - 30;
      gyear[i] = start + rnd() * (diedCE - start);
      gx[i] = (gyear[i] - YEAR0) / (YEAR1 - YEAR0);
      gy[i] = .04 + rnd() * .92;
      ownP[i] = 2.2 * (.8 + .4 * rnd());
      ownF[i] = rnd();
    }
    for (let i = 0; i < D.links.length; i += 5) links.push(D.links.slice(i, i + 5));
    // an answer can't come before what it answers: put it at least a little after
    for (const [a, to] of links) if (gyear[a] < gyear[to] + 2) { gyear[a] = gyear[to] + 2; gx[a] = (gyear[a] - YEAR0) / (YEAR1 - YEAR0); }
    answers = links.filter(l => l[2] === 0).sort((p, q) => gyear[p[0]] - gyear[q[0]]);
    chains();
  }

  // union the links that are shown into chains; each chain flashes on its first ghazal's beat
  function chains() {
    const up = new Int32Array(N).map((_, i) => i);
    const find = i => { while (up[i] !== i) i = up[i] = up[up[i]]; return i; };
    for (const [a, to, tier] of links) if (tier === 0 || tiers[tier]) up[find(a)] = find(to);
    chain = new Int32Array(N).fill(-1); root = new Int32Array(N); isRoot = new Uint8Array(N);
    const first = new Map();
    for (const [a, to, tier] of links) {
      if (!(tier === 0 || tiers[tier])) continue;
      for (const i of [a, to]) {
        const r = find(i); chain[i] = r;
        if (!first.has(r) || gyear[i] < gyear[first.get(r)]) first.set(r, i);
      }
    }
    for (let i = 0; i < N; i++) if (chain[i] >= 0) { root[i] = first.get(chain[i]); if (root[i] === i) isRoot[i] = 1; }
    baseUpTo = -1;
  }

  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    const r = frame.getBoundingClientRect();
    cw = r.width; ch = r.height;
    STRIP = cw < 560 ? 46 : 66; SIZE = Math.max(.45, Math.min(1, cw / 760));
    THIN = Math.max(.25, Math.min(1, (cw - 2 * PAD) * (ch - STRIP - 2 * PAD) / 450000)); // a small field holds the same 62,744: dim it so it does not haze over
    for (const c of [cv, base]) { c.width = cw * dpr; c.height = ch * dpr; }
    cv.style.width = cw + "px"; cv.style.height = ch + "px";
    baseUpTo = -1;
  }
  new ResizeObserver(() => D && resize()).observe(frame);

  const fw = () => cw - 2 * PAD, fh = () => ch - STRIP - 2 * PAD;
  const X = i => PAD + gx[i] * fw(), Y = i => PAD + gy[i] * fh();
  const xOfYear = y => PAD + (y - YEAR0) / (YEAR1 - YEAR0) * fw();
  const yearOfX = x => YEAR0 + (x - PAD) / fw() * (YEAR1 - YEAR0);

  // the field at rest: every ghazal whose year has come, dim; redrawn only as time moves
  function drawBase() {
    if (baseUpTo === T) return;
    bx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bx.clearRect(0, 0, cw, ch);
    bx.fillStyle = `rgba(${CREAM},${.22 * THIN})`;
    const d = THIN < 1 ? .9 : 1.2;
    for (let i = 0; i < N; i++) if (gyear[i] <= T) bx.fillRect(X(i) - d / 2, Y(i) - d / 2, d, d);
    baseUpTo = T;
  }

  const flash = ph => (ph < .08 ? 1 - ph / .08 : 0);
  function bright(i) {
    if (gyear[i] > T) return 0;
    if (reduce) return chain[i] >= 0 ? .55 : 0;          // still: the chains lit, nothing flashing
    const own = flash((t / ownP[i] + ownF[i]) % 1);
    if (chain[i] < 0) return own * .7;
    const r = root[i];
    const shared = flash((t / ownP[r] + ownF[r]) % 1);
    if (isRoot[i]) return shared;
    const k = Math.min(1, Math.max(0, (T - gyear[i]) / SYNC_YEARS));
    return (1 - k) * own * .7 + k * shared;
  }

  let glow;
  function sprite() {
    const s = 24, c = document.createElement("canvas"); c.width = c.height = s * dpr;
    const g = c.getContext("2d"), r = g.createRadialGradient(s * dpr / 2, s * dpr / 2, 0, s * dpr / 2, s * dpr / 2, s * dpr / 2);
    r.addColorStop(0, `rgba(${CREAM},1)`); r.addColorStop(.18, `rgba(${CREAM},.7)`); r.addColorStop(1, `rgba(${CREAM},0)`);
    g.fillStyle = r; g.fillRect(0, 0, s * dpr, s * dpr);
    return c;
  }

  function loop(now) {
    const dt = Math.min(.1, (now - last) / 1000 || 0); last = now;
    t += dt;
    if (playing) { T = Math.min(YEAR1, T + dt * (YEAR1 - YEAR0) / RUN); if (T >= YEAR1) { playing = false; showPlay(); } }
    requestAnimationFrame(loop);
    if (base.width && base.height) draw();
    else if (frame.clientWidth) resize();
  }

  function draw() {
    if (!glow) glow = sprite();
    drawBase();
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, cv.width, cv.height);
    cx.drawImage(base, 0, 0);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lit = sel >= 0 && chain[sel] >= 0 ? chain[sel] : -2;

    // the lines of the chains, lit when their ghazals flash
    cx.lineWidth = .7;
    for (const [a, to, tier] of links) {
      if (!(tier === 0 || tiers[tier]) || gyear[a] > T) continue;
      const fresh = 1 - Math.min(1, (T - gyear[a]) / 30);   // a new answer draws its line bright
      const b = Math.max(bright(a) * .35, fresh * .55) * (tier ? THIN : Math.sqrt(THIN));
      const mine = chain[a] === lit;
      if (b < .02 && !mine) continue;
      cx.strokeStyle = mine ? `rgba(${YELLOW},${.35 + .6 * b})` : `rgba(${CREAM},${b})`;
      arc(X(a), Y(a), X(to), Y(to));
    }
    // the flashes
    cx.globalCompositeOperation = "lighter";
    for (let i = 0; i < N; i++) {
      if (gyear[i] > T) continue;
      const b = bright(i);
      if (b < .04) continue;
      const s = (chain[i] >= 0 ? 18 : 7) * SIZE;
      cx.globalAlpha = b * (chain[i] >= 0 ? 1 : .3 * THIN);
      cx.drawImage(glow, X(i) - s / 2, Y(i) - s / 2, s, s);
    }
    cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over";
    // the chain you are reading, in your hand's yellow
    if (lit !== -2) for (let i of members(lit)) dot(i, i === sel ? 4 : 2.6);
    else if (sel >= 0) dot(sel, 4);
    if (hover >= 0 && hover !== sel) dot(hover, 2.6, .6);
    strip();
    clock.textContent = clockText();
  }

  function arc(x0, y0, x1, y1) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - Math.min(80, Math.abs(x1 - x0) * .18);
    cx.beginPath(); cx.moveTo(x0, y0); cx.quadraticCurveTo(mx, my, x1, y1); cx.stroke();
  }
  function dot(i, r, a = 1) {
    cx.fillStyle = `rgba(${YELLOW},${a})`;
    cx.beginPath(); cx.arc(X(i), Y(i), r, 0, 7); cx.fill();
  }
  let memo = { c: -9, m: [] };
  function members(c) {
    if (memo.c !== c) { const m = []; for (let i = 0; i < N; i++) if (chain[i] === c && gyear[i] <= T) m.push(i); memo = { c, m, T }; }
    else if (memo.T !== T) { memo.c = -9; return members(c); }
    return memo.m;
  }

  // the counts: each century's share of ghazals that answer an earlier poet, and chance
  function strip() {
    const y0 = ch - STRIP + 6, h = STRIP - 26;
    cx.fillStyle = `rgba(${CREAM},.1)`; cx.fillRect(PAD, y0 - 6, fw(), .6);
    const top = .08;
    const cs = D.centuries;
    cx.font = "500 9px 'JetBrains Mono', monospace"; cx.textBaseline = "alphabetic";
    for (const c of cs) {
      const x0 = xOfYear(Math.max(YEAR0, c.c)), x1 = xOfYear(Math.min(YEAR1, c.c + 100));
      const on = T >= c.c;
      const ha = Math.min(1, c.answers / c.n / top) * h, hc = Math.min(1, c.chance / c.n / top) * h;
      cx.fillStyle = `rgba(${CREAM},${on ? .55 : .14})`;
      cx.fillRect(x0 + 3, y0 + h - ha, x1 - x0 - 6, ha);
      cx.fillStyle = `rgba(${CREAM},${on ? .9 : .3})`;
      cx.fillRect(x0 + 3, y0 + h - hc - .5, x1 - x0 - 6, 1);
      cx.fillStyle = `rgba(${CREAM},.5)`;
      cx.textAlign = "center";
      cx.fillText(fa() ? RO.num(c.c) : c.c, (x0 + x1) / 2, y0 + h + 13);
      if (on && x1 - x0 > 46) {
        cx.fillStyle = `rgba(${CREAM},.85)`;
        cx.fillText(pct(c.answers / c.n), (x0 + x1) / 2, y0 + h - ha - 3);
      }
    }
    cx.textAlign = "left"; cx.fillStyle = `rgba(${CREAM},.6)`;
    // the cursor: now
    const x = xOfYear(T);
    cx.fillStyle = `rgba(${YELLOW},.9)`; cx.fillRect(x - .5, PAD, 1, ch - PAD - 8);
  }
  const pct = v => (fa() ? RO.num((v * 100).toFixed(1)) + "٪" : (v * 100).toFixed(1) + "%");

  function clockText() {
    let n = 0, a = 0;
    for (let i = 0; i < N; i++) if (gyear[i] <= T) n++;
    for (const l of answers) if (gyear[l[0]] <= T) a++;
    const y = Math.round(T);
    return fa()
      ? `${RO.num(y)} · ${RO.num(n)} غزل · ${RO.num(a)} پاسخ`
      : `${y} · ${num(n)} ghazals · ${num(a)} answers`;
  }

  // ---------- reading a ghazal ----------

  function text(p) {
    if (!texts[p]) texts[p] = fetch(`data/text/${p}.json`).then(r => r.json());
    return texts[p];
  }
  const poetName = i => D.poets[gpoet[i]][0];
  const died = i => { const p = D.poets[gpoet[i]]; return fa() ? `درگذشته ${RO.num(p[4])} ق (${RO.num(p[2])} م)` : `d. ${p[2]} (${p[4]} AH)`; };
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  async function show(i) {
    sel = i;
    if (i < 0) { panel.classList.remove("show"); frame.classList.remove("reading"); return; }
    const me = await text(gpoet[i]), g = me[D.local[i]];
    if (sel !== i) return;
    const mine = links.filter(l => (l[0] === i || l[1] === i) && (l[2] === 0 || tiers[l[2]]));
    where.innerHTML = `<span lang="fa">${esc(poetName(i))}</span> · ${died(i)} · <a href="https://ganjoor.net${esc(g[3])}" target="_blank" rel="noopener">${tr("on Ganjoor")}</a>`;
    couplet.innerHTML = `<p class="line">${esc(g[0])}</p><p class="line">${esc(g[1])}</p>`;
    const rows = [];
    for (const l of mine) {
      const other = l[0] === i ? l[1] : l[0], o = (await text(gpoet[other]))[D.local[other]];
      const how = l[0] === i ? tr(["answers", "shares an opening with a contemporary,", "opens as"][l[2]]) : tr(["answered by", "shares an opening with a contemporary,", "the same opening as"][l[2]]);
      rows.push(`<p class="link"><span class="how">${how} <span lang="fa">${esc(poetName(other))}</span>, ${died(other)}${l[4] ? " · " + tr("says so in its title") : ""}</span><span class="h" lang="fa" dir="rtl">${esc(o[0])}</span></p>`);
    }
    if (sel !== i) return;
    foot.innerHTML = rows.length ? rows.join("") : `<p class="link"><span class="how">${tr(chain[i] >= 0 ? "" : "answers no one, and no one answers it, as far as this reading can tell")}</span></p>`;
    panel.classList.add("show"); frame.classList.add("reading");
  }

  // ---------- pointer ----------

  function nearest(px, py) {
    let best = -1, bd = 100;
    for (let i = 0; i < N; i++) {
      if (gyear[i] > T) continue;
      const dx = X(i) - px, dy = Y(i) - py, d = dx * dx + dy * dy;
      const w = chain[i] >= 0 ? d * .5 : d;           // a little easier to land on a chain
      if (w < bd) { bd = w; best = i; }
    }
    return best;
  }
  let dragging = false;
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (dragging) { T = clampT(yearOfX(x)); return; }
    hover = y < ch - STRIP ? nearest(x, y) : -1;
    cv.style.cursor = y >= ch - STRIP ? "ew-resize" : hover >= 0 ? "pointer" : "default";
  });
  cv.addEventListener("pointerleave", () => { hover = -1; });
  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (y >= ch - STRIP) { dragging = true; playing = false; showPlay(); cv.setPointerCapture(e.pointerId); T = clampT(yearOfX(x)); return; }
    const i = nearest(x, y);
    show(i === sel ? -1 : i);
  });
  cv.addEventListener("pointerup", () => { dragging = false; });
  const clampT = y => Math.max(YEAR0, Math.min(YEAR1, y));

  // ---------- keys and buttons ----------

  function showPlay() {
    playBtn.setAttribute("aria-pressed", playing);
    playBtn.querySelector("span").textContent = playing ? "❚❚" : "▶";
  }
  playBtn.addEventListener("click", () => { if (T >= YEAR1) T = YEAR0; playing = !playing; showPlay(); });
  $("#back").addEventListener("click", () => { playing = false; showPlay(); T = clampT(T - 20); });
  $("#fwd").addEventListener("click", () => { playing = false; showPlay(); T = clampT(T + 20); });
  for (const [id, tier] of [["contemps", 1], ["same", 2]]) {
    const b = $("#" + id);
    b.addEventListener("click", () => { tiers[tier] = !tiers[tier]; b.setAttribute("aria-pressed", tiers[tier]); chains(); if (sel >= 0) show(sel); });
  }
  function go(dir) {
    if (!answers.length) return;
    step = Math.max(0, Math.min(answers.length - 1, step + dir));
    const [a] = answers[step];
    playing = false; showPlay();
    T = Math.max(T, Math.min(YEAR1, gyear[a] + SYNC_YEARS));
    show(a);
  }

  const piece = window.Piece({
    frame,
    keys: () => [["space", tr("play · pause")], ["← →", tr("twenty years")], ["1–9", tr("a century")], ["j k", tr("the next answer")], ["c", tr("contemporaries")], ["s", tr("the same openings")]],
    help: () => [
      ["space", tr("play or pause the centuries")],
      ["← →", tr("twenty years back or on")],
      ["1–9", tr("go to a century: 1 the 1100s … 9 the 1900s")],
      ["0", tr("go to the end: every ghazal, every answer")],
      ["j k", tr("the next / previous answer, in the order they were written: the answer and what it answers show below")],
      ["c", tr("show the answers between contemporaries, where who answered whom can't be told")],
      ["s", tr("show the openings that are the same word for word: a quotation, or one poem in two divans")],
    ],
    key(e) {
      const k = e.key;
      if (k === " ") { playBtn.click(); return true; }
      if (k === "ArrowLeft") { $("#back").click(); return true; }
      if (k === "ArrowRight") { $("#fwd").click(); return true; }
      if (/^[1-9]$/.test(k)) { playing = false; showPlay(); T = 1000 + 100 * +k; return true; }
      if (k === "0") { playing = false; showPlay(); T = YEAR1; return true; }
      if (k === "j") { go(1); return true; }
      if (k === "k") { go(-1); return true; }
      if (k === "c") { $("#contemps").click(); return true; }
      if (k === "s") { $("#same").click(); return true; }
      return false;
    },
    escape() { if (sel >= 0) { show(-1); return true; } return false; },
  });
  document.addEventListener("ro-lang", () => { if (sel >= 0) show(sel); });
  showPlay();
})();
