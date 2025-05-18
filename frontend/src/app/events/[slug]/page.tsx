import React from 'react';
import { notFound } from 'next/navigation';
import { events } from '@/lib/api';
import EventDetail from '@/components/events/EventDetail';
import { Metadata, ResolvingMetadata } from 'next';
import { Event } from '@/types';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export async function generateMetadata(
  { params }: EventPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const response = await events.getOne(slug);
    const event = response.data;
    
    if (!event) {
      return {
        title: 'Event Not Found',
      };
    }
    
    return {
      title: `${event.title} | ASA Events`,
      description: event.summary || event.content?.slice(0, 160),
      openGraph: {
        title: event.title,
        description: event.summary || event.content?.slice(0, 160),
        images: event.featuredImage ? [
          {
            url: event.featuredImage.url,
            width: 1200,
            height: 630,
            alt: event.title,
          }
        ] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Event Not Found',
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = params;
  
  try {
    const response = await events.getOne(slug);
    const event = response.data;
    
    if (!event) {
      notFound();
    }
    
    return <EventDetail event={event} />;
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
} 