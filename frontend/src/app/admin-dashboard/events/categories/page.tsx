'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { events } from '@/lib/api';
import type { Event } from '@/lib/api/types';

// Predefined program categories from the backend
const PROGRAM_CATEGORIES = [
  { id: 'training-programs', name: 'Training Programs', description: 'Programs focused on management and technical training in Japan and India' },
  { id: 'language-training', name: 'Language Training', description: 'Japanese language courses and cultural language training' },
  { id: 'internships', name: 'Internships', description: 'Professional internship opportunities in Japan and India' },
  { id: 'skill-development', name: 'Skill Development', description: 'Technical skill enhancement and professional development programs' },
  { id: 'cultural-activities', name: 'Cultural Activities', description: 'Cultural exchange events and activities promoting Japanese culture' },
  { id: 'other', name: 'Other', description: 'Other events and programs' }
];

interface CategoryWithEvents {
  id: string;
  name: string;
  description: string;
  events: Event[];
}

export default function EventCategoriesPage() {
  const router = useRouter();
  const [categoriesWithEvents, setCategoriesWithEvents] = useState<CategoryWithEvents[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasLoadedEvents, setHasLoadedEvents] = useState(false);
  
  // Convert fetchEvents to useCallback to prevent unnecessary recreation
  const fetchEvents = useCallback(async () => {
    if (hasLoadedEvents) return; // Don't fetch again if we've already loaded events
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all events with minimal fields to reduce payload size
      const eventsResponse = await events.getAll({
        depth: 0, // Reduce depth to minimize data transferred
        fields: {
          title: true,
          slug: true,
          programCategory: true,
          status: true,
          keyFeatures: {
            eventDate: true,
            startDate: true,
            endDate: true,
            customLocation: true,
            isVirtual: true,
            mode: true
          },
          startDate: true, // Legacy field
          endDate: true, // Legacy field
          location: true // Legacy field
        }
      });
      
      // Fetch all events
      const eventsList = eventsResponse.data?.docs || [];
      setAllEvents(eventsList);
      
      // Group events by category
      const categoriesMap = new Map<string, Event[]>();
      
      // Initialize categories
      PROGRAM_CATEGORIES.forEach(category => {
        categoriesMap.set(category.id, []);
      });
      
      // Group events into categories
      eventsList.forEach((event: Event) => {
        if (event.programCategory) {
          const categoryEvents = categoriesMap.get(event.programCategory) || [];
          categoryEvents.push(event);
          categoriesMap.set(event.programCategory, categoryEvents);
        } else {
          // Put events without categories in "Other"
          const otherEvents = categoriesMap.get('other') || [];
          otherEvents.push(event);
          categoriesMap.set('other', otherEvents);
        }
      });
      
      // Create the final categories with events array
      const categoriesData = PROGRAM_CATEGORIES.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        events: categoriesMap.get(category.id) || []
      }));
      
      setCategoriesWithEvents(categoriesData);
      
      // Select the first category with events by default
      const firstCategoryWithEvents = categoriesData.find(cat => cat.events.length > 0);
      if (firstCategoryWithEvents) {
        setSelectedCategory(firstCategoryWithEvents.id);
      }
      
      setHasLoadedEvents(true); // Mark that we've loaded events
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedEvents]); // Only depend on hasLoadedEvents
  
  useEffect(() => {
    // Only fetch events if they haven't been loaded yet
    if (!hasLoadedEvents) {
      fetchEvents();
    }
  }, [fetchEvents, hasLoadedEvents]);
  
  // Refresh data function that can be called manually
  const refreshData = () => {
    setHasLoadedEvents(false); // Reset the flag to force a reload
    fetchEvents(); // Fetch events again
  };

  const formatDate = (event: Event) => {
    const eventDate = event.keyFeatures?.eventDate || 
                     event.keyFeatures?.startDate || 
                     event.startDate;
    
    if (!eventDate) return 'TBD';
    
    return new Date(eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocationString = (event: Event) => {
    if (event.keyFeatures?.customLocation) {
      return event.keyFeatures.customLocation;
    }
    
    if (event.keyFeatures?.isVirtual || event.keyFeatures?.mode === 'online') {
      return 'Online';
    }
    
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Event Categories</h1>
          <p className="text-zinc-600 mt-1">
            View events organized by program categories
          </p>
        </div>
        <Link 
          href="/admin-dashboard/events"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-hinomaru-red hover:bg-hinomaru-red/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Events
        </Link>
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
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600">Loading events by category...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-zinc-50 border-b border-zinc-200">
                <h2 className="text-lg font-medium text-zinc-900">Program Categories</h2>
              </div>
              <ul className="divide-y divide-zinc-200">
                {categoriesWithEvents.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full px-4 py-3 flex justify-between items-center text-left hover:bg-zinc-50 ${
                        selectedCategory === category.id ? 'bg-zinc-50' : ''
                      }`}
                    >
                      <div>
                        <span className={`font-medium ${selectedCategory === category.id ? 'text-hinomaru-red' : 'text-zinc-800'}`}>
                          {category.name}
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">{category.description}</p>
                      </div>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-zinc-100 text-xs font-medium text-zinc-800">
                        {category.events.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-zinc-50 border-t border-zinc-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Total Events</span>
                  <span className="font-medium text-zinc-900">{allEvents.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Event list */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {selectedCategory ? (
                <>
                  <div className="p-4 bg-zinc-50 border-b border-zinc-200">
                    <h2 className="text-lg font-medium text-zinc-900">
                      {categoriesWithEvents.find(c => c.id === selectedCategory)?.name || 'Events'}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      {categoriesWithEvents.find(c => c.id === selectedCategory)?.description || ''}
                    </p>
                  </div>
                  
                  {categoriesWithEvents.find(c => c.id === selectedCategory)?.events.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-zinc-500">No events found in this category.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                              Event Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-200">
                          {categoriesWithEvents
                            .find(c => c.id === selectedCategory)?.events
                            .sort((a, b) => {
                              // Sort by date, with upcoming events first
                              const dateA = a.keyFeatures?.eventDate || a.keyFeatures?.startDate || a.startDate || '';
                              const dateB = b.keyFeatures?.eventDate || b.keyFeatures?.startDate || b.startDate || '';
                              
                              if (!dateA && !dateB) return 0;
                              if (!dateA) return 1;
                              if (!dateB) return -1;
                              
                              return new Date(dateA).getTime() - new Date(dateB).getTime();
                            })
                            .map((event) => (
                              <tr key={event.id} className="hover:bg-zinc-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                                  {event.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                  {formatDate(event)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                                  {getLocationString(event)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    event.status === 'published' 
                                      ? 'bg-green-100 text-green-800' 
                                      : event.status === 'archived'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex space-x-3 justify-end">
                                    <Link
                                      href={`/admin-dashboard/events/${event.id}/registrations`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Registrations
                                    </Link>
                                    <a
                                      href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/events/${event.id}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      Edit
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-zinc-500">Select a category to view events.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 