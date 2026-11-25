"""Read the churn table and cut the split that every lesson of the track uses."""

import pandas as pd
from sklearn.model_selection import train_test_split

from ml_starter.config import FEATURES, SEED, TABLE, TARGET


def load_table(path=TABLE):
    """The churn table of the Data Scientist track: one row for each person who signed up from January 1 to May 31, 2026."""
    return pd.read_csv(path, parse_dates=["signup_date"])


def split(table):
    """The track's split: a quarter of the people for testing, the same share of churners in both parts."""
    return train_test_split(table[FEATURES], table[TARGET], test_size=0.25, random_state=SEED, stratify=table[TARGET])
