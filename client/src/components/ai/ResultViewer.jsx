import React, { useState } from 'react';
import { Copy, Check, BookmarkPlus, Download, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { templateService } from '../../services/templateService';

/**
 * Renders AI result with smart paragraph formatting.
 * Handles Subject lines, section headers, bullet points,
 * table rows, and blank-line-separated paragraphs.
 */
const FormattedResult = ({ text }) => {
  const lines = text.split('\n');

  const renderLine = (line, idx) => {
    const trimmed = line.trim();

    // Blank line → spacer
    if (!trimmed) return <div key={idx} className="h-3" />;

    // Table row: | col | col |
    if (trimmed.startsWith('|')) {
      const cells = trimmed.split('|').filter((c) => c.trim() !== '').map(c => c.trim());
      const isDivider = cells.every(c => /^[-: ]+$/.test(c));
      if (isDivider) return null;
      const isHeader = idx > 0 && lines[idx - 1]?.trim().startsWith('|') === false;
      return (
        <div key={idx} className={`flex gap-2 text-xs font-mono py-1.5 ${idx === lines.findIndex(l => l.trim().startsWith('|')) ? 'font-bold text-brand-500 dark:text-brand-400 border-b border-slate-200 dark:border-slate-800 pb-2' : 'border-b border-slate-100 dark:border-slate-900/60'}`}>
          {cells.map((cell, ci) => (
            <div key={ci} className="flex-1 min-w-0 truncate">{cell}</div>
          ))}
        </div>
      );
    }

    // Subject line
    if (/^(Subject|Asunto|Betreff|Objet|विषय|Subject):/i.test(trimmed)) {
      const parts = trimmed.split(':');
      const label = parts.shift();
      const value = parts.join(':').trim();
      return (
        <div key={idx} className="flex items-start gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400 mt-0.5 shrink-0">{label}:</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</span>
        </div>
      );
    }

    // Section headers (###, ##, plain CAPS heading-like lines)
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#{1,3}\s*/, '');
      return (
        <div key={idx} className="mt-4 mb-1.5 text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200/70 dark:border-slate-800/70 pb-1">
          {headingText}
        </div>
      );
    }

    // Bold section label (line ends with \n or is standalone capitalized word group like "Executive Summary")
    if (/^[A-Z][A-Za-z &]+$/.test(trimmed) && trimmed.length < 50 && !trimmed.includes('.')) {
      return (
        <div key={idx} className="mt-4 mb-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {trimmed}
        </div>
      );
    }

    // Numbered list item: 1. text  or  1) text
    if (/^\d+[.)]\s/.test(trimmed)) {
      const [num, ...rest] = trimmed.split(/(?<=^\d+[.)])\s/);
      return (
        <div key={idx} className="flex items-start gap-2.5 py-0.5">
          <span className="text-xs font-bold text-brand-500 dark:text-brand-400 mt-0.5 shrink-0 w-5">{num}</span>
          <span className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{rest.join(' ')}</span>
        </div>
      );
    }

    // Bullet points: —, •, -, * with text
    if (/^[—\-•*]\s/.test(trimmed) || /^\[ \]/.test(trimmed) || /^\[x\]/.test(trimmed)) {
      const bulletText = trimmed.replace(/^[—\-•*\[\] x]\s*/,'');
      const isDone = trimmed.startsWith('[x]');
      return (
        <div key={idx} className="flex items-start gap-2 py-0.5">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isDone ? 'bg-emerald-500' : 'bg-brand-500'}`} />
          <span className={`text-sm leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {bulletText}
          </span>
        </div>
      );
    }

    // Greeting line (Dear..., Hi..., Hello..., Estimado..., etc.)
    if (/^(Dear|Hi |Hello|Greetings|Estimado|Cher|Sehr|प्रिय|नमस्ते|आदरणीय|प्रिय)/i.test(trimmed)) {
      return (
        <p key={idx} className="text-sm text-slate-900 dark:text-slate-100 font-medium mt-2 mb-1">{trimmed}</p>
      );
    }

    // Closing line (Best regards, Sincerely, etc.)
    if (/^(Best|Warm|Kind|Sincerely|Respectfully|With|Regards|Atentamente|Cordialement|धन्यवाद|Cheers)/i.test(trimmed) && trimmed.length < 60) {
      return (
        <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 mt-2 italic">{trimmed}</p>
      );
    }

    // Key:Value metadata (e.g. "Primary Tone Detected: Professional")
    if (/:/.test(trimmed) && trimmed.indexOf(':') < 35 && !trimmed.startsWith('http')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      if (key.length < 30 && value) {
        return (
          <div key={idx} className="flex items-start gap-2 py-0.5 text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-400 shrink-0">{key}:</span>
            <span className="text-slate-800 dark:text-slate-200">{value}</span>
          </div>
        );
      }
    }

    // Default: normal paragraph text
    return (
      <p key={idx} className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
        {trimmed}
      </p>
    );
  };

  return <div className="space-y-0.5">{lines.map((line, idx) => renderLine(line, idx))}</div>;
};

export const ResultViewer = ({ title = 'AI Generated Response', result, type = 'general', onSaveTemplate }) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const { addToast } = useToast();

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('Downloaded response file', 'info');
  };

  const handleSaveAsTemplate = async () => {
    try {
      setSaving(true);
      await templateService.createTemplate({
        title: `${title} - ${new Date().toLocaleDateString()}`,
        category: 'Personal',
        content: result,
        tags: [type]
      });
      addToast('Saved into your Email Templates!', 'success');
      if (onSaveTemplate) onSaveTemplate();
    } catch (err) {
      addToast('Failed to save template', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 mt-6 border border-brand-500/30 relative overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          {/* Toggle raw / formatted */}
          <button
            onClick={() => setRawMode(m => !m)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Toggle raw text"
          >
            <span>{rawMode ? 'Formatted View' : 'Raw Text'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-all"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleSaveAsTemplate}
            disabled={saving}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-all"
            title="Save Template"
          >
            <BookmarkPlus className="w-4 h-4 text-amber-500" />
            <span>{saving ? 'Saving...' : 'Save Template'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-all"
            title="Download"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-5 max-h-[560px] overflow-y-auto">
        {rawMode ? (
          <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {result}
          </pre>
        ) : (
          <FormattedResult text={result} />
        )}
      </div>
    </div>
  );
};
