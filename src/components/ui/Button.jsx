import React from 'react';

import { LoaderIcon } from 'lucide-react';

import { cn } from '../../lib/utils/componentFactory';

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      className,
      disabled = false,
      loading = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm';

    const variants = {
      primary: 'text-blue-600 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500',
      secondary: 'text-gray-600 bg-gray-50 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-500',
      success: 'text-green-600 bg-green-50 hover:bg-green-100 focus:ring-green-500',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500'
    };

    const sizes = {
      sm: 'text-xs px-2 py-1 gap-1',
      md: 'text-xs px-4 py-2 gap-2',
      lg: 'text-sm px-6 py-3 gap-2'
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    const iconOnlySizes = {
      sm: 'p-1',
      md: 'p-1.5',
      lg: 'p-2'
    };

    const isIconOnly = !children && Icon;

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      isIconOnly ? iconOnlySizes[size] : sizes[size],
      className
    );

    const iconClasses = cn(iconSizes[size]);

    return (
      <button ref={ref} className={buttonClasses} disabled={disabled || loading} {...props}>
        {loading && <LoaderIcon className='size-4 animate-spin' />}

        {!loading && Icon && iconPosition === 'left' && <Icon className={iconClasses} />}

        {children && <span>{children}</span>}

        {!loading && Icon && iconPosition === 'right' && <Icon className={iconClasses} />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
