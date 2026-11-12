// What the Hand Gives Back: the page's side of the piece. The engine (data/dastkhat.js, built from
// github.com/hamedyaghoobian/dastkhat with `npm run build:piece`) writes a letter into the frame; this file
// wires it to the site: the hand keys, the frame's keycaps, the letter's record under the frame, the address
// (?letter=…&hand=…&w=… replays the same page), the theme knob and the Persian switch (../lang.js).
import { mount } from "./data/dastkhat.js?v=2";

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
  onShow: s => { record(s); address(s); hands(s.hand); if (still.matches) queueMicrotask(() => piece.finish()); },
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
  keys: () => [["n", tr("another letter")], ["h", tr("the other hand")], ["w", tr("write it all")], ["r", tr("write it again")], ["esc", tr("give the keys back")]],
  help: () => [
    ["n", tr("another letter, at random: short ones first")],
    ["h", tr("the same letter in the other hand: a Qajar reed, or a fine pen")],
    ["w", tr("let the pen finish the page at once")],
    ["r", tr("write the same page again from the first stroke")],
  ],
  key(e) {
    if (e.key === "h") { piece.otherHand(); return true; }
    return false;
  },
});

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
