---
layout: page
title: Publications
permalink: /publications/
---
{% include dappled-light.html %}
{%- comment -%}
  Built from two files:
    _data/scholar.json      Google Scholar's data, refreshed weekly by
                            .github/workflows/scholar.yml (never edit by hand)
    _data/publications.yml  yours: each paper's section, students, links, hidden
  A Scholar paper without an entry in publications.yml lands in "New, to sort".
  The ASCII charts are drawn by assets/js/publications-ascii.js from data on
  the elements; without it each paper still says its citation count.
{%- endcomment -%}
{%- assign s = site.data.scholar -%}
{%- assign notes = site.data.publications -%}
{%- assign people = site.data.students -%}
{%- assign pubs = s.publications | sort: "year", "first" | reverse -%}
{%- assign keys = "student|mine|collaboration|unsorted" | split: "|" -%}
{%- assign titles = "Student research|Sole-authored|Collaborations|New, to sort" | split: "|" -%}
{%- assign most = s.publications | map: "cites" | sort | last -%}

<div class="pubs">

<figure class="pubs-overview">
  <pre class="ascii-chart" id="cites-chart" data-cites='{{ s.cites_per_year | jsonify }}' data-year="{{ s.updated | slice: 0, 4 }}" aria-hidden="true"></pre>
  <figcaption>
    <span class="pubs-stats">{{ s.citedby }} citations · h-index {{ s.hindex }} · i10-index {{ s.i10index }}</span>
    <span class="pubs-chart-note">Citations per year{% if s.updated %}; {{ s.updated | slice: 0, 4 }} so far{% endif %}.</span>
  </figcaption>
</figure>

{%- for key in keys %}
{%- assign title = titles[forloop.index0] -%}
{%- capture items -%}
{%- for p in pubs -%}
  {%- assign note = notes | where: "id", p.id | first -%}
  {%- if note.hidden -%}{%- continue -%}{%- endif -%}
  {%- assign cat = note.category | default: "unsorted" -%}
  {%- if cat != key -%}{%- continue -%}{%- endif -%}
  {%- assign link = note.pdf | default: p.url -%}
  <li class="pub">
    <span class="pub-year">{{ p.year | default: "n.d." }}</span>
    <div class="pub-body">
      {% if link and link != "" %}<a class="pub-title" href="{{ link }}">{{ p.title }}</a>{% else %}<span class="pub-title">{{ p.title }}</span>{% endif %}
      {%- assign byline = note.authors | default: p.authors -%}
      {%- if byline.first %}{% assign byline = byline | join: ", " %}{% endif %}
      <span class="pub-authors">{{ byline | replace: "Hamed Yaghoobian", "<strong>Hamed Yaghoobian</strong>" }}</span>
      {% if note.type or p.citation != "" %}<span class="pub-venue">{% if note.type %}<span class="pub-type">{{ note.type }}</span>{% if p.citation != "" %} · {% endif %}{% endif %}{{ p.citation }}</span>{% endif %}
      {%- if note.students %}
      <span class="pub-students">with student researcher{% if note.students.size > 1 %}s{% endif %}
        {%- for name in note.students -%}
          {%- assign who = people | where: "name", name | first -%}
          {% unless forloop.first %}{% if forloop.last %} and{% else %},{% endif %}{% endunless %} {{ name }}{% if who.year %} ({{ who.year }}){% endif %}
        {%- endfor -%}
      </span>
      {%- endif %}
      {% if note.project %}<a class="pub-project" href="{{ note.project | relative_url }}">project page →</a>{% endif %}
    </div>
    <span class="pub-cites" data-cites="{{ p.cites }}" data-max="{{ most }}">{{ p.cites }} citation{% if p.cites != 1 %}s{% endif %}</span>
  </li>
{%- endfor -%}
{%- endcapture -%}
{%- assign trimmed = items | strip -%}
{%- if trimmed != "" %}
<section class="pubs-section">
  <h2>{{ title }}</h2>
  <ol class="pub-list">{{ items }}</ol>
</section>
{%- endif -%}
{%- endfor %}

<p class="pubs-source">Data from <a href="{{ s.profile }}">Google Scholar</a> · last updated (UTC): {{ s.updated }}</p>

</div>

<script src="{{ '/assets/js/publications-ascii.js' | relative_url }}" defer></script>
