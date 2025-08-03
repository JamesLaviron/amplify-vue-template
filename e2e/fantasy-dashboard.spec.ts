import { test, expect } from '@playwright/test';

test.describe('Fantasy Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication and API calls
    await page.addInitScript(() => {
      window.mockAuth = {
        getCurrentUser: () =>
          Promise.resolve({
            username: 'testuser',
            signInDetails: { loginId: 'test@example.com' },
          }),
      };

      // Mock Amplify client
      window.mockAmplifyClient = {
        models: {
          UserProfile: {
            list: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'user1',
                    username: 'testuser',
                    email: 'test@example.com',
                  },
                ],
              }),
          },
          FantasyTeam: {
            list: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'team1',
                    name: 'Test Team',
                    formation: '4-4-2',
                    budget: 1000,
                  },
                ],
              }),
          },
        },
      };
    });

    await page.goto('/');
  });

  test('displays navigation tabs', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    // Check all tab options are present
    await expect(page.locator('[data-tab="team"]')).toContainText('My Team');
    await expect(page.locator('[data-tab="players"]')).toContainText('Players');
    await expect(page.locator('[data-tab="leagues"]')).toContainText('Leagues');
    await expect(page.locator('[data-tab="scores"]')).toContainText('Live Scores');
  });

  test('switches between tabs', async ({ page }) => {
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    // Default tab should be active
    await expect(page.locator('[data-tab="team"].active')).toBeVisible();

    // Click players tab
    await page.click('[data-tab="players"]');
    await expect(page.locator('[data-tab="players"].active')).toBeVisible();

    // Click leagues tab
    await page.click('[data-tab="leagues"]');
    await expect(page.locator('[data-tab="leagues"].active')).toBeVisible();

    // Click scores tab
    await page.click('[data-tab="scores"]');
    await expect(page.locator('[data-tab="scores"].active')).toBeVisible();
  });

  test('loads team management by default', async ({ page }) => {
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    // Should show team management component
    await expect(page.locator('.fantasy-team-manager')).toBeVisible();
  });

  test('shows player list when players tab is active', async ({ page }) => {
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    await page.click('[data-tab="players"]');
    await expect(page.locator('.player-list')).toBeVisible();
  });

  test('shows league standings when leagues tab is active', async ({ page }) => {
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    await page.click('[data-tab="leagues"]');
    await expect(page.locator('.league-standings')).toBeVisible();
  });

  test('shows live scores when scores tab is active', async ({ page }) => {
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    await page.click('[data-tab="scores"]');
    await expect(page.locator('.live-scores')).toBeVisible();
  });
});
