'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

// Mock notification data
const notificationsMock = [
  {
    id: 'notif-001',
    title: 'New Event Announced',
    message: 'Japan-Kerala Business Forum 2023 has been announced. Early registration is now open!',
    date: new Date('2023-10-22T09:30:00'),
    type: 'event',
    isRead: false,
    link: '/dashboard/events'
  },
  {
    id: 'notif-002',
    title: 'Certificate Available',
    message: 'Your certificate for "Japanese Business Culture Workshop" is now available for download.',
    date: new Date('2023-10-21T16:45:00'),
    type: 'certificate',
    isRead: true,
    link: '/dashboard/certificates'
  },
  {
    id: 'notif-003',
    title: 'Resource Update',
    message: 'New guide: "Starting a Business in Japan - 2023 Edition" has been added to the resources.',
    date: new Date('2023-10-20T11:15:00'),
    type: 'resource',
    isRead: false,
    link: '/dashboard/resources'
  },
  {
    id: 'notif-004',
    title: 'Connection Request',
    message: 'Rahul Menon has sent you a connection request.',
    date: new Date('2023-10-19T14:20:00'),
    type: 'connection',
    isRead: true,
    link: '/dashboard/directory'
  },
  {
    id: 'notif-005',
    title: 'Event Reminder',
    message: 'Reminder: "Japanese Language Exchange" event starts tomorrow at 6:00 PM.',
    date: new Date('2023-10-18T10:00:00'),
    type: 'event',
    isRead: true,
    link: '/dashboard/events'
  },
  {
    id: 'notif-006',
    title: 'Membership Renewal',
    message: 'Your ASA Kerala membership will expire in 30 days. Please renew to continue enjoying member benefits.',
    date: new Date('2023-10-17T08:30:00'),
    type: 'membership',
    isRead: false,
    link: '/dashboard/account'
  },
  {
    id: 'notif-007',
    title: 'Survey Invitation',
    message: 'Please take a moment to complete our annual member satisfaction survey.',
    date: new Date('2023-10-16T15:45:00'),
    type: 'general',
    isRead: false,
    link: '#'
  }
];

export default function NotificationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(notificationsMock);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);
  
  // Simulate loading data
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });
  
  // Get count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        );
      case 'certificate':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        );
      case 'resource':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-500"
          >
            <path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 8v8" />
          </svg>
        );
      case 'connection':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'membership':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01" />
            <path d="M18 12h.01" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M18 6v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" />
            <path d="M3 10h18" />
          </svg>
        );
    }
  };
  
  if (isLoading || !isLoaded) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Loading notifications...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with latest events, resources, and connection requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            disabled={unreadCount === 0}
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 sm:flex sm:flex-wrap sm:w-auto w-full mb-6">
          <TabsTrigger value="all" className="relative">
            All
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          <TabsTrigger value="resource">Resources</TabsTrigger>
          <TabsTrigger value="certificate">Certificates</TabsTrigger>
          <TabsTrigger value="connection">Connections</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="h-12 w-12 mx-auto text-gray-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">No notifications</h2>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {activeTab === 'unread' 
                  ? "You've read all your notifications. Check back later for updates."
                  : "You don't have any notifications in this category yet."}
              </p>
              {activeTab !== 'all' && (
                <Button variant="outline" onClick={() => setActiveTab('all')}>
                  View All Notifications
                </Button>
              )}
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`transition border-l-4 bg-white ${notification.isRead ? 'border-l-transparent' : 'border-l-primary'}`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4 p-6">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className={`font-medium ${notification.isRead ? '' : 'font-semibold'}`}>
                          {notification.title}
                        </h3>
                        <div className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                          {format(notification.date, 'MMM d, h:mm a')}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.push(notification.link)}
                        >
                          View Details
                        </Button>
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      <Card className="mt-12 bg-white">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-600">
                Receive notification emails
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Event Reminders</h3>
              <p className="text-sm text-gray-600">
                Get reminders about upcoming events
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Resource Updates</h3>
              <p className="text-sm text-gray-600">
                Be notified when new resources are added
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Connection Requests</h3>
              <p className="text-sm text-gray-600">
                Get notified about new connection requests
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Certificate Availability</h3>
              <p className="text-sm text-gray-600">
                Be notified when certificates are available
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Membership Updates</h3>
              <p className="text-sm text-gray-600">
                Receive notifications about membership status
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 