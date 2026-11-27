---
id: glossary-auc
term: AUC
short: 'A score from 0 to 1 for how well a model ranks real positives above real negatives; 0.5 is no better than guessing.'
aliases: [ROC AUC, area under the curve, AUROC]
reviewed: 2026-11-27
---

AUC is the area under the ROC curve, a curve that shows how a classifier trades catching positives against raising false alarms as its threshold moves. The scikit-learn documentation says that `roc_auc_score` computes this area and that it summarizes the curve in one number. Google's Machine Learning Crash Course reads an AUC of 0.5 as a 50 percent probability of ranking a random positive above a random negative, which is no better than a coin, and 1.0 as a perfect ranking. AUC judges the ranking, not the yes or no you get at one threshold.

## Where you meet it

- [*Your first honest model with scikit-learn*](/data-scientist/first-honest-model/) (DS2): the AUC of a first honest model and of its baselines.
- [*Overfitting and cross-validation*](/data-scientist/cross-validation-and-overfitting/) (DS5): how much the AUC moves from fold to fold.
- [*Explaining a model and checking where it fails*](/data-scientist/model-interpretation-and-fairness/) (DS11): the AUC a model loses when a column is shuffled.

## Source

- [scikit-learn documentation: Metrics and scoring, the receiver operating characteristic](https://scikit-learn.org/stable/modules/model_evaluation.html#receiver-operating-characteristic-roc)
- [Google for Developers: Machine Learning Crash Course, Classification: ROC and AUC](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc)
