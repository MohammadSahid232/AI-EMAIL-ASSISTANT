import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const PricingPage = () => {
  const plans = [
    {
      name: 'Starter Executive',
      price: '$19',
      period: '/month',
      desc: 'Ideal for individual professionals and executives managing personal inboxes.',
      features: [
        '500 AI Generations / mo',
        'Access to all 10 AI Tools',
        'Standard Response Time',
        'Saved Email Templates (20)',
        'Basic Analytics & Log History'
      ],
      cta: 'Start 14-Day Trial',
      highlighted: false
    },
    {
      name: 'Business Pro',
      price: '$49',
      period: '/month',
      desc: 'Designed for high-growth business teams, leaders, and executive staff.',
      features: [
        'Unlimited AI Generations',
        'Priority Gemini 1.5 Flash Model Access',
        'Unlimited Saved Templates',
        'Multi-Language Translation (All 6 Languages)',
        'Tone Sentiment Analysis & Risk Alerts',
        'Dedicated Admin Analytics'
      ],
      cta: 'Get Started Pro',
      highlighted: true
    },
    {
      name: 'Enterprise SaaS',
      price: '$129',
      period: '/month',
      desc: 'For enterprise organizations requiring custom API integrations & SSO.',
      features: [
        'Everything in Business Pro',
        'Custom OpenAI / Gemini API Key Config',
        'Admin Role Control & User Seats',
        'Dedicated SLA & 24/7 Priority Support',
        'Custom System Audit Logs'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/30">
          Transparent Pricing
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Flexible Plans for Executives & Business Teams
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Scale your email productivity with transparent monthly or annual pricing tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <GlassCard
            key={idx}
            className={`flex flex-col justify-between ${
              plan.highlighted
                ? 'border-2 border-brand-500 shadow-2xl scale-105 bg-gradient-to-b from-brand-500/5 to-transparent'
                : ''
            }`}
          >
            <div>
              {plan.highlighted && (
                <div className="inline-flex items-center space-x-1 bg-brand-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{plan.desc}</p>
              
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="ml-1 text-sm text-slate-500">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <Link
                to="/register"
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center transition-all ${
                  plan.highlighted
                    ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
