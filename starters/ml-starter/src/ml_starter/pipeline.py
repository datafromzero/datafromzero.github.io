"""The pipeline of lesson MLE1 as code: raw rows in, chances out."""

from sklearn.compose import ColumnTransformer, make_column_selector
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def build_pipeline(C=1.0):
    """One-hot text columns, scaled number columns, logistic regression."""
    prep = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), make_column_selector(dtype_exclude="number")),
        ("num", StandardScaler(), make_column_selector(dtype_include="number")),
    ])
    return Pipeline([("prep", prep), ("model", LogisticRegression(C=C, max_iter=1000))])
