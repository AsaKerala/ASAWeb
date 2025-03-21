'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth as authApi } from '@/lib/api';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // This would call the actual password reset API endpoint
      // For now we're mocking this since we don't have the actual endpoint
      // await authApi.requestPasswordReset(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setStatus('error');
      setErrorMessage(
        err?.response?.data?.message || 
        'Failed to send password reset link. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {status === 'success' ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            <h3 className="text-lg font-medium">Check your email</h3>
            <p className="mt-2">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 