'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login...');
      const user = await login(email, password);
      console.log('Login successful, checking user role...');
      
      // Determine redirect destination based on user role
      let redirectPath = returnTo;
      
      // If user is admin and not explicitly returning to another page, go to admin dashboard
      if (user?.role === 'admin' && returnTo === '/dashboard') {
        redirectPath = '/admin-dashboard';
        console.log('Admin user detected, redirecting to admin dashboard');
      } else {
        console.log('Redirecting to:', redirectPath);
      }
      
      // Add a small delay to ensure localStorage and cookies are properly set
      // before redirecting to the dashboard
      setTimeout(() => {
        console.log('Redirecting after delay...');
        
        // Verify token is stored before redirecting
        const token = localStorage.getItem('payload-token');
        console.log('Before redirect - Token exists:', !!token);
        
        // Use window.location for a full page navigation instead of Next.js router
        // This ensures a complete page reload with the new authentication state
        window.location.href = redirectPath;
      }, 1000); // Increased to 1000ms for more reliability
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.response?.data?.errors) {
        // Detailed API error
        setError(Object.values(err.response.data.errors).join(', '));
      } else if (err?.response?.data?.message) {
        // Simple API error message
        setError(err.response.data.message);
      } else if (err?.message) {
        // JavaScript error
        setError(err.message);
      } else {
        // Fallback
        setError('Failed to login. Please check your credentials and try again.');
      }
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
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

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
              {isLoading ? 'Logging in...' : 'Login'}
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