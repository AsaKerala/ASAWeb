'use client';

import React, { useState, useEffect } from 'react';
import { 
  AuthContext, 
  User, 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser 
} from './auth';

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from API on mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);
      setUser(user);
      setIsAuthenticated(true);
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 