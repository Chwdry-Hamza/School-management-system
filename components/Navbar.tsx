'use client';
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar({
  onMobileToggleSidebar,
  onDesktopToggleSidebar,
  isCollapsed,
}: {
  onMobileToggleSidebar: () => void;
  onDesktopToggleSidebar: () => void;
  isCollapsed: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
      setEmail(user.email); // Set email in state
      console.log('User Data:', {
        username: user.username,
        email: user.email,
      });
    } else {
      console.log('No user data found in storage');
      setUsername('User');
      setEmail('email@example.com'); // Fallback email
    }
  }, []);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    // Clear token and user data from storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow-md p-2">
      <div className="flex justify-between items-center w-full px-2">
        {/* Left: Toggler and Logo */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            className="md:hidden text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onMobileToggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button
            className="hidden md:block text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onDesktopToggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className="flex-1 flex justify-center items-center md:hidden">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="transition-all duration-300"
              />
              <span className="text-lg font-bold text-gray-800">BSA</span>
            </div>
          </div>
          <form onSubmit={handleSearch} className="hidden md:block relative w-72">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or type a command..."
                className="w-full py-2 px-4 pl-10 pr-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:ring-from-blue-400 focus:ring-to-indigo-500 transition-all duration-300 placeholder-gray-400 text-gray-800"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                ⌘ K
              </span>
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-2">
          {isLoggedIn && (
            <div className="hidden md:block relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {/* <img
                  src="https://via.placeholder.com/40"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                /> */}
                <span className="font-medium">{username}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-gray-800 font-medium">{username}</p>
                    <p className="text-gray-500 text-sm">{email}</p>
                  </div>
                  <div className="py-1">
                  <Link href="/dashboard/profile">
                    <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit profile
                    </button>
                    </Link>
                    <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account settings
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Support
                    </button>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {isLoggedIn && (
            <div className="md:hidden relative">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                </svg>
              </button>
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-auto bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                  <button
                    onClick={toggleDropdown}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{username}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="w-64">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-gray-800 font-medium">{username}</p>
                        <p className="text-gray-500 text-sm">{email}</p>
                      </div>
                      <div className="py-1">
                        <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Edit profile
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Account settings
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Support
                        </button>
                      </div>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}