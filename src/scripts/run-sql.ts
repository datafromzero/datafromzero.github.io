// SPEC D42: wires the Run buttons of <RunSQL>. Small and deferred; the engine (DuckDB-Wasm, about 8 MB) is imported
// on the first Run click only, so nothing heavy loads before then. No storage, no network except our own files.
import type { Result } from './sql-runtime';

const LIMIT = 50;
let engine: Promise<typeof import('./sql-runtime')> | undefined;
let queue: Promise<unknown> = Promise.resolve();
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
	const e = document.createElement(tag);
	if (text !== undefined) e.textContent = text;
	if (cls) e.className = cls;
	return e;
};
const plural = (n: number, w: string) => `${n.toLocaleString('en-US')} ${w}${n === 1 ? '' : 's'}`;

function draw(out: HTMLElement, r: Result) {
	out.replaceChildren();
	if (!r.columns.length) {
		out.append(el('p', 'Done. The statement ran and returned no rows.', 'dfz-sql-sum'));
		return;
	}
	const more = r.total - r.rows.length;
	out.append(
		el(
			'p',
			`${plural(r.total, 'row')} × ${plural(r.columns.length, 'column')}${more > 0 ? `, first ${r.rows.length} shown` : ''} (${Math.max(1, Math.round(r.ms))} ms)`,
			'dfz-sql-sum',
		),
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

function wire(box: HTMLElement) {
	const area = box.querySelector<HTMLTextAreaElement>('textarea')!;
	const out = box.querySelector<HTMLElement>('.dfz-sql-out')!;
	const [runBtn, resetBtn, dataBtn] = [...box.querySelectorAll<HTMLButtonElement>('.dfz-sql-bar button')];
	const original = area.value;
	const fit = () => (area.rows = Math.max(2, area.value.split('\n').length));
	const busy = (on: boolean) => {
		for (const b of [runBtn, resetBtn, dataBtn]) b.disabled = on;
		out.setAttribute('aria-busy', String(on));
	};
	const say = (text: string, cls = 'dfz-sql-sum', role?: string) => {
		const p = el('p', text, cls);
		if (role) p.setAttribute('role', role);
		out.replaceChildren(p);
	};
	// One database, one connection: runs from every block wait their turn.
	const go = (job: () => Promise<void>) => {
		busy(true);
		queue = queue.then(job).catch(() => {}).finally(() => busy(false));
	};

	box.classList.add('on');
	fit();
	area.addEventListener('input', fit);
	area.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			if (!runBtn.disabled) runBtn.click();
		}
	});
	runBtn.addEventListener('click', () =>
		go(async () => {
			try {
				if (!engine) say('Loading DuckDB, about 8 MB, once for this page. The first result takes a few seconds.');
				const rt = await (engine ??= import('./sql-runtime'));
				// start() boots the engine and loads the five tables on the first call.
				await rt.start();
				draw(out, await rt.run(area.value, LIMIT));
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				const pre = el('pre', msg, 'dfz-sql-err');
				pre.setAttribute('role', 'alert');
				out.replaceChildren(pre);
			}
		}),
	);
	resetBtn.addEventListener('click', () => {
		area.value = original;
		fit();
		out.replaceChildren();
		area.focus();
	});
	dataBtn.addEventListener('click', () =>
		go(async () => {
			if (!engine) return say('The tables are loaded fresh on your first Run, so there is nothing to reset yet.');
			say('Reloading the cafe-sales tables...');
			try {
				await (await engine).resetData();
				say('Data reset: the five cafe-sales tables are back, and tables or views you made are gone.');
			} catch (e) {
				say(e instanceof Error ? e.message : String(e), 'dfz-sql-err', 'alert');
			}
		}),
	);
}

document.querySelectorAll<HTMLElement>('.dfz-sql').forEach(wire);
