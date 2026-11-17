"""Tables derived from the cafe-sales CSV files, shared by the Excel lesson workbooks.

Everything here is computed from datasets/cafe-sales/v1/ with Decimal arithmetic and no randomness,
so the numbers a lesson quotes can be traced to the dataset. Lesson modules call these helpers; the
CSV files are never changed.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from decimal import Decimal

from openpyxl.styles import Font
from openpyxl.worksheet.worksheet import Worksheet

from .common import read

TS = "%Y-%m-%d %H:%M:%S"


@dataclass(frozen=True)
class Line:
    order_id: int
    product_name: str
    quantity: int
    unit_price: Decimal
    discount: Decimal
    store_id: int
    when: datetime
    status: str
    payment: str

    @property
    def amount(self) -> Decimal:
        return self.quantity * self.unit_price - self.discount


@dataclass(frozen=True)
class Order:
    order_id: int
    customer_id: int | None
    store_name: str
    when: datetime
    payment: str
    status: str
    amount: Decimal

    @property
    def day(self) -> date:
        return self.when.date()


def order_lines() -> list[Line]:
    """Every order line (3,287), in order_item_id order, with product name, unit price and the order's details."""
    products = {p["product_id"]: p for p in read("products")}
    orders = {o["order_id"]: o for o in read("orders")}
    out = []
    for it in read("order_items"):
        o = orders[it["order_id"]]
        p = products[it["product_id"]]
        out.append(
            Line(
                order_id=int(it["order_id"]),
                product_name=p["product_name"],
                quantity=int(it["quantity"]),
                unit_price=Decimal(p["unit_price_usd"]),
                discount=Decimal(it["discount_usd"]),
                store_id=int(o["store_id"]),
                when=datetime.strptime(o["ordered_at"], TS),
                status=o["status"],
                payment=o["payment_method"],
            )
        )
    return out


def order_table() -> list[Order]:
    """Every order (1,800) in order_id order, with the store name and the order's amount in USD
    (sum of its lines: quantity x unit price - discount). A canceled order keeps its amount."""
    stores = {s["store_id"]: s["store_name"] for s in read("stores")}
    amount: dict[int, Decimal] = {}
    for ln in order_lines():
        amount[ln.order_id] = amount.get(ln.order_id, Decimal(0)) + ln.amount
    out = []
    for o in read("orders"):
        oid = int(o["order_id"])
        out.append(
            Order(
                order_id=oid,
                customer_id=int(o["customer_id"]) if o["customer_id"] else None,
                store_name=stores[o["store_id"]],
                when=datetime.strptime(o["ordered_at"], TS),
                payment=o["payment_method"],
                status=o["status"],
                amount=amount.get(oid, Decimal(0)),
            )
        )
    return out


def write_table(
    ws: Worksheet,
    header: list[str],
    rows: list[list[object]],
    widths: dict[str, int] | None = None,
    formats: dict[str, str] | None = None,
) -> None:
    """Header row in bold, then the rows; number formats and widths by column name; header frozen."""
    ws.append(header)
    for c in ws[1]:
        c.font = Font(bold=True)
    for r in rows:
        ws.append(r)
    for col, name in enumerate(header, start=1):
        letter = ws.cell(1, col).column_letter
        ws.column_dimensions[letter].width = (widths or {}).get(name, max(12, len(name) + 2))
        fmt = (formats or {}).get(name)
        if fmt:
            for (cell,) in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                if cell.value is not None and not isinstance(cell.value, str):
                    cell.number_format = fmt
    ws.freeze_panes = "A2"


ORDER_HEADER = ["order_id", "customer_id", "store", "ordered_on", "payment_method", "status", "amount_usd"]
ORDER_FORMATS = {"ordered_on": "yyyy-mm-dd", "amount_usd": "0.00"}


def order_row(o: Order) -> list[object]:
    return [o.order_id, o.customer_id, o.store_name, o.day, o.payment, o.status, float(o.amount)]


def write_orders_sheet(ws: Worksheet, orders: list[Order]) -> None:
    """The order list used by the Tables and IF lessons: one row per order, real dates, real numbers."""
    write_table(ws, ORDER_HEADER, [order_row(o) for o in orders], formats=ORDER_FORMATS)
