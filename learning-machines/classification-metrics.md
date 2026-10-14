---
layout: learning-machines
title: "Classification metrics · Learning Machines"
permalink: /tools/learning-machines/classification-metrics/
entry: classification-metrics
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">A classifier that gives probabilities still has to say yes or no, and every threshold it could use gives a different mix of right and wrong answers. The machine scores 517 people the model has never seen for diabetes, from their blood glucose alone, and sorts them into four trays as you move the threshold.</p>

## Four kinds of answer

Every prediction lands in one of four cells of the confusion matrix:

| | Predicted yes | Predicted no |
|---|---|---|
| **Has diabetes** | true positive (TP) | false negative (FN): a missed case |
| **Does not** | false positive (FP): a false alarm | true negative (TN) |

All the usual metrics are ratios of these four counts. They differ in which counts they look at, and so in which mistake they notice.

## Four rates

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\text{accuracy} = \frac{TP + TN}{TP + FN + FP + TN}">\text{accuracy} = \frac{TP + TN}{TP + FN + FP + TN}</span><span class="lm-formula__say">the share of all answers that are right</span></div>

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\text{precision} = \frac{TP}{TP + FP} \qquad \text{recall} = \frac{TP}{TP + FN} \qquad \text{specificity} = \frac{TN}{TN + FP}">\text{precision} = \frac{TP}{TP + FP} \qquad \text{recall} = \frac{TP}{TP + FN} \qquad \text{specificity} = \frac{TN}{TN + FP}</span><span class="lm-formula__say">precision: of those flagged, how many have it · recall (sensitivity): of those who have it, how many were flagged · specificity: of those who do not, how many were cleared</span></div>

## Moving the threshold

The same model, five thresholds, on the 517 held-out people (117 of whom have diabetes):

| Threshold | TP | FN | FP | TN | Accuracy | Precision | Recall | Specificity | F₁ | κ |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.1 | 108 | 9 | 190 | 210 | 0.615 | 0.362 | **0.923** | 0.525 | 0.520 | 0.290 |
| 0.2 | 91 | 26 | 52 | 348 | 0.849 | 0.636 | 0.778 | 0.870 | 0.700 | 0.601 |
| 0.3 | 76 | 41 | 22 | 378 | **0.878** | 0.776 | 0.650 | 0.945 | **0.707** | **0.631** |
| 0.5 | 59 | 58 | 13 | 387 | 0.863 | 0.819 | 0.504 | 0.968 | 0.624 | 0.546 |
| 0.7 | 43 | 74 | 5 | 395 | 0.847 | **0.896** | 0.368 | **0.988** | 0.521 | 0.449 |

Lowering the threshold moves people from the bottom row of each column to the top: false negatives become true positives (recall rises) and true negatives become false positives (precision falls). No threshold is best on every metric. 0.5 is only the default.

## Beware the base rate

Only 117 of the 517 (22.6%) have diabetes. A "model" that always says no is right about everyone else: accuracy **0.774**, recall 0. At threshold 0.5 the real model's accuracy, 0.863, is only nine points better than that, while missing half the people with diabetes. Accuracy rewards agreeing with the majority, so on a rare class it flatters. Always compare it with the base rate.

## One number from two: F₁ and κ

<div class="lm-formula"><span class="lm-formula__eq" data-tex="F_1 = \frac{2 \cdot \text{precision} \cdot \text{recall}}{\text{precision} + \text{recall}}">F_1 = \frac{2 \cdot \text{precision} \cdot \text{recall}}{\text{precision} + \text{recall}}</span><span class="lm-formula__say">the harmonic mean of precision and recall: high only when both are</span></div>

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\kappa = \frac{p_o - p_e}{1 - p_e}">\kappa = \frac{p_o - p_e}{1 - p_e}</span><span class="lm-formula__say">Cohen’s kappa: observed agreement p_o, corrected for the agreement p_e expected by chance given how often each answer is used</span></div>

Both peak at threshold 0.3 here (F₁ 0.707, κ 0.631), and both treat a false alarm and a missed case as equally bad. When they are not equally bad, as in screening, choose the threshold by the costs instead.

## Every threshold at once: ROC and AUC

Plotting recall (the true positive rate) against 1 − specificity (the false positive rate) for every possible threshold traces the ROC curve. The area under it, **AUC = 0.879** here, has a plain meaning: pick one person with diabetes and one without at random; 0.879 is the chance the model gives the first a higher score. It measures how well the scores rank people, independent of any threshold, so it is the number to compare models with before a threshold is chosen. 0.5 is a coin toss; 1 is perfect ranking.

## Try this

<div class="study-try" markdown="1">
Try this

1. At threshold 0.50, read accuracy and recall. Is this a good screening test?
2. Read the "always says no" figure in the calculation. What does it tell you about accuracy here?
3. Lower the threshold to 0.20, then to 0.10. Watch FN and FP trade places.

<details markdown="1"><summary>What you should see</summary>

At 0.50: accuracy **0.86**, but recall only **0.50**, so it misses 58 of the 117 people with diabetes. Only 23% of the test set has diabetes, so a model that always says "no" already scores **0.77**: accuracy flatters a rare class. At 0.20, recall rises to 0.78 and precision falls to 0.64. At 0.10, recall is 0.92, but 190 people without diabetes are flagged (precision 0.36). For screening, a missed case (FN) usually costs more than a false alarm (FP), so a lower threshold is defensible. The right threshold depends on those costs, not on the model.
</details>
</div>

## Which number should you report?

<div class="lm-decide"><p class="lm-decide__by">Decided by how rare the positive class is · what each kind of mistake costs · whether a threshold has been chosen yet</p>
<div class="lm-options">
<div class="lm-option"><h4>Accuracy </h4><p>The share of answers that are right.</p><p><b>Choose it when</b> the classes are roughly balanced and the two mistakes cost about the same.</p><p><b>The catch</b> flatters a model on a rare class; compare with the base rate.</p></div>
<div class="lm-option"><h4>Precision and recall </h4><p>How many alarms are real; how many real cases are caught.</p><p><b>Choose it when</b> one class matters more, as in screening or search.</p><p><b>The catch</b> two numbers, pulled in opposite directions by the threshold.</p></div>
<div class="lm-option"><h4>F₁ or κ </h4><p>One number that is high only when both precision and recall are.</p><p><b>Choose it when</b> you need a single score at a fixed threshold.</p><p><b>The catch</b> weighs both kinds of mistake equally.</p></div>
<div class="lm-option"><h4>ROC AUC </h4><p>How well the scores rank positives above negatives.</p><p><b>Choose it when</b> comparing models before choosing a threshold.</p><p><b>The catch</b> says nothing about any particular threshold; can look good on very rare classes.</p></div>
</div></div>

## In scikit-learn

```python
from sklearn.metrics import confusion_matrix, precision_score, recall_score

p = model.predict_proba(X_test)[:, 1]
y_pred = (p >= 0.2).astype(int)          # a threshold you chose, not the default 0.5
confusion_matrix(y_test, y_pred)
precision_score(y_test, y_pred), recall_score(y_test, y_pred)
```

## Where it goes wrong

- **Accuracy on a rare class.** When 77% of people don't have diabetes, "always no" scores 0.77. Always compare with that baseline.
- **One number for two kinds of error.** Report precision and recall, or the full confusion matrix, and say which error costs more.
- **Tuning the threshold on the test set.** Then the test score is no longer an honest estimate. Choose the threshold on validation data.

## The numbers in the figure

| | |
|---|---|
| Data | NHANES diabetes data, rows with glucose, insulin and outcome |
| Split | 70% to train, 30% (517 people) to test, stratified, seed 330 |
| Model | `LogisticRegression()` on glucose alone, default settings |
| Board | each test person at their predicted probability; jittered within their row |
| Table | the same 517 at five thresholds; AUC over all thresholds |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 3: confusion matrix, precision and recall, the precision/recall trade-off and the ROC curve.</span></p><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 4.4.2: the confusion matrix, thresholds and the ROC curve, on credit-default data.</span></p><p><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics">scikit-learn: Metrics and scoring ↗</a><br><span>Every classification metric, with its definition.</span></p></div>

