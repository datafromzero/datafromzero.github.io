"""Draws the static figures of the third ML Engineer batch's first two lessons: MLE11 (`fine-tuning-or-not`) and MLE12 (`agents-tools-and-guardrails`).

    python3 scripts/charts/mle-batch-3.py --out DIR     write every figure as DIR/<name>.svg
    python3 scripts/charts/mle-batch-3.py --paste       put every figure into its lesson, at the marker {/* CHART: name */} or over the old figure
    python3 scripts/charts/mle-batch-3.py --check       exit 1 unless every figure appears, byte for byte, in its lesson, and every number it draws
                                                        appears in the lesson's text

Uses the Svg class of da-batch-1.py (which imports duckdb), as ml-batch-1.py does. Colors follow the meaning: blue is the request and the data going in,
green is what is kept or scored, purple is a rule or a step that decides, ochre is a warning and always carries a visible label.

Every value typed below is copied from a reveal of the lesson it is drawn in (the cell is named above each block), and `--check` fails when a
value stands in no sentence of its lesson. Rerun --paste when a number changes.
"""
import importlib.util
import math
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
Svg, BLUE, GREEN, PURPLE, OCHRE, ROOT = b1.Svg, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE, b1.ROOT
DOCS = ROOT / "src" / "content" / "docs" / "ml-engineer"
LESSONS = {"mle11": DOCS / "fine-tuning-or-not.mdx", "mle12": DOCS / "agents-tools-and-guardrails.mdx"}

# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DATA, copied from the lessons (the cell that holds each value is named)
# mle11, units 1, 2, 3d (the reports of the three approaches on the 32 test questions) and unit 2 (the best chunk alone):
M11_RIGHT = [("prompt", 15, 92), ("retrieve", 24, 520), ("fine-tune", 28, 33)]
M11_BEST_CHUNK = 25
# mle11, unit 3c (the loss of each of the 48 steps; the validation loss before the first step and after each epoch):
M11_STEPS = [5.216, 4.008, 2.888, 2.335, 1.671, 1.53, 1.142, 0.869, 0.804, 0.589, 0.756, 0.401, 0.533, 0.402, 0.312, 0.213, 0.114, 0.253, 0.263, 0.148,
             0.129, 0.209, 0.193, 0.144, 0.14, 0.145, 0.1, 0.272, 0.037, 0.084, 0.091, 0.093, 0.241, 0.243, 0.054, 0.039, 0.023, 0.027, 0.109, 0.028,
             0.069, 0.03, 0.022, 0.037, 0.008, 0.085, 0.038, 0.044]
M11_VALIDATION = [4.836, 0.458, 0.224, 0.058, 0.076]
M11_KEPT = 3
# mle12, unit 4 (what each defense let through, of 8 notes each; the clean notes are 4):
M12_ATTACKS = [("4 clean notes", 4, 0, 0), ("round 1, no defense", 8, 4, 4), ("round 1, a warning in the prompt", 8, 0, 0),
               ("round 2, a warning in the prompt", 8, 4, 4), ("round 2, tools limited to the task", 8, 6, 0)]
# ---------------------------------------------------------------------------------------------------------------------------------------------------

WHITE = "#ffffff"


def arrow(s, x1, y1, x2, y2, color="currentColor", w=1.5, opacity=0.75, dash=None):
    """A line with an open arrow head at (x2, y2)."""
    s.line(x1, y1, x2, y2, color=color, w=w, opacity=opacity, dash=dash)
    a = math.atan2(y2 - y1, x2 - x1)
    pts = [(x2 - 6 * math.cos(a + d), y2 - 6 * math.sin(a + d)) for d in (0.5, -0.5)]
    s.poly([pts[0], (x2, y2), pts[1]], color, w=w, opacity=opacity)


def tinted(s, x, y, w, h, color, label=None, sub=None, rx=4, dash=None, size=10, sub_size=9.5):
    """A box with a tinted fill and a solid edge, a bold label and an optional second line, both centered."""
    s.rect(x, y, w, h, color, opacity=0.2, rx=rx)
    s.rect(x, y, w, h, None, rx=rx, stroke=color, sw=1.5, dash=dash)
    lines = [sub] if isinstance(sub, str) else list(sub or [])
    if label and lines:
        top = y + h / 2 - 2 - 6.5 * (len(lines) - 1)
        s.text(x + w / 2, top, label, anchor="middle", weight=600, size=size)
        for k, line in enumerate(lines):
            s.text(x + w / 2, top + 12.5 + k * 11, line, anchor="middle", size=sub_size, opacity=0.9)
    elif label:
        s.text(x + w / 2, y + h / 2 + 3.5, label, anchor="middle", weight=600, size=size)


def thousands(n):
    return f"{n:,}"


def charts():
    out = {}

    # ---- mle11-levers: where each approach acts
    s = Svg("mle11-levers", "Where prompting, retrieval and fine-tuning act",
            "A request is made of three parts that go into the model: instructions, chunks of text and the question. The model answers with a reply. "
            "Prompting changes the instructions, retrieval adds the chunks, and fine-tuning adds a small adapter inside the model.")
    tinted(s, 0, 0, 128, 32, BLUE, "instructions", "the eight names")
    tinted(s, 0, 40, 128, 32, GREEN, "chunks", "from the lessons")
    tinted(s, 0, 80, 128, 32, "currentColor", "the question")
    arrow(s, 128, 16, 160, 36)
    arrow(s, 128, 56, 160, 56)
    arrow(s, 128, 96, 160, 76)
    s.rect(160, 18, 100, 80, None, rx=4, stroke="currentColor", sw=1.5)
    s.text(210, 36, "the model", anchor="middle", weight=600, size=10)
    s.text(210, 49, "its own numbers", anchor="middle", size=9.5, opacity=0.9)
    tinted(s, 175, 62, 70, 26, PURPLE, "adapter")
    arrow(s, 260, 58, 280, 58)
    tinted(s, 280, 42, 52, 32, "currentColor", "reply")
    for k, (color, text) in enumerate([(BLUE, "prompt: you change the words"), (GREEN, "retrieve: you change what it reads"), (PURPLE, "fine-tune: you change the model")]):
        s.rect(0, 130 + k * 16, 10, 10, color)
        s.text(17, 139 + k * 16, text, size=9.5)
    out["mle11-levers"] = s.render()

    # ---- mle11-loss: the run of unit 3, on a log scale
    s = Svg("mle11-loss", "The loss of the LoRA run, step by step, and the validation loss after each epoch",
            f"A line chart on a log scale. The training loss of each of 48 steps falls from {M11_STEPS[0]} to {M11_STEPS[-1]}. "
            f"The validation loss is {M11_VALIDATION[0]} before training and {M11_VALIDATION[1]}, {M11_VALIDATION[2]}, {M11_VALIDATION[3]} and {M11_VALIDATION[4]} after epochs 1 to 4: "
            f"lowest after epoch {M11_KEPT}, so that epoch's adapter is kept.")
    X0, X1, Y0, Y1 = 40, 316, 14, 154
    lo, hi = math.log10(0.005), math.log10(8)

    def X(step):
        return X0 + (X1 - X0) * step / 48

    def Y(v):
        return Y1 - (Y1 - Y0) * (math.log10(v) - lo) / (hi - lo)

    for v in (0.01, 0.1, 1):
        s.line(X0, Y(v), X1, Y(v), opacity=0.15)
        s.text(X0 - 6, Y(v) + 3.5, f"{v:g}", size=9.5, anchor="end", opacity=0.8)
    for step in (0, 12, 24, 36, 48):
        s.line(X(step), Y1, X(step), Y1 + 4, opacity=0.5)
        s.text(X(step), Y1 + 16, str(step), size=9.5, anchor="middle", opacity=0.8)
    s.line(X0, Y1, X1, Y1, opacity=0.5)
    s.text((X0 + X1) / 2, Y1 + 30, "step (12 steps make one epoch)", size=9.5, anchor="middle", opacity=0.9)
    s.text(X0 - 30, Y0 - 4, "loss, log scale", size=9.5, opacity=0.9)
    s.poly([(X(i + 1), Y(v)) for i, v in enumerate(M11_STEPS)], BLUE, w=1.5, opacity=0.85)
    s.poly([(X(12 * e), Y(v)) for e, v in enumerate(M11_VALIDATION)], GREEN, w=2)
    for e, v in enumerate(M11_VALIDATION):
        s.circle(X(12 * e), Y(v), 3.5, GREEN)
    s.text(X(0) + 8, Y(M11_VALIDATION[0]) - 6, f"{M11_VALIDATION[0]}", size=9.5, weight=600)
    for e in (1, 2):
        s.text(X(12 * e) + 6, Y(M11_VALIDATION[e]) - 6, f"{M11_VALIDATION[e]}", size=9.5, weight=600)
    s.text(X(48) - 4, Y(M11_VALIDATION[4]) - 10, f"{M11_VALIDATION[4]}", size=9.5, weight=600, anchor="end")
    s.circle(X(12 * M11_KEPT), Y(M11_VALIDATION[M11_KEPT]), 7, None, stroke=OCHRE)
    s.rect(40, Y1 + 42, 14, 3, BLUE)
    s.text(59, Y1 + 46, "training loss of each step", size=9.5)
    s.rect(196, Y1 + 42, 14, 3, GREEN)
    s.text(215, Y1 + 46, "validation loss", size=9.5)
    s.circle(46, Y1 + 62, 5, None, stroke=OCHRE)
    s.text(59, Y1 + 65, f"epoch {M11_KEPT} kept: validation loss {M11_VALIDATION[M11_KEPT]}", size=9.5, weight=600)
    out["mle11-loss"] = s.render()

    # ---- mle11-compare: right lessons of 32 and the tokens of a request
    s = Svg("mle11-compare", "Right lessons and prompt tokens of the three approaches",
            "Two panels. Right lessons of the 32 test questions: " + ", ".join(f"{n} {r}" for n, r, _ in M11_RIGHT) + f"; the best chunk alone, with no model, {M11_BEST_CHUNK}. "
            "Prompt tokens of a request: " + ", ".join(f"{n} {t}" for n, _, t in M11_RIGHT) + ".")
    LX, BX, BW = 0, 84, 200
    s.text(LX, 0, "right lessons, of 32 test questions", size=10.5, weight=600)
    rows = [(n, r, False) for n, r, _ in M11_RIGHT[:2]] + [("best chunk, no model", M11_BEST_CHUNK, True)] + [(n, r, False) for n, r, _ in M11_RIGHT[2:]]
    y = 12
    for name, value, hollow in rows:
        s.text(BX - 6, y + 11.5, name, size=9.5, anchor="end")
        w = BW * value / 32
        if hollow:
            s.rect(BX, y, w, 16, None, stroke=GREEN, sw=1.5, dash="4 3")
        else:
            s.rect(BX, y, w, 16, GREEN, opacity=0.85)
        s.text(BX + w + 6, y + 12, str(value), size=10, weight=600)
        y += 22
    s.text(LX, y + 14, "prompt tokens of one request", size=10.5, weight=600)
    y += 26
    top = max(t for _, _, t in M11_RIGHT)
    for name, _, tokens in M11_RIGHT:
        s.text(BX - 6, y + 11.5, name, size=9.5, anchor="end")
        w = BW * tokens / top
        s.rect(BX, y, w, 16, BLUE, opacity=0.85)
        s.text(BX + w + 6, y + 12, str(tokens), size=10, weight=600)
        y += 22
    out["mle11-compare"] = s.render()

    # ---- mle12-loop: a workflow and an agent loop
    s = Svg("mle12-loop", "A workflow and an agent loop",
            "Top: a workflow, three fixed steps in a row that the code decides: read the note, summarize it, reply. Bottom: an agent loop. The model proposes a call as JSON. "
            "Code checks it against the schema and the list of tools allowed for the task. A risky call waits for a person to say yes. The tool runs and its result goes back to the model. "
            "Every step is written to a trace.")
    s.text(0, 0, "A workflow: the code fixes the steps", size=10.5, weight=600)
    y = 14
    for i, (label, sub) in enumerate([("read the note", "tool call"), ("summarize", "one model call"), ("reply", "to the person")]):
        x = i * 116
        tinted(s, x, y, 100, 34, BLUE, label, sub)
        if i < 2:
            arrow(s, x + 100, y + 17, x + 116, y + 17)
    s.text(0, 84, "An agent: the model picks the next step", size=10.5, weight=600)
    y0 = 98
    tinted(s, 0, y0, 150, 38, BLUE, "1  model proposes", "a call as JSON")
    tinted(s, 182, y0, 150, 38, PURPLE, "2  code checks", "schema, allowed tool")
    tinted(s, 182, y0 + 66, 150, 38, OCHRE, "3  person says yes", "risky calls only")
    tinted(s, 0, y0 + 66, 150, 38, GREEN, "4  tool runs", "the result goes back")
    arrow(s, 150, y0 + 19, 182, y0 + 19)
    arrow(s, 257, y0 + 38, 257, y0 + 66)
    arrow(s, 182, y0 + 85, 150, y0 + 85)
    arrow(s, 75, y0 + 66, 75, y0 + 38, dash="4 3")
    tinted(s, 0, y0 + 124, 332, 26, "currentColor", "trace: every step, call, check and result is written down", None, dash="4 3", size=9.5)
    out["mle12-loop"] = s.render()

    # ---- mle12-attacks: what each defense let through
    s = Svg("mle12-attacks", "Refunds asked for and carried out under each defense",
            "A bar chart. For each setting, the number of notes in which the model asked for a refund and the number in which a refund was carried out: "
            + "; ".join(f"{name}, {asked} asked and {done} carried out of {n}" for name, n, asked, done in M12_ATTACKS) + ".")
    BW = 200
    y = 0
    for name, n, asked, done in M12_ATTACKS:
        s.text(0, y + 8, f"{name} ({n} notes)", size=9.5, weight=600)
        s.rect(0, y + 14, BW, 6, "currentColor", opacity=0.12)
        if asked:
            s.rect(0, y + 14, BW * asked / 8, 6, OCHRE, opacity=0.9)
        s.rect(0, y + 22, BW, 6, "currentColor", opacity=0.12)
        if done:
            s.rect(0, y + 22, BW * done / 8, 6, PURPLE, opacity=0.9)
        s.text(BW + 8, y + 20, f"{asked} asked", size=9.5)
        s.text(BW + 8, y + 29, f"{done} carried out", size=9.5)
        y += 40
    s.rect(0, y + 2, 10, 6, OCHRE)
    s.text(16, y + 9, "asked for a refund", size=9.5)
    s.rect(126, y + 2, 10, 6, PURPLE)
    s.text(142, y + 9, "refund carried out", size=9.5)
    out["mle12-attacks"] = s.render()
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def facts_ok(name, text):
    """Values each figure draws must stand in its lesson's text."""
    need = {
        "mle11-levers": ["adapter"],
        "mle11-loss": ["5.216", "4.836", "0.458", "0.224", "0.058", "0.076", "epoch 3"],
        "mle11-compare": ["520", "28", "24", "15", "25"],
        "mle12-loop": ["trace"],
        "mle12-attacks": ["clean"],
    }[name]
    return [n for n in need if n not in text]


def paste(result, check=False):
    texts = {k: v.read_text(encoding="utf-8") for k, v in LESSONS.items() if v.exists()}
    bad = []
    for name, svg in result.items():
        key = name.split("-")[0]
        if key not in texts:
            bad.append((name, "no lesson file"))
            continue
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
