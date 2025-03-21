'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { globals } from '@/lib/api';

type FooterLink = {
  label: string;
  link: string;
  type: 'internal' | 'external';
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

type FooterData = {
  columns: FooterColumn[];
  bottomSection: {
    copyrightText: string;
    showSocialIcons: boolean;
    legalLinks: FooterLink[];
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
  };
  additionalContent?: any;
  logo: {
    image: any;
    showLogo: boolean;
    logoPosition: 'left' | 'center' | 'right';
  };
};

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await globals.getFooter();
        setFooterData(response.data);
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

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

  if (!footerData) {
    return (
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>© 2025 Organization. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and About */}
          <div className="col-span-1">
            {footerData.logo.showLogo && footerData.logo.image && (
              <div className="mb-4">
                <Link href="/" className="inline-block">
                  {footerData.logo.image?.url ? (
                    <Image 
                      src={footerData.logo.image.url} 
                      alt="Organization Logo" 
                      width={150} 
                      height={50} 
                      className="h-10 w-auto"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">Organization</span>
                  )}
                </Link>
              </div>
            )}
            
            {/* Newsletter Signup */}
            {footerData.newsletter.enabled && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">{footerData.newsletter.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{footerData.newsletter.description}</p>
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 flex-shrink-0"
                    disabled={subscribeStatus === 'loading'}
                  >
                    {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {subscribeStatus === 'success' && (
                  <p className="text-green-400 text-sm mt-2">Thanks for subscribing!</p>
                )}
                {subscribeStatus === 'error' && (
                  <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
                )}
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {footerData.columns.map((column, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.type === 'internal' ? (
                      <Link 
                        href={link.link} 
                        className="text-gray-300 hover:text-white transition duration-200"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a 
                        href={link.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">{footerData.bottomSection.copyrightText}</p>
            </div>
            
            {/* Legal Links */}
            {footerData.bottomSection.legalLinks && footerData.bottomSection.legalLinks.length > 0 && (
              <div className="flex space-x-4">
                {footerData.bottomSection.legalLinks.map((link, index) => (
                  <div key={index}>
                    {link.type === 'internal' ? (
                      <Link 
                        href={link.link} 
                        className="text-gray-400 hover:text-white text-sm transition duration-200"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a 
                        href={link.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-sm transition duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
} 