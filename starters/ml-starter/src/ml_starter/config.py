"""Settings in one place, read from the environment with defaults. No secrets live here."""

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.environ.get("DATA_DIR", ROOT / "data"))
TABLE = DATA_DIR / "churn_table.csv"
SEED = 2026  # the seed of the whole track
STATIC = ["channel", "platform", "region"]  # known at signup
WEEK1 = ["sessions_7d", "expenses_7d", "recent_3d", "active_days_7d", "onboarded", "saw_paywall", "bought_plus"]  # known at day 7
FEATURES = STATIC + WEEK1
TARGET = "churned"
