---
id: glossary-standard-error
term: Standard error
short: 'How much a statistic, such as a sample mean, typically varies from one sample to the next; it shrinks as the sample grows.'
aliases: [SE, standard error of the mean]
reviewed: 2026-11-27
---

The standard error says how far a statistic, such as the mean of a sample, usually lands from the value it estimates. SciPy's `scipy.stats.sem` calculates the standard error of the mean. For a mean it is the standard deviation divided by the square root of the number of rows, so four times as many orders halve it. It is not the spread of single orders: the standard deviation of single cafe orders is about 8.62 dollars, and the standard error of the mean of 100 orders is about a tenth of that.

## Where you meet it

- [*Sampling variability and the Central Limit Theorem*](/core/sampling-variability-clt/) (C6): how sample means vary from sample to sample.
- [*Confidence intervals*](/core/confidence-intervals/) (C7): the margin of an interval is a multiple of the standard error.

## Source

- [SciPy documentation: scipy.stats.sem](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.sem.html)
