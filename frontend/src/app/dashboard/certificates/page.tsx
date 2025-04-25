'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import getUserEvents from '@/lib/api/getUserEvents';
import type { EventRegistration, Event } from '@/lib/api/types';

export default function CertificatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pastEvents, setPastEvents] = useState<EventRegistration[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'generated' | 'not-generated'>('all');

  useEffect(() => {
    const loadUserEvents = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('payload-token');
        
        if (!token) {
          setError('You must be logged in to view your certificates');
          setIsLoading(false);
          return;
        }
        
        // Get user events
        const { past } = await getUserEvents(token);
        
        // Sort by date (most recent first)
        const sortedEvents = [...past].sort((a, b) => {
          const eventA = typeof a.event === 'string' ? null : a.event;
          const eventB = typeof b.event === 'string' ? null : b.event;
          const dateA = eventA?.endDate ? new Date(eventA.endDate).getTime() : 0;
          const dateB = eventB?.endDate ? new Date(eventB.endDate).getTime() : 0;
          return dateB - dateA;
        });
        
        setPastEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (err) {
        setError('An error occurred while loading your certificates. Please try again later.');
        console.error('Certificate loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserEvents();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...pastEvents];
    
    // Apply certificate generation filter
    if (filter === 'generated') {
      result = result.filter(event => event.certificateIssued === true);
    } else if (filter === 'not-generated') {
      result = result.filter(event => event.certificateIssued !== true);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => {
        const eventObj = typeof event.event === 'string' ? null : event.event;
        return (
          eventObj?.title?.toLowerCase().includes(query) ||
          event.certificateDetails?.certificateId?.toLowerCase().includes(query)
        );
      });
    }
    
    setFilteredEvents(result);
  }, [pastEvents, filter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white px-6 py-4">
          <h1 className="text-2xl font-semibold">My Certificates</h1>
          <p className="text-sm mt-1 text-blue-100">View and generate certificates for events you've attended</p>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="mx-auto w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading certificates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Error Loading Certificates</h2>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : pastEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">No Events Found</h2>
              <p className="mt-2 text-sm text-gray-600">You don't have any past events eligible for certificates.</p>
              <Link
                href="/dashboard/events"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm rounded-md ${
                      filter === 'all' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('generated')}
                    className={`px-4 py-2 text-sm rounded-md ${
                      filter === 'generated' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Generated
                  </button>
                  <button
                    onClick={() => setFilter('not-generated')}
                    className={`px-4 py-2 text-sm rounded-md ${
                      filter === 'not-generated' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Not Generated
                  </button>
                </div>
              </div>
              
              {filteredEvents.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No certificates match your search criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEvents.map((registration) => {
                        const eventObj = typeof registration.event === 'string' ? null : registration.event;
                        return (
                          <tr key={registration.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{eventObj?.title || 'Unknown Event'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {eventObj?.startDate && eventObj?.endDate
                                  ? `${format(new Date(eventObj.startDate), 'MMM d, yyyy')} - ${format(new Date(eventObj.endDate), 'MMM d, yyyy')}`
                                  : 'Date not available'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {registration.certificateIssued ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Generated
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Not Generated
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 font-mono">
                                {registration.certificateDetails?.certificateId || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {registration.certificateIssued ? (
                                <Link
                                  href={`/dashboard/certificates/${registration.id}/view`}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  View
                                </Link>
                              ) : (
                                <Link
                                  href={`/dashboard/certificates/${registration.id}/generate`}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                >
                                  Generate
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 