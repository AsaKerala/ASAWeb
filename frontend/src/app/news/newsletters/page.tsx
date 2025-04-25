'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { news } from '@/lib/api';
import { News, Media } from '@/lib/api/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewslettersPage() {
  // State for newsletters data
  const [newsletters, setNewsletters] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        const response = await news.getAll({
          where: { 
            category: { equals: 'newsletter' },
            status: { equals: 'published' }
          },
          sort: '-publishedDate',
          page,
          limit: 16
        });
        
        setNewsletters(response.data.docs);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching newsletters:', err);
        setError('Failed to load newsletters. Please try again later.');
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [page]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-zinc-900 text-white py-12">
        <div className="container-custom">
          <Link href="/news" className="inline-flex items-center text-white mb-4 hover:text-hinomaru-red transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News & Updates
          </Link>
          <h1 className="text-4xl font-bold">Newsletter Archive</h1>
          <p className="text-lg mt-3 max-w-2xl">
            Access past newsletters containing insights, interviews, and industry updates.
          </p>
        </div>
      </section>

      {/* Newsletters Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No newsletters available at this time.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group border border-zinc-100">
                    <Link 
                      href={newsletter.attachments && newsletter.attachments.length > 0 
                        ? (newsletter.attachments[0] as unknown as Media).url 
                        : `/news/${newsletter.slug}`}
                      target={newsletter.attachments && newsletter.attachments.length > 0 ? "_blank" : "_self"}
                    >
                      <div className="p-5">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-hinomaru-red rounded-full flex items-center justify-center mb-4 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v12a2 2 0 002 2h5zm-3-4h3" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-hinomaru-red transition-colors text-zinc-900">
                            {newsletter.title}
                          </h3>
                          <p className="text-sm text-zinc-500 mb-3">
                            {newsletter.publishedDate ? format(new Date(newsletter.publishedDate), 'MMMM yyyy') : 'No date'}
                          </p>
                          <span className="text-hinomaru-red font-medium text-sm group-hover:underline">
                            {newsletter.attachments && newsletter.attachments.length > 0 
                              ? 'Download PDF' 
                              : 'View Newsletter'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`p-2 rounded ${page === 1 ? 'text-zinc-400 cursor-not-allowed' : 'text-zinc-700 hover:bg-zinc-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded ${pageNum === page ? 'bg-hinomaru-red text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className={`p-2 rounded ${page === totalPages ? 'text-zinc-400 cursor-not-allowed' : 'text-zinc-700 hover:bg-zinc-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
} 