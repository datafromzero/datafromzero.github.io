/**
 * SPEC D59: code is never machine-translated, because copied code must run. This plugin adds `translate="no"` to
 * inline `code`, `kbd`, `samp` and to any `pre` in Markdown and MDX content. Prose and `Term` links stay translatable.
 *
 * The attribute is the HTML `translate` global attribute: `no` means the element's text must not be translated, and
 * automatic translators such as Google Translate respect it (MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/translate,
 * HTML Standard: https://html.spec.whatwg.org/multipage/dom.html#attr-translate). The attribute is inherited by
 * descendants, so one mark on a `pre` or code frame covers everything inside it. `class="notranslate"` is not
 * needed: the standard attribute is the one Chrome and Google Translate document.
 *
 * Fenced code blocks are marked by the Expressive Code plugin in `src/lib/ec-no-translate.ts`, which also covers
 * `<Code>` used inside components (the RunSQL starter block).
 */
interface HastNode {
	type: string;
	tagName?: string;
	/** MDX: a raw `<kbd>` in an .mdx file is a JSX node with a name and attribute list, not an element. */
	name?: string | null;
	attributes?: { type: string; name: string; value: string }[];
	properties?: Record<string, unknown>;
	children?: HastNode[];
}

const CODE_TAGS = new Set(['pre', 'code', 'kbd', 'samp']);

function mark(node: HastNode): void {
	if (node.type === 'element' && node.tagName && CODE_TAGS.has(node.tagName)) {
		node.properties = { ...node.properties, translate: 'no' };
	}
	if ((node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') && node.name && CODE_TAGS.has(node.name)) {
		node.attributes = [...(node.attributes ?? []).filter((a) => a.name !== 'translate'), { type: 'mdxJsxAttribute', name: 'translate', value: 'no' }];
	}
	for (const child of node.children ?? []) mark(child);
}

export function rehypeNoTranslate() {
	return (tree: HastNode) => mark(tree);
}
