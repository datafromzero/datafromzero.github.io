// One deferred module for every section timeline (a single request). motion.ts builds each section in
// its own task: near the screen first, the rest once the intro is over and the reader is not scrolling.
import { init as headings } from './headings';
import { init as rules } from './rules';
import { init as core } from './core';
import { init as branches, load as loadBranches } from './branches';
import { init as tools, load as loadTools } from './tools';
import { init as history, load as loadHistory } from './history';
import { init as hero, load as loadHero } from './hero';

/** A later piece of a section's setup, run in a frame slot of its own (keeps every task short). */
export type Step = () => void;
/** Builds a section. A heavy one may return the rest of its work as steps instead of doing it all at once. */
export type SectionInit = (el: HTMLElement, onCleanup: (fn: () => void) => void) => void | Step[];

/**
 * Fetches the effect chunks a section uses on top of its base timeline (one dynamic import per plugin
 * group). motion.ts starts it when the section is near the screen and waits for it before building, so
 * the section is built once, with the effects in hand; a failed fetch skips only those effects.
 */
export type Loader = () => Promise<unknown>;

export const sections: Record<string, SectionInit> = { hero, headings, rules, core, branches, tools, history };
export const loaders: Record<string, Loader> = {
	hero: loadHero,
	branches: loadBranches,
	tools: loadTools,
	history: loadHistory,
};

