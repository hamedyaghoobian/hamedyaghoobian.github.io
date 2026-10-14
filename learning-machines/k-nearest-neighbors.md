---
layout: learning-machines
title: "k-nearest neighbors · Learning Machines"
permalink: /tools/learning-machines/k-nearest-neighbors/
entry: k-nearest-neighbors
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">The simplest classifier there is: to name a bird you have never seen, find the birds you have seen that are most like it, and let them vote. k-NN learns nothing in advance. All of its behaviour comes from two choices you make: how many neighbours vote, and what "like it" means.</p>

## The algorithm

1. Measure the distance from the new bird to every bird in the training data.
2. Sort them, nearest first.
3. Keep the k nearest.
4. Each votes for its species; the most votes wins.

<div class="lm-formula"><span class="lm-formula__eq" data-tex="d(a,b)=\sqrt{(a_1-b_1)^2+(a_2-b_2)^2}">d(a,b)=\sqrt{(a_1-b_1)^2+(a_2-b_2)^2}</span><span class="lm-formula__say">the straight-line (Euclidean) distance between two birds, one term per measurement</span></div>

There is no training step to speak of: "fitting" a k-NN model just stores the data. All the work happens when a prediction is asked for, which is why it is called a *lazy* learner.

## Units decide who is near

Distance adds up differences in each measurement, so a measurement with a wider spread has more say. Penguin bills vary by 5.45 mm in length (one standard deviation) but only 1.97 mm in depth. In raw millimetres, a 2 mm difference in depth counts exactly as much as a 2 mm difference in length, even though for a penguin 2 mm of depth is a full standard deviation and 2 mm of length a third of one.

Standardising rescales each measurement by its own spread:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="z=\frac{x-\mu}{\sigma}">z=\frac{x-\mu}{\sigma}</span><span class="lm-formula__say">a measurement in standard deviations from its mean</span></div>

The five nearest birds to a 38 × 14 mm bill, both ways:

| | Raw millimetres | | Standardised | |
|---|---|---|---|---|
| | bird | distance | bird | distance |
| 1 | 37.7 × 16.0 Adelie | 2.02 mm | 40.9 × 13.7 Gentoo | 0.55 sd |
| 2 | 38.1 × 16.5 Adelie | 2.50 mm | 41.7 × 14.7 Gentoo | 0.77 sd |
| 3 | 37.0 × 16.5 Adelie | 2.69 mm | 42.0 × 13.5 Gentoo | 0.78 sd |
| 4 | 36.2 × 16.1 Adelie | 2.77 mm | 42.6 × 13.7 Gentoo | 0.86 sd |
| 5 | 37.3 × 16.8 Adelie | 2.89 mm | 42.7 × 13.7 Gentoo | 0.88 sd |

In raw millimetres the neighbours match the bill's *length* and ignore that their bills are 2 to 3 mm deeper; standardised, they match its *depth*, which is the more unusual measurement. The vote flips from 5 Adelie to 5 Gentoo.

Averaged over all the birds, the difference is small here: 5-fold accuracy is 0.962 in raw millimetres and 0.965 standardised, because most birds sit well inside their species' cloud, where both ways agree. Scaling decides the birds in the gaps between species. It decides far more when features are in different units altogether: grams of body mass next to millimetres of bill would let mass decide everything.

## Choosing k

Small k follows every bird, including the odd ones; large k smooths over the boundary between species. Accuracy by 5-fold cross-validation on bill length and depth, standardised:

| k | 1 | 3 | 5 | 9 | 15 | 25 | 51 | 101 |
|---|---|---|---|---|---|---|---|---|
| Accuracy | 0.939 | **0.968** | 0.965 | 0.959 | **0.968** | 0.959 | 0.959 | 0.936 |

k = 1 has the most variance: one unusual neighbour decides. k = 101 has the most bias: it reaches across into the next species' cloud, and the Chinstraps, the smallest group (68 birds), can be outvoted near the edges of their cloud. Between them is a wide plateau where almost any k works. That is common, and it is why k is chosen by [cross-validation]({{ base }}cross-validation/) rather than by hand. This is the same dial as [bias and variance]({{ base }}bias-and-variance/), turned the other way: smaller k means more flexibility.

## Ties

With two species and an even k, the vote can split evenly; with three species it can split even for odd k (2–2–1 with k = 5). An odd k avoids two-way ties. scikit-learn breaks a tie in favour of the class that comes first in its list of classes; this figure breaks it toward the class of the nearest neighbour. Another way out is to weight each vote by closeness (`weights="distance"`), so nearer birds count for more.

## What it costs

Fitting is instant, but every prediction compares the new point with all n stored points, across all d measurements: the work grows with n × d per prediction. Search trees (`algorithm="kd_tree"` or `"ball_tree"`) cut that down when d is small. When d is large, every point becomes roughly as far from every other, and "nearest" stops meaning much; this is the *curse of dimensionality*, and the reason k-NN suits a few well-chosen measurements.

## Try this

<div class="study-try" markdown="1">
Try this

1. Move the query to about 38 × 14 mm with k = 5. Read the vote in raw millimetres, then press **S** for standardised.
2. Set k = 1 and move slowly through the middle of the board, where the species mix. Then try k = 25.
3. Why does an even k make trouble for a vote?

<details markdown="1"><summary>What you should see</summary>

1. At 38 × 14 mm, raw millimetres gives **5 Adelie** votes and standardised gives **5 Gentoo**: a complete reversal. Bill depth varies much less than length (a standard deviation of 1.97 mm against 5.45 mm), so 1 mm of depth is far more unusual than 1 mm of length. Raw millimetres ignores that and lets length decide.
2. With k = 1 the prediction flips with every bird you pass (high variance). With k = 25 it changes slowly and smooths over the mixed region, but it can be outvoted by a bigger class nearby (more bias). It's the same dial as week 1.
3. Two classes can tie. This page breaks ties toward the nearest neighbour's class; an odd k avoids ties between two classes.
</details>
</div>

## Which classifier for a few measurements?

<div class="lm-decide"><p class="lm-decide__by">Decided by how much data there is · whether the boundary is curved · whether you need probabilities or an explanation · how fast predictions must be</p>
<div class="lm-options">
<div class="lm-option is-here"><h4>k-NN <span class="lm-option__here">This machine</span></h4><p>Store the data; vote among the nearest.</p><p><b>Choose it when</b> the boundary between classes is curved or patchy; the data is small enough to search; you want no assumptions about shape.</p><p><b>The catch</b> slow predictions on large data; sensitive to scaling and to irrelevant features; no weights to read.</p></div>
<div class="lm-option"><h4>Logistic regression </h4><p>One weighted sum per class, squashed into a probability.</p><p><b>Choose it when</b> you need probabilities and readable weights; the boundary is roughly straight.</p><p><b>The catch</b> straight boundaries only, unless you add features yourself.</p><p class="lm-option__link"><a href="{{ base }}logistic-regression/">Logistic regression →</a></p></div>
<div class="lm-option"><h4>Gaussian naive Bayes </h4><p>A bell curve per class and feature, weighed by how common each class is.</p><p><b>Choose it when</b> data is small; priors are known; there are many features.</p><p><b>The catch</b> assumes features independent within a class; probabilities overconfident.</p><p class="lm-option__link"><a href="{{ base }}naive-bayes/">Naive Bayes →</a></p></div>
</div></div>

## In scikit-learn

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
model.fit(X_train, y_train)          # X: bill length and depth
model.predict([[45.0, 17.0]])        # → 'Chinstrap', as on the board
```

## Where it goes wrong

- **Forgetting to scale.** Distances in raw units let the widest-ranging feature decide. Put the scaler inside the pipeline, so it learns its mean and spread from the training data only.
- **Many features.** In high dimensions every point is far from every other, and "nearest" stops meaning much.
- **Large training sets.** k-NN stores every training point and searches them at prediction time; it learns nothing in advance.

## The numbers in the figure

| | |
|---|---|
| Data | the 342 Palmer penguins with complete measurements: 151 Adelie, 68 Chinstrap, 123 Gentoo |
| Features | bill length and bill depth, in mm |
| Distance | Euclidean; standardised with the mean and standard deviation of all 342 |
| Vote | majority of the k nearest; a tie goes to the class of the nearest bird |
| Accuracy tables | 5-fold stratified cross-validation, shuffled with seed 330, `StandardScaler` inside a pipeline |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 2.2.3: the K-nearest neighbors classifier, and how K changes its boundary.</span></p><p><a href="https://scikit-learn.org/stable/modules/neighbors.html">scikit-learn: Nearest Neighbors ↗</a><br><span>Classification, weights, and the search algorithms.</span></p><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 2: feature scaling and pipelines (StandardScaler).</span></p></div>

