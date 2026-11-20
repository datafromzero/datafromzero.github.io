#!/usr/bin/env node
// Project knowledge graph for datafromzero (graphify-style, deterministic, no dependencies).
//   node scripts/kb.mjs build            write .claude/kb/graph.json and GRAPH_REPORT.md
//   node scripts/kb.mjs check            exit 1 if the committed graph is stale
//   node scripts/kb.mjs query <terms>    matching nodes plus neighbors (depth 2)
//   node scripts/kb.mjs path <a> <b>     shortest path between two nodes
//   node scripts/kb.mjs explain <id>     one node, its location and all edges
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, '.claude/kb');
const GRAPH_FILE = join(OUT_DIR, 'graph.json');
const REPORT_FILE = join(OUT_DIR, 'GRAPH_REPORT.md');
const SELF = 'scripts/kb.mjs';

// ---------------------------------------------------------------- helpers
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const clean = (s) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function walk(rel, out = []) {
	const abs = join(ROOT, rel);
	if (!existsSync(abs)) return out;
	for (const name of readdirSync(abs).sort()) {
		if (['node_modules', 'dist', '.astro', '.git', 'worktrees', '__pycache__', '.pytest_cache', '.venv'].includes(name)) continue;
		const r = posix.join(rel, name);
		if (statSync(join(ROOT, r)).isDirectory()) walk(r, out);
		else out.push(r);
	}
	return out;
}

// ---------------------------------------------------------------- build
function buildGraph() {
	const nodes = new Map();
	const edgeMap = new Map();
	const pending = [];
	const addNode = (id, type, label, file, line, extra = {}) => {
		if (!nodes.has(id)) nodes.set(id, { id, type, label, file, line, ...extra });
		return nodes.get(id);
	};
	const addEdge = (s, t, r, line) => {
		if (s !== t) pending.push([s, t, r, line]);
	};

	// ---- file inventory
	const rootFiles = ['SPEC.md', 'CLAUDE.md', 'README.md', 'CHANGELOG.md', 'astro.config.mjs', 'package.json', 'tsconfig.json', '.nvmrc', 'CITATION.cff', 'cspell.json']
		.filter((f) => existsSync(join(ROOT, f)));
	const files = [
		...rootFiles,
		...walk('src').filter((f) => !/\.(svg|png|jpe?g|woff2?|ico|webp)$/.test(f)),
		...walk('scripts'),
		...walk('.github').filter((f) => /\.ya?ml$/.test(f)),
		...walk('.claude').filter((f) => f.endsWith('.md') && !f.startsWith('.claude/kb/')),
		...(existsSync(join(ROOT, 'design/README.md')) ? ['design/README.md'] : []),
		...walk('research').filter((f) => f.endsWith('.md')),
	].filter((f, i, a) => a.indexOf(f) === i);
	const fileSet = new Set(files);
	const agentOf = (f) => (/^\.claude\/agents\/(?!README)[^/]+\.md$/.test(f) ? f.split('/').pop().replace(/\.md$/, '') : null);
	const tplOf = (f) => (/^\.github\/ISSUE_TEMPLATE\/[^/]+\.ya?ml$/.test(f) ? f.split('/').pop().replace(/\.ya?ml$/, '') : null);
	const alias = new Map(); // path -> node id
	const fileType = (f) => {
		if (/^(astro\.config|package\.json|tsconfig|\.nvmrc|CITATION|cspell)/.test(f) || f.startsWith('.github/workflows/')) return 'config';
		if (f.startsWith('src/components/')) return 'component';
		if (f.startsWith('src/layouts/')) return 'layout';
		if (f.startsWith('src/pages/')) return 'page';
		if (f.startsWith('src/styles/')) return 'style';
		if (f.startsWith('src/content/i18n/') || f.startsWith('src/i18n/')) return 'i18n';
		if (f.startsWith('src/content/')) return 'content';
		if (f.startsWith('src/scripts/') || f.startsWith('scripts/')) return 'script';
		if (f.startsWith('src/')) return 'module';
		if (f.startsWith('.claude/skills/')) return 'skill';
		return 'doc';
	};
	const routeOf = (f) => '/' + f.replace(/^src\/pages\//, '').replace(/index\.astro$/, '').replace(/\.astro$/, '/');
	const lines = new Map();
	for (const f of files) {
		const text = read(f);
		const ls = text.split('\n');
		lines.set(f, ls);
		const a = agentOf(f);
		const tp = tplOf(f);
		if (a) {
			const fm = {};
			const m = text.match(/^---\n([\s\S]*?)\n---/);
			if (m) for (const l of m[1].split('\n')) { const k = l.match(/^(\w+):\s*(.*)$/); if (k) fm[k[1]] = k[2]; }
			addNode(`agent:${fm.name || a}`, 'agent', fm.name || a, f, 1, { model: fm.model, effort: fm.effort, text: clip(clean(fm.description || ''), 400) });
			alias.set(f, `agent:${fm.name || a}`);
		} else if (tp) {
			const nm = (text.match(/^name:\s*(.*)$/m) || [])[1] || tp;
			const lb = (text.match(/^labels:\s*(.*)$/m) || [])[1] || '';
			addNode(`tpl:${tp}`, 'template', clean(nm), f, 1, { text: clip(`${nm} labels ${lb}`, 200) });
			alias.set(f, `tpl:${tp}`);
		} else {
			const t = fileType(f);
			const base = f.split('/').pop();
			const label = t === 'page' ? routeOf(f) : t === 'component' || t === 'layout' ? base.replace(/\.astro$/, '') : base;
			const extra = {};
			if (t === 'i18n' && f.endsWith('.json')) {
				try { extra.keys = Object.keys(JSON.parse(text)).length; } catch { /* ignore */ }
			}
			addNode(f, t, label, f, 1, extra);
			alias.set(f, f);
		}
	}

	// ---- dependencies and npm scripts
	const pkg = JSON.parse(read('package.json'));
	const pkgLines = lines.get('package.json');
	const lineOf = (arr, needle) => { const i = arr.findIndex((l) => l.includes(needle)); return i < 0 ? 1 : i + 1; };
	const depNames = [];
	for (const group of ['dependencies', 'devDependencies']) {
		for (const [n, v] of Object.entries(pkg[group] || {})) {
			depNames.push(n);
			addNode(`pkg:${n}`, 'dependency', n, 'package.json', lineOf(pkgLines, `"${n}"`), { group });
		}
	}
	depNames.sort((a, b) => b.length - a.length);
	const pkgNode = (name, line, from) => {
		const id = `pkg:${name}`;
		if (!nodes.has(id)) addNode(id, 'dependency', name, 'package.json', 1, { version: 'transitive', group: 'transitive' });
		addEdge(from, id, 'imports', line);
	};
	for (const [n, cmd] of Object.entries(pkg.scripts || {})) {
		addNode(`npm:${n}`, 'npm-script', `npm run ${n}`, 'package.json', lineOf(pkgLines, `"${n}"`), { text: cmd });
		for (const m of cmd.matchAll(/[\w./-]+\.(?:mjs|js|ts)\b/g)) if (fileSet.has(m[0])) addEdge(`npm:${n}`, m[0], 'runs', 1);
	}

	// ---- exports, imports, comments (code files)
	const codeRe = /\.(ts|tsx|mjs|js|astro|css)$/;
	const resolveRel = (from, spec) => {
		const base = posix.normalize(posix.join(posix.dirname(from), spec));
		const cands = [base, base.replace(/\.js$/, '.ts')];
		for (const e of ['.ts', '.tsx', '.mjs', '.js', '.astro', '.css', '.json']) cands.push(base + e, `${base}/index${e}`);
		return cands.find((c) => fileSet.has(c)) || null;
	};
	const importRes = [
		/\bimport\s+(?:[\w*{}\s,$]+?\s+from\s+)?['"]([^'"\n]+)['"]/g,
		/\bexport\s+(?:\*|\{[^}]*\})\s*(?:as\s+\w+\s+)?from\s+['"]([^'"\n]+)['"]/g,
		/\bimport\(\s*['"]([^'"\n]+)['"]\s*\)/g,
	];
	const isComment = (l) => /(\/\/|\/\*|^\s*\*|<!--|^\s*#)/.test(l);
	const commentText = (ls) => clip(clean(ls.filter(isComment).map((l) => l.replace(/^\s*(\/\/+|\/\*+|\*+|<!--|#)\s?/, '').replace(/(\*\/|-->)\s*$/, '')).join(' ')), 1200);
	for (const f of files) {
		if (!codeRe.test(f)) continue;
		const ls = lines.get(f);
		const text = ls.join('\n');
		const lineAt = (idx) => text.slice(0, idx).split('\n').length;
		if (f !== SELF) { const ct = commentText(ls); if (ct) nodes.get(f).text = ct; }
		for (const re of importRes) {
			for (const m of text.matchAll(re)) {
				const spec = m[1];
				const line = lineAt(m.index);
				if (spec.startsWith('node:') || spec.startsWith('virtual:') || !/^@?[a-z]/i.test(spec)) continue;
				if (spec.startsWith('.')) {
					const t = resolveRel(f, spec);
					if (t) addEdge(f, t, /\.astro$/.test(t) && /\.astro$/.test(f) ? 'uses' : 'imports', line);
				} else {
					const name = spec.startsWith('astro:') ? 'astro' : spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
					pkgNode(name, line, f);
				}
			}
		}
		for (let i = 0; i < ls.length; i++) {
			const m = ls[i].match(/^export\s+(?:default\s+)?(?:async\s+)?(const|let|function\*?|class|interface|type|enum)\s+(\w+)/);
			if (m && m[2] !== 'Props') {
				const sid = `${f}#${m[2]}`;
				addNode(sid, 'symbol', m[2], f, i + 1, { kind: m[1].replace('*', '') });
				addEdge(f, sid, 'defines', i + 1);
			}
		}
	}
	// config: quoted strings that name files or packages, and the Starlight components map
	for (const f of files.filter((x) => /^astro\.config\./.test(x))) {
		const ls = lines.get(f);
		ls.forEach((l, i) => {
			for (const m of l.matchAll(/['"](\.\/[^'"]+|@?[\w-]+(?:\/[^'"]*)?)['"]/g)) {
				const s = m[1];
				if (s.startsWith('./')) { const t = fileSet.has(s.slice(2)) ? s.slice(2) : null; if (t) addEdge(f, t, 'references', i + 1); }
				else { const d = depNames.find((n) => s === n || s.startsWith(n + '/')); if (d) addEdge(f, `pkg:${d}`, 'references', i + 1); }
			}
		});
		const start = ls.findIndex((l) => /\bcomponents:\s*\{/.test(l));
		if (start >= 0) {
			for (let i = start + 1; i < ls.length && !/^\s*\}/.test(ls[i]); i++) {
				const m = ls[i].match(/^\s*(\w+):\s*['"]\.\/(src\/[^'"]+)['"]/);
				if (!m) continue;
				const sid = `sl:${m[1]}`;
				addNode(sid, 'starlight-component', `Starlight ${m[1]} override`, f, i + 1, { text: `starlight component override ${m[1]}` });
				if (fileSet.has(m[2])) addEdge(m[2], sid, 'overrides', i + 1);
			}
		}
	}
	// content components used in .md/.mdx lessons
	const contentComps = files.filter((f) => /^src\/components\/content\/\w+\.astro$/.test(f));
	for (const f of files.filter((x) => /^src\/content\/docs\/.*\.mdx?$/.test(x))) {
		lines.get(f).forEach((l, i) => {
			for (const c of contentComps) if (new RegExp(`<${c.split('/').pop().replace('.astro', '')}\\b`).test(l)) addEdge(f, c, 'uses', i + 1);
		});
	}
	// content types
	const schemaFile = 'src/lib/content-schemas.ts';
	if (fileSet.has(schemaFile)) {
		const ls = lines.get(schemaFile);
		const li = ls.findIndex((l) => /^export type Kind\s*=/.test(l));
		if (li >= 0) {
			for (const m of ls[li].matchAll(/'(\w+)'/g)) {
				const k = m[1];
				const sym = `${schemaFile}#${k[0].toUpperCase()}${k.slice(1)}Schema`;
				addNode(`ctype:${k}`, 'content-type', `${k} (content type)`, schemaFile, li + 1, { text: `content type ${k} schema zod frontmatter` });
				if (nodes.has(sym)) addEdge(`ctype:${k}`, sym, 'validated-by', li + 1);
			}
		}
	}

	// ---- SPEC.md
	const owner = new Map(); // file -> (lineNo) => node id
	// ---- research package (research/**/*.md): one node per ## / ### heading, searchable by its text
	for (const f of files.filter((x) => x.startsWith('research/') && x.endsWith('.md'))) {
		const rl = lines.get(f) || [];
		const secs = [];
		const base = 'R:' + f.replace(/^research\//, '').replace(/\.md$/, '');
		let parent = base, fence = false;
		rl.forEach((l, i) => {
			if (/^```/.test(l)) fence = !fence;
			// also index numbered bold-lead findings ("**3. groupby clicks …**") and per-lesson table rows ("| `slug` | …")
			// as sub-sections, so a finding or a lesson row is found by its own words, not only by its heading's
			const b = !fence && (l.match(/^\*\*(\d+\.\s[^*]+)\*\*/) || l.match(/^\|\s*`([a-z0-9-]+)`\s*\|/));
			const h = !fence && (l.match(/^(#{2,3})\s+(.*)$/) || (b && [l, '###', b[1]]));
			if (!h) return;
			const label = clean(h[2]);
			const id = h[1] === '##' ? `${base}#${slug(label)}` : `${parent}:${slug(label)}`;
			if (h[1] === '##') parent = id;
			if (nodes.has(id)) return;
			secs.push({ id, line: i + 1 });
			addNode(id, 'research-section', label, f, i + 1, {});
		});
		secs.forEach((s, i) => {
			s.end = i + 1 < secs.length ? secs[i + 1].line - 1 : rl.length;
			nodes.get(s.id).end = s.end;
			nodes.get(s.id).text = clip(clean(nodes.get(s.id).label + ' ' + rl.slice(s.line, s.end).join(' ')), 1500);
		});
	}
	const spec = lines.get('SPEC.md') || [];
	const secs = [];
	let fence = false;
	spec.forEach((l, i) => {
		if (/^```/.test(l)) fence = !fence;
		const m = !fence && l.match(/^(#{1,3})\s+(.*)$/);
		if (m) secs.push({ level: m[1].length, text: m[2], line: i + 1 });
	});
	const specSections = [];
	secs.forEach((s, i) => {
		s.end = i + 1 < secs.length ? secs[i + 1].line - 1 : spec.length;
		const n = s.text.match(/^(\d+(?:\.\d+)?)\.?\s+(.*)$/);
		if (s.level < 2 || !n) return;
		const label = clean(n[2].replace(/\s*—\s*\*\*CONTRACT\*\*/, ''));
		const body = clean(spec.slice(s.line, s.end).join(' '));
		const node = addNode(`S${n[1]}`, 'spec-section', label, 'SPEC.md', s.line, { end: s.end, text: clip(label + ' ' + body, 3000) });
		if (/CONTRACT/.test(s.text)) node.contract = true;
		specSections.push(node);
	});
	const decisions = [];
	spec.forEach((l, i) => {
		const m = l.match(/^\|\s*(D\d+)\s*\|(.*)\|\s*$/);
		if (!m) return;
		const cells = ('|' + m[2]).split('|').slice(1).map(clean);
		const node = addNode(m[1], 'decision', cells[0] || m[1], 'SPEC.md', i + 1, { choice: cells[1] || '', text: clip(cells.join(' '), 900) });
		node.consequence = cells[2] || '';
		decisions.push(node);
	});
	const decLine = new Map(decisions.map((d) => [d.line, d.id]));
	owner.set('SPEC.md', (ln) => {
		if (decLine.has(ln)) return decLine.get(ln);
		for (let i = specSections.length - 1; i >= 0; i--) if (ln >= specSections[i].line && ln <= specSections[i].end) return specSections[i].id;
		return 'SPEC.md';
	});

	// ---- CLAUDE.md
	const cl = lines.get('CLAUDE.md') || [];
	const clOwner = new Map();
	{
		let sect = '', rule = 0, ms = null;
		cl.forEach((l, i) => {
			const h = l.match(/^##\s+(.*)$/);
			if (h) { sect = h[1]; ms = null; return; }
			if (/^Hard rules/i.test(sect) || /^## Hard rules/.test(l)) { /* handled via sect */ }
			if (/^Hard rules/i.test(sect) && /^- \*\*/.test(l)) {
				rule++;
				const t = l.replace(/^- \*\*/, '').replace(/\*\*.*$/, '').replace(/[.:]$/, '');
				addNode(`R${rule}`, 'rule', clean(t), 'CLAUDE.md', i + 1, { text: clip(clean(l), 600) });
				clOwner.set(i + 1, `R${rule}`); ms = `R${rule}`; return;
			}
			const m = /^Build plan/i.test(sect) && l.match(/^(\d+)\.\s+\*\*(.+?):?\*\*:?\s*(.*)$/);
			if (m) {
				ms = `M${m[1]}`;
				addNode(ms, 'build plan', clean(m[2]).replace(/:$/, ''), 'CLAUDE.md', i + 1, { text: clean(l) });
				clOwner.set(i + 1, ms); return;
			}
			if (ms && /^\s+\S/.test(l)) { clOwner.set(i + 1, ms); nodes.get(ms).text = clip(nodes.get(ms).text + ' ' + clean(l), 700); }
			else if (!/^\s*$/.test(l) && !/^(- \*\*|\d+\.)/.test(l)) ms = null;
		});
	}
	owner.set('CLAUDE.md', (ln) => clOwner.get(ln) || 'CLAUDE.md');

	// ---- design/README.md
	const dg = lines.get('design/README.md') || [];
	const dgSecs = [];
	{
		let parent = '', fenceD = false;
		dg.forEach((l, i) => {
			if (/^```/.test(l)) fenceD = !fenceD;
			const h = !fenceD && l.match(/^(#{2,3})\s+(.*)$/);
			if (!h) return;
			const n = h[2].match(/^(\d+)\.\s+(.*)$/);
			let id, label;
			if (n) { id = `DG${n[1]}`; label = clean(n[2]); parent = id; } else { label = clean(h[2]); id = `${parent || 'DG'}:${slug(label)}`; }
			dgSecs.push({ id, line: i + 1 });
			addNode(id, 'design-section', label, 'design/README.md', i + 1, {});
		});
		dgSecs.forEach((s, i) => {
			s.end = i + 1 < dgSecs.length ? dgSecs[i + 1].line - 1 : dg.length;
			nodes.get(s.id).end = s.end;
			nodes.get(s.id).text = clip(clean(nodes.get(s.id).label + ' ' + dg.slice(s.line, s.end).join(' ')), 2000);
		});
		dg.forEach((l, i) => {
			const m = l.match(/^\|\s*`(--[\w-]+)`\s*\|\s*([^|]*)\|\s*([^|]*)\|/);
			if (!m) return;
			addNode(`token:${m[1]}`, 'token', m[1], 'design/README.md', i + 1, { value: clean(m[2]), text: clean(`${m[1]} ${m[2]} ${m[3]}`) });
		});
	}
	owner.set('design/README.md', (ln) => {
		for (let i = dgSecs.length - 1; i >= 0; i--) if (ln >= dgSecs[i].line && ln <= dgSecs[i].end) return dgSecs[i].id;
		return 'design/README.md';
	});
	// tokens used in CSS
	for (const f of files.filter((x) => x.endsWith('.css'))) {
		lines.get(f).forEach((l, i) => {
			for (const m of l.matchAll(/(--[\w-]+)(?![\w-])/g)) if (nodes.has(`token:${m[1]}`)) addEdge(f, `token:${m[1]}`, 'uses-token', i + 1);
		});
	}

	// ---- mentions: sections, decisions, file paths
	const decSet = new Set(decisions.map((d) => d.id));
	const pathRe = /[A-Za-z0-9_.@/-]+\.(?:md|mdx|mjs|ts|astro|json|css|yml|yaml|js|cff)\b/g;
	const resolvePath = (p) => {
		p = p.replace(/^\.\//, '');
		if (alias.has(p)) return alias.get(p);
		return null;
	};
	const mentionFiles = files.filter((f) => f !== SELF && f !== 'CHANGELOG.md' && (/\.(md|mdx|yml|yaml)$/.test(f) || codeRe.test(f) || /^astro\.config/.test(f)) && !/^src\/content\/docs\//.test(f));
	for (const f of mentionFiles) {
		const isDoc = /\.(md|yml|yaml)$/.test(f) && !f.startsWith('src/');
		const defSpace = f === 'design/README.md' ? 'design' : 'spec';
		const own = owner.get(f) || (() => alias.get(f) || f);
		const ls = lines.get(f);
		ls.forEach((l, i) => {
			if (!isDoc && !isComment(l)) return;
			const src = own(i + 1);
			if (!nodes.has(src)) return;
			for (const m of l.matchAll(/(SPEC\s*|design\/README(?:\.md)?\s*)?§§?\s?(\d+(?:\.\d+)?)((?:\s*[,/&]\s*(?:§\s?)?\d+(?:\.\d+)?)*)/g)) {
				const pre = m[1] || '';
				const back = l.slice(Math.max(0, m.index - 40), m.index);
				const space = /^SPEC/.test(pre) ? 'spec' : /design/.test(pre) || /design\/README\S*\s*$/.test(back) ? 'design' : defSpace;
				for (const num of [m[2], ...[...(m[3] || '').matchAll(/\d+(?:\.\d+)?/g)].map((x) => x[0])]) {
					const tid = space === 'spec' ? `S${num}` : `DG${num}`;
					if (nodes.has(tid)) addEdge(src, tid, 'mentions', i + 1);
				}
			}
			for (const m of l.matchAll(/\bD(\d{1,2})\b/g)) if (decSet.has(`D${m[1]}`)) addEdge(src, `D${m[1]}`, 'mentions', i + 1);
			for (const m of l.matchAll(pathRe)) {
				const t = resolvePath(m[0]);
				if (t && t !== src) addEdge(src, t, 'mentions', i + 1);
			}
		});
	}
	// SPEC sections that describe a content type
	for (const k of ['lesson', 'reference', 'glossary', 'career', 'story']) {
		const s = specSections.find((x) => x.id.startsWith('S5.') && x.label.toLowerCase().startsWith(k));
		if (s && nodes.has(`ctype:${k}`)) addEdge(`ctype:${k}`, s.id, 'specified-by', nodes.get(`ctype:${k}`).line);
	}

	// ---- finalize edges
	for (const [s, t, r, line] of pending) {
		if (!nodes.has(s) || !nodes.has(t)) continue;
		const key = `${s}\t${t}\t${r}`;
		const prev = edgeMap.get(key);
		if (!prev || line < prev.l) edgeMap.set(key, { s, t, r, l: line });
	}
	const nodeList = [...nodes.values()].sort((a, b) => cmp(a.id, b.id));
	const edgeList = [...edgeMap.values()].sort((a, b) => cmp(a.s, b.s) || cmp(a.t, b.t) || cmp(a.r, b.r));
	return { nodes: nodeList, edges: edgeList };
}

// ---------------------------------------------------------------- graph analysis
function analyze(g) {
	const byId = new Map(g.nodes.map((n) => [n.id, n]));
	const adj = new Map(g.nodes.map((n) => [n.id, new Map()]));
	for (const e of g.edges) {
		adj.get(e.s).set(e.t, (adj.get(e.s).get(e.t) || 0) + 1);
		adj.get(e.t).set(e.s, (adj.get(e.t).get(e.s) || 0) + 1);
	}
	const deg = (id) => adj.get(id).size;
	const ids = g.nodes.map((n) => n.id);
	const lab = new Map(ids.map((i) => [i, i]));
	for (let it = 0; it < 30; it++) {
		let changed = false;
		for (const id of ids) {
			const nb = adj.get(id);
			if (!nb.size) continue;
			const tally = new Map();
			for (const [o, w0] of [...nb].sort((a, b) => cmp(a[0], b[0]))) { const w = w0 / Math.sqrt(deg(id) * deg(o)); tally.set(lab.get(o), (tally.get(lab.get(o)) || 0) + w); }
			let best = null, bw = -1;
			for (const [l, w] of [...tally].sort((a, b) => cmp(a[0], b[0]))) if (w > bw + 1e-9) { best = l; bw = w; }
			if (best !== lab.get(id)) { lab.set(id, best); changed = true; }
		}
		if (!changed) break;
	}
	const groups = new Map();
	for (const id of ids) { const l = lab.get(id); if (!groups.has(l)) groups.set(l, []); groups.get(l).push(id); }
	const byDeg = (a, b) => deg(b) - deg(a) || cmp(a, b);
	const communities = [...groups.values()]
		.map((m) => m.sort(byDeg))
		.sort((a, b) => b.length - a.length || cmp(a[0], b[0]))
		.map((members, i) => ({ id: i + 1, members, name: byId.get(members[0]).label }));
	const commOf = new Map();
	for (const c of communities) for (const m of c.members) commOf.set(m, c.id);
	return { byId, adj, deg, communities, commOf, byDeg };
}

// ---------------------------------------------------------------- search
const loc = (n) => `${n.file}:${n.line}`;
function makeSearch(g, A) {
	const stop = new Set(['the', 'a', 'an', 'of', 'in', 'for', 'to', 'and', 'is', 'what', 'where']);
	return (q) => {
		const terms = (Array.isArray(q) ? q.join(' ') : q).toLowerCase().split(/[^a-z0-9§.#:_-]+/).map((t) => t.replace(/^[.:-]+|[.:-]+$/g, '')).filter((t) => t && !stop.has(t));
		const res = [];
		const subTerms = terms.flatMap((t) => (/[-_]/.test(t) ? [t, ...t.split(/[-_]/).filter(Boolean)] : [t]));
		const uniq = [...new Set(subTerms)];
		for (const n of g.nodes) {
			const label = n.label.toLowerCase(), id = n.id.toLowerCase(), text = (n.text || '').toLowerCase() + ' ' + (n.choice || '').toLowerCase();
			let score = 0, hit = 0;
			for (const t of uniq) {
				const stem = t.length > 3 ? t.replace(/(ing|es|s|ed)$/, '') : t;
				const re = new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:s|es|ed|ing|ions?)?(?![a-z0-9])`, 'i');
				let s = 0;
				if (label === t || id === t) s += 12;
				else if (re.test(label)) s += 6;
				if (re.test(id)) s += 3;
				if (text.length > 1 && re.test(text)) s += 1 + Math.min(3, (text.match(new RegExp(re.source, 'gi')) || []).length / 2);
				if (s) { hit++; score += s; }
			}
			if (hit) res.push({ n, score: score + hit * 4 });
		}
		return res.sort((a, b) => b.score - a.score || A.deg(b.n.id) - A.deg(a.n.id) || cmp(a.n.id, b.n.id)).map((r) => r.n);
	};
}
function resolveNode(g, A, search, q) {
	const raw = q.trim();
	const norm = raw.replace(/^§\s*/, '');
	for (const c of [raw, `S${norm}`, norm.toUpperCase(), `agent:${raw}`, `pkg:${raw}`, `npm:${raw}`, `sl:${raw}`, `token:${raw}`]) if (A.byId.has(c)) return A.byId.get(c);
	const ci = g.nodes.filter((n) => n.id.toLowerCase() === raw.toLowerCase() || n.label.toLowerCase() === raw.toLowerCase());
	if (ci.length) return ci.sort((a, b) => A.deg(b.id) - A.deg(a.id) || cmp(a.id, b.id))[0];
	const files = g.nodes.filter((n) => n.id.toLowerCase().includes(raw.toLowerCase()) && !n.id.includes('#'));
	if (files.length === 1) return files[0];
	return search(raw)[0] || null;
}

// ---------------------------------------------------------------- report
const CURATED = ['draft', 'prerequisites', 'redirect', 'trailing slash', 'slug', 'glossary', 'dataset', 'citation', 'consent', 'analytics', 'lighthouse', 'motion',
	'gsap', 'scroll', 'print', 'theme', 'dark', 'logo', 'favicon', 'i18n', 'vietnamese', 'validation', 'schema', 'lesson metadata', 'exercise', 'solution', 'colab', 'sheets', 'term',
	'katex', 'math', 'mdx', 'auto-import', 'deploy', 'quality gates', 'cspell', 'markdownlint', 'migration', 'license', 'changelog', 'zenodo', 'reduced motion',
	'nav', 'hero', 'marquee', 'tokens', 'font', 'agents', 'build plan', 'out of scope', 'career', 'story', 'stage', 'reference', 'lesson header', 'footer', 'nvmrc'];
const QUESTIONS = [
	['What happens to draft lessons, and which rules touch them?', 'query draft'],
	['What depends on the content validation loader?', 'explain src/lib/content-validation.ts'],
	['How does the draft-lesson decision connect to build validation?', 'path D18 content-validation'],
	['Which Starlight components do we override, and where?', 'query override'],
	['What does the homepage motion decision allow, and what implements it?', 'explain D22'],
	['Which SPEC sections are CONTRACTS?', 'query contract'],
	['Where are the lesson schema and its SPEC section?', 'query lesson schema'],
	['Who uses the Term authoring component?', 'explain src/components/content/Term.astro'],
	['What does the spec-reviewer agent read and check?', 'explain agent:spec-reviewer'],
	['Which files hold UI strings and translations?', 'query i18n'],
];
function buildReport(g, A, search) {
	const L = [];
	const typeCount = {}, edgeCount = {};
	for (const n of g.nodes) typeCount[n.type] = (typeCount[n.type] || 0) + 1;
	for (const e of g.edges) edgeCount[e.r] = (edgeCount[e.r] || 0) + 1;
	const sn = (id) => { const n = A.byId.get(id); return `${id}${n.label !== id && !id.includes('/') ? ` ${clip(n.label, 34)}` : ''}`; };
	L.push('# Knowledge graph report', '');
	L.push('Generated by `node scripts/kb.mjs build` (deterministic; do not edit). The graph is an INDEX: open the cited file:line before relying on details.');
	L.push('Lookup: `node scripts/kb.mjs query <terms>` | `path <a> <b>` | `explain <id>`. Ids: `S5.1` = SPEC section, `D18` = decision, `R3` rule, `M5` milestone, `DG3` design section, path = file, `path#Name` = symbol.', '');
	L.push('## Summary', '');
	L.push(`- ${g.nodes.length} nodes, ${g.edges.length} edges, ${A.communities.filter((c) => c.members.length > 1).length} communities (${A.communities.filter((c) => c.members.length === 1).length} isolated nodes).`);
	L.push(`- Nodes: ${Object.keys(typeCount).sort().map((k) => `${k} ${typeCount[k]}`).join(', ')}.`);
	L.push(`- Edges: ${Object.keys(edgeCount).sort().map((k) => `${k} ${edgeCount[k]}`).join(', ')}.`, '');

	L.push('## God nodes (highest degree)', '', '| # | Node | Type | Degree | Location |', '|---|---|---|---|---|');
	[...g.nodes].sort((a, b) => A.deg(b.id) - A.deg(a.id) || cmp(a.id, b.id)).slice(0, 15).forEach((n, i) => L.push(`| ${i + 1} | \`${n.id}\`${n.id.includes('/') || n.id.includes(':') || n.id === n.label ? '' : ' ' + clip(n.label, 30)} | ${n.type} | ${A.deg(n.id)} | ${loc(n)} |`));
	L.push('');

	L.push('## Communities', '', 'Label propagation; each community is named by its top-degree node.', '');
	A.communities.filter((c) => c.members.length > 1).slice(0, 12).forEach((c) => {
		L.push(`- **C${c.id} ${clip(c.name, 30)}** (${c.members.length}): ${c.members.slice(0, 6).map(sn).join('; ')}`);
	});
	L.push('');

	L.push('## Surprising connections', '', 'Edges that cross communities, lowest combined degree first (peripheral nodes bridging topics).', '');
	const cross = g.edges.filter((e) => A.commOf.get(e.s) !== A.commOf.get(e.t) && A.byId.get(e.s).type !== 'dependency' && A.byId.get(e.t).type !== 'dependency')
		.sort((a, b) => A.deg(a.s) + A.deg(a.t) - (A.deg(b.s) + A.deg(b.t)) || cmp(a.s, b.s) || cmp(a.t, b.t));
	cross.slice(0, 12).forEach((e) => L.push(`- \`${e.s}\` -${e.r}-> \`${e.t}\` (C${A.commOf.get(e.s)} to C${A.commOf.get(e.t)}, ${A.byId.get(e.s).file}:${e.l})`));
	if (!cross.length) L.push('- none');
	L.push('');

	L.push('## Decisions (SPEC §1)', '', '| Id | Decision | Choice | Where |', '|---|---|---|---|');
	for (const d of g.nodes.filter((n) => n.type === 'decision').sort((a, b) => a.line - b.line)) {
		const refs = g.edges.filter((e) => e.s === d.id && A.byId.get(e.t).type === 'spec-section').map((e) => e.t.replace('S', '§'));
		L.push(`| ${d.id} | ${clip(d.label, 34)} | ${clip(d.choice.replace(/\|/g, '/'), 70)} | ${loc(d)}${refs.length ? ' ' + refs.join(' ') : ''} |`);
	}
	L.push('');

	L.push('## CONTRACT sections', '');
	for (const s of g.nodes.filter((n) => n.contract).sort((a, b) => a.line - b.line)) {
		const subs = g.nodes.filter((n) => n.type === 'spec-section' && n.id.startsWith(s.id + '.')).map((n) => n.id.replace('S', '§'));
		const last = Math.max(s.end, ...g.nodes.filter((n) => n.type === 'spec-section' && n.id.startsWith(s.id + '.')).map((n) => n.end));
		L.push(`- §${s.id.slice(1)} ${s.label} — ${loc(s)}-${last}${subs.length ? ` (includes ${subs.join(', ')})` : ''}`);
	}
	L.push('');

	L.push('## Where is…', '', 'term: id — file:line', '');
	const used = new Set(), where = [];
	for (const t of CURATED) {
		const n = search(t).find((x) => !used.has(x.id) && x.type !== 'decision' && !x.id.startsWith('src/content/docs/'));
		if (n) { used.add(n.id); where.push(`${t}: \`${n.id}\` — ${loc(n)}`); }
	}
	const fill = g.nodes.filter((n) => ['symbol', 'component', 'starlight-component', 'spec-section', 'npm-script', 'agent', 'config'].includes(n.type) && !used.has(n.id))
		.sort((a, b) => A.deg(b.id) - A.deg(a.id) || cmp(a.id, b.id));
	for (const n of fill) { if (where.length >= 60) break; used.add(n.id); where.push(`${clip(n.label, 30)}: \`${n.id}\` — ${loc(n)}`); }
	for (const w of where.slice(0, 60)) L.push(`- ${w}`);
	L.push('');

	L.push('## Suggested questions', '');
	QUESTIONS.forEach(([q, c], i) => L.push(`${i + 1}. ${q} \`node scripts/kb.mjs ${c}\``));
	L.push('');
	return L.join('\n');
}

// ---------------------------------------------------------------- serialization
function serialize(g) {
	const rows = (a) => a.map((x) => JSON.stringify(x)).join(',\n');
	return `{"version":1,\n"nodes":[\n${rows(g.nodes)}\n],\n"edges":[\n${rows(g.edges)}\n]}\n`;
}
function produce() {
	const g = buildGraph();
	const json = serialize(g);
	const gg = JSON.parse(json);
	const A = analyze(gg);
	const report = buildReport(gg, A, makeSearch(gg, A));
	return { json, report, g: gg, A };
}
function load() {
	if (!existsSync(GRAPH_FILE)) { console.error('No graph yet. Run: npm run kb'); process.exit(2); }
	const g = JSON.parse(readFileSync(GRAPH_FILE, 'utf8'));
	const A = analyze(g);
	return { g, A, search: makeSearch(g, A) };
}

// ---------------------------------------------------------------- commands
const showLabel = (n) => (n.id === n.label || n.id.endsWith('/' + n.label) ? '' : ' ' + clip(n.label, 60));
const nodeLine = (n) => `${n.id} [${n.type}]${showLabel(n)} @${loc(n)}${n.contract ? ' CONTRACT' : ''}`;
function edgesOf(g, id) {
	return g.edges.filter((e) => e.s === id || e.t === id).map((e) => (e.s === id ? { dir: '->', other: e.t, e } : { dir: '<-', other: e.s, e }));
}
function cmdQuery(terms) {
	const { g, A, search } = load();
	const hits = search(terms);
	const out = [`query "${terms.join(' ')}": ${hits.length} match${hits.length === 1 ? '' : 'es'}`];
	if (!hits.length) { console.log(out[0] + '. Try other terms or `explain <id>`.'); return; }
	const seeds = hits.slice(0, 4);
	const seedSet = new Set(seeds.map((s) => s.id));
	for (const s of seeds) {
		out.push(`* ${nodeLine(s)}`);
		const e1 = edgesOf(g, s.id).filter((x) => !seedSet.has(x.other)).sort((a, b) => A.deg(b.other) - A.deg(a.other) || cmp(a.other, b.other));
		for (const x of e1.slice(0, 3)) out.push(`  ${x.dir}${x.e.r} ${nodeLine(A.byId.get(x.other))}`);
		const d1 = new Set(e1.map((x) => x.other));
		const d2 = new Set();
		for (const x of e1.slice(0, 12)) for (const y of edgesOf(g, x.other)) if (y.other !== s.id && !d1.has(y.other) && !seedSet.has(y.other)) d2.add(y.other);
		if (d2.size) out.push(`  ~2: ${[...d2].sort((a, b) => A.deg(b) - A.deg(a) || cmp(a, b)).slice(0, 5).map((i) => `${i}@${loc(A.byId.get(i))}`).join(', ')}`);
		if (e1.length > 3) out.push(`  (+${e1.length - 3} more neighbors; explain ${s.id})`);
	}
	if (hits.length > seeds.length) out.push(`other matches: ${hits.slice(4, 9).map((n) => n.id).join(', ')}${hits.length > 9 ? ', …' : ''}`);
	console.log(out.slice(0, 40).join('\n') + (out.length > 40 ? '\n…' : ''));
}
function cmdPath(a, b) {
	const { g, A, search } = load();
	const na = resolveNode(g, A, search, a), nb = resolveNode(g, A, search, b);
	if (!na || !nb) { console.error(`Cannot resolve ${!na ? a : b}`); process.exit(1); }
	const prev = new Map([[na.id, null]]);
	let frontier = [na.id];
	while (frontier.length && !prev.has(nb.id)) {
		const next = [];
		for (const id of frontier) for (const o of [...A.adj.get(id).keys()].sort(cmp)) if (!prev.has(o)) { prev.set(o, id); next.push(o); }
		frontier = next;
	}
	if (!prev.has(nb.id)) { console.log(`No path between ${na.id} and ${nb.id}.`); return; }
	const chain = [];
	for (let c = nb.id; c; c = prev.get(c)) chain.unshift(c);
	console.log(`path ${na.id} -> ${nb.id} (${chain.length - 1} hops)`);
	chain.forEach((id, i) => {
		const n = A.byId.get(id);
		let rel = '';
		if (i) {
			const e = g.edges.find((x) => (x.s === chain[i - 1] && x.t === id) || (x.t === chain[i - 1] && x.s === id));
			rel = ` via ${e.s === id ? '<-' : '->'}${e.r}@${A.byId.get(e.s).file}:${e.l}`;
		}
		console.log(`${i ? '  ' : ''}${nodeLine(n)}${rel}`);
	});
}
function cmdExplain(q) {
	const { g, A, search } = load();
	const n = resolveNode(g, A, search, q);
	if (!n) { console.error(`No node matches ${q}`); process.exit(1); }
	const out = [nodeLine(n)];
	for (const k of ['choice', 'consequence', 'value', 'version', 'model', 'effort', 'keys', 'kind']) if (n[k] !== undefined && n[k] !== '') out.push(`${k}: ${clip(String(n[k]), 200)}`);
	if (n.end) out.push(`lines: ${n.line}-${n.end}`);
	if (n.text && !['spec-section', 'design-section'].includes(n.type)) out.push(`text: ${clip(n.text, 240)}`);
	out.push(`degree ${A.deg(n.id)}, community C${A.commOf.get(n.id)} ${A.communities[A.commOf.get(n.id) - 1].name}`);
	const es = edgesOf(g, n.id).sort((a, b) => cmp(a.e.r, b.e.r) || cmp(a.dir, b.dir) || cmp(a.other, b.other));
	for (const x of es.slice(0, 60)) out.push(`  ${x.dir}${x.e.r} ${nodeLine(A.byId.get(x.other))} (edge ${A.byId.get(x.e.s).file}:${x.e.l})`);
	if (es.length > 60) out.push(`  … ${es.length - 60} more edges`);
	console.log(out.join('\n'));
}

const [cmd, ...args] = process.argv.slice(2);
const t0 = performance.now();
if (cmd === 'build') {
	const { json, report, g } = produce();
	mkdirSync(OUT_DIR, { recursive: true });
	writeFileSync(GRAPH_FILE, json);
	writeFileSync(REPORT_FILE, report);
	console.log(`kb: ${g.nodes.length} nodes, ${g.edges.length} edges, graph.json ${json.length} B, report ${report.split('\n').length} lines, ${Math.round(performance.now() - t0)} ms`);
} else if (cmd === 'check') {
	const { json, report } = produce();
	const stale = [];
	if (!existsSync(GRAPH_FILE) || readFileSync(GRAPH_FILE, 'utf8') !== json) stale.push('.claude/kb/graph.json');
	if (!existsSync(REPORT_FILE) || readFileSync(REPORT_FILE, 'utf8') !== report) stale.push('.claude/kb/GRAPH_REPORT.md');
	if (stale.length) { console.error(`kb: stale (${stale.join(', ')}). Run \`npm run kb\` and commit the result.`); process.exit(1); }
	console.log('kb: graph is up to date');
} else if (cmd === 'query' && args.length) cmdQuery(args);
else if (cmd === 'path' && args.length === 2) cmdPath(args[0], args[1]);
else if (cmd === 'explain' && args.length) cmdExplain(args.join(' '));
else {
	console.error('usage: node scripts/kb.mjs build | check | query <terms…> | path <a> <b> | explain <id>');
	process.exit(2);
}
