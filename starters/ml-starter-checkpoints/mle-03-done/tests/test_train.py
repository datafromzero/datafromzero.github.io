"""A run is recorded with what it was given, what it scored, and what it depended on."""

import mlflow

from ml_starter.config import TABLE
from ml_starter.train import EXPERIMENT, fingerprint, train


def test_a_run_records_params_metrics_and_fingerprints(tmp_path):
    uri = f"sqlite:///{tmp_path / 'store.db'}"
    mean = train(C=0.1, seed=7, uri=uri)
    run = mlflow.search_runs(experiment_names=[EXPERIMENT]).iloc[0]
    assert run["params.C"] == "0.1"
    assert run["params.data_sha256"] == fingerprint(TABLE)
    assert run["metrics.cv_auc_mean"] == mean
    assert run["metrics.cv_auc_min"] <= mean <= run["metrics.cv_auc_max"]


def test_the_same_seed_gives_the_same_score(tmp_path):
    uri = f"sqlite:///{tmp_path / 'store.db'}"
    assert train(C=1.0, seed=7, uri=uri) == train(C=1.0, seed=7, uri=uri)
