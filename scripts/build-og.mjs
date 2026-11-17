// Renders the social preview card (design/og/card.html) to public/og.png at 1200×630, the size link previews use.
// Run by hand after changing the card: `node scripts/build-og.mjs`. Needs Playwright with Chromium (not a project
// dependency); the PNG is committed, so builds and CI never run this.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const card = fileURLToPath(new URL('../design/og/card.html', import.meta.url));
const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(card).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);
