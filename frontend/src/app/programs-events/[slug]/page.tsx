'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

// This would be fetched from an API in a real implementation
const getProgram = (slug: string) => {
  // This is just a mock function to simulate API data
  // In a real app, you would fetch this data from your backend
  
  const programs = {
    'management-training-japan': {
      id: 1,
      name: 'Management Training in Japan',
      description: 'Leadership and strategic planning for professionals.',
      fullDescription: `
        <p>The Management Training in Japan program offers a unique opportunity for professionals to enhance their leadership and strategic planning skills through immersive learning experiences in Japanese corporate environments.</p>
        
        <p>This comprehensive program includes:</p>
        <ul>
          <li>Visits to leading Japanese companies</li>
          <li>Workshops on Japanese management principles</li>
          <li>Strategic planning and decision-making training</li>
          <li>Leadership development modules</li>
          <li>Networking opportunities with Japanese executives</li>
        </ul>
        
        <p>Participants will gain valuable insights into Japanese business culture, management methodologies, and industry best practices that can be applied in their own professional contexts.</p>
      `,
      duration: '2 weeks',
      location: 'Tokyo, Japan',
      cost: '₹250,000 (inclusive of training, accommodation, and local transportation)',
      eligibility: 'Mid to senior-level managers with at least 5 years of experience',
      dates: [
        { start: 'May 15, 2024', end: 'May 29, 2024' },
        { start: 'October 10, 2024', end: 'October 24, 2024' }
      ],
      contactPerson: 'Dr. Rajesh Kumar, Program Coordinator',
      contactEmail: 'management-training@asakeralaindia.org',
      flyer: '/assets/flyers/management-training.pdf',
      imageUrl: '/assets/images/management-training.jpg'
    },
    'technical-training-japanese-industries': {
      id: 2,
      name: 'Technical Training in Japanese Industries',
      description: 'Hands-on experience in Japanese industrial techniques.',
      fullDescription: `
        <p>The Technical Training in Japanese Industries program provides participants with hands-on experience in advanced Japanese industrial techniques and methodologies.</p>
        
        <p>This specialized program covers:</p>
        <ul>
          <li>Production management systems</li>
          <li>Quality control methodologies</li>
          <li>Automation and Industry 4.0 practices</li>
          <li>Energy efficiency and sustainable manufacturing</li>
          <li>Safety and standardization procedures</li>
        </ul>
        
        <p>Participants will receive training at selected Japanese manufacturing facilities, gaining practical knowledge that can be implemented in their own organizations to improve efficiency, quality, and productivity.</p>
      `,
      duration: '3 weeks',
      location: 'Osaka and Nagoya, Japan',
      cost: '₹300,000 (inclusive of training, accommodation, and local transportation)',
      eligibility: 'Engineers, technical managers, and production specialists with relevant experience',
      dates: [
        { start: 'June 5, 2024', end: 'June 26, 2024' },
        { start: 'November 8, 2024', end: 'November 29, 2024' }
      ],
      contactPerson: 'Mrs. Anita Menon, Technical Program Coordinator',
      contactEmail: 'technical-training@asakeralaindia.org',
      flyer: '/assets/flyers/technical-training.pdf',
      imageUrl: '/assets/images/technical-training.jpg'
    }
  };

  // Add other programs as needed
  
  return programs[slug as keyof typeof programs] || null;
};

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      // Get the program data
      const programData = getProgram(params.slug as string);
      
      if (programData) {
        setProgram(programData);
      } else {
        // Redirect to 404 or programs page if program not found
        router.push('/programs-events');
      }
      
      setIsLoading(false);
    }
  }, [params.slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-800 mb-4">Program Not Found</h1>
        <p className="text-zinc-600 mb-6">The program you are looking for does not exist or has been removed.</p>
        <Link href="/programs-events" className="btn-primary">
          View All Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Program Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Link href="/programs-events" className="text-zinc-50 hover:text-zinc-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Programs
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{program.name}</h1>
            <p className="text-xl">{program.description}</p>
          </div>
        </div>
      </section>

      {/* Program Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Program Details (Left Column) */}
            <div className="lg:col-span-2">
              <div className="japan-card p-8 mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Program Overview</h2>
                <div className="prose prose-lg max-w-none text-zinc-800" dangerouslySetInnerHTML={{ __html: program.fullDescription }}></div>
              </div>

              {/* Program Dates */}
              <div className="japan-card p-8 mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Upcoming Batches</h2>
                <div className="space-y-4">
                  {program.dates.map((date: any, index: number) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-zinc-200 rounded-md bg-zinc-50">
                      <div className="flex items-center mb-2 md:mb-0">
                        <svg className="w-5 h-5 text-hinomaru-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-zinc-900">
                          {date.start} to {date.end}
                        </span>
                      </div>
                      <Link 
                        href={`/programs-events/${params.slug}/register?batch=${index}`} 
                        className="btn-primary text-center md:text-left"
                      >
                        Register
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials - Could be added here */}
            </div>

            {/* Program Meta Information (Right Column) */}
            <div className="lg:col-span-1">
              {/* Program Image */}
              {program.imageUrl && (
                <div className="mb-8 rounded-washi overflow-hidden shadow-md">
                  <Image 
                    src={program.imageUrl} 
                    alt={program.name}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Program Quick Info */}
              <div className="japan-card p-6 mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Program Details</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <span className="text-hinomaru-red mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <div>
                      <span className="block text-sm text-zinc-600">Duration</span>
                      <span className="block text-zinc-900">{program.duration}</span>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-hinomaru-red mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </span>
                    <div>
                      <span className="block text-sm text-zinc-600">Location</span>
                      <span className="block text-zinc-900">{program.location}</span>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-hinomaru-red mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </span>
                    <div>
                      <span className="block text-sm text-zinc-600">Program Fee</span>
                      <span className="block text-zinc-900">{program.cost}</span>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="text-hinomaru-red mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </span>
                    <div>
                      <span className="block text-sm text-zinc-600">Eligibility</span>
                      <span className="block text-zinc-900">{program.eligibility}</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Download Flyer & Apply */}
              <div className="space-y-4">
                <a 
                  href={program.flyer} 
                  className="w-full btn-outline flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Program Flyer
                </a>
                <Link 
                  href={`/programs-events/${params.slug}/register`} 
                  className="w-full btn-primary flex items-center justify-center"
                >
                  Register for this Program
                </Link>
              </div>

              {/* Contact Information */}
              <div className="japan-card p-6 mt-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Contact Information</h3>
                <p className="text-zinc-800 mb-2">{program.contactPerson}</p>
                <a href={`mailto:${program.contactEmail}`} className="text-hinomaru-red hover:text-sakura-700">
                  {program.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs - Could be added here */}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Other Programs?</h2>
            <p className="text-lg mb-8">
              Discover more training opportunities, language courses, and cultural exchange programs available through ASA Kerala.
            </p>
            <Link href="/programs-events" className="btn-white">
              Explore All Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 