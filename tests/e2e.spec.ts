import { test, expect } from '@playwright/test';

test.describe('Iron Tracker E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Iron Tracker/i);
    await expect(page.locator('h1')).toContainText('Iron Tracker');
  });

  test('habit tracking functionality', async ({ page }) => {
    // Test morning squats checkbox
    const amSquats = page.locator('[data-testid="am-squats"]');
    await amSquats.check();
    await expect(amSquats).toBeChecked();
    
    // Test steps tracking
    const stepsCheckbox = page.locator('[data-testid="steps-10k"]');
    await stepsCheckbox.check();
    await expect(stepsCheckbox).toBeChecked();
  });

  test('workout navigation works', async ({ page }) => {
    const workoutLink = page.getByRole('link', { name: /workout/i });
    await workoutLink.click();
    await expect(page).toHaveURL(/workout/);
    
    // Verify workout content loads
    await expect(page.locator('h1')).toContainText(/workout/i);
  });

  test('progress charts load', async ({ page }) => {
    const historyLink = page.getByRole('link', { name: /history/i });
    await historyLink.click();
    await expect(page).toHaveURL(/history/);
    
    // Wait for charts to load
    await page.waitForSelector('[data-testid="progress-chart"]');
    const chart = page.locator('[data-testid="progress-chart"]');
    await expect(chart).toBeVisible();
  });

  test('responsive design mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('dark mode toggle', async ({ page }) => {
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      // Verify theme changed
      const body = page.locator('body');
      await expect(body).toHaveClass(/dark/);
    }
  });
});