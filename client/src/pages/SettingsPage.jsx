import React, { useState } from 'react';
import { Settings, Key, Sliders, Moon, Sun, ShieldCheck } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini');
  const { addToast } = useToast();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Preferences saved successfully!', 'success');
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Platform Settings" />

      <div className="px-6 max-w-3xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Provider & Display Preferences</h2>
              <p className="text-xs text-slate-500">Configure AI model engine and theme preferences</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Theme Toggle option */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Appearance Theme</h4>
                <p className="text-xs text-slate-500">Switch between dark executive mode and light mode</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span className="capitalize">{theme} Theme</span>
              </button>
            </div>

            {/* AI Engine Switch */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider">AI Engine Provider</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAiProvider('gemini')}
                  className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    aiProvider === 'gemini'
                      ? 'border-brand-500 bg-brand-500/10 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-brand-500 text-white font-bold text-xs">G</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Gemini API (Default)</h5>
                    <p className="text-[10px] text-slate-500">Google Gemini 1.5 Flash</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAiProvider('openai')}
                  className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    aiProvider === 'openai'
                      ? 'border-brand-500 bg-brand-500/10 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold text-xs">O</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">OpenAI API (Plug-and-play)</h5>
                    <p className="text-[10px] text-slate-500">GPT-4o Integration</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Custom API Key Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Custom API Key (Optional)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your Gemini or OpenAI API Key..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Leave blank to use global environment key or resilient engine mode.
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md"
            >
              Save Settings
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
