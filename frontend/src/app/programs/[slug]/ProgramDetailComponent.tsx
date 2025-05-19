'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  GraduationCap, 
  BookOpen,
  Tag, 
  CheckCircle, 
  ExternalLink, 
  Download,
  ChevronRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SafeImage } from '@/components/common';
import { Program } from '@/lib/api/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';

interface ProgramDetailComponentProps {
  initialProgram: Program;
  slug: string;
}

// Add these interfaces for the Payload CMS rich text format
interface RichTextChild {
  text?: string;
  [key: string]: any;
}

interface RichTextBlock {
  children?: RichTextChild[];
  [key: string]: any;
}

// Create ExtendedProgram type for backward compatibility
type ExtendedProgram = Program & {
  upcomingBatches?: Array<{
    startDate: string;
    mode?: 'online' | 'offline' | 'hybrid';
    applicationDeadline?: string;
    isFull?: boolean;
    registrationsOpen?: boolean;
    batchName?: string;
    name?: string;
    endDate?: string;
    capacity?: number;
  } | string>;
  keyFeatures?: any;
  curriculum?: Array<{
    module: string;
    description?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    title?: string;
    text?: string;
    name?: string;
    position?: string;
    avatar?: string | {
      url: string;
    };
    image?: string | {
      url: string;
    };
  }>;
  learningOutcomes?: Array<{
    outcome: string;
  }>;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  programFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    hasScholarships?: boolean;
    scholarshipDetails?: string;
    currency?: string;
    hasScholarship?: boolean; // Alias for hasScholarships
  };
  applicationProcess?: Array<{
    step: string;
    description?: string;
  }>;
  price?: number | string;
  isFree?: boolean;
  category?: string;
  eligibility?: string;
  programDetails?: string;
  certification?: string | boolean;
};

export default function ProgramDetailComponent({ initialProgram, slug }: ProgramDetailComponentProps) {
  // Cast to ExtendedProgram to avoid TS errors
  const [program, setProgram] = useState<ExtendedProgram>(initialProgram as ExtendedProgram);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { isAuthenticated, loginWithRedirect } = useAuth();

  // Helper function to determine if content sections should be shown
  const hasTabContent = (data: any[] | string | undefined): boolean => {
    if (!data) return false;
    
    // If it's a string, check if it's non-empty
    if (typeof data === 'string') return data.trim().length > 0;
    
    // If it's an array, check if it has content
    if (Array.isArray(data) && data.length === 0) return false;
    
    // Check if the array has at least one non-empty value
    if (Array.isArray(data)) {
      return data.some(item => {
        if (typeof item === 'string') return item.trim().length > 0;
        if (typeof item === 'object' && item !== null) {
          if ('module' in item) return item.module && item.module.trim().length > 0;
          if ('outcome' in item) return item.outcome && item.outcome.trim().length > 0;
          if ('step' in item) return item.step && item.step.trim().length > 0;
          if ('quote' in item || 'text' in item) return (item.quote || item.text) && (item.quote?.trim().length > 0 || item.text?.trim().length > 0);
          if ('question' in item) return item.question && item.question.trim().length > 0;
          return Object.values(item).some(val => val && typeof val === 'string' && val.trim().length > 0);
        }
        return false;
      });
    }
    
    return false;
  };

  const handleEnrollClick = () => {
    if (isAuthenticated) {
      console.log('User is authenticated, processing enrollment');
      // Here you would handle the registration API call
      alert('Enrollment request submitted! You will receive confirmation details via email.');
    } else {
      console.log('User is not authenticated, redirecting to login');
      loginWithRedirect(`/programs/${program.slug}`);
    }
  };

  // Function to get the first upcoming batch that's available for enrollment
  const getAvailableBatch = () => {
    if (!program.upcomingBatches || !Array.isArray(program.upcomingBatches) || program.upcomingBatches.length === 0) {
      return null;
    }
    
    return program.upcomingBatches.find(batch => {
      if (typeof batch === 'string') return false;
      return !batch.isFull && batch.registrationsOpen !== false;
    });
  };

  // Get the first available batch
  const availableBatch = getAvailableBatch();

  // Helper function to render content that might be in different formats
  const renderFormattedContent = (content: any) => {
    if (!content) return null;
    
    // If it's a string (possibly HTML)
    if (typeof content === 'string') {
      // Check if it appears to be HTML
      if (content.includes('<') && content.includes('>')) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
      }
      // Plain text
      return <p>{content}</p>;
    }
    
    // If it's a Payload CMS richtext object or array
    if (typeof content === 'object') {
      // It may be an array of richtext nodes
      if (Array.isArray(content)) {
        return content.map((block: RichTextBlock, index: number) => {
          // Each block might have children array with text
          if (block.children && Array.isArray(block.children)) {
            return (
              <p key={index} className="mb-4">
                {block.children.map((child: RichTextChild, childIndex: number) => {
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
            {content.children.map((child: RichTextChild, index: number) => {
              if (typeof child === 'string') return child;
              return child.text || '';
            }).join(' ')}
          </p>
        );
      }
    }
    
    // Fallback: render as JSON string only in development
    return <p>{process.env.NODE_ENV === 'development' ? JSON.stringify(content) : 'Content not available in proper format.'}</p>;
  };

  // Implement getEventDateDisplay function
  const getEventDateDisplay = (program: ExtendedProgram): string => {
    // First try to get dates from keyFeatures
    if (program.keyFeatures) {
      if (typeof program.keyFeatures === 'object') {
        if ('eventDate' in program.keyFeatures && program.keyFeatures.eventDate) {
          return formatDate(new Date(program.keyFeatures.eventDate));
        }
        
        if ('startDate' in program.keyFeatures && program.keyFeatures.startDate) {
          const startDateFormatted = formatDate(new Date(program.keyFeatures.startDate));
          if ('endDate' in program.keyFeatures && program.keyFeatures.endDate) {
            const endDateFormatted = formatDate(new Date(program.keyFeatures.endDate));
            return `${startDateFormatted} - ${endDateFormatted}`;
          }
          return startDateFormatted;
        }
      }
    }
    
    // Next try program's direct fields
    if (program.eventDate) {
      return formatDate(new Date(program.eventDate));
    }
    
    if (program.startDate) {
      const startDateFormatted = formatDate(new Date(program.startDate));
      if (program.endDate) {
        const endDateFormatted = formatDate(new Date(program.endDate));
        return `${startDateFormatted} - ${endDateFormatted}`;
      }
      return startDateFormatted;
    }
    
    // If available, use upcoming batches
    if (program.upcomingBatches && program.upcomingBatches.length > 0) {
      const firstBatch = program.upcomingBatches[0];
      if (typeof firstBatch === 'object' && firstBatch.startDate) {
        return formatDate(new Date(firstBatch.startDate));
      }
    }
    
    return 'Dates to be announced';
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section with Program Image */}
      <section className="relative h-[40vh] min-h-[300px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <SafeImage
            src={
              typeof program.featuredImage === 'object' && program.featuredImage?.url 
                ? program.featuredImage.url 
                : typeof program.featuredImage === 'string' 
                  ? program.featuredImage
                  : '/assets/placeholder-image.jpg'
            }
            alt={program.title || 'Program image'}
            fill
            className="object-cover"
            fallbackSrc="/assets/placeholder-image.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
        </div>
        
        <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-12">
          <div className="max-w-3xl">
            <Badge 
              className="mb-4 bg-hinomaru-red text-white"
              variant="default"
            >
              {program.category || 'Program'}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {program.title}
            </h1>
            {program.summary && (
              <p className="text-xl text-zinc-100 mb-6">
                {program.summary}
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
            {hasTabContent(program.curriculum) && (
              <button 
                onClick={() => setActiveTab('curriculum')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'curriculum' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
              >
                Curriculum
              </button>
            )}
            {hasTabContent(program.applicationProcess) && (
              <button 
                onClick={() => setActiveTab('application')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'application' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
              >
                How to Apply
              </button>
            )}
            {hasTabContent(program.testimonials) && (
              <button 
                onClick={() => setActiveTab('testimonials')}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === 'testimonials' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
              >
                Testimonials
              </button>
            )}
            {hasTabContent(program.faqs) && (
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
                    <h2 className="section-title mb-6">About This Program</h2>
                    
                    {program.content ? (
                      typeof program.content === 'string' && program.content.trim() ? (
                        <div 
                          className="prose prose-zinc max-w-none"
                          dangerouslySetInnerHTML={{ __html: program.content }}
                        />
                      ) : (
                        typeof program.content === 'object' && program.content !== null ? (
                          <div className="prose prose-zinc max-w-none">
                            <p>{JSON.stringify(program.content)}</p>
                          </div>
                        ) : (
                          <p className="text-zinc-700">{program.summary || 'No detailed description available'}</p>
                        )
                      )
                    ) : (
                      <p className="text-zinc-700">{program.summary || 'No description available'}</p>
                    )}
                  </div>

                  {hasTabContent(program.keyFeatures) && (
                    <div className="japan-card mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-zinc-900">Key Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        {/* Eligibility Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold mb-4 text-hinomaru-red">Eligibility</h3>
                          <div className="prose prose-zinc max-w-none">
                            {program.eligibility ? renderFormattedContent(program.eligibility) : <p>Contact us for eligibility details.</p>}
                          </div>
                        </div>

                        {/* Program Details Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold mb-4 text-hinomaru-red">Program Details</h3>
                          <div className="prose prose-zinc max-w-none">
                            {program.programDetails ? renderFormattedContent(program.programDetails) : <p>Contact us for program details.</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {program.eligibility && (
                    <div className="japan-card mb-8">
                      <h2 className="text-2xl font-bold mb-4 text-zinc-900">Eligibility</h2>
                      <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                        <p className="text-zinc-700">{program.eligibility}</p>
                      </div>
                    </div>
                  )}

                  {hasTabContent(program.learningOutcomes) && (
                    <div className="japan-card mb-8">
                      <h2 className="text-2xl font-bold mb-6 text-zinc-900">Learning Outcomes</h2>
                      <ul className="space-y-4">
                        {typeof program.learningOutcomes === 'string' ? (
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                            <span className="text-zinc-700">{program.learningOutcomes}</span>
                          </li>
                        ) : Array.isArray(program.learningOutcomes) && program.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                            <span className="text-zinc-700">
                              {typeof outcome === 'string' ? outcome : outcome.outcome}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {program.certification && (
                    <div className="japan-card mb-8">
                      <h2 className="text-2xl font-bold mb-4 text-zinc-900">Certification</h2>
                      <div className="flex items-start">
                        <GraduationCap className="h-6 w-6 mr-3 text-hinomaru-red flex-shrink-0 mt-0.5" />
                        <p className="text-zinc-700">{program.certification}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="curriculum" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">Program Curriculum</h2>
                    
                    {program.curriculum && (
                      <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900">Curriculum</h2>
                        <div className="prose prose-zinc max-w-none">
                          {renderFormattedContent(program.curriculum)}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="application" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">Application Process</h2>
                    
                    {program.applicationProcess && Array.isArray(program.applicationProcess) && program.applicationProcess.length > 0 ? (
                      <div className="space-y-6">
                        {program.applicationProcess.map((step, index) => (
                          <div key={index} className="flex">
                            <div className="mr-4 flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-hinomaru-red text-white flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              {index < program.applicationProcess!.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                              )}
                            </div>
                            <div className="pt-1">
                              <h3 className="text-lg font-bold text-zinc-900 mb-1">
                                {typeof step === 'string' ? step : step.step}
                              </h3>
                              {typeof step !== 'string' && step.description && (
                                <p className="text-zinc-700 mb-4">{step.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-zinc-700">To apply for this program, please follow these general steps:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li className="text-zinc-700">Fill out the enrollment form by clicking the "Enroll Now" button</li>
                          <li className="text-zinc-700">Provide necessary documentation as required</li>
                          <li className="text-zinc-700">Complete payment of applicable fees</li>
                          <li className="text-zinc-700">Receive confirmation of your enrollment</li>
                        </ol>
                        <p className="text-zinc-700 mt-4">For more detailed information about the application process, please contact our office.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="testimonials" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">What Our Participants Say</h2>
                    
                    {program.testimonials && Array.isArray(program.testimonials) && program.testimonials.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-8">
                        {program.testimonials.map((testimonial, index) => {
                          if (typeof testimonial === 'string') {
                            return (
                              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-zinc-700 italic mb-4">{testimonial}</p>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                              <p className="text-zinc-700 italic mb-4">{testimonial.quote || testimonial.text}</p>
                              <div className="flex items-center">
                                {(testimonial.avatar || testimonial.image) && (
                                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                    <SafeImage
                                      src={
                                        typeof testimonial.avatar === 'object' ? testimonial.avatar.url :
                                        typeof testimonial.image === 'object' ? testimonial.image.url :
                                        typeof testimonial.image === 'string' ? testimonial.image :
                                        '/assets/placeholder-user.jpg'
                                      }
                                      width={48}
                                      height={48}
                                      alt={testimonial.name || testimonial.author || 'Testimonial author'}
                                      className="object-cover w-full h-full"
                                      fallbackSrc="/assets/placeholder-user.jpg"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-zinc-900">{testimonial.name}</p>
                                  {(testimonial.title || testimonial.position) && (
                                    <p className="text-sm text-zinc-500">{testimonial.title || testimonial.position}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-zinc-700">No testimonials are available for this program yet.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="faqs" className="mt-0">
                  <div className="japan-card mb-8">
                    <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                    
                    {program.faqs && Array.isArray(program.faqs) && program.faqs.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {program.faqs.map((faq, index) => {
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
                      <p className="text-zinc-700">No FAQs are available for this program yet. If you have any questions, please contact us.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-36">
                <div className="japan-card mb-6">
                  <h2 className="text-xl font-bold mb-6 text-zinc-900">Program Details</h2>
                  
                  <div className="space-y-6">
                    {/* Program Fees */}
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                      <div>
                        <h3 className="font-medium text-zinc-900">Program Fees</h3>
                        {program.programFees ? (
                          <div className="space-y-1">
                            {program.programFees.memberPrice !== undefined && (
                              <p className="text-zinc-700">
                                Members: {program.programFees.currency || '₹'}{program.programFees.memberPrice}
                              </p>
                            )}
                            {program.programFees.nonMemberPrice !== undefined && (
                              <p className="text-zinc-700">
                                Non-members: {program.programFees.currency || '₹'}{program.programFees.nonMemberPrice}
                              </p>
                            )}
                            {!program.programFees.memberPrice && !program.programFees.nonMemberPrice && (
                              <p className="text-zinc-700">
                                Please contact us for fee details
                              </p>
                            )}
                            {program.programFees.hasScholarship && program.programFees.scholarshipDetails && (
                              <p className="text-sm mt-1 text-green-700">{program.programFees.scholarshipDetails}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-zinc-700">Please contact us for fee details</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Duration */}
                    {program.upcomingBatches && program.upcomingBatches.length > 0 && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                        <div>
                          <h3 className="font-medium text-zinc-900">Upcoming Batches</h3>
                          <div className="space-y-3 mt-2">
                            {program.upcomingBatches.map((batch, index) => {
                              if (typeof batch === 'string') {
                                return (
                                  <p key={index} className="text-zinc-700">{batch}</p>
                                );
                              }
                              
                              return (
                                <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                  <p className="font-medium text-zinc-800">
                                    {batch.batchName || batch.name || `Batch ${index + 1}`}
                                  </p>
                                  {batch.startDate && (
                                    <p className="text-sm text-zinc-700">
                                      Start: {formatDate(new Date(batch.startDate))}
                                      {batch.endDate && <span><br />End: {formatDate(new Date(batch.endDate))}</span>}
                                    </p>
                                  )}
                                  {batch.mode && (
                                    <p className="text-sm text-zinc-700 mt-1">
                                      Mode: {batch.mode.charAt(0).toUpperCase() + batch.mode.slice(1)}
                                    </p>
                                  )}
                                  {batch.applicationDeadline && (
                                    <p className="text-sm text-zinc-700 mt-1">
                                      Application Deadline: {formatDate(new Date(batch.applicationDeadline))}
                                    </p>
                                  )}
                                  {batch.capacity && (
                                    <p className="text-sm text-zinc-700 mt-1">
                                      Capacity: {batch.capacity} participants
                                    </p>
                                  )}
                                  {batch.isFull && (
                                    <Badge variant="secondary" className="mt-2">Batch Full</Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Eligibility */}
                    {program.eligibility && (
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                        <div>
                          <h3 className="font-medium text-zinc-900">Who Can Apply</h3>
                          <p className="text-zinc-700 text-sm">{program.eligibility}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Certification */}
                    {program.certification && (
                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 mr-3 text-hinomaru-red mt-0.5" />
                        <div>
                          <h3 className="font-medium text-zinc-900">Certification</h3>
                          <p className="text-zinc-700">{program.certification}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {availableBatch ? (
                      <Button 
                        className="w-full btn-primary"
                        onClick={handleEnrollClick}
                      >
                        Enroll Now
                      </Button>
                    ) : (
                      program.upcomingBatches && program.upcomingBatches.length > 0 ? (
                        <div>
                          <Button 
                            className="w-full btn-secondary"
                            disabled
                          >
                            All Batches Full
                          </Button>
                          <p className="text-sm text-zinc-500 mt-2 text-center">
                            Contact us to join the waitlist
                          </p>
                        </div>
                      ) : (
                        <Button 
                          className="w-full btn-primary"
                          onClick={handleEnrollClick}
                        >
                          Express Interest
                        </Button>
                      )
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
                
                {/* Related Programs */}
                <div className="japan-card">
                  <h3 className="text-lg font-bold mb-4 text-zinc-900">More Programs</h3>
                  <div className="space-y-3">
                    <Link href="/programs" className="flex items-center text-hinomaru-red font-medium hover:underline">
                      <span>Browse All Programs</span>
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                    {program.category && (
                      <Link 
                        href={`/programs?category=${program.category}`} 
                        className="flex items-center text-hinomaru-red font-medium hover:underline"
                      >
                        <span>More {program.category} Programs</span>
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