---
id: glossary-cross-validation
term: Cross-validation
short: 'Scoring a model several times, each time holding out a different part of the data for testing, then averaging the scores.'
aliases: [CV, k-fold, k-fold cross-validation]
reviewed: 2026-11-27
---

Cross-validation splits the training rows into k parts, called folds. The scikit-learn documentation describes training on k minus 1 of the folds, validating on the remaining one, and reporting the average of the scores from the loop. Every row is used for testing once, and the spread of the fold scores shows how much a score depends on which rows were held out. A final test set is still kept apart for one last check.

## Where you meet it

- [*Overfitting and cross-validation*](/data-scientist/cross-validation-and-overfitting/) (DS5): ten folds, and what the spread of the fold scores says.
- [*scikit-learn pipelines: one leakage-safe object*](/ml-engineer/sklearn-pipelines-and-column-transformers/) (MLE1): a pipeline refitted inside every fold.
- [*Tuning hyperparameters and handling imbalanced classes*](/ml-engineer/tuning-and-class-imbalance/) (MLE4): a search over settings scored by cross-validation.

## Source

- [scikit-learn documentation: Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html)
