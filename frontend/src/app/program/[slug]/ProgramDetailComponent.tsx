'use client';

import { useState } from 'react';
import { Calendar, Award, User, BookOpen, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SafeImage } from '@/components/common';

// Interface for the program data
interface Program {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  isFeatured?: boolean;
  summary?: string;
  content?: string | any;
  keyFeatures?: Array<{ feature: string } | string>;
  curriculum?: Array<{ module: string; description: string } | string>;
  learningOutcomes?: Array<{ outcome: string } | string>;
  programFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    currency?: string;
    hasScholarship?: boolean;
    scholarshipDetails?: string;
  };
  upcomingBatches?: Array<{
    batchName: string;
    startDate: string;
    endDate?: string;
    applicationDeadline?: string;
    capacity?: number;
    registrationsOpen?: boolean;
  } | any>;
  applicationProcess?: Array<{ step: string; description: string } | string>;
  featuredImage?: {
    url: string;
    alt?: string;
  } | string;
  faqs?: Array<{ question: string; answer: string } | string>;
  testimonials?: Array<{ 
    name: string; 
    position?: string; 
    text?: string;
    quote?: string;
    image?: { url: string } | string;
  } | string>;
}

interface ProgramDetailComponentProps {
  initialProgram: Program;
  slug: string;
}

export default function ProgramDetailComponent({ initialProgram, slug }: ProgramDetailComponentProps) {
  const [program] = useState<Program>(initialProgram);
  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to determine if curriculum, application process, and faqs tabs should be shown
  const hasTabContent = (data: any[] | undefined): boolean => {
    return !!data && data.length > 0;
  };

  return (
    <div className="pb-16">
      {/* Hero section with image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {program.featuredImage ? (
          <SafeImage
            src={typeof program.featuredImage === 'string' ? program.featuredImage : program.featuredImage.url}
            alt={program.title}
            fill
            className="object-cover"
            fallbackSrc="/assets/placeholder-program-banner.jpg"
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
            <p className="text-zinc-500">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container-custom pb-8 md:pb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {program.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-hinomaru-red border-none text-white px-3 py-1">
                {program.category}
              </Badge>
              {program.isFeatured && (
                <Badge className="bg-amber-500 border-none text-white px-3 py-1">
                  Featured Program
                </Badge>
              )}
            </div>
            <p className="text-zinc-100 text-lg max-w-3xl">
              {program.summary}
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
                {hasTabContent(program.curriculum) && (
                  <TabsTrigger value="curriculum" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Curriculum
                  </TabsTrigger>
                )}
                {hasTabContent(program.applicationProcess) && (
                  <TabsTrigger value="application" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    How to Apply
                  </TabsTrigger>
                )}
                {hasTabContent(program.faqs) && (
                  <TabsTrigger value="faqs" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    FAQs
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="japan-card mb-8">
                  <h2 className="section-title mb-6">About This Program</h2>
                  {program.content ? (
                    <div 
                      className="prose prose-zinc max-w-none"
                      dangerouslySetInnerHTML={{ __html: typeof program.content === 'string' ? program.content : 'No detailed description available' }}
                    />
                  ) : (
                    <p className="text-zinc-700">{program.summary || 'No description available'}</p>
                  )}
                </div>

                {hasTabContent(program.keyFeatures) && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Key Features</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.keyFeatures?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-700">
                            {typeof feature === 'string' ? feature : feature.feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasTabContent(program.learningOutcomes) && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Learning Outcomes</h2>
                    <ul className="space-y-3">
                      {program.learningOutcomes?.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <Award className="h-5 w-5 mr-3 text-hinomaru-red flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-700">
                            {typeof outcome === 'string' ? outcome : outcome.outcome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasTabContent(program.testimonials) && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {program.testimonials?.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-200">
                          <div className="flex items-start">
                            {typeof testimonial !== 'string' && testimonial.image ? (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                <SafeImage
                                  src={typeof testimonial.image === 'string' ? testimonial.image : testimonial.image.url}
                                  alt={typeof testimonial === 'string' ? 'Testimonial' : testimonial.name}
                                  fill
                                  className="object-cover"
                                  fallbackSrc="/assets/placeholder-avatar.png"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-zinc-900">
                                {typeof testimonial === 'string' ? 'Happy Student' : testimonial.name}
                              </h3>
                              {typeof testimonial !== 'string' && testimonial.position && (
                                <p className="text-sm text-zinc-500">{testimonial.position}</p>
                              )}
                            </div>
                          </div>
                          <p className="mt-4 text-zinc-700 italic">
                            "{typeof testimonial === 'string' ? testimonial : (testimonial.text || testimonial.quote || '')}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {hasTabContent(program.curriculum) && (
                <TabsContent value="curriculum" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Curriculum</h2>
                    <div className="space-y-6">
                      {program.curriculum?.map((module, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100">
                          <h3 className="font-bold text-xl mb-2 text-zinc-900">
                            {typeof module === 'string' ? `Module ${index + 1}` : module.module}
                          </h3>
                          <p className="text-zinc-700">
                            {typeof module === 'string' ? module : module.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {hasTabContent(program.applicationProcess) && (
                <TabsContent value="application" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Application Process</h2>
                    <div className="space-y-6">
                      {program.applicationProcess?.map((step, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100 flex">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hinomaru-red text-white flex items-center justify-center mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-2 text-zinc-900">
                              {typeof step === 'string' ? `Step ${index + 1}` : step.step}
                            </h3>
                            <p className="text-zinc-700">
                              {typeof step === 'string' ? step : step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {hasTabContent(program.faqs) && (
                <TabsContent value="faqs" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {program.faqs?.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger className="text-lg font-medium text-zinc-900">
                            {typeof faq === 'string' ? `Question ${index + 1}` : faq.question}
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
            </Tabs>
          </div>

          {/* Sidebar - right side on desktop */}
          <div className="space-y-6">
            {/* Program Details Card */}
            <div className="japan-card">
              <h2 className="text-xl font-bold mb-4 text-zinc-900">Program Details</h2>

              {program.upcomingBatches && program.upcomingBatches.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-zinc-800">Upcoming Batches</h3>
                  <div className="space-y-4">
                    {program.upcomingBatches.map((batch, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="font-medium text-zinc-900 mb-2">
                          {typeof batch === 'string' ? `Batch ${index + 1}` : batch.batchName || batch.name}
                        </div>
                        <div className="flex items-center text-zinc-700 text-sm mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-hinomaru-red" />
                          <span>Starts: {typeof batch === 'string' ? batch : formatDate(new Date(batch.startDate))}</span>
                        </div>
                        {typeof batch !== 'string' && batch.endDate && (
                          <div className="flex items-center text-zinc-700 text-sm mb-1">
                            <Calendar className="h-4 w-4 mr-2 text-hinomaru-red" />
                            <span>Ends: {formatDate(new Date(batch.endDate))}</span>
                          </div>
                        )}
                        {typeof batch !== 'string' && batch.applicationDeadline && (
                          <div className="flex items-center text-zinc-700 text-sm mb-1">
                            <Clock className="h-4 w-4 mr-2 text-hinomaru-red" />
                            <span>Application Deadline: {formatDate(new Date(batch.applicationDeadline))}</span>
                          </div>
                        )}
                        {typeof batch !== 'string' && batch.capacity && (
                          <div className="flex items-center text-zinc-700 text-sm">
                            <User className="h-4 w-4 mr-2 text-hinomaru-red" />
                            <span>Capacity: {batch.capacity} students</span>
                          </div>
                        )}
                        {typeof batch !== 'string' && batch.registrationsOpen && (
                          <Button className="btn-primary w-full mt-4">
                            Apply Now
                          </Button>
                        )}
                        {typeof batch !== 'string' && !batch.registrationsOpen && (
                          <p className="text-sm text-gray-500 mt-2">
                            Applications currently closed
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {program.programFees && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-zinc-800">Program Fees</h3>
                  <div className="space-y-2">
                    {program.programFees.memberPrice !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-700">ASA Members:</span>
                        <span className="font-medium text-zinc-900">
                          {program.programFees.currency || '₹'}{program.programFees.memberPrice}
                        </span>
                      </div>
                    )}
                    {program.programFees.nonMemberPrice !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-700">Non-members:</span>
                        <span className="font-medium text-zinc-900">
                          {program.programFees.currency || '₹'}{program.programFees.nonMemberPrice}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {program.programFees.hasScholarship && program.programFees.scholarshipDetails && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
                      <div className="flex items-start">
                        <BookOpen className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">Scholarship Available</h4>
                          <p className="text-sm text-green-700">{program.programFees.scholarshipDetails}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button className="btn-primary w-full" asChild>
                  <Link href={`/programs/${program.slug}/apply`}>Apply Now</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact?subject=Program Enquiry">Request Information</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 