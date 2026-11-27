---
id: glossary-primary-key
term: Primary key
short: A column whose value is different on every row, so each row can be told apart.
aliases: [PK, primary keys]
reviewed: 2026-11-27
---

A primary key is a column, or a set of columns, whose values identify each row: no value repeats and none is empty. In `orders` the primary key is `order_id`; in `order_items` it is `order_item_id`. Another table points to a row by storing its primary key, and that stored copy is a [foreign key](/reference/glossary/foreign-key/). The PostgreSQL glossary describes a primary key as a unique constraint that also guarantees that none of its columns holds a null value.

## Where you meet it

- [*Tables, keys and grain*](/sql/relational-model/) (S18): a primary key identifies each row.
- [*Creating tables and constraints*](/sql/create-table-constraints/) (S33): declaring a primary key when you create a table.

## Source

- [PostgreSQL documentation: Glossary (Primary key)](https://www.postgresql.org/docs/current/glossary.html)
