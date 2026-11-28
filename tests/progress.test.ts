import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coveredIds } from '../src/lib/placement.ts';
import { clearAll, countText, DONE_KEY, getDone, getLast, LAST_KEY, MAX_DONE, MAX_RAW, MAX_TITLE, parseDone, parseLast, parseOrder, pickNext, setDone, type Store } from '../src/lib/progress.ts';

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

describe('Continue and Next (pickNext, parseOrder)', () => {
	const order = [
		['excel-a', 'E1', '/excel/a/', 'Rows'],
		['excel-b', 'E2', '/excel/b/', 'Formulas'],
		['excel-c', 'E3', '/excel/c/', 'References'],
		['sql-a', 'S1', '/sql/a/', 'Select'],
	];
	const o = parseOrder(order)!;
	const at = (p: string) => ({ p, c: 'E2', t: 'Formulas' });

	test('a lesson that is not done stays the Continue target', () => {
		assert.deepEqual(pickNext(o, at('/excel/b/'), ['excel-a']), { p: '/excel/b/', c: 'E2', t: 'Formulas', kind: 'continue' });
		assert.equal(pickNext(o, at('/excel/b/'), []).kind, 'continue');
	});
	test('a done lesson moves on to the next one that is not done, in study order', () => {
		assert.deepEqual(pickNext(o, at('/excel/b/'), ['excel-a', 'excel-b']), { p: '/excel/c/', c: 'E3', t: 'References', kind: 'next' });
		// E3 done too: skips it and goes on into the next stage.
		assert.equal(pickNext(o, at('/excel/b/'), ['excel-b', 'excel-c']).p, '/sql/a/');
	});
	test('after the last lesson the search wraps to the start', () => {
		assert.equal(pickNext(o, at('/excel/b/'), ['excel-b', 'excel-c', 'sql-a']).p, '/excel/a/');
	});
	test('everything done, or a lesson not in the order: the last lesson again', () => {
		assert.equal(pickNext(o, at('/excel/b/'), ['excel-a', 'excel-b', 'excel-c', 'sql-a']).kind, 'continue');
		assert.equal(pickNext(o, at('/excel/z/'), ['excel-a']).p, '/excel/z/');
		assert.equal(pickNext([], at('/excel/b/'), ['excel-b']).kind, 'continue');
	});
	test('parseOrder keeps well-formed rows only and returns null for the rest', () => {
		assert.equal(parseOrder(null), null);
		assert.equal(parseOrder({}), null);
		assert.equal(parseOrder([['BAD ID', 'E1', '/excel/a/', 'x']]), null);
		assert.equal(parseOrder([['a', 'E1', '/excel/a', 'x']]), null);
		assert.equal(parseOrder([['a', 'E1', '/excel/a/', '  ']]), null);
		assert.equal(parseOrder([['a', 'E1', '/excel/a/', 'x'], 'junk', ['b', 'nope', '/excel/b/', 'y']])?.length, 1);
	});
	test('coveredIds maps a placement test\'s codes to lesson ids, skipping unknown codes and repeats', () => {
		assert.deepEqual(coveredIds(o, 'E1 E3 S1'), ['excel-a', 'excel-c', 'sql-a']);
		assert.deepEqual(coveredIds(o, 'E3  E3 X9 E1'), ['excel-c', 'excel-a']);
		assert.deepEqual(coveredIds(o, ''), []);
		assert.deepEqual(coveredIds(o, 'P1 P2'), []);
	});
	test('the done button of a lesson imports nothing, statically or dynamically (a dynamic import pulls in a 0.9 KB preload helper)', () => {
		const src = readFileSync(new URL('../src/scripts/lesson-done.ts', import.meta.url), 'utf8').replace(/\/\/.*$/gm, '');
		assert.ok(!/\bimport\b/.test(src));
	});
	test('the order file the build writes has the row shape parseOrder reads', () => {
		const src = readFileSync(new URL('../src/pages/lesson-order.json.ts', import.meta.url), 'utf8');
		assert.ok(src.includes('[l.id, l.code, l.href, l.title]'));
	});
});
