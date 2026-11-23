"""Draws the static charts of Data Analyst lessons 11 to 15 (metrics-and-kpi-dictionary, keeping-a-dashboard-right, presenting-findings,
case-interview-practice, ai-assisted-analysis) from the cafe-sales data.

    python3 scripts/charts/da-batch-3.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/da-batch-3.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/da-batch-3.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Needs duckdb (2.0.0 for every number in the lessons). Same pipeline as da-batch-1.py and da-batch-2.py (it imports the Svg class, the text widths and the
figure colors of da-batch-1.py): plain SVG with currentColor text, the figure color roles of the site (blue, green, purple, ochre, in that fixed order),
a title and a desc, each tag on its own line, every drawing centered in its viewBox. Colors follow the entity, never the rank: the same cafe or rule has the
same color in every chart of a lesson. Ochre is below 3:1 on the light surface, so every ochre mark carries a visible label. One axis per chart, thin marks,
direct labels, no legend box for one or two series (the labels sit on the marks). Every number comes from a DuckDB query on datasets/cafe-sales/v1 run here,
with order 2075 counted as 2 units (line 6952) unless a label says "as typed". Rerun --paste when a number changes.
"""
import importlib.util
import re
import sys
from pathlib import Path

import duckdb

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("da_batch_1", HERE / "da-batch-1.py")
b1 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b1)
Svg, Axis, esc, r1 = b1.Svg, b1.Axis, b1.esc, b1.r1
BLUE, GREEN, PURPLE, OCHRE = b1.BLUE, b1.GREEN, b1.PURPLE, b1.OCHRE
ROOT = b1.ROOT
DOCS = ROOT / "src" / "content" / "docs" / "data-analyst"
LESSONS = {
    "da11": DOCS / "metrics-and-kpi-dictionary.mdx",
    "da12": DOCS / "keeping-a-dashboard-right.mdx",
    "da13": DOCS / "presenting-findings.mdx",
    "da14": DOCS / "case-interview-practice.mdx",
    "da15": DOCS / "ai-assisted-analysis.mdx",
}
STORE_COLOR = {"Old Town": BLUE, "Campus": GREEN, "Harbor": PURPLE}


def money(v, cents=True):
    return f"${v:,.2f}" if cents else f"${v:,.0f}"


def cafe():
    con = duckdb.connect()
    con.execute((b1.CAFE / "cafe-sales.sql").read_text())
    con.execute("""CREATE VIEW lines AS
        SELECT o.order_id, o.status, s.store_name AS store, o.ordered_at, CAST(o.ordered_at AS DATE) AS order_date, strftime(o.ordered_at, '%Y-%m') AS month,
               p.category, oi.order_item_id,
               oi.quantity AS quantity_recorded, CASE WHEN oi.order_item_id = 6952 THEN 2 ELSE oi.quantity END AS quantity,
               p.unit_price_usd AS unit_price, oi.discount_usd AS discount
        FROM orders o JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON p.product_id = oi.product_id JOIN stores s ON s.store_id = o.store_id""")
    return con


def title_line(s, text, x, y):
    s.text(x, y, text, size=10.5, weight=600)


def q(con, sql):
    return con.execute(sql).fetchall()


def charts():
    out = {}
    c = cafe()

    # ---- da11, chart 1: which cafe sold more, under three readings of "revenue" (lead of the first cafe over the second) ----
    gross = dict(q(c, "SELECT store, SUM(quantity * unit_price) FROM lines GROUP BY store"))
    net = dict(q(c, "SELECT store, SUM(quantity * unit_price - discount) FROM lines WHERE status = 'completed' GROUP BY store"))
    rec = dict(q(c, "SELECT store, SUM(quantity_recorded * unit_price - discount) FROM lines WHERE status = 'completed' GROUP BY store"))
    leads = [("Gross sales rule, order 2075 as 2 units", float(gross["Campus"] - gross["Old Town"])),
             ("Net sales rule, order 2075 as 2 units", float(net["Campus"] - net["Old Town"])),
             ("Net sales rule, order 2075 as typed", float(rec["Campus"] - rec["Old Town"]))]
    assert [round(v, 2) for _, v in leads] == [4.5, 21.0, -145.5], leads
    s = Svg("da11-moves", "Which cafe sold more depends on the rule and on one typed line",
            "A bar chart around a center line at zero. Bars to the left mean Campus sold more than Old Town, bars to the right mean Old Town sold more. "
            + " ".join(f"{lab}: {'Campus' if v > 0 else 'Old Town'} by {money(abs(v))}." for lab, v in leads)
            + " The first two rules keep Campus ahead with a lead of 4.50 and 21.00 dollars; counting order 2075 as typed, 20 sandwiches, puts Old Town ahead by 145.50 dollars.")
    X = Axis(-190, 190, 18, 318)
    title_line(s, "Which cafe sold more depends on the rule", 8, 10)
    s.text(X(-6), 32, "Campus ahead", anchor="end", size=9.5, weight=600)
    s.text(X(6), 32, "Old Town ahead", size=9.5, weight=600)
    y = 52
    for lab, v in leads:
        s.text(8, y, lab, size=9.5)
        s.line(X(0), y + 4, X(0), y + 26, opacity=0.6)
        col = GREEN if v > 0 else BLUE
        x0, x1 = sorted((X(0), X(-v)))
        s.rect(x0, y + 6, max(x1 - x0, 2), 16, col, rx=3)
        txt = money(abs(v))
        if v > 0:
            s.text(X(-v) - 6, y + 18, txt, anchor="end", weight=600)
        else:
            s.text(X(-v) + 6, y + 18, txt, weight=600)
        y += 46
    s.text(8, y + 8, "Completed orders for the net rule; the gross rule counts all orders", size=9, opacity=0.85)
    out["da11-moves"] = s.render()

    # ---- da11, chart 2: the cell-by-cell test: gap between the accountant's sheet and the layer, by cafe-month ----
    cells = q(c, """SELECT store, month,
        SUM(quantity * unit_price - discount) FILTER (WHERE status = 'completed') AS net,
        SUM(quantity * unit_price) AS gross
        FROM lines GROUP BY store, month ORDER BY store, month""")
    assert len(cells) == 15
    gaps = [(st, m, float(g - n)) for st, m, n, g in cells]
    order = {"Old Town": 0, "Campus": 1, "Harbor": 2}
    gaps.sort(key=lambda t: (order[t[0]], t[1]))
    lo = min(gaps, key=lambda t: t[2])
    hi = max(gaps, key=lambda t: t[2])
    marked = {(g[0], g[1]) for g in gaps if g[2] in (lo[2], hi[2])}
    MON = {"01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun"}
    s = Svg("da11-cells", "The accountant's sheet against the layer, cafe-month by cafe-month, under each rule",
            "Fifteen rows, one for each cafe and month, on a scale from 0 to 14 dollars: the difference between the accountant's sheet and the layer. Under the net sales rule every dot sits at 0.00. "
            f"Under the gross sales rule every dot is above zero, from {money(lo[2])} (the smallest, in {", ".join(f"{g[0]} {MON[g[1][5:]]}" for g in gaps if g[2] == lo[2])}) to {money(hi[2])} ({hi[0]}, {MON[hi[1][5:]]}). "
            "All 15 cells differ under the gross rule and none under the net rule.")
    X = Axis(0, 14, 88, 318)
    title_line(s, "Sheet minus layer, in dollars, for each cafe-month", 8, 10)
    s.circle(100, 29, 4, BLUE)
    s.text(108, 32, "net sales rule", size=9.5)
    s.circle(196, 29, 4, OCHRE)
    s.text(204, 32, "gross sales rule", size=9.5)
    y = 50
    for t in (0, 5, 10):
        s.line(X(t), y - 6, X(t), y + 15 * 15 + 6, opacity=0.12)
        s.text(X(t), y + 15 * 15 + 18, f"{t}", anchor="middle", size=9, opacity=0.8)
    prev = None
    for st, m, g in gaps:
        if prev and prev != st:
            y += 5
        prev = st
        s.text(8, y + 4, f"{st} {MON[m[5:]]}", size=9.5)
        s.line(X(0), y, X(g), y, color="currentColor", w=1, opacity=0.35)
        s.circle(X(0), y, 4, BLUE)
        s.circle(X(g), y, 4, OCHRE)
        if (st, m) in marked:
            s.text(X(g) + 8, y + 3.5, money(g), weight=600, size=9.5)
        y += 15
    s.text(8, y + 34, "A dot at zero means the two dashboards agree to the cent", size=9, opacity=0.85)
    out["da11-cells"] = s.render()

    # ---- da12: the four loads of the lesson (failures made by SQL from the source lines) ----
    c.execute("""CREATE TABLE source_lines AS
        SELECT oi.order_item_id AS line_id, o.order_id, s.store_name AS store, o.ordered_at,
               (CASE WHEN oi.order_item_id = 6952 THEN 2 ELSE oi.quantity END) * p.unit_price_usd - oi.discount_usd AS amount
        FROM orders o JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON p.product_id = oi.product_id
        JOIN stores s ON s.store_id = o.store_id WHERE o.status = 'completed'""")
    c.execute("""CREATE TABLE loads AS
        SELECT 'ok' AS load_name, * FROM source_lines
        UNION ALL SELECT 'harbor_stopped', * FROM source_lines WHERE NOT (store = 'Harbor' AND ordered_at >= '2026-06-24')
        UNION ALL SELECT 'doubled', * FROM source_lines
        UNION ALL SELECT 'doubled', * FROM source_lines
        UNION ALL SELECT 'in_cents', line_id, order_id, store, ordered_at,
               CASE WHEN store = 'Campus' AND CAST(ordered_at AS DATE) = DATE '2026-06-30' THEN amount * 100 ELSE amount END FROM source_lines""")

    # chart 1: lines per day in June, load harbor_stopped, one small panel for each cafe on one scale
    rows = q(c, """SELECT store, CAST(ordered_at AS DATE) AS d, COUNT(*) FROM loads WHERE load_name = 'harbor_stopped' AND ordered_at >= '2026-06-01' GROUP BY 1, 2""")
    per = {st: {} for st in STORE_COLOR}
    for st, d, n in rows:
        per[st][d.day] = n
    for st in per:
        per[st] = [per[st].get(day, 0) for day in range(1, 31)]
    last_h = max(day for day in range(1, 31) if per["Harbor"][day - 1] > 0)
    assert last_h == 23, last_h
    ymax = 15
    assert max(max(v) for v in per.values()) <= ymax
    s = Svg("da12-feeds", "Order lines each day in June for the load harbor_stopped, one small chart for each cafe",
            "Three small bar charts one above the other, on one scale from 0 to 15 lines a day, for June 1 to June 30: Old Town in blue, Campus in green and Harbor in purple. "
            "Old Town and Campus have bars every day to June 30. Harbor has bars to June 23 and none from June 24 to June 30. "
            "The newest order of the whole table is still June 30 at 16:30, so a check on the table's newest order passes.")
    X = Axis(1, 30, 40, 300)
    title_line(s, "Lines loaded each day in June, harbor_stopped", 8, 10)
    y = 24
    for st, col in STORE_COLOR.items():
        Y = Axis(0, ymax, y + 44, y)
        s.text(8, y + 8, st, size=9.5, weight=600)
        s.line(X(1) - 4, Y(0), X(30) + 4, Y(0), opacity=0.5)
        for day in range(1, 31):
            n = per[st][day - 1]
            if n:
                s.rect(X(day) - 3.2, Y(n), 6.4, Y(0) - Y(n), col, rx=1.5)
        y += 62
    yh = 24 + 2 * 62
    s.text(X(24) - 2, yh + 22, "last order", size=9, weight=600)
    s.text(X(24) - 2, yh + 33, "Jun 23, 14:02", size=9, weight=600)
    for day in (1, 8, 15, 22, 29):
        s.line(X(day), y - 14, X(day), y - 10, opacity=0.5)
        s.text(X(day), y - 1, f"Jun {day}", anchor="middle", size=9, opacity=0.8)
    s.text(8, y + 14, "Newest order in the whole table: Jun 30, 16:30", size=9, opacity=0.85)
    out["da12-feeds"] = s.render()

    # chart 2: which check catches which load (computed with the checks of the lesson)
    exp_rows, exp_total = c.execute("SELECT COUNT(*), SUM(amount) FROM source_lines").fetchone()
    cutoff = "2026-06-30 00:00:00"
    checks = ["table\nnewest", "cafe\nnewest", "row\ncount", "total"]
    result = {}
    for name in ("ok", "harbor_stopped", "doubled", "in_cents"):
        tbl_new = c.execute("SELECT MAX(ordered_at) FROM loads WHERE load_name = ?", [name]).fetchone()[0]
        cafe_new = c.execute("SELECT MIN(n) FROM (SELECT MAX(ordered_at) AS n FROM loads WHERE load_name = ? GROUP BY store)", [name]).fetchone()[0]
        n, tot = c.execute("SELECT COUNT(*), SUM(amount) FROM loads WHERE load_name = ?", [name]).fetchone()
        result[name] = [str(tbl_new) < cutoff, str(cafe_new) < cutoff, n != exp_rows, tot != exp_total]  # True = the check fails (it catches the load)
    assert result["ok"] == [False] * 4
    assert result["harbor_stopped"] == [False, True, True, True]
    assert result["doubled"] == [False, False, True, True]
    assert result["in_cents"] == [False, False, False, True]
    s = Svg("da12-catches", "Which check catches which broken load",
            "A grid of four loads in rows and four checks in columns. The load ok passes every check. "
            "For harbor_stopped, the newest-order check on the table is missed and the other three, the newest order of each cafe, the row count and the total, catch it. "
            "For doubled, the two newest-order checks miss it and the row count and the total catch it. "
            "For in_cents, only the total catches it; the other three checks miss it. The total is the only check that catches all three broken loads.")
    title_line(s, "Which check catches which broken load", 8, 10)
    x0, cw, ch = 96, 58, 38
    for k, lab in enumerate(checks):
        for j, part in enumerate(lab.split("\n")):
            s.text(x0 + k * cw + cw / 2, 36 + j * 11, part, anchor="middle", size=9, weight=600)
    y = 62
    for name, res in result.items():
        s.text(8, y + ch / 2 + 1, name, size=9.5, weight=600)
        s.line(8, y - 8, x0 + 4 * cw, y - 8, opacity=0.15)
        for k, fails in enumerate(res):
            cx = x0 + k * cw + cw / 2
            if name == "ok":
                s.text(cx, y + 14, "pass", anchor="middle", size=9, opacity=0.8)
            elif fails:
                s.circle(cx, y + 8, 6, BLUE)
                s.text(cx, y + 28, "caught", anchor="middle", size=9, weight=600)
            else:
                s.circle(cx, y + 8, 6, None, stroke=OCHRE)
                s.text(cx, y + 28, "missed", anchor="middle", size=9)
        y += ch + 6
    s.line(8, y - 8, x0 + 4 * cw, y - 8, opacity=0.15)
    s.text(8, y + 8, "newest: the newest order, of the table or of the stalest cafe", size=9, opacity=0.85)
    s.text(8, y + 20, "filled dot: the check fails on this load. ring: it passes.", size=9, opacity=0.85)
    out["da12-catches"] = s.render()

    # ---- da13: the one chart of the readout: orders at 7 a.m., April 1 to June 30, with the rough range of a count (n plus or minus 1.96 times its square root) ----
    r7 = {st: int(n) for st, n in q(c, """SELECT store, COUNT(DISTINCT order_id) FROM lines
        WHERE status = 'completed' AND hour(ordered_at) = 7 AND ordered_at >= DATE '2026-04-01' GROUP BY store""")}
    assert r7 == {"Campus": 43, "Harbor": 20, "Old Town": 45}, r7
    rng = {st: (round(n - 1.96 * n ** 0.5), round(n + 1.96 * n ** 0.5)) for st, n in r7.items()}
    assert rng == {"Campus": (30, 56), "Harbor": (11, 29), "Old Town": (32, 58)}, rng
    s = Svg("da13-readout", "Orders at 7 a.m. from April 1 to June 30: Harbor took less than half of each older cafe",
            "A horizontal bar chart on a scale from 0 to 70 orders, with a thin bar for each cafe and a range drawn across it. "
            + " ".join(f"{st}: {r7[st]} orders at 7 a.m., rough range {rng[st][0]} to {rng[st][1]}." for st in ("Old Town", "Campus", "Harbor"))
            + " Harbor's range ends at 29 and the older cafes' ranges start at 30 and 32, so they do not overlap, but only just.")
    X = Axis(0, 70, 78, 318)
    title_line(s, "Harbor took under half the 7 a.m. orders", 8, 10)
    y = 40
    for st in ("Old Town", "Campus", "Harbor"):
        col = STORE_COLOR[st]
        n = r7[st]
        lo, hi = rng[st]
        s.text(8, y + 12, st, size=10, weight=600)
        s.text(X(0), y - 2, f"{n} orders, range {lo} to {hi}", size=9.5, weight=600)
        s.rect(X(0), y + 4, X(n) - X(0), 12, col, rx=3)
        s.line(X(lo), y + 10, X(hi), y + 10, color="currentColor", w=1.5, opacity=0.9)
        s.line(X(lo), y + 5, X(lo), y + 15, color="currentColor", w=1.5, opacity=0.9)
        s.line(X(hi), y + 5, X(hi), y + 15, color="currentColor", w=1.5, opacity=0.9)
        y += 40
    for v in (0, 20, 40, 60):
        s.line(X(v), 30, X(v), y - 14, opacity=0.1)
        s.text(X(v), y - 2, str(v), anchor="middle", size=9, opacity=0.8)
    s.text(8, y + 14, "Completed orders, April 1 to June 30. The line is the count", size=9, opacity=0.85)
    s.text(8, y + 26, "plus or minus 1.96 times its square root.", size=9, opacity=0.85)
    out["da13-readout"] = s.render()

    # ---- da14, chart 1: revenue per day (net sales over days with orders) by cafe and month, order 2075 as 2 units ----
    rpd = {}
    for st, m, v in q(c, """SELECT store, month, SUM(quantity * unit_price - discount) / COUNT(DISTINCT order_date)
        FROM lines WHERE status = 'completed' GROUP BY store, month ORDER BY store, month"""):
        rpd.setdefault(st, {})[int(m[5:])] = float(v)
    assert round(rpd["Old Town"][1], 2) == 51.32 and round(rpd["Old Town"][2], 2) == 41.5 and round(rpd["Campus"][4], 2) == 41.73
    changes = sorted(((100 * (rpd[st][m] / rpd[st][m - 1] - 1), st, m) for st in rpd for m in rpd[st] if m - 1 in rpd[st]))
    assert len(changes) == 12 and changes[0][1:] == ("Old Town", 2) and round(changes[0][0], 1) == -19.1, changes[:3]
    s = Svg("da14-swing", "Revenue per day by cafe and month, January to June",
            "A line chart from January to June, on a scale from 36 to 58 dollars of net sales per day, one line for each cafe: Old Town in blue, Campus in green, Harbor in purple, which starts in April. "
            + " ".join(f"{st}: " + ", ".join(f"{MON[f'{m:02d}']} {v:.2f}" for m, v in sorted(rpd[st].items())) + "." for st in ("Old Town", "Campus", "Harbor"))
            + f" Old Town's fall from January to February, {changes[0][0]:.1f} percent, is the largest of the 12 month-to-month changes; the next are {changes[1][0]:.1f} percent (Campus, March) and {changes[2][0]:.1f} percent (Old Town, June).")
    X = Axis(1, 6, 44, 286)
    Y = Axis(36, 58, 190, 40)
    title_line(s, "Net sales per day, by cafe and month (dollars)", 8, 10)
    for v in (40, 45, 50, 55):
        s.line(X(1), Y(v), X(6), Y(v), opacity=0.15)
        s.text(36, Y(v) + 3.5, str(v), anchor="end", size=9, opacity=0.8)
    for m in range(1, 7):
        s.text(X(m), 206, MON[f"{m:02d}"], anchor="middle", size=9, opacity=0.8)
    for st, col in STORE_COLOR.items():
        pts = sorted(rpd[st].items())
        s.poly([(X(m), Y(v)) for m, v in pts], col, w=2)
        for m, v in pts:
            s.circle(X(m), Y(v), 4, col)
    s.text(X(6) + 10, Y(rpd["Campus"][6]) + 3.5, "Campus", size=9.5, weight=600)
    s.text(X(6) + 10, Y(rpd["Harbor"][6]) - 3, "Harbor", size=9.5, weight=600)
    s.text(X(6) + 10, Y(rpd["Old Town"][6]) + 9, "Old Town", size=9.5, weight=600)
    s.text(X(2) + 9, Y(rpd["Old Town"][2]) + 4, "Feb: 41.50", size=9.5, weight=600)
    s.text(8, 228, "Net sales over days with orders; order 2075 counted as 2 units", size=9, opacity=0.85)
    out["da14-swing"] = s.render()

    # ---- da14, chart 2: cafe-days per arm to catch a rise in orders per day (days per arm = 15.68 x variance / (rise x mean) squared) ----
    mean, var = c.execute("""WITH d AS (SELECT store, order_date, COUNT(DISTINCT order_id) AS n FROM lines WHERE status = 'completed' GROUP BY store, order_date)
        SELECT AVG(n), VAR_SAMP(n) FROM d""").fetchone()
    need = {r: int(-(-15.68 * float(var) / (r * float(mean)) ** 2 // 1)) for r in (0.05, 0.10, 0.25, 0.50)}
    assert need == {0.05: 781, 0.10: 196, 0.25: 32, 0.50: 8}, need
    s = Svg("da14-days", "Cafe-days per arm needed to catch a rise in orders per day",
            f"A horizontal bar chart of the cafe-days needed in each arm of a test, on a scale from 0 to 800. To catch a rise of 5 percent in orders per day: {need[0.05]}. 10 percent: {need[0.10]}. 25 percent: {need[0.25]}. 50 percent: {need[0.50]}. "
            f"Orders per day average {float(mean):.2f} with a spread of {float(var) ** 0.5:.2f}. The smaller the rise worth finding, the longer the test.")
    X = Axis(0, 800, 74, 236)
    title_line(s, "Cafe-days per arm to catch a rise in orders", 8, 10)
    y = 34
    for r, n in need.items():
        s.text(8, y + 12, f"+{int(r * 100)} percent", size=9.5, weight=600)
        s.rect(X(0), y, max(X(n) - X(0), 2), 16, BLUE, rx=3)
        s.text(X(n) + 6, y + 12.5, f"{n} cafe-days", weight=600)
        y += 28
    s.text(8, y + 8, "Per arm. Completed orders per cafe-day, three cafes, January", size=9, opacity=0.85)
    s.text(8, y + 20, "to June. The smaller the rise worth finding, the longer the test.", size=9, opacity=0.85)
    out["da14-days"] = s.render()

    # ---- da15: the corrected table of the lesson (net sales per day, April to June) against two claims of the illustrated reply ----
    per = {}
    typed_old_may = None
    for st, m, v, vt in q(c, """SELECT store, month, ROUND(SUM(quantity * unit_price - discount) / MAX(day(last_day(ordered_at))), 2),
        ROUND(SUM(quantity_recorded * unit_price - discount) / MAX(day(last_day(ordered_at))), 2)
        FROM lines WHERE status = 'completed' AND ordered_at >= DATE '2026-04-01' AND ordered_at < DATE '2026-07-01' GROUP BY store, month"""):
        per.setdefault(st, {})[int(m[5:])] = float(v)
        if st == "Old Town" and m.endswith("05"):
            typed_old_may = float(vt)
    assert [round(per["Harbor"][m], 2) for m in (4, 5, 6)] == [53.22, 49.89, 48.78], per["Harbor"]
    assert round(per["Campus"][6], 2) == 53.03 and round(per["Old Town"][6], 2) == 47.53 and round(typed_old_may, 2) == 60.27
    s = Svg("da15-story", "Net sales per day, April to June, against the claims of the illustrated summary",
            "A line chart of net sales per day, from April to June, with a dashed extension to July, on a scale from 40 to 62 dollars. Campus in green: 41.73, 54.46, 53.03. Old Town in blue: 51.41, 54.90, 47.53; "
            "a ring marks 60.27 for May, the value when order 2075 is counted as 20 units instead of 2. Harbor in purple: 53.22, 49.89, 48.78, falling each month and second in June. "
            "A dashed line runs from Harbor's June point to a ring at about 55 in July, the forecast of the illustrated summary; the data end on June 30, so nothing can check it.")
    X = Axis(4, 7, 44, 250)
    Y = Axis(40, 62, 196, 42)
    title_line(s, "Net sales per day (dollars): table and claims", 8, 10)
    for v in (40, 45, 50, 55, 60):
        s.line(X(4), Y(v), X(7), Y(v), opacity=0.15)
        s.text(36, Y(v) + 3.5, str(v), anchor="end", size=9, opacity=0.8)
    for m, lab in ((4, "Apr"), (5, "May"), (6, "Jun"), (7, "Jul")):
        s.text(X(m), 214, lab, anchor="middle", size=9, opacity=0.8)
    for st, col in STORE_COLOR.items():
        pts = sorted(per[st].items())
        s.poly([(X(m), Y(v)) for m, v in pts], col, w=2)
        for m, v in pts:
            s.circle(X(m), Y(v), 4, col)
    s.line(X(6), Y(per["Harbor"][6]), X(7), Y(55), color=OCHRE, w=2, opacity=1, dash="4 3")
    s.circle(X(7), Y(55), 4.5, None, stroke=OCHRE)
    s.text(X(7) + 10, Y(55) + 3.5, "forecast: 55", size=9.5, weight=600)
    s.text(X(7) + 10, Y(55) + 15, "no data to check it", size=9, opacity=0.9)
    s.circle(X(5), Y(typed_old_may), 4.5, None, stroke=OCHRE)
    s.text(X(5) + 9, Y(typed_old_may) + 3.5, "60.27 as typed", size=9.5, weight=600)
    s.text(X(6) + 10, Y(per["Campus"][6]) - 8, "Campus", size=9.5, weight=600)
    s.text(X(6) - 8, Y(per["Old Town"][6]) + 15, "Old Town", anchor="end", size=9.5, weight=600)
    s.text(X(6) + 10, Y(per["Harbor"][6]) + 14, "Harbor", size=9.5, weight=600)
    s.text(X(6) + 10, Y(per["Harbor"][6]) + 26, "falls each month", size=9, opacity=0.9)
    s.text(8, 234, "Lines: corrected, order 2075 counted as 2 units.", size=9, opacity=0.85)
    s.text(8, 246, "Rings: values from the illustrated replies.", size=9, opacity=0.85)
    out["da15-story"] = s.render()

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
