'use client';

import { useState, useEffect } from 'react';
import { Calendar, Award, User, BookOpen, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { getProgramBySlug } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SafeImage } from '@/components/common';

// Add the dynamic export for SSR
export const dynamic = 'force-dynamic';

// Interface for the program data
interface Program {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  isFeatured?: boolean;
  summary?: string;
  content?: string;
  keyFeatures?: { feature: string }[];
  curriculum?: { module: string; description: string }[];
  learningOutcomes?: { outcome: string }[];
  programFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    currency?: string;
    hasScholarship?: boolean;
    scholarshipDetails?: string;
  };
  upcomingBatches?: {
    batchName: string;
    startDate: string;
    endDate?: string;
    applicationDeadline?: string;
    capacity?: number;
    registrationsOpen?: boolean;
  }[];
  applicationProcess?: { step: string; description: string }[];
  featuredImage?: {
    url: string;
    alt: string;
  };
  faqs?: { question: string; answer: string }[];
  testimonials?: { name: string; position?: string; text: string; image?: { url: string } }[];
}

interface ProgramDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = params;
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await getProgramBySlug(slug);
        
        if (!response || !response.data) {
          setError('Program not found');
          return;
        }
        
        setProgram(response.data);
      } catch (err) {
        console.error('Error fetching program:', err);
        setError('Failed to load program data');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProgramData();
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

  if (error || !program) {
    return (
      <div className="container-custom py-20">
        <div className="japan-card">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-zinc-700 mb-6">{error || 'Program not found'}</p>
          <Link href="/programs" className="btn-primary">
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Hero section with image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        {program.featuredImage ? (
          <SafeImage
            src={program.featuredImage.url}
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
                {program.curriculum && program.curriculum.length > 0 && (
                  <TabsTrigger value="curriculum" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    Curriculum
                  </TabsTrigger>
                )}
                {program.applicationProcess && program.applicationProcess.length > 0 && (
                  <TabsTrigger value="application" className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
                    How to Apply
                  </TabsTrigger>
                )}
                {program.faqs && program.faqs.length > 0 && (
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
                      dangerouslySetInnerHTML={{ __html: program.content }}
                    />
                  ) : (
                    <p className="text-zinc-700">{program.summary || 'No description available'}</p>
                  )}
                </div>

                {program.keyFeatures && program.keyFeatures.length > 0 && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Key Features</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 mr-2 text-hinomaru-red flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-700">{feature.feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.learningOutcomes && program.learningOutcomes.length > 0 && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Learning Outcomes</h2>
                    <ul className="space-y-3">
                      {program.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <Award className="h-5 w-5 mr-3 text-hinomaru-red flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-700">{outcome.outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.testimonials && program.testimonials.length > 0 && (
                  <div className="japan-card mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-zinc-900">Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {program.testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-200">
                          <div className="flex items-start">
                            {testimonial.image ? (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                <SafeImage
                                  src={testimonial.image.url}
                                  alt={testimonial.name}
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
                              <h3 className="font-semibold text-zinc-900">{testimonial.name}</h3>
                              {testimonial.position && <p className="text-sm text-zinc-500">{testimonial.position}</p>}
                            </div>
                          </div>
                          <p className="mt-4 text-zinc-700 italic">"{testimonial.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {program.curriculum && program.curriculum.length > 0 && (
                <TabsContent value="curriculum" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Curriculum</h2>
                    <div className="space-y-6">
                      {program.curriculum.map((module, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100">
                          <h3 className="font-bold text-xl mb-2 text-zinc-900">{module.module}</h3>
                          <p className="text-zinc-700">{module.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {program.applicationProcess && program.applicationProcess.length > 0 && (
                <TabsContent value="application" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Application Process</h2>
                    <div className="space-y-6">
                      {program.applicationProcess.map((step, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-md border border-gray-100 flex">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hinomaru-red text-white flex items-center justify-center mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-2 text-zinc-900">{step.step}</h3>
                            <p className="text-zinc-700">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              {program.faqs && program.faqs.length > 0 && (
                <TabsContent value="faqs" className="mt-0">
                  <div className="japan-card">
                    <h2 className="section-title mb-6">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {program.faqs.map((faq, index) => (
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
            {/* Program Details Card */}
            <div className="japan-card">
              <h2 className="text-xl font-bold mb-4 text-zinc-900">Program Details</h2>

              {program.upcomingBatches && program.upcomingBatches.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-zinc-800">Upcoming Batches</h3>
                  <div className="space-y-4">
                    {program.upcomingBatches.map((batch, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="font-medium text-zinc-900 mb-2">{batch.batchName}</div>
                        <div className="flex items-center text-zinc-700 text-sm mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-hinomaru-red" />
                          <span>Starts: {formatDate(batch.startDate)}</span>
                        </div>
                        {batch.endDate && (
                          <div className="flex items-center text-zinc-700 text-sm mb-1">
                            <Calendar className="h-4 w-4 mr-2 text-hinomaru-red" />
                            <span>Ends: {formatDate(batch.endDate)}</span>
                          </div>
                        )}
                        {batch.applicationDeadline && (
                          <div className="flex items-center text-zinc-700 text-sm mb-1">
                            <Clock className="h-4 w-4 mr-2 text-hinomaru-red" />
                            <span>Application Deadline: {formatDate(batch.applicationDeadline)}</span>
                          </div>
                        )}
                        {batch.capacity && (
                          <div className="flex items-center text-zinc-700 text-sm">
                            <User className="h-4 w-4 mr-2 text-hinomaru-red" />
                            <span>Capacity: {batch.capacity} students</span>
                          </div>
                        )}
                        {batch.registrationsOpen && (
                          <Button className="btn-primary w-full mt-4">
                            Apply Now
                          </Button>
                        )}
                        {!batch.registrationsOpen && (
                          <Button disabled className="w-full mt-4 bg-gray-300 text-gray-700">
                            Registration Closed
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {program.programFees && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-zinc-800">Program Fees</h3>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center text-zinc-700 mb-2">
                      <CreditCard className="h-5 w-5 mr-2 text-hinomaru-red" />
                      <div>
                        {program.programFees.memberPrice && (
                          <div className="font-medium">
                            Members: {program.programFees.currency || '₹'}{program.programFees.memberPrice}
                          </div>
                        )}
                        {program.programFees.nonMemberPrice && (
                          <div>
                            Non-members: {program.programFees.currency || '₹'}{program.programFees.nonMemberPrice}
                          </div>
                        )}
                      </div>
                    </div>
                    {program.programFees.hasScholarship && program.programFees.scholarshipDetails && (
                      <div className="mt-2 text-sm bg-blue-50 p-3 rounded border border-blue-100 text-blue-800">
                        <span className="font-medium block mb-1">Scholarship Available</span>
                        {program.programFees.scholarshipDetails}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <Button className="btn-primary">
                  Apply for Program
                </Button>
                <Button className="btn-outline">
                  Download Brochure
                </Button>
                <Button variant="outline">
                  Contact Program Coordinator
                </Button>
              </div>
            </div>

            {/* Other programs you might like - can be added later */}
          </div>
        </div>
      </div>
    </div>
  );
} 