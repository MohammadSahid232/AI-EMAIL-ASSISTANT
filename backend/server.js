const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB, getIsFallback } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
);

// Prevent NoSQL query injection
app.use(mongoSanitize());

// General API Rate limiting (100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', generalLimiter);

// Strict Rate Limiting for AI Generations (20 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Rate limit exceeded for AI generation requests. Maximum 20 requests per minute.' }
});
app.use('/api/ai', aiLimiter);

// Auth Endpoint Rate Limiting (10 requests per minute)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many authentication attempts. Please try again in a minute.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Stripe Webhook needs raw body buffer, so mount billing routes before default json body parser
app.use('/api/billing', require('./routes/billingRoutes'));

// Body Parsers for standard routes
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Advanced Observability Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getIsFallback()
    ? 'Resilient Fallback Mode (Local Memory)'
    : mongoose.connection.readyState === 1 ? 'Connected (MongoDB Atlas)' : 'Connecting/Disconnected';

  const geminiStatus = process.env.GEMINI_API_KEY
    ? 'Live Production Key Connected'
    : 'Smart Local Fallback Engine Active';

  res.status(200).json({
    status: 'OK',
    service: 'AI Email Assistant Enterprise API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      isFallbackMode: getIsFallback()
    },
    aiProvider: {
      name: 'Google Gemini 1.5 Flash',
      status: geminiStatus
    },
    systemMemory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
    }
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/privacy', require('./routes/privacyRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 AI Email Assistant Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
