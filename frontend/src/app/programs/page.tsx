'use client';

import { useState, useEffect } from 'react';
import { getAllPrograms } from '@/lib/api';
import { Program } from '@/lib/api/types';
import Link from 'next/link';
import { SafeImage } from '@/components/common';
import { 
  Search, 
  Filter,
  BookOpen, 
  Users, 
  GraduationCap, 
  Clock, 
  Calendar, 
  ChevronRight,
  Tag,
  Video,
  X,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';

// Program categories
const PROGRAM_CATEGORIES = [
  { id: 'all', name: 'All Programs' },
  { id: 'training-japan', name: 'Training Programs in Japan' },
  { id: 'training-india', name: 'Training Programs in India' },
  { id: 'language-training', name: 'Language Training' },
  { id: 'internships', name: 'Internships' },
  { id: 'skill-development', name: 'Skill Development' },
  { id: 'wnf-programs', name: 'WNF Programs' },
  { id: 'other', name: 'Other' },
];

// Extended Program type for backward compatibility
type ExtendedProgram = Program & {
  category?: string;
  isFeatured?: boolean;
  keyFeatures?: {
    duration?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    certification?: boolean | string;
  } | any;
  eligibility?: string;
  certification?: boolean | string;
  upcomingBatches?: Array<{
    startDate: string;
    mode?: string;
    applicationDeadline?: string;
  } | any>;
};

export default function ProgramsPage() {
  const [allPrograms, setAllPrograms] = useState<ExtendedProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<ExtendedProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchPrograms() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getAllPrograms({
          where: {
            status: {
              equals: 'published'
            }
          },
          sort: '-createdAt'
        });
        
        if (response.data && response.data.docs) {
          setAllPrograms(response.data.docs);
          setFilteredPrograms(response.data.docs);
        } else {
          setError('No programs found');
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrograms();
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    let result = [...allPrograms];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(program => program.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(program => 
        program.title.toLowerCase().includes(query) || 
        (program.summary && program.summary.toLowerCase().includes(query))
      );
    }
    
    setFilteredPrograms(result);
  }, [allPrograms, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Programs</h1>
            <p className="text-xl">
              Explore our wide range of technical, management, and cultural programs designed to enhance your skills and understanding of Japanese methodologies
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text" 
                placeholder="Search programs..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={18} className="text-gray-600" />
              <p className="text-sm text-gray-600 whitespace-nowrap">Filter by:</p>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PROGRAM_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Programs List Section */}
      <section className="py-12 bg-zinc-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
              <p className="text-zinc-700 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </Button>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-zinc-800 mb-4">No Programs Found</h3>
              <p className="text-zinc-700 mb-6">No programs match your current filters. Try adjusting your search criteria.</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <Link href={`/programs/${program.slug}`} key={program.id} className="group">
                  <div className="japan-card h-full overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        fallbackSrc="/assets/placeholder-image.jpg"
                      />
                      {program.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-hinomaru-red text-white">Featured</Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-hinomaru-red transition-colors">
                        {program.title}
                      </h3>
                      
                      {program.category && (
                        <Badge variant="outline" className="mb-4 w-fit">
                          {program.category}
                        </Badge>
                      )}
                      
                      <p className="text-zinc-700 mb-4 flex-grow line-clamp-3">
                        {program.summary || 'Discover this comprehensive program offered by ASA Kerala.'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        {program.keyFeatures && program.keyFeatures.length > 0 && (
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-hinomaru-red flex-shrink-0" />
                            <span className="text-zinc-700 truncate">
                              Key Features
                            </span>
                          </div>
                        )}
                        
                        {program.eligibility && (
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-hinomaru-red flex-shrink-0" />
                            <span className="text-zinc-700 truncate">
                              Eligibility
                            </span>
                          </div>
                        )}
                        
                        {program.certification && (
                          <div className="flex items-center gap-2">
                            <GraduationCap size={16} className="text-hinomaru-red flex-shrink-0" />
                            <span className="text-zinc-700 truncate">
                              Certification
                            </span>
                          </div>
                        )}
                        
                        {program.upcomingBatches && program.upcomingBatches.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-hinomaru-red flex-shrink-0" />
                            <span className="text-zinc-700 truncate">
                              Upcoming Batches
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-hinomaru-red font-medium group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 