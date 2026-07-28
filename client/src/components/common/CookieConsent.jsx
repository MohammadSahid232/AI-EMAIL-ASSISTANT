import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_accepted');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl text-xs text-slate-300 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 font-bold text-white">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Cookie &amp; Privacy Notice</span>
        </div>
        <button onClick={handleAccept} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="leading-relaxed">
        We use essential cookies to maintain your authentication session and deliver secure AI features. By continuing to use our platform, you consent to our{' '}
        <Link to="/privacy" className="text-brand-400 underline">Privacy Policy</Link> and{' '}
        <Link to="/terms" className="text-brand-400 underline">Terms of Service</Link>.
      </p>
      <div className="flex justify-end">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-all shadow-md"
        >
          Accept &amp; Continue
        </button>
      </div>
    </div>
  );
};
