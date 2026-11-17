"""Practice workbook for excel-one-screen-report."""

from __future__ import annotations

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import save
from .order_lines import order_lines, write_lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    write_lines(wb.create_sheet("raw_order_lines"), order_lines())

    # An inherited KPI sheet to audit, wrong on purpose: the formulas stop at row 2800 although the
    # data runs to row 3288, the order count is typed, and the label claims data through June 30.
    ws = wb.create_sheet("raw_inherited_report")
    ws["A1"] = "Cafe KPIs (inherited)"
    ws["A1"].font = Font(bold=True, size=14)
    ws["A3"] = "Sales, completed orders (USD)"
    ws["B3"] = '=SUMIFS(raw_order_lines!J2:J2800,raw_order_lines!K2:K2800,"completed")'
    ws["A4"] = "Orders"
    ws["B4"] = 1532
    ws["A5"] = "Average order value (USD)"
    ws["B5"] = "=B3/B4"
    ws["A6"] = "Data through"
    ws["B6"] = "June 30, 2026"
    ws["B3"].number_format = "#,##0.00"
    ws["B4"].number_format = "#,##0"
    ws["B5"].number_format = "0.00"
    ws.column_dimensions["A"].width = 32
    ws.column_dimensions["B"].width = 16

    wb.create_sheet("calc")
    wb.create_sheet("output")
    # One empty sheet per exercise, so an exercise never overwrites the worked example.
    wb.create_sheet("calc_ex1")
    wb.create_sheet("output_ex1")
    wb.create_sheet("calc_ex2")
    wb.create_sheet("output_ex2")
    save(wb, "excel-one-screen-report")
