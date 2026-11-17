"""Shared helpers for the Excel practice workbooks (see scripts/build-lesson-sheets.py)."""

from __future__ import annotations

import csv
from collections import defaultdict
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font
from openpyxl.worksheet.worksheet import Worksheet
from stable_xlsx import stabilize

ROOT = Path(__file__).resolve().parent.parent.parent
DATA = ROOT / "datasets" / "cafe-sales" / "v1"
OUT = ROOT / "sheets" / "excel"


def read(name: str) -> list[dict[str, str]]:
    with open(DATA / f"{name}.csv", newline="") as f:
        return list(csv.DictReader(f))


def typed(value: str, column: str) -> object:
    """Turn a CSV string into the value a spreadsheet should hold (number, date or text)."""
    if value == "":
        return None
    if column.endswith("_id") or column in ("referred_by", "quantity"):
        return int(value)
    if column.endswith("_usd"):
        return float(value)
    if column == "ordered_at":
        return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    if column in ("signup_date", "opened_on"):
        return date.fromisoformat(value)
    return value


def raw_sheet(ws: Worksheet, rows: list[dict[str, str]]) -> None:
    header = list(rows[0].keys())
    ws.append(header)
    for c in ws[1]:
        c.font = Font(bold=True)
    for r in rows:
        ws.append([typed(r[h], h) for h in header])
    for col, h in enumerate(header, start=1):
        letter = ws.cell(1, col).column_letter
        ws.column_dimensions[letter].width = 20 if h == "ordered_at" else max(12, len(h) + 2)
        fmt = {"ordered_at": "yyyy-mm-dd hh:mm", "signup_date": "yyyy-mm-dd", "opened_on": "yyyy-mm-dd"}.get(h)
        if h.endswith("_usd"):
            fmt = "0.00"
        if fmt:
            for (cell,) in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                cell.number_format = fmt
    ws.freeze_panes = "A2"


def save(wb: Workbook, lesson_id: str) -> None:
    wb.properties.creator = "datafromzero"
    OUT.mkdir(parents=True, exist_ok=True)
    wb.save(OUT / f"{lesson_id}.xlsx")
    stabilize(OUT / f"{lesson_id}.xlsx")
    print(f"sheets/excel/{lesson_id}.xlsx")


def weekly_sales(store_id: str, first: date, last: date) -> list[tuple[date, int, Decimal]]:
    """Completed orders and sales (USD) per day for one store, from the dataset."""
    price = {p["product_id"]: Decimal(p["unit_price_usd"]) for p in read("products")}
    orders = {
        o["order_id"]: datetime.strptime(o["ordered_at"], "%Y-%m-%d %H:%M:%S").date()
        for o in read("orders")
        if o["store_id"] == store_id and o["status"] == "completed"
    }
    count: dict[date, int] = defaultdict(int)
    sales: dict[date, Decimal] = defaultdict(Decimal)
    for day in orders.values():
        count[day] += 1
    for it in read("order_items"):
        day = orders.get(it["order_id"])
        if day is not None:
            sales[day] += int(it["quantity"]) * price[it["product_id"]] - Decimal(it["discount_usd"])
    return [(d, count[d], sales[d]) for d in sorted(count) if first <= d <= last]
