/**
 * "SQL in a nutshell" (SPEC D44, `/sql/cheatsheet/`): one printable page for the SQL stage, in the three parts of D40.
 * Every entry is distilled from a published lesson in `src/content/docs/sql/` (its big idea, its "Common trap" and
 * its Check yourself), uses that lesson's cafe-sales tables and column names, and links back to it. Nothing is added
 * that a lesson does not teach. `scripts/check-cheatsheet-sql.py` runs every pattern in DuckDB against the five tables
 * (the practice tables that a lesson creates are set up there, copied from the lesson).
 */
import type { Cheatsheet } from '../../lib/cheatsheet.ts';

export const sqlCheatsheet: Cheatsheet = {
	stage: 'sql',
	title: 'SQL in a nutshell',
	description: 'One page of SQL patterns from the SQL stage, each with what it does, its most common trap and its lesson. Prints on two sheets.',
	intro:
		'Every pattern below runs on the five cafe-sales tables and comes from a lesson of the SQL stage. Each card names its lesson (S8); open it to learn the idea behind the pattern. The page prints on one A4 sheet, both sides, black on white.',
	foot: 'From the free SQL stage of datafromzero, datafromzero.github.io/sql/ (content CC BY 4.0). Every pattern runs on the five cafe-sales practice tables.',
	parts: [
		{
			id: 'one-table',
			title: 'Analysis on one table',
			codes: 'S1–S17',
			items: [
				{
					lesson: 'from-spreadsheet-to-sql',
					code: `SELECT product_name FROM products
WHERE category = 'tea'
ORDER BY product_name;`,
					does: 'Read a query as a sentence: these columns, from this table, these rows, in this order.',
					trap: 'Text goes in single quotes, or SQL reads tea as a column name and stops.',
				},
				{
					lesson: 'select-sort-limit',
					code: `SELECT product_name,
       unit_price_usd AS price
FROM products
ORDER BY unit_price_usd DESC, product_name
LIMIT 3;`,
					does: 'Choose and rename columns, sort with a tie-breaker, then keep the first rows.',
					trap: 'ORDER BY alone sorts lowest first (a top 3 needs DESC); LIMIT cuts the sorted list.',
				},
				{
					lesson: 'where-filtering',
					code: `SELECT order_id, payment_method
FROM orders
WHERE payment_method IN ('card', 'cash')
  AND store_id <> 3;`,
					does: 'Keep rows where the test is true; wrap every OR that sits with an AND in parentheses.',
					trap: "payment_method = 'card' OR 'cash' is an error: test both sides, or use IN.",
				},
				{
					lesson: 'where-filtering',
					code: `SELECT COUNT(*) AS orders
FROM orders
WHERE ordered_at >= '2026-06-01'
  AND ordered_at < '2026-07-01';`,
					does: 'A date range starts on the first day and stops before the next one.',
					trap: "BETWEEN ... AND '2026-06-30' ends at midnight and misses all of June 30.",
				},
				{
					lesson: 'null-handling',
					code: `SELECT COUNT(*) FROM customers
WHERE referred_by IS NOT NULL;
SELECT customer_id,
  COALESCE(referred_by, 0) AS referrer_id
FROM customers;`,
					does: 'NULL means unknown: test it with IS NULL, and fill it with COALESCE(x, default).',
					trap: '= NULL is never true; a default of 0 is safe only if no real id is 0.',
				},
				{
					lesson: 'expressions-and-types',
					code: `SELECT CAST(unit_price_usd * 0.80
         AS DECIMAL(6,2)) AS happy_price_usd
FROM products;
SELECT 7 / 2, 7 // 2;
DESCRIBE products;`,
					does: 'An expression is worked out per row; use DECIMAL for money, and / gives 3.5 but // gives 3.',
					trap: 'DOUBLE is an approximation: 0.1 + 0.2 = 0.3 is false for DOUBLE, true for DECIMAL.',
				},
				{
					lesson: 'case-expressions',
					code: `SELECT product_name,
  CASE WHEN unit_price_usd >= 4.50
         THEN 'premium'
       WHEN unit_price_usd >= 3.50
         THEN 'standard'
       ELSE 'budget' END AS price_tier
FROM products;`,
					does: 'CASE tries the tests from the top; the first true WHEN decides the label.',
					trap: 'No ELSE gives NULL; CASE labels rows but never removes them (WHERE does).',
				},
				{
					lesson: 'aggregate-functions',
					code: `SELECT COUNT(*) AS all_rows,
       COUNT(referred_by) AS referred,
       COUNT(DISTINCT city) AS cities
FROM customers;`,
					does: 'An aggregate folds many rows into one value and skips NULL; only COUNT(*) counts rows.',
					trap: "COUNT(col) is Excel's COUNTA, not COUNT; SUM over no rows is NULL.",
				},
				{
					lesson: 'group-by-having',
					code: `SELECT store_id, COUNT(*) AS orders
FROM orders
WHERE status = 'completed'
GROUP BY store_id
HAVING COUNT(*) > 500
ORDER BY store_id;`,
					does: 'WHERE filters rows before the groups exist; HAVING filters the groups after the count.',
					trap: 'HAVING is not a second WHERE: WHERE MAX(order_id) > 1500 fails, no maximum exists yet.',
				},
				{
					lesson: 'conditional-aggregation',
					code: `SELECT store_id,
  COUNT(*) AS orders,
  SUM(CASE WHEN payment_method = 'card'
           THEN 1 ELSE 0 END) AS card_orders
FROM orders
GROUP BY store_id;`,
					does: 'A CASE inside an aggregate fills one column per metric in a single pass.',
					trap: 'It does not filter: every row still goes in. Divide with NULLIF(x, 0).',
				},
				{
					lesson: 'text-functions',
					code: `SELECT COUNT(*)
FROM customers
WHERE LOWER(TRIM(city)) = 'berkeley';`,
					does: 'Clean into a new column, then compare on the key: TRIM, LOWER, REPLACE, SUBSTRING, SPLIT_PART.',
					trap: "TRIM cleans only the ends: TRIM('  iced  tea  ') keeps the double space inside.",
				},
				{
					lesson: 'dates-and-time',
					code: `SELECT CAST(DATE_TRUNC('month', ordered_at)
         AS DATE) AS month,
       COUNT(*) AS orders
FROM orders
GROUP BY month
ORDER BY month;`,
					does: 'Cut each timestamp down to the start of its period, then group by it.',
					trap: 'date_trunc cuts down, never rounds: 16:30 on June 30 is still June 1.',
				},
				{
					lesson: 'query-execution-order',
					code: `SELECT product_name
FROM products
ORDER BY product_name
LIMIT 2;`,
					does: 'Clauses run in a fixed order, not the written one: rows are chosen before columns.',
					trap: 'LIMIT cuts the sorted list: this gives Americano and Avocado Toast, not the first two stored rows.',
				},
				{ figure: 'order', lesson: 'query-execution-order' },
				{
					lesson: 'ctes',
					code: `WITH daily AS (
  SELECT CAST(ordered_at AS DATE) AS day,
         COUNT(*) AS orders
  FROM orders
  GROUP BY day)
SELECT * FROM daily
ORDER BY orders DESC
LIMIT 5;`,
					does: 'WITH names a step so the next step can read it like a table; check each step.',
					trap: 'A CTE lives for one statement; it is not a stored table.',
				},
				{
					lesson: 'window-functions',
					code: `SELECT order_id, store_id,
       COUNT(*) OVER (PARTITION BY store_id)
         AS store_orders
FROM orders;`,
					does: 'A window function keeps every row and adds a value over its group: PARTITION BY, ORDER BY.',
					trap: 'WHERE cannot see a window result: compute it in a CTE, filter in the next step.',
				},
				{ figure: 'window', lesson: 'window-functions' },
				{
					lesson: 'rank-top-n',
					code: `SELECT category, product_name,
  unit_price_usd,
  DENSE_RANK() OVER (
    PARTITION BY category
    ORDER BY unit_price_usd DESC
  ) AS rnk
FROM products
QUALIFY rnk <= 2;`,
					does: 'Number rows inside each group: ROW_NUMBER never ties, RANK leaves gaps, DENSE_RANK does not.',
					trap: 'Ties are normal (Chai Latte and Cold Brew both cost $4.75): state the policy, then filter in QUALIFY.',
				},
				{
					lesson: 'lag-lead-moving-windows',
					code: `WITH daily AS (
  SELECT CAST(ordered_at AS DATE) AS day,
         COUNT(*) AS orders
  FROM orders
  GROUP BY day)
SELECT day, orders,
  LAG(orders) OVER (ORDER BY day)
    AS prev_orders,
  AVG(orders) OVER (ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
    AS avg_7_days
FROM daily;`,
					does: 'LAG reads the row above, LEAD the row below, and ROWS BETWEEN sets a sliding frame.',
					trap: 'LAG gives NULL on the first row; a 7-row frame is a 7-day average only while every day has a row.',
				},
				{
					lesson: 'deduplicate-latest-record',
					code: `SELECT update_id, customer_id,
       loyalty_tier, city, updated_at
FROM customer_updates
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY customer_id
  ORDER BY updated_at DESC, update_id DESC
) = 1;`,
					does: 'State which row survives, number the rows of each entity by it, keep number 1.',
					trap: 'A SELECT deletes nothing (DELETE does); DISTINCT merges only identical rows.',
				},
			],
		},
		{
			id: 'joins',
			title: 'Data knowledge and joins',
			codes: 'S18–S30',
			items: [
				{
					lesson: 'relational-model',
					code: `SELECT COUNT(*) AS row_count,
       COUNT(DISTINCT order_id)
         AS distinct_ids
FROM orders;`,
					does: 'Say what one row is (the grain), then prove the key by counting.',
					trap: 'A column named id is not a key by its name: store_id is a key in stores, not in orders.',
				},
				{
					lesson: 'inner-join',
					code: `SELECT i.order_id, p.product_name,
       i.quantity
FROM order_items AS i
INNER JOIN products AS p
  ON p.product_id = i.product_id;`,
					does: 'A join pairs rows that share a key: predict the rows, run it, compare the count.',
					trap: 'A join counts pairs, not keys: order 1001 is one key but 3 lines, so 3 rows.',
				},
				{
					lesson: 'left-join-anti-join',
					code: `SELECT c.customer_id, c.signup_date
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;`,
					does: 'LEFT JOIN keeps every left row; a NULL right key marks the rows with no match.',
					trap: 'NOT IN breaks on a NULL (orders has a NULL customer_id); right-table tests go in ON.',
				},
				{ figure: 'joins', lesson: 'left-join-anti-join' },
				{
					lesson: 'join-fanout',
					code: `WITH order_totals AS (
  SELECT oi.order_id, SUM(oi.quantity *
    p.unit_price_usd - oi.discount_usd)
    AS order_total_usd
  FROM order_items AS oi
  INNER JOIN products AS p
    ON p.product_id = oi.product_id
  GROUP BY oi.order_id)
SELECT o.store_id,
       SUM(t.order_total_usd) AS revenue_usd
FROM orders AS o
INNER JOIN order_totals AS t
  ON t.order_id = o.order_id
GROUP BY o.store_id;`,
					does: 'A join adds rows only on a key that repeats: reduce that side to one row per key first.',
					trap: 'SUM(DISTINCT ...) cannot tell a copy from a coincidence, so it does not fix the sum.',
				},
				{
					lesson: 'self-and-multi-table-joins',
					code: `SELECT c.customer_id AS customer,
       r.customer_id AS referrer
FROM customers AS c
INNER JOIN customers AS r
  ON c.referred_by = r.customer_id;`,
					does: 'Each JOIN adds the columns of the next table; a table joins itself under two aliases.',
					trap: 'After every join, say what one row is and whether the key was unique.',
				},
				{
					lesson: 'subqueries',
					code: `SELECT customer_id, signup_date,
       loyalty_tier
FROM customers
WHERE customer_id IN (
  SELECT customer_id
  FROM orders
  WHERE store_id = 3);`,
					does: 'A subquery hands the outer query a value, a list (IN), a yes or no (EXISTS) or a table.',
					trap: 'Write the inner query alone and check it first.',
				},
				{
					lesson: 'set-operations',
					code: `SELECT customer_id FROM orders
WHERE ordered_at < DATE '2026-04-01'
  AND customer_id IS NOT NULL
INTERSECT
SELECT customer_id FROM orders
WHERE store_id = 3;`,
					does: 'UNION: either, once. UNION ALL: all rows. INTERSECT: both. EXCEPT: first, not second.',
					trap: 'UNION is not a join: it stacks results, and columns match by position.',
				},
				{
					lesson: 'funnels',
					code: `WITH in_window AS (
  SELECT c.customer_id,
         COUNT(o.order_id) AS orders_30d
  FROM customers c
  LEFT JOIN orders o
    ON o.customer_id = c.customer_id
   AND o.status = 'completed'
   AND CAST(o.ordered_at AS DATE)
       - c.signup_date BETWEEN 0 AND 30
  WHERE c.signup_date BETWEEN DATE '2026-01-01'
                          AND DATE '2026-05-31'
  GROUP BY c.customer_id)
SELECT COUNT(*) AS signed_up,
  COUNT(CASE WHEN orders_30d >= 1
             THEN 1 END) AS first_order
FROM in_window;`,
					does: 'Count customers reaching each step in a window all can complete; divide by the step above.',
					trap: 'The unit is the customer, not the order: orders count one person many times.',
				},
				{
					lesson: 'cohort-retention',
					code: `WITH cohorts AS (
  SELECT customer_id,
    CAST(DATE_TRUNC('month', signup_date)
      AS DATE) AS cohort_month
  FROM customers
  WHERE signup_date >= DATE '2026-01-01')
SELECT DISTINCT c.cohort_month, c.customer_id,
  DATE_DIFF('month', c.cohort_month,
    CAST(o.ordered_at AS DATE)) AS months_since
FROM cohorts c
JOIN orders o
  ON o.customer_id = c.customer_id
 AND o.status = 'completed';`,
					does: 'A cohort starts in the same month; retention is its share active again, once per month.',
					trap: 'Retention can rise, and months the data does not cover stay empty, not 0%.',
				},
				{
					lesson: 'recursive-ctes-date-spine',
					code: `WITH RECURSIVE spine(order_day) AS (
  SELECT DATE '2026-01-01'
  UNION ALL
  SELECT order_day + 1 FROM spine
  WHERE order_day < DATE '2026-06-30'),
cash_daily AS (
  SELECT CAST(ordered_at AS DATE) AS order_day,
         COUNT(*) AS cash_orders
  FROM orders
  WHERE payment_method = 'cash'
    AND status = 'completed'
  GROUP BY CAST(ordered_at AS DATE))
SELECT s.order_day,
  COALESCE(c.cash_orders, 0) AS cash_orders
FROM spine AS s
LEFT JOIN cash_daily AS c
  ON c.order_day = s.order_day;`,
					does: 'A recursive CTE builds rows in rounds; a date spine shows days with no orders as zero.',
					trap: 'In the recursive part the name means only the rows of the last round.',
				},
				{
					lesson: 'views',
					code: `CREATE OR REPLACE VIEW sales_lines AS
SELECT o.order_id, o.store_id,
  p.product_name, i.quantity,
  i.quantity * p.unit_price_usd
    - i.discount_usd AS amount_usd
FROM order_items AS i
JOIN orders AS o ON o.order_id = i.order_id
JOIN products AS p
  ON p.product_id = i.product_id
WHERE o.status = 'completed';`,
					does: 'A view is a saved question: name a query once, read the name like a table.',
					trap: 'A view is not a copy: it stores only the query, which runs on every read.',
				},
				{
					lesson: 'star-schema',
					code: `SELECT s.store_name,
       SUM(f.amount_usd) AS sales_usd
FROM fact_sales AS f
JOIN stores AS s ON s.store_id = f.store_id
GROUP BY s.store_name;`,
					does: 'A fact table holds the events you count; dimension tables hold what you slice by.',
					trap: 'A fact table holds dimension keys too, not only numbers; check a total after each join.',
				},
				{
					lesson: 'ai-assisted-queries',
					code: `SELECT COUNT(*) AS orders
FROM orders
WHERE status = 'completed';`,
					does: 'A query from an assistant is a draft: check it by reading, rows, reconciling, a known answer, empty keys.',
					trap: 'A clear explanation is not proof: it is more text from the same source.',
				},
			],
		},
		{
			id: 'database',
			title: 'The database itself',
			codes: 'S31–S35',
			items: [
				{
					lesson: 'create-table-constraints',
					code: `CREATE TABLE menu (
  product_id INTEGER PRIMARY KEY,
  product_name VARCHAR NOT NULL UNIQUE,
  unit_price_usd DECIMAL(6, 2) NOT NULL
    CHECK (unit_price_usd > 0),
  is_active BOOLEAN DEFAULT true);`,
					does: 'A constraint is a rule in the table: PRIMARY KEY, NOT NULL, UNIQUE, CHECK and FOREIGN KEY refuse bad rows; DEFAULT never does.',
					trap: 'It guarantees only the rule you wrote: CHECK (unit_price_usd > 0) accepts 450.00 for a 4.50 latte.',
				},
				{
					lesson: 'modify-data-transactions',
					code: `SELECT * FROM stock
WHERE store_id = 1 AND product_id = 10;
BEGIN;
UPDATE stock
SET units_on_hand = units_on_hand + 24
WHERE store_id = 1 AND product_id = 10;
COMMIT;`,
					does: 'SELECT first, change inside a transaction (all or none), and make a reload safe to repeat.',
					trap: 'ROLLBACK is not a general undo: a statement outside a transaction is already committed.',
				},
				{
					lesson: 'normalization',
					code: `CREATE TABLE n_store (
  store_id INTEGER PRIMARY KEY,
  store_name VARCHAR NOT NULL,
  store_city VARCHAR NOT NULL
);
INSERT INTO n_store
SELECT DISTINCT store_id, store_name,
       store_city
FROM orders_wide;`,
					does: 'Store each fact once, in a table whose key identifies it, then prove the answers did not move.',
					trap: 'Keys repeat (store_id 1 sits on every Old Town order); each fact about the store is stored once.',
				},
				{
					lesson: 'indexes-and-explain',
					code: `CREATE INDEX idx_orders_order_id
  ON orders_ix (order_id);
EXPLAIN ANALYZE
SELECT * FROM orders_ix
WHERE order_id = 1001;`,
					does: 'An index is a sorted shortcut to rows; EXPLAIN ANALYZE shows the plan that actually ran.',
					trap: 'An index does not speed up every query and costs upkeep, so do not index every column.',
				},
				{
					lesson: 'scaling-and-nosql',
					code: `SELECT doc_key,
       doc->>'$.store' AS store
FROM order_docs
ORDER BY doc_key;`,
					does: 'Tables give rules and joins, documents hold one JSON object, key-value looks up by key; partitioning splits by a key.',
					trap: 'NoSQL does not mean no SQL: it relaxes relational rules, and some stores take SQL-like queries.',
				},
			],
		},
	],
};
