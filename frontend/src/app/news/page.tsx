'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { news, events, galleryApi } from '@/lib/api';
import { News as BaseNews, Event, Media } from '@/lib/api/types';
import YouTubePlayer from '@/components/YouTubePlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SafeImage } from '@/components/common';

// Extend News type to include attachments
interface News extends BaseNews {
  attachments?: Media[];
}

// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function NewsPage() {
  // State for each section's data
  const [announcements, setAnnouncements] = useState<News[]>([]);
  const [newsletters, setNewsletters] = useState<News[]>([]);
  const [mediaCoverage, setMediaCoverage] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    announcements: true,
    newsletters: true,
    mediaCoverage: true,
    upcomingEvents: true,
    pastEvents: true
  });

  // Error states
  const [error, setError] = useState<{
    announcements: string | null,
    newsletters: string | null,
    mediaCoverage: string | null,
    upcomingEvents: string | null,
    pastEvents: string | null
  }>({
    announcements: null,
    newsletters: null,
    mediaCoverage: null,
    upcomingEvents: null,
    pastEvents: null
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch announcements
        const announcementsRes = await news.getAnnouncements();
        setAnnouncements(announcementsRes.data.docs);
        setLoading(prev => ({ ...prev, announcements: false }));
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError(prev => ({ ...prev, announcements: 'Failed to load announcements' }));
        setLoading(prev => ({ ...prev, announcements: false }));
      }

      try {
        // Fetch newsletters
        const newslettersRes = await news.getNewsletters();
        setNewsletters(newslettersRes.data.docs);
        setLoading(prev => ({ ...prev, newsletters: false }));
      } catch (err) {
        console.error('Error fetching newsletters:', err);
        setError(prev => ({ ...prev, newsletters: 'Failed to load newsletters' }));
        setLoading(prev => ({ ...prev, newsletters: false }));
      }

      try {
        // Fetch YouTube videos from gallery
        const mediaCoverageRes = await galleryApi.getYouTubeVideos();
        setMediaCoverage(mediaCoverageRes.data.docs);
        setLoading(prev => ({ ...prev, mediaCoverage: false }));
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
        setError(prev => ({ ...prev, mediaCoverage: 'Failed to load YouTube videos' }));
        setLoading(prev => ({ ...prev, mediaCoverage: false }));
      }

      try {
        // Fetch all events and filter client-side
        const eventsRes = await news.getUpcomingEvents();
        const allEvents = eventsRes.data.docs || [];
        
        // Get current date for comparison
        const currentDate = new Date();
        
        // Filter and sort events
        const upcoming: Event[] = [];
        const past: Event[] = [];
        
        // Process each event
        allEvents.forEach((event: Event) => {
          // Get the appropriate date for comparison
          let eventDate = null;
          
          // Check keyFeatures first
          if (event.keyFeatures) {
            if (event.keyFeatures.eventDate) {
              eventDate = new Date(event.keyFeatures.eventDate);
            } else if (event.keyFeatures.startDate) {
              eventDate = new Date(event.keyFeatures.startDate);
            } else if (event.keyFeatures.endDate) {
              eventDate = new Date(event.keyFeatures.endDate);
            }
          }
          
          // If we have a valid date, categorize the event
          if (eventDate) {
            if (eventDate >= currentDate) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          }
        });
        
        // Sort upcoming events (earliest first)
        upcoming.sort((a, b) => {
          const dateA = getEventDate(a);
          const dateB = getEventDate(b);
          return (dateA ? new Date(dateA).getTime() : 0) - (dateB ? new Date(dateB).getTime() : 0);
        });
        
        // Sort past events (most recent first)
        past.sort((a, b) => {
          const dateA = getEventDate(a, 'end');
          const dateB = getEventDate(b, 'end');
          return (dateB ? new Date(dateB).getTime() : 0) - (dateA ? new Date(dateA).getTime() : 0);
        });
        
        // Only take the top events for each section
        setUpcomingEvents(upcoming.slice(0, 4));
        setPastEvents(past.slice(0, 8));
        
        // Update loading states
        setLoading(prev => ({ 
          ...prev, 
          upcomingEvents: false,
          pastEvents: false
        }));
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(prev => ({ 
          ...prev, 
          upcomingEvents: 'Failed to load upcoming events',
          pastEvents: 'Failed to load past events'
        }));
        setLoading(prev => ({ 
          ...prev, 
          upcomingEvents: false,
          pastEvents: false
        }));
      }
    };

    fetchAllData();
  }, []);

  // Helper function to get date from event
  const getEventDate = (event: Event, type: 'start' | 'end' = 'start') => {
    // Check keyFeatures fields first
    if (event.keyFeatures) {
      if (type === 'start') {
        if (event.keyFeatures.eventDate) return event.keyFeatures.eventDate;
        if (event.keyFeatures.startDate) return event.keyFeatures.startDate;
      } else {
        if (event.keyFeatures.endDate) return event.keyFeatures.endDate;
        if (event.keyFeatures.eventDate) return event.keyFeatures.eventDate;
      }
    }
    
    // If we get here, no valid date was found
    return null;
  };

  // Helper function to format event date
  const formatEventDate = (event: Event, formatStr: string, type: 'start' | 'end' = 'start') => {
    const date = getEventDate(event, type);
    if (!date) return 'Date TBA';
    return format(new Date(date), formatStr);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('/images/news/news-hero-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="container-custom relative z-10">
          <h1 className="text-5xl font-bold mb-6">News & Updates</h1>
          <p className="text-xl max-w-2xl">
            Stay informed with the latest updates, alumni stories, and upcoming cultural and networking opportunities from the Japan Alumni Association of Kerala.
          </p>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Announcements</h2>
          <p className="text-zinc-700 max-w-3xl mb-10">
            Regular updates on new training programs, business delegations, and other initiatives.
          </p>
          
          {loading.announcements ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error.announcements ? (
            <div className="text-center py-12 text-red-600">
              {error.announcements}
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No announcements available at this time.
            </div>
          ) : (
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
          )}
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Link href="/news/announcements" className="btn-outline inline-block text-zinc-900 hover:bg-hinomaru-red hover:text-white border-zinc-900 hover:border-hinomaru-red">
              View All Announcements
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Archive Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Newsletter Archive</h2>
          <p className="text-zinc-700 max-w-3xl mb-10">
            Access past newsletters containing insights, interviews, and industry updates.
          </p>
          
          {loading.newsletters ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error.newsletters ? (
            <div className="text-center py-12 text-red-600">
              {error.newsletters}
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No newsletters available at this time.
            </div>
          ) : (
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
          )}
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Link href="/news/newsletters" className="btn-outline inline-block text-zinc-900 hover:bg-hinomaru-red hover:text-white border-zinc-900 hover:border-hinomaru-red">
              View All Newsletters
            </Link>
          </div>
        </div>
      </section>

      {/* Media Coverage Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Media Coverage</h2>
          <p className="text-zinc-700 max-w-3xl mb-10">
            Watch featured videos and media coverage of ASA Kerala's activities.
          </p>
          
          {loading.mediaCoverage ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error.mediaCoverage ? (
            <div className="text-center py-12 text-red-600">
              {error.mediaCoverage}
            </div>
          ) : mediaCoverage.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No YouTube videos available at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {mediaCoverage.slice(0, 2).map((media) => {
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
                      <h3 className="font-bold text-lg mb-2 text-zinc-900">{media.title}</h3>
                      {media.description && (
                        <p className="text-zinc-700 text-sm line-clamp-2">{media.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Link href="/gallery" className="btn-outline inline-block text-zinc-900 hover:bg-hinomaru-red hover:text-white border-zinc-900 hover:border-hinomaru-red">
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Upcoming Events</h2>
          <p className="text-zinc-700 max-w-3xl mx-auto text-center mb-10">
            Stay updated with our latest programs, workshops, and networking opportunities.
          </p>
          
          {loading.upcomingEvents ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error.upcomingEvents ? (
            <div className="text-center py-12 text-red-600">
              {error.upcomingEvents}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No upcoming events at this time. Check back soon!
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {upcomingEvents.map((event) => {
                const eventDate = getEventDate(event);
                return (
                  <div key={event.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/4 relative">
                        {event.featuredImage ? (
                          <SafeImage
                            src={event.featuredImage.url}
                            alt={event.title}
                            fill
                            className="object-cover"
                            fallbackSrc={event.featuredImage.url}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center md:border-r border-zinc-100">
                            <span className="text-zinc-500">Event Image</span>
                          </div>
                        )}
                        <div className="pt-[75%] md:pt-0"></div> {/* Aspect ratio placeholder for mobile */}
                      </div>
                      <div className="p-6 md:w-3/4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-hinomaru-red text-white rounded-full">
                              {event.programCategory || 'Event'}
                            </span>
                            <span className="text-sm text-zinc-500">
                              {eventDate 
                                ? format(new Date(eventDate), 'EEEE, MMMM d, yyyy')
                                : 'Date TBA'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-zinc-900 mb-2">{event.title}</h3>
                          <div className="flex items-center text-zinc-700 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hinomaru-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.keyFeatures?.customLocation || event.keyFeatures?.mode || 'Location TBA'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-600">
                            {eventDate 
                              ? format(new Date(eventDate), 'h:mm a')
                              : ''}
                          </span>
                          <Link
                            href={`/programs-events/${event.slug}`}
                            className="flex items-center font-medium text-hinomaru-red hover:text-hinomaru-bright transition-colors"
                          >
                            Event Details
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* View All Button */}
          <div className="text-center mt-8">
            <Link href="/programs-events" className="btn-primary inline-block bg-hinomaru-red text-white hover:bg-hinomaru-bright">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Past Events Section - Image Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-8 text-zinc-900">Past Events</h2>
          <p className="text-zinc-700 max-w-3xl mx-auto text-center mb-12">
            A showcase of our previously conducted cultural exchanges, workshops, and networking programs connecting Kerala and Japan.
          </p>
          
          {loading.pastEvents ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error.pastEvents ? (
            <div className="text-center py-12 text-red-600">
              {error.pastEvents}
            </div>
          ) : pastEvents.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No past events to display.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event) => {
                const eventDate = getEventDate(event, 'end');
                return (
                  <div key={event.id} className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition group">
                    <Link href={`/programs-events/${event.slug}`}>
                      <div className="relative h-48">
                        {event.featuredImage ? (
                          <SafeImage
                            src={event.featuredImage.url}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            fallbackSrc={event.featuredImage.url}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                            <span className="text-zinc-500">Event Image</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-zinc-900 to-transparent">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-hinomaru-red text-white rounded">
                            {event.programCategory || 'Event'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-zinc-900 font-medium mb-1 group-hover:text-hinomaru-red transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-zinc-500 mb-2">
                          {eventDate 
                            ? format(new Date(eventDate), 'MMMM d, yyyy')
                            : 'No date available'}
                        </p>
                        <p className="text-sm text-zinc-700 line-clamp-2">{event.summary}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Link href="/programs-events#past-events" className="btn-outline inline-block text-zinc-900 hover:bg-hinomaru-red hover:text-white border-zinc-900 hover:border-hinomaru-red">
              View All Past Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}