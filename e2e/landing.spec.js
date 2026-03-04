// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Blackbox Enterprises/);
  });

  test('hero section renders', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Blackbox Enterprises');
    await expect(page.locator('.tagline')).toContainText('Automate Everything');
  });

  test('navigation links work', async ({ page }) => {
    const githubLink = page.locator('a.btn-primary');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/Blackbox-Enterprises');

    const blackroadLink = page.locator('a.btn-secondary');
    await expect(blackroadLink).toHaveAttribute('href', 'https://blackroad.io');
  });

  test('stats section displays all metrics', async ({ page }) => {
    const stats = page.locator('.stat');
    await expect(stats).toHaveCount(4);

    await expect(page.locator('.stat-value').nth(0)).toContainText('30K');
    await expect(page.locator('.stat-value').nth(1)).toContainText('17');
    await expect(page.locator('.stat-value').nth(2)).toContainText('1,800+');
    await expect(page.locator('.stat-value').nth(3)).toContainText('$0');
  });

  test('tags section shows automation categories', async ({ page }) => {
    const tags = page.locator('.tag');
    await expect(tags).toHaveCount(4);
    await expect(tags.nth(0)).toContainText('Workflow Automation');
    await expect(tags.nth(1)).toContainText('ETL');
    await expect(tags.nth(2)).toContainText('Orchestration');
    await expect(tags.nth(3)).toContainText('No-Code');
  });

  test('footer shows copyright', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('© 2026 BlackRoad OS, Inc.');
  });

  test('page is responsive — mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.pricing-grid')).toBeVisible();
  });
});
