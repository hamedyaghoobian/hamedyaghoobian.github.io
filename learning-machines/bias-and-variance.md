---
layout: learning-machines
title: "Bias and variance · Learning Machines"
permalink: /tools/learning-machines/bias-and-variance/
entry: bias-and-variance
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">A model is a guess about the shape of the data. Make the guess too stiff and it misses the pattern everywhere; make it too flexible and it bends to fit the noise in the few points it happened to see. The machine fits polynomials of degree 1 to 12 to the same twenty noisy points, and keeps twenty more back that it never fits, so both kinds of error happen in front of you.</p>

## Three sources of error

When a model predicts a new point, its error comes from three places. **Bias** is how far its *average* guess is from the truth: the error it would still make if you could train it on a thousand different samples and average them. **Variance** is how much its guess moves from one training sample to the next. **Noise** is the part of the data that no model can predict.

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\mathbb{E}\big[(y-\hat y)^2\big] = \text{bias}^2 + \text{variance} + \sigma^2">\mathbb{E}\big[(y-\hat y)^2\big] = \text{bias}^2 + \text{variance} + \sigma^2</span><span class="lm-formula__say">expected squared error on new data = how wrong the average model is, squared + how much the model moves with the sample + the noise in the data</span></div>

Here the data are a sine wave with noise of standard deviation σ = 0.28 added, so $$\sigma^2 = 0.078$$ is a floor: no model, however good, can get its expected squared error below it, or its RMSE below 0.28.

## Measuring the trade-off

The figure shows one training sample. To see bias and variance separately, the same experiment was run on 300 fresh training sets of 20 points each, every one fitted at five degrees, and the fits compared with the true curve:

| Degree | Bias² | Variance | Noise | Expected error |
|---|---|---|---|---|
| 1 | **0.155** | 0.029 | 0.078 | 0.263 |
| 3 | 0.003 | 0.020 | 0.078 | **0.101** |
| 5 | 0.000 | 0.066 | 0.078 | 0.144 |
| 9 | 0.003 | 0.735 | 0.078 | 0.816 |
| 12 | 0.015 | **2.524** | 0.078 | 2.618 |

A straight line (degree 1) has almost all its error in bias: it cannot bend, so it is wrong in the same way every time. By degree 3 the bias has nearly gone and the total is smallest. Past that, every further bit of flexibility buys almost no bias and costs a great deal of variance: at degree 12 the fitted curve changes so much from sample to sample that its average error is twenty-five times the best.

On the figure's single sample, the test error happens to be lowest at degree 5 (0.357), not 3. One test set of 20 points is itself a noisy measurement; that is the problem [cross-validation]({{ base }}cross-validation/) solves.

## Training error always falls

Each degree can do everything the lower degrees can, and more, so its training error can only go down: from 0.548 at degree 1 to 0.256 at degree 12. With 20 points and 13 coefficients, degree 12 is close to drawing a curve through every point.

Notice that 0.256 is *below* the noise level of 0.28. A model whose training error is lower than the noise in the data has started to fit the noise itself. A training error below the noise level is a warning, not an achievement.

## More data tames variance

Variance comes from the sample being small. Give the same flexible model more points and it has less room to chase any one of them. The median test RMSE of a degree-9 polynomial, over 200 repetitions at each size:

| Training points | 20 | 40 | 80 | 160 | 320 |
|---|---|---|---|---|---|
| Test RMSE, degree 9 | 0.875 | 0.342 | 0.300 | 0.291 | 0.285 |

At 20 points the model is erratic; at 320 it is within 0.005 of the floor of 0.28. Flexibility is safe when data is plentiful, and dangerous when it is scarce. Bias does not shrink this way: a straight line stays wrong however many points it sees.

## The same dial in every model

Every model in this collection has a setting that trades bias for variance:

| Model | Its dial | More flexible (less bias, more variance) when |
|---|---|---|
| Polynomial regression | degree | the degree is higher |
| [k-NN]({{ base }}k-nearest-neighbors/), [k-NN regression]({{ base }}knn-regression/) | k | k is smaller |
| [Logistic regression]({{ base }}logistic-regression/) | C | C is larger (less regularisation) |
| Ridge, lasso, elastic net | alpha | alpha is smaller |
| Decision tree | max_depth | the tree is deeper |

## Choosing the flexibility

Since training error always prefers the most flexible model, the choice has to be made on data the model did not fit: a validation set or, better, [cross-validation]({{ base }}cross-validation/). Plot the validation error against the dial and pick the bottom of the U, or the simplest model whose error is close to the bottom.

## Try this

<div class="study-try" markdown="1">
Try this

1. Start at degree 1. Before you move it, predict: as the degree rises, which error keeps falling and which one turns back up?
2. Find the degree with the lowest **test** error.
3. Go to degree 12. Its training error is the lowest of all. Would you choose it?

<details markdown="1"><summary>What you should see</summary>

Training error only falls (0.548 at degree 1, 0.256 at degree 12): more flexibility can always bend closer to the points it was fitted on. Test error falls to its lowest, **0.357 at degree 5**, then rises sharply: 1.848 at degree 11 and 4.42 at degree 12. Degree 12 has memorised the noise in its 20 training points. That is why a model is never chosen by its training error.
</details>
</div>

## How flexible should the model be?

<div class="lm-decide"><p class="lm-decide__by">Decided by how much data there is · how noisy it is · how complex the true pattern is · whether the model must be explained</p>
<div class="lm-options">
<div class="lm-option"><h4>A simple model </h4><p>Few parameters: a straight line, a low degree, a large k.</p><p><b>Choose it when</b> data is scarce or noisy; the model must be explained; a stable answer matters more than a perfect fit.</p><p><b>The catch</b> it misses real curvature, and no amount of data will fix that (bias).</p></div>
<div class="lm-option"><h4>A flexible model </h4><p>Many parameters: a high degree, a small k, a deep tree.</p><p><b>Choose it when</b> data is plentiful and the pattern is complicated.</p><p><b>The catch</b> with little data it fits the noise (variance), and it must be chosen by validation, never by training error.</p></div>
<div class="lm-option"><h4>A flexible model, regularised </h4><p>Many parameters, with a penalty on large weights that pulls the fit toward simplicity.</p><p><b>Choose it when</b> you want flexibility with a dial to control it, chosen by cross-validation.</p><p><b>The catch</b> one more setting to tune, and the penalty needs features on the same scale.</p><p class="lm-option__link"><a href="{{ base }}logistic-regression/">C in logistic regression →</a></p></div>
</div></div>

## In scikit-learn

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

for degree in range(1, 13):
    model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
    model.fit(X_train, y_train)
    # compare the error on (X_train, y_train) with the error on (X_test, y_test)
```

## Where it goes wrong

- **Choosing by training error.** It always prefers the most flexible model. Choose by error on data the model did not fit: a test set, or better, cross-validation.
- **One lucky split.** With only 20 test points, the "best" degree can move if the split changes. That is week 8's problem.
- **Bias and variance are not opposites you can both minimise.** Lowering one usually raises the other; the goal is the lowest total error on new data.

## The numbers in the figure

| | |
|---|---|
| Data | 40 points, x uniform on [0, 1], y = sin(2πx) + noise with σ = 0.28 (seed 330) |
| Split | 20 points to train, 20 to test, at random |
| Models | `PolynomialFeatures(d)` then `LinearRegression`, d = 1 … 12 |
| Error | RMSE on each half |
| Bias and variance table | 300 fresh training sets of 20; error measured on 50 points between 0.05 and 0.95; predictions clipped at ±5 |
| Data-size table | degree 9, 200 repetitions per size, 500 fresh test points each; median RMSE |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 2.2.2, the bias-variance trade-off, shown on simulated data much like this.</span></p><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 4: polynomial regression, learning curves and the bias/variance trade-off.</span></p><p><a href="https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html">scikit-learn: Underfitting vs. Overfitting ↗</a><br><span>The same experiment with a cosine, in code.</span></p></div>

