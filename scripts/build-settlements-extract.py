"""Builds the second source of the Data Analyst cleaning story (lesson `messy-data-cleaning-story`): a card-processor
settlement export derived from the cafe-sales orders, with named defects planted by fixed rules (no random numbers).

    python3 scripts/build-settlements-extract.py --out DIR     write DIR/settlements_raw.csv
    python3 scripts/build-settlements-extract.py --out DIR --day 2026-05-01   also print that day's rows as SQL VALUES

The story: the processor settles card and mobile orders only (cash never reaches it), one row per payment, keyed by the till's
order number. Reads only datasets/cafe-sales/v1/ (Python 3.9+, standard library). The same input always gives the same file.

Planted defects, each by a rule, so a lesson can say exactly what is in the file:
  D1  duplicate rows      every 41st row (index % 41 == 20, counted after sorting by time) is written twice: a retried export
  D2  merchant spelling   four spellings per store, chosen by order_id % 4 (case, trailing space, an alias)
  D3  silent null         merchant left empty when order_id % 53 == 10
  D4  key prefix          order_ref is 'ORD-' + order number, not the number
  D5  time zone and form  settled_at is UTC text 'MM/DD/YYYY HH:MM', the till's ordered_at is local ISO time
  D6  amount as text      '$12.50'; for Campus on 2026-06-03 the amount is whole cents ('1250'), a unit mismatch
  D7  test payments       type TEST, amount $0.01, at Old Town at 07:00 local on the first day of each month
  D8  failed batch        no rows at all for Harbor from 2026-05-18 to 2026-05-24 (local dates)
  D9  terminal offline    orders with order_id % 149 == 136 were never exported
  D10 corrected charge    order 2075: the till says 20 Turkey Sandwiches, the terminal was keyed with 2 (the cafe-sales README's
                          extra zero), so the processor's amount is the true one
"""
import csv
import sys
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
CAFE = ROOT / "datasets" / "cafe-sales" / "v1"
LOCAL = ZoneInfo("America/Los_Angeles")
SPELLINGS = {
    1: ["Old Town", "OLD TOWN", "Old Town ", "old town"],
    2: ["Campus", "CAMPUS", "campus ", "Berkeley Campus"],
    3: ["Harbor", "HARBOR", "Harbor ", "Alameda Harbor"],
}
CHARGED_QUANTITY = {(2075, 15): 2}  # D10: (order_id, product_id) -> the quantity that was really charged
CENTS_DAY = (2, "2026-06-03")  # D6: (store_id, local date) whose amounts are in cents
FAILED_BATCH = (3, "2026-05-18", "2026-05-24")  # D8: (store_id, first local date, last local date)


def read(name):
    with open(CAFE / name, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build():
    prices = {int(p["product_id"]): Decimal(p["unit_price_usd"]) for p in read("products.csv")}
    lines = {}
    for li in read("order_items.csv"):
        oid, pid = int(li["order_id"]), int(li["product_id"])
        qty = CHARGED_QUANTITY.get((oid, pid), int(li["quantity"]))
        lines[oid] = lines.get(oid, Decimal(0)) + qty * prices[pid] - Decimal(li["discount_usd"])
    rows = []  # (local datetime, store_id, order_ref, amount Decimal, type, order_id)
    for o in read("orders.csv"):
        oid = int(o["order_id"])
        if o["status"] != "completed" or o["payment_method"] not in ("card", "mobile"):
            continue
        local = datetime.strptime(o["ordered_at"], "%Y-%m-%d %H:%M:%S")
        store = int(o["store_id"])
        day = local.strftime("%Y-%m-%d")
        if (store == FAILED_BATCH[0] and FAILED_BATCH[1] <= day <= FAILED_BATCH[2]) or oid % 149 == 136:  # D8, D9
            continue
        rows.append((local, store, f"ORD-{oid}", lines[oid], "SALE", oid))
    for month in range(1, 7):  # D7
        rows.append((datetime(2026, month, 1, 7, 0), 1, f"TEST-{month:04d}", Decimal("0.01"), "TEST", 0))
    rows.sort(key=lambda r: (r[0], r[2]))
    out, sid = [], 0
    for local, store, ref, amount, kind, oid in rows:
        sid += 1
        utc = local.replace(tzinfo=LOCAL).astimezone(timezone.utc)
        merchant = "" if oid and oid % 53 == 10 else SPELLINGS[store][oid % 4]
        in_cents = (store, local.strftime("%Y-%m-%d")) == CENTS_DAY
        text = str(int(amount * 100)) if in_cents else f"${amount:.2f}"
        out.append([f"ST-{sid:06d}", ref, merchant, utc.strftime("%m/%d/%Y %H:%M"), text, kind])
    return [r for i, r in enumerate(out) for _ in range(2 if i % 41 == 20 else 1)]  # D1


HEADER = ["settlement_id", "order_ref", "merchant", "settled_at", "amount", "type"]

if __name__ == "__main__":
    if "--out" not in sys.argv:
        print(__doc__)
        sys.exit(0)
    folder = Path(sys.argv[sys.argv.index("--out") + 1])
    folder.mkdir(parents=True, exist_ok=True)
    result = build()
    with open(folder / "settlements_raw.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(HEADER)
        w.writerows(result)
    print(f"wrote {len(result):,} rows to {folder / 'settlements_raw.csv'}")
    if "--day" in sys.argv:
        day = sys.argv[sys.argv.index("--day") + 1]
        orders = {r["order_id"]: r["ordered_at"] for r in read("orders.csv")}
        for r in result:
            local_day = orders.get(r[1].replace("ORD-", ""), "")[:10] if r[1].startswith("ORD-") else f"2026-{int(r[1][-2:]):02d}-01"
            if local_day == day:
                print("(" + ", ".join("'" + v + "'" for v in r) + "),")
