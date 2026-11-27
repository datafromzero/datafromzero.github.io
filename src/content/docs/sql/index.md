---
title: "SQL: all lessons"
description: Every SQL lesson in the order to study them, with your done ticks, and a two-part placement test to find where to start.
---

## Placement test

Do you already write SQL? The placement test has two parts of eight questions each, to see where to start. Do not look anything up, and do not run the queries: the numbers come from the cafe-sales tables (1,800 orders, 3,287 order lines, 150 customers, 16 products), and the answers say what they are. Each answer is in the box under its question.

Together the two parts test 16 of the 39 lessons. **Not tested in either part:** S1, S2, S5 to S7, S10 to S13, S16 to S20, S23, S26, S28, S30 to S32, S35, S37 and S39. Passing does not skip those 23. The tested lessons use many of them (a query with `GROUP BY` and `HAVING` needs the basics of `SELECT` and `COUNT`), so they should not be strangers, but nothing checks them one by one. When you are done, open each one, read its closing line (*The pattern to remember*), and study the lesson if it is new to you.

<div hidden data-placement-stage="sql" data-not-tested="S1 S2 S5 S6 S7 S10 S11 S12 S13 S16 S17 S18 S19 S20 S23 S26 S28 S30 S31 S32 S35 S37 S39"></div>

### Placement test, part 1

This part covers S3, S4, S8, S9, S14, S15, S21 and S22.

<div hidden data-placement-test="sql-1" data-covers="S3 S4 S8 S9 S14 S15 S21 S22"></div>

- **All eight right:** go on to [part 2](#placement-test-part-2).
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order. You will meet the lessons of part 2 on the way.

1. You want the number of orders placed in May 2026. The column `ordered_at` holds a date and a time, such as `2026-05-31 14:20:00`. Someone writes this query, and it returns 367. Why is 367 not the number of May orders, and how do you fix the filter?

   ```sql
   SELECT COUNT(*)
   FROM orders
   WHERE ordered_at BETWEEN '2026-05-01' AND '2026-05-31';
   ```

   <details>
   <summary>Answer</summary>

   The date `'2026-05-31'` means midnight at the start of May 31, so every order placed later that day is lost: 13 orders. The right count is 380. Write the end as "before the first day of the next month":

   ```sql
   WHERE ordered_at >= '2026-05-01' AND ordered_at < '2026-06-01'
   ```

   *Why:* a date compared with a timestamp stands for 00:00 on that day.

   Missed it? Study [*Filtering rows with WHERE*](/sql/where-filtering/) (S3).

   </details>

2. Customer 15 placed 16 of the 1,800 orders. One order is a walk-in sale with an empty `customer_id` (NULL). How many rows does this query return?

   ```sql
   SELECT * FROM orders WHERE customer_id <> 15;
   ```

   <details>
   <summary>Answer</summary>

   1,783, not 1,784. For the walk-in order, `NULL <> 15` is unknown, not true, so `WHERE` drops the row. To keep it, add `OR customer_id IS NULL`.

   *Why:* a comparison with NULL never gives true or false, only unknown, and `WHERE` keeps only true.

   Missed it? Study [*NULL: unknown is not zero*](/sql/null-handling/) (S4).

   </details>

3. This query fails. Why, and how do you fix it? After the fix, how many rows come back, if store 1 took 421 card, 217 mobile and 91 cash orders?

   ```sql
   SELECT payment_method, COUNT(*) AS orders
   FROM orders
   WHERE store_id = 1 AND COUNT(*) > 100
   GROUP BY payment_method;
   ```

   <details>
   <summary>Answer</summary>

   `WHERE` runs before the rows are grouped, so there is no count yet. A condition on a group goes in `HAVING`; the condition on a row stays in `WHERE`:

   ```sql
   WHERE store_id = 1
   GROUP BY payment_method
   HAVING COUNT(*) > 100
   ```

   Two rows come back: card with 421 and mobile with 217. Cash, with 91, is dropped.

   *Why:* `WHERE` filters rows, then `GROUP BY` makes groups, then `HAVING` filters groups.

   Missed it? Study [*GROUP BY and HAVING*](/sql/group-by-having/) (S8).

   </details>

4. A colleague wants the number of canceled orders and writes the query below. What does it return, and how would you fix it?

   ```sql
   SELECT COUNT(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) FROM orders;
   ```

   <details>
   <summary>Answer</summary>

   It returns 1,800, the number of orders. Every row gives 1 or 0, and `COUNT` counts every value that is not NULL. Two fixes give the right answer, 1 canceled order: `SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END)`, or `COUNT(CASE WHEN status = 'canceled' THEN 1 END)`, where the other rows are NULL and `COUNT` skips them.

   *Why:* `SUM` adds the 1s; `COUNT` only counts that a value exists.

   Missed it? Study [*Several metrics in one pass*](/sql/conditional-aggregation/) (S9).

   </details>

5. Look at this query. (a) How many rows does it return? (b) What does `store_orders` show on the row of order 1001, which was taken at Campus? Campus took 716 orders in all. (c) How is the result different from `SELECT store_id, COUNT(*) FROM orders GROUP BY store_id`?

   ```sql
   SELECT order_id, store_id,
          COUNT(*) OVER (PARTITION BY store_id) AS store_orders
   FROM orders;
   ```

   <details>
   <summary>Answer</summary>

   (a) 1,800 rows, one for each order. (b) 716, the same number on every Campus row. (c) `GROUP BY` collapses the orders into 3 rows, one for each store; the window function keeps all the rows and adds the store's count to each.

   *Why:* a window function adds context to each row; it never changes the number of rows.

   Missed it? Study [*Window functions: keep the rows, add the context*](/sql/window-functions/) (S14).

   </details>

6. These are the 16 menu prices, highest first: 9.25, 8.50, 5.50, 5.00, 4.75, 4.75, 4.50, 4.50, 4.25, 3.75, 3.75, 3.50, 3.50, 3.25, 3.25, 3.00. You rank the products by price, highest first, and keep the rows with a rank of 7 or less. How many rows come back with `ROW_NUMBER()`, with `RANK()` and with `DENSE_RANK()`?

   <details>
   <summary>Answer</summary>

   7, 8 and 9. `ROW_NUMBER()` never gives the same number twice, so it keeps exactly 7 rows, and it picks between the two 4.50 products by chance unless you add a tie-breaker. `RANK()` gives the two 4.75 products rank 5, skips 6, and gives the two 4.50 products rank 7: 8 rows. `DENSE_RANK()` skips nothing: 4.75 is 5, 4.50 is 6 and 4.25 is 7: 9 rows.

   *Why:* the three functions are three policies for ties.

   Missed it? Study [*Ranking and top-N per group*](/sql/rank-top-n/) (S15).

   </details>

7. Five customers signed up and never ordered. One more customer has a single order, and it was canceled. Which of these queries returns the customers who never placed any order, and how many rows does each one return?

   ```sql
   -- (a)
   SELECT c.customer_id FROM customers c
   INNER JOIN orders o ON o.customer_id = c.customer_id
   WHERE o.order_id IS NULL;

   -- (b)
   SELECT c.customer_id FROM customers c
   LEFT JOIN orders o ON o.customer_id = c.customer_id
   WHERE o.order_id IS NULL;

   -- (c)
   SELECT c.customer_id FROM customers c
   LEFT JOIN orders o ON o.customer_id = c.customer_id AND o.status = 'completed'
   WHERE o.order_id IS NULL;
   ```

   <details>
   <summary>Answer</summary>

   Query (b), with 5 rows. Query (a) returns 0 rows: an inner join keeps only customers that have an order, so `o.order_id` is never NULL. Query (c) returns 6 rows: with `status` in the `ON` condition, the customer whose only order was canceled also has no match, so it answers "who has no completed order?".

   *Why:* a left join keeps unmatched rows with NULL on the right side, and a condition in `ON` decides what counts as a match.

   Missed it? Study [*LEFT JOIN and finding rows with no match*](/sql/left-join-anti-join/) (S21).

   </details>

8. `orders` has 1,800 rows, `order_items` has 3,287 rows, and every order has at least one line. What does this query return? Does it count orders? How do you count orders?

   ```sql
   SELECT COUNT(*)
   FROM orders o
   JOIN order_items i ON i.order_id = o.order_id;
   ```

   <details>
   <summary>Answer</summary>

   3,287. It does not count orders: each order appears once for each of its lines, so the query counts lines. `COUNT(DISTINCT o.order_id)` gives 1,800. Any total taken from `orders` in this query would be inflated in the same way.

   *Why:* a join keeps one row for every pair of rows with the same key, and the key repeats on the many side.

   Missed it? Study [*Join fan-out: aggregate before you join*](/sql/join-fanout/) (S22).

   </details>

### Placement test, part 2

This part covers S24, S25, S27, S29, S33, S34, S36 and S38.

<div hidden data-placement-test="sql-2" data-covers="S24 S25 S27 S29 S33 S34 S36 S38"></div>

- **All eight right:** if part 1 was all right too, you can skip this stage. Go to the first Python lesson, [*From a query to your first notebook*](/python/first-notebook/) (P1). The 23 lessons that are not tested are listed above the first part.
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order.

1. One order, 1335, is a walk-in sale at store 1 with an empty `customer_id` (NULL). How many rows does each of these queries return?

   ```sql
   -- A
   SELECT customer_id FROM customers
   WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE store_id = 1);

   -- B
   SELECT customer_id FROM customers
   WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE store_id = 3);

   -- C
   SELECT c.customer_id FROM customers c
   WHERE NOT EXISTS (
     SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.store_id = 1
   );
   ```

   <details>
   <summary>Answer</summary>

   A returns 0 rows, B returns 60 and C returns 42. The list that A builds from store 1 contains a NULL (the walk-in order). For a customer that is not in the list, `NOT IN` then gives unknown, not true, so `WHERE` drops every row. The list of B has no NULL, so it works: 60 customers never ordered at store 3. C asks the same question as A with `NOT EXISTS`, which a NULL does not upset: 42 customers never ordered at store 1.

   *Why:* `NOT IN` against a list that holds a NULL never gives true. Use `NOT EXISTS`, or leave the NULLs out of the list.

   Missed it? Study [*Subqueries and EXISTS*](/sql/subqueries/) (S24).

   </details>

2. In April 2026, 112 different customers placed 349 orders. In May, 124 different customers placed 380 orders. 108 customers ordered in both months, and every one of these orders has a customer. Query A is `SELECT customer_id` over the April orders, and query B is the same over the May orders. How many rows does each of these return? (a) `A UNION ALL B` (b) `A UNION B` (c) `A EXCEPT B`

   <details>
   <summary>Answer</summary>

   (a) 729: 349 + 380, every row kept. (b) 128: `UNION` removes repeats, so each customer counts once: 112 + 124 − 108. (c) 4: the customers of April that are not in May, 112 − 108.

   *Why:* `UNION ALL` stacks the rows as they are; `UNION`, `INTERSECT` and `EXCEPT` work on sets and remove repeats, and `EXCEPT` keeps what is in the first list and not in the second.

   Missed it? Study [*Comparing sets: UNION, INTERSECT, EXCEPT*](/sql/set-operations/) (S25).

   </details>

3. A retention table groups customers by the month they signed up. In this question, a customer is active in a month when they have at least one completed order in that calendar month. The February 2026 cohort has 11 customers. In February 6 of them were active, and in March 9 of them were active. The data ends on June 30. (a) What is the retention of the February cohort in March? (b) What do you show for July?

   <details>
   <summary>Answer</summary>

   (a) 9 ÷ 11 = 81.8 percent. The denominator is the size of the cohort, 11, not the 6 who were active in February. (b) Nothing: leave the cell empty. July was never observed, and 0 percent would claim that nobody came.

   *Why:* a retention percentage divides by everyone who signed up in the month, and a month the data does not cover has no value.

   Missed it? Study [*Cohorts and retention*](/sql/cohort-retention/) (S27).

   </details>

4. This view is created, and then the first query is run. It returns 1,799. After that, the order 1001 is changed to canceled, and the same query runs again. What does the second run return? Does anyone have to refresh the view?

   ```sql
   CREATE VIEW completed_orders AS
   SELECT * FROM orders WHERE status = 'completed';

   SELECT COUNT(*) FROM completed_orders;

   UPDATE orders SET status = 'canceled' WHERE order_id = 1001;

   SELECT COUNT(*) FROM completed_orders;
   ```

   <details>
   <summary>Answer</summary>

   1,798, and no refresh is needed. A view holds no rows. It is a saved query, and the database runs it again, on the table as it is now, each time you ask for it.

   *Why:* a view saves the question, not the answer.

   Missed it? Study [*Saving a query as a view*](/sql/views/) (S29).

   </details>

5. This table is created. `orders` has a primary key `order_id`, and there is no order 9999. The five inserts run one after the other, and each is its own statement. Which are rejected, and which constraint rejects each one?

   ```sql
   CREATE TABLE refunds (
     refund_id  INTEGER PRIMARY KEY,
     order_id   INTEGER NOT NULL REFERENCES orders(order_id),
     amount_usd DECIMAL(6, 2) CHECK (amount_usd > 0)
   );

   INSERT INTO refunds VALUES (1, 1001, 5.00);   -- first, it works
   INSERT INTO refunds VALUES (1, 1002, 2.00);   -- (a)
   INSERT INTO refunds VALUES (2, 9999, 1.00);   -- (b)
   INSERT INTO refunds VALUES (3, 1003, -1.00);  -- (c)
   INSERT INTO refunds VALUES (4, NULL, 1.00);   -- (d)
   INSERT INTO refunds VALUES (5, 1001, 2.50);   -- (e)
   ```

   <details>
   <summary>Answer</summary>

   (a) to (d) are rejected. (a) breaks the primary key: refund 1 exists. (b) breaks the foreign key: order 9999 does not exist. (c) breaks the `CHECK`: the amount is not above 0. (d) breaks `NOT NULL`: the refund has no order. (e) works: the same order may have a second refund, because `order_id` is not unique here.

   *Why:* each constraint is a rule the database checks on every insert, so a bad row never gets in.

   Missed it? Study [*Creating tables and constraints*](/sql/create-table-constraints/) (S33).

   </details>

6. 1,799 of the 1,800 orders are completed, and all 355 orders of Harbor (store 3) are among them. What do the two `SELECT` statements return? If `COMMIT` stood where `ROLLBACK` stands, what would the second one return?

   ```sql
   BEGIN;
   UPDATE orders SET status = 'canceled' WHERE store_id = 3;
   SELECT COUNT(*) FROM orders WHERE status = 'completed';  -- first
   ROLLBACK;
   SELECT COUNT(*) FROM orders WHERE status = 'completed';  -- second
   ```

   <details>
   <summary>Answer</summary>

   The first returns 1,444 (1,799 − 355): inside the transaction you see your own change. The second returns 1,799: `ROLLBACK` undid the update. With `COMMIT`, the change would be kept, and the second would return 1,444 too.

   *Why:* a transaction groups changes so that they all happen or none does, and `ROLLBACK` is how you take it back.

   Missed it? Study [*Inserting, updating and deleting safely*](/sql/modify-data-transactions/) (S34).

   </details>

7. A table `order_lines_wide` has one row for each of the 3,287 order lines, and it repeats the store's name and city on every row. Harbor (store 3) has 645 lines. Harbor moves to a new city. How many rows do you have to change in this table? What goes wrong if one update misses some of them? How many rows would change if the store details lived in their own `stores` table?

   <details>
   <summary>Answer</summary>

   645 rows. If some are missed, the table gives two cities for one store, and any report by city is wrong (an update anomaly). In a `stores` table there is one row for Harbor, so 1 row changes, and every line finds the new city through its `store_id`.

   *Why:* keep each fact in one place, and there is only one place to change.

   Missed it? Study [*Normalization: one fact in one place*](/sql/normalization/) (S36).

   </details>

8. In DuckDB, the only index on a copy of `orders` is on `order_id`. For each filter, what does `EXPLAIN ANALYZE` show: `Index Scan` or `Sequential Scan`, and how many rows come back? (a) `WHERE order_id = 1005` (b) `WHERE store_id = 3` (c) `WHERE CAST(order_id AS VARCHAR) LIKE '%05'`

   <details>
   <summary>Answer</summary>

   (a) `Index Scan`, 1 row: the filter is the indexed column, written plainly. (b) `Sequential Scan`, 355 rows: nothing is indexed on `store_id`. (c) `Sequential Scan`, 18 rows: the column is wrapped in a function, so the sorted list of `order_id` values cannot be used. An index changes how rows are found, never which rows come back.

   *Why:* an index helps a filter on exactly the indexed column.

   Missed it? Study [*Indexes and reading a query plan*](/sql/indexes-and-explain/) (S38).

   </details>
