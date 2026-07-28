import React from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Reply,
  FileText,
  CheckCheck,
  RefreshCw,
  Gauge,
  Languages,
  ListTodo,
  Users,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const FeaturesPage = () => {
  const tools = [
    { title: '1. Email Generator', desc: 'Generate customized executive emails specifying recipient, tone, purpose, language & key bullet points.', icon: Send, path: '/app/generate-email' },
    { title: '2. Reply Generator', desc: 'Paste received messages to create context-aware, polite, and effective replies.', icon: Reply, path: '/app/reply-generator' },
    { title: '3. Email Summarizer', desc: 'Distill long email threads into summaries, key points, deadlines, and tasks.', icon: FileText, path: '/app/summarizer' },
    { title: '4. Grammar Checker', desc: 'Correct typos, punctuation, grammar, and elevate professional vocabulary.', icon: CheckCheck, path: '/app/grammar-checker' },
    { title: '5. Rewrite Email', desc: 'Transform tone into Formal, Friendly, Persuasive, Short, or Detailed.', icon: RefreshCw, path: '/app/rewrite-email' },
    { title: '6. Tone Detector', desc: 'Evaluate email sentiment across Positive, Neutral, Negative, Urgent, and Professional scores.', icon: Gauge, path: '/app/tone-detection' },
    { title: '7. Multi-Language Translator', desc: 'Translate emails instantly into English, Spanish, French, German, Hindi, or Nepali.', icon: Languages, path: '/app/translator' },
    { title: '8. Action Item Extraction', desc: 'Extract structured tables of tasks, deadlines, assignees, and priorities.', icon: ListTodo, path: '/app/action-items' },
    { title: '9. Meeting Summary Generator', desc: 'Convert meeting notes into executive summaries, decisions, action items & follow-ups.', icon: Users, path: '/app/meeting-summary' },
    { title: '10. Template Manager', desc: 'Save, organize, and reuse email templates across HR, Marketing, Sales, and Support.', icon: BookmarkCheck, path: '/app/templates' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Comprehensive AI Email Feature Suite
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore all 10 specialized AI productivity engines ready to streamline your daily communications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((t, idx) => {
          const Icon = t.icon;
          return (
            <GlassCard key={idx} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <Link
                  to={t.path}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
