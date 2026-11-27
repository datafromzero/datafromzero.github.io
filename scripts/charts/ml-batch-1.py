"""Draws the static figures of the first five ML Engineer lessons (sklearn-pipelines-and-column-transformers, validating-model-data,
experiment-tracking-and-reproducibility, tuning-and-class-imbalance, neural-networks-and-training-loop).

    python3 scripts/charts/ml-batch-1.py --out DIR     write every figure as DIR/<name>.svg
    python3 scripts/charts/ml-batch-1.py --paste       put every figure into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/ml-batch-1.py --check       exit 1 unless every figure appears, byte for byte, in its lesson, and every number it draws
                                                       appears in the lesson's text
    add --no-torch to leave out the two curve charts of MLE5 (they need PyTorch 2.15.0, CPU build, see below)

Uses the Svg class, the text widths and the figure colors of da-batch-1.py (which imports duckdb), as de-deep-dive-2.py does. Colors follow the
meaning, never the rank: blue is data going in, green is what is kept, learned or good, purple is a refusal or a step that decides, ochre is a
warning and always carries a visible label (it is below 3:1 on the light surface).

Where the numbers come from. Every value typed below is copied from a console block or a reveal of the lesson it is drawn in (the source is named
above each block), and `--check` fails when a value stands in no sentence of its lesson. The two curve charts of MLE5 are drawn from the lesson's own
notebook: this script runs its code cells (setup, data, split and units, up to "Finish it") and draws from `curves` (the 300 epochs of unit 4) and from
`fit_network` (the 20 epochs of each learning rate of unit 3), then asserts the numbers the lesson prints. PyTorch is not in the repository's
requirements; run the script with a Python that has torch 2.15.0 (`uv pip install torch==2.15.0 --index-url https://download.pytorch.org/whl/cpu`).
Rerun --paste when a number changes.
"""
import contextlib
import importlib.util
import io
import json
import math
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


b1 = load("da_batch_1", HERE / "da-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, OCHRE, ROOT = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE, b1.ROOT
DOCS = ROOT / "src" / "content" / "docs" / "ml-engineer"
NOTEBOOKS = ROOT / "notebooks" / "ml-engineer"
LESSONS = {
    "mle1": DOCS / "sklearn-pipelines-and-column-transformers.mdx",
    "mle2": DOCS / "validating-model-data.mdx",
    "mle3": DOCS / "experiment-tracking-and-reproducibility.mdx",
    "mle4": DOCS / "tuning-and-class-imbalance.mdx",
    "mle5": DOCS / "neural-networks-and-training-loop.mdx",
}
WHITE = "#ffffff"

# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DATA, copied from the lessons (the block that holds each value is named)
# mle1, unit 1 (reveal "19 12" and the Why): 10 columns of the table, 3 of them text with 5, 3 and 4 values, 7 numbers; 19 columns reach the model.
M1_TEXT, M1_NUMBERS, M1_ONE_HOT, M1_MODEL_COLUMNS = 3, 7, (5, 3, 4), 19
# mle1, unit 2 (reveal): the largest change of the chances against the base chances, for three changed requests.
M1_REQUESTS = [("columns backwards", "scored", "biggest change 0.000", "ok"),
               ("a region never seen", "scored, no warning", "biggest change 0.014", "quiet"),
               ("a missing number", "ValueError", "Input X contains NaN", "refused")]
# mle1, unit 3 (reveal): cross-validated AUC and the largest difference of 5 chances scored together or one at a time.
M1_LEARNED = [("learned in fit", "StandardScaler(with_std=False)", 0.692, 0.0), ("recomputed from the rows given", "FunctionTransformer(center_batch)", 0.692, 0.251)]
# mle2, unit 1 (the report): failed checks by column, with the number of failure cases of each.
M2_CHECKS = [("channel", "isin", 45), ("sessions_7d", "greater_than_or_equal_to", 40), ("platform", "not_nullable", 30), ("user_id", "field_uniqueness", 24),
             ("onboarded", "isin", 15)]
M2_CASES, M2_ROWS = 154, 144
# mle2, unit 2 (the four requests): what each of the four changed requests got.
M2_REQUESTS = [("sessions_7d as the text \"3\"", "accepted", "it became the number 3", "quiet"),
               ("a region never seen", "refused", "not one of the four regions", "refused"),
               ("sessions_7d as 2.7", "refused", "not a valid integer", "refused"),
               ("sessions_7d as -1", "refused", "not at least 0", "refused")]
# mle2, unit 3 (triage printed): rows of the file, kept, repaired by the rule, quarantined.
M2_FILE, M2_KEPT, M2_REPAIRED, M2_QUARANTINED = 17828, 17704, 20, 124
# mle3, units 1 to 3 (the run list and `runs show`): one run's id, name, and what its record holds.
M3_RUNS = [("C=0.1", 0.691687, "615bf25e"), ("C=10.0", 0.691592, "a8a3524a"), ("C=0.001", 0.683299, "2f4db16b")]
M3_FAILED = "C=-1.0"
M3_FOLDS = (0.683, 0.702)   # the spread of the five folds of one model, lesson DS5, quoted in the Why of unit 2
M3_RECORD = [("param", "C", "0.1", ""), ("param", "seed", "2026", ""), ("param", "data_sha256", "4342d7d93418", "the data file"),
             ("tag", "git_commit", "62e13d8", "the code"), ("tag", "git_uncommitted_changes", "False", "any edit since"),
             ("tag", "lock_sha256", "04f103b69439", "the libraries"), ("metric", "cv_auc_mean", "0.691687", ""),
             ("artifact", "pipeline", "the fitted pipeline", "")]
M3_SAME, M3_OTHER = "4342d7d93418", "de9b4f9f2adc"
# mle4, unit 1 to 4 (reveals): the grid, the scores and the routes.
M4_PEOPLE, M4_TRAIN, M4_TEST = 9044, 6783, 2261
M4_GRID = [("logistic, C 0.01, no weights", "LR"), ("logistic, C 0.01, balanced", "LR"), ("logistic, C 1.0, no weights", "LR"), ("logistic, C 1.0, balanced", "LR"),
           ("boosted, rate 0.05, depth 2", "HGB"), ("boosted, rate 0.05, depth 4", "HGB"), ("boosted, rate 0.2, depth 2", "HGB"), ("boosted, rate 0.2, depth 4", "HGB")]
M4_BEST, M4_PLAIN, M4_SPREAD = 0.219, 0.216, 0.046
M4_FLAT, M4_TUNED = 0.102, 0.214
M4_ROUTES = [("plain, cut 0.5", 0.0, 0.0), ("balanced, cut 0.5", 0.566, 0.16), ("plain, cut 0.104", 0.566, 0.167)]
M4_COPIES = 5
M4_BEFORE, M4_INSIDE = 0.56, 0.218
# mle5 (units 1 and 4): the numbers of the small network, and the best epoch of the 500-person pilot.
M5_INPUTS, M5_HIDDEN = 19, 8
M5_NEURON, M5_SMALL = 20, 169
M5_BEST_EPOCH, M5_BEST_LOSS, M5_END = 28, 0.638, (0.330, 0.874)
M5_FLAT_SHARE = 0.689
M5_LR_ENDS = {0.01: 0.672, 0.1: 0.631, 1.0: 0.632, 10.0: 1.215}


def title_line(s, text, x, y=0, size=10.5):
    s.text(x, y, text, size=size, weight=600)


def arrow(s, x1, y1, x2, y2, color="currentColor", w=1.5, opacity=0.75, dash=None):
    """A line with an open arrow head at (x2, y2)."""
    s.line(x1, y1, x2, y2, color=color, w=w, opacity=opacity, dash=dash)
    a = math.atan2(y2 - y1, x2 - x1)
    pts = [(x2 - 6 * math.cos(a + d), y2 - 6 * math.sin(a + d)) for d in (0.5, -0.5)]
    s.poly([pts[0], (x2, y2), pts[1]], color, w=w, opacity=opacity)


def tinted(s, x, y, w, h, color, label=None, sub=None, strong=False, rx=4, dash=None, size=10, sub_size=9.5):
    """A box with a tinted fill and a solid edge, a bold label and an optional second line, both centered."""
    s.rect(x, y, w, h, color, opacity=0.9 if strong else 0.2, rx=rx)
    s.rect(x, y, w, h, None, rx=rx, stroke=color, sw=1.5, dash=dash)
    lines = ([sub] if isinstance(sub, str) else list(sub or []))
    if label and lines:
        top = y + h / 2 - 2 - 6.5 * (len(lines) - 1)
        s.text(x + w / 2, top, label, anchor="middle", weight=600, size=size, fill=WHITE if strong else None)
        for k, line in enumerate(lines):
            s.text(x + w / 2, top + 12.5 + k * 11, line, anchor="middle", size=sub_size, fill=WHITE if strong else None, opacity=None if strong else 0.9)
    elif label:
        s.text(x + w / 2, y + h / 2 + 3.5, label, anchor="middle", weight=600, size=size, fill=WHITE if strong else None)


def fmt3(v):
    return f"{v:.3f}"


# ---------------------------------------------------------------------------------------------------------------------------------------------------
def notebook_namespace(name):
    """Run the code cells of a lesson's notebook up to its exercises, in one namespace, and return it (network off or on: the notebook falls back to
    the repository's own copy of the data)."""
    nb = json.loads((NOTEBOOKS / name).read_text(encoding="utf-8"))
    ns = {"__name__": "__main__"}
    cwd = os.getcwd()
    os.chdir(NOTEBOOKS)
    try:
        for cell in nb["cells"]:
            src = "".join(cell["source"])
            if cell["cell_type"] == "markdown" and src.startswith("## Finish it"):
                break
            if cell["cell_type"] == "code":
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(src, f"<{name}>", "exec"), ns)
    finally:
        os.chdir(cwd)
    return ns


def charts(torch_charts=True):
    out = {}

    # =============================================================================================================================================
    # mle1-pipeline: the pipeline of unit 1, from raw columns to a chance
    s = Svg("mle1-pipeline", "One pipeline from raw columns to a chance of churning, with the column counts of unit 1",
            f"A flow from top to bottom. Two kinds of raw column go in: {M1_TEXT} text columns and {M1_NUMBERS} number columns. Inside a dashed frame "
            f"named Pipeline, a ColumnTransformer sends the text columns to a OneHotEncoder, which gives {sum(M1_ONE_HOT)} columns ({' + '.join(map(str, M1_ONE_HOT))}: "
            f"5 channels, 3 platforms, 4 regions), and the number columns to a StandardScaler, which gives {M1_NUMBERS} columns. One bar shows the "
            f"{M1_MODEL_COLUMNS} columns that reach the model, {sum(M1_ONE_HOT)} from text in blue and {M1_NUMBERS} from numbers in green. The "
            "LogisticRegression at the bottom of the frame turns them into the chance of churning. A column that no branch names would be dropped.")
    title_line(s, "One object: raw columns in, a chance out", 8, 10)
    tinted(s, 8, 22, 160, 26, BLUE, f"{M1_TEXT} text columns")
    tinted(s, 180, 22, 160, 26, GREEN, f"{M1_NUMBERS} number columns")
    arrow(s, 88, 49, 88, 83, color=BLUE, opacity=0.9)
    arrow(s, 260, 49, 260, 83, color=GREEN, opacity=0.9)
    s.rect(8, 62, 332, 246, None, rx=6, stroke="currentColor", sw=1, dash="4 3")
    s.text(16, 76, "Pipeline", size=10, weight=600)
    s.text(332, 300, "fit and predict_proba take raw rows", size=9, anchor="end", opacity=0.8)
    s.rect(16, 84, 316, 84, None, rx=5, stroke="currentColor", sw=1, dash="2 3")
    s.text(24, 97, "ColumnTransformer: each column goes to its branch", size=9, opacity=0.85)
    tinted(s, 24, 108, 148, 50, BLUE, "text: OneHotEncoder", f"{M1_TEXT} columns in, {sum(M1_ONE_HOT)} out")
    tinted(s, 176, 108, 148, 50, GREEN, "numbers: StandardScaler", f"{M1_NUMBERS} columns in, {M1_NUMBERS} out")
    arrow(s, 98, 159, 98, 182, color=BLUE, opacity=0.9)
    arrow(s, 250, 159, 250, 182, color=GREEN, opacity=0.9)
    bw, bx = 300, 24
    wb = bw * sum(M1_ONE_HOT) / M1_MODEL_COLUMNS
    s.rect(bx, 184, wb, 24, BLUE, opacity=0.3)
    s.rect(bx + wb, 184, bw - wb, 24, GREEN, opacity=0.3)
    s.rect(bx, 184, bw, 24, None, stroke="currentColor", sw=1.5, opacity=None)
    s.text(bx + wb / 2, 200, f"{sum(M1_ONE_HOT)} from text", anchor="middle", size=9.5)
    s.text(bx + wb + (bw - wb) / 2, 200, f"{M1_NUMBERS} numbers", anchor="middle", size=9.5)
    s.text(bx + bw / 2, 224, f"{M1_MODEL_COLUMNS} columns reach the model", anchor="middle", weight=600, size=10)
    arrow(s, 174, 230, 174, 244)
    tinted(s, 84, 246, 180, 38, PURPLE, "LogisticRegression", f"{M1_MODEL_COLUMNS} weights and a bias")
    arrow(s, 174, 309, 174, 326)
    s.text(174, 340, "chance of churning", anchor="middle", weight=600, size=10)
    out["mle1-pipeline"] = s.render()

    # =============================================================================================================================================
    # mle1-requests: three changed requests, one fitted pipeline
    s = Svg("mle1-requests", "What the fitted pipeline did with three changed requests",
            "Three rows, one for each changed copy of the same five requests. " + " ".join(
                f"{lab}: {res}, {detail}." for lab, res, detail, _ in M1_REQUESTS)
            + " Only the missing number stopped the call; the new region was scored with no region column lit.")
    title_line(s, "Three changed requests, one fitted pipeline", 8, 10)
    colors = {"ok": GREEN, "quiet": OCHRE, "refused": PURPLE}
    for i, (lab, res, detail, kind) in enumerate(M1_REQUESTS):
        y = 26 + i * 50
        s.text(8, y + 20, lab, size=10, weight=600)
        arrow(s, 134, y + 16, 160, y + 16)
        tinted(s, 164, y, 176, 38, colors[kind], res, detail)
    s.text(8, 188, "green: scored correctly · ochre: scored, nothing said · purple: refused", size=9, opacity=0.85)
    out["mle1-requests"] = s.render()

    # =============================================================================================================================================
    # mle1-learned: learned in fit or recomputed from the rows given
    s = Svg("mle1-learned", "Cross-validation scores two pipelines alike, scoring requests one at a time tells them apart",
            "Two rows. " + " ".join(
                f"{lab} ({step}): cross-validated ROC AUC {auc:.3f}, and the largest difference between the chances of the first five test people scored among all 4,454 and scored one at a time is {diff:.3f}."
                for lab, step, auc, diff in M1_LEARNED)
            + " A bar on a scale from 0 to 0.3 shows the difference.")
    title_line(s, "Same score on batches, not the same on requests", 8, 10)
    s.text(194, 36, "5-fold AUC", size=9, anchor="middle", opacity=0.85)
    s.text(232, 25, "together or alone,", size=9, opacity=0.85)
    s.text(232, 36, "biggest change", size=9, opacity=0.85)
    Xd = Axis(0, 0.3, 232, 292)
    for i, (lab, step, auc, diff) in enumerate(M1_LEARNED):
        y = 44 + i * 46
        s.text(8, y + 12, lab, size=10, weight=600)
        s.text(8, y + 25, step, size=8.5, opacity=0.8)
        tinted(s, 170, y + 2, 48, 24, BLUE, f"{auc:.3f}", size=10)
        s.line(Xd(0), y, Xd(0), y + 28, opacity=0.5)
        if diff > 0:
            s.rect(Xd(0), y + 6, Xd(diff) - Xd(0), 16, OCHRE, opacity=0.9, rx=2)
            s.text(Xd(diff) + 4, y + 18, f"{diff:.3f}", size=10, weight=600)
        else:
            s.text(Xd(0) + 5, y + 18, f"{diff:.1f}", size=10, weight=600)
    s.text(Xd(0), 148, "0", size=9, anchor="middle", opacity=0.8)
    s.text(Xd(0.3), 148, "0.3", size=9, anchor="middle", opacity=0.8)
    s.line(Xd(0), 134, Xd(0.3), 134, opacity=0.5)
    out["mle1-learned"] = s.render()

    # =============================================================================================================================================
    # mle2-lazy: what lazy validation reports
    assert sum(n for _, _, n in M2_CHECKS) == M2_CASES
    s = Svg("mle2-lazy", "The five failed checks that lazy validation reports for the clinic file",
            "A bar chart of failure cases for each failed check on a scale from 0 to 50: " + ", ".join(f"{c} {k}, {n}" for c, k, n in M2_CHECKS)
            + f". Together {M2_CASES} failure cases fall in {M2_ROWS} different rows, because ten rows broke two checks. Without lazy=True validation "
            "raised at one failed check, the uniqueness of user_id, and reported none of the other four.")
    title_line(s, "lazy=True: every failed check, with its cases", 8, 10)
    Xb = Axis(0, 50, 144, 316)
    for v in (0, 25, 50):
        s.line(Xb(v), 24, Xb(v), 24 + len(M2_CHECKS) * 30, opacity=0.5 if v == 0 else 0.13)
        s.text(Xb(v), 24 + len(M2_CHECKS) * 30 + 12, str(v), size=9, anchor="middle", opacity=0.8)
    for i, (col, check, n) in enumerate(M2_CHECKS):
        y = 28 + i * 30
        hit = col == "user_id"
        s.text(8, y + 10, col, size=10, weight=600)
        s.text(8, y + 21, check, size=8.5, opacity=0.8)
        s.rect(Xb(0), y + 3, Xb(n) - Xb(0), 18, PURPLE if hit else BLUE, opacity=0.9, rx=2)
        s.text(Xb(n) + 5, y + 16, str(n), size=10, weight=600)
    y_base = 24 + len(M2_CHECKS) * 30 + 34
    s.text(174, y_base, f"{M2_CASES} cases in {M2_ROWS} different rows (ten rows broke two checks)", anchor="middle", size=9.5, weight=600)
    s.rect(8, y_base + 12, 10, 10, PURPLE, rx=2)
    s.text(22, y_base + 21, "the one check reported without lazy=True", size=9)
    out["mle2-lazy"] = s.render()

    # =============================================================================================================================================
    # mle2-requests: the four requests of unit 2
    s = Svg("mle2-requests", "What the request model did with four changed requests",
            "Four rows, one for each change to a real person's request. " + " ".join(f"{lab}: {res}, {detail}." for lab, res, detail, _ in M2_REQUESTS)
            + " The text \"3\" is the only one that passed, converted to a number; the other three were refused with a message for the field.")
    title_line(s, "Four requests, one request model", 8, 10)
    colors = {"quiet": OCHRE, "refused": PURPLE}
    for i, (lab, res, detail, kind) in enumerate(M2_REQUESTS):
        y = 26 + i * 46
        s.text(8, y + 21, lab, size=10, weight=600)
        arrow(s, 146, y + 17, 168, y + 17)
        tinted(s, 172, y, 168, 36, colors[kind], res, detail)
    s.text(8, 216, "ochre: passed, converted · purple: refused with a message for the field", size=9, opacity=0.85)
    out["mle2-requests"] = s.render()

    # =============================================================================================================================================
    # mle2-triage: the clinic file through repair, check, keep and quarantine
    assert M2_KEPT + M2_QUARANTINED == M2_FILE
    s = Svg("mle2-triage", "Where the 17,828 rows of the clinic file went: repair, check, keep or quarantine",
            f"A flow from top to bottom. The clinic file has {M2_FILE:,} rows. A repair rule, text columns in lower case with no spaces at the ends, changes "
            f"{M2_REPAIRED} of them. The schema check then splits the rows: {M2_KEPT:,} rows are kept, {M2_REPAIRED} of them repaired by the rule, and {M2_QUARANTINED} are "
            "quarantined, set aside with their reasons. A third, dashed outcome is to reject the whole batch, when a check fails on a whole column or too many rows "
            f"fail. A thin bar at the bottom, to scale, shows the {M2_QUARANTINED} quarantined rows as a sliver of the {M2_FILE:,}.")
    title_line(s, "Triage of the clinic file", 8, 10)
    tinted(s, 8, 22, 332, 26, BLUE, f"clinic file: {M2_FILE:,} rows")
    arrow(s, 174, 49, 174, 64)
    tinted(s, 8, 66, 332, 40, GREEN, "repair rule: text columns lower case, no spaces at the ends", f"changes {M2_REPAIRED} rows, and the count is part of the report", sub_size=9)
    arrow(s, 174, 107, 174, 122)
    tinted(s, 8, 124, 332, 26, PURPLE, "schema check, lazy: every failed check, row by row")
    arrow(s, 100, 151, 100, 170, color=GREEN, opacity=0.9)
    arrow(s, 272, 151, 272, 170, color=OCHRE, opacity=0.9)
    tinted(s, 8, 172, 196, 44, GREEN, f"{M2_KEPT:,} rows kept", f"{M2_REPAIRED} of them repaired by the rule")
    tinted(s, 212, 172, 128, 44, OCHRE, f"{M2_QUARANTINED} quarantined", "set aside, with reasons", sub_size=9)
    s.rect(8, 226, 332, 38, None, rx=4, stroke=PURPLE, sw=1.5, dash="4 3")
    s.text(174, 242, "or reject the whole batch", anchor="middle", weight=600, size=10)
    s.text(174, 255, "a check fails on a whole column, or too many rows fail", anchor="middle", size=9, opacity=0.9)
    sw = 332
    s.rect(8, 278, sw, 8, GREEN, opacity=0.35)
    s.rect(8 + sw * M2_KEPT / M2_FILE, 278, sw * M2_QUARANTINED / M2_FILE, 8, OCHRE, opacity=0.95)
    s.text(8, 302, f"{M2_KEPT:,} + {M2_QUARANTINED} = {M2_FILE:,} rows, to scale", size=9, opacity=0.85)
    out["mle2-triage"] = s.render()

    # =============================================================================================================================================
    # mle2-doors: one contract, two doors
    s = Svg("mle2-doors", "One contract read by the training door and the serving door, and the test that ties it to the fitted pipeline",
            "A box at the top, contract.py, lists the allowed channels, platforms and regions once. Two arrows lead from it. On the training side the pandera "
            "table schema checks a whole table and quarantines the rows that fail. On the serving side the pydantic request model checks one request and refuses it "
            "with a message for the field. Both sides lead to the fitted pipeline, whose encoder learned the same lists. A test compares the lists with what the "
            "encoder learned, so adding a channel to the list without retraining makes that one test fail.")
    title_line(s, "Two doors, one list of allowed values", 8, 10)
    tinted(s, 8, 22, 332, 38, BLUE, "contract.py: CHANNELS, PLATFORMS, REGIONS", "listed once, read by both doors")
    arrow(s, 88, 61, 88, 82)
    arrow(s, 260, 61, 260, 82)
    tinted(s, 8, 84, 160, 56, GREEN, "training door", ["table_schema (pandera)", "a whole table, bad rows", "are quarantined"], sub_size=9)
    tinted(s, 180, 84, 160, 56, PURPLE, "serving door", ["ChurnRequest (pydantic)", "one request, refused", "with a message"], sub_size=9)
    arrow(s, 88, 141, 88, 164)
    arrow(s, 260, 141, 260, 164)
    tinted(s, 8, 166, 332, 36, BLUE, "fitted pipeline", "its encoder learned the same lists in training")
    s.text(174, 222, "test: the lists equal what the encoder learned", anchor="middle", size=9.5, weight=600)
    s.text(174, 236, "a new value in the list without a retrained pipeline fails it", anchor="middle", size=9, opacity=0.9)
    out["mle2-doors"] = s.render()

    # =============================================================================================================================================
    # mle3-registry: the runs ranked by score, and the alias
    s = Svg("mle3-registry", "The four runs of unit 1 and 2 by cross-validated AUC, and the registered model with its champion alias",
            "A dot chart on a scale from 0.675 to 0.705. " + " ".join(f"The run {name} scored {auc:.6f}." for name, auc, _ in M3_RUNS)
            + f" The first two dots are less than 0.0001 apart. A shaded band from {M3_FOLDS[0]} to {M3_FOLDS[1]} marks the spread of the five folds of one model in lesson DS5. "
            f"The run {M3_FAILED} has the status FAILED and no score. Below, the registry holds the model churn, version 1, made from the run C=0.1, and the alias champion "
            "points at that version.")
    title_line(s, "Runs by cv_auc_mean, then one registered version", 8, 10)
    X = Axis(0.675, 0.705, 92, 332)
    top, row_h = 40, 26
    s.rect(X(M3_FOLDS[0]), top - 8, X(M3_FOLDS[1]) - X(M3_FOLDS[0]), row_h * 4 + 6, PURPLE, opacity=0.13, rx=2)
    s.text(X(M3_FOLDS[0]), top - 12, "spread of five folds of one model (DS5)", size=8.5, opacity=0.85)
    for v in (0.68, 0.69, 0.70):
        s.line(X(v), top - 6, X(v), top + row_h * 4 - 2, opacity=0.18)
        s.text(X(v), top + row_h * 4 + 10, f"{v:.2f}", size=9, anchor="middle", opacity=0.8)
    for i, (name, auc, rid) in enumerate(M3_RUNS):
        y = top + i * row_h + 8
        s.text(8, y + 3.5, name, size=10, weight=600)
        s.circle(X(auc), y, 5, GREEN if i == 0 else BLUE)
        s.text(X(auc) + 9 if auc < 0.69 else X(auc) - 9, y + 3.5, f"{auc:.6f}", size=9, anchor="start" if auc < 0.69 else "end")
    y = top + 3 * row_h + 8
    s.text(8, y + 3.5, M3_FAILED, size=10, weight=600)
    s.text(58, y + 3.5, "FAILED", size=9.5, weight=600, fill=OCHRE)
    yr = top + row_h * 4 + 36
    tinted(s, 8, yr, 150, 36, GREEN, "churn, version 1", "from the run C=0.1", strong=False)
    tinted(s, 218, yr, 122, 36, BLUE, "alias: champion", "a name that can move", sub_size=9)
    arrow(s, 217, yr + 18, 160, yr + 18)
    out["mle3-registry"] = s.render()

    # =============================================================================================================================================
    # mle3-record: what one run record holds
    s = Svg("mle3-record", "What the record of run 615bf25e holds",
            "A list of eight lines, each with its kind. " + " ".join(f"{kind} {name}: {val}" + (f", for {note}" if note else "") + "." for kind, name, val, note in M3_RECORD)
            + " The parameters and metric are what went in and came out; the data fingerprint, the commit, the uncommitted-changes flag and the lock fingerprint name what the run depended on. "
              "The ids, the commit and the fingerprints are from one run of the lesson.")
    title_line(s, "Run 615bf25e: C=0.1 seed=2026", 8, 10)
    kinds = {"param": BLUE, "tag": PURPLE, "metric": GREEN, "artifact": GREEN}
    for i, (kind, name, val, note) in enumerate(M3_RECORD):
        y = 24 + i * 25
        s.rect(8, y, 56, 19, kinds[kind], opacity=0.22, rx=4)
        s.rect(8, y, 56, 19, None, rx=4, stroke=kinds[kind], sw=1.2)
        s.text(36, y + 13, kind, size=9, anchor="middle", weight=600)
        s.text(72, y + 13.5, f"{name} = {val}" if kind != "artifact" else f"{name}: {val}", size=10)
        if note:
            s.text(340, y + 13.5, note, size=9, anchor="end", opacity=0.85)
    out["mle3-record"] = s.render()

    # =============================================================================================================================================
    # mle3-reproduce: compare fingerprints, then run again or refuse
    s = Svg("mle3-reproduce", "Reproducing run 615bf25e: the data fingerprints are compared before anything is trained",
            f"Two rows of three boxes. In the first row the data file is unchanged: its fingerprint now is {M3_SAME}, the same as the record's, so the run trains again with C 0.1 "
            "and seed 2026 and prints recorded 0.691687, reproduced 0.691687, identical True. In the second row one number of the file was changed: the fingerprint now is "
            f"{M3_OTHER}, not {M3_SAME}, so reproduce stops before training and prints that it cannot reproduce because the data file changed.")
    title_line(s, "reproduce checks the data file first", 8, 10)
    for i, (head, same) in enumerate((("file unchanged", True), ("one number changed", False))):
        y = 34 + i * 100
        s.text(8, y - 4, head, size=10, weight=600)
        tinted(s, 8, y, 96, 58, BLUE)
        s.text(56, y + 14, "data file", size=10, anchor="middle", weight=600)
        s.text(56, y + 30, f"record {M3_SAME}", size=8, anchor="middle")
        s.text(56, y + 44, f"now {M3_SAME if same else M3_OTHER}", size=8, anchor="middle", weight=600)
        arrow(s, 106, y + 29, 126, y + 29)
        tinted(s, 128, y, 96, 58, GREEN if same else PURPLE, "train again" if same else "stop", "C 0.1, seed 2026" if same else "before training", sub_size=8.5)
        arrow(s, 226, y + 29, 246, y + 29)
        if same:
            tinted(s, 248, y, 92, 58, GREEN, "identical: True", "0.691687 twice", sub_size=8.5, size=9.5)
        else:
            tinted(s, 248, y, 92, 58, PURPLE, "cannot reproduce", "the data file changed", sub_size=8.5, size=9.5)
    out["mle3-reproduce"] = s.render()

    # =============================================================================================================================================
    # mle4-grid: 8 settings x 5 folds
    s = Svg("mle4-grid", "The 40 fits of the search: 8 settings on each of the 5 folds, then one refit of the winner",
            "A grid of 8 rows, one for each setting, and 5 columns, one for each fold: 40 small squares. The first four rows are logistic regression with C 0.01 or 1.0 and "
            "no class weights or balanced weights; the last four are boosted trees with a learning rate of 0.05 or 0.2 and a depth of 2 or 4. The row for logistic regression with "
            f"C 1.0 and balanced weights is the best, with a mean average precision of {M4_BEST}; the row with C 1.0 and no weights is the plain model, at {M4_PLAIN}. "
            f"After the 40 fits the winner is fitted once more on all {M4_TRAIN:,} training people.")
    title_line(s, "8 settings x 5 folds = 40 fits", 8, 10)
    s.text(144, 32, "fold", size=9, opacity=0.85, anchor="end")
    for k in range(5):
        s.text(150 + k * 24 + 9, 32, str(k + 1), size=9, anchor="middle", opacity=0.85)
    for i, (lab, _) in enumerate(M4_GRID):
        y = 38 + i * 21
        best, plain = i == 3, i == 2
        s.text(8, y + 13, lab, size=9, weight=600 if best or plain else None, opacity=None if best or plain else 0.85)
        for k in range(5):
            x = 150 + k * 24
            if best:
                s.rect(x, y, 18, 16, GREEN, opacity=0.9, rx=3)
            elif plain:
                s.rect(x, y, 18, 16, BLUE, opacity=0.9, rx=3)
            else:
                s.rect(x, y, 18, 16, "currentColor", opacity=0.15, rx=3)
        if best:
            s.text(278, y + 13, f"best {M4_BEST}", size=9.5, weight=600)
        if plain:
            s.text(278, y + 13, f"plain {M4_PLAIN}", size=9.5, weight=600)
    yb = 38 + 8 * 21 + 10
    s.text(8, yb + 4, f"then one refit of the winner on all {M4_TRAIN:,} training people", size=9.5, weight=600)
    s.text(8, yb + 18, "mean average precision of the five folds in the two named rows", size=9, opacity=0.85)
    out["mle4-grid"] = s.render()

    # =============================================================================================================================================
    # mle4-baseline: the numbers next to their baselines
    s = Svg("mle4-baseline", "Average precision of the plain model, the best setting and the tuned model, next to the flat guess",
            f"A bar chart on a scale from 0 to 0.3. On the five folds of the training people: the plain logistic regression {M4_PLAIN}, and the best setting {M4_BEST} with a "
            f"spread of the five folds of {M4_SPREAD}. Scored once on the {M4_TEST:,} test people: the flat guess {M4_FLAT}, which equals the share of churners, and the tuned model {M4_TUNED}, "
            "about twice the flat guess.")
    title_line(s, "Average precision, each beside its baseline", 8, 10)
    X = Axis(0, 0.3, 108, 328)
    rows = [("plain default", M4_PLAIN, BLUE, "5 folds"), ("best setting", M4_BEST, BLUE, "5 folds"), ("flat guess", M4_FLAT, OCHRE, "test"), ("tuned model", M4_TUNED, GREEN, "test")]
    for v in (0, 0.1, 0.2, 0.3):
        s.line(X(v), 26, X(v), 26 + 4 * 30 + 14, opacity=0.5 if v == 0 else 0.13)
        s.text(X(v), 26 + 4 * 30 + 26, f"{v:.1f}", size=9, anchor="middle", opacity=0.8)
    for i, (lab, v, col, where) in enumerate(rows):
        y = 34 + i * 30 + (14 if i >= 2 else 0)
        s.text(8, y + 11, lab, size=10, weight=600)
        s.text(8, y + 22, "scored on the five folds" if where == "5 folds" else "scored once, test part", size=8.5, opacity=0.8)
        s.rect(X(0), y + 3, X(v) - X(0), 18, col, opacity=0.9, rx=2)
        s.text(X(v + (M4_SPREAD if lab == "best setting" else 0)) + 6, y + 16, f"{v:.3f}", size=10, weight=600)
        if lab == "best setting":
            s.line(X(v - M4_SPREAD), y + 12, X(v + M4_SPREAD), y + 12, color="currentColor", w=1.2, opacity=0.9)
            s.line(X(v - M4_SPREAD), y + 7, X(v - M4_SPREAD), y + 17, opacity=0.9)
            s.line(X(v + M4_SPREAD), y + 7, X(v + M4_SPREAD), y + 17, opacity=0.9)
    s.text(174, 26 + 4 * 30 + 44, f"line on the best setting: its mean ± {M4_SPREAD}, the spread of its five folds", size=9, anchor="middle", opacity=0.85)
    out["mle4-baseline"] = s.render()

    # =============================================================================================================================================
    # mle4-routes: weights or a moved cut
    s = Svg("mle4-routes", "Recall and precision of the plain model at 0.5, the balanced model at 0.5 and the plain model with its cut moved to 0.104",
            "Three groups of two bars on a scale from 0 to 1, recall in blue and precision in green. The plain model with the cut at 0.5 flags nobody, so recall and precision are 0.0. "
            "The balanced model at the cut 0.5 has a recall of 0.566 and a precision of 0.16. The plain model with its cut moved to 0.104 has the same recall, 0.566, and a precision of 0.167.")
    title_line(s, "Weights or a moved cut: one trade", 8, 10)
    X = Axis(0, 1, 134, 306)
    for v in (0, 0.5, 1):
        s.line(X(v), 24, X(v), 24 + 3 * 52, opacity=0.5 if v == 0 else 0.13)
        s.text(X(v), 24 + 3 * 52 + 12, f"{v:g}", size=9, anchor="middle", opacity=0.8)
    for i, (lab, rec, prec) in enumerate(M4_ROUTES):
        y = 30 + i * 52
        s.text(8, y + 22, lab, size=10, weight=600)
        for j, (name, v, col) in enumerate((("recall", rec, BLUE), ("precision", prec, GREEN))):
            yy = y + j * 20
            if v > 0:
                s.rect(X(0), yy + 1, X(v) - X(0), 14, col, opacity=0.9, rx=2)
                s.text(X(v) + 5, yy + 12, f"{name} {v:g}" if v != 0.16 else f"{name} 0.16", size=9.5)
            else:
                s.text(X(0) + 5, yy + 12, f"{name} 0.0" + (", flags nobody" if j == 0 else ""), size=9.5, opacity=0.9)
    out["mle4-routes"] = s.render()

    # =============================================================================================================================================
    # mle4-folds: copies before the folds and inside them
    s = Svg("mle4-folds", "Copies made before the folds put a person's twin on both sides of the split; copies made inside the folds do not",
            f"Two strips, each one fold cut into a wide fitting part and a narrow scoring part. In the first strip each churner is copied {M4_COPIES} times before the folds are cut, so "
            "person A has four copies in the fitting part and one in the scoring part, and the average precision is "
            f"{M4_BEFORE}. In the second strip the folds are cut first and only the fitting rows are copied, so person A stands once in the scoring part, the fitting part holds copies "
            f"of other churners, and the average precision is {M4_INSIDE}. Small circles are people who stayed. The placing of the copies is an example.")
    title_line(s, f"Each churner copied {M4_COPIES} times: before or inside the folds", 8, 10)

    def tok(x, y, letter, col):
        s.rect(x, y, 18, 18, col, opacity=0.3, rx=3)
        s.rect(x, y, 18, 18, None, rx=3, stroke=col, sw=1.3)
        s.text(x + 9, y + 13, letter, size=10, weight=600, anchor="middle")

    def dots(x, y, n):
        for k in range(n):
            s.circle(x + 6 + k * 14, y + 9, 3.5, "currentColor", opacity=0.3)

    for i, (head, fit, score, res, col) in enumerate((
        ("copies first, then the five folds", [("A", PURPLE)] * 4, [("A", PURPLE)], f"AP {M4_BEFORE}: A is in both parts", OCHRE),
        ("five folds first, then copies in the fitting part", [("B", BLUE)] * 4, [("A", PURPLE)], f"AP {M4_INSIDE}: A is only in the scoring part", GREEN),
    )):
        y = 28 + i * 90
        s.text(8, y + 4, head, size=10, weight=600)
        s.rect(8, y + 14, 232, 28, None, rx=4, stroke="currentColor", sw=1.2)
        s.rect(250, y + 14, 90, 28, None, rx=4, stroke="currentColor", sw=1.2, dash="3 2")
        s.text(8, y + 54, "fitting part", size=9, opacity=0.85)
        s.text(250, y + 54, "scoring part", size=9, opacity=0.85)
        x = 14
        for letter, c in fit:
            tok(x, y + 19, letter, c)
            x += 22
        dots(x + 2, y + 19, 8)
        x2 = 256
        for letter, c in score:
            tok(x2, y + 19, letter, c)
            x2 += 22
        dots(x2 + 2, y + 19, 3)
        s.rect(8, y + 62, 8, 8, col, rx=2)
        s.text(21, y + 70, "leaks" if i == 0 else "clean", size=9, opacity=0.85)
        s.text(340, y + 70, res, size=9.5, weight=600, anchor="end")
    out["mle4-folds"] = s.render()

    # =============================================================================================================================================
    # mle5-network: one neuron and a small network, with their counts
    s = Svg("mle5-network", "One neuron with 20 numbers and a small network with 169, drawn from the 19 columns",
            f"Two drawings. Above, one neuron reads the {M5_INPUTS} columns, adds them with {M5_INPUTS} weights and a bias, and bends the sum: {M5_NEURON} learnable numbers. Below, a small network "
            f"reads the same {M5_INPUTS} columns with a layer of {M5_HIDDEN} neurons, each with {M5_INPUTS} weights and a bias, {M5_HIDDEN} x ({M5_INPUTS} + 1) = {M5_HIDDEN * (M5_INPUTS + 1)} numbers, "
            f"and an output neuron with {M5_HIDDEN} weights and a bias, {M5_HIDDEN} + 1 = {M5_HIDDEN + 1} numbers: {M5_SMALL} in all. Only three of the {M5_INPUTS} inputs are drawn.")
    assert M5_HIDDEN * (M5_INPUTS + 1) + M5_HIDDEN + 1 == M5_SMALL and M5_INPUTS + 1 == M5_NEURON
    title_line(s, "Counting the numbers a network learns", 8, 10)
    # one neuron
    s.text(8, 34, "one neuron", size=10, weight=600)
    for yy, lab in zip((44, 58, 88), ("x1", "x2", f"x{M5_INPUTS}")):
        s.circle(40, yy, 4, BLUE)
        s.text(32, yy + 3.5, lab, size=8.5, anchor="end", opacity=0.85)
        s.line(44, yy, 118, 66, opacity=0.35)
    for yy in (68, 73, 78):
        s.circle(40, yy, 1.2, "currentColor", opacity=0.5)
    s.circle(124, 66, 8, PURPLE)
    arrow(s, 134, 66, 176, 66)
    s.text(180, 70, "chance", size=10, weight=600)
    s.text(8, 108, f"{M5_INPUTS} weights + 1 bias = {M5_NEURON} numbers", size=10, weight=600)
    s.line(8, 120, 340, 120, opacity=0.2)
    # the small network
    s.text(8, 138, "a small network", size=10, weight=600)
    ys_in = [172, 192, 230]
    ys_h = [150 + k * 16 for k in range(M5_HIDDEN)]
    for k, lab in enumerate(("x1", "x2", f"x{M5_INPUTS}")):
        for yh in ys_h:
            s.line(70, ys_in[k], 190, yh, opacity=0.18)
        s.circle(66, ys_in[k], 4, BLUE)
        s.text(58, ys_in[k] + 3.5, lab, size=8.5, anchor="end", opacity=0.85)
    for yy in (206, 211, 216):
        s.circle(66, yy, 1.2, "currentColor", opacity=0.5)
    for yh in ys_h:
        s.line(190, yh, 300, 206, opacity=0.18)
    for yh in ys_h:
        s.circle(190, yh, 5, PURPLE)
    s.circle(304, 206, 6, GREEN)
    s.text(66, 252, f"{M5_INPUTS} columns in", size=9, anchor="middle", opacity=0.85)
    s.text(190, 280, f"{M5_HIDDEN} neurons", size=9, anchor="middle", opacity=0.85)
    s.text(304, 226, "chance", size=9, anchor="middle", weight=600)
    s.text(190, 298, f"{M5_HIDDEN} x ({M5_INPUTS} weights + 1 bias) = {M5_HIDDEN * (M5_INPUTS + 1)} numbers", size=10, anchor="middle", weight=600)
    s.text(340, 252, f"{M5_HIDDEN} weights + 1 bias = {M5_HIDDEN + 1}", size=10, anchor="end", weight=600)
    s.text(174, 322, f"{M5_HIDDEN * (M5_INPUTS + 1)} + {M5_HIDDEN + 1} = {M5_SMALL} numbers in all", size=10.5, anchor="middle", weight=600)
    out["mle5-network"] = s.render()

    if torch_charts:
        try:
            ns = notebook_namespace("ml-engineer-neural-networks-and-training-loop.ipynb")
        except ModuleNotFoundError as e:
            raise SystemExit(f"{e}: the MLE5 curve charts need PyTorch (see the docstring); or pass --no-torch")
        curves = ns["curves"]
        # the numbers the lesson prints for unit 4
        assert len(curves) == 300
        val = [p[1] for p in curves]
        assert int(min(range(300), key=val.__getitem__)) + 1 == M5_BEST_EPOCH and round(val[M5_BEST_EPOCH - 1], 3) == M5_BEST_LOSS
        assert (round(curves[-1][0], 3), round(curves[-1][1], 3)) == M5_END

        # ---- the 20-epoch losses drawn by scripts/animations/step-learning-rate.mjs (a stepper, no longer a chart of this file): check that the run still ends where the lesson says ----
        for lr in M5_LR_ENDS:
            _, h = ns["fit_network"](ns["Xf"], ns["yf"], 8, lr, 20)
            assert round(h[-1][0], 3) == M5_LR_ENDS[lr], (lr, h[-1][0])

        # ---- mle5-curves: the two curves of the 500-person pilot over 300 epochs ----
        s = Svg("mle5-curves", "Loss on the 500 people the network learns from and on the 3,341 validation people, over 300 epochs",
                f"A line chart of two curves over 300 epochs, drawn from the run of unit 4, on a scale from 0.3 to 0.9. The loss on the 500 fitting people falls to {M5_END[0]}. "
                f"The loss on the validation people falls to {M5_BEST_LOSS} at epoch {M5_BEST_EPOCH}, then rises to {M5_END[1]}. A dashed line at {M5_FLAT_SHARE} marks the loss of the share of churners as a flat chance; "
                "the validation curve crosses it after its lowest point.")
        title_line(s, "Two curves that part: the 500-person pilot", 8, 10)
        X0, X1 = 40, 262
        Y = Axis(0.3, 0.9, 186, 38)
        X = Axis(1, 300, X0, X1)
        for v in (0.3, 0.5, 0.7, 0.9):
            s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == 0.3 else 0.13)
            s.text(X0 - 5, Y(v) + 3.5, f"{v:.1f}", size=9, anchor="end", opacity=0.8)
        for e in (1, 100, 200, 300):
            s.text(X(e), 200, str(e), size=9, anchor="middle", opacity=0.8)
        s.text((X0 + X1) / 2, 214, "epoch", size=9, anchor="middle", opacity=0.85)
        s.line(X0, Y(M5_FLAT_SHARE), X1, Y(M5_FLAT_SHARE), w=1.2, opacity=0.7, dash="4 3")
        s.text(X1 - 2, Y(M5_FLAT_SHARE) - 4, f"flat guess {M5_FLAT_SHARE}", size=9, anchor="end", opacity=0.9)
        s.poly([(X(e + 1), Y(p[0])) for e, p in enumerate(curves)], GREEN, w=2)
        s.poly([(X(e + 1), Y(p[1])) for e, p in enumerate(curves)], PURPLE, w=2)
        s.line(X(M5_BEST_EPOCH), Y(0.84) + 4, X(M5_BEST_EPOCH), 186, w=1.2, opacity=0.8, dash="2 3")
        s.circle(X(M5_BEST_EPOCH), Y(M5_BEST_LOSS), 4.5, PURPLE)
        s.text(X(M5_BEST_EPOCH) + 6, Y(0.87), "lowest validation loss", size=9.5, weight=600)
        s.text(X(M5_BEST_EPOCH) + 6, Y(0.87) + 12, f"epoch {M5_BEST_EPOCH}, {M5_BEST_LOSS}", size=9.5, weight=600)
        s.text(X1 + 6, Y(M5_END[0]) + 3.5, f"{M5_END[0]:.3f}", size=9.5, weight=600)
        s.text(X1 + 6, Y(M5_END[1]) + 3.5, f"{M5_END[1]:.3f}", size=9.5, weight=600)
        s.rect(8, 226, 14, 3, GREEN)
        s.text(27, 231, "the 500 fitting people", size=9.5)
        s.rect(172, 226, 14, 3, PURPLE)
        s.text(191, 231, "the 3,341 validation people", size=9.5)
        out["mle5-curves"] = s.render()
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def facts_ok(name, text):
    """Values each figure draws must stand in its lesson's text."""
    need = {
        "mle1-pipeline": ["19 12", "12 from the text columns (5 + 3 + 4)", "7 numbers"],
        "mle1-requests": ["0.014", "ValueError", "Input X contains NaN"],
        "mle1-learned": ["learned 0.692 0.0", "recomputed 0.692 0.251"],
        "mle2-lazy": ["154 failure cases in 144 different rows", "45 cases", "ten rows broke two checks"],
        "mle2-requests": ["accepted, sessions_7d is 3", "Input should be greater than or equal to 0", "valid integer"],
        "mle2-triage": ["17,704 rows kept, 20 repaired by the rule, 124 quarantined", "17,828"],
        "mle2-doors": ["CHANNELS", "ChurnRequest", "table_schema"],
        "mle3-registry": ["0.691687", "0.691592", "0.683299", "FAILED", "0.683 to 0.702", "alias champion"],
        "mle3-record": ["4342d7d93418", "62e13d8", "04f103b69439", "git_uncommitted_changes: False", "615bf25e"],
        "mle3-reproduce": ["recorded 0.691687, reproduced 0.691687, identical: True", "4342d7d93418", "de9b4f9f2adc"],
        "mle4-grid": ["8 settings x 5 folds = 40 fits", "6,783 training", "0.219", "0.216"],
        "mle4-baseline": ["0.219 0.046 0.216", "flat guess 0.102", "tuned 0.214", "2,261"],
        "mle4-routes": ["balanced 0.566 0.16", "0.104 0.566 0.167"],
        "mle4-folds": ["0.56 0.218", "5 times each"],
        "mle5-network": ["20 169", "160", "8 weights and a bias"],
        "mle5-curves": ["28 0.638", "0.330", "0.874", "0.689"],
    }[name]
    return [n for n in need if n not in text]


def paste(result, check=False):
    texts = {k: v.read_text(encoding="utf-8") for k, v in LESSONS.items() if v.exists()}
    bad = []
    for name, svg in result.items():
        key = name.split("-")[0]
        text = texts[key]
        marker = "{/* CHART: " + name + " */}"
        old = re.search(r'<figure>\n<svg [^\n]*aria-labelledby="' + re.escape(name) + r'-t [^\n]*\n.*?</figure>', text, re.S)
        if check:
            missing = facts_ok(name, text)
            if figure(svg) not in text or missing:
                bad.append((name, missing or "out of date"))
            continue
        if marker in text:
            text = text.replace(marker, figure(svg))
        elif old:
            text = text.replace(old.group(0), figure(svg))
        else:
            bad.append((name, "no marker"))
        texts[key] = text
    if not check:
        for k, v in texts.items():
            LESSONS[k].write_text(v, encoding="utf-8")
    return bad


if __name__ == "__main__":
    result = charts(torch_charts="--no-torch" not in sys.argv)
    if "--check" in sys.argv:
        bad = paste(result, check=True)
        print("figures out of date in their lesson, or values missing from its text:", bad or "none")
        sys.exit(1 if bad else 0)
    if "--paste" in sys.argv:
        bad = paste(result)
        print("figures with no marker or figure in their lesson:", bad or "none")
        sys.exit(1 if bad else 0)
    if "--out" in sys.argv:
        folder = Path(sys.argv[sys.argv.index("--out") + 1])
        folder.mkdir(parents=True, exist_ok=True)
        for name, svg in result.items():
            (folder / f"{name}.svg").write_text(svg + "\n")
        print("wrote", ", ".join(result))
    else:
        print(__doc__)
