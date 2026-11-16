# Changelog

All notable changes to datafromzero are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the curriculum uses
[Semantic Versioning](https://semver.org/) as described in SPEC.md §9.

## [Unreleased]

### Added
- Site scaffold: Astro + Starlight, English at the root and Vietnamese under `/vi/`, deploy to GitHub Pages.
- Design system: tokens, Geist fonts, dark default with a light option on docs pages, print styles, logo and favicon.
- Content model (SPEC §5): schemas and build-time validation for lessons, reference entries,
  glossary terms, careers and stories; lesson header and footer.
- Authoring components (SPEC §6): `Exercise`, `Solution`, `OpenInColab`, `OpenInSheets` and `Term`,
  with build errors on misuse; math via `remark-math` and `rehype-katex` (MathML output, no client JavaScript).
- Quality gates (SPEC §12): prerequisite graph check (`scripts/check-graph.ts`, cycles and `order`),
  `starlight-links-validator`, cspell, markdownlint, Lighthouse CI, fixture tests, `npm run check`;
  workflows `ci.yml`, `link-check.yml` and `review-reminder.yml`; Dependabot (monthly, grouped).
- Lesson footer: **Unlocks next** lists the lessons that require this one (SPEC §5.1).
- Navigation (SPEC D26, D27): cross-document View Transitions (CSS root fade, off for reduced motion)
  and Speculation Rules prefetch (same-origin, moderate, no prerender) replacing Astro's prefetch script.

- Project pages (SPEC §3.1): `/start/` with the roadmap map (static SVG laid out by the prerequisite layers, plus a text list),
  `/cite/` (APA and BibTeX generated from the new `CITATION.cff`), `/changelog/`, `/license/`, `/privacy/` and `/about/`
  (facts only; the owner can extend it); footer links on docs pages and the homepage.
- Analytics (SPEC §11): `GA_ID` in `src/site.ts`, empty for now. When set: consent banner, Consent Mode v2 defaults denied,
  GA4 loaded only after Accept, "Cookie settings" footer control. Empty: no banner and no added JavaScript.

### Changed
- SPEC §1, §2, §10, §12: decision D28 (supersedes D22); any GSAP plugin, each effect loaded on demand, on the
  homepage, stories and project pages; budget measured as JavaScript before first paint. Build plan item 9 is now
  "Motion & speed" (the DFS story was dropped).
- The author of record is the organization "datafromzero" (citations, copyright, footer); no personal name
  appears on the site or in the repository documents.
- SPEC §3.1, §9, §11: wording for the roadmap map, generated citation, single-source changelog and license pages, and `GA_ID`.
- SPEC §5.1: `order` within a stage must follow the prerequisites; the footer shows "Unlocks next".
- SPEC §1: decisions D17 (strict content validation), D18 (draft lessons are never deployed),
  D19 (dataset page frontmatter deferred) and D20 (readers add the citation access date).
- SPEC §5: ids are kebab-case and unique across all types; types follow folders; id references
  must exist; `sources[].url` and `sheet` must be http(s); `see_also` and `aliases` required
  (empty list allowed); `term` is the glossary page title.
- SPEC §5.1: draft lessons are built only in local dev; published lessons may not depend on drafts.
- SPEC §5.4: dataset pages are rejected until their frontmatter is defined.
- SPEC §8: `translated_from_version` required on every typed Vietnamese page.
- SPEC §9: "Cite this lesson" takes its year from `reviewed`; no generated access date.
- SPEC §1, §6: decision D21; components are auto-imported in `.mdx`, and the build rejects imports,
  other components, `<script>`, event handlers, `set:html`, `javascript:` URLs and math in headings; `Term` uses a native popover (hint on hover/focus where supported, a tap/click "?" button otherwise, both dismissed with Esc, no JS); literal
  dollar signs are written `\$`.
- SPEC §13: repository layout updated for `src/lib/`, `src/site.ts` and the component folders.
- SPEC §1, §2: decision D22; homepage and story motion may use GSAP `SplitText` and `DrawSVG` besides
  `ScrollTrigger`, with a homepage JavaScript budget of about 90 KB gzipped.
- SPEC §1: decision D23; pure scroll-linked effects use CSS scroll-driven animations, with GSAP as fallback.
- SPEC §1, §14: decision D24; content is written from scratch (outline first, English first) instead of
  migrated from `data-odyssey`; §14 now describes content production.
- SPEC §1, §5.1, §12: decision D25; `order` must follow prerequisites within a stage, and lessons show
  "Unlocks next".
- Homepage motion performance pass for 120 Hz displays (SPEC §12, "Motion performance budget"); the design and
  choreography are unchanged:
  - The hero pointer glow is a small window onto a copy of the dot grid that moves by `transform` only; the
    full-size mask is no longer repainted on every pointer move.
  - The marquee runs from one ticker callback with smoothed scroll velocity (no tween created per scroll event)
    and is promoted to its own layer only while it is on screen.
  - Section timelines are built in separate tasks right after a presented frame: nearby sections first, the rest
    after the intro while the reader is not scrolling, so scrolling no longer pays for setup. Reads are batched
    before writes.
  - Headings revert their SplitText wrappers once the reveal has played; `will-change` is set only while a
    scrubbed animation is active.
- `npm run perf` (dev only, not part of `npm run check` or CI): measures frame times, long animation frames,
  style, layout and paint cost on the built site with a 4× CPU throttle at 390 and 1280 px.
