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
import { Search, Calendar } from 'lucide-react';
import { events as eventsApi } from '@/lib/api';
import { format } from 'date-fns';
import { SafeImage } from '@/components/common';

// Define types for our data
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  eventType: string;
  isFeatured?: boolean;
  eventDate?: string;
  featuredImage?: {
    url: string;
    alt?: string;
  };
  mode?: string;
  startDate?: string;
  endDate?: string;
}

const EVENT_TYPES = {
  ALL: 'all',
  CONFERENCES: 'conferences',
  SEMINARS: 'seminars',
  WORKSHOPS: 'workshops',
  CULTURAL: 'cultural-events',
  WEBINARS: 'webinars',
  OTHER: 'other'
};

// Type labels for display and matching purposes
const TYPE_LABELS: Record<string, string> = {
  'all': 'All Events',
  'conferences': 'Conferences',
  'seminars': 'Seminars',
  'workshops': 'Workshops',
  'cultural-events': 'Cultural Events',
  'webinars': 'Webinars',
  'other': 'Other Events'
};

export default function EventsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get type from URL query params, default to 'all'
  const typeParam = searchParams.get('type') || EVENT_TYPES.ALL;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching events data...');
        const response = await eventsApi.getAll({
          limit: 100,
          where: {
            status: {
              equals: 'published'
            }
          }
        });
        
        console.log('Events API response:', response);
        
        if (!response || !response.data) {
          console.error('Invalid response structure:', response);
          setError('Failed to load data: Invalid response format');
          return;
        }
        
        // Check if docs array is present
        if (!response.data.docs) {
          console.error('No docs array in response data:', response.data);
          setError('Failed to load data: Missing event data');
          return;
        }
        
        setEvents(response.data.docs);
      } catch (err) {
        console.error('Error fetching events data:', err);
        setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever events, type, or search query changes
    let filtered = [...events];
    
    // Filter by type
    if (typeParam !== EVENT_TYPES.ALL) {
      filtered = filtered.filter((event: Event) => event.eventType === typeParam);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event: Event) => 
        event.title.toLowerCase().includes(query) || 
        event.summary.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, typeParam, searchQuery]);
  
  // Update URL when type changes
  const handleTypeChange = (value: string) => {
    const current = new URLSearchParams();
    // Copy all current parameters
    searchParams.forEach((value, key) => {
      current.set(key, value);
    });
    
    // Update type parameter
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
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
          <Button type="submit" className="btn-primary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Tabs 
          value={typeParam}
          defaultValue={typeParam} 
          onValueChange={handleTypeChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value={EVENT_TYPES.ALL} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              All Events
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.CONFERENCES} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Conferences
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.SEMINARS} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Seminars
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.WORKSHOPS} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Workshops
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.CULTURAL} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Cultural Events
            </TabsTrigger>
            <TabsTrigger value={EVENT_TYPES.WEBINARS} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Webinars
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: Event) => (
            <div key={event.id} className="japan-card overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
              <div className="relative h-48 w-full mb-4">
                {event.featuredImage ? (
                  <SafeImage
                    src={event.featuredImage.url} 
                    alt={event.title} 
                    fill 
                    className="object-cover rounded-md"
                    fallbackSrc="/assets/placeholder-event.jpg"
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center rounded-md">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
                {event.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-hinomaru-red text-white border-none">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute bottom-2 left-2 bg-white text-hinomaru-red border-none">
                  {TYPE_LABELS[event.eventType] || event.eventType}
                </Badge>
                
                {event.mode && (
                  <Badge className="absolute bottom-2 right-2 bg-zinc-800 text-white border-none">
                    {event.mode}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2">{event.title}</h3>
              
              {event.eventDate && (
                <div className="flex items-center gap-2 mb-2 text-zinc-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(event.eventDate), 'MMMM d, yyyy')}
                  </span>
                </div>
              )}
              {!event.eventDate && event.startDate && (
                <div className="flex items-center gap-2 mb-2 text-zinc-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(event.startDate), 'MMMM d, yyyy')}
                    {event.endDate && ` - ${format(new Date(event.endDate), 'MMMM d, yyyy')}`}
                  </span>
                </div>
              )}
              
              <p className="text-zinc-700 mb-4 flex-grow line-clamp-3">{event.summary}</p>
              
              <div className="mt-auto">
                <Link 
                  href={`/events/${event.slug}`}
                  className="btn-primary inline-block w-full text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="japan-card text-center py-8">
          <p className="text-zinc-700 mb-4">No events found matching your criteria.</p>
          <Button 
            className="btn-primary"
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