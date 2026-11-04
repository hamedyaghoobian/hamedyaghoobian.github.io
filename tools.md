---
layout: page
title: Tools & Projects
permalink: /tools/
wide: true
dek: This section showcases interactive tools and applications I've developed, exploring innovative ways to engage with textual content using artificial intelligence.
---
{%- comment -%}
  Tools (05): a numbered index that opens in place. Each row is a
  <details>: title, kind, and a live dot if the tool is still being built.
  Open, it gives the description, the tool's figure, its spec and the link
  out. The filter is a segmented key (a all · e educational · p
  experimental); j / k step the rows, enter opens one. Styles in
  _sass/faceplate/pages/_tools.scss.
{%- endcomment -%}
<div class="tl">

<div class="fp-toolbar tl-bar">
  <div class="fp-seg" role="group" aria-label="Show">
    <button type="button" data-filter="all" aria-pressed="true"><span class="fp-seg__k">a</span>all <span class="fp-seg__c">4</span></button>
    <button type="button" data-filter="educational" aria-pressed="false"><span class="fp-seg__k">e</span>educational <span class="fp-seg__c">3</span></button>
    <button type="button" data-filter="experimental" aria-pressed="false"><span class="fp-seg__k">p</span>experimental <span class="fp-seg__c">1</span></button>
  </div>
  <p class="fp-label tl-bar__hint"><span class="fp-k">j</span><span class="fp-k">k</span>step · <span class="fp-k">enter</span>open · or click a row</p>
</div>

<div class="fp-index tl-index">

<details class="fp-row tl-row" data-fp-part data-kind="educational" id="ai-and-data-ethics" open>
  <summary class="fp-row__head">
    <span class="fp-row__n">05.1</span>
    <span class="fp-row__t">AI and Data Ethics</span>
    <span class="fp-row__m"><span class="tl-status"><span class="fp-live" title="still being built"></span>in progress</span><span class="tl-kind">educational</span></span>
    <span class="fp-row__x" aria-hidden="true">+</span>
  </summary>
  <div class="fp-row__body">
    <p class="fp-label tl-sub">Computer Science Program at Muhlenberg College</p>
    <p class="tl-desc">A comprehensive digital platform currently under development for the upcoming Spring 2027 course, CSI 205: AI and Data Ethics. This tool will serve as a central hub for students to engage with ethical challenges in artificial intelligence through interactive modules and case studies.</p>
    {% include project-figure.html id="ethics-figure" script="ethics-lenses-figure.js" note="Lenses after the Markkula Center's framework for ethical decision-making · focus the figure, then 1–6" class="project-figure--wide" %}
    <dl class="fp-spec tl-spec">
      <dt>status</dt><dd>Work in Progress: this project is currently in active development.</dd>
      <dt>launch</dt><dd>Spring 2027 (CSI 205: AI and Data Ethics)</dd>
      <dt>goal</dt><dd>Enhancing computer science education with practical ethical frameworks.</dd>
      <dt>feedback</dt><dd>We welcome your insights during this development phase. Please share your feedback or suggestions via email at <a href="mailto:hamedyaghoobian@muhlenberg.edu">hamedyaghoobian@muhlenberg.edu</a>.</dd>
    </dl>
    <a class="tl-open" href="https://aidataethics.github.io/" target="_blank" rel="noopener">Visit Development Site <span aria-hidden="true">↗</span></a>
  </div>
</details>

<details class="fp-row tl-row" data-fp-part data-kind="experimental" id="bot-without-organs">
  <summary class="fp-row__head">
    <span class="fp-row__n">05.2</span>
    <span class="fp-row__t">Bot Without Organs</span>
    <span class="fp-row__m"><span class="tl-kind">experimental</span></span>
    <span class="fp-row__x" aria-hidden="true">+</span>
  </summary>
  <div class="fp-row__body">
    <p class="fp-label tl-sub">Interactive AI Philosophy Companion</p>
    <p class="tl-desc">An experimental conversational AI interface that enables interactive dialogue with Gilles Deleuze's famous A-Z interviews. This tool leverages large language models to facilitate engaging conversations with English translations of Deleuze's expansive philosophical discussions.</p>
    {% include project-figure.html id="bot-figure" script="bot-abecedaire-figure.js" class="project-figure--wide" %}
    <p class="fp-label tl-list-h">key features</p>
    <ul class="tl-list">
      <li>Interactive chat interface with Deleuze's philosophical concepts</li>
      <li>Access to the complete A-Z interview series covering topics from "A for Animal" to "Z for Zigzag"</li>
      <li>Built-in Deleuze dictionary with contextual definitions</li>
      <li>Powered by high-performance Groq LLMs for responsive interactions</li>
    </ul>
    <dl class="fp-spec tl-spec">
      <dt>stack</dt><dd>Large Language Models · Groq API · Natural Language Processing · Interactive Web Interface</dd>
      <dt>source</dt><dd>Based on the comprehensive <a href="https://www.imdb.com/title/tt0408472/" target="_blank" rel="noopener">Deleuze A-Z documentary</a> covering Russian literature, film philosophy, and deep insights into Deleuze's life and philosophical framework.</dd>
    </dl>
    <a class="tl-open" href="https://botwithoutorgans.github.io/" target="_blank" rel="noopener">Launch Tool <span aria-hidden="true">↗</span></a>
  </div>
</details>

<details class="fp-row tl-row" data-fp-part data-kind="educational" id="teach-the-machine">
  <summary class="fp-row__head">
    <span class="fp-row__n">05.3</span>
    <span class="fp-row__t">Teach The Machine</span>
    <span class="fp-row__m"><span class="tl-kind">educational</span></span>
    <span class="fp-row__x" aria-hidden="true">+</span>
  </summary>
  <div class="fp-row__body">
    <p class="fp-label tl-sub">Learn Machine Learning by Doing</p>
    <p class="tl-desc">An interactive educational tool inspired by Google's Teachable Machine, specifically designed for early-stage AI enthusiasts in junior high and high school. This platform provides students with hands-on activities to intuitively explore and understand core machine learning concepts.</p>
    {% include project-figure.html id="machine-figure" script="teach-machine-figure.js" note="Click a square to teach it · focus the figure, then: arrows, Enter, 1 coin, 2 cube, R reset" class="project-figure--wide" %}
    <p class="fp-label tl-list-h">key features</p>
    <ul class="tl-list">
      <li>Interactive, hands-on machine learning activities</li>
      <li>Designed specifically for junior high and high school students</li>
      <li>Provides intuitive visualizations of AI training processes</li>
      <li>Accessible entry point for early-stage AI enthusiasts</li>
    </ul>
    <dl class="fp-spec tl-spec">
      <dt>focus</dt><dd>AI Education · Machine Learning · Interactive Learning · STEM</dd>
    </dl>
    <a class="tl-open" href="https://teachthemachine.github.io/" target="_blank" rel="noopener">Launch Tool <span aria-hidden="true">↗</span></a>
  </div>
</details>

<details class="fp-row tl-row" data-fp-part data-kind="educational" id="learning-machines">
  <summary class="fp-row__head">
    <span class="fp-row__n">05.4</span>
    <span class="fp-row__t">Learning Machines</span>
    <span class="fp-row__m"><span class="tl-kind">educational</span></span>
    <span class="fp-row__x" aria-hidden="true">+</span>
  </summary>
  <div class="fp-row__body">
    <p class="fp-label tl-sub">Machine learning, one working machine at a time</p>
    <p class="tl-desc">A visual encyclopedia built for Machine Learning (CSI 330): a small machine for each idea in the course, from bias and variance to cross-validation. Each runs on real data (Palmer penguins, NHANES, wine), computes what scikit-learn computes, and writes out its own arithmetic as you turn its dials. Each comes with guided tasks that ask you to predict before you look.</p>
    <script src="{{ '/assets/js/line-figure.js' | relative_url }}?v={{ site.time | date: '%s' }}\" defer></script>
    <script src="{{ '/assets/js/csi330-data.js' | relative_url }}?v={{ site.time | date: '%s' }}\" defer></script>
    <script src="{{ '/assets/js/csi330-kit.js' | relative_url }}?v={{ site.time | date: '%s' }}\" defer></script>
    {% include project-figure.html id="w3-figure" script="csi330-w3-figure.js" class="project-figure--study" fig="Preview" title="The Bayes balance" hint="move over the curves · ← → · P priors" %}
    <p class="fp-label tl-list-h">what's inside</p>
    <ul class="tl-list">
      <li>The whole pipeline, one penguin at a time: data, split and scaling, scores, softmax, the decision map and the confusion matrix</li>
      <li>Nine machines so far, one entry each, week by week: bias–variance, k-NN, logistic regression, naive Bayes, least squares, k-NN regression, classification metrics, regression metrics, cross-validation</li>
      <li>A live calculation under every figure: the formula with the current numbers filled in</li>
      <li>"Try this" tasks with answers to open once you've tried</li>
      <li>Works with pointer or keyboard, in light or dark, on a phone</li>
    </ul>
    <dl class="fp-spec tl-spec">
      <dt>course</dt><dd>CSI 330: Machine Learning</dd>
      <dt>focus</dt><dd>Machine Learning · scikit-learn · Interactive Learning · CSI 330</dd>
    </dl>
    <a class="tl-open" href="{{ '/tools/learning-machines/' | relative_url }}">Open Learning Machines <span aria-hidden="true">→</span></a>
  </div>
</details>

</div>

<section class="tl-about" aria-labelledby="tl-about-t">
  <h2 class="fp-label" id="tl-about-t">about these tools</h2>
  <p>These projects represent explorations at the intersection of AI technology and humanistic inquiry. They aim to make complex philosophical and textual content more accessible through innovative interfaces while maintaining the depth and nuance of the original works.</p>
</section>

</div>

<script>
  // The filter: one kind at a time, each segment a key. Hidden rows drop out
  // of j / k, because faceplate.js steps only through visible parts.
  (function () {
    var btns = [].slice.call(document.querySelectorAll('.tl-bar [data-filter]'));
    var rows = [].slice.call(document.querySelectorAll('.tl-row'));
    btns.forEach(function (b) {
      var f = b.dataset.filter;
      b.querySelector('.fp-seg__c').textContent = rows.filter(function (r) { return f === 'all' || r.dataset.kind === f; }).length;
      b.addEventListener('click', function () { show(f); });
    });
    function show(f) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === f)); });
      rows.forEach(function (r) { r.hidden = !(f === 'all' || r.dataset.kind === f); });
      var at = document.querySelector('.tl-row.fp-at');
      if (at && at.hidden && window.FP && FP.setAt) FP.setAt(null);
    }
    [['a', 'all', 'show all tools'], ['e', 'educational', 'educational only'], ['p', 'experimental', 'experimental only']].forEach(function (k) {
      window.FP && FP.add({ key: k[0], label: k[2], run: function () { show(k[1]); } });
    });
  })();
</script>
