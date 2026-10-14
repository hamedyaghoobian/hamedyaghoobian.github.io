---
layout: learning-machines
title: "Linear regression and least squares · Learning Machines"
permalink: /tools/learning-machines/least-squares/
entry: least-squares
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">To predict a number from a number, draw a straight line through the data. Every bird the line misses is tied to it by a spring, straight up or down. A spring's energy grows with the square of its stretch, so the line the springs settle on is the line with the smallest sum of squared misses: the least-squares line.</p>

## The line and its misses

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\hat y = b_0 + b_1 x">\hat y = b_0 + b_1 x</span><span class="lm-formula__say">the prediction: an intercept b₀ plus a slope b₁ for each unit of x</span></div>

For each bird, the residual is e = y − ŷ: its actual body mass minus the line's prediction, measured straight up or down, never across. Least squares chooses b₀ and b₁ to make the sum of the squared residuals as small as possible:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\text{SSE} = \sum_{i=1}^{n} (y_i - \hat y_i)^2">\text{SSE} = \sum_{i=1}^{n} (y_i - \hat y_i)^2</span><span class="lm-formula__say">the sum of squared errors: the total energy in the springs</span></div>

## The solution, in closed form

Unlike most models, least squares has an exact answer:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="b_1=\frac{\sum (x-\bar x)(y-\bar y)}{\sum (x-\bar x)^2}\qquad b_0=\bar y - b_1\bar x">b_1=\frac{\sum (x-\bar x)(y-\bar y)}{\sum (x-\bar x)^2}\qquad b_0=\bar y - b_1\bar x</span><span class="lm-formula__say">the slope is how x and y vary together, divided by how x varies alone; the line passes through the mean point (x̄, ȳ)</span></div>

For all 342 penguins, body mass against flipper length:

| Quantity | Value |
|---|---|
| Mean flipper length x̄ | 200.92 mm |
| Mean body mass ȳ | 4,201.8 g |
| Σ(x − x̄)(y − ȳ) | 3,350,126 |
| Σ(x − x̄)² | 67,427 |
| Slope b₁ | 3,350,126 ÷ 67,427 = **49.69 g per mm** |
| Intercept b₀ | 4,201.8 − 49.69 × 200.92 = −5,780.8 g |
| RMSE | 393.1 g |
| R² | 0.759 |

The figure fits its own 40 birds, so its line is a little different (48.2 g per mm, through its own mean point). The intercept is the predicted mass at a flipper length of zero: meaningless in itself, but needed to place the line.

## Why squares?

Squaring makes every miss count positively, makes big misses count much more than small ones, and gives a smooth bowl with one bottom, which is why the answer has a formula. It also has a cost: a single far-off point pulls on the line in proportion to the square of its miss. Add one bird with a long flipper (230 mm) but a light body (2,700 g) to the 342, and the slope moves from 49.69 to 48.43 g per mm. Among 342 birds one point has limited pull; among the figure's 40 it has much more. Points far from the mean flipper length have the most leverage, because turning the line about its pivot moves the ends the most.

## Holding the others fixed

With more than one feature, each slope means "the change in y for one more unit of this feature, with the others held fixed", and that can be a different question from the one-feature slope:

| Model | Slope for bill depth |
|---|---|
| mass ~ bill depth | −191.64 g per mm |
| mass ~ flipper length + bill depth | +22.63 g per mm |

On its own, deeper bills go with *lighter* birds. That is because Gentoos, the heaviest species, have the shallowest bills. Once flipper length is in the model (and it largely separates the species), a deeper bill goes with a slightly heavier bird. Neither number is wrong; they answer different questions. In the two-feature model the flipper slope is 51.54 g per mm.

## What least squares assumes

The line is a good summary when the relationship really is close to straight, the spread of the misses is about the same all along it, and the misses of different birds are unrelated. A residual plot (residual against prediction) checks all three at a glance: it should look like a structureless band around zero. A curve in it means the relationship bends; a funnel means the spread changes.

## Try this

<div class="study-try" markdown="1">
Try this

1. Turn the rod flat (slope 0). What is this line predicting for every bird, and what is its RMSE?
2. Press **F** and let it settle. Where does it settle, and what is the RMSE now?
3. Turn the rod a little either way from the best slope. Which springs change the most?

<details markdown="1"><summary>What you should see</summary>

A flat rod through the pivot predicts the mean mass, 4,463 g, for everyone: RMSE **794 g**. The rod settles at **48.2 g per mm**, RMSE **390 g**, half the error of guessing the mean. The springs at the two ends stretch most when the rod turns, because they are farthest from the pivot (203 mm, 4,463 g). Points far from the mean flipper length have the most leverage over the slope.
</details>
</div>

## A line, or something more flexible?

<div class="lm-decide"><p class="lm-decide__by">Decided by how straight the relationship is · how many features there are · whether the model must be explained or extrapolated</p>
<div class="lm-options">
<div class="lm-option is-here"><h4>Least squares <span class="lm-option__here">This machine</span></h4><p>One straight line (or flat surface), fitted exactly.</p><p><b>Choose it when</b> the relationship is close to straight; you want slopes you can read.</p><p><b>The catch</b> outliers pull it; it cannot bend.</p></div>
<div class="lm-option"><h4>Ridge, lasso, elastic net </h4><p>Least squares with a penalty on large slopes.</p><p><b>Choose it when</b> there are many features, some related; you want to avoid overfitting or (lasso) drop useless features.</p><p><b>The catch</b> features must be scaled; the penalty strength is one more setting to choose.</p></div>
<div class="lm-option"><h4>k-NN regression </h4><p>Average the k nearest points.</p><p><b>Choose it when</b> the relationship bends in ways you cannot write down.</p><p><b>The catch</b> flattens at the edges; cannot extrapolate.</p><p class="lm-option__link"><a href="{{ base }}knn-regression/">k-NN regression →</a></p></div>
</div></div>

## In scikit-learn

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(penguins[["flipper_length_mm"]], penguins.body_mass_g)
model.coef_, model.intercept_      # grams per mm, and the intercept
```

## Where it goes wrong

- **Outliers.** Squaring makes one far point pull the whole line toward it, as week 7 shows.
- **Reading the slope as cause.** 48 g per mm describes these penguins; it does not say that longer flippers make a heavier bird.
- **Predicting outside the data.** The line keeps going past the shortest and longest flippers measured; the penguins may not.

## The numbers in the figure

| | |
|---|---|
| Data | 40 of the 342 penguins, sampled with seed 330: body mass (g) against flipper length (mm) |
| Line | least squares on those 40: 48.2 g per mm, through their mean point (203.0 mm, 4,463 g) |
| Springs | one per bird, vertical: the residuals |
| Gauges | RMSE of the rod you set, and how many times the best RMSE (390 g) that is |
| Tables | all 342 birds; cross-validated RMSE of the one-feature line, 5-fold: 395.5 g |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Chapter 3: simple and multiple linear regression (3.1, 3.2) and potential problems (3.3.3).</span></p><p><a href="https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/">Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 3rd ed. (Géron, 2022) ↗</a><br><span>Chapter 4: the normal equation and linear regression.</span></p><p><a href="https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares">scikit-learn: Ordinary Least Squares ↗</a><br><span>LinearRegression, and the regularised models after it.</span></p></div>

