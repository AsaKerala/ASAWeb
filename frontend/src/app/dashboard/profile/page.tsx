'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import { members } from '@/lib/api';
import Link from 'next/link';

// Define a type for API errors
type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
};

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Populate form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'United States',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Transform form data
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      // Call API to update profile
      await members.updateProfile(profileData);
      
      // Refresh user data
      await refreshUser();
      
      setStatus('success');
      setMessage('Profile updated successfully!');
      
      // Reset status after a delay
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      setStatus('error');
      const error = err as ApiErrorResponse;
      setMessage(error?.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmNewPassword) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setStatus('error');
      setMessage('New password must be at least 8 characters long.');
      return;
    }
    
    setStatus('loading');
    setMessage('');

    try {
      // Call API to update password
      await members.updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setStatus('success');
      setMessage('Password updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
      
      // Reset status after a delay
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (err: unknown) {
      console.error('Password update error:', err);
      setStatus('error');
      const error = err as ApiErrorResponse;
      setMessage(error?.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  if (isLoading || (!user && isAuthenticated)) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
        <div className="w-full max-w-6xl p-8">
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Page Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-gray-900">Profile Settings</h1>
              <Link
                href="/dashboard"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'general'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                Password
              </button>
            </nav>
          </div>

          {/* Status Messages */}
          {message && (
            <div 
              className={`mx-6 mt-4 p-3 rounded-md ${
                status === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* General Information Tab */}
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Contact administrator for assistance.</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Password Change Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 