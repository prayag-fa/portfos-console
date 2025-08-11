"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { useAuth } from "@/lib/context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  LogOut,
  User
} from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const { getCurrentThemeColors } = useTheme();
  const { user, logout } = useAuth();
  const colors = getCurrentThemeColors();

  const isActive = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Links */}
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
    </div>
  );
} 