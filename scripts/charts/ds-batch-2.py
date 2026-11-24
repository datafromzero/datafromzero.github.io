"""Draws the static charts of Data Scientist lessons DS6 to DS10 (regularization, decision-trees-and-forests, gradient-boosting, feature-engineering,
clustering-and-segmentation) from the app-events data.

    python3 scripts/charts/ds-batch-2.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/ds-batch-2.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/ds-batch-2.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Needs duckdb (2.0.0), pandas, NumPy and scikit-learn (the versions of the Data Scientist track are in .claude/agents/LESSON-STANDARD.md, "Data Scientist track
(D55)"). Same pipeline as ds-batch-1.py (it imports the Svg class, the text widths and the figure colors of da-batch-1.py): plain SVG with currentColor text, the
figure color roles of the site (blue, green, purple, ochre, in that fixed order), a title and a desc, each tag on its own line, every drawing centered in its
viewBox. Ochre is below 3:1 on the light surface, so every ochre mark carries a visible label.
Every number comes from the notebook of the lesson: this script runs the notebook's own code cells (setup, data, split and units, up to "Finish it") in
notebooks/data-scientist/ and draws from the variables they leave behind, then asserts the numbers the lessons print. A chart that needs a number the notebook does
not keep (the paired gain of the ordinal codes) repeats one line of the notebook's own function. It takes about ten minutes. Rerun --paste when a number changes.
"""
import contextlib
import io
import json
import os
import re
import sys
import importlib.util
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


b1 = load("da_batch_1", HERE / "da-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, OCHRE, ROOT = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE, b1.ROOT
DOCS = ROOT / "src" / "content" / "docs" / "data-scientist"
NOTEBOOKS = ROOT / "notebooks" / "data-scientist"
LESSONS = {"ds6": DOCS / "regularization.mdx", "ds7": DOCS / "decision-trees-and-forests.mdx", "ds8": DOCS / "gradient-boosting.mdx",
           "ds9": DOCS / "feature-engineering.mdx", "ds10": DOCS / "clustering-and-segmentation.mdx"}
NOTEBOOK_OF = {"ds6": "data-scientist-regularization", "ds7": "data-scientist-decision-trees-and-forests", "ds8": "data-scientist-gradient-boosting",
               "ds9": "data-scientist-feature-engineering", "ds10": "data-scientist-clustering-and-segmentation"}


def run_notebook(key):
    """Run the code cells of a lesson's notebook up to its exercises, in one namespace, and return the namespace."""
    nb = json.loads((NOTEBOOKS / (NOTEBOOK_OF[key] + ".ipynb")).read_text(encoding="utf-8"))
    ns = {"__name__": "__main__"}
    cwd = os.getcwd()
    os.chdir(NOTEBOOKS)               # the notebooks fall back to ../../datasets/ when the network is off
    try:
        for cell in nb["cells"]:
            src = "".join(cell["source"])
            if cell["cell_type"] == "markdown" and src.startswith("## Finish it"):
                break
            if cell["cell_type"] == "code":
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(src, f"<{key}>", "exec"), ns)
    finally:
        os.chdir(cwd)
    return ns


def square(s, x, y, color, size=8):
    s.rect(x, y, size, size, color, rx=2)


def axis_ticks_y(s, X0, X1, Y, ticks, fmt, left=6):
    for v in ticks:
        s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == ticks[0] else 0.13)
        s.text(X0 - left, Y(v) + 3.5, fmt(v), anchor="end", opacity=0.8)


def charts(only=None):
    out = {}

    def want(key):
        return only is None or key in only

    # ---- ds6: the mean AUC of ridge and lasso over C, on the five folds ----
    if want("ds6"):
        ns = run_notebook("ds6")
        tc = ns["table_cv"]
        Cs, ridge, lasso = list(tc["C"]), list(tc["ridge"]), list(tc["lasso"])
        assert (ridge[0], lasso[0], max(ridge), max(lasso)) == (0.6833, 0.6465, 0.6918, 0.692), (ridge[0], lasso[0], max(ridge), max(lasso))
        s = Svg("ds6-cv", "Mean ROC AUC of ridge and lasso on the five folds, by C",
                f"A line chart of the mean ROC AUC on the five folds of the training part, from 0.64 to 0.70, for ten values of C from 0.001 to 100 on a log scale. "
                f"The ridge rises from {ridge[0]:.3f} at C = 0.001 to {max(ridge):.4f} at C = 0.03 and stays within 0.0003 of that from there to C = 100. "
                f"The lasso rises from {lasso[0]:.3f} at C = 0.001, more steeply, to {max(lasso):.4f} at C = 0.03 and then lies on the ridge's line. "
                "Above C = 0.03 the penalty makes no difference to the score; only a strong penalty, a small C, hurts.")
        X, Y = Axis(np.log10(0.001), np.log10(100), 48, 300), Axis(0.64, 0.70, 160, 40)
        s.text(8, 10, "Mean ROC AUC on the five folds, by C", size=10.5, weight=600)
        square(s, 100, 22, BLUE)
        s.text(112, 29.5, "ridge", size=9.5)
        square(s, 160, 22, GREEN)
        s.text(172, 29.5, "lasso", size=9.5)
        axis_ticks_y(s, X(np.log10(0.001)), X(np.log10(100)), Y, [0.64, 0.66, 0.68, 0.70], lambda v: f"{v:.2f}")
        s.poly([(X(np.log10(c)), Y(v)) for c, v in zip(Cs, lasso)], GREEN, w=2)
        s.poly([(X(np.log10(c)), Y(v)) for c, v in zip(Cs, ridge)], BLUE, w=2)
        for c, a, b in zip(Cs, ridge, lasso):
            s.circle(X(np.log10(c)), Y(a), 3, BLUE)
            s.circle(X(np.log10(c)), Y(b), 3, GREEN, opacity=1)
        i = int(np.argmax(ridge))
        s.text(X(np.log10(Cs[i])) + 6, Y(max(ridge)) - 8, f"best C = {Cs[i]:g}: {max(ridge):.4f}", size=9.5, weight=600)
        for c in (0.001, 0.01, 0.1, 1, 10, 100):
            s.line(X(np.log10(c)), Y(0.64), X(np.log10(c)), Y(0.64) + 4)
            s.text(X(np.log10(c)), Y(0.64) + 16, f"{c:g}", anchor="middle", opacity=0.8, size=9.5)
        s.text(X(np.log10(100)), Y(0.64) + 30, "C (log scale; smaller is a stronger penalty)", anchor="end", opacity=0.8)
        out["ds6-cv"] = s.render()

    # ---- ds7: depth against leaf size, and two kinds of importance ----
    if want("ds7"):
        ns = run_notebook("ds7")
        cv = ns["cv_table"]
        depths = list(cv.index)
        leaves = [(1, BLUE, "min leaf 1"), (50, GREEN, "min leaf 50"), (400, PURPLE, "min leaf 400")]
        assert (round(cv.loc[10, 1], 3), round(cv.loc[10, 400], 3), round(cv.loc[6, 400], 3)) == (0.645, 0.688, 0.688), (cv.loc[10, 1], cv.loc[10, 400])
        s = Svg("ds7-leaf", "Mean ROC AUC of a decision tree on the five folds, by depth, for three leaf sizes",
                "A line chart of the mean ROC AUC on the five folds, from 0.64 to 0.70, for trees of depth " + ", ".join(str(d) for d in depths)
                + ". With leaves of one person the AUC rises to " + f"{cv.loc[4, 1]:.3f} at depth 4 and falls to {cv.loc[10, 1]:.3f} at depth 10. "
                + f"With at least 50 people in each leaf it peaks near {cv[50].max():.3f} and ends at {cv.loc[10, 50]:.3f}. "
                + f"With at least 400 people in each leaf it rises to {cv.loc[6, 400]:.3f} at depth 6 and stays there to depth 10, {cv.loc[10, 400]:.3f}.")
        X, Y = Axis(0, len(depths) - 1, 46, 186), Axis(0.64, 0.70, 160, 40)
        s.text(8, 10, "Mean ROC AUC on the five folds, by depth", size=10.5, weight=600)
        axis_ticks_y(s, X(0), X(len(depths) - 1), Y, [0.64, 0.66, 0.68, 0.70], lambda v: f"{v:.2f}")
        for leaf, col, lab in leaves:
            vals = [float(cv.loc[d, leaf]) for d in depths]
            s.poly([(X(i), Y(v)) for i, v in enumerate(vals)], col, w=2)
            for i, v in enumerate(vals):
                s.circle(X(i), Y(v), 3, col)
            s.text(X(len(depths) - 1) + 8, Y(vals[-1]) + 3.5, f"{lab} {vals[-1]:.3f}", size=9.5, weight=600)
        for i, d in enumerate(depths):
            s.text(X(i), Y(0.64) + 14, str(d), anchor="middle", opacity=0.8, size=9.5)
        s.text(X(len(depths) - 1) + 40, Y(0.64) + 28, "max depth of the tree", anchor="end", opacity=0.8)
        out["ds7-leaf"] = s.render()

        built_in, perm = ns["built_in_by"][1], ns["perm"]
        top_a = built_in.head(6)
        assert top_a.index[0] == "noise" and round(float(top_a.iloc[0]), 3) == 0.487, (top_a.index[0], top_a.iloc[0])
        keep = list(perm.index[:5]) + ["noise"]
        perm_rows = [(c, float(perm[c])) for c in keep]
        assert round(float(perm["noise"]), 4) == -0.0003 and perm.index[0] == "channel", (perm["noise"], perm.index[0])
        nice = {"noise": "random numbers", "channel_paid_social": "paid social", "channel": "channel"}
        nm = lambda c: nice.get(c, c)
        s = Svg("ds7-importance", "Two importances of a random forest with a column of random numbers added",
                "Two bar charts. First, the importance that comes with a forest whose leaves hold one person: " + ", ".join(f"{nm(c)} {float(v):.3f}" for c, v in top_a.items())
                + ". The column of random numbers is first, with nearly half of all the importance. Second, the drop in ROC AUC on the validation people when one column is shuffled, "
                + "for a forest whose leaves hold at least 100 people: " + ", ".join(f"{nm(c)} {v:.4f}" for c, v in perm_rows) + ". Shuffling the random numbers changes nothing.")
        X0 = 108
        s.text(8, 10, "Built-in importance, leaves of 1 person (share of all)", size=10, weight=600)
        XA = Axis(0, 0.5, X0, 292)
        for k, (c, v) in enumerate(top_a.items()):
            yy = 26 + k * 17
            col = OCHRE if c == "noise" else BLUE
            s.text(X0 - 6, yy + 8, nm(c), anchor="end", size=9.5, weight=600 if c == "noise" else None)
            s.rect(X0, yy, XA(float(v)) - X0, 12, col, rx=2)
            s.text(XA(float(v)) + 5, yy + 9.5, f"{float(v):.3f}", size=9.5, weight=600)
        yb = 26 + len(top_a) * 17 + 14
        s.line(X0, 24, X0, yb - 8, opacity=0.5)
        s.text(8, yb + 12, "Shuffle one column of held-out people: drop in AUC", size=10, weight=600)
        XB = Axis(0, 0.08, X0, 292)
        for k, (c, v) in enumerate(perm_rows):
            yy = yb + 28 + k * 17
            col = OCHRE if c == "noise" else BLUE
            s.text(X0 - 6, yy + 8, nm(c), anchor="end", size=9.5, weight=600 if c == "noise" else None)
            s.rect(X0, yy, max(XB(max(v, 0)) - X0, 1.5), 12, col, rx=1.5)
            s.text(max(XB(max(v, 0)), X0 + 1.5) + 5, yy + 9.5, f"{v:.4f}", size=9.5, weight=600)
        s.line(X0, yb + 24, X0, yb + 28 + len(perm_rows) * 17 - 4, opacity=0.5)
        out["ds7-importance"] = s.render()

    # ---- ds8: validation AUC after each tree ----
    if want("ds8"):
        ns = run_notebook("ds8")
        st = ns["stages"]
        dv, sv = st["defaults"][1], st["small trees"][1]
        bd, bs = int(np.argmax(dv)) + 1, int(np.argmax(sv)) + 1
        assert (bd, round(max(dv), 3), bs, round(max(sv), 3), round(dv[-1], 3), round(sv[-1], 3)) == (6, 0.69, 77, 0.7, 0.671, 0.699), (bd, max(dv), bs, max(sv), dv[-1], sv[-1])
        s = Svg("ds8-stages", "Validation ROC AUC after each of 300 trees, for the default settings and for small trees",
                f"A line chart of the ROC AUC on the validation people, from 0.66 to 0.71, after 1 to 300 trees. The model with the default settings peaks at {max(dv):.3f} with {bd} trees "
                f"and falls to {dv[-1]:.3f} with 300. The model of small trees (at most 4 leaves, a rate of 0.05, at least 100 people in a leaf) rises more slowly to {max(sv):.3f} with {bs} trees "
                f"and holds at {sv[-1]:.3f} with 300.")
        X, Y = Axis(1, 300, 48, 250), Axis(0.66, 0.71, 150, 40)
        s.text(8, 10, "Validation ROC AUC after each tree", size=10.5, weight=600)
        axis_ticks_y(s, X(1), X(300), Y, [0.66, 0.67, 0.68, 0.69, 0.70, 0.71], lambda v: f"{v:.2f}")
        s.poly([(X(i + 1), Y(v)) for i, v in enumerate(dv)], BLUE, w=2)
        s.poly([(X(i + 1), Y(v)) for i, v in enumerate(sv)], GREEN, w=2)
        s.circle(X(bd), Y(max(dv)), 4, BLUE)
        s.text(X(bd) + 10, Y(0.678), f"best: {bd} trees", size=9.5, weight=600)
        s.circle(X(bs), Y(max(sv)), 4, GREEN)
        s.text(X(bs), Y(max(sv)) - 9, f"best: {bs} trees", anchor="middle", size=9.5, weight=600)
        s.text(X(300) + 8, Y(dv[-1]) + 3.5, f"defaults {dv[-1]:.3f}", size=9.5, weight=600)
        s.text(X(300) + 8, Y(sv[-1]) + 3.5, f"small trees {sv[-1]:.3f}", size=9.5, weight=600)
        for v in (1, 100, 200, 300):
            s.text(X(v), Y(0.66) + 14, str(v), anchor="middle", opacity=0.8, size=9.5)
        s.text(X(300) + 40, Y(0.66) + 28, "number of trees", anchor="end", opacity=0.8)
        out["ds8-stages"] = s.render()

    # ---- ds9: paired gains over the day-7 model, on the same five folds ----
    if want("ds9"):
        ns = run_notebook("ds9")
        gain, recipe, folds_auc, base = ns["gain"], ns["recipe"], ns["folds_auc"], ns["base_scores"]
        ratio = gain(folds_auc(recipe(num=ns["WEEK1"] + ["expenses_per_day"], fill=True, flag=True), ns["COLS_R"]), base)
        ordinal = gain(folds_auc(recipe(ordinal=True), ns["BASE_COLS"]), base)
        leaky_g, honest_g = gain(ns["leaky"], base), gain(ns["honest"], base)
        mg = ns["menu_gains"]
        assert round(float(ns["leaky"].mean()), 3) == 0.726 and round(float(ns["honest"].mean()), 3) == 0.647 and round(float(folds_auc(recipe(ordinal=True), ns["BASE_COLS"]).mean()), 3) == 0.662
        groups = [("Changes judged on the same folds", BLUE, [("counts on a log scale", mg["counts on a log scale"]), ("weekday of signup", mg["weekday of signup, one-hot"]),
                                                         ("days since January 1", mg["days since January 1"]), ("flag: no active day", mg["flag: no active day"]), ("ratio, median fill, flag", ratio)]),
                  ("Encoding of the text columns", GREEN, [("ordinal codes, not one-hot", ordinal)]),
                  ("Cohort share (755 groups)", PURPLE, [("computed before the folds", leaky_g), ("learned inside the folds", honest_g)])]
        desc_rows = "; ".join(f"{lab} {g[0]:+.4f} (folds {g[1]:+.4f} to {g[2]:+.4f})" for _, _, items in groups for lab, g in items)
        s = Svg("ds9-gains", "Paired gain in ROC AUC over the day-7 model, by change, on the same five folds",
                "A dot chart on a scale from -0.05 to +0.04 of the mean of the five fold-by-fold differences in ROC AUC from the day-7 model, with a line from the lowest to the highest difference. "
                + desc_rows + ". The five simple changes sit at zero with ranges that cross it; the ordinal codes fall by about 0.03; the cohort share looks like a gain of 0.03 when it is computed before the folds "
                "and is a loss of 0.04 when it is learned inside them.")
        X = Axis(-0.05, 0.04, 176, 292)
        s.text(8, 10, "Gain in ROC AUC over the day-7 model, on five folds", size=9.5, weight=600)
        yy = 28
        for gname, col, items in groups:
            s.text(8, yy + 9, gname, size=9.5, weight=600)
            yy += 19
            for lab, g in items:
                s.text(14, yy + 3.5, lab, size=9)
                s.line(X(g[1]), yy, X(g[2]), yy, color=col, w=2.5, opacity=1)
                s.circle(X(g[0]), yy, 3.5, col)
                s.text(332, yy + 3.5, f"{g[0]:+.4f}", anchor="end", size=9, weight=600)
                yy += 14
            yy += 3
        s.line(X(0), 40, X(0), yy - 3, w=1, opacity=0.5, dash="3 3")
        s.line(X(-0.05), yy, X(0.04), yy)
        for v in (-0.04, 0, 0.04):
            s.line(X(v), yy, X(v), yy + 4)
            s.text(X(v), yy + 16, f"{v:+.2f}" if v else "0", anchor="middle", opacity=0.8)
        out["ds9-gains"] = s.render()

    # ---- ds10: the silhouette of the people and of made-up data with three real groups ----
    if want("ds10"):
        ns = run_notebook("ds10")
        rr = ns["ruler_rows"]
        ks = [r[0] for r in rr]
        people, made = [r[2] for r in rr], [r[4] for r in rr]
        assert (people[1], made[1], made[4]) == (0.448, 0.797, 0.163), (people, made)
        s = Svg("ds10-silhouette", "Silhouette by number of groups, for the people and for made-up data with three real groups",
                "A line chart of the silhouette from 0 to 0.9 for k from 2 to 6 groups. For the made-up data with three real groups it is " + ", ".join(f"{v:.3f}" for v in made)
                + ", a sharp peak at k = 3 and a fall after it. For the people it is " + ", ".join(f"{v:.3f}" for v in people)
                + ", a narrow band between 0.448 and 0.522 with no peak: the data do not choose k.")
        X, Y = Axis(2, 6, 48, 220), Axis(0, 0.9, 150, 40)
        s.text(8, 10, "Silhouette by number of groups (k-means)", size=10.5, weight=600)
        axis_ticks_y(s, X(2), X(6), Y, [0, 0.3, 0.6, 0.9], lambda v: f"{v:.1f}")
        s.poly([(X(k), Y(v)) for k, v in zip(ks, made)], GREEN, w=2)
        s.poly([(X(k), Y(v)) for k, v in zip(ks, people)], BLUE, w=2)
        for k, a, b in zip(ks, people, made):
            s.circle(X(k), Y(a), 3.5, BLUE)
            s.circle(X(k), Y(b), 3.5, GREEN)
        s.text(X(3), Y(made[1]) - 9, f"{made[1]:.3f}", anchor="middle", size=9.5, weight=600)
        s.text(X(6) + 8, Y(made[4]) + 3.5, f"made-up {made[4]:.3f}", size=9.5, weight=600)
        s.text(X(6) + 8, Y(people[4]) + 3.5, f"people {people[4]:.3f}", size=9.5, weight=600)
        for k in ks:
            s.text(X(k), Y(0) + 14, str(k), anchor="middle", opacity=0.8, size=9.5)
        s.text(X(6) + 40, Y(0) + 28, "k, the number of groups", anchor="end", opacity=0.8)
        out["ds10-silhouette"] = s.render()
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
    only = [a for a in sys.argv[1:] if a.startswith('ds')] or None
    result = charts(only)
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
