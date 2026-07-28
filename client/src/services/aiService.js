import api from './api';

export const aiService = {
  generateEmail: (data) => api.post('/ai/generate-email', data),
  generateReply: (data) => api.post('/ai/reply', data),
  summarizeEmail: (data) => api.post('/ai/summarize', data),
  checkGrammar: (data) => api.post('/ai/grammar', data),
  rewriteEmail: (data) => api.post('/ai/rewrite', data),
  detectTone: (data) => api.post('/ai/tone', data),
  translateEmail: (data) => api.post('/ai/translate', data),
  extractActionItems: (data) => api.post('/ai/action-items', data),
  generateMeetingSummary: (data) => api.post('/ai/meeting-summary', data),
  getHistory: () => api.get('/ai/history')
};
