'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { events } from '@/lib/api';

interface Event {
  id: string;
  title: string;
  slug: string;
  status: string;
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
  keyFeatures?: {
    customLocation?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    isVirtual?: boolean;
    eventDate?: string;
    startDate?: string;
    endDate?: string;
  };
  registrationCount?: number;
}

export default function AdminEventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedEvents, setHasLoadedEvents] = useState(false);

  // Use useCallback to prevent unnecessary recreation of this function
  const fetchEvents = useCallback(async () => {
    // Skip fetching if events are already loaded
    if (hasLoadedEvents) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Only fetch the necessary fields to reduce payload size
      const response = await events.getAll({
        depth: 1,
        fields: {
          id: true,
          title: true,
          slug: true,
          status: true,
          keyFeatures: {
            eventDate: true,
            startDate: true,
            endDate: true,
            isVirtual: true,
            customLocation: true,
            mode: true
          },
          startDate: true,
          endDate: true,
          location: true,
          createdAt: true,
          updatedAt: true
        }
      });

      let fetchedEvents = response.data.docs || [];
      
      // Fetch registration counts in parallel for all events to reduce waiting time
      const registrationPromises = fetchedEvents.map(async (event: Event) => {
        try {
          const regResponse = await events.getEventRegistrations(event.id);
          return {
            eventId: event.id,
            count: regResponse.data?.docs?.length || 0
          };
        } catch (err) {
          console.error(`Error fetching registrations for event ${event.id}:`, err);
          return { eventId: event.id, count: 0 };
        }
      });

      // Wait for all registration count requests to complete
      const registrationResults = await Promise.all(registrationPromises);
      
      // Add registration counts to events
      fetchedEvents = fetchedEvents.map((event: Event) => {
        const regResult = registrationResults.find(r => r.eventId === event.id);
        return {
          ...event,
          registrationCount: regResult ? regResult.count : 0
        };
      });

      // Sort and categorize events
      const currentDate = new Date();
      
      // Process upcoming and past events
      const upcoming = [];
      const past = [];
      
      for (const event of fetchedEvents) {
        const eventDate = getEffectiveDate(event);
        
        if (eventDate && eventDate >= currentDate) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      }
      
      // Sort upcoming events by date (earliest first)
      upcoming.sort((a: Event, b: Event) => {
        const dateA = getEffectiveDate(a) || new Date(0);
        const dateB = getEffectiveDate(b) || new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Sort past events by date (most recent first)
      past.sort((a: Event, b: Event) => {
        const dateA = getEffectiveDate(a) || new Date(0);
        const dateB = getEffectiveDate(b) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setAllEvents(fetchedEvents);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setHasLoadedEvents(true);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Function to manually refresh data if needed
  const refreshData = () => {
    setHasLoadedEvents(false);
    fetchEvents();
  };

  // Helper function to get the most appropriate date for an event
  const getEffectiveDate = (event: Event): Date | null => {
    // Check keyFeatures first
    if (event.keyFeatures?.eventDate) {
      return new Date(event.keyFeatures.eventDate);
    }
    
    if (event.keyFeatures?.startDate) {
      return new Date(event.keyFeatures.startDate);
    }
    
    // Then check legacy fields
    if (event.startDate) {
      return new Date(event.startDate);
    }
    
    if (event.endDate) {
      return new Date(event.endDate);
    }
    
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLocationString = (event: Event) => {
    // Check for custom location in keyFeatures first
    if (event.keyFeatures?.customLocation) {
      return event.keyFeatures.customLocation;
    }
    
    // Check for mode and isVirtual in keyFeatures
    if (event.keyFeatures?.isVirtual || event.keyFeatures?.mode === 'online') {
      return 'Online';
    }
    
    // Legacy location checks
    if (!event.location) return 'Location TBD';
    
    if (event.location.isVirtual) return 'Online';
    
    if (event.location.name) {
      return event.location.name;
    }
    
    if (event.location.address && event.location.city) {
      return `${event.location.address}, ${event.location.city}`;
    } else if (event.location.city) {
      return event.location.city;
    } else if (event.location.address) {
      return event.location.address;
    }
    
    return 'Location TBD';
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Event Management</h1>
        <p className="text-zinc-600 mt-1">
          View all events and manage their registrations
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link 
              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/events/create`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-hinomaru-red hover:bg-hinomaru-red/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Event
            </Link>
            <Link
              href="/admin-dashboard/events/categories"
              className="inline-flex items-center px-4 py-2 border border-zinc-300 text-sm font-medium rounded-md shadow-sm text-zinc-700 bg-white hover:bg-zinc-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Manage Categories
            </Link>
            <Link
              href="/admin-dashboard/events/export"
              className="inline-flex items-center px-4 py-2 border border-zinc-300 text-sm font-medium rounded-md shadow-sm text-zinc-700 bg-white hover:bg-zinc-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </Link>
          </div>

          {/* Upcoming Events Section */}
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
              <p className="text-zinc-500">No upcoming events.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {upcomingEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                          <Link href={`/events/${event.slug}`} className="hover:text-hinomaru-red">
                            {event.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {event.keyFeatures?.eventDate ? 
                            formatDate(event.keyFeatures.eventDate) :
                            event.keyFeatures?.startDate ?
                              <>
                                {formatDate(event.keyFeatures.startDate)}
                                {event.keyFeatures.endDate && event.keyFeatures.endDate !== event.keyFeatures.startDate && (
                                  <> to {formatDate(event.keyFeatures.endDate)}</>
                                )}
                              </> :
                            event.eventDate ?
                              formatDate(event.eventDate) :
                              <>
                                {formatDate(event.startDate)}
                                {event.endDate && event.endDate !== event.startDate && (
                                  <> to {formatDate(event.endDate)}</>
                                )}
                              </>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {getLocationString(event)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Link 
                            href={`/admin-dashboard/events/${event.id}/registrations`}
                            className="font-medium text-hinomaru-red hover:text-hinomaru-red-dark"
                          >
                            {event.registrationCount || 0} registrations
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <Link
                              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/events/${event.id}`}
                              target="_blank"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin-dashboard/events/${event.id}/registrations`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Manage Registrations
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Past Events Section */}
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-zinc-500">No past events.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {pastEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                          <Link href={`/events/${event.slug}`} className="hover:text-hinomaru-red">
                            {event.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {event.keyFeatures?.eventDate ? 
                            formatDate(event.keyFeatures.eventDate) :
                            event.keyFeatures?.startDate ?
                              <>
                                {formatDate(event.keyFeatures.startDate)}
                                {event.keyFeatures.endDate && event.keyFeatures.endDate !== event.keyFeatures.startDate && (
                                  <> to {formatDate(event.keyFeatures.endDate)}</>
                                )}
                              </> :
                            event.eventDate ?
                              formatDate(event.eventDate) :
                              <>
                                {formatDate(event.startDate)}
                                {event.endDate && event.endDate !== event.startDate && (
                                  <> to {formatDate(event.endDate)}</>
                                )}
                              </>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {getLocationString(event)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          <Link 
                            href={`/admin-dashboard/events/${event.id}/registrations`}
                            className="font-medium text-hinomaru-red hover:text-hinomaru-red-dark"
                          >
                            {event.registrationCount || 0} registrations
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <Link
                              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/events/${event.id}`}
                              target="_blank"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin-dashboard/events/${event.id}/registrations`}
                              className="text-green-600 hover:text-green-900"
                            >
                              View Attendees
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 