'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/auth';
import { events as eventsApi } from '@/lib/api';
import { format } from 'date-fns';
import { EventRegistration as BaseEventRegistration } from '@/lib/api/types';

// Extend the EventRegistration type to include batchIndex
interface EventRegistration extends BaseEventRegistration {
  batchIndex?: number;
}

function EventStatusBadge({ status }: { status: string }) {
  let bgColor = '';
  let textColor = '';
  let label = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status) {
    case 'pending':
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      break;
    case 'confirmed':
      bgColor = 'bg-emerald-50';
      textColor = 'text-emerald-700';
      break;
    case 'attended':
      bgColor = 'bg-sky-50';
      textColor = 'text-sky-700';
      break;
    case 'cancelled':
      bgColor = 'bg-rose-50';
      textColor = 'text-rose-700';
      break;
    case 'waitlisted':
      bgColor = 'bg-violet-50';
      textColor = 'text-violet-700';
      break;
    default:
      bgColor = 'bg-gray-50';
      textColor = 'text-gray-700';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
}

function EventCard({ registration }: { registration: EventRegistration }) {
  const event = registration.event;
  if (!event || typeof event === 'string') {
    return (
      <div className="bg-white rounded-washi shadow-sm border border-zinc-100 hover:shadow-md transition-all p-4">
        <p className="text-red-500">Error: Event data not available</p>
        <p className="text-sm text-zinc-600">Registration ID: {registration.id}</p>
      </div>
    );
  }
  
  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;
  
  const isVirtual = event.location?.isVirtual;
  const locationName = event.location?.name;
  const locationDisplay = isVirtual 
    ? 'Virtual Event' 
    : locationName || 'In-person Event';
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'TBD';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="bg-white rounded-washi shadow-sm border border-zinc-100 hover:shadow-md transition-all overflow-hidden group">
      {event.featuredImage && event.featuredImage.url ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.featuredImage.url}
            alt={event.title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-r from-hinomaru-red/10 to-sakura-700/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-hinomaru-red/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-zinc-900 group-hover:text-hinomaru-red transition-colors">{event.title}</h3>
          <EventStatusBadge status={registration.status} />
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-zinc-600">
            <svg className="mr-2 h-4 w-4 text-hinomaru-red/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {startDate && (
              <time dateTime={event.startDate}>
                {formatDate(startDate)}
                {endDate && endDate.toDateString() !== startDate.toDateString() && 
                  ` - ${formatDate(endDate)}`}
              </time>
            )}
            {registration.batchIndex !== undefined && 
             event.upcomingBatches && 
             event.upcomingBatches[registration.batchIndex] && (
              <time dateTime={event.upcomingBatches[registration.batchIndex].startDate}>
                Batch: {formatDate(new Date(event.upcomingBatches[registration.batchIndex].startDate))}
              </time>
            )}
          </div>
          
          <div className="flex items-center text-sm text-zinc-600">
            <svg className="mr-2 h-4 w-4 text-hinomaru-red/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {event.keyFeatures?.customLocation || 
               (typeof event.location === 'object' && event.location ? 
                (event.location.isVirtual ? 'Virtual Event' : event.location.name) : 
                typeof event.location === 'string' ? event.location : 'Location TBD')}
            </span>
          </div>
        </div>
        
        {event.summary && (
          <p className="text-sm text-zinc-600 mb-4 line-clamp-2 group-hover:text-zinc-800 transition-colors">{event.summary}</p>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-zinc-100">
          <Link 
            href={`/events/${event.slug}`}
            className="text-sm font-medium text-hinomaru-red hover:text-sakura-700 transition-colors flex items-center"
          >
            Event Details
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
          
          {registration.status === 'attended' && (
            <Link 
              href={`/dashboard/certificates/${registration.id}`}
              className="text-sm font-medium text-hinomaru-red hover:text-sakura-700 transition-colors flex items-center"
            >
              View Certificate
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { user, refreshUser } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Function to fetch registrations
  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch event registrations directly - removing refreshUser which may be causing issues
      console.log('Fetching event registrations...');
      const response = await eventsApi.getMyRegistrations();
      console.log('Registrations response:', response.data);
      
      if (response.data && response.data.docs) {
        setRegistrations(response.data.docs);
      } else {
        setRegistrations([]);
      }
    } catch (err) {
      console.error('Error fetching event registrations:', err);
      setError('Failed to load your registered events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch on initial load
  useEffect(() => {
    fetchRegistrations();
  }, []);
  
  // Add a refresh button
  const handleRefresh = () => {
    fetchRegistrations();
  };
  
  // Separate registrations into upcoming and past events
  const now = new Date();
  const upcomingRegistrations: EventRegistration[] = [];
  const pastRegistrations: EventRegistration[] = [];
  
  registrations.forEach(registration => {
    if (!registration.event || typeof registration.event === 'string') {
      return; // Skip if event data isn't available
    }
    
    const event = registration.event;
    let eventDate: Date | null = null;
    
    // Check for batch date if it's a batch registration
    if (registration.batchIndex !== undefined && 
        event.upcomingBatches && 
        event.upcomingBatches[registration.batchIndex]) {
      eventDate = new Date(event.upcomingBatches[registration.batchIndex].startDate);
    } 
    // Otherwise use event end date or start date
    else {
      eventDate = event.endDate ? new Date(event.endDate) : event.startDate ? new Date(event.startDate) : null;
    }
    
    if (!eventDate) {
      upcomingRegistrations.push(registration); // Default to upcoming if no date
    } else if (eventDate >= now) {
      upcomingRegistrations.push(registration);
    } else {
      pastRegistrations.push(registration);
    }
  });
  
  // Sort registrations by date
  const sortByDate = (a: EventRegistration, b: EventRegistration) => {
    const getEventDate = (reg: EventRegistration) => {
      if (!reg.event || typeof reg.event === 'string') return new Date(0);
      
      const event = reg.event;
      
      // Check for batch date if it's a batch registration
      if (reg.batchIndex !== undefined && 
          event.upcomingBatches && 
          event.upcomingBatches[reg.batchIndex]) {
        return new Date(event.upcomingBatches[reg.batchIndex].startDate);
      }
      
      // Otherwise use event start date or registration date as fallback
      return event.startDate ? new Date(event.startDate) : new Date(reg.registrationDate);
    };
    
    return getEventDate(a).getTime() - getEventDate(b).getTime();
  };
  
  upcomingRegistrations.sort(sortByDate);
  pastRegistrations.sort((a, b) => sortByDate(b, a)); // Past events in reverse chronological order
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-washi shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header with statistics */}
      <div className="bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white rounded-washi shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Events</h1>
            <p className="text-white/80">Track your upcoming and past event registrations</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{upcomingRegistrations.length}</p>
              <p className="text-sm text-white/80">Upcoming</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{pastRegistrations.length}</p>
              <p className="text-sm text-white/80">Past</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'upcoming' 
              ? 'border-hinomaru-red text-hinomaru-red' 
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          } transition-colors`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === 'past' 
              ? 'border-hinomaru-red text-hinomaru-red' 
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          } transition-colors`}
        >
          Past Events
        </button>
        
        <div className="ml-auto">
          <button 
            onClick={handleRefresh} 
            className="flex items-center text-hinomaru-red hover:text-sakura-700 px-4 py-2"
            disabled={isLoading}
          >
            <svg className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Upcoming Events Section */}
      {activeTab === 'upcoming' && (
        <>
          {upcomingRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRegistrations.map((registration) => (
                <EventCard key={registration.id} registration={registration} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-washi shadow-sm border border-zinc-100 p-8 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-zinc-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-zinc-900 mb-2">No Upcoming Events</h3>
              <p className="text-zinc-600 mb-6">You haven't registered for any upcoming events yet.</p>
              <Link 
                href="/events"
                className="btn-primary inline-flex items-center"
              >
                Explore Events
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
              
              {/* Debug info for developers */}
              <div className="mt-8 pt-4 border-t border-zinc-200">
                <details className="text-left text-xs text-zinc-500">
                  <summary className="cursor-pointer hover:text-zinc-700 transition-colors">Debug Info</summary>
                  <div className="mt-2 p-3 bg-zinc-50 rounded overflow-x-auto">
                    <p>Total registrations: {registrations.length}</p>
                    <p>Using endpoint: /api/users/me/registrations</p>
                    <p>Authentication: {user ? `User ID: ${user.id.substring(0, 8)}...` : 'Not logged in'}</p>
                    {registrations.length > 0 && (
                      <div className="mt-2">
                        <p>First registration:</p>
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(registrations[0], null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Past Events Section */}
      {activeTab === 'past' && (
        <>
          {pastRegistrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastRegistrations.map((registration) => (
                <EventCard key={registration.id} registration={registration} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-washi shadow-sm border border-zinc-100 p-8 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-zinc-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-zinc-900 mb-2">No Past Events</h3>
              <p className="text-zinc-600">You haven't attended any events yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 