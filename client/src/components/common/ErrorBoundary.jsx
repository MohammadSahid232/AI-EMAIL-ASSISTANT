import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Rendering Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 w-fit mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                An unexpected UI rendering issue occurred. Click below to reload the application cleanly.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-rose-400 text-left overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
