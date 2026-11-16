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
