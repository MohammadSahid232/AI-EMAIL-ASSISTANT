import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login(email, password);
      addToast('Welcome back! Login successful.', 'success');
      if (res.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemoLogin = async () => {
    try {
      setLoading(true);
      const res = await login('admin@example.com', 'password123');
      addToast('Logged in as Administrator!', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast('Admin demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center space-y-3 mb-8">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 w-fit mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your AI Email Assistant dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-900 dark:text-slate-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Default password: password123</span>
            <a href="#" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Logins */}
        <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <p className="text-[11px] text-center font-semibold text-slate-400 uppercase tracking-wider">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmail('user@example.com');
                setPassword('password123');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center"
            >
              Executive User
            </button>
            <button
              onClick={handleAdminDemoLogin}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[11px] font-medium text-amber-600 dark:text-amber-400 text-center flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
