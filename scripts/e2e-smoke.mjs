import { chromium, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const artifactsDir = '/Users/djordjes/Desktop/lovegift/artifacts';
const email = `qa.${Date.now()}@example.com`;
const password = 'Test12345!';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function maybeSkipQuickStart(page) {
  const skipBtn = page.getByRole('button', { name: /Skip and edit manually/i });
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click();
  }
}

async function signUp(page, creds) {
  await page.goto(`${BASE_URL}/auth?mode=signup&next=%2Ftemplates`, { waitUntil: 'networkidle' });
  await expect(page.locator('body')).toContainText(/Create your account/i, { timeout: 20000 });

  await page.locator('input[placeholder="you@example.com"]').fill(creds.email);
  const passwordInputs = page.locator('input[placeholder="••••••••"]');
  await passwordInputs.nth(0).fill(creds.password);
  await passwordInputs.nth(1).fill(creds.password);

  await page.getByRole('button', { name: /^Create account$/ }).click();

  const authError = page.locator('p.text-red-500').first();
  const hasError = await authError.isVisible({ timeout: 6000 }).catch(() => false);
  if (hasError) {
    const message = (await authError.textContent())?.trim() || 'Unknown auth error';
    throw new Error(`Sign-up failed: ${message}`);
  }

  await page.waitForURL(/\/templates/, { timeout: 45000 });
}

async function openBuilderAndEnterPreview(page, templateId) {
  await page.goto(`${BASE_URL}/create/${templateId}`, { waitUntil: 'networkidle' });
  await maybeSkipQuickStart(page);

  const publishBtn = page.locator('button:has-text("Preview & Publish")').first();
  await publishBtn.click();

  const authModal = page.getByRole('heading', { name: /publish/i });
  if (await authModal.isVisible({ timeout: 3000 }).catch(() => false)) {
    throw new Error('Unexpected auth modal appeared while already signed in.');
  }

  await page.waitForURL(/\/preview\/[A-Za-z0-9_-]+/, { timeout: 45000 });
}

async function publishFromPreview(page, method) {
  await expect(page.locator('body')).toContainText(/Ready to finish your gift\?/i, { timeout: 15000 });
  await page.locator('button:has-text("Finish & Publish")').first().click();

  await expect(page.locator('body')).toContainText(/Publish Your Gift/i, { timeout: 10000 });

  if (method === 'instant') {
    await page.getByRole('button', { name: /Instant Publish \(Test\)/i }).click();
  } else {
    await page.getByRole('button', { name: /Local Publish \(Test\)/i }).click();
  }

  const publishError = page.getByText(/Could not publish right now\. Please try again\./i);
  const errorVisible = await publishError.isVisible({ timeout: 8000 }).catch(() => false);
  if (errorVisible) {
    throw new Error('Publish modal returned error: Could not publish right now.');
  }

  await page.waitForURL(/\/success\?/, { timeout: 45000 });
  await expect(page.locator('body')).toContainText(/Your test page is live!/i, { timeout: 25000 });
  await expect(page.locator('#qr-code [role=\"img\"]')).toBeVisible({ timeout: 15000 });

  const copyBtn = page.getByRole('button', { name: /^Copy$/ }).first();
  await copyBtn.click();
  await expect(page.locator('body')).toContainText(/Copied!/i, { timeout: 5000 });

  const bodyText = await page.locator('body').innerText();
  const shareMatch = bodyText.match(/https?:\/\/[^\s]+\/p\/[A-Za-z0-9_-]+/);
  assert(shareMatch?.[0], 'Could not find share URL on success screen.');
  const shareUrl = shareMatch[0];
  const draftId = shareUrl.split('/p/')[1]?.trim();
  assert(draftId, 'Could not parse draft ID from share URL.');
  return { shareUrl, draftId };
}

async function verifyRecipientPage(context, draftId) {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/p/${draftId}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);
  const bodyText = await page.locator('body').innerText();
  if (/Page not found|Not available yet|Unknown template type/i.test(bodyText)) {
    throw new Error(`Recipient page not active for draft ${draftId}`);
  }
  await page.close();
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await context.newPage();

const summary = {
  accountEmail: email,
  signUp: 'pending',
  instant: { status: 'pending' },
  local: { status: 'pending' },
};

try {
  await signUp(page, { email, password });
  summary.signUp = 'passed';

  await openBuilderAndEnterPreview(page, 'kawaii-letter');
  const instantResult = await publishFromPreview(page, 'instant');
  await verifyRecipientPage(context, instantResult.draftId);
  summary.instant = { status: 'passed', shareUrl: instantResult.shareUrl, draftId: instantResult.draftId };
  await page.screenshot({ path: `${artifactsDir}/e2e-success-instant.png`, fullPage: true });

  await openBuilderAndEnterPreview(page, 'date-invite');
  const localResult = await publishFromPreview(page, 'local');
  await verifyRecipientPage(context, localResult.draftId);
  summary.local = { status: 'passed', shareUrl: localResult.shareUrl, draftId: localResult.draftId };
  await page.screenshot({ path: `${artifactsDir}/e2e-success-local.png`, fullPage: true });

  console.log(JSON.stringify({ ok: true, summary }, null, 2));
} catch (error) {
  let runtimeErrors = null;
  try {
    runtimeErrors = await page.evaluate(() => {
      const raw = localStorage.getItem('lovepage_runtime_errors');
      return raw ? JSON.parse(raw) : [];
    });
  } catch (storageErr) {
    runtimeErrors = [{ message: `Could not read runtime errors: ${storageErr.message}` }];
  }
  await page.screenshot({ path: `${artifactsDir}/e2e-failure.png`, fullPage: true }).catch(() => {});
  console.error(JSON.stringify({ ok: false, summary, error: error.message, runtimeErrors }, null, 2));
  process.exitCode = 1;
} finally {
  await context.close();
  await browser.close();
}
