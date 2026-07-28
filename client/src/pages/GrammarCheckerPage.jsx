import React, { useState } from 'react';
import { CheckCheck, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const GrammarCheckerPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleCheckGrammar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.checkGrammar({ text });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Grammar check completed!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Grammar check failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Grammar & Spell Checker" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grammar, Spelling & Wording Refiner</h2>
              <p className="text-xs text-slate-500">Polish your text to remove errors and improve executive tone</p>
            </div>
          </div>

          <form onSubmit={handleCheckGrammar} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Input Text Draft
              </label>
              <textarea
                rows={6}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type text to check grammar and wording..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Reviewing Syntax...' : 'Check & Polish Grammar'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Polished Executive Text & Fixes" result={result} type="grammar" />}
      </div>
    </div>
  );
};
