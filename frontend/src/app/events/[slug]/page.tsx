'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, User, Video, Tag, ChevronRight } from 'lucide-react';
import { getEventBySlug } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SafeImage } from '@/components/common';
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
    const response = await getEventBySlug(slug);
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

export default function EventPage({ params }: EventPageProps) {
  const { slug } = params;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await getEventBySlug(slug);
        
        if (!response || !response.data) {
          setError('Event not found');
          return;
        }
        
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchEventData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-custom py-20">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container-custom py-20">
        <div className="japan-card">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-zinc-700 mb-6">{error || 'Event not found'}</p>
          <Link href="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const getLocationText = () => {
    if (event.isVirtual) return 'Virtual Event';
    return event.customLocation || 'ASA Kerala Center';
  };

  return (
    <div className="pb-16">
      {/* Hero section with image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {event.featuredImage ? (
          <SafeImage
            src={event.featuredImage.url}
            alt={event.title}
            fill
            className="object-cover"
            fallbackSrc="/assets/placeholder-event-banner.jpg"
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
            <p className="text-zinc-500">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container-custom pb-8 md:pb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-hinomaru-red border-none text-white px-3 py-1">
                {event.eventType}
              </Badge>
              {event.isFeatured && (
                <Badge className="bg-amber-500 border-none text-white px-3 py-1">
                  Featured Event
                </Badge>
              )}
              {event.mode && (
                <Badge className="bg-zinc-800 border-none text-white px-3 py-1">
                  {event.mode}
                </Badge>
              )}
            </div>
            <p className="text-zinc-100 text-lg max-w-3xl">
              {event.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - left side on desktop */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 bg-white border border-gray-200 rounded-lg overflow-x-auto flex flex-nowrap">
                <TabsTrigger value="overview" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                {event.schedule && event.schedule.length > 0 && (
                  <TabsTrigger value="schedule" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Schedule
                  </TabsTrigger>
                )}
                {event.speakers && event.speakers.length > 0 && (
                  <TabsTrigger value="speakers" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Speakers
                  </TabsTrigger>
                )}
                {event.faqs && event.faqs.length > 0 && (
                  <TabsTrigger value="faqs" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    FAQs
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="japan-card mb-8">
                  <h2 className="section-title mb-6">About This Event</h2>
                  {event.content ? (
                    <div 
                      className="prose prose-zinc max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                  ) : (
                    <p className="text-zinc-700">{event.summary || 'No description available'}</p>
                  )}
                </div>

                {event.keyFeatures && event.keyFeatures.length > 0 && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Highlights</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-700">{feature.feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.eligibility && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-zinc-900">Who Should Attend</h2>
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                      <p className="text-zinc-700">{event.eligibility}</p>
                    </div>
                  </div>
                )}

                {event.gallery && event.gallery.length > 0 && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery.map((image, index) => (
                        <div key={index} className="relative h-40 rounded-md overflow-hidden">
                          <SafeImage
                            src={image.url}
                            alt={image.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            fallbackSrc="/assets/placeholder-image.jpg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {event.schedule && event.schedule.length > 0 && (
                <TabsContent value="schedule" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Event Schedule</h2>
                    <div className="space-y-4">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex border-l-4 border-hinomaru-red pl-4 py-2">
                          <div className="w-24 flex-shrink-0 text-hinomaru-red font-medium">
                            {item.time}
                          </div>
                          <div>
                            <h3 className="font-semibold text-zinc-900">{item.activity}</h3>
                            {item.speaker && (
                              <p className="text-sm text-zinc-600">Speaker: {item.speaker}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <TabsContent value="speakers" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Speakers & Presenters</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100 flex flex-col md:flex-row gap-6">
                          {speaker.image ? (
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                              <SafeImage
                                src={speaker.image.url}
                                alt={speaker.name}
                                fill
                                className="object-cover"
                                fallbackSrc="/assets/placeholder-avatar.png"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-zinc-900">{speaker.name}</h3>
                            {speaker.title && (
                              <p className="text-zinc-600 mb-3">{speaker.title}</p>
                            )}
                            <p className="text-zinc-700">{speaker.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {event.faqs && event.faqs.length > 0 && (
                <TabsContent value="faqs" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {event.faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-lg font-medium text-zinc-900">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-zinc-700">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar - right side on desktop */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="japan-card">
              <h2 className="text-xl font-bold mb-4 text-zinc-900">Event Details</h2>
              
              <div className="space-y-4">
                {(event.eventDate || event.startDate) && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-zinc-900">Date & Time</h3>
                      {event.eventDate && (
                        <p className="text-zinc-700">
                          {formatDate(event.eventDate)}
                        </p>
                      )}
                      {!event.eventDate && event.startDate && (
                        <p className="text-zinc-700">
                          Starts: {formatDate(event.startDate)}
                          {event.endDate && <span> <br />Ends: {formatDate(event.endDate)}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  {event.isVirtual ? (
                    <>
                      <Video className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                      <div>
                        <h3 className="font-medium text-zinc-900">Location</h3>
                        <p className="text-zinc-700">Virtual Event</p>
                        {event.virtualLink && (
                          <a 
                            href={event.virtualLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hinomaru-red hover:underline inline-block mt-1"
                          >
                            Join Link
                          </a>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                      <div>
                        <h3 className="font-medium text-zinc-900">Location</h3>
                        <p className="text-zinc-700">{event.customLocation || "ASA Kerala Center"}</p>
                      </div>
                    </>
                  )}
                </div>

                {event.eventFees && (
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-zinc-900">Registration Fee</h3>
                      {event.eventFees.memberPrice && (
                        <p className="text-zinc-700">
                          Members: {event.eventFees.currency || '₹'}{event.eventFees.memberPrice}
                        </p>
                      )}
                      {event.eventFees.nonMemberPrice && (
                        <p className="text-zinc-700">
                          Non-members: {event.eventFees.currency || '₹'}{event.eventFees.nonMemberPrice}
                        </p>
                      )}
                      {event.eventFees.hasDiscount && event.eventFees.discountDetails && (
                        <p className="text-sm mt-1 text-green-700">{event.eventFees.discountDetails}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                <Button className="btn-primary">
                  Register Now
                </Button>
                <Button className="btn-outline">
                  Add to Calendar
                </Button>
                <Button variant="outline">
                  Share Event
                </Button>
              </div>
            </div>

            {/* Related Events */}
            {event.relatedEvents && event.relatedEvents.length > 0 && (
              <div className="japan-card">
                <h2 className="text-xl font-bold mb-4 text-zinc-900">Related Events</h2>
                <div className="space-y-3">
                  {event.relatedEvents.map((relatedEvent) => (
                    <Link 
                      key={relatedEvent.id}
                      href={`/events/${relatedEvent.slug}`}
                      className="block p-3 border border-gray-200 rounded-md hover:border-hinomaru-red hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-zinc-900">{relatedEvent.title}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 