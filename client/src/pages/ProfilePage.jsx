import React, { useState } from 'react';
import { User, Mail, Shield, Camera, Save, Download, Trash2, AlertTriangle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { privacyService } from '../services/privacyService';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({ name, avatar });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const res = await privacyService.exportData();
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_email_assistant_data_${user?.id || 'export'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addToast('GDPR Data Package downloaded successfully!', 'success');
    } catch (err) {
      addToast('Failed to export data archive', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('⚠️ CRITICAL WARNING: Are you sure you want to permanently delete your account? All generated emails, templates, and subscription data will be irrevocably purged in compliance with GDPR.')) {
      return;
    }
    try {
      setDeleting(true);
      await privacyService.deleteAccount();
      addToast('Account permanently erased.', 'info');
      logout();
    } catch (err) {
      addToast('Failed to delete account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="User Profile &amp; Privacy Controls" />

      <div className="px-6 max-w-3xl mx-auto space-y-6">
        <GlassCard>
          <div className="flex items-center space-x-4 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/30"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-500">
                  Role: {user?.role || 'Executive User'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
                  Plan: {user?.subscription?.plan || 'Free'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Avatar Image URL</label>
              <div className="relative">
                <Camera className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </GlassCard>

        {/* GDPR Privacy & Data Ownership Controls */}
        <GlassCard className="border-slate-800">
          <div className="pb-4 border-b border-slate-200/50 dark:border-slate-800/50 mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>GDPR &amp; CCPA Privacy Controls</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your personal data archive and account deletion rights</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                <Download className="w-4 h-4 text-brand-500" />
                <span>Export My Data Archive</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download a complete JSON package of your profile, email generations, templates, and activity history.
              </p>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="w-full py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{exporting ? 'Preparing Archive...' : 'Download JSON Data'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3">
              <div className="flex items-center space-x-2 font-bold text-xs text-red-500">
                <Trash2 className="w-4 h-4" />
                <span>Purge Account ("Right to be Forgotten")</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Permanently erase your user profile and all stored email history. This action is immediate and non-reversible.
              </p>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold border border-red-500/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{deleting ? 'Purging Account...' : 'Permanently Delete Account'}</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
