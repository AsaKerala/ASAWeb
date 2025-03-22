'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function CommitteePage() {
  const [activePeriod, setActivePeriod] = useState('current');
  
  // Current committee members (2022-2024)
  const managingCommittee = [
    {
      position: 'President',
      name: '[President Name]',
      bio: 'Brief background about the president, their professional career, and contribution to ASA Kerala.',
      photoUrl: null, // Will be replaced with actual photo
    },
    {
      position: 'Vice President',
      name: '[Vice President Name]',
      bio: 'Brief background about the vice president, their professional career, and contribution to ASA Kerala.',
      photoUrl: null,
    },
    {
      position: 'Secretary',
      name: '[Secretary Name]',
      bio: 'Brief background about the secretary, their professional career, and contribution to ASA Kerala.',
      photoUrl: null,
    },
    {
      position: 'Joint Secretary',
      name: '[Joint Secretary Name]',
      bio: 'Brief background about the joint secretary, their professional career, and contribution to ASA Kerala.',
      photoUrl: null,
    },
    {
      position: 'Treasurer',
      name: '[Treasurer Name]',
      bio: 'Brief background about the treasurer, their professional career, and contribution to ASA Kerala.',
      photoUrl: null,
    },
  ];
  
  const executiveCommittee = [
    {
      name: '[Executive Member 1]',
      role: 'Executive Committee Member',
      bio: 'Brief background about the executive committee member.',
      photoUrl: null,
    },
    {
      name: '[Executive Member 2]',
      role: 'Executive Committee Member',
      bio: 'Brief background about the executive committee member.',
      photoUrl: null,
    },
    {
      name: '[Executive Member 3]',
      role: 'Executive Committee Member',
      bio: 'Brief background about the executive committee member.',
      photoUrl: null,
    },
    {
      name: '[Executive Member 4]',
      role: 'Executive Committee Member',
      bio: 'Brief background about the executive committee member.',
      photoUrl: null,
    },
    {
      name: '[Executive Member 5]',
      role: 'Executive Committee Member',
      bio: 'Brief background about the executive committee member.',
      photoUrl: null,
    },
    {
      name: '[Executive Member 6]',
      role: 'Executive Committee Member',
      bio: 'Brief background about the executive committee member.',
      photoUrl: null,
    },
  ];
  
  // Past presidents (Arranged by term period)
  const pastPresidents = [
    { name: '[Past President 1]', period: '2020-2022', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 2]', period: '2018-2020', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 3]', period: '2016-2018', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 4]', period: '2014-2016', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 5]', period: '2012-2014', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 6]', period: '2010-2012', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 7]', period: '2008-2010', achievements: 'Key initiatives and achievements during their presidency.' },
    { name: '[Past President 8]', period: '2006-2008', achievements: 'Key initiatives and achievements during their presidency.' },
    // Add more past presidents as needed
  ];

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

      {/* Current Committee Section */}
      {activePeriod === 'current' && (
        <>
          {/* Managing Committee */}
          <section className="py-12">
            <div className="container-custom">
              <h2 className="section-title text-center mb-4 text-zinc-50">Managing Committee</h2>
              <p className="text-lg text-zinc-800 text-center mb-12 max-w-3xl mx-auto">
                Our managing committee comprises experienced professionals dedicated to furthering ASA Kerala's mission and objectives.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {managingCommittee.map((member, index) => (
                  <div key={index} className="japan-card text-center flex flex-col h-full">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      {member.photoUrl ? (
                        <Image src={member.photoUrl} alt={member.name} width={128} height={128} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-500 text-sm">Photo</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{member.position}</h3>
                    <p className="text-hinomaru-red font-medium mb-4">{member.name}</p>
                    <p className="text-zinc-700 text-sm flex-grow">{member.bio}</p>
                  </div>
                ))}
              </div>
              
              <h2 className="section-title text-center mb-4 text-zinc-50">Executive Committee</h2>
              <p className="text-lg text-zinc-800 text-center mb-12 max-w-3xl mx-auto">
                Our executive committee members help implement ASA Kerala's strategies and initiatives.
              </p>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {executiveCommittee.map((member, index) => (
                  <div key={index} className="japan-card p-6 text-center flex flex-col h-full">
                    <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      {member.photoUrl ? (
                        <Image src={member.photoUrl} alt={member.name} width={96} height={96} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-500 text-sm">Photo</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">{member.name}</h3>
                    <p className="text-hinomaru-red text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-zinc-700 text-sm flex-grow">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Committees and Working Groups */}
          <section className="py-12 bg-zinc-50">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <h2 className="section-title text-center mb-12">Committees & Working Groups</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="japan-card p-6">
                    <h3 className="text-xl font-bold text-hinomaru-red mb-4">Cultural Committee</h3>
                    <p className="text-zinc-700 mb-4">
                      Responsible for organizing cultural exchange programs, events, and activities that promote Japanese culture in Kerala and introduce Kerala's culture to Japanese visitors and residents.
                    </p>
                    <div className="text-sm text-zinc-800 font-medium">
                      Chair: [Cultural Committee Chair]
                    </div>
                  </div>
                  
                  <div className="japan-card p-6">
                    <h3 className="text-xl font-bold text-hinomaru-red mb-4">Training & Development Committee</h3>
                    <p className="text-zinc-700 mb-4">
                      Oversees the planning and implementation of training programs, workshops, and seminars on Japanese management principles, industrial techniques, and work culture.
                    </p>
                    <div className="text-sm text-zinc-800 font-medium">
                      Chair: [Training Committee Chair]
                    </div>
                  </div>
                  
                  <div className="japan-card p-6">
                    <h3 className="text-xl font-bold text-hinomaru-red mb-4">Membership Committee</h3>
                    <p className="text-zinc-700 mb-4">
                      Focuses on recruiting new members, maintaining relationships with existing members, and enhancing member benefits and engagement.
                    </p>
                    <div className="text-sm text-zinc-800 font-medium">
                      Chair: [Membership Committee Chair]
                    </div>
                  </div>
                  
                  <div className="japan-card p-6">
                    <h3 className="text-xl font-bold text-hinomaru-red mb-4">Business Networking Committee</h3>
                    <p className="text-zinc-700 mb-4">
                      Facilitates business connections and partnerships between Japanese and Kerala companies, organizing networking events, trade delegations, and business seminars.
                    </p>
                    <div className="text-sm text-zinc-800 font-medium">
                      Chair: [Business Committee Chair]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Past Presidents Section */}
      {activePeriod === 'past' && (
        <section className="py-12">
          <div className="container-custom">
            <h2 className="section-title text-center mb-4 text-zinc-50">Past Presidents</h2>
            <p className="text-lg text-zinc-800 text-center mb-12 max-w-3xl mx-auto">
              We honor the leaders who have shaped ASA Kerala's journey through the years with their vision, dedication, and service.
            </p>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8 relative">
                {/* Vertical timeline line */}
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-hinomaru-red"></div>
                
                {pastPresidents.map((president, index) => (
                  <div key={index} className="flex gap-6 items-start relative">
                    <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-hinomaru-red text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                      <span className="text-sm">{index + 1}</span>
                    </div>
                    <div className="japan-card flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                        <h3 className="text-xl font-bold text-zinc-900">{president.name}</h3>
                        <div className="text-hinomaru-red font-medium text-sm md:text-base">{president.period}</div>
                      </div>
                      <p className="text-zinc-700">{president.achievements}</p>
                    </div>
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