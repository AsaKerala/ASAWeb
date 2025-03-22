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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-20">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Journey Through Time</h1>
            <p className="text-xl">Celebrating over five decades of Indo-Japanese collaboration and growth</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="japan-card p-8 mb-10">
              <h2 className="section-title mb-6">The ASA Kerala Story</h2>
              <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                The history of ASA Kerala is a testament to the enduring friendship and collaboration between Kerala and Japan. Founded in 1968 by forward-thinking professionals who had experienced Japan's industrial prowess firsthand, ASA Kerala has evolved into a pivotal organization fostering knowledge exchange, cultural understanding, and business connections between these two distinct regions.
              </p>
              <p className="text-lg text-zinc-800 leading-relaxed">
                Our journey spans over five decades of dedicated efforts to bring Japanese industrial knowledge, management principles, and cultural insights to Kerala. Through various training programs, cultural exchanges, and business initiatives, we have built bridges that continue to benefit both societies to this day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-center mb-16">Our Historical Timeline</h2>
          
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-hinomaru-red"></div>
            
            <div className="space-y-24">
              {historyTimeline.map((item, index) => (
                <div key={index} className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-hinomaru-red border-4 border-white z-10"></div>
                  
                  {/* Year marker */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 -mt-10">
                    <div className={`text-lg font-bold py-1 px-4 rounded-full ${item.isAOTS ? 'bg-zinc-200 text-zinc-800' : 'bg-hinomaru-red text-white'}`}>
                      {item.year}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="w-5/12"></div> {/* Spacer */}
                  <div className="w-5/12">
                    <div className={`japan-card p-6 ${item.isAOTS ? 'border-l-4 border-zinc-500' : 'border-l-4 border-hinomaru-red'}`}>
                      <h3 className={`text-xl font-bold mb-3 ${item.isAOTS ? 'text-zinc-800' : 'text-hinomaru-red'}`}>{item.title}</h3>
                      <p className="text-zinc-800">{item.description}</p>
                      {item.isAOTS && (
                        <div className="mt-3 text-sm font-medium text-zinc-700 italic">
                          (AOTS/Japan event related to our history)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-10 text-zinc-50">Our Founding Members</h2>
            <div className="japan-card p-8">
              <p className="text-lg text-zinc-800 mb-8 leading-relaxed">
                ASA Kerala was established through the vision and dedication of a group of professionals who had trained in Japan and recognized the immense value of Japanese management principles, technical knowledge, and work culture. These founding members took the initiative to create an organization that would serve as a bridge between Japanese industrial expertise and Kerala's developing industrial landscape.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* This section would ideally contain actual photos and bios of founding members */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Photo</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900">Founding Member {i}</h3>
                      <p className="text-hinomaru-red font-medium">[Position]</p>
                      <p className="text-sm text-zinc-700 mt-2">
                        Short biography of the founding member, their contribution to ASA Kerala, and their background.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-12 bg-zinc-50">
        <div className="container-custom">
          <h2 className="section-title text-center mb-10">Historical Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* This would contain actual historical photos */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="japan-card p-2 overflow-hidden">
                <div className="bg-gray-200 aspect-square w-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Historical Photo {i+1}</span>
                </div>
                <p className="text-sm text-zinc-700 font-medium p-2">Historical event caption (circa {1970 + i*5})</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery" className="btn-primary">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Legacy and Future Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-10 text-zinc-50">Our Legacy and Future</h2>
            <div className="japan-card p-8">
              <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                After more than five decades of operation, ASA Kerala has established a significant legacy in promoting Indo-Japanese relations. Our alumni have gone on to make remarkable contributions in various industries, implementing Japanese best practices and fostering international collaboration.
              </p>
              <p className="text-lg text-zinc-800 mb-6 leading-relaxed">
                As we look toward the future, ASA Kerala remains committed to its founding principles while adapting to the evolving global landscape. We continue to innovate our programs, leverage digital technologies, and explore new avenues for collaboration between Kerala and Japan.
              </p>
              <p className="text-lg text-zinc-800 leading-relaxed">
                With a strong foundation and a clear vision, we are poised to enhance our impact, creating more opportunities for knowledge exchange, cultural understanding, and business partnerships that benefit both societies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 relative">
        <div className="absolute inset-0 bg-[url('/assets/wave-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Be Part of Our Ongoing Story</h2>
            <p className="text-xl mb-8">
              Join ASA Kerala today and contribute to the next chapter of our journey in fostering Indo-Japanese relations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/membership" className="btn-white">
                Become a Member
              </Link>
              <Link href="/contact" className="btn-outline-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 