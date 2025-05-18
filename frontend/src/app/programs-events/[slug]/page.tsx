import { redirect } from 'next/navigation';
import { getProgramBySlug, events } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

interface ParamProps {
  params: {
  slug: string;
  };
}

export default async function ProgramEventRedirect({ params }: ParamProps) {
  const { slug } = params;
  
  try {
    // Try to find an event with this slug
    const eventResponse = await events.getOne(slug);
    
    if (eventResponse && eventResponse.data) {
      // If found, redirect to new event page
      redirect(`/events/${slug}`);
            } else {
      // Try to find a program with this slug
      const program = await getProgramBySlug(slug);
      
      if (program) {
        // If found, redirect to new program page
        redirect(`/programs/${slug}`);
            } else {
        // If neither found, redirect to the main programs page
        redirect('/programs');
      }
    }
  } catch (error) {
    console.error('Error in redirect:', error);
    // In case of error, redirect to programs page
    redirect('/programs');
  }
} 