"""Helper for the lessons that count and total order lines (not a lesson module itself).

`line_rows()` flattens the cafe-sales tables into one row per order line, the shape a till system
would export: order, time, store, status, category, product, quantity, price, discount and the
amount of the line. `line_amount_usd` is `quantity * unit_price_usd - discount_usd`, the rule in
datasets/cafe-sales/README.md.
"""

from __future__ import annotations

from decimal import Decimal

from .common import read

LINE_COLUMNS = [
    "order_id",
    "ordered_at",
    "store_name",
    "status",
    "category",
    "product_name",
    "quantity",
    "unit_price_usd",
    "discount_usd",
    "line_amount_usd",
]


def line_rows() -> list[dict[str, str]]:
    """Every order line (3,287), in `order_item_id` order, as strings ready for `raw_sheet`."""
    stores = {s["store_id"]: s["store_name"] for s in read("stores")}
    products = {p["product_id"]: p for p in read("products")}
    orders = {o["order_id"]: o for o in read("orders")}
    rows = []
    for it in sorted(read("order_items"), key=lambda r: int(r["order_item_id"])):
        o = orders[it["order_id"]]
        p = products[it["product_id"]]
        amount = int(it["quantity"]) * Decimal(p["unit_price_usd"]) - Decimal(it["discount_usd"])
        rows.append(
            {
                "order_id": o["order_id"],
                "ordered_at": o["ordered_at"],
                "store_name": stores[o["store_id"]],
                "status": o["status"],
                "category": p["category"],
                "product_name": p["product_name"],
                "quantity": it["quantity"],
                "unit_price_usd": p["unit_price_usd"],
                "discount_usd": it["discount_usd"],
                "line_amount_usd": f"{amount:.2f}",
            }
        )
    return rows
