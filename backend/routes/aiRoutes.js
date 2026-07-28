const express = require('express');
const {
  generateEmail,
  generateReply,
  summarize,
  grammar,
  rewrite,
  detectTone,
  translate,
  extractActionItems,
  meetingSummary,
  getHistory
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { checkUsageLimit } = require('../middleware/usageMiddleware');

const router = express.Router();

// Apply protection to all AI routes
router.use(protect);

router.post('/generate-email', checkUsageLimit, generateEmail);
router.post('/reply', checkUsageLimit, generateReply);
router.post('/summarize', checkUsageLimit, summarize);
router.post('/grammar', checkUsageLimit, grammar);
router.post('/rewrite', checkUsageLimit, rewrite);
router.post('/tone', checkUsageLimit, detectTone);
router.post('/translate', checkUsageLimit, translate);
router.post('/action-items', checkUsageLimit, extractActionItems);
router.post('/meeting-summary', checkUsageLimit, meetingSummary);
router.get('/history', getHistory);

module.exports = router;
