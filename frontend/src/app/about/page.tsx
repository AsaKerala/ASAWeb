'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const milestones = [
    { year: 1968, description: 'Formation of ASA Kerala with a mission to disseminate Japanese industrial knowledge.' },
    { year: 1980, description: 'Expansion of training initiatives and collaboration with Indian industries.' },
    { year: 2000, description: 'Increased participation in AOTS management and technical training programs.' },
    { year: 2010, description: 'Establishment of Nippon Kerala Centre (NKC) to provide a world-class training facility inspired by AOTS centers in Japan.' },
    { year: 2023, description: 'Continuing to grow as a key hub for knowledge exchange, professional training, and Indo-Japanese networking.' },
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

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex overflow-x-auto whitespace-nowrap py-4 gap-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'overview' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'history' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('aots')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'aots' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              What is AOTS?
            </button>
            <button 
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'team' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Our Team
            </button>
            <button 
              onClick={() => setActiveTab('affiliations')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'affiliations' ? 'text-hinomaru-red border-b-2 border-hinomaru-red' : 'text-zinc-700 hover:text-hinomaru-red'}`}
            >
              Affiliations
            </button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className={`py-12 bg-zinc-50 ${activeTab === 'overview' ? 'block' : 'hidden'}`}>
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
                <Image
                  src="/assets/ASA-logo.png"
                  alt="ASA Kerala Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className={`py-12 bg-zinc-50 ${activeTab === 'history' ? 'block' : 'hidden'}`}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">Our History</h2>
            <p className="text-lg text-zinc-800 mb-8 leading-relaxed">
              The foundation of ASA Kerala traces back to the late 1960s when a group of forward-thinking professionals from Kerala participated in specialized training programs in Japan under AOTS sponsorship. Recognizing the potential of Japanese industrial and management techniques, they formed ASA Kerala to promote these methodologies in India. Over the decades, ASAK has played a crucial role in fostering Indo-Japanese relations through training programs, business collaborations, and cultural exchanges.
            </p>
            
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">Milestones in ASAK's History</h3>
            
            <div className="space-y-8 relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-hinomaru-red"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-8 items-start relative">
                  <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-hinomaru-red text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    {milestone.year.toString().substring(2)}
                  </div>
                  <div className="japan-card flex-grow">
                    <h4 className="font-bold text-xl text-zinc-900 mb-2">{milestone.year}</h4>
                    <p className="text-zinc-800">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/about/history" className="btn-primary">
                Read More About Our History
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AOTS Section */}
      <section className={`py-12 bg-zinc-50 ${activeTab === 'aots' ? 'block' : 'hidden'}`}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">What is AOTS?</h2>
            <div className="japan-card p-8">
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
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-12 bg-zinc-50 ${activeTab === 'team' ? 'block' : 'hidden'}`}>
        <div className="container-custom">
          <h2 className="section-title mb-8 text-center">Our Team</h2>
          <p className="text-lg text-zinc-800 mb-8 text-center max-w-3xl mx-auto">
            Our leadership team includes experienced professionals and business leaders who guide the organization's initiatives.
          </p>
          
          <h3 className="text-2xl font-bold text-zinc-900 mb-6 text-center">Managing Committee</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* President */}
            <div className="japan-card text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-600 text-sm">Photo</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900">President</h4>
              <p className="text-hinomaru-red font-medium">[Placeholder Name]</p>
              <p className="text-zinc-700 mt-2 text-sm">Short bio will appear here</p>
            </div>
            
            {/* Vice President */}
            <div className="japan-card text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-600 text-sm">Photo</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900">Vice President</h4>
              <p className="text-hinomaru-red font-medium">[Placeholder Name]</p>
              <p className="text-zinc-700 mt-2 text-sm">Short bio will appear here</p>
            </div>
            
            {/* Secretary */}
            <div className="japan-card text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-600 text-sm">Photo</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900">Secretary</h4>
              <p className="text-hinomaru-red font-medium">[Placeholder Name]</p>
              <p className="text-zinc-700 mt-2 text-sm">Short bio will appear here</p>
            </div>
            
            {/* Treasurer */}
            <div className="japan-card text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-600 text-sm">Photo</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900">Treasurer</h4>
              <p className="text-hinomaru-red font-medium">[Placeholder Name]</p>
              <p className="text-zinc-700 mt-2 text-sm">Short bio will appear here</p>
            </div>
            
            {/* Joint Secretary */}
            <div className="japan-card text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-gray-600 text-sm">Photo</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900">Joint Secretary</h4>
              <p className="text-hinomaru-red font-medium">[Placeholder Name]</p>
              <p className="text-zinc-700 mt-2 text-sm">Short bio will appear here</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/about/committee" className="btn-primary">
              View All Committee Members
            </Link>
          </div>
        </div>
      </section>

      {/* Sister Organization Section */}
      <section className={`py-12 bg-zinc-50 ${activeTab === 'affiliations' ? 'block' : 'hidden'}`}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">Sister Organizations & Affiliations</h2>
            
            <div className="japan-card p-8 mb-12">
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
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">Affiliations</h3>
            <p className="text-lg text-zinc-800 mb-6">
              ASA Kerala is affiliated with:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="japan-card p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Logo</span>
                </div>
                <h4 className="text-xl font-bold text-zinc-900">AOTS Japan</h4>
              </div>
              
              <div className="japan-card p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Logo</span>
                </div>
                <h4 className="text-xl font-bold text-zinc-900">Federation of AOTS Alumni Associations in India (FAAAI)</h4>
              </div>
              
              <div className="japan-card p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Logo</span>
                </div>
                <h4 className="text-xl font-bold text-zinc-900">South Asia Federation of AOTS Alumni Societies (SAFAAS)</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 