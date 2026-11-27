---
id: glossary-window-function
term: Window function
short: 'A function that works out a value for each row from related rows, without merging the rows the way GROUP BY does.'
aliases: [window functions, OVER]
reviewed: 2026-11-27
---

A window function works out a value for each row from a set of related rows, and every input row stays in the result. `OVER (PARTITION BY store_id)` says which rows are related, and an `ORDER BY` inside `OVER` sets their order. The DuckDB documentation says that window functions can use multiple rows to calculate a value for each row. This is how SQL writes a running total, a share of the day's orders or a rank, where `GROUP BY` would collapse the rows into one.

## Where you meet it

- [*Window functions: keep the rows, add the context*](/sql/window-functions/) (S14): keep every row and add a value computed over its group.
- [*Ranking and top-N per group*](/sql/rank-top-n/) (S15): number the rows inside each group.
- [*Comparing to the previous row: LAG, LEAD and moving averages*](/sql/lag-lead-moving-windows/) (S16): look at the previous row and at a moving window of rows.

## Source

- [DuckDB documentation: Window functions](https://duckdb.org/docs/2.0/sql/functions/window_functions.html)
