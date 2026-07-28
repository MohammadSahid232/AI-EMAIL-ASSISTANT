import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const SummarizerPage = () => {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleSummarize = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.summarizeEmail({ emailText });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Email summarized successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Summarization failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Email Summarizer" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Summarize Email / Thread</h2>
              <p className="text-xs text-slate-500">Extract executive summary, key points, deadlines & tasks</p>
            </div>
          </div>

          <form onSubmit={handleSummarize} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Paste Long Email Content
              </label>
              <textarea
                rows={8}
                required
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the full email body or multi-reply thread here..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing Content...' : 'Summarize Email'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Executive Summary & Analysis" result={result} type="summarize" />}
      </div>
    </div>
  );
};
