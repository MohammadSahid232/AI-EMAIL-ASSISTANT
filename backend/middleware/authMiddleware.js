const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsFallback } = require('../config/db');

// In-memory mock store fallback if MongoDB is offline
const memoryUsers = require('../utils/memoryStore').users;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_key_ai_email_assistant_2026_production'
    );

    if (getIsFallback()) {
      const user = memoryUsers.find((u) => u._id.toString() === decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // Check fallback memory users in case created during offline mode
      const memUser = memoryUsers.find((u) => u._id.toString() === decoded.id);
      if (memUser) {
        req.user = memUser;
        return next();
      }
      return res.status(401).json({ success: false, error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized, token invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user ? req.user.role : 'guest'} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
