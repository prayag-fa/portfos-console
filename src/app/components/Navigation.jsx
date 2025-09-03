'use client';

import { useCallback } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { LayoutDashboard, Users } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = href => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const handleNavigation = useCallback(
    href => {
      // Minimal delay to prevent flash
      setTimeout(() => {
        router.push(href);
      }, 50);
    },
    [router]
  );

  return (
    <div className='flex h-full flex-col'>
      {/* Navigation Links */}
      <nav className='flex-1 p-4'>
        <div className='space-y-2'>
          <button
            onClick={() => handleNavigation('/dashboard')}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-150 ease-out w-full text-left ${
              isActive('/dashboard')
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-primary-100 hover:bg-primary-700 hover:bg-opacity-80 hover:text-white'
            }`}
          >
            <LayoutDashboard className='size-5' />
            <span className='font-medium'>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation('/users')}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-150 ease-out w-full text-left ${
              isActive('/users')
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-primary-100 hover:bg-primary-600 hover:bg-opacity-80 hover:text-white'
            }`}
          >
            <Users className='size-5' />
            <span className='font-medium'>Users</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
