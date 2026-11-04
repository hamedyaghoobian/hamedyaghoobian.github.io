---
layout: page
title: Teaching
permalink: /pedagogy/
wide: true
dek: "Department of Math, CS, and Stat, Muhlenberg College. Every course by term, Fall 2021 to Spring 2027."
# The columns of the matrix: every course, by number, each pilot set just
# before the course it became.
courses:
  - { code: "102", name: "Introduction to Game Programming with Python" }
  - { code: "109", name: "Introduction to Data Science" }
  - { code: "111", name: "Computer Science II" }
  - { code: "205", name: "AI and Data Ethics" }
  - { code: "240", name: "Computer Organization" }
  - { code: "345", name: "Web Development" }
  - { code: "355", name: "Computer Networks" }
  - { code: "370", name: "CUE Computer Science Seminar" }
  - { code: "386", name: "Human-Computer Interaction", pilot: true }
  - { code: "320", name: "Human-AI Interaction" }
  - { code: "387", name: "Introduction to Machine Learning", pilot: true }
  - { code: "330", name: "Machine Learning" }
# The terms, newest first: the page's own list. `n` is sections; `note` is
# what follows the " · " on the page.
terms:
  - term: "Spring 2027"
    status: scheduled
    courses:
      - { code: "240", name: "Computer Organization", n: 1 }
      - { code: "370", name: "CUE Computer Science Seminar", n: 1 }
      - { code: "205", name: "AI and Data Ethics", n: 1, tag: "new course" }
  - term: "Fall 2026"
    status: live
    courses:
      - { code: "102", name: "Intro to Game Programming with Python", n: 2, note: "two sections" }
      - { code: "330", name: "Machine Learning", n: 1, lm: true }
  - term: "Spring 2026"
    courses:
      - { code: "240", name: "Computer Organization", n: 1 }
      - { code: "370", name: "CUE Computer Science Seminar", n: 1 }
  - term: "Fall 2025"
    courses:
      - { code: "111", name: "Computer Science II", n: 1 }
      - { code: "109", name: "Introduction to Data Science", n: 1 }
      - { code: "320", name: "Human-AI Interaction", n: 1 }
  - term: "Spring 2025"
    courses:
      - { code: "240", name: "Computer Organization", n: 1 }
      - { code: "111", name: "Computer Science II", n: 1 }
      - { code: "370", name: "CUE Computer Science Seminar", n: 1 }
  - term: "Fall 2024"
    courses:
      - { code: "109", name: "Introduction to Data Science", n: 1 }
      - { code: "111", name: "Computer Science II", n: 1 }
      - { code: "387", name: "Introduction to Machine Learning", n: 1, tag: "new pilot", note: "(Special Topics; pilot for Machine Learning)" }
  - term: "Spring 2024"
    courses:
      - { code: "109", name: "Introduction to Data Science", n: 1 }
      - { code: "111", name: "Computer Science II", n: 1 }
      - { code: "240", name: "Computer Organization", n: 1 }
  - term: "Fall 2023"
    courses:
      - { code: "111", name: "Computer Science II", n: 1 }
      - { code: "102", name: "Introduction to Game Programming with Python", n: 2, note: "two sections" }
  - term: "Spring 2023"
    courses:
      - { code: "386", name: "Human-Computer Interaction", n: 1, tag: "new pilot", note: "(Special Topics; pilot for Human-AI Interaction)" }
      - { code: "102", name: "Introduction to Game Programming with Python", n: 1 }
      - { code: "240", name: "Computer Organization", n: 1 }
  - term: "Fall 2022"
    courses:
      - { code: "345", name: "Web Development", n: 1 }
      - { code: "102", name: "Introduction to Game Programming with Python", n: 2, note: "two sections" }
  - term: "Spring 2022"
    courses:
      - { code: "240", name: "Computer Organization", n: 1 }
      - { code: "102", name: "Introduction to Game Programming with Python", n: 2, note: "two sections" }
  - term: "Fall 2021"
    courses:
      - { code: "355", name: "Computer Networks", n: 1 }
      - { code: "102", name: "Introduction to Game Programming with Python", n: 2, note: "two sections" }
---
{%- comment -%}
  Teaching: one row per term, newest first; one column per course. Each
  bar in a cell is a section; dashed bars are scheduled, not yet taught.
  The words of each row are the page's own list, from `terms` above, so
  the matrix and the list can't drift apart. Hover a course (its column
  head, a bar, or its name in a row) to light its column and read its run.
  To add a term, add it at the top of `terms`; a new course also needs a
  column in `courses`.
{%- endcomment -%}
{%- assign total = 0 -%}{%- assign taught_codes = "" -%}
{%- for t in page.terms -%}{%- unless t.status == "scheduled" -%}{%- for c in t.courses -%}{%- assign total = total | plus: c.n -%}{%- unless taught_codes contains c.code -%}{%- assign taught_codes = taught_codes | append: c.code | append: " " -%}{%- endunless -%}{%- endfor -%}{%- endunless -%}{%- endfor -%}
{%- assign taught_n = taught_codes | split: " " | size -%}
<div class="tm" id="tm">
  <div class="tm-bar">
    <p class="fp-label tm-bar__sum">Fall 2021 – Fall 2026 · {{ total }} sections of {{ taught_n }} courses · Spring 2027 scheduled</p>
    <p class="fp-label tm-bar__keys"><span class="fp-k">j</span><span class="fp-k">k</span>terms · <span class="fp-k">enter</span>open</p>
  </div>

  <div class="tm-head" aria-hidden="true">
    <span class="tm-head__term fp-label">term</span>
    <span class="tm-cells">
      {%- for c in page.courses -%}
      <span class="tm-col{% if c.pilot %} tm-col--pilot{% endif %}" data-c="{{ c.code }}" title="{{ c.name }} (CSI {{ c.code }}){% if c.pilot %} · pilot{% endif %}">{{ c.code }}</span>
      {%- endfor -%}
    </span>
    <span class="tm-head__list fp-label">courses · CSI</span>
    <span class="tm-head__n fp-label">sections</span>
  </div>

  <ol class="tm-terms">
    {%- for t in page.terms -%}
    {%- assign tn = 0 -%}{%- for c in t.courses -%}{%- assign tn = tn | plus: c.n -%}{%- endfor %}
    <li class="tm-row{% if t.status %} tm-row--{{ t.status }}{% endif %}" data-fp-part>
      <h3 class="tm-term">{% if t.status == "live" %}<span class="fp-live" title="this term"></span>{% endif %}{{ t.term }}{% if t.status == "scheduled" %} <span class="tm-term__s">(scheduled)</span>{% elsif t.status == "live" %} <span class="tm-term__s">now</span>{% endif %}</h3>
      <span class="tm-cells" aria-hidden="true">
        {%- for col in page.courses -%}
        {%- assign hit = t.courses | where: "code", col.code | first -%}
        <span class="tm-cell" data-c="{{ col.code }}">{%- if hit -%}{%- for i in (1..hit.n) -%}<i></i>{%- endfor -%}{%- endif -%}</span>
        {%- endfor -%}
      </span>
      <ul class="tm-list">
        {%- for c in t.courses %}
        <li data-c="{{ c.code }}">{{ c.name }} <span class="tm-code">(CSI {{ c.code }})</span>
          {%- if c.tag %} · <span class="fp-tag">{{ c.tag }}</span>{% endif -%}
          {%- if c.note %}{% if c.tag %} {% else %} · {% endif %}<span class="tm-note">{{ c.note }}</span>{% endif -%}
          {%- if c.lm %} · <span class="tm-note">study companion: <a href="{{ '/tools/learning-machines/' | relative_url }}">Learning Machines</a>, one interactive figure per week</span>{% endif -%}
        </li>
        {%- endfor %}
      </ul>
      <span class="tm-n fp-label">{{ tn }}</span>
    </li>
    {%- endfor %}
  </ol>

  <div class="tm-foot" aria-hidden="true">
    <span class="tm-head__term fp-label">taught</span>
    <span class="tm-cells">
      {%- for col in page.courses -%}
      {%- assign cn = 0 -%}
      {%- for t in page.terms -%}{%- unless t.status == "scheduled" -%}{%- assign hit = t.courses | where: "code", col.code | first -%}{%- if hit -%}{%- assign cn = cn | plus: hit.n -%}{%- endif -%}{%- endunless -%}{%- endfor -%}
      <span class="tm-col" data-c="{{ col.code }}">{% if cn > 0 %}{{ cn }}{% else %}–{% endif %}</span>
      {%- endfor -%}
    </span>
    <span class="tm-foot__legend fp-label"><i class="tm-key"></i>a section · <i class="tm-key tm-key--s"></i>scheduled · <span class="tm-key--p">386</span> pilot, then the course it became</span>
  </div>

  <p class="tm-readout fp-label" id="tm-readout" aria-hidden="true"></p>
</div>
<script src="{{ '/assets/js/teaching-figure.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
