"""Read the recorded runs: list them, register the best, show one, and reproduce one from its record.

    uv run python -m ml_starter.runs list
    uv run python -m ml_starter.runs register
    uv run python -m ml_starter.runs show RUN_ID
    uv run python -m ml_starter.runs reproduce RUN_ID
"""

import argparse

import mlflow
from mlflow import MlflowClient

from ml_starter.config import TABLE
from ml_starter.train import EXPERIMENT, TRACKING_URI, fingerprint, open_store, train

MODEL_NAME = "churn"


def runs_table(uri=TRACKING_URI):
    """Every run of the experiment, the best cv_auc_mean first (a run that failed has no metric and comes last)."""
    open_store(uri)
    runs = mlflow.search_runs(experiment_names=[EXPERIMENT], order_by=["metrics.cv_auc_mean DESC"])
    table = runs[["run_id", "tags.mlflow.runName", "status", "metrics.cv_auc_mean"]].copy()
    table["run_id"] = table["run_id"].str[:8]
    return table.rename(columns={"tags.mlflow.runName": "run", "metrics.cv_auc_mean": "cv_auc_mean"})


def register_best(uri=TRACKING_URI):
    """Register the pipeline of the best finished run as a new version of the model and point the alias champion at it."""
    open_store(uri)
    finished = mlflow.search_runs(experiment_names=[EXPERIMENT], filter_string="attributes.status = 'FINISHED'",
                                  order_by=["metrics.cv_auc_mean DESC"])
    best = finished.iloc[0]
    version = mlflow.register_model(best["tags.model_uri"], MODEL_NAME)
    MlflowClient().set_registered_model_alias(MODEL_NAME, "champion", version.version)
    return best["tags.mlflow.runName"], version.version


def find_run(prefix):
    """The one run whose id starts with the given characters."""
    open_store(TRACKING_URI)
    runs = mlflow.search_runs(experiment_names=[EXPERIMENT])
    hits = runs[runs["run_id"].str.startswith(prefix)]
    if len(hits) != 1:
        raise SystemExit(f"{len(hits)} runs start with {prefix!r}; give more characters")
    return MlflowClient().get_run(hits.iloc[0]["run_id"])


def reproduce(prefix, uri=TRACKING_URI):
    """Run again with the recorded parameters, refusing when the data file is no longer the one that run read."""
    open_store(uri)
    recorded = find_run(prefix)
    now = fingerprint(TABLE)
    if recorded.data.params["data_sha256"] != now:
        raise SystemExit(f"Cannot reproduce: the data file changed (recorded {recorded.data.params['data_sha256']}, now {now})")
    again = train(float(recorded.data.params["C"]), int(recorded.data.params["seed"]), uri=uri)
    return recorded.data.metrics["cv_auc_mean"], again


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["list", "register", "show", "reproduce"])
    parser.add_argument("run_id", nargs="?")
    arguments = parser.parse_args()
    if arguments.command == "list":
        print(runs_table().to_string(index=False, float_format=lambda value: f"{value:.3f}"))
    elif arguments.command == "register":
        name, version = register_best()
        print(f"Registered {MODEL_NAME} version {version} from run {name}, alias champion.")
    elif arguments.command == "show":
        run = find_run(arguments.run_id)
        for key, value in {**run.data.params, **{k: v for k, v in run.data.tags.items() if not k.startswith("mlflow") and k != "model_uri"}}.items():
            print(f"{key}: {value}")
    else:
        recorded, again = reproduce(arguments.run_id)
        print(f"recorded {recorded:.6f}, reproduced {again:.6f}, identical: {recorded == again}")


if __name__ == "__main__":
    main()
