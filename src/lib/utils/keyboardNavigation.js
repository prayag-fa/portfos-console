"use client";

import { useEffect, useCallback, useState } from "react";

// Keyboard shortcuts configuration
export const KEYBOARD_SHORTCUTS = {
  // Navigation
  "g d": { action: "navigate", target: "/dashboard", description: "Go to Dashboard" },
  "g u": { action: "navigate", target: "/users", description: "Go to Users" },
  
  // Actions
  "r": { action: "refresh", description: "Refresh current data" },
  "s": { action: "search", description: "Focus search input" },
  "f": { action: "filter", description: "Focus filter dropdown" },
  "c": { action: "clear", description: "Clear filters" },
  
  // Help
  "?": { action: "help", description: "Show keyboard shortcuts" },
  
  // General
  "Escape": { action: "escape", description: "Close modal/dialog" },
  "Enter": { action: "confirm", description: "Confirm action" },
  "Space": { action: "toggle", description: "Toggle selection" }
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (shortcuts = {}, onAction) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Build key combination string
    let keyCombo = "";
    if (ctrl) keyCombo += "ctrl+";
    if (shift) keyCombo += "shift+";
    if (alt) keyCombo += "alt+";
    keyCombo += key;

    // Check for exact match first
    if (shortcuts[keyCombo]) {
      event.preventDefault();
      onAction?.(shortcuts[keyCombo], event);
      return;
    }

    // Check for key-only match (for single keys)
    if (shortcuts[key]) {
      event.preventDefault();
      onAction?.(shortcuts[key], event);
      return;
    }
  }, [shortcuts, onAction]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { handleKeyDown };
};

// Hook for focus management
export const useFocusManagement = () => {
  const focusFirstElement = useCallback((containerRef) => {
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, []);

  const trapFocus = useCallback((containerRef) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, []);

  return { focusFirstElement, trapFocus };
};

// Hook for table keyboard navigation
export const useTableKeyboardNavigation = (data, onRowSelect, onRowAction) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleTableKeyDown = useCallback((event) => {
    if (!data || data.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, data.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < data.length) {
          onRowAction?.(data[selectedIndex]);
        }
        break;
      case "Home":
        event.preventDefault();
        setSelectedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setSelectedIndex(data.length - 1);
        break;
    }
  }, [data, onRowAction]);

  useEffect(() => {
    document.addEventListener("keydown", handleTableKeyDown);
    return () => {
      document.removeEventListener("keydown", handleTableKeyDown);
    };
  }, [handleTableKeyDown]);

  return { selectedIndex, setSelectedIndex };
};

// Utility to check if element is focusable
export const isFocusable = (element) => {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const tabIndex = element.getAttribute("tabindex");
  
  // Elements that are naturally focusable
  if (["input", "select", "textarea", "button", "a"].includes(tagName)) {
    return true;
  }
  
  // Elements with tabindex >= 0
  if (tabIndex !== null && parseInt(tabIndex) >= 0) {
    return true;
  }
  
  return false;
};

// Utility to get all focusable elements
export const getFocusableElements = (container) => {
  if (!container) return [];
  
  return Array.from(container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter(isFocusable);
};
