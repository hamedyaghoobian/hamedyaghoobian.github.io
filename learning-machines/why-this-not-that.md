---
layout: learning-machines
title: "Why this, not that · Learning Machines"
permalink: /tools/learning-machines/why-this-not-that/
lm_page: why
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}
<p class="lm-crumbs"><a href="{{ base }}">← Learning Machines</a> <span>/</span> <b>Why this, not that</b></p>

<h1 class="lm-title">Why this, not that</h1>
<p class="lm-line">The same question answered more than one way, and what decides between them</p>

<div class="lm-why" markdown="1">

### k-NN or logistic regression?

**k-NN** keeps every training bird and asks the nearest ones; its boundary can bend any way the data does. **Logistic regression** learns a few weights and draws straight boundaries, but gives probabilities and weights you can read. On the penguins' bill length and depth, the straight boundaries of the [whole pipeline]({{ base }}) already reach 0.95 on the test birds.

Choose k-NN when the boundary is curved and the data is small; logistic regression when you need probabilities, speed, or an explanation. [k-NN]({{ base }}k-nearest-neighbors/) · [Logistic regression]({{ base }}logistic-regression/)

### Logistic regression or naive Bayes?

Both give probabilities. **Logistic regression** fits the boundary directly. **Naive Bayes** models each class's measurements as a bell curve, then weighs them with the priors. Naive Bayes needs less data and can use priors you know, but its probabilities are overconfident when features are related. [Logistic regression]({{ base }}logistic-regression/) · [Naive Bayes]({{ base }}naive-bayes/)

### Least squares or k-NN regression?

**Least squares** assumes a straight line and gets the shape of the whole cloud from it, edges included. **k-NN regression** assumes nothing about the shape, but it is noisy at small k, flattens at the edges, and never predicts beyond the data it has seen. [Least squares]({{ base }}least-squares/) · [k-NN regression]({{ base }}knn-regression/)

### Raw units or standardised?

For anything that measures **distance** (k-NN), standardise: otherwise the measurement with the widest range decides. At 38 × 14 mm, raw millimetres vote 5 Adelie and standardised units vote 5 Gentoo. For logistic regression it changes the predictions little (not at all without regularisation), but it makes the weights comparable and the fitting faster. [k-NN]({{ base }}k-nearest-neighbors/)

### Accuracy or recall?

**Accuracy** counts every answer the same; on a rare class, "always no" scores well (0.77 on the NHANES test set). **Recall** asks how many of the real cases were caught; **precision** asks how many of the alarms were real. Choose by what a mistake costs. [Classification metrics]({{ base }}classification-metrics/)

### MAE or RMSE?

**MAE** is the typical miss. **RMSE** squares first, so a few large misses dominate it: one outlier nearly triples it while MAE rises by half. Report both; the gap between them tells you about the large misses. [Regression metrics]({{ base }}regression-metrics/)

### One split or k folds?

**One split** is fast, but its score depends on which rows landed in the test set: on the wine, single folds range from 0.65 to 0.80. **k-fold cross-validation** tests every row once and reports the spread. Use it whenever the data is small enough to fit the model k times. [Cross-validation]({{ base }}cross-validation/)

### A simple model or a flexible one?

A model too simple to follow the pattern has **bias**; one flexible enough to follow the noise has **variance**. The test error, not the training error, tells you which side of the U you are on. [Bias and variance]({{ base }}bias-and-variance/)

</div>
