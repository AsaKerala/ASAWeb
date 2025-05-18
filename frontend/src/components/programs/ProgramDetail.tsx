'use client';

import React from 'react';
import Image from 'next/image';
import { Program } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, MapPin, Video, User, Award, DollarSign } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import SafeImage from '@/components/common/SafeImage';

interface ProgramDetailProps {
  program: Program;
}

export default function ProgramDetail({ program }: ProgramDetailProps) {
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="relative w-full h-[400px] mb-8">
        {program.featuredImage && (
          <Image 
            src={typeof program.featuredImage === 'string' 
              ? program.featuredImage 
              : program.featuredImage.url} 
            alt={program.title} 
            fill 
            className="object-cover rounded-lg" 
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-end">
          <div className="p-8">
            {program.isFeatured && (
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
                Featured Program
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{program.title}</h1>
            {program.summary && (
              <p className="text-white/80 text-lg">{program.summary}</p>
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
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              {program.content && (
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: program.content }} 
                />
              )}
              
              {program.keyFeatures && program.keyFeatures.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{typeof feature === 'string' ? feature : feature.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="curriculum">
              {program.curriculum ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: program.curriculum }} />
              ) : (
                <p>Curriculum details will be available soon.</p>
              )}
            </TabsContent>
            
            <TabsContent value="outcomes">
              {program.learningOutcomes ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: program.learningOutcomes }} />
              ) : (
                <p>Learning outcomes will be available soon.</p>
              )}
            </TabsContent>
            
            <TabsContent value="testimonials">
              {program.testimonials && program.testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {program.testimonials.map((testimonial, index) => {
                    // Check if testimonial is a string or object
                    if (typeof testimonial === 'string') {
                      return (
                        <div key={index} className="bg-muted p-6 rounded-lg">
                          <p className="italic mb-4">"{testimonial}"</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={index} className="bg-muted p-6 rounded-lg">
                        <p className="italic mb-4">"{testimonial.quote || testimonial.text || ''}"</p>
                        <div className="flex items-center gap-3">
                          {testimonial.avatar && (
                            <Image 
                              src={typeof testimonial.avatar === 'string' 
                                ? testimonial.avatar 
                                : testimonial.avatar.url} 
                              alt={testimonial.name} 
                              width={48} 
                              height={48}
                              className="rounded-full" 
                            />
                          )}
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            {testimonial.title && (
                              <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No testimonials available yet.</p>
              )}
            </TabsContent>
            
            <TabsContent value="faq">
              {program.faqs && program.faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {program.faqs.map((faq, index) => {
                    // Check if FAQ is string or object
                    if (typeof faq === 'string') {
                      return (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>FAQ #{index + 1}</AccordionTrigger>
                          <AccordionContent>
                            <div dangerouslySetInnerHTML={{ __html: faq }} />
                          </AccordionContent>
                        </AccordionItem>
                      );
                    }
                    
                    return (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <p>No FAQs available yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="bg-muted p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold mb-4">Program Information</h2>
            
            {program.programFees && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Program Fees
                </h3>
                <div className="space-y-2">
                  {program.programFees.memberFee && (
                    <p><span className="font-medium">Member:</span> ₹{program.programFees.memberFee}</p>
                  )}
                  {program.programFees.nonMemberFee && (
                    <p><span className="font-medium">Non-Member:</span> ₹{program.programFees.nonMemberFee}</p>
                  )}
                  {program.programFees.scholarshipInfo && (
                    <p className="text-sm text-muted-foreground">{program.programFees.scholarshipInfo}</p>
                  )}
                </div>
              </div>
            )}
            
            {program.eligibility && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Eligibility
                </h3>
                <div dangerouslySetInnerHTML={{ __html: program.eligibility }} />
              </div>
            )}
            
            {program.certification && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certification
                </h3>
                <div dangerouslySetInnerHTML={{ __html: program.certification }} />
              </div>
            )}

            {program.upcomingBatches && program.upcomingBatches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Upcoming Batches</h3>
                <div className="space-y-4">
                  {program.upcomingBatches.map((batch, index) => {
                    // Check if batch is string or object
                    if (typeof batch === 'string') {
                      return (
                        <div key={index} className="border border-border rounded-md p-4">
                          <p>{batch}</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={index} className="border border-border rounded-md p-4">
                        <h4 className="font-medium">{batch.name || batch.batchName}</h4>
                        
                        <div className="text-sm space-y-2 mt-2">
                          <div className="flex gap-2 items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatDate(batch.startDate)} {batch.endDate ? `- ${formatDate(batch.endDate)}` : ''}
                            </span>
                          </div>
                          
                          {batch.application && (
                            <div className="flex gap-2 items-center">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Application deadline: {formatDate(batch.application)}</span>
                            </div>
                          )}
                          
                          {batch.capacity && (
                            <div className="mt-2">
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {batch.capacity} seats available
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <Button className="w-full">Apply Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 