"""The contract: the real table passes it, the request model agrees with it, and both match what the model learned."""

from typing import get_args

import pytest
from pydantic import ValidationError

from ml_starter.config import FEATURES
from ml_starter.contract import CHANNELS, PLATFORMS, REGIONS, ChurnRequest, table_schema
from ml_starter.data import load_table, split
from ml_starter.pipeline import build_pipeline


def test_the_real_table_passes_the_schema():
    table_schema.validate(load_table())


def test_a_row_of_the_table_is_a_valid_request():
    row = load_table().iloc[0][FEATURES].to_dict()
    assert ChurnRequest(**row).channel == row["channel"]


def test_a_region_the_model_never_saw_is_refused():
    row = {**load_table().iloc[0][FEATURES].to_dict(), "region": "africa"}
    with pytest.raises(ValidationError):
        ChurnRequest(**row)


def test_schema_and_request_model_read_the_same_lists():
    allowed = {"channel": CHANNELS, "platform": PLATFORMS, "region": REGIONS}
    for column, values in allowed.items():
        assert list(get_args(ChurnRequest.model_fields[column].annotation)) == values


def test_the_lists_are_what_the_model_learned():
    X_train, X_test, y_train, y_test = split(load_table())
    learned = build_pipeline().fit(X_train, y_train)["prep"].named_transformers_["cat"].categories_
    assert [list(values) for values in learned] == [CHANNELS, PLATFORMS, REGIONS]
