'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { news } from '@/lib/api';
import { News } from '@/lib/api/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SafeImage } from '@/components/common';

export default function AnnouncementsPage() {
  // State for announcements data
  const [announcements, setAnnouncements] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await news.getAll({
          where: { 
            isAnnouncement: { equals: true },
            status: { equals: 'published' }
          },
          sort: '-publishedDate',
          page,
          limit: 12
        });
        
        setAnnouncements(response.data.docs);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnnouncements();
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
          <h1 className="text-4xl font-bold">All Announcements</h1>
          <p className="text-lg mt-3 max-w-2xl">
            Regular updates on new training programs, business delegations, and other initiatives.
          </p>
        </div>
      </section>

      {/* Announcements Grid */}
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
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No announcements available at this time.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group border border-zinc-100">
                    <Link href={`/news/${announcement.slug}`}>
                      <div className="relative h-52">
                        {announcement.featuredImage ? (
                          <SafeImage
                            src={announcement.featuredImage.url}
                            alt={announcement.featuredImage.alt || announcement.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            fallbackSrc={announcement.featuredImage.url}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                            <span className="text-zinc-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-hinomaru-red text-white rounded-full">
                            Announcement
                          </span>
                          <span className="text-sm text-zinc-500">
                            {announcement.publishedDate ? format(new Date(announcement.publishedDate), 'MMM d, yyyy') : 'No date'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-hinomaru-red transition-colors text-zinc-900">
                          {announcement.title}
                        </h3>
                        <p className="text-zinc-700 mb-4 line-clamp-2">{announcement.summary}</p>
                        <div className="flex items-center text-hinomaru-red font-medium">
                          Read More
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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