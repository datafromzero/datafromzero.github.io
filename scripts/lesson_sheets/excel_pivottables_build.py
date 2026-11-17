"""Practice workbook for excel-pivottables-build."""

from __future__ import annotations

from openpyxl import Workbook

from .common import save
from .order_lines import order_lines, write_lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    lines = order_lines()
    # The clean pivot source: one row per order line, numbers stored as numbers.
    write_lines(wb.create_sheet("raw_order_lines"), lines)

    # A messy export, on purpose: only the Harbor lines, amount_usd typed as text, and one blank
    # row left in the middle of the data (after the 300th line).
    harbor = [r for r in lines if r["store"] == "Harbor"]
    write_lines(wb.create_sheet("raw_harbor_export"), harbor, text_amounts=True, blank_row_after=300)

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-pivottables-build")
