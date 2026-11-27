---
id: glossary-schema
term: Schema
short: 'The plan of a database: which tables it has, what columns each holds, and how the tables link.'
aliases: [database schema]
reviewed: 2026-11-27
---

A schema is the plan of a database: which tables it holds, which columns each table has, and how the tables link through keys. The cafe-sales schema is five tables: `stores`, `customers`, `products`, `orders` and `order_items`. Database software also uses the word for a named folder that groups tables inside one database; the PostgreSQL documentation calls that a namespace, and a lesson says which meaning it uses. A star schema is one kind of plan: a central table of events with small tables around it.

## Where you meet it

- [*Star schema: facts and dimensions*](/sql/star-schema/) (S31): a star schema, with the plan defined in a sentence.
- [*Who can see what: roles, grants and SQL injection*](/sql/access-and-injection/) (S30): a schema as a named folder of tables.
- [*Designing a star schema from business questions*](/core/designing-a-star-schema/) (C18): designing a star schema from business questions.

## Source

- [PostgreSQL documentation: Glossary (Schema)](https://www.postgresql.org/docs/current/glossary.html)
