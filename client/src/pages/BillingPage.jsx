import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Zap, Shield, Sparkles, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { billingService } from '../services/billingService';
import { useToast } from '../context/ToastContext';
import { useSearchParams } from 'react-router-dom';

export const BillingPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await billingService.getSubscriptionStatus();
      if (res.data.success) {
        setStatus(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    if (searchParams.get('success') === 'true') {
      addToast('Subscription successfully updated!', 'success');
    }
  }, []);

  const handleCheckout = async (plan) => {
    try {
      setActionLoading(true);
      const res = await billingService.createCheckoutSession(plan);
      if (res.data.success && res.data.url) {
        if (res.data.demoMode) {
          addToast(res.data.message || `Upgraded to ${plan.toUpperCase()} plan!`, 'success');
          loadStatus();
        } else {
          window.location.href = res.data.url;
        }
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to initiate checkout', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    try {
      setActionLoading(true);
      const res = await billingService.createCustomerPortal();
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      addToast('Failed to open billing portal', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const plan = status?.subscription?.plan || 'free';
  const used = status?.usage?.used || 0;
  const limit = status?.usage?.limit || 50;
  const percentage = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Billing & Subscriptions" />

      <div className="px-6 max-w-5xl mx-auto space-y-6">
        {/* Usage & Active Plan Summary Card */}
        <GlassCard>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-500 border border-brand-500/20">
                  {plan} Plan
                </span>
                <span className="text-xs text-slate-400">Current Monthly Billing Cycle</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Generation Usage</h2>
              <p className="text-xs text-slate-500 mt-1">
                {used} of {limit === 999999 ? 'Unlimited' : limit} generations used this month ({percentage}%)
              </p>
            </div>

            <div className="w-full md:w-72">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Monthly Quota</span>
                <span className="text-brand-500">{percentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage > 85 ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {plan !== 'free' && (
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-end">
              <button
                onClick={handlePortal}
                disabled={actionLoading}
                className="flex items-center space-x-2 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                <span>Manage Payment Method & Invoices</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </GlassCard>

        {/* Subscription Plan Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <GlassCard className={`relative flex flex-col justify-between ${plan === 'free' ? 'ring-2 ring-brand-500' : ''}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Free Starter</h3>
                {plan === 'free' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>50 AI Generations per month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All 10 Executive AI Tools</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standard Response Speeds</span>
                </li>
              </ul>
            </div>
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-default"
            >
              {plan === 'free' ? 'Active Plan' : 'Free Tier'}
            </button>
          </GlassCard>

          {/* Pro Tier */}
          <GlassCard className={`relative flex flex-col justify-between border-brand-500/40 shadow-xl ${plan === 'pro' ? 'ring-2 ring-brand-500' : ''}`}>
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Executive Pro</h3>
                {plan === 'pro' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-bold">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$19</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                  <span><strong>1,000</strong> AI Generations per month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Priority Processing Speed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Full Multilingual Translation Suite</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Unlimited Template Storage</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('pro')}
              disabled={actionLoading || plan === 'pro'}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro ($19)'}</span>
              {plan !== 'pro' && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </GlassCard>

          {/* Team Tier */}
          <GlassCard className={`relative flex flex-col justify-between ${plan === 'team' ? 'ring-2 ring-brand-500' : ''}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Team</h3>
                {plan === 'team' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$49</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span><strong>Unlimited</strong> AI Generations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Organization Shared Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Dedicated Admin Audit Logs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>24/7 Priority Support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout('team')}
              disabled={actionLoading || plan === 'team'}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{plan === 'team' ? 'Current Plan' : 'Upgrade to Team ($49)'}</span>
              {plan !== 'team' && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
