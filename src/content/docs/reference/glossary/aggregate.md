---
id: glossary-aggregate
term: Aggregate
short: A function that combines many rows into one value, such as COUNT, SUM or AVG.
aliases: [aggregate function, aggregation]
reviewed: 2026-11-27
---

An aggregate, or aggregate function, combines many rows into a single value: `COUNT` counts them, `SUM` adds them and `AVG` averages them. DuckDB's documentation says aggregates are functions that combine multiple rows into a single value. With `GROUP BY` you get one value for each group instead of one for the whole table, for example the total of the order lines for each store. Most aggregates skip [NULL](/reference/glossary/null/), but `COUNT(*)` counts every row.

## Where you meet it

- [*Counting and summing: aggregate functions*](/sql/aggregate-functions/) (S7): the aggregate functions and three ways of counting.
- [*GROUP BY and HAVING*](/sql/group-by-having/) (S8): one result row for each group.

## Source

- [DuckDB documentation: Aggregate functions](https://duckdb.org/docs/2.0/sql/functions/aggregates.html)
- [PostgreSQL documentation: Glossary (Aggregate function)](https://www.postgresql.org/docs/current/glossary.html)
