"""Runs every pattern of the Python cheatsheet (src/data/cheatsheets/python.ts) on the cafe-sales data, in page order
(SPEC D44). Each card runs in its own namespace, set up the way the lessons set up their pages: the five tables read from
datasets/cafe-sales/v1/, then the few names a lesson defines before its pattern works (`lines`, `sales`, `store_month`, ...),
which are listed in `prepare` below. Lines that start with `$` are shell commands: `python -m pip <command>` is checked by
asking pip for the help of that command (nothing is installed), and `python <file>.py` runs the card's own code as that file.
Needs Node 22 or later (to read the TypeScript data) and the Python packages pandas, numpy, matplotlib, seaborn and openpyxl (and plotly for the Plotly card).
When pandas or Node is missing the check says so and exits 0, like `npm run check:notebooks` does without nbstripout; a
missing chart package skips only the two chart cards. Part of `npm run check` through `npm run check:cheatsheet-python`.
Usage: python3 scripts/check-cheatsheet-python.py"""
import contextlib
import io
import json
import os
import pathlib
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import types

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "datasets/cafe-sales/v1"

try:
    import numpy as np
    import openpyxl  # noqa: F401 - read_excel needs it
    import pandas as pd
except ImportError as e:
    print(f"skipped: {e.name} is not installed (pip install pandas numpy openpyxl matplotlib seaborn to run this check)")
    sys.exit(0)
if shutil.which("node") is None:
    print("skipped: node is not installed (it reads the TypeScript data)")
    sys.exit(0)

try:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import seaborn as sns
except ImportError:
    plt = sns = None
try:
    import plotly.express as px
except ImportError:
    px = None

dump = "import { pythonCheatsheet as s } from './src/data/cheatsheets/python.ts'; console.log(JSON.stringify(s));"
sheet = json.loads(subprocess.run(["node", "--input-type=module", "-e", dump], cwd=ROOT, capture_output=True, text=True, check=True).stdout)


def tables():
    return {name: pd.read_csv(DATA / f"{name}.csv") for name in ["orders", "order_items", "products", "customers", "stores"]}


def prepare(lesson, ns, workdir):
    """The names a lesson defines before its pattern (copied from the lesson's own setup), added to the namespace."""
    o, oi, p, c = ns["orders"], ns["order_items"], ns["products"], ns["customers"]
    price_of = dict(zip(p["product_id"], p["unit_price_usd"]))
    names = {1: "Old Town", 2: "Campus", 3: "Harbor"}
    lines = oi.assign(price=oi["product_id"].map(price_of))
    lines = lines.assign(amount=lines["quantity"] * lines["price"] - lines["discount_usd"])
    lines = lines.merge(o[["order_id", "store_id", "ordered_at"]], on="order_id", validate="many_to_one")
    lines = lines.merge(p[["product_id", "category"]], on="product_id", validate="many_to_one")
    lines = lines.assign(store=lines["store_id"].map(names), month=pd.to_datetime(lines["ordered_at"]).dt.month)
    # `lines.iloc[[0, 1, 2, 3, 4, 9]]` of the AI lesson is taken from the order-line order of order_items
    lines = lines.sort_values("order_item_id").reset_index(drop=True)
    sales = lines.merge(o[["order_id", "payment_method"]], on="order_id", validate="many_to_one")
    store_month = sales.groupby(["store_id", "month"])["amount"].sum().reset_index()
    sales_by_store = sales.groupby("store_id")["amount"].sum()
    ns.update(
        pd=pd, np=np, re=re, json=json, sys=sys, io=io, Path=pathlib.Path, plt=plt, sns=sns,
        path=str(DATA / "orders.csv"), xlsx=str(DATA / "cafe-sales.xlsx"),
        text=json.dumps({"store": "Old Town", "lines": [{"product_id": 10, "quantity": 1}, {"product_id": 6, "quantity": 2}]}),
        quantity=oi["quantity"].to_numpy(),
        price=oi["product_id"].map(price_of).to_numpy(),
        discount=oi["discount_usd"].to_numpy(),
        lines=lines, sales=sales, store_month=store_month,
        wide_orders=pd.crosstab(o["store_id"], o["payment_method"]).reset_index(),
        per_customer=o.groupby(["store_id", "customer_id"]).size().reset_index(name="orders"),
        named=sales_by_store.rename(index=names),
        typed=pd.Series(["  Cold   Brew ", "Chai  LATTE"]),
        notes=pd.Series(["Latte 12oz", "Mocha 16 oz", "Espresso"]),
        names=pd.Series(["Café espresso", "Café espresso"]),
    )
    month = pd.to_datetime(o["ordered_at"]).dt.month
    ns["frames"] = [o[month.isin(ms)] for ms in ([1, 2], [3, 4], [5, 6])]
    con = sqlite3.connect(":memory:")
    for name in ["orders", "order_items", "products", "customers", "stores"]:
        ns[name].to_sql(name, con, index=False)
    ns["con"] = con
    # a stand-in for the answer of a web API (the check needs no network): ok, and a list of records
    if lesson == "charts-plotly":  # the Plotly lesson's setup: store names, and one color for each store
        ns["store_month"] = sales.groupby(["store", "month"], as_index=False)["amount"].sum()
        ns["COLORS"] = {"Old Town": "#0072B2", "Campus": "#d6479a", "Harbor": "#E69F00"}
    ns["px"] = px
    ns["response"] = types.SimpleNamespace(ok=True, status_code=200, json=lambda: [{"date": "2026-02-02", "rate": 0.85}])


def run_shell(cmd, code, workdir):
    m = re.fullmatch(r"python -m pip (\w+).*", cmd)
    if m:
        subprocess.run([sys.executable, "-m", "pip", m.group(1), "--help"], check=True, capture_output=True)
        return f"pip {m.group(1)} exists"
    m = re.fullmatch(r"python (\w+\.py)", cmd)
    if m:
        script = "\n".join(l for l in code.splitlines() if not l.startswith("$ "))
        (workdir / m.group(1)).write_text(script + "\n")
        r = subprocess.run([sys.executable, m.group(1)], cwd=workdir, capture_output=True, text=True)
        if r.returncode:
            raise RuntimeError(r.stderr.strip().splitlines()[-1])
        return f"script printed {len(r.stdout.splitlines())} lines"
    raise RuntimeError(f"do not know how to check the shell line: {cmd}")


failed = skipped = n = 0
with tempfile.TemporaryDirectory() as tmp:
    for part in sheet["parts"]:
        for item in part["items"]:
            if "figure" in item:
                continue
            n += 1
            lesson = item["lesson"]
            label = f"{lesson} #{n}"
            code = item["code"]
            if lesson == "charts-plotly" and px is None:
                skipped += 1
                print(f"skip  {label:44} plotly is not installed")
                continue
            if plt is None and lesson.startswith("charts-"):
                skipped += 1
                print(f"skip  {label:44} matplotlib or seaborn is not installed")
                continue
            workdir = pathlib.Path(tmp) / f"c{n}"
            workdir.mkdir()
            shutil.copy(DATA / "orders.csv", workdir / "orders.csv")  # a script reads it from its own folder
            try:
                ns = {"__name__": "__main__"}
                ns.update(tables())
                prepare(lesson, ns, workdir)
                shell = [l[2:].strip() for l in code.splitlines() if l.startswith("$ ")]
                python = "\n".join(l for l in code.splitlines() if not l.startswith("$ "))
                cwd = os.getcwd()
                os.chdir(workdir)
                try:
                    with contextlib.redirect_stdout(io.StringIO()):
                        exec(compile(python, label, "exec"), ns)
                    note = ""
                    for cmd in shell:
                        note = run_shell(cmd, code, workdir)
                finally:
                    os.chdir(cwd)
                    if plt is not None:
                        plt.close("all")
                print(f"ok    {label:44} {note}")
            except Exception as e:  # noqa: BLE001 - report every failure, then exit non-zero
                failed += 1
                print(f"FAIL  {label}: {type(e).__name__}: {e}")
print(f"\n{n - failed - skipped} of {n} patterns ran on pandas {pd.__version__} ({skipped} skipped)")
sys.exit(1 if failed else 0)
