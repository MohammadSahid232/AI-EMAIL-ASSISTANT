const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a template title'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['HR', 'Marketing', 'Sales', 'Customer Support', 'Personal'],
      default: 'Personal'
    },
    content: {
      type: String,
      required: [true, 'Please add template content']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Template', templateSchema);
