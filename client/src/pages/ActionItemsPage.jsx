import React, { useState } from 'react';
import { ListTodo, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const ActionItemsPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleExtract = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.extractActionItems({ text });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Action items extracted successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Extraction failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Action Item Extraction" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Extract Tasks & Deliverables</h2>
              <p className="text-xs text-slate-500">Extract tasks, deadlines, assignees, and priorities into a structured grid</p>
            </div>
          </div>

          <form onSubmit={handleExtract} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email / Communication Transcript
              </label>
              <textarea
                rows={6}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the email thread or project message to parse action deliverables..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Parsing Action Items...' : 'Extract Action Items & Priorities'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Extracted Action Items Matrix" result={result} type="action-items" />}
      </div>
    </div>
  );
};
