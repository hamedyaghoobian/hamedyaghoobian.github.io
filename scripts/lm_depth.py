"""
The tables in Learning Machines' entries (learning-machines/*.md), computed
from the course datasets. Prints them as JSON; the entries quote these
numbers. Re-run after a data change and update the prose to match.

    python3 scripts/lm_depth.py "<course>/Data" > /tmp/lm_depth.json
"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import roc_auc_score, f1_score, cohen_kappa_score
from sklearn.model_selection import StratifiedKFold, KFold, cross_val_score, train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

DATA = Path(sys.argv[1])
r = lambda v, n=3: round(float(v), n)
out = {}

# ── Bias and variance: the same noisy sine, many training sets ───────────
rng = np.random.default_rng(7)
f = lambda x: np.sin(2 * np.pi * x)
grid = np.linspace(0.05, 0.95, 50)
SIG = 0.28
bv = {}
for deg in (1, 3, 5, 9, 12):
    preds = []
    for _ in range(300):
        x = rng.uniform(0, 1, 20); y = f(x) + rng.normal(0, SIG, 20)
        m = make_pipeline(PolynomialFeatures(deg), LinearRegression()).fit(x[:, None], y)
        preds.append(np.clip(m.predict(grid[:, None]), -5, 5))
    P = np.array(preds)
    bias2 = np.mean((P.mean(0) - f(grid)) ** 2)
    var = np.mean(P.var(0))
    bv[deg] = {"bias2": r(bias2, 4), "var": r(var, 4), "noise": r(SIG ** 2, 4), "total": r(bias2 + var + SIG ** 2, 4)}
out["bv"] = bv
nn = {}
for n in (20, 40, 80, 160, 320):
    errs = []
    for _ in range(200):
        x = rng.uniform(0, 1, n); y = f(x) + rng.normal(0, SIG, n)
        xt = rng.uniform(0, 1, 500); yt = f(xt) + rng.normal(0, SIG, 500)
        m = make_pipeline(PolynomialFeatures(9), LinearRegression()).fit(x[:, None], y)
        errs.append(np.sqrt(np.mean((np.clip(m.predict(xt[:, None]), -5, 5) - yt) ** 2)))
    nn[n] = r(np.median(errs))
out["deg9_by_n"] = nn

# ── Penguins ─────────────────────────────────────────────────────────────
M = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
peng = pd.read_csv(DATA / "penguins.csv").dropna(subset=M).reset_index(drop=True)
SP = ["Adelie", "Chinstrap", "Gentoo"]
X2, ys = peng[["bill_length_mm", "bill_depth_mm"]], peng.species
cv = StratifiedKFold(5, shuffle=True, random_state=330)
out["knn_k"] = {k: r(cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(k)), X2, ys, cv=cv).mean())
                for k in (1, 3, 5, 9, 15, 25, 51, 101)}
out["knn_raw_vs_scaled"] = {
    "raw": r(cross_val_score(KNeighborsClassifier(5), X2, ys, cv=cv).mean()),
    "scaled": r(cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(5)), X2, ys, cv=cv).mean())}
# a worked query: the five nearest at 38 × 14 mm, both ways
q = np.array([38.0, 14.0]); sd = X2.std(ddof=0).to_numpy()
raw = np.hypot(*(X2.to_numpy() - q).T); sc = np.hypot(*((X2.to_numpy() - q) / sd).T)
out["knn_query"] = {
    "raw": [[r(peng.bill_length_mm[i], 1), r(peng.bill_depth_mm[i], 1), peng.species[i], r(raw[i], 2)] for i in np.argsort(raw, kind="stable")[:5]],
    "scaled": [[r(peng.bill_length_mm[i], 1), r(peng.bill_depth_mm[i], 1), peng.species[i], r(sc[i], 2)] for i in np.argsort(sc, kind="stable")[:5]],
    "sd": [r(v, 2) for v in sd]}

# Logistic regression: P(Adelie) from bill length
ad = (peng.species == "Adelie").astype(int)
lr = LogisticRegression(C=np.inf, max_iter=20000).fit(peng[["bill_length_mm"]], ad)
w0, w1 = lr.intercept_[0], lr.coef_[0, 0]
out["lr_odds"] = [[x, r(w0 + w1 * x, 2), r(1 / (1 + np.exp(-(w0 + w1 * x))), 3), r(np.exp(w0 + w1 * x), 2)] for x in (40, 41, 42, 43, 44, 46)]
thr = {}
p_all = lr.predict_proba(peng[["bill_length_mm"]])[:, 1]
for T in (0.2, 0.5, 0.8):
    cut = (np.log(T / (1 - T)) - w0) / w1
    pred = (p_all >= T).astype(int)
    thr[T] = {"cut": r(cut, 1), "acc": r((pred == ad).mean()), "called": int(pred.sum())}
out["lr_thresholds"] = thr
out["lr_C"] = {str(C): r(LogisticRegression(C=C, max_iter=20000).fit(peng[["bill_length_mm"]], ad).coef_[0, 0], 3) for C in (np.inf, 1.0, 0.1, 0.01, 0.001)}
lr2 = make_pipeline(StandardScaler(), LogisticRegression(C=np.inf, max_iter=20000)).fit(X2, ad)
out["lr_two"] = {"w": [r(v, 2) for v in lr2[-1].coef_[0]], "b": r(lr2[-1].intercept_[0], 2),
                 "acc_one": r(cross_val_score(LogisticRegression(C=np.inf, max_iter=20000), peng[["bill_length_mm"]], ad, cv=cv).mean()),
                 "acc_two": r(cross_val_score(make_pipeline(StandardScaler(), LogisticRegression(C=np.inf, max_iter=20000)), X2, ad, cv=cv).mean())}

# Naive Bayes vs logistic regression, three species, two features
nb2 = cross_val_score(GaussianNB(), X2, ys, cv=cv).mean()
lr3 = cross_val_score(make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000)), X2, ys, cv=cv).mean()
nb1 = cross_val_score(GaussianNB(), peng[["bill_length_mm"]], ys, cv=cv).mean()
corr = {s: r(peng[peng.species == s][["bill_length_mm", "bill_depth_mm"]].corr().iloc[0, 1], 2) for s in SP}
# confidence: mean top probability vs accuracy, out of fold
def conf(model):
    tops, oks = [], []
    for tr, te in cv.split(X2, ys):
        m = model.fit(X2.iloc[tr], ys.iloc[tr]); P = m.predict_proba(X2.iloc[te])
        tops += list(P.max(1)); oks += list(m.classes_[P.argmax(1)] == ys.iloc[te].to_numpy())
    return r(np.mean(tops)), r(np.mean(oks))
out["nb"] = {"acc_nb_one": r(nb1), "acc_nb_two": r(nb2), "acc_lr_two": r(lr3), "corr": corr,
             "conf_nb": conf(GaussianNB()), "conf_lr": conf(make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))),
             "params": {s: [r(peng[peng.species == s].bill_length_mm.mean(), 2), r(peng[peng.species == s].bill_length_mm.std(ddof=0), 2), int((peng.species == s).sum())] for s in SP}}

# Least squares: the parts of the slope, the fit, an outlier, a second feature
x, y = peng.flipper_length_mm.to_numpy(float), peng.body_mass_g.to_numpy(float)
xm, ym = x.mean(), y.mean()
sxy, sxx = ((x - xm) * (y - ym)).sum(), ((x - xm) ** 2).sum()
b1 = sxy / sxx; b0 = ym - b1 * xm
res = y - (b0 + b1 * x)
out["ols"] = {"xm": r(xm, 2), "ym": r(ym, 1), "sxy": r(sxy, 0), "sxx": r(sxx, 0), "b1": r(b1, 2), "b0": r(b0, 1),
              "rmse": r(np.sqrt(np.mean(res ** 2)), 1), "r2": r(1 - (res ** 2).sum() / ((y - ym) ** 2).sum(), 3)}
xo, yo = np.append(x, 230), np.append(y, 2700)
b1o = ((xo - xo.mean()) * (yo - yo.mean())).sum() / ((xo - xo.mean()) ** 2).sum()
out["ols"]["outlier_slope"] = r(b1o, 2)
mr = LinearRegression().fit(peng[["flipper_length_mm", "bill_depth_mm"]], y)
out["ols"]["multi"] = {"flipper": r(mr.coef_[0], 2), "depth": r(mr.coef_[1], 2)}
out["ols"]["depth_alone"] = r(LinearRegression().fit(peng[["bill_depth_mm"]], y).coef_[0], 2)
out["ols"]["cv_rmse"] = r(-cross_val_score(LinearRegression(), peng[["flipper_length_mm"]], y, cv=KFold(5, shuffle=True, random_state=330), scoring="neg_root_mean_squared_error").mean(), 1)

# k-NN regression: cross-validated RMSE by k
kf = KFold(5, shuffle=True, random_state=330)
out["knnr_k"] = {k: r(-cross_val_score(KNeighborsRegressor(k), peng[["flipper_length_mm"]], y, cv=kf, scoring="neg_root_mean_squared_error").mean(), 1)
                 for k in (1, 3, 5, 15, 45, 150)}

# ── NHANES: thresholds, AUC, F1, kappa ───────────────────────────────────
dia = pd.read_csv(DATA / "diabetesNHANES.csv").dropna(subset=["glucose", "insulin", "outcome"])
Xtr, Xte, ytr, yte = train_test_split(dia[["glucose"]], dia.outcome, test_size=0.3, random_state=330, stratify=dia.outcome)
lg = LogisticRegression().fit(Xtr, ytr); p = lg.predict_proba(Xte)[:, 1]
tt = {}
for T in (0.1, 0.2, 0.3, 0.5, 0.7):
    pr = (p >= T).astype(int)
    tp = int(((pr == 1) & (yte == 1)).sum()); fp = int(((pr == 1) & (yte == 0)).sum())
    fn = int(((pr == 0) & (yte == 1)).sum()); tn = int(((pr == 0) & (yte == 0)).sum())
    tt[T] = {"TP": tp, "FN": fn, "FP": fp, "TN": tn, "acc": r((tp + tn) / len(yte)), "prec": r(tp / max(1, tp + fp)),
             "rec": r(tp / (tp + fn)), "spec": r(tn / (tn + fp)), "f1": r(f1_score(yte, pr)), "kappa": r(cohen_kappa_score(yte, pr))}
out["clf"] = {"thresholds": tt, "auc": r(roc_auc_score(yte, p)), "base": r(1 - yte.mean()), "n": int(len(yte)), "pos": int(yte.sum())}

# ── Wine: one split vs k folds ───────────────────────────────────────────
wine = pd.read_csv(DATA / "wine_sample.csv").dropna(subset=["alcohol", "density", "type"])
Xw, yw = wine[["alcohol", "density"]], (wine.type == "red").astype(int)
mdl = make_pipeline(StandardScaler(), LogisticRegression())
singles = [mdl.fit(*[a for a in train_test_split(Xw, yw, test_size=0.2, random_state=s, stratify=yw)][0::2]).score(
    *train_test_split(Xw, yw, test_size=0.2, random_state=s, stratify=yw)[1::2]) for s in range(200)]
out["cv"] = {"single_min": r(min(singles)), "single_max": r(max(singles)), "single_sd": r(np.std(singles)), "single_mean": r(np.mean(singles))}
reps = {}
for k in (3, 5, 10):
    means = [cross_val_score(mdl, Xw, yw, cv=StratifiedKFold(k, shuffle=True, random_state=s)).mean() for s in range(50)]
    reps[k] = {"sd_of_mean": r(np.std(means)), "mean": r(np.mean(means))}
out["cv"]["repeated"] = reps
# leakage: scaling on all data before CV vs inside the pipeline (k-NN on penguins, where scaling matters)
Xs_all = StandardScaler().fit_transform(X2)
out["cv"]["leak"] = {"inside": r(cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(5)), X2, ys, cv=cv).mean(), 4),
                     "outside": r(cross_val_score(KNeighborsClassifier(5), Xs_all, ys, cv=cv).mean(), 4)}

print(json.dumps(out, indent=1, default=str))
