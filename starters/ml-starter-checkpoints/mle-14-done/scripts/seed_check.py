"""Repeat the invented change of unit 3 with seeds 1 to 20 (the lesson used seed 2026).

    uv run python scripts/seed_check.py

It reads logs/replay.jsonl, so run scripts/replay.py first. For each seed it prints the AUCs of the last three weeks and the
day retraining is due, then the lowest, highest and median of all 60 weekly AUCs.
"""

import statistics

from ml_starter.data import load_table
from ml_starter.monitor import REPLAY_START, retrain_due, weekly_report, with_invented_change
from ml_starter.requestlog import read_log


def main():
    log = read_log("logs/replay.jsonl")
    table = load_table()
    every_auc = []
    for seed in range(1, 21):
        changed = with_invented_change(table, "2026-05-11", seed=seed)
        weekly = weekly_report(log, changed, changed[changed["signup_date"] < REPLAY_START])
        last_three = [round(float(auc), 3) for auc in weekly["auc"].tail(3)]
        every_auc += last_three
        print(f"seed {seed:2d}  AUCs {last_three}  retraining due {retrain_due(weekly)}")
    print(f"{len(every_auc)} weekly AUCs: lowest {min(every_auc)}, highest {max(every_auc)}, median {statistics.median(every_auc):.3f}")


if __name__ == "__main__":
    main()
