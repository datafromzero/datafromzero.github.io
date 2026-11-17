"""Build the cafe-sales dataset (SPEC §7): CSV files, an .xlsx workbook and a DuckDB load script.

Synthetic and deterministic: the same seed always gives the same rows, so the files can be rebuilt
and compared. A released version folder (v1/) is immutable; change the data only in a new folder.

    python3 scripts/build-cafe-sales.py            # writes datasets/cafe-sales/v1/
    python3 scripts/build-cafe-sales.py --check    # rebuilds in memory and fails if the CSVs differ

Needs Python 3.10+ and openpyxl 3.1 (only for the .xlsx file).
"""

from __future__ import annotations

import csv
import io
import random
import sys
from datetime import date, datetime, timedelta
from decimal import Decimal
from pathlib import Path

from stable_xlsx import stabilize

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "datasets" / "cafe-sales" / "v1"
SEED = 20260101
FIRST_DAY = date(2026, 1, 1)
LAST_DAY = date(2026, 6, 30)

STORES = [
    # store_id, store_name, city, opened_on
    (1, "Old Town", "Oakland", date(2023, 5, 12)),
    (2, "Campus", "Berkeley", date(2024, 9, 3)),
    (3, "Harbor", "Alameda", date(2026, 4, 1)),  # opens inside the period: no orders before April
]

PRODUCTS = [
    # product_id, product_name, category, unit_price_usd, weight (how often it sells)
    (1, "Espresso", "coffee", "3.00", 6),
    (2, "Americano", "coffee", "3.50", 9),
    (3, "Latte", "coffee", "4.50", 14),
    (4, "Cappuccino", "coffee", "4.50", 10),  # tied price with Latte
    (5, "Mocha", "coffee", "5.00", 6),
    (6, "Cold Brew", "coffee", "4.75", 8),
    (7, "Green Tea", "tea", "3.25", 4),
    (8, "Chai Latte", "tea", "4.75", 6),  # tied price with Cold Brew
    (9, "Iced Lemon Tea", "tea", "3.75", 4),
    (10, "Croissant", "bakery", "3.25", 9),
    (11, "Blueberry Muffin", "bakery", "3.50", 7),
    (12, "Banana Bread", "bakery", "3.75", 5),
    (13, "Bagel with Cream Cheese", "food", "4.25", 5),
    (14, "Avocado Toast", "food", "8.50", 4),
    (15, "Turkey Sandwich", "food", "9.25", 4),
    (16, "Pumpkin Spice Latte", "coffee", "5.50", 0),  # seasonal: never sold in January to June
]

CITIES = ["Oakland", "Berkeley", "Alameda"]
TIERS = [("bronze", 60), ("silver", 30), ("gold", 10)]
PAYMENTS = [("card", 55), ("mobile", 30), ("cash", 15)]
N_CUSTOMERS = 150


def pick(rng: random.Random, weighted: list[tuple[str, int]]) -> str:
    return rng.choices([v for v, _ in weighted], weights=[w for _, w in weighted])[0]


def money(d: Decimal) -> str:
    return f"{d:.2f}"


def build() -> dict[str, tuple[list[str], list[list[object]]]]:
    rng = random.Random(SEED)

    stores = [[sid, name, city, opened] for sid, name, city, opened in STORES]
    products = [[pid, name, cat, Decimal(price)] for pid, name, cat, price, _ in PRODUCTS]
    sellable = [(pid, w) for pid, _, _, _, w in PRODUCTS if w > 0]
    price_of = {pid: Decimal(price) for pid, _, _, price, _ in PRODUCTS}

    # Customers sign up between June 2025 and June 2026; about one in five was referred by an
    # earlier customer (referred_by points to a smaller customer_id, so the self-join has a direction).
    signup_start = date(2025, 6, 1)
    span = (LAST_DAY - signup_start).days
    signups = sorted(signup_start + timedelta(days=rng.randrange(span)) for _ in range(N_CUSTOMERS))
    customers = []
    for i, signed in enumerate(signups, start=1):
        referred = rng.randrange(1, i) if i > 5 and rng.random() < 0.2 else None
        customers.append([i, signed, rng.choice(CITIES), pick(rng, TIERS), referred])
    home_store = {c[0]: 1 + CITIES.index(c[2]) for c in customers}
    tier_of = {c[0]: c[3] for c in customers}

    # The customer whose only order is the canceled one. Chosen up front so no other order uses them.
    canceled_customer = 42

    orders: list[list[object]] = []
    items: list[list[object]] = []
    order_id = 1000
    item_id = 5000
    day = FIRST_DAY
    while day <= LAST_DAY:
        weekend = day.weekday() >= 5
        visits: list[tuple[datetime, int]] = []
        for sid, _, _, opened in STORES:
            if day < opened:
                continue
            n = rng.randint(3, 7) if weekend else rng.randint(2, 5)
            visits += [
                (datetime(day.year, day.month, day.day, 7) + timedelta(minutes=rng.randrange(11 * 60)), sid)
                for _ in range(n)
            ]
        # Order ids rise with time across all stores, as one shared till system would number them.
        for ts, sid in sorted(visits):
            # Customers who have signed up by this day; most orders come from the home-city store.
            pool = [c[0] for c in customers if c[1] <= day and c[0] != canceled_customer]
            local = [c for c in pool if home_store[c] == sid]
            choices = local if local and rng.random() < 0.8 else pool
            if not choices:
                continue
            order_id += 1
            cust = rng.choice(choices)
            orders.append([order_id, cust, sid, ts, "completed", pick(rng, PAYMENTS)])
            n_lines = rng.choice([1, 1, 2, 2, 3])
            chosen: list[int] = []
            while len(chosen) < n_lines:
                pid = rng.choices([p for p, _ in sellable], weights=[w for _, w in sellable])[0]
                if pid not in chosen:
                    chosen.append(pid)
            for pid in chosen:
                item_id += 1
                qty = rng.choice([1, 1, 1, 1, 2, 2, 3])
                disc = Decimal("0.50") if tier_of[cust] == "gold" and rng.random() < 0.5 else Decimal("0.00")
                items.append([item_id, order_id, pid, qty, disc])
        day += timedelta(days=1)

    by_id = {o[0]: o for o in orders}

    # Rig 1: one walk-in order with no customer (customer_id left empty).
    walk_in = next(o for o in orders if o[3].date() == date(2026, 2, 14) and o[2] == 1)
    walk_in[1] = None

    # Rig 2: one canceled order, the only order of customer 42 (signed up before it).
    signed_42 = customers[canceled_customer - 1][1]
    target = next(o for o in orders if o[3].date() >= max(signed_42, date(2026, 3, 1)) and o[1] is not None)
    target[1] = canceled_customer
    target[4] = "canceled"

    # Rig 3: one outlier day from an extra zero: a quantity of 2 typed as 20, on the most expensive
    # product on a May weekday, so that day clearly tops the daily revenue chart.
    outlier = next(
        it
        for it in items
        if by_id[it[1]][3].month == 5
        and by_id[it[1]][3].weekday() < 5
        and it[2] == 15
        and it[3] == 2
        and by_id[it[1]][4] == "completed"
    )
    outlier[3] = 20

    for it in items:
        if it[4] > price_of[it[2]] * it[3]:
            raise SystemExit(f"discount larger than line amount on order_item {it[0]}")

    return {
        "stores": (["store_id", "store_name", "city", "opened_on"], stores),
        "customers": (["customer_id", "signup_date", "city", "loyalty_tier", "referred_by"], customers),
        "products": (["product_id", "product_name", "category", "unit_price_usd"], products),
        "orders": (["order_id", "customer_id", "store_id", "ordered_at", "status", "payment_method"], orders),
        "order_items": (["order_item_id", "order_id", "product_id", "quantity", "discount_usd"], items),
    }


SQL_TYPES = {
    "store_id": "INTEGER",
    "store_name": "VARCHAR",
    "city": "VARCHAR",
    "opened_on": "DATE",
    "customer_id": "INTEGER",
    "signup_date": "DATE",
    "loyalty_tier": "VARCHAR",
    "referred_by": "INTEGER",
    "product_id": "INTEGER",
    "product_name": "VARCHAR",
    "category": "VARCHAR",
    "unit_price_usd": "DECIMAL(6,2)",
    "order_id": "INTEGER",
    "ordered_at": "TIMESTAMP",
    "status": "VARCHAR",
    "payment_method": "VARCHAR",
    "order_item_id": "INTEGER",
    "quantity": "INTEGER",
    "discount_usd": "DECIMAL(6,2)",
}


def text(v: object) -> str:
    if v is None:
        return ""
    if isinstance(v, Decimal):
        return money(v)
    if isinstance(v, datetime):
        return v.strftime("%Y-%m-%d %H:%M:%S")
    if isinstance(v, date):
        return v.isoformat()
    return str(v)


def to_csv(header: list[str], rows: list[list[object]]) -> str:
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(header)
    for r in rows:
        w.writerow([text(v) for v in r])
    return buf.getvalue()


def sql_literal(v: object) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, (int, Decimal)):
        return text(v)
    return "'" + text(v).replace("'", "''") + "'"


def to_sql(tables: dict[str, tuple[list[str], list[list[object]]]]) -> str:
    out = [
        "-- cafe-sales v1: DuckDB load script. Synthetic data, CC BY 4.0, https://datafromzero.github.io",
        "-- Generated by scripts/build-cafe-sales.py; do not edit by hand.",
        "",
    ]
    for name, (header, rows) in tables.items():
        cols = ",\n  ".join(f"{c} {SQL_TYPES[c]}" for c in header)
        out.append(f"CREATE OR REPLACE TABLE {name} (\n  {cols}\n);")
        for start in range(0, len(rows), 500):
            chunk = rows[start : start + 500]
            values = ",\n".join("  (" + ", ".join(sql_literal(v) for v in r) + ")" for r in chunk)
            out.append(f"INSERT INTO {name} VALUES\n{values};")
        out.append("")
    return "\n".join(out)


def to_xlsx(tables: dict[str, tuple[list[str], list[list[object]]]], path: Path) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Font

    wb = Workbook()
    wb.remove(wb.active)
    for name, (header, rows) in tables.items():
        ws = wb.create_sheet(name)
        ws.append(header)
        for c in ws[1]:
            c.font = Font(bold=True)
        for r in rows:
            ws.append([float(v) if isinstance(v, Decimal) else v for v in r])
        for col, h in enumerate(header, start=1):
            letter = ws.cell(1, col).column_letter
            ws.column_dimensions[letter].width = max(12, len(h) + 2)
            if h.endswith("_usd"):
                for (cell,) in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                    cell.number_format = "0.00"
            elif h == "ordered_at":
                ws.column_dimensions[letter].width = 20
                for (cell,) in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                    cell.number_format = "yyyy-mm-dd hh:mm"
            elif h in ("opened_on", "signup_date"):
                for (cell,) in ws.iter_rows(min_row=2, min_col=col, max_col=col):
                    cell.number_format = "yyyy-mm-dd"
        ws.freeze_panes = "A2"
    wb.properties.creator = "datafromzero"
    wb.save(path)
    stabilize(path)


def main() -> None:
    tables = build()
    csvs = {f"{name}.csv": to_csv(h, rows) for name, (h, rows) in tables.items()}
    if "--check" in sys.argv:
        bad = [f for f, body in csvs.items() if (OUT / f).read_text() != body]
        if bad:
            raise SystemExit(f"cafe-sales v1 differs from the generator: {', '.join(bad)}")
        print("cafe-sales v1 matches the generator.")
        return
    OUT.mkdir(parents=True, exist_ok=True)
    for f, body in csvs.items():
        (OUT / f).write_text(body)
    (OUT / "cafe-sales.sql").write_text(to_sql(tables))
    to_xlsx(tables, OUT / "cafe-sales.xlsx")
    for name, (_, rows) in tables.items():
        print(f"{name}: {len(rows)} rows")


if __name__ == "__main__":
    main()
