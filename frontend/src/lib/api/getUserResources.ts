import { Event, Media } from './types';

interface ResourceByEvent {
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate?: string;
  };
  resources: {
    id: string;
    filename: string;
    mimeType: string;
    filesize: number;
    url: string;
    alt?: string;
    createdAt: string;
  }[];
}

/**
 * Fetches resources that the user has access to based on their event registrations
 * @param {string} token - JWT token for authentication
 * @param {string} [eventId] - Optional event ID to filter resources by a specific event
 * @returns {Promise<ResourceByEvent[]>} - User's resources organized by event
 */
export default async function getUserResources(token?: string, eventId?: string): Promise<ResourceByEvent[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `JWT ${token}`;
    }
    
    // Construct URL with optional event filter
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/user-resources`;
    if (eventId) {
      url += `?eventId=${eventId}`;
    }
    
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user resources: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch user resources');
    }
    
    return data.resourcesByEvent || [];
  } catch (error) {
    console.error('Error fetching user resources:', error);
    return [];
  }
} 