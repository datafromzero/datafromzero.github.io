"""Practice workbook for excel-dynamic-arrays."""

from __future__ import annotations

from datetime import date

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import raw_sheet, read, save
from .sales_lines import line_rows

# Messy labels planted in Harbor's export: the k-th line (1-based) of a category gets a trailing space.
SPACE_AFTER = {"tea": (3, 10), "bakery": (5,)}


def harbor_export() -> tuple[list[dict[str, str]], list[int]]:
    """All of Harbor's lines (April to June), with a few category labels typed with a trailing space.

    Returns the rows plus the positions of the messy rows, so the lesson numbers can be checked by script.
    """
    rows = [dict(r) for r in line_rows() if r["store_name"] == "Harbor"]
    spaced: list[int] = []
    for category, ks in SPACE_AFTER.items():
        positions = [i for i, r in enumerate(rows) if r["category"] == category]
        for k in ks:
            spaced.append(positions[k - 1])
    for i in spaced:
        rows[i]["category"] += " "
    return rows, sorted(spaced)


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_orders"), read("orders"))
    raw_sheet(wb.create_sheet("raw_sales_lines"), line_rows())

    # Harbor's own export, messy on purpose: a few category labels have a trailing space.
    rows, _ = harbor_export()
    raw_sheet(wb.create_sheet("raw_harbor_export"), rows)

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    # The worked example uses calc. Each exercise has its own sheet, so nothing is left over from the example.
    wb.create_sheet("calc")

    # Exercise 1: the first steps are done for you (the four column names and the conditions in G1:H4).
    ws = wb.create_sheet("calc_ex1")
    for k, name in enumerate(("order_id", "customer_id", "store_id", "ordered_at"), start=1):
        ws.cell(1, k, name).font = Font(bold=True)
    for i, (label, value) in enumerate(
        [("store_id", 3), ("payment", "mobile"), ("from (included)", date(2026, 5, 1)),
         ("until (not included)", date(2026, 6, 1))],
        start=1,
    ):
        ws.cell(i, 7, label)
        cell = ws.cell(i, 8, value)
        if isinstance(value, date):
            cell.number_format = "yyyy-mm-dd"
    ws.column_dimensions["G"].width = 22
    ws.column_dimensions["H"].width = 12
    # Exercise 2: a blank start.
    wb.create_sheet("calc_ex2")
    # Exercise 3: the colleague's flawed formula, kept as text so it can be read and copied.
    ws = wb.create_sheet("calc_ex3")
    ws["A1"] = "colleague's formula (text): copy it into A3 to see what it returns"
    flawed = (
        '=FILTER(raw_orders!A2:D1801,((raw_orders!C2:C1801=2)+(raw_orders!F2:F1801="cash"))'
        '*(raw_orders!D2:D1801>=DATE(2026,6,1)),"no orders")'
    )
    ws["A2"] = flawed
    ws["A2"].data_type = "s"
    ws.column_dimensions["A"].width = 100
    wb.create_sheet("output")
    save(wb, "excel-dynamic-arrays")
