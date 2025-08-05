import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Wait for the authenticator to load
  await page.waitForSelector('[data-amplify-authenticator]', { timeout: 10000 });

  // Check if we're already on the sign-in form or need to navigate to it
  const signInButton = page.locator('button:has-text("Sign in")');
  if (await signInButton.isVisible()) {
    // Already on sign-in form
  } else {
    // Look for a link to go to sign-in
    const signInLink = page.locator('button:has-text("Sign In")');
    if (await signInLink.isVisible()) {
      await signInLink.click();
    }
  }

  // Fill in test credentials
  await page.fill('input[name="username"], input[type="email"]', 'test@example.com');
  await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');

  // Submit form
  await page.click('button:has-text("Sign in")');

  // Wait for successful authentication
  await page.waitForSelector('.app-header', { timeout: 15000 });
  await expect(page.locator('.user-info')).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
