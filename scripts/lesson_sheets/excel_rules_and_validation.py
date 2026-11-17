"""Practice workbook for excel-rules-and-validation.

- raw_orders: the 1,800 orders (one is canceled, which a formatting rule can find).
- raw_order_items: the 3,287 order lines, "inherited" with two data validation rules already set:
  quantity must be a whole number from 1 to 10, discount_usd a decimal from 0 to 5. One line breaks the
  quantity rule (a 20 where a 2 was meant), which "Circle Invalid Data" finds.
- lists: the allowed values for a dropdown (stores, payment methods, statuses).
- calc and output start empty: formatting and validation rules are built on a copy in calc, so the
  raw sheets stay as they arrived.
"""

from __future__ import annotations

from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.worksheet.datavalidation import DataValidation

from .common import raw_sheet, read, save


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_orders"), read("orders"))

    items = wb.create_sheet("raw_order_items")
    raw_sheet(items, read("order_items"))
    last = items.max_row
    qty = DataValidation(
        type="whole",
        operator="between",
        formula1="1",
        formula2="10",
        allow_blank=False,
        showErrorMessage=True,
        errorStyle="stop",
        errorTitle="Quantity",
        error="Enter a whole number from 1 to 10.",
        showInputMessage=True,
        promptTitle="Quantity",
        prompt="Whole number, 1 to 10.",
    )
    qty.add(f"D2:D{last}")
    disc = DataValidation(
        type="decimal",
        operator="between",
        formula1="0",
        formula2="5",
        allow_blank=False,
        showErrorMessage=True,
        errorStyle="stop",
        errorTitle="Discount",
        error="Enter a discount from 0 to 5 dollars.",
    )
    disc.add(f"E2:E{last}")
    items.add_data_validation(qty)
    items.add_data_validation(disc)

    lists = wb.create_sheet("lists")
    lists.append(["store_name", "payment_method", "status"])
    for c in lists[1]:
        c.font = Font(bold=True)
    stores = [s["store_name"] for s in read("stores")]
    for store, pay, status in zip(stores, ["card", "mobile", "cash"], ["completed", "canceled", None]):
        lists.append([store, pay, status])
    for letter in "ABC":
        lists.column_dimensions[letter].width = 18

    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-rules-and-validation")
