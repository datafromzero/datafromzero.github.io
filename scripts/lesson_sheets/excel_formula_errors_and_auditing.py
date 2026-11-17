"""Practice workbook for excel-formula-errors-and-auditing."""

from __future__ import annotations

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import raw_sheet, read, save

MODEL_LINES = 40  # the first 40 order lines of the dataset
# Positions (0-based, in the 40 lines) whose product_id was typed as text by whoever built the model:
CODE_AS_TEXT = (6, 17, 29)
CODE_WITH_SPACE = (17,)  # ... and this one also has a trailing space
PASTED_ORDERS = 12  # the first 12 orders, pasted as unparsed CSV lines


def model_lines() -> list[dict[str, object]]:
    """The first 40 order lines; three product_id cells are text instead of numbers."""
    items = sorted(read("order_items"), key=lambda r: int(r["order_item_id"]))[:MODEL_LINES]
    lines: list[dict[str, object]] = [
        {
            "order_item_id": int(it["order_item_id"]),
            "product_id": int(it["product_id"]),
            "quantity": int(it["quantity"]),
            "discount_usd": float(it["discount_usd"]),
        }
        for it in items
    ]
    for i in CODE_AS_TEXT:
        lines[i]["product_id"] = str(lines[i]["product_id"])
    for i in CODE_WITH_SPACE:
        lines[i]["product_id"] = f"{lines[i]['product_id']} "
    return lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_products"), read("products"))

    # An inherited model: lookup, then amount, then totals. Three product_id cells are text.
    ws = wb.create_sheet("raw_model")
    ws.append(["order_item_id", "product_id", "quantity", "discount_usd", "unit_price_usd", "amount_usd"])
    for c in ws[1]:
        c.font = Font(bold=True)
    for k, line in enumerate(model_lines(), start=2):
        ws.append(
            [
                line["order_item_id"],
                line["product_id"],
                line["quantity"],
                line["discount_usd"],
                f"=VLOOKUP(B{k},raw_products!$A$2:$D$17,4,FALSE)",
                f"=C{k}*E{k}-D{k}",
            ]
        )
        if isinstance(line["product_id"], str):
            ws.cell(k, 2).number_format = "@"
        ws.cell(k, 5).number_format = "0.00"
        ws.cell(k, 6).number_format = "0.00"
    last = MODEL_LINES + 1
    ws["H1"], ws["I1"] = "lines", f"=COUNTA(A2:A{last})"
    ws["H2"], ws["I2"] = "total_usd", f"=SUM(F2:F{last})"
    ws["H3"], ws["I3"] = "avg_per_line_usd", "=I2/I1"
    for cell in ("H1", "H2", "H3"):
        ws[cell].font = Font(bold=True)
    ws["I3"].number_format = "0.00"
    ws.column_dimensions["A"].width = 15
    ws.column_dimensions["E"].width = 15
    ws.column_dimensions["H"].width = 18
    ws.freeze_panes = "A2"

    # Five cells that each fail in a different way.
    ws = wb.create_sheet("raw_error_zoo")
    ws.append(["what the cell tries to do", "result", "input 1", "input 2", "input 3"])
    for c in ws[1]:
        c.font = Font(bold=True)
    ws.append(["price of product code 99", "=VLOOKUP(99,raw_products!$A$2:$D$17,4,FALSE)"])
    ws.append(["double the price typed in C3", "=C3*2", "n/a"])
    # The formula once used a third cell in a column that was deleted since, so only C4 and E4 still hold prices.
    ws.append(["add the prices in C4 and E4 (the formula once used a column that was deleted)", "=SUM(C4,#REF!,E4)", 3.5, None, 3.25])
    ws.append(["average price: total in C5 divided by lines in D5", "=C5/D5", 12.5, 0])
    ws.append(["price of product code 2, typed in Spanish", "=BUSCARV(2,raw_products!$A$2:$D$17,4,FALSE)"])
    ws.column_dimensions["A"].width = 72
    ws.column_dimensions["B"].width = 44
    ws.freeze_panes = "A2"

    # Orders pasted from an export whose commas were never turned into columns.
    ws = wb.create_sheet("raw_pasted_orders")
    orders = read("orders")[:PASTED_ORDERS]
    header = ",".join(orders[0].keys())
    ws.append([header])
    ws["A1"].font = Font(bold=True)
    for o in orders:
        ws.append([",".join(o.values())])
    ws.column_dimensions["A"].width = 60

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    # The worked example uses calc. Each exercise has its own sheet, so nothing is left over from the example.
    wb.create_sheet("calc")

    # Exercise 1: the first row of the table is done for you.
    ws = wb.create_sheet("calc_ex1")
    ws.append(["cell", "error", "cause", "fix"])
    for c in ws[1]:
        c.font = Font(bold=True)
    ws.append(
        ["B2", "#N/A", "Code 99 is not in the products table: the key is not in the list.",
         "Use a real code, or give the lookup a not-found result."]
    )
    for col, width in (("A", 8), ("B", 10), ("C", 60), ("D", 60)):
        ws.column_dimensions[col].width = width
    # Exercise 2: a blank start.
    wb.create_sheet("calc_ex2")
    # Exercise 3: the colleague's file: the same model with the price lookup wrapped in IFERROR.
    ws = wb.create_sheet("calc_ex3")
    ws.append(["order_item_id", "product_id", "quantity", "discount_usd", "unit_price_usd", "amount_usd"])
    for c in ws[1]:
        c.font = Font(bold=True)
    for k, line in enumerate(model_lines(), start=2):
        ws.append(
            [
                line["order_item_id"],
                line["product_id"],
                line["quantity"],
                line["discount_usd"],
                f"=IFERROR(VLOOKUP(B{k},raw_products!$A$2:$D$17,4,FALSE),0)",
                f"=C{k}*E{k}-D{k}",
            ]
        )
        if isinstance(line["product_id"], str):
            ws.cell(k, 2).number_format = "@"
    ws["H1"], ws["I1"] = "lines", f"=COUNTA(A2:A{MODEL_LINES + 1})"
    ws["H2"], ws["I2"] = "total_usd", f"=SUM(F2:F{MODEL_LINES + 1})"
    ws["H3"], ws["I3"] = "avg_per_line_usd", "=I2/I1"
    for cell in ("H1", "H2", "H3"):
        ws[cell].font = Font(bold=True)
    ws["I3"].number_format = "0.00"
    ws.column_dimensions["E"].width = 15
    ws.column_dimensions["H"].width = 18
    wb.create_sheet("output")
    save(wb, "excel-formula-errors-and-auditing")
