"""The quality gate: the model that this commit's code trains must clear a floor on the held-out people.

The floor is 0.68 AUC. The day-7 model scores 0.690 on this split and a model that ignores week 1 scores 0.668 (lesson DS2), and the lowest of twenty other splits was 0.684, so
the floor is under the first and over the second. The split is fixed (seed 2026), so the same code gives the same number.
The gate checks a release; it never chooses one (nothing is tuned against these people).
"""

from sklearn.metrics import roc_auc_score

from ml_starter.data import load_table, split
from ml_starter.pipeline import build_pipeline

FLOOR = 0.68


def test_the_model_this_code_trains_clears_the_floor():
    X_train, X_test, y_train, y_test = split(load_table())
    model = build_pipeline().fit(X_train, y_train)
    auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    assert auc >= FLOOR, f"held-out AUC {auc:.3f} is below the floor {FLOOR}"
