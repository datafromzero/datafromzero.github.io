---
id: glossary-null
term: 'NULL'
short: 'SQL''s marker for a missing or unknown value. It is not zero and not an empty text.'
aliases: [null value, missing value]
reviewed: 2026-11-27
---

NULL is how a database marks a value that is missing or unknown. It is not zero and not an empty text. DuckDB's documentation says any comparison with NULL returns NULL, even `NULL = NULL`, so a test such as `customer_id = NULL` matches no rows: write `customer_id IS NULL`. Most [aggregate](/reference/glossary/aggregate/) functions skip NULL. In the cafe-sales data, order 1335 has a NULL `customer_id`: it is the [walk-in order](/reference/glossary/walk-in-order/).

## Where you meet it

- [*NULL: unknown is not zero*](/sql/null-handling/) (S4): NULL, filtering it and counting around it.
- [*Counting and summing: aggregate functions*](/sql/aggregate-functions/) (S7): how COUNT, SUM and AVG treat NULL.

## Source

- [DuckDB documentation: NULL values](https://duckdb.org/docs/2.0/sql/data_types/nulls.html)
