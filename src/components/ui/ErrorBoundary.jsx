'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Replace with actual error logging service
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
            <div className='mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100'>
              <svg
                className='size-6 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h2 className='mb-2 text-center text-lg font-semibold text-gray-900'>
              Something went wrong
            </h2>
            <p className='mb-4 text-center text-gray-600'>
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className='flex justify-center space-x-3'>
              <button
                onClick={() => window.location.reload()}
                className='bg-primary-700 hover:bg-primary-700 rounded-md px-4 py-2 text-white transition-colors'
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className='rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300'
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-4 rounded-md bg-gray-100 p-4'>
                <summary className='cursor-pointer font-medium text-gray-700'>
                  Error Details
                </summary>
                <pre className='mt-2 overflow-auto text-xs text-gray-600'>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
