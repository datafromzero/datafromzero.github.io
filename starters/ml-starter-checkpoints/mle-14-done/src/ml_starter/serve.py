"""Serve the churn model behind an HTTP API: one endpoint that scores a person and one that says whether the service is ready.
Every score is logged (lesson MLE14): the inputs, the chance, the milliseconds and the dollars.

    uv run uvicorn ml_starter.serve:app --port 8000

The model is a file (model/churn.skops, written by `python -m ml_starter.export`); MODEL_FILE names another one.
"""

import json
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path

import pandas as pd
import skops.io as skops_io
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

from ml_starter.config import FEATURES, ROOT
from ml_starter.contract import ChurnRequest
from ml_starter.requestlog import log_request

# skops refuses a type it has not been told to trust; this is the one type of our pipeline that it does not know.
TRUSTED_TYPES = ["sklearn.compose._column_transformer.make_column_selector"]


class Prediction(BaseModel):
    churn_chance: float
    model_version: str


def model_path():
    """The model file: the environment variable MODEL_FILE, or model/churn.skops in the repository."""
    return Path(os.environ.get("MODEL_FILE", ROOT / "model" / "churn.skops"))


def load_model(path):
    """The fitted pipeline and its card, or (None, {}) when the file is not there."""
    path = Path(path)
    if not path.exists():
        return None, {}
    card = json.loads(path.with_suffix(".json").read_text()) if path.with_suffix(".json").exists() else {}
    return skops_io.load(path, trusted=TRUSTED_TYPES), card


@asynccontextmanager
async def lifespan(app):
    """Load the model once, when the service starts, not on every request."""
    app.state.model, app.state.card = load_model(model_path())
    yield


app = FastAPI(title="churn", lifespan=lifespan)


def ready_model(request: Request):
    """The loaded pipeline, or a 503 answer: the service is up, but it cannot score anyone."""
    if request.app.state.model is None:
        raise HTTPException(status_code=503, detail="model not loaded")
    return request.app.state.model


def version_of(request: Request):
    """The version of the registered model the file came from, as text."""
    return str(request.app.state.card.get("version", "unknown"))


@app.get("/health")
def health(request: Request):
    ready_model(request)
    return {"status": "ok", "model_version": version_of(request)}


@app.post("/predict", response_model=Prediction)
def predict(person: ChurnRequest, request: Request):
    model = ready_model(request)
    inputs = person.model_dump()
    started = time.perf_counter()
    chance = float(model.predict_proba(pd.DataFrame([inputs])[FEATURES])[0, 1])
    seconds = time.perf_counter() - started
    log_request(request.headers.get("x-request-id"), inputs, chance, version_of(request), seconds)
    return Prediction(churn_chance=chance, model_version=version_of(request))
