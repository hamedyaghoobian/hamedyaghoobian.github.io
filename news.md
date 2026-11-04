---
layout: page
title: News
permalink: /news/
wide: true
dek: "Talks, panels, papers and press since June 2022, one track for each kind."
---
{%- comment -%}
  News: the log below is the page. Each item says its kind (data-kind:
  talk · panel · paper · press), the month it is listed under (data-listed)
  and, where the text gives another month for when it happened, that month
  (data-held). news-figure.js reads those to draw the sequencer above
  the log and to count the kinds for the filter, so to add an item, add an
  <li> at the top, nothing else. The newest item wears the live dot.
{%- endcomment -%}
<div class="nw" id="nw">
  <div class="fp-toolbar nw-bar">
    <div class="fp-seg nw-seg" id="nw-seg" role="group" aria-label="Show one kind" hidden></div>
    <p class="fp-label nw-bar__keys"><span class="fp-k">j</span><span class="fp-k">k</span>items · <span class="fp-k">t</span><span class="fp-k">p</span><span class="fp-k">a</span><span class="fp-k">n</span>kinds · <span class="fp-k">x</span>clear</p>
  </div>

  <div class="nw-cal" id="nw-cal" hidden>
    <div class="nw-cal__scroll"><svg id="nw-svg" class="nw-svg" role="group" aria-label="The news items as steps on four tracks, one per kind, months left to right"></svg></div>
    <p class="fp-label nw-cal__key"><span><svg class="nw-cal__mk nw-cal__mk--one" viewBox="0 0 7 10" aria-hidden="true"><rect class="s" x="0" y="0" width="7" height="10" rx="1.5"/></svg>an item, at the month it is listed under</span><span><svg class="nw-cal__mk" viewBox="0 0 30 10" aria-hidden="true"><rect class="s" x="0" y="0" width="7" height="10" rx="1.5"/><line class="h" x1="7" x2="22" y1="5" y2="5"/><rect class="h" x="22.6" y=".6" width="6.8" height="8.8" rx="1.5"/></svg>held on to when it happened</span><span><span class="nw-cal__now"></span>now</span><span><span class="fp-live"></span>latest</span></p>
    <p class="nw-readout" id="nw-readout"></p>
  </div>

  <ol class="nw-log" id="nw-log">
    <li id="n-2026-07" class="nw-item is-newest" data-fp-part data-kind="press" data-listed="2026-07" markdown="span"><strong class="nw-d"><span class="fp-live" title="newest"></span>July 2026</strong><span class="nw-k fp-tag">press</span><span class="nw-t">Quoted in the *Communications of the ACM* (CACM) article, *"[Are LLMs Stuck in Time?](https://cacm.acm.org/news/are-llms-unstuck-in-time/)"* by Samuel Greengard, discussing our work on [<span class="small-caps">TimeCapsule</span>](/projects/timecapsule-18th-century-llm) and the temporal challenges of LLMs.</span></li>

    <li id="n-2026-04" class="nw-item" data-fp-part data-kind="paper" data-listed="2026-04" markdown="span"><strong class="nw-d">April 2026</strong><span class="nw-k fp-tag">paper</span><span class="nw-t">*"<span class="small-caps">TimeCapsule</span>: Generative Hallucination as a Method for Historical Sensemaking,"* with student researcher <span class="fp-tag nw-student">Hayk Grigorian (Class of ’26)</span>, has been accepted to [ACM Creativity & Cognition 2026](https://cc.acm.org/2026/), paper available [here](https://dl.acm.org/doi/10.1145/3803784.3807554).</span></li>

    <li id="n-2025-11" class="nw-item" data-fp-part data-kind="paper" data-listed="2025-11" markdown="span"><strong class="nw-d">November 2025</strong><span class="nw-k fp-tag">paper</span><span class="nw-t">*"MASFIN: A Multi-Agent System for Financial Forecasting,"* with <span class="fp-tag nw-student">Sebastian Montalvo (Class of ’28)</span>, has been accepted to NeurIPS 2025 (Generative AI in Finance Workshop), PDF available [here](https://openreview.net/pdf/94fa21379d714ca22656f2809d378820ba1111a2.pdf).</span></li>

    <li id="n-2025-03" class="nw-item" data-fp-part data-kind="talk" data-listed="2025-03" data-held="2025-09" markdown="span"><strong class="nw-d">March 2025</strong><span class="nw-k fp-tag">talk</span><span class="nw-t">Presenting *"The Recursive Enactment of AI: Beyond the Loop, Beyond the Thing"* at the *[Society for the Social Studies of Science (4S)](https://4sonline.org/)* 2025 Conference in Seattle, to be held in September ’25.</span></li>

    <li id="n-2025-02" class="nw-item" data-fp-part data-kind="talk" data-listed="2025-02" markdown="span"><strong class="nw-d">February 2025</strong><span class="nw-k fp-tag">talk</span><span class="nw-t">Co-presented *"From Java to Python: Revamping CS2 for a Cohesive Curriculum"* with [Proyash Podder](https://proyashpodder.github.io/) at *Innovations and Opportunities in Liberal Arts Computing Education*, an affiliated event at *[SIGCSE 2025](https://sigcse2025.sigcse.org/)* in Pittsburgh, PA.</span></li>

    <li id="n-2024-12" class="nw-item" data-fp-part data-kind="panel" data-listed="2024-12" data-held="2025-09" markdown="span"><strong class="nw-d">December 2024</strong><span class="nw-k fp-tag">panel</span><span class="nw-t">Open panel on *"Perforating echos: Cultivating difference in sociotechnical futures"* at the 2025 4S Meeting in Seattle, WA, co-organized with [Rachel Horst](https://www.rachelhorst.ca/).</span></li>

    <li id="n-2024-11" class="nw-item" data-fp-part data-kind="paper" data-listed="2024-11" markdown="span"><strong class="nw-d">November 2024</strong><span class="nw-k fp-tag">paper</span><span class="nw-t">My article, *"The Writer In-between: A Post-phenomenological Analysis of LLMs and their Implications for Writer-Tool Relations,"* has been accepted for publication in the *Journal of Human-Technology Relations*.</span></li>

    <li id="n-2024-09" class="nw-item" data-fp-part data-kind="paper" data-listed="2024-09" markdown="span"><strong class="nw-d">September 2024</strong><span class="nw-k fp-tag">paper</span><span class="nw-t">My article, *"Data-Body Machine: A Deleuzian Perspective in Digital Ontology,"* has been accepted for publication in the November edition of the _Journal of Somatechnics: Journal of Bodies – Technologies – Power_.</span></li>

    <li id="n-2023-06" class="nw-item" data-fp-part data-kind="talk" data-listed="2023-06" markdown="span"><strong class="nw-d">June 2023</strong><span class="nw-k fp-tag">talk</span><span class="nw-t">Presented the article *"Plasticity of Data and the Problematics of Containment"* at the 2023 4S Meeting in Honolulu, HI.</span></li>

    <li id="n-2023-03" class="nw-item" data-fp-part data-kind="panel" data-listed="2023-03" markdown="span"><strong class="nw-d">March 2023</strong><span class="nw-k fp-tag">panel</span><span class="nw-t">Organized an open panel, *"[Configuring the (w)hole: Algorithmic Systems, Endangered Ecologies, and Human Interconnectedness](https://4sonline.org/news_manager.php?page=31538)"* at the 2023 *[Society for the Social Studies of Science (4S)](https://4sonline.org/)* Meeting in Honolulu.</span></li>

    <li id="n-2022-08" class="nw-item" data-fp-part data-kind="talk" data-listed="2022-08" data-held="2022-10" markdown="span"><strong class="nw-d">August 2022</strong><span class="nw-k fp-tag">talk</span><span class="nw-t">Delivered a talk on *AI and the Democratization of Art* at the [Dana Forum](https://www.muhlenberg.edu/academics/dana-scholars/introduction/) on October 17, 2022.</span></li>

    <li id="n-2022-06" class="nw-item" data-fp-part data-kind="talk" data-listed="2022-06" markdown="span"><strong class="nw-d">June 2022</strong><span class="nw-k fp-tag">talk</span><span class="nw-t">Presented the article *"Phenomenology of Generative/Predictive Word Processing"* at the [Oxford Connected Life 2022 Conference](http://connectedlife.oii.ox.ac.uk/).</span></li>
  </ol>
</div>
<script src="{{ '/assets/js/news-figure.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
