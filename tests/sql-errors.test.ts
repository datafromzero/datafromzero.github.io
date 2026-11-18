// The plain-words errors of the SQL runner (SPEC D42). The messages are real DuckDB-Wasm 1.32.0 output, captured by
// running each wrong query; a rule without a captured message here must not exist.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { explain } from '../src/scripts/sql-errors.ts';

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
