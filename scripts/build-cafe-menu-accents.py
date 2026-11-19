"""Build the cafe-menu-accents dataset (SPEC D46): one CSV with the menu boards of the three cafes.

The names are fictional board names for the 16 cafe-sales products, with the accented letters English-language cafes use
(café, crème brûlée, jalapeño, açaí, piña colada). They are stored in two Unicode forms on purpose: NFC (a letter with its mark
as one character) and NFD (the plain letter followed by a combining mark). The two forms look identical on screen and compare
unequal, which is the trap the text-cleaning lesson teaches.

Deterministic: no random numbers, so rebuilding gives the same bytes. A released version folder (v1/) is immutable.

    python3 scripts/build-cafe-menu-accents.py            # writes datasets/cafe-menu-accents/v1/menu_accents.csv
    python3 scripts/build-cafe-menu-accents.py --check    # rebuilds in memory and fails if the CSV differs

Needs Python 3.10 or later, nothing else.
"""

from __future__ import annotations

import csv
import io
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "datasets" / "cafe-menu-accents" / "v1" / "menu_accents.csv"

# product_id (as in datasets/cafe-sales/v1/products.csv), name on the menu board, written in NFC.
NAMES = [
    (1, "Café espresso"),
    (2, "Café americano"),
    (3, "Café au lait"),
    (4, "Cappuccino"),
    (5, "Mocha"),
    (6, "Café cold brew"),
    (7, "Açaí green tea"),
    (8, "Chai latté"),
    (9, "Piña colada iced tea"),
    (10, "Croissant"),
    (11, "Blueberry muffin"),
    (12, "Crème brûlée banana bread"),
    (13, "Jalapeño bagel with cream cheese"),
    (14, "Avocado toast"),
    (15, "Turkey sandwich"),
    (16, "Pumpkin spice café latte"),
]

STORE_IDS = (1, 2, 3)  # as in datasets/cafe-sales/v1/stores.csv


def form_for(store_id: int, product_id: int) -> str:
    """Unicode form of one menu line. Each store's board was typed on a different device."""
    if store_id == 1:
        return "NFC"  # store 1: every name is NFC
    if store_id == 2:
        return "NFD"  # store 2: every name is NFD
    return "NFD" if product_id % 2 == 0 else "NFC"  # store 3: even product ids are NFD, odd ones NFC


def rows() -> list[list[object]]:
    out: list[list[object]] = []
    for store_id in STORE_IDS:
        for product_id, name in NAMES:
            text = unicodedata.normalize(form_for(store_id, product_id), name)
            out.append([len(out) + 1, store_id, product_id, text])
    return out


def render() -> str:
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(["menu_item_id", "store_id", "product_id", "board_name"])
    w.writerows(rows())
    return buf.getvalue()


def main() -> int:
    text = render()
    if "--check" in sys.argv:
        if not OUT.exists() or OUT.read_bytes() != text.encode("utf-8"):
            print(f"{OUT.relative_to(ROOT)} does not match the generator; run scripts/build-cafe-menu-accents.py", file=sys.stderr)
            return 1
        print(f"{OUT.relative_to(ROOT)} matches the generator ({len(rows())} rows).")
        return 0
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(text.encode("utf-8"))
    print(f"wrote {OUT.relative_to(ROOT)} ({len(rows())} rows)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
