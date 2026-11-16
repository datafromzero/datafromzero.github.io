/**
 * Lighthouse CI (SPEC §12): mobile performance >= 0.9, accessibility >= 0.95 on the homepage, one
 * lesson and one reference page of the fixture build. `scripts/lighthouse.mjs` builds the fixture
 * site and points FIXTURE_DIST at it. Chrome: CHROME_PATH, else /opt/pw-browsers/chromium when present.
 */
const { existsSync } = require('node:fs');

const local = '/opt/pw-browsers/chromium';
const chromePath = process.env.CHROME_PATH || (existsSync(local) ? local : undefined);

module.exports = {
	ci: {
		collect: {
			staticDistDir: process.env.FIXTURE_DIST || './dist',
			url: ['/index.html', '/sql/sql-joins/index.html', '/reference/sql/inner-join/index.html'],
			numberOfRuns: Number(process.env.LHCI_RUNS || 3),
			...(chromePath ? { chromePath } : {}),
			settings: { chromeFlags: '--no-sandbox --headless=new' },
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.9 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
			},
		},
		upload: { target: 'filesystem', outputDir: process.env.LHCI_OUT || '.lighthouseci' },
	},
};
