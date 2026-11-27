---
title: "Excel / Sheets: all lessons"
description: Every Excel and Google Sheets lesson in the order to study them, with your done ticks, and a two-part placement test to find where to start.
---

## Placement test

Do you already use Excel or Google Sheets? The placement test has two parts, of seven and eight questions, to see where to start. Do not look anything up. Each answer is in the box under its question. The numbers come from the cafe-sales data, unless the question says they are made up.

Together the two parts test 15 of the 22 lessons. **Not tested in either part:** E2, E12, E14, E18 and E20 to E22. Passing does not skip those seven. When you are done, open each one, read its closing line (*The pattern to remember*), and study the lesson if it is new to you.

<div hidden data-placement-stage="excel" data-not-tested="E2 E12 E14 E18 E20 E21 E22"></div>

### Placement test, part 1

This part covers E1, E3, E4, E7, E9, E11 and E16.

<div hidden data-placement-test="excel-1" data-covers="E1 E3 E4 E7 E9 E11 E16"></div>

- **All seven right:** go on to [part 2](#placement-test-part-2).
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order. You will meet the lessons of part 2 on the way.

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

5. The products sheet has 16 products in A2:D17, with the columns `product_id`, `product_name`, `category` and `unit_price_usd`, sorted by `product_id` from 1 to 16. The last rows are 14 Avocado Toast 8.50, 15 Turkey Sandwich 9.25 and 16 Pumpkin Spice Latte 5.50 (id, name and price). By mistake, an order line has the product id 17. What does `=VLOOKUP(17, A2:D17, 4)` return? Why is that a problem, and what is the fix?

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

### Placement test, part 2

This part covers E5, E6, E8, E10, E13, E15, E17 and E19.

<div hidden data-placement-test="excel-2" data-covers="E5 E6 E8 E10 E13 E15 E17 E19"></div>

- **All eight right:** if part 1 was all right too, go on to the first SQL lesson, [*From a spreadsheet to SQL: your first queries*](/sql/from-spreadsheet-to-sql/) (S1). Before you rely on the lessons that are not tested (listed above part 1), skim each one, and study it if it is new to you.
- **One or more wrong:** open the answer of each question you missed. Find the lesson in its "Missed it?" line. Start at the earliest of those lessons (the lowest code), and study the stage from there, in order.

1. Six order lines are in rows 2 to 7 of a sheet, with the store in column B and the line amount in column F. You filter column B to show only Old Town, so the Campus row is hidden. What do `=SUM(F2:F7)` and `=SUBTOTAL(109, F2:F7)` show?

   | row | order_id | store_name | product_name | line_amount_usd |
   |---:|---|---|---|---:|
   | 2 | 1004 | Old Town | Green Tea | 6.50 |
   | 3 | 1005 | Campus | Banana Bread | 3.75 |
   | 4 | 1006 | Old Town | Cold Brew | 4.75 |
   | 5 | 1006 | Old Town | Cappuccino | 9.00 |
   | 6 | 1007 | Old Town | Croissant | 3.25 |
   | 7 | 1007 | Old Town | Cold Brew | 4.75 |

   <details>
   <summary>Answer</summary>

   `SUM` shows 32.00: it adds the hidden Campus row too. `SUBTOTAL(109, ...)` shows 28.25: it adds only the five rows that the filter leaves visible (32.00 minus 3.75).

   *Why:* `SUM` adds every cell in the range; `SUBTOTAL` leaves out the rows that a filter hides.

   Missed it? Study [*Tables, sorting and filtering*](/excel/tables-sort-filter/) (E5).

   </details>

2. Columns B and E hold the store and the quantity of an order line. The formula in F2 is `=IF(AND(E2>=2, OR(B2="Campus", B2="Harbor")), "ship", "hold")`, filled down. What does it show in each of the four rows?

   | row | order_id | store_name | quantity |
   |---:|---|---|---:|
   | 2 | 1010 | Campus | 3 |
   | 3 | 1009 | Old Town | 2 |
   | 4 | 1721 | Harbor | 2 |
   | 5 | 1008 | Campus | 1 |

   <details>
   <summary>Answer</summary>

   `ship`, `hold`, `ship`, `hold`. `AND` needs both tests to be true: a quantity of 2 or more, and a store that is Campus or Harbor (`OR` needs only one of its two). Row 3 has the quantity but the wrong store. Row 5 has the right store but a quantity of 1.

   *Why:* `AND` is true only when every test is true; `OR` is true when at least one is.

   Missed it? Study [*Decisions with IF, AND and OR*](/excel/if-logic/) (E6).

   </details>

3. The product names are in B2:B17 of the products sheet and the prices in D2:D17. The product Mocha costs 5.00, and there is no Flat White. What do these three formulas show?

   `=XLOOKUP("Mocha", B2:B17, D2:D17, "not on menu")`

   `=XLOOKUP("Flat White", B2:B17, D2:D17, "not on menu")`

   `=XLOOKUP("Flat White", B2:B17, D2:D17)`

   <details>
   <summary>Answer</summary>

   5 (shown as 5.00), then `not on menu`, then `#N/A`. `XLOOKUP` matches the whole text exactly. The fourth argument is what it shows when there is no match; with no fourth argument, the answer for a missing name is `#N/A`.

   *Why:* a lookup should either find the row or say clearly that it did not.

   Missed it? Study [*Bring in a value by key with XLOOKUP*](/excel/xlookup/) (E8).

   </details>

4. Cell A2 shows `Cold Brew`, copied from a web page. Cell B3 shows `Cold Brew`, typed by hand. Both have 9 characters, but `=A2=B3` shows `FALSE`, and `=TRIM(A2)=B3` still shows `FALSE`. What is the most likely cause? Which formula makes the comparison `TRUE`?

   <details>
   <summary>Answer</summary>

   The space in A2 is a non-breaking space (character 160), which looks like a space. `TRIM` removes only the ordinary space (character 32). First swap the odd space for an ordinary one: `=TRIM(SUBSTITUTE(A2, UNICHAR(160), " "))=B3` shows `TRUE`. `=UNICODE(MID(A2, 5, 1))` shows 160 and proves the cause.

   *Why:* two texts that look the same can differ in a character you cannot see.

   Missed it? Study [*Cleaning text with TRIM, LEFT and TEXTSPLIT*](/excel/text-functions/) (E10).

   </details>

5. The sheet `order_items` has 3,287 lines from 1,800 different orders. You select the whole table, tick only `order_id` in **Remove Duplicates** and click OK. How many rows are left, and what is wrong? Which column would you tick to remove only a line that was pasted twice, and how many rows would that remove here?

   <details>
   <summary>Answer</summary>

   1,800 rows are left. Most orders have several lines, so the 1,487 extra lines were real, and they are deleted. "Duplicate" has no meaning until you say which columns identify a row. Tick `order_item_id`, the line's own id, or all the columns. No line repeats in this sheet, so that would remove 0 rows. Do it on a copy, and write the step in a change log.

   *Why:* a row is a duplicate only when the columns that identify it are the same.

   Missed it? Study [*A cleaning workflow you can defend*](/excel/cleaning-workflow/) (E13).

   </details>

6. A PivotTable built from the 3,287 order lines shows the sum of `line_amount_usd` for each store: Old Town 9,144.25, Campus 9,003.75 and Harbor 4,606.25. Suppose one Harbor line was typed as 3.00 and should be 4.00; this typo is made up. You fix that cell in the source table. What does the pivot show for Harbor right after the fix, and after you click **Refresh**?

   <details>
   <summary>Answer</summary>

   Right after the fix it still shows 4,606.25, and after **Refresh** it shows 4,607.25. In Excel a PivotTable works from a saved copy of the data, so it does not follow the source until you refresh it.

   *Why:* a pivot is a snapshot; when a report does not match its data, refresh it first.

   Missed it? Study [*Summarize with a PivotTable*](/excel/pivottables-build/) (E15).

   </details>

7. A column chart shows the orders of each store: Old Town 729, Campus 716, Harbor 355. The vertical axis starts at 300, not at 0. (a) How many times taller does the Old Town bar look than the Harbor bar? (b) How many times as many orders did Old Town take? (c) What do you change?

   <details>
   <summary>Answer</summary>

   (a) The bars are 429 and 55 units tall: Old Town looks 7.8 times taller. (b) 729 divided by 355 is 2.05, about 2 times. (c) Start the axis at 0, so that bar heights match the numbers.

   *Why:* a bar's length stands for its value, so the axis of a bar chart must start at zero.

   Missed it? Study [*Charts that tell the truth*](/excel/charts-that-tell-the-truth/) (E17).

   </details>

8. In Excel 365, cell H2 holds `=SORT(UNIQUE(C2:C3288))`, and C2:C3288 holds the category of each of the 3,287 order lines. The cell H4 holds a note that you typed. What does H2 show, and why? How many cells would the result fill if H4 were empty? What do you do?

   <details>
   <summary>Answer</summary>

   H2 shows `#SPILL!`. There are 4 categories (bakery, coffee, food and tea), so the result needs H2 to H5, and the typed note in H4 blocks it. Clear H4 or move the note, and the four names appear by themselves.

   *Why:* a spilling formula needs all of its result cells empty.

   Missed it? Study [*Spilling results with FILTER, SORT and UNIQUE*](/excel/dynamic-arrays/) (E19).

   </details>
