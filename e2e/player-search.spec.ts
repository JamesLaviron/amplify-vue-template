import { test, expect } from '@playwright/test';

test.describe('Player Search and Selection', () => {
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
          FootballTeam: {
            list: () =>
              Promise.resolve({
                data: [
                  { id: 'team1', name: 'Arsenal', code: 'ARS' },
                  { id: 'team2', name: 'Chelsea', code: 'CHE' },
                ],
              }),
          },
          Player: {
            list: () =>
              Promise.resolve({
                data: [
                  {
                    id: 'player1',
                    name: 'Bukayo Saka',
                    position: 'FWD',
                    teamId: 'team1',
                    price: 120,
                    totalPoints: 180,
                    form: 85,
                  },
                  {
                    id: 'player2',
                    name: 'Cole Palmer',
                    position: 'MID',
                    teamId: 'team2',
                    price: 95,
                    totalPoints: 145,
                    form: 78,
                  },
                  {
                    id: 'player3',
                    name: 'Robert Sanchez',
                    position: 'GK',
                    teamId: 'team2',
                    price: 45,
                    totalPoints: 85,
                    form: 65,
                  },
                ],
              }),
          },
        },
      };
    });

    await page.goto('/');

    // Navigate to players tab
    await expect(page.locator('.fantasy-dashboard')).toBeVisible();
    await page.click('[data-tab="players"]');
    await expect(page.locator('.player-list')).toBeVisible();
  });

  test('displays player search interface', async ({ page }) => {
    // Should show search input
    await expect(page.locator('.search-input')).toBeVisible();
    await expect(page.locator('.search-input')).toHaveAttribute('placeholder', 'Search players...');

    // Should show position filters
    await expect(page.locator('.position-filter')).toBeVisible();
    await expect(page.locator('[data-position="ALL"]')).toContainText('All Positions');
    await expect(page.locator('[data-position="GK"]')).toContainText('Goalkeepers');
    await expect(page.locator('[data-position="DEF"]')).toContainText('Defenders');
    await expect(page.locator('[data-position="MID"]')).toContainText('Midfielders');
    await expect(page.locator('[data-position="FWD"]')).toContainText('Forwards');
  });

  test('searches players by name', async ({ page }) => {
    // Search for specific player
    await page.fill('.search-input', 'Saka');

    // Should show only matching players
    await expect(page.locator('.player-card')).toHaveCount(1);
    await expect(page.locator('.player-card')).toContainText('Bukayo Saka');
  });

  test('filters players by position', async ({ page }) => {
    // Click goalkeeper filter
    await page.click('[data-position="GK"]');

    // Should show only goalkeepers
    await expect(page.locator('.player-card')).toHaveCount(1);
    await expect(page.locator('.player-card')).toContainText('Robert Sanchez');

    // Click forward filter
    await page.click('[data-position="FWD"]');

    // Should show only forwards
    await expect(page.locator('.player-card')).toHaveCount(1);
    await expect(page.locator('.player-card')).toContainText('Bukayo Saka');
  });

  test('displays player information', async ({ page }) => {
    const playerCard = page.locator('.player-card').first();

    // Should show player details
    await expect(playerCard.locator('.player-name')).toBeVisible();
    await expect(playerCard.locator('.player-position')).toBeVisible();
    await expect(playerCard.locator('.player-price')).toBeVisible();
    await expect(playerCard.locator('.player-points')).toBeVisible();
    await expect(playerCard.locator('.player-form')).toBeVisible();
  });

  test('sorts players correctly', async ({ page }) => {
    // Change sort to price
    await page.selectOption('.sort-select', 'price');

    const playerCards = page.locator('.player-card');
    const firstPlayer = playerCards.first();
    const lastPlayer = playerCards.last();

    // Highest priced player should be first (desc order)
    await expect(firstPlayer).toContainText('Bukayo Saka'); // 120 price

    // Change sort order to ascending
    await page.click('.sort-order-btn');

    // Lowest priced player should be first now
    await expect(playerCards.first()).toContainText('Robert Sanchez'); // 45 price
  });

  test('adds player to team', async ({ page }) => {
    // Mock the add player API call
    await page.addInitScript(() => {
      window.mockAmplifyClient.models.FantasySelection = {
        create: () =>
          Promise.resolve({
            data: { id: 'selection1' },
          }),
      };
    });

    const addButton = page.locator('.player-card').first().locator('.add-btn');
    await expect(addButton).toBeVisible();

    await addButton.click();

    // Should show success message or update team
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('shows team filter dropdown', async ({ page }) => {
    // Should show team filter
    await expect(page.locator('.team-filter')).toBeVisible();

    // Click to open dropdown
    await page.click('.team-filter');

    // Should show team options
    await expect(page.locator('.team-option')).toHaveCount(3); // All + 2 teams
    await expect(page.locator('.team-option')).toContainText(['All Teams', 'Arsenal', 'Chelsea']);
  });

  test('filters players by team', async ({ page }) => {
    // Select Arsenal team filter
    await page.selectOption('.team-filter', 'team1');

    // Should show only Arsenal players
    await expect(page.locator('.player-card')).toHaveCount(1);
    await expect(page.locator('.player-card')).toContainText('Bukayo Saka');
  });

  test('combines multiple filters', async ({ page }) => {
    // Apply team and position filters
    await page.selectOption('.team-filter', 'team2'); // Chelsea
    await page.click('[data-position="MID"]'); // Midfielders

    // Should show only Chelsea midfielders
    await expect(page.locator('.player-card')).toHaveCount(1);
    await expect(page.locator('.player-card')).toContainText('Cole Palmer');
  });
});
