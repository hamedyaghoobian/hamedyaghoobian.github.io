// Readings, Otherwise: what the three pieces share.
//
// Each piece is its own page (the artwork needs the viewport), dressed in the
// site's plate: /assets/main.css for the look, /assets/js/faceplate.js for the
// page's keys (0–7, [ ], esc, ?, \). This file adds the two things a piece
// needs on top of that:
//
//   the knob   the site's theme, light · dark · auto, stored where the site
//              stores it, so a piece and the site never disagree
//   the keys   the page's keys work until the frame has focus (a click, Tab,
//              or enter). Then the piece owns them: a yellow ring, the owner
//              label, and the key strip at the foot say so. The numbers are
//              always the piece's (its books, its whole view), never the
//              site's sections, which would be too easy to fall into: a
//              number pressed on the page gives the keys to the piece and
//              does what it does there. esc steps back: first whatever the piece
//              has open (layers, one layer alone, a line being read), then
//              it gives the keys back, then (the page's esc) it goes up.
//
// A key the piece owns that a button already does is done by pressing that
// button (data-ro-key="…" on it), so the key and the button are one thing.

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ── the knob ──
  const ORDER = ["light", "dark", "system"];
  const isDark = m => m === "dark" || (m === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const mode = () => { try { const s = localStorage.getItem("theme"); return ORDER.includes(s) ? s : "system"; } catch (_) { return "system"; } };
  function apply(m) {
    document.body.classList.toggle("dark", isDark(m));
    document.documentElement.setAttribute("data-theme", isDark(m) ? "dark" : "light");
    $$("[data-theme-set]").forEach(b => b.setAttribute("aria-pressed", b.dataset.themeSet === m));
    const knob = $(".fp-knob__dial");
    if (knob) knob.style.setProperty("--turn", ({ light: -68, dark: -90, system: -112 })[m] + "deg");
  }
  window.FPTheme = {
    set(m) { try { localStorage.setItem("theme", m); } catch (_) {} apply(m); },
    cycle() { const m = mode(); this.set(ORDER[(ORDER.indexOf(m) + 1) % 3]); },
    mode,
  };
  apply(mode());
  $$("[data-theme-set]").forEach(b => b.addEventListener("click", () => FPTheme.set(b.dataset.themeSet)));
  const dial = $(".fp-knob__dial");
  if (dial) dial.addEventListener("click", () => FPTheme.cycle());
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (mode() === "system") apply("system"); });

  // ── the keys ──
  const tr = s => (window.RO ? RO.tr(s) : s);
  const latin = e => (window.RO ? RO.latin(e) : e.key);
  const caps = keys => keys.split(" ").map(x => `<span class="fp-k">${x}</span>`).join("");
  const visible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

  // o: { frame, keys() → [[keys, what]…] while the piece owns them, help() → the same, longer,
  //      key(e) → true if the piece did something, escape() → true if it closed something }
  window.Piece = function (o) {
    const frame = o.frame;
    const strip = $("#ro-keys");
    const owner = $(".ro-owner", frame);
    let owns = false;

    const sib = r => { const a = $(`.fp-crumb a[rel="${r}"]`); return a ? a.textContent.replace(/^\s*[\[\]]/, "").trim() : null; };
    function pageKeys() {
      const k = [["0–9", tr("keys to the piece")]];
      const p = sib("prev"), n = sib("next");
      if (p) k.push(["[", p]);
      if (n) k.push(["]", n]);
      k.push(["esc", tr("up")], ["enter", tr("keys to the piece")], ["\\", tr("theme")], ["i", tr("keys")]);
      if (window.RO) k.push(["p", RO.fa() ? "English" : "فارسی"]);
      return k;
    }

    function render() {
      frame.classList.toggle("owns", owns);
      if (owner) owner.textContent = tr(owns ? "keys: piece · esc to give back" : "keys: page · enter to take them");
      if (!strip) return;
      const ks = owns ? o.keys() : pageKeys();
      strip.classList.toggle("is-piece", owns);
      strip.dir = window.RO && RO.fa() ? "rtl" : "";
      strip.innerHTML = `<span class="ro-keys__who">${tr(owns ? "the piece" : "the page")}</span>` +
        ks.map(([k, v]) => `<span>${caps(k)}${v}</span>`).join("");
    }

    // press: show the key going down, then do what it does
    function press(el) {
      el.classList.add("is-pressing");
      setTimeout(() => el.classList.remove("is-pressing"), 110);
      el.click();
    }
    const buttonFor = k => $$("[data-ro-key]").find(b => b.dataset.roKey.split(" ").includes(k) && !b.disabled && visible(b));

    function help() {
      const h = $("#fp-help");
      if (!h) return;
      const block = (t, ks) => `<p class="fp-help__group">${t}</p><dl>${ks.map(([k, v]) => `<dt>${caps(k)}</dt><dd>${v}</dd>`).join("")}</dl>`;
      $(".fp-help__body", h).innerHTML =
        block(tr("the piece · while it has the keys"), (o.help || o.keys)()) +
        block(tr("then"), [["esc", tr("step back: close what is open, then give the keys back")], ["\\", tr("turn the theme knob")], ["i", tr("these keys (? works too)")],
          ...(window.RO ? [["p", tr("Persian · English")]] : [])]) +
        block(tr("the page · once the keys are given back"), pageKeys());
      h.hidden = false;
    }

    frame.addEventListener("focusin", () => { if (!owns) { owns = true; render(); } });
    frame.addEventListener("focusout", e => { if (!frame.contains(e.relatedTarget)) { owns = false; render(); } });
    frame.addEventListener("pointerdown", e => { if (!e.target.closest("button, a, input")) frame.focus({ preventScroll: true }); });

    frame.addEventListener("keydown", e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      owns = true;                                // a key that reaches the frame: the piece has them
      const lk = latin(e);
      const k = (lk === "i" || e.key === "?" || e.key === "\u061F" || (e.code === "Slash" && e.shiftKey)) ? "?" : lk, t = e.target;   // the guide: i, or ? on any layout (the Persian ؟ too)
      const h = $("#fp-help");
      if (h && !h.hidden) { if (k === "Escape" || k === "?") { e.preventDefault(); h.hidden = true; } return; }
      if (k === "Tab") return;
      if (t !== frame && (k === "Enter" || k === " ") && t.closest("button, a")) return;   // a focused key does its own thing
      if (k === "?") { e.preventDefault(); e.stopPropagation(); help(); return; }   // or faceplate.js would close it again
      if (k === "\\") { e.preventDefault(); FPTheme.cycle(); return; }
      if (k === "Escape") {
        e.preventDefault();                       // faceplate.js leaves a handled esc alone
        if (!(o.escape && o.escape())) { owns = false; (document.activeElement || frame).blur(); }
        render();
        return;
      }
      const b = buttonFor(k);
      if (b) { e.preventDefault(); press(b); }
      else if (o.key && o.key(k === e.key ? e : { key: k, code: e.code, shiftKey: e.shiftKey, target: e.target, preventDefault: () => e.preventDefault() })) e.preventDefault();
      render();
    });

    // A number on the page is the piece's too: take the keys and do it. Capture, so
    // faceplate.js never sees it and never presses a section key.
    const typing = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    document.addEventListener("keydown", e => {
      if (owns || e.metaKey || e.ctrlKey || e.altKey || !/^[0-9]$/.test(latin(e))) return;
      if (typing(e.target) || frame.contains(e.target)) return;
      const h = $("#fp-help");
      if (h && !h.hidden) return;
      e.preventDefault(); e.stopImmediatePropagation();
      frame.focus({ preventScroll: true });
      owns = true;
      const k = latin(e), b = buttonFor(k);
      if (b) press(b); else if (o.key) o.key(k === e.key ? e : { key: k, code: e.code, shiftKey: e.shiftKey, target: e.target, preventDefault() {} });
      render();
    }, true);
    // On the page, enter gives the keys to the piece (Tab and a click do too).
    window.FP = window.FP || { _q: [], add(x) { this._q.push(x); } };
    FP.ownsDigits = true;
    FP.add({
      key: "Enter", label: "give the keys to the piece",
      when: () => !document.activeElement || document.activeElement === document.body,
      run: () => frame.focus(),
    });

    document.addEventListener("ro-lang", () => render());
    render();
    return { render, owns: () => owns };
  };
})();
