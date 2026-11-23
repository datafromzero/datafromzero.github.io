"""Draws the static charts of Data Analyst lessons 16 and 17 (take-home-simulation, portfolio-case-study) from the cafe-sales data.

    python3 scripts/charts/da-batch-4.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/da-batch-4.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/da-batch-4.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Needs duckdb (2.0.0 for every number in the lessons). Same pipeline as da-batch-1.py to da-batch-3.py (it imports the Svg class, the text widths and the
figure colors of da-batch-1.py): plain SVG with currentColor text, the figure color roles of the site (blue, green, purple, ochre, in that fixed order), a title
and a desc, each tag on its own line, every drawing centered in its viewBox. Colors follow the entity, never the rank: the same cafe has the same color in every
chart. Ochre is below 3:1 on the light surface, so every ochre mark carries a visible label. Bars start at zero, one axis per chart, thin marks, direct labels.
The dirty file of Part B is built in memory by scripts/build-take-home-extract.py, so the chart does not depend on the published copy. Order 2075 (line 6952)
is counted as 2 units unless a label says "as typed". Rerun --paste when a number changes.
"""
import importlib.util
import re
import sys
import tempfile
from pathlib import Path

import duckdb

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


b1 = load("da_batch_1", HERE / "da-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, OCHRE, ROOT = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE, b1.ROOT
extract = load("take_home_extract", HERE.parent / "build-take-home-extract.py")
DOCS = ROOT / "src" / "content" / "docs" / "data-analyst"
LESSONS = {"da16": DOCS / "take-home-simulation.mdx", "da17": DOCS / "portfolio-case-study.mdx"}
STORE_COLOR = {"Old Town": BLUE, "Campus": GREEN, "Harbor": PURPLE}


def money(v):
    return f"{v:,.2f}"


def q(con, sql):
    return con.execute(sql).fetchall()


def cafe():
    con = duckdb.connect()
    con.execute((b1.CAFE / "cafe-sales.sql").read_text())
    con.execute("""CREATE VIEW sales_clean AS
        SELECT o.order_id, o.ordered_at, CAST(o.ordered_at AS DATE) AS order_date, s.store_name AS store,
               (CASE WHEN oi.order_item_id = 6952 THEN 2 ELSE oi.quantity END) * p.unit_price_usd - oi.discount_usd AS amount
        FROM orders o JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON p.product_id = oi.product_id
        JOIN stores s ON s.store_id = o.store_id WHERE o.status = 'completed'""")
    return con


def dirty():
    con = duckdb.connect()
    with tempfile.TemporaryDirectory() as folder:
        path = Path(folder) / "take_home_export.csv"
        path.write_text(extract.render(extract.build()), encoding="utf-8", newline="")
        con.execute(f"CREATE TABLE export_raw AS SELECT * FROM read_csv('{path}')")
    return con


def charts():
    out = {}

    # ---- da16, chart 1: the 90 minutes, as a plan (a Gantt of the six steps) ----
    steps = [("Part A: five SQL questions", 0, 30, BLUE), ("Part B: scope note", 30, 5, GREEN), ("Part B: clean and log", 35, 25, GREEN),
             ("Part B: answer and numbers", 60, 10, GREEN), ("Part B: write the page", 70, 15, GREEN), ("Score yourself", 85, 5, OCHRE)]
    assert sum(d for _, _, d, _ in steps) == 90 and all(steps[i][1] + steps[i][2] == steps[i + 1][1] for i in range(5))
    s = Svg("da16-plan", "The 90 minutes of the simulation, step by step",
            "A horizontal timeline from 0 to 90 minutes with six bars, one after another. Part A, five SQL questions, minutes 0 to 30, in blue. Part B in green: scope note, minutes 30 to 35; "
            "clean and log, 35 to 60; answer and numbers, 60 to 70; write the page, 70 to 85. Then score yourself, minutes 85 to 90, in ochre.")
    X = Axis(0, 90, 152, 306)
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
        if start + dur >= 85:
            s.text(X(start) - 6, y + 12, txt, anchor="end", size=9.5, weight=600)
        else:
            s.text(X(start + dur) + 6, y + 12, txt, size=9.5, weight=600)
        y += 24
    out["da16-plan"] = s.render()

    # ---- da16, chart 2: the dirty file read as it is, and cleaned (net sales by cafe, April 1 to June 30) ----
    d = dirty()
    naive = dict(q(d, "SELECT store, ROUND(SUM(line_total), 2) FROM export_raw WHERE store IS NOT NULL GROUP BY 1"))
    total_row = q(d, "SELECT line_total FROM export_raw WHERE product = 'TOTAL'")[0][0]
    d.execute("""CREATE VIEW export_clean AS
        SELECT store_code, CASE WHEN line_id = 6952 THEN 2 ELSE quantity END AS quantity, CAST(unit_price AS DECIMAL(10, 2)) AS unit_price, CAST(discount AS DECIMAL(10, 2)) AS discount
        FROM export_raw WHERE product <> 'TOTAL'
        QUALIFY ROW_NUMBER() OVER (PARTITION BY order_id, product, quantity, discount ORDER BY line_id) = 1""")
    names = {"S1": "Old Town", "S2": "Campus", "S3": "Harbor"}
    clean = {names[code]: float(v) for code, v in q(d, "SELECT store_code, SUM(quantity * unit_price - discount) FROM export_clean GROUP BY 1")}
    assert naive == {"Old Town": 4868.0, "Campus": 4542.5, "Harbor": 3149.0, "Harbor Wharf": 1466.75} and total_row == 14026.25, naive
    assert clean == {"Old Town": 4647.5, "Campus": 4512.0, "Harbor": 4599.75}, clean
    spread = (max(clean.values()) / min(clean.values()) - 1) * 100
    assert round(spread, 1) == 3.0
    s = Svg("da16-flip", "Net sales by cafe, April 1 to June 30: the file as it reads, and cleaned",
            "Two groups of horizontal bars from zero, in dollars. First, the file grouped by the store name it holds: Old Town 4,868.00, Campus 4,542.50, Harbor 3,149.00 and Harbor Wharf 1,466.75, "
            "so Harbor looks last and a fifth row, TOTAL, holds 14,026.25 and is not drawn. Second, cleaned and grouped by store code: Old Town 4,647.50, Harbor 4,599.75 and Campus 4,512.00. "
            "Cleaned, Harbor is second, 47.75 dollars behind Old Town, and the three cafes are within 3.0 percent of each other.")
    X = Axis(0, 5000, 84, 262)
    s.text(8, 10, "Net sales, April 1 to June 30 (dollars)", size=10.5, weight=600)
    s.text(8, 34, "The file, grouped by the store name it holds", size=9.5, weight=600)
    y = 44
    rows = [("Old Town", naive["Old Town"], BLUE, 1), ("Campus", naive["Campus"], GREEN, 1), ("Harbor", naive["Harbor"], PURPLE, 1), ("Harbor Wharf", naive["Harbor Wharf"], PURPLE, 0.5)]
    for name, v, col, op in rows:
        s.text(8, y + 12, name, size=9.5)
        s.rect(X(0), y, X(v) - X(0), 16, col, opacity=op, rx=2.5)
        s.text(X(v) + 6, y + 12, money(v), size=9.5, weight=600)
        y += 22
    s.text(8, y + 8, f"A TOTAL row of {money(total_row)} is a fifth group, not drawn", size=9, opacity=0.85)
    y += 34
    s.text(8, y, "Cleaned, grouped by store code", size=9.5, weight=600)
    y += 10
    for name in ("Old Town", "Harbor", "Campus"):
        v = clean[name]
        s.text(8, y + 12, name, size=9.5)
        s.rect(X(0), y, X(v) - X(0), 16, STORE_COLOR[name], rx=2.5)
        s.text(X(v) + 6, y + 12, money(v), size=9.5, weight=600)
        y += 22
    s.text(8, y + 8, "Duplicates removed, refunds kept, order 2075 counted as 2 units", size=9, opacity=0.85)
    out["da16-flip"] = s.render()

    # ---- da17, chart 3: the two-minute scan (a page and the clock that reads it) ----
    s = Svg("da17-scan", "A case study page and what a reader takes from it in two minutes",
            "A page drawn as five stacked blocks with a clock beside it. At 0:00 the reader meets the problem, one sentence. At 0:15 the answer, two sentences. At 0:40 one chart for each claim "
            "and three numbers. At 1:20 one limit. At 1:45 the next step. At 2:00 the reader stops and must be able to say the problem, the answer, one limit and the next step.")
    s.text(8, 10, "What a reader takes from your page in two minutes", size=10.5, weight=600)
    blocks = [("Problem", "one sentence", 32, 32, "0:00"), ("Answer", "two sentences", 70, 36, "0:15"), ("Chart and numbers", "one chart per claim", 112, 72, "0:40"),
              ("Limits", "what the data cannot say", 190, 32, "1:20"), ("Next step", "one action", 228, 32, "1:45")]
    px0, px1 = 8, 196
    s.rect(px0 - 4, 24, px1 - px0 + 8, 242, None, stroke="currentColor", sw=1, rx=6)
    s.line(214, 46, 214, 270, opacity=0.35, dash="2 3")
    for name, hint, y0, h, clock in blocks:
        s.rect(px0, y0, px1 - px0, h, GREEN if name != "Chart and numbers" else BLUE, opacity=0.14, rx=4)
        s.rect(px0, y0, 3, h, GREEN if name != "Chart and numbers" else BLUE, rx=1)
        s.text(px0 + 12, y0 + 14, name, size=9.5, weight=600)
        s.text(px0 + 12, y0 + 26, hint, size=9, opacity=0.85)
        s.circle(214, y0 + 14, 4, GREEN)
        s.text(224, y0 + 17.5, clock, size=9.5, weight=600)
    s.rect(px0 + 12, 146, 74, 32, None, stroke="currentColor", sw=1, rx=3)
    s.text(px0 + 49, 166, "chart", anchor="middle", size=9, opacity=0.85)
    s.text(px0 + 96, 159, "3 numbers,", size=9, opacity=0.85)
    s.text(px0 + 96, 171, "with units", size=9, opacity=0.85)
    s.circle(214, 270, 4, OCHRE)
    s.text(224, 273.5, "2:00 stop, say the four", size=9.5, weight=600)
    out["da17-scan"] = s.render()

    # ---- da17, chart 4: two claims of the model case study, one chart each ----
    c = cafe()
    per_day = {st: (days, float(net)) for st, days, net in q(c, "SELECT store, COUNT(DISTINCT order_date), SUM(amount) FROM sales_clean GROUP BY 1")}
    seven = {st: n for st, n in q(c, "SELECT store, COUNT(DISTINCT order_id) FROM sales_clean WHERE EXTRACT(hour FROM ordered_at) = 7 GROUP BY 1")}
    assert per_day == {"Campus": (181, 8998.75), "Harbor": (91, 4606.25), "Old Town": (181, 8977.75)} and seven == {"Campus": 79, "Harbor": 20, "Old Town": 73}, (per_day, seven)
    rate = {st: round(net / days, 2) for st, (days, net) in per_day.items()}
    seven_rate = {st: round(seven[st] / per_day[st][0], 2) for st in per_day}
    assert rate == {"Campus": 49.72, "Harbor": 50.62, "Old Town": 49.6} and seven_rate == {"Campus": 0.44, "Harbor": 0.22, "Old Town": 0.4}, (rate, seven_rate)
    s = Svg("da17-claims", "Two claims, one chart each: net sales per open day, and orders at 7 a.m. per open day",
            "Two small bar charts from zero, one cafe per bar. Net sales per open day in dollars: Harbor 50.62 over 91 open days, Campus 49.72 and Old Town 49.60 over 181 open days each; the three are level. "
            "Orders at 7 a.m. per open day: Campus 0.44 (79 orders), Old Town 0.40 (73 orders) and Harbor 0.22 (20 orders), about half of each older cafe. Completed orders, January 1 to June 30, 2026, order 2075 counted as 2 units.")
    s.text(8, 10, "Claim 1: Harbor sells as much per open day", size=10, weight=600)
    X1 = Axis(0, 60, 80, 232)
    y = 22
    for st in ("Harbor", "Campus", "Old Town"):
        days, net = per_day[st]
        s.text(8, y + 12, st, size=9.5)
        s.rect(X1(0), y, X1(rate[st]) - X1(0), 16, STORE_COLOR[st], rx=2.5)
        s.text(X1(rate[st]) + 6, y + 12, f"{rate[st]:.2f} · {days} days", size=9.5, weight=600)
        y += 22
    s.text(8, y + 8, "Net sales divided by days with orders, in dollars", size=9, opacity=0.85)
    y += 34
    s.text(8, y, "Claim 2: its 7 a.m. hour is the thin one", size=10, weight=600)
    y += 12
    X2 = Axis(0, 0.5, 80, 232)
    for st in ("Campus", "Old Town", "Harbor"):
        s.text(8, y + 12, st, size=9.5)
        s.rect(X2(0), y, X2(seven_rate[st]) - X2(0), 16, STORE_COLOR[st], rx=2.5)
        s.text(X2(seven_rate[st]) + 6, y + 12, f"{seven_rate[st]:.2f} · {seven[st]} orders", size=9.5, weight=600)
        y += 22
    s.text(8, y + 8, "Orders placed at 7 a.m. divided by days with orders", size=9, opacity=0.85)
    out["da17-claims"] = s.render()
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def paste(result, check=False):
    texts = {k: v.read_text() for k, v in LESSONS.items() if v.exists()}
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
            LESSONS[k].write_text(v)
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
