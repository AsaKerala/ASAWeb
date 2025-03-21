'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth as authApi } from '@/lib/api';

export default function ResetPasswordConfirmPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid' | 'submitting' | 'success' | 'error'>('validating');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const { token } = params;

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // This would call the actual token validation API endpoint
        // For now we're mocking this since we don't have the actual endpoint
        // await authApi.validateResetToken(token);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, invalidate tokens that are obviously wrong
        if (token.length < 10) {
          setStatus('invalid');
          setErrorMessage('This password reset link is invalid or has expired.');
          return;
        }
        
        setStatus('valid');
      } catch (err: any) {
        console.error('Token validation error:', err);
        setStatus('invalid');
        setErrorMessage(
          err?.response?.data?.message || 
          'This password reset link is invalid or has expired.'
        );
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    
    setErrorMessage('');
    setStatus('submitting');

    try {
      // This would call the actual password reset confirmation API endpoint
      // For now we're mocking this since we don't have the actual endpoint
      // await authApi.resetPassword(token, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setStatus('error');
      setErrorMessage(
        err?.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    }
  };

  // Show loading state while validating token
  if (status === 'validating') {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="mt-2 text-gray-600">Validating your reset link...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (status === 'invalid') {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
          </div>
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            <h3 className="text-lg font-medium">Invalid Reset Link</h3>
            <p className="mt-2">{errorMessage}</p>
            <div className="mt-4">
              <Link
                href="/auth/reset-password"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Request a new password reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message after password is reset
  if (status === 'success') {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Password Reset Complete</h1>
          </div>
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            <h3 className="text-lg font-medium">Success!</h3>
            <p className="mt-2">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Go to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the password reset form
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your new password below
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 