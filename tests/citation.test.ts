import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCitation } from '../src/lib/citation.ts';

const base = {
	title: 'datafromzero: From A1 to AI',
	authors: [{ name: 'datafromzero' }],
	version: '1.0.0',
	'date-released': '2026-11-25',
	license: 'CC-BY-4.0',
	'repository-code': 'https://github.com/datafromzero/datafromzero.github.io',
	url: 'https://datafromzero.github.io/',
};

describe('buildCitation', () => {
	test('without a DOI it links the site and has no doi field', () => {
		const c = buildCitation(base, '1.0.0');
		assert.equal(c.doi, null);
		assert.equal(c.versionDoi, null);
		assert.match(c.apa, /https:\/\/datafromzero\.github\.io\/$/);
		assert.doesNotMatch(c.bibtex, /doi =/);
	});

	test('cites the version DOI when CITATION.cff lists one for this version', () => {
		const c = buildCitation(
			{
				...base,
				doi: '10.5281/zenodo.100',
				identifiers: [
					{ type: 'doi', value: '10.5281/zenodo.100', description: 'Concept DOI (all versions, always the latest)' },
					{ type: 'doi', value: '10.5281/zenodo.99', description: 'Version 0.9.0' },
					{ type: 'doi', value: '10.5281/zenodo.101', description: 'Version 1.0.0' },
				],
			},
			'1.0.0',
		);
		assert.equal(c.doi, '10.5281/zenodo.100');
		assert.equal(c.versionDoi, '10.5281/zenodo.101');
		assert.match(c.apa, /https:\/\/doi\.org\/10\.5281\/zenodo\.101$/);
		assert.match(c.bibtex, /doi = \{10\.5281\/zenodo\.101\}/);
	});

	test('falls back to the concept DOI when this version has none yet', () => {
		const c = buildCitation({ ...base, doi: '10.5281/zenodo.100' }, '1.0.0');
		assert.equal(c.versionDoi, null);
		assert.match(c.bibtex, /doi = \{10\.5281\/zenodo\.100\}/);
	});

	test('a version mismatch with package.json fails the build', () => {
		assert.throws(() => buildCitation(base, '1.0.1'), /does not match/);
	});
});
