"""The reference answer of simulation MLE15: baselines, a candidate, the evaluation of all of them on the held-out people, and a failure slice.

    uv run python reference/mle15_reference.py            the report of the reference answer
    uv run python reference/mle15_reference.py --seeds    the same two headline numbers on 20 other splits
    uv run python reference/mle15_reference.py --checks   the three checks behind the rows of the AI log below

It writes model/candidate.skops (the candidate, in the form the service loads, once the service has been told to trust the one type it needs). Open it only after you have scored your own work.
"""

import sys
import warnings

import numpy as np
import skops.io as skops_io
from sklearn.compose import ColumnTransformer, make_column_selector
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from ml_starter.config import FEATURES, ROOT, SEED, TARGET
from ml_starter.data import load_table, split
from ml_starter.export import save_model
from ml_starter.pipeline import build_pipeline

warnings.filterwarnings("ignore")
QUARTER = 0.25  # support can phone one person in four


def candidate():
    """A random forest on the same ten columns: text columns one-hot, numbers as they are."""
    prep = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), make_column_selector(dtype_exclude="number")),
        ("num", "passthrough", make_column_selector(dtype_include="number")),
    ])
    return Pipeline([("prep", prep), ("model", RandomForestClassifier(n_estimators=200, min_samples_leaf=20, random_state=SEED))])


def hits(score, y, k):
    """How many of the k highest-scored people really churned (ties broken by position, so the result does not depend on the sort)."""
    return int(np.asarray(y)[np.argsort(-np.asarray(score), kind="stable")[:k]].sum())


def scores(X_train, y_train, X_test):
    """The three scores of the held-out people: the channel rule, the champion (C of 0.1) and the candidate."""
    rate = y_train.groupby(X_train["channel"]).mean()
    rule = X_test["channel"].map(rate).to_numpy()
    champion = build_pipeline(0.1).fit(X_train, y_train)
    forest = candidate().fit(X_train, y_train)
    return {"channel rule": rule, "champion": champion.predict_proba(X_test)[:, 1], "candidate": forest.predict_proba(X_test)[:, 1]}, forest


def paired_gain(first, second, y, k_share=QUARTER, resamples=2000, seed=SEED, measure=None):
    """The gain at the top share, first minus second, with a 95 percent percentile interval over resamples of the same people.

    By default the gain is in hits out of k (how many more of the top k really churned); measure=roc_auc_score gives the gain in AUC.
    Every call with the same seed draws the same resamples, so two gains are comparable.
    """
    rng = np.random.default_rng(seed)
    n = len(y)
    k = int(k_share * n)
    one = (lambda score, answer: hits(score, answer, k)) if measure is None else (lambda score, answer: measure(answer, score))
    gains = []
    for _ in range(resamples):
        pick = rng.integers(0, n, n)
        gains.append(one(first[pick], y[pick]) - one(second[pick], y[pick]))
    low, high = np.percentile(gains, [2.5, 97.5])
    return one(first, y) - one(second, y), low, high


def report():
    table = load_table()
    X_train, X_test, y_train, y_test = split(table)
    y = y_test.to_numpy()
    k = int(QUARTER * len(y))
    chosen, forest = scores(X_train, y_train, X_test)
    save_model(forest, {"version": "candidate"}, ROOT / "model" / "candidate.skops")
    print(f"{len(y):,} held-out people, {y.mean():.3f} of them churned; the top quarter is {k:,} people")
    print(f"flat guess (any {k:,} people): {y.mean():.3f}")
    for name, score in chosen.items():
        print(f"{name:<13} hits {hits(score, y, k):,} of {k:,} = {hits(score, y, k) / k:.3f}   AUC {roc_auc_score(y, score):.3f}")
    pairs = (("candidate", "champion"), ("champion", "channel rule"), ("candidate", "channel rule"))
    for first, second in pairs:
        gain, low, high = paired_gain(chosen[first], chosen[second], y)
        print(f"{first} minus {second}: {gain:+d} hits of {k:,} = {gain / k:+.3f} (95% interval {low:+.0f} to {high:+.0f} hits, {low / k:+.3f} to {high / k:+.3f}, 2,000 resamples, seed {SEED})")
    for first, second in pairs:
        gain, low, high = paired_gain(chosen[first], chosen[second], y, measure=roc_auc_score)
        print(f"AUC, {first} minus {second}: {gain:+.3f} (95% interval {low:+.3f} to {high:+.3f}, the same 2,000 resamples)")
    print("by platform (AUC of each score, within the platform):")
    for platform in sorted(X_test["platform"].unique()):
        mask = (X_test["platform"] == platform).to_numpy()
        print(f"  {platform:<8} {int(mask.sum()):,} people, {y[mask].mean():.3f} churned, "
              f"AUC champion {roc_auc_score(y[mask], chosen['champion'][mask]):.3f}, candidate {roc_auc_score(y[mask], chosen['candidate'][mask]):.3f}")


def seeds():
    """The gain of the candidate over the champion, and the AUC of the champion on web minus on android, on 20 other splits."""
    table = load_table()
    gains, gaps = [], []
    for seed in range(100, 120):
        X_train, X_test, y_train, y_test = train_test_split(table[FEATURES], table[TARGET], test_size=0.25, random_state=seed, stratify=table[TARGET])
        chosen, _ = scores(X_train, y_train, X_test)
        y = y_test.to_numpy()
        k = int(QUARTER * len(y))
        gains.append((hits(chosen["candidate"], y, k) - hits(chosen["champion"], y, k)) / k)
        web, android = (X_test["platform"] == "web").to_numpy(), (X_test["platform"] == "android").to_numpy()
        gaps.append(roc_auc_score(y[web], chosen["champion"][web]) - roc_auc_score(y[android], chosen["champion"][android]))
    print(f"candidate minus champion at the top quarter, 20 splits: median {np.median(gains):+.3f}, range {min(gains):+.3f} to {max(gains):+.3f}, above 0 in {sum(g > 0 for g in gains)}")
    print(f"champion AUC on web minus on android, 20 splits: median {np.median(gaps):+.3f}, range {min(gaps):+.3f} to {max(gaps):+.3f}, below 0 in {sum(g < 0 for g in gaps)}")


def checks():
    """The checks that decided four rows of the reference AI log."""
    X_train, X_test, y_train, y_test = split(load_table())
    y = y_test.to_numpy()
    k = int(QUARTER * len(y))
    try:  # an assistant wrote n_trees, a name from another library
        RandomForestClassifier(n_trees=200)
    except TypeError as error:
        print("1. RandomForestClassifier(n_trees=200):", str(error).splitlines()[0])
    champion = build_pipeline(0.1).fit(X_train, y_train).predict_proba(X_test)[:, 1]
    flagged = champion > 0.5
    print(f"2. precision_score at a chance above 0.5: {precision_score(y, flagged):.3f} for {int(flagged.sum()):,} people; "
          f"hits at the top quarter: {hits(champion, y, k):,} of {k:,} = {hits(champion, y, k) / k:.3f}")
    try:  # the service loads the candidate file with only the one type of the pipeline that it was told to trust
        skops_io.load(ROOT / "model" / "candidate.skops", trusted=["sklearn.compose._column_transformer.make_column_selector"])
    except skops_io.exceptions.UntrustedTypesFoundException as error:
        print("3. the service refuses the file:", str(error).splitlines()[0])
    chosen, _ = scores(X_train, y_train, X_test)
    gain, low, high = paired_gain(chosen["candidate"], chosen["champion"], y)
    print(f"4. candidate minus champion at the top quarter: {gain:+d} hits, interval {low:+.0f} to {high:+.0f}")


if __name__ == "__main__":
    seeds() if "--seeds" in sys.argv else checks() if "--checks" in sys.argv else report()
