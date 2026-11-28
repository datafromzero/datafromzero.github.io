---
id: glossary-dbt
term: dbt
short: 'A tool that turns SQL select statements into tested, documented tables in your warehouse.'
aliases: [dbt Core]
reviewed: 2026-11-27
---

dbt is a data transformation tool that runs in your warehouse. The dbt documentation says that you write simple SQL select statements, and dbt handles the heavy lifting by creating modular, maintainable data models. A model is one SQL file with one select, and other models can build on it. dbt also runs tests on your data and generates documentation alongside the code.

## Where you meet it

- [*A KPI dictionary and a metrics layer*](/data-analyst/metrics-and-kpi-dictionary/) (DA11): a metrics definition that dbt can hold.
- [*A dbt project, from source to mart*](/data-engineer/dbt-project-and-first-model/) (DE9): a first dbt project, from source to mart.
- [*Tests and documentation: how a model earns trust*](/data-engineer/dbt-tests-and-documentation/) (DE10): tests and documentation for a model.

## Source

- [dbt documentation: What is dbt?](https://docs.getdbt.com/docs/introduction)
