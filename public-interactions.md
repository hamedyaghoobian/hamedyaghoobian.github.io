---
layout: page
title: Publications
permalink: /publications/
wide: true
---
{%- comment -%}
  Built from two files:
    _data/scholar.json      Google Scholar's data, refreshed weekly by
                            .github/workflows/scholar.yml (never edit by hand)
    _data/publications.yml  yours: each paper's section, students, links, hidden
  A Scholar paper without an entry in publications.yml lands in "New, to sort".

  The page: a readout (the numbers, and citations per year as bars; the
  current year is drawn open, because it isn't over), then the papers by
  section, each with its citations as a short bar against the most-cited
  one. Everything is drawn here in Liquid and CSS; the script at the end only
  adds the keys: s m c filter by section, x shows all, / finds, j / k step,
  enter opens the paper. Without the script the whole list still shows.
{%- endcomment -%}
{%- assign s = site.data.scholar -%}
{%- assign notes = site.data.publications -%}
{%- assign people = site.data.students -%}
{%- assign pubs = s.publications | sort: "year", "first" | reverse -%}
{%- assign keys = "student|mine|collaboration|unsorted" | split: "|" -%}
{%- assign titles = "Student research|Sole-authored|Collaborations|New, to sort" | split: "|" -%}
{%- assign letters = "s|m|c|u" | split: "|" -%}
{%- assign most = s.publications | map: "cites" | sort | last -%}
{%- assign this_year = s.updated | slice: 0, 4 -%}
{%- assign newest = "" -%}
{%- for p in pubs -%}
  {%- assign note = notes | where: "id", p.id | first -%}
  {%- unless note.hidden -%}{%- assign newest = p.id -%}{%- break -%}{%- endunless -%}
{%- endfor -%}
{%- assign peak = 1 -%}
{%- for y in s.cites_per_year -%}{%- if y[1] > peak -%}{%- assign peak = y[1] -%}{%- endif -%}{%- endfor -%}

{%- comment -%} The sections, drawn first so the filter keys can carry their counts. {%- endcomment -%}
{%- assign counts = "" -%}
{%- assign shown = 0 -%}
{%- capture sections -%}
{%- for key in keys -%}
{%- assign title = titles[forloop.index0] -%}
{%- assign n = 0 -%}
{%- capture items -%}
{%- for p in pubs -%}
  {%- assign note = notes | where: "id", p.id | first -%}
  {%- if note.hidden -%}{%- continue -%}{%- endif -%}
  {%- assign cat = note.category | default: "unsorted" -%}
  {%- if cat != key -%}{%- continue -%}{%- endif -%}
  {%- assign n = n | plus: 1 -%}
  {%- assign link = note.pdf | default: p.url -%}
  {%- assign byline = note.authors | default: p.authors -%}
  {%- if byline.first %}{% assign byline = byline | join: ", " %}{% endif -%}
  {%- assign w = p.cites | times: 100 | divided_by: most -%}
<li class="pub{% if p.id == newest %} is-newest{% endif %}" data-fp-part data-cat="{{ key }}">
<span class="pub-year">{% if p.id == newest %}<span class="fp-live" title="newest"></span><span class="sr-only">newest: </span>{% endif %}{{ p.year | default: "n.d." }}</span>
<div class="pub-body">
{% if link and link != "" %}<a class="pub-title" href="{{ link }}">{{ p.title }}</a>{% else %}<span class="pub-title">{{ p.title }}</span>{% endif %}
{% if note.type or p.citation != "" %}<span class="pub-venue">{% if note.type %}<span class="fp-tag">{{ note.type }}</span> {% endif %}{{ p.citation }}</span>{% endif %}
<span class="pub-authors">{{ byline | replace: "Hamed Yaghoobian", "<strong>Hamed Yaghoobian</strong>" }}</span>
{%- if note.students or note.project %}
<span class="pub-more">
{%- if note.students %}<span class="pub-students">with student researcher{% if note.students.size > 1 %}s{% endif %}
{%- for name in note.students -%}
{%- assign who = people | where: "name", name | first %} <span class="fp-tag">{{ name }}{% if who.year %} {{ who.year }}{% endif %}</span>
{%- endfor -%}
</span>{% endif -%}
{%- if note.project %}<a class="pub-project" href="{{ note.project | relative_url }}">project page →</a>{% endif -%}
</span>
{%- endif %}
</div>
<span class="pub-cites"><span class="pub-cites__bar" aria-hidden="true"><i style="width:{{ w }}%"></i></span><span class="pub-cites__n">{{ p.cites }}</span> citation{% if p.cites != 1 %}s{% endif %}</span>
</li>
{%- endfor -%}
{%- endcapture -%}
{%- assign counts = counts | append: n | append: "|" -%}
{%- assign shown = shown | plus: n -%}
{%- if n > 0 %}
<section class="pubs-section" id="{{ key }}" data-cat="{{ key }}" aria-labelledby="pubs-{{ key }}">
<h2 id="pubs-{{ key }}"><span>{{ title }}</span><span class="pubs-section__n">{{ n }}</span></h2>
<ol class="pub-list">{{ items }}</ol>
</section>
{%- endif -%}
{%- endfor -%}
{%- endcapture -%}
{%- assign counts = counts | split: "|" -%}

<div class="pubs">

<section class="pubs-readout" aria-label="Citations, from Google Scholar">
<dl class="pubs-nums">
<div><dt>citations</dt><dd>{{ s.citedby }}</dd></div>
<div><dt>h-index</dt><dd>{{ s.hindex }}</dd></div>
<div><dt>i10-index</dt><dd>{{ s.i10index }}</dd></div>
</dl>
<figure class="pubs-chart">
<ol class="pubs-chart__bars">
{%- for y in s.cites_per_year -%}
{%- assign h = y[1] | times: 100 | divided_by: peak %}
<li{% if y[0] == this_year %} class="is-now"{% endif %}><span class="pubs-chart__y">{{ y[0] }}{% if y[0] == this_year %}<span class="sr-only"> (so far)</span>{% endif %}</span><span class="pubs-chart__v">{{ y[1] }}<span class="sr-only"> citations</span></span><span class="pubs-chart__b" style="--h:{{ h }}" aria-hidden="true"></span></li>
{%- endfor %}
</ol>
<figcaption class="fp-label">Citations per year{% if s.updated %}; {{ this_year }} so far{% endif %}.</figcaption>
</figure>
<p class="pubs-source fp-label">Data from <a href="{{ s.profile }}">Google Scholar</a> · last updated (UTC): {{ s.updated | slice: 0, 10 }}</p>
</section>

<div class="fp-toolbar pubs-toolbar" id="pubs-keys" hidden>
<div class="fp-seg pubs-seg" role="group" aria-label="Show a section">
<button type="button" data-cat="all" aria-pressed="true"><span>all</span><span class="fp-seg__c">{{ shown }}</span><span class="fp-seg__k" aria-hidden="true">x</span></button>
{%- for key in keys -%}
{%- assign c = counts[forloop.index0] | plus: 0 -%}
{%- if c > 0 %}
<button type="button" data-cat="{{ key }}" data-key="{{ letters[forloop.index0] }}" aria-pressed="false"><span>{{ titles[forloop.index0] | downcase }}</span><span class="fp-seg__c">{{ c }}</span><span class="fp-seg__k" aria-hidden="true">{{ letters[forloop.index0] }}</span></button>
{%- endif -%}
{%- endfor %}
</div>
<div class="pubs-find">
<label class="fp-find" data-fp-find><span class="fp-k" aria-hidden="true">/</span><span class="sr-only">Find a paper</span><input type="search" placeholder="find a paper" autocomplete="off" spellcheck="false"></label>
<span class="fp-label pubs-status" role="status" aria-live="polite"></span>
</div>
</div>

<div class="pubs-list">
{{ sections }}
<p class="pubs-none" hidden>Nothing here matches.</p>
</div>

</div>

<script>
// The keys for the list: s m c (and u, while anything waits to be sorted)
// show one section, x shows all, / finds. Section and find work together.
(function () {
  var bar = document.getElementById('pubs-keys');
  if (!bar) return;
  bar.hidden = false;
  var buttons = [].slice.call(bar.querySelectorAll('button[data-cat]'));
  var input = bar.querySelector('input');
  var status = bar.querySelector('.pubs-status');
  var none = document.querySelector('.pubs-none');
  var rows = [].slice.call(document.querySelectorAll('.pub'));
  var sections = [].slice.call(document.querySelectorAll('.pubs-section'));
  rows.forEach(function (r) { r._text = r.textContent.replace(/\s+/g, ' ').toLowerCase(); });
  var cat = 'all';

  function apply() {
    var q = input.value.trim().toLowerCase(), n = 0;
    rows.forEach(function (r) {
      var on = (cat === 'all' || r.dataset.cat === cat) && (!q || r._text.indexOf(q) > -1);
      r.hidden = !on; if (on) n++;
    });
    sections.forEach(function (s) { s.hidden = !s.querySelector('.pub:not([hidden])'); });
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === cat)); });
    none.hidden = n > 0;
    status.textContent = (cat === 'all' && !q) ? '' : n + ' of ' + rows.length;
    var at = document.querySelector('.pub.fp-at');
    if (at && at.hidden && window.FP && FP.setAt) FP.setAt(null);
  }
  function show(c) { cat = c; apply(); }

  buttons.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.cat === cat && cat !== 'all' ? 'all' : b.dataset.cat); }); });
  input.addEventListener('input', apply);

  if (window.FP) {
    buttons.forEach(function (b) {
      var k = b.dataset.key;
      if (k) FP.add({ key: k, label: b.firstElementChild.textContent + ' only', run: function () { show(b.dataset.cat === cat ? 'all' : b.dataset.cat); } });
    });
    FP.add({ key: 'x', label: 'all sections, and clear the find', run: function () { input.value = ''; show('all'); } });
  }
})();
</script>
