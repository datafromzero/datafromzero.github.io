---
id: glossary-join
term: Join
short: Combining the rows of two tables into one result by matching a key column, such as order_id.
aliases: [joins]
reviewed: 2026-11-27
---

A join combines rows from two tables into one result by matching them on a key. In SQL you write `FROM orders JOIN stores ON orders.store_id = stores.store_id`, and the `ON` condition says which rows belong together. DuckDB's documentation calls a join a fundamental relational operation that connects two tables horizontally. A spreadsheet has a version of it in `XLOOKUP`: two tables and one key. If a key repeats in one table, the join repeats rows from the other, and a total can grow.

## Where you meet it

- [*Bring in a value by key with XLOOKUP*](/excel/xlookup/) (E8): the spreadsheet version, with XLOOKUP.
- [*INNER JOIN: pairing rows on a key*](/sql/inner-join/) (S20): INNER JOIN, pairing rows on a key.
- [*Join fan-out: aggregate before you join*](/sql/join-fanout/) (S22): the join that multiplies rows, and how to avoid it.

## Source

- [DuckDB documentation: FROM and JOIN clauses](https://duckdb.org/docs/2.0/sql/query_syntax/from.html)
- [PostgreSQL documentation: Glossary (Join)](https://www.postgresql.org/docs/current/glossary.html)
