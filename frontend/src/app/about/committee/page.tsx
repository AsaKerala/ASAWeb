'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { committeeMembers } from '@/lib/api';
import SafeImage from '@/components/common/SafeImage';

interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  photo?: {
    url: string;
    alt?: string;
  };
  email?: string;
  linkedIn?: string;
  order?: number;
  committeeType: string;
  subcommitteeType?: string;
}

interface SubcommitteeData {
  [key: string]: {
    title: string;
    members: CommitteeMember[];
  };
}

export default function CommitteePage() {
  const [activePeriod, setActivePeriod] = useState('current');
  const [managingCommittee, setManagingCommittee] = useState<CommitteeMember[]>([]);
  const [governingCouncil, setGoverningCouncil] = useState<CommitteeMember[]>([]);
  const [subcommittees, setSubcommittees] = useState<SubcommitteeData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch committee members from the backend
  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        setLoading(true);
        
        // Fetch all active committee members
        const allCommitteeRes = await committeeMembers.getActive();
        const allMembers = allCommitteeRes.data.docs || [];
        
        // Filter for managing committee members
        const managingMembers = allMembers.filter((member: CommitteeMember) => 
          member.committeeType === 'managing-committee' || 
          ['president', 'vice-president', 'secretary', 'joint-secretary', 'treasurer'].includes(member.position)
        );
        setManagingCommittee(managingMembers.length > 0 ? managingMembers : []);
        
        // Filter for governing council members
        const councilMembers = allMembers.filter((member: CommitteeMember) => 
          member.committeeType === 'governing-council'
        );
        setGoverningCouncil(councilMembers.length > 0 ? councilMembers : []);
        
        // Process subcommittee data and group by type
        const subcommitteeData: SubcommitteeData = {};
        const subcommitteeMembers = allMembers.filter((member: CommitteeMember) => 
          member.committeeType === 'subcommittee'
        );
        
        subcommitteeMembers.forEach((member: CommitteeMember) => {
          if (!member.subcommitteeType) return;
          
          if (!subcommitteeData[member.subcommitteeType]) {
            let title = '';
            switch (member.subcommitteeType) {
              case 'infrastructure-committee':
                title = 'Infrastructure Management Committee';
                break;
              case 'saturday-meet-committee':
                title = 'Saturday Meet Committee';
                break;
              case 'business-circle':
                title = 'Business Circle';
                break;
              case 'training-committee':
                title = 'Training Committee';
                break;
              default:
                title = 'Committee';
            }
            
            subcommitteeData[member.subcommitteeType] = {
              title,
              members: []
            };
          }
          
          subcommitteeData[member.subcommitteeType].members.push(member);
        });
        
        // If any subcommittee has no members, create placeholders
        const subcommitteeTypes = [
          'infrastructure-committee',
          'saturday-meet-committee',
          'business-circle',
          'training-committee'
        ];
        
        subcommitteeTypes.forEach((type) => {
          if (!subcommitteeData[type]) {
            let title = '';
            switch (type) {
              case 'infrastructure-committee':
                title = 'Infrastructure Management Committee';
                break;
              case 'saturday-meet-committee':
                title = 'Saturday Meet Committee';
                break;
              case 'business-circle':
                title = 'Business Circle';
                break;
              case 'training-committee':
                title = 'Training Committee';
                break;
              default:
                title = 'Committee';
            }
            
            subcommitteeData[type] = {
              title,
              members: [
                {
                  id: `placeholder-chair-${type}`,
                  name: 'TBD',
                  position: 'chairperson',
                  bio: 'Committee Chairperson',
                  committeeType: 'subcommittee',
                  subcommitteeType: type
                },
                {
                  id: `placeholder-member1-${type}`,
                  name: 'TBD',
                  position: 'committee-member',
                  bio: 'Committee Member',
                  committeeType: 'subcommittee',
                  subcommitteeType: type
                },
                {
                  id: `placeholder-member2-${type}`,
                  name: 'TBD',
                  position: 'committee-member',
                  bio: 'Committee Member',
                  committeeType: 'subcommittee',
                  subcommitteeType: type
                }
              ]
            };
          }
        });
        
        setSubcommittees(subcommitteeData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching committee data:', err);
        setError('Failed to load committee data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCommitteeData();
  }, []);
  
  // Generate placeholder data if no data is fetched
  useEffect(() => {
    if (!loading && managingCommittee.length === 0) {
      // Create placeholder managing committee if none exists
      setManagingCommittee([
        {
          id: 'placeholder-president',
          name: 'TBD',
          position: 'president',
          bio: 'President of ASA Kerala',
          committeeType: 'managing-committee'
        },
        {
          id: 'placeholder-vice-president',
          name: 'TBD',
          position: 'vice-president',
          bio: 'Vice President of ASA Kerala',
          committeeType: 'managing-committee'
        },
        {
          id: 'placeholder-secretary',
          name: 'TBD',
          position: 'secretary',
          bio: 'Secretary of ASA Kerala',
          committeeType: 'managing-committee'
        },
        {
          id: 'placeholder-joint-secretary',
          name: 'TBD',
          position: 'joint-secretary',
          bio: 'Joint Secretary of ASA Kerala',
          committeeType: 'managing-committee'
        },
        {
          id: 'placeholder-treasurer',
          name: 'TBD',
          position: 'treasurer',
          bio: 'Treasurer of ASA Kerala',
          committeeType: 'managing-committee'
        }
      ]);
    }
    
    if (!loading && governingCouncil.length === 0) {
      // Create 25 placeholder governing council members if none exist
      const placeholderCouncil = Array.from({ length: 25 }, (_, i) => ({
        id: `placeholder-council-${i}`,
        name: `Council Member ${i + 1}`,
        position: 'committee-member',
        bio: 'Governing Council Member',
        committeeType: 'governing-council'
      }));
      
      setGoverningCouncil(placeholderCouncil);
    }
  }, [loading, managingCommittee.length, governingCouncil.length]);
  
  // Past presidents (Arranged by term period)
  const pastPresidents = [
    { 
      name: '[Past President 1]', 
      period: '2020-2022', 
      photo: null 
    },
    { 
      name: '[Past President 2]', 
      period: '2018-2020', 
      photo: null 
    },
    { 
      name: '[Past President 3]', 
      period: '2016-2018', 
      photo: null 
    },
    { 
      name: '[Past President 4]', 
      period: '2014-2016', 
      photo: null 
    },
    { 
      name: '[Past President 5]', 
      period: '2012-2014', 
      photo: null 
    },
    { 
      name: '[Past President 6]', 
      period: '2010-2012', 
      photo: null 
    },
    { 
      name: '[Past President 7]', 
      period: '2008-2010', 
      photo: null 
    },
    { 
      name: '[Past President 8]', 
      period: '2006-2008', 
      photo: null 
    },
  ];
  
  // Helper function to format position title
  const formatPosition = (position: string): string => {
    return position
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Leadership Team</h1>
            <p className="text-xl">Meet the dedicated individuals who guide ASA Kerala's mission and vision</p>
          </div>
        </div>
      </section>

      {/* Period Selector */}
      <section className="py-8 bg-white sticky top-0 z-20 shadow-sm">
        <div className="container-custom">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActivePeriod('current')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activePeriod === 'current'
                  ? 'bg-hinomaru-red text-white'
                  : 'bg-gray-100 text-zinc-700 hover:bg-gray-200'
              }`}
            >
              Current Committee
            </button>
            <button
              onClick={() => setActivePeriod('past')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activePeriod === 'past'
                  ? 'bg-hinomaru-red text-white'
                  : 'bg-gray-100 text-zinc-700 hover:bg-gray-200'
              }`}
            >
              Past Presidents
            </button>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
          <p className="mt-4 text-lg">Loading committee information...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="py-20 text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-hinomaru-red text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Current Committee Section */}
      {activePeriod === 'current' && !loading && !error && (
        <>
          {/* Managing Committee */}
          <section className="py-12">
            <div className="container-custom">
              <h2 className="section-title text-center mb-4 text-hinomaru-red">Managing Committee</h2>
              <p className="text-lg text-zinc-800 text-center mb-12 max-w-3xl mx-auto">
                Our managing committee comprises experienced professionals dedicated to furthering ASA Kerala's mission and objectives.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {managingCommittee.map((member) => (
                  <div key={member.id} className="japan-card text-center flex flex-col h-full">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      {member.photo ? (
                        <SafeImage
                          src={member.photo.url}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                          fallbackSrc="/assets/placeholder-user.png"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Photo</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{formatPosition(member.position)}</h3>
                    <p className="text-hinomaru-red font-medium mb-4">{member.name}</p>
                    <p className="text-zinc-700 text-sm flex-grow">{member.bio || 'Committee member of ASA Kerala'}</p>
                  </div>
                ))}
              </div>
              
              <h2 className="section-title text-center mb-4 text-hinomaru-red">Governing Council</h2>
              <p className="text-lg text-zinc-800 text-center mb-12 max-w-3xl mx-auto">
                Our governing council members help implement ASA Kerala's strategies and initiatives.
              </p>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                {governingCouncil.map((member) => (
                  <div key={member.id} className="japan-card p-6 text-center flex flex-col h-full">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {member.photo ? (
                        <SafeImage
                          src={member.photo.url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                          fallbackSrc="/assets/placeholder-user.png"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Photo</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">{member.name}</h3>
                    <p className="text-hinomaru-red text-sm font-medium mb-3">{formatPosition(member.position)}</p>
                    <p className="text-zinc-700 text-sm flex-grow">{member.bio || 'Governing Council member'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Committees and Working Groups */}
          <section className="py-12 bg-zinc-50">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <h2 className="section-title text-center mb-12">Subcommittees</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {Object.values(subcommittees).map((committee, index) => (
                    <div key={index} className="japan-card p-6">
                      <h3 className="text-xl font-bold text-hinomaru-red mb-4">{committee.title}</h3>
                      <div className="space-y-4 mb-4">
                        {committee.members.map((member, i) => (
                          <div key={member.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {member.photo ? (
                                <SafeImage
                                  src={member.photo.url}
                                  alt={member.name}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                  fallbackSrc="/assets/placeholder-user.png"
                                />
                              ) : (
                                <span className="text-gray-500 text-xs">Photo</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-hinomaru-red">{formatPosition(member.position)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Past Presidents Section */}
      {activePeriod === 'past' && !loading && !error && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="section-title text-center mb-4 text-hinomaru-red">Past Presidents</h2>
            <p className="text-lg text-zinc-800 text-center mb-12 max-w-3xl mx-auto">
              We honor the leaders who have shaped ASA Kerala's journey through the years with their vision, dedication, and service.
            </p>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastPresidents.map((president, index) => (
                  <div key={index} className="japan-card text-center p-6">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {president.photo ? (
                        <SafeImage
                          src={president.photo}
                          alt={president.name}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                          fallbackSrc="/assets/placeholder-user.png"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Photo</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{president.name}</h3>
                    <p className="text-hinomaru-red">{president.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Message from the President */}
      <section className="py-12 bg-zinc-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-10">Message from the President</h2>
            <div className="japan-card p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500 text-sm">President's Photo</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">[President's Name]</h3>
                  <p className="text-hinomaru-red font-medium mb-4">President, ASA Kerala</p>
                  <p className="text-sm text-zinc-600 mb-4">Term: 2022-2024</p>
                </div>
              </div>
              
              <div className="space-y-4 text-zinc-800">
                <p>
                  Dear Members and Friends of ASA Kerala,
                </p>
                <p>
                  It is my honor to serve as the President of ASA Kerala, an organization with a rich history of fostering Indo-Japanese relations through knowledge exchange, cultural understanding, and business collaboration.
                </p>
                <p>
                  As we navigate the ever-evolving global landscape, our mission to bridge Kerala and Japan remains steadfast. We are committed to creating valuable opportunities for our members, enhancing the impact of our training programs, and strengthening our cultural exchange initiatives.
                </p>
                <p>
                  I am privileged to work alongside a dedicated team of committee members who bring diverse expertise and perspectives to our organization. Together, we strive to uphold the values and traditions that have defined ASA Kerala while embracing innovation and new ideas to meet the needs of our members and the broader community.
                </p>
                <p>
                  I invite you to engage with our programs, connect with fellow members, and contribute to our shared mission. Whether you are a long-standing member or new to our community, your participation and support are invaluable to our success.
                </p>
                <p>
                  Thank you for your continued trust and involvement in ASA Kerala.
                </p>
                <p className="font-medium">
                  Sincerely,<br />
                  [President's Signature]<br />
                  [President's Name]<br />
                  President, ASA Kerala
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Structure */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-10 text-zinc-50">Our Governance Structure</h2>
            <div className="japan-card p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-hinomaru-red mb-4">Organizational Structure</h3>
                <p className="text-zinc-800 mb-4">
                  ASA Kerala operates under a democratic governance structure with elected officials serving two-year terms. Our organizational hierarchy includes:
                </p>
                <ul className="space-y-2 text-zinc-800 list-disc pl-6">
                  <li>General Body (All members)</li>
                  <li>Managing Committee (Elected officials)</li>
                  <li>Executive Committee (Managing Committee + Committee Chairs)</li>
                  <li>Specialized Committees and Working Groups</li>
                  <li>Administrative Staff</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-hinomaru-red mb-4">Election Process</h3>
                <p className="text-zinc-800 mb-4">
                  Elections for the Managing Committee are held every two years during the Annual General Meeting. All active members in good standing are eligible to vote and contest for positions. The election process is overseen by an independent Election Committee appointed by the outgoing Managing Committee.
                </p>
                <p className="text-zinc-800">
                  The newly elected committee takes office within one month of the election, following a formal handover ceremony that honors the organization's traditions while embracing new leadership and ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 