import { Metadata } from 'next';
import { events } from '@/lib/api';
import EventDetailComponent from './EventDetailComponent';
import Link from 'next/link';

// Set dynamic rendering and cache policy
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

interface EventDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const response = await events.getOne(slug);
    const event = response.data;
    
    if (!event) {
      return {
        title: 'Event Not Found'
      };
    }
    
    return {
      title: `${event.title} | ASA Events`,
      description: event.summary || `Learn more about ${event.title} and register today.`,
      openGraph: {
        title: event.title,
        description: event.summary || `Learn more about ${event.title} and register today.`,
        images: typeof event.featuredImage === 'object' && event.featuredImage?.url ? [event.featuredImage.url] : []
      }
    };
  } catch (error) {
    console.error('Error fetching event data for metadata:', error);
    return {
      title: 'Event Not Found'
    };
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = params;
  
  try {
    const response = await events.getOne(slug);
    const event = response.data;
    
    if (!event) {
      return (
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-zinc-700 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/events" 
              className="bg-hinomaru-red text-white px-6 py-3 rounded-washi font-medium hover:bg-sakura-700 transition duration-300"
            >
              Browse All Events
            </Link>
            <Link 
              href="/" 
              className="bg-transparent border border-hinomaru-red text-hinomaru-red px-6 py-3 rounded-washi font-medium hover:bg-hinomaru-red/5 transition duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      );
    }
    
    return <EventDetailComponent initialEvent={event} slug={slug} />;
  } catch (error) {
    console.error('Error fetching event:', error);
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Event</h1>
        <p className="text-zinc-700 mb-8">There was an error loading this event. Please try again later.</p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/events" 
            className="bg-hinomaru-red text-white px-6 py-3 rounded-washi font-medium hover:bg-sakura-700 transition duration-300"
          >
            Browse All Events
          </Link>
          <Link 
            href="/" 
            className="bg-transparent border border-hinomaru-red text-hinomaru-red px-6 py-3 rounded-washi font-medium hover:bg-hinomaru-red/5 transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
} 