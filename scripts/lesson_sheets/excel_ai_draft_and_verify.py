"""Practice workbook for excel-ai-draft-and-verify."""

from __future__ import annotations

from openpyxl import Workbook

from .common import save
from .order_lines import order_lines, write_lines


def build() -> None:
    wb = Workbook()
    wb.remove(wb.active)

    lines = order_lines()
    write_lines(wb.create_sheet("raw_order_lines"), lines)

    # A tiny known-answer frame: orders 1458 to 1464 (11 lines), small enough to total by hand.
    # Order 1461 is the dataset's one canceled order, so the frame contains the trap on purpose.
    frame = [r for r in lines if 1458 <= int(r["order_id"]) <= 1464]  # type: ignore[call-overload]
    write_lines(wb.create_sheet("raw_known_answer"), frame)

    wb.create_sheet("calc")
    wb.create_sheet("output")
    # One empty sheet per exercise, so an exercise never overwrites the worked example.
    wb.create_sheet("calc_ex1")
    wb.create_sheet("calc_ex2")
    save(wb, "excel-ai-draft-and-verify")
