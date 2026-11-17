"""Practice workbook for excel-xlookup."""

from __future__ import annotations

from decimal import Decimal

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import raw_sheet, read, save
from .sales_lines import line_rows

# Messy cells planted in the delivery-app export (positions 0-based, in the list of lines):
CODE_AS_TEXT = (3, 10, 17, 24, 31, 38)  # item_code typed as text, such as "10"
CODE_WITH_SPACE = (5, 20)  # item_code typed as text with a trailing space, such as "6 "
CODE_NOT_ON_MENU = (12, 33)  # item_code 17, which is not on the menu
OFF_MENU_CODE = 17


def delivery_export() -> list[dict[str, object]]:
    """Harbor's lines from June 8 to June 14 as a delivery partner's export (ref, item_code, quantity).

    The codes come from the dataset (`product_id`), then a few are made messy on purpose.
    """
    products = {p["product_id"]: p for p in read("products")}
    stores = {s["store_id"]: s["store_name"] for s in read("stores")}
    orders = {o["order_id"]: o for o in read("orders")}
    out: list[dict[str, object]] = []
    for it in sorted(read("order_items"), key=lambda r: int(r["order_item_id"])):
        o = orders[it["order_id"]]
        if stores[o["store_id"]] == "Harbor" and "2026-06-08" <= o["ordered_at"][:10] <= "2026-06-14":
            out.append(
                {
                    "delivery_ref": f"D-{len(out) + 1:03d}",
                    "item_code": int(it["product_id"]),
                    "quantity": int(it["quantity"]),
                    "price": Decimal(products[it["product_id"]]["unit_price_usd"]),
                }
            )
    for i in CODE_AS_TEXT:
        out[i]["item_code"] = str(out[i]["item_code"])
    for i in CODE_WITH_SPACE:
        out[i]["item_code"] = f"{out[i]['item_code']} "
    for i in CODE_NOT_ON_MENU:
        out[i]["item_code"] = OFF_MENU_CODE
        out[i]["price"] = Decimal(0)  # not on the menu: it has no price, so it adds nothing
    return out


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_order_items"), read("order_items"))
    raw_sheet(wb.create_sheet("raw_products"), read("products"))
    raw_sheet(wb.create_sheet("raw_orders"), read("orders"))
    raw_sheet(wb.create_sheet("raw_customers"), read("customers"))

    # The till's own control totals for the whole file: what a lookup column must reconcile to.
    ws = wb.create_sheet("raw_till_report")
    lines = line_rows()
    total = sum(Decimal(r["line_amount_usd"]) for r in lines)
    ws.append(["measure", "value"])
    for c in ws[1]:
        c.font = Font(bold=True)
    ws.append(["lines", len(lines)])
    ws.append(["total_amount_usd", float(total)])
    ws["B3"].number_format = "0.00"
    ws.column_dimensions["A"].width = 20
    ws.column_dimensions["B"].width = 12

    # A delivery partner's export, messy on purpose: codes typed as text, a trailing space,
    # and two codes that are not on the menu.
    ws = wb.create_sheet("raw_delivery_lines")
    ws.append(["delivery_ref", "item_code", "quantity"])
    for c in ws[1]:
        c.font = Font(bold=True)
    for r in delivery_export():
        ws.append([r["delivery_ref"], r["item_code"], r["quantity"]])
        if isinstance(r["item_code"], str):
            ws.cell(ws.max_row, 2).number_format = "@"
    ws.column_dimensions["A"].width = 14
    ws.column_dimensions["B"].width = 12
    ws.column_dimensions["C"].width = 10
    ws.freeze_panes = "A2"

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    # The worked example uses calc. Each exercise has its own sheet, so nothing is left over from the example.
    wb.create_sheet("calc")

    # Exercise 1: the first steps are done for you (raw_orders is copied, the new column G has its header).
    ws = wb.create_sheet("calc_ex1")
    raw_sheet(ws, read("orders"))
    ws["G1"] = "loyalty_tier"
    ws["G1"].font = Font(bold=True)
    ws.column_dimensions["G"].width = 14
    # Exercise 2: a blank start.
    wb.create_sheet("calc_ex2")
    # Exercise 3: the colleague's flawed file (the lookup ranges have no dollar signs).
    ws = wb.create_sheet("calc_ex3")
    items = read("order_items")
    raw_sheet(ws, items)
    ws["F1"], ws["G1"] = "unit_price_usd", "amount_usd"
    ws["F1"].font = ws["G1"].font = Font(bold=True)
    for k in range(2, len(items) + 2):
        ws[f"F{k}"] = f"=_xlfn.XLOOKUP(C{k},raw_products!A{k}:A{k + 15},raw_products!D{k}:D{k + 15})"
        ws[f"G{k}"] = f"=D{k}*F{k}-E{k}"
    ws["I1"], ws["I2"] = "total_usd", f"=SUM(G2:G{len(items) + 1})"
    ws["I1"].font = Font(bold=True)
    for col, width in (("F", 15), ("G", 12), ("I", 12)):
        ws.column_dimensions[col].width = width
    wb.create_sheet("output")
    save(wb, "excel-xlookup")
