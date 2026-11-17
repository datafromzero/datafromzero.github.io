"""Practice workbook for excel-conditional-totals."""

from __future__ import annotations

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
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-conditional-totals")
