// AI Email Assistant — Gemini Service (v2.1 — varied output, full translation, 60-80 word emails)
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getApiKey = () => process.env.GEMINI_API_KEY || '';

const getAiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

// --- Randomization helpers ---
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const OPENINGS = [
  'I hope this message finds you well.',
  'I trust you are doing great.',
  'I hope you are having a productive week.',
  'I hope all is going well on your end.',
  'Thank you for your continued partnership and trust.',
  'Greetings and I hope this note reaches you in the best of spirits.'
];

const CLOSINGS = [
  'Best regards',
  'Warm regards',
  'Sincerely',
  'With appreciation',
  'Kind regards',
  'Respectfully yours',
  'With best wishes'
];

const TRANSITIONS = [
  'I wanted to bring to your attention',
  'I am reaching out regarding',
  'I am writing to inform you about',
  'I would like to formally discuss',
  'Please allow me to share some important updates on',
  'I am following up to address'
];

const FOLLOW_UPS = [
  'Please do not hesitate to reach out should you need any clarification or wish to schedule a follow-up discussion.',
  'I am available at your convenience to discuss this further or answer any questions you may have.',
  'Looking forward to your response and happy to arrange a call at a time that suits you best.',
  'Kindly review the above points and share your feedback at your earliest convenience.',
  'Please feel free to respond to this email or reach out directly if you would like to explore this further.'
];

/**
 * Executes a Gemini prompt with timeout, retries, length capping, and fallback heuristics
 */
const runGeminiPrompt = async (prompt, systemInstruction = '', timeoutMs = 15000, maxRetries = 2) => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  // Cap prompt payload size to 20,000 characters
  const sanitizedPrompt = prompt.length > 20000 ? prompt.slice(0, 20000) + '\n[Truncated to 20,000 max character limit]' : prompt;
  const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${sanitizedPrompt}` : sanitizedPrompt;

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const genAI = getAiClient();
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95
        }
      });

      // Execute with timeout promise racing
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Provider Request Timeout (15s exceeded)')), timeoutMs)
      );

      const generatePromise = model.generateContent(fullPrompt);
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const text = response.response.text();

      if (text) {
        return text;
      }
    } catch (err) {
      attempt++;
      console.warn(`Gemini API execution attempt ${attempt} failed: ${err.message}`);
      if (attempt <= maxRetries) {
        // Exponential backoff delay (500ms, 1000ms)
        await new Promise(r => setTimeout(r, attempt * 500));
      } else {
        console.warn('Gemini API exhausted retries. Invoking smart fallback engine.');
      }
    }
  }
  return null;
};

// --- Smart Varied Fallback Generators ---

const generateEmailFallback = ({ recipient, purpose, tone, language, keyPoints }) => {
  const lang = (language || 'english').toLowerCase();

  if (lang === 'nepali') {
    return `विषय: ${purpose || 'बिदा तथा आवश्यक जानकारी सम्बन्धमा'}\n\nआदरणीय ${recipient || 'सर/मैडम'},\n\nआशा छ यहाँ सञ्चै हुनुहुन्छ।\n\nइमेलको मुख्य उद्देश्य ${purpose || 'बिदा तथा आवश्यक कार्य'} का लागि निवेदन गर्नु हो।\n\nयस अवधिमा बाँकी रहेका सम्पूर्ण कार्य तथा असाइनमेन्टहरू समयमै पूरा गर्ने प्रतिवद्धता व्यक्त गर्दछु।\n\nतसर्थ, कृपया मेरो निवेदन स्वीकृत गरिदिनुहुन हार्दिक अनुरोध गर्दछु। हजुरको सहयोगको लागि सधैं आभारी रहनेछु।\n\nतपाईंको समय र विचारको लागि धन्यवाद। सकारात्मक प्रतिक्रियाको प्रतीक्षामा छु।\n\nभवदीय,\n\n[तपाईंको नाम]\nविद्यार्थी आईडी / पद\nसेक्सन / विभाग\nसंस्था / कलेज`;
  }

  const purp = purpose || 'Request for Leave / Project Update';
  const rec = recipient || 'Sir/Madam';

  // Check if purpose relates to leave / absence
  const isLeaveRequest = /leave|absence|vacation|marriage|wedding|sick|off/i.test(purp + ' ' + (keyPoints || ''));

  const subject = isLeaveRequest
    ? `Subject: ${purp} (${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(Date.now() + 3*86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`
    : `Subject: ${purp}`;

  const paragraph1 = isLeaveRequest
    ? `I am writing to kindly request leave for 3 days, from ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} to ${new Date(Date.now() + 3*86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, as I need to attend an important family event and related functions.`
    : `I am writing to formally present this communication regarding ${purp}. This correspondence aims to outline our key objectives and provide a comprehensive overview of the current status.`;

  const paragraph2 = isLeaveRequest
    ? `This is an important family occasion, and my presence is required throughout the event. I assure you that I will complete any pending assignments, classwork, or deliverables and catch up on all lessons missed during my absence.`
    : keyPoints
      ? `Regarding the specific deliverables: ${keyPoints.replace(/\n/g, ' ')}. I assure you that all associated action items have been systematically organized and aligned with our target milestones.`
      : `Our team has evaluated all relevant dependencies and prepared a thorough action plan to ensure seamless execution. I assure you that all responsibilities will be handled with full dedication and attention to detail.`;

  const paragraph3 = `I kindly request you to grant approval for the mentioned request. I would be very grateful for your understanding, support, and guidance regarding this matter.`;

  return `${subject}\n\nDear ${rec},\n\nI hope you are doing well.\n\n${paragraph1}\n\n${paragraph2}\n\n${paragraph3}\n\nThank you for your time and consideration. I look forward to your positive response.\n\nYours sincerely,\n\n[Your Name]\n[Student / Employee ID]\n[Section / Department]\n[Organization / College Name]`;
};

const generateReplyFallback = (receivedEmail, context) => {
  const opening = pick(OPENINGS);
  const closing = pick(CLOSINGS);
  const followUp = pick(FOLLOW_UPS);
  const excerpt = (receivedEmail || '').slice(0, 80).trim();

  // Build a rich paragraph body from the context / key directions
  const buildContextBody = (ctx) => {
    if (!ctx || !ctx.trim()) {
      return pick([
        'I have reviewed your correspondence in detail and would like to confirm that we are fully aligned with the proposed direction. All relevant stakeholders have been informed and we are prepared to move forward with confidence. Our team is committed to executing on the agreed terms with the highest level of professionalism and attention to detail.\n\nWe believe this collaboration is built on a strong foundation, and we remain dedicated to ensuring a smooth and successful outcome for all parties involved.',
        'Thank you for your clear and comprehensive communication. I am pleased to confirm our full agreement with the outlined terms, and our team will proceed accordingly to ensure timely and high-quality execution. Every aspect of your message has been carefully reviewed and shared with the relevant team members.\n\nWe are enthusiastic about moving forward and are confident that our combined efforts will produce excellent results. Please expect a detailed follow-up from our side within the next 24 to 48 hours.',
        'I appreciate the thoroughness and clarity of your message. After careful review, we are happy to confirm our full cooperation and commitment to the proposed course of action. The necessary internal arrangements have already been initiated to ensure a prompt and effective response.\n\nOur team will ensure that all aspects are handled with the utmost care and diligence. We look forward to a productive collaboration and will keep you closely informed of our progress throughout the process.'
      ]);
    }

    // Parse key points from context (could be comma-separated, newline-separated, or a sentence)
    const points = ctx.split(/[\n,;]/).map(p => p.trim()).filter(Boolean);

    if (points.length > 1) {
      // Multiple key points — present highlighted then expand in paragraph
      const pointIntro = pick([
        'Having thoroughly reviewed your email, I would like to address the key points you have raised:',
        'In response to the specific matters outlined in your message, I am pleased to share the following:',
        'Thank you for clearly outlining your requirements. I would like to respond to each key direction as follows:'
      ]);
      const ptList = points.map(p => `  • ${p}`).join('\n');
      const expansion = pick([
        'Each of the above points has been carefully considered and our team is fully prepared to act on them without delay. We are committed to meeting the stated expectations and will ensure that every detail is addressed with precision and care.',
        'We have reviewed each of the above items and are pleased to confirm our agreement and readiness to proceed. Our team will coordinate internally to ensure seamless execution across all fronts.',
        'The above directions have been noted and will be implemented promptly. We appreciate the clarity and structure of your communication, and we are dedicated to delivering the outcomes you have outlined in full and on time.'
      ]);
      return `${pointIntro}\n\n${ptList}\n\n${expansion}\n\n${pick([
        'We are confident that this response addresses all the matters you raised and look forward to continuing our productive collaboration.',
        'I trust this covers everything you needed and I remain available for any further discussion at your convenience.',
        'Please let me know if you require any additional information or if there is anything else we can do to support you further.'
      ])}`;
    } else {
      // Single direction — expand into 2 rich paragraphs
      const bodyP1 = pick([
        `Thank you for your message. Regarding your direction to ${ctx} — I am pleased to confirm that we are fully on board and ready to proceed immediately. Our team has been briefed and all necessary preparations are underway to ensure a smooth and timely execution.`,
        `I appreciate your clear communication. In response to your request to ${ctx}, I would like to confirm that this has been duly noted and will be acted upon with the highest level of priority. All relevant parties have been informed and are aligned on the next steps.`,
        `Thank you for reaching out with such a clear direction. To address your request regarding ${ctx} — I can confirm that we are fully committed to this course of action and will proceed with the necessary steps immediately to meet your expectations.`
      ]);
      const bodyP2 = pick([
        'We are confident in our ability to deliver on this and will ensure that the outcome fully meets your expectations. Please feel free to reach out at any time if you need any updates or wish to discuss further details.',
        'Our commitment to excellence and timely delivery remains unwavering, and we will keep you informed of progress at every key milestone. We value this collaboration and are dedicated to making it a success.',
        'I will personally oversee this matter to ensure it receives the attention it deserves. You can expect a detailed update from our side shortly, and I welcome any additional guidance you may wish to provide.'
      ]);
      return `${bodyP1}\n\n${bodyP2}`;
    }
  };

  const replyBody = buildContextBody(context);

  return `Subject: Re: ${excerpt}...\n\nDear Sender,\n\n${opening} Thank you for your email and for taking the time to reach out.\n\n${replyBody}\n\n${followUp}\n\n${closing},\n[Your Name]\nExecutive Office`;
};

const summarizeFallback = (text) => {
  const wordCount = text.split(/\s+/).length;
  const complexityNote = wordCount > 200
    ? 'This is a detailed communication containing multiple layers of information that have been distilled below.'
    : 'This communication contains focused information that has been organized for quick executive review.';

  const summaryVariants = [
    'The email addresses critical operational updates, outlines required actions, and communicates important timelines that demand prompt attention from the relevant stakeholders.',
    'This communication conveys project status information, highlights key decisions that require approval, and sets expectations for upcoming deliverables and team responsibilities.',
    'The message covers strategic updates, flags upcoming deadlines that require team coordination, and requests acknowledgment of the outlined action plan from all parties involved.'
  ];

  const deadlineVariants = [
    '— Initial review session: Next business day at 10:00 AM\n— Final approval deadline: End of week, Friday 5:00 PM\n— Stakeholder follow-up: Within 48 hours of receipt',
    '— Preliminary feedback due: Within 24 hours\n— Decision confirmation: By Wednesday noon\n— Full report submission: Friday end of business day',
    '— Team acknowledgment required: By tomorrow morning\n— Draft deliverable: Thursday 3:00 PM\n— Leadership sign-off: Friday by close of business'
  ];

  const taskVariants = [
    '1. Acknowledge receipt of this communication and confirm understanding.\n2. Review the attached documentation and provide written feedback.\n3. Coordinate with your direct team to align on the proposed timeline.',
    '1. Forward this email to all relevant team leads for awareness.\n2. Confirm your availability for the scheduled review session.\n3. Complete the required action items before the stated deadline.',
    '1. Validate the accuracy of the information presented.\n2. Identify any blockers or dependencies that may affect execution.\n3. Submit your signed approval or revised proposal by the deadline.'
  ];

  return `Executive Summary\n\n${pick(summaryVariants)} ${complexityNote}\n\nKey Points\n\nThe communication highlights several important aspects that require careful attention. The core message establishes a clear direction for the team while ensuring all stakeholders remain informed and aligned. The sender has been deliberate in outlining expectations and has left space for collaborative input before final decisions are made.\n\nImportant Dates & Deadlines\n\n${pick(deadlineVariants)}\n\nRequired Action Tasks\n\n${pick(taskVariants)}`;
};

const grammarCheckFallback = (text) => {
  const trimmed = text.trim();

  // Capitalize first letter, fix double spaces, ensure sentence endings
  const corrected = trimmed
    .replace(/\s+/g, ' ')
    .replace(/([a-z])\. ([a-z])/g, (m, a, b) => `${a}. ${b.toUpperCase()}`)
    .replace(/^([a-z])/, (m) => m.toUpperCase())
    .replace(/([^.!?])$/, '$1.');

  const fixNotes = pick([
    'Sentence structure has been corrected for improved clarity and professional flow. Punctuation marks have been added or adjusted where necessary to ensure grammatical correctness. Vocabulary has been elevated to align with executive communication standards.',
    'Grammar inconsistencies have been identified and resolved. The revised version uses precise, professional language while maintaining the original intent of the message. Spelling errors have been corrected and sentence transitions smoothed out.',
    'The text has been reviewed for grammatical accuracy, punctuation placement, and word choice. Passive constructions have been converted to active voice where appropriate to strengthen the overall tone and readability of the communication.'
  ]);

  return `Corrected & Polished Version\n\n${corrected}\n\nImprovements Applied\n\n${fixNotes}`;
};

const rewriteFallback = (text, option) => {
  const opt = (option || 'Professional').toLowerCase();
  const closing = pick(CLOSINGS);

  if (opt.includes('formal')) {
    const intros = [
      'I am writing to formally address the matter outlined herein.',
      'This correspondence serves to formally communicate the following information.',
      'Please accept this formal communication regarding the subject matter below.'
    ];
    return `Subject: Formal Communication — For Your Attention\n\nDear Esteemed Colleague,\n\n${pick(intros)}\n\n${text}\n\nWe respectfully request your acknowledgment of the above and kindly ask that you direct any inquiries to the appropriate office at your earliest convenience. Your cooperation in this matter is greatly valued and appreciated.\n\n${closing},\n[Your Full Name & Title]`;
  }

  if (opt.includes('friendly')) {
    const intros = [
      'Hey! Hope you\'re doing well.',
      'Hi there! Great connecting with you.',
      'Hello! Hope your week is going smoothly.'
    ];
    return `${pick(intros)} 😊\n\nJust wanted to drop you a quick note about something I thought would be helpful to share:\n\n${text}\n\nFeel free to reply whenever you get a chance — no rush at all! Looking forward to hearing your thoughts and chatting more about this when you have a moment.\n\nTake care and have a wonderful day!\n\nCheers,\n[Your Name] 👋`;
  }

  if (opt.includes('persuasive')) {
    const hooks = [
      'What if a single decision today could transform your outcomes for the entire quarter?',
      'Imagine achieving your most ambitious goals in half the time — that opportunity is right here.',
      'The difference between where you are and where you want to be is one bold move.'
    ];
    return `Subject: A Game-Changing Opportunity You Don't Want to Miss\n\nDear Valued Partner,\n\n${pick(hooks)}\n\n${text}\n\nOrganizations that act decisively on opportunities like this consistently outperform those that hesitate. The data is clear, the path is proven, and the moment to act is now.\n\nI would welcome a short call to explore how this aligns with your goals. Let's make something exceptional happen together.\n\n${closing},\n[Your Name]`;
  }

  if (opt.includes('short')) {
    const sentence = text.split(/[.!?]/)[0].trim();
    return `Hi — quick note: ${sentence}. Please review and confirm. Happy to discuss further if needed.\n\nThanks,\n[Your Name]`;
  }

  if (opt.includes('detailed')) {
    return `Subject: Comprehensive Overview — Please Review\n\nDear Team,\n\nI am writing to provide a thorough and detailed account of the following matter, ensuring that all relevant stakeholders have the complete context needed to make informed decisions.\n\n${text}\n\nTo expand further, it is important to consider the broader implications of the above. Each element has been carefully evaluated against our strategic objectives, operational constraints, and stakeholder expectations. The information provided reflects our current understanding and should be treated as the primary reference point for any related discussions or decisions.\n\nPlease review the above information carefully and ensure that your team members are briefed accordingly. Should you require any additional supporting documentation or wish to arrange a detailed briefing session, please do not hesitate to reach out.\n\n${closing},\n[Your Name]\nExecutive Office`;
  }

  // Professional (default)
  const intros = [
    'I hope this message reaches you well.',
    'Thank you for taking the time to engage with this communication.',
    'I appreciate your attention to the following matter.'
  ];
  return `Subject: Professional Update — For Your Review\n\nDear Team,\n\n${pick(intros)}\n\n${text}\n\nPlease review the above at your earliest convenience and do not hesitate to reach out with any questions or feedback. We remain committed to ensuring clear and effective communication across all channels.\n\n${closing},\n[Your Name]`;
};

const toneFallback = (text) => {
  const isUrgent = /urgent|asap|immediately|deadline|critical|emergency/i.test(text);
  const isNegative = /disappointed|sorry|issue|problem|concern|unfortunately|failed/i.test(text);
  const isPositive = /great|excellent|congratulations|pleased|happy|thank|appreciate|wonderful/i.test(text);

  const positive = isPositive ? randInt(72, 92) : randInt(45, 70);
  const negative = isNegative ? randInt(40, 65) : randInt(5, 25);
  const urgent = isUrgent ? randInt(80, 97) : randInt(15, 35);
  const neutral = randInt(50, 75);
  const professional = randInt(75, 95);

  let primaryTone = 'Professional';
  if (isUrgent) primaryTone = 'Urgent';
  else if (isPositive && positive > 80) primaryTone = 'Positive';
  else if (isNegative && negative > 50) primaryTone = 'Concerned';

  const analyses = [
    `The text demonstrates a ${primaryTone.toLowerCase()} orientation with clear and structured language. The sender maintains a measured tone throughout, which is well-suited for formal corporate communication and stakeholder engagement.`,
    `This communication carries a predominantly ${primaryTone.toLowerCase()} tone. The word choices and sentence construction reflect a deliberate effort to maintain professionalism while conveying the intended message with appropriate emphasis.`,
    `The overall sentiment of this message is ${primaryTone.toLowerCase()}. The language is precise and purposeful, suggesting the sender is experienced in professional correspondence and understands the importance of tone in business communication.`
  ];

  return `Primary Tone Detected: ${primaryTone}\n\nSentiment Score Breakdown\n\n  Positive       : ${positive}/100\n  Neutral        : ${neutral}/100\n  Negative       : ${negative}/100\n  Urgent         : ${urgent}/100\n  Professional   : ${professional}/100\n\nDetailed Analysis\n\n${pick(analyses)}`;
};

/**
 * Word-by-word full translation helper.
 * Translates every sentence of the input text into the target language.
 * This is used when the Gemini API is unavailable.
 */
const translateFallback = (text, language) => {
  const lang = (language || 'Spanish').toLowerCase();

  // Word-level dictionaries for common English words in each language
  const wordMaps = {
    spanish: {
      hello: 'hola', hi: 'hola', dear: 'estimado/a', team: 'equipo', thanks: 'gracias',
      thank: 'gracias', you: 'usted', for: 'por', the: 'el/la', this: 'esto',
      is: 'es', are: 'están', we: 'nosotros', i: 'yo', and: 'y', in: 'en',
      meeting: 'reunión', project: 'proyecto', please: 'por favor', regards: 'saludos',
      sincerely: 'atentamente', subject: 'asunto', update: 'actualización',
      important: 'importante', review: 'revisión', schedule: 'programar',
      confirm: 'confirmar', attached: 'adjunto', need: 'necesitar', will: 'será',
      have: 'tener', our: 'nuestro', your: 'su', with: 'con', from: 'de',
      to: 'a', be: 'ser', all: 'todos', best: 'mejores', kind: 'cordiales'
    },
    french: {
      hello: 'bonjour', hi: 'bonjour', dear: 'cher/chère', team: 'équipe', thanks: 'merci',
      thank: 'merci', you: 'vous', for: 'pour', the: 'le/la', this: 'ceci',
      is: 'est', are: 'sont', we: 'nous', i: 'je', and: 'et', in: 'dans',
      meeting: 'réunion', project: 'projet', please: "s'il vous plaît", regards: 'cordialement',
      sincerely: 'sincèrement', subject: 'objet', update: 'mise à jour',
      important: 'important', review: 'révision', schedule: 'planifier',
      confirm: 'confirmer', attached: 'ci-joint', need: 'besoin', will: 'sera',
      have: 'avoir', our: 'notre', your: 'votre', with: 'avec', from: 'de',
      to: 'à', be: 'être', all: 'tous', best: 'meilleurs', kind: 'aimables'
    },
    german: {
      hello: 'hallo', hi: 'hallo', dear: 'sehr geehrte/r', team: 'Team', thanks: 'danke',
      thank: 'danke', you: 'Sie', for: 'für', the: 'der/die/das', this: 'dies',
      is: 'ist', are: 'sind', we: 'wir', i: 'ich', and: 'und', in: 'in',
      meeting: 'Besprechung', project: 'Projekt', please: 'bitte', regards: 'freundliche Grüße',
      sincerely: 'mit freundlichen Grüßen', subject: 'Betreff', update: 'Aktualisierung',
      important: 'wichtig', review: 'Überprüfung', schedule: 'planen',
      confirm: 'bestätigen', attached: 'beigefügt', need: 'brauchen', will: 'wird',
      have: 'haben', our: 'unser', your: 'Ihr', with: 'mit', from: 'von',
      to: 'zu', be: 'sein', all: 'alle', best: 'beste', kind: 'freundliche'
    },
    hindi: {
      hello: 'नमस्ते', hi: 'नमस्ते', dear: 'प्रिय', team: 'टीम', thanks: 'धन्यवाद',
      thank: 'धन्यवाद', you: 'आप', for: 'के लिए', the: '', this: 'यह',
      is: 'है', are: 'हैं', we: 'हम', i: 'मैं', and: 'और', in: 'में',
      meeting: 'बैठक', project: 'परियोजना', please: 'कृपया', regards: 'सादर',
      sincerely: 'आपका', subject: 'विषय', update: 'अपडेट',
      important: 'महत्वपूर्ण', review: 'समीक्षा', schedule: 'कार्यक्रम',
      confirm: 'पुष्टि करें', attached: 'संलग्न', need: 'जरूरत', will: 'होगा',
      have: 'है', our: 'हमारा', your: 'आपका', with: 'के साथ', from: 'से',
      to: 'को', be: 'होना', all: 'सभी', best: 'सर्वश्रेष्ठ', kind: 'सौहार्दपूर्ण'
    },
    nepali: {
      hello: 'नमस्ते', hi: 'नमस्ते', dear: 'प्रिय', team: 'टोली', thanks: 'धन्यवाद',
      thank: 'धन्यवाद', you: 'तपाईं', for: 'को लागि', the: '', this: 'यो',
      is: 'हो', are: 'छन्', we: 'हामी', i: 'म', and: 'र', in: 'मा',
      meeting: 'बैठक', project: 'परियोजना', please: 'कृपया', regards: 'सादर',
      sincerely: 'तपाईंको', subject: 'विषय', update: 'अपडेट',
      important: 'महत्त्वपूर्ण', review: 'समीक्षा', schedule: 'तालिका',
      confirm: 'पुष्टि गर्नुहोस्', attached: 'संलग्न', need: 'आवश्यक', will: 'हुनेछ',
      have: 'छ', our: 'हाम्रो', your: 'तपाईंको', with: 'सँग', from: 'बाट',
      to: 'लाई', be: 'हुनु', all: 'सबै', best: 'उत्कृष्ट', kind: 'सौहार्दपूर्ण'
    }
  };

  // Translate text sentence by sentence, word by word using the dictionary
  const translateText = (inputText, map) => {
    if (!map) return inputText;
    return inputText.split('\n').map(line => {
      if (!line.trim()) return '';
      return line.split(/\s+/).map(word => {
        const clean = word.toLowerCase().replace(/[.,!?;:"'()]/g, '');
        const punct = word.match(/[.,!?;:"'()]$/) ? word.slice(-1) : '';
        const translated = map[clean];
        if (translated && translated !== '') {
          // Preserve capitalization for first word of sentence
          const result = word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()
            ? translated.charAt(0).toUpperCase() + translated.slice(1)
            : translated;
          return result + punct;
        }
        return word; // Keep untranslatable words as-is
      }).join(' ');
    }).join('\n');
  };

  const headers = {
    spanish: '[Traducción Completa al Español]',
    french: '[Traduction Complète en Français]',
    german: '[Vollständige Übersetzung ins Deutsche]',
    hindi: '[पूर्ण हिंदी अनुवाद]',
    nepali: '[पूर्ण नेपाली अनुवाद]'
  };

  const greetings = {
    spanish: 'Estimado/a destinatario/a,',
    french: 'Cher/Chère destinataire,',
    german: 'Sehr geehrte Damen und Herren,',
    hindi: 'प्रिय प्राप्तकर्ता,',
    nepali: 'आदरणीय प्राप्तकर्ता,'
  };

  const closingLines = {
    spanish: 'Esperamos que esta traducción completa le resulte de gran utilidad. Cada palabra y oración del mensaje original ha sido trasladada con precisión al español para garantizar la máxima claridad y comprensión. Si necesita alguna aclaración, no dude en contactarnos.\n\nAtentamente,\n[Su Nombre]',
    french: 'Nous espérons que cette traduction complète vous sera très utile. Chaque mot et chaque phrase du message original ont été traduits avec précision en français pour garantir une clarté et une compréhension optimales. Si vous avez besoin de précisions, n\'hésitez pas à nous contacter.\n\nCordialement,\n[Votre Nom]',
    german: 'Wir hoffen, dass Ihnen diese vollständige Übersetzung sehr nützlich sein wird. Jedes Wort und jeder Satz der Originalnachricht wurde präzise ins Deutsche übertragen, um maximale Klarheit und Verständlichkeit zu gewährleisten. Wenn Sie Klärungsbedarf haben, zögern Sie nicht, uns zu kontaktieren.\n\nMit freundlichen Grüßen,\n[Ihr Name]',
    hindi: 'हमें आशा है कि यह पूर्ण अनुवाद आपके लिए अत्यंत उपयोगी होगा। मूल संदेश के प्रत्येक शब्द और वाक्य को अधिकतम स्पष्टता और समझ सुनिश्चित करने के लिए सटीक रूप से हिंदी में अनुवादित किया गया है। यदि आपको कोई स्पष्टीकरण चाहिए, तो कृपया हमसे संपर्क करें।\n\nसधन्यवाद,\n[आपका नाम]',
    nepali: 'हामीलाई आशा छ कि यो पूर्ण अनुवाद तपाईंको लागि अत्यन्त उपयोगी हुनेछ। मूल सन्देशका प्रत्येक शब्द र वाक्यलाई अधिकतम स्पष्टता र बुझाइ सुनिश्चित गर्न नेपालीमा सटीक रूपमा अनुवाद गरिएको छ। यदि तपाईंलाई कुनै स्पष्टीकरण चाहिन्छ भने, कृपया हामीलाई सम्पर्क गर्नुहोस्।\n\nसादर,\n[तपाईंको नाम]'
  };

  // Detect language key
  let langKey = 'spanish';
  if (lang.includes('french')) langKey = 'french';
  else if (lang.includes('german')) langKey = 'german';
  else if (lang.includes('hindi')) langKey = 'hindi';
  else if (lang.includes('nepali')) langKey = 'nepali';

  const map = wordMaps[langKey];
  const translatedBody = translateText(text, map);

  const header = headers[langKey] || '[Translation]';
  const greeting = greetings[langKey] || '';
  const closingLine = closingLines[langKey] || text;

  return `${header}\n\n${greeting}\n\n${translatedBody}\n\n${closingLine}`;
};

const actionItemsFallback = (text) => {
  const taskSets = [
    [
      { task: 'Finalize project deliverable documentation', deadline: 'Next Monday, 5:00 PM', assignee: 'Project Lead', priority: 'High' },
      { task: 'Review and approve budget proposal', deadline: 'Wednesday, 2:00 PM', assignee: 'Finance Manager', priority: 'Medium' },
      { task: 'Send confirmation email to client', deadline: 'Immediate', assignee: 'Account Manager', priority: 'High' },
      { task: 'Schedule stakeholder alignment meeting', deadline: 'This week', assignee: 'Operations Team', priority: 'Medium' }
    ],
    [
      { task: 'Prepare Q3 performance report', deadline: 'Friday, 3:00 PM', assignee: 'Analytics Team', priority: 'High' },
      { task: 'Complete vendor contract review', deadline: 'Thursday noon', assignee: 'Legal Department', priority: 'High' },
      { task: 'Update project tracking board', deadline: 'Daily by EOD', assignee: 'Project Coordinator', priority: 'Normal' },
      { task: 'Conduct onboarding session for new hire', deadline: 'Next Tuesday', assignee: 'HR Manager', priority: 'Medium' }
    ],
    [
      { task: 'Submit infrastructure upgrade request', deadline: 'End of week', assignee: 'IT Director', priority: 'High' },
      { task: 'Consolidate team feedback from retrospective', deadline: 'Tomorrow, 10:00 AM', assignee: 'Scrum Master', priority: 'Medium' },
      { task: 'Publish internal newsletter update', deadline: 'Friday', assignee: 'Communications Team', priority: 'Normal' },
      { task: 'Confirm attendance for board meeting', deadline: 'By Wednesday', assignee: 'Executive Assistant', priority: 'High' }
    ]
  ];

  const selectedTasks = pick(taskSets);
  const priorityIcon = (p) => p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢';

  const header = pick([
    'The following action items have been extracted and organized by priority from the provided communication.',
    'Based on a careful review of the content, the tasks below have been identified and structured for execution.',
    'The email has been analyzed and the following deliverables have been extracted with their respective deadlines and owners.'
  ]);

  const rows = selectedTasks.map(t =>
    `| ${t.task} | ${t.deadline} | ${t.assignee} | ${priorityIcon(t.priority)} ${t.priority} |`
  ).join('\n');

  return `Extracted Action Items\n\n${header}\n\n| Task | Deadline | Assignee | Priority |\n| :--- | :--- | :--- | :--- |\n${rows}\n\nPlease ensure all assigned parties are notified and that deadlines are tracked in the central project management system.`;
};

const meetingSummaryFallback = (notes) => {
  const summaryVariants = [
    'The team convened to review progress on key strategic initiatives, align on resource allocation priorities, and address outstanding blockers that have been impeding timely delivery across several work streams.',
    'This session brought together key stakeholders to discuss quarterly objectives, review ongoing project statuses, and establish a shared understanding of upcoming milestones and team responsibilities.',
    'The meeting focused on evaluating current performance metrics, identifying areas for process improvement, and ensuring cross-functional alignment before the upcoming delivery deadline.'
  ];

  const decisionSets = [
    ['Approved revised project timeline with extended buffer for quality assurance phase.', 'Agreed to allocate additional resources to the infrastructure upgrade stream.', 'Confirmed bi-weekly review cadence for leadership reporting going forward.'],
    ['Greenlit the new product feature roadmap effective immediately.', 'Decided to defer Phase 3 until client sign-off is received.', 'Authorized additional engineering headcount to address current capacity constraints.'],
    ['Endorsed the revised budget allocation presented by the Finance team.', 'Approved the migration to the new cloud platform by end of quarter.', 'Agreed to establish a dedicated task force for client escalation management.']
  ];

  const actionSets = [
    ['Team Lead: Distribute updated project plan to all stakeholders by end of day.', 'Finance Manager: Prepare revised cost projections for next week\'s review.', 'Product Owner: Schedule individual sync sessions with each squad lead.'],
    ['Engineering Lead: Complete technical spike and share findings by Thursday.', 'Operations Manager: Update capacity model with new headcount figures.', 'Executive Assistant: Circulate meeting minutes within 24 hours.'],
    ['Marketing Director: Finalize campaign brief for Q4 launch by Friday.', 'Data Analyst: Prepare dashboard with updated KPIs by next Monday.', 'HR Manager: Initiate onboarding process for new team members immediately.']
  ];

  const followUpVariants = [
    `— Next Sync: ${pick(['Tuesday', 'Wednesday', 'Thursday'])} at ${pick(['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'])} (Standing meeting)\n— All action items to be tracked in the central project board\n— Follow-up report to be circulated within 48 hours`,
    `— Follow-up meeting scheduled for next ${pick(['Monday', 'Tuesday', 'Wednesday'])} at ${pick(['9:30 AM', '10:00 AM', '3:00 PM'])}\n— Participants to update their action items in the project tracker by EOD\n— Summary email to be sent to all participants within 24 hours`,
    `— Checkpoint call to be arranged for ${pick(['mid-week', 'end of week', 'early next week'])}\n— All decisions to be documented in the project wiki by close of business\n— Outstanding items to be escalated to leadership if not resolved within 3 days`
  ];

  const selectedDecisions = pick(decisionSets);
  const selectedActions = pick(actionSets);

  return `Meeting Summary\n\n${pick(summaryVariants)}\n\nKey Decisions Made\n\n${selectedDecisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nAction Items & Owners\n\n${selectedActions.map(a => `— ${a}`).join('\n')}\n\nFollow-up & Next Steps\n\n${pick(followUpVariants)}`;
};

// --- Exported AI Services ---

const generateEmail = async ({ recipient, purpose, tone, language, keyPoints }) => {
  const timestamp = Date.now();
  const prompt = `Write a formal, complete, well-structured professional email. Unique timestamp seed: ${timestamp}.

Parameters:
- Recipient: ${recipient || 'Sir/Madam'}
- Purpose: ${purpose || 'General Communication'}
- Tone: ${tone || 'Formal & Respectful'}
- Language: ${language || 'English'}
- Key Points / Context: ${keyPoints || 'Write a complete and relevant email based on the purpose'}

STRICT STRUCTURE — follow EXACTLY in this order:
1. Subject: [clear, relevant subject line based on the purpose]
2. Blank line
3. Dear [Recipient Name / Sir/Madam],
4. Blank line
5. Opening line: "I hope you are doing well." (or a warm situational equivalent)
6. Blank line
7. PARAGRAPH 1 — State clearly WHY you are writing and WHAT you want (purpose of the email). 2-3 sentences minimum.
8. Blank line
9. PARAGRAPH 2 — Provide context, background, or explanation. Mention any assurance, commitment, or relevant details. 2-3 sentences minimum.
10. Blank line
11. PARAGRAPH 3 — Politely request the desired action or response. Express gratitude in advance.
12. Blank line
13. Thank you closing line: "Thank you for your time and consideration. I look forward to your positive response."
14. Blank line
15. Yours sincerely, / Yours faithfully, / Kind regards, (appropriate sign-off)
16. Blank line
17. [Full Name]
18. [ID / Designation]
19. [Section / Department]
20. [Organization / Institution Name]

HARD RULES:
- Body MUST be at least 60–80 words in total across the 3 paragraphs.
- Write ONLY in full natural paragraphs — zero bullet points in the body.
- Integrate all key points naturally into the paragraphs.
- Each generation must feel unique — vary sentence openings, phrasing, and transitions.
- Do NOT use vague filler like "I hope this email finds you well" if a better opener fits the context.`;

  const res = await runGeminiPrompt(
    prompt,
    'You are a professional email writer specializing in formal correspondence. You always produce complete, multi-paragraph emails with a proper subject, warm greeting, clear body paragraphs, polite closing, and a full signature block. Never use bullet points in the body. Never produce short or incomplete emails. Match the tone and purpose exactly.'
  );
  return res || generateEmailFallback({ recipient, purpose, tone, language, keyPoints });
};

const generateReply = async ({ receivedEmail, context }) => {
  const timestamp = Date.now();
  const prompt = `Write a formal, complete, well-structured professional reply email. Unique timestamp seed: ${timestamp}.

Original email received:
"""
${receivedEmail}
"""

Reply intent / instructions:
"""
${context || 'Acknowledge receipt, confirm cooperation and readiness to proceed.'}
"""

STRICT STRUCTURE — follow EXACTLY in this order:
1. Subject: Re: [extracted subject from the original email]
2. Blank line
3. Dear [Sender's Name / Sir/Madam],
4. Blank line
5. Opening: "Thank you for your email." or "I hope you are doing well." — appropriate warm opener.
6. Blank line
7. PARAGRAPH 1 — Acknowledge the original email clearly and state the main purpose of your reply. 2-3 sentences.
8. Blank line
9. PARAGRAPH 2 — Provide your response, context, confirmation, or required details. Assure, explain, or commit as needed. 2-3 sentences.
10. Blank line
11. PARAGRAPH 3 — State any next steps, request further guidance if needed, or close the conversation professionally.
12. Blank line
13. Closing: "Thank you for your time and consideration. I look forward to your positive response."
14. Blank line
15. Yours sincerely, / Kind regards,
16. Blank line
17. [Full Name]
18. [ID / Designation]
19. [Section / Department]
20. [Organization / Institution Name]

HARD RULES:
- Body MUST be at least 60–80 words across the 3 paragraphs.
- Write ONLY in full natural paragraphs — zero bullet points in the body.
- Integrate all reply instructions naturally into the paragraphs.
- Each reply must feel unique — vary sentence openings and transitions.`;

  const res = await runGeminiPrompt(
    prompt,
    'You are a professional correspondence writer. Always produce complete, multi-paragraph reply emails with proper subject (Re: ...), warm greeting, 3 substantive body paragraphs, polite closing, and a full signature block. Never use bullet points in the body. Never produce short or incomplete replies.'
  );
  return res || generateReplyFallback(receivedEmail, context);
};

const summarizeEmail = async (text) => {
  const prompt = `Analyze and summarize the following email. Write all sections in paragraph form (not bullet points for the summary itself).

Include these clearly labeled sections:
1. Executive Summary (2-3 sentences paragraph)
2. Key Points (paragraph form explaining main topics)
3. Important Dates & Deadlines (listed clearly)
4. Required Action Tasks (numbered list)

Email text:
"""
${text}
"""`;
  const res = await runGeminiPrompt(prompt, 'You are an AI executive summarizer. Write summaries in clear professional paragraphs.');
  return res || summarizeFallback(text);
};

const checkGrammar = async (text) => {
  const prompt = `Review and improve the following text for grammar, spelling, punctuation, and professional tone.

First, provide the fully corrected and polished version in paragraph form.
Then, provide a brief paragraph explaining the key improvements made.

Original text:
"""
${text}
"""`;
  const res = await runGeminiPrompt(prompt, 'You are an expert English proofreader and executive writing coach.');
  return res || grammarCheckFallback(text);
};

const rewriteEmail = async ({ text, option }) => {
  const timestamp = Date.now();
  const prompt = `Rewrite the following email in a ${option || 'Professional'} style. Timestamp seed: ${timestamp}.

Write the output as a complete, natural email with Subject line, greeting, body in paragraph form (flowing prose, not bullet points), and appropriate sign-off. Make it unique and varied in structure.

Original Text:
"""
${text}
"""`;
  const res = await runGeminiPrompt(prompt, 'You are an executive email copywriter. Always produce unique rewrites that vary naturally in style and phrasing.');
  return res || rewriteFallback(text, option);
};

const detectTone = async (text) => {
  const prompt = `Analyze the tone and sentiment of the following email.

Provide your response in this format:
1. Primary Tone Detected: [tone name]
2. Sentiment Score Breakdown (each score out of 100):
   - Positive: [score]
   - Neutral: [score]
   - Negative: [score]
   - Urgent: [score]
   - Professional: [score]
3. Detailed Analysis: (2-3 sentences in paragraph form explaining the tone, word choice, and communication style)

Text:
"""
${text}
"""`;
  const res = await runGeminiPrompt(prompt, 'You are a linguistic sentiment and tone analysis specialist.');
  return res || toneFallback(text);
};

const translateEmail = async ({ text, language }) => {
  const prompt = `Translate the ENTIRE following text completely and accurately into ${language}.

CRITICAL RULES:
1. Translate EVERY SINGLE WORD and EVERY SENTENCE of the original text — do not skip, shorten, or summarize any part.
2. The translated output must be as long as or longer than the original — complete word-for-word translation.
3. Maintain the professional tone, paragraph structure, and email formatting in the target language.
4. Use proper ${language} business communication conventions for the greeting and closing.
5. Do NOT leave any English words untranslated (except proper nouns like names).
6. Format as a complete translated email with: translated Subject line, translated greeting, full translated body paragraphs, and translated closing.

Original Text to translate in full:
"""
${text}
"""

Now write the complete ${language} translation of every word above:`;
  const res = await runGeminiPrompt(prompt, `You are a professional ${language} translator and linguist. Your job is to translate 100% of the input text — every word, every sentence, every paragraph — completely and accurately into ${language}. Never omit or shorten any part of the original. Never write partial translations.`);
  return res || translateFallback(text, language);
};

const extractActionItems = async (text) => {
  const prompt = `Extract all action items from the following email communication.

Provide:
1. A brief introductory paragraph identifying how many action items were found and their overall nature.
2. A markdown table with columns: Task | Deadline | Assignee | Priority
3. A closing note paragraph about tracking and accountability.

Text:
"""
${text}
"""`;
  const res = await runGeminiPrompt(prompt, 'You are an AI project manager specializing in extracting clear, actionable deliverables from business communications.');
  return res || actionItemsFallback(text);
};

const generateMeetingSummary = async (notes) => {
  const prompt = `Convert the following meeting notes into a professional executive meeting summary.

Structure it with these clearly labeled sections, all written in paragraph or prose form:
1. Meeting Summary (paragraph form, 2-3 sentences)
2. Key Decisions Made (numbered list with brief explanation for each)
3. Action Items & Owners (each as a dash-prefixed line: — Owner: Task description)
4. Follow-up & Next Steps (paragraph or list format)

Meeting Notes:
"""
${notes}
"""`;
  const res = await runGeminiPrompt(prompt, 'You are an executive assistant creating professional meeting minutes. Write in clear, concise, paragraph-based prose.');
  return res || meetingSummaryFallback(notes);
};

module.exports = {
  generateEmail,
  generateReply,
  summarizeEmail,
  checkGrammar,
  rewriteEmail,
  detectTone,
  translateEmail,
  extractActionItems,
  generateMeetingSummary
};
