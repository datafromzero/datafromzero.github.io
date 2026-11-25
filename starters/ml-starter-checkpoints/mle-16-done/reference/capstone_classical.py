"""The reference answer of the classical half of the capstone: version 2 of the churn model against version 1, on the people neither learned from.

    uv run python reference/capstone_classical.py            the evaluation, the slice, the drift check and the leak that a shortcut would make
    uv run python reference/capstone_classical.py --serve    write model/v2.skops (version 2, in the form the service loads)

Version 1 is the model of MLE14's replay (learned from the people who signed up before March 2). Version 2 is the same pipeline learned from the
people who signed up before May 11. Both are scored on the 3,488 people who signed up from May 11 to May 31, whose outcomes are all known on
June 30. Open this only after you have scored your own work.
"""

import sys
import warnings

import numpy as np
from sklearn.metrics import brier_score_loss, roc_auc_score

from ml_starter.config import FEATURES, ROOT, SEED, TARGET
from ml_starter.data import load_table, split
from ml_starter.export import save_model
from ml_starter.monitor import REPLAY_START, feature_psi
from ml_starter.pipeline import build_pipeline

warnings.filterwarnings("ignore")
V2_UNTIL, QUARTER = "2026-05-11", 0.25


def fit(people):
    return build_pipeline(0.1).fit(people[FEATURES], people[TARGET])


def hits(score, y, k):
    return int(y[np.argsort(-score, kind="stable")[:k]].sum())


def paired(measure, first, second, y, resamples=2000, seed=SEED):
    """first minus second for a measure of (y, score), with a 95 percent interval over resamples of the same people."""
    rng = np.random.default_rng(seed)
    gains = []
    for _ in range(resamples):
        pick = rng.integers(0, len(y), len(y))
        gains.append(measure(y[pick], first[pick]) - measure(y[pick], second[pick]))
    low, high = np.percentile(gains, [2.5, 97.5])
    return measure(y, first) - measure(y, second), low, high


def report():
    table = load_table()
    old, new = table[table["signup_date"] < REPLAY_START], table[table["signup_date"] >= V2_UNTIL]
    v1_people, v2_people = old, table[table["signup_date"] < V2_UNTIL]
    v1, v2 = fit(v1_people), fit(v2_people)
    p1, p2 = v1.predict_proba(new[FEATURES])[:, 1], v2.predict_proba(new[FEATURES])[:, 1]
    y = new[TARGET].to_numpy()
    print(f"version 1 learned from {len(v1_people):,} people, version 2 from {len(v2_people):,}; scored on {len(y):,} people of May 11 to 31, {y.mean():.3f} churned")
    for name, p in (("version 1", p1), ("version 2", p2)):
        print(f"{name}: AUC {roc_auc_score(y, p):.3f}, Brier {brier_score_loss(y, p):.4f}, mean chance {p.mean():.3f}")
    gain, low, high = paired(roc_auc_score, p2, p1, y)
    print(f"AUC gain of version 2: {gain:+.4f} (95% interval {low:+.4f} to {high:+.4f}, 2,000 resamples of the people, seed {SEED})")
    gain, low, high = paired(lambda truth, score: -brier_score_loss(truth, score), p2, p1, y)
    print(f"Brier score drop of version 2: {gain:+.4f} (95% interval {low:+.4f} to {high:+.4f})")
    weeks = new["signup_date"].dt.to_period("W-SUN").dt.start_time
    for week in sorted(weeks.unique()):
        mask = (weeks == week).to_numpy()
        print(f"  week of {week.date()}: {int(mask.sum()):,} people, AUC version 1 {roc_auc_score(y[mask], p1[mask]):.3f}, version 2 {roc_auc_score(y[mask], p2[mask]):.3f}")
    print("by channel (mean chance against the share that churned):")
    for channel in sorted(new["channel"].unique()):
        mask = (new["channel"] == channel).to_numpy()
        print(f"  {channel:<14} {int(mask.sum()):,} people, churned {y[mask].mean():.3f}, mean chance {p1[mask].mean():.3f} then {p2[mask].mean():.3f}, "
              f"AUC {roc_auc_score(y[mask], p1[mask]):.3f} then {roc_auc_score(y[mask], p2[mask]):.3f}")
    worst = max(feature_psi(v1_people, new).items(), key=lambda item: item[1]), max(feature_psi(v2_people, new).items(), key=lambda item: item[1])
    print(f"largest PSI of those people: {worst[0][1]:.3f} on {worst[0][0]} against version 1's people, {worst[1][1]:.3f} on {worst[1][0]} against version 2's")


def leak():
    """What a shortcut does: the registered champion (learned from a random three quarters of everyone) stands in for version 1."""
    table = load_table()
    X_train, X_test, y_train, y_test = split(table)
    new = table[table["signup_date"] >= V2_UNTIL]
    champion = build_pipeline(0.1).fit(X_train, y_train)
    seen = int(new.index.isin(X_train.index).sum())
    auc = roc_auc_score(new[TARGET], champion.predict_proba(new[FEATURES])[:, 1])
    print(f"the champion of MLE3 learned from {seen:,} of the {len(new):,} people of May 11 to 31; its AUC on them is {auc:.3f}")


if __name__ == "__main__":
    if "--serve" in sys.argv:
        table = load_table()
        save_model(fit(table[table["signup_date"] < V2_UNTIL]), {"version": "v2"}, ROOT / "model" / "v2.skops")
        print("wrote model/v2.skops")
    else:
        report()
        leak()
