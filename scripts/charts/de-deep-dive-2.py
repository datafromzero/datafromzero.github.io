"""Draws the static figures of lessons 6 to 11 of the Data Engineer database-internals deep dive (write skew, row versions, WAL and recovery,
architectures, procedures and triggers).

    python3 scripts/charts/de-deep-dive-2.py --out DIR     write every figure as DIR/<name>.svg
    python3 scripts/charts/de-deep-dive-2.py --paste       put every figure into its lesson (at the marker {/* CHART: name */} or over the old figure)
    python3 scripts/charts/de-deep-dive-2.py --check       exit 1 unless every figure appears, byte for byte, in its lesson, and every number it
                                                           draws appears in the lesson's text

Uses the Svg class, the text widths and the figure colors of da-batch-1.py (which imports duckdb), as de-deep-dive-1.py does. Colors follow the
meaning (blue: what a session reads or scans, green: what survives or is kept, purple: the log), never the rank.

Every value below is copied from a transcript of the lessons (PostgreSQL 16.15 on Linux, real psql sessions); the source is named above each block.
"""
import importlib.util
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
Svg, BLUE, GREEN, PURPLE, ROOT = b1.Svg, b1.BLUE, b1.GREEN, b1.PURPLE, b1.ROOT
DOCS = ROOT / "src" / "content" / "docs" / "data-engineer"
LESSONS = {"dd6": DOCS / "write-skew-and-serializable.mdx", "dd7": DOCS / "mvcc-and-row-versions.mdx", "dd8": DOCS / "wal-and-recovery.mdx",
           "dd9": DOCS / "architectures-and-trade-offs.mdx", "dd10": DOCS / "procedures-and-triggers.mdx"}

# ---------------------------------------------------------------------------------------------------------------------------------------------------
# DATA
# dd6: units 1 to 3 (what the two COMMITs printed, and Harbor's registers at the end: True = open).
SKEW = [("Read Committed", "COMMIT", "COMMIT", (False, False)), ("Repeatable Read", "COMMIT", "COMMIT", (False, False)),
        ("Serializable", "COMMIT", "ERROR 40001", (False, True))]
# dd7: MVCC lesson, unit 1 (ctid, xmin, xmax and status of the two versions of order 1580; one run, the ids differ on every machine).
VERSIONS = [("(5,1)", 1003, 1005, "completed", "old version: A's snapshot reads it"), ("(15,67)", 1005, 0, "canceled", "new version: B and later readers")]
# dd8: unit 1 (pg_get_wal_records_info for one inserted order).
RECORDS = [("Heap", "INSERT", 86), ("Btree", "INSERT_LEAF", 64), ("Transaction", "COMMIT", 34)]
# dd9: unit 2 (the partitions in the two plans).
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
PRUNE = [("ordered_at in March", {"Mar"}), ("store_id = 3", set(MONTHS))]
# dd10: units 1 and 2 (rows modified, audit rows written, statement-log rows written).
FIRING = [("UPDATE 5", 5, 1), ("UPDATE 0", 0, 1)]


def title_line(s, text, x, y=0, size=10.5):
    s.text(x, y, text, size=size, weight=600)


def charts():
    out = {}

    # ---- dd6-skew: the two commits and the registers left open, at each level ----
    s = Svg("dd6-skew", "The two COMMITs and Harbor's registers afterwards, when two baristas each check and close a register at three isolation levels",
            "Three rows, one per isolation level. "
            + " ".join(f"{lvl}: A's COMMIT printed {a}, B's COMMIT printed {b}, and {sum(regs)} of Harbor's 2 registers stayed open."
                       for lvl, a, b, regs in SKEW))
    title_line(s, "Both baristas check, then close a different register", 8, 10)
    s.text(96, 32, "A's COMMIT", opacity=0.85)
    s.text(162, 32, "B's COMMIT", opacity=0.85)
    s.text(248, 32, "open registers", opacity=0.85)
    for i, (lvl, a, b, regs) in enumerate(SKEW):
        y = 42 + i * 34
        s.text(8, y + 17, lvl, weight=600)
        for x, val in ((96, a), (162, b)):
            bad = val.startswith("ERROR")
            s.rect(x, y + 4, 76 if bad else 56, 20, PURPLE if bad else "currentColor", opacity=0.9 if bad else 0.12, rx=3)
            s.text(x + 6, y + 18, val, weight=600 if bad else None, fill="#ffffff" if bad else None)
        for k, is_open in enumerate(regs):
            x = 248 + k * 22
            s.rect(x, y + 5, 16, 16, GREEN if is_open else None, rx=3, stroke=None if is_open else "currentColor", sw=1.5)
        s.text(296, y + 18, f"{sum(regs)} of 2", weight=600)
    s.rect(96, 152, 10, 10, GREEN, rx=2)
    s.text(110, 161, "open register", size=10)
    s.rect(190, 152, 10, 10, None, rx=2, stroke="currentColor", sw=1.5)
    s.text(204, 161, "closed register", size=10)
    out["dd6-skew"] = s.render()

    # ---- dd7-versions: the two versions of order 1580 ----
    s = Svg("dd7-versions", "The two versions of order 1580 after B's update, and which session reads which",
            "Two boxes, one under the other. "
            + " ".join(f"The {who.split(':')[0]} sits at ctid {ctid} with xmin {xmin}, xmax {xmax} and status {st}; {who.split(': ')[1]}."
                       for ctid, xmin, xmax, st, who in VERSIONS)
            + " A line joins the old version's xmax 1005 to the new version's xmin 1005: transaction 1005, B's update, ended one version and wrote the other.")
    title_line(s, "Order 1580 after B's update: two row versions", 8, 10)
    for i, (ctid, xmin, xmax, st, who) in enumerate(VERSIONS):
        y = 30 + i * 60
        col = BLUE if i == 0 else GREEN
        s.text(8, y + 10 if i == 0 else y + 62, who, opacity=0.9)
        s.rect(8, y + 16, 330, 30, None, rx=4, stroke=col, sw=2)
        cells = [("ctid", ctid, 16), ("xmin", str(xmin), 92), ("xmax", str(xmax), 168), ("status", st, 244)]
        for label, val, x in cells:
            s.text(x, y + 30, label, size=9, opacity=0.75)
            s.text(x, y + 42, val, weight=600)
    s.line(184, 76, 108, 106, color=PURPLE, w=2, opacity=0.9)
    s.text(196, 94, "transaction 1005 (B's update)", size=9.5, opacity=0.9)
    out["dd7-versions"] = s.render()

    # ---- dd8-wal: the three records of one insert ----
    total = sum(n for _, _, n in RECORDS)
    s = Svg("dd8-wal", "The WAL records written by one inserted order, to scale, and what the commit waits for",
            "A strip of three boxes whose widths are proportional to their sizes: "
            + ", ".join(f"{rm} {rt}, {n} bytes" for rm, rt, n in RECORDS)
            + f"; {total} bytes in all. A bracket under the strip says that COMMIT waits until these records are on disk. "
            + "Below, a separate box for the table page with the new row says that it is written to the data file later.")
    title_line(s, "One inserted order in the write-ahead log", 8, 10)
    x, scale = 8, 320 / total
    for i, (rm, rt, n) in enumerate(RECORDS):
        w = n * scale
        last = rt == "COMMIT"
        s.text(x + 3, 30, rm, size=9.5, opacity=0.85)
        s.rect(x, 36, w - 2, 34, PURPLE, opacity=0.9 if last else 0.35, rx=3)
        s.text(x + 6, 50, rt, size=9.5, weight=600, fill="#ffffff" if last else None)
        s.text(x + 6, 63, f"{n} bytes", size=9.5, fill="#ffffff" if last else None)
        x += w
    s.line(8, 76, 8, 82, opacity=0.7)
    s.line(8, 82, 326, 82, opacity=0.7)
    s.line(326, 76, 326, 82, opacity=0.7)
    s.text(167, 97, f"COMMIT returns once these {total} bytes are on disk", anchor="middle", weight=600)
    s.rect(8, 110, 318, 30, "currentColor", opacity=0.1, rx=3)
    s.text(18, 129, "table page with order 2801: written to the data file later")
    out["dd8-wal"] = s.render()

    # ---- dd9-pruning: the partitions each plan scans ----
    s = Svg("dd9-pruning", "Which of the six monthly partitions of orders_part each plan scans",
            "Two rows of six boxes, January to June. For the filter on ordered_at in March, only the March partition is scanned and the other five "
            "are pruned. For the filter store_id = 3, all six partitions are scanned.")
    title_line(s, "Partitions in the plan (blue: scanned)", 8, 10)
    for i, (label, scanned) in enumerate(PRUNE):
        y = 26 + i * 52
        s.text(8, y + 10, f"WHERE {label}: {len(scanned)} of 6 scanned", weight=600)
        for k, m in enumerate(MONTHS):
            x = 8 + k * 55
            hit = m in scanned
            s.rect(x, y + 18, 51, 24, BLUE if hit else None, opacity=0.9 if hit else None, rx=3, stroke=None if hit else "currentColor",
                   sw=1, dash=None if hit else "3 2")
            s.text(x + 25.5, y + 34, m, anchor="middle", weight=600 if hit else None, fill="#ffffff" if hit else None, opacity=None if hit else 0.7)
    out["dd9-pruning"] = s.render()

    # ---- dd10-firing: row-level and statement-level firings ----
    s = Svg("dd10-firing", "How many times each trigger ran for an UPDATE of five rows and an UPDATE of no rows",
            "Two rows. " + " ".join(f"{lab}: the row-level audit trigger ran {r} times and the statement-level trigger ran {st} time."
                                     for lab, r, st in FIRING))
    title_line(s, "Trigger runs for one statement", 8, 10)
    s.text(92, 32, "row-level (audit)", opacity=0.85)
    s.text(256, 32, "statement-level", opacity=0.85)
    for i, (lab, r, st) in enumerate(FIRING):
        y = 42 + i * 32
        s.text(8, y + 15, lab, weight=600)
        for k in range(5):
            s.rect(92 + k * 26, y + 2, 20, 20, BLUE if k < r else None, rx=3, stroke=None if k < r else "currentColor", sw=1, dash=None if k < r else "3 2")
        s.text(230, y + 16, str(r), weight=600)
        s.rect(256, y + 2, 20, 20, GREEN, rx=3)
        s.text(284, y + 16, str(st), weight=600)
    out["dd10-firing"] = s.render()
    return out


def figure(svg):
    return "<figure>\n" + svg + "\n</figure>"


def facts_ok(name, text):
    """Values each figure draws must stand in its lesson's text."""
    need = {
        "dd6-skew": ["40001", "register 2 stays open"],
        "dd7-versions": ["(5,1)", "(15,67)", "1003", "1005"],
        "dd8-wal": ["86", "64", "34", "184 bytes"],
        "dd9-pruning": ["one partition out of six", "all six"],
        "dd10-firing": ["UPDATE 5", "UPDATE 0", "five audit rows"],
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
