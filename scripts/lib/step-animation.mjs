/**
 * Generator for learner-controlled step-by-step figures in lessons (SPEC D41).
 *
 * A spec draws the FINAL frame with ordinary shapes (so print and any browser that ignores the controls show it), then
 * gives each part that changes an effect (`fx`), counted in steps from 1 (step 1 is the default view):
 *   in:n    appears at step n (before it, invisible)
 *   out:n   dimmed from step n on (a dropped row or group)
 *   hide:n  invisible from step n on (a highlight that only marks one step: in:n, hide:n+1)
 * Steps are `{ role, clause, text, predict? }`: `clause` is the badge text (GROUP BY, ON, ...), `role` picks its color
 * (src mat flt grp out win ord, see src/styles/step-animation.css and LESSON-STANDARD.md), `predict` is an optional
 * "Predict:" prompt for the step that comes next, which must not give away what that step reveals.
 * Everything is a class from the stylesheet; the output has no style attribute, no script and no CSS variable.
 * The controls are a native radio group with labels (no JavaScript), so keyboard arrows and JS-off both work.
 *
 * Concept primitives (on top of the table ones: row, rect, text, path):
 *   venn({ x1, x2, y, r })      two overlapping circles; `.outline()`, `.region('L'|'O'|'R', c, fx)` (left only, overlap,
 *                               right only: fillable), `.center(kind)` for labels
 *   box(x, y, w, h, opts, body) a pipeline box: edge in a role color, title, row-count badge, `body()` draws inside
 *   badge(x, y, text, role)     a small filled pill (row counts, "twice")
 *   arrow(x1, y1, x2, y2)       a line with a head, for pipelines and "from the row above"
 *   ghost(x, y, w, h)           a dashed slot where a row would be but does not exist
 *   grid(x, y, widths, nrows, rh)  all the borders of a table in one path (with `row(..., { cells: false })`)
 *   chip(x, y, label, opts)     a rounded row chip (opts: role, level, w, h, flags: layers drawn UNDER the text, fx)
 *   move({ dx, dy, at, half, fx }, body)  `body()` slides by (dx, dy) px (multiples of 10) during phase `at`, ease-in-out;
 *                               half 'a' or 'b' uses only the first or the second half of the phase (one part leaves, then another follows)
 *   tags(x, y, [[phase, text], ...])  a small label that changes with the phase (windows touch, never overlap)
 * `anim({ loop: { cycle }, caption, phases, tag })` makes a concept animation instead of a stepper (see `loopFx` below). `phases` is
 * required: 3 to 6 steps `[firstPhase, 'caption'], ...` (firstPhase 1 to 8, increasing, the first is 1). A step lasts until the next one starts.
 * The generator draws the in-figure label ("k · caption", at `tag` = { x, y, align }, default 10, 29) and the same words become the step
 * buttons 1..N, Back, Next and the numbered caption list under the figure (CSS only, see step-animation.css). Choosing step k shows the
 * settled frame at the end of the last phase of that step. Do not call `tags` for the phase label in a spec.
 *
 * Live counts and key ideas (optional, both figure types; a spec without them renders exactly as before):
 *   stepper:  a step may carry `counts: [{ label, value, role? }]` (the counters this step sets; `role` defaults to the step's),
 *             `key: 'one short rule'` and `changes: [['+', 'column orders'], ['−', '1 row dropped'], ['~', 'rows reordered']]`.
 *             A strip of labeled counters sits above the figure ("—" until its step; the counters set at the current step are lit in
 *             their clause color); the current step's Key idea and What changed sit under the controls. CSS only (radios).
 *   concept:  `anim({ counters: [{ label, role, values: [[phase, 'text'], ...] }] })` and a third item on each `phases` entry,
 *             `[1, 'caption', { role, key, changes }]`. Counters and the Key idea panel follow the phases of the loop (same keyframes
 *             as the picture, so a step button shows them at the end of its last phase); a counter set in a step stays lit to the end of it.
 *   Nothing may spoil a Predict: a count, key idea or change belongs to the step that shows it; step 1 shows inputs only.
 *   Print shows the final counter values and, in a block before the caption list, every step's Key idea and What changed.
 *
 * Usage: see scripts/animations/*.mjs and `node scripts/make-animation.mjs <name>`.
 */

import { link as erdLink } from './erd.mjs';

const MAX_STEPS = 6;
const ROLES = ['src', 'mat', 'flt', 'grp', 'out', 'win', 'ord'];

const esc = (s) =>
	String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\$/g, '&#36;') // MDX reads $…$ as math
		.replace(/\*/g, '&#42;'); // and * as emphasis

const PHASES = 8; // a concept animation loop is 8 equal phases
const num = (n) => String(Math.round(n * 100) / 100);

/** Class names for a clause-colored fill: role (one of ROLES) at a tint level 1 to 4. */
export const tint = (role, level) => `f-${role} k${level}`;
/** Class names for a clause-colored outline. */
export const edge = (role) => `s-${role}`;

/**
 * Concept animation (`loop: { cycle }` on `anim`): a looping, CSS-only schematic with a Pause button. Draw it with the same
 * primitives as a stepper. The loop has 8 phases of cycle/8 seconds. An effect is `{ in: k, hide: m, draw }` with phases
 * 1 to 8: the part fades in at the start of phase k and is gone at the start of phase m (default: stays to the end of the
 * loop, which is the final state that reduced motion and print show). `draw: true` on a path (an arrow) draws it along
 * its length; `pulse: true` makes a soft glow that rises and fades inside its window (it is not part of the final state if
 * the window ends before the loop does). A part with no effect is always there. A part that goes away before the end gets class `tmp`, which the
 * static view hides.
 */
const loopFx = (id) => (fx) => {
	if (!fx) return [];
	const k = fx.in ?? 1;
	const m = fx.hide ?? PHASES + 1;
	if (!Number.isInteger(k) || !Number.isInteger(m) || k < 1 || m <= k || m > PHASES + 1) throw new Error(`${id}: in:${k} hide:${m} must be phases 1 to ${PHASES + 1}`);
	if (k === 1 && m === PHASES + 1 && !fx.draw && !fx.pulse && !fx.always) return [];
	const c = [`${fx.draw ? 'p' : fx.pulse ? 'u' : 'w'}${m - k}`];
	if (k > 1) c.push(`d${k}`);
	if (m <= PHASES) c.push('tmp');
	return c;
};

const escA = (s) => esc(s).replace(/"/g, '&quot;');

const SIGNS = { '+': 'pl', '−': 'mi', '~': 'ch' };

/** Normalizes `changes` to [[sign, text], ...] with a typographic minus; throws on an unknown sign. */
const checkChanges = (id, where, changes = []) =>
	changes.map(([sg, text]) => {
		const sign = sg === '-' ? '−' : sg;
		if (!SIGNS[sign] || typeof text !== 'string' || !text) throw new Error(`${id}: ${where} changes are [['+' | '−' | '~', 'text'], ...]`);
		return [sign, text];
	});

/** The chips of "What changed"; the sign and its spoken word (Added, Removed, Changed) come from the stylesheet. */
const chips = (changes) => (changes.length ? `<span class="sa-chs">${changes.map(([sg, t]) => `<span class="sa-ch ${SIGNS[sg]}">${esc(t)}</span>`).join('')}</span>` : '');

export function anim({ id, w = 360, h, title, desc, steps, loop, caption, phases, tag = {}, counters }) {
	if (w > 360) throw new Error(`${id}: viewBox width ${w} is over 360`);
	if (loop && (!Number.isInteger(loop.cycle) || loop.cycle < 4 || loop.cycle > 8)) throw new Error(`${id}: loop.cycle is 4 to 8 seconds`);
	if (loop && !caption) throw new Error(`${id}: a concept animation needs a caption`);
	if (loop) steps = [];
	else if (!steps?.length || steps.length > MAX_STEPS) throw new Error(`${id}: 1 to ${MAX_STEPS} steps are required`);
	if (loop) {
		if (!Array.isArray(phases) || phases.length < 3 || phases.length > 6) throw new Error(`${id}: a concept animation needs 3 to 6 phases [[firstPhase, caption], ...]`);
		phases.forEach(([p, t], i) => {
			if (!Number.isInteger(p) || p < 1 || p > PHASES || (i === 0 ? p !== 1 : p <= phases[i - 1][0]) || typeof t !== 'string' || !t) throw new Error(`${id}: phases[${i}] must be [phase 1 to ${PHASES}, caption], starting at 1 and increasing`);
		});
		if (new Set(phases.map((x) => x[1])).size !== phases.length) throw new Error(`${id}: phase captions must be different from each other`);
	}
	const N = loop ? PHASES : steps.length;
	steps.forEach((s, i) => {
		if (!ROLES.includes(s.role)) throw new Error(`${id}: step ${i + 1} has an unknown role "${s.role}"`);
		if (!s.clause || !s.text) throw new Error(`${id}: step ${i + 1} needs a clause and a text`);
	});
	// live counts, key ideas and changes (optional; all steps carry a key idea once one does)
	const meta = loop ? (phases ?? []).map((p) => p[2]) : steps;
	const hasNow = meta.some((m) => m?.key);
	if (hasNow) {
		meta.forEach((m, i) => {
			if (!m?.key || typeof m.key !== 'string') throw new Error(`${id}: step ${i + 1} needs a key idea (every step has one once one does)`);
			if (m.key.length > 110) throw new Error(`${id}: step ${i + 1} key idea is over 110 characters`);
			m.changes = checkChanges(id, `step ${i + 1}`, m.changes);
			if (m.changes.length > 3) throw new Error(`${id}: step ${i + 1} has more than 3 changes`);
		});
		if (loop) meta.forEach((m, i) => { if (!ROLES.includes(m.role)) throw new Error(`${id}: phases[${i}] third item needs a role`); });
	}
	const stack = [[]];

	/** Classes for an effect. */
	const stepFx = (fx) => {
		if (!fx) return [];
		const c = ['fx'];
		for (const [key, cls] of [['in', 'i'], ['out', 'o'], ['hide', 'h']]) {
			const n = fx[key];
			if (n === undefined) continue;
			if (!Number.isInteger(n) || n < 2 || n > N) throw new Error(`${id}: ${key}:${n} must be a step from 2 to ${N}`);
			c.push(`${cls}${n}`);
			if (key === 'out') c.push('od');
		}
		return c;
	};
	const fxClasses = loop ? loopFx(id) : stepFx;
	const cls = (...parts) => {
		const s = parts.flat().filter(Boolean).join(' ');
		return s ? ` class="${s}"` : '';
	};
	const push = (s) => stack[stack.length - 1].push(s);

	/** A counter: the label once, then one <i> per state ({ value, hl, cls }), stacked in one cell by the stylesheet. */
	const counterMarkup = (label, role, states) =>
		`<span class="sa-n c-${role}"><small>${esc(label)}</small><span>${states.map((st) => `<i${cls(st.cls, st.hl ? 'hl' : '')}>${esc(st.value)}</i>`).join('')}</span></span>`;
	/** The Key idea sentence and What changed chips of one step (the words "Key idea" come from the stylesheet). */
	const keyMarkup = (m) => `${esc(m.key)}${chips(m.changes)}`;
	/** Stepper counters: a step lists the counters it sets; "—" until a counter's first step; lit at the steps that set it. */
	const stepperStrip = () => {
		const list = [];
		steps.forEach((st, i) =>
			(st.counts ?? []).forEach((c) => {
				if (!c.label || c.value === undefined) throw new Error(`${id}: step ${i + 1} counts are [{ label, value }]`);
				const role = c.role ?? st.role;
				if (!ROLES.includes(role)) throw new Error(`${id}: counter "${c.label}" has an unknown role "${role}"`);
				let e = list.find((x) => x.label === c.label);
				if (!e) list.push((e = { label: c.label, role, ev: new Map() }));
				e.ev.set(i + 1, String(c.value));
			}),
		);
		if (!list.length) return '';
		if (list.length > 5) throw new Error(`${id}: at most 5 counters`);
		const cells = list.map((e) => {
			const states = [];
			let value = '—';
			for (let k = 1; k <= N; k++) {
				if (e.ev.has(k)) value = e.ev.get(k);
				const hl = e.ev.has(k);
				const last = states[states.length - 1];
				if (last && last.value === value && last.hl === hl) last.ks.push(k);
				else states.push({ value, hl, ks: [k] });
			}
			return counterMarkup(e.label, e.role, states.map((st) => ({ ...st, cls: st.ks.map((k) => `v${k}`).join(' ') })));
		});
		return `<div class="sa-cn sa-st" role="group" aria-label="Row counts at this step">${cells.join('')}</div>`;
	};
	/** Concept counters follow the phases: values [[phase, text], ...]; a counter set in a step stays lit to the end of that step. */
	const conceptStrip = () => {
		if (!counters?.length) return '';
		if (counters.length > 5) throw new Error(`${id}: at most 5 counters`);
		const firsts = phases.map((x) => x[0]);
		const stepEnd = (p) => (firsts.find((f) => f > p) ?? PHASES + 1) - 1;
		const cells = counters.map(({ label, role, values }) => {
			if (!ROLES.includes(role) || !values?.length) throw new Error(`${id}: counter "${label}" needs a role and values [[phase, text], ...]`);
			values.forEach(([p], i) => {
				if (!Number.isInteger(p) || p < 1 || p > PHASES || (i && p <= values[i - 1][0])) throw new Error(`${id}: counter "${label}" phases must increase, 1 to ${PHASES}`);
			});
			const states = [];
			for (let p = 1; p <= PHASES; p++) {
				const q = values.filter(([f]) => f <= p).pop();
				const value = q ? String(q[1]) : '—';
				const hl = q ? p <= stepEnd(q[0]) : false;
				const last = states[states.length - 1];
				if (last && last.value === value && last.hl === hl) last.to = p;
				else states.push({ value, hl, from: p, to: p });
			}
			return counterMarkup(label, role, states.map((st) => ({ ...st, cls: fxClasses({ in: st.from, ...(st.to < PHASES ? { hide: st.to + 1 } : {}) }).join(' ') })));
		});
		return `<div class="sa-cn" aria-hidden="true">${cells.join('')}</div>`;
	};

	const api = {
		/** A group; children are drawn by `body()`. With no effect it is a plain `<g>`. */
		g(fx, body, ...extra) {
			stack.push([]);
			body();
			const inner = stack.pop().join('');
			push(`<g${cls(extra, fxClasses(fx))}>${inner}</g>`);
		},
		/** `c`: a tint(role, level) or edge(role) string, or `bx` for a plain cell border. */
		rect(x, y, width, height, c, fx, rx) {
			push(`<rect${cls(c, fxClasses(fx))} x="${num(x)}" y="${num(y)}" width="${num(width)}" height="${num(height)}"${rx ? ` rx="${num(rx)}"` : ''} />`);
		},
		circle(x, y, r, c, fx) {
			push(`<circle${cls(c, fxClasses(fx))} cx="${num(x)}" cy="${num(y)}" r="${num(r)}" />`);
		},
		/** `align`: 's' start, 'e' end, 'm' middle. `c`: size and weight classes: f10 f11 f14 b mu. */
		text(x, y, s, c = '', fx, align = 's') {
			const a = align === 'e' ? 'e' : align === 'm' ? 'm' : '';
			push(`<text${cls(c, a, fxClasses(fx))} x="${num(x)}" y="${num(y)}">${esc(s)}</text>`);
		},
		path(d, c = 'ln', fx) {
			push(`<path${cls(c, fx?.draw ? 'dr' : '', fxClasses(fx))}${fx?.draw ? ' pathLength="1"' : ''} d="${d}" />`);
		},
		/**
		 * A rounded row chip with a centered label. `flags` are extra tinted layers under the text (a state that turns on
		 * or off: [{ role, level, fx }]); text is never under a shade it does not own.
		 */
		chip(x, y, label, { role = 'src', level = 2, w = 64, h = 24, flags = [], c = 'f11', fx } = {}) {
			api.g(fx, () => {
				api.rect(x, y, w, h, tint(role, level), undefined, 6);
				for (const f of flags) api.rect(x, y, w, h, tint(f.role, f.level ?? 3), f.fx, 6);
				api.text(x + w / 2, y + h / 2 + 4, label, c, undefined, 'm');
			});
		},
		/**
		 * Slides `body()` by (dx, dy) during phase `at` (1 to 7), ease-in-out; dx and dy are multiples of 10 px. The part
		 * stays where it ends (the static view draws it there). It fades with the loop (or with `fx`), so the jump back
		 * at the start of the next loop is never seen. Moves nest: the inner one is relative to the outer one.
		 */
		move({ dx = 0, dy = 0, at, half = '', fx }, body) {
			if (!loop) throw new Error(`${id}: move is for concept animations`);
			if (!Number.isInteger(at) || at < 1 || at >= PHASES || dx % 10 || dy % 10) throw new Error(`${id}: move needs at 1 to 7 and dx, dy in multiples of 10`);
			if (half !== '' && half !== 'a' && half !== 'b') throw new Error(`${id}: half is 'a' or 'b'`);
			const ax = Math.abs(dx / 10);
			const ay = Math.abs(dy / 10);
			if (ax > 35 || ay > 30) throw new Error(`${id}: move is too long`);
			const k = (n, a) => `${a}${n < 0 ? 'n' : ''}${Math.abs(n)}`;
			api.g(fx ?? { always: true }, () => api.g(undefined, body, 'mv', `m${at}${half}`, k(dx / 10, 'x'), k(dy / 10, 'y')));
		},
		/** A small label that changes with the phase: [[phase, text], ...]; each lasts until the next one, the last stays. */
		tags(x, y, list, c = 'f10 b', align = 's') {
			list.forEach(([phase, text], i) => api.text(x, y, text, c, { in: phase, ...(list[i + 1] ? { hide: list[i + 1][0] } : {}) }, align));
		},
		/** A dashed slot where a row would be but does not exist (the start of a window, the row above the first). */
		ghost(x, y, width, height, fx) {
			api.rect(x, y, width, height, 'bx dsh', fx);
		},
		/** A line with an arrow head at (x2, y2). */
		arrow(x1, y1, x2, y2, c = 'ln', fx) {
			const a = Math.atan2(y2 - y1, x2 - x1);
			const hx = (d) => x2 - 7 * Math.cos(a + d);
			const hy = (d) => y2 - 7 * Math.sin(a + d);
			api.path(`M${num(x1)} ${num(y1)}L${num(x2)} ${num(y2)}M${num(hx(0.45))} ${num(hy(0.45))}L${num(x2)} ${num(y2)}L${num(hx(-0.45))} ${num(hy(-0.45))}`, c, fx);
		},
		/**
		 * A crow's foot link (lib/erd.mjs): an orthogonal polyline `points` from the parent's key row to the child's key row, with the
		 * cardinality symbol and label of each end (`a` at the first point, `b` at the last: '1', '0..1', '1..*', '0..*').
		 * opts: { sideA, sideB ('above' | 'below' for a horizontal end, 'left' | 'right' for a vertical one), c (extra class on the line,
		 * for example 'dsh'), labels (false: draw no labels) }. With fx.draw the line draws along its length and the symbols and
		 * labels fade in with it; any other effect applies to all of it.
		 */
		link(points, a, b, opts = {}, fx) {
			const lk = erdLink(points, a, b, opts);
			const extra = opts.c ? ` ${opts.c}` : '';
			const solid = fx?.draw ? { in: fx.in, ...(fx.hide ? { hide: fx.hide } : {}) } : fx;
			api.path(lk.line, `cf${extra}`, fx);
			api.g(solid, () => {
				api.path(lk.sym, `cf${extra}`);
				for (const c of lk.circles) push(`<circle class="cf${extra}" cx="${c.cx}" cy="${c.cy}" r="${c.r}" />`);
				if (opts.labels !== false) for (const l of lk.labels) api.text(l.x, l.y, l.text, 'cl', undefined, l.anchor === 'end' ? 'e' : 's');
			});
		},
		/** A small filled pill with bold text; (x, y) is its top left, or its top right with align 'e'. */
		badge(x, y, text, role, fx, align = 's') {
			const bw = Math.round(String(text).length * 6.4 + 14);
			const bx = align === 'e' ? x - bw : x;
			api.g(fx, () => {
				api.rect(bx, y, bw, 18, tint(role, 2), undefined, 9);
				api.text(bx + bw / 2, y + 13, text, 'f11 b', undefined, 'm');
			});
		},
		/**
		 * A pipeline box: an outline in the role color, a title, an optional row-count badge top right; `body()` draws
		 * the small table inside it. opts: { role, title, count, fx }.
		 */
		box(x, y, width, height, { role, title, count, fx }, body) {
			api.g(fx, () => {
				api.rect(x, y, width, height, edge(role), undefined, 6);
				api.text(x + 10, y + 17, title, 'f11 b');
				if (count !== undefined) api.badge(x + width - 8, y + 5, count, role, undefined, 'e');
				body?.();
			});
		},
		/**
		 * Two overlapping circles (equal radius r, centers (x1, y) and (x2, y)) as three fillable regions:
		 * 'L' left only, 'O' the overlap, 'R' right only. Draw fills before text; `c` is tint(role, level).
		 */
		venn({ x1, x2, y, r }) {
			const d = x2 - x1;
			if (d <= 0 || d >= 2 * r) throw new Error(`${id}: the circles must overlap`);
			const mx = (x1 + x2) / 2;
			const hh = Math.sqrt(r * r - (d / 2) ** 2);
			const T = `${num(mx)} ${num(y - hh)}`;
			const B = `${num(mx)} ${num(y + hh)}`;
			const arc = (large, sweep, to) => `A${num(r)} ${num(r)} 0 ${large} ${sweep} ${to}`;
			const paths = {
				O: `M${T}${arc(0, 0, B)}${arc(0, 0, T)}Z`,
				L: `M${T}${arc(1, 0, B)}${arc(0, 1, T)}Z`,
				R: `M${T}${arc(1, 1, B)}${arc(0, 0, T)}Z`,
			};
			return {
				outline(fx) {
					api.g(fx, () => {
						api.circle(x1, y, r, 'ln');
						api.circle(x2, y, r, 'ln');
					});
				},
				region(kind, c, fx) {
					if (!paths[kind]) throw new Error(`${id}: unknown region "${kind}" (L, O or R)`);
					api.path(paths[kind], c, fx);
				},
				/** Where to put a label: the middle of the region along the line of centers. */
				center(kind) {
					return { x: kind === 'L' ? mx - r : kind === 'R' ? mx + r : mx, y };
				},
			};
		},
		/**
		 * The borders of a table in ONE path: an outer box with `nrows` rows of `rh` px and a vertical line after each of
		 * `widths` but the last. Use it with `row(..., { cells: false })` to keep markup small.
		 */
		grid(x, y, widths, nrows, rh = 20, fx) {
			const tw = widths.reduce((a, b) => a + b, 0);
			let d = `M${num(x)} ${num(y)}h${num(tw)}v${num(nrows * rh)}h${num(-tw)}z`;
			for (let r = 1; r < nrows; r++) d += `M${num(x)} ${num(y + r * rh)}h${num(tw)}`;
			let cx = x;
			for (const cw of widths.slice(0, -1)) {
				cx += cw;
				d += `M${num(cx)} ${num(y)}v${num(nrows * rh)}`;
			}
			api.path(d, 'bx', fx);
		},
		/**
		 * One table row. cols: [{ w, text, align, c }]. `tint` is a tint(role, level) string drawn UNDER the text over
		 * the columns `tintCols` ([first, last], default all) and can appear on its own (`tintFx`). `head` draws a header
		 * row (bold, small).
		 */
		row(x, y, cols, { h: rh = 20, fx, tint: tc, tintCols, tintFx, head = false, c, cells = true } = {}) {
			api.g(fx, () => {
				let cx = x;
				const xs = [];
				for (const col of cols) {
					xs.push(cx);
					if (cells) api.rect(cx, y, col.w, rh, 'bx');
					cx += col.w;
				}
				if (tc) {
					const [a, b] = tintCols ?? [0, cols.length - 1];
					api.rect(xs[a], y, xs[b] + cols[b].w - xs[a], rh, tc, tintFx);
				}
				cols.forEach((col, i) => {
					const e = col.align === 'e';
					const tx = e ? xs[i] + col.w - 5 : xs[i] + 5;
					api.text(tx, y + rh / 2 + 4, col.text, [head ? 'f10 b' : (col.c ?? 'f11'), c].filter(Boolean).join(' '), undefined, e ? 'e' : 's');
				});
			});
		},
		/** Build the figure markup (no blank lines: MDX would end the HTML block at one). */
		build() {
			if (loop) {
				// the pause checkbox and the radios (r0 = auto, r1..r8 = step k) come first in the markup (the state selectors need them
				// before everything they style) and sit in the flow right above the controls (CSS order)
				const n = phases.length;
				const caps = phases.map((x) => x[1]);
				// the frame a step shows is the end of the last phase of that step
				const lastPhase = (k) => (phases[k] ? phases[k][0] : PHASES + 1) - 1;
				const radios = [`<input class="sa-r r0 o${lastPhase(1) < 1 ? 1 : lastPhase(1)}" type="radio" name="${id}" id="${id}-r0" aria-label="Play automatically" checked />`]
					.concat(caps.map((c, i) => `<input class="sa-r r${i + 1} o${lastPhase(i + 1)}" type="radio" name="${id}" id="${id}-r${i + 1}" aria-label="Step ${i + 1} of ${n}: ${escA(c)}" />`))
					.join('\n');
				const svg =
					`<svg class="sa-svg ca-svg" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-labelledby="${id}-t ${id}-d">\n` +
					`<title id="${id}-t">${esc(title)}</title>\n<desc id="${id}-d">${esc(desc)}</desc>\n${stack[0].join('\n')}\n</svg>`;
				const lab = (cls, target, inner) => `<label class="${cls}" for="${id}-${target}">${inner}</label>`;
				const range = Array.from({ length: n + 1 }, (_, k) => k);
				const bks = range.map((k) => (k < 2 ? `<span class="sa-nav bk bk${k}" aria-hidden="true"></span>` : lab(`sa-nav bk bk${k}`, `r${k - 1}`, '<span class="sr">Back</span>')));
				const nxs = range.map((k) => (k === n ? lab(`sa-nav nx rs nx${k}`, 'r1', '<span class="sr">Start over</span>') : lab(`sa-nav nx nx${k}`, `r${k + 1}`, '<span class="sr">Next</span>')));
				const sbs = range.slice(1).map((k) => lab(`sa-sb sb${k}`, `r${k}`, String(k)));
				const btn =
					`<div class="sa-ctl">\n${lab('ca-btn', 'pp', '<span class="ca-pa"><span aria-hidden="true">&#10074;&#10074;</span> Pause</span><span class="ca-pl"><span aria-hidden="true">&#9654;</span> Play</span>')}\n` +
					`${lab('ca-btn ca-au', 'r0', '<span aria-hidden="true">&#9654;</span> Play')}\n${bks.join('\n')}\n${nxs.join('\n')}\n<span class="sa-sbs">${sbs.join('')}</span>\n</div>`;
				const lis = caps.map((c) => `<li>${esc(c)}</li>`).join('\n');
				const strip = conceptStrip();
				// the Key idea panel: step k shows from its first phase to the one before the next step's (the last stays)
				const now = hasNow
					? `\n<div class="sa-now" aria-hidden="true">\n${meta
							.map((m, i) => `<div${cls(`c-${m.role}`, fxClasses({ in: phases[i][0], ...(phases[i + 1] ? { hide: phases[i + 1][0] } : {}) }))}>${keyMarkup(m)}</div>`)
							.join('\n')}\n</div>`
					: '';
				const markup = `<figure class="ca sa not-content t${loop.cycle}">\n<input class="ca-pp" type="checkbox" id="${id}-pp" aria-label="Pause the animation" />\n${radios}\n${strip ? `${strip}\n` : ''}${svg}\n${btn}${now}\n<p class="ca-cap">${esc(caption)}</p>\n<ol class="sa-steps">\n${lis}\n</ol>\n</figure>`;
				return { markup, steps: 0 };
			}
			const range = Array.from({ length: N }, (_, i) => i + 1);
			const radios = range
				.map(
					(n) =>
						`<input class="sa-r r${n}" type="radio" name="${id}" id="${id}-r${n}" aria-label="Step ${n} of ${N}: ${esc(steps[n - 1].clause)}" aria-describedby="${id}-c${n}"${n === 1 ? ' checked' : ''} />`,
				)
				.join('\n');
			const svg =
				`<svg class="sa-svg" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-labelledby="${id}-t ${id}-d">\n` +
				`<title id="${id}-t">${esc(title)}</title>\n<desc id="${id}-d">${esc(desc)}</desc>\n${stack[0].join('\n')}\n</svg>`;
			// Back and Next are labels for the neighbor radio; one of each is shown per state (CSS), the first Back is a
			// disabled stub and the last Next starts over.
			const bks = range.map((n) =>
				n === 1
					? `<span class="sa-nav bk bk1" aria-hidden="true">&#9664;</span>`
					: `<label class="sa-nav bk bk${n}" for="${id}-r${n - 1}"><span aria-hidden="true">&#9664;</span><span class="sr">Back</span></label>`,
			);
			const btn = range.map((n) => `<label class="sa-sb c-${steps[n - 1].role} sb${n}" for="${id}-r${n}">${n}</label>`);
			const nxs = range.map((n) =>
				n === N
					? `<label class="sa-nav nx nx${n}" for="${id}-r1"><span aria-hidden="true">&#8634;</span><span class="sr">Start over</span></label>`
					: `<label class="sa-nav nx nx${n}" for="${id}-r${n + 1}"><span aria-hidden="true">&#9654;</span><span class="sr">Next</span></label>`,
			);
			const ctl = `<div class="sa-ctl">\n${bks.join('\n')}\n<span class="sa-sbs">${btn.join('')}</span>\n${nxs.join('\n')}\n</div>`;
			const lis = steps
				.map(
					(s, i) =>
						`<li id="${id}-c${i + 1}"><span class="sa-cl c-${s.role}">${esc(s.clause)}</span> ${esc(s.text)}` +
						(s.predict ? ` <b class="sa-pr">Predict:</b> ${esc(s.predict)}` : '') +
						'</li>',
				)
				.join('\n');
			const strip = stepperStrip();
			// the current step's Key idea and What changed (the panel keeps the height of the tallest, so nothing below jumps)
			const now = hasNow
				? `\n<div class="sa-now sa-st">\n${steps.map((s, i) => `<div class="z${i + 1} c-${s.role}">${keyMarkup(s)}</div>`).join('\n')}\n</div>`
				: '';
			// not-content keeps Starlight's own list and form styling off the figure
			const markup = `<figure class="sa not-content">\n${radios}\n${strip ? `${strip}\n` : ''}${svg}\n${ctl}${now}\n<ol class="sa-steps">\n${lis}\n</ol>\n</figure>`;
			return { markup, steps: N };
		},
	};
	if (loop) api.tags(tag.x ?? 10, tag.y ?? 29, phases.map(([p, t], i) => [p, `${i + 1} · ${t}`]), 'f10 b', tag.align ?? 's');
	return api;
}
