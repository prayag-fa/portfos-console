"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getThemeColors, getThemeCSSVariables, currentTheme } from "@/lib/config/theme";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(currentTheme);

  // Apply theme CSS variables to document
  useEffect(() => {
    const cssVariables = getThemeCSSVariables(theme);
    const root = document.documentElement;
    
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);

  const getCurrentThemeColors = () => {
    return getThemeColors(theme);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    changeTheme,
    getCurrentThemeColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 