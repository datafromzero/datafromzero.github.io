/**
 * Redirects for renamed URLs (SPEC §3.3). Published URLs are never removed:
 * when a rename is unavoidable, add `'/old/path/': '/new/path/'` here,
 * keep the lesson `id` unchanged and note the rename in CHANGELOG.md.
 */
import { VI_ENABLED } from './site.ts';

/**
 * SPEC D30: Vietnamese is paused. Every /vi/ page that was published (the build of 2026-11 had exactly
 * these: the homepage and the project pages, shown in English as Starlight fallbacks) points at its
 * English twin. Remove these when /vi/ is built again.
 */
const viPaused: Record<string, string> = VI_ENABLED
	? {}
	: Object.fromEntries(['', 'start/', 'about/', 'cite/', 'changelog/', 'license/', 'privacy/'].map((p) => [`/vi/${p}`, `/${p}`]));

export const redirects: Record<string, string> = { ...viPaused };
