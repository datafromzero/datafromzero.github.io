// Feedback Worker (SPEC D58): turns the lesson footer's form post into a GitHub issue and redirects to a thank-you
// page. One self-contained module, no imports and no build step, so it can be pasted into the Cloudflare dashboard
// editor (README.md). The GitHub token is the secret GITHUB_TOKEN. Nothing about the sender (IP address, user agent)
// is stored, logged or put into the issue; the IP is only the key of the rate limiter.

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

/** Makes text safe for an issue body: no mention, no issue reference, no HTML or Markdown link or code syntax. */
function neutralize(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\[/g, '\\[')
		.replace(/\]/g, '\\]')
		.replace(/`/g, '\\`')
		.replace(/@/g, '@' + ZWSP)
		.split(FULLWIDTH_AT).join(FULLWIDTH_AT + ZWSP)
		.replace(/#(?=\d)/g, '#' + ZWSP)
		.replace(/\b(GH)-(?=\d)/gi, '$1-' + ZWSP);
}

/** The message as a Markdown quote, so it can never open a heading, list or code block. */
function quote(message) {
	return neutralize(message)
		.split('\n')
		.map((line) => (line.trim() === '' ? '>' : '> ' + line))
		.join('\n');
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

/** The issue: title `[feedback] <category>: <lesson title>`, quoted message, page, reviewed date, label `feedback`. */
function buildIssue(f) {
	const safeTitle = f.lessonTitle.replace(/@/g, '@' + ZWSP).replace(/#(?=\d)/g, '#' + ZWSP);
	const lines = [
		quote(f.message),
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

/** Best-effort memory limit for one Worker instance: at most `max` hits per key within `windowMs`. */
function makeLimiter(max, windowMs) {
	const hits = new Map();
	return (key, now = Date.now()) => {
		const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
		if (recent.length >= max) {
			hits.set(key, recent);
			return false;
		}
		recent.push(now);
		hits.set(key, recent);
		if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
		return true;
	};
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

		const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
		if (!memoryLimit(ip)) return redirect(NOT_SENT);
		// Optional Cloudflare Rate Limiting binding named RATE_LIMITER (wrangler.toml); absent when pasted in the dashboard.
		if (env.RATE_LIMITER && !(await env.RATE_LIMITER.limit({ key: ip })).success) return redirect(NOT_SENT);

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
	logic: { clean, oneLine, neutralize, quote, safePath, parseForm, buildIssue, fromSite, makeLimiter },
};
