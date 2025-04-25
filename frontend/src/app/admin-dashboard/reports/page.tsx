'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api, events, members } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '@/lib/api/bookings';
import Script from 'next/script';

// Extend Window interface to include the PDF libraries
declare global {
  interface Window {
    jspdf: any;
    jsPDF: any;
    jspdfAutoTable: any;
  }
}

type ReportType = 'events' | 'members' | 'bookings' | 'roomBookings' | 'registrations';
type TimeFrame = 'all' | 'month' | 'quarter' | 'year';
type FileFormat = 'csv' | 'xlsx' | 'pdf';

interface ReportConfig {
  type: ReportType;
  timeFrame: TimeFrame;
  format: FileFormat;
  includeInactive?: boolean;
  startDate?: string;
  endDate?: string;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportType>('events');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
  const [fileFormat, setFileFormat] = useState<FileFormat>('csv');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventData, setEventData] = useState<any[]>([]);
  const [memberData, setMemberData] = useState<any[]>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [roomBookingsData, setRoomBookingsData] = useState<any[]>([]);
  const [eventBookingsData, setEventBookingsData] = useState<any[]>([]);
  const [pdfLibrariesLoaded, setPdfLibrariesLoaded] = useState(false);

  // Load data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events data
        const eventsResponse = await events.getAll({
          depth: 1,
          fields: {
            id: true,
            title: true,
            slug: true,
            status: true,
            keyFeatures: {
              eventDate: true,
              startDate: true,
              endDate: true
            },
            startDate: true,
            endDate: true,
            location: true
          }
        });
        setEventData(eventsResponse.data.docs || []);
        
        // Fetch members data
        const usersResponse = await api.get('/api/users', {
          params: {
            depth: 2,
            limit: 100
          }
        });
        setMemberData(usersResponse.data.docs || []);
        
        // Fetch room bookings data
        try {
          const roomBookingsResponse = await bookingsApi.getRoomBookings();
          setRoomBookingsData(roomBookingsResponse.data.docs || []);
        } catch (err) {
          console.error('Error fetching room bookings:', err);
        }

        // Fetch event bookings data
        try {
          const eventBookingsResponse = await bookingsApi.getEventBookings();
          setEventBookingsData(eventBookingsResponse.data.docs || []);
        } catch (err) {
          console.error('Error fetching event bookings:', err);
        }
        
        // Fetch registration data
        const allEvents = eventsResponse.data.docs || [];
        const registrationsPromises = allEvents.map(async (event: any) => {
          try {
            const regResponse = await events.getEventRegistrations(event.id);
            return (regResponse.data.docs || []).map((reg: any) => ({
              ...reg,
              eventTitle: event.title
            }));
          } catch (err) {
            console.error(`Error fetching registrations for event ${event.id}:`, err);
            return [];
          }
        });
        
        const allRegistrations = await Promise.all(registrationsPromises);
        setRegistrationData(allRegistrations.flat());
      } catch (err) {
        console.error('Error fetching data for reports:', err);
        setError('Failed to load data for reports. Please try again.');
      }
    };
    
    fetchData();
  }, []);

  // Handle when PDF libraries have loaded
  const handlePdfLibrariesLoaded = () => {
    setPdfLibrariesLoaded(true);
    console.log('PDF libraries loaded successfully');
  };

  const reports = [
    {
      id: 'events',
      name: 'Events Report',
      description: 'Generate a report of all events, including attendance and registration data.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'members',
      name: 'Members Report',
      description: 'Generate a report of all members, including membership status and types.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'registrations',
      name: 'Event Registrations',
      description: 'Generate a detailed report of event registrations with attendee information.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'bookings',
      name: 'Facility Bookings',
      description: 'Generate a report of all facility bookings for events.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'roomBookings',
      name: 'Room Bookings',
      description: 'Generate a report of all room accommodation bookings.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
  ];

  // Format date for display and data processing
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get effective date for events (using various possible date fields)
  const getEffectiveDate = (event: any): Date | null => {
    if (event.keyFeatures?.eventDate) return new Date(event.keyFeatures.eventDate);
    if (event.keyFeatures?.startDate) return new Date(event.keyFeatures.startDate);
    if (event.startDate) return new Date(event.startDate);
    if (event.endDate) return new Date(event.endDate);
    return null;
  };

  // Filter data based on timeframe or custom date range
  const getFilteredData = (data: any[], itemDateGetter: (item: any) => Date | null) => {
    let filtered = [...data];
    
    // Apply inactive filter
    if (!includeInactive) {
      filtered = filtered.filter(item => 
        item.status !== 'draft' && 
        item.status !== 'inactive' && 
        item.membershipStatus !== 'inactive' &&
        item.membershipStatus !== 'expired'
      );
    }
    
    // Apply date filters
    if (customDateRange && startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
      
      filtered = filtered.filter(item => {
        const itemDate = itemDateGetter(item);
        return itemDate && itemDate.getTime() >= startDateTime && itemDate.getTime() <= endDateTime;
      });
    } else if (timeFrame !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      if (timeFrame === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (timeFrame === 'quarter') {
        cutoffDate.setMonth(now.getMonth() - 3);
      } else if (timeFrame === 'year') {
        cutoffDate.setFullYear(now.getFullYear() - 1);
      }
      
      filtered = filtered.filter(item => {
        const itemDate = itemDateGetter(item);
        return itemDate && itemDate.getTime() >= cutoffDate.getTime();
      });
    }
    
    return filtered;
  };

  // Generate CSV content
  const generateCSV = (headers: string[], data: any[][]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : `"${cell}"`
      ).join(','))
    ].join('\n');
    
    return csvContent;
  };

  // Generate XLSX content using a library (simulated)
  const generateXLSX = (headers: string[], data: any[][]) => {
    // For demonstration, we're generating a CSV that Excel can open
    // In a real implementation, you would use a library like xlsx or exceljs
    return generateCSV(headers, data);
  };

  // Modified function to check if PDF libraries are loaded
  const isPdfLibraryLoaded = () => {
    return typeof window !== 'undefined' && 
           window.jspdf !== undefined && 
           typeof window.jspdf.jsPDF === 'function' && 
           typeof window.jspdfAutoTable === 'function';
  };

  // Generate PDF content using window global libraries
  const generatePDF = (headers: string[], data: any[][], title: string) => {
    if (!isPdfLibraryLoaded()) {
      console.error('PDF generation attempted but libraries are not loaded');
      return null;
    }

    try {
      // Create a new jsPDF instance using the global library
      const doc = new window.jspdf.jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      
      // Add date information
      doc.setFontSize(10);
      if (customDateRange && startDate && endDate) {
        doc.text(`Date Range: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`, 14, 30);
      } else if (timeFrame !== 'all') {
        doc.text(`Time Frame: ${timeFrame === 'month' ? 'Past Month' : timeFrame === 'quarter' ? 'Past Quarter' : 'Past Year'}`, 14, 30);
      }
      
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);
      
      // Add data count
      doc.text(`Total Items: ${data.length}`, 14, 40);
      
      // Generate the table
      window.jspdfAutoTable(doc, {
        head: [headers],
        body: data,
        startY: 45,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [188, 0, 45] },
        margin: { top: 45 },
      });
      
      return doc;
    } catch (err) {
      console.error('Error generating PDF:', err);
      return null;
    }
  };

  // Handle the generation and download of reports
  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if PDF libraries are loaded when PDF format is selected
      if (fileFormat === 'pdf' && !isPdfLibraryLoaded()) {
        setError('PDF libraries are not loaded yet. Please try again in a moment.');
        setLoading(false);
        return;
      }

      let headers: string[] = [];
      let data: any[][] = [];
      let title = '';

      // Prepare data based on report type
      if (selectedReport === 'events') {
        title = 'Events Report';
        headers = ['Event ID', 'Title', 'Date', 'Status', 'Location', 'Registrations'];
        
        const filteredEvents = getFilteredData(eventData, getEffectiveDate);
        
        data = filteredEvents.map(event => {
          const eventDate = getEffectiveDate(event);
          const location = event.location?.name || event.keyFeatures?.customLocation || 'N/A';
          const registrations = registrationData.filter(reg => reg.event === event.id).length;
          
          return [
            event.id,
            event.title,
            eventDate ? formatDate(eventDate.toISOString()) : 'N/A',
            event.status,
            location,
            registrations.toString()
          ];
        });
      } 
      else if (selectedReport === 'members') {
        title = 'Members Report';
        headers = ['Member ID', 'Name', 'Email', 'Role', 'Membership Type', 'Status', 'Join Date'];
        
        const filteredMembers = getFilteredData(memberData, (member) => 
          member.membership?.joinDate ? new Date(member.membership.joinDate) : 
          member.createdAt ? new Date(member.createdAt) : null
        );
        
        data = filteredMembers.map(member => [
          member.membership?.memberID || member.id,
          member.name,
          member.email,
          member.role,
          member.membership?.membershipType || 'N/A',
          member.membership?.membershipStatus || 'N/A',
          formatDate(member.membership?.joinDate || member.createdAt)
        ]);
      } 
      else if (selectedReport === 'registrations') {
        title = 'Event Registrations Report';
        headers = ['Registration ID', 'Event', 'Member Name', 'Email', 'Registration Date', 'Status'];
        
        const filteredRegistrations = getFilteredData(registrationData, (reg) => 
          reg.createdAt ? new Date(reg.createdAt) : null
        );
        
        data = filteredRegistrations.map(reg => [
          reg.id,
          reg.eventTitle || 'Unknown Event',
          reg.user?.name || 'Anonymous',
          reg.user?.email || 'N/A',
          formatDate(reg.createdAt),
          reg.status || 'Registered'
        ]);
      }
      else if (selectedReport === 'bookings') {
        title = 'Facility Bookings Report';
        headers = ['Booking ID', 'Event Name', 'Organizer', 'Venue Space', 'Start Date', 'End Date', 'Status'];
        
        const filteredBookings = getFilteredData(eventBookingsData, (booking) => 
          booking.startDate ? new Date(booking.startDate) : null
        );
        
        data = filteredBookings.map(booking => [
          booking.id,
          booking.eventName || 'N/A',
          booking.organizerName || 'N/A',
          booking.venueSpace || 'N/A',
          formatDate(booking.startDate),
          formatDate(booking.endDate),
          booking.status || 'Pending'
        ]);
      }
      else if (selectedReport === 'roomBookings') {
        title = 'Room Bookings Report';
        headers = ['Booking ID', 'Guest Name', 'Room Type', 'Check-In', 'Check-Out', 'Guests', 'Status'];
        
        const filteredRoomBookings = getFilteredData(roomBookingsData, (booking) => 
          booking.checkIn ? new Date(booking.checkIn) : null
        );
        
        data = filteredRoomBookings.map(booking => [
          booking.id,
          booking.name || 'N/A',
          booking.roomType === 'twin' ? 'Twin Room' : booking.roomType === 'suite' ? 'Suite Room' : booking.roomType || 'N/A',
          formatDate(booking.checkIn),
          formatDate(booking.checkOut),
          booking.guests || 'N/A',
          booking.status || 'Pending'
        ]);
      }

      // Generate appropriate file content
      let blob = null;
      
      if (fileFormat === 'csv') {
        const fileContent = generateCSV(headers, data);
        const mimeType = 'text/csv;charset=utf-8;';
        blob = new Blob([fileContent], { type: mimeType });
      } 
      else if (fileFormat === 'xlsx') {
        const fileContent = generateXLSX(headers, data);
        const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;';
        blob = new Blob([fileContent], { type: mimeType });
      } 
      else if (fileFormat === 'pdf') {
        const doc = generatePDF(headers, data, title);
        if (!doc) {
          throw new Error('Failed to generate PDF');
        }
        
        // Save the PDF
        blob = doc.output('blob');
      }

      if (!blob) {
        throw new Error('Failed to generate file');
      }

      // Create a blob and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.${fileFormat === 'xlsx' ? 'xlsx' : fileFormat === 'pdf' ? 'pdf' : 'csv'}`
      );
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report generated successfully. Your download should begin automatically.`);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Load PDF libraries via script tags with specific IDs for easier debugging */}
      <Script 
        id="jspdf-script"
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log('jsPDF loaded successfully')}
      />
      <Script 
        id="jspdf-autotable-script"
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"
        strategy="beforeInteractive"
        onLoad={handlePdfLibrariesLoaded}
      />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Reports</h1>
        <p className="text-zinc-600 mt-1">
          Generate and download reports for events, members, and bookings
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

      {/* Success message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Select Report Type</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedReport === report.id
                  ? 'border-hinomaru-red bg-hinomaru-red/5'
                  : 'border-zinc-200 hover:border-hinomaru-red/50'
              }`}
              onClick={() => setSelectedReport(report.id as ReportType)}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full mb-3 ${
                  selectedReport === report.id
                    ? 'bg-hinomaru-red text-white'
                    : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {report.icon}
                </div>
                <h3 className="font-medium text-zinc-900">{report.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{report.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="time-frame" className="block text-sm font-medium text-zinc-700 mb-1">
              Time Frame
            </label>
            <select
              id="time-frame"
              className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black disabled:bg-zinc-100 disabled:text-zinc-500"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
              disabled={customDateRange}
            >
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Past Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="file-format" className="block text-sm font-medium text-zinc-700 mb-1">
              File Format
            </label>
            <select
              id="file-format"
              className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black"
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value as FileFormat)}
            >
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="flex items-center h-10">
              <input
                id="include-inactive"
                type="checkbox"
                className="h-4 w-4 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300 rounded"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
              />
              <label htmlFor="include-inactive" className="ml-2 block text-sm text-zinc-700">
                Include Inactive {selectedReport === 'members' ? 'Members' : selectedReport === 'events' ? 'Events' : 'Items'}
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="custom-date-range"
              type="checkbox"
              className="h-4 w-4 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300 rounded"
              checked={customDateRange}
              onChange={(e) => setCustomDateRange(e.target.checked)}
            />
            <label htmlFor="custom-date-range" className="ml-2 block text-sm text-zinc-700">
              Use Custom Date Range
            </label>
          </div>
          
          {customDateRange && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-zinc-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-zinc-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-hinomaru-red hover:bg-hinomaru-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hinomaru-red"
          onClick={handleGenerateReport}
          disabled={loading || (customDateRange && (!startDate || !endDate))}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Generate Report
            </>
          )}
        </button>
      </div>
    </div>
  );
} 