/**
 * Stripe Checkout Configuration
 * ─────────────────────────────
 * Client-side Stripe Checkout redirect.
 * Uses Stripe's hosted checkout — no backend required.
 *
 * Setup:
 *   1. Create a product + price at https://dashboard.stripe.com/test/products
 *   2. Enable "Payment Links" or use Checkout Sessions
 *   3. Replace the config below with your real keys
 *
 * For production: swap pk_test_ → pk_live_ and update PRICE_ID.
 */

const STRIPE_CONFIG = {
  // Publishable key — safe to expose client-side
  publishableKey: 'pk_test_PLACEHOLDER',

  // Stripe Price IDs for products
  prices: {
    starter: 'price_starter_PLACEHOLDER',
    enterprise: 'price_enterprise_PLACEHOLDER',
  },

  // Redirect URLs after checkout
  successUrl: window.location.origin + '/checkout-success.html',
  cancelUrl: window.location.origin + '/#pricing',
};

/**
 * Initialize Stripe Checkout and redirect to payment page.
 * @param {'starter'|'enterprise'} plan - Which pricing plan to checkout
 */
async function startCheckout(plan) {
  const btn = document.querySelector(`[data-plan="${plan}"]`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Redirecting…';
  }

  try {
    // Load Stripe.js from CDN (already included in page)
    if (typeof Stripe === 'undefined') {
      throw new Error('Stripe.js not loaded');
    }

    const stripe = Stripe(STRIPE_CONFIG.publishableKey);

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_CONFIG.prices[plan], quantity: 1 }],
      mode: 'subscription',
      successUrl: STRIPE_CONFIG.successUrl,
      cancelUrl: STRIPE_CONFIG.cancelUrl,
    });

    if (error) {
      console.error('Stripe checkout error:', error.message);
      alert('Payment redirect failed. Please try again.');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Unable to start checkout. Please try again later.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = plan === 'starter' ? 'Get Started' : 'Contact Sales';
    }
  }
}
