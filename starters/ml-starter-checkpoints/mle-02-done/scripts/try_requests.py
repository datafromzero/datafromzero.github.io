"""Send four requests to the request model of lesson MLE2 and print what it says about each.

    uv run python scripts/try_requests.py
"""

from pydantic import ValidationError

from ml_starter.config import FEATURES
from ml_starter.contract import ChurnRequest
from ml_starter.data import load_table

valid = load_table().iloc[0][FEATURES].to_dict()  # a real person, as a dictionary of ten values
requests = {
    "a number as text": {**valid, "sessions_7d": "3"},
    "a region never seen": {**valid, "region": "africa"},
    "a number with a fraction": {**valid, "sessions_7d": 2.7},
    "a negative number": {**valid, "sessions_7d": -1},
}
for label, request in requests.items():
    try:
        accepted = ChurnRequest(**request)
        print(f"{label}: accepted, sessions_7d is {accepted.sessions_7d!r}")
    except ValidationError as error:
        print(f"{label}: refused, {error.errors()[0]['msg']}")
