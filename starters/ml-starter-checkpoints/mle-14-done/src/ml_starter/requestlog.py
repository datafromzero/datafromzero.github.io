"""The request log: one JSON line for each request the service scored, with what came in, what went out, how long it took
and what the compute cost."""

import json
import os
from pathlib import Path

import pandas as pd

from ml_starter.config import ROOT

# An assumption, not a quote: the dollars an hour of a small machine that serves only this model. Check your host's price page.
PRICE_PER_HOUR = 0.10


def log_path():
    """The log file: the environment variable REQUEST_LOG, or logs/requests.jsonl in the repository."""
    return Path(os.environ.get("REQUEST_LOG", ROOT / "logs" / "requests.jsonl"))


def log_request(request_id, inputs, chance, version, seconds):
    """Append one line: the request's id, its ten inputs, the chance, the model version, the milliseconds and the dollars."""
    row = {
        "request_id": request_id,
        **inputs,
        "churn_chance": chance,
        "model_version": version,
        "latency_ms": round(seconds * 1000, 3),
        "cost_usd": seconds * PRICE_PER_HOUR / 3600,
    }
    path = log_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as file:
        file.write(json.dumps(row) + "\n")


def read_log(path=None):
    """The log as a table, one row for each request."""
    return pd.read_json(path or log_path(), lines=True)
