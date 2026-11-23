"""Draws the static charts and wireframes of Data Analyst lessons 6 to 10 (ab-test-readout, messy-data-cleaning-story, dashboard-design,
bi-modeling-for-dashboards, first-bi-dashboard) from the app-events and cafe-sales data.

    python3 scripts/charts/da-batch-2.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/da-batch-2.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/da-batch-2.py --check       exit 1 unless every chart appears, byte for byte, in its lesson

Needs duckdb (2.0.0 for every number in the lessons). Same pipeline as da-batch-1.py (it imports that file's Svg class, text widths and colors):
plain SVG with currentColor text, the figure color roles of the site (blue, green, purple, ochre, in that fixed order), a title and a desc, each tag
on its own line. Every drawing is centered in its viewBox. The wireframes of the dashboard lessons are drawn here too, in gray boxes, so that they
follow the lesson's numbers. The settlement numbers come from scripts/build-settlements-extract.py, rebuilt in memory. Rerun --paste when a
number changes.
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
    "da6": DOCS / "ab-test-readout.mdx",
    "da7": DOCS / "messy-data-cleaning-story.mdx",
    "da8": DOCS / "dashboard-design.mdx",
    "da9": DOCS / "bi-modeling-for-dashboards.mdx",
    "da10": DOCS / "first-bi-dashboard.mdx",
}


class Svg2(Svg):
    """Svg with a soft outline (gray frame) and a rounded filled panel."""

    def frame(self, x, y, w, h, opacity=0.35, rx=6, dash=None, fill=None, fill_opacity=None):
        def fn(dx, dy):
            a = f'<rect x="{r1(x + dx)}" y="{r1(y + dy)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}"'
            a += f' fill="{fill}"' if fill else ' fill="none"'
            a += f' fill-opacity="{fill_opacity}"' if fill_opacity is not None else ""
            a += f' stroke="currentColor" stroke-opacity="{opacity}" stroke-width="1"'
            a += f' stroke-dasharray="{dash}"' if dash else ""
            return a + " />"

        self._add(fn, x, y, x + w, y + h)


def title_line(s, text, x, y):
    s.text(x, y, text, size=10.5, weight=600)


def money(v, cents=True):
    return f"${v:,.2f}" if cents else f"${v:,.0f}"


def cafe():
    con = duckdb.connect()
    con.execute((b1.CAFE / "cafe-sales.sql").read_text())
    con.execute("""CREATE VIEW sales_clean AS
        SELECT oi.order_item_id AS line_id, o.order_id, o.ordered_at, CAST(o.ordered_at AS DATE) AS order_date, s.store_name AS store,
               p.product_name AS product, p.category,
               (CASE WHEN oi.order_item_id = 6952 THEN 2 ELSE oi.quantity END) * p.unit_price_usd - oi.discount_usd AS amount
        FROM orders o JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON p.product_id = oi.product_id
        JOIN stores s ON s.store_id = o.store_id WHERE o.status = 'completed'""")
    return con


def interval(n0, c0, n1, c1):
    """Gap of two proportions (variant minus control) and its 95 percent interval, unpooled, in proportion units."""
    p0, p1 = c0 / n0, c1 / n1
    se = (p0 * (1 - p0) / n0 + p1 * (1 - p1) / n1) ** 0.5
    return p1 - p0, p1 - p0 - 1.96 * se, p1 - p0 + 1.96 * se


def forest_row(s, y, label, lo, hi, val, axis_lo, axis_hi, ticks, fmt, color, text, mark=None, mark_label=None):
    """One interval row: a label, a bar from lo to hi with a dot at val, the value written above, an axis, an optional rule line."""
    X = Axis(axis_lo, axis_hi, 20, 330)
    s.text(8, y, label, weight=600)
    s.text(X(val), y + 20, text, anchor="middle", weight=600)
    s.line(X(axis_lo), y + 46, X(axis_hi), y + 46, opacity=0.45)
    s.line(X(0), y + 26, X(0), y + 46, opacity=0.45)
    if mark is not None:
        s.line(X(mark), y + 26, X(mark), y + 46, color="currentColor", w=1.2, opacity=0.7, dash="3 3")
        s.text(X(mark), y + 75, mark_label, anchor="middle", size=9.5, opacity=0.9)
    for t in ticks:
        s.line(X(t), y + 46, X(t), y + 50, opacity=0.45)
        s.text(X(t), y + 61, fmt(t), anchor="middle", opacity=0.8, size=9.5)
    s.line(X(lo), y + 34, X(hi), y + 34, color=color, w=3, opacity=1, cap="round")
    s.circle(X(val), y + 34, 5, color)


def charts(settlements):
    out = {}
    c = cafe()

    # ---- da6: the readout of paywall_v2 in the units of the decision (app-events; 95 percent intervals) ----
    n0, c0, n1, c1 = 2706, 343, 2713, 415
    g, glo, ghi = interval(n0, c0, n1, c1)
    m0, m1 = (7.99 * 262 + 59.99 * 81) / n0, (7.99 * 312 + 59.99 * 103) / n1
    v = lambda n, mo, an, mean: ((7.99 ** 2 * mo + 59.99 ** 2 * an) / n - mean ** 2) * n / (n - 1)
    se = (v(n0, 262, 81, m0) / n0 + v(n1, 312, 103, m1) / n1) ** 0.5
    dg, dlo, dhi = m1 - m0, m1 - m0 - 1.96 * se, m1 - m0 + 1.96 * se
    cg, clo, chi = 100 * (75 / 415 - 48 / 343), -1.1, 9.3  # the guardrail of C14: 48 of 343 and 75 of 415, interval printed there
    s = Svg2("da6-readout", "The readout of paywall_v2: three effects with 95 percent intervals",
             f"Three rows, each with a dot for the estimate and a bar for its 95 percent interval. Extra buyers per 1,000 signups: {1000 * g:.0f}, from {1000 * glo:.0f} to {1000 * ghi:.0f}; a dashed line marks 20, the bar of 2 points set in advance. "
             f"Extra revenue per signup: {dg:.2f} dollars, from {dlo:.2f} to {dhi:.2f}. Gap in the share of buyers who canceled within 30 days: {cg:.1f} points, from {clo:.1f} to {chi:.1f}; a dashed line marks +5, the limit set in advance, "
             "and the interval crosses it. The first two intervals are above zero and the third includes zero.")
    title_line(s, "paywall_v2: what the test says, in the units of the decision", 8, 10)
    forest_row(s, 34, "Extra buyers per 1,000 signups", 1000 * glo, 1000 * ghi, 1000 * g, -10, 50, [0, 20, 40], lambda t: f"{t:.0f}", BLUE,
               f"+{1000 * g:.0f} ({1000 * glo:.0f} to {1000 * ghi:.0f})", mark=20, mark_label="rule: 20 (2 points)")
    forest_row(s, 126, "Extra revenue per signup, dollars", dlo, dhi, dg, -0.2, 1.4, [0, 0.5, 1.0], lambda t: f"{t:.1f}", BLUE,
               f"+${dg:.2f} (${dlo:.2f} to ${dhi:.2f})")
    forest_row(s, 218, "Cancels within 30 days, buyers: gap in points", clo, chi, cg, -4, 12, [0, 4, 8, 12], lambda t: f"{t:.0f}", OCHRE,
               f"+{cg:.1f} ({clo:.1f} to +{chi:.1f})", mark=5, mark_label="limit: +5")
    s.text(8, 314, "95 percent intervals, 5,419 signups; the rule and the", size=9.5, opacity=0.8)
    s.text(8, 326, "guardrail numbers are those of C14", size=9.5, opacity=0.8)
    out["da6-readout"] = s.render()

    # ---- da7: where the gap between the till and the processor file comes from (full file, from the settlements script) ----
    gap = settlements["till"] - settlements["processor"]
    parts = [("Harbor, May 18 to 24", settlements["harbor_week"], f"{settlements['harbor_orders']} orders", BLUE),
             ("Order 2075", settlements["o2075"], "1 line", GREEN),
             ("Nine other orders", settlements["nine"], "9 orders", PURPLE)]
    assert abs(sum(p[1] for p in parts) - gap) < 0.005
    s = Svg2("da7-bridge", "Where the difference between the till and the processor file comes from",
             f"One horizontal bar of {money(gap)}, the till's total for card and mobile orders ({money(settlements['till'])}) minus the cleaned processor total ({money(settlements['processor'])}). "
             + " ".join(f"{p[0]}, {money(p[1])}, {p[2]}." for p in parts) + " The three parts add up to the whole difference, so nothing is left unexplained: 0.00 dollars.")
    X = Axis(0, gap, 14, 318)
    title_line(s, f"The {money(gap)} between the two totals, by cause", 8, 10)
    x = 0
    for i, (lab, val, note, col) in enumerate(parts):
        s.rect(X(x), 30, X(x + val) - X(x), 28, col, rx=3 if i in (0, 2) else None)
        mid = X(x + val / 2)
        up = i == 1
        yy = 82 if not up else 92
        s.line(mid, 58 if not up else 58, mid, yy - 12, opacity=0.5)
        s.text(mid, yy, lab, anchor="middle", weight=600)
        s.text(mid, yy + 13, f"{money(val)} · {note}", anchor="middle", size=9.5)
        x += val
    s.text(8, 132, "Left unexplained", weight=600)
    s.rect(X(0), 142, 2, 14, "currentColor", opacity=0.9)
    s.text(X(0) + 10, 153, "$0.00", weight=600)
    out["da7-bridge"] = s.render()

    # ---- da8: wireframes of the dashboard (gray boxes, real numbers in the cards) ----
    tot = c.execute("SELECT SUM(amount), COUNT(DISTINCT order_id) FROM sales_clean").fetchone()
    rev, orders = float(tot[0]), int(tot[1])
    rpo = rev / orders
    s = Svg2("da8-wire-desktop", "Wireframe of the dashboard: three cards, three charts and a footnote on one screen",
             f"A gray wireframe of one screen. A title bar on top. Under it, a row of three cards: Revenue {money(rev)}, Orders {orders:,} and Revenue per order {money(rpo)}. Below, three chart panels, each with a headline: "
             "Harbor sold about half of what each older cafe sold, in half the time; Coffee brings in 48 percent of revenue; Harbor's 7 a.m. hour is its quietest, 20 orders. At the bottom a footnote holds the freshness line and the definitions. "
             "Numbered badges mark the cards (1), the charts with their headlines (2) and the footnote (3).")
    s.frame(8, 4, 330, 342, opacity=0.5, rx=8)
    s.text(18, 24, "Dana's cafes: sales to June 30, 2026", size=11, weight=600)
    for i, (lab, val) in enumerate((("Revenue", money(rev)), ("Orders", f"{orders:,}"), ("Revenue per order", money(rpo)))):
        x = 16 + i * 104
        s.frame(x, 36, 98, 46, opacity=0.4, fill="currentColor", fill_opacity=0.06)
        s.text(x + 8, 53, lab, size=9.5, opacity=0.85)
        s.text(x + 8, 73, val, size=14, weight=600)
    badge(s, 326, 44, "1")
    panels = [(16, 94, 152, 108, ["Harbor sold about half of", "what each older cafe sold,", "in half the time"], "bars3"),
              (176, 94, 146, 108, ["Coffee brings in 48 percent", "of revenue"], "bars4"),
              (16, 210, 306, 82, ["Harbor's 7 a.m. hour is its quietest: 20 orders"], "hours")]
    for x, y, w, h, head, kind in panels:
        s.frame(x, y, w, h, opacity=0.4, fill="currentColor", fill_opacity=0.04)
        for k, line in enumerate(head):
            s.text(x + 8, y + 15 + 11 * k, line, size=9.5, weight=600)
        base = y + h - 10
        if kind == "bars3":
            for k, hh in enumerate((50, 50, 26)):
                s.rect(x + 22 + k * 40, base - hh, 24, hh, "currentColor", opacity=0.3, rx=2)
        elif kind == "bars4":
            for k, ww in enumerate((84, 40, 30, 26)):
                s.rect(x + 12, y + 44 + k * 14, ww, 9, "currentColor", opacity=0.3, rx=2)
        else:
            for sidx, hs in enumerate(((73, 53, 67, 76), (79, 60, 71, 72), (20, 43, 31, 33))):
                for k, o in enumerate(hs):
                    s.rect(x + 14 + sidx * 100 + k * 18, base - o * 0.42, 12, o * 0.42, "currentColor", opacity=0.3, rx=2)
    badge(s, 326, 100, "2")
    s.frame(16, 300, 306, 40, opacity=0.4, dash="3 3")
    s.text(24, 313, "Data through June 30, 2026, last order 16:30", size=8.5)
    s.text(24, 324, "Revenue: completed orders, quantity times price minus", size=8.5)
    s.text(24, 335, "discount; order 2075 shown as 2 units", size=8.5)
    badge(s, 326, 308, "3")
    s.text(8, 360, "1 cards chosen by the decision", size=9, opacity=0.85)
    s.text(8, 371, "2 a chart per question, finding as headline", size=9, opacity=0.85)
    s.text(8, 382, "3 freshness and definitions", size=9, opacity=0.85)
    out["da8-wire-desktop"] = s.render()

    s = Svg2("da8-wire-phone", "Wireframe of the same screen on a phone: one column",
             "A gray phone outline. Inside, from top to bottom: the title; two cards side by side, Revenue and Orders; one full-width card, Revenue per order; the three charts one under the other, each with its headline above it; "
             "and the footnote with the freshness line and the definitions. Side notes: cards two across, charts in one column in the order of the questions, headline kept above each chart, footnote last.")
    s.frame(8, 4, 168, 372, opacity=0.6, rx=18)
    s.text(22, 26, "Dana's cafes", size=10.5, weight=600)
    s.frame(20, 36, 70, 38, opacity=0.4, fill="currentColor", fill_opacity=0.06)
    s.text(26, 50, "Revenue", size=9, opacity=0.85)
    s.text(26, 67, money(rev, False), size=12, weight=600)
    s.frame(96, 36, 70, 38, opacity=0.4, fill="currentColor", fill_opacity=0.06)
    s.text(102, 50, "Orders", size=9, opacity=0.85)
    s.text(102, 67, f"{orders:,}", size=12, weight=600)
    s.frame(20, 80, 146, 30, opacity=0.4, fill="currentColor", fill_opacity=0.06)
    s.text(26, 93, "Revenue per order", size=9, opacity=0.85)
    s.text(26, 106, money(rpo), size=12, weight=600)
    for k, (head, kind) in enumerate((("Harbor: about half", "bars3"), ("Coffee: 48 percent of revenue", "bars4"), ("Harbor's 7 a.m. is quietest", "hours"))):
        y = 118 + k * 74
        s.frame(20, y, 146, 68, opacity=0.4, fill="currentColor", fill_opacity=0.04)
        s.text(26, y + 13, head, size=9, weight=600)
        base = y + 60
        if kind == "bars3":
            for j, hh in enumerate((28, 28, 15)):
                s.rect(52 + j * 30, base - hh, 18, hh, "currentColor", opacity=0.3, rx=2)
        elif kind == "bars4":
            for j, ww in enumerate((70, 34, 26, 22)):
                s.rect(30, y + 22 + j * 9, ww, 6, "currentColor", opacity=0.3, rx=2)
        else:
            for sidx, hs in enumerate(((73, 53, 67), (79, 60, 71), (20, 43, 31))):
                for j, o in enumerate(hs):
                    s.rect(30 + sidx * 44 + j * 12, base - o * 0.3, 8, o * 0.3, "currentColor", opacity=0.3, rx=2)
    s.frame(20, 340, 146, 28, opacity=0.4, dash="3 3")
    s.text(26, 352, "Data through June 30, 2026", size=8.5)
    s.text(26, 362, "Revenue: completed orders", size=8.5)
    for yy, t1, t2 in ((55, "cards two across,", "the third full width"), (190, "charts in one column,", "in the order of the questions"), (270, "a headline above", "each chart"), (354, "footnote last", "")):
        s.line(176, yy, 192, yy, opacity=0.5)
        s.text(198, yy + 3, t1, size=9.5, weight=600)
        if t2:
            s.text(198, yy + 15, t2, size=9.5)
    out["da8-wire-phone"] = s.render()

    # ---- da9: distinct orders by category do not add up to the total ----
    cats = [(r[0], int(r[1])) for r in c.execute("""SELECT p.category, COUNT(DISTINCT o.order_id) FROM order_items oi JOIN orders o USING (order_id) JOIN products p USING (product_id)
        WHERE o.status = 'completed' GROUP BY 1 ORDER BY 2 DESC""").fetchall()]
    total = int(c.execute("SELECT COUNT(DISTINCT order_id) FROM orders WHERE status = 'completed'").fetchone()[0])
    ssum = sum(n for _, n in cats)
    s = Svg2("da9-nonadd", "Distinct orders by category against the total of all orders",
             "A horizontal bar chart of completed orders on a scale from 0 to 3,000. " + ", ".join(f"{k} {n:,}" for k, n in cats)
             + f". The total cell is {total:,} orders. A last bar stacks the four category bars end to end: it reaches {ssum:,}, and the part beyond {total:,}, {ssum - total:,} orders, is drawn in ochre. "
             "An order with lines in two categories is counted in each category bar and once in the total.")
    X = Axis(0, 3000, 108, 296)
    title_line(s, "Orders by category, the total, the bars added", 8, 10)
    y = 30
    for k, n in cats:
        s.text(8, y + 12, k, weight=600 if k == "coffee" else None)
        s.rect(X(0), y, X(n) - X(0), 16, BLUE, rx=3)
        s.text(X(n) + 6, y + 12.5, f"{n:,}")
        y += 24
    s.text(8, y + 14, "all categories", weight=600)
    s.rect(X(0), y + 2, X(total) - X(0), 16, GREEN, rx=3)
    s.text(X(total) + 6, y + 14.5, f"{total:,}", weight=600)
    y += 34
    s.text(8, y + 12, "four bars added", weight=600)
    x = 0
    for i, (k, n) in enumerate(cats):
        s.rect(X(x), y, X(x + n) - X(x), 16, BLUE, opacity=1 if i % 2 == 0 else 0.75)
        x += n
    s.rect(X(total), y, X(ssum) - X(total), 16, OCHRE)
    s.text(X(ssum) - 2, y + 30, f"{ssum:,}: {ssum - total:,} more than the total", anchor="end", weight=600)
    y += 36
    s.line(X(0), y, X(3000), y)
    for t in (0, 1000, 2000, 3000):
        s.line(X(t), y, X(t), y + 4)
        s.text(X(t), y + 16, f"{t:,}", anchor="middle", opacity=0.8)
    out["da9-nonadd"] = s.render()

    # ---- da10: the target dashboard, with the real numbers ----
    store = c.execute("SELECT store, SUM(amount) FROM sales_clean GROUP BY 1 ORDER BY 1").fetchall()
    cat = c.execute("SELECT category, SUM(amount) FROM sales_clean GROUP BY 1 ORDER BY 2 DESC").fetchall()
    hrs = {}
    for st, h, n in c.execute("SELECT store, EXTRACT(hour FROM ordered_at), COUNT(DISTINCT order_id) FROM sales_clean GROUP BY 1, 2 ORDER BY 1, 2").fetchall():
        hrs.setdefault(st, {})[int(h)] = int(n)
    s = Svg2("da10-target", "The dashboard to build: three cards, three charts and a footnote, with the numbers it must show",
             f"One screen. Cards: Revenue {money(rev)}, Orders {orders:,}, Revenue per order {money(rpo)}. Chart 1, revenue by store: " + ", ".join(f"{a} {money(float(b))}" for a, b in store)
             + ". Chart 2, revenue by category: " + ", ".join(f"{a} {money(float(b))}" for a, b in cat) + ". Chart 3, orders by hour of day from 7 to 17 for each store: Harbor has 20 orders at 7 and 43 at 8; Campus 79 and 60; Old Town 73 and 53. "
             "A footnote gives the freshness line and the definitions. Order 2075 is shown as 2 units.")
    s.frame(8, 4, 330, 360, opacity=0.5, rx=8)
    s.text(18, 24, "Dana's cafes: sales to June 30, 2026", size=11, weight=600)
    for i, (lab, val) in enumerate((("Revenue", money(rev)), ("Orders", f"{orders:,}"), ("Revenue per order", money(rpo)))):
        x = 16 + i * 104
        s.frame(x, 34, 98, 46, opacity=0.4, fill="currentColor", fill_opacity=0.06)
        s.text(x + 8, 51, lab, size=9.5, opacity=0.85)
        s.text(x + 8, 71, val, size=14, weight=600)
    # chart 1: revenue by store
    for k, line in enumerate(("Harbor sold about half of", "what each older cafe sold,", "in half the time")):
        s.text(16, 98 + 11 * k, line, size=9.5, weight=600)
    Y1 = Axis(0, 10000, 200, 142)
    for k, (st, val) in enumerate(store):
        val = float(val)
        col = OCHRE if st == "Harbor" else BLUE
        x = 24 + k * 50
        s.rect(x, Y1(val), 36, 188 - Y1(val), col, rx=2)
        s.text(x + 18, Y1(val) - 4, f"${val:,.2f}", anchor="middle", size=9, weight=600 if st == "Harbor" else None)
        s.text(x + 18, 212, st, anchor="middle", size=9, opacity=0.85)
    # chart 2: revenue by category
    s.text(180, 98, "Coffee brings in 48 percent", size=9.5, weight=600)
    s.text(180, 109, "of revenue", size=9.5, weight=600)
    X2 = Axis(0, 12000, 226, 262)
    for k, (cname, val) in enumerate(cat):
        val = float(val)
        y = 120 + k * 22
        s.text(180, y + 11, cname, size=9, opacity=0.85)
        s.rect(X2(0), y, X2(val) - X2(0), 14, BLUE, rx=2)
        s.text(X2(val) + 4, y + 11, f"${val:,.2f}", size=9, weight=600 if cname == "coffee" else None)
    # chart 3: orders by hour for each store
    s.text(16, 236, "Harbor's 7 a.m. hour is its quietest: 20 orders", size=9.5, weight=600)
    cols = {"Old Town": BLUE, "Campus": GREEN, "Harbor": OCHRE}
    for sidx, st in enumerate(("Old Town", "Campus", "Harbor")):
        x0 = 22 + sidx * 108
        s.text(x0, 250, st, size=9, weight=600)
        base = 310
        for k, h in enumerate(range(7, 18)):
            o = hrs[st][h]
            s.rect(x0 + k * 8.4, base - o * 0.55, 6.4, o * 0.55, cols[st], rx=1)
        s.text(x0, base + 11, "7", size=8.5, opacity=0.8)
        s.text(x0 + 10 * 8.4 + 6, base + 11, "17", size=8.5, opacity=0.8, anchor="end")
        s.text(x0 + 3.2, base - hrs[st][7] * 0.55 - 4, str(hrs[st][7]), size=9, anchor="middle", weight=600)
    s.text(16, 336, "Data through June 30, 2026, last order 16:30. Revenue: completed", size=8.5, opacity=0.9)
    s.text(16, 347, "orders, quantity times price minus discount; order 2075 as 2 units.", size=8.5, opacity=0.9)
    out["da10-target"] = s.render()
    return out


def badge(s, x, y, n):
    s.circle(x, y, 7, None, stroke="currentColor")
    s.text(x, y + 3.5, n, size=9, weight=600, anchor="middle")


def settlement_numbers():
    """The reconciliation of the cleaning story, computed from the file the settlements script builds."""
    sys.path.insert(0, str(ROOT / "scripts"))
    spec2 = importlib.util.spec_from_file_location("settle", ROOT / "scripts" / "build-settlements-extract.py")
    mod = importlib.util.module_from_spec(spec2)
    spec2.loader.exec_module(mod)
    rows = mod.build()
    con = cafe()
    con.execute("CREATE TABLE raw(settlement_id VARCHAR, order_ref VARCHAR, merchant VARCHAR, settled_at VARCHAR, amount VARCHAR, type VARCHAR)")
    con.executemany("INSERT INTO raw VALUES (?, ?, ?, ?, ?, ?)", rows)
    con.execute("""CREATE VIEW clean AS SELECT CAST(REPLACE(order_ref, 'ORD-', '') AS INTEGER) AS order_id,
        CASE WHEN amount LIKE '$%' THEN CAST(REPLACE(amount, '$', '') AS DECIMAL(10, 2)) ELSE CAST(amount AS DECIMAL(10, 2)) / 100 END AS amount
        FROM (SELECT DISTINCT * FROM raw WHERE type <> 'TEST')""")
    con.execute("""CREATE VIEW till AS SELECT o.order_id, o.store_id, CAST(o.ordered_at AS DATE) AS d, SUM(oi.quantity * p.unit_price_usd - oi.discount_usd) AS amount
        FROM orders o JOIN order_items oi USING (order_id) JOIN products p USING (product_id)
        WHERE o.status = 'completed' AND o.payment_method IN ('card', 'mobile') GROUP BY ALL""")
    f = lambda sql: float(con.execute(sql).fetchone()[0])
    nine = "(1179, 1328, 1626, 1775, 1924, 2073, 2222, 2520, 2669)"
    return {
        "till": f("SELECT SUM(amount) FROM till"), "processor": f("SELECT SUM(amount) FROM clean"),
        "o2075": f("SELECT SUM((oi.quantity - 2) * p.unit_price_usd) FROM order_items oi JOIN products p USING (product_id) WHERE oi.order_item_id = 6952"),
        "harbor_week": f("SELECT SUM(amount) FROM till WHERE store_id = 3 AND d BETWEEN DATE '2026-05-18' AND DATE '2026-05-24'"),
        "harbor_orders": int(f("SELECT COUNT(*) FROM till WHERE store_id = 3 AND d BETWEEN DATE '2026-05-18' AND DATE '2026-05-24'")),
        "nine": f(f"SELECT SUM(amount) FROM till WHERE order_id IN {nine}"),
    }


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def paste(result, check=False):
    texts = {k: v.read_text() for k, v in LESSONS.items()}
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
        for k, v in LESSONS.items():
            v.write_text(texts[k])
    return bad


if __name__ == "__main__":
    result = charts(settlement_numbers())
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
