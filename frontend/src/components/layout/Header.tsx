'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth';
import { globals } from '@/lib/api';

type MenuItem = {
  label: string;
  link: string;
  type: 'internal' | 'external';
  isButton: boolean;
  accessLevel: 'public' | 'members' | 'admin';
  subMenuItems?: MenuItem[];
};

type MainMenu = {
  menuItems: MenuItem[];
  mobileMenuSettings: {
    breakpoint: 'sm' | 'md' | 'lg';
    showSocialIcons: boolean;
  };
};

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuData, setMenuData] = useState<MainMenu | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Fetch menu data
    const fetchMenu = async () => {
      try {
        const response = await globals.getMainMenu();
        setMenuData(response.data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      }
    };
    
    fetchMenu();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine if a menu item should be visible based on user role
  const shouldShowMenuItem = (item: MenuItem): boolean => {
    if (item.accessLevel === 'public') return true;
    if (item.accessLevel === 'members' && isAuthenticated) return true;
    if (item.accessLevel === 'admin' && user?.role === 'admin') return true;
    return false;
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Organization
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuData?.menuItems
              .filter(shouldShowMenuItem)
              .map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === 'internal' ? (
                    <Link 
                      href={item.link} 
                      className={`text-gray-700 hover:text-blue-600 ${
                        item.isButton ? 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`text-gray-700 hover:text-blue-600 ${
                        item.isButton ? 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700' : ''
                      }`}
                    >
                      {item.label}
                    </a>
                  )}

                  {/* Dropdown for submenus */}
                  {item.subMenuItems && item.subMenuItems.length > 0 && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                      {item.subMenuItems
                        .filter(shouldShowMenuItem)
                        .map((subItem, subIndex) => (
                          <div key={subIndex} className="py-2 px-4 hover:bg-gray-100">
                            {subItem.type === 'internal' ? (
                              <Link href={subItem.link} className="block text-gray-700 hover:text-blue-600">
                                {subItem.label}
                              </Link>
                            ) : (
                              <a 
                                href={subItem.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block text-gray-700 hover:text-blue-600"
                              >
                                {subItem.label}
                              </a>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}

            {/* Authentication Links */}
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => logout()}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {menuData?.menuItems
                .filter(shouldShowMenuItem)
                .map((item, index) => (
                  <div key={index}>
                    {item.type === 'internal' ? (
                      <Link 
                        href={item.link} 
                        className={`block py-2 text-gray-700 hover:text-blue-600 ${
                          item.isButton ? 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`block py-2 text-gray-700 hover:text-blue-600 ${
                          item.isButton ? 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}

                    {/* Submenu items for mobile */}
                    {item.subMenuItems && item.subMenuItems.length > 0 && (
                      <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                        {item.subMenuItems
                          .filter(shouldShowMenuItem)
                          .map((subItem, subIndex) => (
                            <div key={subIndex}>
                              {subItem.type === 'internal' ? (
                                <Link 
                                  href={subItem.link} 
                                  className="block py-1 text-gray-700 hover:text-blue-600"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ) : (
                                <a 
                                  href={subItem.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block py-1 text-gray-700 hover:text-blue-600"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subItem.label}
                                </a>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}

              {/* Authentication Links for Mobile */}
              {!isAuthenticated ? (
                <>
                  <Link 
                    href="/auth/login" 
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-700 hover:text-blue-600 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
} 