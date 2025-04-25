'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  if (isDashboardPage) {
    return null;
  }
  
  return <Footer />;
} 