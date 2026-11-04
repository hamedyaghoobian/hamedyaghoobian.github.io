---
layout: page
title: Student Research
permalink: /student-research/
wide: true
# The index below is built from _data/faceplate.yml (order and numbers),
# each project page's front matter (status, term, from/to, areas) and
# _data/students.yml (who). Names and one-line descriptions are this page's
# own words, kept here.
list:
  /projects/nightshade-glaze-vlm-eval:
    name: "Nightshade/Glaze VLM Evaluation Harness"
    blurb: "An evaluation harness for testing how vision-language models perceive and respond to images protected by anti-AI-training tools such as Nightshade and Glaze."
  /projects/grammar-of-belief:
    name: "The Grammar of Belief"
    blurb: "Testing whether language models can separate what someone believes from what is true, in English and in Turkish."
  /projects/superhost-rating-reliability:
    name: "Noisy Stars: Rating Reliability and the Superhost Premium"
    blurb: "Whether the Airbnb Superhost rating threshold can reliably tell listings apart, and what the badge is actually worth."
  /projects/raising-reachy:
    name: "Raising Reachy: Framing, Values, and Responsibility in LLM-Powered Robot Interaction"
    blurb: "Studying how undergraduates \"raise\" an LLM-powered Reachy Mini robot framed as a learner, and the values and behaviors they pass on to it."
  /projects/ai-seasons:
    name: "Seasonal Changes in AI: From AI-Springs to AI-Winter"
    blurb: "A corpus of news, papers and videos on AI's booms and busts, now the starting point for a study of how \"the AI winter\" has been named and dated."
  /projects/timecapsule-18th-century-llm:
    name: "TimeCapsule: 18th Century LLM For Historical Sensemaking"
  /projects/multi-agents-llm-financial-trading-framework:
    name: "MASFIN: Multi-Agent LLM Financial Trading Framework"
  /projects/unmask-bias-llms:
    name: "Unmasking Bias in LLMs"
  /projects/walter-benjamin:
    name: "A Peek Into Correspondences of Walter Benjamin Using BERT"
areas:
  - { id: nlp, key: n, name: "Natural Language Processing" }
  - { id: hai, key: h, name: "Human-AI Interaction" }
  - { id: cai, key: s, name: "Critical AI Studies" }
  - { id: is,  key: i, name: "Information Systems" }
---
{%- assign y0 = 2022 -%}{%- assign years = "2022,2023,2024,2025,2026,2027" | split: "," -%}
{%- assign now_y = site.time | date: "%Y" | plus: 0 -%}{%- assign now_d = site.time | date: "%j" | plus: 0 -%}
{%- assign now = now_d | divided_by: 365.0 | plus: now_y -%}
{%- assign now_x = now | minus: y0 | times: 20 | round: 2 -%}
{%- capture rows_current -%}{%- endcapture -%}{%- capture rows_past -%}{%- endcapture -%}
{%- for u in site.data.faceplate.projects -%}
  {%- assign p = site.pages | where: "url", u | first -%}
  {%- assign info = page.list[u] -%}
  {%- assign studs = site.data.students | where: "project", u -%}
  {%- capture who -%}{% for s in studs %}{{ s.name }}{% if s.year %} {{ s.year }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}{%- endcapture -%}
  {%- capture area_ids -%}{{ p.areas | join: " " }}{%- endcapture -%}
  {%- capture area_names -%}{% for a in page.areas %}{% if p.areas contains a.id %}{{ a.name }} {% endif %}{% endfor %}{%- endcapture -%}
  {%- if p.status == "done" -%}{%- assign grp = "past" -%}{%- else -%}{%- assign grp = "current" -%}{%- endif -%}
  {%- capture row -%}
<li class="fp-row rs-row{% if p.status == 'live' %} is-live{% endif %}" data-fp-part data-areas="{{ area_ids }}" data-group="{{ grp }}" data-find="{{ info.name | append: ' ' | append: who | append: ' ' | append: p.term | append: ' ' | append: area_names | downcase | escape }}">
  <a class="fp-row__head rs-row__head" href="{{ u | relative_url }}">
    <span class="fp-row__n">02.{{ forloop.index }}</span>
    <span class="rs-row__main">
      <span class="fp-row__t">{{ info.name }}</span>
      <span class="rs-row__meta">
        <span>{{ who }}</span>
        <span>{{ p.term | default: "term not stated" | downcase }}</span>
        {%- if p.status == "live" %}<span class="rs-row__st"><span class="fp-live"></span>in progress</span>{% elsif p.status == "writing" %}<span class="rs-row__st">in preparation for submission</span>{% endif %}
        <span class="rs-row__areas">{{ p.areas | join: " · " }}</span>
      </span>
      {%- if info.blurb %}<span class="rs-row__blurb">{{ info.blurb }}</span>{% endif %}
    </span>
    <span class="rs-jacks" aria-hidden="true">{% for a in page.areas %}<i class="rs-jack{% if p.areas contains a.id %} is-on{% endif %}" data-area="{{ a.id }}"></i>{% endfor %}</span>
    <span class="rs-tl" aria-hidden="true">
      {%- for y in years %}<i class="rs-tl__yr" style="left:{{ y | minus: y0 | times: 20 }}%"></i>{% endfor -%}
      {%- if p.from -%}
        {%- assign x0 = p.from | minus: y0 | times: 20 | round: 2 -%}
        {%- if p.to == "now" %}{% assign x1 = now_x %}{% else %}{% assign x1 = p.to | minus: y0 | times: 20 | round: 2 %}{% endif -%}
        {%- assign w = x1 | minus: x0 | round: 2 -%}
        <i class="rs-tl__bar" style="left:{{ x0 }}%;width:{{ w }}%"></i>
        {%- if p.status == "live" and p.to != "now" %}{% assign rw = now_x | minus: x1 | round: 2 %}<i class="rs-tl__run" style="left:{{ x1 }}%;width:{{ rw }}%"></i>{% endif -%}
      {%- endif -%}
      {%- if p.status == "live" %}<i class="rs-tl__now" style="left:{{ now_x }}%"></i>{% endif -%}
    </span>
  </a>
</li>
  {%- endcapture -%}
  {%- if grp == "past" -%}{%- assign rows_past = rows_past | append: row -%}{%- else -%}{%- assign rows_current = rows_current | append: row -%}{%- endif -%}
{%- endfor -%}

<div class="rs">
<section class="rs-projects" aria-labelledby="rs-projects-h" data-fp-find>
  <h2 id="rs-projects-h" class="sr-only">Projects</h2>

  <div class="fp-toolbar rs-toolbar">
    <div class="rs-filters">
      <div class="fp-seg" role="group" aria-label="Area">
        {%- for a in page.areas %}
        <button type="button" aria-pressed="false" data-area="{{ a.id }}" title="{{ a.name }}"><span class="fp-seg__k">{{ a.key }}</span>{{ a.id }}<span class="fp-seg__c"></span></button>
        {%- endfor %}
      </div>
      <div class="fp-seg" role="group" aria-label="Current or past">
        <button type="button" aria-pressed="false" data-group="current"><span class="fp-seg__k">c</span>current<span class="fp-seg__c"></span></button>
        <button type="button" aria-pressed="false" data-group="past"><span class="fp-seg__k">p</span>past<span class="fp-seg__c"></span></button>
      </div>
      <button type="button" class="rs-clear" data-clear hidden><span class="fp-k">x</span>clear</button>
    </div>
    <label class="fp-find"><span class="fp-k">/</span><span class="sr-only">Find a project</span><input type="search" placeholder="find a project, a student" autocomplete="off"></label>
  </div>

  <div class="rs-cols fp-label" aria-hidden="true">
    <span>no.</span>
    <span>project · student · term</span>
    <span class="rs-jacks">{% for a in page.areas %}<span data-area="{{ a.id }}" title="{{ a.name }}">{{ a.id }}</span>{% endfor %}</span>
    <span class="rs-tl rs-tl--axis">{% for y in years %}<span style="left:{{ y | minus: y0 | times: 20 }}%">'{{ y | slice: 2, 2 }}</span>{% endfor %}</span>
  </div>

  <p class="rs-group fp-label" data-group-label="current">Current Projects</p>
  <ol class="fp-index rs-index" aria-label="Current Projects">{{ rows_current }}</ol>
  <p class="rs-group fp-label" data-group-label="past">Past Projects</p>
  <ol class="fp-index rs-index" aria-label="Past Projects">{{ rows_past }}</ol>
  <p class="rs-none" hidden>No project matches. <button type="button" data-clear>Clear the filters</button></p>

  <p class="rs-legend fp-label">
    <span><i class="rs-key rs-key--bar"></i>term with the student</span>
    <span><i class="rs-key rs-key--run"></i><span class="fp-live"></span>still running</span>
    <span><i class="rs-key rs-key--jack"></i>area</span>
    <span class="rs-count" aria-live="polite">{{ site.data.faceplate.projects | size }} projects · {{ site.data.students | size }} students · 2022–{{ now_y }}</span>
  </p>
</section>

<aside class="rs-side" markdown="1">

## Research Focus

I study how AI and people shape each other: what AI changes in how we talk, work and live, and what we put into it in return. Most of my work falls into three areas:

* **NLP**: how machines read and write language, from large language models to text analysis.
* **Human-AI interaction**: how people actually use AI, and how to tell whether it works for them.
* **Critical AI studies**: what AI means for society, with ethics, philosophy and the social sciences alongside the code.

## Working with Me

If you're a Muhlenberg student and any of this sounds interesting, get in touch. Python helps, but curiosity matters more, along with being happy to move between code and ideas.

You can join through an independent study during the year or through summer research. [Email me](mailto:{{ site.email }}) and we'll find a project.

</aside>
</div>

<script>
(function () {
  const root = document.querySelector('.rs-projects');
  if (!root) return;
  const rows = [...root.querySelectorAll('.rs-row')];
  const areaBtns = [...root.querySelectorAll('button[data-area]')];
  const groupBtns = [...root.querySelectorAll('button[data-group]')];
  const clears = [...root.querySelectorAll('[data-clear]')];
  const find = root.querySelector('.fp-find input');
  const none = root.querySelector('.rs-none');
  const count = root.querySelector('.rs-count');
  const total = count.textContent;
  let area = null, group = null, q = '';

  const has = (r, a) => r.dataset.areas.split(' ').includes(a);
  // counts: how many rows each key would leave, given the other filter
  function counts() {
    areaBtns.forEach(b => {
      b.querySelector('.fp-seg__c').textContent = rows.filter(r => has(r, b.dataset.area) && (!group || r.dataset.group === group)).length;
    });
    groupBtns.forEach(b => {
      b.querySelector('.fp-seg__c').textContent = rows.filter(r => r.dataset.group === b.dataset.group && (!area || has(r, area))).length;
    });
  }
  function apply() {
    let shown = 0;
    rows.forEach(r => {
      const ok = (!area || has(r, area)) && (!group || r.dataset.group === group) && (!q || r.dataset.find.includes(q));
      r.hidden = !ok;
      if (ok) shown++;
    });
    root.querySelectorAll('[data-group-label]').forEach(l => {
      const any = rows.some(r => !r.hidden && r.dataset.group === l.dataset.groupLabel);
      l.hidden = !any; l.nextElementSibling.hidden = !any;
    });
    areaBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.area === area)));
    groupBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.group === group)));
    root.querySelectorAll('.rs-cols [data-area], .rs-jack').forEach(j => j.classList.toggle('is-col', j.dataset.area === area));
    const filtered = area || group || q;
    clears[0].hidden = !filtered;
    none.hidden = shown > 0;
    count.textContent = filtered ? `${shown} of ${rows.length} shown` : total;
    counts();
    if (window.FP && FP.setAt) FP.setAt(null);
  }
  const setArea = a => { area = area === a ? null : a; apply(); };
  const setGroup = g => { group = group === g ? null : g; apply(); };
  const clear = () => { area = group = null; q = ''; find.value = ''; apply(); };

  areaBtns.forEach(b => b.addEventListener('click', () => setArea(b.dataset.area)));
  groupBtns.forEach(b => b.addEventListener('click', () => setGroup(b.dataset.group)));
  clears.forEach(b => b.addEventListener('click', clear));
  find.addEventListener('input', () => { q = find.value.trim().toLowerCase(); apply(); });

  window.FP = window.FP || { _q: [], add(k) { this._q.push(k); } };
  areaBtns.forEach(b => FP.add({ key: b.querySelector('.fp-seg__k').textContent, label: `${b.title} only`, run: () => setArea(b.dataset.area) }));
  FP.add({ key: 'c', label: 'current projects only', run: () => setGroup('current') });
  FP.add({ key: 'p', label: 'past projects only', run: () => setGroup('past') });
  FP.add({ key: 'x', label: 'clear the filters', run: clear, when: () => !!(area || group || q) });
  apply();
})();
</script>
