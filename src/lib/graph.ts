/**
 * Prerequisite graph rules (SPEC §5.1, §12). Pure TypeScript: no Astro imports, so the build
 * (content-validation.ts), `scripts/check-graph.ts` and the unit tests all share it.
 *
 * Model: every lesson is a vertex; an edge `L -> P` means "lesson L lists P in `prerequisites`".
 * V = lessons, E = prerequisite links. Every algorithm below is O(V + E) unless noted
 * Reference: CLRS, 4th ed., ch. 20 "Elementary Graph Algorithms" (DFS §20.3, topological sort §20.4)
 * and ch. 22 "Single-Source Shortest Paths" (shortest paths in a DAG §22.2, used for longest layers).
 */

export type NodeKind = 'lesson' | 'reference' | 'glossary';

export interface GraphNode {
	id: string;
	kind: NodeKind;
	/** Path shown in messages. */
	file: string;
	/** Lessons only. */
	stage?: string;
	order?: number;
	status?: string;
	prerequisites?: string[];
	replaced_by?: string | null;
	/** References only. */
	see_also?: string[];
	used_in?: string[];
}

const line = (file: string, text: string) => `  - ${file}: ${text}`;

/**
 * Id-reference rules: every referenced id exists, drafts are not referenced by published pages,
 * deprecated lessons have a valid replacement. O(V + E): one map build, one pass over the edges.
 * Messages are the build's own (formerly in content-validation.ts).
 */
export function referenceErrors(nodes: GraphNode[]): string[] {
	const errors: string[] = [];
	const lessons = new Map<string, GraphNode>();
	const seeAlso = new Set<string>();
	for (const n of nodes) {
		if (n.kind === 'lesson') lessons.set(n.id, n);
		else seeAlso.add(n.id); // see_also may point to reference entries and glossary terms only (SPEC §5.2)
	}
	for (const n of nodes) {
		const missing = (field: string, ids: string[] | undefined, known: { has(id: string): boolean }, what: string) => {
			for (const ref of ids ?? [])
				if (!known.has(ref)) errors.push(line(n.file, `\`${field}\` references "${ref}", which is not an existing ${what} id`));
		};
		if (n.kind === 'lesson') {
			missing('prerequisites', n.prerequisites, lessons, 'lesson');
			if (n.status !== 'draft') {
				for (const ref of n.prerequisites ?? [])
					if (lessons.get(ref)?.status === 'draft')
						errors.push(line(n.file, `lesson "${n.id}" (${String(n.status)}) lists draft lesson "${ref}" in \`prerequisites\`; publish it first`));
				const r = n.replaced_by;
				if (r && lessons.get(r)?.status === 'draft')
					errors.push(line(n.file, `lesson "${n.id}" (${String(n.status)}) has \`replaced_by\` "${r}", which is a draft lesson`));
			}
			if (n.status === 'deprecated' && !n.replaced_by)
				errors.push(line(n.file, '`replaced_by` is required when status is "deprecated"'));
			if (n.replaced_by) missing('replaced_by', [n.replaced_by], lessons, 'lesson');
			if (n.replaced_by && n.replaced_by === n.id) errors.push(line(n.file, '`replaced_by` cannot point to the lesson itself'));
		}
		if (n.kind === 'reference') {
			missing('see_also', n.see_also, seeAlso, 'reference or glossary');
			missing('used_in', n.used_in, lessons, 'lesson');
			for (const ref of n.used_in ?? [])
				if (lessons.get(ref)?.status === 'draft')
					errors.push(line(n.file, `\`used_in\` lists draft lesson "${ref}"; drafts are never deployed (SPEC D18)`));
		}
	}
	return errors;
}

/** Prerequisite adjacency (lesson -> its prerequisites), keeping only ids that exist. */
function prerequisiteEdges(nodes: GraphNode[]): Map<string, string[]> {
	const lessons = nodes.filter((n) => n.kind === 'lesson');
	const known = new Set(lessons.map((n) => n.id));
	return new Map(lessons.map((n) => [n.id, (n.prerequisites ?? []).filter((p) => known.has(p))]));
}

/**
 * Finds prerequisite cycles with depth-first search and white/gray/black coloring (CLRS §20.3):
 * white = unvisited, gray = on the current DFS path, black = finished. An edge to a gray vertex is
 * a back edge and closes a cycle; the cycle is read off the DFS path. O(V + E). Each cycle found
 * is returned once as an id path whose first and last ids are equal, e.g. `a -> b -> c -> a`
 * (each lesson requires the next).
 */
export function findCycles(nodes: GraphNode[]): string[][] {
	const edges = prerequisiteEdges(nodes);
	const color = new Map<string, 'white' | 'gray' | 'black'>();
	for (const id of edges.keys()) color.set(id, 'white');
	const cycles: string[][] = [];
	const path: string[] = [];
	const visit = (u: string) => {
		color.set(u, 'gray');
		path.push(u);
		for (const v of edges.get(u)!) {
			if (color.get(v) === 'white') visit(v);
			else if (color.get(v) === 'gray') cycles.push([...path.slice(path.indexOf(v)), v]);
		}
		path.pop();
		color.set(u, 'black');
	};
	for (const id of edges.keys()) if (color.get(id) === 'white') visit(id);
	return cycles;
}

export function cycleErrors(nodes: GraphNode[]): string[] {
	const file = new Map(nodes.map((n) => [n.id, n.file]));
	return findCycles(nodes).map((c) => line(file.get(c[0])!, `prerequisite cycle: ${c.join(' -> ')} (each lesson requires the next)`));
}

/**
 * Within one stage, `order` must be a topological order of the prerequisites: a prerequisite in the
 * same stage needs a smaller `order` than the lesson that requires it. One pass over the edges, O(V + E).
 */
export function orderErrors(nodes: GraphNode[]): string[] {
	const errors: string[] = [];
	const lessons = new Map(nodes.filter((n) => n.kind === 'lesson').map((n) => [n.id, n]));
	for (const n of lessons.values()) {
		for (const ref of n.prerequisites ?? []) {
			const p = lessons.get(ref);
			if (p && p.stage === n.stage && n.order !== undefined && p.order !== undefined && p.order >= n.order)
				errors.push(
					line(n.file, `lesson "${n.id}" (order ${n.order}) requires "${p.id}" (order ${p.order}) in the same stage "${n.stage}"; give "${p.id}" a smaller \`order\` than "${n.id}"`),
				);
		}
	}
	return errors;
}

/** Everything the graph gate checks: references, cycles, order. */
export function checkGraph(nodes: GraphNode[]): string[] {
	return [...referenceErrors(nodes), ...cycleErrors(nodes), ...orderErrors(nodes)];
}

/**
 * Reverse edges: lesson id -> ids of lessons that list it as a prerequisite ("unlocks next").
 * Drafts are never count as unlocking. Result lists are sorted by stage order given in `stageOrder`
 * (when provided) and then by `order`, then id. O(V + E) plus sorting each list.
 */
export function unlocks(nodes: GraphNode[], stageOrder: readonly string[] = []): Map<string, string[]> {
	const lessons = nodes.filter((n) => n.kind === 'lesson');
	const byId = new Map(lessons.map((n) => [n.id, n]));
	const out = new Map<string, string[]>(lessons.map((n) => [n.id, []]));
	for (const n of lessons) {
		if (n.status === 'draft') continue;
		for (const p of n.prerequisites ?? []) out.get(p)?.push(n.id);
	}
	const rank = (s: string | undefined) => {
		const i = stageOrder.indexOf(s ?? '');
		return i < 0 ? stageOrder.length : i;
	};
	for (const list of out.values()) {
		list.sort((a, b) => {
			const x = byId.get(a)!;
			const y = byId.get(b)!;
			return rank(x.stage) - rank(y.stage) || (x.order ?? 0) - (y.order ?? 0) || a.localeCompare(b);
		});
	}
	return out;
}

/**
 * Longest-path layers for the roadmap map (milestone 7): layer 0 has no prerequisites, otherwise
 * 1 + the largest layer among its prerequisites. Computed over the DAG in topological order with
 * Kahn's algorithm (CLRS §20.4 gives the DFS variant; both are O(V + E)). Lessons on a cycle get
 * no layer (the cycle is reported by `cycleErrors`).
 */
export function layers(nodes: GraphNode[]): Map<string, number> {
	const edges = prerequisiteEdges(nodes);
	const remaining = new Map<string, number>();
	const dependents = new Map<string, string[]>();
	for (const [id, prereqs] of edges) {
		remaining.set(id, prereqs.length);
		for (const p of prereqs) (dependents.get(p) ?? dependents.set(p, []).get(p)!).push(id);
	}
	const layer = new Map<string, number>();
	const queue = [...edges.keys()].filter((id) => remaining.get(id) === 0);
	for (const id of queue) layer.set(id, 0);
	for (let i = 0; i < queue.length; i++) {
		const u = queue[i];
		for (const v of dependents.get(u) ?? []) {
			layer.set(v, Math.max(layer.get(v) ?? 0, layer.get(u)! + 1));
			remaining.set(v, remaining.get(v)! - 1);
			if (remaining.get(v) === 0) queue.push(v);
		}
	}
	return layer;
}
