import { Event, EventRegistration, PaginatedResponse } from './types';

/**
 * Fetches the user's event registrations
 * @param {string} token - JWT token for authentication
 * @returns {Promise<{ upcoming: EventRegistration[], past: EventRegistration[] }>} - User's upcoming and past event registrations
 */
export default async function getUserEvents(token?: string): Promise<{ 
  upcoming: EventRegistration[],
  past: EventRegistration[]
}> {
  try {
    const now = new Date().toISOString();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `JWT ${token}`;
    }
    
    // Fetch user registrations with their events
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event-registrations?where[user][equals]=me&depth=1`, {
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user events: ${response.statusText}`);
    }
    
    const data = await response.json() as PaginatedResponse<EventRegistration>;
    
    // Split events into upcoming and past based on end date
    const upcoming: EventRegistration[] = [];
    const past: EventRegistration[] = [];
    
    data.docs.forEach(registration => {
      // Ensure event is populated
      if (typeof registration.event === 'string') {
        // This shouldn't happen with depth=1, but handle it just in case
        console.error('Event not populated in registration:', registration);
        return;
      }
      
      const event = registration.event as Event;
      const endDate = event.endDate || event.startDate;
      
      if (endDate && new Date(endDate) >= new Date()) {
        upcoming.push(registration);
      } else {
        past.push(registration);
      }
    });
    
    // Sort upcoming events by start date (ascending)
    upcoming.sort((a, b) => {
      const eventA = a.event as Event;
      const eventB = b.event as Event;
      const dateA = eventA.startDate || new Date(0).toISOString();
      const dateB = eventB.startDate || new Date(0).toISOString();
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
    
    // Sort past events by start date (descending - most recent first)
    past.sort((a, b) => {
      const eventA = a.event as Event;
      const eventB = b.event as Event;
      const dateA = eventA.startDate || new Date(0).toISOString();
      const dateB = eventB.startDate || new Date(0).toISOString(); 
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return {
      upcoming,
      past,
    };
  } catch (error) {
    console.error('Error fetching user events:', error);
    return {
      upcoming: [],
      past: [],
    };
  }
} 