'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Footer quick links
const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Programs & Events', href: '/programs-events' },
  { label: 'Join ASA Kerala', href: '/membership/join' },
  { label: 'Membership', href: '/membership' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'News', href: '/news' },
  { label: 'Contact Us', href: '/contact' },
];

// Resources links
const resourceLinks = [
  { label: 'JICA Alumni Association', href: 'https://www.jica.go.jp/english/' },
  { label: 'Embassy of Japan in India', href: 'https://www.in.emb-japan.go.jp/itprtop_en/index.html' },
  { label: 'Japan Foundation', href: 'https://www.jpf.go.jp/e/' },
  { label: 'Study in Japan', href: 'https://www.studyinjapan.go.jp/en/' },
  { label: 'JETRO', href: 'https://www.jetro.go.jp/en/' },
];

// Social media links
const socialLinks = [
  { 
    label: 'Facebook', 
    href: 'https://facebook.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    )
  },
  { 
    label: 'Twitter', 
    href: 'https://twitter.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      </svg>
    )
  },
  { 
    label: 'Instagram', 
    href: 'https://instagram.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  { 
    label: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    )
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');
    try {
      // This would be an actual API call to subscribe the user
      // For now we'll just simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-zen-900 to-zen-800 text-white pt-12 md:pt-16 pb-6">
      {/* Wave SVG Separator */}
      <div className="w-full overflow-hidden -mt-12 md:-mt-16 mb-8 md:mb-12">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 30L48 35C96 40 192 50 288 55C384 60 480 60 576 55C672 50 768 40 864 35C960 30 1056 30 1152 35C1248 40 1344 50 1392 55L1440 60V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V30Z"
            fill="#1a202c"
          />
        </svg>
      </div>
      
      <div className="container-custom px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* About ASA Kerala */}
          <div className="col-span-1">
            <div className="mb-4 md:mb-6">
              <Link href="/" className="flex items-center no-underline">
                <Image src="/assets/ASA-logo.png" alt="ASA Logo" width={40} height={40} className="object-contain mr-2" />
                <span className="text-2xl md:text-3xl font-bold text-white">ASA</span>
                <span className="text-2xl md:text-3xl font-bold text-sakura-200 ml-1">Kerala</span>
              </Link>
            </div>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              ASA Kerala is the Japan Alumni Association of Kerala, a collective of individuals who have studied, trained, or worked in Japan and are now back in Kerala.
            </p>
            <div className="flex space-x-3 mt-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zen-700 p-1.5 md:p-2 rounded-full text-white hover:bg-hinomaru-red transition-colors no-underline"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1 mt-6 sm:mt-0">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white relative pl-4 border-l-4 border-hinomaru-red">
              Quick Links
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 text-sm md:text-base hover:text-sakura-200 transition-colors flex items-center no-underline"
                  >
                    <svg className="w-3 h-3 mr-2 text-hinomaru-red" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1 mt-6 sm:mt-0">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white relative pl-4 border-l-4 border-hinomaru-red">
              Resources
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 text-sm md:text-base hover:text-sakura-200 transition-colors flex items-center no-underline"
                  >
                    <svg className="w-3 h-3 mr-2 text-hinomaru-red" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1 mt-6 lg:mt-0">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white relative pl-4 border-l-4 border-hinomaru-red">
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Stay updated with our latest news, events, and activities by subscribing to our newsletter.
            </p>
            <form onSubmit={handleNewsletter} className="mt-4">
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-zen-700 border border-zen-600 rounded-washi px-3 py-2 md:px-4 md:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hinomaru-red text-sm md:text-base w-full"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="btn-primary flex justify-center items-center text-sm md:text-base py-2 md:py-3"
                >
                  {subscribeStatus === 'loading' ? (
                    <span className="animate-pulse">Subscribing...</span>
                  ) : subscribeStatus === 'success' ? (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Subscribed!
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="border-t border-zen-700 pt-6 md:pt-8 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-hinomaru-red mr-2 md:mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h4 className="text-white text-sm md:text-base font-medium mb-1">Address</h4>
                <p className="text-gray-400 text-xs md:text-sm">ASA Kerala, Nippon Kerala Centre, Kalamassery, Kochi, Kerala, India</p>
              </div>
            </div>
            <div className="flex items-start mt-4 sm:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-hinomaru-red mr-2 md:mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h4 className="text-white text-sm md:text-base font-medium mb-1">Email</h4>
                <a href="mailto:info@asakeralajapan.org" className="text-gray-400 text-xs md:text-sm hover:text-sakura-200 transition-colors no-underline overflow-hidden overflow-ellipsis">info@asakeralajapan.org</a>
              </div>
            </div>
            <div className="flex items-start mt-4 md:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-hinomaru-red mr-2 md:mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h4 className="text-white text-sm md:text-base font-medium mb-1">Phone</h4>
                <a href="tel:+919876543210" className="text-gray-400 text-xs md:text-sm hover:text-sakura-200 transition-colors no-underline">+91 98765 43210</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-zen-700 pt-4 md:pt-6 mt-4 md:mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0 text-center md:text-left">
              © {new Date().getFullYear()} ASA Kerala. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-3 md:space-x-4 text-xs md:text-sm">
              <Link href="/terms" className="text-gray-400 hover:text-sakura-200 transition-colors no-underline mb-1 md:mb-0">Terms & Conditions</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-sakura-200 transition-colors no-underline mb-1 md:mb-0">Privacy Policy</Link>
              <Link href="/data-protection" className="text-gray-400 hover:text-sakura-200 transition-colors no-underline mb-1 md:mb-0">Data Protection</Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-sakura-200 transition-colors no-underline mb-1 md:mb-0">Cookie Policy</Link>            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 