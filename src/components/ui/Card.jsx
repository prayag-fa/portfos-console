import { cn } from '../../lib/utils/componentFactory';

const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  padding = 'md',
  shadow = 'sm',
  border = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const cardClasses = cn(
    'rounded-lg bg-white transition-all duration-200 ease-out hover:shadow-md',
    {
      'border border-gray-200': border
    },
    shadows[shadow],
    className
  );

  const headerClasses = cn(
    'flex items-center justify-between',
    {
      'pb-4': padding !== 'none',
      'border-b border-gray-200': padding !== 'none'
    },
    headerClassName
  );

  const bodyClasses = cn(
    {
      [paddings[padding]]: !header && !footer,
      'px-4 py-3': header && !footer,
      'px-4 py-3': !header && footer,
      'px-4 py-3': header && footer
    },
    bodyClassName
  );

  const footerClasses = cn(
    'flex items-center justify-end space-x-3',
    {
      'pt-4': padding !== 'none',
      'border-t border-gray-200': padding !== 'none'
    },
    footerClassName
  );

  return (
    <div className={cardClasses} {...props}>
      {/* Custom Header */}
      {header && <div className={headerClasses}>{header}</div>}

      {/* Default Header */}
      {!header && (title || subtitle) && (
        <div className={cn(headerClasses, 'px-4 py-3')}>
          <div>
            {title && <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>}
            {subtitle && <p className='mt-1 text-sm text-gray-600'>{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Body */}
      <div className={bodyClasses}>{children}</div>

      {/* Footer */}
      {footer && <div className={cn(footerClasses, 'px-4 py-3')}>{footer}</div>}
    </div>
  );
};

export default Card;
