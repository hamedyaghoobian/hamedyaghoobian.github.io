"""
Builds assets/js/csi330-data.js: the numbers behind the CSI 330 study page
(csi-330.md), one block per week, computed from the course's own datasets.

    python3 scripts/csi330_data.py "<course>/Data"

The figures draw and compute from these numbers in the browser (neighbours,
residuals, thresholds, folds), so every reading on the page is what
scikit-learn gives for the same data. Week 1 uses simulated data and says so.
"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

DATA = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / "assets/js/csi330-data.js"
r = lambda v, n=3: round(float(v), n)

# ── Week 1: bias and variance, on simulated data (a noisy sine) ────────────
rng = np.random.default_rng(330)
xs = np.sort(rng.uniform(0, 1, 40))
truth = lambda x: np.sin(2 * np.pi * x)
ys = truth(xs) + rng.normal(0, 0.28, xs.size)
tr = np.zeros(xs.size, bool); tr[rng.choice(xs.size, 20, replace=False)] = True
grid = np.linspace(0, 1, 61)
fits = []
for deg in range(1, 13):
    m = make_pipeline(PolynomialFeatures(deg), LinearRegression()).fit(xs[tr, None], ys[tr])
    rmse = lambda mask: np.sqrt(np.mean((m.predict(xs[mask, None]) - ys[mask]) ** 2))
    fits.append({"deg": deg, "curve": [r(v) for v in np.clip(m.predict(grid[:, None]), -2.2, 2.2)],
                 "train": r(rmse(tr)), "test": r(rmse(~tr))})
week1 = {"x": [r(v) for v in xs], "y": [r(v) for v in ys], "train": tr.astype(int).tolist(),
         "grid": [r(v) for v in grid], "fits": fits}

# ── Penguins (weeks 2–4) ─────────────────────────────────────────────────
M = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
peng = pd.read_csv(DATA / "penguins.csv").dropna(subset=M).reset_index(drop=True)
assert len(peng) == 342
SP = ["Adelie", "Chinstrap", "Gentoo"]
week2 = {"species": SP, "birds": [[r(a, 1), r(b, 1), SP.index(s)] for a, b, s in
                                  zip(peng.bill_length_mm, peng.bill_depth_mm, peng.species)]}
# check the page's k-NN against scikit-learn's on one query
knn = make_pipeline(StandardScaler(), KNeighborsClassifier(5)).fit(peng[M[:2]], peng.species)
week2["check"] = {"query": [45.0, 17.0], "k": 5, "scaled": knn.predict(pd.DataFrame([[45.0, 17.0]], columns=M[:2]))[0]}

# Week 2, logistic regression: P(Adelie) from bill length, as in Lecture 2.2
from sklearn.metrics import log_loss
adelie = (peng.species == "Adelie").astype(int)
# unregularised (C = inf), as the lecture fits it, so the weights match its slides
logit = LogisticRegression(C=np.inf, max_iter=20000).fit(peng[["bill_length_mm"]], adelie)
week2lr = {"w0": r(logit.intercept_[0], 4), "w1": r(logit.coef_[0, 0], 4),
           "loss": r(log_loss(adelie, logit.predict_proba(peng[["bill_length_mm"]])[:, 1]), 4)}

nb = GaussianNB().fit(peng[["bill_length_mm"]], peng.species)
week3 = {s: {"mu": r(nb.theta_[i, 0], 4), "sd": r(np.sqrt(nb.var_[i, 0]), 4), "prior": r(nb.class_prior_[i], 4),
             "n": int((peng.species == s).sum())} for i, s in enumerate(SP)}

# Week 4–5: body mass from flipper length; a fixed sample of 40 birds to draw,
# the least-squares line fitted on all 342.
ols = LinearRegression().fit(peng[["flipper_length_mm"]], peng.body_mass_g)
samp = peng.sample(40, random_state=330).sort_values("flipper_length_mm")
week4 = {"b0": r(ols.intercept_, 2), "b1": r(ols.coef_[0], 3),
         "pts": [[int(f), int(m)] for f, m in zip(samp.flipper_length_mm, samp.body_mass_g)],
         "all": [[int(f), int(m)] for f, m in zip(peng.flipper_length_mm, peng.body_mass_g)]}

# ── NHANES diabetes (weeks 6–7) ──────────────────────────────────────────
dia = pd.read_csv(DATA / "diabetesNHANES.csv").dropna(subset=["glucose", "insulin", "outcome"])
Xtr, Xte, ytr, yte = train_test_split(dia[["glucose"]], dia.outcome, test_size=0.3, random_state=330, stratify=dia.outcome)
lr = LogisticRegression().fit(Xtr, ytr)
p = lr.predict_proba(Xte)[:, 1]
week6 = {"n": int(len(yte)), "scores": [[r(pi, 4), int(yi)] for pi, yi in sorted(zip(p, yte))],
         "w": [r(lr.intercept_[0], 4), r(lr.coef_[0, 0], 4)]}
# Week 7: insulin from glucose, least squares; 30 people to draw and drag
# thirty typical participants (insulin under 60, glucose under 12), so the outlier is the one you make
d7 = dia[(dia.insulin < 60) & (dia.glucose < 12)].sample(30, random_state=330)
lin = LinearRegression().fit(dia[["glucose"]], dia.insulin)
week7 = {"b0": r(lin.intercept_, 3), "b1": r(lin.coef_[0], 3),
         "pts": [[r(g, 2), r(i, 2)] for g, i in zip(d7.glucose, d7.insulin)]}

# ── Wine (week 8): red or white from alcohol and density, k-fold ─────────
wine = pd.read_csv(DATA / "wine_sample.csv").dropna(subset=["alcohol", "density", "type"])
Xw, yw = wine[["alcohol", "density"]].to_numpy(), (wine.type == "red").astype(int).to_numpy()
folds = {}
for k in (3, 5, 10):
    accs = []
    for tri, tei in StratifiedKFold(k, shuffle=True, random_state=330).split(Xw, yw):
        mdl = make_pipeline(StandardScaler(), LogisticRegression()).fit(Xw[tri], yw[tri])
        accs.append(r(mdl.score(Xw[tei], yw[tei])))
    folds[k] = accs
week8 = {"n": int(len(wine)), "red": int(yw.sum()), "folds": folds}

data = {"w1": week1, "w2": week2, "w2lr": week2lr, "w3": week3, "w4": week4, "w6": week6, "w7": week7, "w8": week8}
OUT.write_text("// Generated by scripts/csi330_data.py from the CSI 330 course datasets. Do not edit by hand.\n"
               "window.CSI330 = " + json.dumps(data, separators=(",", ":")) + ";\n")
print("wrote", OUT, f"{OUT.stat().st_size // 1024} KB")
print("w2 check", week2["check"], "| w2lr", week2lr, "| w4", week4["b0"], week4["b1"], "| w6 n", week6["n"], week6["w"],
      "| w7", week7["b0"], week7["b1"], "| w8", {k: round(np.mean(v), 3) for k, v in folds.items()}, week8["n"])
print("w1", [(f["deg"], f["train"], f["test"]) for f in fits])
