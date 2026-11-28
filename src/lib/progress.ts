/**
 * Learner progress kept in this browser only (SPEC D64). Two localStorage keys, nothing sent anywhere, no accounts:
 *
 * - `dfz-last`: the lesson read last, `{"p":"/sql/inner-join/","c":"S20","t":"INNER JOIN: pairing rows on a key","at":1795800000000}`
 *   (path, code, title, time). Written by the taskbar script on lesson pages (`src/scripts/taskbar.ts`).
 * - `dfz-done`: the lessons the learner ticked, a JSON array of lesson ids (`["sql-joins"]`).
 *   Written by `src/scripts/progress.ts` on /start/ and the stage pages.
 *
 * Pure TypeScript with no DOM types in use, so the unit tests and the scripts share it. Whatever is stored is
 * untrusted (another tab, an old version, a person editing it): every read validates, ignores what it cannot use
 * and caps sizes; every storage call is wrapped, because storage can be blocked (private mode, site data off).
 * The page always works without any of this.
 */

export const LAST_KEY = 'dfz-last';
export const DONE_KEY = 'dfz-done';
/** More than the number of lessons on the site, so a normal list never hits it. */
export const MAX_DONE = 600;
export const MAX_TITLE = 120;
/** Longest stored value that is parsed at all (a JSON array of 600 ids of 80 characters is under 50 KB). */
export const MAX_RAW = 60_000;

export interface Last {
	/** Root-relative lesson path with trailing slash. */
	p: string;
	/** Lesson code, e.g. `S7`. */
	c: string;
	/** Lesson title. */
	t: string;
	/** Time of the visit, ms since 1970. */
	at: number;
}

/** The part of `Storage` used here, so tests can pass a plain object. */
export interface Store {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const PATH = /^\/[a-z0-9-]+\/[a-z0-9-]+\/$/;
const CODE = /^[A-Z]{1,3}\d{1,3}(\.\d{1,2}|[a-z])?$/;

/** The browser's localStorage, or `null` when it is missing or throws (SecurityError in some private modes). */
export function browserStore(): Store | null {
	try {
		return localStorage;
	} catch {
		return null;
	}
}

function read(s: Store | null, key: string): string | null {
	try {
		const v = s?.getItem(key) ?? null;
		return v !== null && v.length <= MAX_RAW ? v : null;
	} catch {
		return null;
	}
}

function write(s: Store | null, key: string, value: string): boolean {
	try {
		s?.setItem(key, value);
		return s !== null;
	} catch {
		return false;
	}
}

function json(raw: string | null): unknown {
	if (raw === null) return undefined;
	try {
		return JSON.parse(raw);
	} catch {
		return undefined;
	}
}

/** The last-lesson record from its stored text, or `null` when it is missing, corrupt or not shaped as written. */
export function parseLast(raw: string | null): Last | null {
	const v = json(raw);
	if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
	const { p, c, t, at } = v as Record<string, unknown>;
	if (typeof p !== 'string' || !PATH.test(p)) return null;
	if (typeof c !== 'string' || !CODE.test(c)) return null;
	if (typeof t !== 'string') return null;
	const title = t.trim().slice(0, MAX_TITLE);
	if (title === '') return null;
	return { p, c, t: title, at: typeof at === 'number' && Number.isFinite(at) ? at : 0 };
}

/** The ticked lesson ids from their stored text: valid ids only, no repeats, at most `MAX_DONE`. Never throws. */
export function parseDone(raw: string | null): string[] {
	const v = json(raw);
	if (!Array.isArray(v)) return [];
	const out = new Set<string>();
	for (const x of v) {
		if (out.size >= MAX_DONE) break;
		if (typeof x === 'string' && ID.test(x)) out.add(x);
	}
	return [...out];
}

export function getLast(s: Store | null = browserStore()): Last | null {
	return parseLast(read(s, LAST_KEY));
}

export function getDone(s: Store | null = browserStore()): string[] {
	return parseDone(read(s, DONE_KEY));
}

/** Saves the ticked ids (cleaned the same way as a read). Returns false when storage refused. */
export function setDone(ids: Iterable<string>, s: Store | null = browserStore()): boolean {
	const clean = parseDone(JSON.stringify([...ids]));
	return clean.length === 0 ? remove(s, DONE_KEY) : write(s, DONE_KEY, JSON.stringify(clean));
}

function remove(s: Store | null, key: string): boolean {
	try {
		s?.removeItem(key);
		return s !== null;
	} catch {
		return false;
	}
}

/** Forgets everything this feature keeps: the ticks and the last lesson. */
export function clearAll(s: Store | null = browserStore()): boolean {
	const a = remove(s, DONE_KEY);
	const b = remove(s, LAST_KEY);
	return a && b;
}

/** "4 of 23 done". */
export function countText(done: number, total: number): string {
	return `${done} of ${total} done`;
}

/** Where the build writes the lessons in study order (`src/pages/lesson-order.json.ts`). */
export const ORDER_URL = '/lesson-order.json';

/** One lesson of the study order: id (the `dfz-done` value), code, path, full title. Sent as `[id, code, path, title]`. */
export interface OrderItem {
	id: string;
	c: string;
	p: string;
	t: string;
}

/** The study order from its JSON, keeping only well-formed rows; `null` when it is not an array or has no usable row. */
export function parseOrder(v: unknown): OrderItem[] | null {
	if (!Array.isArray(v)) return null;
	const out: OrderItem[] = [];
	for (const r of v) {
		if (!Array.isArray(r)) continue;
		const [id, c, p, t] = r as unknown[];
		// The file is the site's own: the address and codes are checked (the address becomes a link), the title is only shown as text.
		if (typeof id === 'string' && ID.test(id) && typeof c === 'string' && CODE.test(c) && typeof p === 'string' && PATH.test(p) && typeof t === 'string' && t) {
			out.push({ id, c, p, t });
		}
	}
	return out.length > 0 ? out : null;
}

export interface Pick {
	p: string;
	c: string;
	t: string;
	/** `continue`: the lesson opened last and not yet ticked; `next`: the first lesson after it that is not ticked. */
	kind: 'continue' | 'next';
}

/**
 * Where "Continue" points (SPEC D64). The last-opened lesson when it is not ticked done (or is not in the order);
 * otherwise the next lesson after it in study order that is not done, the same stage first and then the following
 * stages, wrapping to the start; when every lesson is done, the last-opened one again.
 */
export function pickNext(order: readonly OrderItem[], last: { p: string; c: string; t: string }, done: readonly string[]): Pick {
	const same: Pick = { p: last.p, c: last.c, t: last.t, kind: 'continue' };
	const i = order.findIndex((x) => x.p === last.p);
	if (i < 0 || !done.includes(order[i].id)) return same;
	for (let k = 1; k < order.length; k++) {
		const x = order[(i + k) % order.length];
		if (!done.includes(x.id)) return { p: x.p, c: x.c, t: x.t, kind: 'next' };
	}
	return same;
}
