import React from 'react';
import { Metadata } from 'next';
import EventsList from '@/components/events/EventsList';

export const metadata: Metadata = {
  title: 'Events | ASA India',
  description: 'Explore upcoming and past events organized by ASA India. Conferences, seminars, workshops, cultural events, and more.',
  openGraph: {
    title: 'Events | ASA India',
    description: 'Explore upcoming and past events organized by ASA India. Conferences, seminars, workshops, cultural events, and more.',
    images: [
      {
        url: '/images/og-events.jpg',
        width: 1200,
        height: 630,
        alt: 'ASA India Events',
      },
    ],
  },
};

export default function EventsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our upcoming and past events designed to foster collaboration, knowledge sharing, and cultural exchange.
        </p>
      </div>
      
      <EventsList />
    </div>
  );
} 