const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: ''
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'team'],
        default: 'free'
      },
      status: {
        type: String,
        default: 'active'
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodEnd: Date
    },
    usage: {
      month: {
        type: String,
        default: () => new Date().toISOString().slice(0, 7) // 'YYYY-MM'
      },
      generationsCount: {
        type: Number,
        default: 0
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    isBanned: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
