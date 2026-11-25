"""Draws the static figures of the ML Engineer lessons MLE13 (serving-a-model-api) and MLE14 (monitoring-drift-and-retraining).

    python3 scripts/charts/mle-batch-4.py --out DIR     write every figure as DIR/<name>.svg
    python3 scripts/charts/mle-batch-4.py --paste       put every figure into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/mle-batch-4.py --check       exit 1 unless every figure appears, byte for byte, in its lesson, and every value it draws
                                                        appears in the lesson's text

Uses the Svg class and the colors of da-batch-1.py, as ml-batch-1.py does. Every value typed below is copied from a console block of the lesson
it is drawn in (the block is named above each value), and `--check` fails when a value stands in no sentence of its lesson.
"""
import importlib.util
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
LESSONS = {"mle13": DOCS / "serving-a-model-api.mdx", "mle14": DOCS / "monitoring-drift-and-retraining.mdx"}

# mle14, unit 2 and 3 (the weekly tables): the weeks from March 2 to May 25, the largest PSI of each, the AUC of each, and the AUC of the last three
# weeks with the invented outcomes of unit 3.
WEEKS = ["Mar 2", "Mar 9", "Mar 16", "Mar 23", "Mar 30", "Apr 6", "Apr 13", "Apr 20", "Apr 27", "May 4", "May 11", "May 18", "May 25"]
PSI = [0.009, 0.010, 0.007, 0.009, 0.009, 0.010, 0.278, 0.530, 0.462, 0.540, 0.586, 0.525, 0.506]
AUC = [0.653, 0.656, 0.667, 0.635, 0.672, 0.673, 0.690, 0.705, 0.714, 0.723, 0.727, 0.697, 0.732]
AUC_INVENTED = [0.583, 0.521, 0.569]
PSI_ALERT, AUC_FLOOR = 0.1, 0.60


def box(s, x, y, w, h, color, head, sub=None):
    s.rect(x, y, w, h, color, opacity=0.2, rx=4)
    s.rect(x, y, w, h, None, rx=4, stroke=color, sw=1.5)
    s.text(x + w / 2, y + (15 if sub else h / 2 + 3.5), head, size=10, weight=600, anchor="middle")
    if sub:
        s.text(x + w / 2, y + 28, sub, size=8.5, anchor="middle", opacity=0.9)


def arrow_down(s, x, y0, y1):
    s.line(x, y0, x, y1, w=1.5, opacity=0.75)
    s.poly([(x - 3, y1 - 5), (x, y1), (x + 3, y1 - 5)], "currentColor", w=1.5, opacity=0.75)


def arrow_right(s, x0, x1, y):
    s.line(x0, y, x1, y, w=1.5, opacity=0.75)
    s.poly([(x1 - 5, y - 3), (x1, y), (x1 - 5, y + 3)], "currentColor", w=1.5, opacity=0.75)


def charts():
    out = {}

    # ---- mle13-door: the three outcomes of a request (reveals of units 1 and 2) ----
    s = Svg("mle13-door", "The three outcomes of a request to the churn service, in the order the service decides them",
            "A column of three steps. A request with ten values reaches the door, which checks it with the class ChurnRequest: a region of africa or a field "
            "sessions_14d is refused with status 422, and the model never runs. A valid request next reaches a question, is a model loaded: with no model file the "
            "service answers 503 with model not loaded. Otherwise the model scores the person and the service answers 200 with churn_chance and model_version.")
    title_line = b1.title_line
    title_line(s, "What the service decides, in order", 14, 10)
    box(s, 14, 26, 150, 34, BLUE, "request", "ten values, as JSON")
    arrow_down(s, 89, 60, 80)
    box(s, 14, 80, 150, 34, BLUE, "the door", "ChurnRequest")
    arrow_right(s, 166, 196, 97)
    box(s, 198, 80, 148, 34, PURPLE, "422", "refused, the model never ran")
    arrow_down(s, 89, 114, 134)
    box(s, 14, 134, 150, 34, BLUE, "is a model loaded?", "ready_model")
    arrow_right(s, 166, 196, 151)
    box(s, 198, 134, 148, 34, PURPLE, "503", "model not loaded")
    arrow_down(s, 89, 168, 188)
    box(s, 14, 188, 150, 34, GREEN, "the model scores", "predict_proba")
    arrow_right(s, 166, 196, 205)
    box(s, 198, 188, 148, 34, GREEN, "200", "churn_chance, model_version")
    s.text(14, 246, "not valid, not ready, answered: three different statuses", size=9, opacity=0.85)
    out["mle13-door"] = s.render()

    # ---- mle14-weekly: the largest PSI and the AUC of each week of the replay (units 2 and 3) ----
    s = Svg("mle14-weekly", "The largest PSI and the AUC of each week of the replay, with the alert level and the AUC floor",
            "Two charts over the 13 weeks from March 2 to May 25. The first draws the largest PSI of each week as a bar: 0.007 to 0.010 for the six weeks to April 6, "
            "then 0.278 in the week of April 13 and 0.46 to 0.586 after, with a dashed line at the alert level 0.1. The second draws the AUC of each week as a line: 0.635 to 0.673 "
            "to April 6, then 0.690 to 0.732, with a dashed line at the floor 0.60. For the last three weeks a second line, from the invented outcomes of unit 3, "
            "falls to 0.583, 0.521 and 0.569, under the floor.")
    title_line(s, "Inputs drifted; the quality did not", 12, 10)
    X0, X1 = 44, 336
    step = (X1 - X0) / len(WEEKS)
    cx = lambda k: X0 + step * (k + 0.5)
    # panel 1: PSI
    Y = Axis(0, 0.6, 96, 36)
    s.text(12, 28, "largest PSI of the week", size=9.5, weight=600)
    for v in (0, 0.2, 0.4, 0.6):
        s.line(X0, Y(v), X1, Y(v), opacity=0.5 if v == 0 else 0.13)
        s.text(X0 - 5, Y(v) + 3.5, f"{v:.1f}", size=9, anchor="end", opacity=0.8)
    for k, v in enumerate(PSI):
        s.rect(cx(k) - 7, Y(v), 14, Y(0) - Y(v), PURPLE if v >= PSI_ALERT else BLUE, opacity=0.85)
    s.line(X0, Y(PSI_ALERT), X1, Y(PSI_ALERT), w=1.2, opacity=0.8, dash="4 3")
    s.text(X0 + 3, Y(PSI_ALERT) - 4, "alert 0.1", size=9, opacity=0.9)
    s.text(cx(6), Y(PSI[6]) - 4, f"{PSI[6]}", size=9, weight=600, anchor="middle")
    s.text(cx(10), Y(PSI[10]) - 4, f"{PSI[10]}", size=9, weight=600, anchor="middle")
    # panel 2: AUC
    Y2 = Axis(0.5, 0.75, 212, 132)
    s.text(12, 124, "AUC of the week", size=9.5, weight=600)
    for v in (0.5, 0.6, 0.7):
        s.line(X0, Y2(v), X1, Y2(v), opacity=0.5 if v == 0.5 else 0.13)
        s.text(X0 - 5, Y2(v) + 3.5, f"{v:.1f}", size=9, anchor="end", opacity=0.8)
    s.line(X0, Y2(AUC_FLOOR), X1, Y2(AUC_FLOOR), w=1.2, opacity=0.8, dash="4 3")
    s.text(X0 + 3, Y2(AUC_FLOOR) + 11, "floor 0.60", size=9, opacity=0.9)
    s.poly([(cx(k), Y2(v)) for k, v in enumerate(AUC)], GREEN, w=2)
    for k in (3, 6, 12):
        s.circle(cx(k), Y2(AUC[k]), 3.5, GREEN)
        s.text(cx(k), Y2(AUC[k]) - 7, f"{AUC[k]:.3f}", size=9, weight=600, anchor="middle")
    inv = [(cx(10 + j), Y2(v)) for j, v in enumerate(AUC_INVENTED)]
    s.poly([(cx(9), Y2(AUC[9]))] + inv, PURPLE, w=2)
    for (x, y), v in zip(inv, AUC_INVENTED):
        s.circle(x, y, 3.5, PURPLE)
    s.text(inv[1][0], inv[1][1] + 15, f"{AUC_INVENTED[1]:.3f}", size=9, weight=600, anchor="middle")
    # weeks
    for k in (0, 6, 12):
        s.text(cx(k), 228, WEEKS[k], size=9, anchor="middle", opacity=0.85)
    s.text(cx(6), 240, "campaign starts", size=9, anchor="middle", opacity=0.85)
    s.rect(12, 252, 14, 3, GREEN)
    s.text(31, 257, "real outcomes", size=9.5)
    s.rect(126, 252, 14, 3, PURPLE)
    s.text(145, 257, "invented outcomes (unit 3)", size=9.5)
    out["mle14-weekly"] = s.render()
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


NEEDED = {
    "mle13-door": ["422", "503", "200", "model not loaded", "literal_error"],
    "mle14-weekly": ["0.278", "0.586", "0.635", "0.732", "0.583", "0.521", "0.569", "alert level, 0.1"],
}


def paste(result, check=False):
    texts = {k: v.read_text(encoding="utf-8") for k, v in LESSONS.items() if v.exists()}
    bad = []
    for name, svg in result.items():
        key = name.split("-")[0]
        text = texts[key]
        marker = "{/* CHART: " + name + " */}"
        old = re.search(r'<figure>\n<svg [^\n]*aria-labelledby="' + re.escape(name) + r'-t [^\n]*\n.*?</figure>', text, re.S)
        if check:
            missing = [n for n in NEEDED[name] if n not in text]
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
    result = charts()
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
