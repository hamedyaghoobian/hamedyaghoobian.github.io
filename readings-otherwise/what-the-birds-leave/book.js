// What the Birds Leave: the book, in 29 sections.
// Under the flock, the whole poem as numbers: a strip of its 29 sections
// read right to left (each as wide as the square root of its dots, the
// Simorgh's gold dots stacked above it), a map of every half-line in the
// manuscript layout the flock lands in, and the chosen section's counts set
// against the whole book. Everything is counted here from the same data the
// flock flies (data/naskh), so nothing is typed in by hand.
// j / k (while the page has the keys) step through the sections.

(function () {
  const root = document.getElementById("book");
  if (!root) return;

  const GLOSS = ["in praise of god", "in praise of the prophet", "the virtues of the caliphs", "on partisanship", "the book begins", "the simorgh", "the nightingale", "the parrot", "the peacock", "the duck", "the partridge", "the huma", "the hawk", "the heron", "the owl", "the finch", "the birds ask", "the hoopoe answers", "the birds set out", "the birds' excuses", "valley of the quest", "valley of love", "valley of knowledge", "valley of detachment", "valley of unity", "valley of bewilderment", "valley of poverty and annihilation", "thirty birds before the simorgh", "on his own state"];
  const VALLEYS = [20, 26];
  // in English or Persian (../lang.js): in Persian the heading stands alone, without its English gloss
  const fa = () => !!(window.RO && RO.fa());
  const tr = s => (window.RO ? RO.tr(s) : s);
  const fmt = n => (window.RO ? RO.num(n) : n.toLocaleString("en"));
  const dec = x => (fa() ? x.toLocaleString("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : x.toFixed(1));
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, a, parent) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; };

  let S = [], BOOK = null, TOTAL = null, sec = 27;

  Promise.all([
    fetch("data/naskh/text.json").then(r => r.json()),
    fetch("data/naskh/dots.bin").then(r => r.arrayBuffer()),
  ]).then(([T, bin]) => {
    const n = T.dots, flags = new Uint8Array(bin, n * 4, n), st = T.starts;
    const layerOf = f => f & 1 ? 5 : f >> 1;
    TOTAL = { dots: n, couplets: T.lines.length / 2, lay: [0, 0, 0, 0, 0, 0] };
    for (const f of flags) TOTAL.lay[layerOf(f)]++;

    S = T.sections.map((s, i) => {
      const a = s.poems[0].start, e = s.poems[s.poems.length - 1].end, lay = [0, 0, 0, 0, 0, 0];
      for (let k = st[a]; k < st[e]; k++) lay[layerOf(flags[k])]++;
      return { i, title: s.title, couplets: (e - a) / 2, dots: st[e] - st[a], lay, gold: lay[5] };
    });

    // The manuscript layout the flock lands in (flock.js layout(), naskh).
    const { colW, rowH } = T.page, PITCH = 2 * colW + 1.4 + 4.5;
    const bare = s => s.replace(/[\s‌]/g, "");
    const rows = [];
    T.sections.forEach((s, si) => {
      rows.push({ k: 2, si });
      s.poems.forEach((p, pi) => {
        const same = pi === 0 && (bare(p.title).startsWith(bare(s.title)) || bare(s.title).startsWith(bare(p.title)));
        if (!same) rows.push({ k: 1, si });
        for (let l = p.start; l < p.end; l += 2) {
          let g = false;
          for (const x of [l, l + 1]) for (let k = st[x]; k < st[x + 1] && !g; k++) if (flags[k] & 1) g = true;
          rows.push({ k: 0, si, a: T.widths[l] / T.upem / colW, b: l + 1 < T.lines.length ? T.widths[l + 1] / T.upem / colW : 0, g });
        }
      });
    });
    const cols = Math.max(1, Math.round(Math.sqrt(1.45 * rowH * rows.length / PITCH)));
    BOOK = { rows, cols, per: Math.ceil(rows.length / cols) };

    root.hidden = false;
    render();
    addEventListener("resize", () => { clearTimeout(render.t); render.t = setTimeout(render, 120); });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("ro-lang", render);
    // j / k on the page step the sections (faceplate.js moves the marker; we follow it).
    if (window.FP) FP.partsSelector = "#bk-strip .bk-bar";
    document.addEventListener("fp-at", e => {
      const g = e.detail;
      if (!g || !g.dataset || g.dataset.sec == null) return;
      // keep the strip's elements (faceplate.js holds on to the marked one); just move the "on" state
      sec = +g.dataset.sec;
      document.querySelectorAll("#bk-strip .bk-bar").forEach(b => b.classList.toggle("is-on", b === g));
      map(); readout();
    });
  }).catch(() => {});

  function render() {
    if (!BOOK) return;
    document.getElementById("bk-map-n").textContent = fa()
      ? `${fmt(BOOK.cols)} ستون · ${fmt(BOOK.rows.length)} سطر` : `${BOOK.cols} columns · ${fmt(BOOK.rows.length)} rows`;
    strip();
    map();
    readout();
  }

  function strip() {
    const svg = document.getElementById("bk-strip");
    // room above the bars for the tallest stack of gold, so it never runs into the heading
    const stack = Math.min(10, Math.ceil(Math.max(...S.map(s => s.gold)) / 5));
    const W = svg.clientWidth || 600, top = 12 + stack * 5.2, h = 54, gap = 2, H = top + h + 40;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.style.height = `${H}px`;
    const ws = S.map(s => Math.sqrt(s.dots));
    const k = (W - gap * (S.length - 1)) / ws.reduce((a, b) => a + b, 0);
    let x = W, v0 = 0, v1 = 0;
    S.forEach((s, i) => {
      const w = ws[i] * k; x -= w;
      const on = i === sec;
      const g = svgEl("g", { class: "bk-bar" + (on ? " is-on" : ""), "data-sec": i }, svg);
      g.addEventListener("click", () => { sec = i; render(); });
      svgEl("rect", { class: "bk-bar__box", x: x + .5, y: top, width: Math.max(1, w - 1), height: h }, g);
      // the Persian letters' share, scaled ×3 so the differences show
      const pf = s.lay[4] / s.dots;
      svgEl("rect", { class: "bk-bar__fa", x: x + 1, y: top + h - h * pf * 3, width: Math.max(0, w - 2), height: h * pf * 3 }, g);
      const n = Math.min(10, Math.ceil(s.gold / 5));
      for (let j = 0; j < n; j++) {
        const cx = x + w / 2, cy = top - 7 - j * 5.2;
        svgEl("rect", { class: "bk-gold", x: cx - 1.8, y: cy - 1.8, width: 3.6, height: 3.6, transform: `rotate(45 ${cx} ${cy})` }, g);
      }
      // numbers only where they fit; the narrow ones are named on hover and in the readout
      if (w >= 12 || on) { const t = svgEl("text", { class: "bk-bar__n", x: x + w / 2, y: top + h + 13 }, g); t.textContent = fmt(i); }
      svgEl("title", {}, g).textContent = fa() ? `${fmt(i)} · ${s.title} · ${fmt(s.dots)} نقطه · ${fmt(s.gold)} زرین`
        : `${i} · ${GLOSS[i]} · ${fmt(s.dots)} dots · ${s.gold} gold`;
      if (i === VALLEYS[0]) v1 = x + w;
      if (i === VALLEYS[1]) v0 = x;
      x -= gap;
    });
    const y = top + h + 24;
    svgEl("path", { class: "bk-valleys", d: `M${v0} ${y - 4}V${y}H${v1}V${y - 4}` }, svg);
    svgEl("text", { class: "bk-valleys__t", x: (v0 + v1) / 2, y: y + 12 }, svg).textContent = tr("the seven valleys · no gold");
  }

  function map() {
    const cv = document.getElementById("bk-map"), ctx = cv.getContext("2d");
    const css = getComputedStyle(cv);
    const ink = css.color, gold = css.getPropertyValue("--yellow").trim() || "#F2C500", cobalt = css.getPropertyValue("--cobalt").trim() || "#2B3BD1";
    const MW = 340, ROW = 1.3, MH = Math.round(BOOK.per * ROW) + 8, r = Math.min(2, devicePixelRatio || 1);
    cv.width = MW * r; cv.height = MH * r; cv.style.aspectRatio = `${MW} / ${MH}`;
    ctx.setTransform(r, 0, 0, r, 0, 0); ctx.clearRect(0, 0, MW, MH);
    const cwid = MW / BOOK.cols, half = (cwid - 4) / 2, golds = [];
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = .9;
    BOOK.rows.forEach((row, ri) => {
      const c = Math.floor(ri / BOOK.per), y = 4 + (ri % BOOK.per) * ROW + .6, xr = MW - c * cwid - 2;
      const on = row.si === sec;
      if (row.k === 2) { ctx.globalAlpha = on ? 1 : .5; ctx.fillRect(xr - half * 2, y - .6, half * 2, 1.3); return; }
      if (row.k === 1) { ctx.globalAlpha = on ? .8 : .25; ctx.fillRect(xr - half * 1.2, y - .3, half * .4, .8); return; }
      ctx.globalAlpha = on ? .95 : .2;
      const a = Math.min(1, row.a) * half, b = Math.min(1, row.b) * half;
      ctx.beginPath();
      ctx.moveTo(xr - (half - a) / 2, y); ctx.lineTo(xr - (half + a) / 2, y);
      ctx.moveTo(xr - half - 1 - (half - b) / 2, y); ctx.lineTo(xr - half - 1 - (half + b) / 2, y);
      ctx.stroke();
      if (row.g) golds.push([xr - half, y]);
    });
    ctx.globalAlpha = 1;
    golds.forEach(([x, y]) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
      ctx.fillStyle = gold; ctx.fillRect(-1.6, -1.6, 3.2, 3.2);
      ctx.strokeStyle = cobalt; ctx.lineWidth = .5; ctx.strokeRect(-1.6, -1.6, 3.2, 3.2);
      ctx.restore();
    });
  }

  const NOTES = {
    5: "The Simorgh's own story is the shortest section in the book: 13 couplets.",
    16: "The most gold of any section: the birds ask about the Simorgh more often than its name is written where they arrive.",
    19: "The birds' excuses: a third of the whole poem, and almost no gold.",
    27: "The arrival, and the eight places where Attar splits the name into si morgh, thirty birds.",
  };
  for (let v = VALLEYS[0]; v <= VALLEYS[1]; v++) NOTES[v] = "Not one gold dot. In all seven valleys the Simorgh's name is not written once.";

  function readout() {
    const s = S[sec], maxC = Math.max(...S.map(x => x.couplets));
    const row = (label, n, share) => `<tr><td>${label}</td><td class="n">${fmt(n)}</td><td><div class="bk-bk"><i style="width:${n / s.dots * 100}%"></i><u style="left:${share * 100}%"></u></div></td></tr>`;
    const per = TOTAL.dots / TOTAL.couplets, F = fa();
    const out = document.getElementById("bk-readout");
    out.dir = F ? "rtl" : "";
    if (F) out.lang = "fa"; else out.removeAttribute("lang");
    const valley = sec >= VALLEYS[0] && sec <= VALLEYS[1] ? sec - VALLEYS[0] + 1 : 0;
    const where = F ? `بخش ${fmt(sec)} از ${fmt(S.length - 1)}${valley ? ` · وادی ${fmt(valley)} از ${fmt(7)}` : ""}`
      : `section ${sec} of ${S.length - 1}${valley ? ` · valley ${valley} of 7` : ""}`;
    out.innerHTML = `
      <p class="fp-label">${where}</p>
      <p class="bk-fa" lang="fa" dir="rtl">${s.title}</p>
      ${F ? "" : `<p class="bk-gl">${GLOSS[sec]}</p>`}
      <table class="bk-spec">
        <tr><td>${tr("couplets")}</td><td class="n">${fmt(s.couplets)}</td><td><div class="bk-bk"><i style="width:${s.couplets / maxC * 100}%"></i></div></td></tr>
        <tr><td>${tr("dots per couplet")}</td><td class="n">${dec(s.dots / s.couplets)}</td><td class="fp-label">${F ? "کتاب" : "book"}: ${dec(per)}</td></tr>
        ${row(tr("one dot"), s.lay[1], TOTAL.lay[1] / TOTAL.dots)}
        ${row(tr("two dots"), s.lay[2], TOTAL.lay[2] / TOTAL.dots)}
        ${row(tr("three dots"), s.lay[3], TOTAL.lay[3] / TOTAL.dots)}
        ${row(tr('Persian <span lang="fa">پ چ ژ</span>'), s.lay[4], TOTAL.lay[4] / TOTAL.dots)}
        <tr><td><span class="bk-goldkey"></span>${tr("gold")}</td><td class="n">${fmt(s.gold)}</td><td class="fp-label">${F ? "از" : "of"} ${fmt(TOTAL.lay[5])}</td></tr>
      </table>
      <p class="fp-label">${tr("bar: share of this section's dots · tick: share in the whole book")}</p>
      ${NOTES[sec] ? `<p class="bk-note">${tr(NOTES[sec])}</p>` : ""}`;
  }
})();
