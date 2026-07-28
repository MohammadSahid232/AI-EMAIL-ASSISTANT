import React, { useState } from 'react';
import { Languages, Sparkles, Globe2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { ResultViewer } from '../components/ai/ResultViewer';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';

export const TranslatorPage = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const { addToast } = useToast();

  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Nepali'];

  const handleTranslate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await aiService.translateEmail({ text, language });
      if (res.data.success) {
        setResult(res.data.generatedText);
        addToast(`Email translated to ${language}!`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Translation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Email Translator" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multilingual Email Translator</h2>
              <p className="text-xs text-slate-500">Accurately translate emails preserving professional etiquette</p>
            </div>
          </div>

          <form onSubmit={handleTranslate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Target Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500/50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Original Text
              </label>
              <textarea
                rows={6}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste original email to translate..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Translating Text...' : `Translate to ${language}`}</span>
            </button>
          </form>
        </GlassCard>

        {result && <ResultViewer title={`Translation (${language})`} result={result} type="translate" />}
      </div>
    </div>
  );
};
