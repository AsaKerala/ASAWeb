import React from 'react';
import { notFound } from 'next/navigation';
import { eventsApi } from '@/lib/api';
import EventDetail from '@/components/events/EventDetail';
import { Metadata, ResolvingMetadata } from 'next';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: EventPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const event = await eventsApi.getBySlug(slug);
    
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
    return {
      title: 'Event Not Found',
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = params;
  
  try {
    const event = await eventsApi.getBySlug(slug);
    
    if (!event) {
      notFound();
    }
    
    return <EventDetail event={event} />;
  } catch (error) {
    notFound();
  }
} 