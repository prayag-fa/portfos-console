'use client';

import React, { useCallback, useMemo, useState } from 'react';

import Link from 'next/link';

import {
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  SquareTerminal,
  User,
  Users,
  X
} from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/lib/context/AuthContext';
import { usePageContext } from '@/lib/context/PageContext';
import { useKeyboardNavigation } from '@/lib/utils/keyboardNavigation';

export default function Header() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { pageMetadata } = usePageContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use existing click outside hook
  const dropdownRef = useClickOutside(() => setShowDropdown(false));

  // Keyboard navigation for dropdown
  const dropdownShortcuts = useMemo(
    () => ({
      Escape: { action: 'close', description: 'Close dropdown' },
      Enter: { action: 'toggle', description: 'Toggle dropdown' },
      ArrowDown: { action: 'next', description: 'Next item' },
      ArrowUp: { action: 'previous', description: 'Previous item' }
    }),
    []
  );

  const handleDropdownAction = useCallback(
    action => {
      switch (action) {
        case 'close':
          setShowDropdown(false);
          break;
        case 'toggle':
          setShowDropdown(!showDropdown);
          break;
        default:
          break;
      }
    },
    [showDropdown]
  );

  useKeyboardNavigation(dropdownShortcuts, handleDropdownAction);

  // Use page metadata from context
  const { title: pageTitle, breadcrumbs } = pageMetadata;

  // Enhanced logout with loading state
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowDropdown(false);
    } catch {
      // Could show a toast notification here
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  // Profile actions
  const handleProfileAction = useCallback(() => {
    setShowDropdown(false);
    // TODO: Navigate to profile page
  }, []);

  const handleSettingsAction = useCallback(() => {
    setShowDropdown(false);
    // TODO: Navigate to settings page
  }, []);

  // Mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(!showMobileMenu);
  }, [showMobileMenu]);

  // Loading state for user data
  if (authLoading) {
    return (
      <div className='flex flex-col'>
        <header className='border-b border-gray-200 bg-white px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='h-8 w-48 animate-pulse rounded bg-gray-200' />
            <div className='h-10 w-32 animate-pulse rounded-full bg-gray-200' />
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <header className='border-b border-gray-200 bg-white p-4 sm:px-6'>
        <div className='flex items-center justify-between'>
          {/* Left side - Title and Mobile Menu */}
          <div className='flex items-center gap-4'>
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className='rounded-lg p-2 transition-all duration-150 ease-out hover:bg-gray-100 lg:hidden'
              aria-label='Toggle mobile menu'
            >
              {showMobileMenu ? (
                <X className='size-5 text-gray-600' />
              ) : (
                <Menu className='size-5 text-gray-600' />
              )}
            </button>

            {/* Page title */}
            <h1 className='truncate text-xl font-bold text-gray-900 sm:text-2xl'>{pageTitle}</h1>
          </div>

          {/* Right side - Actions and User */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* Search button (mobile) */}
            <button
              className='rounded-lg p-2 transition-all duration-150 ease-out hover:bg-gray-100 lg:hidden'
              aria-label='Search'
            >
              <Search className='size-5 text-gray-600' />
            </button>

            {/* User Profile Dropdown */}
            {user && (
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className='flex items-center gap-2 rounded-lg p-2 transition-all duration-150 ease-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:gap-3'
                  aria-expanded={showDropdown}
                  aria-haspopup='true'
                  aria-label='User menu'
                >
                  {/* User info - hidden on mobile */}
                  <div className='hidden text-right sm:block'>
                    <p className='max-w-24 truncate text-sm font-medium text-gray-900'>
                      {user.name}
                    </p>
                    <p className='max-w-24 truncate text-xs text-gray-500'>{user.role}</p>
                  </div>

                  {/* Avatar */}
                  <div className='bg-primary-600 flex size-8 shrink-0 items-center justify-center rounded-full'>
                    <span className='text-sm font-medium text-white'>
                      {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                  </div>

                  {/* Dropdown arrow */}
                  <ChevronDown
                    className={`size-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className='animate-in fade-in-0 zoom-in-95 absolute right-0 z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg'>
                    {/* User Info */}
                    <div className='border-b border-gray-100 px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary-100 flex size-10 shrink-0 items-center justify-center rounded-full'>
                          <User className='text-primary-700 size-5' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium text-gray-900'>{user.name}</p>
                          <p className='truncate text-xs text-gray-500'>{user.username}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className='py-1'>
                      <button
                        onClick={handleProfileAction}
                        className='flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
                      >
                        <User className='size-4 shrink-0' />
                        <span className='truncate'>Profile</span>
                      </button>

                      <button
                        onClick={handleSettingsAction}
                        className='flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none'
                      >
                        <Settings className='size-4 shrink-0' />
                        <span className='truncate'>Settings</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className='border-t border-gray-100 pt-1'>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className='flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 focus:bg-red-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <LogOut className='size-4 shrink-0' />
                        <span className='truncate'>
                          {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className='border-b border-gray-200 bg-white px-4 py-3 sm:px-6'>
          <nav className='scrollbar-hide flex items-center gap-1 overflow-x-auto text-sm'>
            <Link
              href='/dashboard'
              className='shrink-0 text-gray-500 transition-colors duration-200 hover:text-gray-700'
              aria-label='Go to dashboard'
            >
              <SquareTerminal className='text-primary-700 size-4' />
            </Link>

            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href || index}>
                <ChevronRight className='size-4 shrink-0 text-gray-400' />
                <Link
                  href={crumb.href}
                  className={`flex shrink-0 items-center gap-1 text-xs transition-colors duration-200 ${
                    crumb.isLast ? 'font-medium text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-current={crumb.isLast ? 'page' : undefined}
                >
                  {crumb.icon}
                  <span className='max-w-20 truncate sm:max-w-none'>{crumb.label}</span>
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden'>
          <div className='absolute right-0 top-0 h-full w-64 bg-white shadow-xl'>
            <div className='border-b border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-900'>Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className='rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100'
                  aria-label='Close menu'
                >
                  <X className='size-5 text-gray-600' />
                </button>
              </div>
            </div>

            <div className='p-4'>
              <nav className='space-y-2'>
                <Link
                  href='/dashboard'
                  className='flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-100'
                  onClick={toggleMobileMenu}
                >
                  <ChartNoAxesCombined className='size-5' />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href='/users'
                  className='flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-100'
                  onClick={toggleMobileMenu}
                >
                  <Users className='size-5' />
                  <span>Users</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
