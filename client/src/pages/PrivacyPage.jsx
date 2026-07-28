import React from 'react';
import { Shield, Lock, ArrowLeft, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            <span>Privacy Policy &amp; Data Rights (GDPR / CCPA)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">Last Updated: July 26, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-8 rounded-2xl border border-slate-800">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Data We Collect &amp; Purpose</h2>
            <p>
              We collect your name, email address, password hash, and the email prompts submitted to our AI tools. This data is strictly used to deliver email generation services, maintain template history, and enforce subscription quotas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Data Confidentiality &amp; Security</h2>
            <p>
              We do NOT sell, rent, or trade your personal email content to third parties. All data in transit is encrypted using TLS 1.3, and data at rest is secured on encrypted MongoDB Atlas clusters.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Download className="w-4 h-4 text-brand-400" />
              <span>3. Your GDPR Right to Data Portability</span>
            </h2>
            <p>
              You have the right to request a complete archive of all data stored about you. Logged-in users can initiate a instantaneous data export directly from their account profile settings page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>4. Your Right to Erasure ("Right to be Forgotten")</span>
            </h2>
            <p>
              In compliance with GDPR Article 17 and CCPA, you may permanently purge your account and all associated email history, templates, and activity logs at any time via your Profile settings or by contacting privacy@aiemailassistant.com.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Cookies &amp; Tracking</h2>
            <p>
              We use essential session tokens (JWT) to authenticate your account. We do not place third-party advertising tracking cookies on your device.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
