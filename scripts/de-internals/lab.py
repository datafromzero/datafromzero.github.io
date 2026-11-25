"""Builds the lab of the Data Engineer deep dive: the five cafe-sales tables and four larger synthetic tables, as CSV files plus one
PostgreSQL setup script.

    python3 lab.py            write the folder ./lab (cafe/, big/ and setup.sql) and print the rows and a checksum of each file
    python3 lab.py --check    rebuild in a temporary folder and exit 1 unless every file matches the checksums printed below

Standard library only. The synthetic tables are a function of SEED = 2026 and nothing else: every draw is Random(SEED).random(),
whose stream has been the same in every Python 3 release. The cafe-sales files are read from datasets/cafe-sales/v1/ when this
script sits in the site repository, and otherwise fetched from the v0.2.0 release tag of the site.

What it makes (every number is printed when it runs):
  big/customers_big.csv   200,000 customers with a name in three capitalizations ("Ana Lopez", "ANA LOPEZ", "ana lopez")
  big/orders_big.csv      500,000 orders, in time order from 2026-01-01 to 2026-06-30, 1 percent without a customer
  big/order_items_big.csv about 950,000 lines of those orders, with the product chosen from a skewed list (a few products sell most)
  big/lines_big.csv       the same lines with the order's columns beside them, one flat row for each line (12 columns)
"""
import csv
import hashlib
import sys
import tempfile
import urllib.request
from bisect import bisect_right
from datetime import datetime, timedelta
from pathlib import Path
from random import Random

SEED = 2026
N_CUSTOMERS = 200_000
N_ORDERS = 500_000
START = datetime(2026, 1, 1)
SPAN_SECONDS = 181 * 86_400  # January 1 to June 30

CAFE_TAG = "https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v0.2.0/datasets/cafe-sales/v1/"
CAFE_FILES = ["stores", "customers", "products", "orders", "order_items"]

FIRST = ["Ana", "Ben", "Chloe", "Dev", "Elena", "Femi", "Grace", "Hugo", "Isha", "Jonas", "Kira", "Leo", "Maya", "Noah", "Olga",
         "Priya", "Quinn", "Rosa", "Sam", "Tara", "Uma", "Victor", "Wen", "Xavier", "Yara", "Zane", "Amir", "Bea", "Cyrus", "Dara"]
LAST = ["Lopez", "Nguyen", "Okafor", "Patel", "Rossi", "Silva", "Tanaka", "Umar", "Vega", "Wright", "Xu", "Young", "Zhou", "Adams",
        "Baker", "Cruz", "Diaz", "Evans", "Fox", "Gray", "Hill", "Ito", "Jones", "Kim", "Lee", "Moore", "Ng", "Ortiz", "Park", "Reyes"]
CITIES = ["Oakland", "Berkeley", "Alameda"]
PAYMENT = [("card", 0.50), ("mobile", 0.35), ("cash", 0.15)]
STORES = [(1, 0.40), (2, 0.35), (3, 0.25)]
# The skew: product 3 sells 30 percent of the lines, product 1 15 percent, and the other 14 share the rest.
PRODUCT_WEIGHT = {3: 0.30, 1: 0.15, 4: 0.10, 2: 0.08, 10: 0.08}
PRICE = {1: 3.00, 2: 3.50, 3: 4.50, 4: 4.50, 5: 5.00, 6: 4.75, 7: 3.25, 8: 4.75, 9: 3.75, 10: 3.25, 11: 3.50, 12: 3.75,
         13: 4.25, 14: 8.50, 15: 9.25, 16: 5.50}


def cumulative(pairs):
    total, out = 0.0, []
    for _, w in pairs:
        total += w
        out.append(total)
    return out


def pick(rng, pairs, cum):
    return pairs[min(bisect_right(cum, rng.random()), len(pairs) - 1)][0]


def make_big(out):
    rng = Random(SEED)
    out.mkdir(parents=True, exist_ok=True)
    pay_cum, store_cum = cumulative(PAYMENT), cumulative(STORES)
    rest = (1 - sum(PRODUCT_WEIGHT.values())) / (16 - len(PRODUCT_WEIGHT))
    products = [(p, PRODUCT_WEIGHT.get(p, rest)) for p in range(1, 17)]
    prod_cum = cumulative(products)

    with open(out / "customers_big.csv", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["customer_id", "name", "city", "signup_date"])
        for cid in range(1, N_CUSTOMERS + 1):
            name = f"{FIRST[int(rng.random() * 30)]} {LAST[int(rng.random() * 30)]}"
            r = rng.random()
            name = name if r < 0.70 else name.upper() if r < 0.90 else name.lower()
            city = CITIES[int(rng.random() * 3)]
            signup = (datetime(2025, 6, 1) + timedelta(days=int(rng.random() * 400))).date().isoformat()
            w.writerow([cid, name, city, signup])

    orders = []
    with open(out / "orders_big.csv", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["order_id", "customer_id", "store_id", "ordered_at", "status", "payment_method"])
        for oid in range(1, N_ORDERS + 1):
            ordered_at = START + timedelta(seconds=oid * SPAN_SECONDS // N_ORDERS)
            customer = "" if rng.random() < 0.01 else 1 + int(rng.random() * N_CUSTOMERS)
            store = pick(rng, STORES, store_cum)
            status = "canceled" if rng.random() < 0.002 else "completed"
            payment = pick(rng, PAYMENT, pay_cum)
            row = [oid, customer, store, ordered_at.isoformat(sep=" "), status, payment]
            orders.append(row)
            w.writerow(row)

    n_lines = 0
    with open(out / "order_items_big.csv", "w", newline="") as fi, open(out / "lines_big.csv", "w", newline="") as fl:
        wi, wl = csv.writer(fi, lineterminator="\n"), csv.writer(fl, lineterminator="\n")
        wi.writerow(["order_item_id", "order_id", "product_id", "quantity", "discount_usd"])
        wl.writerow(["order_item_id", "order_id", "ordered_at", "store_id", "customer_id", "status", "payment_method",
                     "product_id", "quantity", "unit_price_usd", "discount_usd", "channel"])
        for oid, customer, store, ordered_at, status, payment in orders:
            r = rng.random()
            n = 1 if r < 0.45 else 2 if r < 0.75 else 3 if r < 0.90 else 4
            for _ in range(n):
                n_lines += 1
                product = pick(rng, products, prod_cum)
                q = rng.random()
                quantity = 1 if q < 0.70 else 2 if q < 0.92 else 3
                discount = "0.50" if rng.random() < 0.05 else "0.00"
                channel = "counter" if rng.random() < 0.8 else "app"
                wi.writerow([n_lines, oid, product, quantity, discount])
                wl.writerow([n_lines, oid, ordered_at, store, customer, status, payment, product, quantity,
                             f"{PRICE[product]:.2f}", discount, channel])
    return n_lines


def fetch_cafe(out):
    out.mkdir(parents=True, exist_ok=True)
    here = Path(__file__).resolve().parents[2] / "datasets" / "cafe-sales" / "v1"
    for name in CAFE_FILES:
        target = out / f"{name}.csv"
        if (here / f"{name}.csv").exists():
            target.write_bytes((here / f"{name}.csv").read_bytes())
        else:
            with urllib.request.urlopen(CAFE_TAG + f"{name}.csv") as r:
                target.write_bytes(r.read())


SETUP_SQL = """-- Lab of the Data Engineer deep dive. Run it once, from the folder that holds cafe/ and big/:
--   createdb lab && psql -d lab -f setup.sql
-- The five cafe-sales tables first (primary keys, the same on every cafe table), then four larger synthetic tables.
-- The synthetic tables have only a primary key: every lesson adds the indexes it needs.
SET client_min_messages = warning;
DROP TABLE IF EXISTS order_items, orders, customers, products, stores, lines_big, order_items_big, orders_big, customers_big CASCADE;

CREATE TABLE stores (store_id integer PRIMARY KEY, store_name text NOT NULL, city text NOT NULL, opened_on date NOT NULL);
CREATE TABLE customers (customer_id integer PRIMARY KEY, signup_date date NOT NULL, city text NOT NULL, loyalty_tier text NOT NULL,
                        referred_by integer);
CREATE TABLE products (product_id integer PRIMARY KEY, product_name text NOT NULL, category text NOT NULL,
                       unit_price_usd numeric(6, 2) NOT NULL);
CREATE TABLE orders (order_id integer PRIMARY KEY, customer_id integer, store_id integer NOT NULL, ordered_at timestamp NOT NULL,
                     status text NOT NULL, payment_method text NOT NULL);
CREATE TABLE order_items (order_item_id integer PRIMARY KEY, order_id integer NOT NULL, product_id integer NOT NULL,
                          quantity integer NOT NULL, discount_usd numeric(8, 2) NOT NULL);
\\copy stores FROM 'cafe/stores.csv' CSV HEADER
\\copy customers FROM 'cafe/customers.csv' CSV HEADER
\\copy products FROM 'cafe/products.csv' CSV HEADER
\\copy orders FROM 'cafe/orders.csv' CSV HEADER
\\copy order_items FROM 'cafe/order_items.csv' CSV HEADER

CREATE TABLE customers_big (customer_id integer PRIMARY KEY, name text NOT NULL, city text NOT NULL, signup_date date NOT NULL);
CREATE TABLE orders_big (order_id integer PRIMARY KEY, customer_id integer, store_id integer NOT NULL, ordered_at timestamp NOT NULL,
                         status text NOT NULL, payment_method text NOT NULL);
CREATE TABLE order_items_big (order_item_id integer PRIMARY KEY, order_id integer NOT NULL, product_id integer NOT NULL,
                              quantity integer NOT NULL, discount_usd numeric(8, 2) NOT NULL);
CREATE TABLE lines_big (order_item_id integer PRIMARY KEY, order_id integer NOT NULL, ordered_at timestamp NOT NULL,
                        store_id integer NOT NULL, customer_id integer, status text NOT NULL, payment_method text NOT NULL,
                        product_id integer NOT NULL, quantity integer NOT NULL, unit_price_usd numeric(6, 2) NOT NULL,
                        discount_usd numeric(8, 2) NOT NULL, channel text NOT NULL);
\\copy customers_big FROM 'big/customers_big.csv' CSV HEADER
\\copy orders_big FROM 'big/orders_big.csv' CSV HEADER
\\copy order_items_big FROM 'big/order_items_big.csv' CSV HEADER
\\copy lines_big FROM 'big/lines_big.csv' CSV HEADER

-- Plans in this deep dive run in one process and without JIT, so that they fit on a page and read the same on every machine.
SELECT current_database() AS db \\gset
ALTER DATABASE :"db" SET max_parallel_workers_per_gather = 0;
ALTER DATABASE :"db" SET jit = off;

-- A given helper for the index lesson: the first four bytes of a key that bt_page_items shows in hex, as an integer.
CREATE OR REPLACE FUNCTION bt_key(data text) RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN coalesce(data, '') = '' THEN NULL
         ELSE get_byte(decode(replace(data, ' ', ''), 'hex'), 0) + 256 * get_byte(decode(replace(data, ' ', ''), 'hex'), 1)
              + 65536 * get_byte(decode(replace(data, ' ', ''), 'hex'), 2) END $$;

-- A given helper for the join lesson: runs a query under EXPLAIN ANALYZE and reports its first join node, that node's cost and the
-- execution time of the whole query, one row instead of a whole plan.
CREATE OR REPLACE FUNCTION join_report(q text) RETURNS TABLE (join_node text, join_cost numeric, run_ms numeric)
LANGUAGE plpgsql AS $$
DECLARE j jsonb;
BEGIN
  EXECUTE 'EXPLAIN (ANALYZE, TIMING OFF, FORMAT JSON) ' || q INTO j;
  SELECT n ->> 'Node Type', (n ->> 'Total Cost')::numeric INTO join_node, join_cost
  FROM jsonb_path_query(j, '$.**  ? (@."Node Type" like_regex "(Join|Nested Loop)$")') AS n LIMIT 1;
  run_ms := (j -> 0 ->> 'Execution Time')::numeric;
  RETURN NEXT;
END $$;

VACUUM (ANALYZE);
SELECT 'orders' AS table_name, count(*) AS row_count FROM orders
UNION ALL SELECT 'order_items', count(*) FROM order_items
UNION ALL SELECT 'customers_big', count(*) FROM customers_big
UNION ALL SELECT 'orders_big', count(*) FROM orders_big
UNION ALL SELECT 'order_items_big', count(*) FROM order_items_big
UNION ALL SELECT 'lines_big', count(*) FROM lines_big;
"""


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]


def build(root):
    fetch_cafe(root / "cafe")
    n_lines = make_big(root / "big")
    (root / "setup.sql").write_text(SETUP_SQL)
    rows = {}
    for p in sorted(root.glob("*/*.csv")):
        rows[f"{p.parent.name}/{p.name}"] = (sum(1 for _ in open(p)) - 1, sha(p))
    return rows, n_lines


def main():
    if "--check" in sys.argv:
        with tempfile.TemporaryDirectory() as tmp:
            first, _ = build(Path(tmp) / "a")
            second, _ = build(Path(tmp) / "b")
        print("same twice" if first == second else "DIFFERENT")
        sys.exit(0 if first == second else 1)
    root = Path("lab")
    rows, n_lines = build(root)
    for name, (n, h) in rows.items():
        print(f"{name:<28} {n:>9,} rows  sha256 {h}")
    print(f"seed {SEED}; {n_lines:,} order lines")


if __name__ == "__main__":
    main()
