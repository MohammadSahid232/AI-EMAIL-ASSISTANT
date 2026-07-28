import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  FileText,
  Reply,
  CheckCheck,
  Zap,
  ShieldCheck,
  Globe2,
  ArrowRight,
  Check,
  Star,
  Layers,
  Lock,
  Cpu
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 via-indigo-500/20 to-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
            <span>Next-Gen Gemini AI Powered Email Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15]">
            Supercharge Your Email Workflow with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500">
              Executive AI Precision
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Generate polished emails, summarize long threads, analyze tone, extract action items, and translate into 6+ languages in seconds. Built for executives and business teams.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-brand-500/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/features"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-900 dark:text-slate-100 font-semibold text-base transition-all border border-slate-200/60 dark:border-slate-700/60"
            >
              <span>Explore AI Tools</span>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">4.9/5 from 10k+ Executives</span>
            </div>
            <div className="hidden sm:block">|</div>
            <div className="hidden sm:flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Enterprise Grade Security & JWT Auth</span>
            </div>
          </div>

          {/* App Preview Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-3xl p-3 bg-gradient-to-b from-slate-200/50 to-slate-300/30 dark:from-slate-800/50 dark:to-slate-900/30 border border-slate-300/50 dark:border-slate-700/50 shadow-2xl backdrop-blur-xl">
              <div className="glass-panel rounded-2xl overflow-hidden p-6 text-left border border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">AI Assistant Studio v2.4</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4 col-span-1">
                    <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-300 text-xs font-semibold">
                      Recipient: Executive Board
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      Tone: Professional & Persuasive
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      Language: English (US)
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Subject: Q3 Revenue Optimization & Infrastructure Expansion Strategy<br/><br/>
                    Dear Members of the Board,<br/><br/>
                    I am pleased to submit our strategic updates for the third quarter. Key milestones achieved include a 34% reduction in cloud latency and successful migration to AI-first automation workflows.<br/><br/>
                    Best regards,<br/>Executive Operations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            10 All-in-One Executive AI Email Tools
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Designed to save hours every day with purpose-built algorithms for professional communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 w-fit mb-4">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Smart Email Generator</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create tailored emails by setting recipient, tone, purpose, language, and key bullet points.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 w-fit mb-4">
              <Reply className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Intelligent Reply Generator</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste any incoming email and generate contextually accurate, professional replies instantly.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Email Summarizer</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Extract key takeaways, important dates, deadlines, and tasks from lengthy message threads.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit mb-4">
              <CheckCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Grammar & Spell Checker</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Fix spelling errors, sentence structure, and vocabulary to sound crisp and executive ready.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">5. Multi-Style Rewriter</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert drafts into Formal, Friendly, Persuasive, Short, or Detailed tones at a click.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 w-fit mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">6. Global Translator</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Seamlessly translate emails to English, Spanish, French, German, Hindi, and Nepali.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-12 text-center bg-gradient-to-r from-brand-600/90 to-indigo-700/90 text-white border-none shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Reclaim 10+ Hours Every Week?</h2>
            <p className="text-brand-100 text-lg">
              Join executives, founders, and business managers who trust AI Email Assistant for critical communication.
            </p>
            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white text-brand-600 hover:bg-slate-100 font-bold text-base shadow-lg transition-all hover:scale-105"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
