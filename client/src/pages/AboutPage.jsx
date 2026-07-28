import React from 'react';
import { Mail, Shield, Cpu, Sparkles, Award, Globe, Users } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/30">
          About AI Email Assistant
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Empowering Modern Teams with Intelligent Communication
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          AI Email Assistant was built to solve the corporate email overload. By pairing Gemini AI model capability with enterprise security and crisp UX, we transform inbox management into a high-performance productivity hub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="text-center space-y-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 w-fit mx-auto">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Innovation</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Powered by Google Gemini 1.5 Flash models with pluggable architecture for seamless API extensions.
          </p>
        </GlassCard>

        <GlassCard className="text-center space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 w-fit mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Security</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            JWT session protection, helmet rate-limiting, bcrypt salt hashing, and MongoDB sanitization.
          </p>
        </GlassCard>

        <GlassCard className="text-center space-y-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 w-fit mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Executive UX</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tailored glassmorphism UI with light & dark theme controls and real-time interactive charts.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
