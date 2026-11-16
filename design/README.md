# Design handoff — datafromzero (logo + homepage)

Brief for building **datafromzero** — *From A1 to AI* — a free, open data roadmap
(Excel → SQL → Python → data careers). Org: github.com/datafromzero · Site: https://datafromzero.github.io.
Built with **Astro Starlight**. This package holds the final logo, the logo animation and a working
homepage prototype.

> **Read `../SPEC.md` first** — it is the long-term contract (URLs, content schemas, versioning, CI).
> This README covers the visual design. Where they disagree, `SPEC.md` wins.
>
> Keep the site name in one config value. Wordmark: `datafromzero` (lowercase).

---

## 1. What's in this package

| Path | What it is |
|---|---|
| `logo/logo-dark-bg.svg` | Final logo, white on transparent — **for dark backgrounds** (default) |
| `logo/logo-light-bg.svg` | Final logo, black on transparent — for light backgrounds |
| `logo/favicon.svg` | Favicon (same as dark-bg logo; readable at 16 px) |
| `logo/logo-inline-currentColor.svg` | Inline version: shape uses `currentColor`, void uses `var(--logo-bg, #000)` |
| `logo/logo-animation.js` | Reusable GSAP intro animation (`playLogo(svg)`), no paid plugins |
| `logo/logo-animated.html` | Standalone page showing the animation (open in a browser) |
| `logo/logo-animation.gif` / `.mp4` | Recording of the approved animation — **this is the reference motion** |
| `homepage-prototype/index.html` | Single-file homepage prototype (HTML/CSS/GSAP). Open in a browser to see layout + motion |

The prototype loads GSAP from a CDN for convenience. In production install it from npm (see §6).

---

## 2. Visual direction

Minimal, black and white, in the spirit of the Grok mark: **one idea, reduced to its essence,
drawn indirectly**. Lots of negative space, no gradients, no colour accents, no drop shadows.

### Design tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | Page background |
| `--fg` | `#f4f4f4` | Primary text, logo, solid buttons |
| `--mute` | `#777777` | Secondary text, mono labels, second line of headings |
| `--line` | `#1c1c1c` | Section dividers, hairlines |
| `--dim` | `#3a3a3a` | Inactive nodes / outlines |
| Display + body font | **Geist** (300/400/500/600) — Google Fonts | |
| Label font | **Geist Mono** 400/500, 11 px, uppercase, letter-spacing .12em | Section numbers, captions |
| Headings | weight 400, tight tracking (−0.04 to −0.055em), line-height .9–1 | |
| Easing | `expo.out` for reveals, `expo.inOut` for transforms, `power2` for draws | |
| Radius | buttons fully round (999px); panels 6px | |

---

## 3. The logo

### Concept
The **database (SQL)** is the core every data career passes through (Excel → SQL → Python →
Data Analyst / Data Engineer / Data Scientist). Following Grok's principle — the black hole is never drawn,
only the light around it — the database is **not drawn as a shape; it is the void** at the centre of a
disc of light. The void is the "unknown" that data science and AI explore; the three traced layers make it
read instantly as a database.

### Construction (viewBox `0 0 100 100`)
```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle class="disc" cx="50" cy="50" r="46" fill="#f4f4f4"/>
  <path class="void" d="M29 31C29 17 71 17 71 31V69C71 83 29 83 29 69Z" fill="#000"/>
  <g class="bands" fill="none" stroke="#f4f4f4" stroke-width="4" stroke-linecap="round">
    <path d="M29 31C29 45 71 45 71 31"/>   <!-- top rim -->
    <path d="M29 45C29 59 71 59 71 45"/>   <!-- layer 1 -->
    <path d="M29 59C29 73 71 73 71 59"/>   <!-- layer 2 -->
  </g>
</svg>
```
Keep the class names (`disc`, `void`, `bands`) — the animation depends on them.

### Usage rules
- Default: white logo on black. Use `logo-light-bg.svg` only on light surfaces.
- The void must always be the **background colour** (it is a hole, not a black shape). On a non-black
  background, use the inline version and set `--logo-bg` to that background.
- Minimum size 16 px. Clear space around it = ¼ of its width.
- No outlines, glows, gradients, rotation or added elements (stars, sparkles were tried and removed on purpose).
- Wordmark: **datafromzero**, lowercase, Geist 500, letter-spacing −0.01em, to the right of the mark; tagline *From A1 to AI* in Geist Mono when space allows.

---

## 4. Logo animation (approved — match `logo-animation.mp4`)

Total ≈ 2.9 s. All in `logo/logo-animation.js`.

| # | What happens | Duration / ease |
|---|---|---|
| 1 | A thin 1.2 px ring of light traces the circle, starting at 12 o'clock, clockwise | 1.1 s, `power2.inOut` |
| 2 | The disc scales up from the centre and fills in; the trace fades out | 1.0 s, `expo.out` (overlap −0.15 s) |
| 3 | The void (database) opens from the centre (scaleY 0→1, scaleX .7→1) | 1.0 s, `expo.out` (overlap −0.7 s) |
| 4 | The three layer lines draw left→right, staggered | 0.6 s each, stagger .12, `power2.out` |

- Plays once on homepage load. **Tap/click the logo to replay.**
- `prefers-reduced-motion: reduce` → no animation, logo shown static.
- Nav logo: static, never animated.

---

## 5. Homepage (see `homepage-prototype/index.html`)

Content is English at the root; Vietnamese lives under `/vi/` (see SPEC §8) — keep all copy in i18n strings.

| Section | Layout | Motion (GSAP) |
|---|---|---|
| **Nav** (fixed) | Logo + `datafromzero` wordmark left; Roadmap · Reference · GitHub right (only GitHub on mobile). `mix-blend-mode: difference` | Thin 1 px scroll-progress bar at very top (ScrollTrigger scrub) |
| **Hero** (100svh) | Faint dot grid background; logo centred with caption `EXCEL → SQL → PYTHON → DA · DE · DS`; headline bottom-left "From spreadsheet / to data career." (2nd line muted); sub-copy + 2 buttons | Dot grid staggers in from centre → logo animation (§4) → headline words rise in from a mask → copy & buttons fade up. On scroll: grid parallax, hero content drifts up and fades. Desktop only: grid follows the mouse slightly |
| **01 — The core** | "Four steps. No skipped rungs." + vertical track: Excel/Sheets, SQL, Python, Advanced core | A white rail fills top→bottom with scroll (scrub); each step's node lights up and its text goes from 25% → 100% opacity as it is reached |
| **02 — Then branch** | "One trunk. Five careers." + SVG tree: trunk splits into 5 branches → DA, DE, DS, AE, ML (Data Analyst, Data Engineer, Data Scientist, Analytics Engineer, ML/AI Engineer) | Trunk then branches draw with scroll (scrub), leaf dots pop, labels fade up |
| **03 — Two ways in** | "Learn in order. Look it up later." Two panels: **Study** (white panel, lesson mock, progress pips) and **Reference** (dark, book-index mock with a formula) | Panels reveal with a bottom-up clip-path wipe; content rises; progress pips grow |
| **Marquee** | Large alternating solid/outlined words: Free · Open source · CC BY 4.0 · Mobile-first · Zero to job-ready | Infinite horizontal loop; speeds up with scroll velocity, eases back |
| **04 — Begin** | Small logo, "Start / at zero.", one big button | Logo assembles with scroll (disc → void → layers). Button is magnetic on desktop (pointer: fine only) |
| **Footer** | Mono: © 2026 Nguyen "John" Ha · Content CC BY 4.0 · Code MIT · version + DOI · Cookie settings · GitHub link | — |

Every section heading uses the same word-by-word mask reveal when it enters the viewport.

---

## 6. Build notes for Astro Starlight

**Priorities (in order): stability & speed → mobile-first (most readers are on phones) → nice motion.**

- **Where GSAP is allowed:** homepage and story / history / visualization pages only.
  **Not** on lessons, exercises or reference pages — those stay plain Starlight for speed.
- **Homepage:** build it as a custom Astro page (its own layout, not the docs layout), port the prototype
  into components, and load GSAP only there (`<script>` inside the page/component so it is bundled per-page).
- **GSAP:** `npm i gsap` (3.13+; all plugins are free now). Allowed: `ScrollTrigger`, `SplitText`, `DrawSVG` (SPEC D22).
  Use `gsap.matchMedia()` for reduced-motion and pointer checks, and kill ScrollTriggers on page leave if
  client-side navigation is enabled.
- **Starlight config:** use `logo/logo-dark-bg.svg` as the site logo (with a light-theme variant
  `logo-light-bg.svg` if light mode is kept) and `logo/favicon.svg` as the favicon. Site name = placeholder.
- **Docs area look:** apply the tokens in §2 (black background, Geist / Geist Mono) through Starlight's
  custom CSS so lessons and reference match the homepage. Two modes:
  - **Study / lessons:** open, quiet, one idea per screen, generous spacing.
  - **Reference:** book-like, indexed, searchable (Starlight's built-in search), compact.
- **Math:** DS / Statistics pages need LaTeX — add `remark-math` + `rehype-katex` (and KaTeX CSS).
- **Fonts:** self-host or use Google Fonts with `display=swap`; preload Geist 400.
- **Performance budget:** homepage JS (GSAP + plugins + page code) ≈ 90 KB gzipped max (SPEC D22); no images
  required — everything is SVG/CSS. Content must be fully readable with JS disabled
  (GSAP sets hidden states, CSS never hides content by default — the prototype already works this way).

---

## 7. Acceptance checklist

- [ ] Logo matches `logo/*.svg` exactly; void is always the background colour
- [ ] Logo animation matches `logo-animation.mp4` (order, timing, easing); tap replays it
- [ ] Reduced motion: no animation anywhere, all content visible
- [ ] JS disabled: all text, buttons and the logo visible
- [ ] Looks right at 390 px (iPhone) and 1440 px; no horizontal scroll on mobile
- [ ] GSAP is not loaded on lesson / exercise / reference pages
- [ ] Site name `datafromzero` comes from a single config value
- [ ] Everything in SPEC.md §12 passes in CI
- [ ] Lighthouse mobile performance ≥ 90 on the homepage
