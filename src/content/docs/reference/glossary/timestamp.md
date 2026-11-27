---
id: glossary-timestamp
term: Timestamp
short: 'A value that holds both a date and a time of day, such as 2026-01-01 08:02:00.'
aliases: [timestamps, datetime]
reviewed: 2026-11-27
---

A timestamp is a value that holds a date and a time of day together, so it names one moment. The DuckDB documentation says that timestamps represent points in time and combine date and time information. In cafe-sales the column `ordered_at` is a timestamp, down to the second. Two orders can still share one timestamp: the 1,800 orders carry 1,788 different ones, which is why a sort on it needs a tie-breaker.

## Where you meet it

- [*SELECT, ORDER BY and LIMIT*](/sql/select-sort-limit/) (S2): sort the latest orders by their timestamp.
- [*Working with dates and time*](/sql/dates-and-time/) (S11): take a timestamp apart and cut it to a month.
- [*Deduplication and the latest record per entity*](/sql/deduplicate-latest-record/) (S17): the latest record of each entity, ordered by its timestamp.

## Source

- [DuckDB documentation: Timestamp types](https://duckdb.org/docs/2.0/sql/data_types/timestamp.html)
