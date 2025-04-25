'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { events } from '@/lib/api';
import type { Event } from '@/lib/api/types';
import dynamic from 'next/dynamic';

// Define jsPDF type locally to handle the dynamic import properly
type JsPDFType = {
  new(): {
    setFontSize: (size: number) => void;
    text: (text: string, x: number, y: number) => void;
    autoTable: (options: any) => void;
    output: (type: string) => any;
  };
};

// Dynamically import jsPDF and jspdf-autotable
let jsPDF: JsPDFType | null = null;

export default function EventExportPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [eventRegistrationCounts, setEventRegistrationCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [hasLoadedEvents, setHasLoadedEvents] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Use useCallback to memoize the fetch functions
  const fetchEvents = useCallback(async () => {
    if (hasLoadedEvents) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Only fetch minimal fields needed for events
      const response = await events.getAll({
        depth: 0,
        fields: {
          id: true,
          title: true,
          status: true,
          keyFeatures: {
            eventDate: true,
            startDate: true,
            customLocation: true,
            isVirtual: true,
            mode: true
          },
          startDate: true,
          createdAt: true,
          updatedAt: true,
          categories: true,
          location: true
        }
      });
      
      const eventsList = response.data?.docs || [];
      setAllEvents(eventsList);
      setHasLoadedEvents(true);
      
      // Fetch registration counts for all events
      await fetchRegistrationCounts(eventsList);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedEvents]);
  
  // Fetch registration counts for all events
  const fetchRegistrationCounts = async (eventsList: Event[]) => {
    try {
      const counts: Record<string, number> = {};
      
      // Process events in batches to avoid too many concurrent requests
      const batchSize = 5;
      for (let i = 0; i < eventsList.length; i += batchSize) {
        const batch = eventsList.slice(i, i + batchSize);
        
        // Create a promise for each event in the batch
        const promises = batch.map(async (event) => {
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
        
        // Wait for all promises in this batch
        const results = await Promise.all(promises);
        
        // Update counts object
        results.forEach(result => {
          counts[result.eventId] = result.count;
        });
      }
      
      setEventRegistrationCounts(counts);
    } catch (err) {
      console.error('Error fetching registration counts:', err);
    }
  };
  
  // Function to load PDF libraries on demand
  const loadPdfLibraries = useCallback(async () => {
    if (pdfLoaded || pdfLoading) return;
    
    setPdfLoading(true);
    try {
      // Import jsPDF and jspdf-autotable dynamically
      const jsPDFModule = await import('jspdf');
      jsPDF = jsPDFModule.default as unknown as JsPDFType;
      
      // Import autotable plugin
      await import('jspdf-autotable');
      
      setPdfLoaded(true);
    } catch (err) {
      console.error('Error loading PDF libraries:', err);
      setError('Failed to load PDF libraries. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }, [pdfLoaded, pdfLoading]);
  
  useEffect(() => {
    // Only fetch events initially
    fetchEvents();
  }, [fetchEvents]);
  
  // Reset when changing export format
  useEffect(() => {
    setFileUrl('');
    
    // Load PDF libraries if PDF format is selected
    if (exportFormat === 'pdf') {
      loadPdfLibraries();
    }
  }, [exportFormat, loadPdfLibraries]);

  const generateExport = async () => {
    setIsExporting(true);
    setFileUrl('');
    
    try {
      // Filter events by date range if provided
      let filteredEvents = [...allEvents];
      
      if (dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(
            event.keyFeatures?.eventDate || 
            event.keyFeatures?.startDate || 
            event.startDate || 
            '2099-01-01' // Default far future date if no date exists
          );
          return eventDate >= startDate && eventDate <= endDate;
        });
      }
      
      // Define headers for events export
      const headers = [
        'Title', 'Status', 'Date', 'Location', 'Registration Count',
        'Categories', 'Created At', 'Updated At'
      ];
      
      // Map events to data rows
      const data = filteredEvents.map(event => {
        const eventDate = event.keyFeatures?.eventDate || 
                         event.keyFeatures?.startDate || 
                         event.startDate || '';
        
        const location = getLocationString(event);
        
        const categories = Array.isArray(event.categories) 
          ? event.categories.map(cat => typeof cat === 'string' ? cat : cat.name).join(', ')
          : '';
        
        // Get registration count for this event
        const regCount = eventRegistrationCounts[event.id] || 0;
        
        return [
          event.title,
          event.status,
          eventDate ? new Date(eventDate).toLocaleDateString() : 'TBD',
          location,
          regCount.toString(),
          categories,
          new Date(event.createdAt).toLocaleDateString(),
          new Date(event.updatedAt).toLocaleDateString()
        ];
      });
      
      if (exportFormat === 'csv') {
        // Create CSV content
        const csvContent = [
          headers.join(','),
          ...data.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Create a blob and URL for download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } else if (exportFormat === 'pdf' && pdfLoaded && jsPDF) {
        // Create PDF
        try {
          // Create a new PDF document
          const doc = new jsPDF();
          const title = "Events Report";
          
          // Add title
          doc.setFontSize(16);
          doc.text(title, 14, 20);
          
          // Add date range if provided
          doc.setFontSize(10);
          if (dateRange.start && dateRange.end) {
            doc.text(`Date Range: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}`, 14, 30);
          }
          
          doc.text(`Total Events: ${filteredEvents.length}`, 14, 35);
          doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
          
          // Generate the table
          doc.autoTable({
            head: [headers],
            body: data,
            startY: 45,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [188, 0, 45] },
            margin: { top: 45 },
          });
          
          // Create a blob from the PDF
          const pdfBlob = doc.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setFileUrl(pdfUrl);
        } catch (err) {
          console.error('Error in PDF generation:', err);
          setError('Failed to generate PDF. Please try again.');
        }
      }
    } catch (err) {
      console.error(`Error generating ${exportFormat.toUpperCase()}:`, err);
      setError(`Failed to generate ${exportFormat.toUpperCase()} file. Please try again.`);
    } finally {
      setIsExporting(false);
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Export Event Data</h1>
          <p className="text-zinc-600 mt-1">
            Export events data for reporting
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
          <p className="mt-4 text-zinc-600">Loading data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-zinc-900 mb-4">Export Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="export-csv"
                      name="export-format"
                      type="radio"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300"
                    />
                    <label htmlFor="export-csv" className="ml-3 block text-sm font-medium text-zinc-700">
                      CSV
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="export-pdf"
                      name="export-format"
                      type="radio"
                      checked={exportFormat === 'pdf'}
                      onChange={() => setExportFormat('pdf')}
                      className="h-4 w-4 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300"
                    />
                    <label htmlFor="export-pdf" className="ml-3 block text-sm font-medium text-zinc-700">
                      PDF
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Date Range (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="start-date" className="block text-xs text-zinc-500">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="mt-1 block w-full border text-black border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-hinomaru-red focus:border-hinomaru-red sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-xs text-zinc-500">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="mt-1 block w-full border text-black border-zinc-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-hinomaru-red focus:border-hinomaru-red sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={generateExport}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-hinomaru-red hover:bg-hinomaru-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hinomaru-red disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating {exportFormat.toUpperCase()}...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate {exportFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
          
          {fileUrl && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex justify-between items-center w-full">
                  <p className="text-sm text-green-800">
                    {exportFormat.toUpperCase()} file is ready for download!
                  </p>
                  <a
                    href={fileUrl}
                    download={`events-report-${new Date().toISOString().slice(0, 10)}.${exportFormat}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Download {exportFormat.toUpperCase()}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-zinc-900 mb-4">Export Preview</h2>
        
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
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {allEvents.slice(0, 5).map((event, idx) => (
                <tr key={idx} className="hover:bg-zinc-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                    {event.keyFeatures?.eventDate ? 
                      new Date(event.keyFeatures.eventDate).toLocaleDateString() :
                      event.keyFeatures?.startDate ?
                        new Date(event.keyFeatures.startDate).toLocaleDateString() :
                        event.startDate ?
                          new Date(event.startDate).toLocaleDateString() : 'TBD'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                    {getLocationString(event)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-zinc-700">
                    <Link 
                      href={`/admin-dashboard/events/${event.id}/registrations`}
                      className="font-medium text-hinomaru-red hover:text-hinomaru-red-dark"
                    >
                      {eventRegistrationCounts[event.id] || 0} registrations
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {allEvents.length > 5 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-zinc-500 text-center italic">
                    {allEvents.length - 5} more events...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 