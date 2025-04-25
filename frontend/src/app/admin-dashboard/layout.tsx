'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAdminAccess } from '@/lib/auth/auth';
import Link from 'next/link';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        console.log('AdminDashboardLayout - Verifying admin access');
        const hasAccess = await checkAdminAccess();
        console.log('AdminDashboardLayout - Admin access check result:', hasAccess);
        
        if (!hasAccess) {
          console.log('AdminDashboardLayout - No admin access, redirecting to login');
          // Redirect to login if not admin
          router.push('/login?callbackUrl=/admin-dashboard');
          return;
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error checking admin access:", err);
        setError("Failed to verify admin access. Please try again.");
        setIsLoading(false);
      }
    };

    verifyAdminAccess();
  }, [router]);

  // Navigation links for admin dashboard
  const navLinks = [
    { href: '/admin-dashboard', label: 'Dashboard' },
    { href: '/admin-dashboard/bookings', label: 'Bookings' },
    { href: '/admin-dashboard/events', label: 'Events' },
    { href: '/admin-dashboard/activity', label: 'Activity' },
    { href: '/dashboard', label: 'User Dashboard' },
    { href: '/', label: 'Website' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Access Error</h2>
          <p className="text-zinc-700 mb-6">{error}</p>
          <div className="flex justify-center">
            <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-hinomaru-red hover:bg-hinomaru-red/90">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-gradient-to-r from-hinomaru-red to-sakura-700 shadow-md">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">ASA Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-white hover:text-zinc-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href={`${process.env.NEXT_PUBLIC_API_URL}/admin`} 
                target="_blank"
                className="bg-white text-hinomaru-red px-3 py-1 rounded-md hover:bg-zinc-100"
              >
                Payload CMS
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <main>{children}</main>
    </div>
  );
} 