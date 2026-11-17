"""Practice workbook for excel-cell-references."""

from __future__ import annotations

from collections import defaultdict
from decimal import Decimal

from openpyxl import Workbook
from openpyxl.styles import Font

from .cafe_tables import order_lines, order_table, write_table
from .common import read, save

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]


def product_sales() -> list[list[object]]:
    """Units and sales (USD) per product over January to June, completed orders only, in menu order.
    Pumpkin Spice Latte was never sold, so its row holds zeros."""
    units: dict[str, int] = defaultdict(int)
    sales: dict[str, Decimal] = defaultdict(Decimal)
    for ln in order_lines():
        if ln.status == "completed":
            units[ln.product_name] += ln.quantity
            sales[ln.product_name] += ln.amount
    return [[p["product_name"], units[p["product_name"]], float(sales[p["product_name"]])] for p in read("products")]


def store_month() -> list[list[object]]:
    """Completed sales (USD) per store and month. Harbor opened on April 1, so Jan to Mar stay empty."""
    cell: dict[tuple[str, int], Decimal] = defaultdict(Decimal)
    for o in order_table():
        if o.status == "completed":
            cell[(o.store_name, o.when.month)] += o.amount
    rows = []
    for s in read("stores"):
        name = s["store_name"]
        rows.append([name] + [float(cell[(name, m)]) if (name, m) in cell else None for m in range(1, 7)])
    return rows


def write_product_table(ws) -> None:
    write_table(
        ws,
        ["product_name", "units_sold", "sales_usd"],
        product_sales(),
        widths={"product_name": 26},
        formats={"sales_usd": "0.00"},
    )


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    write_product_table(wb.create_sheet("raw_product_sales"))
    # A report grid (stores down, months across), not a table of records: the records are the orders.
    write_table(
        wb.create_sheet("raw_store_month"),
        ["store"] + MONTHS,
        store_month(),
        widths={"store": 12},
        formats={m: "0.00" for m in MONTHS},
    )

    # `calc` is for the worked example; every exercise has its own sheet, so nothing is overwritten.
    wb.create_sheet("calc")

    # Exercise 1 starts from this state: the data copied in, the units total in G2, the first formula in E2.
    ws = wb.create_sheet("calc_ex1")
    write_product_table(ws)
    ws["E1"], ws["G1"] = "units_share", "total_units"
    ws["E2"], ws["G2"] = "=B2/G2", "=SUM(B2:B17)"
    ws["E2"].number_format = "0.0%"
    for c in ("E1", "G1"):
        ws[c].font = Font(bold=True)

    # Exercise 2 is a blank start.
    wb.create_sheet("calc_ex2")

    # Exercise 3 is the colleague's file: every share is Espresso's, because the numerator is locked.
    ws = wb.create_sheet("calc_ex3")
    write_product_table(ws)
    ws["D1"], ws["F1"] = "share", "total_sales_usd"
    ws["F2"] = "=SUM(C2:C17)"
    for r in range(2, 18):
        ws[f"D{r}"] = "=$C$2/$F$2"
        ws[f"D{r}"].number_format = "0.0%"
    for c in ("D1", "F1"):
        ws[c].font = Font(bold=True)

    wb.create_sheet("output")
    save(wb, "excel-cell-references")
