"""Builds the dirty file of Part B of the Data Analyst simulation (lesson `take-home-simulation`): a till export of the second
quarter of cafe-sales, one row per order line, with named defects planted by fixed rules (no random numbers).

    python3 scripts/build-take-home-extract.py --out DIR     write DIR/take_home_export.csv
    python3 scripts/build-take-home-extract.py --check       exit 1 unless datasets/cafe-sales/v1/extras/take_home_export.csv matches the script

The story: the till software exports every line of every order from April 1 to June 30, 2026 (all three cafes, all completed:
the one canceled order is in March). Reads only datasets/cafe-sales/v1/ (Python 3.9+, standard library). The same input always
gives the same file. The columns are line_id, order_id, ordered_at, store_code, store, customer_id, product, category, quantity,
unit_price, discount, line_total, status, payment_method; line_total is quantity x unit_price - discount, as the till wrote it.

Planted defects, each by a rule, so a lesson can say exactly what is in the file:
  T1  mixed date text      ordered_at is '2026-05-14 14:35:00' except when order_id % 6 == 2, where it is '05/14/2026 2:35 PM'
  T2  double scan          a line whose line_id % 131 == 17 is written twice: same order, product, quantity and discount, a new
                           line_id (the original plus 100000), directly under the first. No order of the real data has the same
                           product on two lines, so the copy is a defect, not a second purchase
  T3  refund line          a line whose line_id % 163 == 11 (and that T2 does not copy) is followed by a line of the same order and
                           product with quantity -1, discount 0.00 and a new line_id (the original plus 200000). The real tables
                           hold no refunds, so this is the one defect that has no clean twin: a reader may keep it as a return
  T4  store renamed        from June 1 the store with code S3 is exported as 'Harbor Wharf'; its code stays S3
  T5  summary row          the last row has no line_id and product 'TOTAL': it holds the sum of quantity, discount and line_total
Inherited from the real data (the cafe-sales README): order 2075, line 6952, 20 Turkey Sandwiches where 2 were meant, on May 1.
"""
import csv
import sys
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAFE = ROOT / "datasets" / "cafe-sales" / "v1"
PUBLISHED = CAFE / "extras" / "take_home_export.csv"
FIRST_DAY = "2026-04-01"
RENAME_FROM = "2026-06-01"
HEADER = ["line_id", "order_id", "ordered_at", "store_code", "store", "customer_id", "product", "category",
          "quantity", "unit_price", "discount", "line_total", "status", "payment_method"]


def read(name):
    with open(CAFE / name, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def us_text(iso):  # '2026-05-14 14:35:00' -> '05/14/2026 2:35 PM', without strftime flags that differ between platforms
    date, clock = iso.split(" ")
    y, m, d = date.split("-")
    hh, mm = int(clock[:2]), clock[3:5]
    return f"{m}/{d}/{y} {hh % 12 or 12}:{mm} {'AM' if hh < 12 else 'PM'}"


def money(value):
    return f"{value:.2f}"


def build():
    products = {int(p["product_id"]): p for p in read("products.csv")}
    stores = {int(s["store_id"]): s["store_name"] for s in read("stores.csv")}
    orders = {int(o["order_id"]): o for o in read("orders.csv") if o["ordered_at"][:10] >= FIRST_DAY}
    rows, qty_total, discount_total, amount_total = [], 0, Decimal(0), Decimal(0)

    def add(line_id, order, product_id, quantity, discount, code):
        nonlocal qty_total, discount_total, amount_total
        product = products[product_id]
        price = Decimal(product["unit_price_usd"])
        total = quantity * price - discount
        stamp = order["ordered_at"]
        if int(order["order_id"]) % 6 == 2:  # T1
            stamp = us_text(stamp)
        name = stores[int(order["store_id"])]
        if name == "Harbor" and order["ordered_at"][:10] >= RENAME_FROM:  # T4
            name = "Harbor Wharf"
        rows.append([line_id, order["order_id"], stamp, code, name, order["customer_id"], product["product_name"],
                     product["category"], quantity, money(price), money(discount), money(total), order["status"],
                     order["payment_method"]])
        qty_total += quantity
        discount_total += discount
        amount_total += total

    for li in read("order_items.csv"):
        order = orders.get(int(li["order_id"]))
        if order is None:
            continue
        line_id, pid = int(li["order_item_id"]), int(li["product_id"])
        qty, discount = int(li["quantity"]), Decimal(li["discount_usd"])
        code = f"S{order['store_id']}"
        add(line_id, order, pid, qty, discount, code)
        if line_id % 131 == 17:  # T2
            add(line_id + 100000, order, pid, qty, discount, code)
        elif line_id % 163 == 11:  # T3
            add(line_id + 200000, order, pid, -1, Decimal("0.00"), code)
    rows.append(["", "", "", "", "", "", "TOTAL", "", qty_total, "", money(discount_total), money(amount_total), "", ""])  # T5
    return rows


def render(rows):
    import io
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(HEADER)
    writer.writerows(rows)
    return buffer.getvalue()


if __name__ == "__main__":
    if "--check" in sys.argv:
        ok = PUBLISHED.exists() and PUBLISHED.read_text(encoding="utf-8") == render(build())
        print("take_home_export.csv matches the script" if ok else "take_home_export.csv is missing or out of date")
        sys.exit(0 if ok else 1)
    if "--out" not in sys.argv:
        print(__doc__)
        sys.exit(0)
    folder = Path(sys.argv[sys.argv.index("--out") + 1])
    folder.mkdir(parents=True, exist_ok=True)
    result = build()
    (folder / "take_home_export.csv").write_text(render(result), encoding="utf-8", newline="")
    print(f"wrote {len(result):,} rows to {folder / 'take_home_export.csv'}")
