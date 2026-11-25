"""The triage of lesson MLE2, on small tables made from the real one."""

import pytest

from ml_starter.data import load_table
from ml_starter.validate import BatchRejected, repair, triage


@pytest.fixture
def small():
    return load_table().head(200)


def test_repair_fixes_typed_text_and_counts_the_rows(small):
    small.loc[3, "channel"] = "Paid_Social "
    fixed, repaired = repair(small)
    assert repaired == 1
    assert fixed.loc[3, "channel"] == "paid_social"


def test_every_row_is_kept_or_quarantined_once(small):
    small.loc[5, "sessions_7d"] = -1
    small.loc[5, "channel"] = "tiktok"
    small.loc[9, "onboarded"] = 2
    result = triage(small)
    assert len(result.quarantined) == 2
    assert len(result.clean) + len(result.quarantined) == len(small)


def test_a_wrong_column_rejects_the_batch(small):
    with pytest.raises(BatchRejected):
        triage(small.assign(sessions_7d=small["sessions_7d"].astype(float) + 0.5))


def test_too_many_failing_rows_reject_the_batch(small):
    small.loc[:29, "onboarded"] = 2
    with pytest.raises(BatchRejected):
        triage(small)
