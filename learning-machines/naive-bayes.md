---
layout: learning-machines
title: "Gaussian naive Bayes · Learning Machines"
permalink: /tools/learning-machines/naive-bayes/
entry: naive-bayes
---
{%- assign base = "/tools/learning-machines/" | relative_url -%}

<p class="lm-lede">Naive Bayes turns the question around. Instead of asking directly which species a bill length belongs to, it asks how likely that bill length would be for each species, and how common each species is, and weighs the two. The balance in the figure does that weighing with blocks: one per species, its footprint the prior, its height the likelihood.</p>

## Bayes' rule

<div class="lm-formula"><span class="lm-formula__eq" data-tex="P(\text{species}\mid x) = \frac{P(x\mid \text{species})\;P(\text{species})}{P(x)}">P(\text{species}\mid x) = \frac{P(x\mid \text{species})\;P(\text{species})}{P(x)}</span><span class="lm-formula__say">posterior = likelihood × prior ÷ evidence: how probable the species is once you have seen the measurement x</span></div>

**P(species)** is the prior: how common the species is before measuring anything. **P(x ∣ species)** is the likelihood: how typical this measurement is for that species. **P(x)** is the same for every species, so it only rescales the answers to add up to 1. The prediction is the species with the largest likelihood × prior; the figure's spring scales weigh exactly that product.

## The likelihood is a bell curve

Gaussian naive Bayes assumes each species' measurements follow a normal (bell) curve, and fits one by taking the mean and standard deviation of that species' training birds:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="P(x\mid\text{species}) = \frac{1}{\sigma\sqrt{2\pi}}\;e^{-\frac{(x-\mu)^2}{2\sigma^2}}">P(x\mid\text{species}) = \frac{1}{\sigma\sqrt{2\pi}}\;e^{-\frac{(x-\mu)^2}{2\sigma^2}}</span><span class="lm-formula__say">the height of the species’ bell curve at x: tallest at the mean μ, falling off over a spread of σ</span></div>

| Species | Mean bill (μ) | Spread (σ) | Birds | Prior |
|---|---|---|---|---|
| Adelie | 38.79 mm | 2.65 mm | 151 | 0.442 |
| Chinstrap | 48.83 mm | 3.31 mm | 68 | 0.199 |
| Gentoo | 47.50 mm | 3.07 mm | 123 | 0.360 |

That is the whole model: two numbers per species and feature, plus the priors. Six numbers and three priors describe all 342 birds.

## Weighing a 50 mm bill

| Species | Prior | × Likelihood at 50 mm | = Weight | Posterior |
|---|---|---|---|---|
| Adelie | 0.442 | 0.00002 | 0.000009 | 0.00 |
| Chinstrap | 0.199 | 0.1131 | 0.0225 | 0.40 |
| Gentoo | 0.360 | 0.0934 | 0.0336 | **0.60** |
| | | | Σ = 0.0561 | |

Chinstrap's curve is taller at 50 mm (0.113 against 0.093), but Gentoos are almost twice as common (123 birds to 68), so Gentoo's block weighs more. Adelie's prior is the largest of all, and still counts for nothing: 50 mm is more than four of its standard deviations from its mean, and a large prior times nearly zero is nearly zero.

## The prior can change the answer

| Bill length | Priors from the data | Equal priors |
|---|---|---|
| 42 mm | Adelie 0.72 | Adelie 0.64 |
| 50 mm | **Gentoo 0.60** | **Chinstrap 0.55** |
| 56 mm | Chinstrap 0.69 | Chinstrap 0.80 |

The prior only decides where two curves are about the same height: at 50 mm, but not at 42 or 56. Change the priors when the mix in the training data is not the mix the model will meet; if a colony had equal numbers of each species, the equal-prior column would be the honest one.

## What "naive" means

With more than one measurement, naive Bayes multiplies the likelihoods of each as if they were independent once the species is known:

<div class="lm-formula"><span class="lm-formula__eq" data-tex="P(x_1,x_2\mid \text{species}) \approx P(x_1\mid\text{species})\;P(x_2\mid\text{species})">P(x_1,x_2\mid \text{species}) \approx P(x_1\mid\text{species})\;P(x_2\mid\text{species})</span><span class="lm-formula__say">the naive assumption: within a species, one measurement tells you nothing about another</span></div>

For penguins it is false. Within each species, birds with longer bills have deeper bills: the correlation between bill length and depth is 0.39 for Adelie, 0.65 for Chinstrap and 0.64 for Gentoo. Multiplying counts the shared information twice, which makes the model too sure of itself. Out of fold, on bill length and depth together:

| | Naive Bayes | Logistic regression |
|---|---|---|
| Accuracy | 0.933 | 0.956 |
| Average probability given to its own prediction | 0.951 | 0.918 |

Naive Bayes is right 93% of the time but, on average, 95% sure: overconfident. Logistic regression is the other way round. The predicted class is often fine even when the assumption is wrong; the probabilities are what suffer. Adding the second measurement still helps a lot: one feature gives naive Bayes 0.766, two give 0.933.

## Why use it at all

It needs very little data, because it estimates only a mean and a spread per class and feature. It is fast to fit and to use. It handles many features gracefully, which is why its cousins (multinomial and Bernoulli naive Bayes) remain good baselines for text, where there are thousands of word features. And the prior is explicit, so knowledge from outside the data can be put in directly.

## Try this

<div class="study-try" markdown="1">
Try this

1. Weigh birds at 42, 50 and 56 mm, each with both priors (**P**). For which length does the prior change the answer?
2. Adelie is the most common species (prior 0.442). At 50 mm, why does it get almost no weight?
3. In the calculation, compare Chinstrap's and Gentoo's likelihoods at 50 mm, then their priors.

<details markdown="1"><summary>What you should see</summary>

| bill length | priors from the data | equal priors |
|---|---|---|
| 42 mm | Adelie 0.72 | Adelie 0.64 |
| 50 mm | **Gentoo 0.60** | **Chinstrap 0.55** |
| 56 mm | Chinstrap 0.69 | Chinstrap 0.80 |

Only 50 mm flips. Adelie bills average 38.8 mm with a spread of 2.7 mm, so 50 mm is about four spreads away and the likelihood is almost zero: a large prior times nearly zero is still nearly zero. At 50 mm, Chinstrap's curve is a little taller than Gentoo's, but Gentoo's prior is almost twice as large (123 birds to 68), so with the data's priors Gentoo wins. With equal priors, only the heights count.
</details>
</div>

## Generative or discriminative?

<div class="lm-decide"><p class="lm-decide__by">Decided by how much data there is · whether the features are related · whether outside knowledge of the class mix exists</p>
<div class="lm-options">
<div class="lm-option is-here"><h4>Gaussian naive Bayes <span class="lm-option__here">This machine</span></h4><p>Model each class as independent bell curves; apply Bayes’ rule.</p><p><b>Choose it when</b> data is small, features are many, or the priors come from outside the data.</p><p><b>The catch</b> related features make its probabilities overconfident.</p></div>
<div class="lm-option"><h4>Linear discriminant analysis </h4><p>Model each class as one bell surface over all features at once, sharing one covariance.</p><p><b>Choose it when</b> features are related and roughly normal; you want the generative view without the naive assumption.</p><p><b>The catch</b> more parameters to estimate; straight boundaries only.</p></div>
<div class="lm-option"><h4>Logistic regression </h4><p>Skip the class models and fit the boundary directly.</p><p><b>Choose it when</b> you have enough data and care most about calibrated probabilities.</p><p><b>The catch</b> no priors to set by hand; straight boundaries.</p><p class="lm-option__link"><a href="{{ base }}logistic-regression/">Logistic regression →</a></p></div>
</div></div>

## In scikit-learn

```python
from sklearn.naive_bayes import GaussianNB

model = GaussianNB()                      # priors from the data by default
model.fit(penguins[["bill_length_mm"]], penguins.species)
model.predict_proba([[50.0]])             # Adelie 0.00 · Chinstrap 0.40 · Gentoo 0.60

GaussianNB(priors=[1/3, 1/3, 1/3])        # equal priors: 50 mm becomes Chinstrap
```

## Where it goes wrong

- **The naive assumption.** With several features, it multiplies their likelihoods as if they were independent given the class. Bill length and depth are not, so the probabilities come out overconfident, even when the predicted class is right.
- **Not bell-shaped.** A feature with two humps or a long tail is badly described by one bell curve.
- **Priors from a skewed sample.** If the training mix differs from the world the model will meet, set the priors yourself.

## The numbers in the figure

| | |
|---|---|
| Data | the 342 Palmer penguins; one feature, bill length |
| Model | `GaussianNB()`, fitted on all 342; means, spreads and priors as in the table above |
| Balance | block footprint ∝ prior, height ∝ likelihood; spring stretch ∝ prior × likelihood, on one scale for every length and both priors |
| Comparison table | bill length and depth; 5-fold stratified cross-validation, seed 330; probabilities out of fold |
{: .lm-facts}

<div class="lm-sources" markdown="0"><h3>Sources & further reading</h3><p><a href="https://www.statlearning.com/">An Introduction to Statistical Learning, 2nd ed. (James, Witten, Hastie, Tibshirani, 2021) ↗</a><br><span>Section 4.4: generative models for classification, including linear discriminant analysis and naive Bayes (4.4.4).</span></p><p><a href="https://statquest.org/statquest-store/">The StatQuest Illustrated Guide to Machine Learning (Starmer, 2022) ↗</a><br><span>Chapter on naive Bayes, with the multiplying of likelihoods drawn out.</span></p><p><a href="https://scikit-learn.org/stable/modules/naive_bayes.html">scikit-learn: Naive Bayes ↗</a><br><span>GaussianNB and its cousins for counts and text.</span></p></div>

