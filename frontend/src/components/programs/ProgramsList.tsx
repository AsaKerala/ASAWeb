'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { getAllPrograms } from '@/lib/api';
import { SafeImage } from '@/components/common';

// Define types for our data
interface Program {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  isFeatured?: boolean;
  featuredImage?: {
    url: string;
    alt?: string;
  };
}

const PROGRAM_CATEGORIES = {
  ALL: 'all',
  TRAINING_JAPAN: 'training-japan',
  TRAINING_INDIA: 'training-india',
  LANGUAGE: 'language-training',
  INTERNSHIPS: 'internships',
  SKILL_DEVELOPMENT: 'skill-development',
  WNF_PROGRAMS: 'wnf-programs',
  OTHER: 'other'
};

// Category labels for display and matching purposes
const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All Programs',
  'training-japan': 'Training in Japan',
  'training-india': 'Training in India',
  'language-training': 'Language Training',
  'internships': 'Internships',
  'skill-development': 'Skill Development',
  'wnf-programs': 'WNF Programs',
  'other': 'Other Programs'
};

export default function ProgramsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get category from URL query params, default to 'all'
  const categoryParam = searchParams.get('category') || PROGRAM_CATEGORIES.ALL;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching programs data...');
        const response = await getAllPrograms({
          limit: 100,
          where: {
            status: {
              equals: 'published'
            }
          }
        });
        
        console.log('Programs API response:', response);
        
        if (!response || !response.data) {
          console.error('Invalid response structure:', response);
          setError('Failed to load data: Invalid response format');
          return;
        }
        
        // Check if docs array is present
        if (!response.data.docs) {
          console.error('No docs array in response data:', response.data);
          setError('Failed to load data: Missing program data');
          return;
        }
        
        setPrograms(response.data.docs);
      } catch (err) {
        console.error('Error fetching programs data:', err);
        setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever programs, category, or search query changes
    let filtered = [...programs];
    
    // Filter by category
    if (categoryParam !== PROGRAM_CATEGORIES.ALL) {
      filtered = filtered.filter((program: Program) => program.category === categoryParam);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((program: Program) => 
        program.title.toLowerCase().includes(query) || 
        program.summary.toLowerCase().includes(query)
      );
    }
    
    setFilteredPrograms(filtered);
  }, [programs, categoryParam, searchQuery]);
  
  // Update URL when category changes
  const handleCategoryChange = (value: string) => {
    const current = new URLSearchParams();
    // Copy all current parameters
    searchParams.forEach((value, key) => {
      current.set(key, value);
    });
    
    // Update category parameter
    if (value === PROGRAM_CATEGORIES.ALL) {
      current.delete('category');
    } else {
      current.set('category', value);
    }
    
    router.push(`${pathname}?${current.toString()}`);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You could also add the search query to the URL if needed
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-sm gap-2 mb-4">
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button type="submit" className="btn-primary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <Tabs 
          value={categoryParam}
          defaultValue={categoryParam} 
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value={PROGRAM_CATEGORIES.ALL} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              All Programs
            </TabsTrigger>
            <TabsTrigger value={PROGRAM_CATEGORIES.TRAINING_JAPAN} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Training in Japan
            </TabsTrigger>
            <TabsTrigger value={PROGRAM_CATEGORIES.TRAINING_INDIA} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Training in India
            </TabsTrigger>
            <TabsTrigger value={PROGRAM_CATEGORIES.LANGUAGE} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Language Training
            </TabsTrigger>
            <TabsTrigger value={PROGRAM_CATEGORIES.INTERNSHIPS} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Internships
            </TabsTrigger>
            <TabsTrigger value={PROGRAM_CATEGORIES.SKILL_DEVELOPMENT} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              Skill Development
            </TabsTrigger>
            <TabsTrigger value={PROGRAM_CATEGORIES.WNF_PROGRAMS} className="data-[state=active]:bg-hinomaru-red data-[state=active]:text-white">
              WNF Programs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program: Program) => (
            <div key={program.id} className="japan-card overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
              <div className="relative h-48 w-full mb-4">
                {program.featuredImage ? (
                  <SafeImage
                    src={program.featuredImage.url} 
                    alt={program.title} 
                    fill 
                    className="object-cover rounded-md"
                    fallbackSrc="/assets/placeholder-program.jpg"
                  />
                ) : (
                  <div className="bg-gray-200 h-full w-full flex items-center justify-center rounded-md">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
                {program.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-hinomaru-red text-white border-none">
                    Featured
                  </Badge>
                )}
                <Badge className="absolute bottom-2 left-2 bg-white text-hinomaru-red border-none">
                  {CATEGORY_LABELS[program.category] || program.category}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2">{program.title}</h3>
              
              <p className="text-zinc-700 mb-4 flex-grow line-clamp-3">{program.summary}</p>
              
              <div className="mt-auto">
                <Link 
                  href={`/programs/${program.slug}`}
                  className="btn-primary inline-block w-full text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="japan-card text-center py-8">
          <p className="text-zinc-700 mb-4">No programs found matching your criteria.</p>
          <Button 
            className="btn-primary"
            onClick={() => {
              setSearchQuery('');
              router.push('/programs');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 