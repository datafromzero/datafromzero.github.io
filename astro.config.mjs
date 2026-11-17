// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import starlightLinksValidator from 'starlight-links-validator';
import AutoImport from 'astro-auto-import';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkContentRules } from './src/lib/remark-content-rules.ts';
import { redirects } from './src/redirects.ts';
import { SITE_NAME, SITE_URL, VI_ENABLED } from './src/site.ts';
import { SPECULATION_RULES } from './src/lib/speculation-rules.ts';
import { buildSidebar } from './src/lib/sidebar.ts';

// https://astro.build/config
export default defineConfig({
	// Fonts stay separate files: inlined as base64 they bloated the render-blocking stylesheet
	// (rarely used subsets included) and could not be cached or skipped via unicode-range.
	vite: {
		build: {
			assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
		},
	},
	site: SITE_URL,
	// SPEC §3.2: every URL ends with a trailing slash.
	trailingSlash: 'always',
	// SPEC §3.3: renamed URLs keep working through redirects.
	redirects,
	// SPEC D27: Astro's JS prefetch script is off; Speculation Rules (a JSON block in <head>) replace it.
	prefetch: false,
	markdown: {
		// SPEC §2 / §6: formulas in $…$ and $$…$$, rendered to MathML only (no KaTeX CSS, fonts or JS).
		// `unified()` keeps the remark/rehype pipeline that these plugins need.
		processor: unified({
			remarkPlugins: [remarkMath, remarkContentRules],
			rehypePlugins: [[rehypeKatex, { output: 'mathml' }]],
		}),
	},
	integrations: [
		starlight({
			title: SITE_NAME,
			// Get started, then the lessons by stage with their codes, then the project pages (src/lib/sidebar.ts).
			sidebar: buildSidebar(process.argv.includes('dev')),
			// design/README.md §3: white mark on black by default, black mark on white for the light
			// theme. The wordmark is the site title rendered beside the mark.
			logo: {
				dark: './src/assets/logo/logo-dark-bg.svg',
				light: './src/assets/logo/logo-light-bg.svg',
				alt: '',
			},
			// SPEC §12: broken internal links and anchors fail the build.
			plugins: [starlightLinksValidator()],
			favicon: '/favicon.svg',
			head: [{ tag: 'script', attrs: { type: 'speculationrules' }, content: SPECULATION_RULES }],
			// Fonts are self-hosted (@fontsource) so no third-party request happens before consent.
			customCss: [
				'@fontsource/geist/300.css',
				'@fontsource/geist/400.css',
				'@fontsource/geist/500.css',
				'@fontsource/geist/600.css',
				'@fontsource/geist-mono/400.css',
				'@fontsource/geist-mono/500.css',
				'./src/styles/tokens.css',
				'./src/styles/math.css',
				'./src/styles/transitions.css',
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
				Head: './src/components/starlight/Head.astro',
				ThemeProvider: './src/components/starlight/ThemeProvider.astro',
				ThemeSelect: './src/components/starlight/ThemeSelect.astro',
				// Lesson header and footer (SPEC §5.1); both render nothing on non-lesson pages.
				PageTitle: './src/components/starlight/PageTitle.astro',
				Footer: './src/components/starlight/Footer.astro',
				// The consent banner at the top of the content, in normal flow (SPEC §11).
				Banner: './src/components/starlight/Banner.astro',
				// Search sheet on phones, glass dialog on desktop, "where to begin" links (SPEC D36).
				Search: './src/components/starlight/Search.astro',
			},
			// SPEC §8 / D3: English at the root, Vietnamese under /vi/ with the same slugs. Vietnamese is paused
			// (D30): with the root locale alone the site is monolingual, so there is no language picker.
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				...(VI_ENABLED ? { vi: { label: 'Tiếng Việt', lang: 'vi' } } : {}),
			},
		}),
		// SPEC §6: the six allowed components are available in every .mdx without import lines.
		// order matters: Starlight first (its code-block integration must precede MDX), then auto-import,
		// then MDX, because auto-import only hooks in when MDX is registered after it.
		AutoImport({
			imports: [
				{
					'./src/components/content/index.ts': ['Exercise', 'Solution', 'OpenInColab', 'OpenInSheets', 'Term'],
					'@astrojs/starlight/components': ['Aside'],
				},
			],
		}),
		// Starlight enables MDX optimize when it registers MDX itself; keep the same output.
		mdx({ optimize: true }),
	],
});
