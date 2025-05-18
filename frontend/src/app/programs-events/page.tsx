import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default function ProgramsEventsRedirect() {
  redirect('/programs');
} 