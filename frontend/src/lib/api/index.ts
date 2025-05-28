import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for authentication cookies
  timeout: 15000, // 15 second timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add JWT token from localStorage if it exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('payload-token');
      if (token && config.headers) {
        config.headers.Authorization = `JWT ${token}`;
        // Add debugging but exclude some calls to reduce noise
        const url = config.url || '';
        if (!url.includes('/api/globals/') && !url.includes('/api/events') && !url.includes('/api/news')) {
          console.log(`API request to ${url} - token added to headers`);
        }
      } else if (config.url && !config.url.includes('/api/globals/')) {
        // Log when token is missing from authenticated requests
        console.log(`API request to ${config.url} - NO TOKEN PRESENT in headers`);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Authentication errors
      if (error.response.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access. Please log in again.', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          data: error.response.data
        });
        
        // Clear the token from localStorage since it's invalid or expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('payload-token');
          console.log('Token removed due to 401 unauthorized response');
        }
      }
      
      // Forbidden errors
      if (error.response.status === 403) {
        console.error('Access forbidden. You do not have permission to access this resource.', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status
        });
      }
      
      // Server errors
      if (error.response.status >= 500) {
        console.error('Server error. Please try again later.', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          data: error.response.data
        });
      }
    }
    
    // Network errors
    if (error.request && !error.response) {
      console.error('Network error. Please check your connection.', {
        url: error.config?.url, 
        method: error.config?.method
      });
    }
    
    return Promise.reject(error);
  }
);

// Helper function to normalize slugs (remove trailing hyphens)
const normalizeSlug = (slug: string): string => {
  return slug.replace(/-+$/, '');
};

// Authentication endpoints
export const auth = {
  login: async (email: string, password: string) => {
    return api.post('/api/users/login', { email, password });
  },
  register: async (userData: any) => {
    return api.post('/api/users', userData);
  },
  logout: async () => {
    return api.post('/api/users/logout');
  },
  me: async () => {
    return api.get('/api/users/me');
  },
  requestPasswordReset: async (email: string) => {
    return api.post('/api/users/request-password-reset', { email });
  },
  validateResetToken: async (token: string) => {
    return api.get(`/api/users/validate-reset-token/${token}`);
  },
  resetPassword: async (token: string, password: string) => {
    return api.post(`/api/users/reset-password/${token}`, { password });
  },
  checkAdmin: async () => {
    return api.get('/api/check-admin');
  },
};

// Events endpoints
export const events = {
  getAll: async (params?: any) => {
    console.log('Fetching all events with params:', params);
    try {
      const response = await api.get('/api/events', { params });
      console.log('Events getAll response:', response.status);
      return response;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  getOne: async (slug: string) => {
    // Normalize the slug by removing trailing hyphens
    const normalizedSlug = normalizeSlug(slug);
    const isSlugNormalized = normalizedSlug !== slug;
    
    console.log('Fetching single event with slug:', slug);
    if (isSlugNormalized) {
      console.log('Normalized slug:', normalizedSlug);
    }
    
    // Try different approaches to get the event
    try {
      // Attempt 1: Try direct API call with normalized slug
      try {
        console.log('Attempt 1: Direct API call with normalized slug');
        const response = await api.get(`/api/events/${normalizedSlug}`);
        console.log('Event found via direct API call, status:', response.status);
        return response;
      } catch (error: any) {
        console.error('Direct API call failed:', error.response?.status);
        
        // Attempt 2: Try to fetch all events and find the matching one
        console.log('Attempt 2: Fetching all events to find matching slug');
        const allEventsResponse = await api.get('/api/events');
        
        if (allEventsResponse.data && allEventsResponse.data.docs && allEventsResponse.data.docs.length > 0) {
          // Find event with matching normalized slug
          const matchingEvent = allEventsResponse.data.docs.find(
            (event: any) => normalizeSlug(event.slug) === normalizedSlug
          );
          
          if (matchingEvent) {
            console.log('Event found in list with title:', matchingEvent.title);
            return { data: matchingEvent, status: 200 };
          } else {
            console.error('Event not found in list of all events');
            throw new Error('Event not found');
          }
        } else {
          console.error('No events returned from API or invalid response format');
          throw error; // Re-throw original error if we couldn't find a match
        }
      }
    } catch (error) {
      console.error(`Error fetching event with slug ${normalizedSlug}:`, error);
      throw error;
    }
  },
  rsvp: async (eventId: string) => {
    return api.post(`/api/events/${eventId}/rsvp`);
  },
  cancelRsvp: async (eventId: string) => {
    return api.delete(`/api/events/${eventId}/rsvp`);
  },
  register: async (eventId: string, batchIndex?: number) => {
    return api.post(`/api/events/${eventId}/register`, { batchIndex });
  },
  cancelRegistration: async (eventId: string) => {
    return api.delete(`/api/events/${eventId}/register`);
  },
  getMyRegistrations: async () => {
    try {
      console.log('Fetching user event registrations from /api/users/me/registrations');
      // Use the correct endpoint for user registrations
      const response = await api.get('/api/users/me/registrations');
      
      // Structure the data correctly
      if (response.data && response.data.docs) {
        console.log(`Got ${response.data.docs.length} registrations`);
        
        // Add some logging to debug the response structure
        if (response.data.docs.length > 0) {
          const firstRegistration = response.data.docs[0];
          console.log('First registration structure:', {
            id: firstRegistration.id,
            status: firstRegistration.status,
            eventType: typeof firstRegistration.event,
            hasEventData: firstRegistration.event && typeof firstRegistration.event !== 'string',
            eventId: firstRegistration.event && typeof firstRegistration.event !== 'string' 
              ? firstRegistration.event.id : 'N/A'
          });
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      // Return empty array to avoid breaking the UI
      return { data: { docs: [] } };
    }
  },
  getEventRegistrations: async (eventId: string) => {
    return api.get(`/api/events/${eventId}/registrations`);
  },
  // Add function to check admin access
  checkAdminAccess: async () => {
    return auth.checkAdmin();
  },
  // Event Categories endpoints
  getCategories: async () => {
    return api.get('/api/event-categories');
  },
  getCategory: async (id: string) => {
    return api.get(`/api/event-categories/${id}`);
  },
  createCategory: async (categoryData: { name: string; description?: string }) => {
    return api.post('/api/event-categories', categoryData);
  },
  updateCategory: async (id: string, categoryData: { name?: string; description?: string }) => {
    return api.patch(`/api/event-categories/${id}`, categoryData);
  },
  deleteCategory: async (id: string) => {
    return api.delete(`/api/event-categories/${id}`);
  },
};

// News endpoints
export const news = {
  getAll: async (params?: any) => {
    return api.get('/api/news', { params });
  },
  getOne: async (slug: string) => {
    const normalizedSlug = normalizeSlug(slug);
    return api.get(`/api/news/${normalizedSlug}`);
  },
  getAnnouncements: async (limit = 6) => {
    return api.get('/api/news', { 
      params: { 
        where: { 
          isAnnouncement: { equals: true },
          status: { equals: 'published' }
        },
        sort: '-publishedDate',
        limit
      } 
    });
  },
  getNewsletters: async (limit = 10) => {
    return api.get('/api/news', { 
      params: { 
        where: { 
          category: { equals: 'newsletter' },
          status: { equals: 'published' }
        },
        sort: '-publishedDate',
        limit
      } 
    });
  },
  
  // Helper function to get events for news page
  getUpcomingEvents: async (limit = 4) => {
    const currentDate = new Date().toISOString();
    return api.get('/api/events', { 
      params: { 
        where: { 
          status: { equals: 'published' }
        },
        limit: 20 // Fetch more than we need to ensure we have enough after filtering
      } 
    });
  },
  getPastEvents: async (limit = 8) => {
    const currentDate = new Date().toISOString();
    return api.get('/api/events', { 
      params: { 
        where: { 
          status: { equals: 'published' }
        },
        limit: 20 // Fetch more than we need to ensure we have enough after filtering
      } 
    });
  }
};

// Programs endpoints
export const programs = {
  getAll: async (params?: any) => {
    console.log('Fetching all programs with params:', params);
    try {
      const response = await api.get('/api/programs', { params });
      console.log('Programs getAll response:', response.status);
      return response;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },
  getOne: async (slug: string) => {
    // Normalize the slug by removing trailing hyphens
    const normalizedSlug = normalizeSlug(slug);
    const isSlugNormalized = normalizedSlug !== slug;
    
    console.log('Fetching single program with slug:', slug);
    if (isSlugNormalized) {
      console.log('Normalized slug:', normalizedSlug);
    }
    
    // Try different approaches to get the program
    try {
      // Attempt 1: Try direct API call with normalized slug
      try {
        console.log('Attempt 1: Direct API call with normalized slug');
        const response = await api.get(`/api/programs/${normalizedSlug}`);
        console.log('Program found via direct API call, status:', response.status);
        return response;
      } catch (error: any) {
        console.error('Direct API call failed:', error.response?.status);
        
        // Attempt 2: Try to fetch all programs and find the matching one
        console.log('Attempt 2: Fetching all programs to find matching slug');
        const allProgramsResponse = await api.get('/api/programs');
        
        if (allProgramsResponse.data && allProgramsResponse.data.docs && allProgramsResponse.data.docs.length > 0) {
          // Find program with matching normalized slug
          const matchingProgram = allProgramsResponse.data.docs.find(
            (program: any) => normalizeSlug(program.slug) === normalizedSlug
          );
          
          if (matchingProgram) {
            console.log('Program found in list with title:', matchingProgram.title);
            return { data: matchingProgram, status: 200 };
          } else {
            console.error('Program not found in list of all programs');
            throw new Error('Program not found');
          }
        } else {
          console.error('No programs returned from API or invalid response format');
          throw error; // Re-throw original error if we couldn't find a match
        }
      }
    } catch (error) {
      console.error(`Error fetching program with slug ${normalizedSlug}:`, error);
      throw error;
    }
  },
};

// Facilities endpoints
export const facilities = {
  getAll: async (params?: any) => {
    return api.get('/api/facilities', { params });
  },
  getOne: async (slug: string) => {
    const normalizedSlug = normalizeSlug(slug);
    return api.get(`/api/facilities/${normalizedSlug}`);
  },
};

// Committee members endpoints
export const committeeMembers = {
  getAll: async (params?: any) => {
    return api.get('/api/committee-members', { params });
  },
  getActive: async () => {
    return api.get('/api/committee-members', { 
      params: { 
        where: { 
          active: { equals: true } 
        },
        sort: 'order' 
      } 
    });
  },
  getByType: async (type: string) => {
    return api.get('/api/committee-members', { 
      params: { 
        where: { 
          committeeType: { equals: type },
          active: { equals: true } 
        },
        sort: 'order',
        limit: 100
      } 
    });
  },
  getManagingCommittee: async () => {
    return api.get('/api/committee-members', { 
      params: { 
        where: { 
          committeeType: { equals: 'managing-committee' },
          active: { equals: true } 
        },
        sort: 'order'
      } 
    });
  },
  getGoverningCouncil: async () => {
    return api.get('/api/committee-members', { 
      params: { 
        where: { 
          committeeType: { equals: 'governing-council' },
          active: { equals: true } 
        },
        sort: 'order',
        limit: 100
      } 
    });
  },
  getSubcommittees: async () => {
    return api.get('/api/committee-members', { 
      params: { 
        where: { 
          committeeType: { equals: 'subcommittee' },
          active: { equals: true } 
        },
        sort: 'order'
      } 
    });
  },
  getSubcommitteesByType: async (subcommitteeType: string) => {
    return api.get('/api/committee-members', { 
      params: { 
        where: { 
          committeeType: { equals: 'subcommittee' },
          subcommitteeType: { equals: subcommitteeType },
          active: { equals: true } 
        },
        sort: 'order'
      } 
    });
  },
};

// Member endpoints
export const members = {
  updateProfile: async (data: any) => {
    return api.patch('/api/users/me', data);
  },
  getCertificates: async () => {
    return api.get('/api/users/me/certificates');
  },
  renewMembership: async (membershipType: string) => {
    return api.post('/api/users/me/renew', { membershipType });
  },
  getDirectory: async (options?: { page?: number, limit?: number, filter?: any }) => {
    const { page = 1, limit = 24, filter = {} } = options || {};
    
    try {
      const response = await api.get('/api/members/directory', {
        params: {
          page,
          limit,
          ...filter
        }
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching members directory:', error);
      throw error;
    }
  },
  
  getMember: async (id: string) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching member ${id}:`, error);
      throw error;
    }
  }
};

// Global data endpoints
export const globals = {
  getMainMenu: async () => {
    return api.get('/api/globals/main-menu');
  },
  getFooter: async () => {
    return api.get('/api/globals/footer');
  },
  getSiteSettings: async () => {
    return api.get('/api/globals/site-settings');
  },
};

// Activity logs endpoints
export const activityLogs = {
  getAll: async (params?: any) => {
    return api.get('/api/activity-logs', { params });
  },
};

// Import galleryApi
import { galleryApi } from './gallery';

// Export galleryApi
export { galleryApi };

export { bookingsApi } from './bookings';

export const getProgramBySlug = async (slug: string) => {
  try {
    const normalizedSlug = normalizeSlug(slug);
    const response = await api.get(`/api/programs/slug/${normalizedSlug}`);
    return response.data.docs[0] || null;
  } catch (error) {
    console.error('Error fetching program by slug:', error);
    return null;
  }
};

export const getAllPrograms = async (params = {}) => {
  try {
    console.log('getAllPrograms called with params:', params);
    const response = await api.get('/api/programs', { params });
    console.log('getAllPrograms response:', response.status, response.statusText);
    
    // Return the full response so the component can handle different data structures
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Error fetching programs:', error);
    // Throw the error to allow the component to handle it
    throw error;
  }
};

export default {
  auth,
  events,
  news,
  programs,
  facilities,
  committeeMembers,
  members,
  globals,
  activityLogs,
}; 