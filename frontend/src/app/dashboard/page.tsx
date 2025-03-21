'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import Link from 'next/link';
import { events, news } from '@/lib/api';

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated) {
        setDashboardLoading(true);
        try {
          // Fetch upcoming events
          const eventsResponse = await events.getAll({ limit: 3 });
          setUpcomingEvents(eventsResponse.data.docs || []);
          
          // Fetch latest news
          const newsResponse = await news.getAll({ limit: 3 });
          setLatestNews(newsResponse.data.docs || []);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setDashboardLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Loading state
  if (isLoading || (!user && isAuthenticated)) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
        <div className="w-full max-w-6xl p-8">
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - this should never show due to the redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="mt-1 text-gray-600">
                {user?.membershipDetails?.isActive 
                  ? `Your ${user.membershipDetails.membershipType} membership is active until ${new Date(user.membershipDetails.renewalDate).toLocaleDateString()}`
                  : 'Your membership is inactive. Please renew to access all features.'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </Link>
              {!user?.membershipDetails?.isActive && (
                <Link
                  href="/dashboard/renew-membership"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Renew Membership
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <nav className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'events'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              My Events
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'certificates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Certificates
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {/* Loading state */}
          {dashboardLoading && (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Overview Tab */}
          {!dashboardLoading && activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800">Total Events Attended</h3>
                  <p className="mt-1 text-3xl font-semibold text-blue-900">
                    {user?.eventsAttended?.length || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800">Days Until Renewal</h3>
                  <p className="mt-1 text-3xl font-semibold text-green-900">
                    {user?.membershipDetails?.isActive
                      ? Math.max(
                          0,
                          Math.ceil(
                            (new Date(user.membershipDetails.renewalDate).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800">Certificates Earned</h3>
                  <p className="mt-1 text-3xl font-semibold text-purple-900">0</p>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Upcoming Events</h3>
                {upcomingEvents.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {upcomingEvents.map((event: any) => (
                      <li key={event.id} className="py-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 text-blue-800 flex items-center justify-center rounded-lg">
                              <span className="text-sm font-medium">
                                {new Date(event.startDate).toLocaleDateString('en-US', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-medium text-gray-900 truncate">
                              <Link href={`/events/${event.slug}`} className="hover:text-blue-600">
                                {event.title}
                              </Link>
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 truncate">{event.summary}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No upcoming events found.</p>
                )}
                <div className="mt-4">
                  <Link
                    href="/events"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View all events →
                  </Link>
                </div>
              </div>

              {/* Latest News */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Latest News</h3>
                {latestNews.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {latestNews.map((item: any) => (
                      <li key={item.id} className="py-4">
                        <div className="flex items-start space-x-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-medium text-gray-900 truncate">
                              <Link href={`/news/${item.slug}`} className="hover:text-blue-600">
                                {item.title}
                              </Link>
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">{item.summary}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(item.publishedDate).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No news articles found.</p>
                )}
                <div className="mt-4">
                  <Link
                    href="/news"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View all news →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {!dashboardLoading && activeTab === 'events' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">My Events</h3>
              {user?.eventsAttended && user.eventsAttended.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {user.eventsAttended.map((event: any) => (
                    <li key={event.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-medium text-gray-900 truncate">
                            <Link href={`/events/${event.slug}`} className="hover:text-blue-600">
                              {event.title}
                            </Link>
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-800 transition ease-in-out duration-150"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't attended any events yet.</p>
                  <Link
                    href="/events"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Browse Events
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {!dashboardLoading && activeTab === 'certificates' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">My Certificates</h3>
              {/* This would show actual certificates from the API */}
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any certificates yet.</p>
                <p className="text-sm text-gray-600">
                  Attend events and complete programs to earn certificates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}