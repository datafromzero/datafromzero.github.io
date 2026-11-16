import type { HomeStrings } from './types';
import { en } from './en';

/** English only for now (SPEC D30). Vietnamese copy returns as vi.ts (see git history) when §8 is reactivated. */
export type HomeLang = 'en';
export type { HomeStrings };

const copy: Record<HomeLang, HomeStrings> = { en };

export function homeStrings(lang: HomeLang): HomeStrings {
	return copy[lang];
}

/** Root-relative path for an internal page in the homepage's language (English: unchanged). */
export function homeHref(_lang: HomeLang, path: string): string {
	return path;
}
