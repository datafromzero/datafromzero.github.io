/**
 * "Excel in a nutshell" (SPEC D44, `/excel/cheatsheet/`): one printable page for the Excel stage, written for data work
 * rather than as a formula list (owner request, 2026-11-19). The parts follow the flow of the data: shape it, clean it,
 * query and summarize it, combine tables, make the work repeatable and checked, then show it. Every card is distilled from a
 * published lesson in `src/content/docs/excel/` (its big idea, its trap, its known results), uses that lesson's cafe-sales
 * sheets, columns and function spellings, and links back to it. Nothing is added that a lesson does not teach.
 *
 * Each card also has a "Next" line: its twin in the coming stages. SQL twins name a published SQL lesson (linked, with its
 * code); pandas twins are method names only, because the Python lessons are drafts with no page to link.
 *
 * A pattern is a formula or a step list. A formula is the lesson's own text (the long ones are only wrapped over lines);
 * `...` stands for a part the lesson spells out in full next to it.
 */
import type { Cheatsheet } from '../../lib/cheatsheet.ts';

export const excelCheatsheet: Cheatsheet = {
	stage: 'excel',
	title: 'Excel in a nutshell',
	description: 'One page of Excel and Sheets patterns for data work, in the order of the data, each with its trap and its SQL and pandas twin. Prints on two sheets.',
	intro:
		'This is not a formula list. It follows your data: shape it, clean it, query and summarize it, combine tables, make the work repeatable and checked, then show it. Each card gives a pattern from a lesson of the Excel stage, the data idea behind it, the common trap, and its twin in the next stages (SQL, then pandas). Each card names its lesson (E8); open it to learn the idea. The page prints on A4, both sides, black on white.',
	foot: 'From the free Excel stage of datafromzero, datafromzero.github.io/excel/ (content CC BY 4.0). Every pattern and number comes from a lesson and its cafe-sales practice workbook. Excel and Google Sheets differ in places; the lessons say where.',
	parts: [
		{
			id: 'shape',
			title: 'Shape the data',
			codes: 'E1, E2, E3, E4',
			items: [
				{
					lesson: 'grid-and-tidy-layout',
					code: `1 row = 1 record (1 order)
1 column = 1 field, 1 fact per cell
header in row 1, nothing above it
raw (as it arrived) > calc > output`,
					does: 'Say what one row is before you count anything; a tool cannot tell a title, a blank row or a total from a record.',
					trap: 'Counting a column with blanks: customer_id gives 1,799, because walk-in order 1335 has none; count the key, order_id, for 1,800.',
					next: { sql: [{ text: 'tables, keys and grain', lesson: 'relational-model' }], pandas: 'shape' },
				},
				{ figure: 'tidy', lesson: 'grid-and-tidy-layout' },
				{
					lesson: 'first-formulas',
					code: `=C2*D2-E2
=SUM(F2:F8)
=COUNT(F2:F8)
=AVERAGE(F2:F8)`,
					does: 'Write the formula in the first row, fill it down to make a new field per record, then summarize the column and reconcile it with the till.',
					trap: '=C2*(D2-E2) takes the discount off each unit: 51.25 against the till\'s 52.25, and the first row still looks right.',
					next: { sql: [{ text: 'computed columns', lesson: 'expressions-and-types' }, { text: 'SUM, COUNT, AVG', lesson: 'aggregate-functions' }], pandas: 'assign, sum' },
				},
				{
					lesson: 'cell-references',
					code: `=C2/$F$2`,
					does: 'Lock what must not move with $, so every record is divided by the same total, and its shares add up to 100%.',
					trap: '=$C$2/$F$2 locks too much: every row shows Espresso\'s 3.8% and the column adds up to 60.1%; check a row far down.',
					next: { sql: [{ text: 'share with SUM() OVER', lesson: 'window-functions' }], pandas: 'sum, then divide' },
				},
				{
					lesson: 'numbers-dates-text-types',
					code: `=ISNUMBER(D2)
=COUNT(D2:D115)
=COUNTA(D2:D115)
=VALUE(D2)`,
					does: 'A number stored as text looks the same but SUM skips it; COUNT against COUNTA says how many cells are text, and VALUE converts them in a new column.',
					trap: 'Campus January: SUM gives 923.75, not the till\'s 1,518.75, because 41 totals are text (and the status bar\'s Count counts text too).',
					next: { sql: [{ text: 'data types and CAST', lesson: 'expressions-and-types' }], pandas: 'to_numeric, astype' },
				},
				{
					lesson: 'numbers-dates-text-types',
					code: `=COUNT(B2:B115)
=COUNTA(B2:B115)
=MIN(B2:B115)
=MAX(B2:B115)`,
					does: 'A real date is a number underneath, so COUNT, MIN and MAX test a date column that looks fine; write dates year first, as 2026-01-13.',
					trap: 'A readable date is not a right one: 12/01/2026 was read as December 1 in a January export; 44 of the 46 real dates were wrong.',
					next: { sql: [{ text: 'cast text to a date', lesson: 'expressions-and-types' }], pandas: 'to_datetime' },
				},
			],
		},
		{
			id: 'clean',
			title: 'Clean it',
			codes: 'E10, E11, E13',
			items: [
				{
					lesson: 'cleaning-workflow',
					code: `1 raw sheet: never edited
2 profile: =COUNTA(A2:A1831)
           =COUNTBLANK(B2:B1831)
3 fix on a copy, a step at a time
4 reconcile to a number from outside
5 change_log: one line per step`,
					does: 'Profile before you fix (rows, blanks, duplicates, spellings), fix on a copy, reconcile with a total from outside the file, and log each step.',
					trap: 'Cleaning on the raw sheet and never comparing: 1,809 completed against the till\'s 1,799, and no log to show why.',
					next: { sql: [{ text: 'COUNT(*), COUNT(DISTINCT)', lesson: 'aggregate-functions' }], pandas: 'value_counts, duplicated' },
				},
				{
					lesson: 'cleaning-workflow',
					code: `Data > Remove Duplicates,
  tick only order_id
=XLOOKUP(LOWER(TRIM(E2)),
  mapping!$A$2:$A$5,
  mapping!$B$2:$B$5,"UNMAPPED")
=COUNTIFS(G2:G1801,"UNMAPPED")`,
					does: 'Name the key that makes a row a duplicate, then map messy labels through a mapping table and count what is left unmapped (0).',
					trap: 'Ticking all six columns removes only 20 repeats and leaves 1,810 rows: 10 re-sent orders are spelled differently.',
					next: { sql: [{ text: 'deduplication', lesson: 'deduplicate-latest-record' }], pandas: 'drop_duplicates, map' },
				},
				{
					lesson: 'text-functions',
					code: `=UPPER(TRIM(
  raw_till_export!A2))
=VALUE(MID(A2,2,1))
=VALUE(MID(A2,4,4))`,
					does: 'Clean, cut, convert, each in a new column, so one packed code becomes typed fields.',
					trap: 'MID returns text: without VALUE the order numbers add up to 0, not 3,420,900.',
					next: { sql: [{ text: 'cleaning text', lesson: 'text-functions' }], pandas: 'str.strip, str.split' },
				},
				{
					lesson: 'date-functions',
					code: `=DATE(VALUE(RIGHT(raw_signups_text!B2,4)),
  VALUE(LEFT(raw_signups_text!B2,2)),
  VALUE(MID(raw_signups_text!B2,4,2)))
=EOMONTH(B2,0)`,
					does: 'Build a real date from its pieces, with no regional setting involved, and use the month end as a key to count by.',
					trap: 'DATE(2026,2,30) shows 2026-03-02 and no error; compare DAY of the result with the text.',
					next: { sql: [{ text: 'dates and time', lesson: 'dates-and-time' }], pandas: 'to_datetime, resample' },
				},
			],
		},
		{
			id: 'query',
			title: 'Query and summarize',
			codes: 'E5, E6, E7, E15, E16, E19, E20',
			items: [
				{
					lesson: 'tables-sort-filter',
					code: `Ctrl+T (a Table)
=SUBTOTAL(103,A6:A1805)
=SUBTOTAL(109,G6:G1805)`,
					does: 'A filter keeps the rows that pass every condition and a sort moves whole rows; SUBTOTAL totals only what the filter leaves visible.',
					trap: 'SUM ignores the filter: 22,754.25 reported as March cash at Campus, when the answer is 211.25.',
					next: { sql: [{ text: 'WHERE', lesson: 'where-filtering' }, { text: 'ORDER BY', lesson: 'select-sort-limit' }], pandas: 'boolean filter, sort_values' },
				},
				{
					lesson: 'if-logic',
					code: `=IF(AND(E6="cash",F6="completed"),"in till","skip")
=IF(G6>=16,"large",IF(G6>=8,"medium","small"))`,
					does: 'A flag column labels every row by a rule you wrote in words, so you can filter, count and total by it.',
					trap: 'Tests in the wrong order: with 8 tested first, all 491 large orders are labeled medium and no large appears.',
					next: { sql: [{ text: 'CASE', lesson: 'case-expressions' }], pandas: 'np.where' },
				},
				{
					lesson: 'conditional-totals',
					code: `=SUMIFS(raw_sales_lines!J:J,
  raw_sales_lines!C:C,$B$3,
  raw_sales_lines!E:E,$B$4,
  raw_sales_lines!D:D,$B$5,
  raw_sales_lines!B:B,">="&$B$6,
  raw_sales_lines!B:B,"<"&$B$7)`,
					does: 'A grouped total by hand: keep the rows that pass every condition pair, add up what is left, and check that the category buckets add up to the whole (1,440.75).',
					trap: '"<="&DATE(2026,3,31) drops the times of day on March 31: 1,376.00 instead of 1,440.75; end before the next month.',
					next: { sql: [{ text: 'GROUP BY', lesson: 'group-by-having' }, { text: 'conditional aggregation', lesson: 'conditional-aggregation' }], pandas: 'groupby' },
				},
				{
					lesson: 'dynamic-arrays',
					code: `=FILTER(raw_orders!A2:D1801,
  (raw_orders!C2:C1801=H1)*
  (raw_orders!F2:F1801=H2)*
  (raw_orders!D2:D1801>=H3)*
  (raw_orders!D2:D1801<H4),
  "no orders")
=SORT(FILTER(...),4,-1)
=SORT(UNIQUE(FILTER(...)))`,
					does: 'One formula, one question, and a block the size of the answer: FILTER keeps rows, SORT orders them, UNIQUE removes repeats, and the block grows and shrinks with the data.',
					trap: 'A + between two tests means or: 146 rows instead of 10; multiply for and, and check the count with COUNTIFS.',
					next: { sql: [{ text: 'WHERE', lesson: 'where-filtering' }, { text: 'SELECT DISTINCT', lesson: 'deduplicate-latest-record' }], pandas: 'boolean filter, sort_values, unique' },
				},
				{
					lesson: 'pivottables-build',
					code: `Insert > PivotTable (from a Table)
Rows: store     Columns: category
Values: Sum of amount_usd
Filters: status = completed
grand total = status-bar Sum`,
					does: 'A PivotTable is group-and-summarize: each cell is the sum of the source rows that share its row and column label, and the grand total must equal the source.',
					trap: 'Count of amount_usd read as dollars (Campus 1,305): the grand total, 3,287, is a row count, not 22,754.25.',
					next: { sql: [{ text: 'GROUP BY', lesson: 'group-by-having' }], pandas: 'groupby, pivot_table' },
				},
				{ figure: 'pivot', lesson: 'pivottables-build' },
				{
					lesson: 'pivot-grouping-and-share',
					code: `Right-click a date > Group > Months
Right-click a value > Show Values As
  > % of Row Total
Harbor, April: 1,596.50 / 4,390.75 = 36.4%`,
					does: 'Grouping gathers 181 days under 6 month labels; a share divides by a total, so name the denominator (row, column or grand total) first.',
					trap: '% of Grand Total read as a row share: Harbor\'s 7.0% of the half year is 36.4% of April.',
					next: { sql: [{ text: 'dates and time', lesson: 'dates-and-time' }, { text: 'share with OVER', lesson: 'window-functions' }], pandas: 'groupby, resample' },
				},
				{
					lesson: 'sheets-query-bridge',
					code: `=QUERY(raw_order_lines!A1:K3288,
  "select E, sum(J)
   where K = 'completed'
   group by E
   order by sum(J) desc
   limit 3
   label sum(J) 'sales_usd'", 1)`,
					does: 'Google Sheets QUERY reads like SQL: select, where, group by, order by, limit, one clause at a time, checked against SUMIFS as you go.',
					trap: 'month() counts from 0, so month(C) = 3 is April (4,390.75), not March (2,995.25); compare dates instead.',
					next: { sql: [{ text: 'GROUP BY', lesson: 'group-by-having' }, { text: 'ORDER BY, LIMIT', lesson: 'select-sort-limit' }], pandas: 'groupby, sort_values' },
				},
			],
		},
		{
			id: 'combine',
			title: 'Combine tables',
			codes: 'E8, E9',
			items: [
				{
					lesson: 'xlookup',
					code: `=XLOOKUP(B2,
  raw_customers!$A$2:$A$151,
  raw_customers!$D$2:$D$151,
  "no card")`,
					does: 'A lookup is the spreadsheet join: it pairs rows by a key, not by position, and a row may find no partner; check that the tiers add up to the 1,800 orders.',
					trap: 'Unflagged missing keys: #N/A spreads into every SUM; a code stored as text (or with a space) is not found either, so VALUE(TRIM()) it first.',
					next: { sql: [{ text: 'LEFT JOIN, anti join', lesson: 'left-join-anti-join' }], pandas: 'merge(how="left", indicator=True)' },
				},
				{ figure: 'lookup', lesson: 'xlookup' },
				{
					lesson: 'legacy-lookups',
					code: `=VLOOKUP(B2,
  raw_products!$A$2:$D$17,4,FALSE)
=INDEX(raw_products!$D$2:$D$17,
  MATCH(B2,raw_products!$A$2:$A$17,0))`,
					does: 'Read an inherited lookup by its four parts (what to find, where, what to bring back, exact or not) and test it with a code that is not in the list.',
					trap: 'Without FALSE the match is approximate: code 99 returns 5.50, not #N/A; a typed column number goes stale.',
					next: { sql: [{ text: 'INNER JOIN', lesson: 'inner-join' }], pandas: 'merge' },
				},
			],
		},
		{
			id: 'repeat',
			title: 'Repeatable processing and quality',
			codes: 'E12, E14, E18, E22',
			items: [
				{
					lesson: 'power-query-basics',
					code: `Data > From Text/CSV
  Delimiter: Comma
  Do not detect data types
Trim, lowercase, Split Column By Delimiter "-"
Remove Columns, set each type
Remove Duplicates on order_id
Close & Load To... > Table
reconcile: 1,500 orders, $18,958.00
Data > Refresh All`,
					does: 'A pipeline you can rerun: every step is recorded in Applied steps and runs again on new rows, and the source file is never changed.',
					trap: 'The Source step holds the file path: a new file with another name is never read, and refresh still shows 1,500 rows, not 1,800.',
					next: { sql: [{ text: 'a saved view', lesson: 'views' }], pandas: 'read_csv, then the same steps in a script' },
				},
				{
					lesson: 'formula-errors-and-auditing',
					code: `=VALUE(TRIM(raw_model!B2))
=XLOOKUP(B2,
  raw_products!$A$2:$A$17,
  raw_products!$D$2:$D$17)
=COUNT(D2:D41)`,
					does: 'An error travels down the chain: find the first cell that shows it although its inputs are fine, fix it there, and reconcile.',
					trap: 'IFERROR(...,0) hid three text codes: total 238.25 instead of 247.75, with no error left to see.',
					next: { sql: [{ text: 'NULL: unknown is not zero', lesson: 'null-handling' }], pandas: 'to_numeric, astype' },
				},
				{
					lesson: 'rules-and-validation',
					code: `=$E2="canceled"
Data validation > List:
  Old Town,Campus,Harbor
Data > Data Validation > Circle Invalid Data
=COUNTIFS(D2:D3288,">10")`,
					does: 'A rule is a sentence the sheet can check: validation acts when you type, conditional formatting repaints when data changes, and a count confirms both.',
					trap: 'Validation does not fire on pasted or filled values: one quantity of 20 sits in a 1-to-10 column until Circle Invalid Data finds it.',
					next: { sql: [{ text: 'constraints, CHECK', lesson: 'create-table-constraints' }], pandas: 'merge(validate=...), duplicated' },
				},
				{
					lesson: 'ai-draft-and-verify',
					code: `ask > draft > verify > decide
=SUMIFS(J:J,D:D,"Campus",K:K,"completed")`,
					does: 'Check an assistant\'s draft against a known answer you worked out by hand, one that contains the awkward case (canceled order 1461).',
					trap: 'SUMIF(D:D,"Harbor",J:J) matched Harbor by luck (no canceled lines) and then gave Campus 9,003.75 instead of 8,998.75.',
					next: { sql: [{ text: 'AI-assisted queries', lesson: 'ai-assisted-queries' }], pandas: 'groupby (check the draft on a small known answer)' },
				},
			],
		},
		{
			id: 'communicate',
			title: 'Communicate',
			codes: 'E17, E21',
			items: [
				{
					lesson: 'charts-that-tell-the-truth',
					code: `which is bigger?  sorted column or bar
over time?        line
move together?    scatter
made of?          pie: one series,
                  7 categories at most
column axis starts at 0
title states the takeaway`,
					does: 'Choose the chart from the question, not the menu, with one measure per axis.',
					trap: 'An axis that starts at 2,500 and a second vertical axis make the columns lie without changing a value.',
					next: { sql: [{ text: 'GROUP BY feeds the chart', lesson: 'group-by-having' }], pandas: 'groupby, sort_values' },
				},
				{
					lesson: 'one-screen-report',
					code: `=SUMIFS(raw_order_lines!J:J,
  raw_order_lines!K:K,"completed")
=COUNTA(UNIQUE(FILTER(
  raw_order_lines!B:B,
  raw_order_lines!K:K="completed")))
=IF(ROUND(A1-A2,2)=0,"OK","CHECK")`,
					does: 'Every number on the screen is a formula or a pivot, and the sheet says its source, its assumptions and when it was refreshed.',
					trap: 'A range that stops at row 2800 gives 19,320.00, not 22,749.25, and a typed order count goes stale.',
					next: { sql: [{ text: 'SUM, COUNT(DISTINCT)', lesson: 'aggregate-functions' }], pandas: 'sum, nunique' },
				},
			],
		},
	],
};
