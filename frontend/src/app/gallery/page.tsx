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

export default function GalleryPage() {
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
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
    { id: 'event', name: 'Events' },
    { id: 'sustainability', name: 'Sustainability' },
  ];
  
  // Fetch gallery images on component mount
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setIsLoading(true);
        
        // Initial fetch of gallery images with pagination
        const allImagesResponse = await galleryApi.getAll({ 
          limit: imagesPerPage,
          page: 1
        });
        const allImagesDocs = allImagesResponse.data?.docs || [];
        const totalDocs = allImagesResponse.data?.totalDocs || 0;
        
        console.log(`Gallery page - fetched ${allImagesDocs.length}/${totalDocs} gallery images`);
        
        // Map API response to the expected format
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
        
        setGalleryImages(mappedAllImages);
        setFilteredImages(mappedAllImages);
        setHasMore(allImagesDocs.length < totalDocs);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        
        // Fallback to sample images if API fails
        setGalleryImages(sampleGalleryImages);
        setFilteredImages(sampleGalleryImages);
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
            inGallery: { equals: true }
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
  
  // Sample gallery images as fallback
  const sampleGalleryImages = [
    // Exterior
    {
      id: '1',
      title: 'NKC Main Building',
      image: {
        url: '/assets/facilities/nkc-exterior-1.jpg',
        alt: 'NKC Main Building',
      },
      caption: 'Nippon Kerala Centre - Main Building',
      category: 'exterior',
      featured: false,
    },
    {
      id: '2',
      title: 'NKC Entrance',
      image: {
        url: '/assets/facilities/nkc-exterior-2.jpg',
        alt: 'NKC Entrance',
      },
      caption: 'Main Entrance with Torii Gate',
      category: 'exterior',
      featured: false,
    },
    // Accommodation
    {
      id: '3',
      title: 'Twin Room',
      image: {
        url: '/assets/facilities/twin-room-suite.jpg',
        alt: 'Twin Room Suite',
      },
      caption: 'Comfortable twin rooms with modern amenities',
      category: 'rooms',
      featured: false,
    },
    {
      id: '4',
      title: 'Luxury Suite',
      image: {
        url: '/assets/facilities/luxury-suite.jpg',
        alt: 'Luxury Suite',
      },
      caption: 'Luxury suite with Japanese-inspired décor',
      category: 'rooms',
      featured: false,
    },
    // Training
    {
      id: '5',
      title: 'Golden Jubilee Hall',
      image: {
        url: '/assets/facilities/golden-jubilee-hall.jpg',
        alt: 'Golden Jubilee Hall',
      },
      caption: 'Our main auditorium for large gatherings',
      category: 'training',
      featured: false,
    },
    {
      id: '6',
      title: 'Nishimura Hall',
      image: {
        url: '/assets/facilities/nishimura-hall.jpg',
        alt: 'Nishimura Hall',
      },
      caption: 'Seminar hall for workshops and meetings',
      category: 'training',
      featured: false,
    },
    {
      id: '7',
      title: 'Classroom',
      image: {
        url: '/assets/facilities/classroom.jpg',
        alt: 'Modern Classroom',
      },
      caption: 'Modern classroom with AV equipment',
      category: 'training',
      featured: false,
    },
    // Japanese Elements
    {
      id: '8',
      title: 'Zen Garden',
      image: {
        url: '/assets/facilities/zen-garden.jpg',
        alt: 'Japanese Zen Garden',
      },
      caption: 'Authentic Japanese Zen garden for relaxation',
      category: 'japanese',
      featured: false,
    },
    {
      id: '9',
      title: 'Torii Gate',
      image: {
        url: '/assets/facilities/torii-gate.jpg',
        alt: 'Torii Gate',
      },
      caption: 'Traditional Japanese Torii gate at entrance',
      category: 'japanese',
      featured: false,
    },
    // Facilities
    {
      id: '10',
      title: 'Dining Hall',
      image: {
        url: '/assets/facilities/dining-hall.jpg',
        alt: 'Dining Hall',
      },
      caption: 'Spacious dining hall for guests',
      category: 'facilities',
      featured: false,
    },
    {
      id: '11',
      title: 'Reception Area',
      image: {
        url: '/assets/facilities/reception.jpg',
        alt: 'Reception Area',
      },
      caption: 'Welcoming reception area',
      category: 'facilities',
      featured: false,
    },
    // Sustainability
    {
      id: '12',
      title: 'Solar Panels',
      image: {
        url: '/assets/facilities/solar-panels.jpg',
        alt: 'Solar Panels',
      },
      caption: '100% solar-powered facility',
      category: 'sustainability',
      featured: false,
    },
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
          inGallery: { equals: true },
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
        
        // Filter out any duplicate images that we already have
        const existingIds = new Set(galleryImages.map(img => img.id));
        const uniqueNewImages = mappedNewImages.filter((img: GalleryImage) => !existingIds.has(img.id));
        
        if (uniqueNewImages.length === 0) {
          console.log('No new unique images to add');
          setHasMore(false);
          setLoadingMore(false);
          return;
        }
        
        console.log(`Adding ${uniqueNewImages.length} unique new images`);
        
        // If we're filtering by category, only update the filtered images
        if (activeGalleryTab !== 'all') {
          // Also filter duplicates in filtered images
          const existingFilteredIds = new Set(filteredImages.map(img => img.id));
          const uniqueNewFilteredImages = uniqueNewImages.filter((img: GalleryImage) => !existingFilteredIds.has(img.id));
          setFilteredImages(prev => [...prev, ...uniqueNewFilteredImages]);
        } else {
          // Otherwise update both the full gallery and filtered images
          const updatedGalleryImages = [...galleryImages, ...uniqueNewImages];
          setGalleryImages(updatedGalleryImages);
          setFilteredImages(updatedGalleryImages);
        }
        
        setPage(nextPage);
        
        // Check if we have more images to load
        const loadedCount = galleryImages.length + uniqueNewImages.length;
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-xl md:text-2xl">Explore our facility through an extensive gallery showcasing NKC's architecture, training spaces, and serene environment.</p>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 bg-zinc-100">
        <div className="container-custom">
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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
              <p className="mt-4 text-zinc-600">Loading gallery images...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 relative">
                    {image.image?.url ? (
                      <Image
                        src={image.image.url}
                        alt={image.image?.alt || image.title}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                        <span className="text-zinc-500">{image.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-700 text-sm">{image.caption || image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={loadMoreImages}
                disabled={loadingMore}
                className="px-6 py-3 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition duration-300 flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 