---
layout: learning-machines
title: "Logistic regression · Learning Machines"
permalink: /tools/learning-machines/logistic-regression/
entry: logistic-regression
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">k-NN answers by voting. Logistic regression answers with a probability, and with weights you can read. It does it in two steps: a straight line turns a bird's measurements into a score, and a squash turns the score into a probability between 0 and 1. Here the question is whether a bird is an Adelie, from its bill length alone.</p>

## Why not a straight line?

Code Adelie as 1 and every other bird as 0, and you could fit a straight line through the zeros and ones by least squares. But a line has no floor or ceiling: it runs below 0 for long bills and above 1 for short ones, and a "probability" of −0.13 means nothing. What is needed is something that can take any number and return a value between 0 and 1.

## Two steps: a score, then a squash

<div class="lm-formula"><span class="lm-formula__eq" data-tex="z = w_0 + w_1 x">z = w_0 + w_1 x</span><span class="lm-formula__say">a score for each bird: a straight line in its bill length, which can take any value</span></div>

<div class="lm-formula"><span class="lm-formula__eq" data-tex="p=\sigma(z)=\frac{1}{1+e^{-z}}">p=\sigma(z)=\frac{1}{1+e^{-z}}</span><span class="lm-formula__say">the squash (sigmoid): very negative z gives p near 0, z = 0 gives 0.5, very positive z gives p near 1</span></div>

Fitted to all 342 birds, the line is $$z = 51.11 - 1.192x$$. A 42 mm bill scores $$z = 51.11 - 1.192 \times 42 = 1.05$$, and $$\sigma(1.05) = 0.74$$: probably an Adelie. The weight is negative, so longer bills are less likely to be Adelie.

## The score is a log-odds

The odds of an event are $$p/(1-p)$$: a probability of 0.74 is odds of 2.85 to 1. Taking the log of the odds gives back exactly the score:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\ln\frac{p}{1-p} = w_0 + w_1 x">\ln\frac{p}{1-p} = w_0 + w_1 x</span><span class="lm-formula__say">logistic regression is a straight line in the log-odds</span></div>

So one more millimetre of bill *adds* w₁ = −1.192 to the log-odds, which *multiplies* the odds by $$e^{-1.192} = 0.30$$: a 70% cut per millimetre.

| Bill length | z | p (Adelie) | Odds |
|---|---|---|---|
| 40 mm | 3.43 | 0.969 | 30.9 |
| 41 mm | 2.24 | 0.904 | 9.38 |
| 42 mm | 1.05 | 0.740 | 2.85 |
| 43 mm | −0.15 | 0.464 | 0.87 |
| 44 mm | −1.34 | 0.208 | 0.26 |
| 46 mm | −3.72 | 0.024 | 0.02 |

Each row's odds are 0.30 of the row above. The model is undecided (p = 0.5, z = 0) at 51.11 ÷ 1.192 = **42.9 mm**.

## How the weights are chosen

Least squares has no meaning for probabilities. Instead the weights are chosen to make the predicted probabilities of what actually happened as large as possible, which is the same as making the **log loss** as small as possible:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\text{log loss} = -\frac{1}{n}\sum_{i=1}^{n}\Big[\,y_i\ln p_i + (1-y_i)\ln(1-p_i)\,\Big]">\text{log loss} = -\frac{1}{n}\sum_{i=1}^{n}\Big[\,y_i\ln p_i + (1-y_i)\ln(1-p_i)\,\Big]</span><span class="lm-formula__say">for each bird, minus the log of the probability the model gave to its true answer, averaged</span></div>

A bird the model gave 0.99 to its true species costs $$-\ln 0.99 = 0.01$$; one it gave 0.01 costs $$-\ln 0.01 = 4.6$$. There is no formula that gives the best weights directly, as there is for least squares, so they are found by iteration (scikit-learn's default solver is L-BFGS). The log loss is convex in the weights, so there is a single best answer and the search finds it. Here it ends at a log loss of **0.134**, which the gauge in the figure shows.

## The threshold is a choice

The model gives a probability; a decision needs a threshold T. Moving T moves the cut on the bill-length axis:

| Threshold T | Cut | Birds called Adelie | Accuracy |
|---|---|---|---|
| 0.2 | 44.0 mm | 168 | 0.921 |
| 0.5 | 42.9 mm | 152 | 0.944 |
| 0.8 | 41.7 mm | 135 | 0.936 |

There are 151 Adelie among the 342 birds. A low threshold catches more of them and wrongly includes more of the others; a high one is the reverse. Which is right depends on which mistake costs more, which is the subject of [classification metrics]({{ base }}classification-metrics/).

## Regularisation: C

The figure fits without any penalty (C = ∞), as the lecture does. scikit-learn's default adds a penalty on large weights, set by C: smaller C, stronger penalty, flatter S-curve.

| C | ∞ | 1 (default) | 0.1 | 0.01 | 0.001 |
|---|---|---|---|---|---|
| w₁ (per mm) | −1.192 | −1.162 | −0.994 | −0.612 | −0.265 |

The penalty matters most when the classes can be separated perfectly: without it the weights grow without limit and every probability becomes 0 or 1. It is the [bias–variance]({{ base }}bias-and-variance/) dial for this model.

## More than one feature

With bill length and depth together (both standardised), the score is z = −4.34 − 11.95·length + 7.84·depth: longer bills count against Adelie and deeper bills for it. The boundary where z = 0 is a straight line across the plane of the two measurements, and 5-fold accuracy rises from 0.942 with length alone to **0.980** with both. With three species, each gets its own score and *softmax* turns the three scores into three probabilities; the [whole pipeline]({{ base }}) on the home page does exactly that.

## Try this

<div class="study-try" markdown="1">
Try this

1. Point at a 42 mm bill. Work out <var>z</var> and <var>p</var> yourself, then check them against the calculation.
2. Where is the model completely undecided? Find it on the board and on the dial.
3. Press **↓** until <var>w</var>₁ is positive. Which birds does it call Adelie now, and what happens to the log loss? Press **F** to bring the fit back.
4. Press **T** to move the threshold to 0.2. Where does the cut move, and which birds change sides?

<details markdown="1"><summary>What you should see</summary>

1. <var>z</var> = 51.11 − 1.192 × 42 = **1.05**, so <var>p</var> = 1 ÷ (1 + <var>e</var><sup>−1.05</sup>) = **0.74**: Adelie.
2. <var>p</var> = 0.5 exactly where <var>z</var> = 0, at 51.11 ÷ 1.192 = **42.9 mm**. On the dial, the needle stands straight up: <var>z</var> = 0 on the outer scale, <var>p</var> = 0.5 on the inner one. Notice how the inner scale crowds toward both ends: going from 0.9 to 0.99 takes a little more <var>z</var> (2.4) than going all the way from 0.5 to 0.9 (2.2).
3. With a positive <var>w</var>₁ the curve rises, so it calls the long-billed birds Adelie: exactly backwards. The log loss climbs well above the fitted **0.134**. Fitting means choosing the weights that make the log loss smallest. The sign of a weight is its direction, and its size is the steepness.
4. At <var>T</var> = 0.2 the cut moves from 42.9 mm to **44.0 mm**, so birds with bills between those two lengths are now called Adelie. The threshold is a choice you make. It is not part of the model.
</details>
</div>

## Which way to get a probability?

<div class="lm-decide"><p class="lm-decide__by">Decided by how much data there is · whether features are related · whether the probabilities themselves will be used</p>
<div class="lm-options">
<div class="lm-option is-here"><h4>Logistic regression <span class="lm-option__here">This machine</span></h4><p>Fit the boundary directly: a weighted sum, squashed.</p><p><b>Choose it when</b> you need well-behaved probabilities and weights to explain; the boundary is roughly straight in the features.</p><p><b>The catch</b> straight boundaries; needs regularisation when classes separate perfectly.</p></div>
<div class="lm-option"><h4>Gaussian naive Bayes </h4><p>Model each class as bell curves, then apply Bayes’ rule.</p><p><b>Choose it when</b> very little data, or many features; priors known from outside the data.</p><p><b>The catch</b> probabilities overconfident when features are related.</p><p class="lm-option__link"><a href="{{ base }}naive-bayes/">Naive Bayes →</a></p></div>
<div class="lm-option"><h4>k-NN vote shares </h4><p>The fraction of the k neighbours in each class.</p><p><b>Choose it when</b> the boundary is irregular and data is plentiful.</p><p><b>The catch</b> coarse (only k + 1 possible values) and noisy for small k.</p><p class="lm-option__link"><a href="{{ base }}k-nearest-neighbors/">k-NN →</a></p></div>
</div></div>

## In scikit-learn

```python
from sklearn.linear_model import LogisticRegression

y = (penguins.species == "Adelie").astype(int)
model = LogisticRegression(C=float("inf"))     # no regularisation, as in Lecture 2.2
model.fit(penguins[["bill_length_mm"]], y)
model.intercept_, model.coef_                  # → 51.11, −1.192
model.predict_proba([[42.0]])[:, 1]            # → 0.74
```

## Where it goes wrong

- **Reading p as certainty.** The probabilities are only as good as the model's shape: a straight log-odds line. If the true boundary curves, the probabilities are off.
- **Perfectly separable data.** With no regularisation the weights grow without limit and p goes to exactly 0 or 1. scikit-learn's default (C = 1) shrinks the weights to prevent this.
- **Leaving the threshold at 0.5 by habit.** The threshold should follow the costs of the two kinds of error (week 6).

## The numbers in the figure

| | |
|---|---|
| Data | the 342 Palmer penguins; Adelie = 1 (151 birds), Chinstrap or Gentoo = 0 |
| Feature | bill length in mm, unscaled |
| Model | `LogisticRegression(C=∞)`: w₀ = 51.11, w₁ = −1.192; log loss 0.134 |
| Dial | z from −6 to 6 on the outer scale; p = σ(z) on the inner |
| Two-feature weights | standardised bill length and depth, C = ∞; accuracies by 5-fold stratified cross-validation |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 4.3, logistic regression: the logistic function, odds, and estimating the coefficients.</span></p><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 4: logistic regression, decision boundaries and softmax regression.</span></p><p><a href="https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression">scikit-learn: Logistic regression ↗</a><br><span>Solvers, penalties and C.</span></p></div>

