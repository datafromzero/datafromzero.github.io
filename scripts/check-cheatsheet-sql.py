"""Runs every pattern of the SQL cheatsheet (src/data/cheatsheets/sql.ts) in DuckDB, in page order, on one database
with the five cafe-sales tables, like a lesson page does (SPEC D44). A lesson's own practice tables are set up first,
copied from that lesson. Needs the Python `duckdb` package and Node 22 or later (to read the TypeScript data); not part of
`npm run check`. Usage: python3 scripts/check-cheatsheet-sql.py"""
import json
import pathlib
import subprocess
import sys

import duckdb

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Practice tables that a lesson creates before its patterns work, keyed by the lesson slug.
SETUP = {
    "deduplicate-latest-record": """
CREATE OR REPLACE TEMP TABLE customer_updates AS
SELECT * FROM (VALUES
  (1,  301, 'bronze', 'Oakland',  TIMESTAMP '2026-03-02 09:15:00'),
  (2,  301, 'silver', 'Oakland',  TIMESTAMP '2026-05-10 14:02:00'),
  (3,  302, 'bronze', 'Berkeley', TIMESTAMP '2026-03-05 10:30:00'),
  (4,  302, 'bronze', 'Berkeley', TIMESTAMP '2026-03-05 10:30:00'),
  (5,  303, 'silver', 'Alameda',  TIMESTAMP '2026-04-01 08:00:00'),
  (6,  303, 'gold',   'Alameda',  TIMESTAMP '2026-04-01 08:00:00'),
  (7,  304, 'bronze', 'Oakland',  TIMESTAMP '2026-04-20 16:45:00'),
  (8,  305, 'bronze', 'Berkeley', TIMESTAMP '2026-02-11 11:11:00'),
  (9,  305, 'silver', 'Berkeley', TIMESTAMP '2026-06-01 09:30:00'),
  (10, 305, 'silver', 'Berkeley', TIMESTAMP '2026-06-01 09:30:00')
) AS t(update_id, customer_id, loyalty_tier, city, updated_at);""",
    "star-schema": """
CREATE OR REPLACE VIEW fact_sales AS
SELECT i.order_item_id, i.order_id,
       CAST(o.ordered_at AS DATE) AS order_date,
       o.store_id, o.customer_id, i.product_id,
       o.status AS order_status,
       i.quantity, i.discount_usd,
       i.quantity * p.unit_price_usd - i.discount_usd AS amount_usd
FROM order_items AS i
JOIN orders AS o ON o.order_id = i.order_id
JOIN products AS p ON p.product_id = i.product_id;""",
    "modify-data-transactions": """
CREATE OR REPLACE TABLE stock (
  store_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  units_on_hand INTEGER NOT NULL CHECK (units_on_hand >= 0),
  PRIMARY KEY (store_id, product_id)
);
INSERT INTO stock VALUES (1, 1, 40), (1, 10, 25), (1, 6, 12);""",
    "normalization": """
CREATE OR REPLACE TABLE orders_wide AS
SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity, oi.discount_usd,
       o.ordered_at, o.status, o.payment_method,
       o.store_id, s.store_name, s.city AS store_city,
       o.customer_id, c.city AS customer_city, c.loyalty_tier,
       p.product_name, p.category, p.unit_price_usd
FROM order_items AS oi
JOIN orders AS o ON o.order_id = oi.order_id
JOIN stores AS s ON s.store_id = o.store_id
LEFT JOIN customers AS c ON c.customer_id = o.customer_id
JOIN products AS p ON p.product_id = oi.product_id;""",
    "indexes-and-explain": "CREATE OR REPLACE TABLE orders_ix AS SELECT * FROM orders;",
    "scaling-and-nosql": """
CREATE OR REPLACE TABLE order_docs (doc_key VARCHAR PRIMARY KEY, doc JSON);
INSERT INTO order_docs VALUES
('order:1001', '{"order_id": 1001, "store": "Campus", "customer": 15}'),
('order:1335', '{"order_id": 1335, "store": "Old Town"}');""",
}

dump = "import { sqlCheatsheet as s } from './src/data/cheatsheets/sql.ts'; console.log(JSON.stringify(s));"
sheet = json.loads(subprocess.run(["node", "--input-type=module", "-e", dump], cwd=ROOT, capture_output=True, text=True, check=True).stdout)

con = duckdb.connect()
con.execute((ROOT / "datasets/cafe-sales/v1/cafe-sales.sql").read_text())
failed = 0
n = 0
for part in sheet["parts"]:
    for item in part["items"]:
        if "figure" in item:
            continue
        n += 1
        lesson = item["lesson"]
        label = f"{lesson} #{n}"
        try:
            if lesson in SETUP:
                con.execute(SETUP[lesson])
            # one entry may hold several statements; the last one that returns rows gives the shape
            shape = ""
            for stmt in [s for s in con.extract_statements(item["code"])]:
                cur = con.execute(stmt)
                if cur.description:
                    shape = f"{len(cur.fetchall())} rows x {len(cur.description)} cols"
            print(f"ok    {label:42} {shape}")
        except Exception as e:  # noqa: BLE001 - report every failure, then exit non-zero
            failed += 1
            print(f"FAIL  {label}: {e}")
print(f"\n{n - failed} of {n} patterns ran in DuckDB {duckdb.__version__}")
sys.exit(1 if failed else 0)
