"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardNavigation } from "@/lib/utils/keyboardNavigation";
import { usePageContext } from "@/lib/context/PageContext";
import { 
  Users, 
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  SquareTerminal,
  Settings,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";





export default function Header() {
  const { getCurrentThemeColors } = useTheme();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { pageMetadata } = usePageContext();
  const colors = getCurrentThemeColors();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use existing click outside hook
  const dropdownRef = useClickOutside(() => setShowDropdown(false));

  // Keyboard navigation for dropdown
  const dropdownShortcuts = useMemo(() => ({
    Escape: { action: "close", description: "Close dropdown" },
    Enter: { action: "toggle", description: "Toggle dropdown" },
    ArrowDown: { action: "next", description: "Next item" },
    ArrowUp: { action: "previous", description: "Previous item" }
  }), []);

  const handleDropdownAction = useCallback((action) => {
    switch (action) {
      case "close":
        setShowDropdown(false);
        break;
      case "toggle":
        setShowDropdown(!showDropdown);
        break;
      default:
        break;
    }
  }, [showDropdown]);

  useKeyboardNavigation(dropdownShortcuts, handleDropdownAction);

  // Use page metadata from context
  const { title: pageTitle, breadcrumbs } = pageMetadata;

  // Enhanced logout with loading state
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout failed:", error);
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
      <div className="flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-10 bg-gray-200 rounded-full animate-pulse w-32"></div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Page title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Right side - Actions and User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search button (mobile) */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

          

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={showDropdown}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  {/* User info - hidden on mobile */}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-24">
                      {user.role}
                    </p>
                  </div>

                  {/* Avatar */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                    style={{ backgroundColor: colors.primary[500] }}
                  >
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0) || user.username?.charAt(0) || "U"}
                    </span>
                  </div>

                  {/* Dropdown arrow */}
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      showDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in-0 zoom-in-95">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                          style={{ backgroundColor: colors.primary[100] }}
                        >
                          <User className="w-5 h-5" style={{ color: colors.primary[600] }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={handleProfileAction}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:bg-gray-100"
                      >
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Profile</span>
                      </button>
                      
                      <button
                        onClick={handleSettingsAction}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Settings</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {isLoggingOut ? "Signing out..." : "Sign out"}
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
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex-shrink-0"
              aria-label="Go to dashboard"
            >
              <SquareTerminal className="w-4 h-4" style={{ color: colors.primary[600] }} />
            </Link>
            
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href || index}>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Link
                  href={crumb.href}
                  className={`flex items-center gap-1 text-xs transition-colors duration-200 flex-shrink-0 ${
                    crumb.isLast 
                      ? "text-gray-900 font-medium" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-current={crumb.isLast ? "page" : undefined}
                >
                  {crumb.icon}
                  <span className="truncate max-w-20 sm:max-w-none">
                    {crumb.label}
                  </span>
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={toggleMobileMenu}
                >
                  <ChartNoAxesCombined className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  href="/users"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={toggleMobileMenu}
                >
                  <Users className="w-5 h-5" />
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