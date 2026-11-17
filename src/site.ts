// Single source of truth for the site name (design/README.md §7).
// Imported by astro.config.mjs and the pages; never hard-code the name elsewhere.
import pkg from '../package.json' with { type: 'json' };

export const SITE_NAME = 'datafromzero';
export const SITE_URL = 'https://datafromzero.github.io';
/** Author of record for citations and copyright (an organization name, not a person). */
export const AUTHOR_NAME = 'datafromzero';
/** GitHub repository that holds the content (edit and issue links). */
export const GITHUB_REPO = 'datafromzero/datafromzero.github.io';
export const GITHUB_BRANCH = 'main';
/**
 * Vietnamese under /vi/ (SPEC §8, D3). Paused while the English site is finished (D30): no `vi` locale is
 * built, the old /vi/ pages redirect to English (src/redirects.ts) and any page under docs/vi/ fails the
 * build. The translation source src/content/i18n/vi.json is kept; src/i18n/home/vi.ts is in git history.
 */
export const VI_ENABLED = false;
/** Curriculum version (SPEC §9); package.json `version` until releases are tagged. */
export const CURRICULUM_VERSION: string = pkg.version;
/** Year of first publication, used for citations until the first release date exists (SPEC §9). */
export const FIRST_YEAR = 2026;
/**
 * Google Analytics 4 Measurement ID (SPEC §11, D8). Empty = analytics off: no banner, no GA code,
 * no "Cookie settings" link and no added JavaScript anywhere. Set to `G-XXXXXXXXXX` to turn it on.
 */
export const GA_ID = 'G-0TNDBK1ZJX'; // cspell:disable-line
/** Event-data retention configured in GA4 (e.g. '14 months'); required before GA_ID is set. */
export const GA_RETENTION = '2 months';
export const ANALYTICS_ENABLED = GA_ID !== '';
if (ANALYTICS_ENABLED && GA_RETENTION === '') {
	throw new Error('src/site.ts: set GA_RETENTION (the GA4 data retention period) before enabling analytics; /privacy/ must state it.');
}
