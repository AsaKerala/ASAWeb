import React from 'react';
import { notFound } from 'next/navigation';
import { getProgramBySlug } from '@/lib/api';
import ProgramDetail from '@/components/programs/ProgramDetail';
import { Metadata, ResolvingMetadata } from 'next';
import { Program } from '@/types';

interface ProgramPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export async function generateMetadata(
  { params }: ProgramPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const program = await getProgramBySlug(slug);
    
    if (!program) {
      return {
        title: 'Program Not Found',
      };
    }
    
    return {
      title: `${program.title} | ASA Programs`,
      description: program.summary || program.content?.slice(0, 160),
      openGraph: {
        title: program.title,
        description: program.summary || program.content?.slice(0, 160),
        images: program.featuredImage ? [
          {
            url: program.featuredImage.url,
            width: 1200,
            height: 630,
            alt: program.title,
          }
        ] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Program Not Found',
    };
  }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = params;
  
  try {
    const program = await getProgramBySlug(slug);
    
    if (!program) {
      notFound();
    }
    
    return <ProgramDetail program={program} />;
  } catch (error) {
    console.error('Error loading program:', error);
    notFound();
  }
} 