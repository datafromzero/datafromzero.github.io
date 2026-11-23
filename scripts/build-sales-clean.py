"""Builds `datasets/cafe-sales/v1/extras/sales_clean.csv`, the input of the Tableau Public dashboard of the Data Analyst lesson
`first-bi-dashboard`: the `sales_clean` table of the cleaning-story lesson, one row per sold line of a completed order, as a file.
A derived, teaching-only file (SPEC D57); the five cafe-sales tables are not touched.

    python3 scripts/build-sales-clean.py            write datasets/cafe-sales/v1/extras/sales_clean.csv
    python3 scripts/build-sales-clean.py --check    exit 1 unless the published file matches the script

Reads only datasets/cafe-sales/v1/ (Python 3.9+, standard library). Rules: completed orders only; the extra-zero line (order item 6952,
20 Turkey Sandwiches) is corrected to quantity 2; `amount` is quantity times unit price minus discount; `loyalty_tier` is `walk-in`
when the order has no customer; `hour` is the local hour of the order as text with a leading zero and an `h` ('07h'), a label for a
chart. Rows are in `line_id` order. The same input always gives the same file.
"""
import csv
import io
import sys
from datetime import datetime
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAFE = ROOT / "datasets" / "cafe-sales" / "v1"
TARGET = CAFE / "extras" / "sales_clean.csv"
CORRECTED_LINE, CORRECTED_QUANTITY = 6952, 2  # the extra zero of the cafe-sales README
HEADER = ["line_id", "order_id", "ordered_at", "order_date", "store", "product", "category", "quantity", "unit_price", "discount",
          "amount", "payment_method", "loyalty_tier", "hour"]


def read(name):
    with open(CAFE / name, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build():
    stores = {r["store_id"]: r["store_name"] for r in read("stores.csv")}
    products = {r["product_id"]: r for r in read("products.csv")}
    tiers = {r["customer_id"]: r["loyalty_tier"] for r in read("customers.csv")}
    orders = {r["order_id"]: r for r in read("orders.csv") if r["status"] == "completed"}
    rows = []
    for li in sorted(read("order_items.csv"), key=lambda r: int(r["order_item_id"])):
        o = orders.get(li["order_id"])
        if o is None:
            continue
        p = products[li["product_id"]]
        quantity = CORRECTED_QUANTITY if int(li["order_item_id"]) == CORRECTED_LINE else int(li["quantity"])
        price, discount = Decimal(p["unit_price_usd"]), Decimal(li["discount_usd"])
        when = datetime.strptime(o["ordered_at"], "%Y-%m-%d %H:%M:%S")
        rows.append([li["order_item_id"], o["order_id"], o["ordered_at"], when.strftime("%Y-%m-%d"), stores[o["store_id"]],
                     p["product_name"], p["category"], quantity, f"{price:.2f}", f"{discount:.2f}",
                     f"{quantity * price - discount:.2f}", o["payment_method"], tiers.get(o["customer_id"], "walk-in") if o["customer_id"] else "walk-in",
                     f"{when.hour:02d}h"])
    return rows


def render():
    out = io.StringIO()
    w = csv.writer(out, lineterminator="\n")
    w.writerow(HEADER)
    w.writerows(build())
    return out.getvalue()


if __name__ == "__main__":
    text = render()
    if "--check" in sys.argv:
        if not TARGET.exists() or TARGET.read_bytes().decode("utf-8") != text:
            raise SystemExit(f"{TARGET.relative_to(ROOT)} differs from the generator (run the script without --check)")
        print("extras/sales_clean.csv matches the generator.")
    else:
        TARGET.parent.mkdir(parents=True, exist_ok=True)
        with open(TARGET, "w", newline="", encoding="utf-8") as f:
            f.write(text)
        print(f"wrote {len(text.splitlines()) - 1:,} rows to {TARGET.relative_to(ROOT)}")
