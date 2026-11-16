/**
 * Build-time rules for content: `<Solution>` is only valid inside `<Exercise>` (SPEC §6), and headings may not contain math.
 * Runs on every `.md` and `.mdx` page before rendering; throwing here fails the build with the file path.
 */
interface MdxNode {
	type: string;
	name?: string | null;
	children?: MdxNode[];
	value?: string;
	attributes?: { type: string; name?: string; value?: unknown }[];
	position?: { start: { line: number } };
}

/** SPEC §6: the only components content may use. Auto-imported in astro.config.mjs. */
const ALLOWED = new Set(['Exercise', 'Solution', 'OpenInColab', 'OpenInSheets', 'Term', 'Aside']);

const where = (file: string, n: MdxNode) => `${file}${n.position ? `:${n.position.start.line}` : ''}`;

const isJsx = (n: MdxNode) => n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement';

function hasInlineMath(node: MdxNode): boolean {
	return node.type === 'inlineMath' || (node.children ?? []).some(hasInlineMath);
}

function checkSpec6(node: MdxNode, file: string) {
	// Imports injected by astro-auto-import have an empty value; anything an author wrote has source text.
	if (node.type === 'mdxjsEsm' && node.value) {
		throw new Error(
			`${where(file, node)}: import/export statements are not allowed in content (SPEC §6). ` +
				'Exercise, Solution, OpenInColab, OpenInSheets, Term and Aside are available without imports.',
		);
	}
	if (isJsx(node)) {
		const name = node.name;
		if (name === 'script') throw new Error(`${where(file, node)}: <script> is not allowed in content (SPEC §6).`);
		if (name && /^[A-Z]/.test(name) && !ALLOWED.has(name)) {
			throw new Error(
				`${where(file, node)}: <${name}> is not an allowed component (SPEC §6). Allowed: ${[...ALLOWED].join(', ')}.`,
			);
		}
		// Script can also arrive through attributes: set:html, event handlers or javascript: URLs.
		for (const attr of node.attributes ?? []) {
			if (attr.type !== 'mdxJsxAttribute' || !attr.name) {
				if (attr.type === 'mdxJsxExpressionAttribute')
					throw new Error(`${where(file, node)}: spread attributes are not allowed in content (SPEC §6).`);
				continue;
			}
			if (attr.name === 'set:html' || attr.name === 'set:text' || /^on/i.test(attr.name))
				throw new Error(`${where(file, node)}: the "${attr.name}" attribute is not allowed in content (SPEC §6).`);
			if (typeof attr.value === 'string' && /^\s*javascript:/i.test(attr.value))
				throw new Error(`${where(file, node)}: javascript: URLs are not allowed in content (SPEC §6).`);
		}
		if (name === null || name === undefined) return; // fragments are harmless
		if (name.includes('.') || name.includes(':')) {
			throw new Error(`${where(file, node)}: <${name}> is not an allowed component (SPEC §6).`);
		}
	}
	if (node.type === 'html' && node.value) {
		if (/<\s*script[\s>/]/i.test(node.value)) {
			throw new Error(`${where(file, node)}: <script> is not allowed in content (SPEC §6).`);
		}
		if (/<[^>]*\son[a-z]+\s*=/i.test(node.value)) {
			throw new Error(`${where(file, node)}: event handler attributes (on…=) are not allowed in content (SPEC §6).`);
		}
		if (/(?:href|src|action|formaction)\s*=\s*["']?\s*javascript:/i.test(node.value)) {
			throw new Error(`${where(file, node)}: javascript: URLs are not allowed in content (SPEC §6).`);
		}
		for (const m of node.value.matchAll(/<\s*([A-Z][A-Za-z0-9]*)[\s>/]/g)) {
			if (!ALLOWED.has(m[1])) throw new Error(`${where(file, node)}: <${m[1]}> is not an allowed component (SPEC §6).`);
		}
	}
}

function walk(node: MdxNode, insideExercise: boolean, file: string) {
	checkSpec6(node, file);
	if (node.type === 'heading' && hasInlineMath(node)) {
		const line = node.position?.start.line;
		throw new Error(
			`${file}${line ? `:${line}` : ''}: math ($…$) is not allowed in headings; it breaks heading ids and the table of contents. Put the formula in the paragraph below the heading.`,
		);
	}
	const inside = insideExercise || (isJsx(node) && node.name === 'Exercise');
	if (isJsx(node) && node.name === 'Solution' && !insideExercise) {
		const line = node.position?.start.line;
		throw new Error(
			`${file}${line ? `:${line}` : ''}: <Solution> must be placed inside <Exercise> (SPEC §6). ` +
				'Wrap it: <Exercise id="{lesson-id}-1"> … <Solution> … </Solution> </Exercise>.',
		);
	}
	for (const child of node.children ?? []) walk(child, inside, file);
}

export function remarkContentRules() {
	return (tree: MdxNode, file: { path?: string }) => walk(tree, false, file.path ?? 'content');
}
