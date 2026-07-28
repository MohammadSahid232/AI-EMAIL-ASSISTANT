import React, { useState } from 'react';
import { Send, Sparkles, User, Target, MessageSquare, Globe, List } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const GenerateEmailPage = () => {
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.generateEmail({ recipient, purpose, tone, language, keyPoints });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Email generated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Email Generator" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Generate Executive Email</h2>
              <p className="text-xs text-slate-500">Specify parameters and let Gemini AI draft your message</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Recipient
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. Board Members, Client, HR Manager"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Purpose / Subject Area
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Q3 Roadmap Review & Budget Request"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tone
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Formal">Formal</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Language
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Nepali">Nepali</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Key Points (One per line)
              </label>
              <textarea
                rows={4}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="• Deliverables completed on time&#10;• Need signoff by Friday&#10;• Attached revised quote"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Generating Email...' : 'Generate Email'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Generated Email Draft" result={result} type="generate-email" />}
      </div>
    </div>
  );
};
