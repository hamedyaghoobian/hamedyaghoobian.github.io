// Readings, Otherwise: the pages in Persian.
//
// p (the same key on a Persian keyboard, ح) or the فارسی button in the crumb turns the page into
// Persian and back. The choice is kept where the site keeps the theme, so the next page opens in
// it, and ?lang=fa in a link opens a page in Persian.
//
// A page gives its Persian with RO.add({ t: {...}, w: {...} }) in its own fa.js:
//   t   key → Persian HTML, for the elements marked data-t="key" (their English is kept and put
//       back); "@title" and "@desc" are the page's title and description; data-ta="key" and
//       data-tt="key" put the Persian in an element's aria-label or title
//   w   English → Persian, for the strings the pieces write themselves (RO.tr(s) looks them up)
// An element marked data-t is set right to left in Persian, unless it is marked data-t-ltr.
// When the language changes, document gets a "ro-lang" event, for the pieces to draw again.

(function () {
  const STORE = "ro-lang";
  const RO = window.RO = window.RO || {};
  const T = {}, W = {};
  let lang = "en";
  try {
    const q = new URLSearchParams(location.search).get("lang");
    lang = q === "fa" || q === "en" ? q : localStorage.getItem(STORE) === "fa" ? "fa" : "en";
  } catch (_) {}

  RO.lang = () => lang;
  RO.fa = () => lang === "fa";
  RO.tr = s => (lang === "fa" && W[s] != null ? W[s] : s);
  RO.t = (en, fa) => (lang === "fa" && fa != null ? fa : en);
  RO.num = n => (lang === "fa" ? Number(n).toLocaleString("fa-IR") : Number(n).toLocaleString("en-US"));
  // a key pressed on a Persian (or any non-Latin) layout, read as the Latin key in the same place
  RO.latin = e => {
    const k = e.key;
    if (k && k.length === 1 && k.charCodeAt(0) > 127) {
      if (/^Key[A-Z]$/.test(e.code)) return e.code[3].toLowerCase();
      if (/^Digit[0-9]$/.test(e.code)) return e.code[5];
      const d = "۰۱۲۳۴۵۶۷۸۹".indexOf(k);
      if (d >= 0) return String(d);
    }
    return k;
  };

  // the words every page shares: the crumb, the keys guide, the piece's key strip
  Object.assign(T, {
    "skip": "رفتن به اثر",
    "up": '<span class="fp-k">esc</span>بالا',
    "keys": '<span class="fp-k">i</span>کلیدها',
    "help-title": "کلیدهای این صفحه",
    "help-note": "کلیدها هنگام نوشتن کار نمی‌کنند. وقتی اثر در دست شماست، کلیدهای خودش پیش‌اند؛ esc آن‌ها را پس می‌دهد.",
    "thumb-up": "بالا · ۰۶ خوانش‌ها",
    "thumb-prev": "‹ پیشین",
    "thumb-next": "پسین ›",
    "crumb-home": "حامد یعقوبیان",
    "crumb-readings": '<span class="fp-crumb__n">06</span> خوانش‌ها',
  });
  Object.assign(W, {
    "keys: piece · esc to give back": "کلیدها: اثر · esc برای پس دادن",
    "keys: page · enter to take them": "کلیدها: صفحه · enter برای گرفتن",
    "the piece": "اثر",
    "the page": "صفحه",
    "keys to the piece": "کلیدها به اثر",
    "up": "بالا",
    "theme": "رنگ",
    "keys": "کلیدها",
    "Persian · English": "فارسی · English",
    "English · Persian": "English · فارسی",
    "the piece · while it has the keys": "اثر · وقتی کلیدها در دست اوست",
    "then": "و بعد",
    "the page · once the keys are given back": "صفحه · وقتی کلیدها پس داده شد",
    "step back: close what is open, then give the keys back": "یک گام پس: آنچه باز است بسته می‌شود، بعد کلیدها پس داده می‌شوند",
    "turn the theme knob": "پیچ رنگ را بچرخان",
    "turn the theme knob: light · dark · auto": "پیچ رنگ را بچرخان: روشن · تیره · خودکار",
    "these keys (? works too)": "همین کلیدها (? هم کار می‌کند)",
    "give the keys to the piece": "کلیدها را به اثر بده",
    "this page": "این صفحه",
    "moving": "رفتن",
    "the whole site": "همهٔ سایت",
    "press a section key": "کلید یک بخش را بزن",
    "previous": "پیشین",
    "next": "پسین",
    "up to": "بالا به",
    "one level up": "یک پله بالاتر",
    "find on this page": "جستن در این صفحه",
    "open it": "بازش کن",
    "item": "مورد",
    "part": "بخش",
    "here": "اینجا",
    "next / previous": "بعدی / قبلی",
  });

  RO.add = d => {
    Object.assign(T, d.t || {});
    Object.assign(W, d.w || {});
    if (lang === "fa") apply();
  };

  const en = new WeakMap();   // what each element said in English
  function apply() {
    const fa = lang === "fa";
    document.documentElement.lang = fa ? "fa" : "en";
    document.documentElement.dataset.lang = lang;
    for (const el of document.querySelectorAll("[data-t]")) {
      const k = el.dataset.t;
      if (T[k] == null) continue;
      if (!en.has(el)) en.set(el, el.innerHTML);
      el.innerHTML = fa ? T[k] : en.get(el);
      if (!("tLtr" in el.dataset)) {
        if (fa) { el.dir = "rtl"; el.lang = "fa"; } else { el.removeAttribute("dir"); el.removeAttribute("lang"); }
      }
    }
    for (const [attr, data] of [["aria-label", "ta"], ["title", "tt"]]) {
      for (const el of document.querySelectorAll(`[data-${data}]`)) {
        const k = el.dataset[data], key = "@" + attr;
        if (T[k] == null) continue;
        if (!el[key]) el[key] = el.getAttribute(attr) || "";
        el.setAttribute(attr, fa ? T[k] : el[key]);
      }
    }
    if (T["@title"]) { if (!RO._title) RO._title = document.title; document.title = fa ? T["@title"] : RO._title; }
    const desc = document.querySelector('meta[name="description"]');
    if (desc && T["@desc"]) { if (!RO._desc) RO._desc = desc.content; desc.content = fa ? T["@desc"] : RO._desc; }
    const box = document.querySelector("#fp-help .fp-help__box");
    if (box) { box.dir = fa ? "rtl" : ""; }
    const b = document.querySelector("[data-ro-lang]");
    if (b) {
      b.innerHTML = `<span class="fp-k">p</span>${fa ? "English" : "فارسی"}`;
      b.lang = fa ? "en" : "fa";
      b.title = fa ? "Read this page in English (p)" : "این صفحه را به فارسی بخوانید (p)";
    }
    document.documentElement.classList.add("ro-lang-ready");
  }

  function set(l) {
    lang = l;
    try { localStorage.setItem(STORE, l); } catch (_) {}
    try {
      const u = new URL(location.href);
      if (u.searchParams.has("lang")) { u.searchParams.set("lang", l); history.replaceState(history.state, "", u); }
    } catch (_) {}
    apply();
    document.dispatchEvent(new CustomEvent("ro-lang", { detail: l }));
  }
  RO.set = set;
  RO.toggle = () => set(lang === "fa" ? "en" : "fa");

  // the button, beside the keys guide in the crumb; p presses it
  function button() {
    const row = document.querySelector(".fp-crumb__keys");
    if (!row || row.querySelector("[data-ro-lang]")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fp-crumb__help fp-crumb__lang";
    b.dataset.roLang = "";
    b.addEventListener("click", () => RO.toggle());
    const help = row.querySelector("[data-fp-help]");
    row.insertBefore(b, help || null);
  }

  const typing = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  document.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.code !== "KeyP" || typing(e.target)) return;
    const h = document.getElementById("fp-help");
    if (h && !h.hidden) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const b = document.querySelector("[data-ro-lang]");
    if (b) { b.classList.add("is-pressing"); setTimeout(() => b.classList.remove("is-pressing"), 110); }
    RO.toggle();
  }, true);

  // the keys guide lists it, and reads its own words through RO.tr
  window.FP = window.FP || { _q: [], add(x) { this._q.push(x); } };
  FP.tr = RO.tr;
  FP.add({ key: "p", label: "Persian · English", run: () => RO.toggle() });

  function start() { button(); apply(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
