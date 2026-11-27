---
id: glossary-grain
term: Grain
short: 'What one row of a table stands for, said in one sentence, such as "one row is one order line".'
aliases: [grain of a table]
reviewed: 2026-11-27
---

The grain of a table is what one row stands for. Say it in one sentence that starts "One row is..." before you count or add anything, because `COUNT(*)` counts whatever a row stands for. In the cafe-sales data, one row of `orders` is one order (1,800 rows) and one row of `order_items` is one product on an order (3,287 rows), so "how many items did we sell?" belongs to `order_items`. Kimball Group, a team of data-warehouse designers, says to declare the grain first, before choosing dimensions or facts.

## Where you meet it

- [*GROUP BY and HAVING*](/sql/group-by-having/) (S8): say what a row stands for before you group.
- [*Tables, keys and grain*](/sql/relational-model/) (S18): the grain of each of the five tables.
- [*Grain, facts and dimensions*](/core/grain-facts-and-dimensions/) (C17): grain, facts and dimensions.

## Source

- [Kimball Group: Grain](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/grain/)
