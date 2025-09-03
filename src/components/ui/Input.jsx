import React, { forwardRef } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { cn } from '../../lib/utils/componentFactory';

const Input = forwardRef(
  (
    {
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      icon: Icon,
      iconPosition = 'left',
      error,
      disabled = false,
      required = false,
      className = '',
      size = 'md',
      variant = 'default',
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-5 h-5'
    };

    const iconPositions = {
      sm: 'pl-10',
      md: 'pl-12',
      lg: 'pl-12'
    };

    const rightIconPositions = {
      sm: 'pr-10',
      md: 'pr-12',
      lg: 'pr-12'
    };

    const baseClasses = cn(
      'w-full rounded-lg border bg-white transition-all duration-150 ease-out placeholder:text-gray-400 focus:outline-none focus:ring-2',
      sizes[size],
      {
        'border-red-300 focus:border-red-500 focus:ring-red-500/20': error,
        'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/20':
          !error && variant === 'default',
        'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed': disabled,
        [iconPositions[size]]: Icon && iconPosition === 'left',
        [rightIconPositions[size]]: (Icon && iconPosition === 'right') || showPasswordToggle
      },
      className
    );

    const iconClasses = cn(
      'pointer-events-none absolute inset-y-0 flex items-center transition-colors duration-200',
      iconSizes[size],
      {
        'left-0 pl-3': iconPosition === 'left',
        'right-0 pr-3': iconPosition === 'right',
        'text-gray-400': !isFocused,
        'text-blue-600': isFocused && !error,
        'text-red-500': error
      }
    );

    const handleFocus = e => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = e => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className='space-y-2'>
        {label && (
          <label className='block text-sm font-medium text-gray-700'>
            {label}
            {required && <span className='ml-1 text-red-500'>*</span>}
          </label>
        )}

        <div className='relative'>
          {Icon && iconPosition === 'left' && (
            <div className={cn(iconClasses, 'left-0 pl-3')}>
              <Icon />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={baseClasses}
            {...props}
          />

          {Icon && iconPosition === 'right' && (
            <div className={cn(iconClasses, 'right-0 pr-3')}>
              <Icon />
            </div>
          )}

          {showPasswordToggle && type === 'password' && (
            <button
              type='button'
              className={cn(iconClasses, 'right-0 pr-3')}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          )}
        </div>

        {error && (
          <p className='flex items-center gap-1 text-sm text-red-600'>
            <span className='size-1 rounded-full bg-red-600' />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
