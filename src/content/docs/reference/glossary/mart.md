---
id: glossary-mart
term: Mart
short: 'A finished table for one business area or question, built from cleaned tables, that analysts and dashboards read directly.'
aliases: [marts, data mart]
reviewed: 2026-11-27
---

A mart is a table that is ready to use: it holds the business entities or answers that people ask for. In a dbt project the layers run from staging models, which clean one source table each, to marts, which bring the cleaned pieces together. The dbt guide describes the marts layer as bringing the modular pieces together into the entities an organization cares about. Analysts and dashboards read the mart, not the raw files.

## Where you meet it

- [*A dbt project, from source to mart*](/data-engineer/dbt-project-and-first-model/) (DE9): a first dbt project, from source to mart.
- [*Tests and documentation: how a model earns trust*](/data-engineer/dbt-tests-and-documentation/) (DE10): tests on the models of a mart.
- [*Materializations and incremental models*](/data-engineer/materializations-and-incremental-models/) (DE11a): marts built as tables, and how often they are rebuilt.

## Source

- [dbt documentation: How we structure our dbt projects, overview](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview)
