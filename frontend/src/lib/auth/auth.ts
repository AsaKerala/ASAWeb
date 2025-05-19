'use client';

import { auth as authApi } from '../api';
import { createContext, useContext } from 'react';
import axios from 'axios';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  profile?: {
    profileImage?: string;
    phone?: string;
    japanExperience?: string;
    japaneseLanguage?: string;
    currentOrganization?: string;
    position?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    bio?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
  membership?: {
    membershipType?: string;
    membershipStatus?: string;
    joinDate?: string;
    renewalDate?: string;
    memberID?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    newsletterSubscription?: boolean;
    eventReminders?: boolean;
    showProfileInDirectory?: boolean;
    directMessagePermission?: string;
  };
  connections?: string[];
  attendedEvents?: string[];
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAdminAccess: () => Promise<boolean>;
  loginWithRedirect: (redirectPath?: string) => void;
};

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    console.log('Sending login request to API...');
    const response = await authApi.login(email, password);
    console.log('Login response received:', { 
      status: response.status,
      statusText: response.statusText,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      userData: response.data.user ? { 
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role
      } : null 
    });
    
    // Check if the token was returned and store it
    if (response.data.token && typeof window !== 'undefined') {
      // Try/catch around localStorage operations to catch potential errors
      try {
        localStorage.removeItem('payload-token'); // Clear any existing token first
        localStorage.setItem('payload-token', response.data.token);
        console.log('Token stored in localStorage with length:', response.data.token.length);
        
        // Double-check the token was stored successfully
        const storedToken = localStorage.getItem('payload-token');
        if (!storedToken) {
          console.error('Failed to store token in localStorage!');
        } else {
          console.log('Token verification after storing successful, length:', storedToken.length);
        }
      } catch (storageError) {
        console.error('Error storing token in localStorage:', storageError);
      }
    } else {
      console.warn('No token received in login response!');
    }
    
    return response.data.user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Log more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('Login request failed with status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Request details:',  {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers ? 
          { ...error.config.headers, Authorization: error.config.headers.Authorization ? 'PRESENT' : 'NONE' } 
          : 'NONE'
      });
    }
    
    throw error;
  }
}

export async function registerUser(userData: any): Promise<User> {
  try {
    const response = await authApi.register(userData);
    return response.data.user;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await authApi.logout();
    
    // Always clear token from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('payload-token');
      console.log('Token removed from localStorage');
    }
  } catch (error) {
    console.error('Logout error:', error);
    
    // Clear token even on error
    if (typeof window !== 'undefined') {
      localStorage.removeItem('payload-token');
    }
    
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log('Fetching current user data from /api/users/me endpoint');
    const response = await authApi.me();
    
    console.log('Current user response:', {
      status: response.status,
      hasUser: !!response.data.user,
      userData: response.data.user ? {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role 
      } : null
    });
    
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    
    // Log additional information about the error
    if (axios.isAxiosError(error)) {
      console.error('  Status:', error.response?.status);
      console.error('  Message:', error.response?.data?.message || error.message);
    }
    
    return null;
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isMember(user: User | null): boolean {
  return user?.role === 'member' || user?.role === 'admin';
}

export function hasActiveMembership(user: User | null): boolean {
  if (!user) return false;
  return user.membership?.membershipStatus === 'active';
}

export async function checkAdminAccess(): Promise<boolean> {
  try {
    // First check if the user has admin role in their profile
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return false;
    }
    
    // Then try the admin endpoint, but handle 404 gracefully
    try {
      const response = await authApi.checkAdmin();
      return response.data.isAdmin === true;
    } catch (error: any) {
      console.error('Check admin error:', error);
      
      // If endpoint is not found (404), but user has admin role, still return true
      if (error.response && error.response.status === 404) {
        console.log('Admin check endpoint not found, falling back to role-based check');
        return user.role === 'admin';
      }
      
      return false;
    }
  } catch (error) {
    console.error('Check admin access error:', error);
    return false;
  }
}

// Create an auth context for React components
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => { 
    throw new Error('Not implemented');
    return {} as User; // unreachable but helps with typing
  },
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  checkAdminAccess: async () => false,
  loginWithRedirect: () => {}
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext); 