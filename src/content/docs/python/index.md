---
title: "Python: all lessons"
description: Every Python lesson in the order to study them, with your done ticks, and a two-part placement test to find where to start.
---

## Placement test

Do you already write Python with pandas? The placement test has two parts of eight questions each, to see where to start. Do not look anything up, and do not run the code: say what you think it does. Each answer is in the box under its question. Where a question names `orders`, `customers` or `order_items`, it means the cafe-sales table of that name, read with `pd.read_csv` (1,800 orders, 3,287 order lines, 150 customers).

Together the two parts test 16 of the 28 lessons. **Not tested in either part:** P1, P3, P4, P8, P9, P11, P18, P21 to P22b, P25 and P26. Passing does not skip those 12. The tested lessons use some of them (reading a table, printing, a first look at a DataFrame), but nothing checks them one by one. When you are done, open each one, read its closing line (*The pattern to remember*), and study the lesson if it is new to you.

<div hidden data-placement-stage="python" data-not-tested="P1 P3 P4 P8 P9 P11 P18 P21 P22a P22b P25 P26"></div>

### Placement test, part 1

This part covers P2, P5, P6, P7, P12, P14, P15 and P16.

<div hidden data-placement-test="python-1" data-covers="P2 P5 P6 P7 P12 P14 P15 P16"></div>

- **All eight right:** go on to [part 2](#placement-test-part-2).
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order. You will meet the lessons of part 2 on the way.

1. What do the last two lines print?

   ```python
   price = "3.25"
   qty = 2
   print(price * qty)
   print(price + qty)
   ```

   <details>
   <summary>Answer</summary>

   The first prints `3.253.25`: times on text repeats the text. The second stops with a `TypeError`, because Python does not add text and a number. Convert first: `float(price) * qty` is `6.5`.

   *Why:* Python never turns text into a number for you.

   Missed it? Study [*Values, variables and types*](/python/values-and-types/) (P2).

   </details>

2. What does this print?

   ```python
   prices = [3.00, 3.50, 4.50, 4.50]
   print([p - 1 for p in prices if p >= 3.5])
   ```

   <details>
   <summary>Answer</summary>

   `[2.5, 3.5, 3.5]`. The `if` keeps 3.50, 4.50 and 4.50 and drops 3.00. Then each kept price has 1 taken off. Python prints a float without a trailing zero.

   *Why:* a comprehension reads as "this expression, for each item, if the test is true".

   Missed it? Study [*Lists, loops and one-line comprehensions*](/python/lists-and-loops/) (P5).

   </details>

3. What do the last two lines do?

   ```python
   price = {"Espresso": 3.00, "Latte": 4.50}
   print(price.get("Mocha", 0))
   print(price["Mocha"])
   ```

   <details>
   <summary>Answer</summary>

   The first prints `0`: `get` returns the default you give when the key is missing. The second stops with `KeyError: 'Mocha'`: the square brackets have no default.

   *Why:* use `get` when a missing key is normal, and square brackets when it would be a bug.

   Missed it? Study [*Dictionaries, and a glance at sets*](/python/dicts-and-sets/) (P6).

   </details>

4. What does this code print?

   ```python
   def line_total(price, qty):
       print(price * qty)

   x = line_total(4.5, 2)
   print(x + 1)
   ```

   <details>
   <summary>Answer</summary>

   It prints `9.0`, then stops with a `TypeError`. The function only prints; it returns nothing, so `x` is `None`, and `None + 1` fails. Change `print(price * qty)` to `return price * qty`.

   *Why:* `print` shows a value on the screen; `return` hands it to the code that called the function.

   Missed it? Study [*Functions and imports*](/python/functions-and-modules/) (P7).

   </details>

5. This line should keep the completed orders of store 1, but it stops with an error. Why? Write it correctly, and say what `.shape` of the result shows, if store 1 took 729 completed orders. The table has 6 columns.

   ```python
   rows = orders[orders.status == "completed" & orders.store_id == 1]
   ```

   <details>
   <summary>Answer</summary>

   Python applies `&` before `==`, so it tries to combine the text `"completed"` with a column of numbers. Put each condition in its own parentheses:

   ```python
   rows = orders[(orders.status == "completed") & (orders.store_id == 1)]
   ```

   `rows.shape` is `(729, 6)`.

   *Why:* `&` binds tighter than a comparison, so every condition needs parentheses.

   Missed it? Study [*Selecting and filtering rows and columns*](/python/pandas-select-and-filter/) (P12).

   </details>

6. `orders.groupby("store_id").size()` prints 729, 716 and 355 for stores 1, 2 and 3. One order, in store 1, is a walk-in sale with an empty `customer_id`. What does `orders.groupby("store_id")["customer_id"].count()` print?

   <details>
   <summary>Answer</summary>

   728, 716 and 355. `count` skips missing values, so the walk-in order is not counted in store 1. `size` counts rows.

   *Why:* `size` is the number of rows in the group; `count` is the number of values that are not missing in one column.

   Missed it? Study [*Grouping and aggregating*](/python/pandas-groupby-aggregate/) (P14).

   </details>

7. The `customers` table has 150 rows. Five customers never ordered, and one order is a walk-in sale with no customer, so 1,799 orders have a customer. Before you run the code, how many rows does each merge return?

   ```python
   inner = customers.merge(orders, on="customer_id", how="inner")
   left = customers.merge(orders, on="customer_id", how="left")
   ```

   <details>
   <summary>Answer</summary>

   `inner` has 1,799 rows: one for each pair of a customer and an order. `left` has 1,804 rows: the same 1,799 pairs plus one row for each of the five customers with no order, which get empty order columns. The walk-in order is in neither, because the left table is `customers`.

   *Why:* a merge keeps one row per matching pair, and a left merge adds the unmatched rows of the left table.

   Missed it? Study [*Merging tables safely*](/python/pandas-merge-and-validate/) (P15).

   </details>

8. `orders.csv` holds whole-number customer ids and one empty field. After `orders = pd.read_csv("orders.csv")`, the ids print as `15.0` and `orders.customer_id.dtype` is `float64`. Why? How do you read the column so that the ids stay whole numbers?

   <details>
   <summary>Answer</summary>

   A missing value in a number column is stored as `NaN`, which is a float, so pandas makes the whole column float. Read the column with a type that allows gaps: `pd.read_csv("orders.csv", dtype={"customer_id": "Int64"})`. Write `Int64` with a capital I.

   *Why:* the type of a column is decided by every value in it, gaps included.

   Missed it? Study [*Missing values, types and duplicates*](/python/pandas-missing-data-and-types/) (P16).

   </details>

### Placement test, part 2

This part covers P10, P13, P17, P19, P20, P23, P24 and P27.

<div hidden data-placement-test="python-2" data-covers="P10 P13 P17 P19 P20 P23 P24 P27"></div>

- **All eight right:** if part 1 was all right too, go on to the first lesson of the advanced core, [*Data types, units and how data was collected*](/core/study-design-and-data-types/) (C1). Before you rely on the lessons that are not tested (listed above part 1), skim each one, and study it if it is new to you.
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order.

1. What do the three `print` lines show? The numbers are the first six line amounts of the practice data.

   ```python
   import numpy as np

   amounts = np.array([3.25, 4.75, 6.00, 3.25, 9.25, 9.50])
   print((amounts > 5).sum())
   print(amounts[amounts > 5])
   print(np.where(amounts > 5, amounts - 1, amounts))
   ```

   <details>
   <summary>Answer</summary>

   `3`, then `[6.   9.25 9.5 ]`, then `[3.25 4.75 5.   3.25 8.25 8.5 ]`. The comparison `amounts > 5` gives one True or False for each number. `sum` counts the True values as 1 each. Indexing with that mask keeps the numbers where it is True. `np.where` picks `amounts - 1` where it is True and the original number where it is False.

   *Why:* a comparison on an array works on every element at once, and the mask it gives can count, filter or choose.

   Missed it? Study [*Arrays and vectorized math with NumPy*](/python/numpy-vectorization/) (P10).

   </details>

2. The table `orders` has 1,800 rows. Of them, 1,001 were paid by card, 253 in cash and 546 by mobile. What happens to the 546 mobile orders here? Does Python stop with an error? What does the last line print?

   ```python
   code = orders.payment_method.map({"card": "C", "cash": "K"})
   print(code.isna().sum())
   ```

   <details>
   <summary>Answer</summary>

   There is no error. `map` gives a missing value (`NaN`) for a key that the dictionary does not have, so the line prints `546`. Cover every value in the dictionary, and check the count of missing values afterwards.

   *Why:* `map` never says that a key was unknown; it leaves a gap.

   Missed it? Study [*New columns from old: assign, map and apply*](/python/pandas-derived-columns/) (P13).

   </details>

3. `ordered_at` of `orders` was converted with `pd.to_datetime`. Customer 86 has 10 orders: one in January, four in April, one in May and four in June, none in February or March. The table `c86` holds these 10 rows. How many rows does the code below return, and what does it show for February? What would the mean of a number column show for February?

   ```python
   c86.set_index("ordered_at").resample("MS").size()
   ```

   <details>
   <summary>Answer</summary>

   6 rows, one for each month from January to June. February shows `0`, and so does March: `resample` makes a row for every month in the range, and `size` counts the rows in a month, so an empty month is 0. The mean of a number column would show `NaN` for those months, because there is nothing to average.

   *Why:* a resample covers the whole range of dates, and each summary decides what an empty month means.

   Missed it? Study [*Dates and periods in pandas*](/python/pandas-dates-and-resample/) (P17).

   </details>

4. The first line stops with an error. The second runs, but the cell for store 1 and card shows 1812.1, and not 421, the number of orders of store 1 paid by card. Why does each happen? What do you change in the second line?

   ```python
   orders.pivot(index="store_id", columns="payment_method", values="order_id")
   orders.pivot_table(index="store_id", columns="payment_method", values="order_id")
   ```

   <details>
   <summary>Answer</summary>

   `pivot` only moves values into place, and it needs one value for each cell. Store 1 and card have 421 orders, so pandas raises `ValueError: Index contains duplicate entries`. `pivot_table` combines many values into one, and with no `aggfunc` it takes the mean, here the average `order_id`, which means nothing. Add `aggfunc="count"` to get 421.

   *Why:* `pivot` arranges, `pivot_table` aggregates, and you must say how.

   Missed it? Study [*Reshaping: wide to long and back*](/python/pandas-reshape-wide-long/) (P19).

   </details>

5. `lines` has one row for each of the 3,287 order lines. Order 1001 has three lines, of 3.25, 4.75 and 6.00. (a) What does `order_total` hold on those three lines? (b) How many rows does `lines` have after the first line? (c) Why is `lines["order_total"].sum()` not the revenue of all orders?

   ```python
   lines["order_total"] = lines.groupby("order_id")["line_amount_usd"].transform("sum")
   ```

   <details>
   <summary>Answer</summary>

   (a) 14.00 on each of the three lines. (b) Still 3,287: `transform` gives one value for every row, where `sum` alone would give 1,800 rows, one for each order. (c) Each order's total is repeated once for each of its lines, so the column adds an order as many times as it has lines: 48,443.50, against 22,754.25 for all the lines.

   *Why:* `transform` adds a group's number to every row of the group, and it is for comparing a row with its group, not for adding up.

   Missed it? Study [*Group-aware columns: transform, rank and rolling*](/python/pandas-transform-rank-rolling/) (P20).

   </details>

6. `con` is a connection to a SQLite database that holds the 1,800 orders. What does each call return as `n`? What is wrong with the first one?

   ```python
   status = "x' OR '1'='1"
   q1 = f"SELECT COUNT(*) AS n FROM orders WHERE status = '{status}'"
   q2 = "SELECT COUNT(*) AS n FROM orders WHERE status = ?"

   pd.read_sql(q1, con)
   pd.read_sql(q2, con, params=[status])
   ```

   <details>
   <summary>Answer</summary>

   The first returns 1,800. Pasting the text into the query turns it into `WHERE status = 'x' OR '1'='1'`, which is true for every row: the value changed the logic of the query. The second returns 0: the value travels apart from the query and is read as one text, and no order has that status.

   *Why:* never build a query by pasting a value into its text; pass it as a parameter.

   Missed it? Study [*Data from an API and from a database*](/python/apis-and-web-data/) (P23).

   </details>

7. In a terminal you run `pip install tabulate`, and it ends with "Successfully installed". In your notebook, `import tabulate` still fails with `ModuleNotFoundError`. What is the most likely reason, and what do you do? This situation is made up.

   <details>
   <summary>Answer</summary>

   The `pip` of the terminal belongs to another Python than the one that runs your notebook, so the package went to the wrong place. Install it from inside the notebook with `%pip install tabulate`, which uses the notebook's own Python. `import sys; print(sys.executable)` shows which Python a notebook runs.

   *Why:* a package is installed into one particular Python, so name the Python you mean.

   Missed it? Study [*Your own Python setup: environments and pip*](/python/environments-and-pip/) (P24).

   </details>

8. An assistant wrote this function to return the latest order of each customer. `orders.csv` lists the orders in the order they were placed. On the real data it runs without an error and returns 146 rows, while 145 different customers have ordered. Name two things that are wrong. How would a tiny table with a known answer have shown them?

   ```python
   def latest_orders(orders):
       """Return the latest order of each customer."""
       return orders.drop_duplicates("customer_id")
   ```

   <details>
   <summary>Answer</summary>

   (1) `drop_duplicates` keeps the first row of each customer by default, so the function returns each customer's first order, not the latest: for customer 15 it returns order 1001, and the latest is 2191. (2) The walk-in order has an empty `customer_id`, and the function treats the empty value as one more customer: 145 + 1 = 146. A fix is `orders.dropna(subset=["customer_id"]).drop_duplicates("customer_id", keep="last")`. A tiny table with customer 7 on Jan 1 and Jan 9, customer 8 on Jan 5, and one order with no customer, has the answer 2 rows (Jan 9 and Jan 5), worked out by hand, and the function would not give it.

   *Why:* a clean run shows only that the code runs; the answer on a table you worked out yourself shows whether it is right.

   Missed it? Study [*Using an AI assistant for Python, with checks*](/python/ai-assisted-code/) (P27).

   </details>
