"""Practice workbook for excel-numbers-dates-text-types.

Three messy exports of the same kind, each made from the cafe-sales orders of one store and month:
a till system wrote day/month/year dates and some amounts as text, then a computer set to
month/day/year opened the file. The mechanism is reproduced exactly (no randomness):

* a date whose day is 12 or less read as a real date with day and month swapped (02/01/2026 became
  February 1), so it looks right and is wrong;
* a date whose day is above 12 could not be read as a month, so it stayed text;
* the amounts of one payment method were exported as text.

The file was then saved as .xlsx, which keeps those values and types as they were read: that is what
the lesson's practice file holds.
"""

from __future__ import annotations

from datetime import date

from openpyxl import Workbook
from openpyxl.styles import Font

from .cafe_tables import Order, order_table, write_table
from .common import save

HEADER = ["order_id", "ordered_on", "payment_method", "total_usd"]

# (sheet, store, month, payment method whose amounts arrive as text, or None)
EXPORTS = [
    ("raw_export_campus_jan", "Campus", 1, "mobile"),
    ("raw_export_oldtown_feb", "Old Town", 2, None),
    ("raw_export_harbor_apr", "Harbor", 4, "card"),
]


def export_rows(orders: list[Order], text_amounts: str | None) -> list[list[object]]:
    rows: list[list[object]] = []
    for o in orders:
        d = o.day
        if d.day <= 12:
            ordered_on: object = date(d.year, d.day, d.month)  # day read as month, month read as day
        else:
            ordered_on = f"{d.day:02d}/{d.month:02d}/{d.year}"  # stays text
        total: object = f"{o.amount:.2f}" if o.payment == text_amounts else float(o.amount)
        rows.append([o.order_id, ordered_on, o.payment, total])
    return rows


def write_export(ws, rows: list[list[object]]) -> None:
    # Real dates display as month/day/year with a fixed format code, so every computer shows the same.
    write_table(
        ws,
        HEADER,
        rows,
        widths={"ordered_on": 14, "payment_method": 16},
        formats={"ordered_on": "mm/dd/yyyy", "total_usd": "0.00"},
    )


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    all_orders = order_table()
    exports = {}
    for sheet, store, month, text_amounts in EXPORTS:
        orders = [o for o in all_orders if o.store_name == store and o.when.month == month]
        exports[sheet] = export_rows(orders, text_amounts)
        write_export(wb.create_sheet(sheet), exports[sheet])

    # `calc` is for the worked example; every exercise has its own sheet, so nothing is overwritten.
    wb.create_sheet("calc")

    # Exercise 1 starts from this state: the Old Town export copied in and its amounts checked.
    rows = exports["raw_export_oldtown_feb"]
    ws = wb.create_sheet("calc_ex1")
    write_export(ws, rows)
    last = len(rows) + 1
    checks = [
        ("numbers_in_total", f"=COUNT(D2:D{last})"),
        ("filled_in_total", f"=COUNTA(D2:D{last})"),
        ("sum_as_it_stands", f"=SUM(D2:D{last})"),
    ]
    ws["G1"], ws["H1"] = "check", "value"
    for c in ("G1", "H1"):
        ws[c].font = Font(bold=True)
    for i, (label, formula) in enumerate(checks, start=2):
        ws[f"G{i}"], ws[f"H{i}"] = label, formula
    ws.column_dimensions["G"].width = 20

    # Exercise 2 is a blank start.
    wb.create_sheet("calc_ex2")

    wb.create_sheet("output")
    save(wb, "excel-numbers-dates-text-types")
