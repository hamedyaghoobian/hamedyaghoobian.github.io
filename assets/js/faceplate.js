// The faceplate's keys.
//
// Three levels, the same keys at each:
//   site      0–7 press a section key · \ turns the theme knob · i (or ?) lists the keys
//   section   j / k step through the list · enter opens · / finds · letters filter
//   page      j / k step through the parts · [ ] go to the page before / after
//   anywhere  esc goes up one level
//
// Every key presses something that is already on the page (a link, a
// button), so nothing here is the only way to do anything. Keys never fire
// while you type, and when a figure has focus its own keys come first; esc
// gives the keys back to the page.
//
// Pages add their own letters with FP.add({ key, label, run, group }).

(function () {
  const FP = window.FP = window.FP || {};
  const extra = (FP._q || []).slice();
  FP.add = k => { extra.push(k); };
  FP.partsSelector = null;          // a page can set its own j / k targets

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const visible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

  // the guide: i, one key with no shift (a letter nothing else uses); ? too, the web's usual help key,
  // on any layout: ? itself, the Persian ؟, or shift + the / key wherever the layout puts it
  const isHelpKey = e => e.key === 'i' || e.key === '?' || e.key === '\u061F' || (e.code === 'Slash' && e.shiftKey);
  const typing = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  // Something that keeps its own keys while it has focus: a figure's
  // canvas, a readings piece, anything marked data-fp-own-keys.
  const owner = el => el && el !== document.body && el.closest &&
    el.closest('[data-fp-own-keys], .project-figure__canvas, .project-figure [tabindex], .chart-figure [tabindex], figure [tabindex], .lm-parts li');

  // ── press: show the key going down, then do what it does ──
  function press(el) {
    if (!el) return false;
    el.classList.add('is-pressing');
    setTimeout(() => { el.classList.remove('is-pressing'); el.click(); }, 90);
    return true;
  }
  const rel = r => $(`a[rel="${r}"]`);

  // ── parts: what j / k step through ──
  function parts() {
    const sel = FP.partsSelector || '[data-fp-part]';
    let list = $$(sel).filter(visible);
    if (!list.length) list = $$('.fp-body > h2, .fp-part').filter(visible);
    return list;
  }
  let at = null;
  function setAt(el) {
    if (at) at.classList.remove('fp-at');
    at = el;
    if (!el) return;
    el.classList.add('fp-at');
    const r = el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight - 70) el.scrollIntoView({ block: el.matches('h2') ? 'start' : 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.dispatchEvent(new CustomEvent('fp-at', { detail: el }));
  }
  function step(d) {
    const list = parts();
    if (!list.length) return false;
    let i = list.indexOf(at);
    if (i < 0) {
      // start from what is on screen
      const first = list.findIndex(el => el.getBoundingClientRect().bottom > 80);
      i = d > 0 ? (first < 0 ? 0 : first) - 1 : (first < 0 ? list.length : first + 1) - 1;
      if (d < 0) i = Math.min(list.length, i + 1);
    }
    setAt(list[Math.max(0, Math.min(list.length - 1, i + d))]);
    return true;
  }
  function openAt() {
    if (!at) return false;
    if (at.matches('details')) { at.open = !at.open; return true; }
    if (at.matches('summary')) { at.parentElement.open = !at.parentElement.open; return true; }
    const link = at.matches('a[href]') ? at : at.querySelector('a[href]');
    if (link) { link.click(); return true; }
    const sum = at.querySelector('summary');
    if (sum) { sum.click(); return true; }
    return false;
  }

  // ── help ──
  const help = () => $('#fp-help');
  function helpRows() {
    const site = [
      ['0–7', 'press a section key'],
      ['\\', 'turn the theme knob: light · dark · auto'],
      ['i', 'these keys (? works too)'],
    ];
    const page = [];
    const n = parts().length;
    if (n) page.push(['j  k', `next / previous ${$('[data-fp-part]') || FP.partsSelector ? 'item' : 'part'} · ${n} here`], ['enter', 'open it']);
    if ($('[data-fp-find]')) page.push(['/', 'find on this page']);
    extra.filter(k => !k.when || k.when()).forEach(k => page.push([k.key, k.label]));
    const move = [];
    const p = rel('prev'), nx = rel('next'), up = rel('up');
    if (p) move.push(['[', `previous: ${p.title || p.textContent.replace(/^\s*\[/, '').trim()}`]);
    if (nx) move.push([']', `next: ${nx.title || nx.textContent.replace(/^\s*\]/, '').trim()}`]);
    if (up) move.push(['esc', `up to ${up.title || 'one level up'}`]);
    const block = (t, rows) => rows.length ? `<p class="fp-help__group">${t}</p><dl>${rows.map(([k, v]) => `<dt>${k.split(/\s+/).map(x => `<span class="fp-k">${x}</span>`).join('')}</dt><dd>${v}</dd>`).join('')}</dl>` : '';
    return block('this page', page) + block('moving', move) + block('the whole site', site);
  }
  let lastFocus = null;
  function openHelp() {
    const h = help(); if (!h) return;
    $('.fp-help__body', h).innerHTML = helpRows();
    lastFocus = document.activeElement;
    h.hidden = false;
    $('[data-fp-help-close]', h).focus();
  }
  function closeHelp() {
    const h = help(); if (!h || h.hidden) return false;
    h.hidden = true;
    // back to where the reader was; the page itself (body) cannot take focus, so let go of the
    // close button instead, or enter would land on a hidden button and not give the keys to a piece
    if (lastFocus && lastFocus !== document.body && lastFocus.isConnected && lastFocus.focus) lastFocus.focus();
    else if (h.contains(document.activeElement)) document.activeElement.blur();
    return true;
  }

  // ── lightbox ──
  let box;
  function lightbox(img) {
    if (!box) {
      box = document.createElement('div');
      box.className = 'fp-lightbox'; box.hidden = true;
      box.innerHTML = '<img alt=""><p><span class="fp-k">esc</span>close</p>';
      box.addEventListener('click', () => { box.hidden = true; });
      document.body.appendChild(box);
    }
    const i = $('img', box); i.src = img.currentSrc || img.src; i.alt = img.alt;
    box.hidden = false;
  }

  // ── the keys ──
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = isHelpKey(e) ? '?' : e.key, t = e.target;
    if (typing(t)) { if (k === 'Escape') t.blur(); return; }
    if (help() && !help().hidden) { if (k === 'Escape' || k === '?') { e.preventDefault(); closeHelp(); } return; }
    if (box && !box.hidden) { if (k === 'Escape') box.hidden = true; return; }
    if (owner(t)) {
      if (k === 'Escape' && !e.defaultPrevented) { t.blur(); }
      return;
    }
    if (e.defaultPrevented) return;

    if (/^[0-7]$/.test(k)) { if (press($(`.fp-strip a[data-key="${k}"]`))) e.preventDefault(); return; }
    if (k === '?') { e.preventDefault(); openHelp(); return; }
    if (k === '\\') { e.preventDefault(); window.FPTheme && FPTheme.cycle(); return; }
    if (k === '[') { if (rel('prev')) { e.preventDefault(); rel('prev').click(); } return; }
    if (k === ']') { if (rel('next')) { e.preventDefault(); rel('next').click(); } return; }
    if (k === 'Escape') {
      if (at) { setAt(null); return; }
      if (rel('up')) rel('up').click();
      return;
    }
    if (k === '/') { const f = $('[data-fp-find] input'); if (f) { e.preventDefault(); f.focus(); f.select(); } return; }
    if (k === 'j' || k === 'k') { if (step(k === 'j' ? 1 : -1)) e.preventDefault(); return; }
    if (k === 'Enter' && at && (t === document.body || t === at || t.id === 'content')) { if (openAt()) e.preventDefault(); return; }
    const x = extra.find(c => c.key === k && (!c.when || c.when()));
    if (x) { e.preventDefault(); x.run(e); }
  });

  document.addEventListener('click', e => {
    if (e.target.closest('[data-fp-help]')) { e.preventDefault(); openHelp(); return; }
    if (e.target.closest('[data-fp-help-close]') || e.target === help()) { closeHelp(); return; }
    const img = e.target.closest('figure img, .fp-body img');
    if (img && !img.closest('a') && !img.closest('[data-no-zoom]')) lightbox(img);
  });

  FP.setAt = setAt;
  FP.step = step;
})();
