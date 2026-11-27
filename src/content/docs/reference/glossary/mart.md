---
id: glossary-mart
term: Mart
short: 'A finished table for one business area or question, built from cleaned tables, that analysts and dashboards read directly.'
aliases: [marts, data mart]
reviewed: 2026-11-27
---

A mart is a table that is ready to use: it holds the business entities or answers that people ask for. In a dbt project the layers run from staging models, which clean one source table each, to marts, which bring the cleaned pieces together. The dbt guide describes the marts layer as the business-defined entities of an organization. Analysts and dashboards read the mart, not the raw files.

## Where you meet it

- [*What a data engineer owns: lifecycle, ETL, ELT and layers*](/data-engineer/role-and-lifecycle/) (DE1): the layers from raw files to a table made for one question.
- [*A dbt project, from source to mart*](/data-engineer/dbt-project-and-first-model/) (DE9): a first dbt model, from source to mart.
- [*Dimensional models and slowly changing dimensions*](/data-engineer/dimensional-models-and-scd/) (DE13): a mart with a dimension and a fact.

## Source

- [dbt documentation: How we structure our dbt projects, overview](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview)
