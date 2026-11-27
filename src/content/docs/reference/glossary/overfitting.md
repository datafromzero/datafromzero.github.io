---
id: glossary-overfitting
term: Overfitting
short: 'A model that fits its own rows too closely: a high score on the data it learned from, a lower one on new rows.'
aliases: [overfit]
reviewed: 2026-11-27
---

Overfitting is when a model learns the quirks of the rows it was built from instead of the pattern, so it scores well on those rows and worse on rows it has not seen. The scikit-learn documentation describes a model that would just repeat the labels of the samples it has just seen: it would have a perfect score and fail on unseen data. The lessons read overfitting as a gap between the two scores, which is why you always score a [model](/reference/glossary/model/) on rows it did not learn from.

## Where you meet it

- [*Your first honest model with scikit-learn*](/data-scientist/first-honest-model/) (DS2): score the model on the rows it learned from as well.
- [*Overfitting and cross-validation*](/data-scientist/cross-validation-and-overfitting/) (DS5): overfitting is a gap.

## Source

- [scikit-learn documentation: Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html)
