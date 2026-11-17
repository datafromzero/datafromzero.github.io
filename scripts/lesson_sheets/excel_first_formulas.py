"""Practice workbook for excel-first-formulas."""

from __future__ import annotations

from datetime import date

from openpyxl import Workbook
from openpyxl.styles import Font

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


def day_rows(day: date) -> list[list[object]]:
    lines: list[Line] = [
        ln for ln in order_lines() if ln.store_id == 1 and ln.status == "completed" and ln.when.date() == day
    ]
    return [[ln.order_id, ln.product_name, ln.quantity, float(ln.unit_price), float(ln.discount)] for ln in lines]


def copy_sheet_into(ws, day: date) -> int:
    """Write a day's raw lines into a sheet; returns the number of lines."""
    rows = day_rows(day)
    write_table(ws, HEADER, rows, widths=WIDTHS, formats=FORMATS)
    return len(rows)


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    # Unit prices are already beside each line: looking prices up yourself comes in a later lesson.
    for name, day in DAYS:
        copy_sheet_into(wb.create_sheet(name), day)

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    # `calc` is for the worked example; every exercise has its own sheet, so nothing is overwritten.
    wb.create_sheet("calc")

    # Exercise 1 starts from this state: Tuesday copied in, first formula in F2.
    ws = wb.create_sheet("calc_ex1")
    n = copy_sheet_into(ws, date(2026, 1, 6))
    ws["F1"] = "line_usd"
    ws["F1"].font = Font(bold=True)
    ws["F2"] = "=C2*D2-E2"
    ws["F2"].number_format = "0.00"
    assert n == 10

    # Exercise 2 is a blank start.
    wb.create_sheet("calc_ex2")

    # Exercise 3 is the colleague's file: January 15 with the wrong formula filled down and a total.
    ws = wb.create_sheet("calc_ex3")
    n = copy_sheet_into(ws, date(2026, 1, 15))
    ws["F1"] = "line_usd"
    ws["F1"].font = Font(bold=True)
    for r in range(2, n + 2):
        ws[f"F{r}"] = f"=C{r}*(D{r}-E{r})"
        ws[f"F{r}"].number_format = "0.00"
    ws["H1"] = "total_usd"
    ws["H1"].font = Font(bold=True)
    ws["I1"] = f"=SUM(F2:F{n + 1})"
    ws["I1"].number_format = "0.00"

    wb.create_sheet("output")
    save(wb, "excel-first-formulas")
