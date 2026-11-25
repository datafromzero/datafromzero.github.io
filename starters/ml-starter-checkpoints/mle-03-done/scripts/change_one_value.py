"""Change one number in data/churn_table.csv, to see what a run's record says about the data.

    uv run python scripts/change_one_value.py

Undo it with: git checkout data/churn_table.csv
"""

from ml_starter.config import TABLE


def main():
    lines = TABLE.read_bytes().split(b"\n")
    fields = lines[1].split(b",")
    before = int(fields[5])
    fields[5] = str(before + 1).encode()  # sessions_7d of the first person
    lines[1] = b",".join(fields)
    TABLE.write_bytes(b"\n".join(lines))
    print(f"sessions_7d of the first person: {before} to {before + 1}.")


if __name__ == "__main__":
    main()
