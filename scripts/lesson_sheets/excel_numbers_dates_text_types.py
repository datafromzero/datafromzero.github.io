"""Practice workbook for excel-numbers-dates-text-types.

Three messy exports of the same kind, each made from the cafe-sales orders of one store and month:
a till system wrote day/month/year dates and some amounts as text, then a computer set to
month/day/year opened the file. The mechanism is reproduced exactly (no randomness):

* a date whose day is 12 or less read as a real date with day and month swapped (02/01/2026 became
  February 1), so it looks right and is wrong;
* a date whose day is above 12 could not be read as a month, so it stayed text;
* the amounts of one payment method were exported as text.
"""

from __future__ import annotations

from datetime import date

from openpyxl import Workbook

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


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    all_orders = order_table()
    for sheet, store, month, text_amounts in EXPORTS:
        orders = [o for o in all_orders if o.store_name == store and o.when.month == month]
        # Real dates display as month/day/year with a fixed format code, so every computer shows the same.
        write_table(
            wb.create_sheet(sheet),
            HEADER,
            export_rows(orders, text_amounts),
            widths={"ordered_on": 14, "payment_method": 16},
            formats={"ordered_on": "mm/dd/yyyy", "total_usd": "0.00"},
        )

    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-numbers-dates-text-types")
