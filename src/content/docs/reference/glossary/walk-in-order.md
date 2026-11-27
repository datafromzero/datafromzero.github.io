---
id: glossary-walk-in-order
term: Walk-in order
short: 'An order with no customer id: someone who walks in, pays and has no loyalty card.'
aliases: [walk-in, walk-in customer]
reviewed: 2026-11-27
---

A walk-in order is an order placed by someone who just walks in and pays, with no loyalty card, so the order has no customer. The cafe-sales data has exactly one: order 1335, whose `customer_id` is empty. In SQL the empty value is [NULL](/reference/glossary/null/), so an `INNER JOIN` to the customers table drops this order, and `COUNT(customer_id)` skips it, while `COUNT(*)` still counts it.

## Where you meet it

- [*A cleaning workflow you can defend*](/excel/cleaning-workflow/) (E13): the one blank `customer_id` and what to do with it.
- [*NULL: unknown is not zero*](/sql/null-handling/) (S4): the empty `customer_id` as a first NULL.
- [*Counting and summing: aggregate functions*](/sql/aggregate-functions/) (S7): three ways of counting that disagree on this order.

## Source

- [cafe-sales dataset README](https://github.com/datafromzero/datafromzero.github.io/blob/main/datasets/cafe-sales/README.md)
