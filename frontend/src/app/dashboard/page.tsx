'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth';
import Link from 'next/link';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Event as EventType, EventRegistration } from '@/lib/api/types';
import { events as eventsApi } from '@/lib/api';
import DashboardLayout from './DashboardLayout';

// Define a local Event interface that extends EventType to ensure all fields are properly typed
interface Event extends EventType {
  // These fields ensure backward compatibility for older code 
  eventDate?: string;
  startDate?: string;
  endDate?: string;
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    
    const loadDashboardData = async () => {
      try {
        setDataLoading(true);
        
        // Fetch user's event registrations
        const regsResponse = await eventsApi.getMyRegistrations();
        setRegistrations(regsResponse.data?.docs || []);
        
        // Fetch upcoming events (limit to 5)
        const today = new Date().toISOString().split('T')[0];
        
        const upcomingEventsResponse = await eventsApi.getAll({
          where: {
            status: { equals: 'published' }
          },
          limit: 10, // Fetch more events to ensure we have enough after filtering
          sort: 'startDate',
        });
        
        // Filter events on the client side to include all date fields
        let fetchedEvents = upcomingEventsResponse.data?.docs || [];
        
        // Sort events by date (use any available date field)
        fetchedEvents.sort((a: Event, b: Event) => {
          const dateA = a.keyFeatures?.eventDate || a.keyFeatures?.startDate || a.eventDate || a.startDate || '';
          const dateB = b.keyFeatures?.eventDate || b.keyFeatures?.startDate || b.eventDate || b.startDate || '';
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        
        // Filter out past events
        const now = new Date();
        fetchedEvents = fetchedEvents.filter((event: Event) => {
          const eventDate = new Date(
            event.keyFeatures?.eventDate || 
            event.keyFeatures?.startDate || 
            event.eventDate ||
            event.startDate ||
            ''
          );
          return eventDate >= now;
        });
        
        // Limit to 5 events after filtering
        setEvents(fetchedEvents.slice(0, 5));
        
        // Fetch member details if user is a member
        if (user.role === 'member') {
          // This functionality needs to be implemented through the main API
          // const memberDetails = await membersApi.getMemberByUserId(user.id);
          // setMemberInfo(memberDetails);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  if (isLoading || dataLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-hinomaru-red to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'Member'}!</h1>
          <p className="mt-2 text-white/90">
            {user?.role === 'member' 
              ? `Thank you for being a valued member of ASA. Your membership is ${memberInfo?.status || 'active'}.` 
              : 'Explore upcoming events and manage your registrations from your dashboard.'}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Registrations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-100">
            <h2 className="text-xl font-semibold text-zinc-800 mb-4">My Registrations</h2>
            
            {registrations.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>You haven't registered for any events yet.</p>
                <Link 
                  href="/programs-events" 
                  className="mt-4 inline-block text-hinomaru-red hover:text-pink-700 font-medium"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <div key={reg.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium text-zinc-800">{typeof reg.event !== 'string' ? reg.event?.title : 'Event'}</h3>
                    {typeof reg.event !== 'string' && reg.event?.startDate && (
                      <p className="text-sm text-zinc-500">
                        {format(new Date(reg.event.startDate), 'MMM d, yyyy')}
                        {reg.event.endDate && typeof reg.event.endDate === 'string' && 
                          ` - ${format(new Date(reg.event.endDate), 'MMM d, yyyy')}`}
                      </p>
                    )}
                    <div className="mt-2 flex justify-between items-center">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          reg.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : reg.status === 'waitlisted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </span>
                      <Link 
                        href={`/programs-events/${typeof reg.event !== 'string' ? reg.event?.slug : ''}`}
                        className="text-sm text-hinomaru-red hover:text-pink-700"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-100">
            <h2 className="text-xl font-semibold text-zinc-800 mb-4">Upcoming Events</h2>
            
            {events.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>No upcoming events at the moment.</p>
                <p className="text-sm mt-1">Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 border-b border-zinc-100 last:border-b-0">
                    <h3 className="font-medium text-zinc-800">{event.title}</h3>
                    {(event.keyFeatures?.eventDate || event.keyFeatures?.startDate || event.eventDate || event.startDate) && (
                      <p className="text-sm text-zinc-500">
                        {event.keyFeatures?.eventDate 
                          ? format(new Date(event.keyFeatures.eventDate), 'MMM d, yyyy')
                          : event.keyFeatures?.startDate
                            ? format(new Date(event.keyFeatures.startDate), 'MMM d, yyyy')
                            : event.eventDate 
                              ? format(new Date(event.eventDate), 'MMM d, yyyy')
                              : event.startDate
                                ? format(new Date(event.startDate), 'MMM d, yyyy')
                                : 'Date TBD'}
                        {(event.keyFeatures?.endDate || event.endDate) && 
                          ((event.keyFeatures?.endDate && ` - ${format(new Date(event.keyFeatures.endDate), 'MMM d, yyyy')}`) || 
                           (event.endDate && ` - ${format(new Date(event.endDate), 'MMM d, yyyy')}`))
                        }
                      </p>
                    )}
                    <p className="text-sm text-zinc-600 mt-1">
                      {event.keyFeatures?.customLocation 
                        ? event.keyFeatures.customLocation
                        : event.keyFeatures?.isVirtual || event.keyFeatures?.mode === 'online'
                        ? 'Online'
                        : typeof event.location === 'object' && event.location?.isVirtual 
                        ? 'Online'
                        : typeof event.location === 'object' && event.location?.name 
                        ? event.location.name
                        : typeof event.location === 'object' && event.location?.address
                        ? event.location.address
                        : typeof event.location === 'object' && event.location?.city
                        ? `${event.location.city}${event.location.state ? `, ${event.location.state}` : ''}`
                        : typeof event.location === 'string'
                        ? event.location
                        : 'Location TBD'}
                    </p>
                    <div className="mt-2">
                      <Link 
                        href={`/programs-events/${event.slug}`}
                        className="text-sm text-hinomaru-red hover:text-pink-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 text-center">
                  <Link 
                    href="/programs-events" 
                    className="inline-block text-hinomaru-red hover:text-pink-700 font-medium text-sm"
                  >
                    View All Events
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-100">
          <h2 className="text-xl font-semibold text-zinc-800 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link 
              href="/programs-events" 
              className="flex flex-col items-center p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hinomaru-red mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-zinc-800 font-medium">View Events</span>
            </Link>
            
            <Link 
              href="/profile/settings" 
              className="flex flex-col items-center p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hinomaru-red mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-zinc-800 font-medium">Profile Settings</span>
            </Link>
            
            {user?.role === 'member' && (
              <Link 
                href="/profile/membership" 
                className="flex flex-col items-center p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hinomaru-red mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span className="text-zinc-800 font-medium">Membership</span>
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link 
                href="/admin-dashboard" 
                className="flex flex-col items-center p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hinomaru-red mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-zinc-800 font-medium">Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}