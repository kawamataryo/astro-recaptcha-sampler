import { test, expect } from '@playwright/test';

test.use({ userAgent: 'Googlebot/2.1' });

test('reCaptcha', async ({ page }) => {
  await page.goto("/");

  await page.fill("[data-testid='name-input']", "foo");
  await page.fill("[data-testid='content-input']", "bar");
  await page.click("[data-testid='submit-button']");

  const resultEl = await page.waitForSelector("[data-testid='result-text']");
  expect(await resultEl.textContent()).toBe("You are probably Bot 🤖");
});
