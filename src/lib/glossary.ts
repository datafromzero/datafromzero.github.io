/**
 * Glossary helper (SPEC §3.1, D68): the A to Z grouping of /reference/glossary/. A pure function, so
 * tests/glossary.test.ts can run it without a build.
 */

/** The sort key of a term: lowercase, with the punctuation and spaces dropped, so "p-value" sorts among the P terms. */
export function sortKey(term: string): string {
	return term.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** Terms grouped by the first letter of their sort key (A to Z), each group in alphabetical order. */
export function glossaryGroups<T extends { term: string }>(terms: T[]): { letter: string; terms: T[] }[] {
	const sorted = [...terms].sort((a, b) => sortKey(a.term).localeCompare(sortKey(b.term), 'en'));
	const groups: { letter: string; terms: T[] }[] = [];
	for (const t of sorted) {
		const letter = (sortKey(t.term)[0] ?? '#').toUpperCase();
		const last = groups[groups.length - 1];
		if (last && last.letter === letter) last.terms.push(t);
		else groups.push({ letter, terms: [t] });
	}
	return groups;
}
