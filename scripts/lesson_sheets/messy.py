"""Helpers that turn the clean cafe-sales tables into messy exports, deterministically.

Used by the cleaning-stage practice workbooks (text, dates, cleaning workflow, Power Query). Every
function takes a seeded `random.Random`, so the same dataset always gives the same mess.
"""

from __future__ import annotations

import random
from collections import defaultdict
from datetime import datetime
from decimal import Decimal

from .common import read

NBSP = " "  # the non-breaking space that TRIM does not remove


def spaces(rng: random.Random, low: int = 0, high: int = 2) -> str:
    return " " * rng.randint(low, high)


def padded(rng: random.Random, text: str) -> str:
    """Stray leading and trailing spaces, as typed or exported by real systems."""
    return f"{spaces(rng)}{text}{spaces(rng)}"


def wrong_case(rng: random.Random, text: str) -> str:
    return rng.choice([text, text.upper(), text.lower(), text.title()])


def order_totals() -> dict[str, Decimal]:
    """Amount of every order in USD: sum of quantity x unit price - discount over its lines."""
    price = {p["product_id"]: Decimal(p["unit_price_usd"]) for p in read("products")}
    totals: dict[str, Decimal] = defaultdict(Decimal)
    for it in read("order_items"):
        totals[it["order_id"]] += int(it["quantity"]) * price[it["product_id"]] - Decimal(it["discount_usd"])
    return dict(totals)


def parse_ts(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
