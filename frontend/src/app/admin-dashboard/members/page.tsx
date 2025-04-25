'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  membership?: {
    membershipType?: string;
    membershipStatus?: string;
    renewalDate?: string;
    joinDate?: string;
    memberID?: string;
  };
  membershipStatus?: string;
  membershipType?: string;
  membershipExpiryDate?: string;
  joinDate?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'member'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);

  // Use useCallback to prevent unnecessary recreation of this function
  const fetchUsers = useCallback(async () => {
    // Skip fetching if users are already loaded
    if (hasLoadedUsers) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch users with depth to get their membership details
      const response = await api.get('/api/users', {
        params: {
          depth: 2, // Increase depth to get nested membership data
          limit: 100,
        }
      });

      let fetchedUsers = response.data.docs || [];
      
      // Process users to normalize membership data
      const processedUsers = fetchedUsers.map((user: User) => {
        // Extract membership data from nested structure
        if (user.membership) {
          return {
            ...user,
            membershipStatus: user.membership.membershipStatus,
            membershipType: user.membership.membershipType,
            membershipExpiryDate: user.membership.renewalDate,
            joinDate: user.membership.joinDate
          };
        }
        return user;
      });
      
      // Separate regular members and admins
      const admins: User[] = [];
      const regularMembers: User[] = [];
      
      processedUsers.forEach((user: User) => {
        if (user.role === 'admin') {
          admins.push(user);
        } else {
          regularMembers.push(user);
        }
      });

      // Sort members by name
      regularMembers.sort((a: User, b: User) => 
        a.name.localeCompare(b.name)
      );
      
      // Sort admins by name
      admins.sort((a: User, b: User) => 
        a.name.localeCompare(b.name)
      );

      console.log('Processed members:', regularMembers);
      setMembers(regularMembers);
      setAdminUsers(admins);
      setHasLoadedUsers(true);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Function to manually refresh data if needed
  const refreshData = () => {
    setHasLoadedUsers(false);
    fetchUsers();
  };

  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter users based on search term and filters
  const getFilteredMembers = () => {
    let filtered = [...members];
    if (filterRole === 'admin') {
      filtered = [...adminUsers];
    } else if (filterRole === 'all') {
      filtered = [...members, ...adminUsers];
    }

    // Filter by membership status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => {
        if (filterStatus === 'active' && member.membershipStatus === 'active') return true;
        if (filterStatus === 'expired' && member.membershipStatus === 'expired') return true;
        if (filterStatus === 'pending' && member.membershipStatus === 'pending') return true;
        return false;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(term) || 
        member.email.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  // Get membership status display
  const getMembershipStatusDisplay = (status?: string) => {
    if (!status) return 'N/A';
    
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Expired
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  const filteredMembers = getFilteredMembers();

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Member Management</h1>
        <p className="text-zinc-600 mt-1">
          View and manage member accounts
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600">Loading members...</p>
        </div>
      ) : (
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link 
              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/users/create`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-hinomaru-red hover:bg-hinomaru-red/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Member
            </Link>
            <button
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 border border-zinc-300 text-sm font-medium rounded-md shadow-sm text-zinc-700 bg-white hover:bg-zinc-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>

          {/* Filter and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-zinc-700 mb-1">
                  Search Members
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Name or email"
                  className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-zinc-700 mb-1">
                  Role
                </label>
                <select
                  id="role-filter"
                  className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'member')}
                >
                  <option value="all">All Roles</option>
                  <option value="member">Regular Members</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-zinc-700 mb-1">
                  Membership Status
                </label>
                <select
                  id="status-filter"
                  className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-hinomaru-red focus:ring-hinomaru-red text-black"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'expired' | 'pending')}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Membership Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Membership Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-zinc-500">
                        No members found matching the criteria
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-hinomaru-red text-white flex items-center justify-center">
                              <span className="font-medium text-sm">
                                {member.name
                                  .split(' ')
                                  .map(name => name[0])
                                  .join('')
                                  .toUpperCase()
                                  .substring(0, 2)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-zinc-900">{member.name}</div>
                              <div className="text-xs text-zinc-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getMembershipStatusDisplay(member.membershipStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {member.membershipType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {member.membershipExpiryDate ? formatDate(member.membershipExpiryDate) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                          {member.joinDate ? formatDate(member.joinDate) : formatDate(member.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3 justify-end">
                            <Link
                              href={`${process.env.NEXT_PUBLIC_API_URL}/admin/collections/users/${member.id}`}
                              target="_blank"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin-dashboard/members/${member.id}/registrations`}
                              className="text-green-600 hover:text-green-900"
                            >
                              View Registrations
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-2">Total Members</h3>
              <p className="text-3xl font-bold text-hinomaru-red">
                {members.length + adminUsers.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-2">Active Memberships</h3>
              <p className="text-3xl font-bold text-green-600">
                {members.filter(m => m.membershipStatus === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-2">Expired Memberships</h3>
              <p className="text-3xl font-bold text-red-600">
                {members.filter(m => m.membershipStatus === 'expired').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-2">Administrators</h3>
              <p className="text-3xl font-bold text-purple-600">
                {adminUsers.length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMembersPage; 