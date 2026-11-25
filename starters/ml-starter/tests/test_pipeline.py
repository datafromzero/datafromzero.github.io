"""The table and the pipeline of lesson MLE1, as tests."""

import numpy as np

from ml_starter.data import load_table, split
from ml_starter.pipeline import build_pipeline


def test_table_has_the_people_of_the_track():
    table = load_table()
    assert len(table) == 17_816
    assert int(table["churned"].sum()) == 9_696


def test_split_sizes():
    X_train, X_test, y_train, y_test = split(load_table())
    assert (len(X_train), len(X_test)) == (13_362, 4_454)


def test_pipeline_takes_raw_rows_and_gives_chances():
    X_train, X_test, y_train, y_test = split(load_table())
    pipeline = build_pipeline().fit(X_train, y_train)
    chances = pipeline.predict_proba(X_test)[:, 1]
    assert chances.shape == (4_454,)
    assert np.all((chances >= 0) & (chances <= 1))
