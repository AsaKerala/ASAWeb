'use client';

import { useState, useEffect } from 'react';
import { events as eventsApi } from '@/lib/api';
import { Event } from '@/lib/api/types';
import Link from 'next/link';
import { SafeImage } from '@/components/common';
import { 
  Search, 
  Filter,
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  ChevronRight,
  Video,
  X,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { formatDate, formatTime } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Event types
const EVENT_TYPES = [
  { id: 'all', name: 'All Events' },
  { id: 'technical', name: 'Technical' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'workshop', name: 'Workshop' },
  { id: 'seminar', name: 'Seminar' },
  { id: 'conference', name: 'Conference' },
  { id: 'meetup', name: 'Meetup' },
  { id: 'other', name: 'Other' },
];

// Extended Event type for backward compatibility
type ExtendedEvent = Event & {
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string | {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isVirtual?: boolean;
    virtualLink?: string;
  };
  eventType?: string;
  isFeatured?: boolean;
  isVirtual?: boolean;
  customLocation?: string;
  venue?: string;
};

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<ExtendedEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<ExtendedEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<ExtendedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ExtendedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and tabs
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await eventsApi.getAll({
          limit: 100, // Higher limit to get most events
          sort: '-createdAt', // Sort by newest first
          where: {
            status: {
              equals: 'published'
            }
          }
        });
        
        if (response && response.data && response.data.docs) {
          const events = response.data.docs;
          setAllEvents(events);
          
          // Separate upcoming and past events
          const now = new Date();
          const upcoming: ExtendedEvent[] = [];
          const past: ExtendedEvent[] = [];
          
          events.forEach((event: ExtendedEvent) => {
            let eventDate = event.eventDate
              ? new Date(event.eventDate)
              : event.startDate
                ? new Date(event.startDate)
                : event.keyFeatures && typeof event.keyFeatures === 'object' && !Array.isArray(event.keyFeatures)
                  ? event.keyFeatures.eventDate
                    ? new Date(event.keyFeatures.eventDate)
                    : event.keyFeatures.startDate
                      ? new Date(event.keyFeatures.startDate)
                      : now
                  : now;
            
            // For past events, use end date if available for more accuracy
            const endDate = event.endDate 
              ? new Date(event.endDate)
              : event.keyFeatures && typeof event.keyFeatures === 'object' && !Array.isArray(event.keyFeatures) && event.keyFeatures.endDate
                ? new Date(event.keyFeatures.endDate)
                : eventDate;
            
            if (endDate >= now) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          });
          
          // Sort upcoming events by date (closest first)
          upcoming.sort((a, b) => {
            const dateA = a.eventDate || a.startDate || '';
            const dateB = b.eventDate || b.startDate || '';
            return new Date(dateA).getTime() - new Date(dateB).getTime();
          });
          
          // Sort past events by date (most recent first)
          past.sort((a, b) => {
            const dateA = a.eventDate || a.startDate || '';
            const dateB = b.eventDate || b.startDate || '';
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          
          setUpcomingEvents(upcoming);
          setPastEvents(past);
          
          // Initialize filtered events to upcoming events
          setFilteredEvents(upcoming);
        } else {
          setError('No events found');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  // Update filtered events when filters or tab changes
  useEffect(() => {
    // Select base list based on active tab
    const baseEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
    
    // Apply event type filter
    let filtered = baseEvents;
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.eventType === selectedType);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) || 
        (event.summary && event.summary.toLowerCase().includes(query))
      );
    }
    
    setFilteredEvents(filtered);
  }, [activeTab, selectedType, searchQuery, upcomingEvents, pastEvents]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Events</h1>
            <p className="text-xl">
              Discover workshops, seminars, cultural experiences, and networking opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container-custom">
          <div className="flex justify-center overflow-x-auto py-4 gap-8">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'upcoming' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Upcoming Events
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'past' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Past Events
            </button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text" 
                placeholder="Search events..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={18} className="text-gray-600" />
              <p className="text-sm text-gray-600 whitespace-nowrap">Filter by:</p>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events List Section */}
      <section className="py-12 bg-zinc-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
              <p className="text-zinc-700 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </Button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-zinc-800 mb-4">No Events Found</h3>
              <p className="text-zinc-700 mb-6">
                {activeTab === 'upcoming' 
                  ? "No upcoming events match your current filters. Try adjusting your search criteria or check past events."
                  : "No past events match your current filters. Try adjusting your search criteria or check upcoming events."
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                  className="btn-outline"
                >
                  Clear Filters
                </Button>
                <Button 
                  onClick={() => setActiveTab(activeTab === 'upcoming' ? 'past' : 'upcoming')}
                  className="btn-primary"
                >
                  View {activeTab === 'upcoming' ? 'Past' : 'Upcoming'} Events
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Link href={`/events/${event.slug}`} key={event.id} className="group">
                  <div className="japan-card h-full overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <SafeImage
                        src={
                          typeof event.featuredImage === 'object' && event.featuredImage?.url 
                            ? event.featuredImage.url 
                            : typeof event.featuredImage === 'string' 
                              ? event.featuredImage
                              : '/assets/placeholder-image.jpg'
                        }
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        fallbackSrc="/assets/placeholder-image.jpg"
                      />
                      {event.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-hinomaru-red text-white">Featured</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-hinomaru-red transition-colors">
                        {event.title}
                      </h3>
                      
                      {event.eventType && (
                        <Badge variant="outline" className="mb-4 w-fit">
                          {event.eventType}
                        </Badge>
                      )}
                      
                      <p className="text-zinc-700 mb-4 flex-grow line-clamp-3">
                        {event.summary || 'Join us for this exciting event organized by ASA Kerala.'}
                      </p>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        {(event.eventDate || event.startDate) && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-hinomaru-red flex-shrink-0" />
                            <span className="text-zinc-700">
                              {event.eventDate 
                                ? formatDate(new Date(event.eventDate))
                                : event.startDate
                                  ? formatDate(new Date(event.startDate))
                                  : 'Date to be announced'
                              }
                            </span>
                          </div>
                        )}
                        
                        {event.startTime && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-hinomaru-red flex-shrink-0" />
                            <span className="text-zinc-700">
                              {event.startTime}
                              {event.endTime && ` - ${event.endTime}`}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {event.isVirtual ? (
                            <>
                              <Video size={16} className="text-hinomaru-red flex-shrink-0" />
                              <span className="text-zinc-700">Virtual Event</span>
                            </>
                          ) : (
                            <>
                              <MapPin size={16} className="text-hinomaru-red flex-shrink-0" />
                              <span className="text-zinc-700 truncate">
                                {event.venue || event.customLocation || 'ASA Kerala Center'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-hinomaru-red font-medium group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 