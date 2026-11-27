---
title: "Python: all lessons"
description: Every Python lesson in the order to study them, with your done ticks, and a placement test to find where to start.
---

## Placement test

Do you already write Python with pandas? Try these eight questions to see where to start. Do not look anything up, and do not run the code: say what you think it does. Each answer is in the box under its question. Where a question names `orders`, `customers` or `order_items`, it means the cafe-sales table of that name, read with `pd.read_csv` (1,800 orders, 3,287 order lines, 150 customers).

- **All eight right:** you can skip this stage. Go to the first lesson of the advanced core, [*Data types, units and how data was collected*](/core/study-design-and-data-types/) (C1).
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order.

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
