"""Practice workbook for excel-dynamic-arrays."""

from __future__ import annotations

from openpyxl import Workbook

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
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-dynamic-arrays")
