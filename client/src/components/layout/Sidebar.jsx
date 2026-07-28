import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
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
  User,
  Settings,
  CreditCard,
  Shield,
  LogOut,
  Sparkles,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Core Platform',
      items: [
        { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'AI Productivity Tools',
      items: [
        { name: 'Generate Email', path: '/app/generate-email', icon: Send },
        { name: 'Reply Generator', path: '/app/reply-generator', icon: Reply },
        { name: 'Email Summarizer', path: '/app/summarizer', icon: FileText },
        { name: 'Grammar Checker', path: '/app/grammar-checker', icon: CheckCheck },
        { name: 'Rewrite Email', path: '/app/rewrite-email', icon: RefreshCw },
        { name: 'Tone Detection', path: '/app/tone-detection', icon: Gauge },
        { name: 'Translation', path: '/app/translator', icon: Languages },
        { name: 'Action Items', path: '/app/action-items', icon: ListTodo },
        { name: 'Meeting Summary', path: '/app/meeting-summary', icon: Users }
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Email Templates', path: '/app/templates', icon: BookmarkCheck },
        { name: 'Billing & Plans', path: '/app/billing', icon: CreditCard },
        { name: 'User Profile', path: '/app/profile', icon: User },
        { name: 'Settings', path: '/app/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-tight">AI Assistant</h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-500">Executive Edition</span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {group.title}
              </h2>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}

          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-amber-500 mb-2">
                Admin Tools
              </h2>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'text-amber-600/80 dark:text-amber-400/80 hover:bg-amber-500/10'
                  }`
                }
              >
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Admin Panel</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* User profile footer info */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center space-x-3 overflow-hidden">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="User avatar"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-brand-500/30 flex-shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Executive User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
