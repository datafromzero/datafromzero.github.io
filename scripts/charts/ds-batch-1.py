"""Draws the static charts of the first five Data Scientist lessons (exploring-before-modeling, first-honest-model, sql-for-modeling-tables,
logistic-regression-in-practice, cross-validation-and-overfitting) from the app-events data.

    python3 scripts/charts/ds-batch-1.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/ds-batch-1.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/ds-batch-1.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Needs duckdb (2.0.0), pandas, NumPy and scikit-learn (the versions of the Data Scientist track are in .claude/agents/LESSON-STANDARD.md, "Data Scientist track
(D55)"). Same pipeline as da-batch-1.py to da-batch-4.py (it imports the Svg class, the text widths and the figure colors of da-batch-1.py): plain SVG with
currentColor text, the figure color roles of the site (blue, green, purple, ochre, in that fixed order), a title and a desc, each tag on its own line, every
drawing centered in its viewBox. Colors follow the entity, never the rank. Ochre is below 3:1 on the light surface, so every ochre mark carries a visible label.
The modeling table is built here by the same query as the notebooks (the script stops if the query differs from the one in the DS3 notebook), and every model,
split and resample repeats the code of the notebook cell it draws, with the track's seed 2026; the assertions below pin the numbers the lessons print.
Rerun --paste when a number changes.
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

import duckdb
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import KFold, StratifiedKFold, TimeSeriesSplit, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


b1 = load("da_batch_1", HERE / "da-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, OCHRE, ROOT, APP = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE, b1.ROOT, b1.APP
DOCS = ROOT / "src" / "content" / "docs" / "data-scientist"
NOTEBOOKS = ROOT / "notebooks" / "data-scientist"
LESSONS = {"ds1": DOCS / "exploring-before-modeling.mdx", "ds2": DOCS / "first-honest-model.mdx", "ds3": DOCS / "sql-for-modeling-tables.mdx",
           "ds4": DOCS / "logistic-regression-in-practice.mdx", "ds5": DOCS / "cross-validation-and-overfitting.mdx"}
SEED = 2026
STATIC = ["channel", "platform", "region"]
WEEK1 = ["sessions_7d", "expenses_7d", "recent_3d", "active_days_7d", "onboarded", "saw_paywall", "bought_plus"]


def title_line(s, text, x, y=0, size=10.5):
    s.text(x, y, text, size=size, weight=600)


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# data: the tables and the modeling table of the track
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def notebook_sql():
    """The MODELING_SQL string of the DS3 notebook (the cell ONE_STATEMENT): the one query every lesson of the track runs."""
    nb = json.loads((NOTEBOOKS / "data-scientist-sql-for-modeling-tables.ipynb").read_text(encoding="utf-8"))
    for cell in nb["cells"]:
        src = "".join(cell["source"])
        if src.startswith('ONE_STATEMENT = """'):
            return src[len('ONE_STATEMENT = """'):src.index('"""', 20)]
    raise SystemExit("ds-batch-1: the DS3 notebook has no ONE_STATEMENT cell")


def connect():
    con = duckdb.connect()
    con.execute(f"CREATE TABLE users AS FROM read_csv('{APP / 'users.csv'}', types={{'signup_date': 'DATE'}})")
    con.execute(f"CREATE TABLE events AS FROM read_csv('{APP / 'events.csv'}', types={{'event_ts': 'TIMESTAMP', 'received_at': 'TIMESTAMP'}})")
    return con


def modeling_table(con):
    return con.sql(notebook_sql()).df()


def logit():
    return make_pipeline(ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore"), STATIC), ("num", StandardScaler(), WEEK1)]), LogisticRegression(max_iter=1000))


def tree(depth, leaf=1):
    return make_pipeline(ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore"), STATIC), ("num", "passthrough", WEEK1)]),
                         DecisionTreeClassifier(max_depth=depth, min_samples_leaf=leaf, random_state=SEED))


def square(s, x, y, color, size=8):
    s.rect(x, y, size, size, color, rx=2)


def axis_ticks_y(s, X0, X1, Y, ticks, fmt, left=6):
    for v in ticks:
        s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == ticks[0] else 0.13)
        s.text(X0 - left, Y(v) + 3.5, fmt(v), anchor="end", opacity=0.8)


# ---------------------------------------------------------------------------------------------------------------------------------------------------
def charts():
    out = {}
    con = connect()
    table = modeling_table(con)
    assert len(table) == 17816 and int(table["churned"].sum()) == 9696, (len(table), int(table["churned"].sum()))
    X, y = table[STATIC + WEEK1], table["churned"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=SEED, stratify=y)

    # ---- ds1: March 17, the hour an event happened and the hour it arrived ----
    ev = con.sql("SELECT event_ts, received_at FROM events").df()
    day = pd.Timestamp("2026-03-17")
    happened = ev[ev["event_ts"].dt.normalize() == day].groupby(ev["event_ts"].dt.hour).size()
    arrived = ev[ev["received_at"].dt.normalize() == day].groupby(ev["received_at"].dt.hour).size()
    hours = list(range(13, 22))
    hp = [int(happened.get(h, 0)) for h in hours]
    ar = [int(arrived.get(h, 0)) for h in hours]
    assert (sum(hp[1:7]), ar[7], hp[7]) == (240, 286, 46), (sum(hp[1:7]), ar[7], hp[7])
    s = Svg("ds1-outage", "Events of March 17 by the hour they happened and the hour they arrived",
            "A bar chart for the hours 13 to 21 of March 17, with two bars for each hour, from 0 to 300 events. Events that happened: " + ", ".join(f"{v} at {h}" for h, v in zip(hours, hp))
            + ". Events that arrived: " + ", ".join(f"{v} at {h}" for h, v in zip(hours, ar))
            + ". No events arrive in hours 14 to 19 apart from one in hour 16, and 286 arrive in hour 20: the events of the six empty hours arrived together at 20:00 and just after. Times are UTC.")
    X0, X1 = 44, 338
    Y = Axis(0, 300, 150, 40)
    title_line(s, "Events of March 17, by hour (UTC)", 8, 10)
    square(s, 130, 22, BLUE)
    s.text(142, 29.5, "happened", size=9.5)
    square(s, 206, 22, GREEN)
    s.text(218, 29.5, "arrived", size=9.5)
    axis_ticks_y(s, X0, X1, Y, [0, 100, 200, 300], lambda v: f"{v}")
    slot = (X1 - X0) / len(hours)
    for i, h in enumerate(hours):
        cx = X0 + slot * (i + 0.5)
        for dx, v, col in ((-6.5, hp[i], BLUE), (0.5, ar[i], GREEN)):
            if v:
                s.rect(cx + dx, Y(v), 6, Y(0) - Y(v), col, rx=1.5)
        s.text(cx, Y(0) + 14, str(h), anchor="middle", opacity=0.8)
    cx20 = X0 + slot * (hours.index(20) + 0.5)
    s.text(cx20 - 8, Y(ar[7]) - 6, "286", anchor="end", weight=600)
    xa, xb = X0 + slot * 1, X0 + slot * 7
    s.line(xa + 3, Y(0) - 26, xb - 3, Y(0) - 26, color=GREEN, w=1.5, opacity=0.9)
    s.text((xa + xb) / 2, Y(0) - 32, "nothing arrives, 14 to 19", anchor="middle", size=9.5)
    s.text(X1, Y(0) + 28, "hour of the day", anchor="end", opacity=0.8)
    out["ds1-outage"] = s.render()

    # ---- ds2: the ladder of rungs, ROC AUC on the held-out people with 95 percent intervals ----
    rung2 = make_pipeline(ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore"), STATIC)]), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
    model = logit().fit(X_train, y_train)
    p2, p3 = rung2.predict_proba(X_test)[:, 1], model.predict_proba(X_test)[:, 1]
    ya = y_test.to_numpy()
    rng = np.random.default_rng(SEED)
    b2, b3 = [], []
    for _ in range(2000):
        i = rng.integers(0, len(ya), len(ya))
        b2.append(roc_auc_score(ya[i], p2[i]))
        b3.append(roc_auc_score(ya[i], p3[i]))
    a2, a3 = roc_auc_score(ya, p2), roc_auc_score(ya, p3)
    l2, h2 = np.percentile(b2, [2.5, 97.5])
    l3, h3 = np.percentile(b3, [2.5, 97.5])
    assert (round(a2, 3), round(a3, 3)) == (0.668, 0.690), (a2, a3)
    s = Svg("ds2-ladder", "ROC AUC of each rung on 4,454 held-out people, with 95 percent intervals",
            f"A dot chart on a scale from 0.45 to 0.75 of the ROC AUC on the held-out people. The flat guess, rung 1, scores 0.500, a coin flip, with no interval because everyone gets the same chance. "
            f"The signup columns only, rung 2, score {a2:.3f} with a 95 percent interval of {l2:.3f} to {h2:.3f}. The day-7 model scores {a3:.3f}, interval {l3:.3f} to {h3:.3f}. "
            "The intervals come from 2,000 resamples of the held-out people, and they overlap because both models are scored on the same people: the gain between them has its own, narrower interval, written in the lesson.")
    X = Axis(0.45, 0.75, 128, 318)
    title_line(s, "ROC AUC on the held-out people, with 95% intervals", 8, 10)
    rows = [("Rung 1: flat guess", 0.5, None, None, "currentColor"), ("Rung 2: signup columns", a2, l2, h2, BLUE), ("Day-7 model", a3, l3, h3, GREEN)]
    for i, (label, v, lo, hi, col) in enumerate(rows):
        yy = 44 + i * 36
        s.text(8, yy + 3.5, label, size=9.5, weight=600 if i == 2 else None)
        if lo is not None:
            s.line(X(lo), yy, X(hi), yy, color=col, w=2.5, opacity=1)
            s.circle(X(v), yy, 5, col)
            s.text(X(v), yy - 11, f"{v:.3f}", anchor="middle", weight=600, size=9.5)
        else:
            s.circle(X(v), yy, 5, None, stroke="currentColor", opacity=0.9)
            s.text(X(v), yy - 11, f"{v:.3f}", anchor="middle", weight=600, size=9.5)
    base = 44 + 3 * 36 - 10
    s.line(X(0.45), base, X(0.75), base)
    for v in (0.5, 0.6, 0.7):
        s.line(X(v), base, X(v), base + 4)
        s.text(X(v), base + 16, f"{v:.1f}", anchor="middle", opacity=0.8)
    s.line(X(0.5), 30, X(0.5), base, opacity=0.35, dash="3 3")
    s.text(X(0.75), base + 30, "ROC AUC (0.5 is a coin flip)", anchor="end", opacity=0.8)
    out["ds2-ladder"] = s.render()

    # ---- ds3: one person's first 30 days against the cutoff ----
    con.execute("""CREATE VIEW people AS SELECT u.user_id FROM users AS u JOIN events AS s ON s.user_id = u.user_id AND s.event_name = 'signup_complete'
        WHERE u.signup_date BETWEEN DATE '2026-01-01' AND DATE '2026-05-31'""")
    uid = con.execute("""WITH e AS (SELECT p.user_id, e.event_name,
        ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY e.event_ts, e.event_id) AS pos,
        ROW_NUMBER() OVER (PARTITION BY p.user_id, e.event_ts, e.event_name, e.platform ORDER BY e.received_at, e.event_id) AS copy_no,
        COUNT(*) OVER (PARTITION BY p.user_id) AS n
      FROM people AS p JOIN events AS e ON e.user_id = p.user_id)
      SELECT user_id FROM e WHERE copy_no = 2 AND n >= 25 AND event_name IN ('session_start', 'add_expense') ORDER BY pos, user_id LIMIT 1""").fetchall()[0][0]
    pe = con.sql(f"""SELECT e.event_id, e.event_name, e.event_ts, e.received_at, s.event_ts AS signup_ts,
        ROW_NUMBER() OVER (PARTITION BY e.event_ts, e.event_name, e.platform ORDER BY e.received_at, e.event_id) AS copy_no
        FROM events AS e JOIN events AS s ON s.user_id = e.user_id AND s.event_name = 'signup_complete' WHERE e.user_id = {uid} ORDER BY e.event_ts, e.event_id""").df()
    pe["day"] = (pe["event_ts"] - pe["signup_ts"]).dt.total_seconds() / 86400
    pe = pe[pe["day"] <= 30]
    pe["late"] = pe["received_at"] > pe["signup_ts"] + pd.Timedelta(days=7)
    kinds = [("onboarding_complete", "onboarding"), ("session_start", "visit"), ("add_expense", "expense")]
    present = [(n, lab) for n, lab in kinds if (pe["event_name"] == n).any()]
    drawn = pe[pe["event_name"].isin([n for n, _ in present])]  # the desc counts only the rows the picture draws
    counted = int(((drawn["day"] <= 7) & (drawn["copy_no"] == 1) & ~drawn["late"]).sum())
    copies = int(((drawn["day"] <= 7) & (drawn["copy_no"] > 1)).sum())
    after = int((drawn["day"] > 7).sum())
    assert counted + copies + after + int(((drawn["day"] <= 7) & (drawn["copy_no"] == 1) & drawn["late"]).sum()) == len(drawn)
    s = Svg("ds3-timeline", f"The first 30 days of person {uid}, and what the table keeps",
            f"A timeline from day 0, the signup, to day 30 with one row for each kind of event of person {uid}. A cutoff line stands at day 7 and a horizon line at day 30. "
            f"Up to the cutoff there are {counted} events the app knew and counted, drawn in blue, and {copies} retry copy of an event, drawn in purple and dropped. "
            f"After the cutoff there are {after} events, drawn in green: they decide the label, which asks whether any visit or expense falls between day 7 and day 30, and no feature reads them.")
    X = Axis(0, 30, 66, 316)
    top = 58
    title_line(s, f"Person {uid}: days 0 to 30", 8, 10)
    s.rect(X(0), 24, X(7) - X(0), 12, BLUE, opacity=0.2, rx=2)
    s.rect(X(7), 24, X(30) - X(7), 12, GREEN, opacity=0.2, rx=2)
    s.text((X(0) + X(7)) / 2, 33.5, "features", anchor="middle", size=9, weight=600)
    s.text((X(7) + X(30)) / 2, 33.5, "label window", anchor="middle", size=9, weight=600)
    for k, (name, lab) in enumerate(present):
        yy = top + k * 20
        s.text(8, yy + 3.5, lab, size=9.5)
        s.line(X(0), yy, X(30), yy, opacity=0.13)
        for _, r in pe[pe["event_name"] == name].iterrows():
            col = GREEN if r["day"] > 7 else (PURPLE if r["copy_no"] > 1 else BLUE)
            s.circle(X(r["day"]), yy - (5 if col == PURPLE else 0), 3.5, col)
    base = top + len(present) * 20 - 6
    s.line(X(7), 40, X(7), base + 4, w=1.5, opacity=0.8)
    s.line(X(30), 40, X(30), base + 4, w=1.5, opacity=0.8, dash="3 3")
    s.line(X(0), base + 4, X(30), base + 4)
    for v in (0, 7, 14, 21, 30):
        s.line(X(v), base + 4, X(v), base + 8)
        s.text(X(v), base + 20, f"day {v}" if v in (0, 7, 30) else str(v), anchor="middle", opacity=0.8, size=9.5)
    s.text(X(7) + 5, base + 34, "cutoff", size=9.5, weight=600)
    s.text(X(30), base + 34, "horizon", anchor="end", size=9.5, weight=600)
    ly = base + 50
    square(s, 8, ly - 7, BLUE, 8)
    s.text(20, ly, "counted in a feature", size=9)
    square(s, 112, ly - 7, PURPLE, 8)
    s.text(124, ly, "retry copy, dropped", size=9)
    square(s, 214, ly - 7, GREEN, 8)
    s.text(226, ly, "after cutoff: label", size=9)
    out["ds3-timeline"] = s.render()

    # ---- ds4: odds ratios with 95 percent intervals (the model of unit 2, refit on 300 resamples) ----
    X_fit, X_val, y_fit, y_val = train_test_split(X_train, y_train, test_size=0.25, random_state=SEED, stratify=y_train)

    def recipe(num):
        cat = OneHotEncoder(drop=["organic_search", "web", "north_america"])
        return make_pipeline(ColumnTransformer([("cat", cat, STATIC), ("num", StandardScaler(), num)]), LogisticRegression(max_iter=1000))

    def odds_ratios(m):
        return pd.Series(np.exp(m[-1].coef_[0]), index=[n.split("__")[1] for n in m[0].get_feature_names_out()])

    full = recipe(WEEK1).fit(X_fit, y_fit)
    point = odds_ratios(full)
    rng = np.random.default_rng(SEED)
    boot = []
    for _ in range(300):
        i = rng.integers(0, len(X_fit), len(X_fit))
        boot.append(odds_ratios(recipe(WEEK1).fit(X_fit.iloc[i], y_fit.iloc[i])))
    allb = pd.concat(boot, axis=1)
    low, high = allb.quantile(0.025, axis=1), allb.quantile(0.975, axis=1)
    assert (round(point["expenses_7d"], 3), round(point["channel_paid_social"], 3)) == (0.745, 3.231), (point["expenses_7d"], point["channel_paid_social"])
    groups = [("Channel, against organic search", BLUE, [("channel_paid_social", "paid social"), ("channel_paid_search", "paid search"), ("channel_app_store", "app store"), ("channel_referral", "referral")]),
              ("Platform, against web", GREEN, [("platform_android", "Android"), ("platform_ios", "iOS")]),
              ("Region, against North America", PURPLE, [("region_asia_pacific", "Asia Pacific"), ("region_europe", "Europe"), ("region_latin_america", "Latin America")]),
              ("Week-1 columns, per standard deviation", OCHRE, [(c, c.replace("_7d", "").replace("_3d", " (last 3 days)").replace("_", " ")) for c in WEEK1])]
    desc_rows = "; ".join(f"{lab} {point[k]:.2f} ({low[k]:.2f} to {high[k]:.2f})" for _, _, items in groups for k, lab in items)
    s = Svg("ds4-odds", "Odds ratios of the churn model with 95 percent intervals",
            "A chart of 16 odds ratios on a log scale from 0.5 to 4 with a vertical line at 1, which means no change in the odds of churning. " + desc_rows
            + ". Paid social stands far to the right of 1. Region and platform intervals include 1. Intervals come from refitting the model on 300 resamples of the 10,021 fitting people.")
    X = Axis(np.log(0.5), np.log(4.0), 142, 296)
    title_line(s, "Odds of churning: odds ratio, 95% interval", 8, 10)
    yy = 28
    for gname, col, items in groups:
        s.text(8, yy + 9, gname, size=9.5, weight=600, fill=None)
        yy += 15
        for k, lab in items:
            s.text(14, yy + 3.5, lab, size=9)
            s.line(X(np.log(low[k])), yy, X(np.log(high[k])), yy, color=col, w=2.5, opacity=1)
            s.circle(X(np.log(point[k])), yy, 3.5, col)
            s.text(332, yy + 3.5, f"{point[k]:.2f}", anchor="end", size=9, weight=600)
            yy += 14
        yy += 3
    s.line(X(0), 40, X(0), yy - 3, w=1, opacity=0.5, dash="3 3")
    s.line(X(np.log(0.5)), yy, X(np.log(4)), yy)
    for v in (0.5, 1, 2, 4):
        s.line(X(np.log(v)), yy, X(np.log(v)), yy + 4)
        s.text(X(np.log(v)), yy + 16, f"{v:g}", anchor="middle", opacity=0.8)
    s.text(X(np.log(4)), yy + 30, "odds ratio (log scale; 1 = no change)", anchor="end", opacity=0.8)
    out["ds4-odds"] = s.render()

    # ---- ds4: cost per 1,000 people by threshold, validation and test ----
    FP, FN = 2.0, 1.0
    grid = np.round(np.arange(0.05, 0.96, 0.01), 2)

    def cost_per_1000(p, yy_, t):
        flag = p >= t
        return 1000 * (FP * (flag & (yy_ == 0)).sum() + FN * (~flag & (yy_ == 1)).sum()) / len(yy_)

    p_val, p_test = full.predict_proba(X_val)[:, 1], full.predict_proba(X_test)[:, 1]
    yv, yt = y_val.to_numpy(), y_test.to_numpy()
    cv_ = [cost_per_1000(p_val, yv, t) for t in grid]
    ct_ = [cost_per_1000(p_test, yt, t) for t in grid]
    best = float(grid[int(np.argmin(cv_))])
    nobody, everybody, at_best = cost_per_1000(p_test, yt, 1.01), cost_per_1000(p_test, yt, 0.0), cost_per_1000(p_test, yt, best)
    assert (best, round(at_best), round(everybody), round(nobody)) == (0.65, 464, 912, 544), (best, at_best, everybody, nobody)
    s = Svg("ds4-cost", "Cost for every 1,000 people by threshold, on the validation part and on the test part",
            f"A line chart of the cost of an offer rule for every 1,000 people, from 0 to 1,000 dollars, against the threshold from 0.05 to 0.95. A wasted offer costs 2 dollars and a leaver left without an offer 1 dollar. "
            f"Two lines, one for the validation part and one for the test part, fall from about {ct_[0]:.0f} dollars at a threshold of 0.05 to a low near 0.65 and rise to about {ct_[-1]:.0f} at 0.95. "
            f"The cheapest threshold on the validation part is {best:.2f}, and it costs {at_best:.0f} dollars on the test part. Two dashed lines mark the test cost of messaging nobody, {nobody:.0f} dollars, and of messaging everybody, {everybody:.0f} dollars.")
    X, Y = Axis(0.05, 0.95, 52, 328), Axis(0, 1000, 168, 36)
    title_line(s, "Cost for every 1,000 people, by threshold (dollars)", 8, 10)
    axis_ticks_y(s, X(0.05), X(0.95), Y, [0, 250, 500, 750, 1000], lambda v: f"{v:,}")
    for t in (0.2, 0.4, 0.6, 0.8):
        s.text(X(t), Y(0) + 14, f"{t:.1f}", anchor="middle", opacity=0.8)
    s.text(X(0.95), Y(0) + 28, "threshold: flag when the chance is at least", anchor="end", opacity=0.8)
    s.line(X(0.05), Y(everybody), X(0.95), Y(everybody), color=OCHRE, w=1.5, opacity=0.9, dash="5 3")
    s.text(X(0.95), Y(everybody) - 5, f"message everybody ${everybody:,.0f}", anchor="end", size=9.5)
    s.line(X(0.05), Y(nobody), X(0.95), Y(nobody), color=PURPLE, w=1.5, opacity=0.9, dash="5 3")
    s.text(X(0.95), Y(nobody) - 5, f"message nobody ${nobody:,.0f}", anchor="end", size=9.5)
    s.poly([(X(t), Y(c)) for t, c in zip(grid, cv_)], BLUE, w=4.5)
    s.poly([(X(t), Y(c)) for t, c in zip(grid, ct_)], GREEN, w=1.8)
    s.circle(X(best), Y(at_best), 5, GREEN)
    s.text(X(best) + 8, Y(at_best) + 20, f"{best:.2f}: ${at_best:,.0f}", size=9.5, weight=600)
    square(s, 92, 22, BLUE)
    s.text(104, 29.5, "validation", size=9.5)
    square(s, 170, 22, GREEN)
    s.text(182, 29.5, "test", size=9.5)
    out["ds4-cost"] = s.render()

    # ---- ds5: the overfitting gap of a tree ----
    curve = []
    for depth in [1, 2, 3, 4, 6, 8, 12, None]:
        m = tree(depth).fit(X_fit, y_fit)
        curve.append((depth, float(roc_auc_score(y_fit, m.predict_proba(X_fit)[:, 1])), float(roc_auc_score(y_val, m.predict_proba(X_val)[:, 1]))))
    assert (round(curve[-1][1], 3), round(curve[-1][2], 3), round(max(c[2] for c in curve), 3)) == (0.906, 0.570, 0.688), curve
    labels = ["1", "2", "3", "4", "6", "8", "12", "no limit"]
    s = Svg("ds5-curves", "ROC AUC of a decision tree on the fitting rows and on the validation rows, by depth",
            "A line chart of the ROC AUC, on a scale from 0.5 to 1.0, for trees of depth " + ", ".join(labels) + ". On the fitting rows it rises from "
            + f"{curve[0][1]:.3f} to {curve[-1][1]:.3f}. On the validation rows it rises to {max(c[2] for c in curve):.3f} at depth 4, stays within a few thousandths from depth 3 to 6, "
            + f"and then falls to {curve[-1][2]:.3f} for the tree with no limit. The widening gap between the two lines is the overfitting.")
    X, Y = Axis(0, 7, 48, 236), Axis(0.5, 1.0, 168, 36)
    title_line(s, "ROC AUC by the depth of the tree", 8, 10)
    axis_ticks_y(s, X(0), X(7), Y, [0.5, 0.6, 0.7, 0.8, 0.9, 1.0], lambda v: f"{v:.1f}")
    s.poly([(X(i), Y(c[1])) for i, c in enumerate(curve)], BLUE, w=2)
    s.poly([(X(i), Y(c[2])) for i, c in enumerate(curve)], GREEN, w=2)
    for i, c in enumerate(curve):
        s.circle(X(i), Y(c[1]), 3.5, BLUE)
        s.circle(X(i), Y(c[2]), 3.5, GREEN)
        s.text(X(i), Y(0.5) + 14, labels[i], anchor="middle", opacity=0.8, size=9.5 if i < 7 else 9)
    s.text(X(7) + 8, Y(curve[-1][1]) + 3.5, f"fitting {curve[-1][1]:.3f}", size=9.5, weight=600)
    s.text(X(7) + 8, Y(curve[-1][2]) + 3.5, f"validation {curve[-1][2]:.3f}", size=9.5, weight=600)
    s.text(X(3), Y(0.688) - 9, f"best {max(c[2] for c in curve):.3f}", anchor="middle", size=9.5, weight=600)
    s.text(X(7) + 10, Y(0.5) + 28, "max depth of the tree", anchor="end", opacity=0.8)
    out["ds5-curves"] = s.render()

    # ---- ds5: how the folds are cut ----
    Xs = X_train.sort_index()
    ts_sizes = [(len(a), len(b)) for a, b in TimeSeriesSplit(n_splits=4).split(Xs)]
    kf = [len(b) for _, b in StratifiedKFold(5, shuffle=True, random_state=SEED).split(Xs, y_train.sort_index())]
    n = len(Xs)
    s = Svg("ds5-folds", "Five stratified folds and four time-based folds of the 13,362 training people",
            f"Two groups of bars. First, five stratified folds: in each of five rows one fifth of the people, about {kf[0]:,} chosen at random, is the test fold in green and the rest train the model in blue, "
            "so every fold has the same share of churners. Second, four time-based folds with the people in signup order from January to May: the first model trains on "
            + ", ".join(f"{a:,}" for a, _ in ts_sizes) + f" people and is tested on the next {ts_sizes[0][1]:,} each time, never on earlier people; the people after the test block are not used in that fold.")
    X = Axis(0, n, 110, 330)
    title_line(s, "How the training people are cut into folds", 8, 10)
    s.text(8, 32, "Stratified, 5 folds (random people)", size=9.5, weight=600)
    for k in range(5):
        yy = 40 + k * 16
        s.text(8, yy + 10, f"fold {k + 1}", size=9, opacity=0.85)
        w = (X(n) - X(0)) / 5
        for j in range(5):
            s.rect(X(0) + j * w + 0.5, yy, w - 1, 12, GREEN if j == k else BLUE, rx=2, opacity=1 if j == k else 0.55)
    y0 = 40 + 5 * 16 + 18
    s.text(8, y0, "Time-based, 4 folds (signup order)", size=9.5, weight=600)
    for k, (a, b) in enumerate(ts_sizes):
        yy = y0 + 8 + k * 16
        s.text(8, yy + 10, f"fold {k + 1}", size=9, opacity=0.85)
        s.rect(X(0), yy, X(a) - X(0), 12, BLUE, rx=2, opacity=0.55)
        s.rect(X(a) + 1, yy, X(a + b) - X(a) - 1, 12, GREEN, rx=2)
        if X(n) - X(a + b) - 1 > 0:  # the last fold leaves no people unused: draw no rectangle (never a zero or negative width)
            s.rect(X(a + b) + 1, yy, X(n) - X(a + b) - 1, 12, None, stroke="currentColor", sw=1, dash="2 3", rx=2)
    yb = y0 + 8 + 4 * 16 + 4
    s.text(X(0), yb + 10, "January", size=9, opacity=0.8)
    s.text(X(n), yb + 10, "May", anchor="end", size=9, opacity=0.8)
    ly = yb + 30
    square(s, 8, ly - 7, BLUE, 8)
    s.text(20, ly, "train", size=9)
    square(s, 66, ly - 7, GREEN, 8)
    s.text(78, ly, "test", size=9)
    s.rect(120, ly - 7, 8, 8, None, stroke="currentColor", sw=1, dash="2 3", rx=2)
    s.text(132, ly, "not used in that fold", size=9)
    out["ds5-folds"] = s.render()
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
