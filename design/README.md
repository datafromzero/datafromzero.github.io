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

### Light theme (every page, the homepage included)

Dark is the default; light is the reader's explicit choice, made with the switch in the bottom taskbar (§5a)
and shared by the homepage and the docs (Starlight's `data-theme` and `localStorage` key `starlight-theme`,
SPEC D9). It is the black-on-white inverse of the dark palette. Site tokens (`src/styles/tokens.css`):

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#000000` | `#ffffff` |
| `--fg` | `#f4f4f4` | `#0a0a0a` |
| `--mute` | `#777777` | `#666666` (darker than the inverse, to keep 4.5:1 on white) |
| `--line` | `#1c1c1c` | `#e6e6e6` |
| `--dim` | `#3a3a3a` | `#c4c4c4` |

Homepage grays (`src/styles/home.css`); every homepage color is a token, so the CSS entrance and the GSAP
effects follow the theme without literals:

| Token | Dark | Light | Use |
|---|---|---|---|
| `--dot` | `#2c2c2c` | `#d3d3d3` | Hero dot grid |
| `--soft` | `#a8a8a8` | `#575757` | Hero sub copy, result cells |
| `--body` | `#9a9a9a` | `#656565` | Step text in 01 |
| `--ghost-line` / `--ghost-fg` | `#333333` / `#cccccc` | `#cccccc` / `#333333` | Ghost button |
| `--panel` | `#050505` | `#fafafa` | Section 03 panels |
| `--code` | `#dcdcdc` | `#232323` | Code in 03 |
| `--figure` | = `--fg` | = `--fg` | The career figures in 05 (canvas strokes and fills, read by script once per theme) |
| `--card-edge` | `#2c2c2c` | `#dcdcdc` | History card border (section 04) |

The nav keeps `mix-blend-mode: difference` in the dark theme only; in the light theme it is plain `--fg` on the
white page (links `#333333`), which looks the same and lets contrast checkers measure it. The logo void is always
`--logo-bg` = the surface behind it.

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

- Plays once on homepage load, as CSS keyframes (first paint never waits for GSAP). **Tap/click the logo to replay:**
  the replay re-runs the whole hero lockup (logo and wordmark, §5) and the selection box with it.
- On the homepage the logo is part of the lockup with the wordmark "From A1 to AI." (§5); the wordmark's own motion
  follows the logo: words rise from 0.9 s, the selection box lands on "A1" at 1.5 s, and the reel rolls 1 → I from
  2.2 s for 1.1 s (`power3.inOut`). The intro ends at about 3.3 s.
- `prefers-reduced-motion: reduce` → no animation, logo shown static.
- Nav logo: static, never animated.

---

## 5. Homepage (see `homepage-prototype/index.html`)

Content is English only for now (SPEC D30; Vietnamese under `/vi/` is paused) — keep all copy in i18n strings
(`src/i18n/home/en.ts`).
The hero and section 03 differ from `homepage-prototype/index.html`, and section 04 is new, by owner decision (2026-11):
this table is authoritative where they disagree.

| Section | Layout | Motion (GSAP) |
|---|---|---|
| **Nav** (fixed) | Logo + `datafromzero` wordmark left; Roadmap · Example (→ section 03) · GitHub right (only GitHub on mobile). `mix-blend-mode: difference` | Thin 1 px scroll-progress bar at very top (CSS scroll-driven, SPEC D23; ScrollTrigger scrub fallback) |
| **Hero** (100svh) | Faint dot grid background; centred **lockup**: the logo and the wordmark "From A1 to AI." side by side (stacked up to 640 px wide). The wordmark is the page's only `<h1>` (accessible name "From A1 to AI."). The last word is "A" plus a one-line reel that rests on "I". No caption, no separate headline, no sub-copy or buttons: the bottom taskbar carries "Start here →" | CSS first: dot grid staggers in from centre → logo animation (§4) → the wordmark's words rise from a mask → the reel rolls 1 → λ → Σ → 3 → 2 → I and the "." slides with it (transforms only; the reel's width is the I's, so CLS stays 0). Without JS or before GSAP, the CSS alone plays this and ends on "From A1 to AI.". GSAP (deferred chunk) adds an Excel-style selection box (2 px border, square fill handle) that lands on "A1" and slides to "AI" in sync with the roll; a chunk that arrives after the roll only fades the box in on "AI". Reduced motion: final state, no box. On scroll: grid parallax, hero content drifts up and fades. Desktop only: grid follows the mouse slightly |
| **01 — The core** | "Four steps. No skipped rungs." + vertical track: Excel/Sheets, SQL, Python, Advanced core | A white rail fills top→bottom with scroll (scrub); each step's node lights up and its text goes from 25% → 100% opacity as it is reached |
| **02 — Then branch** | "One trunk. Four careers." + SVG tree: trunk splits into 4 branches → DA, DE, DS, ML (Data Analyst, Data Engineer, Data Scientist, ML/AI Engineer; SPEC D32), leaves evenly spaced over four label columns | Trunk then branches draw with scroll (scrub), leaf dots pop, labels fade up; once drawn, small lights travel down the branches (MotionPath, paused off screen) |
| **03 — One idea, three tools** (`#tools`) | "Same question. Three tools." (2nd part muted). The question "Which store sold the most in March?", then the Excel (`SUMIFS`), SQL and Python solutions beside one result table (Riverside $1,284.50 · Old Quarter $1,102.75 · Harbor $968.20, "Example numbers."). Code in Geist Mono, wrapping (no horizontal scroll); one column on phones. Without JS: the three solutions stacked, each under its tool name | A script (no GSAP, also with reduced motion) turns the solutions into a real ARIA tab list (roving tabindex, ←/→/Home/End); panels share one cell, so switching never moves the page. GSAP (deferred): the underline slides (Flip, transforms only), the code fades up, the result rows pulse. The tabs cycle every 3.6 s while the section is on screen, stop for good on any interaction (click, key, focus, hover), and have a Pause / Play button (WCAG 2.2.2). Reduced motion: no cycle, no animation |
| **04 — A short history of data** (`#history`) | "From punch cards to AI." (2nd part muted). An `<ol>` of 12 sourced milestone cards (year, title, one line; GitHub issue #29): 1804 Jacquard loom, 1890 Hollerith, 1970 Codd, 1974 SEQUEL, 1979 VisiCalc, 1985 Excel, 1991 Python, 2006 Hadoop, 2008 pandas, 2012 HBR, 2017 Transformer, 2022 ChatGPT, then a closing card "Now — Your turn" (inverted colors, "Start here →" to `/start/`). Cards 240px wide on phones, up to 280px. Below: a `<details>` "Sources for these dates" with each card's primary and second source (accessed November 16, 2026). Without JS or with reduced motion: a horizontal scroll-snap list running to the screen edges, nothing hidden | Seamless-loop card slider (GSAP demo "Infinite card slider"): the center card is full size, the side cards scale down (power1.in, 80% of a card apart) and fade on their own curve: opacity 0.9 at ±1 (so their text keeps 4.5:1 in both themes), then 0.4, 0.15, 0.04; starts on 1804. Drag (Draggable, its own chunk), Previous / Next milestone buttons (48px) and ←/→ while the slider has focus; it always snaps to a card, and a polite live region names the centered card. While the chunk loads, the list keeps the slider's height; the chunk sets `.is-live`, CSS draws the first frame, then the loop is built on it (CLS 0); transforms and opacity per frame, `z-index` only when two cards swap order; `will-change` only while moving. Without `.is-live` (reduced motion, no script, a failed chunk) it is always the list |
| **05 — Pick a direction** (`#careers`) | Owner-approved mockup (2026-11-17). "Four careers. One start." (2nd part muted). Four cards that share their rows through a CSS subgrid (label, title, description, "See the path"; the titles line up at every width) (01 · Data Analyst, 02 · Data Engineer, 03 · Data Scientist, 04 · ML / AI Engineer: name, one line, "See the path +"; 4 columns, 2 below 900px), then one detail panel: a looping canvas figure on the left (DA bars in a wave, DE source tanks draining through pipes and a transform cube into the warehouse tank, DS two clusters and a plane, ML a network passing signals) with a mono caption, and on the right the career's name, what it does, the path chips (Excel → SQL → Python → Core → career) and the portfolio line, then a button built from the published lessons (SPEC D38): "Go to Data Analyst →" to that career's first lesson once it has one, else "Start at E1 →" to the first lesson. Below: "Not sure which career fits you?", "Answer ten questions about how you like to work. You get a suggested direction and why. Nothing is saved." and "Take the career quiz →" (`/career-quiz/`). Without JS: every career's details listed under the cards (each card links to its details), no figure | A script without GSAP (every reader) turns the card links into buttons (aria-expanded, aria-controls); one panel open at a time, Data Analyst first (CSS draws that state from first paint, so nothing moves); the panel opens and closes with a CSS rows transition. The figure chunk loads when the section nears: canvas 2D with a tiny projection helper on the GSAP ticker, DPR capped at 2, color from `--figure`, paused off screen (IntersectionObserver) and while every card is closed; opening a card fades the figure in (GSAP, from its cached transform, so the click forces no layout) and lifts the panel's lines (CSS keyframes). Reduced motion: one still frame, no GSAP, no transitions |
| **Footer** | Mono: © 2026 datafromzero · Content CC BY 4.0 · Code MIT · version + DOI · Cookie settings · GitHub link | — |

Every section heading uses the same word-by-word mask reveal when it enters the viewport.

### 5a. Bottom taskbar (every page, SPEC D31, D35)

Approved mockup (owner, 2026-11), built as `src/components/taskbar/Taskbar.astro`: a floating, rounded
glass bar (16px radius, blur 16px, max-width 720px, centered on the content column, 16px from the bottom plus
the safe-area inset) on the homepage, project pages, lessons and reference, phone and desktop. Mobile navigation
is one bar (D35): Starlight's header menu button and "On this page" bar are hidden on phones.

- **Left:** the menu button, a menu icon (two bars that cross into ×) and a two-line label: a small mono line (Geist Mono
  500, 11px, muted) and the page title (Geist 500, 15px), both with an ellipsis. On a lesson the small line is `E8 · current
  section` and follows the scroll (the page's h2s); on the homepage it is the section on screen (Home · The core ·
  Careers · Three tools · History · Directions) over the site name; elsewhere it is the current h2 or empty.
- **Right:** a solid primary button: "Next E9 →" on a lesson (next published lesson in the stage, else the next
  stage's first, else "Roadmap" to `/start/`), "Start E1 →" (the first published lesson) on `/start/`, "Start here →" to `/start/` everywhere else.
  Back to top (a chevron, dimmed in the first 200px) shows at every width; the light / dark switch moved into the sheet.
  Liquid glass: `--tb-glass` tint (0.5 dark, 0.55 light), 14px backdrop blur with saturate 1.8, a top-edge sheen
  (`--tb-sheen`), a solid `--bg` fallback without blur support. Motion is CSS only: sheet rows rise in with a stagger
  and a slight spring (`--tb-spring`), buttons scale to 0.96 when pressed; none of it under reduced motion.
- **Sheet:** grows upward from the bar. A segmented control with two tabs, This lesson (This page off lessons: the
  page's h2s, current one marked with a bar on the leading edge) and Course (stages with published lessons as `<details>`
  of `E1 Title` rows, current lesson marked and scrolled into view; stages without lessons as muted "SQL · coming soon"
  lines). Rows are at least 44px. A bottom row holds Home, Career quiz, a flag button (Report a problem, SPEC D37) and the light / dark switch (a
  half-filled circle). The Course pane ends with a bordered row "See the whole roadmap →" to `/start/`. The Report pane (selected
  by the flag, a third hidden radio; no script) is a plain form: kind select, "What happened?" textarea, a solid
  "Continue on GitHub ↗" button and a one-line note; it opens GitHub's issue form in a new tab. Esc, a second tap, a link or an outside click closes it.
- Glass tints: dark `rgba(18,18,18,.84)`, edge `rgba(255,255,255,.09)`, chip `rgba(255,255,255,.07)`; light
  `rgba(250,250,250,.9)`, edge `rgba(0,0,0,.08)`, chip `rgba(0,0,0,.06)`; shadow `0 10px 40px rgba(0,0,0,.18)`
  (the one shadow on the site, from the mockup). Targets 44px.
- Motion: CSS transitions only (the sheet's rows 0fr → 1fr, .55s expo.out); none with reduced motion. No GSAP.
  Without JavaScript the menu is a `<details>` toggle, the tabs are radio inputs switched with `:has()` and the
  theme switch is hidden. Hidden in print.
- Space: a spacer after the footer keeps the last content (footer, pagination) clear of the bar, and the hero's
  bottom padding includes the bar's height, so the hero copy and buttons sit just above it.

### 5b. Search sheet (SPEC D36)

The header search opens Starlight's dialog (`src/components/starlight/Search.astro`), restyled in the taskbar's liquid
glass (`--tb-glass`, `--tb-edge`, `--tb-sheen`, blur 14px; a solid sheet without `backdrop-filter`).

- **Phones (below 50rem):** a full-screen sheet that slides up from the bottom (0.28s, `--tb-ease`; none with reduced
  motion). Top row: a pill field, 48px tall, 17px text, magnifier inside, clear button at the end, focused on open; a
  text "Cancel" on the right (Starlight's own close button). Field and Cancel stay put; only the results scroll.
- **Empty field:** "Where to begin" (Geist Mono 12px label) over three 48px rows: Start here, the first published lesson
  with its mono code, Career quiz. A CSS `:has()` rule hides them as soon as there is a query.
- **Results:** one card per page (16px radius, chip fill, edge border): the page title (16px 600), then its
  sub-results indented under a short vertical rule, each with the heading (14px 500) and the excerpt (14px, muted)
  with the match in a light chip (`mark`). Rows are at least 44px, the whole row is the link, and the focus ring is a
  2px inset outline.
- **Desktop (50rem and up):** the centered dialog (40rem, 22px radius) with the same glass, field and cards.

---

## 6. Build notes for Astro Starlight

**Priorities (in order): stability & speed → mobile-first (most readers are on phones) → nice motion.**

- **Where GSAP is allowed:** the homepage only (SPEC D28). Project pages, stories, lessons, exercises and
  reference pages load no motion script — they stay plain Starlight for speed, plus the taskbar's one small
  script (§5a, SPEC D31: under 1 KB gzipped, CSS transitions only).
- **Homepage:** build it as a custom Astro page (its own layout, not the docs layout), port the prototype
  into components, and load GSAP only there (`<script>` inside the page/component so it is bundled per-page).
- **GSAP:** `npm i gsap` (3.13+; all plugins are free now). Any plugin, each effect loaded on demand (SPEC D28).
  Use `gsap.matchMedia()` for reduced-motion and pointer checks, and kill ScrollTriggers on page leave if
  client-side navigation is enabled.
- **Starlight config:** use `logo/logo-dark-bg.svg` as the site logo (with a light-theme variant
  `logo-light-bg.svg` if light mode is kept) and `logo/favicon.svg` as the favicon. Site name = placeholder.
- **Docs area look:** apply the tokens in §2 (black background, Geist / Geist Mono) through Starlight's
  custom CSS so lessons and reference match the homepage. Two modes:
  - **Study / lessons:** open, quiet, one idea per screen, generous spacing.
  - **Reference:** book-like, indexed, searchable (Starlight's built-in search), compact.
- **Math:** DS / Statistics pages need LaTeX — add `remark-math` + `rehype-katex` (and KaTeX CSS).
- **Fonts:** self-host or use Google Fonts with `display=swap`; preload Geist 400 and, on the homepage, Geist 500 (the hero wordmark).
- **Performance budget:** JS before first paint ≈ 3 KB gzipped, effects loaded on demand (SPEC D28); no images
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
