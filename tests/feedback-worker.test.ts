import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/feedback/worker.js';

const { buildIssue, clean, fromSite, makeLimiter, neutralize, parseForm, quote, safePath } = worker.logic;
const ZW = String.fromCharCode(0x200b);
const U = (...c: number[]) => String.fromCharCode(...c);

const form = (o: Record<string, string>) => new URLSearchParams({ category: 'mistake', message: 'The sum in step 3 is 41, not 14.', page: '/sql/joins/', lesson_id: 'sql-joins', lesson_title: 'Joins', reviewed: '2026-11-15', website: '', ...o });

describe('parseForm', () => {
	test('accepts a complete message', () => {
		const r = parseForm(form({}));
		assert.ok(r.ok);
		assert.equal(r.ok && r.value.pageUrl, 'https://datafromzero.github.io/sql/joins/');
	});
	test('a filled honeypot is reported as a bot', () => {
		assert.deepEqual(parseForm(form({ website: 'x' })), { ok: false, reason: 'honeypot' });
	});
	test('rejects an unknown category, a short or long message, a bad path, date or id', () => {
		for (const bad of [{ category: 'spam' }, { message: 'no' }, { message: 'a'.repeat(2001) }, { page: 'https://evil.example/' }, { page: '/a//b/' }, { reviewed: 'yesterday' }, { lesson_id: 'Bad Id' }]) {
			assert.deepEqual(parseForm(form(bad)), { ok: false, reason: 'invalid' }, JSON.stringify(bad));
		}
	});
	test('accepts exactly 2000 characters and counts characters, not bytes', () => {
		assert.ok(parseForm(form({ message: 'e'.repeat(1999) + U(0xe9) })).ok);
	});
	test('a missing lesson title falls back to the path; a long one is cut', () => {
		const a = parseForm(form({ lesson_title: '' }));
		assert.equal(a.ok && a.value.lessonTitle, '/sql/joins/');
		const b = parseForm(form({ lesson_title: 'T'.repeat(500) }));
		assert.equal(b.ok && b.value.lessonTitle.length, 120);
	});
});

describe('clean', () => {
	test('strips control, zero-width and bidi characters but keeps new lines and tabs', () => {
		assert.equal(clean('a' + U(0) + 'b' + U(7) + 'c' + U(0x202e) + 'd' + U(0x200b) + 'e' + U(0xfeff) + 'f\tg\r\nh\ri'), 'abcdef\tg\nh\ni');
	});
});

describe('neutralize and quote', () => {
	test('mentions and issue references cannot link', () => {
		const out = neutralize('ping @someone and @org/team, see #12 and GH-7 and ' + U(0xff20) + 'x');
		assert.ok(!new RegExp('@(?!' + ZW + ')').test(out) && !new RegExp(U(0xff20) + '(?!' + ZW + ')').test(out));
		assert.ok(!/#\d/.test(out) && !/GH-\d/i.test(out));
	});
	test('HTML and link syntax is escaped', () => {
		assert.equal(neutralize('<img src=x> [a](http://x)'), '&lt;img src=x&gt; \\[a\\](http://x)');
	});
	test('every line is quoted, so a heading, list or fence cannot start', () => {
		assert.equal(quote('# big\n\n- item\n```js'), '> # big\n>\n> - item\n> \\`\\`\\`js');
	});
});

describe('buildIssue', () => {
	test('title, label, page and reviewed date; no sender data fields exist', () => {
		const r = parseForm(form({ message: 'Hi @bob see #3', lesson_title: 'Joins @x #4' }));
		assert.ok(r.ok);
		const issue = buildIssue(r.value);
		assert.equal(issue.title, '[feedback] mistake: Joins @' + ZW + 'x #' + ZW + '4');
		assert.deepEqual(issue.labels, ['feedback']);
		assert.match(issue.body, /Page: https:\/\/datafromzero\.github\.io\/sql\/joins\//);
		assert.match(issue.body, /Lesson reviewed: 2026-11-15/);
		assert.ok(!new RegExp('@(?!' + ZW + ')').test(issue.body));
	});
});

describe('fromSite', () => {
	test('Origin must match exactly; the Referer is used only when there is no Origin', () => {
		assert.ok(fromSite('https://datafromzero.github.io', null));
		assert.ok(!fromSite('https://datafromzero.github.io.evil.example', null));
		assert.ok(!fromSite('null', 'https://datafromzero.github.io/x/'));
		assert.ok(fromSite(null, 'https://datafromzero.github.io/x/'));
		assert.ok(!fromSite(null, 'https://datafromzero.github.io.evil.example/x/'));
		assert.ok(!fromSite(null, null));
	});
});

describe('makeLimiter', () => {
	test('allows `max` per window per key, then again after the window', () => {
		const ok = makeLimiter(2, 1000);
		assert.ok(ok('a', 0) && ok('a', 10));
		assert.ok(!ok('a', 20));
		assert.ok(ok('b', 20));
		assert.ok(ok('a', 1100));
	});
});

test('safePath', () => {
	assert.equal(safePath('/core/a-b/'), '/core/a-b/');
	assert.equal(safePath('/a?x=1'), null);
	assert.equal(safePath('a'), null);
});
