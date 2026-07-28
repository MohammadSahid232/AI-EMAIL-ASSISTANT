import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sun, Moon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-brand-300 dark:to-indigo-300">
              EmailAI Assistant
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/features" className="hover:text-brand-500 transition-colors">Features</Link>
            <Link to="/about" className="hover:text-brand-500 transition-colors">About</Link>
            <Link to="/pricing" className="hover:text-brand-500 transition-colors">Pricing</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium shadow-md shadow-brand-500/20 transition-all hover:scale-105"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-medium shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
