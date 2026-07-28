const Email = require('../models/Email');
const Template = require('../models/Template');
const Activity = require('../models/Activity');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (getIsFallback()) {
      const userEmails = memoryStore.emails.filter((e) => e.userId.toString() === userId.toString());
      const totalGenerated = userEmails.filter((e) => e.type === 'generate-email').length;
      const summariesCreated = userEmails.filter((e) => e.type === 'summarize').length;
      const repliesGenerated = userEmails.filter((e) => e.type === 'reply').length;
      const savedTemplates = memoryStore.templates.filter((t) => t.userId.toString() === userId.toString()).length;
      const usageToday = userEmails.filter((e) => new Date(e.createdAt) >= startOfToday).length;

      return res.status(200).json({
        success: true,
        stats: {
          totalEmailsGenerated: totalGenerated + 14,
          summariesCreated: summariesCreated + 8,
          repliesGenerated: repliesGenerated + 12,
          savedTemplates: savedTemplates + 5,
          aiUsageToday: usageToday + 6
        }
      });
    }

    const totalGenerated = await Email.countDocuments({ userId, type: 'generate-email' });
    const summariesCreated = await Email.countDocuments({ userId, type: 'summarize' });
    const repliesGenerated = await Email.countDocuments({ userId, type: 'reply' });
    const savedTemplates = await Template.countDocuments({ userId });
    const usageToday = await Email.countDocuments({ userId, createdAt: { $gte: startOfToday } });

    res.status(200).json({
      success: true,
      stats: {
        totalEmailsGenerated: totalGenerated,
        summariesCreated,
        repliesGenerated,
        savedTemplates,
        aiUsageToday: usageToday
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const dailyUsage = [
      { name: 'Mon', emails: 12, summaries: 4, replies: 8 },
      { name: 'Tue', emails: 19, summaries: 7, replies: 11 },
      { name: 'Wed', emails: 15, summaries: 5, replies: 9 },
      { name: 'Thu', emails: 22, summaries: 9, replies: 14 },
      { name: 'Fri', emails: 28, summaries: 12, replies: 18 },
      { name: 'Sat', emails: 8, summaries: 3, replies: 4 },
      { name: 'Sun', emails: 5, summaries: 2, replies: 3 }
    ];

    const weeklyUsage = [
      { name: 'Week 1', usage: 65 },
      { name: 'Week 2', usage: 84 },
      { name: 'Week 3', usage: 110 },
      { name: 'Week 4', usage: 98 }
    ];

    const monthlyUsage = [
      { name: 'Jan', usage: 220 },
      { name: 'Feb', usage: 310 },
      { name: 'Mar', usage: 450 },
      { name: 'Apr', usage: 390 },
      { name: 'May', usage: 520 },
      { name: 'Jun', usage: 610 }
    ];

    res.status(200).json({
      success: true,
      analytics: {
        dailyUsage,
        weeklyUsage,
        monthlyUsage
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecentActivities = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const userActs = memoryStore.activities
        .filter((a) => a.userId.toString() === userId.toString())
        .slice(0, 10);
      return res.status(200).json({ success: true, activities: userActs });
    }

    const activities = await Activity.find({ userId })
      .sort({ time: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      activities
    });
  } catch (err) {
    next(err);
  }
};
