import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Component Error Caught!</h1>
          <div className="bg-red-100 p-4 rounded border">
            <h3 className="font-bold text-red-800 mb-2">Error Details:</h3>
            <pre className="text-sm text-red-700 overflow-auto">
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <>
                <h3 className="font-bold text-red-800 mt-4 mb-2">Component Stack:</h3>
                <pre className="text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;