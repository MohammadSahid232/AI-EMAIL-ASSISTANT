const crypto = require('crypto');
const User = require('../models/User');
const SystemLog = require('../models/SystemLog');
const { generateToken } = require('../utils/jwt');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../services/emailService');

// Register user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (getIsFallback()) {
      const existing = memoryStore.users.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        _id: `mem_usr_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        subscription: { plan: 'free', status: 'active' },
        usage: { month: new Date().toISOString().slice(0, 7), generationsCount: 0 },
        isVerified: true,
        createdAt: new Date()
      };
      memoryStore.users.push(newUser);
      const token = generateToken(newUser._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          subscription: newUser.subscription,
          usage: newUser.usage
        }
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      isVerified: false
    });

    // Send welcome / verification email asynchronously
    sendVerificationEmail(user.email, verificationToken, req);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription,
        usage: user.usage,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    if (getIsFallback()) {
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      if (user.isBanned) {
        return res.status(403).json({ success: false, error: 'Your account has been suspended by administration.' });
      }
      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          subscription: user.subscription || { plan: 'free', status: 'active' },
          usage: user.usage || { month: new Date().toISOString().slice(0, 7), generationsCount: 0 }
        }
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Your account has been suspended by administration.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription,
        usage: user.usage,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current profile
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u._id === userId) || req.user;
      return res.status(200).json({
        success: true,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          subscription: user.subscription || { plan: 'free', status: 'active' },
          usage: user.usage || { month: new Date().toISOString().slice(0, 7), generationsCount: 0 },
          createdAt: user.createdAt
        }
      });
    }

    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription,
        usage: user.usage,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const user = memoryStore.users.find((u) => u._id.toString() === userId.toString());
      if (user) {
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user?._id || userId,
          name: user?.name || name,
          email: user?.email || req.user.email,
          role: user?.role || req.user.role,
          avatar: user?.avatar || avatar
        }
      });
    }

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription,
        usage: user.usage
      }
    });
  } catch (err) {
    next(err);
  }
};

// Forgot Password (dispatches real email reset token securely)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email' });
    }

    if (getIsFallback()) {
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        const rawToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = rawToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await sendPasswordResetEmail(user.email, rawToken, req);
      }
      return res.status(200).json({
        success: true,
        message: `If an account with ${email} exists, password reset instructions have been sent.`
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: `If an account with ${email} exists, password reset instructions have been sent.`
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send email (token is NEVER returned in the API response)
    await sendPasswordResetEmail(user.email, resetToken, req);

    res.status(200).json({
      success: true,
      message: `Password reset instructions have been emailed to ${email}`
    });
  } catch (err) {
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password } = req.body;

    if (!resetToken || !password) {
      return res.status(400).json({ success: false, error: 'Please provide reset token and new password' });
    }

    if (getIsFallback()) {
      const user = memoryStore.users.find(
        u => u.resetPasswordToken === resetToken && u.resetPasswordExpire > Date.now()
      );
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
      }
      user.password = bcrypt.hashSync(password, 10);
      delete user.resetPasswordToken;
      delete user.resetPasswordExpire;

      return res.status(200).json({
        success: true,
        message: 'Password successfully reset. You can now login with your new credentials.'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password successfully reset. You can now login with your new credentials.'
    });
  } catch (err) {
    next(err);
  }
};

// Verify Email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (getIsFallback()) {
      return res.status(200).json({ success: true, message: 'Email address verified successfully!' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email address verified successfully!' });
  } catch (err) {
    next(err);
  }
};
