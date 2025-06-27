'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Hook to get current route
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current pathname
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop

  // Check if we're on the login or signup page
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/signup';

  return (
    
    <html lang="en">
      
      <body className="bg-gray-100">
        <main className={`p-6 overflow-auto ${isAuthPage ? '' : 'bg-gray-100'}`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Only show if not on the login or signup page */}
          {!isAuthPage && (
            <div
              className={`fixed inset-y-0 left-0 z-30 bg-white shadow-md transition-all duration-300 
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:static md:z-0
                ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}
            >
              <Sidebar collapsed={sidebarCollapsed} />
            </div>
          )}

          {/* Mobile Overlay - Only show if not on the login or signup page */}
          {!isAuthPage && sidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Navbar - Only show if not on the login or signup page */}
            {!isAuthPage && (
              <Navbar
                onMobileToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                onDesktopToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                isCollapsed={sidebarCollapsed}
              />
            )}

            {/* Main Content (children) */}
            <main className="p-6 overflow-auto">{children}</main>
          </div>
        </div>
        </main>
      </body>
    </html>
  );
}
