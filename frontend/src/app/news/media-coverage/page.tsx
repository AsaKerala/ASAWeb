'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getMediaCoverage } from '@/api/content';
import { Media, MediaCoverage } from '@/types/content';
import YouTubePlayer from '@/components/YouTubePlayer';

// Utility function to extract YouTube ID from URL
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export default function MediaCoveragePage() {
  const [mediaCoverage, setMediaCoverage] = useState<MediaCoverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const fetchMediaCoverage = async () => {
      try {
        setLoading(true);
        const data = await getMediaCoverage();
        setMediaCoverage(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching media coverage:', err);
        setError('Failed to load media coverage. Please try again later.');
        if (err instanceof Error) {
          showBoundary(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMediaCoverage();
  }, [showBoundary]);

  return (
    <div>
      <PageHeader
        title="Media Coverage"
        subtitle="News features, interviews, and video coverage of ASA Kerala's activities and initiatives."
        backgroundImage="/images/page-headers/media-coverage-header.jpg"
      />

      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Featured Coverage</h2>
          <p className="text-zinc-700 max-w-3xl mb-10">
            Watch featured videos and media coverage of ASA Kerala's activities and public appearances.
          </p>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : mediaCoverage.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No media coverage available at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mediaCoverage.map((media) => {
                // Get YouTube ID from the appropriate field
                const youtubeId = media.youtubeID || 
                  (media.youtubeURL ? getYouTubeId(media.youtubeURL) : null);
                
                return (
                  <div key={media.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                    <div className="aspect-video relative">
                      {youtubeId ? (
                        <YouTubePlayer videoId={youtubeId} title={media.title} />
                      ) : (
                        <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                          <span className="text-zinc-500">Video Not Available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-hinomaru-red text-white rounded-full">
                          {media.mediaType || 'Media'}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {media.publishedDate ? format(new Date(media.publishedDate), 'MMM d, yyyy') : 'No date'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-zinc-900">{media.title}</h3>
                      {media.description && (
                        <p className="text-zinc-700 text-sm mb-4">{media.description}</p>
                      )}
                      {media.sourceURL && (
                        <a 
                          href={media.sourceURL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-hinomaru-red font-medium hover:underline inline-flex items-center"
                        >
                          Visit Source
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Press Mentions Section - If applicable */}
      <section className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Press Mentions</h2>
          <p className="text-zinc-700 max-w-3xl mb-10">
            ASA Kerala in print and digital media publications.
          </p>
          
          {/* Content would be similar to above, possibly filtered by mediaType */}
          <div className="text-center py-12 text-zinc-600">
            Press mentions section coming soon.
          </div>
        </div>
      </section>

      {/* Back to News Button */}
      <section className="py-10 bg-white">
        <div className="container-custom text-center">
          <Link href="/news" className="btn-outline inline-block text-zinc-900 hover:bg-hinomaru-red hover:text-white border-zinc-900 hover:border-hinomaru-red">
            Back to News
          </Link>
        </div>
      </section>
    </div>
  );
} 