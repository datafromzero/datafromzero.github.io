// Concept animation (SPEC D41, no real data) for SQL injection and parameters. Metaphor: typed text glued into a query becomes part of the query;
// sent as a parameter it stays a value. 8 s loop of 8 phases: 1 a query with a gap where a value goes; 2 and 3 typed text fills the gap (glued, one
// text); 4 a ring around the whole line: the database reads all of it as SQL; 5 to 8 a second row: the query keeps a placeholder ($1) and the
// typed text travels apart as a value (arrow into the placeholder), and it stays data. No counter strip: the figure shows two lines of text,
// nothing countable changes (D41 allows leaving it out).
// Facts (DuckDB 2.0.0 and 1.4.3, sql/access-and-injection): the glued text `... WHERE store_name = 'x' OR '1'='1'` returns all rows of stores; the
// prepared statement with `$1` and the same typed text returns no rows. OWASP: parameterized queries define the SQL structure separately from the values.
import { anim } from '../lib/step-animation.mjs';

export default function make({ id = 'ij' } = {}) {
	const a = anim({
		id,
		h: 220,
		loop: { cycle: 8 },
		title: 'Typed text glued into a query becomes part of it; a parameter stays a value',
		desc:
			'A query has a gap for a value. Typed text fills the gap, glued into the query text, and the database reads the whole line as SQL, so the typed text can change what the query means. Below, a second query keeps a placeholder, and the typed text travels separately and fills the placeholder as a plain value.',
		caption: 'Glued into the text, typed words become part of the query. Sent as a parameter, the same words stay a value the query only compares with.',
		phases: [
			[1, 'A query with a gap for a value', { role: 'src', key: 'A query has a fixed shape and a gap where a value goes.', changes: [['+', 'query text'], ['+', 'a gap']] }],
			[2, 'Glue: typed text fills the gap', { role: 'flt', key: 'Gluing puts the typed text inside the query text itself.', changes: [['+', 'typed text in the query']] }],
			[4, 'The database reads one text', { role: 'flt', key: 'The database sees a single piece of SQL, so typed words can change its meaning.', changes: [['~', 'all of it is SQL']] }],
			[5, 'A parameter: query and value apart', { role: 'out', key: 'The query keeps a placeholder and the value travels apart, so the value stays data.', changes: [['+', 'value sent apart']] }],
		],
	});
	a.text(10, 14, 'Glue it, or send it apart', 'f11 b');
	a.text(10, 58, 'Glued', 'f10 b');
	a.chip(10, 66, 'SELECT … WHERE name =', { role: 'src', level: 2, w: 176, h: 28 });
	a.ghost(190, 66, 110, 28);
	a.text(190, 112, 'a gap for a value', 'f10', { in: 1, hide: 2 });
	a.chip(190, 66, 'typed text', { role: 'flt', level: 3, w: 110, h: 28, fx: { in: 2 } });
	a.text(190, 112, 'glued into the text', 'f10 b f-flt', { in: 2, hide: 4 });
	a.rect(6, 62, 298, 36, 's-flt', { in: 4, hide: 5, pulse: true }, 10);
	a.text(190, 112, 'one text: all of it is SQL', 'f10 b f-flt', { in: 4, hide: 5 });
	a.text(10, 152, 'Parameter', 'f10 b', { in: 5 });
	a.chip(10, 160, 'SELECT … WHERE name = $1', { role: 'src', level: 2, w: 176, h: 28, fx: { in: 5 } });
	a.chip(210, 160, 'typed text', { role: 'out', level: 3, w: 100, h: 28, fx: { in: 5 } });
	a.arrow(206, 174, 190, 174, 's-out', { in: 6, draw: true });
	a.text(210, 206, 'sent apart: only a value', 'f10 b', { in: 6 });
	return a;
}
