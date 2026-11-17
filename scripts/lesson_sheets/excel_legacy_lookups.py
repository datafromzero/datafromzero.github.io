"""Practice workbook for excel-legacy-lookups."""

from __future__ import annotations

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import raw_sheet, read, save

# Menu items that the "old menu" price list does not have (the list is older than these items).
MISSING_FROM_OLD_MENU = (6, 8, 14)


def old_menu() -> list[dict[str, str]]:
    """The menu without the three items added later; sorted by product_id, so approximate match runs."""
    return [p for p in read("products") if int(p["product_id"]) not in MISSING_FROM_OLD_MENU]


def menu_with_size() -> list[dict[str, str]]:
    """The menu after someone inserted a `size` column before `category` and `unit_price_usd`."""
    return [
        {"product_id": p["product_id"], "product_name": p["product_name"], "size": "regular",
         "category": p["category"], "unit_price_usd": p["unit_price_usd"]}
        for p in read("products")
    ]


def sample_lines() -> list[dict[str, str]]:
    """Twelve lines from the till export: the first two of products 6, 8 and 14, the first of six others."""
    items = sorted(read("order_items"), key=lambda r: int(r["order_item_id"]))
    picked: dict[str, int] = {}
    chosen: list[dict[str, str]] = []
    wanted = {"6": 2, "8": 2, "14": 2, "1": 1, "3": 1, "7": 1, "10": 1, "12": 1, "15": 1}
    for it in items:
        n = picked.get(it["product_id"], 0)
        if n < wanted.get(it["product_id"], 0):
            picked[it["product_id"]] = n + 1
            chosen.append(it)
    return sorted(chosen, key=lambda r: int(r["order_item_id"]))


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_products"), read("products"))
    raw_sheet(wb.create_sheet("raw_stores"), read("stores"))
    raw_sheet(wb.create_sheet("raw_old_menu"), old_menu())

    ws = wb.create_sheet("raw_menu_v2")
    rows = menu_with_size()
    ws.append(list(rows[0]))
    for c in ws[1]:
        c.font = Font(bold=True)
    for r in rows:
        ws.append([int(r["product_id"]), r["product_name"], r["size"], r["category"], float(r["unit_price_usd"])])
        ws.cell(ws.max_row, 5).number_format = "0.00"
    for letter, width in zip("ABCDE", (12, 26, 10, 12, 16)):
        ws.column_dimensions[letter].width = width
    ws.freeze_panes = "A2"

    # A price sheet inherited from a colleague: four formula columns that look alike but are not.
    ws = wb.create_sheet("raw_inherited")
    ws.append(["order_item_id", "product_id", "quantity", "discount_usd", "price_a", "price_b", "price_c", "price_d"])
    for c in ws[1]:
        c.font = Font(bold=True)
    for k, it in enumerate(sample_lines(), start=2):
        ws.append(
            [
                int(it["order_item_id"]),
                int(it["product_id"]),
                int(it["quantity"]),
                float(it["discount_usd"]),
                f"=VLOOKUP(B{k},raw_products!$A$2:$D$17,4,FALSE)",
                f"=INDEX(raw_products!$D$2:$D$17,MATCH(B{k},raw_products!$A$2:$A$17,0))",
                f"=VLOOKUP(B{k},raw_old_menu!$A$2:$D$14,4)",
                f"=VLOOKUP(B{k},raw_menu_v2!$A$2:$E$17,4,FALSE)",
            ]
        )
    for col in "EFGH":
        ws.column_dimensions[col].width = 12
    ws.column_dimensions["A"].width = 15
    ws.column_dimensions["D"].width = 14
    ws.freeze_panes = "A2"

    # The three-sheet habit: raw data stays untouched, work happens in calc, results go to output.
    wb.create_sheet("calc")
    wb.create_sheet("output")
    save(wb, "excel-legacy-lookups")
