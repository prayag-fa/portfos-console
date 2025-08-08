"use client";

import { useTheme as useThemeContext } from "@/lib/context/ThemeContext";

export const useTheme = () => {
  const themeContext = useThemeContext();
  
  if (!themeContext) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return themeContext;
}; 