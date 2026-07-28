import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

// App / User Pages
import { DashboardPage } from './pages/DashboardPage';
import { GenerateEmailPage } from './pages/GenerateEmailPage';
import { ReplyGeneratorPage } from './pages/ReplyGeneratorPage';
import { SummarizerPage } from './pages/SummarizerPage';
import { GrammarCheckerPage } from './pages/GrammarCheckerPage';
import { RewriteEmailPage } from './pages/RewriteEmailPage';
import { ToneDetectorPage } from './pages/ToneDetectorPage';
import { TranslatorPage } from './pages/TranslatorPage';
import { ActionItemsPage } from './pages/ActionItemsPage';
import { MeetingSummaryPage } from './pages/MeetingSummaryPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { BillingPage } from './pages/BillingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminEmailsPage } from './pages/AdminEmailsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminLogsPage } from './pages/AdminLogsPage';

// Components
import { CookieConsent } from './components/common/CookieConsent';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-mono text-sm">
        Authenticating session...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/app/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* User Application Pages */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="generate-email" element={<GenerateEmailPage />} />
          <Route path="reply-generator" element={<ReplyGeneratorPage />} />
          <Route path="summarizer" element={<SummarizerPage />} />
          <Route path="grammar-checker" element={<GrammarCheckerPage />} />
          <Route path="rewrite-email" element={<RewriteEmailPage />} />
          <Route path="tone-detection" element={<ToneDetectorPage />} />
          <Route path="translator" element={<TranslatorPage />} />
          <Route path="action-items" element={<ActionItemsPage />} />
          <Route path="meeting-summary" element={<MeetingSummaryPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Panel Pages */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="emails" element={<AdminEmailsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
        </Route>

        {/* Legacy route alias redirects */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </>
  );
}
