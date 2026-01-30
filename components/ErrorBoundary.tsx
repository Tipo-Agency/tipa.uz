import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Перехватывает ошибки в дереве компонентов, чтобы приложение не падало целиком.
 * Критично для стабильности при рекламном трафике.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="font-display font-bold text-2xl mb-4">Что-то пошло не так</h1>
            <p className="text-gray-400 mb-8">
              Мы уже знаем о проблеме. Обновите страницу или вернитесь на главную.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-primary text-white font-display font-bold uppercase tracking-wider hover:bg-primary/90"
              >
                Обновить страницу
              </button>
              <Link
                to="/ru"
                className="px-6 py-3 rounded-full border border-white/20 text-white font-display font-bold uppercase tracking-wider hover:bg-white/10 text-center"
              >
                На главную
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
