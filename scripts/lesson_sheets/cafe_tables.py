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


# ---------------------------------------------------------------------------------------------
# Exercise sheets that start from a prepared state ("done for you" in a lesson means it is here).

TABLE_FIRST_ROW = 6  # rows 1-3 hold totals, row 4 is blank, row 5 is the header, records start at row 6


def write_orders_table_sheet(
    ws: Worksheet,
    orders: list[Order],
    table_name: str,
    summary: list[tuple[str, str]],
    extra: tuple[str, list[str]] | None = None,
) -> None:
    """A copy of raw_orders as an Excel Table: header in row 5, records from row 6, and the
    summary formulas (label in column A, formula in column C) in the rows above the table, where a
    filter can never hide them. `extra` adds one more column: (header, one formula per record)."""
    from openpyxl.worksheet.table import Table, TableStyleInfo

    for i, (label, formula) in enumerate(summary, start=1):
        ws.cell(i, 1, label).font = Font(bold=True)
        ws.cell(i, 3, formula)
    header = ORDER_HEADER + ([extra[0]] if extra else [])
    for col, name in enumerate(header, start=1):
        ws.cell(5, col, name).font = Font(bold=True)
    for r, o in enumerate(orders, start=TABLE_FIRST_ROW):
        for col, v in enumerate(order_row(o), start=1):
            cell = ws.cell(r, col, v)
            if col == 4:
                cell.number_format = "yyyy-mm-dd"
            elif col == 7:
                cell.number_format = "0.00"
        if extra:
            ws.cell(r, 8, extra[1][r - TABLE_FIRST_ROW])
    last_col = "H" if extra else "G"
    last_row = TABLE_FIRST_ROW + len(orders) - 1
    table = Table(displayName=table_name, ref=f"A5:{last_col}{last_row}")
    table.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    ws.add_table(table)
    for col, width in zip("ABCDEFGH", (16, 12, 12, 12, 16, 12, 12, 12)):
        ws.column_dimensions[col].width = width


def order_ranges(n: int) -> tuple[str, str]:
    """The record ranges of an order Table made by write_orders_table_sheet: order_id and amount_usd."""
    last = TABLE_FIRST_ROW + n - 1
    return f"A{TABLE_FIRST_ROW}:A{last}", f"G{TABLE_FIRST_ROW}:G{last}"
