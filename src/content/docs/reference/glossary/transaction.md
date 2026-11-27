---
id: glossary-transaction
term: Transaction
short: A group of changes to a database that all succeed or all fail together.
aliases: [transactions]
reviewed: 2026-11-27
---

A transaction groups several changes so that they all happen or none does. You start it with `BEGIN` and end it with [`COMMIT`](/reference/glossary/commit-database/) to keep the changes or `ROLLBACK` to throw them all away. DuckDB's documentation says the changes made by a transaction are not visible to other transactions until it is committed. The standard example is a payment: taking money from one account and adding it to another must never stop halfway. Databases that promise this follow the ACID rules.

## Where you meet it

- [*Inserting, updating and deleting safely*](/sql/modify-data-transactions/) (S34): BEGIN, COMMIT and ROLLBACK.
- [*Transactions: what ACID actually promises*](/data-engineer/transactions-and-isolation/) (DE24): what ACID actually promises.

## Source

- [DuckDB documentation: Transactions](https://duckdb.org/docs/2.0/sql/statements/transactions.html)
- [PostgreSQL documentation: Glossary (Transaction)](https://www.postgresql.org/docs/current/glossary.html)
