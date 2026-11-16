/**
 * Motion performance probe (dev only, noisy: not part of `npm run check` or CI).
 *
 *   npm run build && npm run perf [-- --out perf.md --json perf.json --runs 3 --vsync --only home]
 *
 * Serves dist/ on a local port, then drives Chromium over CDP with a 4x CPU throttle and records:
 *   intro   fresh load of / with the first 5 s of the hero entrance and the deferred motion setup
 *   scroll  a scripted compositor scroll (synthesized wheel gesture) through the whole page
 *   warm    the same scroll a second time, once every section timeline exists (steady state)
 *   pointer pointer sweep over the hero (desktop only)
 *   docs    the same scroll on a docs page (must stay free of JS work)
 * for 390x844 mobile and 1280x800 desktop. Per window it prints the rAF frame-time distribution
 * (p50, p95, p99, max, frames over 16.7 ms and 8.3 ms), Long Animation Frames with script
 * attribution, main-thread style/layout/script time (Performance.getMetrics deltas), paint,
 * composite and raster time (Tracing pass), DOM node count, and the GPU layer count.
 *
 * --dist <dir> measures another build (to compare with a saved copy), --stacks adds the JS origin of
 * forced style/layout work, --debug prints the trace window bounds.
 * By default Chromium runs without the vsync frame cap, so a rAF delta is the real cost of one
 * frame of work (a proxy for the 8.3 ms budget of a 120 Hz phone). Pass --vsync for 60 Hz pacing.
 * Playwright is resolved from node_modules, else from the global install (set PLAYWRIGHT_PATH).
 */
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const REPO = resolve(fileURLToPath(new URL('..', import.meta.url)));
const THROTTLE = 4;
const BUDGET = 8.3;
const FRAME_60 = 16.7;

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => {
	const i = argv.indexOf(`--${n}`);
	return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const DIST = resolve(opt('dist', join(REPO, 'dist')));
const RUNS = Number(opt('runs', 1));
const VSYNC = flag('vsync');
const ONLY = opt('only', '');

function loadPlaywright() {
	const req = createRequire(import.meta.url);
	const tries = [() => req('playwright'), () => req(process.env.PLAYWRIGHT_PATH ?? ''), () => req(join(execSync('npm root -g').toString().trim(), 'playwright'))];
	for (const t of tries) {
		try {
			return t();
		} catch {}
	}
	throw new Error('playwright not found: install it or set PLAYWRIGHT_PATH');
}
const { chromium } = loadPlaywright();

// ---- static server for dist/ -------------------------------------------------------------------------
const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
	'.json': 'application/json',
	'.png': 'image/png',
	'.xml': 'application/xml',
};
function serve() {
	if (!existsSync(join(DIST, 'index.html'))) throw new Error('dist/ is missing: run `npm run build` first');
	const server = createServer((req, res) => {
		let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
		let file = normalize(join(DIST, p));
		if (!file.startsWith(DIST)) return res.writeHead(403).end();
		if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
		if (!existsSync(file)) return res.writeHead(404).end('not found');
		res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
		res.end(readFileSync(file));
	});
	return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

// ---- in-page instrumentation -------------------------------------------------------------------------
const INIT = () => {
	const P = (window.__perf = { on: false, frames: [], last: 0, loaf: [], t0: 0 });
	const tick = (t) => {
		if (P.on) {
			if (P.last) P.frames.push([t, t - P.last]);
			P.last = t;
		}
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
	try {
		new PerformanceObserver((list) => {
			for (const e of list.getEntries()) {
				P.loaf.push({
					start: e.startTime,
					duration: e.duration,
					blocking: e.blockingDuration,
					styleLayout: e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0,
					scripts: e.scripts.map((s) => ({
						src: (s.sourceURL || '').split('/').pop(),
						fn: s.sourceFunctionName || s.invoker || '',
						type: s.invokerType,
						dur: s.duration,
						forced: s.forcedStyleAndLayoutDuration,
					})),
				});
			}
		}).observe({ type: 'long-animation-frame', buffered: true });
	} catch {}
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pct = (sorted, q) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] : 0);
const r1 = (n) => Math.round(n * 10) / 10;

const PROFILES = {
	mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
	desktop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};

async function scrollThrough(cdp, page, profile, maxMs = 60000) {
	const t0 = Date.now();
	for (;;) {
		const s = await page.evaluate(() => [scrollY, innerHeight, document.documentElement.scrollHeight]);
		if (s[0] + s[1] >= s[2] - 2 || Date.now() - t0 > maxMs) return;
		await cdp.send('Input.synthesizeScrollGesture', {
			x: profile.viewport.width / 2,
			y: profile.viewport.height * 0.7,
			yDistance: -Math.min(900, s[2] - s[0] - s[1]),
			speed: profile.isMobile ? 1800 : 2200,
			gestureSourceType: 'mouse', // wheel: Chromium's synthesized touch gesture does not scroll in emulated mobile
			preventFling: false,
		});
	}
}

async function sweepPointer(cdp, profile, ms = 3000) {
	const { width, height } = profile.viewport;
	const t0 = Date.now();
	let i = 0;
	while (Date.now() - t0 < ms) {
		const t = (Date.now() - t0) / 1000;
		const x = width / 2 + Math.sin(t * 2.1) * width * 0.4;
		const y = height / 2 + Math.sin(t * 3.3 + i * 0) * height * 0.3;
		await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
		i++;
		await sleep(8);
	}
}

const SCENARIOS = {
	intro: { path: '/', profiles: ['mobile', 'desktop'] },
	scroll: { path: '/', profiles: ['mobile', 'desktop'] },
	warm: { path: '/', profiles: ['mobile', 'desktop'] }, // second pass over a page whose sections are all initialized
	pointer: { path: '/', profiles: ['desktop'] },
	docs: { path: '/changelog/', profiles: ['mobile', 'desktop'] },
};

const TRACE_CATS = ['-*', 'devtools.timeline', ...(flag('stacks') ? ['disabled-by-default-devtools.timeline.stack', 'disabled-by-default-v8.cpu_profiler'] : []), 'cc', 'benchmark', 'blink.user_timing'].join(',');
const WANT = new Set(['Layout', 'UpdateLayoutTree', 'PrePaint', 'Paint', 'Layerize', 'Commit', 'RasterTask', 'DrawFrame', 'CompositeLayers', 'UpdateLayer', 'HitTest', 'FunctionCall', 'EvaluateScript', 'RunTask', 'FireAnimationFrame', 'TimerFire', 'IntersectionObserverController::computeIntersections']);

function summarizeTrace(buf, windowed) {
	const json = JSON.parse(buf.toString());
	const events = Array.isArray(json) ? json : json.traceEvents;
	// The measured window is bracketed by performance marks; the intro covers the whole load.
	let from = 0;
	let to = Infinity;
	if (windowed) {
		from = events.findLast((e) => e.name === 'perf-start')?.ts ?? 0;
		to = events.findLast((e) => e.name === 'perf-end')?.ts ?? Infinity;
		if (flag('debug')) console.error('trace window', from, to, events.length, events.filter((e) => /^perf-/.test(e.name)).length);
	}
	const sums = {};
	const counts = {};
	const forced = {};
	const mainFrames = [];
	let mainTotal = 0;
	for (const e of events) {
		if (e.ts < from || e.ts > to) continue;
		// One main-thread frame of work: rAF callbacks, style, layout, paint and commit prep (compositor and raster run off-thread).
		if (e.name === 'ProxyMain::BeginMainFrame' && e.ph === 'X') mainFrames.push(e.dur / 1000), (mainTotal += e.dur / 1000);
		if (flag('stacks') && (e.name === 'Layout' || e.name === 'UpdateLayoutTree') && e.ph === 'X') {
			const st = e.args?.beginData?.stackTrace ?? e.args?.stackTrace;
			const top = st?.[0] ? `${st[0].functionName || '(anon)'} ${String(st[0].url).split('/').pop()}:${st[0].lineNumber}:${st[0].columnNumber}` : '(no JS: lifecycle)';
			const k = `${e.name} <- ${top}`;
			forced[k] = (forced[k] ?? 0) + 1;
		}
		if (e.ph !== 'X' || !WANT.has(e.name)) continue;
		if (e.ts < from || e.ts > to) continue;
		sums[e.name] = (sums[e.name] ?? 0) + e.dur / 1000;
		counts[e.name] = (counts[e.name] ?? 0) + 1;
	}
	mainFrames.sort((a, b) => a - b);
	const main = { n: mainFrames.length, p50: r1(pct(mainFrames, 0.5)), p95: r1(pct(mainFrames, 0.95)), p99: r1(pct(mainFrames, 0.99)), max: r1(mainFrames[mainFrames.length - 1] ?? 0), over167: mainFrames.filter((x) => x > FRAME_60).length, over83: mainFrames.filter((x) => x > BUDGET).length };
	return { sums, counts, forced, main, mainTotal };
}

async function run(browser, base, profileName, scenarioName, trace) {
	const profile = PROFILES[profileName];
	const scenario = SCENARIOS[scenarioName];
	const ctx = await browser.newContext({ ...profile, reducedMotion: 'no-preference', serviceWorkers: 'block' });
	await ctx.addInitScript(INIT);
	const page = await ctx.newPage();
	const cdp = await ctx.newCDPSession(page);
	await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
	await cdp.send('Performance.enable');
	let layers = 0;
	cdp.on('LayerTree.layerTreeDidChange', (e) => {
		if (e.layers) layers = e.layers.length;
	});
	const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));

	let m0;
	let traceStart = 0;
	const startTrace = () => browser.startTracing(page, { categories: TRACE_CATS.split(','), screenshots: false });
	// The intro is traced from navigation; other windows start tracing right before they begin (the buffer fills up otherwise).
	if (trace && scenarioName === 'intro') await startTrace();
	const out = { profile: profileName, scenario: scenarioName };

	if (scenarioName === 'intro') {
		m0 = await metrics();
		await page.addInitScript(() => (window.__perf.on = true));
		await page.goto(base + scenario.path, { waitUntil: 'load' });
		await sleep(5000);
	} else {
		await page.goto(base + scenario.path, { waitUntil: 'load' });
		if (scenarioName !== 'docs') {
			// The intro finishes at about 3 s and the motion chunk loads when idle: wait for both.
			await page.waitForFunction(() => performance.getEntriesByType('resource').some((r) => /motion|sections|gsap/i.test(r.name)) || document.querySelector('.marquee-toggle:not([hidden])'), null, { timeout: 15000 }).catch(() => {});
		}
		await sleep(4500);
		if (scenarioName === 'warm') {
			await scrollThrough(cdp, page, profile);
			await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
			await sleep(1500);
		}
		if (trace) await startTrace();
		await page.evaluate(() => (window.__perf.frames.length = 0, (window.__perf.loaf.length = 0), (window.__perf.last = 0), (window.__perf.on = true), (window.__perf.t0 = performance.now()), performance.mark('perf-start')));
		m0 = await metrics();
		traceStart = trace ? Date.now() : 0;
		if (scenarioName === 'pointer') await sweepPointer(cdp, profile);
		else await scrollThrough(cdp, page, profile);
		await sleep(400);
	}
	await page.evaluate(() => performance.mark('perf-end'));
	const m1 = await metrics();
	// Enabling the LayerTree domain at the end reports the final compositor layer list once.
	await cdp.send('LayerTree.enable').catch(() => {});
	await sleep(300);
	const data = await page.evaluate(() => {
		const P = window.__perf;
		P.on = false;
		return { frames: P.frames, loaf: P.loaf, nodes: document.querySelectorAll('*').length, t0: P.t0, scripts: performance.getEntriesByType('resource').filter((r) => r.name.endsWith('.js')).map((r) => ({ n: r.name.split('/').pop(), t: r.transferSize || r.encodedBodySize })) };
	});
	if (trace) {
		const buf = await browser.stopTracing();
		out.trace = summarizeTrace(buf, scenarioName !== 'intro');
	}
	await ctx.close();

	const d = data.frames.map((f) => f[1]).sort((a, b) => a - b);
	out.frames = { n: d.length, p50: r1(pct(d, 0.5)), p95: r1(pct(d, 0.95)), p99: r1(pct(d, 0.99)), max: r1(d[d.length - 1] ?? 0), over167: d.filter((x) => x > FRAME_60).length, over83: d.filter((x) => x > BUDGET).length };
	// After the intro: frames that start later than 3.5 s (hero keyframes end at about 3.1 s)
	if (scenarioName === 'intro') {
		const late = data.frames.filter((f) => f[0] > 3500).map((f) => f[1]).sort((a, b) => a - b);
		out.late = { n: late.length, p50: r1(pct(late, 0.5)), p95: r1(pct(late, 0.95)), max: r1(late[late.length - 1] ?? 0) };
	}
	out.loaf = data.loaf.map((l) => ({ ...l, start: Math.round(l.start - (scenarioName === 'intro' ? 0 : data.t0)), duration: Math.round(l.duration), blocking: Math.round(l.blocking), styleLayout: Math.round(l.styleLayout) }));
	out.heavy = data.frames.filter((f) => f[1] > FRAME_60).map((f) => Math.round(f[0] - (scenarioName === 'intro' ? 0 : data.t0)));
	out.nodes = data.nodes;
	out.layers = layers;
	out.js = data.scripts;
	const dm = (k) => (m1[k] - m0[k]) * 1000;
	out.main = { task: r1(dm('TaskDuration')), script: r1(dm('ScriptDuration')), layout: r1(dm('LayoutDuration')), style: r1(dm('RecalcStyleDuration')), layouts: m1.LayoutCount - m0.LayoutCount, recalcs: m1.RecalcStyleCount - m0.RecalcStyleCount };
	return out;
}

// ---- report -----------------------------------------------------------------------------------------
function table(results) {
	const L = [];
	L.push(`Chromium, CPU throttle ${THROTTLE}x, ${VSYNC ? 'vsync (60 Hz) pacing' : 'no frame-rate cap (a frame is as long as its work)'}, budget ${BUDGET} ms.`);
	L.push('');
	L.push('| scenario | profile | frames | p50 | p95 | p99 | max | >16.7 | >8.3 | LoAF (>50 ms) | LoAF max | task ms | script ms | layout ms | style ms | layouts | nodes | layers |');
	L.push('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
	for (const r of results) {
		const lo = r.loaf.length;
		const lm = lo ? Math.max(...r.loaf.map((l) => l.duration)) : 0;
		L.push(`| ${r.scenario} | ${r.profile} | ${r.frames.n} | ${r.frames.p50} | ${r.frames.p95} | ${r.frames.p99} | ${r.frames.max} | ${r.frames.over167} | ${r.frames.over83} | ${lo} | ${lm} | ${r.main.task} | ${r.main.script} | ${r.main.layout} | ${r.main.style} | ${r.main.layouts} | ${r.nodes} | ${r.layers} |`);
	}
	const traced = results.filter((r) => r.trace);
	if (traced.length) {
		L.push('');
		L.push('Main-thread work per frame (ProxyMain::BeginMainFrame from the trace pass; this is the number to hold under 8.3 ms):');
		L.push('');
		L.push('| scenario | profile | frames | p50 | p95 | p99 | max | >16.7 | >8.3 | total ms |');
		L.push('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|');
		for (const r of traced) {
			const m = r.trace.main;
			L.push(`| ${r.scenario} | ${r.profile} | ${m.n} | ${m.p50} | ${m.p95} | ${m.p99} | ${m.max} | ${m.over167} | ${m.over83} | ${r1(r.trace.mainTotal ?? 0)} |`);
		}
		L.push('');
		L.push('Trace, ms summed over the window (intro includes load):');
		L.push('');
		L.push('| scenario | profile | Layout | UpdateLayoutTree | PrePaint | Paint | Layerize | Commit | RasterTask | DrawFrame | FunctionCall | FireAnimationFrame |');
		L.push('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
		for (const r of traced) {
			const s = (k) => r1(r.trace.sums[k] ?? 0);
			L.push(`| ${r.scenario} | ${r.profile} | ${s('Layout')} | ${s('UpdateLayoutTree')} | ${s('PrePaint')} | ${s('Paint')} | ${s('Layerize')} | ${s('Commit')} | ${s('RasterTask')} | ${s('DrawFrame')} | ${s('FunctionCall')} | ${s('FireAnimationFrame')} |`);
		}
	}
	if (flag('stacks')) {
		L.push('');
		L.push('Layout and style recalculation by JS origin (--stacks):');
		for (const r of results.filter((x) => x.trace)) {
			const top = Object.entries(r.trace.forced).sort((a, b) => b[1] - a[1]).slice(0, 8);
			L.push(`- ${r.scenario}/${r.profile}: ${top.map(([k, n]) => `${n}x ${k}`).join(' | ')}`);
		}
	}
	const intro = results.filter((r) => r.late);
	if (intro.length) {
		L.push('');
		L.push('Intro, frames after 3.5 s only (steady state once the entrance and the motion setup are done):');
		for (const r of intro) L.push(`- ${r.profile}: ${r.late.n} frames, p50 ${r.late.p50}, p95 ${r.late.p95}, max ${r.late.max} ms`);
	}
	const loafs = results.filter((r) => r.loaf.length);
	if (loafs.length) {
		L.push('');
		L.push('Long animation frames (>50 ms), start ms from window start, with the scripts that ran in them:');
		for (const r of loafs) {
			for (const l of r.loaf) {
				const sc = l.scripts
					.filter((s) => s.dur >= 5)
					.map((s) => `${s.src || '(inline)'}:${s.fn || s.type} ${Math.round(s.dur)}ms${s.forced ? ` (forced layout ${Math.round(s.forced)}ms)` : ''}`)
					.join('; ');
				L.push(`- ${r.scenario}/${r.profile} @${l.start}: ${l.duration} ms (blocking ${l.blocking}, style+layout ${l.styleLayout})${sc ? `: ${sc}` : ''}`);
			}
		}
	}
	return L.join('\n');
}

// ---- main -------------------------------------------------------------------------------------------
const { server, base } = await serve();
let browser;
try {
	const args = ['--enable-precise-memory-info', '--enable-benchmarking'];
	if (!VSYNC) args.push('--disable-frame-rate-limit', '--disable-gpu-vsync');
	const launch = { headless: true, args };
	const envPath = process.env.CHROME_PATH;
	if (envPath) launch.executablePath = envPath;
	browser = await chromium.launch(launch);
	const results = [];
	for (const [sName, sc] of Object.entries(SCENARIOS)) {
		if (ONLY && !sName.startsWith(ONLY) && !(ONLY === 'home' && sName !== 'docs')) continue;
		for (const pName of sc.profiles) {
			// Median of RUNS timing passes by p95, plus one separate traced pass (tracing distorts frame times).
			const runs = [];
			for (let i = 0; i < RUNS; i++) runs.push(await run(browser, base, pName, sName, false));
			runs.sort((a, b) => a.frames.p95 - b.frames.p95);
			const med = runs[Math.floor(runs.length / 2)];
			const traced = await run(browser, base, pName, sName, true);
			med.trace = traced.trace;
			results.push(med);
			process.stderr.write(`done ${sName}/${pName}\n`);
		}
	}
	const md = table(results);
	console.log(md);
	const out = opt('out', '');
	if (out) writeFileSync(out, md + '\n');
	const js = opt('json', '');
	if (js) writeFileSync(js, JSON.stringify(results, null, 1));
} finally {
	await browser?.close();
	server.close();
}
