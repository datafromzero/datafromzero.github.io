"""Write the registered champion model to a file the service can load, with a small card that says where it came from.

    uv run python -m ml_starter.export

The service reads model/churn.skops and model/churn.json. It never opens the tracking store, so it can run where the store is not.
"""

import json
import os
from pathlib import Path

os.environ.setdefault("MLFLOW_DISABLE_AGENT_HINT", "1")  # one line of advice that MLflow logs on import

import mlflow  # noqa: E402
import skops.io as skops_io  # noqa: E402
from mlflow import MlflowClient  # noqa: E402

from ml_starter.config import ROOT  # noqa: E402
from ml_starter.runs import MODEL_NAME  # noqa: E402
from ml_starter.train import TRACKING_URI, open_store  # noqa: E402

MODEL_DIR = ROOT / "model"


def save_model(pipeline, card, path):
    """Write the pipeline in the skops format and its card beside it (same name, .json)."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    skops_io.dump(pipeline, path)
    path.with_suffix(".json").write_text(json.dumps(card, indent=2) + "\n")


def export_champion(path=MODEL_DIR / "churn.skops", uri=TRACKING_URI, alias="champion"):
    """Copy the model the alias points at out of the registry, and record which version and which run it was."""
    open_store(uri)
    version = MlflowClient().get_model_version_by_alias(MODEL_NAME, alias)
    run = mlflow.get_run(version.run_id)
    card = {
        "version": version.version,
        "run": run.data.tags["mlflow.runName"],
        "cv_auc_mean": round(run.data.metrics["cv_auc_mean"], 6),
        "data_sha256": run.data.params["data_sha256"],
    }
    save_model(mlflow.sklearn.load_model(f"models:/{MODEL_NAME}@{alias}"), card, path)
    return card


def main():
    card = export_champion()
    print(f"Wrote {MODEL_DIR.relative_to(ROOT) / 'churn.skops'}: " + ", ".join(f"{key} {value}" for key, value in card.items()))


if __name__ == "__main__":
    main()
