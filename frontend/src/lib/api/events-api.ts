import { api } from './index';
import { Event } from '@/types';

function normalizeSlug(slug: string): string {
  // Remove any leading/trailing spaces and convert to lowercase
  return slug.trim().toLowerCase();
}

/**
 * Events API module with methods to interact with the events endpoints
 */
export const eventsApi = {
  /**
   * Get all events with optional filtering parameters
   * @param params Query parameters for filtering, pagination, etc.
   * @returns Promise with array of events
   */
  getAll: async (params?: any): Promise<Event[]> => {
    try {
      console.log('Fetching all events with params:', params);
      const response = await api.get('/api/events', { params });
      console.log('Events response status:', response.status);
      
      // Handle different API response structures
      if (response.data.docs && Array.isArray(response.data.docs)) {
        return response.data.docs;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  /**
   * Get a event by its slug
   * @param slug The event slug
   * @returns Promise with the event or null if not found
   */
  getBySlug: async (slug: string): Promise<Event | null> => {
    try {
      const normalizedSlug = normalizeSlug(slug);
      console.log('Fetching event by slug:', normalizedSlug);
      
      // Try the dedicated slug endpoint first
      const response = await api.get(`/api/events/slug/${normalizedSlug}`);
      
      if (response.data && response.data.docs && response.data.docs.length > 0) {
        return response.data.docs[0];
      } else if (response.data && !response.data.docs) {
        // Handle case where API directly returns the event
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching event by slug ${slug}:`, error);
      
      // Try the alternative endpoint format as fallback
      try {
        const normalizedSlug = normalizeSlug(slug);
        const response = await api.get(`/api/events/${normalizedSlug}`);
        
        if (response.data) {
          return response.data;
        }
        
        return null;
      } catch (fallbackError) {
        console.error(`Error in fallback fetch for event ${slug}:`, fallbackError);
        return null;
      }
    }
  },
  
  /**
   * Get a event by its ID
   * @param id The event ID
   * @returns Promise with the event or null if not found
   */
  getById: async (id: string): Promise<Event | null> => {
    try {
      console.log('Fetching event by ID:', id);
      const response = await api.get(`/api/events/${id}`);
      
      if (response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Get upcoming events
   * @param limit Maximum number of events to return
   * @returns Promise with array of upcoming events
   */
  getUpcoming: async (limit = 5): Promise<Event[]> => {
    try {
      const today = new Date().toISOString();
      const response = await api.get('/api/events', { 
        params: { 
          where: {
            eventDate: { $gte: today }
          },
          sort: 'eventDate',
          limit
        } 
      });
      
      if (response.data.docs && Array.isArray(response.data.docs)) {
        return response.data.docs;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },
  
  /**
   * Get past events
   * @param limit Maximum number of events to return
   * @returns Promise with array of past events
   */
  getPast: async (limit = 5): Promise<Event[]> => {
    try {
      const today = new Date().toISOString();
      const response = await api.get('/api/events', { 
        params: { 
          where: {
            eventDate: { $lt: today }
          },
          sort: '-eventDate',
          limit
        } 
      });
      
      if (response.data.docs && Array.isArray(response.data.docs)) {
        return response.data.docs;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching past events:', error);
      throw error;
    }
  }
}; 