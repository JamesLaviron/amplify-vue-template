import { test, expect } from '@playwright/test';

test.describe('League Management', () => {
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
          League: {
            list: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'league1',
                    name: 'Premier League Fantasy',
                    code: 'PL2024',
                    isPrivate: false,
                    maxMembers: 20,
                  },
                  {
                    id: 'league2',
                    name: 'Private League',
                    code: 'PRIV123',
                    isPrivate: true,
                    maxMembers: 10,
                  },
                ],
              }),
            create: () =>
              Promise.resolve({
                data: {
                  id: 'league3',
                  name: 'New League',
                  code: 'NEW456',
                  isPrivate: false,
                },
              }),
          },
          LeagueMembership: {
            list: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'membership1',
                    leagueId: 'league1',
                    userProfileId: 'user1',
                    totalPoints: 150,
                    rank: 1,
                  },
                  {
                    id: 'membership2',
                    leagueId: 'league1',
                    userProfileId: 'user2',
                    totalPoints: 120,
                    rank: 2,
                  },
                ],
              }),
            create: () =>
              Promise.resolve({
                data: { id: 'membership3' },
              }),
          },
        },
      };
    });

    await page.goto('/');

    // Navigate to leagues tab
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();
    await page.click('[data-tab="leagues"]');
    await expect(page.locator('.league-standings')).toBeVisible();
  });

  test('displays league tabs', async ({ page }) => {
    // Should show league navigation tabs
    await expect(page.locator('[data-tab="public"]')).toContainText('Public Leagues');
    await expect(page.locator('[data-tab="private"]')).toContainText('Private Leagues');
    await expect(page.locator('[data-tab="my-leagues"]')).toContainText('My Leagues');
  });

  test('switches between league tabs', async ({ page }) => {
    // Default should be public leagues
    await expect(page.locator('[data-tab="public"].active')).toBeVisible();

    // Switch to private leagues
    await page.click('[data-tab="private"]');
    await expect(page.locator('[data-tab="private"].active')).toBeVisible();

    // Switch to my leagues
    await page.click('[data-tab="my-leagues"]');
    await expect(page.locator('[data-tab="my-leagues"].active')).toBeVisible();
  });

  test('displays public leagues', async ({ page }) => {
    // Should show public leagues by default
    await expect(page.locator('.league-card')).toHaveCount(1);
    await expect(page.locator('.league-card')).toContainText('Premier League Fantasy');
    await expect(page.locator('.league-code')).toContainText('PL2024');
  });

  test('displays private leagues', async ({ page }) => {
    // Switch to private leagues tab
    await page.click('[data-tab="private"]');

    // Should show private leagues
    await expect(page.locator('.league-card')).toHaveCount(1);
    await expect(page.locator('.league-card')).toContainText('Private League');
    await expect(page.locator('.league-code')).toContainText('PRIV123');
  });

  test('joins a league', async ({ page }) => {
    // Should show join button for leagues user is not in
    const joinButton = page.locator('.join-btn').first();
    await expect(joinButton).toBeVisible();

    await joinButton.click();

    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('creates new league', async ({ page }) => {
    // Click create league button
    await page.click('.create-league-btn');

    // Should show league creation form
    await expect(page.locator('.league-creation-form')).toBeVisible();

    // Fill in league details
    await page.fill('.league-name-input', 'My Test League');

    // Set as private league
    await page.check('.private-checkbox');

    // Set max members
    await page.fill('.max-members-input', '15');

    // Submit form
    await page.click('.create-btn');

    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('validates league creation form', async ({ page }) => {
    await page.click('.create-league-btn');
    await expect(page.locator('.league-creation-form')).toBeVisible();

    // Try to submit without league name
    await page.click('.create-btn');

    // Should show validation error
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('League name is required');
  });

  test('views league standings', async ({ page }) => {
    // Click view standings for a league
    await page.click('.view-standings-btn');

    // Should show standings table
    await expect(page.locator('.standings-table')).toBeVisible();

    // Should show ranking rows
    await expect(page.locator('.standing-row')).toHaveCount(2);

    // Should show user rankings
    const firstPlace = page.locator('.standing-row').first();
    await expect(firstPlace.locator('.rank')).toContainText('1');
    await expect(firstPlace.locator('.points')).toContainText('150');
  });

  test('shows league information correctly', async ({ page }) => {
    const leagueCard = page.locator('.league-card').first();

    // Should show league details
    await expect(leagueCard.locator('.league-name')).toBeVisible();
    await expect(leagueCard.locator('.league-code')).toBeVisible();
    await expect(leagueCard.locator('.member-count')).toBeVisible();
    await expect(leagueCard.locator('.max-members')).toBeVisible();
  });

  test('filters leagues by privacy setting', async ({ page }) => {
    // Public leagues should show non-private leagues
    await expect(page.locator('.league-card')).toHaveCount(1);
    await expect(page.locator('.league-card')).toContainText('Premier League Fantasy');

    // Private leagues should show private leagues
    await page.click('[data-tab="private"]');
    await expect(page.locator('.league-card')).toHaveCount(1);
    await expect(page.locator('.league-card')).toContainText('Private League');
  });

  test('shows my leagues', async ({ page }) => {
    // Switch to my leagues tab
    await page.click('[data-tab="my-leagues"]');

    // Should show leagues user is a member of
    await expect(page.locator('.league-card')).toHaveCount(1);
    await expect(page.locator('.league-card')).toContainText('Premier League Fantasy');

    // Should show current rank and points
    await expect(page.locator('.my-rank')).toContainText('Rank: 1');
    await expect(page.locator('.my-points')).toContainText('Points: 150');
  });

  test('copies league code to clipboard', async ({ page }) => {
    // Click copy league code button
    await page.click('.copy-code-btn');

    // Should show success message
    await expect(page.locator('.copy-success')).toBeVisible();
  });
});
