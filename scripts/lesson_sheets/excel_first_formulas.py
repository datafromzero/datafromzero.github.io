"""Practice workbook for excel-first-formulas."""

from __future__ import annotations

from datetime import date

from openpyxl import Workbook

from .cafe_tables import Line, order_lines, write_table
from .common import save

HEADER = ["order_id", "product_name", "quantity", "unit_price_usd", "discount_usd"]
FORMATS = {"unit_price_usd": "0.00", "discount_usd": "0.00"}
WIDTHS = {"product_name": 26}

# One sheet per day at Old Town (store 1). Jan 5 and Jan 6 are the two days from the first lesson's
# weekly report; Jan 15 has discounted lines; May 1 holds the dataset's "extra zero" quantity.
DAYS = [
    ("raw_oldtown_jan5", date(2026, 1, 5)),
    ("raw_oldtown_jan6", date(2026, 1, 6)),
    ("raw_oldtown_jan15", date(2026, 1, 15)),
    ("raw_oldtown_may1", date(2026, 5, 1)),
]


def day_lines(day: date) -> list[Line]:
    return [ln for ln in order_lines() if ln.store_id == 1 and ln.status == "completed" and ln.when.date() == day]


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    # Unit prices are already beside each line: looking prices up yourself comes in a later lesson.
    for name, day in DAYS:
        rows = [[ln.order_id, ln.product_name, ln.quantity, float(ln.unit_price), float(ln.discount)] for ln in day_lines(day)]
        write_table(wb.create_sheet(name), HEADER, rows, widths=WIDTHS, formats=FORMATS)

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-first-formulas")
