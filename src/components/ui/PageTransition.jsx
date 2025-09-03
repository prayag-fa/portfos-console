'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsTransitioning(true);

      // Very small delay to prevent flash
      const timer = setTimeout(() => {
        setCurrentPath(pathname);
        setIsTransitioning(false);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [pathname, currentPath]);

  return (
    <div
      className={`transition-opacity duration-150 ease-out ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
