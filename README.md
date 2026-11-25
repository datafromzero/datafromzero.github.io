# datafromzero

**From A1 to AI.** A free, open roadmap for learning data from zero:
Excel / Google Sheets → SQL → Python → advanced core → four data careers
(Data Analyst, Data Engineer, Data Scientist, ML/AI Engineer).

**Website:** https://datafromzero.github.io. Start at the [roadmap](https://datafromzero.github.io/start/).

## Status

Version **1.0.0** was released on 2026-11-25. All four core stages are complete in this release, and three of the career
tracks are published. Cite it with the DOI [10.5281/zenodo.24523880](https://doi.org/10.5281/zenodo.24523880), which
always points to the latest version. The [cite page](https://datafromzero.github.io/cite/) has APA and BibTeX for each
version.

| Stage | Lessons published |
|---|---|
| Excel and Google Sheets | 22 |
| SQL | 39 |
| Python | 28 |
| Advanced core | 44 |
| Data Analyst | 18 |
| Data Engineer | 20, plus an 11-lesson optional deep dive |
| Data Scientist | 16 |
| ML/AI Engineer | 10 of 24, in progress |

The [What's new](https://datafromzero.github.io/changelog/) page lists recent changes. The full history is in
[`CHANGELOG.md`](CHANGELOG.md).

## Found a mistake?

Use the **Report a problem** button at the bottom of any page, or the form at the end of a lesson. You do not need an
account.

## What is in this repository

| Path | What it is |
|---|---|
| `src/content/docs/` | The lessons, one Markdown or MDX file each |
| `datasets/` | The open practice datasets (such as `cafe-sales` and `app-events`) and their generators |
| `notebooks/`, `sheets/` | Colab notebooks and practice workbooks for the lessons |
| `starters/` | Starter repositories for the Data Engineer and ML Engineer tracks |
| [`SPEC.md`](SPEC.md) | The long-term specification: URLs, content model, versioning and citation, quality gates |
| [`design/`](design/) | Logo, design tokens and the homepage design |
| `workers/feedback/` | The small service behind the feedback form |

The site is built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) and deployed to
GitHub Pages on every push to `main`.

```sh
nvm use          # Node version from .nvmrc
npm ci           # install the pinned dependencies
npm run dev      # local dev server
npm run check    # every quality gate: spelling, lint, build, links, prerequisite graph, tests
```

## License

- Content (lessons, reference, datasets): [CC BY 4.0](LICENSE-CONTENT)
- Code: [MIT](LICENSE)

© 2026 datafromzero
