/**
 * The hours of a career route (SPEC D69). The arithmetic is tested on a small made-up set; the real lessons are
 * tested for the facts the career pages rely on (every route ends at its capstone, a deep dive is left out, the
 * analytics-engineer lessons exist and stand in study order). `npm run check:career-route` compares the pages.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CERTIFICATE_MESSAGE, COMPLETION_TRACKS, NOT_VERIFIED } from '../src/data/completion.ts';
import { aeRoute, code, expectedStrings, href, routeFacts, TRACKS, weeksAt, type RouteLesson } from '../src/lib/career-route.ts';
import { loadRouteLessons } from '../scripts/lib/route-lessons.ts';

const L = (id: string, stage: string, order: number, duration: number, status = 'published'): RouteLesson => ({ id, stage, order, duration, status, title: id, prerequisites: [] });

describe('weeksAt', () => {
	test('rounds a part week up', () => {
		assert.equal(weeksAt(60 * 10, 5), 2);
		assert.equal(weeksAt(60 * 10 + 1, 5), 3);
		assert.equal(weeksAt(60 * 10, 10), 1);
	});
});

describe('routeFacts on a small set', () => {
	const set = [
		L('e1', 'excel', 10, 30),
		L('s1', 'sql', 10, 45),
		L('p1', 'python', 10, 45),
		L('c1', 'core', 10, 60),
		L('de1', 'data-engineer', 10, 60),
		L('de2', 'data-engineer', 20, 120),
		L('dd1', 'data-engineer', 200, 90),
		L('draft', 'data-engineer', 30, 500, 'draft'),
	];
	const f = routeFacts('data-engineer', set);
	test('sums the published main path of every stage and leaves the deep dive and drafts out', () => {
		assert.equal(f.minutes, 30 + 45 + 45 + 60 + 60 + 120);
		assert.equal(f.lessons, 6);
		assert.equal(f.hours, 6);
		assert.deepEqual(f.excluded, { title: 'Deep dive: database internals', lessons: 1, minutes: 90, drafts: 0 });
		assert.equal(f.capstone.id, 'de2');
	});
	test('the strings a page must hold are built from the same numbers', () => {
		const s = expectedStrings(f);
		assert.ok(s.includes('6 hours'));
		assert.ok(s.includes('360 minutes'));
		assert.ok(s.includes('6 lessons'));
		assert.ok(s.includes('2 weeks at 5 hours a week'));
		assert.ok(s.includes('1 weeks at 10 hours a week'));
	});
});

describe('the real lessons', () => {
	const lessons = loadRouteLessons();
	for (const t of TRACKS) {
		test(`${t}: the route ends at a capstone and states a duration for every lesson`, () => {
			const f = routeFacts(t, lessons);
			assert.match(f.capstone.title, /^Capstone: /);
			assert.ok(f.minutes > 6000 && f.minutes < 9500, `${f.minutes} minutes`);
			for (const b of f.breakdown) assert.ok(Number.isInteger(b.minutes) && b.lessons > 0, b.stage);
		});
	}
	test('only the Data Engineer and ML Engineer tracks have a deep dive to leave out', () => {
		for (const t of TRACKS) assert.equal(routeFacts(t, lessons).excluded !== null, t === 'data-engineer' || t === 'ml-engineer', t);
	});
	test('the analytics-engineer route stands in study order, and the dbt lessons start at DE9', () => {
		const ae = aeRoute(lessons);
		assert.equal(code(ae.dbt[0]), 'DE9');
		assert.deepEqual(ae.dbt.map(code), ['DE9', 'DE10', 'DE11a', 'DE11b', 'DE13', 'DE14']);
		assert.deepEqual(ae.da.map(code), ['DA1', 'DA7', 'DA8a', 'DA9', 'DA10', 'DA11', 'DA12']);
		const orders = ae.dbt.map((l) => l.order);
		assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
	});
	test('every Data Engineer lesson the dbt lessons list as a prerequisite is on the route or read back', () => {
		const ae = aeRoute(lessons);
		const known = new Set([...ae.setup, ...ae.dbt, ...ae.back].map((l) => l.id));
		const de = new Set(lessons.filter((l) => l.stage === 'data-engineer').map((l) => l.id));
		for (const l of [...ae.dbt, ...ae.back, ...ae.setup]) {
			for (const p of l.prerequisites.filter((p) => de.has(p) && !known.has(p))) {
				// A prerequisite outside the route must be one the route names as skipped, and the page says what it costs.
				assert.ok(ae.skipped.some((s) => s.id === p), `${l.id} needs ${p}, which the route neither includes nor lists as skipped`);
			}
		}
	});
});

describe('the completion page and the certificate stance (SPEC D69)', () => {
	const lessons = loadRouteLessons();
	test('the page names the four tracks, each with a published capstone whose title and link are right', () => {
		assert.deepEqual(COMPLETION_TRACKS.map((t) => t.id), [...TRACKS]);
		for (const t of COMPLETION_TRACKS) {
			const cap = routeFacts(t.id, lessons).capstone;
			assert.equal(cap.status, 'published');
			assert.equal(t.capstone.title, cap.title, t.id);
			assert.equal(t.capstone.href, href(cap), t.id);
			assert.equal(t.capstone.code, code(cap), t.id);
			assert.ok(t.artifacts.length >= 6 && t.artifacts.length <= 8, `${t.id}: ${t.artifacts.length} artifacts`);
		}
	});
	test('the not-a-certificate line keeps the owner words', () => {
		assert.equal(NOT_VERIFIED, 'This page is not a verified certificate. datafromzero has no accounts and does not check who finished.');
	});
	for (const t of TRACKS) {
		test(`${t}: the page carries the author's message word for word and links the completion page`, () => {
			const page = readFileSync(`src/content/docs/${t}/index.md`, 'utf8');
			assert.ok(page.includes(`> ${CERTIFICATE_MESSAGE}`), 'the message');
			assert.ok(page.includes('](/completion/)'), 'the link');
			assert.match(page, /There is no certificate\./);
		});
	}
});
