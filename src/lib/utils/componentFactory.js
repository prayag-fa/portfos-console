import React, { memo, forwardRef } from 'react';

// Utility function for combining class names
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Higher-order component for performance optimization
export const withMemo = (Component, propsAreEqual) => {
  return memo(Component, propsAreEqual);
};

// Higher-order component for forwardRef
export const withForwardRef = Component => {
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
export const createErrorBoundary = fallback => {
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
        return fallback ? (
          fallback(this.state.error)
        ) : (
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <h3 className='font-medium text-red-800'>Something went wrong</h3>
            <p className='mt-1 text-sm text-red-600'>
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
  const LoadingWrapper = ({ loading, ...props }) => {
    if (loading) {
      return <LoadingComponent />;
    }
    return <Component {...props} />;
  };
  LoadingWrapper.displayName = `LoadingWrapper(${Component.displayName || Component.name})`;
  return LoadingWrapper;
};

// Utility for creating conditional rendering components
export const createConditionalComponent = (Component, condition) => {
  const ConditionalWrapper = props => {
    if (!condition(props)) {
      return null;
    }
    return <Component {...props} />;
  };
  ConditionalWrapper.displayName = `ConditionalWrapper(${Component.displayName || Component.name})`;
  return ConditionalWrapper;
};

// Utility for creating data-driven components
export const createDataComponent = (Component, dataTransformer) => {
  const DataWrapper = props => {
    const transformedData = dataTransformer ? dataTransformer(props) : props;
    return <Component {...transformedData} />;
  };
  DataWrapper.displayName = `DataWrapper(${Component.displayName || Component.name})`;
  return DataWrapper;
};
