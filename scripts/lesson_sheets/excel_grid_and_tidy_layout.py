"""Practice workbook for excel-grid-and-tidy-layout."""

from __future__ import annotations

from datetime import date
from decimal import Decimal

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font

from .common import raw_sheet, read, save, weekly_sales


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_orders"), read("orders"))
    raw_sheet(wb.create_sheet("raw_customers"), read("customers"))

    # A store manager's weekly report, messy on purpose: merged title, blank rows, two facts in
    # one cell, money typed as text, and a total row inside the data.
    ws = wb.create_sheet("raw_weekly_report")
    days = weekly_sales("1", date(2026, 1, 5), date(2026, 1, 11))
    ws["A1"] = "OLD TOWN: WEEKLY SALES, week of January 5, 2026"
    ws["A1"].font = Font(bold=True, size=14)
    ws.merge_cells("A1:C1")
    ws.append([])
    ws.append(["Day", "Result", "Note"])
    for c in ws[3]:
        c.font = Font(bold=True)
    notes = {date(2026, 1, 8): "card machine down until noon"}
    for i, (day, n, usd) in enumerate(days):
        if i in (2, 5):  # blank rows the manager left between parts of the week
            ws.append([])
        ws.append([f"{day:%A %b} {day.day}", f"{n} orders, ${usd:.2f}", notes.get(day, "")])
    ws.append([])
    total_n = sum(n for _, n, _ in days)
    total_usd = sum((usd for _, _, usd in days), Decimal(0))
    ws.append(["TOTAL", f"{total_n} orders, ${total_usd:.2f}", ""])
    ws.cell(ws.max_row, 1).font = Font(bold=True)
    ws.cell(ws.max_row, 2).font = Font(bold=True)
    ws.column_dimensions["A"].width = 16
    ws.column_dimensions["B"].width = 22
    ws.column_dimensions["C"].width = 30
    ws["A1"].alignment = Alignment(horizontal="center")

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-grid-and-tidy-layout")

