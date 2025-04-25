'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HistoryPage() {
  const historyTimeline = [
    {
      year: 1959,
      title: 'AOTS Establishment',
      description: 'The Association for Overseas Technical Scholarship (AOTS) is established in Japan with the mission to promote international cooperation through human resource development.',
      isAOTS: true,
    },
    {
      year: 1968,
      title: 'ASA Kerala Foundation',
      description: 'Professionals from Kerala who participated in AOTS training programs in Japan establish ASA Kerala with a vision to disseminate Japanese industrial knowledge and management principles in Kerala.',
      isAOTS: false,
    },
    {
      year: 1972,
      title: 'First Industrial Training Program',
      description: 'ASA Kerala conducts its first industrial training program focused on Japanese quality control and management techniques for local industries in Kerala.',
      isAOTS: false,
    },
    {
      year: 1980,
      title: 'Expansion of Training Initiatives',
      description: 'ASA Kerala expands its training initiatives, increasing collaboration with Indian industries and establishing connections with more Japanese companies.',
      isAOTS: false,
    },
    {
      year: 1985,
      title: 'First Cultural Exchange Program',
      description: 'ASA Kerala launches its first cultural exchange program, promoting Japanese culture and language in Kerala and facilitating opportunities for cultural immersion.',
      isAOTS: false,
    },
    {
      year: 1992,
      title: 'Japan Day Celebrations',
      description: 'ASA Kerala introduces the annual Japan Day celebrations, showcasing Japanese culture, cuisine, and business practices to the people of Kerala.',
      isAOTS: false,
    },
    {
      year: 2000,
      title: 'AOTS Program Participation Milestone',
      description: 'ASA Kerala achieves a significant milestone with 500 participants from Kerala successfully completing AOTS management and technical training programs in Japan.',
      isAOTS: false,
    },
    {
      year: 2007,
      title: 'AOTS to HIDA Transition',
      description: 'AOTS undergoes reorganization and is renamed as The Overseas Human Resources and Industry Development Association (HIDA).',
      isAOTS: true,
    },
    {
      year: 2010,
      title: 'Nippon Kerala Centre Establishment',
      description: 'ASA Kerala establishes the Nippon Kerala Centre (NKC) to provide a world-class training facility inspired by AOTS centers in Japan, offering specialized programs in Japanese management techniques, quality control, and industrial practices.',
      isAOTS: false,
    },
    {
      year: 2017,
      title: 'HIDA to AOTS Again',
      description: 'The organization is renamed back to AOTS, now standing for The Association for Overseas Technical Cooperation and Sustainable Partnerships.',
      isAOTS: true,
    },
    {
      year: 2018,
      title: 'Golden Jubilee Celebrations',
      description: 'ASA Kerala celebrates its 50th anniversary with a grand ceremony, honoring the founding members and acknowledging the contributions of all who helped shape the organization.',
      isAOTS: false,
    },
    {
      year: 2020,
      title: 'Digital Transformation',
      description: 'In response to the global pandemic, ASA Kerala adapts its programs to digital platforms, continuing to provide valuable training and networking opportunities virtually.',
      isAOTS: false,
    },
    {
      year: 2023,
      title: 'Continued Growth',
      description: 'ASA Kerala continues to grow as a key hub for knowledge exchange, professional training, and Indo-Japanese networking, with over 1,000 alumni and a robust program of activities.',
      isAOTS: false,
    },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      <p className="ml-3 text-gray-600">Redirecting...</p>
    </div>
  );
} 