"""Draws the static charts of the first five lessons of the Data Engineer database-internals deep dive (plans and operators, indexes, join
algorithms, storage shapes, transactions).

    python3 scripts/charts/de-deep-dive-1.py --out DIR     write every chart as DIR/<name>.svg
    python3 scripts/charts/de-deep-dive-1.py --paste       put every chart into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/de-deep-dive-1.py --check       exit 1 unless every chart appears, byte for byte, in its lesson, and every number it
                                                           draws appears in the lesson's text

Needs duckdb only because it imports the Svg class, the text widths and the figure colors of da-batch-1.py (plain SVG with currentColor text, blue,
green, purple, ochre in that fixed order, a title and a desc, each tag on its own line, every drawing centered in its viewBox). Colors follow the
entity (an engine, a join method), never the rank; ochre is below 3:1 on the light surface, so it is not used here.

Every number below was measured by a script of scripts/de-internals/ on one Linux machine (PostgreSQL 16.15, DuckDB 2.0.0, SQLite 3.53.1) and is
copied into the DATA block with its source named; times are medians of seven runs and move with the machine. Rerun --paste when a number changes.
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
    spec.loader.exec_module(mod)
    return mod


b1 = load("da_batch_1", HERE / "da-batch-1.py")
Svg, Axis, BLUE, GREEN, PURPLE, ROOT = b1.Svg, b1.Axis, b1.BLUE, b1.GREEN, b1.PURPLE, b1.ROOT
DOCS = ROOT / "src" / "content" / "docs" / "data-engineer"
LESSONS = {"dd1": DOCS / "query-plans-and-operators.mdx", "dd2": DOCS / "indexes-honestly.mdx", "dd3": DOCS / "join-algorithms.mdx",
           "dd4": DOCS / "rows-columns-and-files.mdx", "dd5": DOCS / "transactions-and-isolation.mdx"}

# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DATA
# dd1: the Harbor query of unit 3 in the two written orders (EXPLAIN ANALYZE, PostgreSQL 16.15, join_collapse_limit = 1): rows the lower join sends up.
JOIN_ORDER = [("orders first", "orders, order_items, then products", 645, 112.24), ("items first", "order_items, products, then orders", 3287, 121.01)]
# dd2: bt_page_stats and bt_page_items of orders_pkey (1,800 keys, order_id 1001 to 2800): root block 3, leaves 1, 2, 4, 5, 6; the walk to key 1900.
LEAVES = [(1, "1001", "1366"), (2, "1367", "1732"), (4, "1733", "2098"), (5, "2099", "2464"), (6, "2465", "2800")]
ROOT_KEYS = ["", "1367", "1733", "2099", "2465"]
# dd2: scripts/de-internals/index_sweep.sql: tables cut from orders_big, a lookup of one primary key; cost of a sequential scan and of the forced index plan.
SWEEP = [(10, 1.12, 8.15), (30, 1.38, 8.15), (100, 2.25, 8.16), (300, 7.75, 8.17), (1000, 28.50, 8.29), (3000, 69.50, 8.30),
         (10000, 253.00, 8.30), (100000, 2146.00, 8.31)]
# dd3: scripts/de-internals/join_windows.py, median ms of seven runs; the join node the planner chose on its own for each window.
WINDOWS = [("1 day", 2.6, 57.0, 31.8, "nested loop"), ("3 days", 9.4, 56.5, 36.2, "hash"), ("1 week", 19.4, 81.7, 42.3, "hash"),
           ("31 days", 103.3, 115.5, 72.5, "hash"), ("all orders", 426.1, 306.0, 216.1, "hash")]
# dd4: storage_shapes.py bytes (Parquet written by DuckDB 2.0.0 from the 950,414 lines): compressed bytes of each column.
COLUMN_BYTES = [("ordered_at", 3899309), ("order_item_id", 3802042), ("customer_id", 2555014), ("order_id", 2353718), ("product_id", 479938),
                ("unit_price_usd", 479883), ("store_id", 242825), ("payment_method", 241598), ("quantity", 237570), ("channel", 124668),
                ("discount_usd", 76353), ("status", 6168)]
NEEDED = {"unit_price_usd", "store_id", "quantity", "discount_usd", "status"}
# dd4: storage_shapes.py aggregation and lookup, first run of each (ms): the aggregation is a median of seven runs, the lookup a mean of 2,000.
AGG = [("DuckDB", 7.7), ("PostgreSQL", 332.9), ("SQLite", 338.1)]
LOOKUP = [("SQLite", 0.017), ("PostgreSQL", 0.153), ("DuckDB", 0.967)]
ENGINE_COLOR = {"DuckDB": BLUE, "PostgreSQL": GREEN, "SQLite": PURPLE}
# dd5: the two transcripts of unit 3 (what session A reads: order 1580's status and the count of store 3).
MOMENTS = [("Read Committed", [("completed", 355), ("canceled", 356), ("canceled", 356)]),
           ("Repeatable Read", [("completed", 355), ("completed", 355), ("canceled", 356)])]


def title_line(s, text, x, y=0, size=10.5):
    s.text(x, y, text, size=size, weight=600)


def log_axis(d0, d1, p0, p1):
    a, b = math.log10(d0), math.log10(d1)
    return lambda v: p0 + (math.log10(v) - a) * (p1 - p0) / (b - a)


def fmt(v):
    return f"{v:,.1f}" if v >= 1 else f"{v:g}"


def charts():
    out = {}

    # ---- dd1-join-order: rows leaving the lower join, two written orders ----
    a, b = JOIN_ORDER
    s = Svg("dd1-join-order", "Rows the lower join sends up, for the same query written in two join orders",
            f"Two horizontal bars on a scale of rows. When the query starts from orders, the lower join sends up {a[2]} rows and the plan costs {a[3]}. "
            f"When it starts from order_items and products, the lower join sends up {b[2]:,} rows and the plan costs {b[3]}. Both queries return the same four rows.")
    X = Axis(0, 5000, 14, 250)
    title_line(s, "Rows sent up by the lower join (Harbor, units sold by category)", 8, 10)
    for i, (label, order, rows, cost) in enumerate(JOIN_ORDER):
        y = 40 + i * 52
        s.text(14, y, f"{label}: {order}")
        s.rect(X(0), y + 8, X(rows) - X(0), 18, BLUE if i == 0 else GREEN, rx=3)
        s.text(X(rows) + 8, y + 21, f"{rows:,} rows, cost {cost}", weight=600)
    s.line(X(0), 36, X(0), 108, opacity=0.5)
    out["dd1-join-order"] = s.render()

    # ---- dd2-btree: the index of orders, root and five leaves, and the walk to key 1900 ----
    s = Svg("dd2-btree", "The index behind orders.order_id: a root page and five leaf pages, and the walk to key 1900",
            "A tree with one root page at the top and five leaf pages below it. The root holds five entries: the first has no key, and the others hold the first keys "
            "1367, 1733, 2099 and 2465 of the leaf pages they point to. The leaf pages are blocks 1, 2, 4, 5 and 6 and hold the keys 1001 to 1366, 1367 to 1732, "
            "1733 to 2098, 2099 to 2464 and 2465 to 2800. A highlighted path runs from the root entry 1733 to leaf block 4, and from there to row 89 of table block 7, "
            "where order 1900 is stored.")
    title_line(s, "Index on order_id: root and leaves", 8, 10)
    x0, w = 16, 60
    s.text(x0, 30, "root page (block 3)", opacity=0.85)
    for i, k in enumerate(ROOT_KEYS):
        hit = i == 2
        s.rect(x0 + i * w, 36, w - 2, 24, BLUE if hit else "currentColor", opacity=0.9 if hit else 0.12, rx=3)
        s.text(x0 + i * w + (w - 2) / 2, 52, k or "none", anchor="middle", weight=600 if hit else None, fill="#ffffff" if hit else None, opacity=None if hit else 0.9)
    for i, (blk, lo, hi) in enumerate(LEAVES):
        hit = i == 2
        cx = x0 + i * w + (w - 2) / 2
        s.line(cx, 60, cx, 96, color=BLUE if hit else "currentColor", w=2.5 if hit else 1, opacity=1 if hit else 0.4)
        s.rect(x0 + i * w, 96, w - 2, 40, None, rx=3, stroke=BLUE if hit else "currentColor", sw=2 if hit else 1)
        s.text(cx, 111, f"block {blk}", anchor="middle", weight=600 if hit else None)
        s.text(cx, 126, f"{lo}–{hi}", anchor="middle", opacity=0.9)
    cx = x0 + 2 * w + (w - 2) / 2
    s.line(cx, 136, cx, 160, color=BLUE, w=2.5, opacity=1)
    s.rect(x0 + 2 * w - 36, 160, 134, 22, None, rx=3, stroke=BLUE, sw=2)
    s.text(x0 + 2 * w + 31, 175, "table block 7, row 89", anchor="middle", weight=600)
    out["dd2-btree"] = s.render()

    # ---- dd2-sweep: the price of a scan and of an index lookup as the table grows ----
    s = Svg("dd2-sweep", "The planner's cost of a sequential scan and of an index lookup for one primary key, as the table grows from 10 to 100,000 rows",
            "A chart with both axes on a log scale: the table's rows from 10 to 100,000 across, the planner's estimated cost from 1 to 3,000 up. The cost of a sequential "
            "scan climbs from 1.12 at 10 rows through 7.75 at 300 rows and 28.50 at 1,000 rows to 2,146 at 100,000 rows. The cost of the index lookup stays between 8.15 and "
            "8.31 over the whole range. The two lines cross between 300 and 350 rows, where the planner's choice changes from the scan to the index.")
    X, Y = log_axis(10, 100000, 52, 306), log_axis(1, 3000, 176, 34)
    title_line(s, "Planner cost of one primary-key lookup, by table size", 8, 10)
    for v in (1, 10, 100, 1000):
        s.line(52, Y(v), 306, Y(v), opacity=0.5 if v == 1 else 0.13)
        s.text(46, Y(v) + 3.5, f"{v:,}", anchor="end", opacity=0.8)
    for v in (10, 100, 1000, 10000, 100000):
        s.line(X(v), 176, X(v), 180)
        s.text(X(v), 193, f"{v:,}", anchor="middle", opacity=0.8)
    s.text(306, 208, "rows in the table", anchor="end", opacity=0.8)
    for lx, (name, col) in zip((52, 130), (("table scan", BLUE), ("index lookup", GREEN))):
        s.rect(lx, 21, 8, 8, col, rx=2)
        s.text(lx + 12, 29, name, size=10)
    s.line(X(325), 40, X(325), 176, opacity=0.45, dash="3 3")
    s.text(X(325) - 4, 46, "switch near 300 to 350 rows", anchor="end", opacity=0.9)
    s.poly([(X(n), Y(c)) for n, c, _ in SWEEP], BLUE, w=2.2)
    s.poly([(X(n), Y(c)) for n, _, c in SWEEP], GREEN, w=2.2)
    for n, c1, c2 in SWEEP:
        s.circle(X(n), Y(c1), 3, BLUE)
        s.circle(X(n), Y(c2), 3, GREEN)
    out["dd2-sweep"] = s.render()

    # ---- dd3-windows: the three join methods on five windows of orders ----
    s = Svg("dd3-windows", "Run time of the three join methods on five windows of orders, median of seven runs, and the method the planner chose",
            "Five groups of three bars on a log scale of milliseconds from 1 to 1,000, one group for each window of orders. "
            + " ".join(f"{w}: nested loop {nl:g} ms, hash {h:g} ms, merge {m:g} ms, the planner chose {pick}." for w, nl, h, m, pick in WINDOWS)
            + " The nested loop is fastest for one day, three days and a week, and the merge join is fastest for 31 days and for all orders.")
    methods = (("nested loop", BLUE), ("hash", GREEN), ("merge", PURPLE))
    title_line(s, "Median run time by window and join method (ms)", 8, 10)
    lx = 8
    for name, col in methods:
        s.rect(lx, 21, 8, 8, col, rx=2)
        s.text(lx + 12, 29, name, size=10)
        lx += 12 + b1.text_width(name, 10, None) + 14
    s.circle(lx + 4, 25, 3.5, None, stroke="currentColor")
    s.text(lx + 12, 29, "planner's pick", size=10)
    Y = log_axis(1, 1000, 190, 52)
    for v in (1, 10, 100, 1000):
        s.line(42, Y(v), 336, Y(v), opacity=0.5 if v == 1 else 0.13)
        s.text(36, Y(v) + 3.5, f"{v:,}", anchor="end", opacity=0.8)
    for gi, (w, nl, h, m, pick) in enumerate(WINDOWS):
        gx = 48 + gi * 58.5
        for bi, ((name, col), v) in enumerate(zip(methods, (nl, h, m))):
            bx = gx + bi * 17
            s.rect(bx, Y(v), 15, Y(1) - Y(v), col, rx=2)
            if name == pick:
                s.circle(bx + 7.5, Y(v) - 7, 3.5, None, stroke="currentColor")
        s.text(gx + 24, 205, w, anchor="middle", opacity=0.9)
    s.text(336, 222, "milliseconds, log scale", anchor="end", opacity=0.8)
    out["dd3-windows"] = s.render()

    # ---- dd4-bytes: bytes of each column in a Parquet file, the five columns of the aggregation marked ----
    total = sum(v for _, v in COLUMN_BYTES)
    need = sum(v for c, v in COLUMN_BYTES if c in NEEDED)
    s = Svg("dd4-bytes", "Compressed bytes of each of the 12 columns of the order lines in a Parquet file, and the five columns the aggregation reads",
            f"Twelve horizontal bars, longest first, for the share of the file's {total:,} bytes that each column takes: "
            + ", ".join(f"{c} {100 * v / total:.1f} percent" for c, v in COLUMN_BYTES)
            + f". Five of them are marked as read by the aggregation: unit_price_usd, store_id, quantity, discount_usd and status. Together they take {need:,} bytes, {100 * need / total:.1f} percent of the file.")
    X = Axis(0, 30, 108, 262)
    title_line(s, "Share of the Parquet file's bytes, by column (%)", 8, 10)
    for i, (c, v) in enumerate(COLUMN_BYTES):
        y = 24 + i * 17
        hit = c in NEEDED
        s.text(100, y + 11, c, anchor="end", weight=600 if hit else None, opacity=None if hit else 0.9)
        s.rect(X(0), y, max(X(100 * v / total) - X(0), 1.5), 13, BLUE if hit else "currentColor", opacity=None if hit else 0.3, rx=2)
        s.text(X(100 * v / total) + 6, y + 11, f"{100 * v / total:.1f}%", opacity=0.9)
    s.line(X(0), 22, X(0), 24 + 12 * 17, opacity=0.5)
    s.rect(108, 24 + 12 * 17 + 8, 8, 8, BLUE, rx=2)
    s.text(121, 24 + 12 * 17 + 16, f"the five columns the aggregation reads: {100 * need / total:.1f}%", size=10)
    out["dd4-bytes"] = s.render()

    # ---- dd4-ratio: aggregation and lookup per engine on one log axis ----
    s = Svg("dd4-ratio", "Time of one aggregation and of one single-line lookup in DuckDB, PostgreSQL and SQLite, on a log scale of milliseconds",
            "Two groups of three horizontal bars on one log scale from 0.01 to 1,000 milliseconds. The aggregation over the whole table: "
            + ", ".join(f"{n} {fmt(v)} ms" for n, v in AGG)
            + ". One lookup by key: " + ", ".join(f"{n} {v:g} ms" for n, v in LOOKUP)
            + ". DuckDB is fastest at the aggregation and slowest at the lookup.")
    X = log_axis(0.01, 1000, 84, 280)
    title_line(s, "Time of one question, by engine (ms, log scale)", 8, 10)
    y = 30
    for gname, rows in (("Aggregation over every line", AGG), ("One line, by its key", LOOKUP)):
        s.text(8, y + 8, gname, weight=600)
        y += 14
        for name, v in rows:
            s.text(78, y + 12, name, anchor="end")
            s.rect(X(0.01), y, X(v) - X(0.01), 15, ENGINE_COLOR[name], rx=2)
            s.text(X(v) + 6, y + 12, f"{fmt(v)} ms" if v >= 1 else f"{v:g} ms", weight=600)
            y += 20
        y += 10
    s.line(X(0.01), 30, X(0.01), y - 8, opacity=0.5)
    ay = y - 4
    s.line(X(0.01), ay, X(1000), ay)
    for v in (0.01, 0.1, 1, 10, 100, 1000):
        s.line(X(v), ay, X(v), ay + 4)
        s.text(X(v), ay + 16, f"{v:g}" if v < 1000 else "1,000", anchor="middle", opacity=0.8)
    out["dd4-ratio"] = s.render()

    # ---- dd5-moments: what session A reads at the two isolation levels ----
    s = Svg("dd5-moments", "What session A reads in one transaction while session B changes a row and adds one, at Read Committed and at Repeatable Read",
            "Two rows of three boxes. Each box shows what session A reads: the status of order 1580 and the number of orders of store 3. At Read Committed: "
            + "; ".join(f"{lab} {st}, {n}" for lab, (st, n) in zip(("first read", "second read", "after COMMIT"), MOMENTS[0][1]))
            + ". At Repeatable Read: "
            + "; ".join(f"{lab} {st}, {n}" for lab, (st, n) in zip(("first read", "second read", "after COMMIT"), MOMENTS[1][1]))
            + ". Session B changed order 1580 to canceled and added an order for store 3 between the first and the second read.")
    title_line(s, "What session A reads, step by step", 8, 10)
    heads = ["first read", "second read", "after COMMIT"]
    for ci, hname in enumerate(heads):
        s.text(100 + ci * 80 + 38, 34, hname, anchor="middle", opacity=0.85)
    s.text(100 + 80 + 38, 47, "(B has committed)", anchor="middle", opacity=0.7, size=9)
    for ri, (lab, cells) in enumerate(MOMENTS):
        y = 56 + ri * 48
        s.text(8, y + 24, lab, weight=600)
        for ci, (st, n) in enumerate(cells):
            changed = (st, n) != cells[0]
            col = GREEN if changed and ci == 1 else None
            s.rect(100 + ci * 80, y, 76, 38, col or "currentColor", opacity=0.9 if col else 0.1, rx=4)
            s.text(100 + ci * 80 + 38, y + 16, st, anchor="middle", weight=600, fill="#ffffff" if col else None)
            s.text(100 + ci * 80 + 38, y + 30, f"{n} orders", anchor="middle", fill="#ffffff" if col else None)
    out["dd5-moments"] = s.render()
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def facts_ok(name, text):
    """Numbers each chart draws must stand in its lesson's text."""
    need = {
        "dd1-join-order": ["645", "3,287", "112.24", "121.01"],
        "dd2-btree": ["1900", "block 7", "row 89"],
        "dd2-sweep": ["300 and 350", "2,146", "8.29"],
        "dd3-windows": ["2.6 ms", "57.0 ms", "31.8 ms"],
        "dd4-bytes": ["1,042,799", "14,499,086", "7.2 percent"],
        "dd4-ratio": ["7.7", "332.9", "338.1", "0.017", "0.153", "0.967"],
        "dd5-moments": ["355", "356", "canceled"],
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
            if svg not in text or missing:
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
        print("charts out of date in their lesson, or numbers missing from its text:", bad or "none")
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
