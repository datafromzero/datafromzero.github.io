"""Compares one aggregation and one single-row lookup on the same 950,414 order lines in DuckDB (a column store), SQLite and PostgreSQL
(row stores). Part of the Data Engineer deep dive, lesson "Storage shapes: rows, columns and files".

    uv run --with duckdb==2.0.0 --with "psycopg[binary]==3.3.9" python storage_shapes.py bytes
    uv run --with duckdb==2.0.0 --with "psycopg[binary]==3.3.9" python storage_shapes.py aggregation [--runs 7] [--duckdb-threads N] [--pg-workers N]
    uv run --with duckdb==2.0.0 --with "psycopg[binary]==3.3.9" python storage_shapes.py lookup [--lookups 2000]

Run it from the folder that holds lab/ (made by lab.py), after setup.sql was loaded into the PostgreSQL database `lab`. The PostgreSQL
connection comes from the usual PG environment variables (PGHOST, PGPORT, PGUSER, PGPASSWORD); the database is `lab`.

  bytes        writes the lines as one Parquet file (lab/lines.parquet) and prints how many bytes each column takes in it, and the share
               of the five columns that the aggregation below reads.
  aggregation  revenue for each store over the completed lines, `--runs` times in each engine: prints the median and the range in ms.
               DuckDB uses every core of the machine unless `--duckdb-threads` says otherwise; PostgreSQL uses what the database setting
               max_parallel_workers_per_gather allows (setup.sql sets it to 0) unless `--pg-workers` says otherwise.
  lookup       `--lookups` single-line reads by key, keys drawn with Random(2026): prints the time of one read in ms.

The first run of aggregation or lookup builds lab/lines.duckdb and lab/lines.sqlite from lab/big/lines_big.csv (a primary key on
order_item_id in each; PostgreSQL has the same table from setup.sql). Every time is wall time measured in this script, so PostgreSQL's
includes a round trip to the server and DuckDB's and SQLite's do not. The ratios depend on the machine; the direction is what the
lesson reads.
"""
import argparse
import csv
import sqlite3
import statistics
import time
from pathlib import Path
from random import Random

import duckdb
import psycopg

LAB = Path("lab")  # the folder lab.py wrote, relative to where you run the script
CSV = LAB / "big" / "lines_big.csv"
AGG = """SELECT store_id, sum(quantity * unit_price_usd - discount_usd) AS revenue
FROM lines_big WHERE status = 'completed' GROUP BY store_id ORDER BY store_id"""
LOOKUP = "SELECT * FROM lines_big WHERE order_item_id = {p}"
NEEDED = ["store_id", "status", "quantity", "unit_price_usd", "discount_usd"]  # the columns AGG reads
N_LINES = 950_414


def build_duckdb(path):
    con = duckdb.connect(str(path))
    con.execute("""CREATE TABLE lines_big (order_item_id INTEGER PRIMARY KEY, order_id INTEGER, ordered_at TIMESTAMP, store_id INTEGER,
        customer_id INTEGER, status VARCHAR, payment_method VARCHAR, product_id INTEGER, quantity INTEGER,
        unit_price_usd DECIMAL(6, 2), discount_usd DECIMAL(8, 2), channel VARCHAR)""")
    con.execute(f"INSERT INTO lines_big SELECT * FROM read_csv('{CSV}')")
    con.close()


def build_sqlite(path):
    con = sqlite3.connect(path)
    con.execute("""CREATE TABLE lines_big (order_item_id INTEGER PRIMARY KEY, order_id INTEGER, ordered_at TEXT, store_id INTEGER,
        customer_id INTEGER, status TEXT, payment_method TEXT, product_id INTEGER, quantity INTEGER,
        unit_price_usd NUMERIC, discount_usd NUMERIC, channel TEXT)""")
    with open(CSV, newline="") as f:
        rows = csv.reader(f)
        next(rows)
        con.executemany("INSERT INTO lines_big VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        ([c if c != "" else None for c in r] for r in rows))
    con.commit()
    con.close()


def median_ms(fn, runs):
    fn()  # one warm-up run, not counted
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        fn()
        times.append((time.perf_counter() - start) * 1000)
    return statistics.median(times), min(times), max(times)


def column_bytes():
    parquet = LAB / "lines.parquet"
    if not (LAB / "lines.duckdb").exists():
        build_duckdb(LAB / "lines.duckdb")
    con = duckdb.connect(str(LAB / "lines.duckdb"), read_only=True)
    con.execute(f"COPY lines_big TO '{parquet}' (FORMAT parquet)")
    rows = con.execute(f"""SELECT path_in_schema, sum(total_compressed_size) FROM parquet_metadata('{parquet}')
                           GROUP BY 1 ORDER BY 2 DESC""").fetchall()
    total = sum(b for _, b in rows)
    for col, b in rows:
        print(f"{col:<15} {b:>10,} bytes  {100 * b / total:>5.1f}%{'   <- read by the aggregation' if col in NEEDED else ''}")
    need = sum(b for c, b in rows if c in NEEDED)
    print(f"{'all columns':<15} {total:>10,} bytes")
    print(f"the {len(NEEDED)} columns the aggregation reads: {need:,} bytes, {100 * need / total:.1f}% of the column bytes")


def engines(duckdb_threads=None, pg_workers=None):
    for name, build, path in (("DuckDB", build_duckdb, LAB / "lines.duckdb"), ("SQLite", build_sqlite, LAB / "lines.sqlite")):
        if not path.exists():
            build(path)
    duck = duckdb.connect(str(LAB / "lines.duckdb"), read_only=True)
    lite = sqlite3.connect(LAB / "lines.sqlite")
    pg = psycopg.connect(dbname="lab", autocommit=True)
    if duckdb_threads:
        duck.execute(f"SET threads = {int(duckdb_threads)}")
    if pg_workers is not None:
        pg.execute(f"SET max_parallel_workers_per_gather = {int(pg_workers)}")
    return {
        "DuckDB": lambda sql: duck.execute(sql).fetchall(),
        "SQLite": lambda sql: lite.execute(sql).fetchall(),
        "PostgreSQL": lambda sql: pg.execute(sql).fetchall(),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("what", choices=["bytes", "aggregation", "lookup"])
    ap.add_argument("--runs", type=int, default=7)
    ap.add_argument("--lookups", type=int, default=2000)
    ap.add_argument("--duckdb-threads", type=int, default=None)
    ap.add_argument("--pg-workers", type=int, default=None)
    args = ap.parse_args()
    if args.what == "bytes":
        column_bytes()
        return
    run_on = engines(args.duckdb_threads, args.pg_workers)
    if args.what == "aggregation":
        print(f"{'engine':<11} {'median ms':>9}  range")
        answers = {}
        for name, run in run_on.items():
            med, lo, hi = median_ms(lambda: run(AGG), args.runs)
            answers[name] = [(s, round(float(r), 2)) for s, r in run(AGG)]
            print(f"{name:<11} {med:>9.1f}  {lo:.1f} to {hi:.1f}")
        assert len({str(v) for v in answers.values()}) == 1, answers
        print("same answer from all three:", answers["DuckDB"])
    else:
        rng = Random(2026)
        keys = [1 + int(rng.random() * N_LINES) for _ in range(args.lookups)]
        print(f"{'engine':<11} {'ms for one lookup':>17}")
        for name, run in run_on.items():
            start = time.perf_counter()
            for k in keys:
                run(LOOKUP.format(p=k))
            print(f"{name:<11} {(time.perf_counter() - start) * 1000 / len(keys):>17.3f}")


if __name__ == "__main__":
    main()
