// What Rumi Recited: the Quran in the Divan-e Shams, as threads.
//
// Along the top, the Quran's 6,236 ayahs in the order of the book; along the foot, the Divan's
// 5,268 poems in Ganjoor's order (ghazals, strophic poems, quatrains). Each of the 809 couplets
// found to quote, paraphrase or allude to an ayah is a thread from the ayah down to its poem.
// In Persian both run right to left, as the books do.
//
// Play reads the Divan through: a cursor moves along the foot, and as it reaches a poem its
// threads are drawn, a light running up each one to its ayah. An ayah grows with every couplet
// that recalls it. Point at a thread, an ayah or a poem to read it.
//
// Keys (piece.js gives them to the piece): space play · ← → the poem before or after ·
// 1 2 3 the ghazals, the strophic poems, the quatrains · 0 the end · j k the next or previous
// couplet (only the selected ayah's, once one is selected) · t the themes · d the doubtful ·
// - + slower or faster · f the whole screen.

(function () {
  const RUN = 70;                                   // the whole Divan, in seconds of play
  const PULSE = .9;                                 // how long a light takes to run up a thread, in seconds
  const PAD = 14;
  let TOP = 82, STRIP = 58;                         // the Quran's line from the top; the Divan's band at the foot
  const CREAM = "232,234,242", YELLOW = "242,197,0", DOUBT = "255,128,110";
  const FAM = ["150,205,255", "255,160,190", "150,232,180"];   // God and creation · the soul · the last things
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tr = s => (window.RO ? RO.tr(s) : s);
  const fa = () => window.RO && RO.fa();
  const num = n => (window.RO ? RO.num(n) : Number(n).toLocaleString("en-US"));
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const frame = $("#frame"), cv = $("#field"), cx = cv.getContext("2d");
  const panel = $("#panel"), where = $("#where"), couplet = $("#couplet"), ayahBox = $("#ayah"), foot = $("#foot");
  const clock = $("#clock"), playBtn = $("#play");

  let D, A, P, L, NQ, NP;                           // data; ayahs, poems, links; the two books' lengths
  let byAyah, byPoem, cited;                        // link indices per ayah and per poem; the poems with links, in order
  let T = 0, playing = !reduce, last = 0;
  const SPEEDS = [1, .5, .25];
  let speed = 0;
  let themes = false, doubt = false;
  let cw = 1, ch = 1, dpr = 1;
  let sel = null, hover = null, scope = null, step = -1;   // {k: "l"|"a"|"p", i}; the couplets j k go through
  let samples = [];                                 // each thread as points, for the pointer

  fetch("data/field.json?v=1").then(r => r.json()).then(d => { D = d; build(); resize(); requestAnimationFrame(loop); })
    .catch(() => frame.insertAdjacentHTML("beforeend", `<p class="fallback">${tr("The couplets could not be loaded.")}</p>`));

  function build() {
    A = D.ayahs; P = D.poems; L = D.links;
    NQ = D.surahs.reduce((s, x) => s + x[2], 0);
    const lastSec = D.sections[D.sections.length - 1];
    NP = lastSec[3] + lastSec[4];
    byAyah = A.map(() => []); byPoem = P.map(() => []);
    L.forEach((l, i) => { byAyah[l.a].push(i); byPoem[l.p].push(i); });
    cited = P.map((p, i) => i).sort((a, b) => P[a].x - P[b].x);
    T = reduce ? NP : 0;
  }

  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    const r = frame.getBoundingClientRect();
    cw = r.width; ch = r.height;
    TOP = cw < 560 ? 86 : 82; STRIP = cw < 560 ? 46 : 58;
    cv.width = cw * dpr; cv.height = ch * dpr;
    cv.style.width = cw + "px"; cv.style.height = ch + "px";
    samples = L.map((l, i) => {
      const pts = [];
      for (let k = 0; k <= 16; k++) pts.push(curve(i, k / 16));
      return pts;
    });
  }
  new ResizeObserver(() => D && resize()).observe(frame);
  document.addEventListener("ro-lang", () => { if (D) resize(); if (sel) show(sel); });

  const fw = () => cw - 2 * PAD;
  const along = u => PAD + (fa() ? 1 - u : u) * fw();                     // a share of the way along a book, as x
  const qx = a => along((A[a].x + .5) / NQ), px = p => along((P[p].x + .5) / NP);
  const yQ = () => TOP, yD = () => ch - STRIP;
  const posOfX = x => { const u = (x - PAD) / fw(); return Math.max(0, Math.min(NP, (fa() ? 1 - u : u) * NP)); };

  function curve(i, t) {
    const l = L[i], x0 = qx(l.a), y0 = yQ(), x1 = px(l.p), y1 = yD(), h = (y1 - y0) * .55;
    const u = 1 - t;
    return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1,
            u * u * u * y0 + 3 * u * u * t * (y0 + h) + 3 * u * t * t * (y1 - h) + t * t * t * y1];
  }
  function thread(i) {
    const l = L[i], x0 = qx(l.a), y0 = yQ(), x1 = px(l.p), y1 = yD(), h = (y1 - y0) * .55;
    cx.beginPath(); cx.moveTo(x0, y0); cx.bezierCurveTo(x0, y0 + h, x1, y1 - h, x1, y1); cx.stroke();
  }

  // how far the reading has come: a poem is reached once the cursor is past it
  const reached = i => P[L[i].p].x + .5 <= T;
  const age = i => (T - P[L[i].p].x - .5) / (NP / RUN);                   // seconds of play since it was reached

  function loop(now) {
    const dt = Math.min(.1, (now - last) / 1000 || 0) * SPEEDS[speed]; last = now;
    if (playing) { T = Math.min(NP + NP / RUN * PULSE * 1.2, T + dt * NP / RUN); if (T >= NP + NP / RUN * PULSE) { playing = false; showPlay(); } }
    requestAnimationFrame(loop);
    if (cv.width) draw();
    else if (frame.clientWidth) resize();
  }

  function lit() {                                   // the threads in your hand's yellow
    if (!sel) return null;
    if (sel.k === "l") return new Set([sel.i]);
    return new Set(sel.k === "a" ? byAyah[sel.i] : byPoem[sel.i]);
  }

  function draw() {
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, cw, ch);
    const mine = lit(), hov = hover ? (hover.k === "l" ? new Set([hover.i]) : new Set(hover.k === "a" ? byAyah[hover.i] : byPoem[hover.i])) : null;

    books();

    // the threads, settled
    cx.lineWidth = .6;
    const heard = new Float32Array(A.length), flare = new Float32Array(A.length);
    for (let i = 0; i < L.length; i++) {
      if (!reached(i)) continue;
      const l = L[i], g = age(i);
      heard[l.a]++;
      if (g < PULSE + .6) flare[l.a] = Math.max(flare[l.a], g < PULSE ? 0 : 1 - (g - PULSE) / .6);
      const fresh = Math.max(0, 1 - g / 3);
      let a = .16 + .5 * fresh, rgb = themes ? FAM[A[l.a].fam] : CREAM;
      if (doubt) { if (l.rv) { rgb = DOUBT; a = .9; } else a *= .45; }
      if (mine) a *= .35;
      cx.strokeStyle = `rgba(${rgb},${a})`;
      if (doubt && l.rv) { cx.setLineDash([3, 3]); cx.lineWidth = 1.1; }
      thread(i);
      if (doubt && l.rv) { cx.setLineDash([]); cx.lineWidth = .6; }
    }
    // the light running up each new thread, from the couplet to its ayah
    cx.globalCompositeOperation = "lighter";
    for (let i = 0; i < L.length; i++) {
      if (!reached(i)) continue;
      const g = age(i);
      if (g >= PULSE) continue;
      const [x, y] = curve(i, 1 - g / PULSE);
      const rgb = themes ? FAM[A[L[i].a].fam] : CREAM;
      cx.fillStyle = `rgba(${rgb},.9)`;
      cx.beginPath(); cx.arc(x, y, 1.8, 0, 7); cx.fill();
      cx.fillStyle = `rgba(${rgb},.18)`;
      cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.fill();
    }
    cx.globalCompositeOperation = "source-over";
    // the hovered and the selected, over the rest
    if (hov) { cx.lineWidth = 1; cx.strokeStyle = `rgba(${YELLOW},.55)`; for (const i of hov) if (reached(i)) thread(i); }
    if (mine) { cx.lineWidth = 1.3; cx.strokeStyle = `rgba(${YELLOW},.95)`; for (const i of mine) if (reached(i)) thread(i); }

    // the ayahs heard so far, growing with each couplet; a flare as a light arrives
    for (let a = 0; a < A.length; a++) {
      if (!heard[a]) continue;
      const r = 1.3 + Math.sqrt(heard[a]) * 1.05, x = qx(a), on = (sel && sel.k === "a" && sel.i === a) || (hover && hover.k === "a" && hover.i === a);
      if (flare[a] > 0) { cx.fillStyle = `rgba(${CREAM},${.25 * flare[a]})`; cx.beginPath(); cx.arc(x, yQ(), r + 6 * flare[a], 0, 7); cx.fill(); }
      cx.fillStyle = on ? `rgba(${YELLOW},1)` : `rgba(${themes ? FAM[A[a].fam] : CREAM},${.75 + .25 * flare[a]})`;
      cx.beginPath(); cx.arc(x, yQ(), r, 0, 7); cx.fill();
    }
    // the poems reached, as ticks on the Divan's line
    for (let p = 0; p < P.length; p++) {
      if (P[p].x + .5 > T) continue;
      const on = (sel && sel.k === "p" && sel.i === p) || (hover && hover.k === "p" && hover.i === p) || (sel && sel.k === "l" && L[sel.i].p === p);
      cx.fillStyle = on ? `rgba(${YELLOW},1)` : `rgba(${CREAM},.8)`;
      const n = byPoem[p].length;
      cx.fillRect(px(p) - (on ? 1 : .5), yD(), on ? 2 : 1, 3 + Math.min(9, n * 1.6));
    }
    cursor();
    clock.textContent = clockText();
  }

  // the two books: the Quran's line with its 114 surahs, the Divan's with its three parts
  function books() {
    cx.font = "500 9px 'JetBrains Mono', monospace"; cx.textBaseline = "alphabetic";
    // the Quran
    cx.fillStyle = `rgba(${CREAM},.28)`; cx.fillRect(PAD, yQ() - .3, fw(), .6);
    let o = 0;
    D.surahs.forEach((s, k) => {
      const x = along(o / NQ);
      cx.fillStyle = `rgba(${CREAM},${k % 2 ? .22 : .38})`;
      cx.fillRect(x - .3, yQ() - 4, .6, 4);
      o += s[2];
    });
    cx.fillStyle = `rgba(${CREAM},.55)`;
    cx.textAlign = fa() ? "right" : "left";
    cx.fillText(fa() ? "قرآن · ۱۱۴ سوره · ۶٬۲۳۶ آیه" : "the Quran · 114 surahs · 6,236 ayahs", fa() ? cw - PAD : PAD, yQ() - 12);
    // the Divan
    const y = yD();
    cx.fillStyle = `rgba(${CREAM},.28)`; cx.fillRect(PAD, y - .3, fw(), .6);
    for (const [, en, faName, s0, n] of D.sections) {
      const x0 = along(s0 / NP), x1 = along((s0 + n) / NP);
      cx.fillStyle = `rgba(${CREAM},.4)`; cx.fillRect(x0 - .3, y - 4, .6, 16);
      const w = Math.abs(x1 - x0), label = fa() ? `${faName} ${RO.num(n)}` : `${en.toLowerCase()} ${num(n)}`;
      cx.fillStyle = `rgba(${CREAM},.55)`; cx.textAlign = "center";
      if (cx.measureText(label).width < w - 8) cx.fillText(label, (x0 + x1) / 2, y + 26);
    }
    cx.fillStyle = `rgba(${CREAM},.4)`; cx.fillRect(along(1) - .3, y - 4, .6, 16);
    cx.textAlign = "left";
  }
  function cursor() {
    if (T >= NP) return;
    const x = along(T / NP);
    cx.fillStyle = `rgba(${YELLOW},.9)`; cx.fillRect(x - .5, yD() - 10, 1, 24);
  }

  function clockText() {
    let n = 0; const seen = new Set();
    for (let i = 0; i < L.length; i++) if (reached(i)) { n++; seen.add(L[i].a); }
    const at = Math.min(NP - 1, Math.floor(T));
    const sec = D.sections.find(s => at >= s[3] && at < s[3] + s[4]) || D.sections[0];
    const k = at - sec[3] + 1;
    if (fa()) return `${T >= NP ? "همهٔ دیوان" : `${sec[2]} · ${RO.num(k)}`} · ${RO.num(n)} بیت · ${RO.num(seen.size)} آیه`;
    const name = T >= NP ? "the whole Divan" : `${["ghazal", "strophic poem", "quatrain"][D.sections.indexOf(sec)]} ${num(k)}`;
    return `${name} · ${num(n)} couplet${n === 1 ? "" : "s"} · ${num(seen.size)} ayah${seen.size === 1 ? "" : "s"}`;
  }

  // ---------- reading ----------

  const surah = a => { const s = D.surahs[+A[a].ref.split(":")[0] - 1]; return fa() ? s[0] : s[1]; };
  const refText = a => fa() ? `${surah(a)}، آیهٔ ${RO.num(A[a].ref.split(":")[1])} (${A[a].ref})` : `Q ${A[a].ref} · ${surah(a)}`;
  const poemName = p => {
    const k = ["ghazalsh", "tarjeeat", "robaeesh"].indexOf(P[p].sec);
    return fa() ? `${["غزل", "ترجیع", "رباعی"][k]} ${RO.num(P[p].n)}` : `${["ghazal", "strophic poem", "quatrain"][k]} ${num(P[p].n)}`;
  };
  const ganjoor = (p, c) => `<a href="${esc(P[p].url)}${c != null ? "#bn" + (c + 1) : ""}" target="_blank" rel="noopener">${tr("on Ganjoor")}</a>`;
  const ai = s => s ? `<span class="ai" title="${esc(tr("written by a language model"))}">${tr("AI")}</span> ${esc(s)}` : "";
  const how = l => tr(l.rel) + (l.str ? (fa() ? "، " : ", ") + tr(l.str) : "");
  const doubtText = l => {
    if (!l.rv) return "";
    const alt = l.alt && l.alt.length ? (fa() ? ` بیشتر به ${l.alt.map(x => RO.num(x)).join("، ")} می‌خورد` : `; it would rather ${l.alt.join(", ")}`) : "";
    const v = { confirmed_not_unique: "confirmed, but a neighbouring ayah fits as well", weak: "weak", unsupported: "not borne out" }[l.rv] || l.rv;
    return `<p class="doubt">${tr("the blind review")}: ${tr(v)}${alt}</p>`;
  };
  function hemis(l) {
    return l.h.map(h => {
      let t = esc(h);
      const s = esc(l.span);
      if (s && t.includes(s)) t = t.replace(s, `<b>${s}</b>`);
      return `<p class="line"><span class="t">${t}</span></p>`;
    }).join("");
  }
  function ayahHTML(a) {
    const v = A[a];
    return `<p class="ar" lang="ar" dir="rtl">${esc(v.ar)}</p>` +
      `<p class="ref">${refText(a)}${fa() ? "" : " · " + ai(v.ten)}</p>` +
      (fa() ? `<p class="tr" lang="fa" dir="rtl">${esc(v.fa)} <span class="by">${tr("tr. Fooladvand")}</span></p>` : "");
  }
  const brief = (i, withRef) => {
    const l = L[i];
    return `<p class="link"><span class="how">${poemName(l.p)}${withRef ? " · " + A[l.a].ref : ""}</span><span class="h" lang="fa" dir="rtl">${esc(l.h.join(" / "))}</span></p>`;
  };

  function show(s) {
    sel = s;
    if (!s) { scope = null; panel.classList.remove("show"); frame.classList.remove("reading"); return; }
    where.dir = fa() ? "rtl" : "ltr";
    if (s.k === "l") {
      const l = L[s.i];
      const pos = scope ? ` · ${num(scope.indexOf(s.i) + 1)} ${tr("of")} ${num(scope.length)}` : "";
      where.innerHTML = `${poemName(l.p)} · ${tr("couplet")} ${num(l.c + 1)} · ${how(l)}${pos} · ${ganjoor(l.p, l.c)}`;
      couplet.innerHTML = hemis(l);
      ayahBox.innerHTML = ayahHTML(l.a);
      foot.innerHTML = `<p class="gloss">${ai(fa() ? l.gfa : l.gen)}</p>${doubtText(l)}`;
    } else if (s.k === "a") {
      const a = s.i, ls = byAyah[a].filter(reached), ps = new Set(ls.map(i => L[i].p)).size;
      where.innerHTML = fa() ? `${RO.num(ls.length)} بیت در ${RO.num(ps)} شعر به این آیه بازمی‌گردند · j k برای خواندنشان`
        : `heard in ${num(ls.length)} couplet${ls.length === 1 ? "" : "s"} in ${num(ps)} poem${ps === 1 ? "" : "s"} · j k to read them`;
      couplet.innerHTML = "";
      ayahBox.innerHTML = ayahHTML(a);
      foot.innerHTML = ls.slice(0, 3).map(i => brief(i)).join("") + (ls.length > 3 ? `<p class="more">+ ${num(ls.length - 3)} ${tr("more")}</p>` : "");
    } else {
      const p = s.i, ls = byPoem[p];
      where.innerHTML = `${poemName(p)} · ${ai(fa() ? P[p].tfa : P[p].ten)} · ${ganjoor(p)}`;
      couplet.innerHTML = "";
      ayahBox.innerHTML = "";
      foot.innerHTML = ls.slice(0, 4).map(i => brief(i, true)).join("") + (ls.length > 4 ? `<p class="more">+ ${num(ls.length - 4)} ${tr("more")} · j k</p>` : "");
    }
    panel.classList.add("show"); frame.classList.add("reading");
    panel.scrollTop = 0;
  }

  // ---------- pointer ----------

  function nearest(x, y) {
    if (y < yQ() + 12) {                             // the Quran's line: the ayah nearest
      let best = -1, bd = 14 * 14;
      for (let a = 0; a < A.length; a++) {
        if (!byAyah[a].some(reached)) continue;
        const d = (qx(a) - x) ** 2 + (yQ() - y) ** 2 * .3;
        if (d < bd) { bd = d; best = a; }
      }
      return best >= 0 ? { k: "a", i: best } : null;
    }
    if (y > yD() - 8) {                              // the Divan's line: the poem nearest
      let best = -1, bd = 10;
      for (let p = 0; p < P.length; p++) {
        if (P[p].x + .5 > T) continue;
        const d = Math.abs(px(p) - x);
        if (d < bd) { bd = d; best = p; }
      }
      return best >= 0 ? { k: "p", i: best } : null;
    }
    let best = -1, bd = 9 * 9;                       // between: the thread nearest
    for (let i = 0; i < L.length; i++) {
      if (!reached(i)) continue;
      const pts = samples[i];
      for (let k = 0; k < pts.length - 1; k++) {
        const d = segDist(x, y, pts[k], pts[k + 1]);
        if (d < bd) { bd = d; best = i; }
      }
    }
    return best >= 0 ? { k: "l", i: best } : null;
  }
  function segDist(x, y, [x0, y0], [x1, y1]) {
    const dx = x1 - x0, dy = y1 - y0, t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy || 1)));
    return (x0 + t * dx - x) ** 2 + (y0 + t * dy - y) ** 2;
  }
  const same = (a, b) => a && b && a.k === b.k && a.i === b.i;
  let dragging = false;
  const inStrip = y => y > yD() + 10;
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (dragging) { T = posOfX(x); return; }
    hover = inStrip(y) ? null : nearest(x, y);
    cv.style.cursor = inStrip(y) ? "ew-resize" : hover ? "pointer" : "default";
  });
  cv.addEventListener("pointerleave", () => { hover = null; });
  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (inStrip(y)) { dragging = true; playing = false; showPlay(); cv.setPointerCapture(e.pointerId); T = posOfX(x); return; }
    const h = nearest(x, y);
    if (!h || same(h, sel)) { show(null); return; }
    scope = h.k === "l" ? null : (h.k === "a" ? byAyah[h.i] : byPoem[h.i]).filter(reached);
    step = -1;
    show(h);
  });
  cv.addEventListener("pointerup", () => { dragging = false; });

  // ---------- keys and buttons ----------

  function showPlay() {
    playBtn.setAttribute("aria-pressed", playing);
    playBtn.querySelector("span").textContent = playing ? "❚❚" : "▶";
  }
  playBtn.addEventListener("click", () => { if (T >= NP) T = 0; playing = !playing; showPlay(); });
  // ← →: the cited poem before or after the cursor, read
  function poemStep(dir) {
    playing = false; showPlay();
    const at = T - .5;
    const list = dir > 0 ? cited.filter(p => P[p].x > at + .5) : cited.filter(p => P[p].x < at - .5).reverse();
    const p = list[0];
    if (p == null) return;
    T = P[p].x + 1;
    scope = byPoem[p]; step = -1;
    show({ k: "p", i: p });
  }
  $("#back").addEventListener("click", () => poemStep(-1));
  $("#fwd").addEventListener("click", () => poemStep(1));

  // j k: the next couplet, in the Divan's order; only the selected ayah's or poem's, once one is selected
  function go(dir) {
    const list = scope || L.map((_, i) => i);
    if (!list.length) return;
    if (step < 0 && sel && sel.k === "l" && list.includes(sel.i)) step = list.indexOf(sel.i);
    step = step < 0 ? (dir > 0 ? 0 : list.length - 1) : Math.max(0, Math.min(list.length - 1, step + dir));
    if (!scope) {                                    // from where the cursor is, the first time
      if (sel === null && step === 0 && T > 0 && T < NP) step = Math.max(0, list.findIndex(i => P[L[i].p].x + .5 > T) - (dir > 0 ? 0 : 1));
    }
    const i = list[step];
    playing = false; showPlay();
    T = Math.max(T, P[L[i].p].x + 1 + NP / RUN * PULSE);
    show({ k: "l", i });
  }

  for (const [id, set] of [["themes", v => (themes = v)], ["doubt", v => (doubt = v)]]) {
    const b = $("#" + id);
    b.addEventListener("click", () => { const v = b.getAttribute("aria-pressed") !== "true"; set(v); b.setAttribute("aria-pressed", v); });
  }

  const speedBtn = $("#speed");
  function setSpeed(s) {
    speed = Math.max(0, Math.min(SPEEDS.length - 1, s));
    speedBtn.querySelector("span").textContent = ["1×", "½×", "¼×"][speed];
    speedBtn.setAttribute("aria-pressed", speed > 0);
  }
  speedBtn.addEventListener("click", () => setSpeed((speed + 1) % SPEEDS.length));

  // the whole screen: the browser's own full screen where there is one, and the frame over the window either way
  const fullBtn = $("#full"), stage = frame.closest(".ro-stage");
  const isMax = () => frame.classList.contains("max");
  function setMax(on) {
    if (on === isMax()) return;
    frame.classList.toggle("max", on);
    document.documentElement.classList.toggle("ro-maxed", on);
    fullBtn.setAttribute("aria-pressed", on);
    fullBtn.querySelector("span").textContent = on ? "⤡" : "⤢";
    if (on && stage.requestFullscreen && !document.fullscreenElement) stage.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    frame.focus({ preventScroll: true });
  }
  fullBtn.addEventListener("click", () => setMax(!isMax()));
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement) setMax(false); });

  function jump(pos) { playing = false; showPlay(); T = pos; }

  window.Piece({
    frame,
    keys: () => [["space", tr("play · pause")], ["← →", tr("a poem")], ["1 2 3", tr("the three parts")], ["j k", tr("the next couplet")], ["t", tr("themes")], ["d", tr("the doubtful")], ["- +", tr("slower · faster")], ["f", tr("whole screen")]],
    help: () => [
      ["space", tr("read on through the Divan, or stop")],
      ["← →", tr("the poem before or after that recalls an ayah")],
      ["1 2 3", tr("go to the ghazals, the strophic poems, the quatrains")],
      ["0", tr("go to the end: every couplet, every ayah")],
      ["j k", tr("the next / previous couplet in the Divan's order; once an ayah or a poem is selected, only its couplets")],
      ["t", tr("colour the threads by what their ayahs are about")],
      ["d", tr("mark the 17 links a second, blind review did not confirm")],
      ["- +", tr("slower or faster: half or a quarter the pace")],
      ["f", tr("fill the whole screen, and back (esc too)")],
    ],
    key(e) {
      const k = e.key;
      if (!D) return false;
      if (k === " ") { playBtn.click(); return true; }
      if (k === "ArrowLeft") { $(fa() ? "#fwd" : "#back").click(); return true; }
      if (k === "ArrowRight") { $(fa() ? "#back" : "#fwd").click(); return true; }
      if (/^[1-3]$/.test(k)) { jump(D.sections[+k - 1][3]); return true; }
      if (k === "0") { jump(NP + NP / RUN * PULSE * 1.2); return true; }
      if (k === "j") { go(1); return true; }
      if (k === "k") { go(-1); return true; }
      if (k === "t") { $("#themes").click(); return true; }
      if (k === "d") { $("#doubt").click(); return true; }
      if (k === "-" || k === "_") { setSpeed(speed + 1); return true; }
      if (k === "+" || k === "=") { setSpeed(speed - 1); return true; }
      if (k === "f") { setMax(!isMax()); return true; }
      return false;
    },
    escape() { if (sel) { show(null); return true; } if (isMax()) { setMax(false); return true; } return false; },
  });
  showPlay();
})();
