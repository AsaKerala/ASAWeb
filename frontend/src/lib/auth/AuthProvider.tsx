'use client';

import React, { useState, useEffect } from 'react';
import { 
  AuthContext, 
  User, 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  checkAdminAccess 
} from './auth';

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load user from API on mount and check admin status
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      // Check for token in localStorage first
      const token = typeof window !== 'undefined' ? localStorage.getItem('payload-token') : null;
      console.log('AuthProvider init - Token exists?', !!token);
      
      // If no token exists, don't even try to load the user
      if (!token) {
        console.log('No token found, setting not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Token found, loading user data...');
        const currentUser = await getCurrentUser();
        console.log('User data response:', currentUser ? 
          { id: currentUser.id, email: currentUser.email, role: currentUser.role } : 'No user data');
        
        if (currentUser) {
          console.log('User loaded successfully');
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Only check admin status if user exists and has role admin
          if (currentUser.role === 'admin') {
            const admin = await checkAdminAccess();
            setIsAdmin(admin);
            console.log('Admin status check:', admin);
          } else {
            setIsAdmin(false);
          }
        } else {
          console.log('User data not returned despite token');
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          // Token might be invalid, remove it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('payload-token');
            console.log('Token removed due to invalid state');
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        // Error with token, remove it
        if (typeof window !== 'undefined') {
          localStorage.removeItem('payload-token');
          console.log('Token removed due to error');
        }
      } finally {
        setIsLoading(false);
        console.log('Auth loading complete - authenticated:', isAuthenticated);
      }
    };

    // Immediately invoke loadUser
    loadUser();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      setIsAuthenticated(true);
      
      // Check admin status
      if (user.role === 'admin') {
        const admin = await checkAdminAccess();
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      
      return user; // Return the user object
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const user = await registerUser(userData);
      setUser(user);
      setIsAuthenticated(true);
      // New users are typically not admins
      setIsAdmin(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data and check admin status
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Check admin status
        if (currentUser.role === 'admin') {
          const admin = await checkAdminAccess();
          setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to check admin access
  const checkAdminAccessFn = async () => {
    try {
      return await checkAdminAccess();
    } catch (error) {
      console.error('Failed to check admin access:', error);
      return false;
    }
  };

  // Function to redirect to login with a return URL
  const loginWithRedirect = (redirectPath?: string) => {
    if (typeof window !== 'undefined') {
      // Store the return URL in localStorage
      if (redirectPath) {
        localStorage.setItem('auth-redirect', redirectPath);
      } else {
        // If no specific path provided, store current URL as return destination
        localStorage.setItem('auth-redirect', window.location.pathname);
      }
      
      // Redirect to login page
      window.location.href = '/auth/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        checkAdminAccess: checkAdminAccessFn,
        loginWithRedirect
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 