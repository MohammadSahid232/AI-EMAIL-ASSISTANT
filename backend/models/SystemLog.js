const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      default: 'info'
    },
    message: {
      type: String,
      required: true
    },
    endpoint: String,
    method: String,
    statusCode: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ip: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SystemLog', systemLogSchema);
