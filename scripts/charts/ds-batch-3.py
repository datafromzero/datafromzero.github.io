"""Draws the static charts of Data Scientist lessons DS11 to DS14 (model-interpretation-and-fairness, time-series-forecasting-basics,
experiment-analysis-in-python, genai-tools-in-a-ds-project) from the app-events data.

    python3 scripts/charts/ds-batch-3.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/ds-batch-3.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/ds-batch-3.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Same pipeline as ds-batch-1.py (it imports that file's helpers, which import the Svg class, the text widths and the figure colors of da-batch-1.py): plain SVG with
currentColor text, blue, green, purple, ochre in that fixed order, a title and a desc, each tag on its own line, every drawing centered in its viewBox. Ochre is below
3:1 on the light surface, so every ochre mark carries a visible label. Every model, split and resample repeats the code of the notebook cell it draws, with the
track's seed 2026, and the assertions pin the numbers the lessons print. The modeling table is built by the query of the DS3 notebook (ds-batch-1 stops if it differs).
Rerun --paste when a number changes.
"""
import importlib.util
import re
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.inspection import permutation_importance
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


b1 = load("ds_batch_1", HERE / "ds-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, OCHRE = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE
title_line, square, axis_ticks_y = b1.title_line, b1.square, b1.axis_ticks_y
DOCS = b1.DOCS
LESSONS = {"ds11": DOCS / "model-interpretation-and-fairness.mdx", "ds12": DOCS / "time-series-forecasting-basics.mdx",
           "ds13": DOCS / "experiment-analysis-in-python.mdx", "ds14": DOCS / "genai-tools-in-a-ds-project.mdx"}
SEED = 2026
STATIC, WEEK1 = b1.STATIC, b1.WEEK1
ACTIVITY = ["sessions_7d", "expenses_7d", "recent_3d", "active_days_7d"]


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DS11
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def ds11(out, con, table):
    X, y = table[STATIC + WEEK1], table["churned"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=SEED, stratify=y)
    model = b1.logit().fit(X_train, y_train)
    p = model.predict_proba(X_test)[:, 1]
    yt = y_test.to_numpy()
    assert round(float(roc_auc_score(yt, p)), 3) == 0.690

    def group_loss(cols, repeats=30):
        rng = np.random.default_rng(SEED)
        base = roc_auc_score(yt, model.predict_proba(X_test)[:, 1])
        drops = []
        for _ in range(repeats):
            shuffled = X_test.copy()
            shuffled[cols] = X_test[cols].iloc[rng.permutation(len(X_test))].to_numpy()
            drops.append(base - roc_auc_score(yt, model.predict_proba(shuffled)[:, 1]))
        return float(np.mean(drops))

    res = permutation_importance(model, X_test, y_test, scoring="roc_auc", n_repeats=30, random_state=SEED)
    loss = pd.Series(res.importances_mean, index=X_test.columns).sort_values(ascending=False)
    together = group_loss(ACTIVITY)
    assert (round(float(loss["channel"]), 4), round(float(loss[ACTIVITY].sum()), 4), round(together, 4)) == (0.0977, 0.0289, 0.0554)

    names = {"sessions_7d": "sessions", "expenses_7d": "expenses", "recent_3d": "recent (last 3 days)", "active_days_7d": "active days", "onboarded": "onboarded",
             "saw_paywall": "saw paywall", "bought_plus": "bought plus"}
    rows = [(names.get(c, c), float(v), BLUE) for c, v in loss.items()]
    rows.insert(2, ("4 activity columns", together, GREEN))
    desc = ("A bar chart of the drop in ROC AUC on the 4,454 held-out people when one column of the logistic regression is shuffled, from 0 to 0.12. "
            + "; ".join(f"{lab} {max(v, 0):.4f}" for lab, v, _ in rows)
            + ". The four activity columns shuffled together, in green, cost 0.0554, more than the 0.0289 that their four bars add up to. Channel costs the most.")
    s = Svg("ds11-importance", "ROC AUC lost when a column is shuffled, one column and the four activity columns together", desc)
    X0, X1 = 130, 322
    A = Axis(0, 0.12, X0, X1)
    title_line(s, "ROC AUC lost when a column is shuffled", 8, 10)
    square(s, 130, 22, BLUE)
    s.text(142, 29.5, "one column", size=9.5)
    square(s, 214, 22, GREEN)
    s.text(226, 29.5, "columns together", size=9.5)
    top = 46
    for i, (lab, v, col) in enumerate(rows):
        yy = top + i * 17
        s.text(8, yy + 3.5, lab, size=9.5, weight=600 if col == GREEN else None)
        w = max(A(v) - X0, 0)
        if w > 0:
            s.rect(X0, yy - 5, w, 10, col, rx=1.5)
        s.text(X0 + w + 4, yy + 3.5, f"{max(v, 0):.3f}", size=9, weight=600 if col == GREEN else None)
    base = top + len(rows) * 17 - 6
    s.line(X0, top - 10, X0, base, opacity=0.5)
    s.line(X0, base, X1, base)
    for v in (0, 0.04, 0.08, 0.12):
        s.line(A(v), base, A(v), base + 4)
        s.text(A(v), base + 15, f"{v:.2f}", anchor="middle", opacity=0.8)
    s.text(X1, base + 29, "drop in ROC AUC when shuffled", anchor="end", opacity=0.8)
    out["ds11-importance"] = s.render()

    # ---- the slices of unit 3, by platform, at the threshold 2 / 3 ----
    flag = p >= 2 / 3
    stats = {}
    for level in ["android", "ios", "web"]:
        m = (X_test["platform"] == level).to_numpy()
        stats[level] = (float(flag[m].mean()), float(flag[m & (yt == 1)].mean()))
    assert [tuple(round(v, 3) for v in stats[k]) for k in ("android", "ios", "web")] == [(0.313, 0.411), (0.313, 0.431), (0.028, 0.047)]
    web = (X_test["platform"] == "web").to_numpy()
    rng = np.random.default_rng(SEED)
    gaps = []
    for _ in range(2000):
        i = rng.integers(0, len(yt), len(yt))
        f, yy, w = flag[i], yt[i], web[i]
        gaps.append(f[~w & (yy == 1)].mean() - f[w & (yy == 1)].mean())
    gap = float(flag[~web & (yt == 1)].mean() - flag[web & (yt == 1)].mean())
    lo, hi = np.percentile(gaps, [2.5, 97.5])
    assert (round(gap, 3), round(float(lo), 3), round(float(hi), 3)) == (0.374, 0.345, 0.403)
    labels = {"android": "Android", "ios": "iOS", "web": "web"}
    s = Svg("ds11-slices", "Share of people offered and share of leavers offered, by platform",
            "A bar chart from 0 to 0.5 with two bars for each platform on the 4,454 held-out people, at the offer threshold 2 / 3. "
            + "; ".join(f"{labels[k]}: offered {v[0]:.3f}, leavers offered {v[1]:.3f}" for k, v in stats.items())
            + f". The recall of the app people minus the recall of the web people is {gap:.3f}, with a 95 percent interval of {lo:.3f} to {hi:.3f} from 2,000 resamples.")
    X0, X1 = 66, 322
    A = Axis(0, 0.5, X0, X1)
    title_line(s, "Offers by platform, held-out people", 8, 10)
    square(s, 66, 22, BLUE)
    s.text(78, 29.5, "people offered", size=9.5)
    square(s, 170, 22, GREEN)
    s.text(182, 29.5, "leavers offered (recall)", size=9.5)
    top = 52
    for i, k in enumerate(["android", "ios", "web"]):
        yy = top + i * 40
        s.text(8, yy + 11, labels[k], size=9.5)
        for j, (v, col) in enumerate(zip(stats[k], (BLUE, GREEN))):
            s.rect(X0, yy + j * 14, A(v) - X0, 11, col, rx=1.5)
            s.text(A(v) + 4, yy + j * 14 + 9, f"{v:.3f}", size=9, weight=600)
    base = top + 3 * 40 - 8
    s.line(X0, top - 8, X0, base, opacity=0.5)
    s.line(X0, base, X1, base)
    for v in (0, 0.25, 0.5):
        s.line(A(v), base, A(v), base + 4)
        s.text(A(v), base + 15, f"{v:.2f}", anchor="middle", opacity=0.8)
    s.text(8, base + 34, f"Recall gap, apps minus web: {gap:.3f}", size=9.5, weight=600)
    s.text(8, base + 47, f"95% interval {lo:.3f} to {hi:.3f}, 2,000 resamples", size=9.5)
    out["ds11-slices"] = s.render()


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DS12
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def ds12(out, con):
    from sklearn.linear_model import LinearRegression

    daily = con.sql("SELECT CAST(event_ts AS DATE) AS day, COUNT(*) AS signups FROM events WHERE event_name = 'signup_complete' GROUP BY 1 ORDER BY 1").df()
    signups = daily.set_index(pd.to_datetime(daily["day"]))["signups"].asfreq("D").astype(float)
    assert len(signups) == 181 and int(signups.sum()) == 21871
    df = pd.DataFrame({"y": signups})
    WEEKS = [m for m in df.index[df.index.dayofweek == 0] if m + pd.Timedelta(days=6) <= df.index[-1]]
    FIRST = 8

    def backtest(forecast):
        rows = []
        for k, monday in enumerate(WEEKS):
            if k < FIRST:
                continue
            days = pd.date_range(monday, periods=7)
            past = df.loc[: monday - pd.Timedelta(days=1)]
            rows.append(pd.DataFrame({"week": monday, "day": days, "actual": df.loc[days, "y"].to_numpy(), "forecast": np.asarray(forecast(past, days), dtype=float)}))
        return pd.concat(rows, ignore_index=True)

    def weekly_mae(b):
        return (b["actual"] - b["forecast"]).abs().groupby(b["week"]).mean()

    def seasonal_naive(past, days):
        return past["y"].reindex(days - pd.Timedelta(days=7)).to_numpy()

    def week_features(y):
        origin = y.index - pd.to_timedelta(y.index.dayofweek + 1, unit="D")
        o = pd.DataFrame(index=y.index)
        o["lag7"] = y.shift(7)
        o["mean7"] = y.rolling(7).mean().reindex(origin).to_numpy()
        o["weekday"] = y.index.dayofweek
        o["month_start"] = (y.index.day <= 3).astype(float)
        return o

    def linear_forecaster(cols):
        def forecast(past, days):
            known = past["y"].reindex(past.index.union(days))
            F = week_features(known)
            X = pd.get_dummies(F["weekday"].astype(int).astype(str), prefix="wd", dtype=float).reindex(columns=[f"wd_{i}" for i in range(7)], fill_value=0.0)
            X[["month_start"] + cols] = F[["month_start"] + cols]
            rows = X.index.isin(past.index) & ~X.isna().any(axis=1).to_numpy()
            return LinearRegression().fit(X[rows], past["y"].reindex(X.index[rows])).predict(X.loc[days])
        return forecast

    README_DAY = [1.00, 1.05, 1.05, 1.00, 0.90, 0.75, 0.80]

    def expected(past, days):
        res = []
        for d in days:
            level = 90 + 35 * (d - df.index[0]).days / 180
            level *= README_DAY[d.weekday()] * (1.3 if d.day <= 3 else 1)
            if pd.Timestamp("2026-04-13") <= d <= pd.Timestamp("2026-06-07"):
                level += 55 * min(1.0, 0.4 + 0.6 * (d - pd.Timestamp("2026-04-13")).days / 7) * README_DAY[d.weekday()]
            res.append(level)
        return res

    b_naive, b_model, b_truth = backtest(seasonal_naive), backtest(linear_forecaster(["lag7", "mean7"])), backtest(expected)
    weeks = pd.DataFrame({"naive": weekly_mae(b_naive), "model": weekly_mae(b_model), "expected": weekly_mae(b_truth)})
    assert [round(float(v), 2) for v in weeks.mean()] == [20.92, 18.62, 8.63]
    assert round(float(weeks["model"].max()), 1) == 67.7 and round(float(weeks.loc["2026-04-13", "model"]), 1) == 36.9

    day0 = df.index[0]
    A = Axis(0, 180, 40, 336)
    Y = Axis(0, 250, 196, 54)
    last = int(b_model["actual"].size)
    mc = int(df.index.get_loc(pd.Timestamp("2026-03-02")))
    s = Svg("ds12-series", "Daily signups, the README's expected signups and the model's backtest forecasts",
            "A line chart of the 181 days from January 1 to June 30, 2026, with signups a day from 0 to 250. The actual signups, in blue, rise from about 100 to about 120 with a weekly pattern, "
            "climb to about 160 a day from April 13 to June 7 during the paid-social campaign, and fall back after June 7. The README's expected signups, in purple, follow the same shape without the noise. "
            "The model's forecasts, in green, run from March 2 to June 28, one week at a time, each made from the days before its week: they follow the actual line closely except in the weeks where the campaign starts "
            "and stops, and in the week of May 4, where they miss by a wide margin.")
    title_line(s, "Daily signups and forecasts", 8, 10)
    square(s, 8, 22, BLUE)
    s.text(20, 29.5, "actual", size=9.5)
    square(s, 66, 22, PURPLE)
    s.text(78, 29.5, "README expected", size=9.5)
    square(s, 172, 22, GREEN)
    s.text(184, 29.5, "model forecast (backtest)", size=9.5)
    for v in (0, 100, 200):
        s.line(40, Y(v), 336, Y(v), opacity=0.5 if v == 0 else 0.13)
        s.text(34, Y(v) + 3.5, f"{v}", anchor="end", opacity=0.8)
    camp0, camp1 = (pd.Timestamp("2026-04-13") - day0).days, (pd.Timestamp("2026-06-07") - day0).days
    s.rect(A(camp0), Y(250), A(camp1) - A(camp0), Y(0) - Y(250), "currentColor", opacity=0.07)
    s.text((A(camp0) + A(camp1)) / 2, Y(250) - 4, "paid-social campaign", anchor="middle", size=9)
    s.poly([(A(i), Y(v)) for i, v in enumerate(signups.to_numpy())], BLUE, w=1.2, opacity=0.9)
    exp_all = expected(None, df.index)
    s.poly([(A(i), Y(v)) for i, v in enumerate(exp_all)], PURPLE, w=1.6, opacity=1)
    s.poly([(A(mc + i), Y(v)) for i, v in enumerate(b_model["forecast"].to_numpy())], GREEN, w=1.6, opacity=1)
    s.line(A(mc), Y(0), A(mc), Y(250) + 12, color="currentColor", w=1, opacity=0.45, dash="3 3")
    s.text(A(mc) + 3, Y(0) - 4, "forecasts start", size=9, opacity=0.9)
    for name, d in (("Jan", "2026-01-01"), ("Feb", "2026-02-01"), ("Mar", "2026-03-01"), ("Apr", "2026-04-01"), ("May", "2026-05-01"), ("Jun", "2026-06-01")):
        i = (pd.Timestamp(d) - day0).days
        s.line(A(i), Y(0), A(i), Y(0) + 4)
        s.text(A(i), Y(0) + 15, name, anchor="middle", opacity=0.8)
    out["ds12-series"] = s.render()

    wk = list(weeks.index)
    A2 = Axis(0, len(wk) - 1, 40, 332)
    Y2 = Axis(0, 80, 150, 40)
    s = Svg("ds12-weeks", "Mean miss in signups a day for each forecast week, three forecasts",
            "A line chart over the 17 forecast weeks from March 2 to June 22, with the mean absolute miss in signups a day from 0 to 80. "
            + "; ".join(f"{k}: " + ", ".join(f"{v:.1f}" for v in weeks[k]) for k in ("naive", "model", "expected"))
            + ". The seasonal naive forecast is in ochre, the model in green and the README's expected values in purple. The two forecasts jump in the weeks of April 13 and June 8, where the campaign starts and stops, "
              "and the model also jumps in the week of May 4; the expected values stay near 9.")
    title_line(s, "Mean miss for each forecast week", 8, 10)
    square(s, 8, 22, OCHRE)
    s.text(20, 29.5, "seasonal naive", size=9.5)
    square(s, 100, 22, GREEN)
    s.text(112, 29.5, "model", size=9.5)
    square(s, 154, 22, PURPLE)
    s.text(166, 29.5, "README expected (noise floor)", size=9.5)
    for v in (0, 40, 80):
        s.line(40, Y2(v), 332, Y2(v), opacity=0.5 if v == 0 else 0.13)
        s.text(34, Y2(v) + 3.5, f"{v}", anchor="end", opacity=0.8)
    for col, key in ((OCHRE, "naive"), (GREEN, "model"), (PURPLE, "expected")):
        s.poly([(A2(i), Y2(v)) for i, v in enumerate(weeks[key].to_numpy())], col, w=1.8)
        for i, v in enumerate(weeks[key].to_numpy()):
            s.circle(A2(i), Y2(v), 2.2, col)
    for d, lab in (("2026-04-13", "Apr 13"), ("2026-06-08", "Jun 8"), ("2026-05-04", "May 4")):
        i = wk.index(pd.Timestamp(d))
        top = float(weeks.loc[d, ["naive", "model"]].max())
        s.text(A2(i), Y2(top) - 6, lab, anchor="middle", size=9, weight=600)
    for d, lab in (("2026-03-02", "Mar 2"), ("2026-04-13", "Apr 13"), ("2026-06-08", "Jun 8")):
        i = wk.index(pd.Timestamp(d))
        s.line(A2(i), Y2(0), A2(i), Y2(0) + 4)
        s.text(A2(i), Y2(0) + 15, lab, anchor="middle", opacity=0.8)
    s.text(332, Y2(0) + 29, "first day of the forecast week", anchor="end", opacity=0.8)
    out["ds12-weeks"] = s.render()


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DS13
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def exp_sql():
    """The EXP_SQL string of the DS13 notebook: the query that builds one row for each person in an experiment."""
    import json

    nb = json.loads((b1.NOTEBOOKS / "data-scientist-experiment-analysis-in-python.ipynb").read_text(encoding="utf-8"))
    for cell in nb["cells"]:
        src = "".join(cell["source"])
        if 'EXP_SQL = """' in src:
            start = src.index('EXP_SQL = """') + len('EXP_SQL = """')
            return src[start:src.index('"""', start)]
    raise SystemExit("ds-batch-3: the DS13 notebook has no EXP_SQL cell")


def ds13(out, con):
    from scipy import stats

    con.execute(f"CREATE TABLE subscriptions AS FROM read_csv('{b1.APP / 'subscriptions.csv'}', types={{'started_on': 'DATE', 'ended_on': 'DATE', 'updated_at': 'TIMESTAMP'}})")
    con.execute(f"CREATE TABLE assign AS FROM read_csv('{b1.APP / 'experiment_assignments.csv'}', types={{'assigned_at': 'TIMESTAMP'}})")
    exp = con.sql(exp_sql()).df()
    wt = exp[exp["experiment"] == "welcome_tips"]
    pilot = wt.loc[wt["variant"] == "control", "revenue_14d"].to_numpy()

    def n_per_arm(sd, delta, alpha=0.05, power=0.80):
        z = stats.norm.ppf(1 - alpha / 2) + stats.norm.ppf(power)
        return int(np.ceil(2 * (sd * z / delta) ** 2))

    rng = np.random.default_rng(SEED)

    def power_at(n, delta, runs=2000):
        scale = 1 + delta / pilot.mean()
        hits = 0
        for _ in range(runs):
            a, b = rng.choice(pilot, n), rng.choice(pilot, n) * scale
            hits += stats.ttest_ind(b, a, equal_var=False).pvalue < 0.05
        return hits / runs

    n = n_per_arm(pilot.std(ddof=1), 0.50)
    at_n, at_2700 = power_at(n, 0.50), power_at(2700, 0.50)          # the same two calls, in the same order, as the notebook cell
    assert (n, round(at_n, 2), round(at_2700, 2)) == (7047, 0.72, 0.34), (n, at_n, at_2700)
    sizes = [1000, 2000, 4000, 10000, 12000]
    curve = sorted([(2700, at_2700), (n, at_n)] + [(k, power_at(k, 0.50)) for k in sizes])
    s = Svg("ds13-power", "Simulated power to catch +$0.50 of revenue per person, by people in each arm",
            "A line chart of the share of 2,000 simulated tests that reach p below 0.05 when the variant's mean revenue per person is 50 cents higher, from 0 to 1, against the people in each arm from 0 to 12,000. "
            + "; ".join(f"{k:,} people: {v:.2f}" for k, v in curve)
            + ". A dashed line marks the target power of 0.80. At 2,700 people per arm, about the size of paywall_v2, power is 0.34; at the 7,047 people per arm that the formula asks for, power is 0.72, below the target.")
    X0, X1 = 44, 316
    A = Axis(0, 12000, X0, X1)
    Y = Axis(0, 1, 160, 44)
    title_line(s, "Simulated power to catch +$0.50 a person", 8, 10)
    square(s, 44, 22, GREEN)
    s.text(56, 29.5, "tests with p below 0.05, of 2,000", size=9.5)
    for v in (0, 0.5, 1):
        s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == 0 else 0.13)
        s.text(X0 - 6, Y(v) + 3.5, f"{v:.1f}", anchor="end", opacity=0.8)
    s.line(X0, Y(0.8), X1, Y(0.8), w=1.2, opacity=0.8, dash="4 3")
    s.text(X0 + 4, Y(0.8) - 4, "target 0.80", size=9.5)
    s.poly([(A(k), Y(v)) for k, v in curve], GREEN, w=2)
    for k, v in curve:
        s.circle(A(k), Y(v), 3, GREEN)
    s.text(A(2700) + 6, Y(at_2700) + 12, f"2,700: {at_2700:.2f}", size=9.5, weight=600)
    s.text(A(n) - 4, Y(at_n) + 16, f"{n:,}: {at_n:.2f}", anchor="end", size=9.5, weight=600)
    for k in (0, 4000, 8000, 12000):
        s.line(A(k), Y(0), A(k), Y(0) + 4)
        s.text(A(k), Y(0) + 15, f"{k:,}", anchor="middle", opacity=0.8)
    s.text(X1, Y(0) + 29, "people in each arm", anchor="end", opacity=0.8)
    out["ds13-power"] = s.render()


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DS14
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def ds14_notes():
    """The `notes` table of the DS14 notebook: the cell that holds NOTES, RUN1 and RUN2, run as written."""
    import json

    nb = json.loads((b1.NOTEBOOKS / "data-scientist-genai-tools-in-a-ds-project.ipynb").read_text(encoding="utf-8"))
    for cell in nb["cells"]:
        src = "".join(cell["source"])
        if "NOTES = [" in src:
            import contextlib
            import io

            ns = {"pd": pd, "np": np}
            with contextlib.redirect_stdout(io.StringIO()):
                exec(compile(src, "ds14-notes", "exec"), ns)
            return ns["notes"], ns["LABELS"]
    raise SystemExit("ds-batch-3: the DS14 notebook has no NOTES cell")


def ds14(out):
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import StratifiedKFold, cross_val_score
    from sklearn.pipeline import make_pipeline

    notes, LABELS = ds14_notes()
    valid = notes["run1"].isin(LABELS)
    pred = notes["run1"].where(valid, "invalid")
    hit = (pred == notes["truth"]).to_numpy()
    assert (len(notes), round(float(hit.mean()), 3)) == (60, 0.833)
    recall = {k: float(hit[(notes["truth"] == k).to_numpy()].mean()) for k in LABELS}
    precision = {k: float(hit[(pred == k).to_numpy()].mean()) for k in LABELS}
    assert (round(recall["other"], 2), round(precision["other"], 2)) == (0.5, 0.6)
    short = {"too_expensive": "too expensive", "not_using": "not using", "missing_feature": "missing feature", "found_alternative": "found alternative", "other": "other"}
    s = Svg("ds14-recall", "Recall and precision of run 1 for each label, on 60 notes",
            "A bar chart from 0 to 1 with two bars for each of the five labels: recall in blue and precision in green. "
            + "; ".join(f"{short[k]}: recall {recall[k]:.2f}, precision {precision[k]:.2f}" for k in LABELS)
            + ". A tick under the axis marks the overall accuracy, 0.833. The labels of run 1 were written for the lesson as an illustration; they are not output of any model.")
    X0, X1 = 100, 304
    A = Axis(0, 1, X0, X1)
    title_line(s, "Run 1 by label (an illustration)", 8, 10)
    square(s, 100, 22, BLUE)
    s.text(112, 29.5, "recall", size=9.5)
    square(s, 164, 22, GREEN)
    s.text(176, 29.5, "precision", size=9.5)
    top = 52
    for i, k in enumerate(LABELS):
        yy = top + i * 36
        s.text(8, yy + 11, short[k], size=9.5)
        for j, (v, col) in enumerate(zip((recall[k], precision[k]), (BLUE, GREEN))):
            s.rect(X0, yy + j * 13, A(v) - X0, 10, col, rx=1.5)
            s.text(A(v) + 4, yy + j * 13 + 8.5, f"{v:.2f}", size=9, weight=600)
    base = top + 5 * 36 - 8
    s.line(X0, top - 8, X0, base, opacity=0.5)
    s.line(X0, base, X1, base)
    for v in (0, 0.5, 1):
        s.line(A(v), base, A(v), base + 4)
        s.text(A(v), base + 15, f"{v:.1f}", anchor="middle", opacity=0.8)
    s.line(A(0.833), base, A(0.833), base + 9, w=2.5, opacity=1)
    s.text(X1, base + 29, "overall accuracy 0.833 (tick)", anchor="end", size=9.5, weight=600)
    out["ds14-recall"] = s.render()

    text_model = make_pipeline(TfidfVectorizer(ngram_range=(1, 2)), LogisticRegression(max_iter=1000))
    rows = []
    for folds in (3, 5, 6):
        sc = cross_val_score(text_model, notes["text"], notes["truth"], cv=StratifiedKFold(folds, shuffle=True, random_state=SEED))
        rows.append((round(60 - 60 / folds), float(sc.mean()), float(sc.min()), float(sc.max())))
    assert [(r[0], round(r[1], 3), round(r[2], 3), round(r[3], 3)) for r in rows] == [(40, 0.433, 0.4, 0.45), (48, 0.433, 0.333, 0.583), (50, 0.4, 0.3, 0.6)]
    s = Svg("ds14-folds", "Accuracy of a text model trained on 40, 48 and 50 notes, mean and range of its folds",
            "A chart from 0 to 1 of accuracy for a TF-IDF logistic regression trained on 40, 48 and 50 of the 60 notes. "
            + "; ".join(f"{n} notes: mean {m:.3f}, folds from {lo:.3f} to {hi:.3f}" for n, m, lo, hi in rows)
            + ". Two dashed lines mark the flat guess, 0.350, and the accuracy of the illustrated run 1, 0.833. The trained model stays near 0.4, far below the illustration.")
    X0, X1 = 44, 316
    A = Axis(0, 3, X0, X1)
    Y = Axis(0, 1, 160, 44)
    title_line(s, "Trained text model, mean and range of folds", 8, 10)
    for v in (0, 0.5, 1):
        s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == 0 else 0.13)
        s.text(X0 - 6, Y(v) + 3.5, f"{v:.1f}", anchor="end", opacity=0.8)
    s.line(X0, Y(0.833), X1, Y(0.833), w=1.2, opacity=0.8, dash="4 3")
    s.text(X1, Y(0.833) - 4, "illustrated run 1: 0.833", anchor="end", size=9.5)
    s.line(X0, Y(0.35), X1, Y(0.35), w=1.2, opacity=0.8, dash="4 3")
    s.text(X1, Y(0.35) + 12, "flat guess: 0.350", anchor="end", size=9.5)
    for i, (n, m, lo, hi) in enumerate(rows):
        x = A(i + 0.5)
        s.line(x, Y(lo), x, Y(hi), color=GREEN, w=2.5, opacity=1)
        s.circle(x, Y(m), 5, GREEN)
        s.text(x, Y(0) + 15, f"{n} notes", anchor="middle", opacity=0.8)
        s.text(x + 9, Y(m) + 3.5, f"{m:.3f}", size=9.5, weight=600)
    s.text(X1, Y(0) + 29, "trained on this many of the 60 notes", anchor="end", opacity=0.8)
    out["ds14-folds"] = s.render()


# ---------------------------------------------------------------------------------------------------------------------------------------------------
def charts():
    out = {}
    con = b1.connect()
    table = b1.modeling_table(con)
    assert len(table) == 17816 and int(table["churned"].sum()) == 9696, (len(table), int(table["churned"].sum()))
    ds11(out, con, table)
    ds12(out, con)
    ds13(out, con)
    ds14(out)
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def paste(result, check=False):
    texts = {k: v.read_text(encoding="utf-8") for k, v in LESSONS.items() if v.exists()}
    bad = []
    for name, svg in result.items():
        key = name.split("-")[0]
        text = texts[key]
        marker = "{/* CHART: " + name + " */}"
        old = re.search(r'<figure>\n<svg [^\n]*aria-labelledby="' + re.escape(name) + r'-t [^\n]*\n.*?</figure>', text, re.S)
        if check:
            if svg not in text:
                bad.append(name)
            continue
        if marker in text:
            text = text.replace(marker, figure(svg))
        elif old:
            text = text.replace(old.group(0), figure(svg))
        else:
            bad.append(name)
        texts[key] = text
    if not check:
        for k, v in texts.items():
            LESSONS[k].write_text(v, encoding="utf-8")
    return bad


if __name__ == "__main__":
    result = charts()
    if "--check" in sys.argv:
        bad = paste(result, check=True)
        print("charts out of date in their lesson:", bad or "none")
        sys.exit(1 if bad else 0)
    if "--paste" in sys.argv:
        bad = paste(result)
        print("charts with no marker or figure in their lesson:", bad or "none")
        sys.exit(1 if bad else 0)
    if "--out" in sys.argv:
        folder = Path(sys.argv[sys.argv.index("--out") + 1])
        folder.mkdir(parents=True, exist_ok=True)
        for name, svg in result.items():
            (folder / f"{name}.svg").write_text(svg + "\n")
        print("wrote", ", ".join(result))
    else:
        print(__doc__)
