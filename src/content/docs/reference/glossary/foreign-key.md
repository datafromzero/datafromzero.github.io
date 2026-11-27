---
id: glossary-foreign-key
term: Foreign key
short: 'A column whose values are values of another table''s primary key; it links each row to a row there.'
aliases: [FK, foreign keys]
reviewed: 2026-11-27
---

A foreign key is a column that stores a key from another table, so each row points to a row there. In the cafe-sales data `orders.store_id` is a foreign key to `stores.store_id`, and `order_items.order_id` is one to `orders.order_id`. A value in a foreign key column must name a row that exists, so an order cannot point to a store that is not in `stores`. A foreign key is the column you match on in a [join](/reference/glossary/join/). It links to a [primary key](/reference/glossary/primary-key/).

## Where you meet it

- [*Tables, keys and grain*](/sql/relational-model/) (S18): a foreign key links two tables.
- [*Reading an entity-relationship diagram*](/sql/reading-er-diagrams/) (S19): primary and foreign keys on an entity-relationship diagram.
- [*INNER JOIN: pairing rows on a key*](/sql/inner-join/) (S20): the join that matches a foreign key to its primary key.

## Source

- [PostgreSQL documentation: Glossary (Foreign key)](https://www.postgresql.org/docs/current/glossary.html)
