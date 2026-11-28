// The plain-words errors of the SQL runner (SPEC D42). The messages are real DuckDB-Wasm 1.32.0 output, captured by
// running each wrong query; a rule without a captured message here must not exist.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caseQuery, emptyTip, explain, textLookup } from '../src/scripts/sql-errors.ts';

const cases: [name: string, message: string, head: string, tip: RegExp | undefined][] = [
	[
		'typo in a column',
		'Binder Error: Referenced column "store_nme" not found in FROM clause!\nCandidate bindings: "store_name", "store_id", "opened_on"\n\nLINE 1: SELECT store_nme FROM stores',
		'Referenced column "store_nme" not found in FROM clause!',
		/^Did you mean "store_name"\?/,
	],
	[
		'text without quotes',
		'Binder Error: Referenced column "Oakland" not found in FROM clause!\nCandidate bindings: "opened_on"\n\nLINE 1: SELECT * FROM stores WHERE city = Oakland',
		'Referenced column "Oakland" not found in FROM clause!',
		/single quotes: 'Oakland'/,
	],
	[
		'typo in a table',
		'Catalog Error: Table with name store does not exist!\nDid you mean "stores"?\n\nLINE 1: SELECT * FROM store',
		'Table with name store does not exist!',
		/^Did you mean "stores"\?/,
	],
	[
		'a table that is nowhere near',
		'Catalog Error: Table with name nothing does not exist!\nDid you mean "pg_settings"?',
		'Table with name nothing does not exist!',
		/Check the table name/,
	],
	[
		'typo in a function',
		'Catalog Error: Scalar Function with name lenght does not exist!\nDid you mean "length"?\n\nLINE 1: SELECT lenght(city) FROM stores',
		'Scalar Function with name lenght does not exist!',
		/^Did you mean "length"\?/,
	],
	[
		'unterminated quote',
		'Parser Error: unterminated quoted string at or near "\'Oakland"\n\nLINE 1: SELECT * FROM stores WHERE city = \'Oakland',
		'unterminated quoted string at or near "\'Oakland"',
		/single quotes on both sides/,
	],
	[
		'missing comma',
		'Parser Error: syntax error at or near "y"\n\nLINE 1: SELECT store_id, store_name city, opened_on x y FROM stores',
		'syntax error at or near "y"',
		/a comma/,
	],
	['query stops early', 'Parser Error: syntax error at end of input', 'syntax error at end of input', /stops too early/],
	[
		'group by',
		'Binder Error: column "city" must appear in the GROUP BY clause or must be part of an aggregate function.\nEither add it to the GROUP BY list, or use "ANY_VALUE(city)" if the exact value of "city" is not important.',
		'column "city" must appear in the GROUP BY clause or must be part of an aggregate function.',
		/^Add city to GROUP BY/,
	],
	[
		'ambiguous column',
		'Binder Error: Ambiguous reference to column name "store_id" (use: "s.store_id" or "o.store_id")',
		'Ambiguous reference to column name "store_id" (use: "s.store_id" or "o.store_id")',
		/such as s\.store_id\./,
	],
	[
		'aggregate in where',
		'Binder Error: WHERE clause cannot contain aggregates!\n\nLINE 1: SELECT * FROM stores WHERE COUNT(*) > 1',
		'WHERE clause cannot contain aggregates!',
		/use HAVING/,
	],
	[
		'sum of text',
		"Binder Error: No function matches the given name and argument types 'sum(VARCHAR)'. You might need to add explicit type casts.\n\tCandidate functions:\n\tsum(DECIMAL) -> DECIMAL",
		"No function matches the given name and argument types 'sum(VARCHAR)'. You might need to add explicit type casts.",
		/^sum cannot work on VARCHAR values/,
	],
	[
		'text against a number',
		"Conversion Error: Could not convert string 'abc' to INT32\n\nLINE 1: SELECT * FROM stores WHERE store_id = 'abc'",
		"Could not convert string 'abc' to INT32",
		/numbers without quotes/,
	],
	['an unknown message gets no tip', 'Out of Memory Error: something new', 'something new', undefined],
];

for (const [name, message, head, tip] of cases) {
	test(`explain: ${name}`, () => {
		const r = explain(message);
		assert.equal(r.head, head);
		if (tip) assert.match(r.tip ?? '', tip);
		else assert.equal(r.tip, undefined);
	});
}

test('explain: an extra semicolon before WHERE', () => {
	const q = "SELECT * FROM products; WHERE category = 'tea'";
	const r = explain('Parser Error: syntax error at or near "WHERE"\n\nLINE 1: WHERE category = \'tea\'', q);
	assert.match(r.tip ?? '', /^A semicolon ends the query, so WHERE starts a new one/);
	assert.match(r.tip ?? '', /Remove the ; before WHERE/);
});
test('explain: the same message without a semicolon in the query keeps the general tip', () => {
	const r = explain('Parser Error: syntax error at or near "WHERE"', 'SELECT * FROM products WHERE WHERE category = 1');
	assert.match(r.tip ?? '', /Look just before WHERE/);
});
test('explain: curly quotes get their own tip, never a doubled quote', () => {
	const q = 'SELECT * FROM products WHERE category = ‘tea’';
	const r = explain('Binder Error: Referenced column "‘tea’" not found in FROM clause!\nCandidate bindings: "category"', q);
	assert.match(r.tip ?? '', /curly quotes/);
	assert.match(r.tip ?? '', /straight ones/);
	assert.ok(!(r.tip ?? '').includes("'‘"));
	// Also when only the message shows them, and for double curly quotes.
	assert.match(explain('Parser Error: syntax error at or near "“"').tip ?? '', /curly quotes/);
});
test('textLookup finds a text comparison in a one-table query only', () => {
	assert.deepEqual(textLookup("SELECT * FROM products WHERE category = 'Tea';"), { col: 'category', table: 'products', text: 'Tea' });
	assert.deepEqual(textLookup("select name from stores where city='Oakland' -- note"), { col: 'city', table: 'stores', text: 'Oakland' });
	assert.equal(textLookup("SELECT * FROM a JOIN b ON a.id = b.id WHERE a.x = 'Tea'"), null);
	assert.equal(textLookup("SELECT 1; SELECT * FROM products WHERE category = 'Tea'"), null);
	assert.equal(textLookup('SELECT * FROM products WHERE price = 5'), null);
	assert.equal(textLookup("SELECT * FROM products WHERE code = '123'"), null);
});
test('the empty-result tip names the stored spelling when there is one', () => {
	assert.equal(emptyTip('Tea', 'tea'), "No rows. Text must match exactly, including capitals: did you mean 'tea'?");
	assert.match(emptyTip('Tea'), /^No rows\. Text must match exactly/);
	const sql = caseQuery({ col: 'category', table: 'products', text: 'Tea' });
	assert.match(sql, /lower\(category\) = lower\('Tea'\)/);
	assert.match(sql, /category <> 'Tea'/);
});
