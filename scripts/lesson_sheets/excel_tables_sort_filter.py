"""Practice workbook for excel-tables-sort-filter."""

from __future__ import annotations

from openpyxl import Workbook

from .cafe_tables import ORDER_FORMATS, ORDER_HEADER, order_row, order_table, write_orders_sheet, write_table
from .common import save

# The biggest Harbor order of April (a card order). Its amount is stored as text in the messy sheet.
TEXT_AMOUNT_ORDER = 1864
# The manager left one blank row after this many records.
BLANK_AFTER = 40


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    orders = order_table()
    write_orders_sheet(wb.create_sheet("raw_orders"), orders)

    # Messy on purpose: a blank row splits the list, and one amount is text.
    harbor = [o for o in orders if o.store_name == "Harbor" and o.when.month == 4]
    rows: list[list[object]] = []
    for i, o in enumerate(harbor):
        if i == BLANK_AFTER:
            rows.append([None] * len(ORDER_HEADER))
        row = order_row(o)
        if o.order_id == TEXT_AMOUNT_ORDER:
            row[-1] = f"{o.amount:.2f}"
        rows.append(row)
    assert any(r[0] == TEXT_AMOUNT_ORDER for r in rows[BLANK_AFTER + 1 :]), "text amount should sit below the blank row"
    write_table(wb.create_sheet("raw_harbor_apr"), ORDER_HEADER, rows, formats=ORDER_FORMATS)

    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-tables-sort-filter")
