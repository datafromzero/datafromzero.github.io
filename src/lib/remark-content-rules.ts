/**
 * Build-time rules for content: `<Solution>` is only valid inside `<Exercise>` (SPEC §6), and headings may not contain math.
 * Runs on every `.mdx` page before rendering; throwing here fails the build with the file path.
 */
interface MdxNode {
	type: string;
	name?: string | null;
	children?: MdxNode[];
	position?: { start: { line: number } };
}

const isJsx = (n: MdxNode) => n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement';

function hasInlineMath(node: MdxNode): boolean {
	return node.type === 'inlineMath' || (node.children ?? []).some(hasInlineMath);
}

function walk(node: MdxNode, insideExercise: boolean, file: string) {
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
