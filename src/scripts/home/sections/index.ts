// One deferred module for every section timeline (a single request). motion.ts builds each section in
// its own task: near the screen first, the rest once the intro is over and the reader is not scrolling.
import { init as headings } from './headings';
import { init as rules } from './rules';
import { init as core } from './core';
import { init as branches } from './branches';
import { init as modes } from './modes';
import { init as marquee } from './marquee';
import { init as begin } from './begin';

/** A later piece of a section's setup, run in a frame slot of its own (keeps every task short). */
export type Step = () => void;
/** Builds a section. A heavy one may return the rest of its work as steps instead of doing it all at once. */
export type SectionInit = (el: HTMLElement, onCleanup: (fn: () => void) => void) => void | Step[];

export const sections: Record<string, SectionInit> = { headings, rules, core, branches, modes, marquee, begin };
