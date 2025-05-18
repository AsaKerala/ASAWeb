'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Video } from 'lucide-react';
import { events } from '@/lib/api';
import { formatDate } from '@/lib/utils';

// Define types for our data
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  eventType: string;
  isFeatured?: boolean;
  featuredImage?: {
    url: string;
    alt?: string;
  };
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  isVirtual?: boolean;
  customLocation?: string;
}

const EVENT_TYPES = {
  ALL: 'all',
  CONFERENCE: 'conference',
  SEMINAR: 'seminar',
  WORKSHOP: 'workshop',
  NETWORKING: 'networking',
  CULTURAL: 'cultural',
  WEBINAR: 'webinar',
  OTHER: 'other'
};

// Type labels for display and matching purposes
const TYPE_LABELS: Record<string, string> = {
  'all': 'All Events',
  'conference': 'Conference',
  'seminar': 'Seminar',
  'workshop': 'Workshop',
  'networking': 'Networking',
  'cultural': 'Cultural Event',
  'webinar': 'Webinar',
  'other': 'Other'
};

export default function EventsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get params from URL, default to 'upcoming' and 'all'
  const tabParam = searchParams.get('tab') || 'upcoming';
  const typeParam = searchParams.get('type') || EVENT_TYPES.ALL;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Basic query without date filtering
        const baseQuery = {
          limit: 100,
          where: {
            status: {
              equals: 'published'
            }
          }
        };
        
        // Fetch all events first
        const allEventsResponse = await events.getAll(baseQuery);
        const allEvents = allEventsResponse.data.docs || [];
        
        // Manually filter for upcoming and past events based on eventDate
        const currentDate = new Date();
        const upcoming = allEvents.filter(event => 
          event.eventDate && new Date(event.eventDate) > currentDate
        ).sort((a, b) => 
          new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime()
        );
        
        const past = allEvents.filter(event => 
          !event.eventDate || new Date(event.eventDate) <= currentDate
        ).sort((a, b) => 
          new Date(b.eventDate || 0).getTime() - new Date(a.eventDate || 0).getTime()
        );
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        console.error('Error fetching events data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever events, tab, type, or search query changes
    const currentEvents = tabParam === 'upcoming' ? upcomingEvents : pastEvents;
    let filtered = [...currentEvents];
    
    // Filter by type
    if (typeParam !== EVENT_TYPES.ALL) {
      filtered = filtered.filter(event => event.eventType === typeParam);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.summary.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(filtered);
  }, [upcomingEvents, pastEvents, tabParam, typeParam, searchQuery]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const current = new URLSearchParams();
    // Copy all current parameters
    searchParams.forEach((value, key) => {
      current.set(key, value);
    });
    current.set('tab', value);
    router.push(`${pathname}?${current.toString()}`);
  };
  
  // Update URL when type changes
  const handleTypeChange = (value: string) => {
    const current = new URLSearchParams();
    // Copy all current parameters
    searchParams.forEach((value, key) => {
      current.set(key, value);
    });
    
    if (value === EVENT_TYPES.ALL) {
      current.delete('type');
    } else {
      current.set('type', value);
    }
    router.push(`${pathname}?${current.toString()}`);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You could also add the search query to the URL if needed
  };
  
  // Helper function to get location text
  const getLocationText = (event: Event): string => {
    if (event.isVirtual) return 'Virtual Event';
    return event.customLocation || 'ASA Kerala Center';
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2 mb-4">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Tabs 
          value={tabParam}
          defaultValue={tabParam} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="upcoming">
              Upcoming Events
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Tabs 
          value={typeParam}
          defaultValue={typeParam} 
          onValueChange={handleTypeChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value={EVENT_TYPES.ALL}>
              All Types
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.CONFERENCE}>
              Conferences
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.SEMINAR}>
              Seminars
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.WORKSHOP}>
              Workshops
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.CULTURAL}>
              Cultural Events
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.WEBINAR}>
              Webinars
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative h-48 w-full">
                {event.featuredImage ? (
                  <Image 
                    src={event.featuredImage.url} 
                    alt={event.title} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-muted h-full w-full flex items-center justify-center">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
                {event.isFeatured && (
                  <Badge variant="default" className="absolute top-2 right-2">
                    Featured
                  </Badge>
                )}
                {event.eventType && (
                  <Badge variant="secondary" className="absolute bottom-2 left-2">
                    {TYPE_LABELS[event.eventType] || event.eventType}
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <h3 className="text-xl font-semibold line-clamp-2">{event.title}</h3>
              </CardHeader>
              
              <CardContent className="flex-grow space-y-3">
                <p className="text-muted-foreground line-clamp-3">{event.summary}</p>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(event.eventDate || event.startDate || '')}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  {event.isVirtual ? (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      <span>Virtual Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.customLocation || "ASA Kerala Center"}</span>
                    </>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/events/${event.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-2">No events found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              router.push('/events');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}