# ASA Kerala Website Implementation Plan

## Immediate Priority: Event Registration System

This implementation plan focuses on setting up the core features needed for the temporary deployment, primarily enabling event registration functionality while the rest of the system is being developed.

## 1. Payload CMS Configuration

### 1.1 User Collection Setup

```typescript
// backend/src/collections/Users.ts
import { CollectionConfig } from 'payload/types';
import { isAdmin, isAdminOrSelf } from '../access/isAdminOrSelf';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'organization',
      type: 'text',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};

export default Users;
```

### 1.2 Event Collection Setup

```typescript
// backend/src/collections/Events.ts
import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'endDate', 'registrationOpen'],
  },
  access: {
    read: () => true, // Public read access
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            // Auto-generate slug from title
            return data?.title?.toLowerCase().replace(/ /g, '-') || '';
          },
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'event-categories',
      hasMany: true,
    },
    {
      name: 'capacity',
      type: 'number',
      min: 0,
    },
    {
      name: 'registrationOpen',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'registrationDeadline',
      type: 'date',
    },
    {
      name: 'fee',
      type: 'number',
      min: 0,
    },
    {
      name: 'resources',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
    },
  ],
};

export default Events;
```

### 1.3 EventRegistration Collection Setup

```typescript
// backend/src/collections/EventRegistrations.ts
import { CollectionConfig } from 'payload/types';
import { isAdmin, isAdminOrSelf } from '../access/isAdminOrSelf';

const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'event', 'registrationDate', 'status'],
  },
  access: {
    read: isAdminOrSelf('user'),
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'registrationDate',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Attended', value: 'attended' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Not Required', value: 'not-required' },
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'not-required',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  hooks: {
    // Add hooks for validation, email notifications, etc.
  },
};

export default EventRegistrations;
```

### 1.4 Resource Collection Setup

```typescript
// backend/src/collections/Resources.ts
import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { checkEventAccess } from '../access/checkEventAccess';

const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: checkEventAccess, // Custom access function to check event registration
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedDate',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
};

export default Resources;
```

### 1.5 Access Control Functions

```typescript
// backend/src/access/isAdmin.ts
import { Access } from 'payload/config';

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin';
};
```

```typescript
// backend/src/access/isAdminOrSelf.ts
import { Access } from 'payload/config';

export const isAdminOrSelf = (fieldName = 'id'): Access => {
  return ({ req: { user }, id, data }) => {
    // Admin can access any document
    if (user?.role === 'admin') return true;

    // User can access their own document
    if (fieldName === 'id') {
      return user?.id === id;
    }

    // For relationships where the user ID is in a field
    return user?.id === data?.[fieldName];
  };
};
```

```typescript
// backend/src/access/checkEventAccess.ts
import { Access } from 'payload/config';
import { PayloadRequest } from 'payload/types';

export const checkEventAccess: Access = async ({ req, id }) => {
  const { user, payload } = req as PayloadRequest;

  // Admins can access all resources
  if (user?.role === 'admin') return true;

  // If no user, only public resources are accessible
  if (!user) {
    const resource = await payload.findByID({
      collection: 'resources',
      id,
    });
    return resource?.isPublic;
  }

  // Get the resource to check its associated event
  const resource = await payload.findByID({
    collection: 'resources',
    id,
  });

  if (resource?.isPublic) return true;

  // Check if user has registered for the event
  const registrations = await payload.find({
    collection: 'event-registrations',
    where: {
      and: [
        { user: { equals: user.id } },
        { event: { equals: resource.event } },
        {
          or: [
            { status: { equals: 'confirmed' } },
            { status: { equals: 'attended' } },
          ],
        },
      ],
    },
  });

  return registrations.docs.length > 0;
};
```

## 2. Custom Endpoints for Event Registration

### 2.1 Event Registration Endpoint

```typescript
// backend/src/endpoints/eventRegistration.ts
import { Endpoint } from 'payload/config';
import { PayloadRequest } from 'payload/types';

export const registerForEvent: Endpoint = {
  path: '/api/register-event',
  method: 'post',
  handler: async (req: PayloadRequest, res) => {
    const { eventId } = req.body;
    const { user, payload } = req;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Check if event exists and is open for registration
      const event = await payload.findByID({
        collection: 'events',
        id: eventId,
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (!event.registrationOpen) {
        return res.status(400).json({ error: 'Registration is closed for this event' });
      }

      // Check if user is already registered
      const existingRegistration = await payload.find({
        collection: 'event-registrations',
        where: {
          and: [
            { user: { equals: user.id } },
            { event: { equals: eventId } },
          ],
        },
      });

      if (existingRegistration.docs.length > 0) {
        return res.status(400).json({ error: 'You are already registered for this event' });
      }

      // Check if event has reached capacity
      if (event.capacity > 0) {
        const registrations = await payload.find({
          collection: 'event-registrations',
          where: {
            and: [
              { event: { equals: eventId } },
              {
                or: [
                  { status: { equals: 'confirmed' } },
                  { status: { equals: 'attended' } },
                  { status: { equals: 'pending' } },
                ],
              },
            ],
          },
        });

        if (registrations.docs.length >= event.capacity) {
          return res.status(400).json({ error: 'This event has reached capacity' });
        }
      }

      // Create registration
      const registration = await payload.create({
        collection: 'event-registrations',
        data: {
          user: user.id,
          event: eventId,
          status: event.fee > 0 ? 'pending' : 'confirmed',
          paymentStatus: event.fee > 0 ? 'pending' : 'not-required',
        },
      });

      // TODO: Send confirmation email

      return res.status(200).json({
        message: 'Successfully registered for event',
        registration,
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      return res.status(500).json({
        error: 'An error occurred while registering for the event',
      });
    }
  },
};
```

## 3. Frontend Implementation for Event Registration

### 3.1 Event Detail Page

```typescript
// frontend/src/app/events/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/api/events';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);
  
  if (!event) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {event.image && (
          <div className="h-64 w-full relative">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL}${event.image.url}`} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <span className="font-semibold">Date:</span> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </div>
            
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <span className="font-semibold">Location:</span> {event.location}
            </div>
            
            {event.fee > 0 && (
              <div className="bg-gray-100 px-4 py-2 rounded-full">
                <span className="font-semibold">Fee:</span> ₹{event.fee}
              </div>
            )}
          </div>
          
          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
          
          <EventRegistrationForm event={event} />
        </div>
      </div>
    </div>
  );
}
```

### 3.2 Event Registration Component

```typescript
// frontend/src/components/events/EventRegistrationForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';

export default function EventRegistrationForm({ event }) {
  const { user, isAuthenticated, isLoading, signIn } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegistration = async () => {
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      router.push(`/login?returnTo=/events/${event.slug}`);
      return;
    }

    setIsRegistering(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token
          'Authorization': `JWT ${localStorage.getItem('payload-token')}`,
        },
        body: JSON.stringify({
          eventId: event.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event');
      }

      setSuccess('Successfully registered for this event!');
      // Refresh the page to update UI
      router.refresh();
      
      // Redirect to payment page if needed
      if (event.fee > 0) {
        router.push(`/payment/event/${event.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  // If event registration is closed or at capacity
  if (!event.registrationOpen) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-yellow-700">
          Registration is currently closed for this event.
        </p>
      </div>
    );
  }

  // Check if user is already registered
  const isUserRegistered = user && event.registrations?.some(
    reg => reg.user.id === user.id && ['confirmed', 'pending', 'attended'].includes(reg.status)
  );

  if (isUserRegistered) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <p className="text-green-700">
          You are already registered for this event.
        </p>
        <Button 
          onClick={() => router.push('/dashboard/events')} 
          className="mt-4"
        >
          View in Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Register for this Event</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <Button
        onClick={handleRegistration}
        disabled={isRegistering || isLoading}
        className="w-full"
      >
        {isRegistering ? 'Registering...' : 'Register Now'}
      </Button>
      
      {event.fee > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          Registration fee: ₹{event.fee}. You will be redirected to the payment page after registration.
        </p>
      )}
    </div>
  );
}
```

## 4. User Dashboard Implementation

### 4.1 Dashboard Layout

```typescript
// frontend/src/app/dashboard/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/server';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({ children }) {
  const user = await getUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?returnTo=/dashboard');
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar user={user} />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
```

### 4.2 Dashboard Homepage

```typescript
// frontend/src/app/dashboard/page.tsx
import React from 'react';
import { getUserDashboardData } from '@/lib/api/user';
import DashboardCard from '@/components/dashboard/DashboardCard';

export default async function DashboardPage() {
  const { user, events, resources } = await getUserDashboardData();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="My Events"
          count={events.upcoming.length}
          description="Upcoming events"
          link="/dashboard/events"
          icon="calendar"
        />
        
        <DashboardCard
          title="Resources"
          count={resources.length}
          description="Available resources"
          link="/dashboard/resources"
          icon="document"
        />
        
        <DashboardCard
          title="Certificates"
          count={events.completed.length}
          description="Completed events"
          link="/dashboard/certificates"
          icon="certificate"
        />
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        
        {events.upcoming.length > 0 ? (
          <div className="space-y-4">
            {events.upcoming.map(event => (
              <div key={event.id} className="border-b pb-4">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDate).toLocaleDateString()} at {event.location}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have no upcoming events.</p>
        )}
      </div>
    </div>
  );
}
```

### 4.3 Events List Page

```typescript
// frontend/src/app/dashboard/events/page.tsx
import React from 'react';
import Link from 'next/link';
import { getUserEvents } from '@/lib/api/user';
import EventStatusBadge from '@/components/dashboard/EventStatusBadge';

export default async function EventsPage() {
  const { upcoming, past } = await getUserEvents();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Events</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        
        {upcoming.length > 0 ? (
          <div className="space-y-6">
            {upcoming.map(registration => (
              <div key={registration.id} className="border-b pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      <Link href={`/events/${registration.event.slug}`} className="text-blue-600 hover:underline">
                        {registration.event.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(registration.event.startDate).toLocaleDateString()} - {new Date(registration.event.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {registration.event.location}
                    </p>
                  </div>
                  
                  <EventStatusBadge status={registration.status} />
                </div>
                
                <div className="mt-4 flex gap-3">
                  <Link 
                    href={`/dashboard/events/${registration.event.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                  
                  {registration.event.resources.length > 0 && (
                    <Link 
                      href={`/dashboard/resources?event=${registration.event.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Resources
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have no upcoming events.</p>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Past Events</h2>
        
        {past.length > 0 ? (
          <div className="space-y-6">
            {past.map(registration => (
              <div key={registration.id} className="border-b pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      <Link href={`/events/${registration.event.slug}`} className="text-blue-600 hover:underline">
                        {registration.event.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(registration.event.startDate).toLocaleDateString()} - {new Date(registration.event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <EventStatusBadge status={registration.status} />
                </div>
                
                <div className="mt-4 flex gap-3">
                  {registration.status === 'attended' && (
                    <Link 
                      href={`/dashboard/certificates/${registration.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Certificate
                    </Link>
                  )}
                  
                  {registration.event.resources.length > 0 && (
                    <Link 
                      href={`/dashboard/resources?event=${registration.event.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Resources
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have no past events.</p>
        )}
      </div>
    </div>
  );
}
```

## 5. Implementation Timeline

### Phase 1: Core Setup (Days 1-3)
- Set up Payload CMS collections (Users, Events, EventRegistrations)
- Configure access control policies
- Create seed script for initial data

### Phase 2: Event Registration Feature (Days 4-7)
- Implement event detail page with registration form
- Build custom registration API endpoint
- Set up user authentication flow
- Create basic dashboard layout

### Phase 3: User Dashboard (Days 8-12)
- Build dashboard homepage with summary cards
- Implement events listing in dashboard
- Create resources access control logic
- Build resources page with conditional access

### Phase 4: Polish and Deploy (Days 13-14)
- Test all features and fix issues
- Optimize for mobile
- Deploy backend and update frontend deployment
- Document usage for client

## 6. Testing Plan

### 6.1 User Account Testing
- Create admin and regular user accounts
- Test login/logout functionality
- Verify role-based access control

### 6.2 Event Registration Testing
- Create test events with different configurations
- Test registration flow as a logged-in user
- Test registration validation (capacity limits, etc.)
- Verify registration status updates

### 6.3 Dashboard Testing
- Verify dashboard access is restricted to logged-in users
- Test event listing functionality
- Test resource access permissions
- Verify all dashboard links work correctly

## 7. Deployment Checklist

### 7.1 Backend Deployment
- Configure production environment variables
- Set up MongoDB connection
- Build production Docker image
- Deploy and test API endpoints
- Configure CORS for frontend access

### 7.2 Frontend Updates
- Update API URL to point to production backend
- Test authentication with production backend
- Verify registration flow end-to-end
- Deploy updated frontend to Render

## 8. Post-Deployment Tasks

- Create admin account for client
- Add initial events and resources
- Prepare documentation for content management
- Schedule training session with client 