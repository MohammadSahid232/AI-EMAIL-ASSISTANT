import React from 'react';
import { Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-[#080b12]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-brand-600 text-white">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Email Assistant</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Next-generation executive email productivity platform powered by advanced AI language models.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/features" className="hover:text-brand-500 transition-colors">AI Tools</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-500 transition-colors">Enterprise Pricing</Link></li>
              <li><Link to="/app/templates" className="hover:text-brand-500 transition-colors">Email Templates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Security & Privacy</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">System Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex space-x-4 text-slate-500 dark:text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-brand-500 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} AI Email Assistant SaaS Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Built with precision & high performance AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
