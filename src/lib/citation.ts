/**
 * Citation for the whole work (SPEC §9), generated from CITATION.cff so the file is the single source.
 * Pure functions plus one reader; the version always comes from package.json and must match the file.
 */
import { parse } from 'yaml';
import { CURRICULUM_VERSION, FIRST_YEAR } from '../site.ts';
import { readRepoFile } from './repo-files.ts';

interface Cff {
	title: string;
	authors: { name: string }[];
	version: string;
	'date-released'?: string | Date;
	doi?: string;
	license: string;
	'repository-code': string;
	url: string;
}

export interface Citation {
	apa: string;
	bibtex: string;
	version: string;
	year: number;
	doi: string | null;
	url: string;
	repository: string;
	license: string;
}

const REQUIRED = ['title', 'authors', 'version', 'license', 'repository-code', 'url'] as const;

export function buildCitation(cff: Cff, packageVersion: string): Citation {
	for (const k of REQUIRED) if (!cff[k]) throw new Error(`CITATION.cff: missing "${k}"`);
	if (String(cff.version) !== packageVersion)
		throw new Error(`CITATION.cff: version ${cff.version} does not match package.json version ${packageVersion}`);
	const a = cff.authors[0];
	const released = cff['date-released'] ? new Date(cff['date-released']) : null;
	const year = released ? released.getUTCFullYear() : FIRST_YEAR;
	const doi = cff.doi ? String(cff.doi) : null;
	const link = doi ? `https://doi.org/${doi}` : cff.url;
	// The author is an organization (CFF `name`), cited as a group author in APA.
	const author = a.name;
	if (!author) throw new Error('CITATION.cff: authors[0].name is required');
	const apa = `${author}. (${year}). ${cff.title} (Version ${cff.version}) [Educational website]. ${link}`;
	const bibtex = [
		'@misc{datafromzero,',
		`  author = {{${author}}},`,
		`  title = {${cff.title}},`,
		`  year = {${year}},`,
		`  version = {${cff.version}},`,
		`  url = {${cff.url}},`,
		...(doi ? [`  doi = {${doi}},`] : []),
		`  note = {Licensed ${cff.license}}`,
		'}',
	].join('\n');
	return { apa, bibtex, version: cff.version, year, doi, url: cff.url, repository: cff['repository-code'], license: cff.license };
}

export function loadCitation(): Citation {
	return buildCitation(parse(readRepoFile('CITATION.cff')) as Cff, CURRICULUM_VERSION);
}
