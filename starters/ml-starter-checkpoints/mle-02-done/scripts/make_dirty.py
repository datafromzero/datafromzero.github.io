"""Make the clinic file: a copy of the churn table with faults put in on purpose, chosen by seed 2026.

    uv run python scripts/make_dirty.py

It writes data/dirty_table.csv (Git ignores it). The faults are what a system upstream of the model can really do: a sign
slip, a channel nobody told the model about, a retried event written twice, a field that did not arrive, a flag that is
not a flag, a count that cannot be true, and text typed by hand. The script does not say how many of each: the lessons
find them.
"""

import numpy as np
import pandas as pd

from ml_starter.config import DATA_DIR, SEED
from ml_starter.data import load_table


def main():
    table = load_table()
    rng = np.random.default_rng(SEED)
    order = rng.permutation(len(table))  # one shuffled list of positions; each fault takes its own slice, so no row gets two by accident

    def take(start, count):
        return table.index[order[start:start + count]]

    negative = take(0, 40)
    table.loc[negative, "sessions_7d"] = -1  # a sign slip upstream
    unknown = take(40, 15).union(negative[:10])
    table.loc[unknown, "channel"] = "tiktok"  # a channel the model never saw; 10 of these rows also have the sign slip
    table.loc[take(55, 30), "platform"] = np.nan  # a field that did not arrive
    table.loc[take(85, 15), "onboarded"] = 2  # a flag that is not a flag
    inflated = take(100, 20)
    table.loc[inflated, "recent_3d"] = table.loc[inflated, "sessions_7d"] + table.loc[inflated, "expenses_7d"] + 5  # more recent events than events
    table.loc[take(120, 20), "channel"] = "Paid_Social "  # text typed by hand: capital letters and a trailing space
    copies = table.loc[take(140, 12)]  # a retried event written twice
    dirty = pd.concat([table, copies], ignore_index=True)

    dirty.to_csv(DATA_DIR / "dirty_table.csv", index=False)
    print(f"Wrote dirty_table.csv: {len(dirty):,} rows.")


if __name__ == "__main__":
    main()
