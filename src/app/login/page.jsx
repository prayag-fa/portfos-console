"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/lib/context/AuthContext";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const { getCurrentThemeColors } = useTheme();
  const { login, isAuthenticated, isLoading } = useAuth();
  const colors = getCurrentThemeColors();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Login successful, redirect to dashboard
        router.push("/dashboard");
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

      // Show loading while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ 
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 50%, ${colors.primary[100]} 100%)` 
        }}>
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ 
                borderColor: `${colors.primary[200]} ${colors.primary[200]} ${colors.primary[200]} ${colors.primary[600]}` 
              }}></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin" style={{ 
                borderColor: `${colors.primary[200]} ${colors.primary[200]} ${colors.primary[200]} ${colors.primary[400]}`,
                animationDelay: '-0.5s' 
              }}></div>
            </div>
            <p className="mt-6 text-sm text-gray-600 font-medium">Loading your workspace...</p>
          </div>
        </div>
      );
    }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ 
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 50%, ${colors.primary[100]} 100%)` 
      }}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ 
            background: `linear-gradient(135deg, ${colors.primary[300]} 0%, ${colors.primary[400]} 100%)` 
          }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ 
            background: `linear-gradient(135deg, ${colors.secondary[300]} 0%, ${colors.secondary[400]} 100%)`,
            animationDelay: '2s' 
          }}></div>
          <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob" style={{ 
            background: `linear-gradient(135deg, ${colors.primary[200]} 0%, ${colors.secondary[200]} 100%)`,
            animationDelay: '4s' 
          }}></div>
        </div>

        <div className="relative z-10 w-full max-w-md px-6">
          {/* Main Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-xl shadow-lg" style={{ 
                  background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)` 
                }}></div>
                <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="h-8 w-8" style={{ color: colors.primary[600] }} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back
                </h1>
                <p className="mt-2 text-gray-600 text-sm">
                  Please sign in to access your account
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200" style={{ 
                      color: focusedField === 'username' ? colors.primary[600] : '#9CA3AF' 
                    }}>
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.username 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : focusedField === 'username'
                          ? 'shadow-sm'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        borderColor: focusedField === 'username' && !errors.username ? colors.primary[500] : undefined,
                        boxShadow: focusedField === 'username' && !errors.username ? `0 0 0 2px ${colors.primary[200]}` : undefined
                      }}
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200" style={{ 
                      color: focusedField === 'password' ? colors.primary[600] : '#9CA3AF' 
                    }}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-3 bg-white border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : focusedField === 'password'
                          ? 'shadow-sm'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        borderColor: focusedField === 'password' && !errors.password ? colors.primary[500] : undefined,
                        boxShadow: focusedField === 'password' && !errors.password ? `0 0 0 2px ${colors.primary[200]}` : undefined
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-200 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium transition-colors duration-200 hover:underline"
                  style={{ color: colors.primary[600] }}
                >
                  Forgot your password?
                </button>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative w-full flex justify-center items-center py-3 px-6 text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                      : 'hover:shadow-md active:scale-[0.98]'
                  }`}
                  style={{
                    backgroundColor: isSubmitting ? undefined : colors.primary[600],
                    ':hover': {
                      backgroundColor: colors.primary[700]
                    }
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-gray-700">Demo credentials</p>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Username:</span>
                    <code className="px-2 py-1 bg-white rounded text-gray-800 font-mono border">admin</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Password:</span>
                    <code className="px-2 py-1 bg-white rounded text-gray-800 font-mono border">password</code>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </>
  );
}
