"""Build the practice workbooks for Excel-stage lessons (sheets/excel/{lesson-id}.xlsx).

One module per lesson in scripts/lesson_sheets/, named after the lesson id with underscores
(excel_grid_and_tidy_layout.py for excel-grid-and-tidy-layout), each with a build() function.
Shared helpers live in scripts/lesson_sheets/common.py. Every workbook is made from the released
cafe-sales CSV files (datasets/cafe-sales/v1/), so every number in a lesson can be traced back to
the dataset. The owner uploads each file to Google Drive and puts its "make a copy" link in the
lesson's `sheet` field.

    python3 scripts/build-lesson-sheets.py                              # every lesson
    python3 scripts/build-lesson-sheets.py excel-grid-and-tidy-layout   # one lesson

Needs Python 3.10+ and openpyxl 3.1.
"""

from __future__ import annotations

import importlib
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def main() -> None:
    wanted = {a.replace("-", "_") for a in sys.argv[1:]}
    names = sorted(p.stem for p in (HERE / "lesson_sheets").glob("excel_*.py"))
    unknown = wanted - set(names)
    if unknown:
        raise SystemExit(f"no workbook module for: {', '.join(sorted(unknown))}")
    for name in names:
        if not wanted or name in wanted:
            importlib.import_module(f"lesson_sheets.{name}").build()


if __name__ == "__main__":
    main()
