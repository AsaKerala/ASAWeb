'use client';

import { useState, useEffect } from 'react';
import { members as membersApi } from '@/lib/api';
import Image from 'next/image';
import { SafeImage } from '@/components/common';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Member type definition based on the API response format
interface Member {
  id: string;
  name: string;
  profile?: {
    profileImage?: {
      url: string;
    };
    currentOrganization?: string;
    position?: string;
    japanExperience?: string;
    japaneseLanguage?: string;
    bio?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
  membership?: {
    membershipType?: string;
    joinDate?: string;
  };
}

// Define Japanese language level mapping
const japaneseLanguageLevels: Record<string, string> = {
  'none': 'None',
  'n5': 'Basic (N5)',
  'n4': 'Elementary (N4)',
  'n3': 'Intermediate (N3)',
  'n2': 'Advanced (N2)',
  'n1': 'Proficient (N1)'
};

function MemberDirectoryContent() {
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Default to list view

  // Fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await membersApi.getDirectory({
          page: currentPage,
          limit: 24,
          // Add filter criteria if needed
        });
        
        setMembersList(response.data.docs || []);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load member directory. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage]);

  // Filter members based on search term and filter
  const filteredMembers = membersList.filter(member => {
    const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const orgMatch = member.profile?.currentOrganization?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const bioMatch = member.profile?.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    const matchesSearch = nameMatch || orgMatch || bioMatch;
    
    if (filter === 'all') return matchesSearch;
    
    // Additional filters by membership type or other criteria
    if (filter === 'premium' && member.membership?.membershipType === 'premium') return matchesSearch;
    if (filter === 'lifetime' && member.membership?.membershipType === 'lifetime') return matchesSearch;
    if (filter === 'regular' && member.membership?.membershipType === 'regular') return matchesSearch;
    
    return false;
  });

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Header */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Member Directory</h1>
          <p className="text-xl max-w-3xl">
            Connect with fellow ASA Kerala members who have studied, trained, or worked in Japan.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            {/* Search Box */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, organization, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-washi focus:outline-none focus:ring-2 focus:ring-hinomaru-red"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="w-full md:w-auto flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-washi focus:outline-none focus:ring-2 focus:ring-hinomaru-red"
              >
                <option value="all">All Members</option>
                <option value="premium">Premium Members</option>
                <option value="lifetime">Lifetime Members</option>
                <option value="regular">Regular Members</option>
              </select>
              
              {/* View Toggle Button */}
              <button 
                onClick={toggleViewMode}
                className="px-4 py-3 border border-gray-300 rounded-washi bg-white hover:bg-gray-50 transition-colors flex items-center"
              >
                {viewMode === 'grid' ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List View
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid View
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
              <button
                onClick={() => setCurrentPage(1)}
                className="mt-4 px-6 py-2 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              <p>No members found matching your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-4 px-6 py-2 bg-hinomaru-red text-white rounded-washi hover:bg-sakura-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                /* Grid View (Cards) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-hinomaru-red text-white flex items-center justify-center border border-gray-200 mr-4">
                            {member.profile?.profileImage ? (
                              <SafeImage
                                src={member.profile.profileImage.url}
                                alt={member.name}
                                fill
                                className="object-cover"
                                fallbackSrc={member.profile.profileImage.url}
                              />
                            ) : (
                              <span className="text-xl font-bold">{member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-zinc-900">{member.name}</h3>
                            {member.profile?.position && (
                              <p className="text-sm text-gray-600">{member.profile.position}</p>
                            )}
                          </div>
                        </div>
                        
                        {member.profile?.currentOrganization && (
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-zinc-700">Organization:</span>
                            <p className="text-sm text-zinc-600">{member.profile.currentOrganization}</p>
                          </div>
                        )}
                        
                        {member.profile?.japaneseLanguage && member.profile.japaneseLanguage !== 'none' && (
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-zinc-700">Japanese Level:</span>
                            <p className="text-sm text-zinc-600">{japaneseLanguageLevels[member.profile.japaneseLanguage] || member.profile.japaneseLanguage}</p>
                          </div>
                        )}
                        
                        {member.profile?.bio && (
                          <div className="mb-4">
                            <p className="text-sm text-zinc-700 line-clamp-3">{member.profile.bio}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                          {/* Social Links or Member Type Badge */}
                          <div>
                            {member.membership?.membershipType && (
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                member.membership.membershipType === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                                member.membership.membershipType === 'lifetime' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {member.membership.membershipType.charAt(0).toUpperCase() + member.membership.membershipType.slice(1)} Member
                              </span>
                            )}
                          </div>
                          
                          {/* View Profile Link */}
                          <Link
                            href={`/members/profile/${member.id}`}
                            className="text-hinomaru-red hover:text-sakura-700 font-medium text-sm flex items-center"
                          >
                            View Profile
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Japanese Level</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                {member.profile?.profileImage ? (
                                  <SafeImage
                                    src={member.profile.profileImage.url}
                                    alt={member.name}
                                    fill
                                    className="rounded-full object-cover"
                                    fallbackSrc={member.profile.profileImage.url}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-hinomaru-red text-white flex items-center justify-center">
                                    <span className="font-bold">{member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                {member.profile?.position && (
                                  <div className="text-sm text-gray-500">{member.profile.position}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.profile?.currentOrganization || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {member.profile?.japaneseLanguage && member.profile.japaneseLanguage !== 'none' 
                                ? japaneseLanguageLevels[member.profile.japaneseLanguage] || member.profile.japaneseLanguage
                                : 'N/A'
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {member.membership?.membershipType && (
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                member.membership.membershipType === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                                member.membership.membershipType === 'lifetime' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {member.membership.membershipType.charAt(0).toUpperCase() + member.membership.membershipType.slice(1)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/members/profile/${member.id}`}
                              className="text-hinomaru-red hover:text-sakura-700"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="flex">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`mx-1 p-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-hinomaru-red hover:bg-hinomaru-red/10'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`mx-1 w-10 h-10 rounded-md ${
                            currentPage === pageNum
                              ? 'bg-hinomaru-red text-white'
                              : 'text-zinc-700 hover:bg-hinomaru-red/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`mx-1 p-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-hinomaru-red hover:bg-hinomaru-red/10'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function MemberDirectoryPage() {
  return (
    <ProtectedRoute>
      <MemberDirectoryContent />
    </ProtectedRoute>
  );
} 