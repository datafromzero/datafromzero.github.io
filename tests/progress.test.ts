import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { clearAll, countText, DONE_KEY, getDone, getLast, LAST_KEY, MAX_DONE, MAX_RAW, MAX_TITLE, parseDone, parseLast, setDone, type Store } from '../src/lib/progress.ts';

function memory(initial: Record<string, string> = {}): Store & { data: Map<string, string> } {
	const data = new Map(Object.entries(initial));
	return {
		data,
		getItem: (k) => data.get(k) ?? null,
		setItem: (k, v) => void data.set(k, v),
		removeItem: (k) => void data.delete(k),
	};
}

const blocked: Store = {
	getItem() {
		throw new DOMException('denied', 'SecurityError');
	},
	setItem() {
		throw new DOMException('quota', 'QuotaExceededError');
	},
	removeItem() {
		throw new DOMException('denied', 'SecurityError');
	},
};

const good = { p: '/sql/inner-join/', c: 'S7', t: 'Inner join', at: 1795800000000 };

describe('parseLast', () => {
	test('reads a record as the taskbar writes it', () => {
		assert.deepEqual(parseLast(JSON.stringify(good)), good);
	});
	test('accepts codes with a letter or a decimal part (DA8b, E3.3)', () => {
		assert.equal(parseLast(JSON.stringify({ ...good, c: 'DA8b' }))?.c, 'DA8b');
		assert.equal(parseLast(JSON.stringify({ ...good, c: 'E3.3' }))?.c, 'E3.3');
	});
	test('ignores missing, corrupt and mis-shaped data', () => {
		for (const raw of [null, '', '{', 'null', '[]', '"x"', '42', '{}', JSON.stringify({ ...good, p: undefined })]) {
			assert.equal(parseLast(raw), null, String(raw));
		}
	});
	test('refuses a path that is not a lesson path on this site', () => {
		for (const p of ['//evil.example/x/', 'https://evil.example/a/b/', 'javascript:alert(1)', '/sql/', '/sql/a/b/', '/sql/joins', '/SQL/Joins/', '/a b/c/']) {
			assert.equal(parseLast(JSON.stringify({ ...good, p })), null, p);
		}
	});
	test('refuses a bad code and an empty or non-text title', () => {
		for (const c of ['', 's7', 'S', 'SQL7x1', '<b>', 7]) assert.equal(parseLast(JSON.stringify({ ...good, c })), null, String(c));
		for (const t of ['', '   ', 5, null]) assert.equal(parseLast(JSON.stringify({ ...good, t })), null, String(t));
	});
	test('caps the title and defaults a bad time to 0', () => {
		const r = parseLast(JSON.stringify({ ...good, t: 'x'.repeat(500), at: 'soon' }))!;
		assert.equal(r.t.length, MAX_TITLE);
		assert.equal(r.at, 0);
	});
});

describe('parseDone', () => {
	test('keeps valid ids once each, in order', () => {
		assert.deepEqual(parseDone('["sql-joins","excel-first-formulas","sql-joins"]'), ['sql-joins', 'excel-first-formulas']);
	});
	test('ignores corrupt or wrong-shaped data', () => {
		for (const raw of [null, '', '[', '{}', '"sql-joins"', '7', 'null']) assert.deepEqual(parseDone(raw), [], String(raw));
	});
	test('drops entries that are not lesson ids', () => {
		const raw = JSON.stringify(['ok-id', 7, null, {}, [], '', 'Has Space', 'UPPER', '-lead', 'a'.repeat(81), '<img>']);
		assert.deepEqual(parseDone(raw), ['ok-id']);
	});
	test('caps the list', () => {
		const many = Array.from({ length: MAX_DONE + 50 }, (_, i) => `lesson-${i}`);
		assert.equal(parseDone(JSON.stringify(many)).length, MAX_DONE);
	});
});

describe('storage helpers', () => {
	test('round trip and clear', () => {
		const s = memory();
		assert.equal(setDone(['sql-joins', 'excel-first-formulas'], s), true);
		assert.deepEqual(getDone(s), ['sql-joins', 'excel-first-formulas']);
		s.setItem(LAST_KEY, JSON.stringify(good));
		assert.deepEqual(getLast(s), good);
		assert.equal(clearAll(s), true);
		assert.deepEqual(getDone(s), []);
		assert.equal(getLast(s), null);
		assert.equal(s.data.size, 0);
	});
	test('an empty list removes the key instead of storing []', () => {
		const s = memory({ [DONE_KEY]: '["a-b"]' });
		setDone([], s);
		assert.equal(s.data.has(DONE_KEY), false);
	});
	test('setDone cleans what it writes', () => {
		const s = memory();
		setDone(['good-id', 'BAD ID', 'good-id'], s);
		assert.equal(s.data.get(DONE_KEY), '["good-id"]');
	});
	test('a value over the size limit is not parsed', () => {
		const s = memory({ [DONE_KEY]: JSON.stringify(['a'.repeat(MAX_RAW)]) });
		assert.deepEqual(getDone(s), []);
	});
	test('blocked, full or missing storage never throws', () => {
		assert.deepEqual(getDone(blocked), []);
		assert.equal(getLast(blocked), null);
		assert.equal(setDone(['a-b'], blocked), false);
		assert.equal(clearAll(blocked), false);
		assert.deepEqual(getDone(null), []);
		assert.equal(getLast(null), null);
		assert.equal(setDone(['a-b'], null), false);
		assert.equal(clearAll(null), false);
	});
});

describe('wording and the taskbar', () => {
	test('count text', () => {
		assert.equal(countText(4, 23), '4 of 23 done');
	});
	test('the taskbar script writes the key and the fields this module reads', () => {
		const src = readFileSync(new URL('../src/scripts/taskbar.ts', import.meta.url), 'utf8');
		assert.ok(src.includes(`'${LAST_KEY}'`));
		for (const field of ['p:', 'c:', 't:', 'at:']) assert.ok(src.includes(field), field);
	});
});
