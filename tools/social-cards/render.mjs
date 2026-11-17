// Renders the link-preview card and the favicon PNGs into public/.
// Needs Playwright: node tools/social-cards/render.mjs
// (or with another project's copy: PLAYWRIGHT=<path>/node_modules/playwright node tools/social-cards/render.mjs)
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const pw = await import(process.env.PLAYWRIGHT ? pathToFileURL(path.join(process.env.PLAYWRIGHT, 'index.js')).href : 'playwright');
const { chromium } = pw.default ?? pw; // a CommonJS module arrives under default
const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, '..', '..', 'public');
const browser = await chromium.launch();

const card = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await card.goto(pathToFileURL(path.join(here, 'newshub.html')).href);
await card.screenshot({ path: path.join(pub, 'og-newshub.png') });
await card.close();

// The favicon as PNG for browsers and devices that do not take the SVG
for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  // An SVG without width and height fills the window, so the page is the icon at this size
  await page.goto(pathToFileURL(path.join(pub, 'favicon.svg')).href);
  await page.screenshot({ path: path.join(pub, file), omitBackground: true });
  await page.close();
}

await browser.close();
console.log('wrote public/og-newshub.png, favicon-32.png, apple-touch-icon.png');
