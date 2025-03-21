import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for authentication cookies
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // You can add logic here to add an auth token from localStorage or cookies
    // if needed for certain requests
    return config;
  },
  (error) => {
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
        console.error('Unauthorized access. Please log in again.');
        // You could redirect to login page or trigger auth refresh here
      }
      
      // Forbidden errors
      if (error.response.status === 403) {
        console.error('Access forbidden. You do not have permission to access this resource.');
      }
      
      // Server errors
      if (error.response.status >= 500) {
        console.error('Server error. Please try again later.');
      }
    }
    
    // Network errors
    if (error.request && !error.response) {
      console.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

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
};

// Events endpoints
export const events = {
  getAll: async (params?: any) => {
    return api.get('/api/events', { params });
  },
  getOne: async (slug: string) => {
    return api.get(`/api/events/${slug}`);
  },
  rsvp: async (eventId: string) => {
    return api.post(`/api/events/${eventId}/rsvp`);
  },
  cancelRsvp: async (eventId: string) => {
    return api.delete(`/api/events/${eventId}/rsvp`);
  },
};

// News endpoints
export const news = {
  getAll: async (params?: any) => {
    return api.get('/api/news', { params });
  },
  getOne: async (slug: string) => {
    return api.get(`/api/news/${slug}`);
  },
};

// Programs endpoints
export const programs = {
  getAll: async (params?: any) => {
    return api.get('/api/programs', { params });
  },
  getOne: async (slug: string) => {
    return api.get(`/api/programs/${slug}`);
  },
};

// Facilities endpoints
export const facilities = {
  getAll: async (params?: any) => {
    return api.get('/api/facilities', { params });
  },
  getOne: async (slug: string) => {
    return api.get(`/api/facilities/${slug}`);
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

export default {
  auth,
  events,
  news,
  programs,
  facilities,
  members,
  globals,
}; 