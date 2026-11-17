"""Practice workbook for excel-if-logic."""

from __future__ import annotations

from openpyxl import Workbook

from .cafe_tables import order_table, write_orders_sheet
from .common import save


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    # The same order list as the Tables lesson: 1,800 orders with real dates and real numbers. It holds
    # the dataset's two odd orders: one walk-in without a customer_id and one canceled order.
    write_orders_sheet(wb.create_sheet("raw_orders"), order_table())

    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-if-logic")
