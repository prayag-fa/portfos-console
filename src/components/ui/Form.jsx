import React from 'react';

import { cn } from '../../lib/utils/componentFactory';

// Form Container
const Form = React.forwardRef(({ children, onSubmit, className = '', ...props }, ref) => {
  return (
    <form ref={ref} onSubmit={onSubmit} className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  );
});

Form.displayName = 'Form';

// Form Field Container
const FormField = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
};

// Form Label
const FormLabel = ({ children, htmlFor, required = false, className = '', ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
      {required && <span className='ml-1 text-red-500'>*</span>}
    </label>
  );
};

// Form Error
const FormError = ({ children, className = '', ...props }) => {
  if (!children) return null;

  return (
    <p className={cn('flex items-center gap-1 text-sm text-red-600', className)} {...props}>
      <span className='size-1 rounded-full bg-red-600' />
      {children}
    </p>
  );
};

// Form Description
const FormDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={cn('text-sm text-gray-500', className)} {...props}>
      {children}
    </p>
  );
};

// Form Group
const FormGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
};

// Form Actions
const FormActions = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('flex items-center justify-end space-x-3 pt-4', className)} {...props}>
      {children}
    </div>
  );
};

export { Form, FormField, FormLabel, FormError, FormDescription, FormGroup, FormActions };
