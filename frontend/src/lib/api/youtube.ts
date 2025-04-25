import { backendApi } from "./base";

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeID: string;
  youtubeURL?: string;
  thumbnailURL?: string;
  category: string;
  description?: string;
  featured: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export const youtubeApi = {
  /**
   * Fetch all YouTube videos
   */
  getAllVideos: async (): Promise<YouTubeVideo[]> => {
    try {
      const response = await backendApi.get('/api/youtube-videos', {
        params: {
          limit: 100,
          depth: 0,
        },
      });
      return response.data.docs;
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  },

  /**
   * Fetch featured YouTube videos
   */
  getFeaturedVideos: async (): Promise<YouTubeVideo[]> => {
    try {
      const response = await backendApi.get('/api/youtube-videos', {
        params: {
          where: {
            featured: {
              equals: true,
            },
          },
          limit: 10,
          depth: 0,
          sort: 'displayOrder',
        },
      });
      return response.data.docs;
    } catch (error) {
      console.error('Error fetching featured YouTube videos:', error);
      return [];
    }
  },

  /**
   * Fetch YouTube videos by category
   */
  getVideosByCategory: async (category: string): Promise<YouTubeVideo[]> => {
    try {
      const response = await backendApi.get('/api/youtube-videos', {
        params: {
          where: {
            category: {
              equals: category,
            },
          },
          limit: 20,
          depth: 0,
          sort: '-createdAt',
        },
      });
      return response.data.docs;
    } catch (error) {
      console.error(`Error fetching YouTube videos for category ${category}:`, error);
      return [];
    }
  },

  /**
   * Fetch media coverage videos (specifically for the News page)
   */
  getMediaCoverageVideos: async (): Promise<YouTubeVideo[]> => {
    try {
      const response = await backendApi.get('/api/youtube-videos', {
        params: {
          where: {
            category: {
              equals: 'media-coverage',
            },
          },
          limit: 10,
          depth: 0,
          sort: '-createdAt',
        },
      });
      return response.data.docs;
    } catch (error) {
      console.error('Error fetching media coverage videos:', error);
      return [];
    }
  },
}; 