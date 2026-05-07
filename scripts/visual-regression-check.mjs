const BASE_URL = process.env.VISUAL_BASE_URL || 'http://localhost:5173';
const routes = [
  '/preview-demo/kawaii-letter',
  '/preview-demo/dark-romance',
  '/preview-demo/midnight-love',
];

async function loadPlaywright() {
  try {
    return await import('@playwright/test');
  } catch {
    throw new Error('Install Playwright first: npm install -D @playwright/test && npx playwright install chromium');
  }
}

const { chromium, expect } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

try {
  for (const route of routes) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
    await expect(page.locator('body')).toBeVisible();
    const box = await page.locator('body').boundingBox();
    if (!box || box.width < 300 || box.height < 600) {
      throw new Error(`Route ${route} rendered too small or blank.`);
    }
    await page.screenshot({
      path: `artifacts/visual-${route.split('/').pop()}.png`,
      fullPage: true,
    });
  }
} finally {
  await browser.close();
}

console.log(`Visual smoke captured ${routes.length} template previews from ${BASE_URL}`);
