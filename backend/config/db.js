const mongoose = require('mongoose');

let isInMemoryFallback = false;

const createIndexes = async () => {
  try {
    const Email = require('../models/Email');
    const Activity = require('../models/Activity');
    const Template = require('../models/Template');
    const User = require('../models/User');

    await Promise.all([
      Email.collection.createIndex({ userId: 1, createdAt: -1 }),
      Email.collection.createIndex({ type: 1 }),
      Activity.collection.createIndex({ userId: 1, createdAt: -1 }),
      Template.collection.createIndex({ userId: 1, category: 1 }),
      User.collection.createIndex({ email: 1 }, { unique: true }),
      User.collection.createIndex({ 'subscription.stripeCustomerId': 1 })
    ]);
    console.log('⚡ Database Indexes Verified/Created successfully.');
  } catch (err) {
    console.warn('Index Creation Warning:', err.message);
  }
};

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test' && !process.env.MONGODB_URI) {
    isInMemoryFallback = true;
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_email_assistant', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await createIndexes();
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn('App will run with resilient fallback mode for demonstration purposes.');
    isInMemoryFallback = true;
  }
};

const getIsFallback = () => isInMemoryFallback || (!process.env.MONGODB_URI && mongoose.connection.readyState !== 1);

module.exports = { connectDB, getIsFallback };
