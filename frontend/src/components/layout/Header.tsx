'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/auth';

// Menu structure as per requirements
const menuItems = [
  { label: 'Home', link: '/' },
  { 
    label: 'About Us', 
    link: '/about',
    submenu: [
      { label: 'History', link: '/about/history' },
      { label: 'Committee', link: '/about/committee' }
    ]
  },
  { 
    label: 'Programs & Events', 
    link: '/programs-events',
    submenu: [
      { label: 'Training Programs', link: '/programs-events#training' },
      { label: 'Language Training', link: '/programs-events#language' },
      { label: 'Internships', link: '/programs-events#internships' },
      { label: 'Skill Development', link: '/programs-events#skills' },
      { label: 'Cultural Activities', link: '/programs-events#cultural' }
    ]
  },
  { 
    label: 'Facilities', 
    link: '/facilities',
    submenu: [
      { label: 'Nippon Kerala Centre', link: '/facilities' },
      { label: 'Book a Room', link: '/facilities/book-room' },
      { label: 'Book an Event', link: '/facilities/book-event' }
    ]
  },
  { 
    label: 'News & Updates', 
    link: '/news',
  },
  { 
    label: 'Join Us', 
    link: '/membership',
  },
  { 
    label: 'Contact Us', 
    link: '/contact'
  },
  { 
    label: 'Members Section', 
    link: '/members',
    submenu: [
      { label: 'Member Login', link: '/auth/login' },
      { label: 'Member Directory', link: '/members/directory' },
      { label: 'Member Resources', link: '/members/resources' }
    ]
  }
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (index: number) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };

  return (
    <header
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'sticky top-0 z-50 bg-white shadow-md py-2'
          : 'absolute z-50 bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="mr-2 relative w-10 h-10">
              <Image
                src="/assets/ASA-logo.png"
                alt="ASA Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span
              className={`text-2xl font-bold ${
                isScrolled ? 'text-hinomaru-red' : 'text-white'
              }`}
            >
              ASA
            </span>
            <span
              className={`text-2xl font-bold ml-1 ${
                isScrolled ? 'text-zinc-800' : 'text-white'
              }`}
            >
              Kerala
            </span>
          </Link>

          {/* Desktop Menu - Horizontal Format with Dividers */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group flex items-center">
                  {index > 0 && (
                    <span className={`mx-1 ${isScrolled ? 'text-zinc-400' : 'text-zinc-200'}`}>|</span>
                  )}
                  <Link
                    href={item.link}
                    className={`font-medium text-sm whitespace-nowrap px-1 ${
                      isScrolled
                        ? 'text-zinc-800 hover:text-hinomaru-red'
                        : 'text-white hover:text-sakura-200'
                    } transition-colors`}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-1 w-3 h-3 inline-block transition-transform group-hover:rotate-180 ${
                          isScrolled ? 'text-zinc-600' : 'text-white'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </Link>

                  {/* Submenu */}
                  {item.submenu && (
                    <div className="absolute left-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.link}
                            className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                isScrolled ? 'text-hinomaru-red' : 'text-white'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-zinc-900 bg-opacity-80 z-50 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="h-full flex flex-col p-8 overflow-y-auto">
          <Link href="/" className="flex items-center mb-8" onClick={toggleMenu}>
            <div className="mr-2 relative w-8 h-8">
              <Image
                src="/assets/ASA-logo.png"
                alt="ASA Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-white">ASA</span>
            <span className="text-2xl font-bold text-sakura-200 ml-1">Kerala</span>
          </Link>

          <nav className="flex-1">
            <ul className="space-y-6">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(index)}
                        className="flex items-center justify-between w-full text-left text-lg font-medium text-white hover:text-sakura-200 transition-colors"
                      >
                        <span>{item.label}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`ml-1 w-5 h-5 transition-transform ${
                            activeSubmenu === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div
                        className={`mt-2 pl-4 space-y-2 ${
                          activeSubmenu === index ? 'block' : 'hidden'
                        }`}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.link}
                            className="block text-base text-zinc-200 hover:text-sakura-200 transition-colors"
                            onClick={toggleMenu}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.link}
                      className="text-lg font-medium text-white hover:text-sakura-200 transition-colors"
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-4">
            <Link
              href="/members"
              className="block w-full text-center py-3 text-lg font-medium border border-white text-white hover:bg-white hover:text-hinomaru-red rounded-washi transition-colors"
              onClick={toggleMenu}
            >
              Members Section
            </Link>
            <Link
              href="/membership/join"
              className="block w-full text-center py-3 text-lg font-medium bg-hinomaru-red text-white hover:bg-sakura-700 rounded-washi transition-colors"
              onClick={toggleMenu}
            >
              Join ASA Kerala
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 