const express = require('express');
const {
  createCheckoutSession,
  createCustomerPortal,
  handleWebhook,
  getSubscriptionStatus
} = require('../controllers/billingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe Webhook Endpoint (Raw body required by Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected Billing Endpoints
router.use(protect);

router.post('/create-checkout-session', createCheckoutSession);
router.post('/customer-portal', createCustomerPortal);
router.get('/status', getSubscriptionStatus);

module.exports = router;
