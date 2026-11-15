// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { redirects } from './src/redirects.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://datafromzero.github.io',
	// SPEC §3.2: every URL ends with a trailing slash.
	trailingSlash: 'always',
	// SPEC §3.3: renamed URLs keep working through redirects.
	redirects,
	integrations: [
		starlight({
			title: 'datafromzero',
			// SPEC §8 / D3: English at the root, Vietnamese under /vi/ with the same slugs.
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				vi: { label: 'Tiếng Việt', lang: 'vi' },
			},
		}),
	],
});
