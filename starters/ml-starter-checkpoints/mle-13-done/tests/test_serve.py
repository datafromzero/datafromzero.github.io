"""The service of lesson MLE13, called the way a client calls it, with a small model made for the tests."""

import json

import pytest
from fastapi.testclient import TestClient

from ml_starter.config import FEATURES, TARGET
from ml_starter.data import load_table
from ml_starter.export import save_model
from ml_starter.pipeline import build_pipeline
from ml_starter.serve import app

PEOPLE = load_table().head(400)
PIPELINE = build_pipeline(0.1).fit(PEOPLE[FEATURES], PEOPLE[TARGET])


def as_request(position):
    """One person of the table as the dictionary a client would send (plain Python numbers)."""
    return json.loads(PEOPLE.iloc[[position]][FEATURES].to_json(orient="records"))[0]


@pytest.fixture
def client(tmp_path, monkeypatch):
    save_model(PIPELINE, {"version": 7}, tmp_path / "churn.skops")
    monkeypatch.setenv("MODEL_FILE", str(tmp_path / "churn.skops"))
    with TestClient(app) as client:  # the with block starts the service, so the model is loaded
        yield client


def test_a_person_is_scored_as_the_pipeline_scores_them(client):
    chances = PIPELINE.predict_proba(PEOPLE[FEATURES])[:, 1]
    for position in range(50):
        answer = client.post("/predict", json=as_request(position))
        assert answer.status_code == 200
        assert answer.json()["churn_chance"] == pytest.approx(chances[position], abs=1e-9)


def test_every_answer_names_the_model_that_made_it(client):
    assert client.post("/predict", json=as_request(0)).json()["model_version"] == "7"
    assert client.get("/health").json() == {"status": "ok", "model_version": "7"}


def test_a_region_the_model_never_saw_is_refused_at_the_door(client):
    answer = client.post("/predict", json={**as_request(0), "region": "africa"})
    assert answer.status_code == 422
    assert answer.json()["detail"][0]["type"] == "literal_error"


def test_an_extra_field_is_refused(client):
    answer = client.post("/predict", json={**as_request(0), "sessions_14d": 3})
    assert answer.status_code == 422
    assert answer.json()["detail"][0]["type"] == "extra_forbidden"


def test_without_a_model_file_the_service_is_up_but_not_ready(tmp_path, monkeypatch):
    monkeypatch.setenv("MODEL_FILE", str(tmp_path / "missing.skops"))
    with TestClient(app) as client:
        assert client.get("/health").status_code == 503
        assert client.post("/predict", json=as_request(0)).status_code == 503
