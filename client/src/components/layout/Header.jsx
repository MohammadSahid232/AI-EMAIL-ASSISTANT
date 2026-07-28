import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Bell, Search, Sparkles, X, CheckCircle2, Info, AlertTriangle, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'Generate Email',     path: '/app/generate-email',  hint: 'Create professional emails with AI' },
  { label: 'Smart Reply',        path: '/app/reply-generator', hint: 'Generate replies to received emails' },
  { label: 'Summarize Email',    path: '/app/summarizer',      hint: 'Condense long emails instantly' },
  { label: 'Grammar Checker',    path: '/app/grammar-checker',  hint: 'Fix grammar and spelling' },
  { label: 'Rewrite Email',      path: '/app/rewrite-email',   hint: 'Restyle emails in different tones' },
  { label: 'Tone Detector',      path: '/app/tone-detection',  hint: 'Analyse sentiment and tone' },
  { label: 'Translator',         path: '/app/translator',      hint: 'Translate emails to any language' },
  { label: 'Action Items',       path: '/app/action-items',    hint: 'Extract tasks from emails' },
  { label: 'Meeting Summary',    path: '/app/meeting-summary', hint: 'Turn notes into meeting minutes' },
  { label: 'Templates',          path: '/app/templates',       hint: 'Browse saved email templates' },
  { label: 'Billing & Plans',    path: '/app/billing',         hint: 'Manage subscription and limits' },
  { label: 'Dashboard',          path: '/app/dashboard',       hint: 'Overview and analytics' },
  { label: 'Profile',            path: '/app/profile',         hint: 'Manage your account' },
  { label: 'Settings',           path: '/app/settings',        hint: 'App preferences' },
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'Gemini AI is Active',
    body: 'All AI tools are running in smart fallback mode and ready to use.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    icon: Zap,
    color: 'text-brand-500',
    bg: 'bg-brand-500/10',
    title: 'New Feature: Meeting Summary',
    body: 'Convert raw meeting notes into executive-grade meeting minutes instantly.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    title: 'Translation Upgraded',
    body: 'Full word-by-word translation is now live for Spanish, French, German, Hindi & Nepali.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'warning',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'MongoDB Offline',
    body: 'App is running in resilient demo mode. Connect MongoDB Atlas for full persistence.',
    time: 'Today',
    read: true,
  },
];

export const Header = ({ title = 'Dashboard' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [query, setQuery]         = useState('');
  const [focused, setFocused]     = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef    = useRef(null);
  const searchRef   = useRef(null);

  // Notification state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
        setQuery('');
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search helpers
  const results = query.trim()
    ? QUICK_LINKS.filter(l =>
        l.label.toLowerCase().includes(query.toLowerCase()) ||
        l.hint.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_LINKS;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter')     { if (results[highlighted]) handleSelect(results[highlighted].path); }
    else if (e.key === 'Escape')    { setFocused(false); setQuery(''); inputRef.current?.blur(); }
  };

  const handleSelect = (path) => {
    navigate(path);
    setFocused(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const showDropdown = focused && results.length > 0;

  return (
    <header className="sticky top-0 z-20 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <span>{title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Executive AI Productivity Suite &amp; Enterprise Workflow Tools
        </p>
      </div>

      <div className="flex items-center space-x-3">

        {/* ── Quick Search ── */}
        <div ref={searchRef} className="relative hidden sm:block">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all cursor-text
              ${focused
                ? 'bg-white dark:bg-slate-900 border-brand-500/60 shadow-md shadow-brand-500/10 w-64'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 w-52'
              }`}
            onClick={() => { setFocused(true); inputRef.current?.focus(); }}
          >
            <Search className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${focused ? 'text-brand-500' : 'text-slate-400'}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setHighlighted(0); }}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Quick search..."
              className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none min-w-0"
            />
            {query && (
              <button
                onClick={e => { e.stopPropagation(); setQuery(''); inputRef.current?.focus(); }}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/20 overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {query ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Quick Navigation'}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {results.map((item, idx) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    onMouseEnter={() => setHighlighted(idx)}
                    className={`w-full text-left flex items-start gap-3 px-3 py-2.5 transition-colors ${
                      highlighted === idx
                        ? 'bg-brand-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-lg flex-shrink-0 ${
                      highlighted === idx ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Search className="w-2.5 h-2.5" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${
                        highlighted === idx ? 'text-brand-600 dark:text-brand-400' : 'text-slate-800 dark:text-slate-200'
                      }`}>{item.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.hint}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400">↑↓ navigate · Enter select · Esc close</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Theme Toggle ── */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 transition-all"
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* ── Notification Bell ── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); if (!notifOpen) {} }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500" />
              </>
            )}
          </button>

          {/* Notification Panel */}
          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/25 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-brand-500 hover:text-brand-600 font-semibold transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map(notif => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        !notif.read ? 'bg-brand-500/5 dark:bg-brand-500/5' : ''
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-xl flex-shrink-0 ${notif.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${notif.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className={`text-xs font-semibold truncate ${
                            !notif.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                          }`}>{notif.title}</p>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">{notif.body}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Click a notification to mark it as read</p>
              </div>
            </div>
          )}
        </div>

        {/* ── AI Status Badge ── */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>Gemini AI Connected</span>
        </div>
      </div>
    </header>
  );
};
