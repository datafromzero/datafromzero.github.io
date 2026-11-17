"""Practice workbook for excel-if-logic."""

from __future__ import annotations

from openpyxl import Workbook

from .cafe_tables import TABLE_FIRST_ROW, order_ranges, order_table, write_orders_sheet, write_orders_table_sheet
from .common import save


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    # The same order list as the Tables lesson: 1,800 orders with real dates and real numbers. It holds
    # the dataset's two odd orders: one walk-in without a customer_id and one canceled order.
    orders = order_table()
    write_orders_sheet(wb.create_sheet("raw_orders"), orders)

    # `calc` is for the worked example; every exercise has its own sheet, so nothing is overwritten.
    wb.create_sheet("calc")

    # Exercise 1 starts from this state: the orders as a Table (header in row 5) and the count and
    # total above it, where a filter cannot hide them.
    ids, amounts = order_ranges(len(orders))
    totals = [("records_visible", f"=SUBTOTAL(103,{ids})"), ("amount_visible_usd", f"=SUBTOTAL(109,{amounts})")]
    write_orders_table_sheet(wb.create_sheet("calc_ex1"), orders, "orders_ex1", totals)

    # Exercise 2 is a blank start.
    wb.create_sheet("calc_ex2")

    # Exercise 3 is the colleague's file: the size labels with the nested IF in the wrong order.
    rows = range(TABLE_FIRST_ROW, TABLE_FIRST_ROW + len(orders))
    wrong = [f'=IF(G{r}>=8,"medium",IF(G{r}>=16,"large","small"))' for r in rows]
    write_orders_table_sheet(
        wb.create_sheet("calc_ex3"), orders, "orders_ex3", totals[:1], extra=("size", wrong)
    )

    wb.create_sheet("output")
    save(wb, "excel-if-logic")
