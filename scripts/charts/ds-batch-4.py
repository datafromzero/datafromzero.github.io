"""Draws the static charts of Data Scientist lessons DS15 and DS16 (take-home-with-written-defense, decision-product-case-study) from the app-events data.

    python3 scripts/charts/ds-batch-4.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/ds-batch-4.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/ds-batch-4.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Same pipeline as ds-batch-1.py to ds-batch-3.py (it imports the Svg class, the axis and the figure colors through ds-batch-1.py): plain SVG with currentColor text,
blue, green, purple, ochre in that fixed order, a title and a desc, each tag on its own line, every drawing centered in its viewBox. Ochre is below 3:1 on the light
surface, so every ochre mark carries a visible label. Like ds-batch-2.py, this script runs the lesson's own notebook (every code cell, top to bottom, with the network
off so that the local copy of the data is read) and draws from the variables the reference cells leave, then asserts the numbers the lessons print. It takes about a
minute. Rerun --paste when a number changes.
"""
import contextlib
import importlib.util
import io
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


b1 = load("ds_batch_1", HERE / "ds-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, OCHRE = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE
title_line, square = b1.title_line, b1.square
DOCS, NOTEBOOKS = b1.DOCS, b1.NOTEBOOKS
LESSONS = {"ds15": DOCS / "take-home-with-written-defense.mdx", "ds16": DOCS / "decision-product-case-study.mdx"}
NOTEBOOK_FILES = {"ds15": NOTEBOOKS / "data-scientist-take-home-with-written-defense.ipynb", "ds16": NOTEBOOKS / "data-scientist-decision-product-case-study.ipynb"}


def run_notebook(path):
    """Run every code cell of a notebook in one namespace, with the download switched off (the cells then read the repository's own files); return the namespace."""
    cells = json.loads(path.read_text(encoding="utf-8"))["cells"]

    def offline(*args, **kwargs):
        raise OSError("offline")

    saved_urlretrieve, saved_cwd = urllib.request.urlretrieve, os.getcwd()
    urllib.request.urlretrieve = offline
    os.chdir(path.parent)
    ns = {"__name__": "__main__"}
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            for cell in cells:
                if cell["cell_type"] == "code":
                    exec(compile("".join(cell["source"]), path.name, "exec"), ns)
    finally:
        urllib.request.urlretrieve = saved_urlretrieve
        os.chdir(saved_cwd)
    return ns


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DS15
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def ds15(out):
    # ---- the 90 minutes, as a plan ----
    steps = [("Scope note", 0, 5, BLUE), ("Frame and column check", 5, 15, GREEN), ("Baselines and model", 20, 25, GREEN),
             ("Held-out score and limits", 45, 10, GREEN), ("Write the defense", 55, 30, BLUE), ("Score yourself", 85, 5, OCHRE)]
    assert sum(d for _, _, d, _ in steps) == 90 and all(steps[i][1] + steps[i][2] == steps[i + 1][1] for i in range(5))
    s = Svg("ds15-plan", "The 90 minutes of the simulation, step by step",
            "A horizontal timeline from 0 to 90 minutes with six bars, one after another. Scope note, minutes 0 to 5, in blue. Three steps of work in green: frame and column check, minutes 5 to 20; "
            "baselines and model, 20 to 45; held-out score and limits, 45 to 55. Write the defense, minutes 55 to 85, in blue. Then score yourself, minutes 85 to 90, in ochre.")
    X = Axis(0, 90, 160, 306)
    s.text(8, 10, "Your 90 minutes", size=10.5, weight=600)
    for t in (0, 30, 60, 90):
        s.line(X(t), 22, X(t), 22 + 6 * 24 + 4, opacity=0.14)
        s.text(X(t), 22 + 6 * 24 + 18, str(t), anchor="middle", size=9, opacity=0.8)
    s.text(8, 22 + 6 * 24 + 18, "minutes from the start", size=9, opacity=0.8)
    y = 28
    for label, start, dur, col in steps:
        s.text(8, y + 12, label, size=9.5)
        s.rect(X(start), y, max(X(start + dur) - X(start), 3), 16, col, rx=2.5)
        txt = f"{dur} min"
        if start + dur >= 55:
            s.text(X(start) - 6, y + 12, txt, anchor="end", size=9.5, weight=600)
        else:
            s.text(X(start + dur) + 6, y + 12, txt, size=9.5, weight=600)
        y += 24
    out["ds15-plan"] = s.render()

    # ---- the score of each column alone, split by when the column is known ----
    ns = run_notebook(NOTEBOOK_FILES["ds15"])
    th = ns["take_home"]
    scores = {col: ns["alone"](col) for col in ns["CHECKED"]}
    assert [round(scores[c], 3) for c in ("has_reason", "plus_uses", "active_events", "plus_uses_14d", "annual_now", "days_to_buy")] == [0.892, 0.856, 0.594, 0.579, 0.52, 0.511]
    assert ns["held_out_auc"](ns["HONEST"]) == 0.618 and len(th) == 1792
    known = set(ns["HONEST"])                       # the columns known by day 14
    rows = sorted(scores.items(), key=lambda kv: -kv[1])
    assert len(rows) == 9 and sum(c in known for c, _ in rows) == 5
    desc = ("A bar chart of nine columns of the take-home file. Each bar is the ROC AUC that the column reaches alone as a score, in either direction, on all 1,792 people, from 0.5, which knows nothing, to 1.0. "
            + "; ".join(f"{c} {v:.3f}" for c, v in rows)
            + ". Five columns, drawn in blue, are known by day 14: days_to_buy, activity_before, visits_14d, expenses_14d and plus_uses_14d. Four columns, drawn in purple, are known only after day 14: "
            "has_reason, plus_uses, active_events and annual_now. The two highest bars are purple; active_events, at 0.594, sits just above the highest blue bar, 0.579, and annual_now, at 0.520, is close to the lowest.")
    s = Svg("ds15-columns", "Score of each column alone: known by day 14, or known only after it", desc)
    X0, X1 = 124, 322
    A = Axis(0.5, 1.0, X0, X1)
    title_line(s, "ROC AUC of each column alone (all 1,792 people)", 8, 10)
    square(s, 124, 22, BLUE)
    s.text(136, 29.5, "known by day 14", size=9.5)
    square(s, 226, 22, PURPLE)
    s.text(238, 29.5, "known only after", size=9.5)
    top = 48
    for i, (col, v) in enumerate(rows):
        yy = top + i * 18
        s.text(8, yy + 3.5, col, size=9.5)
        s.rect(X0, yy - 5, A(v) - X0, 10, BLUE if col in known else PURPLE, rx=1.5)
        s.text(A(v) + 4, yy + 3.5, f"{v:.3f}", size=9, weight=600)
    base = top + len(rows) * 18 - 6
    s.line(X0, top - 10, X0, base, opacity=0.5)
    s.line(X0, base, X1, base)
    for v in (0.5, 0.6, 0.7, 0.8, 0.9, 1.0):
        s.line(A(v), base, A(v), base + 4)
        s.text(A(v), base + 15, f"{v:.1f}", anchor="middle", opacity=0.8)
    s.text(X1, base + 29, "0.5: the column alone knows nothing", anchor="end", opacity=0.8)
    out["ds15-columns"] = s.render()


# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DS16
# ---------------------------------------------------------------------------------------------------------------------------------------------------
def money(v):
    return ("-" if v < 0 else "") + "$" + f"{abs(v):,.0f}"


def ds16(out):
    ns = run_notebook(NOTEBOOK_FILES["ds16"])
    yt, model_rule, paid_social = ns["yt"], ns["model_rule"], ns["paid_social"]
    everybody = ns["np"].ones(len(yt), dtype=bool)
    rows = []
    for name, rule in [("Model rule", model_rule), ("Paid-social rule", paid_social), ("Offer everybody", everybody)]:
        point, low, high = ns["value_gain"](rule, None, yt)
        rows.append((name, point, low, high))
    assert [round(r[1]) for r in rows] == [81, 81, -367] and (rows[0][2], rows[0][3]) == (62.2, 99.2) and (rows[1][2], rows[1][3]) == (63.5, 99.2)
    desc = ("A dot chart with intervals of what an offer rule earns, in dollars for every 1,000 of the 4,454 held-out people, against sending nobody, from minus 400 to plus 100, under the assumptions "
            "of lesson DS4: a $2 offer, a return rate of 0.25, a return worth $12. "
            + "; ".join(f"{n}: {money(p)}, 95 percent interval {money(lo)} to {money(hi)}" for n, p, lo, hi in rows)
            + ". The model rule and the paid-social rule are level, with intervals that overlap almost completely; offering everybody loses money, far below zero.")
    s = Svg("ds16-rules", "What each offer rule earns for every 1,000 people, against sending nobody", desc)
    X = Axis(-400, 100, 128, 318)
    title_line(s, "Earned for every 1,000 people, 95% intervals", 8, 10)
    for i, (name, p, lo, hi) in enumerate(rows):
        yy = 44 + i * 36
        col = [BLUE, GREEN, PURPLE][i]
        s.text(8, yy + 3.5, name, size=9.5, weight=600 if i < 2 else None)
        s.line(X(lo), yy, X(hi), yy, color=col, w=2.5, opacity=1)
        s.circle(X(p), yy, 5, col)
        s.text(X(p), yy - 11, money(p), anchor="middle", weight=600, size=9.5)
    base = 44 + 3 * 36 - 10
    s.line(X(-400), base, X(100), base)
    for v in (-400, -300, -200, -100, 0, 100):
        s.line(X(v), base, X(v), base + 4)
        s.text(X(v), base + 16, str(v), anchor="middle", opacity=0.8)
    s.line(X(0), 30, X(0), base, opacity=0.35, dash="3 3")
    s.text(X(0) - 4, 32, "sending nobody", anchor="end", size=9, opacity=0.8)
    s.text(X(100), base + 30, "dollars for every 1,000 people", anchor="end", opacity=0.8)
    out["ds16-rules"] = s.render()

    # ---- the weekly back-test: the mean chance and the share who really churned ----
    weekly = ns["weekly"]
    assert len(weekly) == 13 and round(float(weekly["gap"].abs().max()), 3) == 0.037 and int(ns["fires"].sum()) == 0
    weeks = list(weekly.index)
    chance, churned = weekly["mean chance"].tolist(), weekly["churned"].tolist()
    campaign = weeks.index("2026-04-13")
    desc = ("A line chart for the 13 full weeks of signups from March 2 to May 25, 2026, from 0.40 to 0.70, with two lines. The mean chance of churning that a model fitted on the signups before March 2 gives each week, "
            "and the share of people who really churned. Weekly values, mean chance then churned: "
            + "; ".join(f"{w[5:]}: {c:.3f}, {a:.3f}" for w, c, a in zip(weeks, chance, churned))
            + f". The two lines stay within {float(weekly['gap'].abs().max()):.3f} of each other in every week, although both rise after the paid-social campaign starts in the week of April 13.")
    s = Svg("ds16-weekly", "Mean chance and share who really churned, by week of signup", desc)
    X0, X1 = 44, 336
    Y = Axis(0.40, 0.70, 140, 40)
    title_line(s, "Churn by week of signup: model chance and what happened", 8, 10)
    for v in (0.4, 0.5, 0.6, 0.7):
        s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == 0.4 else 0.13)
        s.text(X0 - 6, Y(v) + 3.5, f"{v:.1f}", anchor="end", opacity=0.8)
    step = (X1 - X0) / (len(weeks) - 1)
    xs = [X0 + step * i for i in range(len(weeks))]
    s.poly([(x, Y(v)) for x, v in zip(xs, churned)], GREEN, w=2.2)
    s.poly([(x, Y(v)) for x, v in zip(xs, chance)], BLUE, w=2.2)
    s.line(xs[campaign], Y(0.70), xs[campaign], Y(0.40), opacity=0.35, dash="3 3")
    s.text(xs[campaign] - 4, Y(0.70) + 4, "campaign starts", anchor="end", size=9, opacity=0.8)
    s.text(X0, Y(0.40) + 15, "Mar 2", size=9, opacity=0.8)
    s.text(xs[campaign], Y(0.40) + 15, "Apr 13", anchor="middle", size=9, opacity=0.8)
    s.text(X1, Y(0.40) + 15, "May 25", anchor="end", size=9, opacity=0.8)
    square(s, 130, Y(0.40) + 24, GREEN)
    s.text(142, Y(0.40) + 31.5, "really churned", size=9.5)
    square(s, 226, Y(0.40) + 24, BLUE)
    s.text(238, Y(0.40) + 31.5, "mean chance", size=9.5)
    out["ds16-weekly"] = s.render()


# ---------------------------------------------------------------------------------------------------------------------------------------------------
def charts():
    out = {}
    ds15(out)
    ds16(out)
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
