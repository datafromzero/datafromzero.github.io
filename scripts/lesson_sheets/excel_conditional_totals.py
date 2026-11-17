"""Practice workbook for excel-conditional-totals."""

from __future__ import annotations

from datetime import date

from openpyxl import Workbook

from .common import raw_sheet, save
from .sales_lines import line_rows

# Rows of the partner export that are messy on purpose (counted among Harbor, June, bakery lines):
SPACE_AFTER_CATEGORY = (2, 7, 12)  # category typed "bakery " with a trailing space
AMOUNT_AS_TEXT = (4, 9)  # line_amount_usd typed as text, such as "3.25"


def june_export() -> tuple[list[dict[str, str]], list[int], list[int]]:
    """June lines of all three stores, with a few messy cells planted in Harbor's bakery lines.

    Returns the rows plus the positions (0-based, in the list) of the cells with a trailing space
    and of the cells whose amount is text, so the lesson numbers can be checked by script.
    """
    rows = [dict(r) for r in line_rows() if r["ordered_at"].startswith("2026-06")]
    harbor_bakery = [
        i for i, r in enumerate(rows) if r["store_name"] == "Harbor" and r["category"] == "bakery" and r["status"] == "completed"
    ]
    spaced = [harbor_bakery[k - 1] for k in SPACE_AFTER_CATEGORY]
    texted = [harbor_bakery[k - 1] for k in AMOUNT_AS_TEXT]
    for i in spaced:
        rows[i]["category"] = "bakery "
    return rows, spaced, texted


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    # One row per order line, as a till would export it.
    raw_sheet(wb.create_sheet("raw_sales_lines"), line_rows())

    # A second export that arrived from the Harbor manager: messy on purpose.
    rows, _, texted = june_export()
    ws = wb.create_sheet("raw_june_export")
    raw_sheet(ws, rows)
    amount_col = list(rows[0]).index("line_amount_usd") + 1
    for i in texted:
        cell = ws.cell(i + 2, amount_col)  # +2: header row, and the sheet is 1-based
        cell.value = f"{rows[i]['line_amount_usd']}"
        cell.number_format = "@"

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    # The worked example uses calc. Each exercise has its own sheet, so nothing is left over from the example.
    wb.create_sheet("calc")

    # Exercise 1: the first steps are done for you (the conditions are typed in cells A3:B7).
    ws = wb.create_sheet("calc_ex1")
    for i, (label, value) in enumerate(
        [("store", "Campus"), ("category", "tea"), ("status", "completed"),
         ("from (included)", date(2026, 4, 1)), ("until (not included)", date(2026, 5, 1))],
        start=3,
    ):
        ws.cell(i, 1, label)
        cell = ws.cell(i, 2, value)
        if isinstance(value, date):
            cell.number_format = "yyyy-mm-dd"
    ws.column_dimensions["A"].width = 22
    ws.column_dimensions["B"].width = 14
    # Exercise 2: a blank start.
    wb.create_sheet("calc_ex2")
    # Exercise 3: the colleague's flawed formula, ready to read.
    ws = wb.create_sheet("calc_ex3")
    ws["A1"] = "colleague's formula: Campus, March, completed"
    ws["B1"] = (
        '=SUMIFS(raw_sales_lines!J:J,raw_sales_lines!C:C,"Campus",raw_sales_lines!D:D,"completed",'
        'raw_sales_lines!B:B,">="&DATE(2026,3,1),raw_sales_lines!B:B,"<="&DATE(2026,3,31))'
    )
    ws.column_dimensions["A"].width = 44
    ws.column_dimensions["B"].width = 14
    wb.create_sheet("output")
    save(wb, "excel-conditional-totals")
