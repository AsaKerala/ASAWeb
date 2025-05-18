'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/auth';
import { useRouter, usePathname } from 'next/navigation';

// Menu structure as per requirements
const menuItems = [
  { label: 'Home', link: '/' },
  { 
    label: 'About Us', 
    link: '/about',
    submenu: [
      { label: 'Overview', link: '/about?tab=overview' },
      { label: 'History', link: '/about?tab=history' },
      { label: 'What is AOTS?', link: '/about?tab=aots' },
      { label: 'Our Team', link: '/about?tab=team' },
      { label: 'Sister Organizations & Affiliations', link: '/about?tab=affiliations' }
    ]
  },
  { 
    label: 'Programs', 
    link: '/programs',
    submenu: [
      { label: 'Training in Japan', link: '/programs#training-japan' },
      { label: 'Training in India', link: '/programs#training-india' },
      { label: 'Language Training', link: '/programs#language-training' },
      { label: 'Internships', link: '/programs#internships' },
      { label: 'Skill Development', link: '/programs#skill-development' },
      { label: 'WNF Programs', link: '/programs#wnf-programs' }
    ]
  },
  { 
    label: 'Events', 
    link: '/events',
    submenu: [
      { label: 'Upcoming Events', link: '/events#all' },
      { label: 'Conferences', link: '/events#conferences' },
      { label: 'Seminars', link: '/events#seminars' },
      { label: 'Workshops', link: '/events#workshops' },
      { label: 'Cultural Events', link: '/events#cultural' },
      { label: 'Webinars', link: '/events#webinars' }
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
    label: 'Membership', 
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
      { label: 'Member Directory', link: '/members/directory' }
    ]
  }
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname?.startsWith('/auth/');

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (userMenuOpen && !target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

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

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Update Members Section link based on authentication status
  const getMembersSectionLink = () => {
    return isAuthenticated ? '/dashboard' : '/members';
  };

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header
      className={`w-full transition-all duration-300 sticky top-0 z-50 bg-white shadow-md py-2`}
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
            <span className="text-2xl font-bold text-hinomaru-red">
              ASA
            </span>
            <span className="text-2xl font-bold ml-1 text-zinc-800">
              Kerala
            </span>
          </Link>

          {/* Desktop Menu - Horizontal Format with Dividers */}
          <nav className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group flex items-center">
                  {index > 0 && (
                    <span className="mx-1 text-zinc-400">|</span>
                  )}
                  {item.submenu ? (
                    <>
                      <button
                        className="font-medium text-sm whitespace-nowrap px-1 flex items-center text-zinc-800 hover:text-hinomaru-red transition-colors"
                        onClick={() => {
                          if (item.label === 'Members Section') {
                            router.push(getMembersSectionLink());
                          }
                        }}
                      >
                        {item.label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 w-3 h-3 inline-block transition-transform group-hover:rotate-180 text-zinc-600"
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

                      {/* Submenu */}
                      <div className="absolute left-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {item.submenu.map((subItem, subIndex) => {
                            // Skip rendering Member Login if user is authenticated
                            if (item.label === 'Members Section' && subItem.label === 'Member Login' && isAuthenticated) {
                              return null;
                            }
                            
                            // Skip rendering Member Directory for non-authenticated users
                            if (item.label === 'Members Section' && subItem.label === 'Member Directory' && !isAuthenticated) {
                              return null;
                            }
                            
                            return (
                              <Link
                                key={subIndex}
                                href={subItem.link}
                                className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                          
                          {/* Add Dashboard link for authenticated users */}
                          {item.label === 'Members Section' && isAuthenticated && (
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                            >
                              Dashboard
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.link}
                      className="font-medium text-sm whitespace-nowrap px-1 text-zinc-800 hover:text-hinomaru-red transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* User Profile Section when logged in */}
            {isAuthenticated && user && (
              <div className="relative user-menu-container">
                <button 
                  className="flex items-center space-x-2 text-zinc-800 hover:text-hinomaru-red focus:outline-none"
                  onClick={toggleUserMenu}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-hinomaru-red text-white flex items-center justify-center border border-gray-200">
                    {user.profile?.profileImage ? (
                      <Image
                        src={user.profile.profileImage}
                        alt={user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">{getUserInitials()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
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

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin-dashboard"
                          className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button and User Profile for Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {/* User Profile Button when logged in (Mobile) */}
            {isAuthenticated && user && (
              <button 
                className="flex items-center text-zinc-800 focus:outline-none mr-2"
                onClick={toggleUserMenu}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-hinomaru-red text-white flex items-center justify-center border border-gray-200">
                  {user.profile?.profileImage ? (
                    <Image
                      src={user.profile.profileImage}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">{getUserInitials()}</span>
                  )}
                </div>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 text-hinomaru-red`}
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

            {/* User Dropdown for Mobile */}
            {userMenuOpen && (
              <div className="absolute right-4 top-12 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
                    <p className="text-xs text-zinc-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin-dashboard"
                      className="block px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 hover:text-hinomaru-red"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed inset-y-0 right-0 w-full bg-hinomaru-red transform transition-transform ease-in-out duration-300 z-30 md:hidden`}
      >
        <div className="h-full flex flex-col p-8 text-white overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex-shrink-0">
              <h2 className="text-2xl font-bold">ASA KERALA</h2>
            </Link>
            <button
              onClick={toggleMenu}
              className="text-white hover:text-sakura-200 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {/* User Info in Mobile Menu when logged in */}
          {isAuthenticated && user && (
            <div className="mb-6 flex items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white text-hinomaru-red flex items-center justify-center mr-3">
                {user.profile?.profileImage ? (
                  <Image
                    src={user.profile.profileImage}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold">{getUserInitials()}</span>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/70 text-sm">{user.email}</p>
              </div>
            </div>
          )}
          
          <nav className="mb-8">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <details className="text-white">
                      <summary className="list-none flex justify-between items-center cursor-pointer mb-2">
                        <span className="text-lg font-medium hover:text-sakura-200 transition-colors">
                          {item.label}
                        </span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </summary>
                      <ul className="pl-4 space-y-2 mt-2 mb-4">
                        {item.submenu.map((subItem, subIndex) => {
                          // Skip rendering Member Login if user is authenticated
                          if (item.label === 'Members Section' && subItem.label === 'Member Login' && isAuthenticated) {
                            return null;
                          }
                          
                          // Skip rendering Member Directory for non-authenticated users
                          if (item.label === 'Members Section' && subItem.label === 'Member Directory' && !isAuthenticated) {
                            return null;
                          }
                          
                          return (
                            <li key={subIndex}>
                              <Link
                                href={subItem.link}
                                className="text-base text-white hover:text-sakura-200 transition-colors"
                                onClick={toggleMenu}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          );
                        })}
                        
                        {/* Add Dashboard link for authenticated users */}
                        {item.label === 'Members Section' && isAuthenticated && (
                          <li>
                            <Link
                              href="/dashboard"
                              className="text-base text-white hover:text-sakura-200 transition-colors"
                              onClick={toggleMenu}
                            >
                              Dashboard
                            </Link>
                          </li>
                        )}
                      </ul>
                    </details>
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
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block w-full text-center py-3 text-lg font-medium border border-white text-white hover:bg-white hover:text-hinomaru-red rounded-washi transition-colors"
                  onClick={toggleMenu}
                >
                  My Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin-dashboard"
                    className="block w-full text-center py-3 text-lg font-medium border border-white text-white hover:bg-white hover:text-hinomaru-red rounded-washi transition-colors"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="block w-full text-center py-3 text-lg font-medium bg-white text-hinomaru-red hover:bg-sakura-100 rounded-washi transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full text-center py-3 text-lg font-medium border border-white text-white hover:bg-white hover:text-hinomaru-red rounded-washi transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/membership/join"
                  className="block w-full text-center py-3 text-lg font-medium bg-white text-hinomaru-red hover:bg-sakura-100 rounded-washi transition-colors"
                  onClick={toggleMenu}
                >
                  Join ASA Kerala
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 