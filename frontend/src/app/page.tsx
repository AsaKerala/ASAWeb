import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section id="banner" className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white py-32">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Join ASA Kerala – Connect, Learn, and Grow
            </h1>
            <p className="text-xl mb-10">
              Explore training opportunities in Japan, business networking, and cultural exchange programs. Be part of an esteemed alumni association fostering Indo-Japanese relations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/membership/join"
                className="btn-primary"
              >
                Join Now
              </Link>
              <Link
                href="#welcome"
                className="btn-outline"
              >
                Learn More
              </Link>
              <Link
                href="/events"
                className="btn-secondary"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-center">Welcome to ASA Kerala</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 leading-relaxed">
Association of AOTS Kerala, dedicated to fostering Indo-Japanese relations by sharing knowledge, skills, and experiences gained through AOTS training programs. Our organization serves as a hub for professionals, entrepreneurs, and students interested in Japanese management practices, industrial expertise, cultural exchange and in general, the Japanese way of life!              ASA Kerala is the official alumni 
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-zen-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-center">Mission Statement</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 leading-relaxed mb-6">
              Our mission is to:
            </p>
            <ul className="text-left text-lg text-zen-700 leading-relaxed space-y-4 max-w-2xl mx-auto">
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Promote Japanese industrial knowledge and management techniques in Kerala.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Facilitate training programs, internships, and business opportunities between Japan and India.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Strengthen Indo-Japanese relationships through cultural and business collaborations.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hinomaru-red mr-2">•</span>
                <span>Transfer learnings and best practices from Japan and India to the rest of the world, particularly other developing countries.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 bg-zen-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Featured Programs</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program Card 1 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Training Programs in Japan</h3>
              <p className="text-zen-700 mb-4">
                Learn about the latest industrial and management techniques from top Japanese experts.
              </p>
              <Link href="/programs/training-japan" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Program Card 2 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Internships & Job Opportunities</h3>
              <p className="text-zen-700 mb-4">
                Gain exposure to the Japanese work environment through structured internship programs.
              </p>
              <Link href="/programs/internships" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Program Card 3 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Language Training</h3>
              <p className="text-zen-700 mb-4">
                Enroll in Japanese language courses to enhance career prospects and communication.
              </p>
              <Link href="/programs/language-training" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Program Card 4 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Business Networking & Start-up Support</h3>
              <p className="text-zen-700 mb-4">
                Leverage our community to explore new business opportunities.
              </p>
              <Link href="/programs/business-networking" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Program Card 5 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Training Programs in India</h3>
              <p className="text-zen-700 mb-4">
                Learn from a wide array of ASAK hosted programs for industries and professionals.
              </p>
              <Link href="/programs/training-india" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/programs" 
              className="btn-primary"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Upcoming Events</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
            <p className="text-lg text-zen-700 max-w-2xl mx-auto">
              Stay updated with the latest activities, training programs, business delegations, and networking opportunities. Some of our upcoming events include:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-hinomaru-red text-white px-4 py-2 rounded-washi text-center">
                  <span className="block text-2xl font-bold">15</span>
                  <span className="text-sm">June</span>
                </div>
                <span className="text-zen-600 text-sm">2:00 PM - 4:00 PM</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Webinar on Lean Management</h3>
              <p className="text-zen-700 mb-4">
                A discussion on best practices in Japanese industry.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-zen-600 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Online
                </span>
                <Link href="/events/lean-management-webinar" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                  Register
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-hinomaru-red text-white px-4 py-2 rounded-washi text-center">
                  <span className="block text-2xl font-bold">22</span>
                  <span className="text-sm">June</span>
                </div>
                <span className="text-zen-600 text-sm">6:00 PM - 8:00 PM</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Cultural Exchange Meetup</h3>
              <p className="text-zen-700 mb-4">
                An opportunity to connect with Japanese professionals and students.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-zen-600 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Kochi
                </span>
                <Link href="/events/cultural-exchange-meetup" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                  Register
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-hinomaru-red text-white px-4 py-2 rounded-washi text-center">
                  <span className="block text-2xl font-bold">10</span>
                  <span className="text-sm">July</span>
                </div>
                <span className="text-zen-600 text-sm">9:00 AM - 5:00 PM</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Business Delegation to Japan</h3>
              <p className="text-zen-700 mb-4">
                Facilitating partnerships between Indian and Japanese businesses.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-zen-600 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Tokyo, Japan
                </span>
                <Link href="/events/business-delegation-japan" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                  Register
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/events" 
              className="btn-primary"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-zen-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-center">Quick Links</h2>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-1 bg-hinomaru-red"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Link Card 1 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Join ASA Kerala</h3>
              <p className="text-zen-700 mb-4">
                Become a member and access exclusive benefits, networking opportunities, and career resources.
              </p>
              <Link href="/membership/join" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Join Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Link Card 2 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Explore Training Programs</h3>
              <p className="text-zen-700 mb-4">
                Discover our comprehensive range of training opportunities both in Japan and India.
              </p>
              <Link href="/programs" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                View Programs
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Link Card 3 */}
            <div className="japan-card transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-6 text-hinomaru-red">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-zen-900">Contact Us</h3>
              <p className="text-zen-700 mb-4">
                Have questions? Get in touch with our team for more information about ASA Kerala.
              </p>
              <Link href="/contact" className="text-hinomaru-red font-medium hover:text-sakura-700 inline-flex items-center">
                Get in Touch
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white text-opacity-90 text-lg">
            Become a member today to access exclusive resources, attend events, and connect with Japan enthusiasts across Kerala.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership/join"
              className="bg-white text-hinomaru-red px-8 py-3 rounded-washi font-medium hover:bg-gray-100 transition duration-300"
            >
              Become a Member
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-washi font-medium hover:bg-white/10 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
