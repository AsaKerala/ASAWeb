'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

// Mock data for the page
const mockNewsArticles = [
  {
    id: 1,
    slug: 'asa-announces-2024-scholarship-program',
    title: 'ASA Announces 2024 Scholarship Program for Japan Studies',
    summary: 'The Alumni Association has revealed its annual scholarship program aimed at Kerala students pursuing studies in Japan.',
    date: '2023-12-15',
    category: 'Education',
    image: '/images/news/scholarship.jpg',
    featured: true,
  },
  {
    id: 2,
    slug: 'successful-cultural-exchange-program',
    title: 'Successful Cultural Exchange Program with Tokyo University',
    summary: 'ASA Kerala members hosted a delegation from Tokyo University, fostering cultural understanding and academic collaboration.',
    date: '2023-11-28',
    category: 'Cultural Exchange',
    image: '/images/news/exchange-program.jpg',
    featured: true,
  },
  {
    id: 3,
    slug: 'japanese-language-proficiency-test-preparation',
    title: 'New Japanese Language Proficiency Test Preparation Course',
    summary: 'ASA Kerala introduces comprehensive JLPT preparation courses for all levels, taught by alumni who studied in Japan.',
    date: '2023-11-10',
    category: 'Language',
    image: '/images/news/language-course.jpg',
    featured: true,
  },
  {
    id: 4,
    slug: 'asa-partners-with-kerala-universities',
    title: 'ASA Partners with Kerala Universities for Japan Exchange Programs',
    summary: 'New partnerships established with leading Kerala academic institutions to advance Japan-Kerala educational exchanges.',
    date: '2023-10-25',
    category: 'Partnerships',
    image: '/images/news/university-partnership.jpg',
    featured: false,
  },
];

const mockUpcomingEvents = [
  {
    id: 1,
    slug: 'japan-kerala-business-summit',
    title: 'Japan-Kerala Business Summit 2024',
    date: '2024-03-15T09:00:00',
    location: 'International Convention Center, Kochi',
    category: 'Conference',
    image: '/images/events/business-summit.jpg',
  },
  {
    id: 2,
    slug: 'japanese-cultural-workshop',
    title: 'Japanese Cultural Immersion Workshop',
    date: '2024-04-10T13:30:00',
    location: 'ASA Cultural Center, Trivandrum',
    category: 'Workshop',
    image: '/images/events/cultural-workshop.jpg',
  },
  {
    id: 3,
    slug: 'youth-japan-program',
    title: 'Youth Japan Exposure Program',
    date: '2024-05-22T10:00:00',
    location: 'Various Educational Institutions, Kerala',
    category: 'Education',
    image: '/images/events/youth-program.jpg',
  },
];

const mockPastEvents = [
  {
    id: 1,
    slug: 'sakura-festival-kerala',
    title: 'Sakura Festival Kerala',
    date: '2023-09-05',
    category: 'Cultural',
    summary: 'A celebration of Japanese culture with food, performances, and activities for families.',
    image: '/images/events/sakura-festival.jpg',
  },
  {
    id: 2,
    slug: 'space-photography-exhibition',
    title: 'Space Photography Exhibition',
    date: '2023-08-18',
    category: 'Exhibition',
    summary: 'An exhibition featuring stunning photographs taken from ASA missions.',
    image: '/images/events/photography-exhibition.jpg',
  },
  {
    id: 3,
    slug: 'space-technology-conference',
    title: 'Space Technology Conference',
    date: '2023-07-22',
    category: 'Conference',
    summary: 'Annual conference showcasing the latest advancements in space technology.',
    image: '/images/events/tech-conference.jpg',
  },
  {
    id: 4,
    slug: 'astronaut-meet-greet',
    title: 'Astronaut Meet & Greet',
    date: '2023-06-10',
    category: 'Public Event',
    summary: 'Meet ASA astronauts and hear about their experiences in space.',
    image: '/images/events/astronaut-meet-greet.jpg',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-zinc-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('/images/news/news-hero-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="container-custom relative z-10">
          <h1 className="text-5xl font-bold mb-6">News & Events</h1>
          <p className="text-xl max-w-2xl">
            Stay informed with the latest updates, alumni stories, and upcoming cultural and networking events from the Japan Alumni Association of Kerala.
          </p>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Latest News</h2>
          
          {/* Featured News Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {mockNewsArticles.filter(article => article.featured).map((article) => (
              <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group">
                <Link href={`/news/${article.slug}`}>
                  <div className="relative h-52">
                    {/* In a real implementation, use actual images */}
                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                      <span className="text-zinc-500">News Image</span>
                    </div>
                    {/* Uncomment when actual images are available */}
                    {/* <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    /> */}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-hinomaru-red text-white rounded-full">
                        {article.category}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {format(new Date(article.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-hinomaru-red transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-zinc-700 mb-4">{article.summary}</p>
                    <div className="flex items-center text-hinomaru-red font-medium">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Latest News List */}
          <div className="bg-zinc-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">More News</h3>
            <div className="divide-y divide-zinc-200">
              {mockNewsArticles.filter(article => !article.featured).map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="py-4 flex items-center justify-between group">
                  <div>
                    <h4 className="font-medium group-hover:text-hinomaru-red transition-colors">{article.title}</h4>
                    <div className="flex items-center mt-1">
                      <span className="inline-block px-2 py-0.5 text-xs bg-zinc-200 rounded mr-3">
                        {article.category}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {format(new Date(article.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 group-hover:text-hinomaru-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            {/* View All News Button */}
            <div className="mt-6 text-center">
              <Link href="/news/archive" className="btn-outline inline-block">
                View All News
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-zinc-100">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Upcoming Events</h2>
          <p className="text-zinc-700 max-w-3xl mx-auto text-center mb-10">
            Stay updated with our latest programs, workshops, and networking opportunities.
          </p>
          
          {/* Events List */}
          <div className="max-w-4xl mx-auto">
            {mockUpcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/4 relative">
                    {/* In a real implementation, use actual images */}
                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center md:border-r border-zinc-100">
                      <span className="text-zinc-500">Event Image</span>
                    </div>
                    {/* Uncomment when actual images are available */}
                    {/* <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    /> */}
                    <div className="pt-[75%] md:pt-0"></div> {/* Aspect ratio placeholder for mobile */}
                  </div>
                  <div className="p-6 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-hinomaru-red text-white rounded-full">
                          {event.category}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">{event.title}</h3>
                      <div className="flex items-center text-zinc-700 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hinomaru-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600">
                        {format(new Date(event.date), 'h:mm a')}
                      </span>
                      <Link
                        href={`/programs-events/${event.slug}`}
                        className="flex items-center font-medium text-hinomaru-red hover:text-hinomaru-bright transition-colors"
                      >
                        Event Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-8">
            <Link href="/programs-events" className="btn-primary inline-block">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Past Events Section - Image Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title text-3xl font-bold mb-12">Past Events</h2>
          <p className="text-zinc-700 max-w-3xl mx-auto text-center mb-12">
            A showcase of our previously conducted cultural exchanges, workshops, and networking programs connecting Kerala and Japan.
          </p>
          
          {/* Past Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockPastEvents.map((event) => (
              <div key={event.id} className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition group">
                <Link href={`/programs-events/${event.slug}`}>
                  <div className="relative h-48">
                    {/* In a real implementation, use actual images */}
                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                      <span className="text-zinc-500">Event Image</span>
                    </div>
                    {/* Uncomment when actual images are available */}
                    {/* <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    /> */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-zinc-900 to-transparent">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-hinomaru-red text-white rounded">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-zinc-900 font-medium mb-1 group-hover:text-hinomaru-red transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-2">
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-zinc-700 line-clamp-2">{event.summary}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-10">
            <Link href="/programs-events#past-events" className="btn-outline inline-block">
              View All Past Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 