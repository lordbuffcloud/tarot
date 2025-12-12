'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl w-full bg-slate-800/60 backdrop-blur-sm shadow-2xl shadow-red-900/40 rounded-xl p-6 sm:p-8 ring-1 ring-red-700/60">
            <h1 className="text-4xl sm:text-5xl font-bold text-red-300 filter drop-shadow-[0_0_6px_rgba(248,113,113,0.7)] mb-4">
              The Veil Has Torn
            </h1>
            <p className="text-lg text-slate-300 mb-6">
              An unexpected error has disrupted the cosmic flow. The Oracle apologizes for this disturbance.
            </p>
            {this.state.error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
                <p className="text-sm text-red-200 font-mono break-all">
                  {this.state.error.message || 'Unknown error occurred'}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={this.handleReset}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-purple-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Return to the Beginning
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-sky-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Refresh the Portal
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

