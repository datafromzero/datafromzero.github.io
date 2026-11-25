"""Triage a table before it reaches training: repair what one written rule fixes, quarantine the rows that still fail,
and reject the whole batch when too much fails or a whole column is wrong.

    uv run python -m ml_starter.validate report FILE     the failed checks of the schema, counted
    uv run python -m ml_starter.validate triage FILE     repair, quarantine, keep (writes data/quarantine.csv)
"""

import argparse
from typing import NamedTuple

import pandas as pd
import pandera.pandas as pa

from ml_starter.config import DATA_DIR
from ml_starter.contract import table_schema
from ml_starter.data import load_table

TEXT_COLUMNS = ["channel", "platform", "region"]
MAX_SHARE = 0.05  # reject the batch when more than this share of the rows still fails


class BatchRejected(Exception):
    """The table is not worth triaging: the message says why."""


class Triage(NamedTuple):
    clean: pd.DataFrame
    quarantined: pd.DataFrame
    repaired: int
    cases: pd.DataFrame


def repair(table):
    """The one repair rule we trust: text columns in lower case with no spaces at the ends. Returns the table and how many rows it changed."""
    fixed = table.copy()
    changed = pd.Series(False, index=table.index)
    for column in TEXT_COLUMNS:
        cleaned = table[column].str.strip().str.lower()
        changed |= cleaned.notna() & (cleaned != table[column])
        fixed[column] = cleaned
    return fixed, int(changed.sum())


def failure_cases(table):
    """One line for each failed check of each row: the column, the check, the value and the row's position."""
    try:
        table_schema.validate(table, lazy=True)
    except pa.errors.SchemaErrors as errors:
        return errors.failure_cases
    return pd.DataFrame(columns=["column", "check", "failure_case", "index"])


def first_failure(table):
    """The first failed check alone, which is what validation says without lazy=True; None when the table passes."""
    try:
        table_schema.validate(table)
    except pa.errors.SchemaError as error:
        return str(error).splitlines()[0]
    return None


def count_by_check(cases):
    """How many failure cases each check of each column has."""
    named = cases.assign(check=cases["check"].astype(str).str.split("(").str[0])
    return named.groupby(["column", "check"]).size().rename("cases").reset_index()


def triage(table, max_share=MAX_SHARE):
    """Repair, then quarantine the rows that still fail; raise BatchRejected when the batch itself is wrong."""
    fixed, repaired = repair(table)
    cases = failure_cases(fixed)
    if cases["index"].isna().any():
        raise BatchRejected("a check failed on a whole column, not on rows")
    bad = sorted(cases["index"].astype(int).unique())
    if len(bad) / len(table) > max_share:
        raise BatchRejected(f"{len(bad):,} of {len(table):,} rows fail, more than {max_share:.0%}")
    return Triage(fixed.drop(index=bad), fixed.loc[bad], repaired, cases)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["report", "triage"])
    parser.add_argument("file")
    arguments = parser.parse_args()
    table = load_table(arguments.file)
    if arguments.command == "report":
        print("Without lazy=True:", first_failure(table))
        cases = failure_cases(table)
        print(count_by_check(cases).to_string(index=False))
        print(f"{len(cases)} failure cases in {cases['index'].nunique()} different rows.")
        return
    try:
        result = triage(table)
    except BatchRejected as reason:
        raise SystemExit(f"Batch rejected: {reason}")
    result.quarantined.to_csv(DATA_DIR / "quarantine.csv", index=False)
    print(f"{len(result.clean):,} rows kept, {result.repaired} repaired by the rule, {len(result.quarantined)} quarantined.")


if __name__ == "__main__":
    main()
