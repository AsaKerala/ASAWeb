'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { members as membersApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SafeImage } from '@/components/common';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { format } from 'date-fns';

// Japanese language level mapping
const japaneseLanguageLevels: Record<string, string> = {
  'none': 'None',
  'n5': 'Basic (N5)',
  'n4': 'Elementary (N4)',
  'n3': 'Intermediate (N3)',
  'n2': 'Advanced (N2)',
  'n1': 'Proficient (N1)'
};

function MemberProfileContent() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await membersApi.getMember(id as string);
        setMember(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching member profile:', err);
        setError('Failed to load the member profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-zinc-700 mb-6">{error}</p>
            <Link href="/members/directory" className="inline-block px-6 py-3 bg-hinomaru-red text-white rounded-washi hover:bg-red-700 transition-colors">
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 mb-4">Member Not Found</h1>
            <p className="text-zinc-700 mb-6">The member profile you're looking for could not be found.</p>
            <Link href="/members/directory" className="inline-block px-6 py-3 bg-hinomaru-red text-white rounded-washi hover:bg-red-700 transition-colors">
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="container-custom">
          <Link 
            href="/members/directory" 
            className="inline-flex items-center text-white/80 mb-6 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Member Directory
          </Link>
          <h1 className="text-4xl font-bold mb-4">Member Profile</h1>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Left Column - Profile Picture and Basic Info */}
              <div className="md:w-1/3 p-8 bg-gray-50 border-r border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-hinomaru-red text-white flex items-center justify-center border border-gray-200 mb-4">
                    {member.profile?.profileImage ? (
                      <SafeImage
                        src={member.profile.profileImage.url}
                        alt={member.name}
                        fill
                        className="object-cover"
                        fallbackSrc={member.profile.profileImage.url}
                      />
                    ) : (
                      <span className="text-3xl font-bold">{member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-zinc-900 mb-1">{member.name}</h2>
                  
                  {member.profile?.position && (
                    <p className="text-zinc-600 mb-3">{member.profile.position}</p>
                  )}
                  
                  {member.membership?.membershipType && (
                    <span className={`inline-block px-3 py-1 text-sm rounded-full mb-6 ${
                      member.membership.membershipType === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                      member.membership.membershipType === 'lifetime' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {member.membership.membershipType.charAt(0).toUpperCase() + member.membership.membershipType.slice(1)} Member
                    </span>
                  )}
                  
                  {/* Social Links */}
                  {member.profile?.socialLinks && member.profile.socialLinks.length > 0 && (
                    <div className="flex gap-3 mt-6">
                      {member.profile.socialLinks.map((link: any, index: number) => {
                        // Determine icon based on platform
                        let icon;
                        switch(link.platform.toLowerCase()) {
                          case 'linkedin':
                            icon = (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                            );
                            break;
                          case 'twitter':
                          case 'x':
                            icon = (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            );
                            break;
                          case 'facebook':
                            icon = (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            );
                            break;
                          case 'github':
                            icon = (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            );
                            break;
                          case 'instagram':
                            icon = (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            );
                            break;
                          default:
                            icon = (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            );
                        }
                        
                        return (
                          <a 
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-hinomaru-red hover:text-white transition-colors"
                          >
                            {icon}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Membership details */}
                  {member.membership?.joinDate && (
                    <div className="mt-6 text-sm text-zinc-500">
                      Member since {format(new Date(member.membership.joinDate), 'MMMM yyyy')}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Detailed Information */}
              <div className="md:w-2/3 p-8">
                {/* Profile Bio */}
                {member.profile?.bio && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">About</h3>
                    <div className="text-zinc-700 prose">
                      {member.profile.bio}
                    </div>
                  </div>
                )}
                
                {/* Professional Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-4">Professional Details</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {member.profile?.currentOrganization && (
                      <div>
                        <dt className="text-sm font-medium text-zinc-500">Current Organization</dt>
                        <dd className="mt-1 text-zinc-900">{member.profile.currentOrganization}</dd>
                      </div>
                    )}
                    
                    {member.profile?.position && (
                      <div>
                        <dt className="text-sm font-medium text-zinc-500">Position</dt>
                        <dd className="mt-1 text-zinc-900">{member.profile.position}</dd>
                      </div>
                    )}
                    
                    {member.profile?.japanExperience && (
                      <div>
                        <dt className="text-sm font-medium text-zinc-500">Japan Experience</dt>
                        <dd className="mt-1 text-zinc-900">{member.profile.japanExperience}</dd>
                      </div>
                    )}
                    
                    {member.profile?.japaneseLanguage && member.profile.japaneseLanguage !== 'none' && (
                      <div>
                        <dt className="text-sm font-medium text-zinc-500">Japanese Language Proficiency</dt>
                        <dd className="mt-1 text-zinc-900">{japaneseLanguageLevels[member.profile.japaneseLanguage] || member.profile.japaneseLanguage}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                {/* Contact Information - Optional, depending on privacy settings */}
                {((member.email && member.profile?.showEmail) || member.profile?.phone) && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">Contact Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {member.email && member.profile?.showEmail && (
                        <div>
                          <dt className="text-sm font-medium text-zinc-500">Email</dt>
                          <dd className="mt-1 text-zinc-900">
                            <a href={`mailto:${member.email}`} className="text-hinomaru-red hover:underline">
                              {member.email}
                            </a>
                          </dd>
                        </div>
                      )}
                      
                      {member.profile?.phone && (
                        <div>
                          <dt className="text-sm font-medium text-zinc-500">Phone</dt>
                          <dd className="mt-1 text-zinc-900">
                            <a href={`tel:${member.profile.phone}`} className="text-hinomaru-red hover:underline">
                              {member.profile.phone}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="text-center mt-10">
            <Link href="/members/directory" className="inline-block px-6 py-3 bg-zinc-800 text-white rounded-washi hover:bg-zinc-900 transition-colors">
              Back to Member Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function MemberProfilePage() {
  return (
    <ProtectedRoute>
      <MemberProfileContent />
    </ProtectedRoute>
  );
} 