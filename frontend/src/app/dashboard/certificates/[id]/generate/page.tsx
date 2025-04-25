'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import generateCertificate from '@/lib/api/generateCertificate';
import { EventRegistration } from '@/lib/api/types';

export default function GenerateCertificatePage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const router = useRouter();
  
  const handleGenerateCertificate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('payload-token');
      
      if (!token) {
        setError('You must be logged in to generate a certificate');
        setIsLoading(false);
        return;
      }
      
      const result = await generateCertificate(params.id, token);
      
      if (result.success) {
        setSuccess(true);
        setCertificateData(result);
        
        // Redirect to view certificate after 2 seconds
        setTimeout(() => {
          router.push(`/dashboard/certificates/${params.id}/view`);
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred while generating your certificate. Please try again later.');
      console.error('Certificate generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-generate on page load
  useEffect(() => {
    handleGenerateCertificate();
  }, [params.id]);
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white px-6 py-4">
          <h1 className="text-xl font-semibold">Generate Certificate</h1>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Generating your certificate...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Certificate Generation Failed</h2>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleGenerateCertificate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
                <Link
                  href="/dashboard/certificates"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Go Back
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Certificate Generated!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your certificate for attending {certificateData?.event?.title} has been generated successfully.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Certificate ID: {certificateData?.certificateDetails?.certificateId}
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-600">Redirecting to view your certificate...</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 