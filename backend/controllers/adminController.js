const User = require('../models/User');
const Email = require('../models/Email');
const SystemLog = require('../models/SystemLog');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

exports.getAdminStats = async (req, res, next) => {
  try {
    if (getIsFallback()) {
      return res.status(200).json({
        success: true,
        stats: {
          totalUsers: memoryStore.users.length,
          totalEmails: memoryStore.emails.length,
          apiRequestsToday: memoryStore.emails.length,
          systemStatus: 'Operational (Local Fallback)',
          activeSubscriptions: memoryStore.users.filter(u => u.subscription?.plan !== 'free').length
        }
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalUsers, totalEmails, activeSubscriptions, apiRequestsToday] = await Promise.all([
      User.countDocuments(),
      Email.countDocuments(),
      User.countDocuments({ 'subscription.status': 'active', 'subscription.plan': { $in: ['pro', 'team'] } }),
      Email.countDocuments({ createdAt: { $gte: startOfDay } })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalEmails,
        apiRequestsToday,
        systemStatus: 'Operational',
        activeSubscriptions
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    if (getIsFallback()) {
      return res.status(200).json({
        success: true,
        count: memoryStore.users.length,
        users: memoryStore.users
      });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role specified' });
    }

    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u._id === id);
      if (user) user.role = role;
      return res.status(200).json({ success: true, message: `Role updated to ${role}` });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    // Log admin audit event
    await SystemLog.create({
      action: 'UPDATE_USER_ROLE',
      details: `Admin ${req.user.email} changed user ${user.email} role to ${role}`,
      ip: req.ip
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Moderation: Ban/Unban User
exports.toggleUserBan = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u._id === id);
      if (user) user.isBanned = !user.isBanned;
      return res.status(200).json({
        success: true,
        message: `User status changed to ${user?.isBanned ? 'Banned' : 'Active'}`
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    await SystemLog.create({
      action: 'TOGGLE_USER_BAN',
      details: `Admin ${req.user.email} set ban status of ${user.email} to ${user.isBanned}`,
      ip: req.ip
    });

    res.status(200).json({
      success: true,
      message: `User ${user.email} is now ${user.isBanned ? 'Banned' : 'Active'}`,
      isBanned: user.isBanned
    });
  } catch (err) {
    next(err);
  }
};

exports.getEmailLogs = async (req, res, next) => {
  try {
    if (getIsFallback()) {
      return res.status(200).json({
        success: true,
        count: memoryStore.emails.length,
        emails: memoryStore.emails
      });
    }

    const emails = await Email.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, count: emails.length, emails });
  } catch (err) {
    next(err);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    if (getIsFallback()) {
      return res.status(200).json({
        success: true,
        logs: [
          { action: 'SYSTEM_START', details: 'Fallback memory store active', createdAt: new Date() }
        ]
      });
    }

    const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};
