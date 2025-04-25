import { User } from './types';

/**
 * Fetches the user profile from the API
 * @param {string} token - JWT token for authentication
 * @returns {Promise<User>} - User profile data
 */
export default async function getUserProfile(token?: string): Promise<User | null> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `JWT ${token}`;
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        return null;
      }
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
} 