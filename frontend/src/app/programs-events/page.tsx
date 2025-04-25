'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { events as eventsApi } from '@/lib/api';
import { SafeImage } from '@/components/common';

// Define types for our data
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category?: string;
  programCategory?: string;
  categories?: Array<{ id: string; name: string }>;
  startDate: string;
  endDate?: string;
  location?: {
    name?: string;
    city?: string;
    isVirtual: boolean;
    virtualLink?: string;
  };
  featuredImage?: {
    url: string;
    alt?: string;
  };
}

// Define program categories that match with the ones in the backend
const PROGRAM_CATEGORIES = {
  TRAINING: 'training-programs',
  LANGUAGE: 'language-training',
  INTERNSHIPS: 'internships',
  SKILL_DEVELOPMENT: 'skill-development',
  CULTURAL: 'cultural-activities'
};

// Category labels for display and matching purposes
const CATEGORY_LABELS: Record<string, string> = {
  'training-programs': 'Training Programs',
  'language-training': 'Language Training',
  'internships': 'Internships',
  'skill-development': 'Skill Development',
  'cultural-activities': 'Cultural Activities'
};

export default function ProgramsEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all programs/events
        const eventsResponse = await eventsApi.getAll({
          limit: 100,
          where: {
            status: {
              equals: 'published'
            }
          }
        });
        
        setEvents(eventsResponse.data.docs || []);
      } catch (err) {
        console.error('Error fetching events data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to filter programs by category - now returns Events filtered by programCategory
  const getProgramsByCategory = (category: string): Event[] => {
    // Since we're now using Events collection for everything, just filter events by category
    return events.filter(event => {
      // Check if the event matches the specified program category
      return event.programCategory === category;
    });
  };

  // Helper function to filter events by category
  const getEventsByCategory = (category: string): Event[] => {
    return events.filter(event => {
      // Match by the programCategory field (primary category)
      const matchesProgramCategory = event.programCategory === category;
      
      // Or check in the categories array (for additional categories)
      const hasCategory = event.categories?.some(cat => {
        const categoryLabel = CATEGORY_LABELS[category];
        return categoryLabel && cat.name?.toLowerCase() === categoryLabel.toLowerCase();
      });
      
      return matchesProgramCategory || hasCategory;
    });
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Programs & Events</h1>
            <p className="text-xl mb-8">
              Upcoming Activities – Learn, Engage, and Grow!
            </p>
            <p className="text-lg mb-10">
              Discover our latest training programs, internships, language courses, and cultural events. 
              Stay ahead with new learning opportunities and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="#activities"
                className="btn-white"
              >
                View All Activities
              </Link>
              <Link
                href="/contact"
                className="btn-outline-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
      {/* Training Programs Section */}
      <section id="training-programs" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Training Programs</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala facilitates various training programs in collaboration with AOTS Japan. 
            These programs focus on developing management skills, enhancing technical expertise, 
                and fostering international networking among professionals.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {getProgramsByCategory(PROGRAM_CATEGORIES.TRAINING).map(program => (
                  <div key={program.id} className="japan-card transition-transform duration-300 hover:-translate-y-2">
                    {program.featuredImage && (
                      <div className="mb-4 h-40 relative overflow-hidden rounded-washi">
                        <SafeImage 
                          src={program.featuredImage.url} 
                          alt={program.title} 
                          fill 
                          className="object-cover"
                          fallbackSrc={program.featuredImage.url}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{program.title}</h3>
                    <p className="text-zen-700 mb-4">{program.summary}</p>
                    <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                  </div>
                ))}

                {/* Show message if no programs are available */}
                {getProgramsByCategory(PROGRAM_CATEGORIES.TRAINING).length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-zinc-500">No training programs available at the moment.</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Link href={`/programs-events/category/${PROGRAM_CATEGORIES.TRAINING}`} className="btn-primary">
                  View More Training Programs
                </Link>
          </div>
        </div>
      </section>

      {/* Language Training Section */}
          <section id="language-training" className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title mb-8">Language Training</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala offers structured Japanese language courses to help professionals, 
                students, and enthusiasts gain proficiency in the language. These programs prepare 
                individuals for the Japanese Language Proficiency Test (JLPT) and enhance communication skills.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {getProgramsByCategory(PROGRAM_CATEGORIES.LANGUAGE).map(program => (
                  <div key={program.id} className="japan-card transition-transform duration-300 hover:-translate-y-2">
                    {program.featuredImage && (
                      <div className="mb-4 h-40 relative overflow-hidden rounded-washi">
                        <SafeImage 
                          src={program.featuredImage.url} 
                          alt={program.title} 
                          fill 
                          className="object-cover"
                          fallbackSrc={program.featuredImage.url}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{program.title}</h3>
                    <p className="text-zen-700 mb-4">{program.summary}</p>
                    <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                  </div>
                ))}

                {/* Show message if no programs are available */}
                {getProgramsByCategory(PROGRAM_CATEGORIES.LANGUAGE).length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-zinc-500">No language training programs available at the moment.</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Link href={`/programs-events/category/${PROGRAM_CATEGORIES.LANGUAGE}`} className="btn-primary">
                  View More Language Programs
                </Link>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section id="internships" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Internships</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala provides internship opportunities that allow participants to gain 
                firsthand experience in Japanese and Indian industries. These internships bridge the cultural 
                and professional gap while equipping participants with necessary global skills.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {getProgramsByCategory(PROGRAM_CATEGORIES.INTERNSHIPS).map(program => (
                  <div key={program.id} className="japan-card transition-transform duration-300 hover:-translate-y-2">
                    {program.featuredImage && (
                      <div className="mb-4 h-40 relative overflow-hidden rounded-washi">
                        <SafeImage 
                          src={program.featuredImage.url} 
                          alt={program.title} 
                          fill 
                          className="object-cover"
                          fallbackSrc={program.featuredImage.url}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{program.title}</h3>
                    <p className="text-zen-700 mb-4">{program.summary}</p>
                    <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                  </div>
                ))}

                {/* Show message if no programs are available */}
                {getProgramsByCategory(PROGRAM_CATEGORIES.INTERNSHIPS).length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-zinc-500">No internship programs available at the moment.</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Link href={`/programs-events/category/${PROGRAM_CATEGORIES.INTERNSHIPS}`} className="btn-primary">
                  View More Internship Programs
                </Link>
          </div>
        </div>
      </section>

      {/* Skill Development Section */}
          <section id="skill-development" className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title mb-8">Skill Development</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala conducts various skill enhancement programs tailored to the needs of 
                professionals and students. These initiatives provide training in emerging 
                technologies and improve efficiency using Japanese methodologies.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {getProgramsByCategory(PROGRAM_CATEGORIES.SKILL_DEVELOPMENT).map(program => (
                  <div key={program.id} className="japan-card transition-transform duration-300 hover:-translate-y-2">
                    {program.featuredImage && (
                      <div className="mb-4 h-40 relative overflow-hidden rounded-washi">
                        <SafeImage 
                          src={program.featuredImage.url} 
                          alt={program.title} 
                          fill 
                          className="object-cover"
                          fallbackSrc={program.featuredImage.url}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{program.title}</h3>
                    <p className="text-zen-700 mb-4">{program.summary}</p>
                    <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                  </div>
                ))}

                {/* Show message if no programs are available */}
                {getProgramsByCategory(PROGRAM_CATEGORIES.SKILL_DEVELOPMENT).length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-zinc-500">No skill development programs available at the moment.</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Link href={`/programs-events/category/${PROGRAM_CATEGORIES.SKILL_DEVELOPMENT}`} className="btn-primary">
                  View More Skill Development Programs
                </Link>
          </div>
        </div>
      </section>

      {/* Cultural Activities Section */}
      <section id="cultural-activities" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Cultural Activities</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            Cultural exchange programs play a crucial role in ASA Kerala's initiatives, 
            promoting a deeper understanding and appreciation of Japanese traditions, customs, 
                and societal values. These activities encourage mutual respect between communities.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {getProgramsByCategory(PROGRAM_CATEGORIES.CULTURAL).map(program => (
                  <div key={program.id} className="japan-card transition-transform duration-300 hover:-translate-y-2">
                    {program.featuredImage && (
                      <div className="mb-4 h-40 relative overflow-hidden rounded-washi">
                        <SafeImage 
                          src={program.featuredImage.url} 
                          alt={program.title} 
                          fill 
                          className="object-cover"
                          fallbackSrc={program.featuredImage.url}
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{program.title}</h3>
                    <p className="text-zen-700 mb-4">{program.summary}</p>
                    <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                  </div>
                ))}

                {/* Show message if no programs are available */}
                {getProgramsByCategory(PROGRAM_CATEGORIES.CULTURAL).length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-zinc-500">No cultural activities available at the moment.</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Link href={`/programs-events/category/${PROGRAM_CATEGORIES.CULTURAL}`} className="btn-primary">
                  View More Cultural Activities
                </Link>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Skills?</h2>
            <p className="text-lg mb-8">
              Join our programs and be part of a global community of professionals who share a 
              passion for Japanese methodologies, culture, and business practices.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/membership/join"
                className="btn-white"
              >
                Become a Member
              </Link>
              <Link
                href="/contact"
                className="btn-outline-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 