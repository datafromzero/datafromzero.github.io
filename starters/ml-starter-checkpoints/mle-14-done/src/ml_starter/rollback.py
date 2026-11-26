"""Move the champion alias between versions of the registered model, and write the model file of the version it points at.

    uv run python -m ml_starter.rollback list
    uv run python -m ml_starter.rollback promote RUN_NAME  register that run's model as a new version, make it champion, export it
    uv run python -m ml_starter.rollback back              point champion at the version before the current one, export it

The service reads the exported file, so restart it (or rebuild the image) after either command.
"""

import argparse
import os

os.environ.setdefault("MLFLOW_DISABLE_AGENT_HINT", "1")  # one line of advice that MLflow logs on import

import mlflow  # noqa: E402
from mlflow import MlflowClient  # noqa: E402

from ml_starter.export import export_champion  # noqa: E402
from ml_starter.runs import MODEL_NAME  # noqa: E402
from ml_starter.train import EXPERIMENT, TRACKING_URI, open_store  # noqa: E402


def versions(uri=TRACKING_URI):
    """Every registered version as (version number, run name, cv_auc_mean, is it the champion), oldest first."""
    open_store(uri)
    client = MlflowClient()
    champion = int(client.get_model_version_by_alias(MODEL_NAME, "champion").version)
    found = []
    for version in client.search_model_versions(f"name='{MODEL_NAME}'"):
        run = mlflow.get_run(version.run_id)
        found.append((int(version.version), run.data.tags["mlflow.runName"], run.data.metrics["cv_auc_mean"], int(version.version) == champion))
    return sorted(found)


def promote(run_name, uri=TRACKING_URI):
    """Register the model of the latest finished run with this name as a new version and make it the champion."""
    open_store(uri)
    runs = mlflow.search_runs(experiment_names=[EXPERIMENT], order_by=["attributes.start_time DESC"],
                              filter_string=f"tags.mlflow.runName = '{run_name}' and attributes.status = 'FINISHED'")
    if runs.empty:
        raise SystemExit(f"No finished run is named {run_name!r}")
    version = mlflow.register_model(runs.iloc[0]["tags.model_uri"], MODEL_NAME)
    MlflowClient().set_registered_model_alias(MODEL_NAME, "champion", version.version)
    return export_champion(uri=uri)


def roll_back(uri=TRACKING_URI):
    """Point the champion alias at the version before the current champion and export that version."""
    found = versions(uri)
    current = next(number for number, _, _, is_champion in found if is_champion)
    earlier = [number for number, _, _, _ in found if number < current]
    if not earlier:
        raise SystemExit(f"Version {current} is the first version: nothing to roll back to")
    MlflowClient().set_registered_model_alias(MODEL_NAME, "champion", max(earlier))
    return current, export_champion(uri=uri)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["list", "promote", "back"])
    parser.add_argument("run_name", nargs="?", help="the name of a run, as `train` gives it: C=0.1 seed=2026")
    arguments = parser.parse_args()
    if arguments.command == "list":
        for number, run, score, is_champion in versions():
            print(f"version {number}  {run}  cv_auc_mean {score:.3f}" + ("  champion" if is_champion else ""))
    elif arguments.command == "promote":
        card = promote(arguments.run_name)
        print(f"Champion is now version {card['version']} ({card['run']}); model/churn.skops written.")
    else:
        old, card = roll_back()
        print(f"Rolled back from version {old} to version {card['version']} ({card['run']}); model/churn.skops written.")


if __name__ == "__main__":
    main()
