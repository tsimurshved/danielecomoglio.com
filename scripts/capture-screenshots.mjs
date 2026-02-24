import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.PLAYWRIGHT_BASE_URL;

if (!base) {
  console.error('Missing PLAYWRIGHT_BASE_URL.');
  process.exit(1);
}

const normalizedBase = base.replace(/\/$/, '');
const hostSlug = new URL(normalizedBase).host.replace(/[^a-zA-Z0-9.-]/g, '-');

const routes = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about/' },
  { name: 'tour', path: '/tour/' },
  { name: 'media', path: '/media/' },
  { name: 'saxophonerecording', path: '/saxophonerecording/' }
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height }
  });

  for (const route of routes) {
    const page = await context.newPage();
    const targetUrl = `${normalizedBase}${route.path}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const outDir = path.join('visual-playwright', hostSlug, viewport.name);
    await fs.mkdir(outDir, { recursive: true });
    const outPath = path.join(outDir, `${route.name}.png`);

    await page.screenshot({ path: outPath, fullPage: true });
    await page.close();
    console.log(`saved ${outPath}`);
  }

  await context.close();
}

await browser.close();
