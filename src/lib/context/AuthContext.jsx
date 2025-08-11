"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    // Simple credential check
    if (username === "admin" && password === "password") {
      const userData = {
        id: 1,
        username: "admin",
        name: "Administrator",
        role: "admin",
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } else {
      return { 
        success: false, 
        error: "Invalid username or password" 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const requireAuth = (callback) => {
    if (!isAuthenticated()) {
      router.push("/login");
      return false;
    }
    return callback ? callback() : true;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    requireAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
