import { events } from '@/lib/api';
import { Metadata, ResolvingMetadata } from 'next';
import EventDetailComponent from './EventDetailComponent';

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
    
    if (!response || !response.data) {
      return (
        <div className="container-custom py-20">
          <div className="japan-card">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-zinc-700 mb-6">Event not found</p>
            <a href="/events" className="btn-primary">
              Back to Events
            </a>
          </div>
        </div>
      );
    }
    
    return <EventDetailComponent initialEvent={response.data} slug={slug} />;
  } catch (error) {
    console.error('Error loading event:', error);
    return (
      <div className="container-custom py-20">
        <div className="japan-card">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-zinc-700 mb-6">Failed to load event data</p>
          <a href="/events" className="btn-primary">
            Back to Events
          </a>
        </div>
      </div>
    );
  }
} 