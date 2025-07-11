'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { events as eventsApi, programs as programsApi, galleryApi } from '@/lib/api';
import { SafeImage } from '@/components/common';
import { Badge } from '@/components/ui/badge';

// Define types for our data
interface Event {
  id: string;
  title: string;
  slug: string;
  summary: string;
  keyFeatures?: {
    customLocation?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    isVirtual?: boolean;
    virtualLink?: string;
    eventDate?: string;
    startDate?: string;
    endDate?: string;
  };
  // Legacy fields for backward compatibility
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
  };
}

interface Program {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  featuredImage?: {
    url: string;
    alt?: string;
  } | string;
  filterCategory?: string;
}

interface GalleryImage {
  id: string;
  title: string;
  image: {
    url: string;
    alt?: string;
  };
  caption?: string;
  category: string;
  featured: boolean;
}

// Define hardcoded featured programs
const hardcodedPrograms = [
  {
    id: '1',
    title: 'Training Programs in Japan',
    summary: 'Learn about the latest industrial and management techniques from top Japanese experts.',
    category: 'Training',
    slug: 'training-japan',
    filterCategory: 'training-japan'
  },
  {
    id: '2',
    title: 'Internships & Employment',
    summary: 'Access internship opportunities and job placements in Japanese companies in India and abroad.',
    category: 'Internship',
    slug: 'internships',
    filterCategory: 'internships'
  },
  {
    id: '3',
    title: 'Japanese Language Training',
    summary: 'Learn Japanese language with our certified instructors and enhance your career prospects.',
    category: 'Language',
    slug: 'language-training',
    filterCategory: 'language-training'
  },
  {
    id: '4',
    title: 'Skill Development',
    summary: 'Upgrade your skills with specialized courses focused on Japanese management and technical expertise.',
    category: 'Networking',
    slug: 'skill-development',
    filterCategory: 'skill-development'
  },
  {
    id: '5',
    title: 'Business Networking',
    summary: 'Connect with Japanese businesses and professionals through our extensive network and events.',
    category: 'Networking',
    slug: 'training-japan',
    filterCategory: 'training-japan'
  },
  {
    id: '6',
    title: 'Cultural Exchange',
    summary: 'Participate in cultural exchange activities to deepen understanding between India and Japan.',
    category: 'Networking',
    slug: 'training-japan',
    filterCategory: 'training-japan'
  }
];

// Sample carousel images as fallback
const sampleCarouselImages = [
  {
    id: '1',
    title: 'Welcome to ASA Kerala',
    image: {
      url: '/assets/facilities/nkc-exterior-1.jpg',
      alt: 'ASA Kerala Welcome',
    },
    caption: 'Fostering Indo-Japanese relations through knowledge and cultural exchange',
    category: 'exterior',
    featured: true,
  },
  {
    id: '2',
    title: 'Building Professional Networks',
    image: {
      url: '/assets/facilities/golden-jubilee-hall.jpg',
      alt: 'Professional Networking',
    },
    caption: 'Connect with professionals who share an interest in Japanese management practices',
    category: 'training',
    featured: true,
  },
  {
    id: '3',
    title: 'Cultural Exchange',
    image: {
      url: '/assets/facilities/twin-room-suite.jpg',
      alt: 'Cultural Exchange',
    },
    caption: 'Experience the best of Japanese and Indian cultural collaborations',
    category: 'rooms',
    featured: true,
  },
  {
    id: '4',
    title: 'Knowledge Transfer',
    image: {
      url: '/assets/facilities/zen-garden.jpg',
      alt: 'Knowledge Transfer',
    },
    caption: 'Learn and implement Japanese industrial knowledge and management techniques',
    category: 'japanese',
    featured: true,
  },
];

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselImages, setCarouselImages] = useState<GalleryImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollEvents, setScrollEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current date for filtering
        const today = new Date().toISOString();
        
        // Fetch upcoming events - using the eventDate field under keyFeatures
        const eventsResponse = await eventsApi.getAll({ 
          limit: 10, // Get more than needed so we can filter and use for scrolling banner
          where: {
            status: {
              equals: 'published'
            },
            // Use keyFeatures.eventDate for filtering
            'keyFeatures.eventDate': {
              greater_than_equal: today
            }
          }
        });
        
        let fetchedEvents = eventsResponse.data.docs || [];
        
        
        // Sort events by date using all available date fields
        fetchedEvents.sort((a: Event, b: Event) => {
          const dateA = a.keyFeatures?.eventDate || a.keyFeatures?.startDate || a.startDate || today;
          const dateB = b.keyFeatures?.eventDate || b.keyFeatures?.startDate || b.startDate || today;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        
        // Take just the first 3 events after sorting for the main display
        setUpcomingEvents(fetchedEvents.slice(0, 3));
        
        // Use up to 5 events for the scrolling banner
        setScrollEvents(fetchedEvents.slice(0, 5));

        // Fetch featured programs from API
        const programsResponse = await programsApi.getAll({
          where: {
            status: { equals: 'published' },
            isFeatured: { equals: true }
          },
          limit: 6,
          sort: '-createdAt'
        });
        
        let fetchedPrograms = programsResponse.data.docs || [];
        
        // Set featured programs (these will be displayed in the new featured section)
        if (fetchedPrograms.length > 0) {
          console.log('Using real featured programs:', fetchedPrograms.length);
          setFeaturedPrograms(fetchedPrograms);
        } else {
          console.log('No featured programs found');
          setFeaturedPrograms([]);
        }

        // Fetch hero carousel images
        const carouselResponse = await galleryApi.getHeroImages(4);
        const carouselDocs = carouselResponse.data?.docs || [];
        
        if (carouselDocs.length > 0) {
          console.log('Hero carousel images:', carouselDocs);
          
          // Map API response to the expected format
          const mappedImages = carouselDocs.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            image: {
              url: doc.url, // Direct URL from Cloudinary
              alt: doc.alt || doc.title
            },
            caption: doc.caption,
            category: doc.category,
            featured: doc.featured || false
          }));
          
          setCarouselImages(mappedImages);
        } else {
          console.warn('No hero carousel images found, using fallback images');
          // Fallback to sample images if no featured images available
          setCarouselImages(sampleCarouselImages);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load events. Please try again later.');
        setUpcomingEvents([]);
        setCarouselImages(sampleCarouselImages);
        // On error, set empty featured programs
        setFeaturedPrograms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Format date for display
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return { day: 'TBD', month: '', time: '' };
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const time = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' });
    
    return { day, month, time };
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollBar = document.getElementById('progress-bar');
      
      if (scrollBar) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / maxScroll) * 100;
        scrollBar.style.width = `${scrollPercent}%`;
        
        // Increase the scroll animation speed by reducing the transition duration
        scrollBar.style.transition = 'width 0.2s ease-out'; // Was likely 0.3s or higher
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Scrolling Events Banner */}
      {scrollEvents.length > 0 && (
        <div className="bg-hinomaru-red text-white py-2 overflow-hidden">
          <div className="flex whitespace-nowrap relative">
            <div className="animate-marquee inline-flex gap-8 whitespace-nowrap">
              {scrollEvents.map((event, index) => {
                const eventDateString = event.keyFeatures?.eventDate || 
                                        event.keyFeatures?.startDate || 
                                        event.eventDate || 
                                        event.startDate;
                const date = eventDateString ? new Date(eventDateString).toLocaleDateString() : 'TBD';
                
                return (
                  <Link key={index} href={`/events/${event.slug}`} className="inline-flex items-center hover:underline">
                    <span className="font-bold mr-2">NEW EVENT:</span>
                    <span>{event.title}</span>
                    <span className="mx-2">•</span>
                    <span>{date}</span>
                  </Link>
                );
              })}
            </div>
            {/* Duplicate banner content for seamless scrolling */}
            <div className="animate-marquee inline-flex gap-8 whitespace-nowrap absolute left-full">
              {scrollEvents.map((event, index) => {
                const eventDateString = event.keyFeatures?.eventDate || 
                                        event.keyFeatures?.startDate || 
                                        event.eventDate || 
                                        event.startDate;
                const date = eventDateString ? new Date(eventDateString).toLocaleDateString() : 'TBD';
                
                return (
                  <Link key={`dup-${index}`} href={`/events/${event.slug}`} className="inline-flex items-center hover:underline">
                    <span className="font-bold mr-2">NEW EVENT:</span>
                    <span>{event.title}</span>
                    <span className="mx-2">•</span>
                    <span>{date}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Section with Carousel */}
      <section id="banner" className="relative h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div 
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {image.image?.url ? (
              <Image
                src={image.image.url}
                alt={image.image?.alt || image.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized={true}
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-300 text-xl">{image.image?.alt || image.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container-custom text-center text-white max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
              Welcome to ASA Kerala
            </h1>
            <p className="text-xl mb-10 drop-shadow-md">
              Explore training opportunities in Japan, business networking, and cultural exchange programs. 
              Be part of an esteemed alumni association fostering Indo-Japanese relations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#welcome"
                className="bg-white text-hinomaru-red border border-white hover:bg-gray-100 px-6 py-3 rounded-washi font-medium transition duration-300"
              >
                Learn More
              </Link>
              <Link
                href="/programs#training-programs"
                className="btn-secondary"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto">
            <div className="md:w-1/3 flex justify-center">
              <SafeImage 
                src="/assets/ASA-logo.png" 
                alt="ASA Kerala Logo" 
                width={200} 
                height={200} 
                className="object-contain"
                fallbackSrc="/assets/ASA-logo.png"
              />
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <h2 className="section-title">Welcome to ASA Kerala</h2>
              <div className="flex md:justify-start justify-center mb-8">
                <div className="w-20 h-1 bg-hinomaru-red"></div>
              </div>
              <p className="text-lg text-zen-700 leading-relaxed">
                ASA Kerala is the official alumni Association of AOTS Kerala, dedicated to fostering Indo-Japanese relations by sharing knowledge, skills, and experiences gained through AOTS training programs. Our organization serves as a hub for professionals, entrepreneurs, and students interested in Japanese management practices, industrial expertise, cultural exchange and in general, the Japanese way of life!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-zen-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-center">Mission Statement</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 leading-relaxed mb-6">
              Our mission is to:
            </p>
            <ul className="text-left text-lg text-zen-700 leading-relaxed space-y-4 max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Promote Japanese industrial knowledge and management techniques in Kerala.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Facilitate training programs, internships, and business opportunities between Japan and India.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Strengthen Indo-Japanese relationships through cultural and business collaborations.</span>
          </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Transfer learnings and best practices from Japan and India to the rest of the world, particularly other developing countries.</span>
          </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Programs Section (General Types) */}
      <section className="py-20 bg-zen-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Programs</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 max-w-2xl mx-auto">
              Explore our wide range of technical, management, and cultural programs designed to enhance your skills and understanding of Japanese methodologies.
            </p>
          </div>

          {/* Grid display for the general program types */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hardcodedPrograms.map((program) => (
              <div 
                key={program.id}
                className="featured-program-item group relative mb-8 transition-all duration-500 hover:scale-105"
              >
                {/* Mobile decorative element - left accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-hinomaru-red to-sakura-300 rounded-full"></div>
                
                <div className="bg-white rounded-washi shadow-lg p-6 pl-8 overflow-hidden border-t-4 border-hinomaru-red hover:shadow-xl transition-all duration-300">
                  <div className="relative z-10">
                    {/* Program category tag */}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sakura-100 text-hinomaru-red mb-3">
                      {program.category || 'Program'}
                    </span>
                    
                    {/* Icon background - decorative */}
                    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 w-24 h-24 rounded-full bg-sakura-50 opacity-20"></div>
                    
                    {/* Program icon */}
                    <div className="mb-4 text-hinomaru-red relative z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    {/* Program title */}
                    <h3 className="text-xl font-bold mb-3 text-zen-900 group-hover:text-hinomaru-red transition-colors duration-300">
                      {program.title}
                    </h3>
                    
                    {/* Program summary */}
                    <p className="text-zen-700 mb-4">
                      {program.summary}
                    </p>
                    
                    {/* Call to action */}
                    <Link 
                      href={program.filterCategory ? `/programs?category=${program.filterCategory}` : '/programs'}
                      className="group-hover:bg-hinomaru-red group-hover:text-white text-hinomaru-red border border-hinomaru-red font-medium rounded-washi py-2 px-4 inline-flex items-center transition-all duration-300"
                    >
                      Explore Programs
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Decorative shape */}
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-sakura-50 rounded-tl-xl transform rotate-45 opacity-50"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/programs" 
              className="btn-primary"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Programs Section (Individual Programs) */}
      {featuredPrograms.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="section-title text-center">Featured Programs</h2>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-1 bg-hinomaru-red"></div>
              </div>
              <p className="text-lg text-zen-700 max-w-2xl mx-auto">
                Discover our highlighted programs designed to provide exceptional learning experiences and career advancement opportunities.
              </p>
            </div>

            <div className="space-y-12">
              {featuredPrograms.map((program, index) => (
                <div 
                  key={program.id}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
                >
                  {/* Content Side */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <Badge className="mb-4 bg-hinomaru-red text-white">
                        Featured Program
                      </Badge>
                      <h3 className="text-3xl font-bold text-zen-900 mb-4">
                        {program.title}
                      </h3>
                      <p className="text-lg text-zen-700 leading-relaxed">
                        {program.summary || 'Discover this comprehensive program offered by ASA Kerala.'}
                      </p>
                    </div>

                    {/* Program highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {program.category && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sakura-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-zen-900">Category</p>
                            <p className="text-sm text-zen-600">{program.category}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sakura-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-zen-900">Status</p>
                          <p className="text-sm text-zen-600">Open for Applications</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/programs/${program.slug}`}
                        className="btn-primary inline-flex items-center justify-center"
                      >
                        Learn More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link
                        href={`/programs/${program.slug}#application`}
                        className="btn-secondary inline-flex items-center justify-center"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className="flex-1 max-w-lg">
                    <div className="relative h-80 rounded-washi overflow-hidden shadow-xl bg-gray-100">
                      <SafeImage
                        src={
                          typeof program.featuredImage === 'object' && program.featuredImage?.url 
                            ? program.featuredImage.url 
                            : typeof program.featuredImage === 'string' 
                              ? program.featuredImage
                              : '/assets/placeholder-image.jpg'
                        }
                        alt={program.title}
                        fill
                        className="object-contain"
                        fallbackSrc="/assets/placeholder-image.jpg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link 
                href="/programs" 
                className="btn-secondary"
              >
                Explore All Featured Programs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Upcoming Events</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 max-w-2xl mx-auto">
              Stay updated with the latest activities, training programs, business delegations, and networking opportunities. Some of our upcoming events include:
            </p>
          </div>

          {isLoading ? (
            // Loading state - only for events section
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
            </div>
          ) : error ? (
            // Error state - only for events section
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition duration-300"
              >
                Try Again
              </button>
            </div>
          ) : (
            // Display events when available
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => {
                // Get the event date from either keyFeatures or legacy fields
                const eventDateString = event.keyFeatures?.eventDate || 
                                        event.keyFeatures?.startDate || 
                                        event.eventDate || 
                                        event.startDate;
                const startDate = formatEventDate(eventDateString);
                
                return (
                  <div key={index} className="japan-card p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-hinomaru-red text-white px-4 py-2 rounded-washi text-center">
                        <span className="block text-2xl font-bold">{startDate.day}</span>
                        <span className="text-sm">{startDate.month}</span>
                      </div>
                      <span className="text-zen-600 text-sm">{startDate.time}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-zen-900">{event.title}</h3>
                    <p className="text-zen-700 mb-4">
                      {event.summary}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-zen-600 flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.keyFeatures?.customLocation ? event.keyFeatures.customLocation :
                          event.keyFeatures?.isVirtual || event.keyFeatures?.mode === 'online' ? 'Online' :
                          event.location?.isVirtual ? 'Online' :
                          event.location?.city || event.location?.name || 'TBD'}
                      </span>
                      <Link href={`/events/${event.slug}`} className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                        Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              }) : (
                // If no events are available, show message
                <>
                  <div className="japan-card bg-gray-50">
                    <p className="text-gray-400 text-center py-8">No upcoming events</p>
                  </div>
                  <div className="japan-card bg-gray-50">
                    <p className="text-gray-400 text-center py-8">No upcoming events</p>
                  </div>
                  <div className="japan-card bg-gray-50">
                    <p className="text-gray-400 text-center py-8">No upcoming events</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/events" 
              className="btn-primary"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white relative">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">About Our Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white text-opacity-90 text-lg">
            ASA Kerala is a distinguished alumni community of professionals who have received training in Japan through AOTS scholarships. We share our knowledge and experience to strengthen Indo-Japanese relations and promote cultural understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="bg-white text-hinomaru-red px-8 py-3 rounded-washi font-medium hover:bg-gray-100 transition duration-300"
            >
              Learn About ASA
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-washi font-medium hover:bg-white/10 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
