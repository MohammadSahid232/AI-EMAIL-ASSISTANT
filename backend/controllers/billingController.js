const Stripe = require('stripe');
const User = require('../models/User');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');
const { PLAN_LIMITS } = require('../middleware/usageMiddleware');

const getStripe = () => {
  if (process.env.STRIPE_SECRET_KEY) {
    return new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return null;
};

// Plan ID Mapping
const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly_demo',
  team: process.env.STRIPE_TEAM_PRICE_ID || 'price_team_monthly_demo'
};

/**
 * Create Stripe Checkout Session
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body; // 'pro' or 'team'
    const userId = req.user._id || req.user.id;

    if (!['pro', 'team'].includes(plan)) {
      return res.status(400).json({ success: false, error: 'Invalid plan selected' });
    }

    const stripe = getStripe();
    const host = `${req.protocol}://${req.get('host')}`;
    const clientHost = process.env.CLIENT_URL || 'http://localhost:5173';

    if (!stripe) {
      // Demo Mode — Simulate Plan Upgrade immediately
      if (getIsFallback()) {
        const user = memoryStore.users.find(u => u._id === userId);
        if (user) {
          user.subscription = { plan, status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 86400000) };
        }
      } else {
        await User.findByIdAndUpdate(userId, {
          'subscription.plan': plan,
          'subscription.status': 'active',
          'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 86400000)
        });
      }

      return res.status(200).json({
        success: true,
        demoMode: true,
        url: `${clientHost}/dashboard/billing?success=true&plan=${plan}`,
        message: `Upgraded to ${plan.toUpperCase()} plan (Stripe keys not set — running in demo mode)`
      });
    }

    // Production Stripe Integration
    let user;
    if (!getIsFallback()) {
      user = await User.findById(userId);
    }

    let customerId = user?.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: userId.toString() }
      });
      customerId = customer.id;
      if (user) {
        user.subscription.stripeCustomerId = customerId;
        await user.save();
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${clientHost}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${clientHost}/dashboard/billing?canceled=true`,
      metadata: { userId: userId.toString(), plan }
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate Stripe Customer Portal Link
 */
exports.createCustomerPortal = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const stripe = getStripe();
    const clientHost = process.env.CLIENT_URL || 'http://localhost:5173';

    if (!stripe) {
      return res.status(200).json({
        success: true,
        url: `${clientHost}/dashboard/billing`,
        demoMode: true
      });
    }

    const user = await User.findById(userId);
    if (!user?.subscription?.stripeCustomerId) {
      return res.status(400).json({ success: false, error: 'No active Stripe billing profile found.' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${clientHost}/dashboard/billing`
    });

    res.status(200).json({ success: true, url: portalSession.url });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle Stripe Webhooks
 */
exports.handleWebhook = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(200).json({ received: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe Webhook Signature Verification Failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;

      await User.findByIdAndUpdate(userId, {
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.stripeSubscriptionId': session.subscription,
        'subscription.stripeCustomerId': session.customer
      });
      console.log(`Stripe Webhook: User ${userId} upgraded to ${plan}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await User.findOneAndUpdate(
        { 'subscription.stripeSubscriptionId': subscription.id },
        { 'subscription.plan': 'free', 'subscription.status': 'canceled' }
      );
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      console.log(`Stripe Webhook: Invoice paid for customer ${invoice.customer}`);
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

/**
 * Get Subscription Status & Usage Metrics
 */
exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const currentMonth = new Date().toISOString().slice(0, 7);

    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u._id === userId) || req.user;
      const plan = user.subscription?.plan || 'free';
      const usageCount = user.usage?.generationsCount || 0;
      const limit = PLAN_LIMITS[plan] || 50;

      return res.status(200).json({
        success: true,
        subscription: user.subscription || { plan: 'free', status: 'active' },
        usage: {
          month: currentMonth,
          used: usageCount,
          limit,
          remaining: Math.max(0, limit - usageCount)
        }
      });
    }

    const user = await User.findById(userId);
    const plan = user?.subscription?.plan || 'free';
    const usageCount = (user?.usage?.month === currentMonth ? user?.usage?.generationsCount : 0) || 0;
    const limit = PLAN_LIMITS[plan] || 50;

    res.status(200).json({
      success: true,
      subscription: user?.subscription || { plan: 'free', status: 'active' },
      usage: {
        month: currentMonth,
        used: usageCount,
        limit,
        remaining: Math.max(0, limit - usageCount)
      }
    });
  } catch (err) {
    next(err);
  }
};
