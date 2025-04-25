'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

// Define testimonials interface
interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  image?: {
    url: string;
  };
}

// Membership categories
const membershipCategories = [
  {
    id: 'student',
    title: 'Student Membership',
    description: 'For students looking to engage in training programs and internships.',
    icon: '/images/icons/student.svg',
    fee: '₹1,500/year',
    benefits: [
      'Access to beginner training programs',
      'Language learning resources',
      'Networking events',
      'Internship opportunities'
    ]
  },
  {
    id: 'professional',
    title: 'Professional Membership',
    description: 'For working professionals seeking skill development and networking opportunities.',
    icon: '/images/icons/professional.svg',
    fee: '₹3,500/year',
    benefits: [
      'Advanced training programs',
      'Industry-specific workshops',
      'Business networking',
      'Member portal access'
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate Membership',
    description: 'For companies interested in collaborating with ASA Kerala and utilizing NKC\'s resources.',
    icon: '/images/icons/corporate.svg',
    fee: '₹15,000/year',
    benefits: [
      'Multiple employee access',
      'Facility booking discounts',
      'Corporate training programs',
      'Business matchmaking services'
    ]
  },
  {
    id: 'honorary',
    title: 'Honorary Membership',
    description: 'By invitation, for distinguished individuals who have significantly contributed to Indo-Japan relations.',
    icon: '/images/icons/honorary.svg',
    fee: 'By invitation only',
    benefits: [
      'Lifetime membership',
      'Special recognition at events',
      'Advisory board privileges',
      'VIP access to all programs'
    ]
  }
];

// Application steps
const applicationSteps = [
  {
    id: 1,
    title: 'Fill Out the Membership Form',
    description: 'Complete the online application form with your details.',
    icon: '/images/icons/form.svg'
  },
  {
    id: 2,
    title: 'Submit Required Documents',
    description: 'Provide relevant documents such as educational qualifications or professional credentials.',
    icon: '/images/icons/document.svg'
  },
  {
    id: 3,
    title: 'Review & Approval',
    description: 'The ASA Kerala membership committee reviews applications and approves eligible candidates.',
    icon: '/images/icons/approval.svg'
  },
  {
    id: 4,
    title: 'Payment of Membership Fee',
    description: 'Make the necessary payment as per your membership category.',
    icon: '/images/icons/payment.svg'
  },
  {
    id: 5,
    title: 'Welcome to ASA Kerala!',
    description: 'Once approved, you will receive your membership ID and access credentials to our members\' portal.',
    icon: '/images/icons/welcome.svg'
  }
];

export default function JoinUsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Fetch testimonials that are published or featured
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
          params: {
            where: {
              status: {
                in: ['published', 'featured']
              }
            },
            sort: 'order',
            limit: 4
          }
        });
        
        setTestimonials(response.data.docs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fallback testimonials in case of API failure
  const fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Ramesh Nair',
      title: 'Senior Engineer',
      quote: 'Joining ASA Kerala was one of the best decisions of my career. The training I received in Japan completely changed my perspective on quality and efficiency. I have been able to implement Kaizen techniques at my workplace, and it has had a significant impact.'
    },
    {
      id: '2',
      name: 'Anju Menon',
      title: 'Entrepreneur',
      quote: 'ASA Kerala opened up opportunities for me to connect with like-minded professionals. The business networking sessions have been invaluable, and I even found my first business partner through an ASAK event!'
    }
  ];

  // Use fallback testimonials if API fails or returns empty results
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Join ASA Kerala</h1>
            <p className="text-xl">
              Become part of a vibrant community connecting Kerala and Japan through cultural exchange, 
              professional development, and business opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-3xl font-bold mb-8">Why Join ASA Kerala?</h2>
            <p className="text-lg text-zinc-700 mb-10">
              Becoming a member of ASA Kerala connects you to a vast network of professionals, entrepreneurs, 
              and students who share an interest in Japanese management practices, industrial expertise, 
              and cultural exchange. As a member, you gain access to exclusive training programs, 
              business networking opportunities, and participation in international collaborations.
            </p>
            
            {/* Background image with text overlay */}
            <div className="relative h-96 rounded-lg overflow-hidden mb-10">
              <div className="absolute inset-0 bg-zinc-800">
                {/* In a real implementation, use actual image */}
                <div className="h-full w-full flex items-center justify-center bg-zinc-300">
                  <span className="text-zinc-600">Network Image</span>
                </div>
                {/* Uncomment when image is available */}
                {/* <Image
                  src="/images/join-us/network-image.jpg"
                  alt="ASA Kerala Network"
                  fill
                  className="object-cover opacity-70"
                /> */}
              </div>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full md:w-1/2 p-8 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent">
                  <h3 className="text-2xl font-bold text-white mb-4">A Global Community</h3>
                  <p className="text-zinc-100">
                    ASA Kerala serves as a bridge between Kerala and Japan, fostering cultural 
                    understanding, knowledge transfer, and business opportunities that benefit both regions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Benefits Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Membership Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-hinomaru-red mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-bold mb-3">Exclusive Access to Training Programs</h3>
              <p className="text-zinc-700">
                Participate in AOTS-sponsored training programs in Japan and local skill enhancement workshops.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-hinomaru-red mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-bold mb-3">Networking Opportunities</h3>
              <p className="text-zinc-700">
                Connect with industry experts, business leaders, and professionals who have undergone training in Japan.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-hinomaru-red mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-bold mb-3">Business & Start-up Support</h3>
              <p className="text-zinc-700">
                Access dedicated startup spaces, mentorship programs, and collaborative projects.
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-hinomaru-red mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-bold mb-3">Participation in Cultural & Professional Events</h3>
              <p className="text-zinc-700">
                Attend Indo-Japan cultural events, networking meetups, and business summits.
              </p>
            </div>
            
            {/* Benefit 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-hinomaru-red mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-bold mb-3">Member-only Content & Resources</h3>
              <p className="text-zinc-700">
                Gain access to industry reports, recorded sessions, and training materials through our members' portal.
              </p>
            </div>
            
            {/* Benefit 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-hinomaru-red mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-bold mb-3">Discounted Event & Facility Access</h3>
              <p className="text-zinc-700">
                Avail discounts on event participation and facility bookings at Nippon Kerala Centre.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Membership Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Membership Categories</h2>
          <p className="text-zinc-700 max-w-3xl mx-auto text-center mb-12">
            ASA Kerala offers multiple membership categories tailored to different individuals and organizations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {membershipCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-zinc-50 rounded-lg overflow-hidden shadow-md border border-zinc-100 hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="mr-4 bg-zinc-200 rounded-full p-3 flex-shrink-0">
                      {/* Will be replaced with actual icons in implementation */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl text-black font-bold mb-1">{category.title}</h3>
                      <p className="text-sm text-zinc-500 mb-2">{category.description}</p>
                      <div className="inline-block px-3 py-1 bg-hinomaru-red text-white text-sm font-medium rounded-full">
                        {category.fee}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold uppercase text-zinc-500 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {category.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hinomaru-red mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-zinc-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Application Process</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 transform -translate-x-1/2"></div>
              
              {applicationSteps.map((step, index) => (
                <div key={step.id} className="relative mb-12 last:mb-0">
                  <div className="md:flex items-center">
                    {/* Step Number Marker */}
                    <div className="flex md:block justify-center">
                      <div className="w-12 h-12 bg-hinomaru-red text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md z-10 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                        {step.id}
                      </div>
                    </div>
                    
                    {/* Content Box - Alternate Left/Right */}
                    <div className={`mt-4 md:mt-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:mr-auto' : 'md:pl-12 md:ml-auto'}`}>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-2 text-hinomaru-red">{step.title}</h3>
                        <p className="text-zinc-700">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/membership/join" className="btn-primary inline-block">
              Apply for Membership
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Testimonials</h2>
          <p className="text-zinc-700 max-w-3xl mx-auto text-center mb-12">
            Hear from our members about how ASA Kerala has helped them grow professionally and culturally.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hinomaru-red"></div>
            </div>
          ) : error ? (
            <div className="text-center text-zinc-600 py-8">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-zinc-50 rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-200 relative overflow-hidden mr-4 flex-shrink-0">
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image.url}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-zinc-400 text-xs">
                          Photo
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-zinc-500">{testimonial.title}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <svg className="absolute -top-4 -left-2 w-10 h-10 text-zinc-200 transform -scale-x-100" 
                      fill="currentColor" viewBox="0 0 32 32">
                      <path d="M10 8c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S15.5 8 10 8zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm12-18c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S27.5 8 22 8zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
                    </svg>
                    <p className="text-zinc-700 italic pl-6">{testimonial.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hinomaru-red text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join ASA Kerala?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Take the first step towards becoming part of our vibrant community and 
            gain access to exclusive benefits and opportunities.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              href="/membership/join" 
              className="py-3 px-8 bg-white text-hinomaru-red font-bold rounded-md hover:bg-zinc-100 transition"
            >
              Apply Now
            </Link>
            <Link 
              href="/contact" 
              className="py-3 px-8 border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 