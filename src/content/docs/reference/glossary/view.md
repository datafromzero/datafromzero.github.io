---
id: glossary-view
term: View
short: 'A saved query that you use like a table; the query runs again each time the view is used.'
aliases: [views, CREATE VIEW]
reviewed: 2026-11-27
---

A view gives a query a name and keeps it in the database, so you can write `SELECT * FROM the_view` instead of the whole query. The DuckDB documentation says that a view is not physically materialized: the query is run every time the view is referenced. So a view always shows the current rows of its tables, and it stores no copy of the data. A table, by contrast, holds its rows.

## Where you meet it

- [*Saving a query as a view*](/sql/views/) (S29): save a query as a view and read it like a table.
- [*A KPI dictionary and a metrics layer*](/data-analyst/metrics-and-kpi-dictionary/) (DA11): a chain of views that tests whether two dashboards agree.
- [*Materializations and incremental models*](/data-engineer/materializations-and-incremental-models/) (DE11a): a view or a table: how often the result is rebuilt.

## Source

- [DuckDB documentation: CREATE VIEW](https://duckdb.org/docs/2.0/sql/statements/create_view.html)
