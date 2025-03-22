'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function FacilitiesPage() {
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'exterior', name: 'Exterior' },
    { id: 'rooms', name: 'Accommodation' },
    { id: 'training', name: 'Training Halls' },
    { id: 'japanese', name: 'Japanese Elements' },
    { id: 'facilities', name: 'Facilities' },
    { id: 'sustainability', name: 'Sustainability' },
  ];
  
  // Sample gallery images (in a real implementation, these would come from an API)
  const galleryImages = [
    {
      id: 1,
      src: '/assets/facilities/nkc-exterior-1.jpg',
      alt: 'NKC Main Building',
      category: 'exterior',
      caption: 'Nippon Kerala Centre - Main Building',
    },
    {
      id: 2,
      src: '/assets/facilities/nkc-exterior-2.jpg',
      alt: 'NKC Entrance',
      category: 'exterior',
      caption: 'Main Entrance with Torii Gate',
    },
    {
      id: 3,
      src: '/assets/facilities/torii-gate.jpg',
      alt: 'Traditional Red Torii Gate',
      category: 'japanese',
      caption: 'Traditional Japanese Torii Gate',
    },
    {
      id: 4,
      src: '/assets/facilities/zen-garden-1.jpg',
      alt: 'Japanese Zen Garden',
      category: 'japanese',
      caption: 'Japanese Zen Garden with Stone Arrangement',
    },
    {
      id: 5,
      src: '/assets/facilities/zen-garden-2.jpg',
      alt: 'Zen Garden Path',
      category: 'japanese',
      caption: 'Peaceful Walking Path in Zen Garden',
    },
    {
      id: 6,
      src: '/assets/facilities/auditorium-1.jpg',
      alt: 'Golden Jubilee Hall',
      category: 'training',
      caption: 'Golden Jubilee Hall (Auditorium) - Theatre Setup',
    },
    {
      id: 7,
      src: '/assets/facilities/auditorium-2.jpg',
      alt: 'Golden Jubilee Hall Stage',
      category: 'training',
      caption: 'Golden Jubilee Hall - Stage and Podium',
    },
    {
      id: 8,
      src: '/assets/facilities/nishimura-hall.jpg',
      alt: 'Nishimura Hall',
      category: 'training',
      caption: 'Nishimura Hall - Seminar Setup',
    },
    {
      id: 9,
      src: '/assets/facilities/yamamoto-hall.jpg',
      alt: 'Yamamoto Hall',
      category: 'training',
      caption: 'Yamamoto Hall - Classroom Setup',
    },
    {
      id: 10,
      src: '/assets/facilities/classroom.jpg',
      alt: 'Classroom',
      category: 'training',
      caption: 'Modern Classroom with A/V Equipment',
    },
    {
      id: 11,
      src: '/assets/facilities/boardroom.jpg',
      alt: 'Boardroom',
      category: 'training',
      caption: 'Executive Boardroom for Meetings',
    },
    {
      id: 12,
      src: '/assets/facilities/twin-room.jpg',
      alt: 'Twin Room',
      category: 'rooms',
      caption: 'Comfortable Twin Room Accommodation',
    },
    {
      id: 13,
      src: '/assets/facilities/suite-room.jpg',
      alt: 'Suite Room',
      category: 'rooms',
      caption: 'Premium Suite Room with Japanese Decor',
    },
    {
      id: 14,
      src: '/assets/facilities/bathroom.jpg',
      alt: 'Modern Bathroom',
      category: 'rooms',
      caption: 'Modern Bathroom Facilities',
    },
    {
      id: 15,
      src: '/assets/facilities/dining-hall.jpg',
      alt: 'Dining Hall',
      category: 'facilities',
      caption: 'Spacious Dining Hall',
    },
    {
      id: 16,
      src: '/assets/facilities/library.jpg',
      alt: 'Library',
      category: 'facilities',
      caption: 'Japanese and Management Literature Library',
    },
    {
      id: 17,
      src: '/assets/facilities/startup-space.jpg',
      alt: 'Startup Space',
      category: 'facilities',
      caption: 'Modern Co-working and Startup Space',
    },
    {
      id: 18,
      src: '/assets/facilities/solar-panels.jpg',
      alt: 'Solar Panels',
      category: 'sustainability',
      caption: '100% Solar Powered Facility',
    },
  ];
  
  // Filter images based on active tab
  const filteredImages = activeGalleryTab === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeGalleryTab);
  
  // Amenity groups for better organization
  const amenityGroups = [
    {
      title: "Accommodation",
      icon: "🏨",
      items: [
        "20 fully equipped twin rooms",
        "2 luxury suite rooms",
        "Clean, comfortable Japanese-inspired decor",
        "Modern bathroom facilities",
        "High-speed WiFi",
        "Daily housekeeping service"
      ]
    },
    {
      title: "Conference & Training",
      icon: "🎓",
      items: [
        "Golden Jubilee Hall (large auditorium)",
        "Nishimura Hall and Yamamoto Hall (seminar spaces)",
        "8 modern classrooms with A/V equipment",
        "Boardroom for executive meetings",
        "High-speed internet in all training areas",
        "Professional sound systems"
      ]
    },
    {
      title: "Office Spaces",
      icon: "🏢",
      items: [
        "ASA Kerala (ASAK) office",
        "INJACK office",
        "IEEE Kerala office",
        "Startup incubation spaces",
        "Co-working facilities",
        "Business support services"
      ]
    },
    {
      title: "Support & Utilities",
      icon: "📚",
      items: [
        "Japanese and management literature library",
        "Spacious dining hall",
        "Ample parking space",
        "Reception and concierge services",
        "24/7 security",
        "Backup power systems"
      ]
    },
    {
      title: "Japanese Elements",
      icon: "⛩️",
      items: [
        "Japanese Zen Garden",
        "Red Torii Gate at entrance",
        "Traditional Japanese architectural styling",
        "Japanese artifacts and decor",
        "Tatami room for cultural experiences",
        "Sakura trees and Japanese landscaping"
      ]
    },
    {
      title: "Sustainability Features",
      icon: "☀️",
      items: [
        "100% solar-powered facility",
        "Water conservation systems",
        "Energy-efficient lighting",
        "Waste management protocols",
        "Eco-friendly building materials",
        "Green spaces and natural ventilation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Banner Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Facilities</h1>
            <p className="text-xl md:text-2xl">Experience Japan in Kerala at our world-class Nippon Kerala Centre</p>
          </div>
        </div>
      </section>

      {/* NKC Overview Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="section-title text-3xl font-bold text-zinc-900 mb-6">Nippon Kerala Centre (NKC)</h2>
              <div className="prose max-w-none text-zinc-700">
                <p className="mb-4">
                  NKC is the flagship project of ASA Kerala (ASAK), envisioned as an advanced residential 
                  training infrastructure. The idea for NKC was first proposed around 15 years ago by senior ASAK 
                  member Mr. Edgar Morris, who suggested building an integrated residential training complex in Kerala.
                </p>
                <p className="mb-4">
                  His vision was inspired by the AOTS training centers in Japan (Tokyo, Yokohama, and Osaka), 
                  where classrooms, offices, accommodations, and dining facilities are housed under one roof. 
                  Such integrated setups provide a cost-effective and convenient environment for conducting multi-day 
                  training programs, and NKC was designed to follow the same model.
                </p>
                <p>
                  NKC now serves as a world-class training facility, accessible to institutions and organizations 
                  across India for their training needs. The facility reflects Japanese architectural aesthetics 
                  and aims to provide a distinctively Japanese experience in Kerala.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative h-80 sm:h-96 lg:h-full rounded-xl overflow-hidden shadow-lg">
              {/* In a real implementation, use actual image of NKC */}
              <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                <span className="text-zinc-500">NKC Building Image</span>
              </div>
              {/* Uncomment when actual image is available */}
              {/* <Image
                src="/assets/facilities/nkc-main.jpg"
                alt="Nippon Kerala Centre"
                fill
                className="object-cover"
              /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-zinc-100">
        <div className="container-custom">
          <h2 className="section-title-centered text-3xl font-bold text-zinc-900 mb-8">Photo Gallery</h2>
          <p className="text-center text-zinc-700 max-w-3xl mx-auto mb-12">
            Explore our facility through an extensive gallery showcasing NKC's architecture, 
            training spaces, and serene environment.
          </p>
          
          {/* Gallery Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full transition ${
                  activeGalleryTab === category.id 
                    ? 'bg-hinomaru-red text-white' 
                    : 'bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
                onClick={() => setActiveGalleryTab(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 relative">
                  {/* In a real implementation, display actual gallery images */}
                  <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                    <span className="text-zinc-500">{image.alt}</span>
                  </div>
                  {/* Uncomment when actual images are available */}
                  {/* <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="p-4">
                  <p className="text-zinc-700 text-sm">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking & Reservations Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title-centered text-3xl font-bold text-zinc-900 mb-8">Booking & Reservations</h2>
          <p className="text-center text-zinc-700 max-w-3xl mx-auto mb-12">
            Organizations and individuals can book rooms at NKC for training programs, conferences, 
            and corporate events. Our facility offers a seamless reservation process for all guests.
          </p>
          
          {/* Booking Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Room Booking */}
            <div className="japan-card p-8 text-center">
              <div className="bg-sakura-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏨</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Room Booking</h3>
              <p className="text-zinc-700 mb-6">
                Book accommodation for individuals or small groups with our comfortable twin rooms and suites.
              </p>
              <Link href="/facilities/book-room" className="btn-primary inline-block">
                Book a Room
              </Link>
            </div>
            
            {/* Event Booking */}
            <div className="japan-card p-8 text-center">
              <div className="bg-sakura-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Event Booking</h3>
              <p className="text-zinc-700 mb-6">
                Reserve our training halls, conference rooms, and auditorium for corporate events and programs.
              </p>
              <Link href="/facilities/book-event" className="btn-primary inline-block">
                Book for an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-zinc-100">
        <div className="container-custom">
          <h2 className="section-title-centered text-3xl font-bold text-zinc-900 mb-8">Amenities</h2>
          <p className="text-center text-zinc-700 max-w-3xl mx-auto mb-12">
            Currently, NKC boasts state-of-the-art amenities designed to provide a comfortable, 
            productive, and authentically Japanese experience.
          </p>
          
          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenityGroups.map((group, index) => (
              <div key={index} className="japan-card p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{group.icon}</span>
                  <h3 className="text-xl font-bold text-zinc-900">{group.title}</h3>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-hinomaru-red mr-2">•</span>
                      <span className="text-zinc-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Experience Japan in Kerala</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Visit Nippon Kerala Centre to experience our world-class training and accommodation facilities 
            with authentic Japanese architectural elements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/facilities/book-room" className="btn-white">
              Book a Room
            </Link>
            <Link href="/facilities/book-event" className="btn-outline-white">
              Plan an Event
            </Link>
            <Link href="/contact" className="btn-outline-white">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 