---
layout: page
title: Collected Poems
permalink: /poems/
wide: true
fa_serif: true
---
{%- comment -%}
  Collected Poems, section 07. One instrument in two parts:

  · the figure (assets/js/poems-form-figure.js): every poem a column at its
    poet's time, every line a dot at its length in letters, on a broken
    axis running right to left; a second view plots each poem's variation.
  · the list: the poems by the Persian year they were copied in (۱۴۰۵,
    ۱۴۰۴ …), each row dated in both calendars (Intl, Solar Hijri and
    Gregorian), opening in place to the verses, the AI translation and the
    reading.

  The two follow each other: hover or step a column and its row lights;
  step a row (j / k) or a verse line (← →) and its column and dot light.
  The newest poem wears the live dot. Data: /poems.json (not edited here).
  Styles: _sass/faceplate/pages/_poems.scss.
{%- endcomment -%}
<div class="pm" id="pm">
  <div class="pm-intro">
    <p class="pm-intro__k pm-intro__en" aria-hidden="true">en</p>
    <p class="pm-intro__k pm-intro__fa" aria-hidden="true">fa</p>
    <p class="pm-intro__t pm-intro__en">copied out by hand</p>
    <p class="pm-intro__t pm-intro__fa" lang="fa" dir="rtl">رونویسی شعر فارسی</p>
    <p class="pm-intro__d pm-intro__en">Persian poems I love, a few lines at a time.</p>
    <p class="pm-intro__d pm-intro__fa" lang="fa" dir="rtl">برای از رو نوشتن از شعرهایی که دوست‌شان دارم.</p>
  </div>
  <figure class="pm-fig" id="poems-figure" aria-labelledby="pm-fig-t">
    <div class="pm-fig__bar">
      <p class="fp-label pm-fig__t" id="pm-fig-t">fig. 1 · form across a thousand years</p>
      <div class="pm-fig__legend fp-label" aria-hidden="true"><span class="pm-sw pm-sw--cl"></span>classical <span class="pm-sw"></span>modern <span class="fp-live"></span>newest <span class="pm-sw pm-sw--band"></span>classical band · <span lang="fa" dir="rtl">مصراع‌های کلاسیک</span> · <span data-pf-band></span> letters</div>
      <div class="fp-seg pm-fig__view" role="group" aria-label="What the figure measures">
        <button type="button" data-pf-view="len" aria-pressed="true">letters per line</button>
        <button type="button" data-pf-view="cv" aria-pressed="false">variation <span class="fp-seg__k">v</span></button>
      </div>
    </div>
    <div class="pm-fig__canvas" data-pf-canvas data-fp-own-keys tabindex="0" aria-label="Figure: the poems by line length and poet's time. Arrow keys step through the poems, enter opens one, v switches the measure, esc leaves." aria-describedby="pm-fig-read"></div>
    <dl class="pm-fig__read" id="pm-fig-read" data-pf-readout aria-live="polite"></dl>
    <figcaption class="pm-fig__note">
      <p>Distant reading in miniature: each poem is a column at its poet's time, each line a dot at its length in letters. The classical lines keep to a narrow band; after Nima's «Qoqnus» (1937) the lines come loose. Measured on the excerpts copied here.</p>
      <p class="pm-fig__sum" lang="fa" dir="rtl" data-pf-summary></p>
      <p class="fp-label pm-keyhint"><span class="fp-k">f</span>or tab into the figure · <span class="fp-k">←</span><span class="fp-k">→</span>step · <span class="fp-k">enter</span>open the poem · <span class="fp-k">esc</span>back to the page</p>
    </figcaption>
  </figure>
  <div class="fp-toolbar pm-tools">
    <div class="fp-seg pm-filter" role="group" aria-label="Which poems">
      <button type="button" data-pm-filter="all" aria-pressed="true"><span class="fp-seg__k">a</span>all <span class="fp-seg__c" data-pm-count="all"></span></button>
      <button type="button" data-pm-filter="classical" aria-pressed="false"><span class="fp-seg__k">c</span>classical <span class="fp-seg__c" data-pm-count="classical"></span></button>
      <button type="button" data-pm-filter="modern" aria-pressed="false"><span class="fp-seg__k">m</span>modern <span class="fp-seg__c" data-pm-count="modern"></span></button>
    </div>
    <label class="fp-find" data-fp-find><span class="fp-k">/</span><input type="search" id="pm-q" placeholder="poet or year" aria-label="Find a poet or a year" autocomplete="off"></label>
  </div>
  <p class="fp-label pm-keyhint pm-keyhint--list"><span class="fp-k">j</span><span class="fp-k">k</span>poem (an open poem hands on to the next) · <span class="fp-k">←</span><span class="fp-k">→</span>line · <span class="fp-k">t</span>translate · <span class="fp-k">r</span>reading en / fa · <span class="fp-k">y</span>next year · <span class="fp-k">e</span>open all · <span class="fp-k">?</span>every key</p>
  <p class="pm-ai">AI translations are provided for convenience but may not capture the full poetic nuance and cultural depth of the original verses.</p>
  <div id="poems-container" class="pm-list">
    <p class="pm-status" id="loading-poems" role="status"><span lang="fa" dir="rtl">در حال بارگذاری اشعار...</span> <span class="fp-label">Loading poems...</span></p>
  </div>
  <p class="pm-empty fp-label" id="pm-empty" role="status" hidden>no poem matches. <button type="button" class="pm-btn" data-pm-clear>show all</button></p>
  <figure class="poems-coda">
    <p class="poems-coda__k">and last</p>
    <blockquote>
      <p><span>I&rsquo;ve built my homeland,</span><small title="letters">18</small></p>
      <p><span>I&rsquo;ve even founded my state</span><small title="letters">21</small></p>
      <p><span>in my language.</span><small title="letters">12</small></p>
    </blockquote>
    <figcaption lang="fa" dir="rtl">محمود درویش <span lang="en" dir="ltr">mahmoud darwish</span></figcaption>
  </figure>
</div>
<script src="{{ '/assets/js/poems-form-figure.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
<script>
  window.PM_SRC = '{{ "/poems.json" | relative_url }}';
</script>
{% raw %}
<script>
(function () {
  // ── Calendars ──────────────────────────────────────────────────────
  // A poem's date ("2026-06-26") is a calendar day, not an instant. Read it
  // as one: new Date("2026-06-26") would be midnight UTC, which is still the
  // day before for any visitor west of London.
  function parseDay(s) {
    var p = String(s).split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function fmt(locale, o, d) { try { return new Intl.DateTimeFormat(locale, o).format(d); } catch (e) { return ''; } }
  function part(locale, o, d, type) {
    try { var x = new Intl.DateTimeFormat(locale, o).formatToParts(d).find(function (q) { return q.type === type; }); return x ? x.value : ''; } catch (e) { return ''; }
  }
  var FA = 'fa-IR-u-ca-persian';
  var digitsLatin = function (s) { return String(s).replace(/[۰-۹]/g, function (c) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(c); }).replace(/[٠-٩]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(c); }); };
  function dates(iso) {
    var d = parseDay(iso);
    var faYear = part(FA, { year: 'numeric' }, d, 'year');          // ۱۴۰۵, in Persian digits
    var y = +digitsLatin(faYear);
    return {
      d: d,
      faYear: faYear,
      faYearN: y,
      faSpan: y ? (y + 621) + '–' + String(y + 622).slice(2) : '',  // a Persian year runs Nowruz to Nowruz
      faDay: fmt(FA, { day: 'numeric', month: 'long' }, d),          // ۳ آبان
      faFull: fmt(FA, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, d).replace(/,/g, '،'),
      enDay: fmt('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }, d).toLowerCase(),
      enFull: fmt('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, d).toLowerCase().replace(',', '')
    };
  }

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ── Translation: static data from the build, cached in localStorage for
  // offline resilience. Same cache keys as before the redesign. ────────
  var TRANSLATION_CACHE_PREFIX = 'poem_translation_v1_';
  function getCachedTranslation(id) { try { var r = localStorage.getItem(TRANSLATION_CACHE_PREFIX + id); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function setCachedTranslation(id, data) { try { localStorage.setItem(TRANSLATION_CACHE_PREFIX + id, JSON.stringify(data)); } catch (e) { /* full or blocked */ } }
  // A poem's identifier: its poet and first verse, hashed as the old page did.
  function poemId(p) {
    var box = document.createElement('div');
    box.innerHTML = (p.verses || [])[0] || '';
    var content = (String(p.poet || '') + box.textContent).replace(/\s+/g, '');
    return btoa(unescape(encodeURIComponent(content))).slice(0, 16);
  }

  // ── State ──────────────────────────────────────────────────────────
  var P = [], M = [], D = [], rows = [], fig = null;
  var cur = -1, line = -1, newest = 0;
  var filt = 'all', q = '';
  var follow = false;            // the next fp-at hands an open poem on

  function slug(p, i) {
    var en = (String(p.poet).split(' / ')[1] || 'poem').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
    return 'poem-' + p.date + '-' + en;
  }

  function measure(p) {
    if (window.PoemsFigure) return PoemsFigure.measure(p);
    var parts = String(p.poet || '').split(' / ');
    return { faName: parts[0], enName: parts[1] || parts[0], perVerse: [], lens: [], classical: false };
  }

  // ── The list ───────────────────────────────────────────────────────
  function rowHTML(p, i) {
    var m = M[i], d = D[i];
    var n = (p.verses || []).length;
    var lenBit = m.lens.length ? (m.min !== m.max ? m.min + '–' + m.max : m.max) + ' letters' : '';
    var isEn = (p.verses || []).some(function (v) { return v.indexOf('english-line') >= 0; });
    var verses = (p.verses || []).map(function (v, j) {
      return '<p class="pm-verse" data-j="' + j + '">' +
        '<span class="pm-verse__t">' + v + '</span>' +
        (m.perVerse[j] ? '<span class="pm-verse__n" aria-hidden="true" title="letters in this line">' + m.perVerse[j] + '</span>' : '') +
        '</p>';
    }).join('');
    var th = p.theme || {};
    var cl = th.cluster || {};
    var reading = th.interpretation || th.interpretationFa ? (
      '<div class="pm-reading">' +
        '<div class="pm-acts">' +
          '<span class="fp-seg pm-seg" role="group" aria-label="Reading">' +
            '<button type="button" data-act="en" aria-pressed="true">reading · en</button>' +
            '<button type="button" data-act="fa" aria-pressed="false"><span lang="fa">خوانش</span> · fa</button>' +
          '</span>' +
          (cl.labelEn ? '<span class="fp-label pm-cluster">' + esc(cl.labelEn.toLowerCase()) + ' · <span lang="fa" dir="rtl">' + esc(cl.label || '') + '</span></span>' : '') +
        '</div>' +
        (th.interpretation ? '<p class="pm-reading__en" data-r="en">' + esc(th.interpretation) + '</p>' : '') +
        (th.interpretationFa ? '<p class="pm-reading__fa" data-r="fa" lang="fa" dir="rtl" hidden>' + esc(th.interpretationFa) + '</p>' : '') +
      '</div>') : '';
    // Eliot's poem carries its own Persian under each line: no translate key.
    var translate = p.hideTranslation ? '' : (
      '<div class="pm-acts"><button type="button" class="pm-btn translate-btn" data-act="tr" aria-expanded="false"><span class="fp-k">t</span>translate</button></div>' +
      '<div class="translation-container" hidden>' +
        '<p class="translation-text"></p>' +
        '<p class="translation-meta fp-label"><span class="translation-model"></span> · <span class="translation-time"></span></p>' +
      '</div>');
    var id = slug(p, i);
    return '<li class="pm-item" data-i="' + i + '">' +
      '<details class="fp-row pm-row" id="' + id + '" data-fp-part data-i="' + i + '"' + '>' +
        '<summary class="fp-row__head pm-row__head">' +
          '<span class="pm-row__d"><span lang="fa" dir="rtl">' + esc(d.faDay) + '</span><span class="pm-row__g">' + esc(d.enDay) + '</span></span>' +
          '<span class="fp-row__t pm-row__t">' + esc(m.enName) + ' <span lang="fa" dir="rtl">' + esc(m.faName) + '</span></span>' +
          '<span class="fp-row__m pm-row__m">' + (i === newest ? '<span class="fp-live" title="newest poem"></span>' : '') +
            n + (n === 1 ? ' line' : ' lines') + (lenBit ? ' · ' + lenBit : '') + (m.classical ? ' · <span class="fp-tag">classical</span>' : '') + '</span>' +
          '<span class="fp-row__x" aria-hidden="true">+</span>' +
        '</summary>' +
        '<div class="fp-row__body pm-poem">' +
          '<p class="fp-label pm-poem__date"><span lang="fa" dir="rtl">' + esc(d.faFull) + '</span> · ' + esc(d.enFull) +
            ' · <a href="#' + id + '" class="pm-poem__link">link</a></p>' +
          '<div class="pm-verses' + (isEn ? ' pm-verses--ltr' : '') + '" dir="' + (isEn ? 'ltr' : 'rtl') + '" lang="' + (isEn ? 'en' : 'fa') + '">' + verses + '</div>' +
          '<p class="pm-poet" lang="fa" dir="rtl">' + esc(m.faName) + '</p>' +
          translate +
          reading +
        '</div>' +
      '</details></li>';
  }

  function render() {
    var box = document.getElementById('poems-container');
    var html = '', g = null, open = false;
    P.forEach(function (p, i) {
      var y = D[i].faYear;
      if (y !== g) {
        if (open) html += '</ol></section>';
        var count = D.filter(function (x) { return x.faYear === y; }).length;
        html += '<section class="pm-year" data-year="' + D[i].faYearN + '" id="y' + D[i].faYearN + '" aria-labelledby="y' + D[i].faYearN + '-h">' +
          '<header class="pm-year__head">' +
            '<h2 class="pm-year__h" id="y' + D[i].faYearN + '-h"><span lang="fa">' + esc(y) + '</span><span class="sr-only"> (' + D[i].faSpan + ')</span></h2>' +
            '<span class="fp-label pm-year__m" aria-hidden="true">' + D[i].faSpan + '</span>' +
            '<span class="fp-label pm-year__c"><span data-pm-ycount>' + count + '</span> ' + (count === 1 ? 'poem' : 'poems') + '</span>' +
          '</header><ol class="fp-index pm-index">';
        g = y; open = true;
      }
      html += rowHTML(p, i);
    });
    if (open) html += '</ol></section>';
    box.innerHTML = html;
    rows = P.map(function (p, i) { return box.querySelector('details[data-i="' + i + '"]'); });
    wire();
  }

  // ── Acting on one poem ─────────────────────────────────────────────
  function translatePoem(i) {
    var row = rows[i], p = P[i];
    if (!row || p.hideTranslation) return;
    var btn = $('[data-act="tr"]', row);
    var box = $('.translation-container', row);
    var text = $('.translation-text', row), model = $('.translation-model', row), time = $('.translation-time', row);
    // Toggle: collapse if already open
    if (!box.hidden) { box.hidden = true; btn.setAttribute('aria-expanded', 'false'); return; }
    var show = function () { box.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    var id = poemId(p);
    // 1. the localStorage cache first
    var cached = getCachedTranslation(id);
    if (cached) {
      text.textContent = cached.translation;
      model.textContent = cached.source || 'Translation';
      time.textContent = cached.date || '';
      show(); return;
    }
    // 2. the static translation baked in at build time
    try {
      if (p.translation) {
        var dateLabel = p.date ? parseDay(p.date).toLocaleDateString('fa-IR') : '';
        text.textContent = p.translation;
        model.textContent = 'Translation';
        time.textContent = dateLabel;
        show();
        setCachedTranslation(id, { translation: p.translation, source: 'Translation', date: dateLabel });
      } else {
        text.textContent = 'ترجمه یافت نشد / Translation not found.';
        text.classList.add('is-missing');
        model.textContent = ''; time.textContent = '';
        show();
      }
    } catch (err) {
      console.error(err);
      text.textContent = 'خطا در بارگزاری ترجمه / Error loading translation';
      text.classList.add('is-missing');
      show();
    }
  }

  function setReading(i, which) {
    var row = rows[i]; if (!row) return;
    var r = $('.pm-reading', row); if (!r) return;
    if (which === 'cycle') which = $('[data-act="en"]', r).getAttribute('aria-pressed') === 'true' ? 'fa' : 'en';
    $$('[data-act="en"],[data-act="fa"]', r).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.act === which)); });
    $$('[data-r]', r).forEach(function (p) { p.hidden = p.dataset.r !== which; });
  }

  function setLine(j, scroll) {
    line = j;
    if (cur < 0) return;
    $$('.pm-verse.is-at').forEach(function (v) { v.classList.remove('is-at'); });
    var v = j >= 0 && rows[cur] ? $('.pm-verse[data-j="' + j + '"]', rows[cur]) : null;
    if (v) {
      v.classList.add('is-at');
      if (scroll) {
        var r = v.getBoundingClientRect();
        if (r.top < 70 || r.bottom > innerHeight - 70) v.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }
    fig && fig.pick(cur, j);
  }

  function stepLine(key) {
    if (cur < 0 || !rows[cur]) return;
    var row = rows[cur];
    if (!row.open) row.open = true;
    var ltr = !!$('.pm-verses--ltr', row);
    // forward is the way the poem reads: ← in Persian and Arabic, → in English
    var d = (key === 'ArrowLeft') === !ltr ? 1 : -1;
    var n = (P[cur].verses || []).length;
    var j = line < 0 ? (d > 0 ? 0 : n - 1) : Math.max(0, Math.min(n - 1, line + d));
    setLine(j, true);
  }

  // Make poem i the current one (figure, row light, line reset).
  function setCur(i) {
    if (cur !== i) { line = -1; $$('.pm-verse.is-at').forEach(function (v) { v.classList.remove('is-at'); }); }
    cur = i;
    rows.forEach(function (r, k) { r.classList.toggle('is-cur', k === i); });
    fig && fig.pick(i, line);
  }

  // Go to a row as j / k would: an open poem hands on to the next.
  function go(row) {
    if (!row || !window.FP || !FP.setAt) return;
    follow = true;
    FP.setAt(row);
    follow = false;
  }

  document.addEventListener('fp-at', function (e) {
    var row = e.detail;
    if (!row || !row.matches || !row.matches('.pm-row')) return;
    var i = +row.dataset.i;
    var was = rows[cur];
    if (follow && was && was !== row && was.open) { was.open = false; row.open = true; }
    setCur(i);
  });
  // j / k come from faceplate.js; note them on the way down so the fp-at
  // they cause hands the open poem on.
  window.addEventListener('keydown', function (e) {
    if ((e.key === 'j' || e.key === 'k') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      follow = true; setTimeout(function () { follow = false; }, 0);
    }
  }, true);

  // ← → for verse lines: not in faceplate.js's letters, so listened for
  // here, with the same manners: never while typing, never over the help,
  // never while the figure (or anything that keeps its own keys) has focus.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.defaultPrevented) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (t && t.closest && t.closest('[data-fp-own-keys], figure [tabindex]')) return;
    var help = document.getElementById('fp-help');
    if (help && !help.hidden) return;
    if (cur < 0 || !rows[cur] || rows[cur].closest('.pm-item').hidden) return;
    e.preventDefault();
    stepLine(e.key);
  });

  // ── Filter and find ────────────────────────────────────────────────
  var norm = function (s) { return digitsLatin(String(s || '').toLowerCase()).replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/‌/g, ''); };
  function hay(i) {
    var p = P[i], m = M[i], d = D[i], cl = (p.theme && p.theme.cluster) || {};
    return norm([m.enName, m.faName, d.faYear, d.faYearN, d.faSpan, d.enDay, d.faDay, cl.labelEn, cl.label].join(' '));
  }
  function visible(i) {
    if (filt === 'classical' && !M[i].classical) return false;
    if (filt === 'modern' && M[i].classical) return false;
    return !q || hay(i).indexOf(q) >= 0;
  }
  function apply() {
    var shown = [];
    P.forEach(function (p, i) {
      var v = visible(i);
      rows[i].closest('.pm-item').hidden = !v;
      if (v) shown.push(i);
    });
    $$('.pm-year').forEach(function (s) {
      var n = $$('.pm-item', s).filter(function (li) { return !li.hidden; }).length;
      s.hidden = !n;
      $('[data-pm-ycount]', s).textContent = n;
    });
    $$('[data-pm-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.pmFilter === filt)); });
    document.getElementById('pm-empty').hidden = shown.length > 0;
    fig && fig.filter(shown);
  }
  function setFilter(f) { filt = f; apply(); }

  // ── Wiring ─────────────────────────────────────────────────────────
  function wire() {
    rows.forEach(function (row, i) {
      var head = $('summary', row);
      head.addEventListener('click', function () {
        // a click on the head: this is now the poem you're on
        // (only through j / k's marker when the row is fully in view, so a
        // click never scrolls the row out from under the pointer)
        var r = row.getBoundingClientRect();
        var inView = r.top >= 70 && r.top < innerHeight - 70;
        if (!row.classList.contains('fp-at') && inView && window.FP && FP.setAt) FP.setAt(row); else setCur(i);
      });
      head.addEventListener('mouseenter', function () { fig && fig.hover(i); });
      head.addEventListener('mouseleave', function () { fig && fig.hover(-1); });
      $$('.pm-verse', row).forEach(function (v) {
        v.addEventListener('mouseenter', function () { fig && fig.hover(i, +v.dataset.j); });
        v.addEventListener('mouseleave', function () { fig && fig.hover(-1); });
      });
      row.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return;
        if (cur !== i) setCur(i);
        if (b.dataset.act === 'tr') translatePoem(i);
        else setReading(i, b.dataset.act);
      });
    });
    var counts = { all: P.length, classical: M.filter(function (m) { return m.classical; }).length };
    counts.modern = counts.all - counts.classical;
    $$('[data-pm-count]').forEach(function (c) { c.textContent = counts[c.dataset.pmCount]; });
  }
  $$('[data-pm-filter]').forEach(function (b) { b.addEventListener('click', function () { setFilter(b.dataset.pmFilter); }); });
  var qi = document.getElementById('pm-q');
  qi.addEventListener('input', function () { q = norm(qi.value.trim()); apply(); });
  document.querySelector('[data-pm-clear]').addEventListener('click', function () { qi.value = ''; q = ''; setFilter('all'); });

  // ── Page letters (listed under ? automatically) ────────────────────
  var curRow = function () { return cur >= 0 && rows[cur] && !rows[cur].closest('.pm-item').hidden ? rows[cur] : null; };
  var shownRows = function () { return rows.filter(function (r) { return !r.closest('.pm-item').hidden; }); };
  function yearStep(d) {
    var secs = $$('.pm-year').filter(function (s) { return !s.hidden; });
    var here = curRow() ? curRow().closest('.pm-year') : null;
    var k = secs.indexOf(here);
    var to = secs[k < 0 ? (d > 0 ? 0 : secs.length - 1) : k + d];
    if (to) go($$('.pm-item', to).filter(function (li) { return !li.hidden; })[0].querySelector('details'));
  }
  if (window.FP) {
    FP.add({ key: '← →', label: 'step the lines of the open poem, the way it reads (← in Persian)', run: function () {}, when: function () { return !!curRow(); } });
    FP.add({ key: 't', label: 'translate this poem / hide the translation', run: function () { var r = curRow(); if (!r) return; r.open = true; translatePoem(cur); }, when: function () { return !!curRow() && !P[cur].hideTranslation; } });
    FP.add({ key: 'r', label: 'reading: english / persian', run: function () { var r = curRow(); if (!r) return; r.open = true; setReading(cur, 'cycle'); }, when: function () { return !!curRow() && !!$('.pm-reading', curRow()); } });
    FP.add({ key: 'y', label: 'next persian year (۱۴۰۵ → ۱۴۰۴)', run: function () { yearStep(1); } });
    FP.add({ key: 'Y', label: 'previous persian year', run: function () { yearStep(-1); } });
    FP.add({ key: 'g', label: 'the newest poem', run: function () { go(shownRows()[0]); } });
    FP.add({ key: 'G', label: 'the oldest poem', run: function () { var s = shownRows(); go(s[s.length - 1]); } });
    FP.add({ key: 'e', label: 'open every poem / close them all', run: function () {
      var s = shownRows(), anyClosed = s.some(function (r) { return !r.open; });
      s.forEach(function (r) { r.open = anyClosed; });
    } });
    FP.add({ key: 'v', label: 'figure: letters per line / variation', run: function () { fig && fig.toggleView(); } });
    FP.add({ key: 'f', label: 'into the figure (← → step, enter opens, esc leaves)', run: function () { fig && fig.focus(); } });
    FP.add({ key: 'a', label: 'all poems', run: function () { setFilter('all'); } });
    FP.add({ key: 'c', label: 'classical poems only', run: function () { setFilter('classical'); } });
    FP.add({ key: 'm', label: 'modern poems only', run: function () { setFilter('modern'); } });
  }

  // ── Load ───────────────────────────────────────────────────────────
  function fail(error) {
    var box = document.getElementById('poems-container');
    box.innerHTML = '<p class="pm-status"><span lang="fa" dir="rtl">خطا در بارگذاری اشعار: ' + esc(error.message) + '</span><br><span class="fp-label">Error loading poems: ' + esc(error.message) + '</span></p>';
  }
  function start(poems) {
    // newest first; the order the list reads in
    P = poems.map(function (p, k) { return [p, k]; })
      .sort(function (a, b) { return a[0].date < b[0].date ? 1 : a[0].date > b[0].date ? -1 : a[1] - b[1]; })
      .map(function (x) { return x[0]; });
    M = P.map(measure);
    D = P.map(function (p) { return dates(p.date); });
    newest = 0;
    render();
    if (window.PoemsFigure) {
      fig = PoemsFigure.mount(document.getElementById('poems-figure'), P, {
        newest: newest,
        onHover: function (i) { rows.forEach(function (r, k) { r.classList.toggle('is-lit', k === i); }); },
        onPick: function (i) { setCur(i); },
        onStep: function (d) {
          var s = shownRows(), k = s.indexOf(rows[cur]);
          var to = s[Math.max(0, Math.min(s.length - 1, (k < 0 ? 0 : k + d)))];
          if (to) setCur(+to.dataset.i);
        },
        onOpen: function (i) { var r = rows[i]; if (!r) return; r.open = true; if (window.FP && FP.setAt) FP.setAt(r); else setCur(i); }
      });
    }
    apply();
    // A link to one poem opens it; otherwise the newest is open.
    var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var row = target && target.matches('.pm-row') ? target : rows[newest];
    row.open = true;
    setCur(+row.dataset.i);
    if (target === row) {
      // instant, and again once the type and the page have settled, so the
      // browser's own scroll restoration doesn't carry us back to the top
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      var land = function () { row.scrollIntoView({ block: 'start', behavior: 'instant' }); };
      land();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(land);
      if (document.readyState !== 'complete') window.addEventListener('load', land, { once: true });
    }
  }
  function load() {
    fetch(window.PM_SRC || '/poems.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(start)
      .catch(function (e) { console.error('Error loading poems:', e); fail(e); });
  }
  // the figure's script is deferred: it has run by DOMContentLoaded
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
  window.addEventListener('hashchange', function () {
    var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (t && t.matches('.pm-row')) { t.open = true; if (window.FP && FP.setAt) FP.setAt(t); }
  });
})();
</script>
{% endraw %}
