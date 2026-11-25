"""Watch a served model from its request log: have the inputs drifted, and have the answers stopped being right?

    uv run python -m ml_starter.monitor summary LOG             latency and cost of the logged requests
    uv run python -m ml_starter.monitor weekly LOG              one line for each week of signups: drift, and quality once labels exist
    uv run python -m ml_starter.monitor weekly LOG --invented   the same, with the outcomes of an invented change

The reference is the people the replay model was trained on (signed up before REPLAY_START); every later week of requests is
compared with them.
"""

import argparse

import numpy as np
import pandas as pd
from sklearn.metrics import roc_auc_score

from ml_starter.config import FEATURES, SEED, STATIC, TARGET
from ml_starter.data import load_table
from ml_starter.requestlog import PRICE_PER_HOUR, read_log

REPLAY_START = "2026-03-02"  # the model of the replay was trained on the people who signed up before this day
PSI_ALERT = 0.1  # ten times the largest PSI of the quiet weeks (0.010)
AUC_FLOOR = 0.60  # 0.035 below the worst quiet week (0.635)
WEEKS_BELOW = 2  # weeks in a row under the floor before retraining is due
LABEL_DAYS = 30  # a person's outcome is known 30 days after signup


def shares(values, bins):
    """The share of the values in each bin: bins is a list of categories, or the edges of numeric bins."""
    if isinstance(bins[0], str):
        return pd.Series(values).value_counts(normalize=True).reindex(bins, fill_value=0.0).to_numpy()
    return np.histogram(values, bins=bins)[0] / len(values)


def psi(reference, current, eps=1e-4):
    """Population stability index of two lists of bin shares: the sum of (current - reference) x ln(current / reference)."""
    reference, current = np.clip(reference, eps, None), np.clip(current, eps, None)
    return float(((current - reference) * np.log(current / reference)).sum())


def feature_psi(reference, current):
    """The PSI of each of the ten inputs: categories as they are, numbers in the deciles of the reference."""
    result = {}
    for column in FEATURES:
        if column in STATIC:
            bins = sorted(set(reference[column]) | set(current[column]))  # a category the reference never had counts too
        else:
            bins = np.unique(np.quantile(reference[column], np.linspace(0, 1, 11)))
            bins[0], bins[-1] = -np.inf, np.inf
        result[column] = psi(shares(reference[column], bins), shares(current[column], bins))
    return result


def with_invented_change(table, start, share=0.7, seed=SEED):
    """INVENTED: from the day `start`, the outcome of `share` of the people is a coin flip, whatever they did in week 1."""
    rng = np.random.default_rng(seed)
    changed = table.copy()
    hit = (changed["signup_date"] >= start) & (rng.random(len(changed)) < share)
    changed.loc[hit, TARGET] = rng.integers(0, 2, int(hit.sum()))
    return changed


def weekly_report(log, table, reference):
    """One line for each week of signups: how many requests, the largest PSI and which input, the mean chance, then (once
    the 30 days have passed) the real churn rate and the AUC."""
    joined = log.assign(request_id=log["request_id"].astype("int64")).merge(
        table[["user_id", "signup_date", TARGET]], left_on="request_id", right_on="user_id", validate="one_to_one")
    joined["week"] = joined["signup_date"].dt.to_period("W-SUN").dt.start_time
    lines = []
    for week, group in joined.groupby("week"):
        by_feature = feature_psi(reference, group)
        top = max(by_feature, key=by_feature.get)
        ready = week + pd.Timedelta(days=6 + LABEL_DAYS)  # the last signup of the week, plus 30 days
        lines.append({
            "week": week.date(), "people": len(group), "top_input": top, "psi": by_feature[top],
            "mean_chance": group["churn_chance"].mean(),
            "labels_ready": ready.date(),
            "churn_rate": group[TARGET].mean(), "auc": roc_auc_score(group[TARGET], group["churn_chance"]),
        })
    return pd.DataFrame(lines)


def alert_weeks(weekly):
    """The weeks whose largest input PSI reaches the alert level."""
    return list(weekly.loc[weekly["psi"] >= PSI_ALERT, "week"])


def retrain_due(weekly):
    """The day retraining becomes due: the day the labels of the second week in a row below the AUC floor are known, or None."""
    run = 0
    for _, line in weekly.iterrows():
        run = run + 1 if line["auc"] < AUC_FLOOR else 0
        if run >= WEEKS_BELOW:
            return line["labels_ready"]
    return None


def summary(log):
    """Latency and cost of the logged requests."""
    cost = log["cost_usd"].sum()
    return {
        "requests": len(log),
        "median_latency_ms": float(log["latency_ms"].median()),
        "p95_latency_ms": float(log["latency_ms"].quantile(0.95)),
        "cost_usd": float(cost),
        "cost_per_1000_usd": float(cost / len(log) * 1000),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["summary", "weekly"])
    parser.add_argument("log", help="a request log, one JSON line for each request")
    parser.add_argument("--invented", action="store_true", help="use the outcomes of the invented change")
    arguments = parser.parse_args()
    log = read_log(arguments.log)
    if arguments.command == "summary":
        numbers = summary(log)
        print(f"{numbers['requests']:,} requests, model version {log['model_version'].iloc[0]}")
        print(f"latency: median {numbers['median_latency_ms']:.2f} ms, 95th percentile {numbers['p95_latency_ms']:.2f} ms")
        print(f"compute: ${numbers['cost_usd']:.6f} in all, ${numbers['cost_per_1000_usd']:.6f} for 1,000 requests (at ${PRICE_PER_HOUR:.2f} an hour, an assumption)")
        return
    table = load_table()
    if arguments.invented:
        table = with_invented_change(table, "2026-05-11")
    reference = table[table["signup_date"] < REPLAY_START]
    weekly = weekly_report(log, table, reference)
    print(weekly.to_string(index=False, float_format=lambda value: f"{value:.3f}"))
    print("alert weeks:", ", ".join(str(week) for week in alert_weeks(weekly)) or "none")
    print("retraining due:", retrain_due(weekly) or "never")


if __name__ == "__main__":
    main()
