'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already authenticated, redirect to dashboard or saved path
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, preparing to redirect');
      
      // Check if there's a saved redirect path
      const redirectPath = localStorage.getItem('auth-redirect');
      if (redirectPath) {
        console.log('Found saved redirect path:', redirectPath);
        localStorage.removeItem('auth-redirect'); // Clear it after use
        router.push(redirectPath);
      } else {
        console.log('No saved redirect path, going to dashboard');
        router.push('/dashboard'); // Default redirect
      }
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    console.log('Login attempt for email:', email);
    
    try {
      // Check if localStorage is working before attempting login
      try {
        localStorage.setItem('test-storage', 'test');
        const testValue = localStorage.getItem('test-storage');
        if (testValue !== 'test') {
          console.error('localStorage test failed - could not retrieve test value');
          throw new Error('Browser storage is not working correctly');
        }
        localStorage.removeItem('test-storage');
        console.log('localStorage test passed');
      } catch (storageError) {
        console.error('localStorage access error:', storageError);
        setError('Browser storage access is blocked. Please check your privacy settings and try again.');
        setIsLoading(false);
        return;
      }
      
      await login(email, password);
      console.log('Login successful');
      
      // After successful login, redirect to the stored path or dashboard
      const redirectPath = localStorage.getItem('auth-redirect');
      if (redirectPath) {
        console.log('Redirecting to:', redirectPath);
        localStorage.removeItem('auth-redirect'); // Clear it after use
        router.push(redirectPath);
      } else {
        console.log('Redirecting to dashboard');
        router.push('/dashboard'); // Default redirect
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Extract error details for more helpful messages
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (err.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        // Log detailed error for debugging
        console.error('Login error details:', {
          status: err.response.status,
          data: err.response.data,
          message: err.response.data?.message || err.message
        });
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
        console.error('Login network error:', err.request);
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Login to Your Account</h1>
          <p className="mt-2 text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

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
              className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/reset-password" className="text-hinomaru-red hover:text-red-800">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hinomaru-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-hinomaru-red hover:text-red-800 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 