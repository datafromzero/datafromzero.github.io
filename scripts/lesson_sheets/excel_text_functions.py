"""Practice workbook for excel-text-functions.

Messy on purpose, all built from the cafe-sales CSV files with a fixed seed:

- raw_till_export: one till code per order ("S1-1001-mobile") with stray spaces and mixed case,
  and ONE code that ends in a non-breaking space (TRIM leaves it, so one payment count is short by one).
- raw_customer_export: one packed cell per loyalty customer ("  C-0015 | alameda |  GOLD "), with
  mixed case and spaces, and three ids written without the zero padding ("C-7").
"""

from __future__ import annotations

import random

from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.worksheet.worksheet import Worksheet

from .common import raw_sheet, read, save
from .messy import NBSP, padded, spaces, wrong_case


def till_codes() -> list[str]:
    rng = random.Random(4101)
    orders = read("orders")
    codes = []
    planted = False
    for i, o in enumerate(orders):
        base = f"S{o['store_id']}-{o['order_id']}-{o['payment_method']}"
        case = rng.choice(["as is", "upper", "lower"])
        code = {"as is": base, "upper": base.upper(), "lower": base.lower()}[case]
        code = padded(rng, code)
        if not planted and i >= 800 and o["payment_method"] == "card":
            code = f"{spaces(rng, 1, 1)}{base}{NBSP}"  # the planted non-breaking space
            planted = True
        codes.append(code)
    return codes


def customer_cells() -> list[str]:
    rng = random.Random(4102)
    cells = []
    for c in read("customers"):
        cid = int(c["customer_id"])
        ident = f"C-{cid}" if cid in (7, 62, 118) else f"C-{cid:04d}"
        city = wrong_case(rng, c["city"])
        tier = wrong_case(rng, c["loyalty_tier"])
        cells.append(f"{padded(rng, ident)}|{padded(rng, city)}|{padded(rng, tier)}")
    return cells


def one_column(ws: Worksheet, header: str, values: list[str], width: int) -> None:
    ws.append([header])
    ws["A1"].font = Font(bold=True)
    for v in values:
        ws.append([v])
    ws.column_dimensions["A"].width = width
    ws.freeze_panes = "A2"


def exercise_sheets(wb: Workbook) -> None:
    """One sheet per exercise, so no exercise writes over the worked example or a raw sheet."""
    # Exercise 1 (faded): the clean code, store and order number are done for you.
    ws = wb.create_sheet("calc_ex1")
    ws.append(["code_clean", "store_id", "order_id"])
    for r in range(2, 1802):
        ws.cell(r, 1).value = f"=UPPER(TRIM(raw_till_export!A{r}))"
        ws.cell(r, 2).value = f"=VALUE(MID(A{r},2,1))"
        ws.cell(r, 3).value = f"=VALUE(MID(A{r},4,4))"
    # Exercise 2 (blank start): nothing prepared on purpose.
    wb.create_sheet("calc_ex2")
    # Exercise 3 (spot the flaw): the colleague's file, order number cut with MID and no VALUE.
    ws = wb.create_sheet("calc_ex3")
    ws.append(["code_clean", "store_id", "order_no", None, "her check"])
    for r in range(2, 1802):
        ws.cell(r, 1).value = f"=UPPER(TRIM(raw_till_export!A{r}))"
        ws.cell(r, 2).value = f"=VALUE(MID(A{r},2,1))"
        ws.cell(r, 3).value = f"=MID(A{r},4,4)"
    ws["E2"] = "=SUM(C2:C1801)"
    for c in ws[1]:
        c.font = Font(bold=True)
    wb["calc_ex1"].freeze_panes = "A2"
    for c in wb["calc_ex1"][1]:
        c.font = Font(bold=True)


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_orders"), read("orders"))
    raw_sheet(wb.create_sheet("raw_customers"), read("customers"))
    one_column(wb.create_sheet("raw_till_export"), "till_code", till_codes(), 28)
    one_column(wb.create_sheet("raw_customer_export"), "member", customer_cells(), 38)

    wb.create_sheet("calc")
    wb.create_sheet("output")
    exercise_sheets(wb)
    save(wb, "excel-text-functions")
