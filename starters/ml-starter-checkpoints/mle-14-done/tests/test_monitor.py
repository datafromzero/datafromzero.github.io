"""The drift measure, the alert and the retraining trigger of lesson MLE14, on small tables."""

import numpy as np
import pandas as pd
import pytest

from ml_starter.monitor import PSI_ALERT, alert_weeks, psi, retrain_due


def test_the_same_shares_have_no_drift():
    shares = np.array([0.2, 0.3, 0.5])
    assert psi(shares, shares) == 0.0


def test_psi_is_the_sum_of_the_bin_terms():
    reference, current = np.array([0.5, 0.5]), np.array([0.8, 0.2])
    by_hand = (0.8 - 0.5) * np.log(0.8 / 0.5) + (0.2 - 0.5) * np.log(0.2 / 0.5)
    assert psi(reference, current) == pytest.approx(by_hand)
    assert psi(reference, current) > PSI_ALERT


def test_a_bin_the_reference_never_had_still_counts():
    assert psi(np.array([1.0, 0.0]), np.array([0.9, 0.1])) > PSI_ALERT


def test_the_alert_lists_the_weeks_at_or_over_the_level():
    weekly = pd.DataFrame({"week": ["a", "b", "c"], "psi": [0.01, PSI_ALERT, 0.5]})
    assert alert_weeks(weekly) == ["b", "c"]


def test_retraining_waits_for_two_weeks_in_a_row_below_the_floor():
    below, fine = 0.55, 0.70
    weekly = pd.DataFrame({"labels_ready": ["d1", "d2", "d3", "d4", "d5"], "auc": [below, fine, below, below, below]})
    assert retrain_due(weekly) == "d4"
    assert retrain_due(weekly.head(3)) is None
