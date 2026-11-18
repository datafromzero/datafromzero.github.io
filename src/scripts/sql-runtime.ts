// SPEC D42: the DuckDB-Wasm engine behind <RunSQL>. This chunk is imported on the first click of a Run button, never
// before. Everything is self-hosted (the files in dist/_astro): no CDN, no request to a third party, no storage.
// One database per page; every block shares it, so a table or view made in one block is seen by the next.
import * as duckdb from '@duckdb/duckdb-wasm';
import wasmUrl from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import workerUrl from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import customersUrl from '../../datasets/cafe-sales/v1/customers.csv?url';
import orderItemsUrl from '../../datasets/cafe-sales/v1/order_items.csv?url';
import ordersUrl from '../../datasets/cafe-sales/v1/orders.csv?url';
import productsUrl from '../../datasets/cafe-sales/v1/products.csv?url';
import storesUrl from '../../datasets/cafe-sales/v1/stores.csv?url';

// The same five tables, columns and types as datasets/cafe-sales/v1/cafe-sales.sql (no keys or constraints there).
// `types` is positional, so the header row still names the columns.
const TABLES: [name: string, url: string, types: string][] = [
	['stores', storesUrl, "'INTEGER','VARCHAR','VARCHAR','DATE'"],
	['customers', customersUrl, "'INTEGER','DATE','VARCHAR','VARCHAR','INTEGER'"],
	['products', productsUrl, "'INTEGER','VARCHAR','VARCHAR','DECIMAL(6,2)'"],
	['orders', ordersUrl, "'INTEGER','INTEGER','INTEGER','TIMESTAMP','VARCHAR','VARCHAR'"],
	['order_items', orderItemsUrl, "'INTEGER','INTEGER','INTEGER','INTEGER','DECIMAL(6,2)'"],
];

export interface Result {
	/** Column names; empty for a statement that returns nothing (CREATE, DROP, SET...). */
	columns: string[];
	/** Display text per cell, first `shown` rows only; `null` is SQL NULL. */
	rows: (string | null)[][];
	/** Right-aligned columns (numbers). */
	numeric: boolean[];
	total: number;
	ms: number;
}

let csv: Promise<string[]> | undefined;
let engine: Promise<{ db: duckdb.AsyncDuckDB; conn: duckdb.AsyncDuckDBConnection }> | undefined;

async function boot() {
	const worker = new Worker(workerUrl);
	const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
	await db.instantiate(wasmUrl);
	const text = await (csv ??= Promise.all(TABLES.map(([, url]) => fetch(url).then((r) => r.text()))));
	const conn = await db.connect();
	for (const [i, [name, , types]] of TABLES.entries()) {
		await db.registerFileText(`${name}.csv`, text[i]);
		await conn.query(`CREATE TABLE ${name} AS FROM read_csv('${name}.csv', types=[${types}])`);
		await db.dropFile(`${name}.csv`);
	}
	return { db, conn };
}

/** Starts the engine (once) and loads the data. */
export const start = () => (engine ??= boot());

/** Reset data: drops everything the learner made and loads the five tables again. */
export async function resetData() {
	const old = engine;
	engine = undefined;
	if (old) {
		const { db, conn } = await old;
		await conn.close();
		await db.terminate();
	}
	await start();
}

/** Splits a script into statements at semicolons outside quotes and comments. */
export function splitSql(sql: string): string[] {
	const out: string[] = [];
	let cur = '';
	for (let i = 0; i < sql.length; i++) {
		const c = sql[i];
		const two = sql.slice(i, i + 2);
		if (c === "'" || c === '"') {
			const end = sql.indexOf(c, i + 1);
			// '' inside a string is an escaped quote: the next scan finds the second one and carries on.
			const stop = end < 0 ? sql.length : end + 1;
			cur += sql.slice(i, stop);
			i = stop - 1;
		} else if (two === '--') {
			const end = sql.indexOf('\n', i);
			const stop = end < 0 ? sql.length : end;
			cur += sql.slice(i, stop);
			i = stop - 1;
		} else if (two === '/*') {
			const end = sql.indexOf('*/', i + 2);
			const stop = end < 0 ? sql.length : end + 2;
			cur += sql.slice(i, stop);
			i = stop - 1;
		} else if (c === ';') {
			out.push(cur);
			cur = '';
		} else cur += c;
	}
	out.push(cur);
	// A piece with only comments and spaces is not a statement.
	return out.filter((s) => s.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim());
}

// Arrow type ids (apache-arrow `Type`): the engine hands back Arrow tables.
const T = { Int: 2, Float: 3, Utf8: 5, Bool: 6, Decimal: 7, Date: 8, Time: 9, Timestamp: 10, Interval: 11, List: 12, Struct: 13 };

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

function clock(micros: bigint | number) {
	let us = BigInt(micros);
	const h = us / 3600000000n;
	us -= h * 3600000000n;
	const m = us / 60000000n;
	us -= m * 60000000n;
	const s = us / 1000000n;
	us -= s * 1000000n;
	return `${pad(Number(h))}:${pad(Number(m))}:${pad(Number(s))}${us ? `.${String(us).padStart(6, '0').replace(/0+$/, '')}` : ''}`;
}

/** Text of one value, written the way DuckDB prints it in Python and its own shell. */
function show(v: unknown, type: any, nested = false): string | null {
	if (v === null || v === undefined) return nested ? 'NULL' : null;
	switch (type.typeId) {
		case T.Float: {
			const n = v as number;
			if (Number.isNaN(n)) return 'nan';
			if (!Number.isFinite(n)) return n < 0 ? '-inf' : 'inf';
			return Number.isInteger(n) && Math.abs(n) < 1e15 ? n.toFixed(1) : String(n);
		}
		case T.Decimal: {
			const raw = String(v);
			const neg = raw.startsWith('-');
			const digits = (neg ? raw.slice(1) : raw).padStart(type.scale + 1, '0');
			const cut = digits.length - type.scale;
			return (neg ? '-' : '') + (type.scale ? `${digits.slice(0, cut)}.${digits.slice(cut)}` : digits);
		}
		case T.Date:
			return new Date(v as number).toISOString().slice(0, 10);
		case T.Timestamp: {
			const d = new Date(v as number);
			const ms = d.getUTCMilliseconds();
			return d.toISOString().slice(0, 19).replace('T', ' ') + (ms ? `.${pad(ms, 3).replace(/0+$/, '')}` : '');
		}
		case T.Time:
			return clock(v as bigint);
		case T.Interval: {
			const [months, days, lo, hi] = v as Int32Array;
			const nanos = (BigInt(hi) << 32n) | BigInt(lo >>> 0);
			const parts: string[] = [];
			const years = Math.trunc(months / 12);
			const mon = months % 12;
			if (years) parts.push(`${years} year${Math.abs(years) === 1 ? '' : 's'}`);
			if (mon) parts.push(`${mon} month${Math.abs(mon) === 1 ? '' : 's'}`);
			if (days) parts.push(`${days} day${Math.abs(days) === 1 ? '' : 's'}`);
			if (nanos) parts.push(clock(nanos / 1000n));
			return parts.join(' ') || '00:00:00';
		}
		case T.List: {
			const child = type.children[0].type;
			return `[${[...(v as Iterable<unknown>)].map((x) => show(x, child, true)).join(', ')}]`;
		}
		case T.Struct: {
			const row = v as Record<string, unknown>;
			return `{${type.children.map((f: any) => `'${f.name}': ${show(row[f.name], f.type, true)}`).join(', ')}}`;
		}
		case T.Utf8:
			return nested ? `'${String(v).replaceAll("'", "''")}'` : String(v);
		default:
			return String(v);
	}
}

const isNumber = (type: any) => type.typeId === T.Int || type.typeId === T.Float || type.typeId === T.Decimal;

/** Runs a script (one or more statements); the result of the last one is returned. */
export async function run(sql: string, limit: number): Promise<Result> {
	const { conn } = await start();
	const t0 = performance.now();
	let table: Awaited<ReturnType<typeof conn.query>> | undefined;
	for (const stmt of splitSql(sql)) table = await conn.query(stmt);
	if (!table) throw new Error('Type a query first.');
	const fields = table.schema.fields;
	// A statement that returns nothing (CREATE, DROP, SET) comes back as a lone Count column with no rows.
	const silent = table.numRows === 0 && fields.length === 1 && fields[0].name === 'Count';
	const rows: (string | null)[][] = [];
	if (!silent) {
		for (let r = 0; r < Math.min(table.numRows, limit); r++) {
			rows.push(fields.map((f, c) => show(table!.getChildAt(c)!.get(r), f.type)));
		}
	}
	return {
		columns: silent ? [] : fields.map((f) => f.name),
		rows,
		numeric: fields.map((f) => isNumber(f.type)),
		total: table.numRows,
		ms: performance.now() - t0,
	};
}
