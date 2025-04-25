'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { events as eventsApi } from '@/lib/api';
import { SafeImage } from '@/components/common';

// Define types for our data
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category?: string;
  programCategory?: string;
  categories?: Array<{ id: string; name: string }>;
  startDate: string;
  endDate?: string;
  location?: {
    name?: string;
    city?: string;
    isVirtual: boolean;
    virtualLink?: string;
  };
  featuredImage?: {
    url: string;
    alt?: string;
  };
}

// Define category labels for display purposes
const CATEGORY_LABELS: Record<string, string> = {
  'training-programs': 'Training Programs',
  'language-training': 'Language Training',
  'internships': 'Internships',
  'skill-development': 'Skill Development',
  'cultural-activities': 'Cultural Activities'
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const categoryTitle = CATEGORY_LABELS[categorySlug] || 'Programs';
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch events for the specific category using programCategory field
        const eventsResponse = await eventsApi.getAll({
          limit: 100,
          where: {
            status: {
              equals: 'published'
            },
            programCategory: {
              equals: categorySlug
            }
          }
        });
        
        setEvents(eventsResponse.data.docs || []);
      } catch (err) {
        console.error(`Error fetching events for category ${categorySlug}:`, err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug]);

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{categoryTitle}</h1>
            <p className="text-xl mb-8">
              Explore All Our {categoryTitle}
            </p>
            <p className="text-lg mb-10">
              Discover our complete range of {categoryTitle.toLowerCase()} designed to enhance your knowledge, skills, and cultural understanding.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/programs-events"
                className="btn-white"
              >
                Back to All Programs
              </Link>
              <Link
                href="/contact"
                className="btn-outline-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <section className="py-16 bg-zinc-50">
          <div className="container-custom">
            <h2 className="section-title mb-8">Available {categoryTitle}</h2>
            <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
              Browse through our current offerings and find the perfect program that matches your interests and development goals.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {events.map(event => (
                <div key={event.id} className="japan-card transition-transform duration-300 hover:-translate-y-2">
                  {event.featuredImage && (
                    <div className="mb-4 h-40 relative overflow-hidden rounded-washi">
                      <SafeImage 
                        src={event.featuredImage.url} 
                        alt={event.title} 
                        fill 
                        className="object-cover"
                        fallbackSrc={event.featuredImage.url}
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-zen-900">{event.title}</h3>
                  <p className="text-zen-700 mb-4">{event.summary}</p>
                  <Link href={`/programs-events/${event.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}

              {/* Show message if no programs are available */}
              {events.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-zinc-500">No {categoryTitle.toLowerCase()} available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Our {categoryTitle}?</h2>
            <p className="text-lg mb-8">
              Contact us to learn more about our upcoming programs or to discuss customized options for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/membership/join"
                className="btn-white"
              >
                Become a Member
              </Link>
              <Link
                href="/contact"
                className="btn-outline-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 