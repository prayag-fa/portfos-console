'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowRight, Eye, EyeOff, Lock, Shield, User } from 'lucide-react';

import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import { useAuth } from '@/lib/context/AuthContext';
import { errorLogger } from '@/lib/utils/errorHandling';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
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
        router.push('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      errorLogger.log(error, { context: 'LoginPage.handleSubmit' });
      setErrors({ general: 'Login failed. Please try again.' });
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
      <div className='from-primary-50 via-secondary-50 to-primary-100 flex min-h-screen items-center justify-center bg-gradient-to-br'>
        <div className='text-center'>
          <div className='relative'>
            <div className='border-primary-200 border-t-primary-700 size-16 animate-spin rounded-full border-4' />
            <div
              className='border-primary-200 border-t-primary-400 absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent'
              style={{ animationDelay: '-0.5s' }}
            />
          </div>
          <p className='mt-6 text-sm font-medium text-gray-600'>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='from-primary-50 via-secondary-50 to-primary-100 relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br'>
        {/* Background decorative elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='from-primary-300 to-primary-400 absolute -right-40 -top-40 size-80 rounded-full bg-gradient-to-br opacity-20 mix-blend-multiply blur-xl' />
          <div
            className='from-secondary-300 to-secondary-400 absolute -bottom-40 -left-40 size-80 rounded-full bg-gradient-to-br opacity-20 mix-blend-multiply blur-xl'
            style={{ animationDelay: '2s' }}
          />
          <div
            className='from-primary-200 to-secondary-200 absolute left-40 top-40 size-80 rounded-full bg-gradient-to-br opacity-15 mix-blend-multiply blur-xl'
            style={{ animationDelay: '4s' }}
          />
        </div>

        <div className='relative z-10 w-full max-w-md px-6'>
          {/* Main Login Card */}
          <div className='space-y-8 rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-xl'>
            {/* Header */}
            <div className='space-y-4 text-center'>
              <div className='relative mx-auto size-16'>
                <div className='from-primary-700 to-primary-700 absolute inset-0 rounded-xl bg-gradient-to-br shadow-lg' />
                <div className='absolute inset-2 flex items-center justify-center rounded-lg bg-white'>
                  <Shield className='text-primary-700 size-8' />
                </div>
              </div>
              <div>
                <h1 className='text-2xl font-semibold text-gray-900'>Welcome back</h1>
                <p className='mt-2 text-sm text-gray-600'>Please sign in to access your account</p>
              </div>
            </div>

            {/* Login Form */}
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div className='space-y-5'>
                {/* Username Field */}
                <div className='space-y-2'>
                  <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                    Username
                  </label>
                  <div className='group relative'>
                    <div
                      className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                        focusedField === 'username' ? 'text-primary-700' : 'text-gray-400'
                      }`}
                    >
                      <User className='size-5' />
                    </div>
                    <input
                      id='username'
                      name='username'
                      type='text'
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full rounded-lg border bg-white py-3 pl-12 pr-4 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                        errors.username
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : focusedField === 'username'
                            ? 'border-primary-600 focus:border-primary-600 focus:ring-primary-600/20 shadow-sm'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder='Enter your username'
                    />
                  </div>
                  {errors.username && <p className='text-sm text-red-600'>{errors.username}</p>}
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                    Password
                  </label>
                  <div className='group relative'>
                    <div
                      className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                        focusedField === 'password' ? 'text-primary-700' : 'text-gray-400'
                      }`}
                    >
                      <Lock className='size-5' />
                    </div>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full rounded-lg border bg-white px-12 py-3 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : focusedField === 'password'
                            ? 'border-primary-600 focus:border-primary-600 focus:ring-primary-600/20 shadow-sm'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder='Enter your password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600'
                    >
                      {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
                    </button>
                  </div>
                  {errors.password && <p className='text-sm text-red-600'>{errors.password}</p>}
                </div>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                  <div className='flex items-center gap-2'>
                    <div className='flex size-5 items-center justify-center rounded-full bg-red-100'>
                      <span className='text-xs text-red-600'>!</span>
                    </div>
                    <p className='text-sm text-red-600'>{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 ${
                  isSubmitting
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-primary-700 hover:bg-primary-700 active:bg-primary-700 shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className='size-4 animate-spin rounded-full border-b-2 border-white' />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className='size-4' />
                  </>
                )}
              </button>

              {/* Forgot Password Link */}
              <div className='text-center'>
                <button
                  type='button'
                  onClick={handleForgotPassword}
                  className='text-primary-700 hover:text-primary-700 text-sm transition-colors duration-200'
                >
                  Forgot your password?
                </button>
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
    </>
  );
}
