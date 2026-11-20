/**
 * SPEC D51: a TeX error fails the build. rehype-katex does not throw on bad TeX: it ships a red `span.katex-error`
 * (with the message in `title`) and only warns. This plugin runs right after it and throws for any such element,
 * naming the file and line, so broken math never reaches readers.
 */
interface HastNode {
	type: string;
	tagName?: string;
	properties?: { className?: unknown; title?: unknown };
	children?: HastNode[];
	position?: { start: { line: number } };
}

const hasErrorClass = (n: HastNode) => {
	const c = n.properties?.className;
	return Array.isArray(c) ? c.includes('katex-error') : typeof c === 'string' && c.split(/\s+/).includes('katex-error');
};

function find(node: HastNode): HastNode | undefined {
	if (node.type === 'element' && hasErrorClass(node)) return node;
	for (const child of node.children ?? []) {
		const hit = find(child);
		if (hit) return hit;
	}
	return undefined;
}

export function rehypeMathErrors() {
	return (tree: HastNode, file: { path?: string }) => {
		const bad = find(tree);
		if (!bad) return;
		const line = bad.position?.start.line;
		const title = typeof bad.properties?.title === 'string' ? bad.properties.title : 'invalid TeX';
		throw new Error(`${file.path ?? 'content'}${line ? `:${line}` : ''}: TeX error in a formula: ${title}`);
	};
}
