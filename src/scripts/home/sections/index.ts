// One deferred module for every section timeline (a single request). Each section still initializes
// on its own, lazily, when motion.ts sees it within a viewport of the screen.
import { init as headings } from './headings';
import { init as rules } from './rules';
import { init as core } from './core';
import { init as branches } from './branches';
import { init as modes } from './modes';
import { init as marquee } from './marquee';
import { init as begin } from './begin';

export type SectionInit = (el: HTMLElement, onCleanup: (fn: () => void) => void) => void;

export const sections: Record<string, SectionInit> = { headings, rules, core, branches, modes, marquee, begin };
