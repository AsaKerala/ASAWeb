import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/lib/auth/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-zinc-50 to-zinc-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-zinc-50 to-zinc-100 p-4">
        <h1 className="text-2xl font-bold mb-4 text-zinc-800">Access Denied</h1>
        <p className="text-zinc-600 mb-6">Please log in to access your dashboard.</p>
        <Link 
          href="/auth/login" 
          className="px-5 py-2.5 bg-hinomaru-red text-white font-medium rounded-lg shadow-sm hover:bg-hinomaru-red/90 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content */}
      <div className="md:pl-64 pt-5">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          {children}
        </main>
      </div>
    </div>
  );
} 