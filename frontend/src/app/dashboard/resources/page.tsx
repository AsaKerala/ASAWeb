import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { format } from 'date-fns';
import getUserResources from '@/lib/api/getUserResources';

export const metadata = {
  title: 'My Resources | Member Dashboard',
  description: 'Access resources from your registered events',
};

/**
 * Helper function to get file icon based on mimetype
 */
function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (mimeType === 'application/pdf') {
    return (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  } else if (mimeType.includes('word') || mimeType.includes('document')) {
    return (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else if (mimeType.includes('video/')) {
    return (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  } else if (mimeType.includes('audio/')) {
    return (
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    );
  } else {
    return (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export default async function ResourcesPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('payload-token')?.value;
  
  const resourcesByEvent = await getUserResources(token);
  const hasResources = resourcesByEvent.length > 0;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Resources</h1>
      
      {hasResources ? (
        <div className="space-y-8">
          {resourcesByEvent.map((eventResources) => (
            <div key={eventResources.event.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-blue-800">
                    {eventResources.event.title}
                  </h2>
                  <span className="text-sm text-blue-600">
                    {format(new Date(eventResources.event.startDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="px-6 py-4">
                {eventResources.resources.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {eventResources.resources.map((resource) => (
                      <div key={resource.id} className="py-4 flex items-center">
                        <div className="flex-shrink-0">
                          {getFileIcon(resource.mimeType)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {resource.filename}
                              </h3>
                              <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                                <span className="mr-3">{formatFileSize(resource.filesize)}</span>
                                <span>{format(new Date(resource.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}${resource.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">No resources available for this event.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">No Resources Available</h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have access to any resources yet. 
            Resources become available when you register for events.
          </p>
          <div className="mt-6">
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Explore Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 