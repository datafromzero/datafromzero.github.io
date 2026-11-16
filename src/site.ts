// Single source of truth for the site name (design/README.md §7).
// Imported by astro.config.mjs and the pages; never hard-code the name elsewhere.
import pkg from '../package.json' with { type: 'json' };

export const SITE_NAME = 'datafromzero';
export const SITE_URL = 'https://datafromzero.github.io';
export const AUTHOR_NAME = 'Nguyen "John" Ha';
/** GitHub repository that holds the content (edit and issue links). */
export const GITHUB_REPO = 'datafromzero/datafromzero.github.io';
export const GITHUB_BRANCH = 'main';
/** Curriculum version (SPEC §9); package.json `version` until releases are tagged. */
export const CURRICULUM_VERSION: string = pkg.version;
/** Year of first publication, used for citations until the first release date exists (SPEC §9). */
export const FIRST_YEAR = 2026;
/**
 * Google Analytics 4 Measurement ID (SPEC §11, D8). Empty = analytics off: no banner, no GA code,
 * no "Cookie settings" link and no added JavaScript anywhere. Set to `G-XXXXXXXXXX` to turn it on.
 */
export const GA_ID = '';
export const ANALYTICS_ENABLED = GA_ID !== '';
