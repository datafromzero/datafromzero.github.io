"""Draws the static charts of the first five Data Analyst lessons (the-analysts-loop, querying-a-cloud-warehouse,
sql-segmentation-and-pareto, time-series-reporting, retention-and-lifetime-value) from the cafe-sales and app-events data.

    python3 scripts/charts/da-batch-1.py --out DIR   write every chart as DIR/<name>.svg
    python3 scripts/charts/da-batch-1.py --check     exit 1 unless every chart appears, byte for byte, in its lesson

Needs duckdb (2.0.0 for every number in the lessons). Same pipeline as scripts/charts/core-c14-c15.py: plain SVG with currentColor
text, the figure color roles of the site (blue, green, purple, ochre, in that fixed order), a title and a desc, each tag on its own
line, so the charts paste into the .mdx lessons as they are. Each drawing is centered in its viewBox: the script measures the
extent of everything it draws (text widths are estimated) and shifts it so the left and right margins are equal, and the same
for top and bottom. Colors were checked with the dataviz validator (light and dark): blue, green, purple and ochre pass; ochre is
below 3:1 on the light surface, so every ochre mark carries a visible label. Rerun and paste again when a number changes.
"""
import html
import sys
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parents[2]
CAFE = ROOT / "datasets" / "cafe-sales" / "v1"
APP = ROOT / "datasets" / "app-events" / "v1"
DOCS = ROOT / "src" / "content" / "docs" / "data-analyst"
LESSONS = {
    "da1": DOCS / "the-analysts-loop.mdx",
    "da2": DOCS / "querying-a-cloud-warehouse.mdx",
    "da3": DOCS / "sql-segmentation-and-pareto.mdx",
    "da4": DOCS / "time-series-reporting.mdx",
    "da5": DOCS / "retention-and-lifetime-value.mdx",
}
BLUE, GREEN, PURPLE, OCHRE = "#0072b2", "#00a07a", "#9a6be0", "#ad9100"
W = 360
PAD = 14  # space between the drawing and the edge of the viewBox, all four sides


# Advance widths of Geist (the site's font), in thousandths of the font size, for weights 400 and 600: text widths are measured
# with them so the centering is exact.
GEIST = {
    400: {' ':250,'!':213,'"':346,'#':478,'$':629,'%':802,'&':620,"'":178,'(':274,')':274,'*':430,'+':558,',':201,'-':419,'.':201,'/':480,'0':663,'1':384,'2':619,'3':613,'4':615,'5':626,'6':593,'7':524,'8':604,'9':593,':':297,';':297,'<':544,'=':540,'>':544,'?':559,'@':906,'A':668,'B':680,'C':703,'D':694,'E':603,'F':590,'G':700,'H':713,'I':270,'J':597,'K':640,'L':580,'M':877,'N':743,'O':739,'P':650,'Q':733,'R':672,'S':640,'T':552,'U':689,'V':667,'W':945,'X':606,'Y':576,'Z':544,'[':347,'\\':455,']':347,'^':426,'_':557,'`':248,'a':551,'b':595,'c':546,'d':595,'e':561,'f':395,'g':594,'h':581,'i':244,'j':260,'k':590,'l':267,'m':877,'n':581,'o':573,'p':595,'q':595,'r':379,'s':520,'t':392,'u':575,'v':536,'w':819,'x':585,'y':537,'z':537,'{':389,'|':264,'}':389,'~':523,'−':520,'×':502,'·':201,'–':591},
    600: {' ':236,'!':243,'"':376,'#':552,'$':656,'%':818,'&':677,"'":195,'(':306,')':306,'*':424,'+':566,',':225,'-':418,'.':225,'/':508,'0':683,'1':427,'2':642,'3':637,'4':643,'5':656,'6':615,'7':538,'8':644,'9':618,':':306,';':306,'<':548,'=':548,'>':548,'?':581,'@':944,'A':709,'B':695,'C':724,'D':708,'E':615,'F':600,'G':726,'H':719,'I':290,'J':617,'K':672,'L':586,'M':902,'N':748,'O':763,'P':664,'Q':757,'R':689,'S':668,'T':584,'U':699,'V':709,'W':991,'X':660,'Y':613,'Z':577,'[':375,'\\':485,']':375,'^':450,'_':560,'`':268,'a':580,'b':621,'c':580,'d':621,'e':591,'f':429,'g':620,'h':601,'i':269,'j':308,'k':628,'l':297,'m':892,'n':601,'o':603,'p':621,'q':621,'r':409,'s':553,'t':427,'u':597,'v':584,'w':839,'x':628,'y':570,'z':567,'{':401,'|':284,'}':401,'~':523,'−':536,'×':528,'·':225,'–':594},
}


def text_width(s, size, weight):
    table = GEIST[600 if weight and int(weight) >= 600 else 400]
    return sum(table.get(ch, 560) for ch in str(s)) * size / 1000


def esc(s):
    s = html.escape(str(s), quote=False)
    return s.replace("$", "&#36;").replace("*", "&#42;").replace("{", "&#123;").replace("}", "&#125;").replace("_", "&#95;")


def r1(v):
    return f"{round(v, 1):g}"


class Svg:
    """Collects elements with their extent, then shifts them so the drawing is centered in the viewBox."""

    def __init__(self, sid, title, desc):
        self.sid, self.title, self.desc, self.els = sid, title, desc, []
        self.nudge = 0  # a measured correction in x (viewBox units) where the browser's text width differs from the table's

    def _add(self, fn, x0, y0, x1, y1):
        self.els.append((fn, x0, y0, x1, y1))

    def text(self, x, y, s, size=10, weight=None, anchor="start", opacity=None, fill=None):
        w = text_width(s, size, weight)
        x0 = x - w if anchor == "end" else x - w / 2 if anchor == "middle" else x

        def fn(dx, dy):
            a = f' font-size="{size:g}"' + (f' font-weight="{weight}"' if weight else "")
            a += f' text-anchor="{anchor}"' if anchor != "start" else ""
            a += f' fill="{fill}"' if fill else ""
            a += f' fill-opacity="{opacity}"' if opacity else ""
            return f'<text x="{r1(x + dx)}" y="{r1(y + dy)}"{a}>{esc(s)}</text>'

        self._add(fn, x0, y - size * 0.8, x0 + w, y + size * 0.25)

    def rect(self, x, y, w, h, fill, opacity=None, rx=None, stroke=None, sw=1, dash=None):
        def fn(dx, dy):
            a = f'<rect x="{r1(x + dx)}" y="{r1(y + dy)}" width="{r1(w)}" height="{r1(h)}"' + (f' rx="{rx}"' if rx else "")
            a += f' fill="{fill}"' if fill else ' fill="none"'
            a += f' fill-opacity="{opacity}"' if opacity is not None else ""
            if stroke:
                a += f' stroke="{stroke}" stroke-width="{sw}"' + (f' stroke-dasharray="{dash}"' if dash else "")
            return a + " />"

        self._add(fn, x, y, x + w, y + h)

    def line(self, x1, y1, x2, y2, color="currentColor", w=1, opacity=0.4, dash=None, cap=None):
        def fn(dx, dy):
            a = f'<path d="M{r1(x1 + dx)} {r1(y1 + dy)} L{r1(x2 + dx)} {r1(y2 + dy)}" fill="none" stroke="{color}" stroke-width="{w:g}" stroke-opacity="{opacity}"'
            a += f' stroke-dasharray="{dash}"' if dash else ""
            a += f' stroke-linecap="{cap}"' if cap else ""
            return a + " />"

        self._add(fn, min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2))

    def poly(self, pts, color, w=2, opacity=1):
        def fn(dx, dy):
            d = "M" + " L".join(f"{r1(x + dx)} {r1(y + dy)}" for x, y in pts)
            return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w:g}" stroke-opacity="{opacity}" stroke-linejoin="round" stroke-linecap="round" />'

        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        self._add(fn, min(xs), min(ys), max(xs), max(ys))

    def circle(self, x, y, r, fill, stroke=None, opacity=None):
        def fn(dx, dy):
            a = f'<circle cx="{r1(x + dx)}" cy="{r1(y + dy)}" r="{r}" fill="{fill}"' if fill else f'<circle cx="{r1(x + dx)}" cy="{r1(y + dy)}" r="{r}" fill="none"'
            a += f' fill-opacity="{opacity}"' if opacity is not None else ""
            a += f' stroke="{stroke}" stroke-width="2"' if stroke else ""
            return a + " />"

        self._add(fn, x - r, y - r, x + r, y + r)

    def render(self):
        x0 = min(e[1] for e in self.els)
        y0 = min(e[2] for e in self.els)
        x1 = max(e[3] for e in self.els)
        y1 = max(e[4] for e in self.els)
        if x1 - x0 > W - 2 * PAD + 0.5:
            raise ValueError(f"{self.sid}: the drawing is {x1 - x0:.0f} wide, the limit is {W - 2 * PAD}")
        dx = (W - (x1 - x0)) / 2 - x0 + self.nudge
        dy = PAD - y0
        h = round(y1 - y0 + 2 * PAD)
        t, d = f"{self.sid}-t", f"{self.sid}-d"
        return "\n".join([
            f'<svg viewBox="0 0 {W} {h}" width="{W}" role="img" aria-labelledby="{t} {d}">',
            f'<title id="{t}">{esc(self.title)}</title>',
            f'<desc id="{d}">{esc(self.desc)}</desc>',
            '<g fill="currentColor">', *[e[0](dx, dy) for e in self.els], "</g>", "</svg>",
        ])


class Axis:
    def __init__(self, d0, d1, p0, p1):
        self.d0, self.d1, self.p0, self.p1 = d0, d1, p0, p1

    def __call__(self, v):
        return self.p0 + (v - self.d0) * (self.p1 - self.p0) / (self.d1 - self.d0)


def cafe():
    con = duckdb.connect()
    con.execute((CAFE / "cafe-sales.sql").read_text())
    con.execute("""CREATE VIEW lines AS
        SELECT o.order_id, o.customer_id, o.store_id, CAST(o.ordered_at AS DATE) AS d, oi.product_id, oi.quantity,
               oi.quantity * p.unit_price_usd - oi.discount_usd AS amount,
               (CASE WHEN o.order_id = 2075 AND oi.product_id = 15 THEN 2 ELSE oi.quantity END) * p.unit_price_usd - oi.discount_usd AS amount_fix
        FROM orders o JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON p.product_id = oi.product_id
        WHERE o.status = 'completed'""")
    return con


def appevents():
    import os
    con = duckdb.connect()
    here = os.getcwd()
    os.chdir(APP)
    try:
        con.execute((APP / "app-events.sql").read_text())
    finally:
        os.chdir(here)
    return con


def title_line(s, text, x, y=0, size=10.5):
    s.text(x, y, text, size=size, weight=600)


MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]


def charts():
    out = {}
    c = cafe()

    # ---- da1: revenue by store and month, three small panels on one scale (completed orders, order 2075 as recorded) ----
    rows = c.execute("SELECT store_id, month(d) m, ROUND(SUM(amount), 2) FROM lines GROUP BY 1, 2 ORDER BY 1, 2").fetchall()
    by = {}
    for sid, m, rev in rows:
        by.setdefault(sid, {})[m] = float(rev)
    names = {1: ("Old Town", BLUE), 2: ("Campus", GREEN), 3: ("Harbor", PURPLE)}
    fmt = lambda sid: ", ".join(f"{by[sid][m]:,.2f}" for m in sorted(by[sid]))
    s = Svg("da1-stores", "Monthly revenue of the three cafes, January to June 2026",
            "Three small bar charts side by side on one scale from 0 to 2,000 dollars, one for each store, with a bar for each month from January to June. "
            f"Old Town in blue: {fmt(1)}. Campus in green: {fmt(2)}. "
            f"Harbor in purple has bars only for April, May and June, {fmt(3)}, because the store opened on April 1. "
            "Revenue counts completed orders only, and Old Town's May bar includes order 2075 as recorded.")
    Y = Axis(0, 2000, 150, 34)
    title_line(s, "Revenue by store and month (completed, US dollars)", 8, 10)
    for v in (0, 1000, 2000):
        s.text(26, Y(v) + 3.5, f"{v:,}", anchor="end", opacity=0.8)
    for pi, (sid, (label, col)) in enumerate(names.items()):
        x0 = 34 + pi * 100
        s.text(x0, 28 + 0, label, weight=600)
        for v in (0, 1000, 2000):
            s.line(x0, Y(v), x0 + 92, Y(v), opacity=0.5 if v == 0 else 0.15)
        for m in range(1, 7):
            cx = x0 + 7.7 + (m - 1) * 15.3
            s.text(cx, Y(0) + 14, MONTHS[m - 1][0], anchor="middle", opacity=0.8)
            if m in by[sid]:
                s.rect(cx - 5, Y(by[sid][m]), 10, Y(0) - Y(by[sid][m]), col, rx=2)
    s.text(34 + 2 * 100 + 2, Y(1500) - 2, "opens", opacity=0.85, size=10)
    s.text(34 + 2 * 100 + 2, Y(1500) + 11, "April 1", opacity=0.85, size=10)
    out["da1-stores"] = s.render()

    # ---- da2: bytes read, SELECT * against named columns (BigQuery logical bytes, estimated from types) ----
    full, three = 89283, 48599
    s = Svg("da2-bytes", "Logical bytes the preview query reads: all six columns of orders against three",
            f"Two horizontal bars on a scale from 0 to 100,000 bytes. SELECT star FROM orders reads about {full:,} bytes. Naming order_id, ordered_at and status reads about {three:,} bytes, "
            f"{100 * (full - three) / full:.0f} percent fewer. Both are estimates from the BigQuery data type sizes, and on a table that is not clustered a LIMIT clause does not change them.")
    X = Axis(0, 100000, 112, 300)
    title_line(s, "Bytes read by the preview query (estimate)", 8, 8)
    for i, (label, v, col) in enumerate((("SELECT * (6 columns)", full, OCHRE), ("3 named columns", three, BLUE))):
        y = 34 + i * 40
        s.text(8, y + 13, label)
        s.rect(X(0), y, X(v) - X(0), 18, col, rx=3)
        s.text(X(v) + 8, y + 13, f"{v:,}", weight=600)
    s.line(X(0), 106, X(100000), 106)
    for v in (0, 50000, 100000):
        s.line(X(v), 106, X(v), 110)
        s.text(X(v), 123, f"{v:,}", anchor="middle", opacity=0.8)
    s.text(X(100000), 140, "logical bytes", anchor="end", opacity=0.8)
    out["da2-bytes"] = s.render()

    # ---- da2: bytes read against bytes billed, three-table query and its five-table first draft ----
    # (numbers are filled in by cost_numbers() below, so the figure and the lesson text come from one place)
    cn = cost_numbers(c)
    s = Svg("da2-billed", "Bytes read against the 10 MB minimum per table, for a three-table query and its five-table first draft",
            f"Two horizontal bars on a scale from 0 to 60 MB. The three-table query reads about {cn['q2_read']:,} bytes but is billed at least {3 * 10} MB, 10 MB for each table it references. "
            f"The first draft joins two more tables it does not need, reads about {cn['q3_read']:,} bytes (a join key counts in both tables) and is billed at least {5 * 10} MB. The bytes actually read are too small to see on this scale.")
    X = Axis(0, 60, 112, 300)
    title_line(s, "Billed minimum, MB (10 MB per table referenced)", 8, 8)
    for i, (label, n) in enumerate((("3 tables", 3), ("5 tables (first draft)", 5))):
        y = 34 + i * 40
        s.text(8, y + 13, label)
        s.rect(X(0), y, X(10 * n) - X(0), 18, OCHRE if n == 5 else BLUE, rx=3)
        s.text(X(10 * n) + 8, y + 13, f"{10 * n} MB", weight=600)
    s.line(X(0), 106, X(60), 106)
    for v in (0, 20, 40, 60):
        s.line(X(v), 106, X(v), 110)
        s.text(X(v), 123, str(v), anchor="middle", opacity=0.8)
    s.text(X(60), 140, "megabytes (MB)", anchor="end", opacity=0.8)
    out["da2-billed"] = s.render()

    # ---- da3: Pareto of the 15 sold products by revenue (order 2075 as recorded) ----
    rev = c.execute("""WITH r AS (SELECT p.product_name, SUM(l.amount) AS revenue FROM lines l JOIN products p ON p.product_id = l.product_id GROUP BY 1)
        SELECT product_name, revenue, 100.0 * SUM(revenue) OVER (ORDER BY revenue DESC, product_name ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) / SUM(revenue) OVER () AS cum
        FROM r ORDER BY revenue DESC, product_name""").fetchall()
    cum = [float(r[2]) for r in rev]
    n80 = next(i for i, v in enumerate(cum, start=1) if v >= 80)
    s = Svg("da3-pareto", "Cumulative share of revenue by product rank, 15 products",
            f"A line chart of the cumulative share of revenue, from 0 to 100 percent, against the rank of the product, 1 to 15, best seller first. The line rises from {cum[0]:.0f} percent for Latte "
            f"and stays close to the gray diagonal that would mean equal sales for every product. It crosses 80 percent at product {n80} of 15, and reaches 100 percent at product 15. "
            "Revenue counts completed orders and includes order 2075 as recorded.")
    X, Y = Axis(0, 15, 56, 322), Axis(0, 100, 190, 30)
    title_line(s, "Cumulative share of revenue, by product rank", 8, 10)
    for v in (0, 20, 40, 60, 80, 100):
        s.line(X(0), Y(v), X(15), Y(v), opacity=0.5 if v == 0 else 0.12)
        s.text(X(0) - 6, Y(v) + 3.5, f"{v}%", anchor="end", opacity=0.8)
    s.line(X(0), Y(0), X(15), Y(100), opacity=0.45, dash="4 3")
    s.text(X(15), Y(24), "same share for every product", opacity=0.85, anchor="end")
    s.line(X(0), Y(80), X(15), Y(80), color=OCHRE, w=1.5, opacity=0.9, dash="5 3")
    pts = [(X(0), Y(0))] + [(X(i), Y(v)) for i, v in enumerate(cum, start=1)]
    s.poly(pts, BLUE, w=2)
    for i, v in enumerate(cum, start=1):
        s.circle(X(i), Y(v), 4 if i != n80 else 5, BLUE if i != n80 else OCHRE)
    s.text(X(0) + 10, Y(95), f"{n80} of 15 products", weight=600)
    s.text(X(0) + 10, Y(95) + 13, "are needed to reach 80%", weight=600)
    s.line(X(5.6), Y(93), X(n80) - 6, Y(cum[n80 - 1]) - 3, opacity=0.6)
    for i in (1, 5, 10, 15):
        s.text(X(i), Y(0) + 18, str(i), anchor="middle", opacity=0.8)
    s.text(X(15), Y(0) + 32, "product rank, best seller first", anchor="end", opacity=0.8)
    out["da3-pareto"] = s.render()

    # ---- da3: revenue share by RFM segment ----
    seg = c.execute(RFM_SEGMENTS).fetchall()  # segment, n, revenue, share
    seg.sort(key=lambda r: -float(r[3]))
    s = Svg("da3-rfm", "Share of revenue by customer segment, 144 customers with a completed order",
            "A horizontal bar chart of the share of revenue by segment, on a scale from 0 to 50 percent: " + "; ".join(f"{r[0]} {float(r[3]):.1f} percent from {r[1]} customers" for r in seg)
            + ". Segments come from recency, frequency and monetary terciles as of July 1, 2026, plus a new-customer label. Revenue includes order 2075 as recorded.")
    X = Axis(0, 50, 84, 264)
    title_line(s, "Revenue share by segment (number of customers)", 8, 8)
    for i, r in enumerate(seg):
        y = 30 + i * 30
        col = OCHRE if r[0] == "slipping" else BLUE
        s.text(8, y + 13, r[0], weight=600 if r[0] == "slipping" else None)
        s.rect(X(0), y, X(float(r[3])) - X(0), 16, col, rx=3)
        s.text(X(float(r[3])) + 8, y + 12.5, f"{float(r[3]):.1f}% ({r[1]})")
    base = 30 + len(seg) * 30
    s.line(X(0), base, X(50), base)
    for v in (0, 10, 20, 30, 40, 50):
        s.line(X(v), base, X(v), base + 4)
        s.text(X(v), base + 17, f"{v}%", anchor="middle", opacity=0.8)
    out["da3-rfm"] = s.render()

    # ---- da4: weekly revenue, the last eight weeks, the last one incomplete ----
    wk = c.execute("""SELECT date_trunc('week', d) AS wk, COUNT(DISTINCT d) AS n_days, ROUND(SUM(amount), 2) AS rev FROM lines GROUP BY 1 ORDER BY 1 DESC LIMIT 8""").fetchall()[::-1]
    s = Svg("da4-weekly", "Weekly revenue for the last eight weeks of the data; the last week has only two days",
            f"A bar chart of weekly revenue from 0 to 1,400 dollars for the eight weeks starting {wk[0][0]:%B} {wk[0][0].day} to {wk[-1][0]:%B} {wk[-1][0].day}. The first seven bars are full weeks of seven days, between {min(float(w[2]) for w in wk[:-1]):,.0f} and {max(float(w[2]) for w in wk[:-1]):,.0f} dollars. "
            f"The last bar, the week starting June 29, has {wk[-1][1]} days of data and {float(wk[-1][2]):,.2f} dollars, and is drawn dashed. Revenue counts completed orders and includes order 2075 as recorded.")
    X0, X1 = 44, 262
    slot = (X1 - X0) / len(wk)
    Y = Axis(0, 1400, 170, 30)
    title_line(s, "Weekly revenue, weeks starting Monday (US dollars)", 8, 10)
    for v in (0, 400, 800, 1200):
        s.line(X0 - 4, Y(v), X1, Y(v), opacity=0.5 if v == 0 else 0.15)
        s.text(X0 - 10, Y(v) + 3.5, f"{v:,}", anchor="end", opacity=0.8)
    for i, (w0, nd, rv) in enumerate(wk):
        cx = X0 + slot * (i + 0.5)
        last = i == len(wk) - 1
        if last:
            s.rect(cx - 9, Y(float(rv)), 18, Y(0) - Y(float(rv)), None, stroke=OCHRE, sw=2, dash="4 3", rx=3)
        else:
            s.rect(cx - 9, Y(float(rv)), 18, Y(0) - Y(float(rv)), BLUE, rx=3)
        s.text(cx, Y(0) + 15, f"{w0:%b}", anchor="middle", opacity=0.8, size=9.5)
        s.text(cx, Y(0) + 27, f"{w0.day}", anchor="middle", opacity=0.8, size=9.5)
    cx = X0 + slot * (len(wk) - 0.5)
    s.text(cx + 16, Y(float(wk[-1][2])) - 14, "2 of 7 days", weight=600)
    s.text(cx + 16, Y(float(wk[-1][2])) - 1, f"${float(wk[-1][2]):,.0f}")
    out["da4-weekly"] = s.render()

    # ---- da4: 7-day moving average around order 2075 ----
    dly = c.execute("""WITH d AS (SELECT d, SUM(amount) AS rec, SUM(amount_fix) AS fix FROM lines GROUP BY 1),
        r AS (SELECT d, rec, fix, AVG(rec) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS a_rec, AVG(fix) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS a_fix FROM d)
        SELECT d, rec, a_rec, a_fix FROM r WHERE d BETWEEN DATE '2026-04-22' AND DATE '2026-05-20' ORDER BY d""").fetchall()
    s = Svg("da4-rolling", "Daily revenue and its 7-day moving average around May 1, with and without the extra zero of order 2075",
            "A chart from April 22 to May 20 on a scale from 50 to 350 dollars. Gray dots are the daily revenue as recorded; May 1 is the highest of the first weeks at 305.50 dollars. A blue line is the 7-day moving average as recorded, "
            "which jumps on May 1 and stays above the green line for seven days, from May 1 to May 7. A green line is the same average with order 2075 corrected to a quantity of 2; it is drawn only for the days around the correction. "
            "The two averages differ on exactly seven days, May 1 to May 7, and agree before and after.")
    X, Y = Axis(0, len(dly) - 1, 46, 312), Axis(50, 350, 184, 34)
    title_line(s, "Daily revenue and 7-day moving average (US dollars)", 8, 10)
    for v in (100, 200, 300):
        s.line(X(0) - 4, Y(v), X(len(dly) - 1) + 4, Y(v), opacity=0.15)
        s.text(X(0) - 10, Y(v) + 3.5, str(v), anchor="end", opacity=0.8)
    s.line(X(0) - 4, Y(50), X(len(dly) - 1) + 4, Y(50), opacity=0.5)
    s.text(X(0) - 10, Y(50) + 3.5, "50", anchor="end", opacity=0.8)
    for i, (d, rec, a_rec, a_fix) in enumerate(dly):
        s.circle(X(i), Y(float(rec)), 3, "currentColor", opacity=0.35)
    s.poly([(X(i), Y(float(r[2]))) for i, r in enumerate(dly)], BLUE, w=2)
    start = next(i for i, r in enumerate(dly) if (r[0].month, r[0].day) == (4, 29))
    end = next(i for i, r in enumerate(dly) if (r[0].month, r[0].day) == (5, 9))
    s.poly([(X(i), Y(float(dly[i][3]))) for i in range(start, end + 1)], GREEN, w=2)
    i1 = next(i for i, r in enumerate(dly) if (r[0].month, r[0].day) == (5, 1))
    s.text(X(i1) - 8, Y(float(dly[i1][1])) + 3.5, "May 1: order 2075", anchor="end", weight=600)
    for i in (0, 9, 19, 28):
        d = dly[i][0]
        s.text(X(i), Y(50) + 15, f"{d:%b} {d.day}", anchor="middle", opacity=0.8)
    s.text(X(len(dly) - 1), Y(50) + 29, "axis starts at 50", anchor="end", opacity=0.7, size=9.5)
    lx = X(0) - 4
    s.line(lx, Y(50) + 47, lx + 14, Y(50) + 47, color=BLUE, w=2, opacity=1)
    s.text(lx + 20, Y(50) + 51, "average as recorded")
    s.line(lx + 138, Y(50) + 47, lx + 152, Y(50) + 47, color=GREEN, w=2, opacity=1)
    s.text(lx + 158, Y(50) + 51, "corrected")
    s.circle(lx + 222, Y(50) + 47, 3, "currentColor", opacity=0.35)
    s.text(lx + 230, Y(50) + 51, "a day")
    out["da4-rolling"] = s.render()

    # ---- da4: observed against the weekday expectation, by month (order 2075 corrected) ----
    idx = c.execute("""WITH sd AS (SELECT d, store_id, SUM(amount_fix) AS fix FROM lines GROUP BY 1, 2),
        dow AS (SELECT dayofweek(d) AS w, AVG(fix) AS e FROM sd GROUP BY 1)
        SELECT month(sd.d) AS m, 100.0 * SUM(sd.fix) / SUM(dow.e) AS idx FROM sd JOIN dow ON dow.w = dayofweek(sd.d) GROUP BY 1 ORDER BY 1""").fetchall()
    s = Svg("da4-index", "Revenue per store-day against what the weekday mix predicts, by month, January to June",
            "A chart of six monthly values on a scale from 90 to 110, where 100 means the month earned what its mix of weekdays predicts. " + ", ".join(f"{MONTHS[int(m) - 1]} {float(v):.1f}" for m, v in idx)
            + ". Stems run from the line at 100 to each value. May is the highest, June is within half a point of 100. Order 2075 is corrected to a quantity of 2.")
    X, Y = Axis(0, 5, 66, 296), Axis(90, 110, 160, 36)
    title_line(s, "Revenue against the weekday expectation", 8, 10)
    for v in (90, 95, 100, 105, 110):
        s.line(X(0) - 20, Y(v), X(5) + 20, Y(v), opacity=0.55 if v == 100 else 0.12)
        s.text(X(0) - 26, Y(v) + 3.5, str(v), anchor="end", opacity=0.8)
    for (m, v) in idx:
        i = int(m) - 1
        v = float(v)
        col = OCHRE if i == 5 else BLUE
        s.line(X(i), Y(100), X(i), Y(v), color=col, w=2, opacity=1, cap="round")
        s.circle(X(i), Y(v), 5, col)
        s.text(X(i), Y(v) - 10 if v >= 100 else Y(v) + 19, f"{v:.1f}", anchor="middle", weight=600 if i == 5 else None)
        s.text(X(i), Y(90) + 18, MONTHS[i], anchor="middle", opacity=0.8)
    s.text(X(5) + 20, Y(90) + 34, "100 = what the weekday mix predicts", anchor="end", opacity=0.8)
    out["da4-index"] = s.render()

    # ---- da5: retention by age window, three groups of channels (app-events) ----
    a = appevents()
    a.execute("""CREATE VIEW act AS SELECT DISTINCT user_id, CAST(event_ts AS DATE) AS d FROM events WHERE event_name IN ('session_start', 'add_expense')""")
    ret = a.execute("""WITH cells AS (
        SELECT CASE WHEN u.channel = 'paid_social' THEN 'paid_social' ELSE 'others' END AS grp, k.age,
               EXISTS (SELECT 1 FROM act x WHERE x.user_id = u.user_id AND x.d BETWEEN u.signup_date + 30 * k.age AND u.signup_date + 30 * k.age + 29) AS active
        FROM users u CROSS JOIN (SELECT UNNEST([1, 2, 3]) AS age) k
        WHERE u.signup_date + 30 * (k.age + 1) <= DATE '2026-07-01')
        SELECT grp, age, COUNT(*) AS people, 100.0 * AVG(active::INT) AS pct FROM cells GROUP BY 1, 2 ORDER BY 1, 2""").fetchall()
    rr = {}
    for g, age, n, pct in ret:
        rr.setdefault(g, {})[age] = (n, float(pct))
    s = Svg("da5-retention", "Share of people active in each 30-day window after signup, by channel group",
            "A line chart on a scale from 0 to 20 percent with three windows after signup: days 30 to 59, 60 to 89 and 90 to 119. " + "; ".join(
                f"{g.replace('_', ' ')} {rr[g][1][1]:.1f}, {rr[g][2][1]:.1f} and {rr[g][3][1]:.1f} percent" for g in ("others", "paid_social"))
            + ". Both fall with age, and paid social is lowest in every window. Others means every channel except paid social. A person counts in a window only when the whole window ended before July 1, 2026.")
    X, Y = Axis(0, 2, 66, 190), Axis(0, 20, 170, 36)
    title_line(s, "People active in each 30-day window after signup", 8, 10)
    for v in (0, 5, 10, 15, 20):
        s.line(X(0) - 12, Y(v), X(2) + 12, Y(v), opacity=0.5 if v == 0 else 0.15)
        s.text(X(0) - 20, Y(v) + 3.5, f"{v}%", anchor="end", opacity=0.8)
    for i, lab in enumerate(("days 30-59", "days 60-89", "days 90-119")):
        s.text(X(i), Y(0) + 17, lab, anchor="middle", opacity=0.8)
    cols = {"others": BLUE, "paid_social": PURPLE}
    labs = {"others": "everyone else", "paid_social": "paid social"}
    for g in ("others", "paid_social"):
        pts = [(X(i), Y(rr[g][i + 1][1])) for i in range(3)]
        s.poly(pts, cols[g], w=2)
        for px, py in pts:
            s.circle(px, py, 4, cols[g])
        s.text(X(2) + 14, Y(rr[g][3][1]) + 3.5, f"{labs[g]} {rr[g][3][1]:.1f}%")
        s.text(X(0), Y(rr[g][1][1]) - 9, f"{rr[g][1][1]:.1f}%", anchor="middle", size=10)
    s.nudge = 0.85  # measured in a browser: the right margin was 1.7 wider
    out["da5-retention"] = s.render()

    # ---- da5: LTV against CAC per monthly-plan buyer, by channel (app-events, README ad-cost assumptions) ----
    ch = channel_table(a)
    order = ["referral", "organic_search", "app_store", "paid_search", "paid_social"]
    s = Svg("da5-ltv", "Lifetime value and acquisition cost for each monthly-plan buyer, by channel",
            "A horizontal bar chart in dollars, from 0 to 80. For each of five channels a green bar is the lifetime value of a monthly-plan buyer and an ochre bar is the cost to win one. "
            + "; ".join(f"{k.replace('_', ' ')}: value {ch[k]['ltv']:.0f}" + (f", cost {ch[k]['cac_buyer']:.0f}, ratio {ch[k]['ratio']:.1f}" if ch[k]['cac_buyer'] is not None else ", no ad cost assumed, ratio undefined") for k in order)
            + ". Ad costs are fictional assumptions written in the dataset notes, and lifetime value assumes a constant monthly churn.")
    X = Axis(0, 80, 96, 250)
    title_line(s, "Value of a monthly-plan buyer and cost to win one", 8, 10)
    for i, k in enumerate(order):
        y = 30 + i * 44
        s.text(8, y + 20, k.replace("_", " "), weight=600)
        s.rect(X(0), y, X(ch[k]["ltv"]) - X(0), 14, GREEN, rx=3)
        s.text(X(ch[k]["ltv"]) + 6, y + 11, f"${ch[k]['ltv']:.0f}")
        if ch[k]["cac_buyer"] is not None:
            s.rect(X(0), y + 18, X(ch[k]["cac_buyer"]) - X(0), 14, OCHRE, rx=3)
            s.text(X(ch[k]["cac_buyer"]) + 6, y + 29, f"${ch[k]['cac_buyer']:.0f}, ratio {ch[k]['ratio']:.1f}", weight=600)
        else:
            s.text(X(0) + 2, y + 29, "no ad cost assumed", opacity=0.85)
    base = 30 + len(order) * 44
    s.line(X(0), base, X(80), base)
    for v in (0, 20, 40, 60, 80):
        s.line(X(v), base, X(v), base + 4)
        s.text(X(v), base + 17, f"${v}", anchor="middle", opacity=0.8)
    s.rect(X(0), base + 30, 10, 10, GREEN, rx=2)
    s.text(X(0) + 16, base + 39, "lifetime value")
    s.rect(X(0) + 108, base + 30, 10, 10, OCHRE, rx=2)
    s.text(X(0) + 124, base + 39, "cost to win a buyer")
    out["da5-ltv"] = s.render()
    return out


RFM_SEGMENTS = """
WITH per_customer AS (
  SELECT o.customer_id,
         DATE_DIFF('day', MAX(CAST(o.ordered_at AS DATE)), DATE '2026-07-01') AS recency_days,
         COUNT(DISTINCT o.order_id) AS orders,
         SUM(oi.quantity * p.unit_price_usd - oi.discount_usd) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN products p ON p.product_id = oi.product_id
  WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
  GROUP BY o.customer_id
),
scored AS (
  SELECT *,
         NTILE(3) OVER (ORDER BY recency_days DESC, customer_id) AS r,
         NTILE(3) OVER (ORDER BY orders, customer_id) AS f,
         NTILE(3) OVER (ORDER BY revenue, customer_id) AS m
  FROM per_customer
),
labeled AS (
  SELECT s.*,
         CASE WHEN c.signup_date >= DATE '2026-05-02' THEN 'new'
              WHEN s.r = 3 AND s.f = 3 AND s.m = 3 THEN 'champion'
              WHEN s.r = 1 AND s.f >= 2 THEN 'slipping'
              WHEN s.f = 1 THEN 'light'
              ELSE 'steady' END AS segment
  FROM scored s JOIN customers c ON c.customer_id = s.customer_id
)
SELECT segment, COUNT(*) AS customers, ROUND(SUM(revenue), 2) AS revenue,
       ROUND(100.0 * SUM(revenue) / SUM(SUM(revenue)) OVER (), 1) AS share
FROM labeled GROUP BY segment ORDER BY revenue DESC
"""

PRICE_PER_TIB, TIB = 6.25, 2**40


def bq_bytes(con, table, columns):
    """Logical bytes BigQuery would count for `columns` of a cafe-sales table, from the data type sizes of the BigQuery docs
    (INT64, FLOAT64, DATE, TIMESTAMP 8 bytes; STRING 2 bytes plus its UTF-8 size; NULL 0). Auto-detect is assumed to give
    INT64 for whole numbers, FLOAT64 for the prices and discounts, DATE, TIMESTAMP and STRING."""
    kinds = {
        "stores": {"store_id": "i", "store_name": "s", "city": "s", "opened_on": "d"},
        "customers": {"customer_id": "i", "signup_date": "d", "city": "s", "loyalty_tier": "s", "referred_by": "i"},
        "products": {"product_id": "i", "product_name": "s", "category": "s", "unit_price_usd": "f"},
        "orders": {"order_id": "i", "customer_id": "i", "store_id": "i", "ordered_at": "t", "status": "s", "payment_method": "s"},
        "order_items": {"order_item_id": "i", "order_id": "i", "product_id": "i", "quantity": "i", "discount_usd": "f"},
    }[table]
    total = 0
    for col in columns:
        k = kinds[col]
        if k == "s":
            total += con.execute(f"SELECT COALESCE(SUM(2 + strlen({col})), 0) FROM {table} WHERE {col} IS NOT NULL").fetchone()[0]
        else:
            total += 8 * con.execute(f"SELECT COUNT({col}) FROM {table}").fetchone()[0]
    return int(total)


def cost_numbers(con):
    q2 = {"orders": ["order_id", "ordered_at", "status"], "order_items": ["order_id", "product_id", "quantity", "discount_usd"], "products": ["product_id", "category", "unit_price_usd"]}
    # the first draft also joins stores and customers: their join keys count on both sides (orders.store_id and orders.customer_id
    # as well as stores.store_id and customers.customer_id), plus one more column read from each new table
    q3 = dict(q2, stores=["store_id", "store_name"], customers=["customer_id", "loyalty_tier"])
    q3["orders"] = q2["orders"] + ["store_id", "customer_id"]
    return {
        "q2_read": sum(bq_bytes(con, t, cols) for t, cols in q2.items()),
        "q3_read": sum(bq_bytes(con, t, cols) for t, cols in q3.items()),
    }


def channel_table(a):
    """Lifetime value and cost to win a monthly-plan buyer for each channel. Ad cost per signup: the fictional assumptions of the
    app-events README ($4.50 paid search, $2.00 paid social, $3.00 referral, $0 organic search and app store)."""
    a.execute("""CREATE OR REPLACE VIEW latest AS SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY subscription_id ORDER BY updated_at DESC) AS rn FROM subscriptions) WHERE rn = 1""")
    a.execute("""CREATE OR REPLACE VIEW starts AS SELECT subscription_id, MIN_BY(plan, updated_at) AS plan_at_start FROM subscriptions GROUP BY 1""")
    a.execute("""CREATE OR REPLACE VIEW subs AS SELECT l.subscription_id, l.user_id, s.plan_at_start, l.started_on, l.ended_on, u.channel, u.signup_date
                 FROM latest l JOIN starts s USING (subscription_id) JOIN users u USING (user_id)""")
    churn = {r[0]: float(r[1]) for r in a.execute("""
        WITH h AS (SELECT channel, k.k, COUNT(*) AS at_risk,
                          COUNT(*) FILTER (WHERE ended_on IS NOT NULL AND DATE_DIFF('day', started_on, ended_on) <= 30 * k.k) AS canceled
                   FROM subs CROSS JOIN (SELECT UNNEST([1, 2, 3, 4, 5]) AS k) k
                   WHERE plan_at_start = 'plus_monthly' AND started_on + 30 * k.k <= DATE '2026-06-30'
                     AND (ended_on IS NULL OR DATE_DIFF('day', started_on, ended_on) > 30 * (k.k - 1))
                   GROUP BY 1, 2)
        SELECT channel, SUM(canceled)::DOUBLE / SUM(at_risk) FROM h GROUP BY 1""").fetchall()}
    conv = {r[0]: float(r[1]) for r in a.execute("""
        WITH u AS (SELECT user_id, channel, signup_date FROM users WHERE signup_date <= DATE '2026-06-16')
        SELECT channel, AVG(EXISTS (SELECT 1 FROM subs s WHERE s.user_id = u.user_id AND s.plan_at_start = 'plus_monthly' AND s.started_on <= u.signup_date + 14)::INT)::DOUBLE
        FROM u GROUP BY 1""").fetchall()}
    cost = {"referral": 3.00, "paid_search": 4.50, "paid_social": 2.00, "organic_search": 0.0, "app_store": 0.0}
    out = {}
    for k in cost:
        ltv = 7.99 / churn[k]
        cac = cost[k] / conv[k] if cost[k] else None
        out[k] = {"churn": churn[k], "conv": conv[k], "ltv": ltv, "cac_buyer": cac, "ratio": ltv / cac if cac else None}
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
