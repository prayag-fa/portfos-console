import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../lib/utils/componentFactory';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footer,
  ...props
}) => {
  const modalRef = useRef(null);
  const overlayRef = useClickOutside(closeOnOverlayClick ? onClose : null);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0'>
        {/* Background overlay */}
        <div
          ref={overlayRef}
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          aria-hidden='true'
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={cn(
            'inline-block w-full overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all',
            sizes[size],
            className
          )}
          role='dialog'
          aria-modal='true'
          aria-labelledby={title ? 'modal-title' : undefined}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div
              className={cn(
                'flex items-center justify-between border-b border-gray-200 p-6',
                headerClassName
              )}
            >
              {title && (
                <h3 id='modal-title' className='text-lg font-semibold text-gray-900'>
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className='rounded-lg p-1 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600'
                  aria-label='Close modal'
                >
                  <X className='size-5' />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={cn('p-6', bodyClassName)}>{children}</div>

          {/* Footer */}
          {footer && (
            <div className='flex items-center justify-end space-x-3 border-t border-gray-200 p-6'>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
