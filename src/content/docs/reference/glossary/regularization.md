---
id: glossary-regularization
term: Regularization
short: 'A penalty added while fitting a model that keeps its coefficients small, so it fits the quirks of its training rows less.'
aliases: [regularize, ridge, lasso, L1 and L2 penalty]
reviewed: 2026-11-27
---

Regularization adds a penalty to the fitting so that the model prefers small coefficients. The scikit-learn documentation says that ridge regression imposes a penalty on the size of the coefficients, with a parameter that controls the amount of shrinkage, and that lasso can set coefficients exactly to zero. A stronger penalty gives a simpler model that follows the training rows less closely, which can help it score better on new rows. How strong the penalty should be is a setting you choose by scoring on rows the model did not learn from.

## Where you meet it

- [*Regularization: keeping a model simple on purpose*](/data-scientist/regularization/) (DS6): keep a model simple on purpose, with a penalty you tune.
- [*Tuning hyperparameters and handling imbalanced classes*](/ml-engineer/tuning-and-class-imbalance/) (MLE4): the penalty strength as a setting to search.
- [*Training deep models well: regularization and transfer learning*](/ml-engineer/deep-learning-training-practice/) (MLE6): regularization of a neural network.

## Source

- [scikit-learn documentation: Linear models, ridge and lasso](https://scikit-learn.org/stable/modules/linear_model.html)
