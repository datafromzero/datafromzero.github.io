/**
 * Graph gate (SPEC §12): id references exist, no prerequisite cycles, `order` agrees with the
 * prerequisites. Reads lesson, reference and glossary frontmatter directly (English pages own the ids).
 * Usage: node scripts/check-graph.ts [docs-dir]   (default: src/content/docs)
 */
import { resolve } from 'node:path';
import { checkGraph, type GraphNode } from '../src/lib/graph.ts';
import { readContent } from './lib/content-files.ts';

const root = resolve(process.argv[2] ?? 'src/content/docs');

const nodes: GraphNode[] = [];
const problems: string[] = [];
for (const { file, kind, data } of readContent(root)) {
	if (!data || typeof data.id !== 'string') {
		problems.push(`  - ${file}: frontmatter with an \`id\` is required (run the build for the full schema report)`);
		continue;
	}
	nodes.push({
		id: data.id,
		kind,
		file,
		stage: data.stage as string | undefined,
		order: data.order as number | undefined,
		status: data.status as string | undefined,
		prerequisites: data.prerequisites as string[] | undefined,
		replaced_by: data.replaced_by as string | null | undefined,
		see_also: data.see_also as string[] | undefined,
		used_in: data.used_in as string[] | undefined,
	});
}

const errors = [...problems, ...checkGraph(nodes)];
if (errors.length) {
	console.error(`Graph check failed:\n${errors.join('\n')}`);
	process.exit(1);
}
const lessons = nodes.filter((n) => n.kind === 'lesson').length;
console.log(`Graph check passed: ${lessons} lessons, ${nodes.length - lessons} reference entries and glossary terms.`);
