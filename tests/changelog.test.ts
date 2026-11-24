import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dayLabel, groupByDay, groupByMonth, monthLabel, parseChangelog, summaryHtml } from '../src/lib/changelog.ts';

const sample = `# Changelog

## [Unreleased]

### Added
- **2026-11-23: Part 6 is published.** Detail that goes on GitHub only.
  - a nested bullet is part of the detail
- **2026-10-02: Older item.** More detail
  over two lines.

### Fixed
- **2026-11-01: A fix.** Detail.
`;

describe('parseChangelog', () => {
	test('reads dated summaries, groups and line numbers; nested bullets are ignored', () => {
		const { entries, problems } = parseChangelog(sample);
		assert.deepEqual(problems, []);
		assert.deepEqual(
			entries.map((e) => [e.line, e.date, e.summary, e.group]),
			[
				[6, '2026-11-23', 'Part 6 is published.', 'Added'],
				[8, '2026-10-02', 'Older item.', 'Added'],
				[12, '2026-11-01', 'A fix.', 'Fixed'],
			],
		);
	});

	test('a bullet without a bold summary, or with an undated one, is reported with its line', () => {
		const { problems } = parseChangelog('### Added\n- Plain bullet.\n- **No date here.** Detail.\n- **2026-11-23: ok.** Detail.\n');
		assert.deepEqual(
			problems.map((p) => p.line),
			[2, 3],
		);
		assert.match(problems[0].message, /no bold summary/);
		assert.match(problems[1].message, /start with a date/);
	});
});

describe('groupByMonth', () => {
	test('newest month first, newest day first, file order breaks ties', () => {
		const months = groupByMonth(parseChangelog(sample).entries);
		assert.deepEqual(
			months.map((m) => [m.month, m.entries.map((e) => e.line)]),
			[
				['2026-11', [6, 12]],
				['2026-10', [8]],
			],
		);
		assert.equal(monthLabel('2026-11'), 'November 2026');
	});
});

describe('groupByDay', () => {
	test('shows each date once and labels it', () => {
		const days = groupByDay([{ date: '2026-11-23' }, { date: '2026-11-23' }, { date: '2026-11-01' }]);
		assert.deepEqual(days.map((d) => [d.date, d.entries.length]), [['2026-11-23', 2], ['2026-11-01', 1]]);
		assert.equal(dayLabel('2026-11-03'), 'Nov 3');
	});
});

describe('summaryHtml', () => {
	const lessons = [
		{ title: 'Telling the story: the right chart and the decision memo', href: '/core/telling-the-story/' },
		{ title: 'Short', href: '/x/' },
	];
	test('links a lesson named by its title or the part before the colon, escapes the rest', () => {
		assert.equal(
			summaryHtml('Telling the story now cites <b> and `a<b`.', lessons),
			'<a href="/core/telling-the-story/">Telling the story</a> now cites &lt;b&gt; and <code translate="no">a&lt;b</code>.',
		);
	});
	test('short titles never link', () => {
		assert.equal(summaryHtml('Short story', lessons), 'Short story');
	});
});

describe('scripts/check-changelog.ts', () => {
	const run = (text: string) => {
		const dir = mkdtempSync(join(tmpdir(), 'changelog-'));
		try {
			const file = join(dir, 'CHANGELOG.md');
			writeFileSync(file, text);
			return spawnSync('node', ['scripts/check-changelog.ts', file], { encoding: 'utf8' });
		} finally {
			rmSync(dir, { recursive: true });
		}
	};
	test('passes when every bullet has a summary', () => {
		assert.equal(run(sample).status, 0);
	});
	test('fails naming the file and line of a bullet without one', () => {
		const r = run('### Added\n- Plain bullet.\n');
		assert.equal(r.status, 1);
		assert.match(r.stderr, /CHANGELOG\.md:2: bullet has no bold summary/);
	});
	test('the real CHANGELOG.md passes', () => {
		const r = spawnSync('node', ['scripts/check-changelog.ts'], { encoding: 'utf8' });
		assert.equal(r.status, 0, r.stderr);
	});
});
