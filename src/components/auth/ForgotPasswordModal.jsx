'use client';

import { useState } from 'react';

import { CheckCircle, Mail, X } from 'lucide-react';

import { errorLogger } from '@/lib/utils/errorHandling';
export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      errorLogger.log(new Error('Password reset requested'), {
        context: 'ForgotPasswordModal',
        email
      });
      setIsSuccess(true);
    } catch (error) {
      errorLogger.log(error, { context: 'ForgotPasswordModal.handleSubmit' });
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-gray-200 p-6'>
          <h2 className='text-lg font-semibold text-gray-900'>
            {isSuccess ? 'Check your email' : 'Forgot your password?'}
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-400 transition-colors duration-200 hover:text-gray-600'
          >
            <X className='size-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {!isSuccess ? (
            <>
              <p className='mb-6 text-sm text-gray-600'>
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='email' className='mb-1 block text-sm font-medium text-gray-700'>
                    Email address
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <Mail className='size-5 text-gray-400' />
                    </div>
                    <input
                      id='email'
                      type='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`relative block w-full appearance-none rounded-md border px-3 py-2 pl-10 transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        error
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-gray-500 focus:ring-gray-500'
                      }`}
                      placeholder='Enter your email'
                    />
                  </div>
                  {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
                </div>

                <div className='flex gap-3 pt-2'>
                  <button
                    type='button'
                    onClick={handleClose}
                    className='flex-1 rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`bg-primary-700 flex-1 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ${
                      isLoading ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90'
                    }`}
                  >
                    {isLoading ? (
                      <div className='flex items-center justify-center'>
                        <div className='mr-2 size-4 animate-spin rounded-full border-b-2 border-white' />
                        Sending...
                      </div>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className='text-center'>
              <div className='mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle className='size-6 text-green-600' />
              </div>
              <h3 className='mb-2 text-lg font-medium text-gray-900'>Reset link sent!</h3>
              <p className='mb-6 text-sm text-gray-600'>
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your
                email and follow the instructions.
              </p>
              <button
                onClick={handleClose}
                className='bg-primary-700 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:opacity-90'
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
