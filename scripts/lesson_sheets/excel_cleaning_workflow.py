"""Practice workbook for excel-cleaning-workflow.

Messy on purpose, all built from the cafe-sales CSV files with a fixed seed:

- raw_orders_export: the 1,800 orders, with the status and payment labels typed several ways
  ("completed", "completed ", "Complete", "DONE"...), plus 30 duplicate rows appended at the end:
  20 exact copies and 10 "near" copies (same order_id, labels spelled differently).
- raw_customers_export: the 150 customers, with city and tier typed several ways, plus 12 duplicate
  rows at the end (8 exact, 4 near). A blank referred_by is real data (nobody referred them).
- mapping and change_log: empty sheets with a header row, to fill in. calc and output start empty.
"""

from __future__ import annotations

import random

from openpyxl import Workbook
from openpyxl.styles import Font

from .common import raw_sheet, read, save

STATUS_VARIANTS = {
    "completed": (["completed", "completed ", "Complete", "DONE"], [70, 10, 12, 8]),
    "canceled": (["cancelled "], [1]),
}
PAYMENT_VARIANTS = {
    "card": ["card", "card ", "Credit Card"],
    "mobile": ["mobile", "Mobile Pay", "apple pay"],
    "cash": ["cash", "cash ", "in cash"],
}
CITY_VARIANTS = {
    "Alameda": ["Alameda", "Alameda ", "Alameda, CA"],
    "Berkeley": ["Berkeley", "Berkeley ", "Berkley"],
    "Oakland": ["Oakland", "Oakland ", "Oakland, CA"],
}
TIER_VARIANTS = {
    "bronze": ["bronze", "bronze ", "brnz"],
    "silver": ["silver", "silver ", "Silver member"],
    "gold": ["gold", "gold ", "Gold member"],
}


def pick(rng: random.Random, variants: list[str], weights: list[int] | None = None) -> str:
    return rng.choices(variants, weights=weights)[0]


def other(rng: random.Random, variants: list[str], used: str) -> str:
    return rng.choice([v for v in variants if v != used])


def messy_orders() -> list[dict[str, str]]:
    rng = random.Random(4301)
    rows = []
    for o in read("orders"):
        sv, sw = STATUS_VARIANTS[o["status"]]
        rows.append({**o, "status": pick(rng, sv, sw), "payment_method": pick(rng, PAYMENT_VARIANTS[o["payment_method"]])})
    canonical_pay = {o["order_id"]: o["payment_method"] for o in read("orders")}
    originals = [r for r in rows if r["status"] != "cancelled "]
    chosen = rng.sample(originals, 30)
    dupes = []
    for i, r in enumerate(chosen):
        if i < 20:
            dupes.append(dict(r))  # exact copy
        else:  # near copy: same order, labels spelled another way
            sv, _ = STATUS_VARIANTS["completed"]
            dupes.append(
                {
                    **r,
                    "status": other(rng, sv, r["status"]),
                    "payment_method": other(rng, PAYMENT_VARIANTS[canonical_pay[r["order_id"]]], r["payment_method"]),
                }
            )
    return rows + dupes


def messy_customers() -> list[dict[str, str]]:
    rng = random.Random(4302)
    rows = []
    for c in read("customers"):
        rows.append(
            {
                **c,
                "city": pick(rng, CITY_VARIANTS[c["city"]]),
                "loyalty_tier": pick(rng, TIER_VARIANTS[c["loyalty_tier"]]),
            }
        )
    canonical = {c["customer_id"]: c for c in read("customers")}
    chosen = rng.sample(rows, 12)
    dupes = []
    for i, r in enumerate(chosen):
        if i < 8:
            dupes.append(dict(r))
        else:
            c = canonical[r["customer_id"]]
            dupes.append({**r, "loyalty_tier": other(rng, TIER_VARIANTS[c["loyalty_tier"]], r["loyalty_tier"])})
    return rows + dupes


def header_only(ws, header: list[str], widths: list[int]) -> None:
    ws.append(header)
    for c in ws[1]:
        c.font = Font(bold=True)
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[ws.cell(1, i).column_letter].width = w


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    raw_sheet(wb.create_sheet("raw_orders_export"), messy_orders())
    raw_sheet(wb.create_sheet("raw_customers_export"), messy_customers())
    wb.create_sheet("mapping")
    wb.create_sheet("calc")
    header_only(
        wb.create_sheet("change_log"),
        ["step", "what changed", "rows before", "rows after", "why"],
        [8, 44, 14, 14, 50],
    )
    wb.create_sheet("output")
    save(wb, "excel-cleaning-workflow")
