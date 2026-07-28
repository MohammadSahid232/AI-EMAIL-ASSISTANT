import React, { useState } from 'react';
import { Gauge, Sparkles, Activity } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const ToneDetectorPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleDetectTone = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.detectTone({ text });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Tone analysis completed!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Tone detection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Tone Detection" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Email Tone & Sentiment Analyzer</h2>
              <p className="text-xs text-slate-500">Analyze Positive, Neutral, Negative, Urgent, and Professional scores</p>
            </div>
          </div>

          <form onSubmit={handleDetectTone} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Content to Analyze
              </label>
              <textarea
                rows={6}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the email here to detect underlying sentiment and tone profile..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Sentiment...' : 'Analyze Tone Profile'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Tone Sentiment Breakdown" result={result} type="tone" />}
      </div>
    </div>
  );
};
