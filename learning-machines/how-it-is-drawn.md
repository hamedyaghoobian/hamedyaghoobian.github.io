---
layout: learning-machines
title: "How it is drawn · Learning Machines"
permalink: /tools/learning-machines/how-it-is-drawn/
lm_page: how
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}
<p class="lm-crumbs"><a href="{{ base }}">← Learning Machines</a> <span>/</span> <b>How it is drawn</b></p>

<h1 class="lm-title">How it is drawn</h1>
<p class="lm-line">Where the numbers come from, and the conventions of the drawings</p>

<div class="lm-body" markdown="1">

## The numbers

Every figure runs on a dataset used in the course: the Palmer penguins (342 birds with complete measurements), NHANES diabetes data, and a sample of 200 wines. One script, `scripts/csi330_data.py`, fits each model with scikit-learn and writes the results the figures need. The figures then recompute their readings live in the browser: neighbours, scores, probabilities, residuals, thresholds. Where they can be checked against scikit-learn, they agree: the pipeline's predictions on all 103 test birds, k-NN's vote at a test query, and the naive Bayes and logistic regression answers on the lecture slides. Week 1 is the only figure on simulated data (a noisy sine), and it says so.

## The drawings

Each idea is drawn as a small machine on a bench, in isometric projection: boards that carry an ordinary plot on their face, gauges on posts, selectors with detents, trays and springs. Lines are hairlines in the page's ink. One accent colour marks only what is live, the part that is answering you right now; in the dark theme it glows. Under every figure, a strip writes out the calculation with the current numbers, so the arithmetic is as visible as the machine.

## Using them

Point at a figure, or click it and use the keys shown under it. Left alone on screen, each figure runs a short demonstration, unless your system asks for reduced motion. Each entry ends with things to try, and the answers are folded until you open them.

## Credits

The layout follows Pascal's [visual encyclopedia of architecture](https://architecture.pascal.app). The pipeline figure takes its form from the "next-token flow" figures of the LLM anatomy studies. The machines follow the craft rules of Ryan's [Anatomy](https://github.com/wheresryan22/anatomy) skill (MIT) and the lighting rules of the iso-glow skill (after Tolga Cohce's [iso-figure](https://github.com/MrBongoC/ai-iso-skill), MIT). They are drawn with this site's own line kit.

</div>
