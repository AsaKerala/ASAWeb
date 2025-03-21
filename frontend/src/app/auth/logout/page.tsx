'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import Link from 'next/link';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Give a slight delay before redirecting to allow state to update
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (err) {
        console.error('Logout error:', err);
        setError('There was a problem logging out. Please try again.');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">Logging Out</h1>
        
        {error ? (
          <div className="mt-4">
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>
            <button
              onClick={() => logout().then(() => router.push('/'))}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600">Please wait while we log you out...</p>
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 