'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/lib/auth/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isClientReady, setIsClientReady] = useState(false);
  
  // Client-side check for token after component mounts
  useEffect(() => {
    setIsClientReady(true);
  }, []);
  
  // If we've done client-side checks and user is not authenticated, redirect
  useEffect(() => {
    if (isClientReady && !isLoading && !isAuthenticated) {
      console.log('Dashboard layout: Not authenticated, redirecting');
      router.push('/auth/login?returnTo=/dashboard');
    }
  }, [isLoading, isAuthenticated, isClientReady, router]);
  
  // Show loading state while authentication is in progress
  if (isLoading || !isClientReady || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
        <p className="mt-4 text-zinc-600">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Once authenticated and loaded, show the dashboard
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50">
      {user && <DashboardSidebar user={user} />}
      <main className="flex-1 p-6 md:p-8 md:ml-64 pt-20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 