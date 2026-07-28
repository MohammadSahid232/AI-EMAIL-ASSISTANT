import React, { useState } from 'react';
import { Reply, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const ReplyGeneratorPage = () => {
  const [receivedEmail, setReceivedEmail] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleGenerateReply = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.generateReply({ receivedEmail, context });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Reply generated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to generate reply', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Reply Generator" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Reply className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Generate Smart Reply</h2>
              <p className="text-xs text-slate-500">Paste incoming email and specify response intent</p>
            </div>
          </div>

          <form onSubmit={handleGenerateReply} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Received Email Text
              </label>
              <textarea
                rows={5}
                required
                value={receivedEmail}
                onChange={(e) => setReceivedEmail(e.target.value)}
                placeholder="Paste the email you received here..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Response Intent / Key Directions
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Accept proposal, propose meeting for Tuesday 2 PM, politely decline discount request"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Crafting Reply...' : 'Generate Smart Reply'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Smart Reply Draft" result={result} type="reply" />}
      </div>
    </div>
  );
};
