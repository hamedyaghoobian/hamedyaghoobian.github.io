---
layout: learning-machines
title: "Regression metrics · Learning Machines"
permalink: /tools/learning-machines/regression-metrics/
entry: regression-metrics
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">A regression model's mistakes are distances: how far each prediction lands from the truth. MAE, RMSE and R² are three ways of summarising the same list of misses, and they disagree in exactly the cases that matter. Drag one point away from the line and watch them part company.</p>

## The misses

<div class="lm-formula"><span class="lm-formula__eq" data-tex="e_i = y_i - \hat y_i">e_i = y_i - \hat y_i</span><span class="lm-formula__say">each residual: the actual value minus the prediction, positive when the model guesses too low</span></div>

## Three summaries

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\text{MAE} = \frac{1}{n}\sum_{i=1}^{n} |e_i| \qquad \text{RMSE} = \sqrt{\frac{1}{n}\sum_{i=1}^{n} e_i^2}">\text{MAE} = \frac{1}{n}\sum_{i=1}^{n} |e_i| \qquad \text{RMSE} = \sqrt{\frac{1}{n}\sum_{i=1}^{n} e_i^2}</span><span class="lm-formula__say">MAE: the typical size of a miss · RMSE: the root of the average squared miss, in the same units as y</span></div>

<div class="lm-formula"><span class="lm-formula__eq" data-tex="R^2 = 1 - \frac{\sum_i e_i^2}{\sum_i (y_i - \bar y)^2}">R^2 = 1 - \frac{\sum_i e_i^2}{\sum_i (y_i - \bar y)^2}</span><span class="lm-formula__say">R²: one minus the model’s squared misses as a share of the misses you would make by always guessing the mean</span></div>

MAE and RMSE are in the units of the target (here µU/mL of insulin); R² has no units. RMSE is never smaller than MAE, and the gap between them grows with how unequal the misses are: if every miss were the same size, the two would be equal.

## One outlier

Thirty participants as measured, then the same thirty with one person's insulin moved from 35 to 150:

| | MAE | RMSE | R² |
|---|---|---|---|
| As measured | 7.3 | 8.4 | 0.18 |
| One outlier | 11.2 | 24.5 | 0.12 |
| Change | ×1.5 | ×2.9 | −0.06 |

The line predicts about 24 for that person, so their miss grows from 11 to 126. Squared, 126 is 15,876, about eight times the other 29 squared misses together, and RMSE nearly triples. MAE grows only by the extra miss divided by 30: (126 − 11) ÷ 30 ≈ 3.8. R² barely moves, because the outlier also raises the spread of insulin around its mean, the denominator, almost as much as it raises the numerator.

## The losses behind the metrics

Each metric corresponds to a loss a model can be trained to minimise, and the choice decides how much a model bends toward outliers:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="L_\delta(e) = \begin{cases} \tfrac12 e^2 &amp; |e| \le \delta \\ \delta\,(|e| - \tfrac12\delta) &amp; |e| &gt; \delta \end{cases}">L_\delta(e) = \begin{cases} \tfrac12 e^2 &amp; |e| \le \delta \\ \delta\,(|e| - \tfrac12\delta) &amp; |e| &gt; \delta \end{cases}</span><span class="lm-formula__say">Huber loss: squared for small misses, absolute for large ones, switching at δ</span></div>

| Miss \|e\| | 1 | 5 | 20 | 100 |
|---|---|---|---|---|
| Absolute loss | 1 | 5 | 20 | 100 |
| Squared loss | 1 | 25 | 400 | 10,000 |
| Huber loss, δ = 10 | 0.5 | 12.5 | 150 | 950 |

A squared loss treats a miss of 100 as 10,000 times worse than a miss of 1; an absolute loss as 100 times worse. Least squares minimises the squared loss, which is why one outlier can pull the [line]({{ base }}least-squares/). Huber's loss is squared near zero (smooth, easy to minimise) and absolute far out (robust).

## Reading R²

R² = 0.18 means this line removes 18% of the squared variation in insulin. That is low, but it does not make the model wrong: insulin varies a great deal between people with the same glucose, and no function of glucose alone could remove that. R² can be negative on new data, when a model does worse than guessing the mean. And because it depends on how spread out the target is, R² values from different datasets cannot be compared.

## Try this

<div class="study-try" markdown="1">
Try this

1. Press **R**, then write down MAE and RMSE.
2. Drag the rightmost point (glucose 10.5) up to an insulin of 150. Before you look, predict which metric grows more.
3. R² barely changes. Look at its formula in the calculation: why?

<details markdown="1"><summary>What you should see</summary>

Before: MAE **7.3**, RMSE **8.4**. After making one outlier: MAE **11.2** (up about half) and RMSE **24.5** (almost three times). One large miss, once squared, outweighs the other 29. R² only falls from 0.18 to 0.12: the outlier enlarges the squared error, but it also pulls the mean up and enlarges the spread around it (the denominator), so the ratio moves less. Report MAE and RMSE together: a big gap between them means a few large errors.
</details>
</div>

## Which error should you report?

<div class="lm-decide"><p class="lm-decide__by">Decided by whether large misses are much worse than small ones · whether outliers are errors or real · who will read the number</p>
<div class="lm-options">
<div class="lm-option"><h4>MAE </h4><p>The typical miss, in the target’s units.</p><p><b>Choose it when</b> every unit of error costs the same, or the data has outliers you do not want to dominate.</p><p><b>The catch</b> hides whether a few misses are very large.</p></div>
<div class="lm-option"><h4>RMSE </h4><p>The root mean squared miss, in the target’s units.</p><p><b>Choose it when</b> large misses are disproportionately bad; it matches a least-squares fit.</p><p><b>The catch</b> one outlier can dominate it.</p></div>
<div class="lm-option"><h4>R² </h4><p>The share of variation removed, compared with guessing the mean.</p><p><b>Choose it when</b> comparing models on the same data and target.</p><p><b>The catch</b> not comparable across datasets; says nothing about the size of misses in units.</p></div>
</div></div>

Reporting MAE and RMSE together is cheap and informative: a big gap between them is itself a finding.

## In scikit-learn

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

mean_absolute_error(y_test, y_pred)
mean_squared_error(y_test, y_pred) ** 0.5     # RMSE
r2_score(y_test, y_pred)
```

## Where it goes wrong

- **Reporting one of them alone.** A big gap between MAE and RMSE is itself information: a few large misses.
- **R² across datasets.** It depends on how spread out the target is, so it cannot compare models fitted to different data.
- **Units.** MAE and RMSE are in the target's units (µU/mL here); R² has none.

## The numbers in the figure

| | |
|---|---|
| Data | 30 NHANES participants with insulin under 60 and glucose under 12, sampled with seed 330 |
| Model | least squares of insulin on glucose, fitted on every participant: ŷ = 2.62 + 2.00 × glucose |
| Outlier | the participant with the highest glucose (10.5), insulin moved from 35 to 150 |
| Gauges | MAE, RMSE and R² on the 30 points, recomputed as you drag |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 2: selecting a performance measure, RMSE and MAE, and the norms behind them.</span></p><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 3.1.3: assessing the accuracy of the model, RSE and R².</span></p><p><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics">scikit-learn: Regression metrics ↗</a><br><span>MAE, MSE, R² and their relatives.</span></p></div>

