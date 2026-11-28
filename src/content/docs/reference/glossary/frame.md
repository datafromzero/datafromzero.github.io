---
id: glossary-frame
term: Frame (window)
short: 'The rows a window function reads around the current row, such as every row from the start of the group up to this one.'
aliases: [window frame, ROWS BETWEEN]
reviewed: 2026-11-27
---

Inside a window function, the frame is the set of rows, measured from the current row, that the function actually uses. A running total uses the rows from the start of the group to the current row; a moving average uses, for example, the current row and the two rows before it. The DuckDB documentation says that framing specifies a set of rows relative to each row where the function is evaluated, and that with an `ORDER BY` and no frame the default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. That default also reads every row that ties with the current one.

## Where you meet it

- [*Window functions: keep the rows, add the context*](/sql/window-functions/) (S14): the default frame, and why tied rows share a running total.
- [*Comparing to the previous row: LAG, LEAD and moving averages*](/sql/lag-lead-moving-windows/) (S16): moving averages with a frame of a few rows.

## Source

- [DuckDB documentation: Window functions](https://duckdb.org/docs/2.0/sql/functions/window_functions.html)
