"""The contract of the churn table, written once and used twice: by the training code (a pandera schema for a table)
and by the serving code (a pydantic model for one request)."""

from typing import Literal

import pandera.pandas as pa
from pydantic import BaseModel, ConfigDict, Field

# The values the model learned. They are listed once, and both the schema and the request model read these lists.
CHANNELS = ["app_store", "organic_search", "paid_search", "paid_social", "referral"]
PLATFORMS = ["android", "ios", "web"]
REGIONS = ["asia_pacific", "europe", "latin_america", "north_america"]

table_schema = pa.DataFrameSchema(
    {
        "user_id": pa.Column(int, unique=True),
        "channel": pa.Column(str, pa.Check.isin(CHANNELS)),
        "platform": pa.Column(str, pa.Check.isin(PLATFORMS)),
        "region": pa.Column(str, pa.Check.isin(REGIONS)),
        "sessions_7d": pa.Column(int, pa.Check.ge(0)),
        "expenses_7d": pa.Column(int, pa.Check.ge(0)),
        "recent_3d": pa.Column(int, pa.Check.ge(0)),
        "active_days_7d": pa.Column(int, pa.Check.in_range(0, 8)),
        "onboarded": pa.Column(int, pa.Check.isin([0, 1])),
        "saw_paywall": pa.Column(int, pa.Check.isin([0, 1])),
        "bought_plus": pa.Column(int, pa.Check.isin([0, 1])),
        "churned": pa.Column(int, pa.Check.isin([0, 1])),
    },
)


class ChurnRequest(BaseModel):
    """One request to score: the ten columns the model reads, and nothing else."""

    model_config = ConfigDict(extra="forbid")

    channel: Literal[*CHANNELS]
    platform: Literal[*PLATFORMS]
    region: Literal[*REGIONS]
    sessions_7d: int = Field(ge=0)
    expenses_7d: int = Field(ge=0)
    recent_3d: int = Field(ge=0)
    active_days_7d: int = Field(ge=0, le=8)
    onboarded: int = Field(ge=0, le=1)
    saw_paywall: int = Field(ge=0, le=1)
    bought_plus: int = Field(ge=0, le=1)
