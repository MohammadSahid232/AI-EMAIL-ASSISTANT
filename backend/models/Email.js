const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'generate-email',
        'reply',
        'summarize',
        'grammar',
        'rewrite',
        'tone',
        'translate',
        'action-items',
        'meeting-summary'
      ]
    },
    prompt: {
      type: String,
      required: true
    },
    generatedText: {
      type: String,
      required: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Email', emailSchema);
