'use client';

import { useEffect, useRef, useState } from 'react';

export default function Tooltip({
  children,
  content,
  position = 'top',
  className = '',
  delay = 200
}) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = e => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className='relative inline-block'
    >
      {children}
      <div
        ref={tooltipRef}
        className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 ease-out ${getPositionClasses()} ${className} ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {content}
        {/* Arrow */}
        <div
          className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top'
              ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1'
              : position === 'bottom'
                ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1'
                : position === 'left'
                  ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1'
                  : 'right-full top-1/2 -translate-y-1/2 translate-x-1'
          }`}
        />
      </div>
    </div>
  );
}
