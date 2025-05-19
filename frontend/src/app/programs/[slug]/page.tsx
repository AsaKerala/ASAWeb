import { Metadata } from 'next';
import { programs } from '@/lib/api';
import ProgramDetailComponent from './ProgramDetailComponent';
import Link from 'next/link';

// Set dynamic rendering and cache policy
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

interface ProgramDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const response = await programs.getOne(slug);
    const program = response.data;
    
    if (!program) {
      return {
        title: 'Program Not Found'
      };
    }
    
    return {
      title: `${program.title} | ASA Programs`,
      description: program.summary || `Learn more about ${program.title} and register today.`,
      openGraph: {
        title: program.title,
        description: program.summary || `Learn more about ${program.title} and register today.`,
        images: typeof program.featuredImage === 'object' && program.featuredImage?.url ? [program.featuredImage.url] : []
      }
    };
  } catch (error) {
    console.error('Error fetching program data for metadata:', error);
    return {
      title: 'Program Not Found'
    };
  }
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = params;
  
  try {
    const response = await programs.getOne(slug);
    const program = response.data;
    
    if (!program) {
      return (
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
          <p className="text-zinc-700 mb-8">The program you're looking for doesn't exist or has been removed.</p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/programs" 
              className="bg-hinomaru-red text-white px-6 py-3 rounded-washi font-medium hover:bg-sakura-700 transition duration-300"
            >
              Browse All Programs
            </Link>
            <Link 
              href="/" 
              className="bg-transparent border border-hinomaru-red text-hinomaru-red px-6 py-3 rounded-washi font-medium hover:bg-hinomaru-red/5 transition duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      );
    }
    
    return <ProgramDetailComponent initialProgram={program} slug={slug} />;
  } catch (error) {
    console.error('Error fetching program:', error);
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Program</h1>
        <p className="text-zinc-700 mb-8">There was an error loading this program. Please try again later.</p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/programs" 
            className="bg-hinomaru-red text-white px-6 py-3 rounded-washi font-medium hover:bg-sakura-700 transition duration-300"
          >
            Browse All Programs
          </Link>
          <Link 
            href="/" 
            className="bg-transparent border border-hinomaru-red text-hinomaru-red px-6 py-3 rounded-washi font-medium hover:bg-hinomaru-red/5 transition duration-300"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
} 