/**
 * "Python in a nutshell" (SPEC D44, `/python/cheatsheet/`): one printable page for the Python stage. The parts follow the flow
 * of the data: Python basics, load and look, select, derive, group and merge, clean, reshape, charts, outside data, ship it.
 * Every card is distilled from a published lesson in `src/content/docs/python/` (its big idea, its Common trap, its Remember
 * list), uses that lesson's cafe-sales tables and names (`orders`, `order_items`, `products`, `customers`, `stores`), and links
 * back to it. Nothing is added that a lesson does not teach.
 *
 * Where a pandas pattern has a twin in the SQL or Excel stage, a "Twin" line names it and links the published lesson.
 *
 * Every pattern runs on the cafe-sales data: `python3 scripts/check-cheatsheet-python.py` (needs pandas) runs them in page order.
 * A line that starts with `$` is a shell command; the checker confirms the command exists instead of installing anything.
 */
import type { Cheatsheet } from '../../lib/cheatsheet.ts';

export const pythonCheatsheet: Cheatsheet = {
	stage: 'python',
	title: 'Python in a nutshell',
	description: 'One page of Python and pandas patterns for data work, in the order of the data, each with its trap and its SQL and Excel twin. Prints on two sheets.',
	intro:
		'This is not a language reference. It follows your data: the Python you need first, then load it and look, select, derive, group and merge, clean it, reshape it, chart it, bring in outside data, and ship the work so it runs again. Each card gives a pattern from a lesson of the Python stage, the idea behind it, the common trap, and where it has a twin you met in SQL or Excel. Each card names its lesson (P12); open it to learn the idea. The page prints on A4, both sides, black on white.',
	foot: 'From the free Python stage of datafromzero, datafromzero.github.io/python/ (content CC BY 4.0). Every pattern runs on the cafe-sales practice data, and every idea comes from a lesson.',
	parts: [
		{
			id: 'basics',
			title: 'Python basics',
			codes: 'P1–P8',
			items: [
				{
					lesson: 'first-notebook',
					code: `len(orders)
n_customers = len(customers)
stores[stores.store_id == 1]
orders["store_id"].value_counts()`,
					does: 'A notebook is a page of cells you run one at a time; it remembers every name that the cells you ran before set.',
					trap: 'A cell you changed but did not run: the page shows one value and the memory holds another.',
				},
				{
					lesson: 'values-and-types',
					code: `price_text = "4.50"
unit_price = float(price_text)
line_total = 3 * unit_price
type(line_total)`,
					does: 'A variable is a name for a value, and every value has a type; Python never converts for you, so use float(), int() or str() on purpose.',
					trap: '"4.50" * 2 repeats the text instead of failing, so the total looks like a price written twice.',
					twin: { excel: [{ text: 'VALUE', lesson: 'numbers-dates-text-types' }], sql: [{ text: 'CAST', lesson: 'expressions-and-types' }] },
				},
				{
					lesson: 'strings',
					code: `raw = "  chai   LATTE "
raw.strip().lower()
name, price = "Latte", 4.5
"Latte" in "Chai Latte"
f"{name} costs \${price}"`,
					does: 'A string is numbered from 0, and a method such as strip or lower gives you a new string without changing the old one.',
					trap: 'Calling a string method and not keeping what it returns.',
					twin: { sql: [{ text: 'TRIM, LOWER', lesson: 'text-functions' }], excel: [{ text: 'TRIM, LOWER', lesson: 'text-functions' }] },
				},
				{
					lesson: 'conditionals',
					code: `price = 5.0
if price >= 8:
    tier = "premium"
elif price >= 4.5:
    tier = "regular"
else:
    tier = "cheap"`,
					does: 'An if chain asks its questions in order and runs only the first branch whose answer is True, so the order of the tests is part of the rule.',
					trap: 'A boundary or an order you did not test: > against >= moves the Latte\'s tier, and a broad test placed first catches every price below it.',
					twin: { sql: [{ text: 'CASE WHEN', lesson: 'case-expressions' }], excel: [{ text: 'IF', lesson: 'if-logic' }] },
				},
				{
					lesson: 'lists-and-loops',
					code: `prices = [3.25, 3.75, 4.25]
total = 0
for price in prices:
    total = total + price
[price * 2 for price in prices]
prices[0:2]  # two items`,
					does: 'A list holds values in order, and a for loop repeats the same lines once for each value; a comprehension is a loop that builds a list in one line.',
					trap: 'A slice with one item fewer than you wanted: [a:b] leaves out b.',
				},
				{
					lesson: 'dicts-and-sets',
					code: `store_name_of = {1: "Old Town", 2: "Campus", 3: "Harbor"}
store_name_of.get(7, None)
payments = {"card": 421, "cash": 91}
for method, count in payments.items():
    print(method, count)
len(set(["card", "cash", "card"]))`,
					does: 'A dictionary finds a value by its key, and a set keeps each value once; pandas reads dictionaries in rename, map, agg and DataFrame, always key first.',
					trap: 'A table built from dictionaries with a key missing: pandas fills NaN without a word, the column turns into decimals, and its total no longer matches the till.',
				},
				{
					lesson: 'functions-and-modules',
					code: `def line_amount(quantity, unit_price, discount=0.0):
    return quantity * unit_price - discount
line_amount(2, 5.0, discount=0.5)`,
					does: 'A function is a named recipe: the values you give it go in and one value comes back with return; a parameter with a default may be left out.',
					trap: 'A function that prints its answer instead of returning it: the call gives back None, so the value cannot be stored or added.',
				},
				{
					lesson: 'errors-and-debugging',
					code: `for text in ["4.50", "n/a", "3.25"]:
    try:
        price = float(text)
    except ValueError:
        price = None
    print(text, price)`,
					does: 'Read a traceback from its last line, the error\'s name and then its message; for a wrong answer with no error, print the values between the steps.',
					trap: 'Pasting the whole wall of red text into a search without reading it: the last line already says what happened.',
				},
			],
		},
		{
			id: 'load',
			title: 'Load it and look',
			codes: 'P9–P11',
			items: [
				{
					lesson: 'files-and-tables',
					code: `orders = pd.read_csv(path)
pd.read_csv(path, encoding="latin-1")
pd.read_excel(xlsx, sheet_name="orders")
pd.DataFrame(json.loads(text)["lines"])`,
					does: 'Every source has a reader, a function that takes its location and gives back a table; a list of JSON records becomes a table with DataFrame.',
					trap: 'An accented name that comes out as other letters, or with letters missing: the file was read with an encoding it was not saved in.',
				},
				{
					lesson: 'numpy-vectorization',
					code: `amount = quantity * price - discount
many = quantity >= 2
many.sum()
amount[many]
np.where(amount >= 6, amount - 1, amount)`,
					does: 'An array holds many values of one type, and one expression works on all of them at once, with no loop; a comparison gives a mask of True and False.',
					trap: 'A Python list where you meant an array: * and + mean something else on a list, and nothing stops you.',
					twin: { excel: [{ text: 'a formula filled down', lesson: 'first-formulas' }] },
				},
				{
					lesson: 'dataframe-first-look',
					code: `orders.shape
orders.head(3)
orders.dtypes
order_items["quantity"].describe()
orders["status"].value_counts()`,
					does: 'A DataFrame is a table of columns that each hold one kind of value, with an index that labels the rows; look at its shape, types and counts before you trust it.',
					trap: 'Subtracting two Series and trusting the total: a label that is on one side only comes out as NaN, not as a number.',
				},
			],
		},
		{
			id: 'shape',
			title: 'Select, derive, group, merge',
			codes: 'P12–P15',
			items: [
				{
					lesson: 'pandas-select-and-filter',
					code: `mask = (orders["store_id"] == 1) & (
    orders["payment_method"] == "mobile")
orders[mask].shape
orders[["order_id", "status"]]
orders["customer_id"].notna()
work = orders.copy()
work.loc[mask, "payment_method"] = "card"`,
					does: 'A mask is a column of True and False, one for each row, and a filter keeps the rows where it is True; print the mask and the shape before and after.',
					trap: 'An assignment through two pairs of brackets, fresh[mask]["payment_method"] = "card", changes nothing and shows only a warning; use .loc.',
					twin: { sql: [{ text: 'WHERE', lesson: 'where-filtering' }], excel: [{ text: 'filter', lesson: 'tables-sort-filter' }] },
				},
				{
					lesson: 'pandas-derived-columns',
					code: `price_of = dict(zip(products["product_id"],
    products["unit_price_usd"]))
lines = order_items.assign(
    price=order_items["product_id"].map(price_of))
lines = lines.assign(amount=lines["quantity"]
    * lines["price"] - lines["discount_usd"])
lines["amount"].sum()`,
					does: 'A new column is worked out from old ones for every row at once: map looks a value up, assign calculates; check the new column against a total you know.',
					trap: 'A key or a branch that nothing covers gives NaN or None and no error, where a spreadsheet shows #N/A.',
					twin: { sql: [{ text: 'computed columns', lesson: 'expressions-and-types' }], excel: [{ text: 'a formula filled down', lesson: 'first-formulas' }] },
				},
				{
					lesson: 'pandas-groupby-aggregate',
					code: `orders.groupby("store_id").size()
by_product = lines.groupby("product_id").agg(
    units=("quantity", "sum"),
    sales=("amount", "sum"),
    n_lines=("order_item_id", "size"))
by_product.sort_values("sales", ascending=False)`,
					does: 'groupby splits the rows into one group for each key, applies a calculation to each group and combines the results; the sizes of the groups must add up to the table.',
					trap: 'Rows with a blank key are left out of a groupby without a message, so the groups can add up to less than the table.',
					twin: { sql: [{ text: 'GROUP BY', lesson: 'group-by-having' }], excel: [{ text: 'PivotTable', lesson: 'pivottables-build' }] },
				},
				{ figure: 'split', lesson: 'pandas-groupby-aggregate' },
				{
					lesson: 'pandas-merge-and-validate',
					code: `with_price = order_items.merge(
    products[["product_id", "unit_price_usd"]],
    on="product_id", how="left",
    validate="many_to_one", indicator=True)
with_price["_merge"].value_counts()
len(with_price) == len(order_items)`,
					does: 'A merge pairs the rows of two tables that share a key, and validate says in advance how many partners a key may have; count _merge and the rows afterwards.',
					trap: 'A merge does not complain about a repeated key unless validate promises that it is unique, and the extra rows inflate every total.',
					twin: { sql: [{ text: 'JOIN', lesson: 'inner-join' }, { text: 'LEFT JOIN', lesson: 'left-join-anti-join' }], excel: [{ text: 'XLOOKUP', lesson: 'xlookup' }] },
				},
				{ figure: 'merge', lesson: 'pandas-merge-and-validate' },
			],
		},
		{
			id: 'clean',
			title: 'Clean it: missing, dates, text',
			codes: 'P16–P18',
			items: [
				{
					lesson: 'pandas-missing-data-and-types',
					code: `orders["customer_id"].isna().sum()
kept = orders.dropna(subset=["customer_id"])
len(orders), len(kept)
pd.read_csv(path, dtype={"customer_id": "Int64"})
orders.drop_duplicates(subset=["order_id"])`,
					does: 'A gap can be dropped, filled or kept, and each choice changes what the data says, so choose on purpose and count what changed; == cannot find a missing value.',
					trap: 'A gap turns a column of whole numbers into decimals, and ids come out as 15.0.',
					twin: { sql: [{ text: 'IS NULL, COALESCE', lesson: 'null-handling' }], excel: [{ text: 'a cleaning workflow', lesson: 'cleaning-workflow' }] },
				},
				{
					lesson: 'pandas-dates-and-resample',
					code: `orders = orders.assign(when=pd.to_datetime(
    orders["ordered_at"], format="%Y-%m-%d %H:%M:%S"))
orders["when"].dt.day_name()
q1 = orders[(orders["when"] >= "2026-01-01")
    & (orders["when"] < "2026-04-01")]
monthly = (orders.set_index("when")
    .resample("MS")["order_id"].size())
monthly - monthly.shift(1)`,
					does: 'A date column is text until to_datetime reads it with a format you name; then you can cut it into parts, filter a range, group by month and compare with the month before.',
					trap: 'A range that ends on a date written alone leaves out the orders of that day after midnight; end it with < the next day.',
					twin: { sql: [{ text: 'dates and time', lesson: 'dates-and-time' }], excel: [{ text: 'date functions', lesson: 'date-functions' }] },
				},
				{
					lesson: 'pandas-text-cleaning',
					code: `clean = typed.str.strip().str.lower()
clean = clean.str.replace(r"\\s+", " ", regex=True)
notes.str.extract(r"(\\d+)\\s*oz",
    flags=re.IGNORECASE, expand=False)
names.str.normalize("NFC")`,
					does: 'A text column is cleaned by applying a string method to every value with .str, one step at a time, into a new column so that the raw one stays.',
					trap: 'Two texts that print the same are not always equal: an accent can be stored as two characters, so normalize to NFC before a filter, a groupby or a merge.',
					twin: { sql: [{ text: 'text functions', lesson: 'text-functions' }], excel: [{ text: 'text functions', lesson: 'text-functions' }] },
				},
			],
		},
		{
			id: 'reshape',
			title: 'Reshape and window-like columns',
			codes: 'P19–P20',
			items: [
				{
					lesson: 'pandas-reshape-wide-long',
					code: `long = wide_orders.melt(id_vars="store_id",
    var_name="payment_method", value_name="orders")
wide = store_month.pivot(index="store_id",
    columns="month", values="amount")
sales.pivot_table(index="store_id",
    columns="category", values="amount",
    aggfunc="sum", margins=True)`,
					does: 'melt turns the headings of columns into the values of one column, pivot turns them back, and pivot_table also adds up the rows that land in one cell.',
					trap: 'pivot_table without aggfunc averages, so a table that looks like totals holds averages.',
					twin: { sql: [{ text: 'conditional aggregation', lesson: 'conditional-aggregation' }], excel: [{ text: 'PivotTable', lesson: 'pivottables-build' }] },
				},
				{ figure: 'wide', lesson: 'pandas-reshape-wide-long' },
				{
					lesson: 'pandas-transform-rank-rolling',
					code: `by_store = store_month.groupby("store_id")["amount"]
store_month["store_total"] = by_store.transform("sum")
store_month["share"] = (store_month["amount"]
    / store_month["store_total"])
store_month["prev"] = by_store.shift(1)
per_customer["place"] = (per_customer
    .groupby("store_id")["orders"]
    .rank(method="min", ascending=False))
by_store.rolling(3, min_periods=1).mean()`,
					does: 'transform, rank, shift and rolling keep every row and write the group\'s result beside it, where sum() would shrink the table to one row for each group.',
					trap: 'shift and rolling without a groupby slide across the borders between groups, so a group\'s first rows borrow from the group above.',
					twin: { sql: [{ text: 'OVER', lesson: 'window-functions' }, { text: 'RANK', lesson: 'rank-top-n' }, { text: 'LAG', lesson: 'lag-lead-moving-windows' }] },
				},
			],
		},
		{
			id: 'charts',
			title: 'Show it: charts',
			codes: 'P21–P22',
			items: [
				{
					lesson: 'charts-matplotlib',
					code: `fig, ax = plt.subplots()
named.plot.bar(ax=ax, rot=0)
ax.set_title("A title that states the message")
ax.set_xlabel("Store")
ax.set_ylabel("Sales (USD)")
fig.savefig("sales_by_store.png", dpi=150)
ax.get_ylim()[0]  # 0 for bars`,
					does: 'A chart is a figure that holds axes, and the axes hold everything you can read or change; bars compare categories, a line follows time, and one chart carries one message.',
					trap: 'A bar chart on a cut axis, set_ylim(4000, 9500), which makes small differences look big.',
					twin: { excel: [{ text: 'charts that tell the truth', lesson: 'charts-that-tell-the-truth' }] },
				},
				{
					lesson: 'charts-seaborn',
					code: `by_cat = (sales.groupby("category")["amount"]
    .sum().reset_index())
fig, ax = plt.subplots()
sns.barplot(data=by_cat, x="category",
    y="amount", saturation=1, ax=ax)
fig, ax = plt.subplots()
sns.histplot(lines["amount"], bins=10, ax=ax)`,
					does: 'seaborn draws on the same matplotlib Axes as pandas and takes a whole table with the names of its columns; give it the totals you want drawn.',
					trap: 'sns.barplot on raw rows draws averages, so the bars look like totals and are not.',
				},
			],
		},
		{
			id: 'outside',
			title: 'Bring in outside data',
			codes: 'P23',
			items: [
				{
					lesson: 'apis-and-web-data',
					code: `response.ok
rates = pd.DataFrame(response.json())
sql = ("SELECT COUNT(*) AS orders "
    "FROM orders WHERE store_id = ?")
pd.read_sql(sql, con, params=(3,))`,
					does: 'An API answers a request with a status code and JSON that becomes a table, and a database answers a query the same way; look at response.ok before response.json().',
					trap: 'A value pasted into a query with an f-string becomes part of the SQL, so a typed 3 OR 1=1 counts every row; put ? in the query and pass the values in params.',
				},
			],
		},
		{
			id: 'ship',
			title: 'Ship it',
			codes: 'P24–P27',
			items: [
				{
					lesson: 'environments-and-pip',
					code: `$ python -m pip install pandas==2.2.3
$ python -m pip freeze
print(sys.version_info[:2], pd.__version__)`,
					does: 'A notebook gives the same answer on another computer only on the same Python with the same packages, so pin exact versions in requirements.txt and send it along.',
					trap: 'Installing with the pip of one Python and importing in another: the install succeeds and the import still fails; python -m pip names the Python.',
				},
				{
					lesson: 'cafe-quarterly-pack',
					code: `stack = pd.concat(frames, ignore_index=True)
assert len(stack) == 1800, "rows are missing"
picked = order_items[
    order_items["order_id"].isin(stack["order_id"])]
assert len(lines) == len(picked)`,
					does: 'A report is trustworthy when every step has a check you could run again: stack the tables, then assert the row count and a total against a second route.',
					trap: 'Trusting a stacked table because its row count is right.',
				},
				{
					lesson: 'notebook-to-script',
					code: `import pandas as pd
ORDER_FILE = "orders.csv"
def orders_by_store(path):
    orders = pd.read_csv(path)
    return orders.groupby("store_id").size()
def main():
    print(orders_by_store(ORDER_FILE))
if __name__ == "__main__":
    main()
$ python pack.py`,
					does: 'A script is the steps of a notebook saved in a file: steps in functions, parameters in capitals at the top, main() under the __name__ line, one command to run.',
					trap: 'Assuming a script sees the notebook\'s variables: it runs in its own Python and has only its own lines and files.',
				},
				{
					lesson: 'ai-assisted-code',
					code: `def coffee_share(lines):
    coffee = lines[lines["category"] == "coffee"]
    return (coffee.groupby("store")["amount"].sum()
        / lines.groupby("store")["amount"].sum())
tiny = lines.iloc[[0, 1, 2, 3, 4, 9]]
hand = {"Campus": 0.768, "Old Town": 0.275}
assert coffee_share(tiny).round(3).to_dict() == hand`,
					does: 'An assistant\'s code is a draft: read it, name every number it divides by, test it on a tiny frame you worked by hand, then reconcile it on the real data.',
					trap: 'Trusting a clear explanation: a generated explanation can be wrong too, and may lead people to trust a wrong answer.',
					twin: { sql: [{ text: 'AI-assisted queries', lesson: 'ai-assisted-queries' }], excel: [{ text: 'AI draft and verify', lesson: 'ai-draft-and-verify' }] },
				},
			],
		},
	],
};
