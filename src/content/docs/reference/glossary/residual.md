---
id: glossary-residual
term: Residual
short: 'The gap between a real value and the value a model predicted for it: observed minus predicted.'
aliases: [residuals, prediction error]
reviewed: 2026-11-27
---

A residual is how far a model's prediction misses one row: the real value minus the predicted one. The NIST handbook describes residuals as the differences between the responses observed and the corresponding predictions computed using the regression function. In the cafe data, a line that predicts an order's total from its units predicts 109.96 dollars for order 2075, which was 197.00, so its residual is 87.04 dollars. A good fit has small residuals with no pattern, and the residuals of a fitted line add up to zero.

## Where you meet it

- [*Regression as a thinking tool*](/core/linear-regression-basics/) (C11): the residuals of a line that predicts the order total.
- [*Framing a prediction problem, splitting and a baseline*](/core/framing-split-and-baseline/) (C19): a model that predicts a chance has misses that are scored.

## Source

- [NIST/SEMATECH e-Handbook of Statistical Methods: How can I tell if a model fits my data?](https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm)
