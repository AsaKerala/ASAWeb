'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth/useAuth';
import { api, activityLogs } from '@/lib/api';

// Define activity log types
interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  status: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  details?: any;
}

export default function AdminActivityPage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    startDate: '',
    endDate: '',
  });

  // Debug logging for authentication state
  useEffect(() => {
    console.log('AdminActivityPage - Auth state:', {
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      isAdmin,
      authLoading
    });
  }, [user, isAdmin, authLoading]);

  // Fetch activity logs
  useEffect(() => {
    const fetchActivityLogs = async () => {
      // Don't do anything while auth is loading - rely on layout for admin checks
      if (authLoading) {
        console.log('Auth is still loading, waiting...');
        return;
      }

      console.log('Ready to fetch logs, isAdmin:', isAdmin);
      
      // Skip actual data fetching if not admin, but don't redirect
      // (Let the layout handle redirects for admin verification)
      if (!isAdmin) {
        console.log('Not fetching logs because user is not admin');
        return;
      }
      
      console.log('Starting to fetch activity logs');
      setIsLoading(true);
      setError(null);
      
      try {
        // Prepare query parameters
        const params: any = {
          page: currentPage,
          limit: 20,
          sort: '-createdAt',
        };
        
        // Add filters if provided
        if (filters.action) params.action = filters.action;
        if (filters.entityType) params.entityType = filters.entityType;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        
        console.log('Fetching logs with params:', params);
        const response = await activityLogs.getAll(params);
        console.log('Activity logs API response:', { 
          status: response.status, 
          docsCount: response.data?.docs?.length || 0
        });
        
        setLogs(response.data.docs || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        setError('Failed to load activity logs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityLogs();
  }, [authLoading, isAdmin, currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Apply filters
  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle refetching data
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (err) {
      return dateString;
    }
  };
  
  // Get user display name
  const getUserName = (user: ActivityLog['user']) => {
    if (!user) return 'System';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.email;
  };
  
  // Get activity label from action value
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      book: 'Book',
      cancel: 'Cancel',
      approve: 'Approve',
      reject: 'Reject',
      other: 'Other',
    };
    return labels[action] || action;
  };
  
  // Get entity type label
  const getEntityTypeLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      user: 'User',
      event: 'Event',
      'room-booking': 'Room Booking',
      'event-booking': 'Event Booking',
      'event-registration': 'Event Registration',
      program: 'Program',
      news: 'News',
      facility: 'Facility',
      resource: 'Resource',
      'contact-form': 'Contact Form',
      system: 'System',
    };
    return labels[entityType] || entityType;
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };
  
  // Function to render details based on entity type
  const renderDetails = (log: ActivityLog) => {
    if (!log.details) return null;
    
    // For contact form submissions
    if (log.entityType === 'contact-form') {
      return (
        <div className="mt-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium">Name:</p>
              <p>{log.details.name}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>{log.details.email}</p>
            </div>
            {log.details.phone && (
              <div>
                <p className="font-medium">Phone:</p>
                <p>{log.details.phone}</p>
              </div>
            )}
            <div>
              <p className="font-medium">Subject:</p>
              <p>{log.details.subject}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium">Message:</p>
            <p className="whitespace-pre-wrap">{log.details.message}</p>
          </div>
        </div>
      );
    }
    
    // For other types, just show a JSON string
    return (
      <div className="mt-2 text-sm">
        <pre className="whitespace-pre-wrap overflow-auto max-h-40 bg-zinc-50 p-2 rounded text-xs">
          {JSON.stringify(log.details, null, 2)}
        </pre>
      </div>
    );
  };
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Activity Logs</h1>
      
      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Filters</h2>
        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action filter */}
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-zinc-700 mb-1">
              Action
            </label>
            <select
              id="action"
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="register">Register</option>
              <option value="book">Book</option>
              <option value="cancel">Cancel</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Entity Type filter */}
          <div>
            <label htmlFor="entityType" className="block text-sm font-medium text-zinc-700 mb-1">
              Entity Type
            </label>
            <select
              id="entityType"
              name="entityType"
              value={filters.entityType}
              onChange={handleFilterChange}
              className="w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red"
            >
              <option value="">All Entity Types</option>
              <option value="user">User</option>
              <option value="event">Event</option>
              <option value="room-booking">Room Booking</option>
              <option value="event-booking">Event Booking</option>
              <option value="event-registration">Event Registration</option>
              <option value="program">Program</option>
              <option value="news">News</option>
              <option value="facility">Facility</option>
              <option value="resource">Resource</option>
              <option value="contact-form">Contact Form</option>
              <option value="system">System</option>
            </select>
          </div>
          
          {/* Date range filters */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red"
            />
          </div>
          
          {/* Filter buttons */}
          <div className="flex items-end space-x-2 col-span-1 md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="px-4 py-2 bg-hinomaru-red text-white rounded-md hover:bg-sakura-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hinomaru-red"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-bold mb-1">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading state */}
      {(isLoading || authLoading) && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600">
            {authLoading ? 'Checking permissions...' : 'Loading activity logs...'}
          </p>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !authLoading && logs.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-zinc-900">No activity logs found</h3>
          <p className="mt-2 text-zinc-600">
            {Object.values(filters).some(v => v !== '') 
              ? 'Try adjusting your filters or clearing them to see more results.'
              : 'No system activity has been recorded yet.'}
          </p>
        </div>
      )}
      
      {/* Logs table - only show if we have data and not loading */}
      {!isLoading && !authLoading && logs.length > 0 && (
        <>
          {/* Activity logs table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Entity Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Entity ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {getUserName(log.user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {getActionLabel(log.action)}
                      {renderDetails(log)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {getEntityTypeLabel(log.entityType)}
                      {log.entityId && <span className="block text-xs text-zinc-500">ID: {log.entityId}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {log.details ? (
                        <details>
                          <summary className="cursor-pointer">View Details</summary>
                          <pre className="mt-2 text-xs bg-zinc-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-zinc-300 rounded-l-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-zinc-300 rounded-r-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 