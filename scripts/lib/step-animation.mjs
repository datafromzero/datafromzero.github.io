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
 * Usage: see scripts/animations/*.mjs and `node scripts/make-animation.mjs <name>`.
 */

const MAX_STEPS = 6;
const ROLES = ['src', 'mat', 'flt', 'grp', 'out', 'win', 'ord'];

const esc = (s) =>
	String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\$/g, '&#36;') // MDX reads $…$ as math
		.replace(/\*/g, '&#42;'); // and * as emphasis

const num = (n) => String(Math.round(n * 100) / 100);

/** Class names for a clause-colored fill: role (one of ROLES) at a tint level 1 to 4. */
export const tint = (role, level) => `f-${role} k${level}`;
/** Class names for a clause-colored outline. */
export const edge = (role) => `s-${role}`;

export function anim({ id, w = 360, h, title, desc, steps }) {
	if (w > 360) throw new Error(`${id}: viewBox width ${w} is over 360`);
	if (!steps?.length || steps.length > MAX_STEPS) throw new Error(`${id}: 1 to ${MAX_STEPS} steps are required`);
	const N = steps.length;
	steps.forEach((s, i) => {
		if (!ROLES.includes(s.role)) throw new Error(`${id}: step ${i + 1} has an unknown role "${s.role}"`);
		if (!s.clause || !s.text) throw new Error(`${id}: step ${i + 1} needs a clause and a text`);
	});
	const stack = [[]];

	/** Classes for an effect. */
	const fxClasses = (fx) => {
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
	const cls = (...parts) => {
		const s = parts.flat().filter(Boolean).join(' ');
		return s ? ` class="${s}"` : '';
	};
	const push = (s) => stack[stack.length - 1].push(s);

	const api = {
		/** A group; children are drawn by `body()`. With no effect it is a plain `<g>`. */
		g(fx, body, ...extra) {
			stack.push([]);
			body();
			const inner = stack.pop().join('');
			push(`<g${cls(extra, fxClasses(fx))}>${inner}</g>`);
		},
		/** `c`: a tint(role, level) or edge(role) string, or `bx` for a plain cell border. */
		rect(x, y, width, height, c, fx) {
			push(`<rect${cls(c, fxClasses(fx))} x="${num(x)}" y="${num(y)}" width="${num(width)}" height="${num(height)}" />`);
		},
		/** `align`: 's' start, 'e' end, 'm' middle. `c`: size and weight classes: f10 f11 f14 b mu. */
		text(x, y, s, c = '', fx, align = 's') {
			const a = align === 'e' ? 'e' : align === 'm' ? 'm' : '';
			push(`<text${cls(c, a, fxClasses(fx))} x="${num(x)}" y="${num(y)}">${esc(s)}</text>`);
		},
		path(d, c = 'ln', fx) {
			push(`<path${cls(c, fxClasses(fx))} d="${d}" />`);
		},
		/**
		 * One table row. cols: [{ w, text, align, c }]. `tint` is a tint(role, level) string drawn UNDER the text over
		 * the columns `tintCols` ([first, last], default all) and can appear on its own (`tintFx`). `head` draws a header
		 * row (bold, small).
		 */
		row(x, y, cols, { h: rh = 20, fx, tint: tc, tintCols, tintFx, head = false, c } = {}) {
			api.g(fx, () => {
				let cx = x;
				const xs = [];
				for (const col of cols) {
					xs.push(cx);
					api.rect(cx, y, col.w, rh, 'bx');
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
			// not-content keeps Starlight's own list and form styling off the figure
			const markup = `<figure class="sa not-content">\n${radios}\n${svg}\n${ctl}\n<ol class="sa-steps">\n${lis}\n</ol>\n</figure>`;
			return { markup, steps: N };
		},
	};
	return api;
}
