'use client';

import Link from 'next/link';
import { useState } from 'react';

// Sample program data (would come from API in a real implementation)
const trainingPrograms = [
  {
    id: 1,
    name: 'Management Training in Japan',
    description: 'Leadership and strategic planning for professionals.',
    slug: 'management-training-japan',
    flyer: '/assets/flyers/management-training.pdf'
  },
  {
    id: 2,
    name: 'Technical Training in Japanese Industries',
    description: 'Hands-on experience in Japanese industrial techniques.',
    slug: 'technical-training-japanese-industries',
    flyer: '/assets/flyers/technical-training.pdf'
  },
  {
    id: 3,
    name: 'World Network of Friendship (WNF)',
    description: 'Connect with AOTS alumni worldwide for knowledge-sharing.',
    slug: 'world-network-friendship',
    flyer: '/assets/flyers/wnf.pdf'
  }
];

const languagePrograms = [
  {
    id: 1,
    name: 'JLPT N5 & N4 Preparation',
    description: 'Basic to intermediate Japanese language skills.',
    slug: 'jlpt-n5-n4',
    flyer: '/assets/flyers/jlpt-n5-n4.pdf'
  },
  {
    id: 2,
    name: 'Business Japanese Communication',
    description: 'Practical language skills for business settings.',
    slug: 'business-japanese',
    flyer: '/assets/flyers/business-japanese.pdf'
  },
  {
    id: 3,
    name: 'Cultural Immersion & Language Use',
    description: 'Understanding Japanese culture through language.',
    slug: 'cultural-immersion',
    flyer: '/assets/flyers/cultural-immersion.pdf'
  }
];

const internshipPrograms = [
  {
    id: 1,
    name: 'Internships in Japan',
    description: 'Practical exposure in IT, engineering, and management.',
    slug: 'internships-japan',
    flyer: '/assets/flyers/internships-japan.pdf'
  },
  {
    id: 2,
    name: 'Internships in Kerala',
    description: 'Experience Indian industries and business culture.',
    slug: 'internships-kerala',
    flyer: '/assets/flyers/internships-kerala.pdf'
  }
];

const skillDevelopmentPrograms = [
  {
    id: 1,
    name: 'IT & Digital Transformation',
    description: 'AI, IoT, and software development training.',
    slug: 'it-digital-transformation',
    flyer: '/assets/flyers/it-digital.pdf'
  },
  {
    id: 2,
    name: 'Lean Manufacturing & Kaizen',
    description: 'Improving efficiency and productivity using Japanese practices.',
    slug: 'lean-manufacturing-kaizen',
    flyer: '/assets/flyers/lean-manufacturing.pdf'
  },
  {
    id: 3,
    name: 'Business Strategy & Innovation',
    description: 'Entrepreneurship and strategic business planning.',
    slug: 'business-strategy-innovation',
    flyer: '/assets/flyers/business-strategy.pdf'
  }
];

const culturalPrograms = [
  {
    id: 1,
    name: 'Indo-Japan Cultural Exchange',
    description: 'Promoting mutual understanding through arts and traditions.',
    slug: 'indo-japan-cultural-exchange',
    flyer: '/assets/flyers/cultural-exchange.pdf'
  },
  {
    id: 2,
    name: 'Social & Networking Events',
    description: 'Exclusive member gatherings for relationship building.',
    slug: 'social-networking-events',
    flyer: '/assets/flyers/social-events.pdf'
  }
];

export default function ProgramsEventsPage() {
  // State for active tab (if implementing tab navigation in future)
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Programs & Events</h1>
            <p className="text-xl mb-8">
              Upcoming Activities – Learn, Engage, and Grow!
            </p>
            <p className="text-lg mb-10">
              Discover our latest training programs, internships, language courses, and cultural events. 
              Stay ahead with new learning opportunities and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="#activities"
                className="btn-white"
              >
                View All Activities
              </Link>
              <Link
                href="/programs-events/register"
                className="btn-outline-white"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section id="training-programs" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Training Programs</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala facilitates various training programs in collaboration with AOTS Japan. 
            These programs focus on developing management skills, enhancing technical expertise, 
            and fostering international networking among professionals. Participants gain valuable 
            insights into Japanese business methodologies and industry best practices.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-zinc-100 text-left">
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Program Name</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Description</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">More Info</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Download Flyer</th>
                </tr>
              </thead>
              <tbody>
                {trainingPrograms.map(program => (
                  <tr key={program.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="py-4 px-4 text-zinc-900 font-medium">{program.name}</td>
                    <td className="py-4 px-4 text-zinc-800">{program.description}</td>
                    <td className="py-4 px-4">
                      <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        View Program
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={program.flyer} className="text-hinomaru-red hover:text-sakura-700 font-medium flex items-center">
                        <span>Download PDF</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Language Training Section */}
      <section id="language-training" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Language Training</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala offers structured Japanese language courses to help professionals, 
            students, and enthusiasts gain proficiency in the language. These programs are 
            designed to prepare individuals for the Japanese Language Proficiency Test (JLPT) 
            and enhance their communication skills for business and cultural interactions.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-white text-left">
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Program Name</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Description</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">More Info</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Download Flyer</th>
                </tr>
              </thead>
              <tbody>
                {languagePrograms.map(program => (
                  <tr key={program.id} className="border-b border-zinc-200 hover:bg-zinc-100">
                    <td className="py-4 px-4 text-zinc-900 font-medium">{program.name}</td>
                    <td className="py-4 px-4 text-zinc-800">{program.description}</td>
                    <td className="py-4 px-4">
                      <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        View Program
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={program.flyer} className="text-hinomaru-red hover:text-sakura-700 font-medium flex items-center">
                        <span>Download PDF</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section id="internships" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Internships</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala provides internship opportunities that allow participants to gain 
            firsthand experience in Japanese and Indian industries. These internships help 
            bridge the cultural and professional gap while equipping participants with the 
            necessary skills to excel in a global work environment.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-zinc-100 text-left">
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Program Name</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Description</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">More Info</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Download Flyer</th>
                </tr>
              </thead>
              <tbody>
                {internshipPrograms.map(program => (
                  <tr key={program.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="py-4 px-4 text-zinc-900 font-medium">{program.name}</td>
                    <td className="py-4 px-4 text-zinc-800">{program.description}</td>
                    <td className="py-4 px-4">
                      <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        View Program
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={program.flyer} className="text-hinomaru-red hover:text-sakura-700 font-medium flex items-center">
                        <span>Download PDF</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Skill Development Section */}
      <section id="skill-development" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Skill Development</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            ASA Kerala conducts various skill enhancement programs tailored to the needs of 
            professionals and students. These initiatives aim to provide training in emerging 
            technologies, improve efficiency using Japanese methodologies, and support 
            entrepreneurial growth in various industries.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-white text-left">
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Program Name</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Description</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">More Info</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Download Flyer</th>
                </tr>
              </thead>
              <tbody>
                {skillDevelopmentPrograms.map(program => (
                  <tr key={program.id} className="border-b border-zinc-200 hover:bg-zinc-100">
                    <td className="py-4 px-4 text-zinc-900 font-medium">{program.name}</td>
                    <td className="py-4 px-4 text-zinc-800">{program.description}</td>
                    <td className="py-4 px-4">
                      <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        View Program
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={program.flyer} className="text-hinomaru-red hover:text-sakura-700 font-medium flex items-center">
                        <span>Download PDF</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cultural Activities Section */}
      <section id="cultural-activities" className="py-16 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title mb-8">Cultural Activities</h2>
          <p className="text-lg text-zinc-800 mb-8 max-w-4xl">
            Cultural exchange programs play a crucial role in ASA Kerala's initiatives, 
            promoting a deeper understanding and appreciation of Japanese traditions, customs, 
            and societal values. These activities encourage mutual respect and collaboration 
            between Indian and Japanese communities.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-zinc-100 text-left">
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Program Name</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Description</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">More Info</th>
                  <th className="py-3 px-4 border-b-2 border-zinc-200 font-semibold text-zinc-800">Download Flyer</th>
                </tr>
              </thead>
              <tbody>
                {culturalPrograms.map(program => (
                  <tr key={program.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="py-4 px-4 text-zinc-900 font-medium">{program.name}</td>
                    <td className="py-4 px-4 text-zinc-800">{program.description}</td>
                    <td className="py-4 px-4">
                      <Link href={`/programs-events/${program.slug}`} className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        View Program
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={program.flyer} className="text-hinomaru-red hover:text-sakura-700 font-medium flex items-center">
                        <span>Download PDF</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Skills?</h2>
            <p className="text-lg mb-8">
              Join our programs and be part of a global community of professionals who share a 
              passion for Japanese methodologies, culture, and business practices.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/membership/join"
                className="btn-white"
              >
                Become a Member
              </Link>
              <Link
                href="/contact"
                className="btn-outline-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 