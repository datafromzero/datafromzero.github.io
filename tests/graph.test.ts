import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { checkGraph, cycleErrors, findCycles, layers, orderErrors, referenceErrors, unlocks, type GraphNode } from '../src/lib/graph.ts';

const lesson = (id: string, o: Partial<GraphNode> = {}): GraphNode => ({
	id,
	kind: 'lesson',
	file: `${id}.md`,
	stage: 'sql',
	order: 10,
	status: 'published',
	prerequisites: [],
	...o,
});

describe('findCycles', () => {
	test('a DAG has no cycle', () => {
		const g = [lesson('a'), lesson('b', { prerequisites: ['a'] }), lesson('c', { prerequisites: ['a', 'b'] })];
		assert.deepEqual(findCycles(g), []);
	});
	test('reports the full cycle path', () => {
		const g = [lesson('x'), lesson('a', { prerequisites: ['b'] }), lesson('b', { prerequisites: ['c'] }), lesson('c', { prerequisites: ['a', 'x'] })];
		assert.deepEqual(findCycles(g), [['a', 'b', 'c', 'a']]);
		assert.match(cycleErrors(g)[0], /prerequisite cycle: a -> b -> c -> a/);
	});
	test('a self loop is a cycle', () => {
		assert.deepEqual(findCycles([lesson('a', { prerequisites: ['a'] })]), [['a', 'a']]);
	});
	test('ignores unknown ids (reported elsewhere)', () => {
		assert.deepEqual(findCycles([lesson('a', { prerequisites: ['ghost'] })]), []);
	});
});

describe('orderErrors', () => {
	test('prerequisite in the same stage needs a smaller order', () => {
		const g = [lesson('a', { order: 20 }), lesson('b', { order: 10, prerequisites: ['a'] })];
		assert.equal(orderErrors(g).length, 1);
		assert.match(orderErrors(g)[0], /give "a" a smaller `order` than "b"/);
	});
	test('other stages are not compared', () => {
		const g = [lesson('a', { stage: 'excel', order: 90 }), lesson('b', { order: 10, prerequisites: ['a'] })];
		assert.deepEqual(orderErrors(g), []);
	});
	test('equal order is rejected', () => {
		assert.equal(orderErrors([lesson('a'), lesson('b', { prerequisites: ['a'] })]).length, 1);
	});
});

describe('referenceErrors', () => {
	test('missing ids and draft prerequisites', () => {
		const g = [lesson('a', { status: 'draft' }), lesson('b', { prerequisites: ['a', 'zzz'] })];
		const e = referenceErrors(g).join('\n');
		assert.match(e, /"zzz", which is not an existing lesson id/);
		assert.match(e, /lists draft lesson "a"/);
	});
	test('see_also and used_in', () => {
		const g: GraphNode[] = [
			lesson('a'),
			{ id: 'r', kind: 'reference', file: 'r.md', see_also: ['g', 'a'], used_in: ['a', 'nope'] },
			{ id: 'g', kind: 'glossary', file: 'g.md' },
		];
		const e = referenceErrors(g);
		assert.equal(e.length, 2);
		assert.match(e.join('\n'), /`see_also` references "a"/);
		assert.match(e.join('\n'), /`used_in` references "nope"/);
	});
	test('a valid graph yields no errors', () => {
		assert.deepEqual(checkGraph([lesson('a'), lesson('b', { order: 20, prerequisites: ['a'] })]), []);
	});
});

describe('unlocks', () => {
	const g = [
		lesson('a', { stage: 'excel' }),
		lesson('c', { order: 30, prerequisites: ['a'] }),
		lesson('b', { order: 20, prerequisites: ['a'] }),
		lesson('d', { stage: 'excel', order: 20, prerequisites: ['a'] }),
		lesson('draft', { order: 5, status: 'draft', prerequisites: ['a'] }),
	];
	test('reverse edges, sorted by stage then order, drafts excluded', () => {
		const u = unlocks(g, ['excel', 'sql']);
		assert.deepEqual(u.get('a'), ['d', 'b', 'c']);
		assert.deepEqual(u.get('b'), []);
	});
});

describe('layers', () => {
	test('longest path from a root', () => {
		const g = [
			lesson('a'),
			lesson('b', { prerequisites: ['a'] }),
			lesson('c', { prerequisites: ['a', 'b'] }),
			lesson('d', { prerequisites: ['c'] }),
			lesson('e'),
		];
		assert.deepEqual(Object.fromEntries(layers(g)), { a: 0, e: 0, b: 1, c: 2, d: 3 });
	});
	test('lessons on a cycle get no layer', () => {
		const g = [lesson('a', { prerequisites: ['b'] }), lesson('b', { prerequisites: ['a'] }), lesson('c')];
		assert.deepEqual([...layers(g).keys()], ['c']);
	});
});
