---
layout: learning-machines
title: Learning Machines
permalink: /tools/learning-machines/
lm_home: true
---
{%- assign LM = site.data.learning_machines -%}
{%- assign base = "/tools/learning-machines/" | relative_url -%}
<p class="lm-eyebrow">A visual companion to machine learning</p>

<h1 class="lm-hero">Machine learning, illustrated.</h1>

See how a model works, from the whole pipeline to a single weight. Follow one penguin from raw measurements to a prediction, turn the dial on a model, and compare the different ways of answering the same question. Built for Machine Learning (CSI 330) at Muhlenberg College, Fall 2026. Every number is what scikit-learn computes on the course's own data.

{% include project-figure.html id="pipeline-figure" script="lm-pipeline-figure.js" class="project-figure--flow" calc="1" fig="No. 00" title="The whole pipeline, one bird at a time" hint="→ next bird · 1–6 a stage · click a panel" note="Three-class logistic regression on bill length and depth: 239 penguins to train, 103 to test. The page recomputes every number and agrees with scikit-learn on all 103." %}

<p class="lm-count">{{ LM.entries.size }} entries · {{ LM.entries.size | plus: 1 }} interactive studies · weeks 1–8, a growing reference</p>

<h2 class="lm-h2"><span>01</span> Explore by topic</h2>

<div class="lm-topics">
{%- for s in LM.sections %}
  <div class="lm-topic">
    <p class="lm-topic__name">{{ s.name }} <span>{{ s.entries.size }} {% if s.entries.size == 1 %}entry{% else %}entries{% endif %}</span></p>
    {%- for slug in s.entries %}{% assign e = LM.entries[slug] %}
    <a class="lm-topic__entry" href="{{ base }}{{ slug }}/"><b>{{ e.title }}</b> <span>{{ e.line }}</span></a>
    {%- endfor %}
  </div>
{%- endfor %}
</div>

<h2 class="lm-h2" id="in-order"><span>02</span> Building a model, in order</h2>

From a question to a number you can trust. Each step points to the machines that explain it; the number on the right is the panel of the pipeline above where it happens.

<ol class="lm-order">
{%- for st in LM.order %}
  <li>
    <span class="lm-order__name">{{ st.name }}</span>
    <span class="lm-order__text">{{ st.text }}</span>
    <span class="lm-order__see">{% for slug in st.see %}<a href="{{ base }}{{ slug }}/">{{ LM.entries[slug].title }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}</span>
    <button class="lm-order__stage" type="button" data-stage="{{ st.stage }}" aria-label="Show panel {{ st.stage }} in the pipeline">{{ st.stage }}</button>
  </li>
{%- endfor %}
</ol>

Then compare the choices you made along the way in [Why this, not that]({{ base }}why-this-not-that/).

<h2 class="lm-h2"><span>03</span> The interactive collection</h2>

<ol class="lm-collection">
{%- for s in LM.sections %}{% for slug in s.entries %}{% assign e = LM.entries[slug] %}
  <li><a href="{{ base }}{{ slug }}/"><span class="lm-collection__no">{% if e.num < 10 %}0{% endif %}{{ e.num }}</span>{{ e.title }}<span class="lm-collection__week">week {{ e.week }}</span></a></li>
{%- endfor %}{% endfor %}
</ol>

<script>
  // "Building a model, in order": a stage's number focuses that panel of
  // the pipeline and scrolls it into view.
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lm-order__stage');
    if (!b) return;
    var fig = document.getElementById('pipeline-figure');
    fig.scrollIntoView({ behavior: 'smooth', block: 'center' });
    fig.focus({ preventScroll: true });
    fig.dispatchEvent(new KeyboardEvent('keydown', { key: b.dataset.stage, bubbles: true }));
  });
</script>
