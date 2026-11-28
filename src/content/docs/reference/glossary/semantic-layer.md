---
id: glossary-semantic-layer
term: Semantic layer
short: 'One shared place where a metric such as Revenue is defined once, so every dashboard reads the same definition.'
aliases: [metrics layer, semantic model]
reviewed: 2026-11-27
---

A semantic layer, also called a metrics layer, sits between the tables and the dashboards and holds the definition of each metric in one place. Two dashboards that both show "Revenue" then cannot quietly disagree, because both read the same definition instead of each writing its own formula. The dbt documentation says that MetricFlow, which powers its Semantic Layer, helps you define and manage the logic for your company's metrics.

## Where you meet it

- [*A KPI dictionary and a metrics layer*](/data-analyst/metrics-and-kpi-dictionary/) (DA11): a KPI dictionary and a metrics layer, so two dashboards agree.

## Source

- [dbt documentation: About MetricFlow and the Semantic Layer](https://docs.getdbt.com/docs/build/about-metricflow)
- [A KPI dictionary and a metrics layer (the lesson that uses both names)](/data-analyst/metrics-and-kpi-dictionary/)
