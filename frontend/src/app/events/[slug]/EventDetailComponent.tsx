'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  GraduationCap, 
  Tag, 
  CheckCircle, 
  ExternalLink, 
  Download,
  ChevronRight
} from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SafeImage } from '@/components/common';
import { Event } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';

interface EventDetailComponentProps {
  initialEvent: Event;
  slug: string;
}

export default function EventDetailComponent({ initialEvent, slug }: EventDetailComponentProps) {
  const [event, setEvent] = useState<Event>(initialEvent);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { isAuthenticated, loginWithRedirect } = useAuth();

  // Helper function to determine if content sections should be shown
  const hasTabContent = (data: any[] | undefined): boolean => {
    if (!data) return false;
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;
    
    // Check if the array has at least one non-empty value
    return data.some(item => {
      if (typeof item === 'string') return item.trim().length > 0;
      if (typeof item === 'object' && item !== null) {
        if ('title' in item) return item.title && item.title.trim().length > 0;
        if ('name' in item) return item.name && item.name.trim().length > 0;
        if ('question' in item) return item.question && item.question.trim().length > 0;
        if ('time' in item) return true; // Schedule items
        return Object.values(item).some(val => val && typeof val === 'string' && val.trim().length > 0);
      }
      return false;
    });
  };

  // Check if the event date has passed
  const isEventPassed = (): boolean => {
    if (!event.eventDate) return false;
    
    const eventDate = new Date(event.eventDate);
    const now = new Date();
    return eventDate < now;
  };

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      console.log('User is authenticated, processing registration');
      // Here you would handle the registration API call
      alert('Registration submitted! You will receive confirmation details via email.');
    } else {
      console.log('User is not authenticated, redirecting to login');
      loginWithRedirect(`/events/${event.slug}`);
    }
  };

  // Determine if registration is possible
  const canRegister = (): boolean => {
    if (isEventPassed()) return false;
    if (event.registrationClosed) return false;
    if (event.maxAttendees && event.currentAttendees && event.maxAttendees <= event.currentAttendees) return false;
    return true;
  };

  // Helper function to render Payload CMS richtext content
  const renderRichText = (content: any) => {
    if (!content) return null;
    
    // If it's already an HTML string, render it directly
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    
    // If it's a Payload CMS richtext object or array
    if (typeof content === 'object') {
      // It may be an array of richtext nodes
      if (Array.isArray(content)) {
        return content.map((block, index) => {
          // Each block might have children array with text
          if (block.children && Array.isArray(block.children)) {
            return (
              <p key={index} className="mb-4">
                {block.children.map((child, childIndex) => {
                  if (typeof child === 'string') return child;
                  return child.text || '';
                }).join(' ')}
              </p>
            );
          }
          return null;
        });
      }
      
      // It may be a single richtext object with a children array
      if (content.children && Array.isArray(content.children)) {
        return (
          <p className="mb-4">
            {content.children.map((child: any, index: number) => {
              if (typeof child === 'string') return child;
              return child.text || '';
            }).join(' ')}
          </p>
        );
      }
    }
    
    // Fallback: render as JSON string but only in development
    return <p>{process.env.NODE_ENV === 'development' ? JSON.stringify(content) : 'Content not available in proper format.'}</p>;
  };

  // Helper function to get the most appropriate date to display
  const getEventDateDisplay = (event: Event): string => {
    // For one-day events, use eventDate
    if (event.eventDate) {
      return `${formatDate(new Date(event.eventDate))}`;
    }
    
    // For events with keyFeatures dates
    if (event.keyFeatures) {
      if (event.keyFeatures.eventDate) {
        return `${formatDate(new Date(event.keyFeatures.eventDate))}`;
      }
      
      // For multi-day events, show start and end date
      if (event.keyFeatures.startDate) {
        const startDateFormatted = formatDate(new Date(event.keyFeatures.startDate));
        if (event.keyFeatures.endDate) {
          const endDateFormatted = formatDate(new Date(event.keyFeatures.endDate));
          return `${startDateFormatted} - ${endDateFormatted}`;
        }
        return startDateFormatted;
      }
    }
    
    // For legacy multi-day events
    if (event.startDate) {
      const startDateFormatted = formatDate(new Date(event.startDate));
      if (event.endDate) {
        const endDateFormatted = formatDate(new Date(event.endDate));
        return `${startDateFormatted} - ${endDateFormatted}`;
      }
      return startDateFormatted;
    }
    
    return 'Date to be announced';
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section with Event Image */}
      <section className="relative h-[40vh] min-h-[300px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
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
            className="object-cover"
            fallbackSrc="/assets/placeholder-image.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
        </div>
        
        <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-12">
          <div className="max-w-3xl">
            {event.eventType && (
              <Badge 
                className="mb-4 bg-hinomaru-red text-white"
                variant="default"
              >
                {event.eventType}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-hinomaru-red" />
                <span>{getEventDateDisplay(event)}</span>
              </div>
              {event.startTime && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-hinomaru-red" />
                  <span>
                    {formatTime(event.startTime)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-hinomaru-red" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            {event.summary && (
              <p className="text-xl text-zinc-100">
                {event.summary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container-custom">
          <div className="flex overflow-x-auto py-4 gap-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'overview' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Overview
            </button>
            {hasTabContent(event.schedule) && (
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'schedule' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
              >
                Schedule
              </button>
            )}
            {hasTabContent(event.speakers) && (
              <button 
                onClick={() => setActiveTab('speakers')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'speakers' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
              >
                Speakers
              </button>
            )}
            {hasTabContent(event.faqs) && (
              <button 
                onClick={() => setActiveTab('faqs')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'faqs' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
              >
                FAQs
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Section with Sidebar */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="overview" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">About This Event</h2>
                    
                    {event.content ? (
                      typeof event.content === 'string' && event.content.trim() ? (
                        <div 
                          className="prose prose-zinc max-w-none"
                          dangerouslySetInnerHTML={{ __html: event.content }}
                        />
                      ) : (
                        <div className="prose prose-zinc max-w-none">
                          {renderRichText(event.content)}
                        </div>
                      )
                    ) : (
                      <p className="text-zinc-700">{event.summary || 'No description available'}</p>
                    )}
                  </div>

                  {event.keyFeatures && Array.isArray(event.keyFeatures) && event.keyFeatures.length > 0 && (
                    <div className="japan-card mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-zinc-900">Key Features</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {event.keyFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                            <span className="text-zinc-700">
                              {typeof feature === 'string' ? feature : feature.feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(event.materials || event.downloads) && (
                    <div className="japan-card mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-zinc-900">Event Materials</h2>
                      <div className="space-y-4">
                        {event.materials && Array.isArray(event.materials) && event.materials.map((material, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <Download className="h-5 w-5 text-hinomaru-red" />
                            {typeof material === 'string' ? (
                              <a href={material} target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-hinomaru-red">
                                Material {index + 1}
                              </a>
                            ) : (
                              <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-hinomaru-red">
                                {material.title || `Material ${index + 1}`}
                              </a>
                            )}
                          </div>
                        ))}
                        
                        {event.downloads && Array.isArray(event.downloads) && event.downloads.map((download, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <Download className="h-5 w-5 text-hinomaru-red" />
                            {typeof download === 'string' ? (
                              <a href={download} target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-hinomaru-red">
                                Download {index + 1}
                              </a>
                            ) : (
                              <a href={download.url} target="_blank" rel="noopener noreferrer" className="text-zinc-800 hover:text-hinomaru-red">
                                {download.title || `Download ${index + 1}`}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schedule" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">Event Schedule</h2>
                    
                    {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 ? (
                      <div className="space-y-8">
                        {event.schedule.map((item, index) => {
                          if (typeof item === 'string') {
                            return (
                              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <p className="text-zinc-700">{item}</p>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="flex border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                              <div className="mr-4 min-w-[100px]">
                                <p className="font-medium text-zinc-900">
                                  {item.time || (item.startTime && (
                                    <>
                                      {formatTime(item.startTime)}
                                      {item.endTime && <> - {formatTime(item.endTime)}</>}
                                    </>
                                  ))}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-zinc-900">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-zinc-700 mt-1">{item.description}</p>
                                )}
                                {item.speaker && (
                                  <p className="text-sm text-zinc-500 mt-2">Presented by: {item.speaker}</p>
                                )}
                                {item.location && (
                                  <div className="flex items-center mt-2">
                                    <MapPin className="h-4 w-4 mr-1 text-hinomaru-red" />
                                    <span className="text-sm text-zinc-500">{item.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-zinc-700">Detailed schedule information is not available at this time. Please contact us for more details.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="speakers" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">Speakers & Presenters</h2>
                    
                    {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {event.speakers.map((speaker, index) => {
                          if (typeof speaker === 'string') {
                            return (
                              <div key={index} className="bg-white p-4 rounded-md border border-gray-100">
                                <p className="font-medium text-zinc-900">{speaker}</p>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                              <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                  <SafeImage
                                    src={
                                      typeof speaker.image === 'object' ? speaker.image.url :
                                      typeof speaker.avatar === 'object' ? speaker.avatar.url :
                                      typeof speaker.photo === 'object' ? speaker.photo.url :
                                      typeof speaker.image === 'string' ? speaker.image :
                                      typeof speaker.avatar === 'string' ? speaker.avatar :
                                      typeof speaker.photo === 'string' ? speaker.photo :
                                      '/assets/placeholder-user.jpg'
                                    }
                                    width={64}
                                    height={64}
                                    alt={speaker.name}
                                    className="object-cover w-full h-full"
                                    fallbackSrc="/assets/placeholder-user.jpg"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-bold text-zinc-900">{speaker.name}</h3>
                                  {(speaker.title || speaker.position || speaker.role) && (
                                    <p className="text-sm text-zinc-500">{speaker.title || speaker.position || speaker.role}</p>
                                  )}
                                  {speaker.organization && (
                                    <p className="text-sm text-zinc-500">{speaker.organization}</p>
                                  )}
                                </div>
                              </div>
                              {speaker.bio && (
                                <p className="text-zinc-700 text-sm">{speaker.bio}</p>
                              )}
                              {speaker.socialLinks && Array.isArray(speaker.socialLinks) && speaker.socialLinks.length > 0 && (
                                <div className="mt-4 flex gap-2">
                                  {speaker.socialLinks.map((link, i) => (
                                    <a 
                                      key={i} 
                                      href={typeof link === 'string' ? link : link.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-zinc-500 hover:text-hinomaru-red"
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-zinc-700">Speaker information is not available at this time.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="faqs" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                    
                    {event.faqs && Array.isArray(event.faqs) && event.faqs.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {event.faqs.map((faq, index) => {
                          if (typeof faq === 'string') {
                            return null; // Skip string FAQs as they don't have the required format
                          }
                          
                          return (
                            <AccordionItem key={index} value={`faq-${index}`}>
                              <AccordionTrigger className="text-left font-medium text-zinc-900">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-zinc-700">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    ) : (
                      <p className="text-zinc-700">No FAQs are available for this event yet. If you have any questions, please contact us.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-36">
                <div className="japan-card mb-6">
                  <h2 className="text-xl font-bold mb-6 text-zinc-900">Event Details</h2>
                  
                  <div className="space-y-6">
                    {/* Event Date and Time */}
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                      <div>
                        <h3 className="font-medium text-zinc-900">Date & Time</h3>
                        {event.eventDate ? (
                          <p className="text-zinc-700">
                            {formatDate(new Date(event.eventDate))}
                            {event.startTime && (
                              <span>
                                , {formatTime(event.startTime)} 
                                {event.endTime && ` - ${formatTime(event.endTime)}`}
                              </span>
                            )}
                          </p>
                        ) : (
                          <p className="text-zinc-700">Date to be announced</p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                        <div>
                          <h3 className="font-medium text-zinc-900">Location</h3>
                          <p className="text-zinc-700">{event.location}</p>
                          {event.address && (
                            <p className="text-sm text-zinc-500">{event.address}</p>
                          )}
                          {event.mapLink && (
                            <a 
                              href={event.mapLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-hinomaru-red text-sm hover:underline inline-flex items-center mt-1"
                            >
                              View on Map
                              <ExternalLink size={12} className="ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Registration Fees */}
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                      <div>
                        <h3 className="font-medium text-zinc-900">Registration Fees</h3>
                        {event.isFree ? (
                          <p className="text-green-600 font-medium">Free Event</p>
                        ) : event.eventFees ? (
                          <div className="space-y-1">
                            {event.eventFees.memberPrice !== undefined && (
                              <p className="text-zinc-700">
                                Members: {event.eventFees.currency || '₹'}{event.eventFees.memberPrice}
                              </p>
                            )}
                            {event.eventFees.nonMemberPrice !== undefined && (
                              <p className="text-zinc-700">
                                Non-members: {event.eventFees.currency || '₹'}{event.eventFees.nonMemberPrice}
                              </p>
                            )}
                            {!event.eventFees.memberPrice && !event.eventFees.nonMemberPrice && (
                              <p className="text-zinc-700">
                                {event.eventFees.amount ? `${event.eventFees.currency || '₹'}${event.eventFees.amount}` : 'Please contact us for fee details'}
                              </p>
                            )}
                            {event.eventFees.hasScholarship && event.eventFees.scholarshipDetails && (
                              <p className="text-sm mt-1 text-green-700">{event.eventFees.scholarshipDetails}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-zinc-700">{event.price ? `${event.price}` : 'Please contact us for fee details'}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Attendees */}
                    {(event.maxAttendees || event.currentAttendees) && (
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                        <div>
                          <h3 className="font-medium text-zinc-900">Attendees</h3>
                          {event.maxAttendees && (
                            <p className="text-zinc-700">
                              {event.currentAttendees || 0} / {event.maxAttendees} spots filled
                            </p>
                          )}
                          {(!event.maxAttendees && event.currentAttendees) && (
                            <p className="text-zinc-700">
                              {event.currentAttendees} attendees registered
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Organizer */}
                    {event.organizer && (
                      <div className="flex items-start">
                        <User className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                        <div>
                          <h3 className="font-medium text-zinc-900">Organizer</h3>
                          <p className="text-zinc-700">
                            {typeof event.organizer === 'string' ? event.organizer : event.organizer.name}
                          </p>
                          {typeof event.organizer !== 'string' && event.organizer.email && (
                            <p className="text-sm text-zinc-500">
                              {event.organizer.email}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {isEventPassed() ? (
                      <div>
                        <Badge variant="secondary" className="w-full py-2 justify-center text-base mb-4">
                          Event Completed
                        </Badge>
                        {(event.recordings || event.materials) && (
                          <Button 
                            className="w-full"
                            variant="outline"
                            onClick={() => setActiveTab('overview')}
                          >
                            View Recordings & Materials
                          </Button>
                        )}
                      </div>
                    ) : event.registrationClosed ? (
                      <Button 
                        className="w-full btn-secondary"
                        disabled
                      >
                        Registration Closed
                      </Button>
                    ) : event.maxAttendees && event.currentAttendees && event.maxAttendees <= event.currentAttendees ? (
                      <div>
                        <Button 
                          className="w-full btn-secondary"
                          disabled
                        >
                          Event Full
                        </Button>
                        <p className="text-sm text-zinc-500 mt-2 text-center">
                          All spots have been filled
                        </p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full btn-primary"
                        onClick={handleRegisterClick}
                      >
                        Register Now
                      </Button>
                    )}
                    
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" className="flex-1 mr-2">
                        Contact Us
                      </Button>
                      <Button variant="outline" className="flex-1 ml-2">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Related Events */}
                <div className="japan-card">
                  <h3 className="text-lg font-bold mb-4 text-zinc-900">Related Events</h3>
                  <div className="space-y-3">
                    <Link href="/events" className="flex items-center text-hinomaru-red font-medium hover:underline">
                      <span>Browse All Events</span>
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                    {event.eventType && (
                      <Link 
                        href={`/events?type=${event.eventType}`} 
                        className="flex items-center text-hinomaru-red font-medium hover:underline"
                      >
                        <span>More {event.eventType} Events</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 