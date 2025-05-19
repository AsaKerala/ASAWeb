import { api } from './index';
import { Program } from '@/lib/api/types';

function normalizeSlug(slug: string): string {
  // Remove any leading/trailing spaces and convert to lowercase
  return slug.trim().toLowerCase();
}

/**
 * Programs API module with methods to interact with the programs endpoints
 */
export const programsApi = {
  /**
   * Get all programs with optional filtering parameters
   * @param params Query parameters for filtering, pagination, etc.
   * @returns Promise with array of programs
   */
  getAll: async (params?: any): Promise<Program[]> => {
    try {
      console.log('Fetching all programs with params:', params);
      const response = await api.get('/api/programs', { params });
      console.log('Programs response status:', response.status);
      
      // Handle different API response structures
      if (response.data.docs && Array.isArray(response.data.docs)) {
        return response.data.docs;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },
  
  /**
   * Get a program by its slug
   * @param slug The program slug
   * @returns Promise with the program or null if not found
   */
  getBySlug: async (slug: string): Promise<Program | null> => {
    try {
      const normalizedSlug = normalizeSlug(slug);
      console.log('Fetching program by slug:', normalizedSlug);
      
      // Try the dedicated slug endpoint first
      const response = await api.get(`/api/programs/slug/${normalizedSlug}`);
      
      if (response.data && response.data.docs && response.data.docs.length > 0) {
        return response.data.docs[0];
      } else if (response.data && !response.data.docs) {
        // Handle case where API directly returns the program
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching program by slug ${slug}:`, error);
      
      // Try the alternative endpoint format as fallback
      try {
        const normalizedSlug = normalizeSlug(slug);
        const response = await api.get(`/api/programs/${normalizedSlug}`);
        
        if (response.data) {
          return response.data;
        }
        
        return null;
      } catch (fallbackError) {
        console.error(`Error in fallback fetch for program ${slug}:`, fallbackError);
        return null;
      }
    }
  },
  
  /**
   * Get a program by its ID
   * @param id The program ID
   * @returns Promise with the program or null if not found
   */
  getById: async (id: string): Promise<Program | null> => {
    try {
      console.log('Fetching program by ID:', id);
      const response = await api.get(`/api/programs/${id}`);
      
      if (response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching program with ID ${id}:`, error);
      return null;
    }
  }
}; 