// What the Hand Gives Back: the page's side of the piece. The engine (data/dastkhat.js, built from
// github.com/hamedyaghoobian/dastkhat with `npm run build:piece`) writes a letter into the frame; this file
// wires it to the site: the hand keys, the frame's keycaps, the letter's record under the frame, the address
// (?letter=…&hand=…&w=… replays the same page), the theme knob and the Persian switch (../lang.js).
import { mount } from "./data/dastkhat.js?v=8";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const tr = s => (window.RO ? RO.tr(s) : s);
const fa = () => !!(window.RO && RO.fa());

const frame = $("#frame");
const pen = $("#pen");
const HANDS = { qajar: ["a reed, Qajar", "قلم نی، قاجاری"], note: ["a fine pen, a note", "خودنویس، یادداشت"] };

const q = new URLSearchParams(location.search);
const still = matchMedia("(prefers-reduced-motion: reduce)");
const piece = await mount($("#sheet"), {
  colors: { paper: "--ro-sky", ink: "--ro-mark" },
  onProgress: f => {
    pen.style.transform = `scaleX(${f})`;
    pen.hidden = f >= 1;
    frame.classList.toggle("is-writing", f < 1);
  },
  // with reduced motion the page is there at once, already written
  onShow: s => { record(s); address(s); hands(s.hand); if (still.matches) queueMicrotask(() => piece.finish()); copyShown(s); },
});

const n = ch => (fa() ? RO.num(ch) : String(ch));

function record(s) {
  const L = s.letter;
  const num = L.number != null ? (fa() ? `شمارهٔ ${RO.num(L.number)} · ` : `No. ${L.number} · `) : "";
  $("#rec-letter").innerHTML = `${num}<bdi lang="fa">${L.title}</bdi>`;
  $("#rec-to").innerHTML = L.recipient ? `<bdi lang="fa">${L.recipient}</bdi>` : tr("not given in the source");
  $("#rec-when").innerHTML = fa() ? `<bdi lang="fa">${L.period}</bdi>` : "before 1835, when Qaem-Maqam died";
  $("#rec-hand").textContent = HANDS[s.hand][fa() ? 1 : 0];
  const words = n(s.words);
  $("#rec-text").innerHTML = (s.cut
    ? (fa() ? `آغاز نامه، ${words} واژه، تا پایان یک جمله · ` : `the opening, ${words} words, to the end of a sentence · `)
    : (fa() ? `همهٔ نامه، ${words} واژه · ` : `the whole letter, ${words} words · `))
    + `<a href="${L.source.url}">${tr("the typed text on Ganjoor")}</a>`;
}

function address(s) {
  const u = new URL(location.href);
  u.searchParams.set("letter", s.letter.id);
  u.searchParams.set("hand", s.hand);
  u.searchParams.set("w", s.seed);
  history.replaceState(null, "", u);
}

function hands(h) { $$(".hands [data-hand]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.hand === h))); }

// buttons: the hand, and the frame's keycaps (their keys are on them: data-ro-key)
$$(".hands [data-hand]").forEach(b => b.addEventListener("click", () => {
  const s = piece.current();
  if (s && s.hand !== b.dataset.hand) piece.show({ letter: s.letter.id, hand: b.dataset.hand });
}));
$("#again").addEventListener("click", () => piece.replay());
$("#all").addEventListener("click", () => piece.finish());
$("#next").addEventListener("click", () => piece.another());

// the keys, while the piece has them (../piece.js)
window.Piece({
  frame,
  keys: () => [["n", tr("another letter")], ["h", tr("the other hand")], ["w", tr("write it all")], ["r", tr("write it again")], ["c", tr("copy it out yourself")], ["esc", tr("give the keys back")]],
  help: () => [
    ["n", tr("another letter, at random: short ones first")],
    ["h", tr("the same letter in the other hand: a Qajar reed, or a fine pen")],
    ["w", tr("let the pen finish the page at once")],
    ["r", tr("write the same page again from the first stroke")],
    ["c", tr("copy the letter out yourself: type it in Persian, and the pen writes each word you finish")],
  ],
  key(e) {
    if (e.key === "h") { piece.otherHand(); return true; }
    return false;
  },
  escape: () => { if (!piece.copy.on) return false; copyStop(); return true; },
});

// copying it out, as in Marrow (marrow.page): the letter lies faintly on the sheet and the reader types it. The line
// under the sheet is the typed text, lit as far as it has been copied, with any slip in red; a word is written when
// the reader finishes it (space or enter), always as the letter has it. Typing here never reaches the frame's keys.
const copyBox = $("#copy"), copyLine = $("#copy-line"), copyIn = $("#copy-input"), copyAt = $("#copy-at");
const copyKey = $("#copy-key"), copyHint = $("#copy-hint");
const MARKS = /[\u064B-\u065F\u0670\u0640]/g;   // harakat, the dagger alef, tatweel: not typed, not counted
const unify = c => c.replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[ۀ]/g, "ه").replace(/[أإٱ]/g, "ا");
const units = w => [...w.replace(MARKS, "")];
let cw = [], ci = 0, slips = [], copyOf = null;

function copyRender() {
  const out = cw.map((w, k) => {
    const src = units(w.text);
    if (k < ci) {
      const t = slips[k] || [];
      return `<span class="w done" data-k="${k}">${src.map((c, j) => t[j] === false ? `<span class="bad">${c}</span>` : c).join("")}</span>`;
    }
    if (k > ci) return `<span class="w" data-k="${k}">${w.text}</span>`;
    const typed = units(copyIn.value);
    let html = "";
    src.forEach((c, j) => {
      if (j < typed.length) html += `<span class="${unify(typed[j]) === unify(c) ? "ok" : "bad"}">${c}</span>`;
      else html += j === typed.length ? `<span class="next">${c}</span>` : c;   // a caret would break the joining`
    });
    if (typed.length >= src.length) html += typed.slice(src.length).map(c => `<span class="bad">${c}</span>`).join("") + '<i class="caret"></i>';
    return `<span class="w now" data-k="${k}">${html}</span>`;
  });
  copyLine.innerHTML = out.join(" ") + (ci >= cw.length ? ' <i class="caret"></i>' : "");
  // the word in hand at the middle of the line (and the line's start, the right, before anything is typed)
  const el = copyLine.querySelector(".now") || copyLine.lastElementChild;
  if (el) copyLine.scrollLeft += (el.offsetLeft + el.offsetWidth / 2) - (copyLine.scrollLeft + copyLine.clientWidth / 2);
  // and its shadow on the sheet, underlined in red
  const w = cw[ci];
  copyAt.hidden = !w;
  if (w) {
    const em = piece.copy.em();
    Object.assign(copyAt.style, { left: `${w.x0}px`, width: `${Math.max(4, w.x1 - w.x0)}px`, top: `${w.y + em * 0.55}px` });
  }
  pen.hidden = false;
  pen.style.transform = `scaleX(${cw.length ? ci / cw.length : 0})`;
}

function copyLayout() {
  const s = piece.current();
  cw = piece.copy.words();
  if (!s || copyOf !== s.letter.id) { ci = 0; slips = []; copyIn.value = ""; copyOf = s && s.letter.id; copyHint.classList.remove("gone"); }
  copyRender();
}
piece.copy.onLayout(copyLayout);

function copyShown(s) { if (piece.copy.on && copyOf !== s.letter.id) copyLayout(); }

function copyStart() {
  if (piece.copy.on) { copyIn.focus({ preventScroll: true }); return; }
  copyBox.hidden = false;
  frame.classList.add("is-copying");
  copyKey.setAttribute("aria-pressed", "true");
  copyOf = null;
  piece.copy.start();
  copyIn.focus({ preventScroll: true });
}
function copyStop() {
  if (!piece.copy.on) return;
  piece.copy.stop();
  copyBox.hidden = true; copyAt.hidden = true;
  frame.classList.remove("is-copying");
  copyKey.setAttribute("aria-pressed", "false");
  frame.focus({ preventScroll: true });
}
copyKey.addEventListener("click", () => (piece.copy.on ? copyStop() : copyStart()));

// one word finished: the pen writes it, as the letter has it; what was typed is kept to show the slips
function copyNext() {
  const w = cw[ci];
  if (!w) return;
  const src = units(w.text), typed = units(copyIn.value);
  slips[ci] = src.map((c, j) => j < typed.length ? unify(typed[j]) === unify(c) : null);
  piece.copy.write(ci);
  ci++;
  copyIn.value = "";
  copyHint.classList.add("gone");
}
function copyTake(v) {
  // a space (or a new line) ends the word, unless the word goes on after a half-space (نامه‌ها): then it is that
  let acc = "";
  for (const ch of v) {
    if (ch === " " || ch === "\n") {
      const w = cw[ci], src = w ? units(w.text) : [];
      if (src[units(acc).length] === "\u200C") { acc += "\u200C"; continue; }
      if (!units(acc).length) continue;   // a space with nothing typed yet does nothing
      copyIn.value = acc; copyNext(); acc = "";
    } else acc += ch;
  }
  copyIn.value = acc;
  copyRender();
}
copyIn.addEventListener("input", () => copyTake(copyIn.value));
copyIn.addEventListener("keydown", e => {
  if (e.key === "Escape") return;            // the frame's: it stops copying
  e.stopPropagation();                       // every other key is typing, not the piece's keys
  if (e.key === "Enter") { e.preventDefault(); copyTake(copyIn.value + " "); }
});
// a press on the sheet while copying goes to the typing, not the frame
frame.addEventListener("pointerdown", e => {
  if (!piece.copy.on || e.target.closest("button, a")) return;
  e.preventDefault(); e.stopPropagation();
  copyIn.focus({ preventScroll: true });
}, true);

// the reply: a sheet of its own in the same hand; what is typed waits faintly where the pen will write it
const rframe = $("#reply-frame"), input = $("#reply-input"), ghost = $("#ghost");
const rsave = $("#reply-save"), rfresh = $("#reply-fresh");
const reply = piece.reply($("#reply-sheet"), input, {
  onPending(text, at) {
    ghost.textContent = text;
    ghost.style.right = `${rframe.clientWidth - at.x}px`;
    ghost.style.top = `${at.y - at.em * 0.95}px`;
    ghost.style.fontSize = `${Math.max(15, at.em * 0.55)}px`;
  },
  onChange(words) {
    rsave.disabled = rfresh.disabled = words === 0;
    $("#reply").classList.toggle("has-words", words > 0);
  },
});
rframe.addEventListener("pointerdown", e => { if (!e.target.closest("button, a")) { e.preventDefault(); input.focus({ preventScroll: true }); } });
rsave.addEventListener("click", () => {
  const s = piece.current();
  reply.save(`reply-to-qaem-maqam${s && s.letter.number != null ? "-" + s.letter.number : ""}.png`);
});
rfresh.addEventListener("click", () => { reply.clear(); input.focus({ preventScroll: true }); });

// the theme knob and the system's light and dark: the sheets take the frame's colours again
new MutationObserver(() => { piece.retheme(); reply.retheme(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
document.addEventListener("ro-lang", () => { const s = piece.current(); if (s) record(s); });

// first page: the one in the address, or the first letter in the reed
piece.show({ letter: q.get("letter") || undefined, hand: q.get("hand") || "qajar", seed: q.get("w") || undefined });
document.body.classList.add("is-ready");
