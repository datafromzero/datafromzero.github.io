"""Practice workbook for excel-pivot-grouping-and-share."""

from __future__ import annotations

from openpyxl import Workbook

from .common import save
from .order_lines import order_lines, write_lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    lines = order_lines()
    write_lines(wb.create_sheet("raw_order_lines"), lines)

    # A messy export, on purpose: the April to June lines with every date typed as text
    # ("2026-04-01" is not a date until it is converted), so it cannot be grouped into months.
    q2 = [r for r in lines if r["date"].month in (4, 5, 6)]  # type: ignore[union-attr]
    write_lines(wb.create_sheet("raw_q2_text_dates"), q2, text_dates=True)

    wb.create_sheet("calc")
    wb.create_sheet("output")
    # One empty sheet per exercise, so an exercise never overwrites the worked example.
    wb.create_sheet("calc_ex1")
    wb.create_sheet("output_ex1")
    wb.create_sheet("calc_ex2")
    wb.create_sheet("output_ex2")
    save(wb, "excel-pivot-grouping-and-share")
