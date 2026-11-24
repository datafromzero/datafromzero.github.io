/**
 * SPEC D59: an Expressive Code plugin that puts `translate="no"` on the outer element of every rendered code block
 * (the `figure.frame`, so the frame title, the code and the copy button stay as written).
 * `translate` is the HTML global attribute that Chrome and Google Translate honor, and descendants inherit it
 * (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/translate).
 * It runs at build time on fenced blocks and on `<Code>` inside components. Inline code is handled by
 * `src/lib/rehype-no-translate.ts`. Written as a plain plugin object (what `definePlugin` returns) so the site
 * needs no direct dependency on `@expressive-code/core`.
 */
interface RenderedBlock {
	renderData: { blockAst: { properties?: Record<string, unknown> } };
}

export function pluginNoTranslate() {
	return {
		name: 'No translate',
		hooks: {
			postprocessRenderedBlock: ({ renderData }: RenderedBlock) => {
				renderData.blockAst.properties = { ...renderData.blockAst.properties, translate: 'no' };
			},
		},
	};
}
