import { api } from './index';

/**
 * API handlers for gallery images
 */
export const galleryApi = {
  /**
   * Get all gallery images with optional filtering
   */
  getAll: async (params?: any) => {
    try {
      const response = await api.get('/api/gallery', { params });
      return response;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  },

  /**
   * Get featured gallery images for carousels and highlighted sections
   */
  getFeatured: async (limit = 5) => {
    try {
      const response = await api.get('/api/gallery', {
        params: {
          where: {
            featured: { equals: true }
          },
          sort: 'displayOrder',
          limit
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching featured gallery images:', error);
      throw error;
    }
  },

  /**
   * Get gallery images by category
   */
  getByCategory: async (category: string, limit?: number) => {
    try {
      const params: any = {
        where: {
          category: { equals: category }
        },
        sort: 'displayOrder'
      };
      
      if (limit) {
        params.limit = limit;
      }
      
      const response = await api.get('/api/gallery', { params });
      return response;
    } catch (error) {
      console.error(`Error fetching gallery images for category ${category}:`, error);
      throw error;
    }
  },

  /**
   * Get YouTube videos from gallery
   */
  getYouTubeVideos: async (limit = 4) => {
    try {
      const response = await api.get('/api/media', { 
        params: { 
          where: { 
            mediaType: { equals: 'youtube' }
          },
          sort: '-createdAt',
          limit
        } 
      });
      return response;
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw error;
    }
  }
}; 