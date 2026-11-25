"""Train the churn pipeline and record the run: what it was given, what it scored, the fitted pipeline, and what the run
depended on (the data file, the code, the locked libraries).

    uv run python -m ml_starter.train --C 0.1 --seed 2026
"""

import argparse
import hashlib
import logging
import os
import subprocess
from pathlib import Path

os.environ.setdefault("MLFLOW_DISABLE_AGENT_HINT", "1")  # one line of advice that MLflow logs on import

import mlflow  # noqa: E402
from sklearn.model_selection import StratifiedKFold, cross_val_score  # noqa: E402

from ml_starter.config import ROOT, SEED, TABLE  # noqa: E402
from ml_starter.data import load_table, split  # noqa: E402
from ml_starter.pipeline import build_pipeline  # noqa: E402

logging.getLogger("mlflow").setLevel(logging.ERROR)  # keep the terminal to what the lessons show
TRACKING_URI = os.environ.get("MLFLOW_TRACKING_URI", f"sqlite:///{ROOT / 'mlflow.db'}")
EXPERIMENT = "churn"
# MLflow saves a scikit-learn model in the skops format, which refuses a type it has not been told to trust.
TRUSTED_TYPES = ["sklearn.compose._column_transformer.make_column_selector"]


def fingerprint(path):
    """The first 12 hex digits of the SHA-256 of a file: the same bytes give the same fingerprint."""
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()[:12]


def git(*arguments):
    """The output of a git command in this repository, or "unknown" when git cannot answer."""
    try:
        return subprocess.run(["git", *arguments], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return "unknown"


def open_store(uri):
    """Point MLflow at a store and make sure the experiment exists, with its files next to the store's database."""
    mlflow.set_tracking_uri(uri)
    if mlflow.get_experiment_by_name(EXPERIMENT) is None:
        files = Path(uri.removeprefix("sqlite:///")).parent / "mlruns"
        mlflow.create_experiment(EXPERIMENT, artifact_location=files.as_uri())
    mlflow.set_experiment(EXPERIMENT)


def train(C=1.0, seed=SEED, table_path=TABLE, uri=TRACKING_URI):
    """Cross-validate the pipeline on the training people, fit it on all of them, and record the whole run."""
    open_store(uri)
    X_train, X_test, y_train, y_test = split(load_table(table_path))
    with mlflow.start_run(run_name=f"C={C} seed={seed}"):
        mlflow.log_params({"C": C, "seed": seed, "data_sha256": fingerprint(table_path)})
        mlflow.set_tags({
            "git_commit": git("rev-parse", "--short", "HEAD"),
            "git_uncommitted_changes": str(bool(git("status", "--porcelain"))),
            "lock_sha256": fingerprint(ROOT / "uv.lock"),
        })
        pipeline = build_pipeline(C)
        folds = StratifiedKFold(5, shuffle=True, random_state=seed)
        scores = cross_val_score(pipeline, X_train, y_train, cv=folds, scoring="roc_auc")
        mlflow.log_metrics({"cv_auc_mean": float(scores.mean()), "cv_auc_min": float(scores.min()), "cv_auc_max": float(scores.max())})
        saved = mlflow.sklearn.log_model(pipeline.fit(X_train, y_train), name="pipeline", skops_trusted_types=TRUSTED_TYPES)
        mlflow.set_tag("model_uri", saved.model_uri)
    return float(scores.mean())


def main():
    parser = argparse.ArgumentParser(description="Train the churn pipeline and record the run.")
    parser.add_argument("--C", type=float, default=1.0, help="inverse regularization strength of the logistic regression")
    parser.add_argument("--seed", type=int, default=SEED, help="seed of the five folds")
    parser.add_argument("--table", default=str(TABLE), help="the churn table to learn from")
    arguments = parser.parse_args()
    mean = train(arguments.C, arguments.seed, arguments.table)
    print(f"C={arguments.C} seed={arguments.seed}: cv_auc_mean {mean:.6f}")


if __name__ == "__main__":
    main()
