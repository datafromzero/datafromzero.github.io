---
id: glossary-cte
term: CTE
short: A named step inside one query, written with WITH, that the next steps can read like a table.
aliases: [common table expression, WITH clause]
reviewed: 2026-11-27
---

A CTE (common table expression) gives one step of a query a name, so the next step can read from it as if it were a table. You write it with `WITH name AS (...)` before the main query. DuckDB's documentation calls a regular CTE essentially a view that is limited in scope to one query: it exists only while that query runs. Splitting a long query into named steps makes each step easy to read and check, like putting each part of a long formula in its own cell.

## Where you meet it

- [*Readable queries with CTEs*](/sql/ctes/) (S13): readable queries made of named steps.

## Source

- [DuckDB documentation: WITH clause](https://duckdb.org/docs/2.0/sql/query_syntax/with.html)
