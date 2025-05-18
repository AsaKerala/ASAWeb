import { redirect } from 'next/navigation';
import { getProgramBySlug, eventsApi } from '@/lib/api';

interface ParamProps {
  params: {
    slug: string;
  };
}

export default async function ProgramEventRedirect({ params }: ParamProps) {
  const { slug } = params;
  
  try {
    // Try to find an event with this slug
    const event = await eventsApi.getBySlug(slug);
    
    if (event) {
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
    // In case of error, redirect to programs page
    redirect('/programs');
  }
} 