import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { DEEP_DIVES, deepDiveLabel, groupRoadmap, isDeepDive, lessonCode, nextLesson, type MapLesson } from '../src/lib/roadmap.ts';
import { buildSidebar } from '../src/lib/sidebar.ts';

const lesson = (id: string, o: Partial<MapLesson> = {}): MapLesson => ({
	id,
	title: id,
	stage: 'data-engineer',
	order: 10,
	href: `/data-engineer/${id}/`,
	prerequisites: [],
	status: 'published',
	...o,
});

describe('deep dives (SPEC D55)', () => {
	test('the constant names the Data Engineer and ML Engineer bands from order 200', () => {
		assert.deepEqual(Object.keys(DEEP_DIVES).sort(), ['data-engineer', 'ml-engineer']);
		assert.ok(Object.values(DEEP_DIVES).every((d) => d.fromOrder === 200));
	});

	test('isDeepDive uses the order band, only for stages that have one', () => {
		assert.equal(isDeepDive('data-engineer', 180), false);
		assert.equal(isDeepDive('data-engineer', 200), true);
		assert.equal(isDeepDive('ml-engineer', 270), true);
		assert.equal(isDeepDive('data-analyst', 500), false);
	});

	test('the label is the title, then the optional note', () => {
		assert.equal(deepDiveLabel('data-engineer'), 'Deep dive: database internals. Optional, not required for a first job.');
		assert.equal(deepDiveLabel('ml-engineer'), 'Deep dive: deep learning and NLP. Optional, not required for a first job.');
		assert.equal(deepDiveLabel('sql'), undefined);
	});

	test('groupRoadmap flags deep-dive lessons and lists the main path first', () => {
		const g = groupRoadmap([lesson('deep', { order: 200 }), lesson('main', { order: 180 })], new Set());
		const de = g.find((s) => s.id === 'data-engineer')!;
		assert.deepEqual(de.lessons.map((l) => [l.id, l.deepDive, l.code]), [['main', false, 'DE18'], ['deep', true, 'DE20']]);
		assert.match(de.deepDiveLabel!, /^Deep dive: database internals/);
		assert.equal(g.find((s) => s.id === 'sql')!.deepDiveLabel, null);
	});

	test('the lesson after the last main-path lesson is the first deep-dive lesson', () => {
		const g = groupRoadmap([lesson('a', { stage: 'ml-engineer', order: 160 }), lesson('b', { stage: 'ml-engineer', order: 200 })], new Set());
		assert.equal(nextLesson(g, 'a')!.id, 'b');
	});

	test('the ML Engineer code prefix is MLE', () => {
		assert.equal(lessonCode('ml-engineer', 160), 'MLE16');
		assert.equal(lessonCode('ml-engineer', 270), 'MLE27');
	});
});

describe('deep dives in the real content and the sidebar', () => {
	const docs = join(process.cwd(), 'src/content/docs');
	const read = (stage: string) =>
		readdirSync(join(docs, stage))
			.filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f))
			.map((f) => parse(readFileSync(join(docs, stage, f), 'utf8').match(/^---\n([\s\S]*?)\n---/)![1]) as { id: string; order: number; prerequisites: string[] });

	for (const stage of Object.keys(DEEP_DIVES)) {
		test(`${stage}: no main-path lesson depends on a deep-dive lesson`, () => {
			const lessons = read(stage);
			const deep = new Set(lessons.filter((l) => isDeepDive(stage, l.order)).map((l) => l.id));
			assert.ok(deep.size >= 8);
			for (const l of lessons.filter((x) => !deep.has(x.id))) {
				assert.deepEqual(l.prerequisites.filter((p) => deep.has(p)), [], l.id);
			}
		});
	}

	test('no main-path lesson in any stage depends on a deep-dive lesson', () => {
		const stages = ['excel', 'sql', 'python', 'core', 'data-analyst', 'data-engineer', 'data-scientist', 'ml-engineer'];
		const all = stages.flatMap((stage) => read(stage).map((l) => ({ ...l, stage })));
		const deep = new Set(all.filter((l) => l.stage in DEEP_DIVES && isDeepDive(l.stage, l.order)).map((l) => l.id));
		assert.ok(deep.size >= 18);
		for (const l of all.filter((x) => !deep.has(x.id))) {
			assert.deepEqual((l.prerequisites ?? []).filter((p) => deep.has(p)), [], l.id);
		}
	});

	test('the sidebar nests the deep dive as a collapsed, labeled group after the main path', () => {
		for (const [label, id, codes] of [
			['Data Engineer', 'data-engineer', /^DE2\d$/],
			['ML / AI Engineer', 'ml-engineer', /^MLE2\d$/],
		] as const) {
			const items = buildSidebar(true).find((g) => g.label === label)!.items;
			const last = items[items.length - 1] as { label: string; collapsed?: boolean; items: { attrs?: Record<string, string> }[] };
			assert.equal(last.label, deepDiveLabel(id));
			assert.equal(last.collapsed, true);
			assert.ok(last.items.every((i) => codes.test(i.attrs!['data-code'])));
			assert.ok(items.slice(0, -1).every((i) => 'link' in i));
		}
	});
});
