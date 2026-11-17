"""Practice workbook for excel-charts-that-tell-the-truth."""

from __future__ import annotations

from openpyxl import Workbook

from .common import save
from .order_lines import order_lines, write_lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    # The real data already holds a surprise for the chart exercise: one Old Town line on
    # May 1 has a quantity of 20 where 2 was meant, which makes that day spike.
    write_lines(wb.create_sheet("raw_order_lines"), order_lines())

    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-charts-that-tell-the-truth")
