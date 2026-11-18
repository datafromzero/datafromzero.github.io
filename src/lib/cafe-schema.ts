/**
 * The five cafe-sales tables, read at build time from `datasets/cafe-sales/v1/cafe-sales.sql` (SPEC D42): each table's
 * columns with their types and its row count. The Tables panel of `<RunSQL>` and of the playground renders this, so it
 * shows before the engine loads and can never drift from the dataset. Build-time only: nothing here reaches the browser.
 */
import { readFileSync } from 'node:fs';

export interface CafeTable {
	name: string;
	columns: { name: string; type: string }[];
	rows: number;
}

const FILE = 'datasets/cafe-sales/v1/cafe-sales.sql';

export function parseCafeSchema(sql: string): CafeTable[] {
	const tables: CafeTable[] = [];
	// One chunk per CREATE: its column list, then the INSERT rows that follow it (each row starts a line with "(").
	for (const part of sql.split(/^CREATE OR REPLACE TABLE /m).slice(1)) {
		const name = part.match(/^(\w+)/)![1];
		const body = part.match(/\(\n([\s\S]*?)\n\);/)![1];
		const columns = body.split('\n').map((l) => {
			const [n, ...t] = l.trim().replace(/,$/, '').split(/\s+/);
			return { name: n, type: t.join(' ') };
		});
		const inserts = part.slice(part.indexOf('INSERT INTO'));
		tables.push({ name, columns, rows: (inserts.match(/^ {2}\(/gm) ?? []).length });
	}
	return tables;
}

let cached: CafeTable[] | undefined;
export const cafeSchema = () => (cached ??= parseCafeSchema(readFileSync(FILE, 'utf8')));
