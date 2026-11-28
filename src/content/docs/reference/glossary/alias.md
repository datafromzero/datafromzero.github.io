---
id: glossary-alias
term: Alias
short: 'A new name that you give a column or a table inside one query, written with AS.'
aliases: [aliases, AS]
reviewed: 2026-11-27
---

An alias is a new name for a column or a table, for the length of one query. `product_name AS item` calls the result column `item`, and `FROM products AS p` calls the table `p`. The stored table keeps its own names. The DuckDB documentation says that a table joined to itself must be aliased, so that the two uses can be told apart.

## Where you meet it

- [*SELECT, ORDER BY and LIMIT*](/sql/select-sort-limit/) (S2): name columns and tables with AS.
- [*Joining three tables and a table to itself*](/sql/self-and-multi-table-joins/) (S23): one table joined to itself needs two aliases.

## Source

- [DuckDB documentation: FROM and JOIN clauses](https://duckdb.org/docs/2.0/sql/query_syntax/from.html)
