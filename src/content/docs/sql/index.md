---
title: "SQL: all lessons"
description: Every SQL lesson in the order to study them, with your done ticks, and a placement test to find where to start.
---

## Placement test

Do you already write SQL? Try these eight questions to see where to start. Do not look anything up, and do not run the queries: the numbers come from the cafe-sales tables (1,800 orders, 3,287 order lines, 150 customers, 16 products), and the answers say what they are. Each answer is in the box under its question.

- **All eight right:** you can skip this stage. Go to the first Python lesson, [*From a query to your first notebook*](/python/first-notebook/) (P1).
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order.

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
