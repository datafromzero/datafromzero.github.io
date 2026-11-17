"""The flat order-lines sheet used as a PivotTable and QUERY source (shared by several lessons).

One row is one order line: the till tables orders, order_items, products and stores joined into a
single tidy table. Not a lesson module: build-lesson-sheets.py only runs excel_*.py.

Columns (A to K): order_line_id, order_id, date, store, product, category, quantity,
unit_price_usd, discount_usd, amount_usd, status.
"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from openpyxl.styles import Font
from openpyxl.worksheet.worksheet import Worksheet

from .common import read

HEADER = [
    "order_line_id",
    "order_id",
    "date",
    "store",
    "product",
    "category",
    "quantity",
    "unit_price_usd",
    "discount_usd",
    "amount_usd",
    "status",
]


def order_lines() -> list[dict[str, object]]:
    """Every order line, in order_item_id order. amount_usd = quantity * unit price - discount."""
    stores = {s["store_id"]: s["store_name"] for s in read("stores")}
    products = {p["product_id"]: p for p in read("products")}
    orders = {o["order_id"]: o for o in read("orders")}
    rows: list[dict[str, object]] = []
    for it in read("order_items"):
        o = orders[it["order_id"]]
        p = products[it["product_id"]]
        qty = int(it["quantity"])
        price = Decimal(p["unit_price_usd"])
        discount = Decimal(it["discount_usd"])
        rows.append(
            {
                "order_line_id": int(it["order_item_id"]),
                "order_id": int(it["order_id"]),
                "date": datetime.strptime(o["ordered_at"], "%Y-%m-%d %H:%M:%S").date(),
                "store": stores[o["store_id"]],
                "product": p["product_name"],
                "category": p["category"],
                "quantity": qty,
                "unit_price_usd": float(price),
                "discount_usd": float(discount),
                "amount_usd": float(qty * price - discount),
                "status": o["status"],
            }
        )
    return rows


def write_lines(
    ws: Worksheet,
    rows: list[dict[str, object]],
    *,
    text_amounts: bool = False,
    text_dates: bool = False,
    blank_row_after: int | None = None,
) -> None:
    """Write the lines to a sheet. The flags make a deliberately messy copy for exercises:
    amounts typed as text, dates typed as text, one blank row inserted after row N of data."""
    ws.append(HEADER)
    for c in ws[1]:
        c.font = Font(bold=True)
    for i, r in enumerate(rows, start=1):
        values = [r[h] for h in HEADER]
        if text_amounts:
            values[HEADER.index("amount_usd")] = f"{r['amount_usd']:.2f}"
        if text_dates:
            values[HEADER.index("date")] = r["date"].isoformat()  # type: ignore[union-attr]
        ws.append(values)
        if blank_row_after == i:
            ws.append([])
    for col, h in enumerate(HEADER, start=1):
        letter = ws.cell(1, col).column_letter
        ws.column_dimensions[letter].width = 24 if h == "product" else max(12, len(h) + 2)
        fmt = None
        if h == "date" and not text_dates:
            fmt = "yyyy-mm-dd"
        elif h.endswith("_usd") and not (h == "amount_usd" and text_amounts):
            fmt = "0.00"
        if fmt:
            for (cell,) in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                if isinstance(cell.value, (date, float)):
                    cell.number_format = fmt
    ws.freeze_panes = "A2"
