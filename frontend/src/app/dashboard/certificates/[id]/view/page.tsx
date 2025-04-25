'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import getUserEvents from '@/lib/api/getUserEvents';
import type { Event, EventRegistration } from '@/lib/api/types';

export default function ViewCertificatePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventReg, setEventReg] = useState<EventRegistration | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const loadCertificateData = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('payload-token');
        
        if (!token) {
          setError('You must be logged in to view your certificate');
          setIsLoading(false);
          return;
        }
        
        // Get user events to find the specific registration
        const { past } = await getUserEvents(token);
        
        // Find the specific registration
        const registration = past.find(reg => reg.id === params.id);
        
        if (!registration) {
          setError('Certificate not found. Either the event registration does not exist or you do not have access to this certificate.');
          setIsLoading(false);
          return;
        }
        
        if (!registration.certificateIssued) {
          setError('Certificate has not been generated yet. Please generate it first.');
          setIsLoading(false);
          return;
        }
        
        setEventReg(registration);
        setEvent(typeof registration.event === 'string' ? null : registration.event);
      } catch (err) {
        setError('An error occurred while loading your certificate. Please try again later.');
        console.error('Certificate loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCertificateData();
  }, [params.id]);
  
  const handleDownload = () => {
    if (eventReg?.certificateDetails?.certificateUrl) {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}${eventReg.certificateDetails.certificateUrl}`, '_blank');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Certificate</h1>
          <Link
            href="/dashboard/certificates"
            className="text-sm bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white"
          >
            Back to Certificates
          </Link>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="mx-auto w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading certificate...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Certificate Not Available</h2>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <div className="mt-6 flex justify-center space-x-4">
                {error.includes('not been generated') && (
                  <Link
                    href={`/dashboard/certificates/${params.id}/generate`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Generate Certificate
                  </Link>
                )}
                <Link
                  href="/dashboard/certificates"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Certificates
                </Link>
              </div>
            </div>
          ) : eventReg && event ? (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                  <p className="text-sm text-gray-600">
                    {event.startDate && event.endDate
                      ? `${format(new Date(event.startDate), 'MMMM d, yyyy')} - ${format(new Date(event.endDate), 'MMMM d, yyyy')}`
                      : 'Date not available'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Certificate generated on: {eventReg.certificateDetails?.issueDate
                      ? format(new Date(eventReg.certificateDetails.issueDate), 'MMMM d, yyyy')
                      : 'Unknown date'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Certificate ID: <span className="font-mono text-xs">{eventReg.certificateDetails?.certificateId || 'Not available'}</span>
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  disabled={!eventReg.certificateDetails?.certificateUrl}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Certificate
                </button>
              </div>
              
              {eventReg.certificateDetails?.certificateUrl ? (
                <div className="relative w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_API_URL}${eventReg.certificateDetails.certificateUrl}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                  />
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Certificate URL is not available. Please try regenerating your certificate.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 