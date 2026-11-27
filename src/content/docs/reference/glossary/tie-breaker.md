---
id: glossary-tie-breaker
term: Tie-breaker
short: 'A second sort column that decides the order of rows that tie on the first, so the result is the same on every run.'
aliases: [tiebreaker, deterministic]
reviewed: 2026-11-27
---

Rows tie when they have the same value in the sort column. A tie-breaker is a further column in `ORDER BY` that tells the tied rows apart: Chai Latte and Cold Brew both cost 4.75, so sorting by price and then by name settles which comes first. Without it, a query is not deterministic: nothing promises the same order on every run. The DuckDB documentation says that, without an `ORDER BY`, the results of a `LIMIT` might not be deterministic.

## Where you meet it

- [*SELECT, ORDER BY and LIMIT*](/sql/select-sort-limit/) (S2): sort with a tie-breaker, then cut with LIMIT.
- [*Ranking and top-N per group*](/sql/rank-top-n/) (S15): a tie-breaker makes a top-N list stable.
- [*Deduplication and the latest record per entity*](/sql/deduplicate-latest-record/) (S17): a tie-breaker picks the latest record of each entity.

## Source

- [DuckDB documentation: LIMIT and OFFSET clauses](https://duckdb.org/docs/2.0/sql/query_syntax/limit.html)
