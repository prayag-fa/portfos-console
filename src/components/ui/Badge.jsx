import { cn } from '../../lib/utils/componentFactory';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  showDot = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-gray-50 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    // Status variants
    completed: 'bg-green-50 text-green-700 border-green-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    skipped: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-blue-500',
    secondary: 'bg-gray-400',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    completed: 'bg-green-500',
    in_progress: 'bg-yellow-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
    error: 'bg-red-500',
    skipped: 'bg-gray-400'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const badgeClasses = cn(
    'inline-flex items-center rounded-full border font-medium',
    variants[variant],
    sizes[size],
    className
  );

  const dotClasses = cn(
    'rounded-full',
    {
      'w-1.5 h-1.5': size === 'sm',
      'w-2 h-2': size === 'md',
      'w-2.5 h-2.5': size === 'lg'
    },
    dotColors[variant]
  );

  return (
    <span className={badgeClasses} {...props}>
      {showDot && <div className={dotClasses} />}
      {Icon && <Icon className={iconSizes[size]} />}
      {children}
    </span>
  );
};

export default Badge;
