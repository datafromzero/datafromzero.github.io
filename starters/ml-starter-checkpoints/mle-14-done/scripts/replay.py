"""Replay the spring through the service: train the model as it was on March 1, then send every person who signed up from
March 2 to May 31 to /predict, in signup order, as the app would have on their seventh day.

    uv run python scripts/replay.py

It writes model/replay.skops (the March 1 model) and logs/replay.jsonl (one line for each request). The registry and
model/churn.skops are not touched.
"""

import json
import os

from fastapi.testclient import TestClient

from ml_starter.config import FEATURES, ROOT, TARGET
from ml_starter.data import load_table
from ml_starter.export import save_model
from ml_starter.monitor import REPLAY_START
from ml_starter.pipeline import build_pipeline

MODEL = ROOT / "model" / "replay.skops"
LOG = ROOT / "logs" / "replay.jsonl"


def main():
    table = load_table()
    trained_on = table[table["signup_date"] < REPLAY_START]
    save_model(build_pipeline(0.1).fit(trained_on[FEATURES], trained_on[TARGET]), {"version": "replay"}, MODEL)
    LOG.parent.mkdir(exist_ok=True)
    LOG.unlink(missing_ok=True)
    os.environ["MODEL_FILE"], os.environ["REQUEST_LOG"] = str(MODEL), str(LOG)
    from ml_starter.serve import app  # imported after the environment is set

    later = table[table["signup_date"] >= REPLAY_START].sort_values(["signup_date", "user_id"])
    bodies = json.loads(later[["user_id", *FEATURES]].to_json(orient="records"))
    with TestClient(app) as client:
        for body in bodies:
            user_id = body.pop("user_id")
            answer = client.post("/predict", json=body, headers={"x-request-id": str(user_id)})
            assert answer.status_code == 200, answer.text
    print(f"Trained on {len(trained_on):,} people who signed up before {REPLAY_START}; sent {len(bodies):,} people to the service.")


if __name__ == "__main__":
    main()
