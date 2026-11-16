import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutRoadmap, MAP_WIDTH, ROADMAP_STAGES, wrap, type MapLesson } from '../src/lib/roadmap.ts';

const lesson = (id: string, o: Partial<MapLesson> = {}): MapLesson => ({
	id,
	title: id,
	stage: 'sql',
	order: 10,
	href: `/sql/${id}/`,
	prerequisites: [],
	status: 'published',
	...o,
});

describe('layoutRoadmap', () => {
	test('with no lessons it still shows every stage, in order, inside the viewBox', () => {
		const m = layoutRoadmap([], new Set());
		assert.deepEqual(m.stages.map((s) => s.id), ROADMAP_STAGES.map((s) => s.id));
		assert.ok(m.stages.every((s) => s.lessons.length === 0 && s.href === null));
		assert.ok(m.stages.every((s) => s.x + s.w <= MAP_WIDTH && s.y + s.h <= m.height));
		const ys = m.stages.map((s) => s.y);
		assert.deepEqual(ys, [...ys].sort((a, b) => a - b));
	});

	test('links a stage only when its landing page exists', () => {
		const m = layoutRoadmap([], new Set(['sql']));
		assert.equal(m.stages.find((s) => s.id === 'sql')!.href, '/sql/');
		assert.equal(m.stages.find((s) => s.id === 'excel')!.href, null);
	});

	test('rows follow layers(): a lesson sits below its prerequisites', () => {
		const m = layoutRoadmap([lesson('c', { prerequisites: ['b'], order: 30 }), lesson('b', { prerequisites: ['a'], order: 20 }), lesson('a')], new Set());
		const y = Object.fromEntries(m.stages.find((s) => s.id === 'sql')!.lessons.map((l) => [l.id, l.y]));
		assert.ok(y.a < y.b && y.b < y.c);
	});

	test('lessons of the same layer share a row, then wrap to the next', () => {
		const ls = ['a', 'b', 'c'].map((id, i) => lesson(id, { order: 10 * (i + 1) }));
		const box = layoutRoadmap(ls, new Set()).stages.find((s) => s.id === 'sql')!;
		assert.equal(box.lessons[0].y, box.lessons[1].y);
		assert.ok(box.lessons[2].y > box.lessons[0].y);
		assert.ok(box.lessons.every((l) => l.x + l.w <= box.x + box.w));
	});

	test('a later stage moves down when an earlier stage gets lessons', () => {
		const before = layoutRoadmap([], new Set()).stages.find((s) => s.id === 'python')!.y;
		const after = layoutRoadmap([lesson('a', { stage: 'excel' })], new Set()).stages.find((s) => s.id === 'python')!.y;
		assert.ok(after > before);
	});
});

describe('wrap', () => {
	test('fits short titles on one line', () => assert.deepEqual(wrap('Joining tables', 20), ['Joining tables']));
	test('breaks on words and adds an ellipsis when cut', () => {
		const w = wrap('Window functions for running totals and ranks', 16);
		assert.equal(w.length, 2);
		assert.ok(w.every((l) => l.length <= 16));
		assert.ok(w[1].endsWith('…'));
	});
	test('cuts a single long word', () => assert.deepEqual(wrap('Abcdefghijklmnop', 8), ['Abcdefg…']));
});
