import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProgramBySlug } from '@/lib/api';
import ProgramDetailComponent from './ProgramDetailComponent';

// Make sure this is a server component
export const dynamic = 'force-dynamic';

interface ProgramDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  try {
    const program = await getProgramBySlug(params.slug);
    
    if (!program) {
      return {
        title: 'Program Not Found',
        description: 'The requested program could not be found.',
      };
    }
    
    return {
      title: `${program.title} | ASA Kerala`,
      description: program.summary || 'Explore our program details and join us.',
      openGraph: {
        title: `${program.title} | ASA Kerala`,
        description: program.summary || 'Explore our program details and join us.',
        images: program.featuredImage ? [program.featuredImage.url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Program | ASA Kerala',
      description: 'Explore our program details and join us.',
    };
  }
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  try {
    const program = await getProgramBySlug(params.slug);
    
    if (!program) {
      notFound();
    }
    
    return <ProgramDetailComponent initialProgram={program} slug={params.slug} />;
  } catch (error) {
    return (
      <div className="container-custom my-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-zinc-700 mb-8">
          We encountered an error while trying to load this program. Please try again later.
        </p>
        <a 
          href="/programs" 
          className="inline-block px-6 py-2.5 bg-hinomaru-red text-white font-medium rounded-md"
        >
          Return to Programs
        </a>
      </div>
    );
  }
} 