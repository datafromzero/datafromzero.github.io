---
id: glossary-statistical-power
term: Statistical power
short: 'The chance that a test finds an effect that is really there; more people or a bigger effect raise it.'
aliases: [power]
reviewed: 2026-11-27
---

Power is the chance that a test says "there is an effect" when there really is one. The statsmodels documentation puts it as the probability that the test correctly rejects the null hypothesis if the alternative hypothesis is true, which is one minus the probability of a type II error. It rises with more people and with a bigger true effect, so you plan the number of people before an experiment, not after it. A test with low power can easily miss a real lift, and then a result that is not significant tells you little.

## Where you meet it

- [*Hypothesis tests and p-values, honestly*](/core/hypothesis-testing/) (C8): power and the two ways to be wrong.
- [*Designing an A/B test*](/core/experiments-ab-testing/) (C14): plan the number of people in each group before the test.
- [*Analyzing experiments in Python*](/data-scientist/experiment-analysis-in-python/) (DS13): power and sample size in Python.

## Source

- [statsmodels documentation: tt_ind_solve_power](https://www.statsmodels.org/stable/generated/statsmodels.stats.power.tt_ind_solve_power.html)
