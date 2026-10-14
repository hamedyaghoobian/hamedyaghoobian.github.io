---
layout: learning-machines
title: "Cross-validation · Learning Machines"
permalink: /tools/learning-machines/cross-validation/
entry: cross-validation
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">A model must be judged on data it did not learn from, but holding data back to test with leaves less to learn from, and the score depends on which rows happened to be held back. Cross-validation takes turns: every row is held back exactly once, and the result is a set of scores, not one.</p>

## Three roles for data

**Training** data fits the model's parameters. **Validation** data chooses between models and settings (k, degree, C). **Test** data, touched once at the end, estimates how the final model will do on new data. Using the test set to choose anything makes its score optimistic: it has become validation data.

## One split is a noisy measurement

Two hundred random 80/20 splits of the same 200 wines, the same model each time:

| | Lowest | Highest | Mean | Spread (sd) |
|---|---|---|---|---|
| Test accuracy, 200 single splits | 0.55 | 0.90 | 0.737 | 0.063 |

Nothing changed but which 40 wines were in the test set, and the reported accuracy ranged from 0.55 to 0.90. A single split could have told you either.

## k-fold cross-validation

Split the data into k folds. Train on k − 1 of them and test on the one left out; repeat k times so each fold is tested once; average:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\text{CV}_k = \frac{1}{k}\sum_{i=1}^{k} a_i">\text{CV}_k = \frac{1}{k}\sum_{i=1}^{k} a_i</span><span class="lm-formula__say">the cross-validated score: the mean of the k fold scores, reported with their spread</span></div>

| k | Fold scores | Mean | Spread across folds | Spread of the mean, 50 reshuffles |
|---|---|---|---|---|
| 3 | 0.776 · 0.701 · 0.742 | 0.740 | 0.031 | 0.010 |
| 5 | 0.725 · 0.75 · 0.65 · 0.80 · 0.70 | 0.725 | 0.050 | 0.010 |
| 10 | 0.70 · 0.65 · 0.70 · 0.75 · 0.70 · 0.65 · 0.85 · 0.80 · 0.75 · 0.70 | 0.725 | 0.060 | 0.007 |

The individual folds still disagree (from 0.65 to 0.85 at k = 10), but their *average* is stable: reshuffling the folds 50 times moves it by only about 0.01, against 0.063 for a single split. Larger k trains on more data each round (180 of 200 at k = 10) but tests on smaller folds, whose scores are noisier.

## Stratification

With 100 red and 100 white wines, a random fold could easily get 15 red and 25 white, and score differently for that reason alone. `StratifiedKFold` deals the rows out so every fold keeps the overall mix. For imbalanced classes it is essential; scikit-learn uses it by default when the model is a classifier.

## Leakage

Anything learned from the data (a scaler's mean, an imputer's fill values, a choice of features) must be learned inside each training fold only. Otherwise the held-out fold has helped shape the model that is tested on it. The safe pattern is a `Pipeline`, refitted inside every fold. Leaks are not always large: for k-NN on the penguins, scaling on all the data first gives the same 0.965 as scaling inside each fold, because a mean and a spread change little when one fold is added. Feature selection or target-based encoding done outside the folds can inflate a score far more.

## Choosing, then reporting

Cross-validation is how settings are chosen: try each k, degree or C, keep the one with the best mean score. But the best of many cross-validated scores is optimistic, for the same reason the test set must not be reused. Either keep a final test set aside from the start, or wrap the whole search in an outer cross-validation (nested cross-validation).

## Try this

<div class="study-try" markdown="1">
Try this

1. With k = 5, step through all five rounds. What is the lowest fold score, and what is the highest?
2. If you had made a single 80/20 split, which of those numbers could you have reported?
3. Compare k = 3, 5 and 10: the mean, and the spread.

<details markdown="1"><summary>What you should see</summary>

With k = 5 the folds score from **0.65 to 0.80**, so a single split could have reported either. Cross-validation reports **0.725 ± 0.050** instead. The means barely move with k (0.740, 0.725, 0.725), but the spread grows (0.031, 0.050, 0.060), because each fold gets smaller (67, 40, then 20 wines) and a small test set gives noisier scores. Larger k trains on more data each round, at the cost of more rounds.
</details>
</div>

## How should you estimate performance?

<div class="lm-decide"><p class="lm-decide__by">Decided by how much data there is · how long one fit takes · whether settings are being tuned</p>
<div class="lm-options">
<div class="lm-option"><h4>One train/test split </h4><p>Hold back 20–30% once.</p><p><b>Choose it when</b> the data is very large, or one fit is expensive.</p><p><b>The catch</b> one noisy number: here anywhere from 0.55 to 0.90.</p></div>
<div class="lm-option is-here"><h4>k-fold cross-validation <span class="lm-option__here">This machine</span></h4><p>Each of k folds held back once; report the mean and spread.</p><p><b>Choose it when</b> the data is small or medium; k = 5 or 10 is the usual choice.</p><p><b>The catch</b> k fits instead of one.</p></div>
<div class="lm-option"><h4>Leave-one-out </h4><p>k = n: every single row held back once.</p><p><b>Choose it when</b> the data is tiny.</p><p><b>The catch</b> n fits; its estimate is nearly unbiased but varies a lot.</p></div>
<div class="lm-option"><h4>Repeated or nested CV </h4><p>k-fold several times with reshuffles, or inside an outer loop.</p><p><b>Choose it when</b> tuning settings and still wanting an honest final score.</p><p><b>The catch</b> many fits.</p></div>
</div></div>

## In scikit-learn

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

folds = StratifiedKFold(n_splits=5, shuffle=True, random_state=330)
scores = cross_val_score(model, X, y, cv=folds)
scores.mean(), scores.std()          # 0.725 ± 0.050 on the wine
```

## Where it goes wrong

- **Scaling before splitting.** If the scaler sees all the data, every fold leaks. Put preprocessing in a pipeline so it is refitted inside each fold.
- **Tuning and reporting on the same folds.** The score of the best setting is optimistic. Keep a final test set aside, or nest the cross-validation.
- **Unstratified folds on imbalanced classes.** A fold can end up with almost none of the rare class; StratifiedKFold keeps the mix.

## The numbers in the figure

| | |
|---|---|
| Data | 200 wines (100 red, 100 white) from the course's wine sample |
| Task | red or white, from alcohol and density |
| Model | `StandardScaler` then `LogisticRegression`, in a pipeline |
| Folds | `StratifiedKFold(k, shuffle=True, random_state=330)`, k = 3, 5, 10 |
| Tray | one card stands for five wines; tabbed cards are red |
| Tables | 200 single splits (seeds 0–199, stratified 80/20); 50 reshuffles per k |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 5.1: the validation set approach, leave-one-out and k-fold cross-validation.</span></p><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 2: better evaluation using cross-validation, and fine-tuning with grid search.</span></p><p><a href="https://scikit-learn.org/stable/modules/cross_validation.html">scikit-learn: Cross-validation ↗</a><br><span>Iterators, stratification, and pipelines to avoid leakage.</span></p></div>

