"""Practice workbook for excel-sheets-query-bridge (Google Sheets only: QUERY does not exist in Excel)."""

from __future__ import annotations

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import save
from .order_lines import order_lines, write_lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    lines = order_lines()
    write_lines(wb.create_sheet("raw_order_lines"), lines)

    # A messy export, on purpose: a title row and a blank row above the header, and a few store
    # names in the wrong case ("campus", "OLD TOWN"). March lines, Old Town and Campus only.
    march = [dict(r) for r in lines if r["date"].month == 3]  # type: ignore[union-attr]
    for i, r in enumerate(march, start=1):
        if i % 41 == 0:
            r["store"] = str(r["store"]).lower()
        elif i % 57 == 0:
            r["store"] = str(r["store"]).upper()
    ws = wb.create_sheet("raw_till_export")
    ws.append(["Till export, March 2026"])
    ws["A1"].font = Font(bold=True, size=14)
    ws.append([])
    write_lines(ws, march)
    ws.freeze_panes = "A4"

    wb.create_sheet("calc")
    wb.create_sheet("output")
    # One empty sheet per exercise, so an exercise never overwrites the worked example.
    wb.create_sheet("output_ex1")
    wb.create_sheet("calc_ex2")
    save(wb, "excel-sheets-query-bridge")
