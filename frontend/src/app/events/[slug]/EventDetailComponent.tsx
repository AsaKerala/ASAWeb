'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, User, Video, Tag, ChevronRight, Mail, Phone, Flag, Globe } from 'lucide-react';
import { events } from '@/lib/api';
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
  // Debug logs to understand the data structure
  console.log('Event Detail Component initialized with:', { 
    slug,
    eventId: initialEvent?.id,
    eventTitle: initialEvent?.title,
    hasContent: !!initialEvent?.content,
    contentType: initialEvent?.content ? typeof initialEvent.content : 'undefined',
    hasSummary: !!initialEvent?.summary,
    hasEventDate: !!initialEvent?.eventDate,
    hasLocation: !!initialEvent?.venue || !!initialEvent?.customLocation,
    hasKeyFeatures: Array.isArray(initialEvent?.keyFeatures) && initialEvent?.keyFeatures.length > 0,
    hasFaqs: Array.isArray(initialEvent?.faqs) && initialEvent?.faqs.length > 0,
    hasSchedule: Array.isArray(initialEvent?.schedule) && initialEvent?.schedule.length > 0,
    hasSpeakers: Array.isArray(initialEvent?.speakers) && initialEvent?.speakers.length > 0,
    hasEventFees: !!initialEvent?.eventFees,
    isFeatured: initialEvent?.isFeatured,
    allKeys: Object.keys(initialEvent || {})
  });
  
  const [event, setEvent] = useState<Event>(initialEvent);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { isAuthenticated, loginWithRedirect } = useAuth();

  // Helper function to determine if content sections should be shown
  const hasTabContent = (data: any[] | undefined): boolean => {
    return !!data && data.length > 0;
  };

  const getLocationText = () => {
    if (event.isVirtual) return 'Virtual Event';
    return event.venue || event.customLocation || 'ASA Kerala Center';
  };
  
  const handleRegisterClick = () => {
    if (isAuthenticated) {
      console.log('User is authenticated, processing registration');
      // Here you would handle the registration API call
      alert('Registration successful! You will receive confirmation details via email.');
    } else {
      console.log('User is not authenticated, redirecting to login');
      loginWithRedirect(`/events/${event.slug}`);
    }
  };

  return (
    <div className="pb-16">
      {/* Hero section with image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {event.featuredImage ? (
          <SafeImage
            src={typeof event.featuredImage === 'string' ? event.featuredImage : event.featuredImage.url || ''}
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
              {event.eventType && (
                <Badge className="bg-hinomaru-red border-none text-white px-3 py-1">
                  {event.eventType}
                </Badge>
              )}
              {event.categories && event.categories.length > 0 && (
                event.categories.map((category, index) => (
                  <Badge key={index} className="bg-blue-600 border-none text-white px-3 py-1">
                    {category}
                  </Badge>
                ))
              )}
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
                {hasTabContent(event.schedule) && (
                  <TabsTrigger value="schedule" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Schedule
                  </TabsTrigger>
                )}
                {hasTabContent(event.speakers) && (
                  <TabsTrigger value="speakers" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Speakers
                  </TabsTrigger>
                )}
                {hasTabContent(event.sponsors) && (
                  <TabsTrigger value="sponsors" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Sponsors
                  </TabsTrigger>
                )}
                {hasTabContent(event.faqs) && (
                  <TabsTrigger value="faqs" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    FAQs
                  </TabsTrigger>
                )}
                {hasTabContent(event.gallery) && (
                  <TabsTrigger value="gallery" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Gallery
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="japan-card mb-8">
                  <h2 className="section-title mb-6">About This Event</h2>
                  {/* Debug logs */}
                  {(() => {
                    console.log('Overview tab - Content section:', {
                      hasContent: !!event.content,
                      contentType: typeof event.content,
                      contentValue: event.content,
                      hasSummary: !!event.summary,
                      summaryValue: event.summary
                    });
                    return null;
                  })()}
                  {event.content ? (
                    <div 
                      className="prose prose-zinc max-w-none"
                      dangerouslySetInnerHTML={{ __html: typeof event.content === 'string' ? event.content : 'No detailed description available' }}
                    />
                  ) : (
                    <p className="text-zinc-700">{event.summary || 'No description available'}</p>
                  )}
                </div>

                {/* Debug logs */}
                {(() => {
                  console.log('Key Features section:', {
                    hasKeyFeatures: !!event.keyFeatures,
                    keyFeaturesType: event.keyFeatures ? typeof event.keyFeatures : 'undefined',
                    keyFeaturesLength: event.keyFeatures ? event.keyFeatures.length : 0,
                    keyFeaturesValue: event.keyFeatures
                  });
                  return null;
                })()}
                {hasTabContent(event.keyFeatures) && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Highlights</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.keyFeatures?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-700">{typeof feature === 'string' ? feature : feature.feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Debug logs */}
                {(() => {
                  console.log('Eligibility section:', {
                    hasEligibility: !!event.eligibility,
                    eligibilityValue: event.eligibility
                  });
                  return null;
                })()}
                {event.eligibility && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-zinc-900">Who Should Attend</h2>
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                      <p className="text-zinc-700">{event.eligibility}</p>
                    </div>
                  </div>
                )}
                
                {/* Debug logs */}
                {(() => {
                  console.log('Tags section:', {
                    hasTags: !!event.tags,
                    tagsLength: event.tags ? event.tags.length : 0,
                    tagsValue: event.tags
                  });
                  return null;
                })()}
                {event.tags && event.tags.length > 0 && (
                  <div className="japan-card mb-8">
                    <h2 className="text-xl font-bold mb-4 text-zinc-900">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Debug logs */}
                {(() => {
                  console.log('Organizer section:', {
                    hasOrganizer: !!event.organizer,
                    organizerValue: event.organizer,
                    hasContactEmail: !!event.contactEmail,
                    contactEmailValue: event.contactEmail,
                    hasContactPhone: !!event.contactPhone,
                    contactPhoneValue: event.contactPhone
                  });
                  return null;
                })()}
                {event.organizer && (
                  <div className="japan-card mb-8">
                    <h2 className="text-xl font-bold mb-4 text-zinc-900">Organizer</h2>
                    <p className="text-zinc-700">{event.organizer}</p>
                    
                    <div className="mt-4 flex flex-col space-y-2">
                      {event.contactEmail && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-hinomaru-red" />
                          <a href={`mailto:${event.contactEmail}`} className="text-hinomaru-red hover:underline">
                            {event.contactEmail}
                          </a>
                        </div>
                      )}
                      
                      {event.contactPhone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-hinomaru-red" />
                          <a href={`tel:${event.contactPhone}`} className="text-hinomaru-red hover:underline">
                            {event.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              {hasTabContent(event.schedule) && (
                <TabsContent value="schedule" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Event Schedule</h2>
                    <div className="space-y-4">
                      {event.schedule?.map((item, index) => (
                        <div key={index} className="flex border-l-4 border-hinomaru-red pl-4 py-2">
                          <div className="w-24 flex-shrink-0 text-hinomaru-red font-medium">
                            {typeof item === 'string' ? item : item.time}
                          </div>
                          <div>
                            <h3 className="font-semibold text-zinc-900">{typeof item === 'string' ? 'Session' : item.activity}</h3>
                            {typeof item !== 'string' && item.date && (
                              <p className="text-sm text-zinc-600">Date: {formatDate(new Date(item.date))}</p>
                            )}
                            {typeof item !== 'string' && item.speaker && (
                              <p className="text-sm text-zinc-600">Speaker: {item.speaker}</p>
                            )}
                            {typeof item !== 'string' && item.duration && (
                              <p className="text-sm text-zinc-600">Duration: {item.duration}</p>
                            )}
                            {typeof item !== 'string' && item.description && (
                              <p className="text-sm text-zinc-600 mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {hasTabContent(event.speakers) && (
                <TabsContent value="speakers" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Speakers & Presenters</h2>
                    <div className="grid grid-cols-1 gap-6">
                      {event.speakers?.map((speaker, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100 flex flex-col md:flex-row gap-6">
                          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                            <SafeImage
                              src={typeof speaker === 'string' 
                                ? '/assets/placeholder-avatar.png' 
                                : (typeof speaker.image === 'string' 
                                  ? speaker.image 
                                  : speaker.image?.url || '/assets/placeholder-avatar.png')}
                              alt={typeof speaker === 'string' ? 'Speaker' : speaker.name}
                              fill
                              className="object-cover"
                              fallbackSrc="/assets/placeholder-avatar.png"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-zinc-900">{typeof speaker === 'string' ? 'Speaker' : speaker.name}</h3>
                            {typeof speaker !== 'string' && speaker.title && (
                              <p className="text-zinc-600 mb-1">{speaker.title}</p>
                            )}
                            {typeof speaker !== 'string' && speaker.company && (
                              <p className="text-zinc-600 mb-1">{speaker.company}</p>
                            )}
                            {typeof speaker !== 'string' && speaker.expertise && (
                              <p className="text-zinc-600 mb-3">Expertise: {speaker.expertise}</p>
                            )}
                            <p className="text-zinc-700">{typeof speaker === 'string' ? speaker : speaker.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {hasTabContent(event.sponsors) && (
                <TabsContent value="sponsors" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Our Sponsors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.sponsors?.map((sponsor, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100">
                          {typeof sponsor !== 'string' && sponsor.logo ? (
                            <div className="mb-4 h-20 relative">
                              <SafeImage
                                src={typeof sponsor.logo === 'string' ? sponsor.logo : sponsor.logo.url}
                                alt={typeof sponsor === 'string' ? 'Sponsor' : sponsor.name}
                                fill
                                className="object-contain"
                                fallbackSrc="/assets/placeholder-logo.png"
                              />
                            </div>
                          ) : (
                            <div className="mb-4 h-20 flex items-center justify-center bg-gray-200">
                              <span className="text-gray-500">No logo available</span>
                            </div>
                          )}
                          <h3 className="font-bold text-lg mb-1 text-zinc-900">
                            {typeof sponsor === 'string' ? sponsor : sponsor.name}
                          </h3>
                          {typeof sponsor !== 'string' && sponsor.level && (
                            <p className="text-hinomaru-red text-sm mb-2">
                              {sponsor.level} Sponsor
                            </p>
                          )}
                          {typeof sponsor !== 'string' && sponsor.website && (
                            <a 
                              href={sponsor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-hinomaru-red hover:underline"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              Visit Website
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {hasTabContent(event.faqs) && (
                <TabsContent value="faqs" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {event.faqs?.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-lg font-medium text-zinc-900">
                            {typeof faq === 'string' ? `FAQ ${index + 1}` : faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-zinc-700">
                            {typeof faq === 'string' ? faq : faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>
              )}

              {hasTabContent(event.gallery) && (
                <TabsContent value="gallery" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Event Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery?.map((image, index) => (
                        <div key={index} className="relative h-40 md:h-48 rounded-md overflow-hidden">
                          <SafeImage
                            src={typeof image === 'string' ? image : image.url}
                            alt={typeof image === 'string' ? `Gallery image ${index + 1}` : (image.alt || `Gallery image ${index + 1}`)}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            fallbackSrc="/assets/placeholder-image.jpg"
                          />
                        </div>
                      ))}
                    </div>
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
              
              {/* Debug logs for sidebar event details */}
              {(() => {
                console.log('Sidebar Event Details section:', {
                  hasEventDate: !!event.eventDate,
                  eventDateValue: event.eventDate,
                  hasStartDate: !!event.startDate,
                  startDateValue: event.startDate,
                  hasEndDate: !!event.endDate,
                  endDateValue: event.endDate,
                  hasStartTime: !!event.startTime,
                  startTimeValue: event.startTime,
                  hasEndTime: !!event.endTime,
                  endTimeValue: event.endTime,
                  hasRegistrationStartDate: !!event.registrationStartDate,
                  registrationStartDateValue: event.registrationStartDate,
                  hasRegistrationEndDate: !!event.registrationEndDate,
                  registrationEndDateValue: event.registrationEndDate,
                  isVirtual: !!event.isVirtual,
                  hasVenue: !!event.venue,
                  venueValue: event.venue,
                  hasCustomLocation: !!event.customLocation,
                  customLocationValue: event.customLocation,
                  hasAddress: !!event.address,
                  addressValue: event.address,
                  hasEventFees: !!event.eventFees,
                  eventFeesValue: event.eventFees
                });
                return null;
              })()}
              
              <div className="space-y-4">
                {(event.eventDate || event.startDate) && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-zinc-900">Date & Time</h3>
                      {event.eventDate && (
                        <p className="text-zinc-700">
                          {formatDate(new Date(event.eventDate))}
                        </p>
                      )}
                      {!event.eventDate && event.startDate && (
                        <p className="text-zinc-700">
                          Starts: {formatDate(new Date(event.startDate))}
                          {event.endDate && <span> <br />Ends: {formatDate(new Date(event.endDate))}</span>}
                        </p>
                      )}
                      {event.startTime && (
                        <p className="text-zinc-700">
                          Time: {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {(event.registrationStartDate || event.registrationEndDate) && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-zinc-900">Registration Period</h3>
                      {event.registrationStartDate && (
                        <p className="text-zinc-700">
                          Opens: {formatDate(new Date(event.registrationStartDate))}
                        </p>
                      )}
                      {event.registrationEndDate && (
                        <p className="text-zinc-700">
                          Closes: {formatDate(new Date(event.registrationEndDate))}
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
                        <p className="text-zinc-700 font-medium">{event.venue || event.customLocation || "ASA Kerala Center"}</p>
                        
                        {event.address && (
                          <p className="text-zinc-700 text-sm mt-1">
                            {event.address}
                            {event.city && `, ${event.city}`}
                            {event.state && `, ${event.state}`}
                            {event.zipCode && ` ${event.zipCode}`}
                            {event.country && `, ${event.country}`}
                          </p>
                        )}
                        
                        {event.locationDetails && (
                          <p className="text-zinc-700 text-sm mt-1">
                            {event.locationDetails}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {event.eventFees && (
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-zinc-900">Registration Fee</h3>
                      {/* Debug event fees structure */}
                      {(() => {
                        console.log('Event Fees Details:', {
                          feesType: typeof event.eventFees,
                          isFree: event.eventFees?.isFree,
                          hasPrice: event.eventFees?.price !== undefined,
                          priceValue: event.eventFees?.price,
                          hasMemberPrice: event.eventFees?.memberPrice !== undefined,
                          memberPriceValue: event.eventFees?.memberPrice,
                          hasNonMemberPrice: event.eventFees?.nonMemberPrice !== undefined,
                          nonMemberPriceValue: event.eventFees?.nonMemberPrice,
                          currency: event.eventFees?.currency,
                          hasDiscount: event.eventFees?.hasDiscount,
                          discountDetails: event.eventFees?.discountDetails,
                          allFeeKeys: Object.keys(event.eventFees || {})
                        });
                        return null;
                      })()}
                      {event.eventFees.isFree && (
                        <p className="text-green-600 font-medium">Free Event</p>
                      )}
                      {!event.eventFees.isFree && event.eventFees.price !== undefined && (
                        <p className="text-zinc-700">
                          {event.eventFees.currency || '₹'}{event.eventFees.price}
                        </p>
                      )}
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
                      {event.eventFees.hasDiscount && event.eventFees.discountDetails && (
                        <p className="text-sm mt-1 text-green-700">{event.eventFees.discountDetails}</p>
                      )}
                    </div>
                  </div>
                )}

                {(event.maxAttendees || event.currentAttendees) && (
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                    <div>
                      <h3 className="font-medium text-zinc-900">Attendance</h3>
                      {event.maxAttendees && (
                        <p className="text-zinc-700">
                          Capacity: {event.maxAttendees} attendees
                        </p>
                      )}
                      {event.currentAttendees && (
                        <p className="text-zinc-700">
                          Registered: {event.currentAttendees} attendees
                        </p>
                      )}
                      {event.maxAttendees && event.currentAttendees && event.maxAttendees <= event.currentAttendees && (
                        <p className="text-red-600 text-sm mt-1 font-medium">
                          This event is fully booked
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                {(!event.maxAttendees || !event.currentAttendees || event.maxAttendees > event.currentAttendees) && (
                  <Button className="btn-primary" onClick={handleRegisterClick}>
                    Register Now
                  </Button>
                )}
                <Button className="btn-outline">
                  Add to Calendar
                </Button>
                <Button variant="outline">
                  Share Event
                </Button>
              </div>
            </div>

            {/* Related Events */}
            {hasTabContent(event.relatedEvents) && (
              <div className="japan-card">
                <h2 className="text-xl font-bold mb-4 text-zinc-900">Related Events</h2>
                <div className="space-y-3">
                  {event.relatedEvents?.map((relatedEvent, index) => (
                    <Link 
                      key={typeof relatedEvent === 'string' ? `related-event-${index}` : relatedEvent.id || `related-event-${index}`}
                      href={`/events/${typeof relatedEvent === 'string' ? relatedEvent : relatedEvent.slug || ''}`}
                      className="block p-3 border border-gray-200 rounded-md hover:border-hinomaru-red hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-zinc-900">{typeof relatedEvent === 'string' ? 'Related Event' : relatedEvent.title || 'Related Event'}</h3>
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