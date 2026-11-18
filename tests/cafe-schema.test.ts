// The Tables panel of the SQL runner (SPEC D42) is built from datasets/cafe-sales/v1/cafe-sales.sql. Its row counts
// must equal the CSV files the engine loads, so the panel and the data cannot disagree.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cafeSchema } from '../src/lib/cafe-schema.ts';

test('five tables with the CSV row counts', () => {
	const tables = cafeSchema();
	assert.deepEqual(tables.map((t) => t.name), ['stores', 'customers', 'products', 'orders', 'order_items']);
	for (const t of tables) {
		const csv = readFileSync(`datasets/cafe-sales/v1/${t.name}.csv`, 'utf8').trim().split('\n');
		assert.equal(t.rows, csv.length - 1, `${t.name} rows`);
		assert.deepEqual(t.columns.map((c) => c.name), csv[0].split(','), `${t.name} columns`);
	}
});
test('column types are read from the CREATE statements', () => {
	const products = cafeSchema().find((t) => t.name === 'products')!;
	assert.deepEqual(products.columns.at(-1), { name: 'unit_price_usd', type: 'DECIMAL(6,2)' });
});
