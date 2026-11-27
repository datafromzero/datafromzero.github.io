---
id: glossary-r-squared
term: R²
short: 'A score for a model: the share of the variation in the outcome that the model accounts for, up to 1.0.'
aliases: [R2, R-squared, coefficient of determination]
reviewed: 2026-11-27
---

R² (read "R squared") says how much of the ups and downs of the outcome a model accounts for. The scikit-learn documentation calls it the proportion of variance of y that has been explained by the model, with 1.0 as the best possible score; it can be negative when the model is arbitrarily worse. A high R² does not by itself show that the model fits well, because the NIST handbook warns that a high value does not guarantee a good fit, so look at the residuals as well.

## Where you meet it

- [*Regression as a thinking tool*](/core/linear-regression-basics/) (C11): R² of a line, and why a high value is not proof of a good model.

## Source

- [scikit-learn documentation: Metrics and scoring, the R² score](https://scikit-learn.org/stable/modules/model_evaluation.html#r2-score)
- [NIST/SEMATECH e-Handbook of Statistical Methods: How can I tell if a model fits my data?](https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm)
