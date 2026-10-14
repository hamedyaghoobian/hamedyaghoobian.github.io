---
layout: learning-machines
title: "k-NN regression · Learning Machines"
permalink: /tools/learning-machines/knn-regression/
entry: knn-regression
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">k-NN can predict a number as well as a class: find the k nearest birds, and instead of letting them vote, average them. It makes no assumption about the shape of the relationship at all, which is both its strength and, at the edges of the data, its weakness.</p>

## Average instead of vote

<div class="lm-formula"><span class="lm-formula__eq" data-tex="\hat y = \frac{y_1+y_2+\cdots+y_k}{k}">\hat y = \frac{y_1+y_2+\cdots+y_k}{k}</span><span class="lm-formula__say">the prediction is the mean body mass of the k birds whose flipper length is nearest</span></div>

The prediction curve is a staircase: it only changes when the set of nearest birds changes. With k = 1 it copies whichever bird is nearest, noise and all. With k = 342 it predicts the overall mean, 4,202 g, for every bird.

## Choosing k

Cross-validated RMSE, predicting body mass from flipper length (5-fold):

| k | 1 | 3 | 5 | 15 | 45 | 150 |
|---|---|---|---|---|---|---|
| RMSE (g) | 566.7 | 464.9 | 430.0 | 392.7 | **387.1** | 495.1 |

Small k has high variance: k = 1 is 46% worse than the best. Large k has high bias: by k = 150 the average reaches so far along the axis that it flattens the trend. The best, around k = 45, is 387 g.

## A line is hard to beat here

The straight [least-squares line]({{ base }}least-squares/) on the same feature scores 395.5 g by the same cross-validation, within 2% of the best k-NN. The relationship between flipper length and mass really is close to straight, so the flexibility k-NN offers buys almost nothing, and the line gives a slope you can read (about 50 g per mm) where k-NN gives none. When the true relationship is close to the shape a simpler model assumes, the simpler model wins.

## The edges

Near the shortest and longest flippers, all of a point's neighbours lie on one side of it. The average is pulled back toward the middle, so the prediction curve flattens at both ends, below the trend at the top and above it at the bottom. And k-NN can never predict beyond the range of masses it has seen: ask it about a 260 mm flipper and it answers with the mean of the longest-flippered birds it knows.

## Weighting by distance

By default every one of the k neighbours counts equally. With `weights="distance"`, each counts in proportion to 1 ÷ its distance, so the nearest birds dominate and the prediction follows local detail more closely. Birds at exactly the same flipper length as the query count infinitely, which is common here: flipper lengths are whole millimetres, and many birds share each one.

## More than one feature

With several features, distance needs every feature on the same scale, exactly as for [k-NN classification]({{ base }}k-nearest-neighbors/). And as features are added, neighbours get farther away and less alike; a few informative features work far better than many.

## Try this

<div class="study-try" markdown="1">
Try this

1. Put the pointer at 200 mm and step k through 1, 5, 15 and 150 (**↑ ↓**). Write down each prediction.
2. Compare the dashed trace at k = 1 and at k = 150 with the faint straight line.
3. Why does k = 150 flatten the trace near the two ends of the axis?

<details markdown="1"><summary>What you should see</summary>

At 200 mm: k = 1 gives **4,050 g**, k = 5 gives 3,795 g, k = 15 gives 3,953 g and k = 150 gives 3,909 g. The least-squares line predicts 4,156 g. At k = 1 the trace jumps from bird to bird. At k = 150 it is smooth but too flat: near the ends, most of the 150 neighbours lie toward the middle, so the average is pulled back toward the overall mean (4,202 g). This is bias, and it's why k-NN struggles at the edges of the data.
</details>
</div>

## Which model for a number?

<div class="lm-decide"><p class="lm-decide__by">Decided by the shape of the relationship · how much data there is · whether you need to extrapolate or explain</p>
<div class="lm-options">
<div class="lm-option is-here"><h4>k-NN regression <span class="lm-option__here">This machine</span></h4><p>Average the k nearest.</p><p><b>Choose it when</b> the relationship bends unpredictably and data is plentiful in the range you will predict.</p><p><b>The catch</b> flattens at the edges, cannot extrapolate, gives no slope to read.</p></div>
<div class="lm-option"><h4>Least squares </h4><p>A straight line.</p><p><b>Choose it when</b> the relationship is close to straight, or you need slopes and extrapolation.</p><p><b>The catch</b> cannot bend; outliers pull.</p><p class="lm-option__link"><a href="{{ base }}least-squares/">Least squares →</a></p></div>
<div class="lm-option"><h4>Polynomial regression </h4><p>A curve: least squares on powers of x.</p><p><b>Choose it when</b> the relationship bends smoothly.</p><p><b>The catch</b> high degrees overfit and swing wildly at the edges.</p><p class="lm-option__link"><a href="{{ base }}bias-and-variance/">Bias and variance →</a></p></div>
</div></div>

## In scikit-learn

```python
from sklearn.neighbors import KNeighborsRegressor

model = KNeighborsRegressor(n_neighbors=5)
model.fit(penguins[["flipper_length_mm"]], penguins.body_mass_g)
model.predict([[200]])           # the mean mass of the 5 nearest birds
```

## Where it goes wrong

- **The edges.** Near the smallest and largest values, all the neighbours lie on one side, so predictions flatten toward the middle.
- **It cannot extrapolate.** It never predicts outside the range of masses it has seen.
- **Ties at equal distance.** Many birds share one flipper length; which of them count as the k nearest depends on their order in the data.

## The numbers in the figure

| | |
|---|---|
| Data | the 342 Palmer penguins: body mass (g) against flipper length (mm) |
| Model | the mean mass of the k nearest birds by flipper length; ties in distance broken by order in the data |
| Trace | the prediction at every 0.5 mm from 172 to 231 mm |
| Faint line | least squares on all 342: 49.69 g per mm |
| Table | 5-fold cross-validation, shuffled with seed 330, `KNeighborsRegressor(k)` |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 3.5: comparison of linear regression with K-nearest neighbors, including when the line wins.</span></p><p><a href="https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors-regression">scikit-learn: Nearest Neighbors Regression ↗</a><br><span>KNeighborsRegressor and distance weighting.</span></p></div>

