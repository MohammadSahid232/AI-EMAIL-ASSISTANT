const geminiService = require('../services/geminiService');

describe('Gemini AI Service & Fallback Engine Unit Tests', () => {
  it('generateEmail should return a structured email with subject and body', async () => {
    const res = await geminiService.generateEmail({
      recipient: 'Board of Directors',
      purpose: 'Q4 Financial Overview',
      tone: 'Formal',
      language: 'English',
      keyPoints: 'Revenue up by 25%\nNew cloud strategy initialized'
    });

    expect(typeof res).toBe('string');
    expect(res.length).toBeGreaterThan(100);
    expect(res).toMatch(/Subject:/i);
  });

  it('translateEmail should return translated content in fallback or live mode', async () => {
    const res = await geminiService.translateEmail({
      text: 'Dear team, thank you for your hard work on the project.',
      language: 'Spanish'
    });

    expect(typeof res).toBe('string');
    expect(res.length).toBeGreaterThan(20);
  });

  it('detectTone should return valid sentiment analysis structure', async () => {
    const res = await geminiService.detectTone('We must complete this urgent task immediately by end of day!');
    expect(typeof res).toBe('string');
    expect(res).toMatch(/Primary Tone Detected/i);
  });
});
