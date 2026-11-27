// SPEC D42: plain-words errors for the SQL runner. The first line of the engine's message, without its jargon label,
// plus a short tip when it is one of the common beginner mistakes. Every rule below was run against DuckDB-Wasm 1.32.0
// (the message text is quoted in tests/sql-errors.test.ts); a message that matches no rule gets no tip, never a guess.

export interface Explained {
	/** First line of the engine message ("Parser Error:" and the like removed). */
	head: string;
	tip?: string;
}

/** Edit distance, to tell a typo ("store_nme") from a different word ("Oakland"). */
function distance(a: string, b: string): number {
	const row = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		let prev = row[0];
		row[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const keep = row[j];
			row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1));
			prev = keep;
		}
	}
	return row[b.length];
}
const close = (a: string, b: string) => distance(a, b) <= Math.max(2, Math.floor(b.length / 3));

const CURLY = /[‘’“”]/;
// Words that start a clause: after a stray ";" they begin a new statement, which the engine cannot parse.
const CLAUSE = /^(WHERE|FROM|GROUP|ORDER|LIMIT|HAVING|JOIN|INNER|LEFT|RIGHT|FULL|CROSS|ON|UNION|OFFSET)$/i;

/** `query` is what the learner ran, when known: a few mistakes are visible in it and not in the engine's message. */
export function explain(message: string, query = ''): Explained {
	const lines = message.split('\n');
	const head = lines[0].replace(/^[A-Za-z ]+ Error: /, '').trim();
	const tip = (t?: string): Explained => ({ head, tip: t });
	let m: RegExpMatchArray | null;

	// Curly quotes (a phone keyboard's smart punctuation, or text pasted from notes) are not quotes to SQL, whatever the message says.
	if (CURLY.test(query) || CURLY.test(message)) {
		return tip("The query has curly quotes (‘ ’ “ ”). SQL needs straight ones: text goes between plain single quotes, like 'tea'. Retype the quotes with the ' key.");
	}
	// "SELECT * FROM t; WHERE x = 1": the ";" ended the query, so WHERE has nothing to belong to.
	if ((m = lines[0].match(/^Parser Error: syntax error at or near "(\w+)"/)) && CLAUSE.test(m[1]) && new RegExp(`;\\s*${m[1]}\\b`, 'i').test(query)) {
		return tip(`A semicolon ends the query, so ${m[1]} starts a new one by itself. Remove the ; before ${m[1]} and keep one ; only at the very end.`);
	}

	// Binder Error: Referenced column "x" not found in FROM clause! / Candidate bindings: "a", "b"
	if ((m = lines[0].match(/Referenced column "(.+)" not found/))) {
		const guess = message.match(/Candidate bindings: "([^"]+)"/)?.[1];
		if (guess && close(m[1], guess)) return tip(`Did you mean "${guess}"? The columns of each table are listed under Tables.`);
		return tip(`Check the spelling against Tables. If ${m[1]} is meant as text, put it in single quotes: '${m[1]}' (double quotes are for column names).`);
	}
	// Catalog Error: Table with name x does not exist! / Did you mean "stores"?
	if ((m = lines[0].match(/^Catalog Error: (Table|Scalar Function|Aggregate Function|Table Function) with name (\S+) does not exist/))) {
		const guess = lines.find((l) => l.startsWith('Did you mean'))?.match(/"([^"]+)"/)?.[1];
		const what = m[1] === 'Table' ? 'table' : 'function';
		if (guess && close(m[2], guess)) return tip(`Did you mean "${guess}"? ${what === 'table' ? 'The five tables are listed under Tables.' : 'Check the spelling of the function name.'}`);
		return tip(what === 'table' ? 'Check the table name against Tables, or run the statement that creates it first.' : 'Check the spelling of the function name.');
	}
	// Binder Error: column "city" must appear in the GROUP BY clause or must be part of an aggregate function.
	if ((m = lines[0].match(/column "?(\w+)"? must appear in the GROUP BY/))) {
		return tip(`Add ${m[1]} to GROUP BY, or wrap it in an aggregate such as COUNT, SUM or MAX.`);
	}
	// Binder Error: Ambiguous reference to column name "store_id" (use: "s.store_id" or "o.store_id")
	if ((m = lines[0].match(/Ambiguous reference to column name "(\w+)" \(use: "([^"]+)"/))) {
		return tip(`More than one table has a column named ${m[1]}. Put the table or its alias in front of it, such as ${m[2]}.`);
	}
	if (/WHERE clause cannot contain aggregates/.test(lines[0])) {
		return tip('WHERE filters rows before they are counted. To filter on COUNT, SUM or AVG, use HAVING after GROUP BY.');
	}
	// Binder Error: No function matches the given name and argument types 'sum(VARCHAR)'.
	if ((m = lines[0].match(/No function matches the given name and argument types '(\w+)\((.*)\)'/))) {
		return tip(`${m[1]} cannot work on ${m[2]} values. Check the column's type under Tables; SUM and AVG need a number column.`);
	}
	// Conversion Error: Could not convert string 'abc' to INT32
	if ((m = lines[0].match(/Could not convert string '(.*)' to (INT|DOUBLE|DECIMAL|FLOAT|BIGINT|UBIGINT|HUGEINT)/))) {
		return tip(`The column holds numbers, but '${m[1]}' is text. Write numbers without quotes.`);
	}
	if (/unterminated quoted string/.test(lines[0])) {
		return tip("A quote is never closed. Text goes between single quotes on both sides, like 'Oakland'.");
	}
	if (/^Parser Error: syntax error at end of input/.test(lines[0])) {
		return tip('The query stops too early. Finish the last clause (a condition after WHERE, a table after FROM) and close every parenthesis and quote.');
	}
	if ((m = lines[0].match(/^Parser Error: syntax error at or near "(.*)"/))) {
		return tip(`Look just before ${m[1]}: a comma, a closing parenthesis, or a keyword such as FROM or WHERE may be missing or misspelled.`);
	}
	return tip();
}

/** A text comparison in a one-table query that returned no rows: the column, the table and the text, or `null` when it is not that simple. */
export function textLookup(sql: string): { col: string; table: string; text: string } | null {
	const q = sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, ' ');
	if (q.split(';').filter((x) => x.trim()).length !== 1) return null;
	if ((q.match(/\b(from|join)\b/gi) ?? []).length !== 1) return null;
	const table = q.match(/\bfrom\s+([a-z_]\w*)\b/i)?.[1];
	const m = q.match(/\b([a-z_]\w*)\s*=\s*'([^']*[A-Za-z][^']*)'/i);
	return table && m ? { col: m[1], table, text: m[2] } : null;
}

/**
 * The query that checks a `textLookup` result: how many rows hold exactly that text (when some do, the empty result has
 * another cause and no tip is given), and a stored value that differs from it only by capitals.
 */
export const caseQuery = ({ col, table, text }: { col: string; table: string; text: string }) =>
	`SELECT (SELECT count(*) FROM ${table} WHERE ${col} = '${text}'), (SELECT min(${col}) FROM ${table} WHERE lower(${col}) = lower('${text}') AND ${col} <> '${text}')`;

/** The tip for a result with no rows when the query compares text; `found` is the stored value that differs only by capitals. */
export function emptyTip(text: string, found?: string): string {
	return found
		? `No rows. Text must match exactly, including capitals: did you mean '${found}'?`
		: `No rows. Text must match exactly, including capitals and spaces: check how '${text}' is spelled in the table.`;
}
