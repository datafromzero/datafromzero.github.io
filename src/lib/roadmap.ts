/**
 * Roadmap map layout for /start/ (SPEC §3.1). Pure TypeScript: no Astro imports, so the build and
 * the unit tests share it. The map is a vertical SVG (it reads well at 360 px): four stages in
 * sequence on a left rail, then a fork into the four branches. Published lessons sit under their
 * stage in rows; a row is one distinct `layers()` value (longest prerequisite path, see graph.ts),
 * so a lesson never appears above one it requires. Cross-stage and in-stage edges are not drawn:
 * the rows already encode the order, and the text list below the map lists every prerequisite link.
 */
import { layers, type GraphNode } from './graph.ts';

export interface StageDef {
	id: string;
	title: string;
	branch: boolean;
}

export const ROADMAP_STAGES: readonly StageDef[] = [
	{ id: 'excel', title: 'Excel / Sheets', branch: false },
	{ id: 'sql', title: 'SQL', branch: false },
	{ id: 'python', title: 'Python', branch: false },
	{ id: 'core', title: 'Advanced core', branch: false },
	{ id: 'data-analyst', title: 'Data Analyst', branch: true },
	{ id: 'data-engineer', title: 'Data Engineer', branch: true },
	{ id: 'data-scientist', title: 'Data Scientist', branch: true },
	{ id: 'ml-engineer', title: 'ML / AI Engineer', branch: true },
];

/** A published (or deprecated) lesson as the map needs it. */
export interface MapLesson {
	id: string;
	title: string;
	stage: string;
	order: number;
	href: string;
	prerequisites: string[];
	status: string;
}

export interface LessonBox {
	id: string;
	title: string;
	href: string;
	lines: string[];
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface StageBox {
	id: string;
	title: string;
	number: string;
	/** Landing page, only when it exists (links must not break). */
	href: string | null;
	branch: boolean;
	x: number;
	y: number;
	w: number;
	h: number;
	lessons: LessonBox[];
}

export interface RoadmapLayout {
	width: number;
	height: number;
	stages: StageBox[];
	/** Rail paths and where markers go. */
	rails: string[];
	markers: { x: number; y: number }[];
	fork: { x: number; y: number };
}

export const MAP_WIDTH = 360;
const RAIL_X = 18;
const BRANCH_RAIL_X = 46;
const NODE_H = 64;
const SECTION_GAP = 28;
const LESSON_H = 44;
const LESSON_GAP = 8;
const FORK_H = 36;

/** Greedy word wrap into at most `maxLines` lines of `maxChars`; the last line ends with an ellipsis when cut. */
export function wrap(text: string, maxChars: number, maxLines = 2): string[] {
	const words = text.trim().split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let cur = '';
	let i = 0;
	for (; i < words.length; i++) {
		const next = cur ? `${cur} ${words[i]}` : words[i];
		if (next.length <= maxChars) cur = next;
		else if (!cur) cur = words[i]; // one long word: cut below
		else {
			if (lines.length === maxLines - 1) break;
			lines.push(cur);
			cur = words[i];
		}
	}
	if (cur) lines.push(cur);
	const cut = i < words.length;
	return lines.slice(0, maxLines).map((l, k, a) => {
		const last = k === a.length - 1;
		if (last && (cut || l.length > maxChars)) return `${l.slice(0, maxChars - 1).trimEnd()}…`;
		return l.length > maxChars ? `${l.slice(0, maxChars - 1)}…` : l;
	});
}

/**
 * @param lessons published and deprecated lessons (English); drafts are never passed in.
 * @param landings stage ids whose landing page exists.
 */
export function layoutRoadmap(lessons: MapLesson[], landings: ReadonlySet<string>, stages: readonly StageDef[] = ROADMAP_STAGES): RoadmapLayout {
	const nodes: GraphNode[] = lessons.map((l) => ({ id: l.id, kind: 'lesson', file: l.id, stage: l.stage, order: l.order, prerequisites: l.prerequisites }));
	const layer = layers(nodes); // lessons on a cycle get no layer; the graph check fails the build for them anyway
	const out: StageBox[] = [];
	const markers: { x: number; y: number }[] = [];
	const rails: string[] = [];
	let y = 8;
	let fork = { x: RAIL_X, y: 0 };
	let railStart = 0;
	let branchRailStart = 0;
	let lastMainMid = 0;
	let lastBranchMid = 0;
	let n = 0;

	for (const def of stages) {
		if (def.branch && !fork.y) {
			// The fork row: the main rail turns into the branch rail.
			fork = { x: RAIL_X, y: y + FORK_H / 2 };
			y += FORK_H;
			branchRailStart = fork.y;
		}
		n += 1;
		const x = def.branch ? 64 : 36;
		const w = MAP_WIDTH - 16 - x;
		const mine = lessons.filter((l) => l.stage === def.id);
		const box: StageBox = { id: def.id, title: def.title, number: String(n).padStart(2, '0'), href: landings.has(def.id) ? `/${def.id}/` : null, branch: def.branch, x, y, w, h: NODE_H, lessons: [] };
		const mid = y + NODE_H / 2;
		if (def.branch) lastBranchMid = mid;
		else {
			if (!railStart) railStart = mid;
			lastMainMid = mid;
		}
		markers.push({ x: def.branch ? BRANCH_RAIL_X : RAIL_X, y: mid });

		// Rows: one per distinct layer value in this stage, ascending; ties by order, then id.
		const ranks = [...new Set(mine.map((l) => layer.get(l.id) ?? Infinity))].sort((a, b) => a - b);
		const left = x + 16;
		const cols = 2;
		const colW = (w - 16 - LESSON_GAP) / cols;
		const chars = Math.floor((colW - 16) / 6.4);
		let ly = y + NODE_H + 12;
		for (const r of ranks) {
			const row = mine
				.filter((l) => (layer.get(l.id) ?? Infinity) === r)
				.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
			row.forEach((l, i) => {
				if (i > 0 && i % cols === 0) ly += LESSON_H + LESSON_GAP;
				box.lessons.push({ id: l.id, title: l.title, href: l.href, lines: wrap(l.title, chars), x: left + (i % cols) * (colW + LESSON_GAP), y: ly, w: colW, h: LESSON_H });
			});
			ly += LESSON_H + LESSON_GAP;
		}
		y = (box.lessons.length ? ly - LESSON_GAP : y + NODE_H) + SECTION_GAP;
		out.push(box);
	}

	if (!fork.y) fork = { x: RAIL_X, y: lastMainMid };
	if (railStart) rails.push(`M${RAIL_X} ${railStart}V${fork.y}`);
	if (branchRailStart) rails.push(`M${RAIL_X} ${fork.y}H${BRANCH_RAIL_X}V${lastBranchMid}`);
	// Stubs from each rail to its node.
	for (const s of out) {
		const mid = s.y + s.h / 2;
		rails.push(`M${s.branch ? BRANCH_RAIL_X : RAIL_X} ${mid}H${s.x}`);
	}
	return { width: MAP_WIDTH, height: y - SECTION_GAP + 8, stages: out, rails, markers, fork };
}
