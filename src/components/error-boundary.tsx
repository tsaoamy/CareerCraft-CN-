'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-[#fff5e6] dark:bg-[#3d2900] flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-[#ff9f0a]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-3">
              页面出现了问题
            </h2>
            <p className="text-sm text-[#86868b] dark:text-[#98989d] mb-6 leading-relaxed">
              很抱歉，页面加载过程中遇到了意外错误。请尝试刷新页面。
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新加载
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
