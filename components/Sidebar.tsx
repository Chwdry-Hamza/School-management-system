'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HiOutlineChartSquareBar, 
  HiOutlineUser, 
  HiOutlineUsers, 
  HiOutlineCalendar, 
  HiOutlineBookOpen, 
  HiOutlineClipboardCheck, 
  HiOutlineAcademicCap, 
  HiOutlineCash, 
  HiOutlineChatAlt,
  HiOutlineMail,
  HiOutlineDocument,
  HiOutlineLibrary,
  HiOutlineUserGroup, // For Parent Portal
  HiOutlineDocumentReport, // For Reports
  HiOutlineCog, // For Setting
} from 'react-icons/hi';

export default function Sidebar({ collapsed, onLinkClick }: { collapsed: boolean; onLinkClick?: () => void }) {
  const linkClasses = "flex items-center justify-between p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md transition-colors";

  return (
    <div 
      style={{ 
        height: '100%', 
        backgroundColor: 'white', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        padding: '16px', 
        transition: 'all 0.3s', 
        width: collapsed ? '80px' : '256px'
      }}
      className="h-full"
    >
      {/* Logo and Title (Fixed) */}
      <div className={`flex flex-col items-center ${collapsed ? 'mb-4' : 'mb-8'}`}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={collapsed ? 40 : 100}
          height={collapsed ? 40 : 100}
          className={`transition-all duration-300 ${collapsed ? 'mb-0' : 'mb-2'}`}
        />
        {!collapsed && (
          <h2 className="text-xl font-bold text-gray-800 text-center">Blooming Scholars Academy</h2>
        )}
      </div>
      <hr className="border-t border-gray-300 my-4" />

      {/* Scrollable Menu and Support Sections */}
      <div
        style={{
          overflowY: 'auto',
          height: 'calc(100% - 160px)', // Adjusted height to account for logo, title, and hr
          scrollbarWidth: 'thin', // For Firefox
          scrollbarColor: '#888 #f1f1f1' // For Firefox
        }}
      >
        {/* Inline CSS for Webkit browsers (Chrome, Safari) */}
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>

        {/* Menu Section */}
        {!collapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Menu</h3>}
        <ul className="mb-6 space-y-2">
          <li>
            <Link href="/dashboard/admin" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineChartSquareBar className="text-lg" />
                {!collapsed && <span className="ml-3">Admin Dashboard</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/students" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineUser className="text-lg" />
                {!collapsed && <span className="ml-3">Students</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/teachers" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineUsers className="text-lg" />
                {!collapsed && <span className="ml-3">Teachers</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/scheduler" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineCalendar className="text-lg" />
                {!collapsed && <span className="ml-3">Scheduler</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/courses" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineBookOpen className="text-lg" />
                {!collapsed && <span className="ml-3">Course</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/attendance" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineClipboardCheck className="text-lg" />
                {!collapsed && <span className="ml-3">Attendance</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/exams" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineAcademicCap className="text-lg" />
                {!collapsed && <span className="ml-3">Exam</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/fees" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineCash className="text-lg" />
                {!collapsed && <span className="ml-3">Fees Section</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/library" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineLibrary className="text-lg" />
                {!collapsed && <span className="ml-3">Library</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/parentportal" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineUserGroup className="text-lg" />
                {!collapsed && <span className="ml-3">Parent Portal</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/reports" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineDocumentReport className="text-lg" />
                {!collapsed && <span className="ml-3">Reports</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/Setting" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineCog className="text-lg" />
                {!collapsed && <span className="ml-3">Setting</span>}
              </div>
            </Link>
          </li>
        </ul>

        {/* Support Section */}
        {!collapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Support</h3>}
        <ul className="space-y-2 pb-4">
          <li>
            <Link href="/support/chat" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineChatAlt className="text-lg" />
                {!collapsed && <span className="ml-3">Chat</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/support/email" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineMail className="text-lg" />
                {!collapsed && <span className="ml-3">Email</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/support/invoice" className={linkClasses} onClick={onLinkClick}>
              <div className="flex items-center">
                <HiOutlineDocument className="text-lg" />
                {!collapsed && <span className="ml-3">Invoice</span>}
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}