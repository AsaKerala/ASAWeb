import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to Our Organization
            </h1>
            <p className="text-xl mb-10">
              Building stronger communities through collaboration, education, and service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/join-us"
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
              >
                Become a Member
              </Link>
              <Link
                href="/programs-events"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition duration-300"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Featured Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how our organization is making a positive impact through these key initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-48 bg-blue-200 relative">
                {/* Replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Community Outreach</h3>
                <p className="text-gray-600 mb-4">
                  Supporting local communities through volunteer work, education, and resources.
                </p>
                <Link href="/programs-events/community-outreach" className="text-blue-600 font-medium hover:text-blue-800">
                  Learn more →
                </Link>
              </div>
            </div>

            {/* Program Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-48 bg-green-200 relative">
                {/* Replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Educational Programs</h3>
                <p className="text-gray-600 mb-4">
                  Providing lifelong learning opportunities for all ages through workshops and courses.
                </p>
                <Link href="/programs-events/educational-programs" className="text-blue-600 font-medium hover:text-blue-800">
                  Learn more →
                </Link>
              </div>
            </div>

            {/* Program Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-48 bg-purple-200 relative">
                {/* Replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Leadership Development</h3>
                <p className="text-gray-600 mb-4">
                  Building the next generation of community leaders through mentorship and training.
                </p>
                <Link href="/programs-events/leadership-development" className="text-blue-600 font-medium hover:text-blue-800">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/programs-events" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us at our upcoming events to connect with community members and participate in enriching activities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Workshop</span>
                  <span className="text-gray-600 text-sm">June 15, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Digital Skills Workshop</h3>
                <p className="text-gray-600 mb-4">
                  Learn essential digital skills for the modern workplace in this hands-on workshop.
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Community Center, Room 204</span>
                </div>
                <Link href="/programs-events/digital-skills-workshop" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                  Register Now
                </Link>
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Networking</span>
                  <span className="text-gray-600 text-sm">June 22, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Professional Networking Mixer</h3>
                <p className="text-gray-600 mb-4">
                  Connect with professionals in your field at our monthly networking event.
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Downtown Conference Center</span>
                </div>
                <Link href="/programs-events/networking-mixer" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                  Register Now
                </Link>
              </div>
            </div>

            {/* Event 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">Family</span>
                  <span className="text-gray-600 text-sm">July 5, 2025</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Community Picnic & Fundraiser</h3>
                <p className="text-gray-600 mb-4">
                  Join us for a day of fun, food, and community-building at our annual picnic.
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Central Park, Main Pavilion</span>
                </div>
                <Link href="/programs-events/community-picnic" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
                  Register Now
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/programs-events" 
              className="inline-block border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition duration-300"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Members Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community members about how our organization has made a difference in their lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-500 mr-4">
                  <span className="font-bold text-xl">JD</span>
                </div>
                <div>
                  <h4 className="font-bold">Jane Doe</h4>
                  <p className="text-gray-500 text-sm">Member since 2022</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Joining this organization has been one of the best decisions I've made. The professional development opportunities and connections I've gained are invaluable."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-500 mr-4">
                  <span className="font-bold text-xl">JS</span>
                </div>
                <div>
                  <h4 className="font-bold">John Smith</h4>
                  <p className="text-gray-500 text-sm">Member since 2023</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The workshops and educational programs have helped me advance my career. I've learned new skills and met amazing people who support and challenge me."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-500 mr-4">
                  <span className="font-bold text-xl">AJ</span>
                </div>
                <div>
                  <h4 className="font-bold">Amy Johnson</h4>
                  <p className="text-gray-500 text-sm">Member since 2021</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've found a true community here. The volunteer opportunities have allowed me to give back while forming meaningful connections with others who share my passion."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            Become a member today to access exclusive resources, attend events, and connect with like-minded individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join-us"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
            >
              Become a Member
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
