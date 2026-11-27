---
id: glossary-feature
term: Feature
short: A column a model uses as input to predict something, such as how many visits a customer made.
aliases: [features, predictor]
reviewed: 2026-11-27
---

A feature is a column of the table that a model reads as input. If you predict whether a customer will go quiet, the features might be the number of visits in the first week or the platform used; the thing you predict is the target. The scikit-learn glossary says that features are the individual elements describing a sample, shown as the columns of a data matrix, and that elsewhere they are called attributes, predictors or independent variables. A column counts as a feature only if its value is already final at the moment you predict.

## Where you meet it

- [*Framing a prediction problem, splitting and a baseline*](/core/framing-split-and-baseline/) (C19): a feature is final at the prediction moment.
- [*Feature engineering*](/data-scientist/feature-engineering/) (DS9): making better features.

## Source

- [scikit-learn documentation: Glossary of common terms (feature)](https://scikit-learn.org/stable/glossary.html)
