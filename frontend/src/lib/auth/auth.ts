'use client';

import { auth as authApi } from '../api';
import { createContext, useContext } from 'react';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  profileImage?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  membershipDetails?: {
    memberSince: string;
    membershipType: string;
    renewalDate: string;
    isActive: boolean;
  };
  eventsAttended?: any[];
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const response = await authApi.login(email, password);
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(userData: any): Promise<User> {
  try {
    const response = await authApi.register(userData);
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await authApi.me();
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
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
  return user.membershipDetails?.isActive ?? false;
}

// Create an auth context for React components
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext); 