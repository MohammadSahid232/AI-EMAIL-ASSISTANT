const Email = require('../models/Email');
const Activity = require('../models/Activity');
const geminiService = require('../services/geminiService');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const recordAiAction = async (userId, type, promptStr, outputText, meta = {}, activityTitle = 'AI Operation') => {
  if (getIsFallback()) {
    const emailRecord = {
      _id: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: userId.toString(),
      type,
      prompt: promptStr,
      generatedText: outputText,
      metadata: meta,
      createdAt: new Date()
    };
    memoryStore.emails.unshift(emailRecord);

    const activityRecord = {
      _id: `act_${Date.now()}`,
      userId: userId.toString(),
      activity: activityTitle,
      details: promptStr.slice(0, 80),
      time: new Date()
    };
    memoryStore.activities.unshift(activityRecord);
    return emailRecord;
  }

  const emailRecord = await Email.create({
    userId,
    type,
    prompt: promptStr,
    generatedText: outputText,
    metadata: meta
  });

  await Activity.create({
    userId,
    activity: activityTitle,
    details: promptStr.slice(0, 80)
  });

  return emailRecord;
};

// 1. Generate Email
exports.generateEmail = async (req, res, next) => {
  try {
    const { recipient, purpose, tone, language, keyPoints } = req.body;
    const generatedText = await geminiService.generateEmail({ recipient, purpose, tone, language, keyPoints });
    const promptStr = `Recipient: ${recipient || 'N/A'}, Purpose: ${purpose || 'N/A'}, Tone: ${tone || 'Professional'}, Language: ${language || 'English'}`;

    await recordAiAction(req.user._id || req.user.id, 'generate-email', promptStr, generatedText, { recipient, purpose, tone, language }, 'Generated Email');

    res.status(200).json({ success: true, generatedText, type: 'generate-email' });
  } catch (err) {
    next(err);
  }
};

// 2. Reply Generator
exports.generateReply = async (req, res, next) => {
  try {
    const { receivedEmail, context } = req.body;
    if (!receivedEmail) {
      return res.status(400).json({ success: false, error: 'Please paste the received email content' });
    }
    const generatedText = await geminiService.generateReply({ receivedEmail, context });
    await recordAiAction(req.user._id || req.user.id, 'reply', receivedEmail.slice(0, 100), generatedText, { context }, 'Generated Reply');

    res.status(200).json({ success: true, generatedText, type: 'reply' });
  } catch (err) {
    next(err);
  }
};

// 3. Summarize Email
exports.summarize = async (req, res, next) => {
  try {
    const { emailText } = req.body;
    if (!emailText) {
      return res.status(400).json({ success: false, error: 'Please paste the email content to summarize' });
    }
    const generatedText = await geminiService.summarizeEmail(emailText);
    await recordAiAction(req.user._id || req.user.id, 'summarize', emailText.slice(0, 100), generatedText, {}, 'Summarized Email');

    res.status(200).json({ success: true, generatedText, type: 'summarize' });
  } catch (err) {
    next(err);
  }
};

// 4. Grammar Checker
exports.grammar = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Please provide text for grammar check' });
    }
    const generatedText = await geminiService.checkGrammar(text);
    await recordAiAction(req.user._id || req.user.id, 'grammar', text.slice(0, 100), generatedText, {}, 'Grammar Correction');

    res.status(200).json({ success: true, generatedText, type: 'grammar' });
  } catch (err) {
    next(err);
  }
};

// 5. Rewrite Email
exports.rewrite = async (req, res, next) => {
  try {
    const { text, option } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Please provide text to rewrite' });
    }
    const generatedText = await geminiService.rewriteEmail({ text, option });
    await recordAiAction(req.user._id || req.user.id, 'rewrite', `${option || 'Professional'}: ${text.slice(0, 80)}`, generatedText, { option }, 'Rewrote Email');

    res.status(200).json({ success: true, generatedText, type: 'rewrite' });
  } catch (err) {
    next(err);
  }
};

// 6. Tone Detection
exports.detectTone = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Please provide text for tone analysis' });
    }
    const generatedText = await geminiService.detectTone(text);
    await recordAiAction(req.user._id || req.user.id, 'tone', text.slice(0, 100), generatedText, {}, 'Tone Detection');

    res.status(200).json({ success: true, generatedText, type: 'tone' });
  } catch (err) {
    next(err);
  }
};

// 7. Translation
exports.translate = async (req, res, next) => {
  try {
    const { text, language } = req.body;
    if (!text || !language) {
      return res.status(400).json({ success: false, error: 'Please provide text and target language' });
    }
    const generatedText = await geminiService.translateEmail({ text, language });
    await recordAiAction(req.user._id || req.user.id, 'translate', `To ${language}: ${text.slice(0, 80)}`, generatedText, { language }, 'Translated Email');

    res.status(200).json({ success: true, generatedText, type: 'translate' });
  } catch (err) {
    next(err);
  }
};

// 8. Action Items Extraction
exports.extractActionItems = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'Please paste text to extract action items' });
    }
    const generatedText = await geminiService.extractActionItems(text);
    await recordAiAction(req.user._id || req.user.id, 'action-items', text.slice(0, 100), generatedText, {}, 'Extracted Action Items');

    res.status(200).json({ success: true, generatedText, type: 'action-items' });
  } catch (err) {
    next(err);
  }
};

// 9. Meeting Summary Generator
exports.meetingSummary = async (req, res, next) => {
  try {
    const { notes } = req.body;
    if (!notes) {
      return res.status(400).json({ success: false, error: 'Please paste meeting notes' });
    }
    const generatedText = await geminiService.generateMeetingSummary(notes);
    await recordAiAction(req.user._id || req.user.id, 'meeting-summary', notes.slice(0, 100), generatedText, {}, 'Generated Meeting Summary');

    res.status(200).json({ success: true, generatedText, type: 'meeting-summary' });
  } catch (err) {
    next(err);
  }
};

// Get User History
exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const userEmails = memoryStore.emails.filter((e) => e.userId.toString() === userId.toString());
      return res.status(200).json({ success: true, count: userEmails.length, emails: userEmails });
    }

    const emails = await Email.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: emails.length, emails });
  } catch (err) {
    next(err);
  }
};
