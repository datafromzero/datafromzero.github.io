"""Practice files for excel-power-query-basics: one workbook and three CSV files.

Power Query reads files, so the real raw data here is the CSV files themselves (a query never changes
its source). All three are built from the cafe-sales CSV files with a fixed seed:

- excel-power-query-basics-orders.csv: till export of orders 1001-2500 (1,500 orders) plus 15 duplicate
  lines. Comma-delimited, amounts with a dot. The till code packs store, order and payment together.
- excel-power-query-basics-orders-update.csv: the same layout for all 1,800 orders plus 20 duplicate
  lines. The learner copies it over the first file and refreshes.
- excel-power-query-basics-harbor-eu.csv: the Harbor store's export written on a computer set to a
  European region: semicolon-delimited, decimal comma, day/month/year dates.

The workbook holds raw_orders_export (a copy of the first file as text, for the formulas-only route and
for comparing), an empty recipe sheet, calc and output.
"""

from __future__ import annotations

import csv
import random

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import OUT, read, save
from .messy import order_totals, padded, parse_ts, wrong_case

HEADER = ["till_code", "ordered_at", "total_usd", "status", "cashier_notes"]
NOTES = ["card reader slow", "customer waited", "extra shot", "spilled, remade", "regular", "birthday treat"]
FILES = {
    "orders": "excel-power-query-basics-orders.csv",
    "update": "excel-power-query-basics-orders-update.csv",
    "eu": "excel-power-query-basics-harbor-eu.csv",
}


def export_rows(order_ids: set[int] | None, store: str | None, seed: int, dupes: int, eu: bool) -> list[list[str]]:
    rng = random.Random(seed)
    totals = order_totals()
    rows = []
    for o in read("orders"):
        oid = int(o["order_id"])
        if order_ids is not None and oid not in order_ids:
            continue
        if store is not None and o["store_id"] != store:
            continue
        code = wrong_case(rng, f"S{o['store_id']}-{oid}-{o['payment_method']}")
        ts = parse_ts(o["ordered_at"])
        stamp = f"{ts:%d/%m/%Y %H:%M}" if eu else f"{ts:%Y-%m-%d %H:%M:%S}"
        amount = f"{totals[o['order_id']]:.2f}"
        status = padded(rng, wrong_case(rng, o["status"]))
        note = rng.choice(NOTES) if rng.random() < 0.06 else ""
        rows.append([padded(rng, code), stamp, amount.replace(".", ",") if eu else amount, status, note])
    for r in rng.sample(rows, dupes):
        rows.append(list(r))
    return rows


def write_csv(name: str, rows: list[list[str]], delimiter: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / name, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=delimiter)
        w.writerow(HEADER)
        w.writerows(rows)
    print(f"sheets/excel/{name}")


def build() -> None:
    first = export_rows(set(range(1001, 2501)), None, 4401, 15, eu=False)
    update = export_rows(None, None, 4402, 20, eu=False)
    harbor = export_rows(None, "3", 4403, 5, eu=True)
    write_csv(FILES["orders"], first, ",")
    write_csv(FILES["update"], update, ",")
    write_csv(FILES["eu"], harbor, ";")

    wb = Workbook()
    wb.remove(wb.active)
    ws = wb.create_sheet("raw_orders_export")
    ws.append(HEADER)
    for c in ws[1]:
        c.font = Font(bold=True)
    for r in first:
        ws.append(r)
    for letter, width in zip("ABCDE", [26, 22, 12, 16, 22]):
        ws.column_dimensions[letter].width = width
    ws.freeze_panes = "A2"

    rc = wb.create_sheet("recipe")
    rc.append(["step", "what it does", "why", "rows after"])
    for c in rc[1]:
        c.font = Font(bold=True)
    for letter, width in zip("ABCD", [8, 40, 50, 12]):
        rc.column_dimensions[letter].width = width
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-power-query-basics")

