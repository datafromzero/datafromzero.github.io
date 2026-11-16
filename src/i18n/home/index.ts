import type { HomeStrings } from './types';
import { en } from './en';
import { vi } from './vi';

export type HomeLang = 'en' | 'vi';
export type { HomeStrings };

const copy: Record<HomeLang, HomeStrings> = { en, vi };

export function homeStrings(lang: HomeLang): HomeStrings {
	return copy[lang];
}

/** Prefix an internal path with the language root: /start/ -> /vi/start/ for Vietnamese. */
export function homeHref(lang: HomeLang, path: string): string {
	return lang === 'vi' ? `/vi${path}` : path;
}
