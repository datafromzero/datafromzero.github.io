import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { groupRoadmap, lessonCode, ROADMAP_STAGES, type MapLesson } from '../src/lib/roadmap.ts';

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

describe('lessonCode', () => {
	test('stage prefix plus order / 10', () => {
		assert.equal(lessonCode('excel', 10), 'E1');
		assert.equal(lessonCode('excel', 220), 'E22');
		assert.equal(lessonCode('sql', 80), 'S8');
		assert.equal(lessonCode('data-analyst', 30), 'DA3');
		assert.equal(lessonCode('ml-engineer', 120), 'ML12');
	});
	test('an inserted lesson keeps its neighbors codes', () => {
		assert.equal(lessonCode('excel', 25), 'E2.5');
	});
	test('unknown stage has no code', () => {
		assert.equal(lessonCode('nope', 10), undefined);
	});
});

describe('groupRoadmap', () => {
	test('every stage, in order, numbered 01 to 08, even with no lessons', () => {
		const g = groupRoadmap([], new Set());
		assert.deepEqual(g.map((s) => s.id), ROADMAP_STAGES.map((s) => s.id));
		assert.deepEqual(g.map((s) => s.number), ['01', '02', '03', '04', '05', '06', '07', '08']);
		assert.ok(g.every((s) => s.lessons.length === 0 && s.href === null));
	});

	test('links a stage only when its landing page exists', () => {
		const g = groupRoadmap([], new Set(['sql']));
		assert.equal(g.find((s) => s.id === 'sql')!.href, '/sql/');
		assert.equal(g.find((s) => s.id === 'excel')!.href, null);
	});

	test('lessons sorted by order, with codes and prerequisite codes across stages', () => {
		const g = groupRoadmap(
			[
				lesson('c', { order: 30, prerequisites: ['b', 'x'] }),
				lesson('b', { order: 20, prerequisites: ['a'] }),
				lesson('a', { order: 10, prerequisites: ['e1'] }),
				lesson('e1', { stage: 'excel', order: 10, href: '/excel/e1/' }),
			],
			new Set(),
		);
		const sql = g.find((s) => s.id === 'sql')!;
		assert.deepEqual(sql.lessons.map((l) => l.code), ['S1', 'S2', 'S3']);
		assert.deepEqual(sql.lessons[0].needs, ['E1']);
		// 'x' is not on the roadmap (a draft), so it is not listed.
		assert.deepEqual(sql.lessons[2].needs, ['S2']);
		assert.deepEqual(g.find((s) => s.id === 'excel')!.lessons.map((l) => l.code), ['E1']);
	});
});
