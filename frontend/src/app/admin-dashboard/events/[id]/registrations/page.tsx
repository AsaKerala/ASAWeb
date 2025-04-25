'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { events } from '@/lib/api';
import type { Event, EventRegistration } from '@/lib/api/types';
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

// Define a type for the user object instead of extending EventRegistration
interface RegistrationWithUser extends Omit<EventRegistration, 'user'> {
  user: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
    isMember?: boolean;
  };
}

export default function EventRegistrationsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csvUrl, setCsvUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Function to check admin access
  const checkAuth = useCallback(async () => {
    try {
      const authResponse = await events.checkAdminAccess();
      if (authResponse.status !== 200) {
        router.push('/login?redirect=/admin-dashboard/events');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking admin access:', err);
      router.push('/login?redirect=/admin-dashboard/events');
      return false;
    }
  }, [router]);

  // Function to fetch event data and registrations
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;
    
    try {
      // Get event details
      const eventResponse = await events.getOne(params.id);
      
      const eventData = eventResponse.data;
      setEvent(eventData);
      
      // Get registrations
      const registrationsResponse = await events.getEventRegistrations(params.id);
      const registrationsData = registrationsResponse.data?.docs || [];
      console.log('Registration data received:', registrationsData);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load registration data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, checkAuth]);
  
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

  // Export to format function
  const exportToFormat = useCallback(async () => {
    setIsExporting(true);
    
    try {
      if (exportFormat === 'csv') {
        exportToCSV();
      } else {
        // Load PDF libraries if needed
        if (!pdfLoaded) {
          await loadPdfLibraries();
        }
        
        if (pdfLoaded && jsPDF) {
          exportToPDF();
        } else {
          throw new Error('PDF library not loaded properly');
        }
      }
    } catch (err) {
      console.error(`Error generating ${exportFormat.toUpperCase()} file:`, err);
      setError(`Failed to generate ${exportFormat.toUpperCase()} file. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  }, [exportFormat, pdfLoaded, loadPdfLibraries]);

  // Handle export format change
  const handleExportFormatChange = useCallback((format: 'csv' | 'pdf') => {
    setExportFormat(format);
    if (format === 'pdf') {
      loadPdfLibraries();
    }
  }, [loadPdfLibraries]);
  
  // Run fetchData on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEventDateString = (event: Event) => {
    if (event.keyFeatures?.eventDate) {
      return formatDate(event.keyFeatures.eventDate);
    } else if (event.keyFeatures?.startDate) {
      if (event.keyFeatures.endDate && event.keyFeatures.endDate !== event.keyFeatures.startDate) {
        return `${formatDate(event.keyFeatures.startDate)} to ${formatDate(event.keyFeatures.endDate)}`;
      }
      return formatDate(event.keyFeatures.startDate);
    } else if (event.startDate) {
      if (event.endDate && event.endDate !== event.startDate) {
        return `${formatDate(event.startDate)} to ${formatDate(event.endDate)}`;
      }
      return formatDate(event.startDate);
    }
    
    return 'Date TBD';
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

  const getUserName = (user: any) => {
    if (user?.name) {
      return user.name;
    }
    
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    
    return 'Name not provided';
  };

  const exportToCSV = () => {
    const headers = [
      'Registration ID',
      'Registrant Name',
      'Email',
      'Phone',
      'Registration Date',
      'Status',
      'Member Status',
      'Check-in Time',
      'Notes'
    ];
    
    const data = registrations.map(reg => [
      reg.id,
      getUserName(reg.user),
      reg.user?.email || 'N/A',
      reg.user?.phone || 'N/A',
      formatDate(reg.registrationDate),
      reg.status,
      reg.user?.isMember ? 'Member' : 'Non-Member',
      reg.checkInTime ? formatDate(reg.checkInTime) : 'Not checked in',
      reg.notes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
  };

  const exportToPDF = () => {
    if (!event || !jsPDF) return;
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const eventTitle = event.title || 'Event';
      
      doc.setFontSize(16);
      doc.text(eventTitle, 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Date: ${getEventDateString(event)}`, 14, 30);
      doc.text(`Location: ${getLocationString(event)}`, 14, 35);
      doc.text(`Total Registrations: ${registrations.length}`, 14, 40);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);
      
      const tableColumn = ["Name", "Email", "Phone", "Registration Date", "Status", "Member Status"];
      const tableRows = registrations.map(reg => [
        getUserName(reg.user),
        reg.user?.email || 'N/A',
        reg.user?.phone || 'N/A',
        formatDate(reg.registrationDate),
        reg.status,
        reg.user?.isMember ? 'Member' : 'Non-Member',
      ]);
      
      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [188, 0, 45] },
        margin: { top: 50 },
      });
      
      // Create a blob from the PDF
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setCsvUrl(pdfUrl);
    } catch (err) {
      console.error('Error in PDF generation:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Event Registrations</h1>
          <p className="text-zinc-600 mt-1">
            {event ? event.title : 'Loading event details...'}
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
          <p className="mt-4 text-zinc-600">Loading event and registration data...</p>
        </div>
      ) : event ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-500">Event Date</h3>
                <p className="mt-1 text-lg text-zinc-900">{getEventDateString(event)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500">Location</h3>
                <p className="mt-1 text-lg text-zinc-900">{getLocationString(event)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500">Total Registrations</h3>
                <p className="mt-1 text-lg text-zinc-900">{registrations.length}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-black space-x-2">
                  <label htmlFor="export-format" className="text-sm font-medium text-zinc-700">
                    Export format:
                  </label>
                  <select
                    id="export-format"
                    className="rounded border-zinc-300 text-sm focus:ring-hinomaru-red focus:border-hinomaru-red"
                    value={exportFormat}
                    onChange={(e) => handleExportFormatChange(e.target.value as 'csv' | 'pdf')}
                  >
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <button
                  onClick={exportToFormat}
                  disabled={isExporting || registrations.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
                      Export Registrations
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {csvUrl && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
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
                      href={csvUrl}
                      download={`${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-registrations-${new Date().toISOString().slice(0, 10)}.${exportFormat}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Download {exportFormat.toUpperCase()}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Registration List</h2>
          {registrations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-zinc-500">No registrations for this event yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Registrant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {registrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                          {getUserName(registration.user)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          <div>{registration.user?.email || 'Email not provided'}</div>
                          <div className="text-zinc-500">{registration.user?.phone || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {formatDate(registration.registrationDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            registration.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            registration.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                            registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            registration.status === 'waitlisted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            registration.user?.isMember ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {registration.user?.isMember ? 'Member' : 'Non-Member'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/event-registrations/${registration.id}`}
                              target="_blank"
                              className="text-indigo-600 hover:text-indigo-900"
                              rel="noreferrer"
                            >
                              Edit
                            </a>
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/users/${registration.user.id}`}
                              target="_blank"
                              className="text-green-600 hover:text-green-900"
                              rel="noreferrer"
                            >
                              View User
                            </a>
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
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-zinc-500">Event not found or you don't have permission to view it.</p>
        </div>
      )}
    </div>
  );
} 