import React from 'react';
import { Shield, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <FileText className="w-8 h-8 text-brand-500" />
            <span>Terms of Service</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">Last Updated: July 26, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-8 rounded-2xl border border-slate-800">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using AI Email Assistant, you agree to be bound by these Terms of Service. If you do not agree, please do not access or use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. AI Content Generation Disclaimer</h2>
            <p>
              AI Email Assistant uses artificial intelligence models to assist in drafting, summarizing, and translating email communications. While our system strives for maximum precision, all AI-generated content is provided for informational and drafting assistance only. You are solely responsible for reviewing, verifying accuracy, and approving all content prior to sending communications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. User Quotas & Subscription Terms</h2>
            <p>
              Free accounts are subject to monthly generation limits (50 generations per month). Pro ($19/mo) and Team ($49/mo) subscriptions auto-renew monthly until canceled via the Billing portal. Refunds are subject to our 14-day customer satisfaction policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Acceptable Use Policy</h2>
            <p>
              You agree not to use the platform to generate spam, malicious phishing emails, deceptive communications, hate speech, or illegal content. We reserve the right to suspend or terminate accounts violating these guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Limitation of Liability</h2>
            <p>
              AI Email Assistant shall not be liable for any indirect, incidental, or consequential damages resulting from email deliverability failures, AI inaccuracy, or unauthorized access to account credentials.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
