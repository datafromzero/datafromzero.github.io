"""Send 200 people of the test part through the service and compare each answer with the model file's own chance.

    uv run python scripts/compare_service.py

The service runs inside this process (TestClient), so nothing has to be started.
"""

import json

import numpy as np
from fastapi.testclient import TestClient

from ml_starter.config import FEATURES
from ml_starter.data import load_table, split
from ml_starter.serve import app, load_model, model_path

X_train, X_test, y_train, y_test = split(load_table())
people = X_test.head(200)
model, card = load_model(model_path())
offline = model.predict_proba(people[FEATURES])[:, 1]  # all 200 rows in one call

with TestClient(app) as client:
    served = np.array([
        client.post("/predict", json=json.loads(people.iloc[[position]].to_json(orient="records"))[0]).json()["churn_chance"]
        for position in range(len(people))
    ])

print(f"{len(people)} people, model version {card['version']}")
print(f"largest difference between served and offline chance: {np.abs(served - offline).max():.1e}")
print(f"people whose two chances are not equal to the last digit: {int((served != offline).sum())}")
