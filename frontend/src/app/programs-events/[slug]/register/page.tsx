'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { events as eventsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth/useAuth';
import { Event } from '@/lib/api/types';

// Add this function at the top of the file, before the main component
function RegistrationDebugger() {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await eventsApi.getMyRegistrations();
      console.log('Debug - Registration response:', response);
      setDebugInfo(response.data);
    } catch (err: any) {
      console.error('Debug - Error checking registrations:', err);
      setDebugInfo({ error: err.message || 'Failed to fetch registrations' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-4 border-t border-zinc-200">
      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-zinc-700">Registration Debugger</summary>
        <div className="mt-3 p-4 bg-zinc-50 rounded text-sm">
          <button
            onClick={checkRegistrations}
            disabled={isLoading}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded text-sm mb-3"
          >
            {isLoading ? 'Checking...' : 'Check My Registrations'}
          </button>
          
          {debugInfo && (
            <div className="mt-2">
              <p>Registration Count: {debugInfo.docs?.length || 0}</p>
              <div className="mt-2 p-3 bg-zinc-100 rounded overflow-auto max-h-96">
                <pre className="text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchParam = searchParams.get('batch');
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number>(batchParam ? parseInt(batchParam) : 0);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Normalize slug helper
  const normalizeSlug = (slug: string): string => {
    return slug.replace(/-+$/, '');
  };

  // Handle slug issues by potentially redirecting to a corrected version
  useEffect(() => {
    if (params.slug && typeof params.slug === 'string') {
      // Check if the slug has a trailing hyphen and redirect if needed
      if (params.slug.endsWith('-')) {
        // Normalize the slug by removing trailing hyphens
        const normalizedSlug = normalizeSlug(params.slug);
        
        if (normalizedSlug !== params.slug) {
          console.log('Redirecting to normalized slug:', normalizedSlug);
          // Preserve any query parameters
          const queryParams = searchParams.toString();
          const redirectPath = `/programs-events/${normalizedSlug}/register${queryParams ? `?${queryParams}` : ''}`;
          router.replace(redirectPath);
          return;
        }
      }
    }
  }, [params.slug, router, searchParams]);

  // Fetch event data
  useEffect(() => {
    // Skip the fetch if we're about to redirect
    if (!params.slug || (typeof params.slug === 'string' && params.slug.endsWith('-'))) {
      return;
    }
    
    const fetchEventData = async () => {
      setIsLoading(true);
      
      // Get normalized slug
      const normalizedSlug = typeof params.slug === 'string' 
        ? normalizeSlug(params.slug)
        : params.slug;
      
      try {
        console.log('Fetching event with normalized slug:', normalizedSlug);
        const response = await eventsApi.getOne(normalizedSlug as string);
        console.log('Event API response status:', response.status);
        
        if (response.data) {
          console.log('Event data loaded successfully:', response.data.title);
          setEvent(response.data);
          
        // Set the selected batch based on URL parameter
          if (batchParam && response.data.upcomingBatches && 
              parseInt(batchParam) < response.data.upcomingBatches.length) {
          setSelectedBatch(parseInt(batchParam));
        }
      } else {
          console.error('No event data returned for slug:', normalizedSlug);
          setErrorMessage('Event not found. Please try another event.');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        console.error('Error details:', error.response?.status, error.response?.data);
        
        // Try fetching all events as a fallback
        try {
          console.log('Trying fallback: fetching all events');
          const allEventsResponse = await eventsApi.getAll();
          
          if (allEventsResponse.data && allEventsResponse.data.docs) {
            // Find event with matching normalized slug
            const matchingEvent = allEventsResponse.data.docs.find(
              (event: any) => normalizeSlug(event.slug) === normalizedSlug
            );
            
            if (matchingEvent) {
              console.log('Found event via fallback method:', matchingEvent.title);
              setEvent(matchingEvent);
              
              // Set the selected batch based on URL parameter
              if (batchParam && matchingEvent.upcomingBatches && 
                  parseInt(batchParam) < matchingEvent.upcomingBatches.length) {
                setSelectedBatch(parseInt(batchParam));
              }
            } else {
              console.error('Event not found in fallback list either');
              setErrorMessage('Event not found. Please try another event.');
            }
          } else {
            setErrorMessage('Could not load event details. Please try again later.');
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setErrorMessage('Could not load event details. Please try again later.');
        }
      } finally {
      setIsLoading(false);
    }
    };
    
    fetchEventData();
  }, [params.slug, router, batchParam, searchParams]);

  const handleRegistration = async () => {
    if (!user) {
      router.push(`/login?redirect=/programs-events/${params.slug}/register`);
      return;
    }
    
    if (!event) {
      setErrorMessage('Event details not available');
      return;
    }
    
    setRegistrationStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await eventsApi.register(event.id, event.upcomingBatches?.length ? selectedBatch : undefined);
      
      if (response.data) {
        setRegistrationStatus('success');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegistrationStatus('error');
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already registered')) {
        setErrorMessage('You are already registered for this event.');
      } else {
        setErrorMessage(error.message || 'There was an error processing your registration. Please try again later.');
      }
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Event Not Found</h1>
        <p className="text-zinc-800 mb-6">The event you are looking for does not exist or has been removed.</p>
        <Link href="/programs-events" className="btn-primary">
          View All Programs & Events
        </Link>
      </div>
    );
  }

  // Success screen after registration
  if (registrationStatus === 'success') {
    return (
      <div className="min-h-screen bg-zinc-50 py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-washi shadow-md border-t-4 border-hinomaru-red">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Registration Successful!</h1>
              <p className="text-zinc-800">Thank you for registering for {event.title}</p>
            </div>
            
            <div className="bg-zinc-50 p-4 rounded-md mb-6">
              <h2 className="font-semibold text-zinc-900 mb-2">Event Details:</h2>
              <p className="text-zinc-800">{event.title}</p>
              {event.upcomingBatches && event.upcomingBatches.length > 0 ? (
                <p className="text-zinc-800 text-sm">
                  Batch: {new Date(event.upcomingBatches[selectedBatch].startDate).toLocaleDateString()}
                  {event.upcomingBatches[selectedBatch].mode && ` - ${event.upcomingBatches[selectedBatch].mode}`}
                </p>
              ) : event.startDate && (
                <p className="text-zinc-800 text-sm">
                  Date: {new Date(event.startDate).toLocaleDateString()}
                  {event.endDate && ` to ${new Date(event.endDate).toLocaleDateString()}`}
                </p>
              )}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your registration has been confirmed. You can view all your registered events in the <strong>My Events</strong> section of your dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-800 mb-6">
              {event.contactInfo?.email && (
                <span>For any queries, please contact <a href={`mailto:${event.contactInfo.email}`} className="text-hinomaru-red hover:underline">{event.contactInfo.email}</a>.</span>
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/events" className="btn-outline w-full sm:w-auto text-center">
                View My Events
              </Link>
              <Link href="/programs-events" className="btn-primary w-full sm:w-auto text-center">
                Explore Other Programs
              </Link>
            </div>
            
            {/* Add the debug component */}
            <RegistrationDebugger />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Link href={`/programs-events/${normalizeSlug(params.slug.toString())}`} className="text-zinc-50 hover:text-zinc-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Event Details
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Register for {event.title}</h1>
            <p className="text-xl">Complete your registration with one click</p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-washi shadow-md mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Event Details</h2>
              <div className="flex flex-col p-4 border border-zinc-200 rounded-md bg-zinc-50">
                <div>
                  <h3 className="font-bold text-zinc-900">{event.title}</h3>
                  <p className="text-zinc-800 mt-1">{event.summary}</p>
                </div>
              </div>

              {/* Batch Selection for Programs */}
              {event.upcomingBatches && event.upcomingBatches.length > 0 && (
              <div className="mt-6">
                <label className="block text-zinc-800 font-medium mb-2">Select Batch:</label>
                <div className="space-y-3">
                    {event.upcomingBatches.map((batch, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`batch-${index}`}
                        name="batch"
                        className="h-5 w-5 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300"
                        checked={selectedBatch === index}
                        onChange={() => setSelectedBatch(index)}
                      />
                      <label htmlFor={`batch-${index}`} className="ml-2 block text-zinc-800">
                          {new Date(batch.startDate).toLocaleDateString()} 
                          {batch.mode && ` - ${batch.mode}`}
                          {batch.applicationDeadline && ` (Apply by: ${new Date(batch.applicationDeadline).toLocaleDateString()})`}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              )}
              
              {/* Error message */}
              {errorMessage && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {errorMessage}
                </div>
              )}
              
              {/* Registration button */}
              <div className="mt-8">
                <button
                  onClick={handleRegistration}
                  disabled={registrationStatus === 'loading'}
                  className="btn-primary w-full py-3 flex items-center justify-center"
                >
                  {registrationStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : !user ? (
                    'Login to Register'
                  ) : (
                    'Register Now'
                  )}
                </button>
                
                <p className="text-sm text-zinc-600 text-center mt-3">
                  By registering, you agree to our <Link href="/terms" className="text-hinomaru-red hover:underline">terms and conditions</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 