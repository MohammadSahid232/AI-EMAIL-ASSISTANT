import React, { useState } from 'react';
import { Users, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const MeetingSummaryPage = () => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.generateMeetingSummary({ notes });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast('Meeting summary generated!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Meeting summary generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Meeting Summary Generator" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meeting Minutes & Summary Studio</h2>
              <p className="text-xs text-slate-500">Turn raw meeting transcripts & notes into executive decisions and follow-ups</p>
            </div>
          </div>

          <form onSubmit={handleGenerateSummary} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Raw Meeting Notes / Transcript
              </label>
              <textarea
                rows={8}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste raw meeting notes, audio transcripts, or discussion points here..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Processing Minutes...' : 'Generate Executive Meeting Minutes'}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title="Executive Meeting Minutes" result={result} type="meeting-summary" />}
      </div>
    </div>
  );
};
