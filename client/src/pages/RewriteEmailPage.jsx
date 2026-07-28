import React, { useState } from 'react';
import { RefreshCw, Sparkles, Sliders } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const RewriteEmailPage = () => {
  const [text, setText] = useState('');
  const [option, setOption] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const options = ['Formal', 'Friendly', 'Persuasive', 'Professional', 'Short', 'Detailed'];

  const handleRewrite = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.rewriteEmail({ text, option });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast(`Email rewritten in ${option} style!`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Rewrite failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Rewrite Email" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multi-Style Email Rewriter</h2>
              <p className="text-xs text-slate-500">Change tone, length, or persuasion angle effortlessly</p>
            </div>
          </div>

          <form onSubmit={handleRewrite} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Target Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setOption(opt)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                      option === opt
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Original Draft
              </label>
              <textarea
                rows={6}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the email content you want to transform..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Rewriting Content...' : `Rewrite in ${option} Style`}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title={`Rewritten Version (${option})`} result={result} type="rewrite" />}
      </div>
    </div>
  );
};
