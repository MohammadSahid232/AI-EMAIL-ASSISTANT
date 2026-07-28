const User = require('../models/User');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const PLAN_LIMITS = {
  free: 50,
  pro: 1000,
  team: 999999
};

/**
 * Server-side quota middleware enforcing monthly AI generation limits
 */
const checkUsageLimit = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return next();

    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u._id === userId);
      if (user) {
        if (!user.usage || user.usage.month !== currentMonth) {
          user.usage = { month: currentMonth, generationsCount: 0 };
        }
        const plan = user.subscription?.plan || 'free';
        const limit = PLAN_LIMITS[plan] || 50;

        if (user.usage.generationsCount >= limit) {
          return res.status(403).json({
            success: false,
            error: `Monthly AI generation quota reached (${user.usage.generationsCount}/${limit} on ${plan.toUpperCase()} plan). Please upgrade your subscription to continue.`,
            quotaExceeded: true,
            plan,
            usage: user.usage.generationsCount,
            limit
          });
        }
        user.usage.generationsCount += 1;
      }
      return next();
    }

    const user = await User.findById(userId);
    if (!user) return next();

    // Reset usage if new month
    if (!user.usage || user.usage.month !== currentMonth) {
      user.usage = { month: currentMonth, generationsCount: 0 };
    }

    const plan = user.subscription?.plan || 'free';
    const limit = PLAN_LIMITS[plan] || 50;

    if (user.usage.generationsCount >= limit) {
      return res.status(403).json({
        success: false,
        error: `Monthly AI generation quota reached (${user.usage.generationsCount}/${limit} on ${plan.toUpperCase()} plan). Please upgrade your subscription to continue.`,
        quotaExceeded: true,
        plan,
        usage: user.usage.generationsCount,
        limit
      });
    }

    // Increment count
    user.usage.generationsCount += 1;
    await user.save();

    next();
  } catch (err) {
    console.error('Usage metering middleware error:', err);
    next();
  }
};

module.exports = { checkUsageLimit, PLAN_LIMITS };
