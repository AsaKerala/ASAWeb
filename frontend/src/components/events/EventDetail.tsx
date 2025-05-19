'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, MapPin, Video, User, Users, Tag } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { SafeImage } from '@/components/common';

// Extended Event type for backward compatibility
type ExtendedEvent = Event & {
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  isFeatured?: boolean;
  isVirtual?: boolean;
  eventType?: string;
  virtualLink?: string;
  schedule?: any[];
  speakers?: any[];
  faqs?: any[];
  keyFeatures?: Array<{
    feature: string;
  } | string>;
  venue?: string;
  customLocation?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  eventFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    currency?: string;
    isFree?: boolean;
  };
};

interface EventDetailProps {
  event: ExtendedEvent;
}

export default function EventDetail({ event }: EventDetailProps) {
  const isUpcoming = event.eventDate ? new Date(event.eventDate) > new Date() : false;
  
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="relative w-full h-[400px] mb-8">
        {event.featuredImage && (
          <SafeImage 
            src={typeof event.featuredImage === 'string' ? event.featuredImage : event.featuredImage.url}
            alt={event.title} 
            fill 
            className="object-cover rounded-lg" 
            fallbackSrc="/assets/placeholder-event-banner.jpg"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-end">
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.isFeatured && (
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  Featured
                </span>
              )}
              {event.eventType && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {event.eventType}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                isUpcoming 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                <Calendar className="h-3 w-3" />
                {isUpcoming ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            {event.summary && (
              <p className="text-white/80 text-lg">{event.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {event.schedule && event.schedule.length > 0 && (
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              )}
              {event.speakers && event.speakers.length > 0 && (
                <TabsTrigger value="speakers">Speakers</TabsTrigger>
              )}
              {event.faqs && event.faqs.length > 0 && (
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              {event.content && (
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: typeof event.content === 'string' ? event.content : 'No detailed content available' }} 
                />
              )}
              
              {event.keyFeatures && event.keyFeatures.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{typeof feature === 'string' ? feature : feature.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="schedule">
              {event.schedule && event.schedule.length > 0 ? (
                <div className="space-y-6">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4 relative">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                      <p className="text-sm text-muted-foreground">
                        {typeof item === 'string' ? item : item.time}
                      </p>
                      <h3 className="font-medium text-lg">{typeof item === 'string' ? 'Session' : item.activity}</h3>
                      {typeof item !== 'string' && item.speaker && (
                        <p className="mt-2 text-sm flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{item.speaker}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Schedule details will be available soon.</p>
              )}
            </TabsContent>
            
            <TabsContent value="speakers">
              {event.speakers && event.speakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4">
                      {typeof speaker !== 'string' && speaker.image && (
                        <div className="shrink-0">
                          <SafeImage 
                            src={typeof speaker.image === 'string' ? speaker.image : speaker.image.url} 
                            alt={speaker.name} 
                            width={120} 
                            height={120} 
                            className="rounded-lg object-cover"
                            fallbackSrc="/assets/placeholder-avatar.png"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-medium">{typeof speaker === 'string' ? 'Speaker' : speaker.name}</h3>
                        {typeof speaker !== 'string' && speaker.title && (
                          <p className="text-muted-foreground">{speaker.title}</p>
                        )}
                        {typeof speaker !== 'string' && speaker.bio && (
                          <p className="mt-2 text-sm">{speaker.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Speaker information will be available soon.</p>
              )}
            </TabsContent>
            
            <TabsContent value="faq">
              {event.faqs && event.faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {event.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{typeof faq === 'string' ? `FAQ ${index + 1}` : faq.question}</AccordionTrigger>
                      <AccordionContent>
                        {typeof faq === 'string' ? (
                          <p>{faq}</p>
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p>No FAQs available yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="bg-muted p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold mb-4">Event Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> 
                  Date & Time
                </h3>
                <p>{event.eventDate ? formatDate(new Date(event.eventDate)) : 'Date TBA'}</p>
                {event.startDate && event.endDate && (
                  <p className="text-sm text-muted-foreground">
                    {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  {event.isVirtual ? (
                    <>
                      <Video className="h-5 w-5" /> 
                      Virtual Event
                    </>
                  ) : (
                    <>
                      <MapPin className="h-5 w-5" /> 
                      Location
                    </>
                  )}
                </h3>
                {event.isVirtual ? (
                  <>
                    <p>Virtual Event</p>
                    {event.virtualLink && (
                      <Link href={event.virtualLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block text-sm">
                        Join Link
                      </Link>
                    )}
                  </>
                ) : (
                  <p>{event.venue || event.customLocation || "ASA Kerala Center"}</p>
                )}
              </div>
              
              {event.eventFees && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-5 w-5" /> 
                    Registration Fee
                  </h3>
                  {event.eventFees.isFree ? (
                    <p className="text-green-600 font-medium">Free Event</p>
                  ) : (
                    <>
                      {event.eventFees.memberPrice !== undefined && (
                        <p>Members: {event.eventFees.currency || '₹'}{event.eventFees.memberPrice}</p>
                      )}
                      {event.eventFees.nonMemberPrice !== undefined && (
                        <p>Non-members: {event.eventFees.currency || '₹'}{event.eventFees.nonMemberPrice}</p>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {(event.maxAttendees || event.currentAttendees) && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5" /> 
                    Capacity
                  </h3>
                  {event.maxAttendees && <p>{event.maxAttendees} attendees</p>}
                  {event.currentAttendees && <p className="text-sm text-muted-foreground">{event.currentAttendees} registered</p>}
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-2">
              <Button className="w-full">Register Now</Button>
              <Button variant="outline" className="w-full">Add to Calendar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 