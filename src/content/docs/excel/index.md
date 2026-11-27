---
title: "Excel / Sheets: all lessons"
description: Every Excel and Google Sheets lesson in the order to study them, with your done ticks, and a placement test to find where to start.
---

## Placement test

Do you already use Excel or Google Sheets? Try these seven questions to see where to start. Do not look anything up. Each answer is in the box under its question. The numbers come from the cafe-sales data, unless the question says they are made up.

- **All seven right:** you can skip this stage. Go to the first SQL lesson, [*From a spreadsheet to SQL: your first queries*](/sql/from-spreadsheet-to-sql/) (S1).
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order.

1. A sheet lists the orders like this. The store name is typed once in a merged cell above each block of orders. One blank row separates the blocks. Order 1001 has `Croissant, Cold Brew` typed in one cell. You want to filter by store and count the croissants sold. What goes wrong, and how should the sheet look instead?

   <details>
   <summary>Answer</summary>

   A merged cell keeps its value in only one row, so most rows have no store to filter on. A blank row ends the range that sort, filter and PivotTable pick up. Two products in one cell cannot be counted one by one. Instead: one header row, one row for each order line, and the store and the product in their own cells on every row, with no blank rows.

   *Why:* every tool treats a row as one record and a column as one fact.

   Missed it? Study [*Rows, columns and tidy layout*](/excel/grid-and-tidy-layout/) (E1).

   </details>

2. The formula in cell B2 is `=A2*$D1`. You copy it to cell C3, one column to the right and one row down. What does C3 contain? The numbers are made up.

   <details>
   <summary>Answer</summary>

   `=B3*$D2`. The `A2` has no dollar signs, so it moves one column and one row: it becomes `B3`. In `$D1` the dollar sign locks the column, so `D` stays, and the row has no lock, so `1` becomes `2`.

   *Why:* a dollar sign before a letter locks the column, and a dollar sign before a number locks the row.

   Missed it? Study [*Relative and absolute references*](/excel/cell-references/) (E3).

   </details>

3. You import prices from a CSV file. The cells C2:C4 show 3.25, 4.50 and 5.00, aligned to the left. The formula `=SUM(C2:C4)` shows 0. What is wrong, and which formula proves it? What does that formula show?

   <details>
   <summary>Answer</summary>

   The three cells hold text that only looks like numbers, and `SUM` skips text. `=ISNUMBER(C2)` shows `FALSE`. Convert the text to real numbers first, for example in a new column with `=VALUE(C2)`.

   *Why:* a cell can show a number and still be text; the formula bar and `ISNUMBER` tell the truth.

   Missed it? Study [*Numbers are not numbers until you check*](/excel/numbers-dates-text-types/) (E4).

   </details>

4. The six rows below are the first six lines of the practice data. They are in rows 2 to 7 of a sheet, in columns A to F. What does this formula return?

   `=SUMIFS(F2:F7, B2:B7, "Campus", C2:C7, "coffee")`

   | order_id | store_name | category | product_name | quantity | line_amount_usd |
   |---|---|---|---|---:|---:|
   | 1001 | Campus | bakery | Croissant | 1 | 3.25 |
   | 1001 | Campus | coffee | Cold Brew | 1 | 4.75 |
   | 1001 | Campus | coffee | Espresso | 2 | 6.00 |
   | 1002 | Old Town | bakery | Croissant | 1 | 3.25 |
   | 1002 | Old Town | food | Turkey Sandwich | 1 | 9.25 |
   | 1003 | Campus | coffee | Cold Brew | 2 | 9.50 |

   <details>
   <summary>Answer</summary>

   20.25. Three lines are from Campus and are coffee: 4.75 + 6.00 + 9.50.

   *Why:* `SUMIFS` takes the range to add first, then pairs of a range and its condition; a row is added only when every pair is true.

   Missed it? Study [*Conditional totals with SUMIFS and COUNTIFS*](/excel/conditional-totals/) (E7).

   </details>

5. The products sheet has 16 products in A2:D17, sorted by `product_id` from 1 to 16. The last rows are 14 Avocado Toast 8.50, 15 Turkey Sandwich 9.25 and 16 Pumpkin Spice Latte 5.50. By mistake, an order line has the product id 17. What does `=VLOOKUP(17, A2:D17, 4)` return? Why is that a problem, and what is the fix?

   <details>
   <summary>Answer</summary>

   It returns 5.50, the price of product 16, and shows no error. The last argument is missing, so `VLOOKUP` makes an approximate match: it takes the last id that is not above 17. Add `FALSE` as the last argument: `=VLOOKUP(17, A2:D17, 4, FALSE)` then shows `#N/A`, which tells you the id is not on the menu.

   *Why:* an approximate match is "the closest row that does not go over", not "find it or fail".

   Missed it? Study [*Reading VLOOKUP and INDEX with MATCH*](/excel/legacy-lookups/) (E9).

   </details>

6. Harbor opened on 2026-04-01, and the data ends on 2026-06-30. These two real dates are in A2 and B2. (a) What does `=B2-A2` show? (b) What does `=A2+30` show, with the cell formatted as a date?

   <details>
   <summary>Answer</summary>

   (a) 90, a number of days. (b) 2026-05-01.

   *Why:* a date is a whole number of days with a date format on top, so subtracting counts days and adding moves the date.

   Missed it? Study [*Dates as numbers*](/excel/date-functions/) (E11).

   </details>

7. A PivotTable counts the orders of each store: Old Town 729, Campus 716, Harbor 355, 1,800 in all. (a) You show the values as a percent of the grand total. What does Old Town show? (b) Now you put the payment method in the columns and show the values as a percent of the column total. What do the three store cells in the card column add up to?

   <details>
   <summary>Answer</summary>

   (a) 40.5 percent: 729 divided by 1,800. (b) 100 percent: each cell is divided by the total of its own column.

   *Why:* the "percent of" options differ only in the number they divide by, so say which one you used.

   Missed it? Study [*Grouping and share of total in pivots*](/excel/pivot-grouping-and-share/) (E16).

   </details>
