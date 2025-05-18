'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { committeeMembers } from '@/lib/api';
import { CommitteeMember } from '@/lib/api/types';
import SafeImage from '@/components/common/SafeImage';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [committeeData, setCommitteeData] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check URL for tab parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['overview', 'history', 'aots', 'team', 'affiliations'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Function to update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL without refreshing page
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
    }
  };

  // Fetch committee members from the CMS
  useEffect(() => {
    const fetchCommitteeMembers = async () => {
      try {
        setLoading(true);
        const response = await committeeMembers.getActive();
        setCommitteeData(response.data.docs);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch committee members:', err);
        setError('Failed to load committee members. Please try again later.');
        setLoading(false);
      }
    };

    if (activeTab === 'team') {
      fetchCommitteeMembers();
    }
  }, [activeTab]);

  const milestones = [
    { year: 1968, description: 'Formation of ASA Kerala with a mission to disseminate Japanese industrial knowledge.' },
    { year: 1980, description: 'Expansion of training initiatives and collaboration with Indian industries.' },
    { year: 2000, description: 'Increased participation in AOTS management and technical training programs.' },
    { year: 2010, description: 'Establishment of Nippon Kerala Centre (NKC) to provide a world-class training facility inspired by AOTS centers in Japan.' },
    { year: 2018, description: 'Golden Jubilee Celebrations' },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ASA Kerala</h1>
            <p className="text-xl">Bridging Kerala and Japan through knowledge, culture, and business</p>
          </div>
        </div>
      </section>

      {/* Centralized Navigation Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="container-custom">
          <div className="flex justify-center overflow-x-auto py-4 gap-8">
            <button 
              onClick={() => handleTabChange('overview')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'overview' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => handleTabChange('history')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'history' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              History
            </button>
            <button 
              onClick={() => handleTabChange('aots')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'aots' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              What is AOTS?
            </button>
            <button 
              onClick={() => handleTabChange('team')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'team' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Our Team
            </button>
            <button 
              onClick={() => handleTabChange('affiliations')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'affiliations' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Sister Organizations & Affiliations
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.section 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-12 bg-zinc-50"
          >
            <div className="container-custom">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <h2 className="section-title mb-8">ASA Kerala (ASAK)</h2>
                  <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                    ASA Kerala (ASAK) was founded by professionals from Kerala who attended AOTS training programs in Japan. These programs were fully or partly subsidized by the Japanese Government, equipping participants with valuable skills in management, industrial techniques, and cultural understanding.
                  </p>
                  <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                    Established in 1968, ASA Kerala works towards disseminating Japanese management principles, production techniques, and work culture in Kerala and India.
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-md aspect-square">
                    <SafeImage
                      src="/assets/ASA-logo.png"
                      alt="ASA Kerala Logo"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      fallbackSrc="/assets/ASA-logo.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'history' && (
          <motion.section 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-12 bg-zinc-50"
          >
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <h2 className="section-title mb-8 text-center">Our History</h2>
                <p className="text-lg text-zinc-800 mb-8 leading-relaxed">
                  The foundation of ASA Kerala traces back to the late 1960s when a group of forward-thinking professionals from Kerala participated in specialized training programs in Japan under AOTS sponsorship. Recognizing the potential of Japanese industrial and management techniques, they formed ASA Kerala to promote these methodologies in India. Over the decades, ASAK has played a crucial role in fostering Indo-Japanese relations through training programs, business collaborations, and cultural exchanges.
                </p>
                
                <h3 className="text-2xl font-bold text-zinc-900 mb-10 text-center">Milestones</h3>
                
                <div className="space-y-0 relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-hinomaru-red via-sakura-500 to-sakura-300 rounded-full"></div>
                  
                  {milestones.map((milestone, index) => (
                    <motion.div 
                      key={index} 
                      className="flex gap-8 items-start relative mb-16"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 50
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <motion.div 
                        className="relative z-10 w-12 h-12 flex-shrink-0 bg-hinomaru-red text-white rounded-full flex items-center justify-center font-bold shadow-lg"
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {milestone.year.toString().substring(2)}
                      </motion.div>
                      <motion.div 
                        className="japan-card flex-grow transform-gpu"
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <h4 className="font-bold text-xl text-zinc-900 mb-2">{milestone.year}</h4>
                        <p className="text-zinc-800">{milestone.description}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'aots' && (
          <motion.section 
            key="aots"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-12 bg-zinc-50"
          >
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <h2 className="section-title mb-8 text-center">What is AOTS?</h2>
                <motion.div 
                  className="japan-card p-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                    The Association for Overseas Technical Cooperation and Sustainable Partnerships (AOTS) is a Japanese organization dedicated to human resource development through training programs and industry collaborations worldwide. Established in 1959, AOTS has played a crucial role in promoting technical expertise and managerial skills across various industries by fostering global cooperation between Japan and other nations.
                  </p>
                  <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                    AOTS provides a wide range of professional development programs, including management training, technical training, and internship opportunities for professionals and organizations. These programs are designed to equip participants with cutting-edge industrial knowledge, business strategies, and best practices followed in Japan.
                  </p>
                  <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                    With state-of-the-art training centers in Tokyo and Osaka, AOTS delivers immersive, hands-on learning experiences tailored to specific industry needs. Additionally, AOTS extends its collaboration through partnerships with alumni associations worldwide, including ASA Kerala, to promote Indo-Japanese business and technological exchange.
                  </p>
                  <p className="text-lg text-zinc-800 leading-relaxed">
                    Through continuous knowledge-sharing and skill enhancement, AOTS helps individuals and businesses achieve operational excellence, making it a significant pillar in fostering international industrial cooperation and sustainable partnerships.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'team' && (
          <motion.section 
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-12 bg-zinc-50"
          >
            <div className="container-custom">
              <h2 className="section-title mb-8 text-center">Our Team</h2>
              <p className="text-lg text-zinc-800 mb-8 text-center max-w-3xl mx-auto">
                Our leadership team includes experienced professionals and business leaders who guide the organization's initiatives.
              </p>
              
              <h3 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Managing Committee</h3>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <button 
                    onClick={() => handleTabChange('team')} 
                    className="mt-4 btn-primary"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {committeeData.length > 0 ? (
                    committeeData.map((member, index) => (
                      <motion.div 
                        key={member.id} 
                        className="japan-card text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                          {member.photo ? (
                            <SafeImage 
                              src={member.photo.url} 
                              alt={member.name} 
                              width={128} 
                              height={128} 
                              className="object-cover w-full h-full"
                              fallbackSrc={member.photo.url}
                            />
                          ) : (
                            <span className="text-gray-600 text-sm">No Photo</span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-zinc-900">
                          {member.position.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h4>
                        <p className="text-hinomaru-red font-medium">{member.name}</p>
                        <p className="text-zinc-700 mt-2 text-sm">
                          {member.bio || 'Committee member of ASA Kerala'}
                        </p>
                        
                        {member.linkedIn && (
                          <div className="mt-4">
                            <a 
                              href={member.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    // Display placeholder data if no committee members are found
                    <div className="col-span-full text-center py-8">
                      <p>No committee members information is available at the moment.</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-12 text-center">
                <Link href="/about/committee" className="btn-primary">
                  View All Committee Members
                </Link>
              </div>

              {/* Message from the President */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-zinc-900 mb-10 text-center">Message from the President</h3>
                <motion.div 
                  className="japan-card p-8 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="md:w-1/3 flex justify-center">
                      {committeeData.length > 0 && committeeData.find(m => m.position === 'president')?.photo ? (
                        <div className="w-40 h-40 rounded-full overflow-hidden">
                          <SafeImage 
                            src={committeeData.find(m => m.position === 'president')?.photo?.url || ''} 
                            alt="President" 
                            width={160} 
                            height={160} 
                            className="object-cover w-full h-full"
                            fallbackSrc="/assets/placeholder-user.png"
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <span className="text-gray-500 text-sm">President's Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3">
                      <h4 className="text-2xl font-bold text-zinc-900 mb-2">
                        {committeeData.find(m => m.position === 'president')?.name || '[President\'s Name]'}
                      </h4>
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
                      {committeeData.find(m => m.position === 'president')?.name || '[President\'s Name]'}<br />
                      President, ASA Kerala
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'affiliations' && (
          <motion.section 
            key="affiliations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-12 bg-zinc-50"
          >
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <h2 className="section-title mb-8 text-center">Sister Organizations & Affiliations</h2>
                
                <motion.div 
                  className="japan-card p-8 mb-12"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4">Indo Japan Chamber of Commerce Kerala (INJACK)</h3>
                  <p className="text-lg text-zinc-800 mb-6">
                    INJACK is a key sister organization of ASA Kerala, working to strengthen business collaborations between India and Japan. It serves as a platform for business networking, trade facilitation, and knowledge-sharing between Japanese and Indian enterprises.
                  </p>
                  <div className="text-center">
                    <a 
                      href="https://injack.org" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary"
                    >
                      Visit INJACK
                    </a>
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-zinc-900 mb-6">Affiliations</h3>
                <p className="text-lg text-zinc-800 mb-6">
                  ASA Kerala is affiliated with:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div 
                    className="japan-card p-6 flex flex-col items-center text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-3">AOTS Japan</h4>
                    <p className="text-zinc-800 mb-4">
                      The parent organization that provides training opportunities and technical knowledge transfer from Japan.
                    </p>
                    <a 
                      href="https://www.aots.jp/en/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-hinomaru-red hover:underline font-medium mt-auto"
                    >
                      Visit Website
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    className="japan-card p-6 flex flex-col items-center text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-3">Federation of AOTS Alumni Associations in India (FAAAI)</h4>
                    <p className="text-zinc-800 mb-4">
                      Umbrella organization connecting all AOTS alumni associations across India.
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="japan-card p-6 flex flex-col items-center text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-3">South Asia Federation of AOTS Alumni Societies (SAFAAS)</h4>
                    <p className="text-zinc-800 mb-4">
                      Regional body coordinating AOTS alumni activities across South Asian countries.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
} 