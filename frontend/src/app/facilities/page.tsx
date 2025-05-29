'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { galleryApi } from '@/lib/api';

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

export default function FacilitiesPage() {
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselImages, setCarouselImages] = useState<GalleryImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const imagesPerPage = 25;
  
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
  
  // Fetch gallery images on component mount
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured images for the carousel
        const featuredResponse = await galleryApi.getFeatured(4);
        const featuredDocs = featuredResponse.data?.docs || [];
        
        // Initial fetch of gallery images with pagination
        const allImagesResponse = await galleryApi.getAll({ 
          limit: imagesPerPage,
          page: 1
        });
        const allImagesDocs = allImagesResponse.data?.docs || [];
        const totalDocs = allImagesResponse.data?.totalDocs || 0;
        
        console.log(`Facilities page - fetched ${allImagesDocs.length}/${totalDocs} gallery images`);
        
        // Map API response to the expected format
        const mappedFeatured = featuredDocs.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          image: {
            url: doc.url,
            alt: doc.alt || doc.title
          },
          caption: doc.caption,
          category: doc.category,
          featured: doc.inFacilitiesCarousel || doc.featured || false
        }));
        
        const mappedAllImages = allImagesDocs.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          image: {
            url: doc.url,
            alt: doc.alt || doc.title
          },
          caption: doc.caption,
          category: doc.category,
          featured: doc.inFacilitiesCarousel || doc.featured || false
        }));
        
        setCarouselImages(mappedFeatured);
        setGalleryImages(mappedAllImages);
        setFilteredImages(mappedAllImages);
        setHasMore(allImagesDocs.length < totalDocs);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        
        // Show empty states instead of sample images
        setCarouselImages([]);
        setGalleryImages([]);
        setFilteredImages([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGalleryImages();
  }, [imagesPerPage]);
  
  // Filter gallery images when tab changes
  useEffect(() => {
    const filterImages = async () => {
      // Reset pagination whenever we change filters
      setPage(1);
      
      if (activeGalleryTab === 'all') {
        setFilteredImages(galleryImages);
        // Check if we need to fetch more for "all" category
        const totalDocs = await checkTotalDocs();
        setHasMore(galleryImages.length < totalDocs);
      } else {
        // If we're filtering, first try to filter from existing loaded images
        const filtered = galleryImages.filter(img => img.category === activeGalleryTab);
        setFilteredImages(filtered);
        
        // If we don't have many images for this category, fetch from API directly
        if (filtered.length < imagesPerPage) {
          try {
            setIsLoading(true);
            const categoryResponse = await galleryApi.getByCategory(activeGalleryTab, imagesPerPage);
            const categoryImagesDocs = categoryResponse.data?.docs || [];
            const totalCategoryDocs = categoryResponse.data?.totalDocs || 0;
            
            if (categoryImagesDocs.length > 0) {
              // Map API response to the expected format
              const mappedCategoryImages = categoryImagesDocs.map((doc: any) => ({
                id: doc.id,
                title: doc.title,
                image: {
                  url: doc.url,
                  alt: doc.alt || doc.title
                },
                caption: doc.caption,
                category: doc.category,
                featured: doc.inFacilitiesCarousel || doc.featured || false
              }));
              
              setFilteredImages(mappedCategoryImages);
              setHasMore(categoryImagesDocs.length < totalCategoryDocs);
            } else {
              setHasMore(false);
            }
          } catch (error) {
            console.error(`Error fetching category ${activeGalleryTab} images:`, error);
          } finally {
            setIsLoading(false);
          }
        } else {
          // We have enough images locally, check if there are more on server
          const checkCategoryTotal = async () => {
            try {
              const response = await galleryApi.getByCategory(activeGalleryTab, 1);
              const totalCategoryDocs = response.data?.totalDocs || 0;
              setHasMore(filtered.length < totalCategoryDocs);
            } catch (error) {
              console.error('Error checking category total:', error);
              setHasMore(false);
            }
          };
          checkCategoryTotal();
        }
      }
    };
    
    // Helper function to check total documents
    const checkTotalDocs = async () => {
      try {
        const response = await galleryApi.getAll({ 
          limit: 1,
          where: {
            inGallery: { equals: true },
            mediaType: { equals: 'file' }
          }
        });
        return response.data?.totalDocs || 0;
      } catch (error) {
        console.error('Error checking total docs:', error);
        return 0;
      }
    };
    
    filterImages();
  }, [activeGalleryTab, galleryImages, imagesPerPage]);
  
  // Auto-rotate carousel
  useEffect(() => {
    if (carouselImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  
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

  // Load more images function
  const loadMoreImages = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      // Get the category filter if any
      const categoryFilter = activeGalleryTab !== 'all' ? { category: { equals: activeGalleryTab } } : {};
      
      const response = await galleryApi.getAll({
        limit: imagesPerPage,
        page: nextPage,
        where: {
          ...categoryFilter
        }
      });
      
      const newImagesDocs = response.data?.docs || [];
      const totalDocs = response.data?.totalDocs || 0;
      
      console.log(`Loaded page ${nextPage}: ${newImagesDocs.length} more images`);
      
      if (newImagesDocs.length > 0) {
        // Map API response to the expected format
        const mappedNewImages = newImagesDocs.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          image: {
            url: doc.url,
            alt: doc.alt || doc.title
          },
          caption: doc.caption,
          category: doc.category,
          featured: doc.inFacilitiesCarousel || doc.featured || false
        }));
        
        // If we're filtering by category, only update the filtered images
        if (activeGalleryTab !== 'all') {
          setFilteredImages(prev => [...prev, ...mappedNewImages]);
        } else {
          // Otherwise update both the full gallery and filtered images
          const updatedGalleryImages = [...galleryImages, ...mappedNewImages];
          setGalleryImages(updatedGalleryImages);
          setFilteredImages(updatedGalleryImages);
        }
        
        setPage(nextPage);
        
        // Check if we have more images to load
        const loadedCount = galleryImages.length + newImagesDocs.length;
        setHasMore(loadedCount < totalDocs);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setLoadingMore(false);
    }
  };

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

      {/* Hero Image Carousel */}
      <section className="relative bg-black h-[500px] md:h-[600px] overflow-hidden">
        {carouselImages.length > 0 ? (
          <>
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
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="container-custom">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{image.title}</h2>
                    <p className="text-lg md:text-xl text-zinc-100">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
            
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
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-hinomaru-red to-sakura-700 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-6">Welcome to Nippon Kerala Centre</h2>
            <p className="text-lg md:text-xl text-white/90 mt-2 text-center max-w-2xl">
              Experience world-class facilities with Japanese architecture and aesthetics
            </p>
          </div>
        )}
        
        {/* Book Now Button - Moved to bottom center */}
        <div className="absolute bottom-24 md:bottom-32 left-1/2 transform -translate-x-1/2 z-20">
          <a 
            href="#booking-section" 
            className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Book Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
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
              <Image
                src="/assets/facilities/nkc-exterior-1.jpg"
                alt="Nippon Kerala Centre"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking & Reservations Section - Moved up as requested */}
      <section id="booking-section" className="py-16 bg-zinc-100">
        <div className="container-custom">
          <h2 className="section-title-centered text-3xl font-bold text-zinc-900 mb-8">Room & Event Booking</h2>
          <p className="text-center text-zinc-700 max-w-3xl mx-auto mb-12">
            Experience our world-class facilities for your stay or event. Our modern accommodations and 
            versatile training spaces provide the perfect environment for both individual visits and corporate functions.
          </p>
          
          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Accommodation Details */}
            <div className="japan-card p-8">
              <div className="flex items-center mb-6">
                <div className="bg-sakura-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">🏨</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">Accommodation</h3>
              </div>
              <div className="space-y-4 text-zinc-700">
                <p>
                  <strong>20 fully equipped twin rooms</strong>, including 2 luxury suite rooms with 
                  Japanese-inspired decor and modern amenities.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Comfortable beds with premium linens</li>
                  <li>En-suite bathrooms with shower facilities</li>
                  <li>Air conditioning in all rooms</li>
                  <li>Daily housekeeping service</li>
                  <li>High-speed Wi-Fi access</li>
                  <li>In-room tea/coffee facilities</li>
                </ul>
                <div className="pt-4">
                  {/* Room booking functionality removed */}
                </div>
              </div>
            </div>
            
            {/* Conference & Training Details */}
            <div className="japan-card p-8">
              <div className="flex items-center mb-6">
                <div className="bg-sakura-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">Conference & Training</h3>
              </div>
              <div className="space-y-4 text-zinc-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Golden Jubilee Hall</strong> - Large auditorium 
                    (soon to be renamed Hozumi Goichi Sensei Memorial Hall)
                  </li>
                  <li>
                    <strong>Two seminar halls</strong> - Nishimura Hall and Yamamoto Hall, 
                    perfect for workshops and meetings
                  </li>
                  <li>
                    <strong>8 modern classrooms</strong> with advanced audio-visual equipment
                  </li>
                  <li>Executive boardroom for smaller meetings</li>
                  <li>Breakout spaces for group discussions</li>
                  <li>Technical support available</li>
                </ul>
                <div className="pt-4">
                  <Link href="/facilities/book-event" className="btn-primary inline-block">
                    Book for an Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Card Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="japan-card-simple p-6 text-center">
              <div className="text-3xl mb-2">🏢</div>
              <h4 className="font-semibold text-zinc-900 mb-1">All-in-One Facility</h4>
              <p className="text-sm text-zinc-600">Accommodation, training, and dining in one location</p>
            </div>
            
            <div className="japan-card-simple p-6 text-center">
              <div className="text-3xl mb-2">💼</div>
              <h4 className="font-semibold text-zinc-900 mb-1">Professional Setup</h4>
              <p className="text-sm text-zinc-600">Modern equipment for productive sessions</p>
            </div>
            
            <div className="japan-card-simple p-6 text-center">
              <div className="text-3xl mb-2">🍃</div>
              <h4 className="font-semibold text-zinc-900 mb-1">Japanese Ambiance</h4>
              <p className="text-sm text-zinc-600">Authentic Japanese-inspired environment</p>
            </div>
            
            <div className="japan-card-simple p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="font-semibold text-zinc-900 mb-1">Support Staff</h4>
              <p className="text-sm text-zinc-600">Dedicated team to assist with your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title-centered text-3xl font-bold text-zinc-900 mb-8">Amenities</h2>
          <p className="text-center text-zinc-700 max-w-3xl mx-auto mb-12">
            NKC boasts state-of-the-art amenities designed to provide a comfortable, 
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

      {/* Photo Gallery Section */}
      <section className="py-16 bg-zinc-100">
        <div className="container-custom">
          <h2 className="section-title-centered text-3xl font-bold text-zinc-900 mb-8">Photo Gallery</h2>
          <p className="text-center text-zinc-700 max-w-3xl mx-auto mb-10">
            Explore our facility through an extensive gallery showcasing NKC's architecture, 
            training spaces, and serene environment.
          </p>
          
          {/* Gallery preview - just show a few images as a teaser */}
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {galleryImages.slice(0, 3).map((image) => (
                <div key={image.id} className="aspect-video relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={image.image.url}
                    alt={image.image.alt || image.title}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md mb-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-zinc-700">Photo Gallery Coming Soon</h3>
              <p className="mt-2 text-zinc-500">
                Our gallery is currently being updated with new images.
              </p>
            </div>
          )}
          
          {/* View Gallery Button */}
          <div className="text-center">
            <Link
              href="/gallery"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              <span>View Full Gallery</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
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
            {/* Room booking functionality removed */}
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