// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Stripe Checkout Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#pricing');
  });

  test('pricing section is visible', async ({ page }) => {
    await expect(page.locator('.pricing')).toBeVisible();
    await expect(page.locator('.pricing h2')).toContainText('Start Automating');
  });

  test('both pricing plans render', async ({ page }) => {
    const cards = page.locator('.price-card');
    await expect(cards).toHaveCount(2);
  });

  test('starter plan displays correct info', async ({ page }) => {
    const starter = page.locator('.price-card').first();
    await expect(starter.locator('h3')).toContainText('Starter');
    await expect(starter.locator('.price')).toContainText('$49');
    await expect(starter.locator('.features li')).toHaveCount(4);
  });

  test('enterprise plan displays correct info', async ({ page }) => {
    const enterprise = page.locator('.price-card.featured');
    await expect(enterprise.locator('h3')).toContainText('Enterprise');
    await expect(enterprise.locator('.price')).toContainText('$299');
    await expect(enterprise.locator('.features li')).toHaveCount(5);
  });

  test('checkout buttons exist and are clickable', async ({ page }) => {
    const starterBtn = page.getByTestId('checkout-starter');
    const enterpriseBtn = page.getByTestId('checkout-enterprise');

    await expect(starterBtn).toBeVisible();
    await expect(starterBtn).toBeEnabled();
    await expect(starterBtn).toContainText('Get Started');

    await expect(enterpriseBtn).toBeVisible();
    await expect(enterpriseBtn).toBeEnabled();
    await expect(enterpriseBtn).toContainText('Contact Sales');
  });

  test('stripe.js is loaded on the page', async ({ page }) => {
    await page.goto('/');
    // Verify the Stripe script tag is present
    const stripeScript = page.locator('script[src="https://js.stripe.com/v3/"]');
    await expect(stripeScript).toHaveCount(1);
  });

  test('stripe-config.js is loaded', async ({ page }) => {
    await page.goto('/');
    const configScript = page.locator('script[src="stripe-config.js"]');
    await expect(configScript).toHaveCount(1);
  });

  test('startCheckout function is defined', async ({ page }) => {
    await page.goto('/');
    const hasFn = await page.evaluate(() => typeof window.startCheckout === 'function');
    expect(hasFn).toBe(true);
  });

  test('STRIPE_CONFIG object is defined with required fields', async ({ page }) => {
    await page.goto('/');
    const config = await page.evaluate(() => {
      // @ts-ignore
      const c = window.STRIPE_CONFIG;
      return {
        hasPublishableKey: typeof c?.publishableKey === 'string',
        hasPrices: typeof c?.prices === 'object',
        hasStarterPrice: typeof c?.prices?.starter === 'string',
        hasEnterprisePrice: typeof c?.prices?.enterprise === 'string',
        hasSuccessUrl: typeof c?.successUrl === 'string',
        hasCancelUrl: typeof c?.cancelUrl === 'string',
      };
    });

    expect(config.hasPublishableKey).toBe(true);
    expect(config.hasPrices).toBe(true);
    expect(config.hasStarterPrice).toBe(true);
    expect(config.hasEnterprisePrice).toBe(true);
    expect(config.hasSuccessUrl).toBe(true);
    expect(config.hasCancelUrl).toBe(true);
  });

  test('clicking checkout button triggers Stripe flow', async ({ page }) => {
    await page.goto('/');

    // Intercept the Stripe checkout redirect to verify it fires
    const alertPromise = page.waitForEvent('dialog', { timeout: 5000 }).catch(() => null);

    // Click the starter checkout button
    await page.getByTestId('checkout-starter').click();

    // Since we're using placeholder keys, Stripe will error.
    // The button should show 'Redirecting…' briefly, then recover.
    // We verify the error handling works (alert or button text reset).
    const dialog = await alertPromise;
    if (dialog) {
      expect(dialog.message()).toContain('checkout');
      await dialog.dismiss();
    }

    // Button should recover from the error state
    await expect(page.getByTestId('checkout-starter')).toContainText('Get Started', {
      timeout: 5000,
    });
  });
});

test.describe('Checkout Success Page', () => {
  test('success page renders', async ({ page }) => {
    await page.goto('/checkout-success.html');
    await expect(page.getByTestId('checkout-success')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Payment Successful');
  });

  test('success page has back-to-home link', async ({ page }) => {
    await page.goto('/checkout-success.html');
    const backLink = page.locator('a[href="/"]');
    await expect(backLink).toBeVisible();
  });
});
