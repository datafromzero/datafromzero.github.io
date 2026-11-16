/** Reads the frontmatter of English lesson, reference and glossary pages for the maintenance scripts. */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';
import { classify, type Kind } from '../../src/lib/content-schemas.ts';

export interface ContentFile {
	/** Path relative to the working directory, for messages. */
	file: string;
	kind: 'lesson' | 'reference' | 'glossary';
	/** Parsed frontmatter, or null when missing or not valid YAML. */
	data: Record<string, unknown> | null;
}

function* markdownFiles(dir: string): Generator<string> {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) yield* markdownFiles(p);
		else if (/\.mdx?$/.test(e.name)) yield p;
	}
}

export function readContent(root: string, kinds: readonly Kind[] = ['lesson', 'reference', 'glossary']): ContentFile[] {
	const out: ContentFile[] = [];
	for (const path of [...markdownFiles(root)].sort()) {
		const c = classify(relative(root, path).replace(/\\/g, '/').replace(/\.mdx?$/, ''));
		if (c.locale !== null || !c.kind || !kinds.includes(c.kind)) continue;
		const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, 'utf8'));
		let data: Record<string, unknown> | null = null;
		try {
			data = m ? (parse(m[1]) as Record<string, unknown>) : null;
		} catch {
			/* reported by the caller */
		}
		out.push({ file: relative(process.cwd(), path), kind: c.kind as ContentFile['kind'], data });
	}
	return out;
}
