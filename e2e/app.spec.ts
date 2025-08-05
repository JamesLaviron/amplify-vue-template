import { test, expect } from '@playwright/test';

test.describe('App Authentication', () => {
  test('shows login form when not authenticated', async ({ page }) => {
    await page.goto('/');

    // Should see the authenticator
    await expect(page.locator('[data-amplify-authenticator]')).toBeVisible();

    // Should see app title
    await expect(page.locator('.app-title')).toContainText('⚽ Fantasy Football');
  });

  test('shows dashboard when authenticated', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      // Mock AWS Amplify Auth
      window.mockAuth = {
        getCurrentUser: () =>
          Promise.resolve({
            username: 'testuser',
            signInDetails: { loginId: 'test@example.com' },
          }),
      };
    });

    await page.goto('/');

    // Should see the header with user info
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.app-title')).toContainText('⚽ Fantasy Football');
  });

  test('sign out functionality works', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.mockAuth = {
        getCurrentUser: () =>
          Promise.resolve({
            username: 'testuser',
            signInDetails: { loginId: 'test@example.com' },
          }),
        signOut: () => Promise.resolve(),
      };
    });

    await page.goto('/');

    // Should see sign out button
    const signOutBtn = page.locator('.sign-out-btn');
    await expect(signOutBtn).toBeVisible();

    // Click sign out
    await signOutBtn.click();

    // Should redirect to login
    await expect(page.locator('[data-amplify-authenticator]')).toBeVisible();
  });
});
