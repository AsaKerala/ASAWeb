'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { events as eventsApi, programs as programsApi } from '@/lib/api';
import { SafeImage } from '@/components/common';

// Function to recursively convert rich text to HTML
function renderRichText(content: any): string {
  if (!content) return '';
  
  if (typeof content === 'string') return content;
  
  // Handle array of content blocks
  if (Array.isArray(content)) {
    return content.map(renderRichText).join('');
  }
  
  // Handle content with children but no specific type (direct text nodes with formatting)
  if (content.children && !content.type) {
    const childrenContent = content.children.map(renderRichText).join('');
    return childrenContent;
  }
  
  // Handle rich text object with type
  if (content.type && content.children) {
    const tagName = content.type;
    const children = content.children.map(renderRichText).join('');
    
    switch (tagName) {
      case 'p':
        return `<p>${children}</p>`;
      case 'h1':
        return `<h1>${children}</h1>`;
      case 'h2':
        return `<h2>${children}</h2>`;
      case 'h3':
        return `<h3>${children}</h3>`;
      case 'h4':
        return `<h4>${children}</h4>`;
      case 'h5':
        return `<h5>${children}</h5>`;
      case 'h6':
        return `<h6>${children}</h6>`;
      case 'ul':
        return `<ul>${children}</ul>`;
      case 'ol':
        return `<ol>${children}</ol>`;
      case 'li':
        return `<li>${children}</li>`;
      case 'a':
        return `<a href="${content.url || '#'}" target="${content.newTab ? '_blank' : '_self'}">${children}</a>`;
      case 'blockquote':
        return `<blockquote>${children}</blockquote>`;
      default:
        return children;
    }
  }
  
  // Handle text nodes with formatting
  if (content.text) {
    let text = content.text;
    if (content.bold) text = `<strong>${text}</strong>`;
    if (content.italic) text = `<em>${text}</em>`;
    if (content.underline) text = `<u>${text}</u>`;
    if (content.code) text = `<code>${text}</code>`;
    return text;
  }
  
  // If content is an object but doesn't match expected formats, try to stringify it
  if (typeof content === 'object') {
    try {
      return JSON.stringify(content);
    } catch (e) {
      return '';
    }
  }
  
  return '';
}

// Define interfaces for type safety
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: any; // Rich text content
  status: string;
  programCategory?: string;
  featuredImage?: {
    id: string;
    filename: string;
    url: string;
    sizes?: {
      thumbnail?: {
        url: string;
      };
      card?: {
        url: string;
      };
      tablet?: {
        url: string;
      };
    };
  };
  
  // Structured fields for program layout
  keyFeatures?: {
    duration?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    customLocation?: string;
    isVirtual?: boolean;
    virtualLink?: string;
    eventDate?: string;    // Single-day events
    startDate?: string;    // Multi-day events
    endDate?: string;      // Multi-day events
    certification?: 'yes' | 'no';
    eligibility?: string;
  };
  curriculum?: Array<{
    module: string;
    description?: string;
  }>;
  learningOutcomes?: Array<{
    outcome: string;
  }>;
  programFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    hasScholarships?: boolean;
    scholarshipDetails?: string;
  };
  upcomingBatches?: Array<{
    startDate: string;
    mode?: 'online' | 'offline' | 'hybrid';
    applicationDeadline?: string;
  }>;
  applicationProcess?: Array<{
    step: string;
    description?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    title?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  contactInfo?: {
    email?: string;
    phone?: string;
    brochureFile?: any;
  };

  // Legacy fields and updated fields for backward compatibility
  eventDate?: string;  // New field for single-day events
  startDate?: string;
  endDate?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isVirtual?: boolean;
    virtualLink?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
}

interface Program {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: string;
  category: string;
  duration?: string;
  cost?: string;
  eligibility?: string;
  dates?: { start: string; end: string }[];
  contactPerson?: string;
  contactEmail?: string;
  imageUrl?: string;
  featuredImage?: {
    id: string;
    filename: string;
    url: string;
    sizes?: {
      thumbnail?: {
        url: string;
      };
      card?: {
        url: string;
      };
      tablet?: {
        url: string;
      };
    };
  };
  keyFeatures?: {
    duration?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    customLocation?: string;
    isVirtual?: boolean;
    virtualLink?: string;
    eventDate?: string;
    startDate?: string;
    endDate?: string;
    certification?: 'yes' | 'no';
    eligibility?: string;
  };
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isVirtual?: boolean;
    virtualLink?: string;
  } | string;
  upcomingBatches?: Array<{
    startDate: string;
    mode?: 'online' | 'offline' | 'hybrid';
    applicationDeadline?: string;
  }>;
}

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Event | Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemType, setItemType] = useState<'event' | 'program' | null>(null);

  // Normalize slug helper
  const normalizeSlug = (slug: string): string => {
    return slug.replace(/-+$/, '');
  };

  useEffect(() => {
    if (params.slug) {
      const fetchData = async () => {
        setIsLoading(true);
        
        // Normalize the slug from the URL
        const normalizedSlug = typeof params.slug === 'string' 
          ? normalizeSlug(params.slug)
          : params.slug;
        
        console.log('Normalized slug for comparison:', normalizedSlug);
        
        // Try direct API call first with normalized slug
        try {
          console.log('Trying direct API call with normalized slug');
          const response = await eventsApi.getOne(normalizedSlug as string);
          
          if (response.data) {
            console.log('Event found via direct API call:', response.data.title);
            setItem(response.data);
            setItemType('event');
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Direct event fetch failed, trying fallback methods:', error);
        }
        
        // If direct call failed, try fetching all events as fallback
        try {
          console.log('Fetching all events to find:', normalizedSlug);
          const allEventsResponse = await eventsApi.getAll();
          
          if (allEventsResponse.data && allEventsResponse.data.docs) {
            // Look for the event with the matching slug (normalized for comparison)
            const matchingEvent = allEventsResponse.data.docs.find(
              (event: any) => normalizeSlug(event.slug) === normalizedSlug
            );
            
            if (matchingEvent) {
              console.log('Found matching event via getAll:', matchingEvent.title);
              setItem(matchingEvent);
              setItemType('event');
              setIsLoading(false);
              return;
            } else {
              console.log(`Event with slug "${normalizedSlug}" not found in the list of all events`);
            }
          }
        } catch (err) {
          console.error('Error fetching all events:', err);
        }
        
        // Then try to fetch all programs to see if our slug exists
        try {
          console.log('Fetching all programs to find:', normalizedSlug);
          const allProgramsResponse = await programsApi.getAll();
          
          if (allProgramsResponse.data && allProgramsResponse.data.docs) {
            // Look for the program with the matching slug (normalized for comparison)
            const matchingProgram = allProgramsResponse.data.docs.find(
              (program: any) => normalizeSlug(program.slug) === normalizedSlug
            );
            
            if (matchingProgram) {
              console.log('Found matching program via getAll:', matchingProgram.title);
              setItem(matchingProgram);
              setItemType('program');
              setIsLoading(false);
              return;
            } else {
              console.log(`Program with slug "${normalizedSlug}" not found in the list of all programs`);
            }
          }
        } catch (err) {
          console.error('Error fetching all programs:', err);
        }
        
        // If we get here, neither event nor program was found
        console.error(`Neither event nor program found with slug: ${normalizedSlug}`);
        setError(`We couldn't find an event or program with the name "${normalizedSlug}". Please check the URL and try again.`);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [params.slug, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for display (YYYY-MM-DD format)
  const formatSimpleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
    }).replace(/\//g, '-');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-800 mb-4">Error</h1>
        <p className="text-zinc-800 mb-6">{error}</p>
        <Link href="/programs-events" className="btn-primary">
          View All Programs & Events
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-800 mb-4">Not Found</h1>
        <p className="text-zinc-800 mb-6">The item you are looking for does not exist or has been removed.</p>
        <Link href="/programs-events" className="btn-primary">
          View All Programs & Events
        </Link>
      </div>
    );
  }

  // Title will be the same regardless of item type
  const title = item.title;
  
  // Get the featured image URL
  let featuredImageUrl = '';
  if (item.featuredImage) {
    // Check different possible formats of featuredImage
    if (typeof item.featuredImage === 'string') {
      featuredImageUrl = item.featuredImage;
    } else if (item.featuredImage.url) {
      featuredImageUrl = item.featuredImage.url;
    } else if (item.featuredImage.sizes) {
      featuredImageUrl = 
        item.featuredImage.sizes.tablet?.url || 
        item.featuredImage.sizes.thumbnail?.url || '';
    }
  } else if ('imageUrl' in item && item.imageUrl) {
    featuredImageUrl = item.imageUrl;
  }
  
  // We're focusing on just events since we've unified the schema
  const isEvent = itemType === 'event';
  const isProgram = isEvent && 'programCategory' in item && !!item.programCategory;
  const description = item.summary || '';
  
  // Process rich text content
  const htmlContent = renderRichText(item.content);
  
  // Check if it's a regular event or a program format
  const hasProgramFormat = 
    isEvent && 
    (('curriculum' in item && !!item.curriculum) || 
    ('learningOutcomes' in item && !!item.learningOutcomes) || 
    ('keyFeatures' in item && !!item.keyFeatures));

  return (
    <div className="min-h-screen">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Link href="/programs-events" className="text-zinc-50 hover:text-zinc-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Programs & Events
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
            <p className="text-xl">{description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content (Left Column) */}
            <div className="lg:col-span-2">
              {/* Overview Section */}
              <div className="japan-card p-8 mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Overview</h2>
                <div 
                  className="prose prose-lg max-w-none text-black" 
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                ></div>
              </div>

              {/* Key Features Section - Only for Programs */}
              {isEvent && 'keyFeatures' in item && item.keyFeatures && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Key Features</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <tbody>
                        {item.keyFeatures?.duration && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Duration:</td>
                            <td className="py-3 px-4 text-black">{item.keyFeatures.duration}</td>
                          </tr>
                        )}
                        {item.keyFeatures?.mode && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Mode:</td>
                            <td className="py-3 px-4 text-black">
                              {item.keyFeatures.mode.includes('online') ? 'Online' : 
                                item.keyFeatures.mode.includes('offline') ? 'Offline' : 'Hybrid'}
                            </td>
                          </tr>
                        )}
                        {item.keyFeatures.customLocation && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Location:</td>
                            <td className="py-3 px-4 text-black">{item.keyFeatures.customLocation}</td>
                          </tr>
                        )}
                        {item.keyFeatures.certification && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Certification:</td>
                            <td className="py-3 px-4 text-black">{item.keyFeatures.certification === 'yes' ? 'Yes' : 'No'}</td>
                          </tr>
                        )}
                        {item.keyFeatures.eligibility && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Eligibility:</td>
                            <td className="py-3 px-4 text-black">{item.keyFeatures.eligibility}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Program Curriculum - Only for Programs */}
              {isEvent && 'curriculum' in item && item.curriculum && item.curriculum.length > 0 && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Program Curriculum</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-zinc-50">
                          <th className="py-3 px-4 text-left text-black font-semibold">Module</th>
                          <th className="py-3 px-4 text-left text-black font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.curriculum.map((module: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4 text-black font-medium">{module.module}</td>
                            <td className="py-3 px-4 text-black">{module.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Learning Outcomes - Only for Programs */}
              {isEvent && 'learningOutcomes' in item && item.learningOutcomes && item.learningOutcomes.length > 0 && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Learning Outcomes</h2>
                  <ul className="list-none space-y-3">
                    {item.learningOutcomes.map((outcome: any, index: number) => (
                      <li key={index} className="flex text-black items-start">
                        <span className="text-hinomaru-red mr-3 mt-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span>{outcome.outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Program Fees - Only for Programs */}
              {isEvent && 'programFees' in item && item.programFees && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Program Fees</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <tbody>
                        {item.programFees.memberPrice !== undefined && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Price for Members:</td>
                            <td className="py-3 px-4 text-black">₹{item.programFees.memberPrice.toLocaleString()}</td>
                          </tr>
                        )}
                        {item.programFees.nonMemberPrice !== undefined && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Price for Non-Members:</td>
                            <td className="py-3 px-4 text-black">₹{item.programFees.nonMemberPrice.toLocaleString()}</td>
                          </tr>
                        )}
                        {item.programFees.hasScholarships && (
                          <tr className="border-b">
                            <td className="py-3 px-4 bg-zinc-50 text-black font-semibold">Scholarships:</td>
                            <td className="py-3 px-4 text-black">
                              Available
                              {item.programFees.scholarshipDetails && (
                                <div className="mt-2 text-sm text-zinc-800">
                                  {item.programFees.scholarshipDetails}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Upcoming Batches - Only for Programs */}
              {isEvent && 'upcomingBatches' in item && item.upcomingBatches && item.upcomingBatches.length > 0 && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Upcoming Batches</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-zinc-50">
                          <th className="py-3 px-4 text-left text-black font-semibold">Batch Start Date</th>
                          <th className="py-3 px-4 text-left text-black font-semibold">Mode</th>
                          <th className="py-3 px-4 text-left text-black font-semibold">Application Deadline</th>
                          <th className="py-3 px-4 text-left text-black font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.upcomingBatches.map((batch, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4 text-black font-medium">{formatSimpleDate(batch.startDate)}</td>
                            <td className="py-3 text-black px-4">{batch.mode ? (batch.mode === 'online' ? 'Online' : batch.mode === 'offline' ? 'Offline' : 'Hybrid') : 'TBD'}</td>
                            <td className="py-3 px-4 text-black">{batch.applicationDeadline ? formatSimpleDate(batch.applicationDeadline) : 'TBD'}</td>
                            <td className="py-3 px-4">
                              <Link 
                                href={`/programs-events/${params.slug}/register?batch=${index}`} 
                                className="text-hinomaru-red hover:text-sakura-700 font-medium"
                              >
                                Apply Now
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Application Process - Only for Programs */}
              {isEvent && 'applicationProcess' in item && item.applicationProcess && item.applicationProcess.length > 0 && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">How to Apply?</h2>
                  <ol className="list-none space-y-5">
                    {item.applicationProcess.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-hinomaru-red text-white font-semibold mr-4">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-zinc-900">{step.step}</h4>
                          {step.description && <p className="text-zinc-800 mt-1">{step.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Testimonials - Only for Programs */}
              {isEvent && 'testimonials' in item && item.testimonials && item.testimonials.length > 0 && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Testimonials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {item.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-zinc-50 p-6 rounded-washi">
                        <div className="text-sakura-700 mb-2">
                          <svg className="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                          </svg>
                        </div>
                        <p className="text-zinc-800 italic mb-4">{testimonial.quote}</p>
                        <div className="text-right">
                          <p className="font-bold text-zinc-900">- {testimonial.author}</p>
                          {testimonial.title && <p className="text-sm text-zinc-800">{testimonial.title}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs - Only for Programs */}
              {isEvent && 'faqs' in item && item.faqs && item.faqs.length > 0 && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">FAQs</h2>
                  <div className="space-y-4">
                    {item.faqs.map((faq, index) => (
                      <details key={index} className="group border-b pb-4">
                        <summary className="flex justify-between items-center font-semibold text-black cursor-pointer list-none">
                          <span>{faq.question}</span>
                          <span className="transition group-open:rotate-180">
                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </summary>
                        <p className="text-zinc-800 mt-3 group-open:animate-fadeIn">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy Event-specific details, if this is a regular event and not a program */}
              {isEvent && 'startDate' in item && item.startDate && !hasProgramFormat && (
                <div className="japan-card p-8 mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Event Details</h2>
                  <ul className="space-y-4">
                    <li className="flex">
                      <span className="text-hinomaru-red mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </span>
                      <div>
                        <span className="block text-sm text-zinc-800">Date & Time</span>
                        <span className="block text-zinc-900">
                          {formatDate(item.startDate)}
                          {item.endDate && ` to ${formatDate(item.endDate)}`}
                        </span>
                      </div>
                    </li>
                    {item.location && (
                      <li className="flex">
                        <span className="text-hinomaru-red mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm text-zinc-800">Location</span>
                          <span className="block text-zinc-900">
                            {typeof item.location === 'object' && item.location?.isVirtual 
                              ? `Online ${typeof item.location === 'object' && item.location?.virtualLink ? `- ${item.location.virtualLink}` : ''}` 
                              : typeof item.location === 'object' 
                                ? `${item.location?.name || ''} ${item.location?.city ? `, ${item.location.city}` : ''}`
                                : item.location || 'To be announced'}
                          </span>
                        </div>
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-8">
                    <Link 
                      href={`/programs-events/${params.slug}/register`} 
                      className="btn-primary block text-center"
                    >
                      Register for this Event
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Meta Information (Right Column) */}
            <div className="lg:col-span-1">
              {/* Featured Image */}
              {featuredImageUrl && (
                <div className="mb-8 rounded-washi overflow-hidden shadow-md">
                  <SafeImage 
                    src={featuredImageUrl}
                    alt={title}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                    fallbackSrc={featuredImageUrl}
                    unoptimized={true}
                  />
                </div>
              )}

              {/* Contact Information */}
              {isEvent && 'contactInfo' in item && item.contactInfo && (
                <div className="japan-card p-6 mb-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">Contact for More Details</h3>
                  <ul className="space-y-4">
                    {item.contactInfo.email && (
                      <li className="flex">
                        <span className="text-hinomaru-red mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm text-zinc-800">Email</span>
                          <a href={`mailto:${item.contactInfo.email}`} className="block text-zinc-900 hover:text-hinomaru-red">
                            {item.contactInfo.email}
                          </a>
                        </div>
                      </li>
                    )}
                    {item.contactInfo.phone && (
                      <li className="flex">
                        <span className="text-hinomaru-red mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm text-zinc-800">Phone</span>
                          <a href={`tel:${item.contactInfo.phone}`} className="block text-zinc-900 hover:text-hinomaru-red">
                            {item.contactInfo.phone}
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
                  
                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    {item.contactInfo?.brochureFile && (
                      <a href={item.contactInfo.brochureFile.url} target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-center block">
                        Download Brochure
                      </a>
                    )}
                    <Link 
                      href={`/programs-events/${params.slug.toString().replace(/-+$/, '')}/register`}
                      className="btn-primary w-full text-center block"
                    >
                      Apply Now
                    </Link>
                    <Link 
                      href="/contact" 
                      className="btn-secondary w-full text-center block"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              )}

              {/* Legacy Contact Info - if contactInfo isn't in the new format */}
              {isEvent && !('contactInfo' in item) && ((('contactEmail' in item) && item.contactEmail) || (('contactPhone' in item) && item.contactPhone)) && (
                <div className="japan-card p-6 mb-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">Contact Information</h3>
                  <ul className="space-y-4">
                    {isEvent && 'contactEmail' in item && item.contactEmail && (
                      <li className="flex">
                        <span className="text-hinomaru-red mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm text-zinc-800">Email</span>
                          <a href={`mailto:${item.contactEmail}`} className="block text-zinc-900 hover:text-hinomaru-red">
                            {item.contactEmail}
                          </a>
                        </div>
                      </li>
                    )}
                    {isEvent && 'contactPhone' in item && item.contactPhone && (
                      <li className="flex">
                        <span className="text-hinomaru-red mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </span>
                        <div>
                          <span className="block text-sm text-zinc-800">Phone</span>
                          <a href={`tel:${item.contactPhone}`} className="block text-zinc-900 hover:text-hinomaru-red">
                            {item.contactPhone}
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Event/Program Details Card */}
              <div className="japan-card p-6 mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Details</h3>
                <ul className="space-y-4">
                  
                  {/* Date Information */}
                  {isEvent && (
                    <li className="flex items-start">
                      <div className="text-hinomaru-red mr-3 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Date</h4>
                        {item.keyFeatures?.eventDate ? (
                          <p className="text-zinc-700">{formatDate(item.keyFeatures.eventDate)}</p>
                        ) : item.keyFeatures?.startDate ? (
                          <p className="text-zinc-700">
                            {formatDate(item.keyFeatures.startDate)}
                            {item.keyFeatures.endDate && ` - ${formatDate(item.keyFeatures.endDate)}`}
                          </p>
                        ) : item.upcomingBatches && item.upcomingBatches.length > 0 ? (
                          <p className="text-zinc-700">Multiple batches available</p>
                        ) : item.eventDate ? (
                          <p className="text-zinc-700">{formatDate(item.eventDate)}</p>
                        ) : item.startDate && item.endDate ? (
                          <p className="text-zinc-700">{formatDate(item.startDate)} - {formatDate(item.endDate)}</p>
                        ) : item.startDate ? (
                          <p className="text-zinc-700">{formatDate(item.startDate)}</p>
                        ) : (
                          <p className="text-zinc-700">To be announced</p>
                        )}
                      </div>
                    </li>
                  )}
                  
                  {/* Location Information */}
                  {isEvent && (
                    <li className="flex items-start">
                      <div className="text-hinomaru-red mr-3 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Location</h4>
                        {item.keyFeatures?.customLocation ? (
                          <p className="text-zinc-700">{item.keyFeatures.customLocation}</p>
                        ) : item.keyFeatures?.isVirtual || item.keyFeatures?.mode === 'online' ? (
                          <p className="text-zinc-700">Online</p>
                        ) : item.keyFeatures?.mode === 'offline' ? (
                          <p className="text-zinc-700">Offline</p>
                        ) : typeof item.location === 'object' && item.location?.isVirtual ? (
                          <p className="text-zinc-700">Online</p>
                        ) : typeof item.location === 'object' && item.location ? (
                          <div>
                            {item.location.name && <p className="text-zinc-700">{item.location.name}</p>}
                            {item.location.address && <p className="text-zinc-700">{item.location.address}</p>}
                            {item.location.city && item.location.address && !item.location.address.includes(item.location.city) && (
                              <p className="text-zinc-700">
                                {item.location.city}
                                {item.location.state && `, ${item.location.state}`}
                                {item.location.zipCode && ` ${item.location.zipCode}`}
                              </p>
                            )}
                          </div>
                        ) : item.keyFeatures?.mode ? (
                          <p className="text-zinc-700">
                            {item.keyFeatures.mode.includes('online') ? 'Online' : 
                             item.keyFeatures.mode.includes('offline') ? 'Offline' : 'Hybrid'}
                          </p>
                        ) : (
                          <p className="text-zinc-700">To be announced</p>
                        )}
                      </div>
                    </li>
                  )}
                  
                  {/* Rest of the sidebar items */}
                  // ... existing code ...
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 