// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { redirects } from './src/redirects.ts';
import { SITE_NAME } from './src/site.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://datafromzero.github.io',
	// SPEC §3.2: every URL ends with a trailing slash.
	trailingSlash: 'always',
	// SPEC §3.3: renamed URLs keep working through redirects.
	redirects,
	integrations: [
		starlight({
			title: SITE_NAME,
			// design/README.md §3: white mark on black by default, black mark on white for the light
			// theme. The wordmark is the site title rendered beside the mark.
			logo: {
				dark: './src/assets/logo/logo-dark-bg.svg',
				light: './src/assets/logo/logo-light-bg.svg',
				alt: '',
			},
			favicon: '/favicon.svg',
			// Fonts are self-hosted (@fontsource) so no third-party request happens before consent.
			customCss: [
				'@fontsource/geist/300.css',
				'@fontsource/geist/400.css',
				'@fontsource/geist/500.css',
				'@fontsource/geist/600.css',
				'@fontsource/geist-mono/400.css',
				'@fontsource/geist-mono/500.css',
				'./src/styles/tokens.css',
				'./src/styles/print.css',
			],
			// Code blocks follow the site theme only (never the OS scheme), on gray backgrounds.
			expressiveCode: {
				useDarkModeMediaQuery: false,
				styleOverrides: {
					codeBackground: 'var(--sl-color-gray-6)',
					frames: {
						editorBackground: 'var(--sl-color-gray-6)',
						terminalBackground: 'var(--sl-color-gray-6)',
					},
				},
			},
			// SPEC D9: dark by default, dark/light picker only.
			components: {
				ThemeProvider: './src/components/starlight/ThemeProvider.astro',
				ThemeSelect: './src/components/starlight/ThemeSelect.astro',
			},
			// SPEC §8 / D3: English at the root, Vietnamese under /vi/ with the same slugs.
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				vi: { label: 'Tiếng Việt', lang: 'vi' },
			},
		}),
	],
});
