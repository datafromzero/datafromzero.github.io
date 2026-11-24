// Feedback Worker (SPEC D58): turns the lesson footer's form post into a GitHub issue and redirects to a thank-you
// page. One self-contained module, no imports and no build step, so it can be pasted into the Cloudflare dashboard
// editor (README.md). The GitHub token is the secret GITHUB_TOKEN. Nothing about the sender (IP address, user agent)
// is put into the issue or logged; the IP is used only as a salted hash, held in memory for at most 10 minutes, as the
// key of the rate limiter.

const SITE_ORIGIN = 'https://datafromzero.github.io';
const DEFAULT_REPO = 'datafromzero/datafromzero.github.io';
const SENT = SITE_ORIGIN + '/feedback/sent/';
const NOT_SENT = SITE_ORIGIN + '/feedback/not-sent/';
const MAX_BODY = 16 * 1024;

// The select's values; the label goes into the issue title.
const CATEGORIES = { mistake: 'mistake', unclear: 'unclear', broken: 'code or data', idea: 'idea' };
const LIMITS = { message: 2000, minMessage: 5, title: 120, path: 200 };

const ZWSP = String.fromCharCode(0x200b); // invisible; stops GitHub from linking an @ or a #123
const FULLWIDTH_AT = String.fromCharCode(0xff20);

// Control characters (except tab and new line), zero-width and bidirectional-override characters.
const STRIP = new RegExp(
	'[' +
		[
			[0x00, 0x08], [0x0b, 0x0c], [0x0e, 0x1f], [0x7f, 0x9f], [0x200b, 0x200b], [0x200e, 0x200f],
			[0x202a, 0x202e], [0x2066, 0x2069], [0xfeff, 0xfeff],
		]
			.map(([a, b]) => String.fromCharCode(a) + '-' + String.fromCharCode(b))
			.join('') +
		']',
	'g',
);
const LINE_BREAKS = new RegExp('\\r\\n?|[' + String.fromCharCode(0x2028, 0x2029) + ']', 'g');

/** Removes control, zero-width and bidi characters, normalizes new lines to \n. */
function clean(text) {
	return text.replace(LINE_BREAKS, '\n').replace(STRIP, '').normalize('NFC');
}

/** One-line text for a title: cleaned, whitespace collapsed, cut to `max` characters. */
function oneLine(text, max) {
	return Array.from(clean(text).replace(/\s+/g, ' ').trim()).slice(0, max).join('');
}

/**
 * Makes one line of text safe for an issue title, which is not a code block: no mention, no issue reference, no
 * backslash escape, no github.com address (those make cross-reference events on other repositories).
 */
function neutralizeTitle(text) {
	return text
		.replace(/\\/g, '/')
		.replace(/@/g, '@' + ZWSP)
		.split(FULLWIDTH_AT).join(FULLWIDTH_AT + ZWSP)
		.replace(/#(?=\d)/g, '#' + ZWSP)
		.replace(/github\.com/gi, (m) => m.slice(0, 6) + ZWSP + m.slice(6));
}

/**
 * The message as a fenced code block whose fence is longer than the longest run of backticks in the message, so the
 * message cannot close it. GitHub does not render Markdown or HTML, notify @ mentions, link #123 or turn web addresses
 * (github.com issue addresses included) into cross-references inside a code block.
 */
function fence(message) {
	const longest = Math.max(0, ...(message.match(/`+/g) ?? []).map((run) => run.length));
	const ticks = '`'.repeat(Math.max(3, longest + 1));
	return ticks + 'text\n' + message + '\n' + ticks;
}

/** A path of this site such as /sql/joins/: lowercase letters, digits, dash, slash. */
function safePath(path) {
	return /^\/[a-z0-9\-/]*$/.test(path) && path.length <= LIMITS.path && !path.includes('//') ? path : null;
}

/** Reads the form. The honeypot field is `website`: people never see it, so any value means a bot. */
function parseForm(form) {
	const str = (name) => (typeof form.get(name) === 'string' ? form.get(name) : '');
	if (str('website') !== '') return { ok: false, reason: 'honeypot' };
	const category = str('category');
	const message = clean(str('message')).trim();
	const path = safePath(str('page'));
	const reviewed = str('reviewed');
	const lessonId = str('lesson_id');
	const length = Array.from(message).length;
	if (!Object.hasOwn(CATEGORIES, category)) return { ok: false, reason: 'invalid' };
	if (length < LIMITS.minMessage || length > LIMITS.message) return { ok: false, reason: 'invalid' };
	if (path === null) return { ok: false, reason: 'invalid' };
	if (reviewed !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(reviewed)) return { ok: false, reason: 'invalid' };
	if (lessonId !== '' && !/^[a-z0-9-]{1,80}$/.test(lessonId)) return { ok: false, reason: 'invalid' };
	return {
		ok: true,
		value: {
			category,
			message,
			pageUrl: SITE_ORIGIN + path,
			lessonId,
			lessonTitle: oneLine(str('lesson_title'), LIMITS.title) || path,
			reviewed,
		},
	};
}

/** The issue: title `[feedback] <category>: <lesson title>`, the message in a code block, page, reviewed date, label `feedback`. */
function buildIssue(f) {
	const safeTitle = neutralizeTitle(f.lessonTitle);
	const lines = [
		fence(f.message),
		'',
		'Page: ' + f.pageUrl,
		f.lessonId ? 'Lesson: `' + f.lessonId + '`' : '',
		f.reviewed ? 'Lesson reviewed: ' + f.reviewed : '',
		'',
		'_Sent from the feedback form on the site._',
	];
	return {
		title: '[feedback] ' + CATEGORIES[f.category] + ': ' + safeTitle,
		body: lines.filter((l, i) => l !== '' || lines[i - 1] !== '').join('\n'),
		labels: ['feedback'],
	};
}

/** True when the request comes from the site: the Origin header, or the Referer when a browser sends no Origin. */
function fromSite(origin, referer, site = SITE_ORIGIN) {
	if (origin !== null) return origin === site;
	return referer !== null && referer.startsWith(site + '/');
}

/**
 * Best-effort memory limit for one Worker instance: at most `max` hits per key within `windowMs`. Expired keys are
 * dropped on every call, so a key is held for at most `windowMs`. Callers pass a hash, never the address itself.
 */
function makeLimiter(max, windowMs) {
	const hits = new Map();
	const limiter = (key, now = Date.now()) => {
		for (const [k, times] of hits) {
			const recent = times.filter((t) => now - t < windowMs);
			if (recent.length === 0) hits.delete(k);
			else hits.set(k, recent);
		}
		const recent = hits.get(key) ?? [];
		if (recent.length >= max) return false;
		hits.set(key, [...recent, now]);
		return true;
	};
	limiter.size = () => hits.size;
	return limiter;
}

// A random salt per Worker instance: the same address gets a different key in every instance and after every restart,
// and the address cannot be read back from the key. Made on the first request: Cloudflare does not allow random
// values in global scope, so a module-level getRandomValues call fails the deploy.
let SALT = null;
function instanceSalt() {
	if (SALT === null) SALT = crypto.getRandomValues(new Uint8Array(16));
	return SALT;
}

/** SHA-256 of the salt and the address, as hex. */
async function hashIp(ip, salt = instanceSalt()) {
	const bytes = new TextEncoder().encode(ip);
	const data = new Uint8Array(salt.length + bytes.length);
	data.set(salt);
	data.set(bytes, salt.length);
	const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
	return Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Per Worker instance, in memory: instances come and go, so this is best effort (README).
const memoryLimit = makeLimiter(5, 10 * 60 * 1000);

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to, 'Cache-Control': 'no-store' } });

export default {
	async fetch(request, env) {
		if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
		if (!fromSite(request.headers.get('Origin'), request.headers.get('Referer'))) return new Response('Forbidden', { status: 403 });
		if (!(request.headers.get('Content-Type') ?? '').startsWith('application/x-www-form-urlencoded'))
			return new Response('Unsupported media type', { status: 415 });
		if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY) return redirect(NOT_SENT);

		let parsed;
		try {
			const text = await request.text();
			if (text.length > MAX_BODY) return redirect(NOT_SENT);
			parsed = parseForm(new URLSearchParams(text));
		} catch {
			return redirect(NOT_SENT);
		}
		// A bot that filled the hidden field is told it worked, so it does not retry.
		if (!parsed.ok) return redirect(parsed.reason === 'honeypot' ? SENT : NOT_SENT);

		// Only a salted one-way hash of the address is used from here on, never the address.
		const key = await hashIp(request.headers.get('CF-Connecting-IP') ?? 'unknown');
		if (!memoryLimit(key)) return redirect(NOT_SENT);
		// Optional Cloudflare Rate Limiting binding named RATE_LIMITER (wrangler.toml); absent when pasted in the dashboard.
		if (env.RATE_LIMITER && !(await env.RATE_LIMITER.limit({ key })).success) return redirect(NOT_SENT);

		try {
			const res = await fetch('https://api.github.com/repos/' + (env.GITHUB_REPO || DEFAULT_REPO) + '/issues', {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + env.GITHUB_TOKEN,
					Accept: 'application/vnd.github+json',
					'X-GitHub-Api-Version': '2022-11-28',
					'Content-Type': 'application/json',
					'User-Agent': 'datafromzero-feedback',
				},
				body: JSON.stringify(buildIssue(parsed.value)),
			});
			if (!res.ok) {
				// Only the status goes to the log, never the token, the message or the sender.
				console.error('GitHub answered ' + res.status);
				return redirect(NOT_SENT);
			}
			return redirect(SENT);
		} catch {
			console.error('GitHub request failed');
			return redirect(NOT_SENT);
		}
	},
	// Exposed for tests/feedback-worker.test.ts; Cloudflare ignores extra properties.
	logic: { clean, oneLine, neutralizeTitle, fence, safePath, parseForm, buildIssue, fromSite, makeLimiter, hashIp },
};
