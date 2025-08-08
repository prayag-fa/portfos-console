import React, { memo, forwardRef } from 'react';

// Higher-order component for performance optimization
export const withMemo = (Component, propsAreEqual) => {
  return memo(Component, propsAreEqual);
};

// Higher-order component for forwardRef
export const withForwardRef = (Component) => {
  return forwardRef(Component);
};

// Component factory for creating optimized components
export class ComponentFactory {
  static createOptimizedComponent(Component, options = {}) {
    const {
      memo = true,
      forwardRef = false,
      displayName = Component.displayName || Component.name || 'Component'
    } = options;

    let OptimizedComponent = Component;

    if (memo) {
      OptimizedComponent = withMemo(OptimizedComponent);
    }

    if (forwardRef) {
      OptimizedComponent = withForwardRef(OptimizedComponent);
    }

    OptimizedComponent.displayName = displayName;

    return OptimizedComponent;
  }

  // Factory for creating table components
  static createTableComponent(Component, options = {}) {
    return this.createOptimizedComponent(Component, {
      memo: true,
      forwardRef: false,
      ...options
    });
  }

  // Factory for creating form components
  static createFormComponent(Component, options = {}) {
    return this.createOptimizedComponent(Component, {
      memo: true,
      forwardRef: true,
      ...options
    });
  }

  // Factory for creating layout components
  static createLayoutComponent(Component, options = {}) {
    return this.createOptimizedComponent(Component, {
      memo: false, // Layout components don't need memo usually
      forwardRef: false,
      ...options
    });
  }
}

// Utility for creating error boundaries
export const createErrorBoundary = (fallback) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return fallback ? fallback(this.state.error) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium">Something went wrong</h3>
            <p className="text-red-600 text-sm mt-1">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        );
      }

      return this.props.children;
    }
  };
};

// Utility for creating loading states
export const createLoadingComponent = (Component, LoadingComponent) => {
  return ({ loading, ...props }) => {
    if (loading) {
      return <LoadingComponent />;
    }
    return <Component {...props} />;
  };
};

// Utility for creating conditional rendering components
export const createConditionalComponent = (Component, condition) => {
  return (props) => {
    if (!condition(props)) {
      return null;
    }
    return <Component {...props} />;
  };
};

// Utility for creating data-driven components
export const createDataComponent = (Component, dataTransformer) => {
  return (props) => {
    const transformedData = dataTransformer ? dataTransformer(props) : props;
    return <Component {...transformedData} />;
  };
}; 