"""Practice workbook for excel-date-functions.

Messy on purpose, all built from the cafe-sales CSV files with a fixed seed:

- raw_signups_text: the 150 loyalty sign-up dates as TEXT in month/day/year ("06/04/2025").
- raw_orders_text: the 1,800 order dates as TEXT in year-month-day ("2026-01-01").
- raw_stores: three stores with real dates (opened_on), to subtract.
- raw_printed_dates: 36 orders whose date was printed by three different tills, each in its own
  format (Old Town 2026-04-14, Campus 04/14/2026, Harbor 14.04.2026), so the format depends on the store.
"""

from __future__ import annotations

import random
from datetime import date

from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.worksheet.worksheet import Worksheet

from .common import raw_sheet, read, save
from .messy import parse_ts


def text_sheet(ws: Worksheet, header: list[str], rows: list[list[object]], widths: list[int]) -> None:
    ws.append(header)
    for c in ws[1]:
        c.font = Font(bold=True)
    for r in rows:
        ws.append(r)
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[ws.cell(1, i).column_letter].width = w
    ws.freeze_panes = "A2"


def printed_date(store_id: str, d: date) -> str:
    if store_id == "1":
        return f"{d:%Y-%m-%d}"
    if store_id == "2":
        return f"{d:%m/%d/%Y}"
    return f"{d:%d.%m.%Y}"


def sample_orders() -> list[tuple[int, int, date]]:
    """Twelve orders per store, chosen with a fixed seed."""
    rng = random.Random(4201)
    by_store: dict[str, list[tuple[int, date]]] = {"1": [], "2": [], "3": []}
    for o in read("orders"):
        by_store[o["store_id"]].append((int(o["order_id"]), parse_ts(o["ordered_at"]).date()))
    picked: list[tuple[int, int, date]] = []
    for sid, rows in by_store.items():
        for oid, d in rng.sample(rows, 12):
            picked.append((oid, int(sid), d))
    return sorted(picked)


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    text_sheet(
        wb.create_sheet("raw_signups_text"),
        ["customer_id", "signup_text"],
        [[int(c["customer_id"]), f"{date.fromisoformat(c['signup_date']):%m/%d/%Y}"] for c in read("customers")],
        [14, 16],
    )
    text_sheet(
        wb.create_sheet("raw_orders_text"),
        ["order_id", "ordered_on"],
        [[int(o["order_id"]), f"{parse_ts(o['ordered_at']):%Y-%m-%d}"] for o in read("orders")],
        [12, 14],
    )
    raw_sheet(wb.create_sheet("raw_stores"), read("stores"))
    text_sheet(
        wb.create_sheet("raw_printed_dates"),
        ["order_id", "store_id", "printed_date"],
        [[oid, sid, printed_date(str(sid), d)] for oid, sid, d in sample_orders()],
        [12, 10, 16],
    )

    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-date-functions")
