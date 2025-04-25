'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { events as eventsApi, programs as programsApi } from '@/lib/api';
import { SafeImage } from '@/components/common';

// Define types for our data
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  keyFeatures?: {
    customLocation?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    isVirtual?: boolean;
    virtualLink?: string;
    eventDate?: string;
    startDate?: string;
    endDate?: string;
  };
  // Legacy fields for backward compatibility
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isVirtual?: boolean;
    virtualLink?: string;
  };
}

interface Program {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
}

// Define hardcoded featured programs
const hardcodedPrograms = [
  {
    id: '1',
    title: 'Training Programs in Japan',
    summary: 'Learn about the latest industrial and management techniques from top Japanese experts.',
    category: 'Training',
    slug: '/programs-events#training-programs'
  },
  {
    id: '2',
    title: 'Internships & Job Opportunities',
    summary: 'Gain exposure to the Japanese work environment through structured internship programs.',
    category: 'Internship',
    slug: '/programs-events#internships'
  },
  {
    id: '3',
    title: 'Language Training',
    summary: 'Enroll in Japanese language courses to enhance career prospects and communication.',
    category: 'Language',
    slug: '/programs-events#language-training'
  },
  {
    id: '4',
    title: 'Business Networking & Start-up Support',
    summary: 'Leverage our community to explore new business opportunities.',
    category: 'Networking',
    slug: '/programs-events#skill-development'
  },
  {
    id: '5',
    title: 'Training Programs in India',
    summary: 'Learn from a wide array of ASAK hosted programs for industries and professionals.',
    category: 'Training',
    slug: '/programs-events#training-programs'
  }
];

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>(hardcodedPrograms);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current date for filtering
        const today = new Date().toISOString();
        
        // Fetch upcoming events - using the eventDate field under keyFeatures
        const eventsResponse = await eventsApi.getAll({ 
          limit: 5, // Get more than needed so we can filter
          where: {
            status: {
              equals: 'published'
            },
            // Use keyFeatures.eventDate for filtering
            'keyFeatures.eventDate': {
              greater_than_equal: today
            }
          }
        });
        
        let fetchedEvents = eventsResponse.data.docs || [];
        
        
        // Sort events by date using all available date fields
        fetchedEvents.sort((a: Event, b: Event) => {
          const dateA = a.keyFeatures?.eventDate || a.keyFeatures?.startDate || a.startDate || today;
          const dateB = b.keyFeatures?.eventDate || b.keyFeatures?.startDate || b.startDate || today;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        
        // Take just the first 3 events after sorting
        setUpcomingEvents(fetchedEvents.slice(0, 3));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load events. Please try again later.');
        setUpcomingEvents([]);
      } finally {
        // Always use hardcoded programs regardless of API success/failure
        setFeaturedPrograms(hardcodedPrograms);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return { day: 'TBD', month: '', time: '' };
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const time = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' });
    
    return { day, month, time };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section id="banner" className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white py-32">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join ASA Kerala – Connect, Learn, and Grow
            </h1>
            <p className="text-xl mb-10">
              Explore training opportunities in Japan, business networking, and cultural exchange programs. Be part of an esteemed alumni association fostering Indo-Japanese relations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/membership"
                className="btn-primary"
              >
                Join Now
              </Link>
              <Link
                href="#welcome"
                className="bg-white text-hinomaru-red border border-white hover:bg-gray-100 px-6 py-3 rounded-washi font-medium transition duration-300"
              >
                Learn More
              </Link>
              <Link
                href="/programs-events"
                className="btn-secondary"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto">
            <div className="md:w-1/3 flex justify-center">
              <SafeImage 
                src="/assets/ASA-logo.png" 
                alt="ASA Kerala Logo" 
                width={200} 
                height={200} 
                className="object-contain"
                fallbackSrc="/assets/ASA-logo.png"
              />
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <h2 className="section-title">Welcome to ASA Kerala</h2>
              <div className="flex md:justify-start justify-center mb-8">
                <div className="w-20 h-1 bg-hinomaru-red"></div>
              </div>
              <p className="text-lg text-zen-700 leading-relaxed">
                ASA Kerala is the official alumni Association of AOTS Kerala, dedicated to fostering Indo-Japanese relations by sharing knowledge, skills, and experiences gained through AOTS training programs. Our organization serves as a hub for professionals, entrepreneurs, and students interested in Japanese management practices, industrial expertise, cultural exchange and in general, the Japanese way of life!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-zen-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-center">Mission Statement</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 leading-relaxed mb-6">
              Our mission is to:
            </p>
            <ul className="text-left text-lg text-zen-700 leading-relaxed space-y-4 max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Promote Japanese industrial knowledge and management techniques in Kerala.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Facilitate training programs, internships, and business opportunities between Japan and India.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Strengthen Indo-Japanese relationships through cultural and business collaborations.</span>
          </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Transfer learnings and best practices from Japan and India to the rest of the world, particularly other developing countries.</span>
          </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 bg-zen-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Featured Programs</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
          </div>

          {/* For Featured Programs, always show the data since it's hardcoded */}
          <div className="relative">
            {/* Decorative element - Horizontal line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-hinomaru-red via-sakura-500 to-hinomaru-red transform -translate-y-1/2 hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-6 relative z-10">
              {featuredPrograms.map((program, index) => (
                <div 
                  key={program.id}
                  className={`featured-program-item group relative mb-8 md:mb-0 transition-all duration-500 hover:scale-105 ${
                    index % 2 === 0 ? 'md:mt-8' : 'md:mb-8'
                  }`}
                >
                  {/* Mobile decorative element - left accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-hinomaru-red to-sakura-300 rounded-full md:hidden"></div>
                  
                  {/* Desktop timeline decorative elements */}
                  <div className="absolute left-1/2 -top-8 w-6 h-6 rounded-full bg-hinomaru-red transform -translate-x-1/2 hidden md:block"></div>
                  <div className="absolute left-1/2 bottom-full w-1 h-8 bg-hinomaru-red transform -translate-x-1/2 hidden md:block"></div>
                  
                  <div className="bg-white rounded-washi shadow-lg p-6 pl-8 md:pl-6 overflow-hidden border-t-4 border-hinomaru-red hover:shadow-xl transition-all duration-300">
                    <div className="relative z-10">
                      {/* Program category tag */}
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sakura-100 text-hinomaru-red mb-3">
                        {program.category || 'Program'}
                      </span>
                      
                      {/* Icon background - decorative */}
                      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 rounded-full bg-sakura-50 opacity-20"></div>
                      
                      {/* Program icon */}
                      <div className="mb-4 text-hinomaru-red relative z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      
                      {/* Program title */}
                      <h3 className="text-xl font-bold mb-3 text-zen-900 group-hover:text-hinomaru-red transition-colors duration-300">
                        {program.title}
                      </h3>
                      
                      {/* Program summary */}
                      <p className="text-zen-700 mb-4">
                        {program.summary}
                      </p>
                      
                      {/* Call to action */}
                      <Link 
                        href={program.slug} 
                        className="group-hover:bg-hinomaru-red group-hover:text-white text-hinomaru-red border border-hinomaru-red font-medium rounded-washi py-2 px-4 inline-flex items-center transition-all duration-300"
                      >
                        Learn more 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                    
                    {/* Decorative shape */}
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-sakura-50 rounded-tl-xl transform rotate-45 opacity-50"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Upcoming Events</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 max-w-2xl mx-auto">
              Stay updated with the latest activities, training programs, business delegations, and networking opportunities. Some of our upcoming events include:
            </p>
          </div>

          {isLoading ? (
            // Loading state - only for events section
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
            </div>
          ) : error ? (
            // Error state - only for events section
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition duration-300"
              >
                Try Again
              </button>
            </div>
          ) : (
            // Display events when available
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => {
                // Get the event date from either keyFeatures or legacy fields
                const eventDateString = event.keyFeatures?.eventDate || 
                                        event.keyFeatures?.startDate || 
                                        event.eventDate || 
                                        event.startDate;
                const startDate = formatEventDate(eventDateString);
                
                return (
                  <div key={index} className="japan-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-hinomaru-red text-white px-4 py-2 rounded-washi text-center">
                        <span className="block text-2xl font-bold">{startDate.day}</span>
                        <span className="text-sm">{startDate.month}</span>
                      </div>
                      <span className="text-zen-600 text-sm">{startDate.time}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{event.title}</h3>
                    <p className="text-zen-700 mb-4">
                      {event.summary}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-zen-600 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.keyFeatures?.customLocation ? event.keyFeatures.customLocation :
                          event.keyFeatures?.isVirtual || event.keyFeatures?.mode === 'online' ? 'Online' :
                          event.location?.isVirtual ? 'Online' :
                          event.location?.city || event.location?.name || 'TBD'}
                      </span>
                      <Link href={`/programs-events/${event.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                        Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              }) : (
                // If no events are available, show message
                <>
                  <div className="japan-card bg-gray-50">
                    <p className="text-gray-400 text-center py-8">No upcoming events</p>
                  </div>
                  <div className="japan-card bg-gray-50">
                    <p className="text-gray-400 text-center py-8">No upcoming events</p>
                  </div>
                  <div className="japan-card bg-gray-50">
                    <p className="text-gray-400 text-center py-8">No upcoming events</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/programs-events" 
              className="btn-primary"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white relative">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white text-opacity-90 text-lg">
            Become a member today to access exclusive resources, attend events, and connect with Japan enthusiasts across Kerala.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership/join"
              className="bg-white text-hinomaru-red px-8 py-3 rounded-washi font-medium hover:bg-gray-100 transition duration-300"
            >
              Become a Member
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-washi font-medium hover:bg-white/10 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
