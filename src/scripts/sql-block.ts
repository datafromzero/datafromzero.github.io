// SPEC D42: the controller of one SQL block (a <RunSQL> in a lesson, or the playground). Loaded by run-sql.ts when the
// block nears the viewport or is first used. It mounts the editor, draws results and errors, and calls the engine
// (sql-runtime.ts) which it imports lazily. Nothing is stored and nothing is sent anywhere.
import type { Result } from './sql-runtime';
import type { Editor } from './sql-editor';
import { explain } from './sql-errors';

export interface Block {
	act(name: string, from: HTMLElement): void;
	/** Starts the background load of the editor's engine and the data, once for the page. Quiet: no message. */
	warm(): void;
}

const LIMIT = 50;
const AUTO_DELAY = 800;
// Auto-run repeats a query on every pause, so it only does so for statements that read and never change anything.
const READ_ONLY = /^(select|with|values|from|describe|show|summarize|explain|table)\b/i;
let runtime: Promise<typeof import('./sql-runtime')> | undefined;
let queue: Promise<unknown> = Promise.resolve();
// Set after the first successful run on this page: the "first run is slower" note is shown once, never stored.
let firstDone = false;
const loadRuntime = () => (runtime ??= import('./sql-runtime'));

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
	const e = document.createElement(tag);
	if (text !== undefined) e.textContent = text;
	if (cls) e.className = cls;
	// The result box is translate="no"; our own sentences in it (summary, tip, notes) can be translated.
	if (cls && /dfz-sql-(sum|more|err-tip)/.test(cls)) e.translate = true;
	return e;
};
const plural = (n: number, w: string) => `${n.toLocaleString('en-US')} ${w}${n === 1 ? '' : 's'}`;

function drawResult(out: HTMLElement, r: Result, title?: string) {
	out.replaceChildren();
	if (!r.columns.length) {
		out.append(el('p', 'Done. The statement ran and returned no rows.', 'dfz-sql-sum'));
		return;
	}
	const more = r.total - r.rows.length;
	const ms = `${Math.max(1, Math.round(r.ms))} ms`;
	out.append(
		el('p', `${title ? `${title} · ` : ''}${plural(r.total, 'row')} × ${plural(r.columns.length, 'column')}${more > 0 ? `, first ${r.rows.length} shown` : ''} · ${ms}`, 'dfz-sql-sum'),
	);
	const table = el('table');
	const head = table.createTHead().insertRow();
	r.columns.forEach((c, i) => {
		const th = el('th', c);
		th.scope = 'col';
		if (r.numeric[i]) th.className = 'n';
		head.append(th);
	});
	const body = table.createTBody();
	for (const row of r.rows) {
		const tr = body.insertRow();
		row.forEach((v, i) => {
			const td = el('td', v ?? 'NULL');
			if (v === null) td.className = 'null';
			else if (r.numeric[i]) td.className = 'n';
			else if (v.includes('\n')) td.className = 'ml'; // a text plan (EXPLAIN): keep its line breaks
			tr.append(td);
		});
	}
	const wrap = el('div', undefined, 'dfz-sql-scroll');
	wrap.tabIndex = 0;
	wrap.setAttribute('role', 'region');
	wrap.setAttribute('aria-label', 'Query result, scrolls');
	wrap.append(table);
	out.append(wrap);
	if (more > 0) out.append(el('p', `${plural(more, 'more row')} not shown.`, 'dfz-sql-more'));
}

function drawError(out: HTMLElement, message: string, quiet: boolean) {
	const { head, tip } = explain(message);
	const box = el('div', undefined, 'dfz-sql-err');
	// A manual run announces its error; an auto-run (quiet) one does not interrupt the learner.
	if (!quiet) box.setAttribute('role', 'alert');
	box.append(el('p', head, 'dfz-sql-err-head'));
	if (tip) {
		const p = el('p', undefined, 'dfz-sql-err-tip');
		p.append(el('strong', 'Tip: '), tip);
		box.append(p);
	}
	out.replaceChildren(box);
}

export function wire(box: HTMLElement): Block {
	const $ = <T extends HTMLElement>(sel: string) => box.querySelector<T>(sel)!;
	const area = $<HTMLTextAreaElement>('textarea');
	const mount = $('.dfz-sql-cm');
	const out = $('.dfz-sql-out');
	const status = $('.dfz-sql-status');
	const bar = status.querySelector('progress')!;
	const note = status.querySelector<HTMLElement>('.dfz-sql-first')!;
	const panel = box.querySelector<HTMLElement>('.dfz-sql-tables');
	const auto = box.querySelector<HTMLInputElement>('input[data-act="auto"]');
	const runBtn = $<HTMLButtonElement>('[data-act="run"]');
	const original = area.value;
	const empty = out.innerHTML;
	const schema: Record<string, string[]> = {};
	box.querySelectorAll<HTMLElement>('[data-t]').forEach((li) => (schema[li.dataset.t!] = (li.dataset.cols ?? '').split(',')));

	// The editor is the textarea until the CodeMirror chunk has loaded, then it is that.
	let ed: Editor = {
		get: () => area.value,
		set: (t) => (area.value = t),
		add(t) {
			const blank = !area.value.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim();
			area.value = blank ? t : `${area.value.replace(/\s+$/, '')}\n\n${t}`;
		},
		focus: () => area.focus(),
		end: () => area.setSelectionRange(area.value.length, area.value.length),
	};
	let timer: ReturnType<typeof setTimeout> | undefined;
	let waiting = false;

	const showStatus = (p: { phase: string; fraction: number }) => {
		const on = waiting && (p.phase === 'engine' || p.phase === 'data');
		status.hidden = !on;
		// The note sits in a polite live region, so setting its text is what announces it.
		note.textContent = on && !firstDone ? 'The first run takes a few seconds to get ready. After that, every run is instant.' : '';
		if (!on) return;
		if (p.phase === 'engine') bar.value = Math.round(p.fraction * 100);
		else bar.removeAttribute('value'); // indeterminate while the tables fill
	};
	let unwatch: (() => void) | undefined;
	const warm = () => {
		loadRuntime().then((rt) => {
			unwatch ??= rt.watch(showStatus);
			rt.start().catch(() => {}); // a failure is shown when the learner presses Run, never before
		});
	};

	const busy = (on: boolean) => {
		runBtn.disabled = on;
		out.setAttribute('aria-busy', String(on));
	};
	const say = (text: string, cls = 'dfz-sql-sum') => out.replaceChildren(Object.assign(el('p', text, cls), { translate: true }));
	// One database, one connection: runs from every block wait their turn.
	const go = (job: () => Promise<void>) => {
		busy(true);
		queue = queue.then(job).catch(() => {}).finally(() => busy(false));
	};

	const execute = async (sql: string, opts: { quiet?: boolean; title?: string } = {}) => {
		const rt = await loadRuntime();
		try {
			waiting = !rt.ready();
			showStatus({ phase: waiting ? 'engine' : 'ready', fraction: 0 });
			unwatch ??= rt.watch(showStatus);
			await rt.start(); // returns at once when the data is already loaded; otherwise the learner sees "Getting ready…"
		} catch {
			waiting = false;
			status.hidden = true;
			say("Couldn't start. Check your connection and press Run again.", 'dfz-sql-err dfz-sql-err-head');
			return;
		}
		waiting = false;
		firstDone = true;
		status.hidden = true;
		note.textContent = '';
		try {
			drawResult(out, await rt.run(sql, LIMIT), opts.title);
		} catch (e) {
			drawError(out, e instanceof Error ? e.message : String(e), !!opts.quiet);
		}
	};

	const run = () => {
		clearTimeout(timer);
		const sql = ed.get();
		if (!sql.trim()) return say('Type a query first.');
		go(() => execute(sql));
	};

	const autoRun = async () => {
		const rt = await loadRuntime();
		const sql = ed.get();
		if (!auto?.checked || !rt.ready()) return; // auto-run never starts the download
		if (!sql.trim()) {
			out.innerHTML = empty;
			return;
		}
		const writes = rt.splitSql(sql).some((s) => !READ_ONLY.test(s.replace(/^(\s|--[^\n]*\n|\/\*[\s\S]*?\*\/)+/, '')));
		if (writes) return say('Auto-run only runs queries that read data. Press Run for this one.', 'dfz-sql-sum');
		queue = queue.then(() => execute(sql, { quiet: true })).catch(() => {});
	};
	const changed = () => {
		clearTimeout(timer);
		if (auto?.checked) timer = setTimeout(autoRun, AUTO_DELAY);
	};
	area.addEventListener('input', changed);

	// Swap the textarea for the editor (a separate chunk), keeping the text and the caret.
	import('./sql-editor').then((m) => {
		const hadFocus = document.activeElement === area;
		ed = m.mountEditor(mount, {
			doc: area.value,
			caret: area.selectionStart,
			schema,
			label: 'SQL query, editable. Ctrl+Enter or Cmd+Enter runs it. Press Escape, then Tab, to leave the editor.',
			onRun: run,
			onChange: changed,
		});
		box.classList.add('cm');
		if (hadFocus) ed.focus();
	});

	const actions: Record<string, (from: HTMLElement) => void> = {
		run,
		resetq() {
			clearTimeout(timer);
			ed.set(original);
			out.innerHTML = empty;
			ed.focus();
		},
		resetd() {
			go(async () => {
				const rt = await loadRuntime();
				if (!rt.ready()) return say('Nothing to reset yet: the tables are fresh until you run a query.');
				say('Resetting the tables…');
				try {
					await rt.resetData();
					say('Data reset: the five tables are back, and tables or views you made are gone.');
				} catch {
					say("Couldn't reset. Press Reset data again.", 'dfz-sql-err dfz-sql-err-head');
				}
			});
		},
		tables(from) {
			if (!panel) return;
			const open = panel.hidden;
			panel.hidden = !open;
			box.classList.toggle('tables-open', open);
			box.querySelectorAll('[data-act="tables"][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
			if (!open) box.querySelector<HTMLElement>('.dfz-sql-tables-btn')?.focus();
			else if (from.classList.contains('dfz-sql-tables-btn')) panel.querySelector<HTMLElement>('button')?.focus();
		},
		table(from) {
			ed.add(`SELECT * FROM ${from.dataset.t} LIMIT 10;`);
			ed.focus();
		},
		preview(from) {
			go(() => execute(`SELECT * FROM ${from.dataset.t} LIMIT 5`, { title: `${from.dataset.t}, first 5 rows` }));
		},
		example(from) {
			ed.set(from.dataset.sql ?? '');
			ed.focus();
		},
		auto() {
			if (auto?.checked) {
				warm();
				changed();
			} else clearTimeout(timer);
		},
	};
	panel?.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !panel.hidden) actions.tables(runBtn);
	});

	return { act: (name, from) => actions[name]?.(from), warm };
}
