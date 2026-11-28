---
id: glossary-data-leakage
term: Data leakage
short: 'When a model is built or scored with information it would not have at prediction time, so its score looks better than it is.'
aliases: [leakage, target leakage, leak]
reviewed: 2026-11-27
---

Data leakage is information getting into a model that it would not have when it makes a real prediction, such as a column recorded after the outcome or a scaler fitted on the test rows. The scikit-learn documentation says that it occurs when information that would not be available at prediction time is used when building the model, and that it gives overly optimistic performance estimates. The score then looks good in the notebook and falls when the model meets new rows.

## Where you meet it

- [*Data leakage*](/core/data-leakage/) (C20): find the leak, and split by time to test for it.
- [*Overfitting and cross-validation*](/data-scientist/cross-validation-and-overfitting/) (DS5): leakage inside the folds of a cross-validation.
- [*scikit-learn pipelines: one leakage-safe object*](/ml-engineer/sklearn-pipelines-and-column-transformers/) (MLE1): a pipeline that keeps every step leakage-safe.

## Source

- [scikit-learn documentation: Common pitfalls and recommended practices, data leakage](https://scikit-learn.org/stable/common_pitfalls.html)
