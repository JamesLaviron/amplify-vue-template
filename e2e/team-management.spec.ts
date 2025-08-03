import { test, expect } from '@playwright/test';

test.describe('Team Management', () => {
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
    });

    await page.goto('/');
  });

  test('creates new fantasy team', async ({ page }) => {
    // Mock no existing team
    await page.addInitScript(() => {
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
            list: () => Promise.resolve({ data: [] }),
            create: () =>
              Promise.resolve({
                data: {
                  id: 'team1',
                  name: 'New Team',
                  formation: '4-4-2',
                  budget: 1000,
                },
              }),
          },
        },
      };
    });

    await page.reload();
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    // Should show team creation form
    await expect(page.locator('.team-creation')).toBeVisible();

    // Fill in team details
    await page.fill('.team-name-input', 'My New Team');
    await page.selectOption('.formation-select', '4-3-3');

    // Submit form
    await page.click('.create-team-btn');

    // Should show success or redirect to team management
    await expect(page.locator('.team-header')).toBeVisible();
  });

  test('displays existing team information', async ({ page }) => {
    // Mock existing team
    await page.addInitScript(() => {
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
                    name: 'Existing Team',
                    formation: '4-4-2',
                    budget: 850,
                  },
                ],
              }),
          },
          FantasySelection: {
            list: () => Promise.resolve({ data: [] }),
          },
        },
      };
    });

    await page.reload();
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    // Should show team information
    await expect(page.locator('.team-name')).toContainText('Existing Team');
    await expect(page.locator('.formation-display')).toContainText('4-4-2');
    await expect(page.locator('.budget-display')).toContainText('850');
  });

  test('shows formation layout', async ({ page }) => {
    await page.addInitScript(() => {
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
          FantasySelection: {
            list: () => Promise.resolve({ data: [] }),
          },
        },
      };
    });

    await page.reload();
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();

    // Should show formation view with position slots
    await expect(page.locator('.formation-view')).toBeVisible();

    // Should have 11 position slots (1 GK + 10 outfield)
    const positionSlots = page.locator('.position-slot');
    await expect(positionSlots).toHaveCount(11);
  });

  test('validates team creation form', async ({ page }) => {
    await page.addInitScript(() => {
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
            list: () => Promise.resolve({ data: [] }),
          },
        },
      };
    });

    await page.reload();
    await expect(page.locator('.team-creation')).toBeVisible();

    // Try to submit without team name
    await page.click('.create-team-btn');

    // Should show validation error
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
