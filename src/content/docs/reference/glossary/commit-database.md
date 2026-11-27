---
id: glossary-commit-database
term: Commit (database)
short: The step that ends a transaction and keeps its changes, so other users can see them.
aliases: [COMMIT]
reviewed: 2026-11-27
---

In a database, `COMMIT` ends a [transaction](/reference/glossary/transaction/) and keeps all of its changes. Before the commit, other users do not see the changes; after it, the changes are saved and visible. The PostgreSQL glossary defines a commit as the act of finalizing a transaction, which makes it visible to other transactions and assures its durability. `ROLLBACK` is the opposite: it throws the changes away. This is not a Git commit: see [Commit (Git)](/reference/glossary/commit-git/).

## Where you meet it

- [*Inserting, updating and deleting safely*](/sql/modify-data-transactions/) (S34): COMMIT keeps the changes, ROLLBACK undoes them.
- [*Transactions: what ACID actually promises*](/data-engineer/transactions-and-isolation/) (DE24): what a committed transaction promises.

## Source

- [PostgreSQL documentation: Glossary (Commit)](https://www.postgresql.org/docs/current/glossary.html)
- [DuckDB documentation: Transactions](https://duckdb.org/docs/2.0/sql/statements/transactions.html)
