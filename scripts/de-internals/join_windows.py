"""Measures the three join algorithms on the same query over five windows of orders, for the lesson "Join algorithms and optimizer mistakes".

    python3 join_windows.py [--runs 7]

Needs psql on the PATH, the PostgreSQL database `lab` of lab.py (setup.sql already loaded) and the two indexes the lesson creates:
    CREATE INDEX order_items_big_order_idx ON order_items_big (order_id);
    CREATE INDEX orders_big_ordered_idx ON orders_big (ordered_at);
    ANALYZE order_items_big; ANALYZE orders_big;
For each window and each way of switching algorithms off it calls the helper join_report() of setup.sql `--runs` times in one session (the first
call is a warm-up and is dropped) and prints the join node PostgreSQL used, its cost and the median and range of the execution times in ms.
The numbers of the picture and of the text of the lesson come from one run of this script on one Linux machine; times move with the machine.
"""
import argparse
import re
import statistics
import subprocess

WINDOWS = [
    ("1 day", "o.ordered_at >= '2026-03-01' AND o.ordered_at < '2026-03-02'"),
    ("3 days", "o.ordered_at >= '2026-03-01' AND o.ordered_at < '2026-03-04'"),
    ("1 week", "o.ordered_at >= '2026-03-01' AND o.ordered_at < '2026-03-08'"),
    ("31 days", "o.ordered_at >= '2026-03-01' AND o.ordered_at < '2026-04-01'"),
    ("all orders", "true"),
]
MODES = [
    ("default", ""),
    ("nested loop", "SET enable_hashjoin = off; SET enable_mergejoin = off;"),
    ("hash", "SET enable_nestloop = off; SET enable_mergejoin = off;"),
    ("merge", "SET enable_nestloop = off; SET enable_hashjoin = off;"),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--runs", type=int, default=7)
    args = ap.parse_args()
    print(f"{'window':<11} {'setting':<12} {'node':<12} {'cost':>10}  {'median ms':>9}  range")
    for wname, cond in WINDOWS:
        q = ("SELECT count(*), sum(i.quantity) FROM orders_big o JOIN order_items_big i ON i.order_id = o.order_id WHERE " + cond)
        for mname, setting in MODES:
            call = f"SELECT join_node || '|' || join_cost || '|' || run_ms FROM join_report($${q}$$);"
            sql = setting + "\n" + "\n".join(call for _ in range(args.runs + 1))
            out = subprocess.run(["psql", "-X", "-At", "-d", "lab"], input=sql, capture_output=True, text=True, check=True).stdout
            rows = [line.split("|") for line in out.splitlines() if re.match(r"^[A-Z].*\|[\d.]+\|[\d.]+$", line)][1:]
            times = [float(r[2]) for r in rows]
            print(f"{wname:<11} {mname:<12} {rows[0][0]:<12} {float(rows[0][1]):>10,.0f}  {statistics.median(times):>9.1f}  {min(times):.1f} to {max(times):.1f}")


if __name__ == "__main__":
    main()
