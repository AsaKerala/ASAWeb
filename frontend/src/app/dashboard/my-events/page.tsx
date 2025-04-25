'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { events as eventsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth/useAuth';

export default function MyEventsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthLoading && !user) {
      router.push('/login?redirect=/dashboard/my-events');
      return;
    }

    if (user) {
      fetchRegistrations();
    }
  }, [user, isAuthLoading, router]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await eventsApi.getMyRegistrations();
      if (response.data && response.data.docs) {
        setRegistrations(response.data.docs);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError('Failed to load your registered events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRegistration = async (eventId: string) => {
    setCancellingId(eventId);
    try {
      await eventsApi.cancelRegistration(eventId);
      
      // Refresh registrations after cancellation
      fetchRegistrations();
    } catch (error) {
      console.error('Error cancelling registration:', error);
      setError('Failed to cancel registration. Please try again later.');
    } finally {
      setCancellingId(null);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">My Registered Events</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      {registrations.length === 0 ? (
        <div className="bg-white p-8 rounded-washi shadow-md text-center">
          <svg className="w-16 h-16 text-zinc-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <h2 className="text-xl font-bold text-zinc-800 mb-2">No Registered Events</h2>
          <p className="text-zinc-600 mb-6">You haven't registered for any events yet.</p>
          <Link href="/programs-events" className="btn-primary">
            Browse Programs & Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {registrations.map((registration: any) => (
            <div key={registration.id} className="bg-white p-6 rounded-washi shadow-md">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Image */}
                {registration.event.featuredImage && (
                  <div className="md:w-1/4 flex-shrink-0">
                    <div className="rounded-md overflow-hidden h-40 w-full">
                      <Image 
                        src={registration.event.featuredImage.url} 
                        alt={registration.event.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                )}
                
                {/* Event Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-zinc-900 mb-2">
                    {registration.event.title}
                  </h2>
                  
                  <div className="mb-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      registration.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                      registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      registration.status === 'waitlisted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    {/* Registration Date */}
                    <div className="flex items-start text-sm">
                      <span className="text-hinomaru-red mr-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </span>
                      <div>
                        <span className="text-zinc-600">Registered on:</span>
                        <span className="text-zinc-900 ml-1">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Event Date */}
                    {registration.event.startDate && (
                      <div className="flex items-start text-sm">
                        <span className="text-hinomaru-red mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="text-zinc-600">Event date:</span>
                          <span className="text-zinc-900 ml-1">
                            {new Date(registration.event.startDate).toLocaleDateString()}
                            {registration.event.endDate && ` to ${new Date(registration.event.endDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Batch Info (if applicable) */}
                    {registration.batchIndex !== undefined && 
                     registration.event.upcomingBatches && 
                     registration.event.upcomingBatches.length > registration.batchIndex && (
                      <div className="flex items-start text-sm">
                        <span className="text-hinomaru-red mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="text-zinc-600">Batch:</span>
                          <span className="text-zinc-900 ml-1">
                            {new Date(registration.event.upcomingBatches[registration.batchIndex].startDate).toLocaleDateString()}
                            {registration.event.upcomingBatches[registration.batchIndex].mode && 
                              ` - ${registration.event.upcomingBatches[registration.batchIndex].mode}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Link 
                      href={`/programs-events/${registration.event.slug}`} 
                      className="btn-outline text-sm"
                    >
                      View Details
                    </Link>
                    
                    {registration.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelRegistration(registration.event.id)}
                        disabled={cancellingId === registration.event.id}
                        className="btn-danger text-sm"
                      >
                        {cancellingId === registration.event.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Registration'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 