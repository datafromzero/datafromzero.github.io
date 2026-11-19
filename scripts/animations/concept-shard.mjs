// Concept animation (SPEC D41, no real data) for sharding. Metaphor: one big table is split into shards by key, so a query for one key
// visits one shard. 8 s loop of 8 phases: 1 one table of five rows with keys A, B, C, A, B; 2 the A rows slide into shard A; 3 the B rows
// into shard B; 4 the C row into shard C; 5 a query for key B appears and its arrow points at shard B; 6 shard B lights up, the other two
// are marked not visited; 7 and 8 hold.
// Facts: a design idea, not a DuckDB feature (DuckDB runs on one machine; sharding spreads a table across machines in other systems):
// the shard is chosen from the key, so a query that names the key can skip the other shards, while a query that does not name it must
// ask every shard.
// Live counters and Key idea (D41): each counter shows the rows or items drawn in the picture at that phase, and appears with it.
import { anim } from '../lib/step-animation.mjs';

const ROWS = [['A', 0], ['B', 0], ['C', 0], ['A', 1], ['B', 1]]; // key, slot in its shard
const BOX = { A: 44, B: 114, C: 184 };
const AT = { A: 2, B: 3, C: 4 };
const Y = (i) => 70 + 30 * i;

export default function make({ id = 'sh' } = {}) {
	const a = anim({
		id,
		h: 256,
		loop: { cycle: 8 },
		title: 'Sharding splits a big table by key, so one key means one shard',
		desc:
			'One table of five rows with keys A, B, C, A and B. The rows slide into three shards by key: the A rows into shard A, the B rows into shard B, the C row into shard C. A query for key B then appears and its arrow points only at shard B, which lights up. Shards A and C are marked not visited.',
		caption: 'Sharding splits a big table into pieces by key, often on different machines. A query that names the key goes to one shard and skips the rest.',
		phases: [
			[1, 'One big table of keyed rows', { role: 'src', key: 'A big table holds many rows, each with a key.', changes: [['+', '5 rows, keys A, B and C']] }],
			[2, 'Rows move to shards by key', { role: 'grp', key: 'Sharding splits the table into pieces by key, so each key lives in exactly one shard.', changes: [['+', '3 shards: A, B, C'], ['~', 'rows moved by key']] }],
			[5, 'A query asks for key B', { role: 'src', key: 'A query that names the key knows which shard to ask.', changes: [['+', 'query: WHERE key = B']] }],
			[6, 'Only shard B is visited', { role: 'out', key: 'Only shard B is visited and the rest are skipped. Without the key, every shard must be asked.', changes: [['−', 'shards A and C skipped'], ['+', '1 of 3 shards read']] }],
		],
		counters: [
			{ label: 'shard A', role: 'grp', values: [[1, 0], [2, 2]] },
			{ label: 'shard B', role: 'grp', values: [[1, 0], [3, 2]] },
			{ label: 'shard C', role: 'grp', values: [[1, 0], [4, 1]] },
			{ label: 'shards used', role: 'out', values: [[5, '0 of 3'], [6, '1 of 3']] },
		],
	});
	a.text(10, 14, 'Split by key, ask one shard', 'f11 b');
	ROWS.forEach((_, i) => a.ghost(10, Y(i), 66, 24, { hide: 5 }));
	Object.entries(BOX).forEach(([k, y]) => {
		a.rect(150, y, 200, 64, 's-grp', undefined, 6);
		a.text(346, y + 17, `shard ${k}`, 'f11 b', undefined, 'e');
	});
	ROWS.forEach(([k, slot], i) => {
		const y = Y(i);
		const ty = BOX[k] + 26;
		a.move({ dx: 150 + 70 * slot, dy: ty - y, at: AT[k] }, () => a.chip(10, y, `Row ${i + 1} · ${k}`, { role: 'grp', level: { A: 2, B: 3, C: 4 }[k], w: 66 }));
	});
	a.chip(10, 152, 'WHERE key = B', { role: 'src', level: 3, w: 100, fx: { in: 5 } });
	a.arrow(112, 164, 148, 164, 's-src', { in: 5, draw: true });
	a.rect(146, 110, 208, 72, 's-out', { in: 6, hide: 7, pulse: true }, 8);
	a.text(160, 174, 'visited', 'f10 b', { in: 6 });
	a.text(160, 104, 'not visited', 'f10 mu', { in: 6 });
	a.text(160, 244, 'not visited', 'f10 mu', { in: 6 });
	return a;
}
