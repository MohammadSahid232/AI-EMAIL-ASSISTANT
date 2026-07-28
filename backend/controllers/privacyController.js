const User = require('../models/User');
const Email = require('../models/Email');
const Template = require('../models/Template');
const Activity = require('../models/Activity');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

/**
 * GDPR Data Export Endpoint (Download JSON archive)
 */
exports.exportUserData = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u._id === userId) || req.user;
      const emails = memoryStore.emails.filter(e => e.userId === userId);
      const templates = memoryStore.templates.filter(t => t.userId === userId);
      const activities = memoryStore.activities.filter(a => a.userId === userId);

      const exportPackage = {
        exportedAt: new Date().toISOString(),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          createdAt: user.createdAt
        },
        emailGenerationsCount: emails.length,
        emailGenerations: emails,
        templatesCount: templates.length,
        templates,
        activityLogsCount: activities.length,
        activities
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=ai_email_assistant_data_${userId}.json`);
      return res.status(200).send(JSON.stringify(exportPackage, null, 2));
    }

    const [user, emails, templates, activities] = await Promise.all([
      User.findById(userId).select('-password'),
      Email.find({ userId }).sort({ createdAt: -1 }),
      Template.find({ userId }).sort({ createdAt: -1 }),
      Activity.find({ userId }).sort({ createdAt: -1 })
    ]);

    const exportPackage = {
      exportedAt: new Date().toISOString(),
      user,
      emailGenerationsCount: emails.length,
      emailGenerations: emails,
      templatesCount: templates.length,
      templates,
      activityLogsCount: activities.length,
      activities
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=ai_email_assistant_data_${userId}.json`);
    res.status(200).send(JSON.stringify(exportPackage, null, 2));
  } catch (err) {
    next(err);
  }
};

/**
 * GDPR Account Deletion Endpoint ("Right to be Forgotten")
 */
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      memoryStore.users = memoryStore.users.filter(u => u._id !== userId);
      memoryStore.emails = memoryStore.emails.filter(e => e.userId !== userId);
      memoryStore.templates = memoryStore.templates.filter(t => t.userId !== userId);
      memoryStore.activities = memoryStore.activities.filter(a => a.userId !== userId);

      return res.status(200).json({
        success: true,
        message: 'Your account and all associated email history have been permanently erased.'
      });
    }

    await Promise.all([
      User.findByIdAndDelete(userId),
      Email.deleteMany({ userId }),
      Template.deleteMany({ userId }),
      Activity.deleteMany({ userId })
    ]);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been permanently purged in compliance with GDPR.'
    });
  } catch (err) {
    next(err);
  }
};
