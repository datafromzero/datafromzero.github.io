import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../workers/feedback/worker.js';

const { blockedCountry, buildIssue, clean, fence, fromSite, hashIp, makeLimiter, neutralizeTitle, parseForm, safePath } = worker.logic;
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

const issueFor = (message: string, lesson_title = 'Joins') => {
	const r = parseForm(form({ message, lesson_title }));
	assert.ok(r.ok);
	return buildIssue(r.value);
};
/** The body without the fenced message: what GitHub would render as Markdown. */
const outsideFence = (body: string) => body.replace(/^(`{3,})text\n[\s\S]*?\n\1$/m, '');

describe('the message is a code block', () => {
	test('a backslash link, an image, a mention, #123 and a github.com issue URL sit only inside the fence', () => {
		const msg = '\\[x](https://evil.example) !\\[i](https://evil.example/a.png) @someone #123 https://github.com/o/r/issues/1';
		const body = issueFor(msg).body;
		assert.ok(body.includes(msg));
		const rest = outsideFence(body);
		for (const bad of ['evil.example', '@someone', '#123', 'github.com/o/r']) assert.ok(!rest.includes(bad), bad);
		assert.match(body, /^```text\n/);
	});
	test('the fence is longer than the longest run of backticks in the message', () => {
		assert.equal(fence('plain').split('\n')[0], '```text');
		const f = fence('a ``` b ````` c\n```');
		assert.equal(f.split('\n')[0], '``````text');
		assert.equal(f.split('\n').at(-1), '``````');
	});
	test('a message that tries to close the fence and add a heading and a link cannot', () => {
		const msg = 'ok\n```\n# Heading\n[click](https://evil.example)\n```';
		const body = issueFor(msg).body;
		const lines = body.split('\n');
		const close = lines.lastIndexOf('````', lines.length);
		assert.ok(lines[0].startsWith('````text'));
		assert.ok(close > lines.indexOf('# Heading'));
		assert.ok(!outsideFence(body).includes('evil.example'));
	});
});

describe('the title', () => {
	test('mentions, issue references, backslashes and github.com addresses are neutralized', () => {
		const t = issueFor('A mistake here.', '@a #4 \\[x] https://github.com/o/r/issues/1').title;
		assert.ok(!new RegExp('@(?!' + ZW + ')').test(t) && !/#\d/.test(t) && !t.includes('\\') && !/github\.com/i.test(t));
		assert.equal(neutralizeTitle('github.com'), 'github' + ZW + '.com');
	});
});

describe('buildIssue', () => {
	test('title, label, page and reviewed date', () => {
		const issue = issueFor('Hi @bob see #3', 'Joins @x #4');
		assert.equal(issue.title, '[feedback] mistake: Joins @' + ZW + 'x #' + ZW + '4');
		assert.deepEqual(issue.labels, ['feedback']);
		assert.match(issue.body, /Page: https:\/\/datafromzero\.github\.io\/sql\/joins\//);
		assert.match(issue.body, /Lesson reviewed: 2026-11-15/);
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

describe('makeLimiter and hashIp', () => {
	test('allows `max` per window per key, then again after the window', () => {
		const ok = makeLimiter(2, 1000);
		assert.ok(ok('a', 0) && ok('a', 10));
		assert.ok(!ok('a', 20));
		assert.ok(ok('b', 20));
		assert.ok(ok('a', 1100));
	});
	test('expired keys are removed on every call, so nothing is held longer than the window', () => {
		const ok = makeLimiter(2, 1000);
		ok('a', 0);
		ok('b', 5);
		assert.equal(ok.size(), 2);
		ok('c', 2000);
		assert.equal(ok.size(), 1);
	});
	test('the key is a salted SHA-256: stable per salt, different per salt, never the address', async () => {
		const s1 = new Uint8Array(16).fill(1);
		const s2 = new Uint8Array(16).fill(2);
		const a = await hashIp('203.0.113.7', s1);
		assert.match(a, /^[0-9a-f]{64}$/);
		assert.ok(!a.includes('203'));
		assert.equal(a, await hashIp('203.0.113.7', s1));
		assert.notEqual(a, await hashIp('203.0.113.7', s2));
		assert.notEqual(a, await hashIp('203.0.113.8', s1));
	});
});

test('safePath', () => {
	assert.equal(safePath('/core/a-b/'), '/core/a-b/');
	assert.equal(safePath('/a?x=1'), null);
	assert.equal(safePath('a'), null);
});

describe('reporting from the site (D37, D58)', () => {
	test('every category the taskbar offers is one the Worker accepts', async () => {
		const { siteUi } = await import('../src/i18n/site-ui.ts');
		for (const lang of ['en', 'vi']) {
			for (const [value] of siteUi(lang).taskbar.reportKinds) {
				assert.ok(parseForm(form({ category: value })).ok, `${lang}: ${value}`);
			}
		}
	});
	test('no page source links to the GitHub issue tracker (owner, 2026-11-25)', async () => {
		const { readdirSync, readFileSync, statSync } = await import('node:fs');
		const walk = (dir: string): string[] =>
			readdirSync(dir).flatMap((f) => {
				const p = `${dir}/${f}`;
				return statSync(p).isDirectory() ? walk(p) : /\.(astro|mdx?|ts)$/.test(f) ? [p] : [];
			});
		const hits = walk('src').filter((p) => readFileSync(p, 'utf8').includes('github.com/datafromzero/datafromzero.github.io/issues') || /\$\{(GITHUB_REPO|repoUrl|repo)\}\/issues/.test(readFileSync(p, 'utf8')));
		assert.deepEqual(hits, []);
	});
});

describe('countries and crawlers (D62)', () => {
	test('a post from China is refused, one from Vietnam or with no country is not', () => {
		assert.equal(blockedCountry({ country: 'CN' }), true);
		assert.equal(blockedCountry({ country: 'cn' }), true);
		for (const cf of [{ country: 'VN' }, { country: 'US' }, {}, undefined]) assert.equal(blockedCountry(cf), false, JSON.stringify(cf));
	});
	test('the Worker answers 403 to a post from a blocked country before reading it', async () => {
		const req = new Request('https://feedback.example/', { method: 'POST', headers: { Origin: 'https://datafromzero.github.io', 'Content-Type': 'application/x-www-form-urlencoded' }, body: form({}).toString() });
		Object.defineProperty(req, 'cf', { value: { country: 'CN' } });
		const res = await worker.fetch(req, {});
		assert.equal(res.status, 403);
		assert.equal(req.bodyUsed, false);
	});
	test('robots.txt keeps the crawlers of Chinese companies out and lets the rest in', async () => {
		const { readFileSync } = await import('node:fs');
		const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
		for (const bot of ['Bytespider', 'Baiduspider', 'PetalBot', 'YisouSpider']) assert.match(robots, new RegExp('^User-agent: ' + bot + '$', 'm'));
		assert.match(robots, /^Disallow: \/$/m);
		assert.match(robots, /^User-agent: \*\nAllow: \/$/m);
		assert.match(robots, /^Sitemap: https:\/\/datafromzero\.github\.io\/sitemap-index\.xml$/m);
	});
});
