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

### Changed
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
