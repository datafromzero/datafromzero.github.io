"""Draws the static charts of the core lessons C20 (data-leakage) and C21 (metrics-and-error-costs) from the app-events data.

    python3 scripts/charts/core-c20-c21.py --out DIR   write every chart as DIR/<name>.svg
    python3 scripts/charts/core-c20-c21.py --check     exit 1 unless every chart appears, byte for byte, in its lesson

Needs pandas, numpy and scikit-learn. The charts are plain SVG with currentColor text, the figure color roles of the site and a title and a desc, so
they can be pasted into the .mdx lessons as they are (each tag on its own line). Rerun and paste again when the data or a number changes.
Colors: data and estimate blue, flagged red, first group green. The models are the honest recipe of lessons C19 to C21 (logistic regression on channel,
platform and region) fitted on the training part of a seeded split; the seeds are 20 (C20) and 21 (C21), as in the notebooks.
"""
import html
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "datasets" / "app-events" / "v1"
LESSONS = {"dl": ROOT / "src/content/docs/core/data-leakage.mdx", "mc": ROOT / "src/content/docs/core/metrics-and-error-costs.mdx"}
BLUE, GREEN, RED = "#0072b2", "#00a07a", "#c0392b"
CATS = ["channel", "platform", "region"]


# ---------- a tiny SVG kit (the same as scripts/charts/core-c14-c15.py) ----------
def esc(s):
    s = html.escape(str(s), quote=False)
    return s.replace("$", "&#36;").replace("*", "&#42;").replace("{", "&#123;").replace("}", "&#125;")


def r1(v):
    return f"{round(v, 1):g}"


class Svg:
    def __init__(self, sid, h, title, desc, w=360):
        self.sid, self.h, self.w, self.title, self.desc, self.items = sid, h, w, title, desc, []

    def text(self, x, y, s, size=10, weight=None, anchor=None, opacity=None, fill=None):
        a = f' font-size="{size:g}"'
        a += f' font-weight="{weight}"' if weight else ""
        a += f' text-anchor="{anchor}"' if anchor else ""
        a += f' fill="{fill}"' if fill else ""
        a += f' fill-opacity="{opacity}"' if opacity else ""
        self.items.append(f'<text x="{r1(x)}" y="{r1(y)}"{a}>{esc(s)}</text>')

    def rect(self, x, y, w, h, fill, opacity=None, rx=None, stroke=None, sw=1, dash=None):
        a = f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}"' + (f' rx="{rx}"' if rx else "")
        a += f' fill="{fill}"' if fill else ' fill="none"'
        a += f' fill-opacity="{opacity}"' if opacity is not None else ""
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{sw}"' + (f' stroke-dasharray="{dash}"' if dash else "")
        self.items.append(a + " />")

    def line(self, x1, y1, x2, y2, color="currentColor", w=1, opacity=0.4, dash=None):
        a = f'<path d="M{r1(x1)} {r1(y1)} L{r1(x2)} {r1(y2)}" fill="none" stroke="{color}" stroke-width="{w:g}" stroke-opacity="{opacity}"'
        self.items.append(a + (f' stroke-dasharray="{dash}"' if dash else "") + " />")

    def poly(self, pts, color, w=2):
        d = "M" + " L".join(f"{r1(x)} {r1(y)}" for x, y in pts)
        self.items.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w:g}" stroke-linejoin="round" />')

    def circle(self, x, y, r, fill):
        self.items.append(f'<circle cx="{r1(x)}" cy="{r1(y)}" r="{r}" fill="{fill}" />')

    def render(self):
        t, d = f"{self.sid}-t", f"{self.sid}-d"
        return "\n".join([
            f'<svg viewBox="0 0 {self.w} {self.h}" width="{self.w}" role="img" aria-labelledby="{t} {d}">',
            f'<title id="{t}">{esc(self.title)}</title>',
            f'<desc id="{d}">{esc(self.desc)}</desc>',
            '<g fill="currentColor">', *self.items, "</g>", "</svg>",
        ])


class Axis:
    def __init__(self, d0, d1, p0, p1):
        self.d0, self.d1, self.p0, self.p1 = d0, d1, p0, p1

    def __call__(self, v):
        return self.p0 + (v - self.d0) * (self.p1 - self.p0) / (self.d1 - self.d0)


# ---------- the data and the honest recipe (the data cell of the notebooks) ----------
users = pd.read_csv(DATA / "users.csv", parse_dates=["signup_date"])
events = pd.read_csv(DATA / "events.csv", parse_dates=["event_ts"], usecols=["user_id", "event_ts", "event_name", "platform"])
subs = pd.read_csv(DATA / "subscriptions.csv", parse_dates=["started_on", "ended_on", "updated_at"])
signup = events[events["event_name"] == "signup_complete"].drop_duplicates("user_id").set_index("user_id")
users["platform"] = users["user_id"].map(signup["platform"])
users["signup_ts"] = users["user_id"].map(signup["event_ts"])
first_buy = events[events["event_name"] == "purchase"].groupby("user_id")["event_ts"].min()
people = users[(users["signup_date"] <= pd.Timestamp("2026-06-16")) & users["signup_ts"].notna()].copy()
people["days_to_buy"] = (people["user_id"].map(first_buy) - people["signup_ts"]).dt.total_seconds() / 86400
people["bought14"] = (people["days_to_buy"] <= 14).astype(int)


def make_model(extra=()):
    parts = [("cat", OneHotEncoder(handle_unknown="ignore"), CATS)]
    if extra:
        parts.append(("num", StandardScaler(), list(extra)))
    return make_pipeline(ColumnTransformer(parts), LogisticRegression(max_iter=1000))


def score(model, df):
    return float(brier_score_loss(df["bought14"], model.predict_proba(df)[:, 1]))


def charts():
    out = {}

    # ---- C20: the Brier score of the honest recipe and of the three leaky columns, one at a time (seed 20) ----
    people["n_events"] = people["user_id"].map(events.groupby("user_id").size()).fillna(0)
    people["plus_uses"] = people["user_id"].map(events[events["event_name"] == "plus_feature_used"].groupby("user_id").size()).fillna(0)
    latest = subs.sort_values("updated_at").groupby("subscription_id").tail(1)
    people["has_plan"] = people["user_id"].isin(latest["user_id"]).astype(int)
    train, test = train_test_split(people, test_size=0.25, random_state=20, stratify=people["bought14"])
    base = float(brier_score_loss(test["bought14"], np.full(len(test), train["bought14"].mean())))
    rows = [("baseline: the training share", base, "currentColor", 0.35)]
    rows.append(("honest recipe", score(make_model().fit(train, train["bought14"]), test), BLUE, 0.95))
    for col in ("n_events", "plus_uses", "has_plan"):
        rows.append((f"+ {col}", score(make_model([col]).fit(train, train["bought14"]), test), RED, 0.9))
    X = Axis(0, 0.12, 150, 320)
    s = Svg("dl-brier", 232, "Brier score on the test part: the baseline, the honest recipe and the recipe with each of three leaky columns added alone",
            "A horizontal bar chart on a scale from 0 to 0.12, smaller is better. " + " ".join(f"{label}: {v:.4f}." for label, v, _, _ in rows)
            + " The first bar is gray, the honest recipe is blue and the three bars of the added columns are red; the red bars are much shorter.")
    s.text(14, 14, "Brier score on the test part (smaller is better)", size=10.5, weight=600)
    for i, (label, v, color, op) in enumerate(rows):
        y = 34 + 30 * i
        s.text(14, y + 14, label)
        s.rect(X(0), y, X(v) - X(0), 20, color, opacity=op)
        s.text(X(v) + 5, y + 14, f"{v:.4f}", weight=600)
    s.line(X(0), 184, X(0.12), 184)
    for v in (0, 0.04, 0.08, 0.12):
        s.line(X(v), 184, X(v), 188)
        s.text(X(v), 200, f"{v:g}", anchor="middle", opacity=0.8)
    s.rect(14, 212, 8, 8, RED)
    s.text(28, 220, "red: a column that settles after the prediction moment", size=9, opacity=0.9)
    out["dl-brier"] = s.render()

    # ---- C21: the confusion matrix at the cut 0.5, and the total cost by threshold (seed 21) ----
    train, test = train_test_split(people, test_size=0.25, random_state=21, stratify=people["bought14"])
    model = make_model().fit(train, train["bought14"])
    chance = model.predict_proba(test)[:, 1]
    y = test["bought14"].to_numpy()
    tn, fp, fn, tp = confusion_matrix(y, chance >= 0.5).ravel().tolist()
    s = Svg("mc-matrix", 232, "Confusion matrix at the threshold 0.5: no test person is flagged",
            f"A two by two table. Rows are the true outcome, columns are the call. Did not buy and not flagged: {tn:,} true negatives. Did not buy and flagged: {fp} false positives. Bought and not flagged: {fn} false negatives. Bought and flagged: {tp} true positives. The two cells of right calls are green and the two cells of wrong calls are red.")
    s.text(14, 14, f"Test part, {len(y):,} people, flagged when the chance is at least 0.5", size=10.5, weight=600)
    x0, y0, cw, ch = 96, 54, 120, 66
    s.text(x0 + cw / 2, 44, "not flagged", anchor="middle", weight=600)
    s.text(x0 + cw * 1.5, 44, "flagged", anchor="middle", weight=600)
    s.text(14, y0 + ch / 2 + 4, "did not buy", weight=600)
    s.text(14, y0 + ch * 1.5 + 4, "bought", weight=600)
    for (r, c, n, name, good) in ((0, 0, tn, "true negative", True), (0, 1, fp, "false positive", False), (1, 0, fn, "false negative", False), (1, 1, tp, "true positive", True)):
        cx, cy = x0 + c * cw, y0 + r * ch
        s.rect(cx, cy, cw - 4, ch - 4, GREEN if good else RED, opacity=0.22, rx=6)
        s.text(cx + (cw - 4) / 2, cy + 30, f"{n:,}", size=16, weight=700, anchor="middle")
        s.text(cx + (cw - 4) / 2, cy + 48, name, anchor="middle", opacity=0.9)
    s.text(14, 206, "Rows: what happened. Columns: what the rule said.", size=9, opacity=0.85)
    s.text(14, 220, "A false positive is a wrong flag, a false negative a missed buyer.", size=9, opacity=0.85)
    out["mc-matrix"] = s.render()

    grid = [round(0.03 + 0.01 * k, 2) for k in range(28)]
    cost = {t: int(((chance >= t) & (y == 0)).sum()) + 5 * int(((chance < t) & (y == 1)).sum()) for t in grid}
    nobody, everybody, formula = 5 * int(y.sum()), int((y == 0).sum()), int(((chance >= 1 / 6) & (y == 0)).sum()) + 5 * int(((chance < 1 / 6) & (y == 1)).sum())
    best = min(cost, key=cost.get)
    X, Y = Axis(0.03, 0.30, 52, 344), Axis(2600, 4600, 196, 40)
    s = Svg("mc-cost", 290, "Total cost of the errors for each threshold, with the costs of messaging nobody and messaging everybody",
            f"A line chart. The horizontal axis is the threshold from 0.03 to 0.30, the vertical axis the total cost in dollars from 2,600 to 4,600, for a false positive costing 1 dollar and a false negative 5 dollars. The blue curve falls from {cost[0.03]:,} dollars at 0.03 to a lowest point of {cost[best]:,} dollars at {best} and rises to {cost[0.3]:,} at 0.30. A dashed gray line marks {nobody:,} dollars for messaging nobody and another {everybody:,} dollars for messaging everybody. A dashed vertical line at one sixth, 0.167, meets the curve at {formula:,} dollars.")
    s.text(14, 14, "Total cost of the errors, in dollars, by threshold", size=10.5, weight=600)
    for v in (3000, 3500, 4000, 4500):
        s.line(X(0.03), Y(v), X(0.30), Y(v), opacity=0.15)
        s.text(X(0.03) - 4, Y(v) + 3.5, f"{v:,}", anchor="end", opacity=0.8)
    s.line(X(0.03), Y(everybody), X(0.30), Y(everybody), opacity=0.6, dash="4 3")
    s.text(X(0.30), Y(everybody) - 5, f"everybody: {everybody:,}", anchor="end", size=9)
    s.line(X(0.03), Y(nobody), X(0.30), Y(nobody), opacity=0.6, dash="4 3")
    s.text(X(0.03) + 4, Y(nobody) + 12, f"nobody: {nobody:,}", size=9)
    s.poly([(X(t), Y(cost[t])) for t in grid], BLUE)
    s.line(X(1 / 6), 40, X(1 / 6), 196, color=GREEN, w=1.5, opacity=0.9, dash="4 3")
    s.circle(X(1 / 6), Y(formula), 4.5, GREEN)
    s.circle(X(best), Y(cost[best]), 4.5, BLUE)
    s.line(X(0.03), 196, X(0.30), 196)
    for v in (0.05, 0.10, 0.15, 0.20, 0.25, 0.30):
        s.line(X(v), 196, X(v), 200)
        s.text(X(v), 212, f"{v:.2f}", anchor="middle", opacity=0.8)
    s.text(X(0.30), 228, "threshold: flag a person when the chance is at least this", anchor="end", size=9, opacity=0.85)
    s.circle(20, 246, 4.5, GREEN)
    s.text(30, 249.5, f"the break-even threshold 1/6 = 0.167 costs {formula:,}", size=9.5)
    s.circle(20, 262, 4.5, BLUE)
    s.text(30, 265.5, f"the cheapest threshold on the grid, {best}, costs {cost[best]:,}", size=9.5)
    s.text(14, 282, "A false positive costs $1, a false negative $5.", size=9, opacity=0.85)
    out["mc-cost"] = s.render()
    return out


if __name__ == "__main__":
    result = charts()
    if "--check" in sys.argv:
        texts = {k: v.read_text() for k, v in LESSONS.items()}
        bad = [name for name, svg in result.items() if svg not in texts[name.split("-")[0]]]
        print("charts out of date in their lesson:", bad or "none")
        sys.exit(1 if bad else 0)
    if "--out" in sys.argv:
        folder = Path(sys.argv[sys.argv.index("--out") + 1])
        folder.mkdir(parents=True, exist_ok=True)
        for name, svg in result.items():
            (folder / f"{name}.svg").write_text(svg + "\n")
        print("wrote", ", ".join(result))
    else:
        print(__doc__)
