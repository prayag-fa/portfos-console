// Error handling utilities for consistent error management across the app

// Error types for categorization
export const ERROR_TYPES = {
  AUTH: 'AUTH',
  API: 'API',
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Centralized error logger
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Prevent memory leaks
  }

  log(error, context = {}, severity = ERROR_SEVERITY.MEDIUM, type = ERROR_TYPES.UNKNOWN) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      severity,
      type,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    // Add to local array for debugging
    this.errors.push(errorEntry);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logToExternalService(errorEntry);
    } else {
      // Development logging - using console.error for errors only
      console.error(`🚨 Error (${type}/${severity}):`, error, context);
    }

    return errorEntry;
  }

  logToExternalService(errorEntry) {
    // TODO: Replace with actual error logging service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorEntry });

    // For now, just store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(errorEntry);
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      localStorage.setItem('app_errors', JSON.stringify(existingErrors));
    } catch {
      // Fallback if localStorage fails
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

// Utility functions for common error scenarios
export const handleApiError = (error, context = {}) => {
  const errorMessage = error?.response?.data?.message || error?.message || 'API request failed';

  errorLogger.log(
    error,
    {
      ...context,
      endpoint: context.endpoint || 'unknown',
      method: context.method || 'unknown'
    },
    ERROR_SEVERITY.MEDIUM,
    ERROR_TYPES.API
  );

  return {
    message: errorMessage,
    type: ERROR_TYPES.API,
    severity: ERROR_SEVERITY.MEDIUM
  };
};

export const handleAuthError = (error, context = {}) => {
  const errorMessage = error?.message || 'Authentication failed';

  errorLogger.log(
    error,
    {
      ...context,
      action: context.action || 'unknown'
    },
    ERROR_SEVERITY.HIGH,
    ERROR_TYPES.AUTH
  );

  return {
    message: errorMessage,
    type: ERROR_TYPES.AUTH,
    severity: ERROR_SEVERITY.HIGH
  };
};

export const handleValidationError = (error, context = {}) => {
  const errorMessage = error?.message || 'Validation failed';

  errorLogger.log(
    error,
    {
      ...context,
      field: context.field || 'unknown'
    },
    ERROR_SEVERITY.LOW,
    ERROR_TYPES.VALIDATION
  );

  return {
    message: errorMessage,
    type: ERROR_TYPES.VALIDATION,
    severity: ERROR_SEVERITY.LOW
  };
};

export const handleNetworkError = (error, context = {}) => {
  const errorMessage = 'Network connection failed. Please check your internet connection.';

  errorLogger.log(
    error,
    {
      ...context,
      url: context.url || 'unknown'
    },
    ERROR_SEVERITY.HIGH,
    ERROR_TYPES.NETWORK
  );

  return {
    message: errorMessage,
    type: ERROR_TYPES.NETWORK,
    severity: ERROR_SEVERITY.HIGH
  };
};

// Async error wrapper for functions
export const withErrorHandling = (fn, context = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.log(error, context, ERROR_SEVERITY.MEDIUM, ERROR_TYPES.UNKNOWN);
      throw error;
    }
  };
};

// React hook for error handling
export const useErrorHandler = () => {
  const handleError = (error, context = {}) => {
    return errorLogger.log(error, context);
  };

  const handleAsyncError = (asyncFn, context = {}) => {
    return async (...args) => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        handleError(error, context);
        throw error;
      }
    };
  };

  return {
    handleError,
    handleAsyncError,
    errorLogger
  };
};

// Error boundary helper
export const createErrorBoundary = fallbackComponent => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      errorLogger.log(
        error,
        {
          componentStack: errorInfo.componentStack,
          componentName: this.constructor.name
        },
        ERROR_SEVERITY.HIGH,
        ERROR_TYPES.UNKNOWN
      );
    }

    render() {
      if (this.state.hasError) {
        return fallbackComponent ? fallbackComponent(this.state.error) : null;
      }

      return this.props.children;
    }
  };
};
