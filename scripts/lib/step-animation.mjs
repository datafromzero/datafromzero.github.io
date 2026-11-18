/**
 * Generator for click-to-play step animations in lesson figures (SPEC D41).
 *
 * A spec draws the FINAL frame with ordinary shapes. An element that should animate gets an effect (`fx`):
 *   in:true          fades in            (before its step it is invisible)
 *   out:true         ends dimmed         (the final frame shows it dimmed; it starts at full strength)
 *   mv:[dx, dy]      starts offset by dx, dy user units (multiples of 10, at most 200) and slides to where it is drawn
 *   step:n           which step's start time it follows (index into `steps`)
 *   delay:seconds    extra delay after that step starts (rounded to 0.2 s)
 * Everything is a class from src/styles/step-animation.css; the output has no style attribute, no script and no
 * CSS variable. The default view is the final frame, so the figure reads without CSS animation support.
 *
 * Usage: see scripts/animations/*.mjs and `node scripts/make-animation.mjs <name>`.
 */

const UNIT = 0.2; // seconds per delay class (d0 to d60)
const MOVE_UNIT = 10; // user units per move class (x1..x20, y1..y20)

const esc = (s) =>
	String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\$/g, '&#36;') // MDX reads $…$ as math
		.replace(/\*/g, '&#42;'); // and * as emphasis

const num = (n) => String(Math.round(n * 100) / 100);

export function anim({ id, w = 360, h, title, desc, steps }) {
	if (w > 360) throw new Error(`${id}: viewBox width ${w} is over 360`);
	if (!steps?.length) throw new Error(`${id}: steps are required`);
	const stack = [[]];
	let maxEnd = 0;

	const startOf = (n) => {
		if (!steps[n]) throw new Error(`${id}: no step ${n}`);
		return steps[n].at;
	};

	/** Classes for an effect: kind, delay and move offset. */
	const fxClasses = (fx = {}) => {
		const c = [];
		if (!fx.in && !fx.out && !fx.mv) return c;
		const at = startOf(fx.step ?? 0) + (fx.delay ?? 0);
		const d = Math.round(at / UNIT);
		if (d > 60) throw new Error(`${id}: an effect starts at ${at}s; keep animations under 10 s`);
		maxEnd = Math.max(maxEnd, at + 0.9);
		if (fx.in) c.push('a-in');
		if (fx.out) c.push('a-out');
		if (fx.mv) {
			const [dx, dy] = fx.mv;
			for (const [axis, v] of [['x', dx], ['y', dy]]) {
				if (v % MOVE_UNIT) throw new Error(`${id}: move ${v} is not a multiple of ${MOVE_UNIT}`);
				const k = Math.abs(v) / MOVE_UNIT;
				if (k > 20) throw new Error(`${id}: move ${v} is over 200`);
				if (k) c.push(`${axis}${v < 0 ? 'n' : ''}${k}`);
			}
			c.push('a-mv');
		}
		c.push(`d${d}`);
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
		rect(x, y, width, height, c, fx) {
			push(`<rect${cls(c, fxClasses(fx))} x="${num(x)}" y="${num(y)}" width="${num(width)}" height="${num(height)}" />`);
		},
		/** `align`: 's' start, 'e' end, 'm' middle. `c`: size and weight classes: f10 f11 f14 b mu mono. */
		text(x, y, s, c = '', fx, align = 's') {
			const a = align === 'e' ? 'e' : align === 'm' ? 'm' : '';
			push(`<text${cls(c, a, fxClasses(fx))} x="${num(x)}" y="${num(y)}">${esc(s)}</text>`);
		},
		path(d, c = 'ln', fx) {
			push(`<path${cls(c, fxClasses(fx))} d="${d}" />`);
		},
		/**
		 * One table row. cols: [{ w, text, align, c }]. `tint` adds a shaded rectangle (class k1..k4) that can fade in
		 * on its own (`tintFx`). `head` draws a header row (bold, small).
		 */
		row(x, y, cols, { h: rh = 20, fx, tint, tintFx, head = false, c } = {}) {
			api.g(fx, () => {
				let cx = x;
				for (const col of cols) {
					api.rect(cx, y, col.w, rh, 'bx');
					cx += col.w;
				}
				if (tint) api.rect(x, y, cx - x, rh, tint, tintFx);
				cx = x;
				for (const col of cols) {
					const e = col.align === 'e';
					const tx = e ? cx + col.w - 5 : cx + 5;
					api.text(tx, y + rh / 2 + 4, col.text, [head ? 'f10 b' : (col.c ?? 'f11'), c].filter(Boolean).join(' '), undefined, e ? 'e' : 's');
					cx += col.w;
				}
			});
		},
		/** Build the figure markup (no blank lines: MDX would end the HTML block at one). */
		build() {
			const body = stack[0].join('\n');
			const lis = steps
				.map((s, i) => {
					const d = Math.round(s.at / UNIT);
					return `<li${cls(i ? ['a-cap', `d${d}`] : [])}>${esc(s.text)}</li>`;
				})
				.join('\n');
			const svg =
				`<svg class="sa-svg" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-labelledby="${id}-t ${id}-d">\n` +
				`<title id="${id}-t">${esc(title)}</title>\n<desc id="${id}-d">${esc(desc)}</desc>\n${body}\n</svg>`;
			// not-content keeps Starlight's own details/list styling off the figure; the labels swap by CSS (play or stop,
			// or show or hide the steps for readers who asked for less motion).
			const out =
				`<figure class="sa not-content">\n${svg}\n` +
				`<details class="sa-play">\n<summary><span class="l1">Play step by step</span><span class="l2">Close to replay</span>` +
				`<span class="l3">Show the steps</span><span class="l4">Hide the steps</span></summary>\n<ol class="sa-steps">\n${lis}\n</ol>\n</details>\n</figure>`;
			return { markup: out, seconds: maxEnd };
		},
	};
	return api;
}
