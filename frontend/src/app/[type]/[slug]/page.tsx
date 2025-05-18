'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DynamicPageParams {
  params: {
    type: string;
    slug: string;
  };
}

export default function DynamicPage({ params }: DynamicPageParams) {
  const { type, slug } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate the type parameter
    if (type !== 'programs' && type !== 'events') {
      setError('Invalid page type requested');
      setIsLoading(false);
      return;
    }

    // Redirect to the appropriate page
    // The actual item content should be handled by the respective pages:
    // - /programs/[slug]
    // - /events/[slug]
    router.push(`/${type}/${slug}`);

  }, [type, slug, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="container-custom max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-hinomaru-red">Redirecting...</h1>
        
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-zen-50 p-8 rounded-washi mb-8">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-lg mb-6">
              The page you are looking for doesn't exist. Please check our Programs and Events pages.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/programs" className="btn-primary">
                Go to Programs
              </Link>
              <Link href="/events" className="btn-secondary">
                Go to Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 