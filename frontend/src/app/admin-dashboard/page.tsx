'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bookingsApi, activityLogs } from '@/lib/api';
import { format, parseISO } from 'date-fns';

// Activity log interface
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    roomBookings: { total: 0, pending: 0 },
    eventBookings: { total: 0, pending: 0 },
    eventRegistrations: { total: 0 },
    members: { total: 0, new: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would have an API endpoint that returns all stats
        // For now, we'll fetch what we can and use placeholder data

        // Fetch room bookings
        const roomBookingsResponse = await bookingsApi.getRoomBookings();
        const roomBookings = roomBookingsResponse.data?.docs || [];
        const pendingRoomBookings = roomBookings.filter(booking => booking.status === 'pending');

        // Fetch event bookings
        const eventBookingsResponse = await bookingsApi.getEventBookings();
        const eventBookings = eventBookingsResponse.data?.docs || [];
        const pendingEventBookings = eventBookings.filter(booking => booking.status === 'pending');

        setStats({
          roomBookings: {
            total: roomBookings.length,
            pending: pendingRoomBookings.length
          },
          eventBookings: {
            total: eventBookings.length,
            pending: pendingEventBookings.length
          },
          eventRegistrations: {
            total: 120 // Placeholder data
          },
          members: {
            total: 450, // Placeholder data
            new: 28 // Placeholder data
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecentActivity = async () => {
      setActivitiesLoading(true);
      try {
        // Fetch the most recent activities
        const response = await activityLogs.getAll({
          limit: 5,
          sort: '-createdAt',
        });
        
        if (response.data && response.data.docs) {
          setRecentActivities(response.data.docs);
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchDashboardData();
    fetchRecentActivity();
  }, []);

  // Quick action items
  const quickActions = [
    {
      title: 'Manage Room Bookings',
      description: 'View and manage accommodation reservations',
      href: '/admin-dashboard/bookings?tab=rooms',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Manage Event Bookings',
      description: 'View and manage venue bookings for events',
      href: '/admin-dashboard/bookings?tab=events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Event Participants',
      description: 'Manage registrations for upcoming events',
      href: '/admin-dashboard/events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Manage Members',
      description: 'View and manage member accounts',
      href: '/admin-dashboard/members',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: 'Website Content',
      description: 'Update content across the website',
      href: `${process.env.NEXT_PUBLIC_API_URL}/admin`,
      target: '_blank',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      title: 'System Activity Logs',
      description: 'View all activity logs and audit trail',
      href: '/admin-dashboard/activity',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  // Convert timestamps to readable format
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      } else if (diffInMinutes < 24 * 60) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else {
        const days = Math.floor(diffInMinutes / (60 * 24));
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return format(date, 'MMM d, yyyy');
      }
    } catch (err) {
      return 'Unknown date';
    }
  };

  // Get activity icon based on entity type and action
  const getActivityIcon = (activity: ActivityLog) => {
    const { entityType, action } = activity;
    
    // User related activities
    if (entityType === 'user') {
      return (
        <div className="p-2 rounded-full bg-blue-100 text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
    
    // Event related activities
    if (entityType === 'event' || entityType === 'event-registration') {
      return (
        <div className="p-2 rounded-full bg-green-100 text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    
    // Booking related activities
    if (entityType === 'room-booking' || entityType === 'event-booking') {
      return (
        <div className="p-2 rounded-full bg-purple-100 text-purple-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      );
    }
    
    // System activities
    return (
      <div className="p-2 rounded-full bg-zinc-100 text-zinc-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    );
  };
  
  // Get activity description based on log data
  const getActivityDescription = (activity: ActivityLog) => {
    const { action, entityType, user, details } = activity;
    
    // Format the user name
    const userName = user 
      ? (user.firstName && user.lastName) 
        ? `${user.firstName} ${user.lastName}` 
        : user.email
      : 'System';
    
    // Create description based on activity type
    if (entityType === 'user') {
      if (action === 'login') return `${userName} logged in to the system`;
      if (action === 'register') return `${userName} registered an account`;
      if (action === 'update') return `${userName} updated their profile`;
    }
    
    if (entityType === 'room-booking') {
      if (action === 'create') return `${userName} created a new room booking`;
      if (action === 'book') return `${userName} booked a room`;
      if (action === 'cancel') return `${userName} cancelled a room booking`;
      if (action === 'approve') return `${userName} approved a room booking`;
      if (action === 'reject') return `${userName} rejected a room booking`;
    }
    
    if (entityType === 'event-booking') {
      if (action === 'create') return `${userName} created a new event venue booking`;
      if (action === 'book') return `${userName} booked an event venue`;
      if (action === 'cancel') return `${userName} cancelled an event venue booking`;
      if (action === 'approve') return `${userName} approved an event venue booking`;
      if (action === 'reject') return `${userName} rejected an event venue booking`;
    }
    
    if (entityType === 'event') {
      if (action === 'create') return `${userName} created a new event`;
      if (action === 'update') return `${userName} updated an event`;
      if (action === 'delete') return `${userName} deleted an event`;
    }
    
    if (entityType === 'event-registration') {
      if (action === 'register') return `${userName} registered for an event`;
      if (action === 'cancel') return `${userName} cancelled an event registration`;
    }
    
    // Default description
    return `${userName} performed ${action} on ${entityType}`;
  };
  
  // Get secondary description if available
  const getSecondaryDescription = (activity: ActivityLog) => {
    const { details } = activity;
    
    if (details && details.message) return details.message;
    if (details && details.description) return details.description;
    
    return null;
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Admin Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Room Bookings Stat */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Room Bookings</p>
                  <p className="text-2xl font-bold text-zinc-900">{stats.roomBookings.total}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              {stats.roomBookings.pending > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-yellow-600">
                    {stats.roomBookings.pending} pending approval
                  </span>
                </div>
              )}
            </div>

            {/* Event Venue Bookings Stat */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Event Venue Bookings</p>
                  <p className="text-2xl font-bold text-zinc-900">{stats.eventBookings.total}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              {stats.eventBookings.pending > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-yellow-600">
                    {stats.eventBookings.pending} pending approval
                  </span>
                </div>
              )}
            </div>

            {/* Event Registrations Stat */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Event Registrations</p>
                  <p className="text-2xl font-bold text-zinc-900">{stats.eventRegistrations.total}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Members Stat */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Members</p>
                  <p className="text-2xl font-bold text-zinc-900">{stats.members.total}</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600">
                  +{stats.members.new} new this month
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href}
                target={action.target}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-zinc-100 text-hinomaru-red group-hover:bg-hinomaru-red group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 group-hover:text-hinomaru-red transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {activitiesLoading ? (
              <div className="flex justify-center py-6">
                <div className="inline-block w-8 h-8 border-3 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-center text-zinc-500">No recent activities found</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity)}
                        <div>
                          <p className="font-medium text-zinc-900">{getActivityDescription(activity)}</p>
                          {getSecondaryDescription(activity) && (
                            <p className="text-sm text-zinc-500">{getSecondaryDescription(activity)}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-zinc-500">{formatTimeAgo(activity.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href="/admin-dashboard/activity" className="text-sm text-hinomaru-red hover:text-hinomaru-red-dark">
                View all activity
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 