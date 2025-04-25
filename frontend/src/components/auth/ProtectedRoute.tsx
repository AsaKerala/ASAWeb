'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '')}`);
    } else if (!isLoading && adminOnly && !isAdmin) {
      // If admin-only route but user is not admin
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, isLoading, router, pathname, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If authentication check is done and user is authenticated
  // For admin routes, also check if user is admin
  if (!isLoading && isAuthenticated && (!adminOnly || (adminOnly && isAdmin))) {
    return <>{children}</>;
  }

  // While redirecting or if auth failed, show nothing
  return null;
} 