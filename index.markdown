---
layout: home
list_title: " "
---
{%- comment -%}
  Home: the faceplate's front. The name, in both scripts, and the bio on
  the left; on the right, the portrait in the plate's two inks. Under them,
  one key per section, each with a small figure drawn from that section's
  own data (j / k to step, enter to open). Then the interests, each set
  against the projects that work on it, and the path as a line through time.
  The newest thing on the site wears the red dot.

  By hand: each key's one line of text (this term, the latest news, the
  newest reading, the tool) and the path. Everything drawn is read from
  _data/, the section pages' own front matter and markup, or poems.json.
{%- endcomment -%}
{%- assign S = site.data.scholar -%}
<div class="hm" data-range-above>

  <section class="hm-id" aria-labelledby="hm-name">
    <p class="fp-label hm-id__role">assistant professor · director of computer science · muhlenberg college</p>
    <h1 class="hm-name" id="hm-name"><span class="hm-name__en">hamed<br>yaghoobian</span><span class="hm-name__fa" lang="fa" dir="rtl">حامد یعقوبیان</span></h1>

    <div class="hm-bio">
      <p>I am an Assistant Professor and Director of Computer Science at Muhlenberg College. I teach computer science. I study AI: how it shapes people, organizations, decisions, and everyday life. My work draws on Science and Technology Studies, with an interest in practices, interactions, and what emerges when people and technologies encounter one another.</p>
      <details class="hm-more">
        <summary><span class="fp-k">m</span><span class="hm-more__open">a little more</span><span class="hm-more__close">a little less</span></summary>
        <p>I was born and raised in Mashhad. Eastern Iran. The Khorasan region. Growing up, it didn't register much. Later, it became something else. Less an origin than a direction. A pull. A way of becoming-east rather than being-from-east. I now live in eastern Pennsylvania with my wife. East, still. But a different east. That earlier east did not follow me here. It works through me. Quietly. Sometimes not. From within. Still orienting. Still unfinished.</p>
        <p>I like cooking, making sourdough, and good tea and coffee. These days, I'm learning Turkish and making things with Claude. Both make me feel alternately clever and illiterate. The bread is less judgmental.</p>
      </details>
      <p>For research, collaborations, or a chat, email me at <a href="mailto:{{ site.email }}">{{ site.email }}</a>. Or visit me in the Trumbower Science Building. Room 125.</p>
    </div>
  </section>

  <figure class="hm-portrait fp-panel" aria-label="Portrait">
    <span class="fp-panel__tl">fig. 0 · portrait</span>
    <span class="fp-panel__tr" id="hm-date"><span lang="fa" dir="rtl"></span><span></span><span class="fp-live" title="today" aria-hidden="true"></span></span>
    <div class="hm-portrait__img"><img src="{{ '/assets/images/chatgpt_profile.png' | relative_url }}" alt="A line drawing of Hamed: curly hair, round glasses, a moustache, a dark t-shirt." data-no-zoom width="680" height="680"></div>
    <span class="fp-panel__bl">drawn by chatgpt</span>
    <span class="fp-panel__br"><a href="mailto:{{ site.email }}">email</a> · <a href="{{ site.google_scholar }}">scholar</a> · <a href="https://github.com/{{ site.github_username }}">github</a></span>
  </figure>

  {%- comment -%} ── What's on the plate: one key per section, each with a figure drawn from that section's own data. ── {%- endcomment -%}
  {%- assign PED = site.pages | where: "url", "/pedagogy/" | first -%}
  {%- assign NEWS = site.pages | where: "url", "/news/" | first -%}
  {%- assign TOOLS = site.pages | where: "url", "/tools/" | first -%}
  {%- assign READ = site.pages | where: "url", "/readings-otherwise/" | first -%}
  <section class="hm-keys" aria-labelledby="hm-keys-t">
    <div class="hm-keys__head">
      <h2 id="hm-keys-t">what's on the plate</h2>
      <p class="fp-label fp-keyhint"><span class="fp-k">j</span><span class="fp-k">k</span>step · <span class="fp-k">enter</span>open · or press the number</p>
    </div>
    <ol class="hm-keys__grid">

      {%- comment -%} 1 teaching: sections taught each term, oldest to newest; this term live, the next one dashed {%- endcomment -%}
      {%- assign terms = PED.terms | reverse -%}
      <li data-fp-part><a href="{{ '/pedagogy/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">01</span><span class="hm-key__t">teaching</span></span>
        <span class="hm-fig hm-fig--bars" aria-hidden="true">
          {%- for tm in terms -%}{%- assign n = 0 -%}{%- for c in tm.courses -%}{%- assign n = n | plus: c.n -%}{%- endfor -%}
          <i class="{% if tm.status == 'live' %}is-live{% elsif tm.status == 'scheduled' %}is-next{% endif %}" style="--v:{{ n }}" title="{{ tm.term }}: {{ n }} sections"></i>
          {%- endfor -%}
        </span>
        <span class="hm-key__now">this term: CSI 102 · CSI 330</span>
        <span class="hm-key__m">fall 2026 · {{ terms | size }} terms</span></a></li>

      {%- comment -%} 2 research: one dot per project, filled while it is still going {%- endcomment -%}
      {%- assign live = 0 -%}
      <li data-fp-part><a href="{{ '/student-research/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">02</span><span class="hm-key__t">research</span></span>
        <span class="hm-fig hm-fig--dots" aria-hidden="true">
          {%- for u in site.data.faceplate.projects -%}{%- assign pj = site.pages | where: "url", u | first -%}
          {%- if pj.status != "done" -%}{%- assign live = live | plus: 1 -%}{%- endif -%}
          <i class="{% if pj.status != 'done' %}is-on{% endif %}" title="{{ pj.heading | default: pj.title }}"></i>
          {%- endfor -%}
        </span>
        <span class="hm-key__now">{{ live }} current projects with students, {{ site.data.faceplate.projects | size | minus: live }} past</span>
        <span class="hm-key__m">{{ site.data.students | size }} students</span></a></li>

      {%- comment -%} 3 publications: citations per year {%- endcomment -%}
      {%- assign mx = 0 -%}{%- for y in S.cites_per_year -%}{%- if y[1] > mx -%}{%- assign mx = y[1] -%}{%- endif -%}{%- endfor -%}
      <li data-fp-part><a href="{{ '/publications/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">03</span><span class="hm-key__t">publications</span></span>
        <span class="hm-fig hm-fig--bars hm-fig--cites" aria-hidden="true">
          {%- for y in S.cites_per_year -%}<i class="{% if forloop.last %}is-open{% endif %}" style="--v:{{ y[1] | times: 6 | divided_by: mx }}" title="{{ y[0] }}: {{ y[1] }}"></i>{%- endfor -%}
        </span>
        <span class="hm-key__now">{{ S.citedby }} citations · h-index {{ S.hindex }} · i10 {{ S.i10index }}</span>
        <span class="hm-key__m">scholar, {{ S.updated | date: "%-d %b" | downcase }}</span></a></li>

      {%- comment -%} 4 news: every item at its month, 2022 to 2026 {%- endcomment -%}
      {%- assign listed = NEWS.content | split: 'data-listed="' -%}
      <li data-fp-part><a href="{{ '/news/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">04</span><span class="hm-key__t">news</span></span>
        <span class="hm-fig hm-fig--line" aria-hidden="true">
          {%- for chunk in listed offset: 1 -%}{%- assign ym = chunk | slice: 0, 7 -%}{%- assign yy = ym | slice: 0, 4 | plus: 0 -%}{%- assign mm = ym | slice: 5, 2 | plus: 0 -%}
          {%- assign pos = yy | minus: 2022 | times: 12 | plus: mm | minus: 1 | times: 100 | divided_by: 59.0 -%}
          <i class="{% if forloop.first %}is-live{% endif %}" style="left:{{ pos | round: 2 }}%" title="{{ ym }}"></i>
          {%- endfor -%}
          <b>2022</b><b>2026</b>
        </span>
        <span class="hm-key__now">quoted in Communications of the ACM, “Are LLMs Stuck in Time?”</span>
        <span class="hm-key__m">jul 2026 · {{ listed | size | minus: 1 }} items</span></a></li>

      {%- comment -%} 5 tools {%- endcomment -%}
      {%- assign nt = TOOLS.content | split: '<details class="fp-row' | size | minus: 1 -%}
      <li data-fp-part><a href="{{ '/tools/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">05</span><span class="hm-key__t">tools</span></span>
        <span class="hm-fig hm-fig--cells" aria-hidden="true">{% for i in (1..nt) %}<i class="{% if forloop.first %}is-live{% endif %}"></i>{% endfor %}</span>
        <span class="hm-key__now">Learning Machines: machine learning, one working machine at a time</span>
        <span class="hm-key__m">{{ nt }} tools · one being built</span></a></li>

      {%- comment -%} 6 readings: the pieces, by number; the newest is live {%- endcomment -%}
      {%- assign nr = READ.content | split: '<li class="fp-row ro-row"' | size | minus: 1 -%}
      <li data-fp-part><a href="{{ '/readings-otherwise/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">06</span><span class="hm-key__t">readings</span></span>
        <span class="hm-fig hm-fig--pieces" aria-hidden="true">{% for i in (1..nr) %}<i class="{% if forloop.last %}is-live{% endif %}"><b>{{ i }}</b></i>{% endfor %}</span>
        <span class="hm-key__now">No. {{ nr }} · What Ferdowsi Let In</span>
        <span class="hm-key__m"><span class="fp-live" title="newest on the site"></span>2 nov 2026</span></a></li>

      {%- comment -%} 7 poems: one dot per poem, grouped by Persian year (drawn from poems.json) {%- endcomment -%}
      <li data-fp-part><a href="{{ '/poems/' | relative_url }}">
        <span class="hm-key__top"><span class="hm-key__n">07</span><span class="hm-key__t">poems</span></span>
        <span class="hm-fig hm-fig--poems" id="hm-poems-fig" aria-hidden="true"></span>
        <span class="hm-key__now" id="hm-poems">collected poems, Persian and English</span>
        <span class="hm-key__m" id="hm-poems-d"></span></a></li>
    </ol>
  </section>

  {%- comment -%} ── Interests, each set against the projects that work on it; and the path, as a line through time. ── {%- endcomment -%}
  {%- assign IN = "Textual analysis|nlp,Human-AI interaction|hai,Philosophy and sociology of technology|cai" | split: "," -%}
  <section class="hm-about" aria-label="Research interests and education">
    <div class="hm-int">
      <h2 class="fp-label">research interests</h2>
      <ol>
        {%- for row in IN -%}{%- assign parts = row | split: "|" -%}{%- assign k = 0 -%}
        <li><span class="hm-int__n">0{{ forloop.index }}</span><span class="hm-int__t">{{ parts[0] }}</span>
          <a class="hm-int__p" href="{{ '/student-research/' | relative_url }}" title="Projects in this area">
            {%- for u in site.data.faceplate.projects -%}{%- assign pj = site.pages | where: "url", u | first -%}
            {%- if pj.areas contains parts[1] -%}{%- assign k = k | plus: 1 -%}<i class="{% if pj.status != 'done' %}is-on{% endif %}" title="{{ pj.heading | default: pj.title }}"></i>{%- endif -%}
            {%- endfor -%}<span>{{ k }} projects</span></a></li>
        {%- endfor -%}
      </ol>
    </div>

    <div class="hm-path">
      <h2 class="fp-label">education, and since</h2>
      {%- assign y0 = 2010 -%}{%- assign y1 = 2027 -%}{%- assign span = y1 | minus: y0 | times: 1.0 -%}
      <div class="hm-path__line" aria-hidden="true">
        {%- for y in (2010..2027) -%}{%- assign m = y | modulo: 5 -%}<i class="{% if m == 0 %}is-major{% endif %}" style="left:{{ y | minus: y0 | divided_by: span | times: 100 | round: 2 }}%">{% if m == 0 %}<b>{{ y }}</b>{% endif %}</i>{%- endfor -%}
        <span class="hm-path__run" style="left:{{ 2021.67 | minus: y0 | divided_by: span | times: 100 | round: 2 }}%;right:{{ y1 | minus: 2026.85 | divided_by: span | times: 100 | round: 2 }}%"></span>
        <span class="hm-path__dot" style="left:{{ 2011.5 | minus: y0 | divided_by: span | times: 100 | round: 2 }}%"></span>
        <span class="hm-path__dot" style="left:{{ 2021.4 | minus: y0 | divided_by: span | times: 100 | round: 2 }}%"></span>
        <span class="hm-path__dot is-live" style="left:{{ 2026.85 | minus: y0 | divided_by: span | times: 100 | round: 2 }}%"></span>
      </div>
      <ol class="hm-path__stops">
        <li><b>2011</b><span><strong>B.Sc. in Electrical Engineering</strong>Azad University of Mashhad, Iran</span></li>
        <li><b>2021</b><span><strong>Ph.D. in Computer Science</strong>University of Georgia, USA</span></li>
        <li class="is-now"><b>2021–</b><span><strong>Muhlenberg College</strong>Trumbower Science Building, room 125</span></li>
      </ol>
    </div>
  </section>
</div>

<script>
  // Today, in both calendars, for the portrait's corner.
  (function () {
    var d = new Date(), el = document.getElementById('hm-date');
    try {
      el.children[0].textContent = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
      el.children[1].textContent = ' · ' + new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d).toLowerCase();
    } catch (e) { el.textContent = ''; }
  })();
  // The poems row reads the collection itself, so it is never out of date.
  fetch('{{ "/poems.json" | relative_url }}').then(function (r) { return r.json(); }).then(function (p) {
    var newest = p.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0];
    var poet = (newest.poet.split('/')[1] || newest.poet).trim();
    document.getElementById('hm-poems').textContent = p.length + ' poems · newest: ' + poet;
    document.getElementById('hm-poems-d').textContent = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(newest.date + 'T12:00')).toLowerCase();
    // one dot per poem, oldest to newest, a gap where the Persian year turns
    var fig = document.getElementById('hm-poems-fig'), fa = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric' }), last = null;
    p.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (q) {
      var y = parseInt(fa.format(new Date(q.date + 'T12:00')), 10);
      if (last !== null && y !== last) { var s = document.createElement('b'); s.textContent = new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(y); fig.appendChild(s); }
      else if (last === null) { var s0 = document.createElement('b'); s0.textContent = new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(y); fig.appendChild(s0); }
      last = y;
      var i = document.createElement('i'); if (q === newest) i.className = 'is-live'; fig.appendChild(i);
    });
  }).catch(function () {});
  // m opens the longer bio.
  window.FP && FP.add({ key: 'm', label: 'a little more / a little less', run: function () { var d = document.querySelector('.hm-more'); d.open = !d.open; } });
</script>
