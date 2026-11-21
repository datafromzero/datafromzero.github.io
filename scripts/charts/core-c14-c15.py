"""Draws the static charts of the core lessons C14 (experiments-ab-testing) and C15 (telling-the-story) from the app-events data.

    python3 scripts/charts/core-c14-c15.py --out DIR   write every chart as DIR/<name>.svg
    python3 scripts/charts/core-c14-c15.py --check     exit 1 unless every chart appears, byte for byte, in its lesson

Needs pandas and numpy. The charts are plain SVG with currentColor text, the figure color roles of the site and a title and a desc, so
they can be pasted into the .mdx lessons as they are (each tag on its own line). Rerun and paste again when the data or a number changes.
Colors: true value ochre, data and estimate blue, flagged red, first group green, second group purple.
"""
import html
import sys
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "datasets" / "app-events" / "v1"
LESSONS = {"ab": ROOT / "src/content/docs/core/experiments-ab-testing.mdx", "ts": ROOT / "src/content/docs/core/telling-the-story.mdx"}
BLUE, GREEN, PURPLE, OCHRE, RED = "#0072b2", "#00a07a", "#9a6be0", "#ad9100", "#c0392b"


# ---------- a tiny SVG kit ----------
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


def gap(c, v):
    n0, n1, c0, c1 = len(c), len(v), int(c.sum()), int(v.sum())
    p0, p1 = c0 / n0, c1 / n1
    se = np.sqrt(p0 * (1 - p0) / n0 + p1 * (1 - p1) / n1)
    return dict(n0=n0, n1=n1, gap=p1 - p0, low=p1 - p0 - 1.96 * se, high=p1 - p0 + 1.96 * se)


# ---------- the data ----------
users = pd.read_csv(DATA / "users.csv", parse_dates=["signup_date"])
assign = pd.read_csv(DATA / "experiment_assignments.csv", parse_dates=["assigned_at"])
subs = pd.read_csv(DATA / "subscriptions.csv", parse_dates=["started_on", "ended_on", "updated_at"])
events = pd.read_csv(DATA / "events.csv", parse_dates=["event_ts"], usecols=["user_id", "event_ts", "event_name", "platform"])
signup = events[events.event_name == "signup_complete"].drop_duplicates("user_id").set_index("user_id")
users["platform"] = users["user_id"].map(signup["platform"])
pw = assign[assign.experiment == "paywall_v2"].copy()
pw["week"] = (pw["assigned_at"].dt.normalize() - pd.Timestamp("2026-01-12")).dt.days // 7 + 1
ctrl, var = (lambda g: g[g.variant == "control"].converted), (lambda g: g[g.variant == "variant"].converted)


def title_line(s, text, x=14, y=14):
    s.text(x, y, text, size=10.5, weight=600)


def charts():
    out = {}

    # ---- C14: Android people in signup_flow_v2 ----
    sf = assign[assign.experiment == "signup_flow_v2"].merge(users[["user_id", "platform"]], on="user_id")
    a = sf[sf.platform == "android"]
    a_c, a_v = int((a.variant == "control").sum()), int((a.variant == "variant").sum())
    window = users[(users.signup_date >= "2026-05-04") & (users.signup_date <= "2026-06-07")]
    missing = int((~window.user_id.isin(assign[assign.experiment == "signup_flow_v2"].user_id)).sum())
    X = Axis(0, 1400, 80, 330)
    s = Svg("ab-android", 184, "Android people in signup_flow_v2: control, variant, and the people with no assignment row",
            f"Two horizontal bars on a scale from 0 to 1,400 people. The control bar is green and reaches {a_c:,}. The variant bar is purple and reaches {a_v:,}; a red dashed box continues it by {missing} people who have no assignment row, ending at {a_v + missing:,}, level with the control bar.")
    title_line(s, "Android people who signed up during the test")
    s.text(14, 56, "control")
    s.rect(X(0), 42, X(a_c) - X(0), 22, GREEN, opacity=0.9)
    s.text(X(a_c) + 6, 57, f"{a_c:,}", weight=600)
    s.text(14, 98, "variant")
    s.rect(X(0), 84, X(a_v) - X(0), 22, PURPLE, opacity=0.9)
    s.rect(X(a_v), 84, X(a_v + missing) - X(a_v), 22, RED, opacity=0.12, stroke=RED, sw=1.5, dash="4 3")
    s.text(X(a_v + missing) + 6, 99, f"{a_v + missing:,}", weight=600)
    s.text(X(a_v / 2), 121, f"{a_v} in the variant", anchor="middle")
    s.text(X(a_v + missing / 2), 134, f"+ {missing}, no row", anchor="middle", fill=RED, weight=600)
    s.line(X(0), 146, X(1400), 146)
    for v in (0, 400, 800, 1200):
        s.line(X(v), 146, X(v), 150)
        s.text(X(v), 161, f"{v:,}", anchor="middle", opacity=0.8)
    s.text(340, 176, "Android people", anchor="end", opacity=0.8)
    out["ab-android"] = s.render()

    # ---- C14: the lift by period, with the true gaps of the dataset's model ----
    rows = []
    for label, g, truth in (("week 1", pw[pw.week == 1], 5.2), ("weeks 2 to 8", pw[pw.week >= 2], 2.4), ("all eight weeks", pw, 2.7)):
        rows.append((label, gap(ctrl(g), var(g)), truth))
    X = Axis(-2, 14, 118, 340)
    s = Svg("ab-novelty", 214, "The lift of paywall_v2 in week 1, in weeks 2 to 8 and over all eight weeks, with 95 percent intervals and the true gaps",
            "Three rows on a scale of the gap in percentage points from minus 2 to 14, with a gray line at 0. Each row has a blue dot for the measured gap and a blue bar for its 95 percent interval, and an ochre tick for the true gap known from the dataset's parameters. Week 1: 6.6 points, interval 0.9 to 12.4, true 5.2. Weeks 2 to 8: 2.1, interval 0.2 to 4.1, true 2.4. All eight weeks: 2.6, interval 0.8 to 4.5, true 2.7. The intervals of week 1 and of weeks 2 to 8 overlap.")
    title_line(s, "Gap in conversion, variant minus control (points)")
    for i, (label, t, truth) in enumerate(rows):
        y = 44 + i * 42
        s.text(14, y + 4, label, weight=600)
        s.text(14, y + 17, f"{t['n0']:,} and {t['n1']:,} people", size=9, opacity=0.8)
        s.rect(X(100 * t["low"]), y - 3, X(100 * t["high"]) - X(100 * t["low"]), 6, BLUE, opacity=0.9, rx=3)
        s.circle(X(100 * t["gap"]), y, 5, BLUE)
        s.line(X(truth), y - 11, X(truth), y + 11, color=OCHRE, w=2.5, opacity=1)
        s.text(X(100 * t["high"]) + 6, y + 4, f"{100 * t['gap']:+.1f}", weight=600)
    s.line(X(0), 32, X(0), 176, opacity=0.5)
    s.line(X(-2), 176, X(14), 176)
    for v in (-2, 0, 2, 4, 6, 8, 10, 12, 14):
        s.line(X(v), 176, X(v), 180)
        s.text(X(v), 191, f"{v:+d}" if v > 0 else str(v), anchor="middle", opacity=0.8)
    s.line(14, 206, 24, 206, color=OCHRE, w=2.5, opacity=1)
    s.text(30, 209.5, "ochre tick: the true gap, from the dataset's parameters", size=9, opacity=0.9)
    out["ab-novelty"] = s.render()

    # ---- C14: the readout against the rule ----
    latest = subs.sort_values("updated_at").groupby("subscription_id").tail(1)
    first_sub = latest.sort_values("started_on").groupby("user_id").head(1)
    buyers = pw[pw.converted].merge(first_sub[["user_id", "started_on", "ended_on"]], on="user_id", how="left")
    buyers["c30"] = (buyers.ended_on - buyers.started_on).dt.days <= 30
    cg, main = gap(ctrl(buyers.assign(converted=buyers.c30)), var(buyers.assign(converted=buyers.c30))), rows[2][1]
    s = Svg("ab-readout", 262, "The readout of paywall_v2 against the rule written before launch: the lift clears its bar, the guardrail interval crosses its limit",
            "Two scales. Top: the lift in percentage points from minus 2 to 10, with a blue dot at 2.6 and a blue bar from 0.8 to 4.5, a solid gray line at 0 and a dashed line at the 2-point bar. Bottom: the change in the 30-day cancel rate among buyers, from minus 4 to 12 points, with a blue dot at 4.1 and a bar from minus 1.1 to 9.3; the part of the bar beyond the dashed limit at 5 points is red.")
    title_line(s, "Lift in conversion (points)")
    X1, ya = Axis(-2, 10, 40, 340), 62
    s.line(X1(0), ya - 24, X1(0), ya + 12, opacity=0.6)
    s.line(X1(2), ya - 24, X1(2), ya + 12, opacity=0.6, dash="4 3")
    s.text(X1(2) + 5, ya - 14, "bar: 2", weight=600)
    s.text(X1(0) - 5, ya - 14, "0", anchor="end", opacity=0.8)
    s.rect(X1(100 * main["low"]), ya - 3, X1(100 * main["high"]) - X1(100 * main["low"]), 6, BLUE, opacity=0.9, rx=3)
    s.circle(X1(100 * main["gap"]), ya, 5, BLUE)
    s.text(X1(100 * main["gap"]), ya + 28, f"{100 * main['gap']:+.1f}  ({100 * main['low']:.1f} to {100 * main['high']:.1f})", weight=600, anchor="middle")
    s.line(X1(-2), ya + 32, X1(10), ya + 32)
    for v in (-2, 0, 2, 4, 6, 8, 10):
        s.line(X1(v), ya + 32, X1(v), ya + 36)
        s.text(X1(v), ya + 48, f"{v:+d}" if v > 0 else str(v), anchor="middle", opacity=0.8)
    title_line(s, "Cancel within 30 days, among buyers (points)", y=140)
    X2, yb, lim = Axis(-4, 12, 40, 340), 190, 5
    lo, hi, est = 100 * cg["low"], 100 * cg["high"], 100 * cg["gap"]
    s.line(X2(0), yb - 24, X2(0), yb + 12, opacity=0.6)
    s.line(X2(lim), yb - 24, X2(lim), yb + 12, opacity=0.6, dash="4 3")
    s.text(X2(lim) + 5, yb - 14, "limit: 5", weight=600)
    s.text(X2(0) - 5, yb - 14, "0", anchor="end", opacity=0.8)
    s.rect(X2(lo), yb - 3, X2(lim) - X2(lo), 6, BLUE, opacity=0.9, rx=3)
    s.rect(X2(lim), yb - 3, X2(hi) - X2(lim), 6, RED, opacity=0.95)
    s.circle(X2(est), yb, 5, BLUE)
    s.text(X2(est), yb + 28, f"{est:+.1f}  ({lo:.1f} to {hi:.1f})", weight=600, anchor="middle")
    s.line(X2(-4), yb + 32, X2(12), yb + 32)
    for v in (-4, 0, 4, 8, 12):
        s.line(X2(v), yb + 32, X2(v), yb + 36)
        s.text(X2(v), yb + 48, f"{v:+d}" if v > 0 else str(v), anchor="middle", opacity=0.8)
    out["ab-readout"] = s.render()

    # ---- C15: the weekly chart, before and after ----
    weekly = pw.groupby(["week", "variant"])["converted"].mean().unstack() * 100
    weekly["gap"] = weekly["variant"] - weekly["control"]
    g1 = 100 * gap(ctrl(pw[pw.week == 1]), var(pw[pw.week == 1]))["gap"]
    g2 = 100 * gap(ctrl(pw[pw.week >= 2]), var(pw[pw.week >= 2]))["gap"]
    X0, X1b = 44, 344
    slot = (X1b - X0) / 8
    cx = lambda i: X0 + slot * (i + 0.5)

    s = Svg("ts-before", 232, "The first chart: conversion in control and variant for each of the eight weeks of paywall_v2",
            "A grouped bar chart with a frame and horizontal gridlines. For each of weeks 1 to 8 there is a green bar for control and a purple bar for the variant, between about 11 and 19 percent, with a legend and the plain title Conversion by week.")
    s.text(14, 14, "Conversion by week", size=10.5, weight=600)
    s.rect(196, 24, 8, 8, GREEN)
    s.text(208, 32, "control")
    s.rect(262, 24, 8, 8, PURPLE)
    s.text(274, 32, "variant")
    Y = Axis(0, 20, 184, 44)
    s.rect(X0, 44, X1b - X0, 140, None, stroke="currentColor", sw=1)
    for v in (5, 10, 15):
        s.line(X0, Y(v), X1b, Y(v), opacity=0.2)
    for v in (0, 5, 10, 15, 20):
        s.text(X0 - 4, Y(v) + 3.5, str(v), anchor="end", opacity=0.8)
    for i, (w, row) in enumerate(weekly.iterrows()):
        s.rect(cx(i) - 15, Y(row["control"]), 14, 184 - Y(row["control"]), GREEN)
        s.rect(cx(i) + 1, Y(row["variant"]), 14, 184 - Y(row["variant"]), PURPLE)
        s.text(cx(i), 198, str(w), anchor="middle", opacity=0.8)
    s.text(X1b, 216, "week of signup", anchor="end", opacity=0.8)
    out["ts-before"] = s.render()

    def lift_chart(sid, title_lines, desc, h, frame, grid, yaxis, labels, colors, top):
        s = Svg(sid, h, " ".join(title_lines), desc)
        for k, line in enumerate(title_lines):
            s.text(14, 14 + 14 * k, line, size=10.5, weight=600)
        bottom = top + 140
        Y = Axis(-3, 8, bottom, top)
        if frame:
            s.rect(X0, top, X1b - X0, 140, None, stroke="currentColor", sw=1)
        if grid:
            for v in (-2, 2, 4, 6, 8):
                s.line(X0, Y(v), X1b, Y(v), opacity=0.2)
        if yaxis:
            for v in (-2, 0, 2, 4, 6, 8):
                s.text(X0 - 4, Y(v) + 3.5, f"{v:d}", anchor="end", opacity=0.8)
        s.line(X0, Y(0), X1b, Y(0), opacity=0.5 if grid else 0.6)
        vals = weekly["gap"].tolist()
        for i, v in enumerate(vals):
            fill, op = colors[i]
            top_y, bot_y = (Y(v), Y(0)) if v >= 0 else (Y(0), Y(v))
            s.rect(cx(i) - 11, top_y, 22, bot_y - top_y, fill, opacity=op)
            if labels:
                s.text(cx(i), Y(v) - 4 if v >= 0 else Y(v) + 12, f"{v:+.1f}", anchor="middle")
        base = Y(min(vals)) + 30 if labels else bottom + 14
        for i in range(8):
            s.text(cx(i), base, f"wk {i + 1}" if not frame else str(i + 1), anchor="middle", opacity=0.8)
        return s, base

    blue_all, gray_all = [(BLUE, 0.95)] * 8, [("currentColor", 0.3)] * 8
    s, base = lift_chart("ts-gap-raw", ["Lift by week"], "A bar chart of the gap in conversion, variant minus control, for each of the eight weeks, in blue, between about minus 1.5 and 6.6 points. It has a frame, horizontal gridlines, a y axis in points and the plain title Lift by week.", 232, True, True, True, False, blue_all, 44)
    s.text(X1b, 216, "week of signup", anchor="end", opacity=0.8)
    out["ts-gap-raw"] = s.render()
    s, base = lift_chart("ts-gap-clean", ["Lift by week (points)"], "The same eight bars of the gap by week, now gray, with no frame, no gridlines and no y axis. Each bar carries its value, from plus 6.6 in week 1 to minus 1.5 in week 7, and a single baseline at zero remains. The title is still Lift by week.", 200, False, False, False, True, gray_all, 30)
    out["ts-gap-clean"] = s.render()
    colors = [("currentColor", 0.3)] + [(BLUE, 0.95)] * 7
    s, base = lift_chart("ts-final", [f"Week 1 looked higher, {g1:+.1f} points;", f"weeks 2 to 8 together suggest a steady lift near {g2:+.1f}"],
                         f"The eight bars of the gap by week, week 1 in gray and weeks 2 to 8 in blue. The title says: Week 1 looked higher, plus {g1:.1f} points; weeks 2 to 8 together suggest a steady lift near plus {g2:.1f}. A bracket under weeks 2 to 8 is labeled weeks 2 to 8 together, plus {g2:.1f}. A note says each week is about 650 people, so one week's gap is uncertain by about 5 points, and weeks 2 and 5 are nearly as high as week 1.",
                         278, False, False, False, True, colors, 52)
    by = base + 12
    s.line(cx(1) - 11, by, cx(7) + 11, by, opacity=0.7, w=1.5)
    s.line(cx(1) - 11, by - 4, cx(1) - 11, by, opacity=0.7, w=1.5)
    s.line(cx(7) + 11, by - 4, cx(7) + 11, by, opacity=0.7, w=1.5)
    s.text((cx(1) + cx(7)) / 2, by + 13, f"weeks 2 to 8 together: {g2:+.1f}", weight=600, anchor="middle")
    s.text(14, by + 30, "About 650 people a week, so one week is uncertain", size=9, opacity=0.85)
    s.text(14, by + 42, "by about 5 points; weeks 2 and 5 are nearly as high as week 1.", size=9, opacity=0.85)
    out["ts-final"] = s.render()
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
