"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Search,
  Bell,
  Mail,
  ChevronRight,
  Home
} from "lucide-react";

export default function Navigation({ children }) {
  const pathname = usePathname();
  const { getCurrentThemeColors } = useTheme();
  const colors = getCurrentThemeColors();

  const getBreadcrumbLabel = (segment) => {
    switch (segment) {
      case "users":
        return "Users";
      case "journey":
        return "Journey";
      case "refresh":
        return "Refresh Details";
      default:
        return segment;
    }
  };

  const getBreadcrumbHref = (segments, index) => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  const getBreadcrumbIcon = (segment) => {
    switch (segment) {
      case "users":
        return <Users className="w-4 h-4" />;
      case "journey":
        return <BarChart3 className="w-4 h-4" />;
      case "refresh":
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPageTitle = (pathname) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    if (segments[0] === "users") {
      if (segments.length === 1) return "Users";
      if (segments.length === 2) return "User Journeys";
      if (segments[3] === "journey") return "Journey Timeline";
      if (segments[3] === "refresh") return "Refresh Details";
      return "User Details";
    }
    if (segments[0] === "dashboard") return "Dashboard";
    return "Dashboard";
  };

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: getBreadcrumbLabel(segment),
    href: getBreadcrumbHref(segments, index),
    icon: getBreadcrumbIcon(segment)
  }));

  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64" style={{ backgroundColor: colors.primary[600] }}>
        <div className="h-full flex flex-col text-white">
          {/* Logo */}
          <div className="p-6 border-b" style={{ borderColor: colors.primary[500] }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-sm" style={{ color: colors.primary[600] }}>P</span>
              </div>
              <span className="text-xl font-bold">Portfos Console</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "shadow-lg"
                    : "hover:bg-opacity-80"
                }`}
                style={{
                  backgroundColor: isActive("/dashboard") ? colors.primary[500] : "transparent",
                  color: isActive("/dashboard") ? "white" : colors.primary[100]
                }}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive("/users")
                    ? "shadow-lg"
                    : "hover:bg-opacity-80"
                }`}
                style={{
                  backgroundColor: isActive("/users") ? colors.primary[500] : "transparent",
                  color: isActive("/users") ? "white" : colors.primary[100]
                }}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </Link>
            </div>
          </nav>


          {/* Footer */}
          <div className="p-4 border-t" style={{ borderColor: colors.primary[500] }}>
            <div className="text-center" style={{ color: colors.primary[200] }}>
              <p className="text-xs">© 2024 All Rights Reserved</p>
              <p className="mt-1 text-xs">Made by Finarkein</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle(pathname)}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Johndoe</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary[500] }}>
                  <span className="text-white text-sm font-medium">J</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        {crumbs.length > 0 && (
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
              </Link>
              {crumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {crumb.icon}
                    <span>{crumb.label}</span>
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 