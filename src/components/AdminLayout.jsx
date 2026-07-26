import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Layers, 
  FileText, BarChart3, LogOut, Sparkles, User, Menu, X, Settings 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSettingsModal from './AdminSettingsModal';

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/admin/appointments', label: 'Appointments List', icon: FileText },
    { path: '/admin/schedule', label: 'Operating Hours', icon: Calendar },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { path: '/admin/services', label: 'Manage Services', icon: Layers },
    { path: '/packages', label: 'View Public Shop', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-black flex font-sans overflow-hidden">
      
      {/* 1. FIXED DESKTOP SIDEBAR */}
      <aside className="w-64 bg-luxury-black text-white flex-col justify-between border-r border-luxury-charcoal shrink-0 hidden md:flex h-screen sticky top-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-luxury-charcoal">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-luxury-pink text-luxury-black flex items-center justify-center font-serif font-bold text-base shadow">
                B
              </div>
              <div>
                <span className="font-sans font-light text-base tracking-wider uppercase block text-white">
                  Benitha<span className="text-luxury-pink">Admin</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-sans">
                  Management Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5 font-sans font-light text-xs uppercase tracking-widest">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive 
                      ? 'bg-luxury-pink text-luxury-black font-normal shadow' 
                      : 'text-gray-300 hover:bg-luxury-charcoal hover:text-luxury-pink'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom branding */}
        <div className="p-4 border-t border-luxury-charcoal text-[10px] text-gray-400 text-center uppercase tracking-widest">
          BenithaStudio Pro
        </div>
      </aside>

      {/* 2. MAIN CONTAINER */}
      <div className="flex-grow flex flex-col h-screen min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-luxury-nude px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-luxury-black hover:text-luxury-pink"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <span className="text-[9px] uppercase font-bold text-luxury-pink tracking-widest font-sans block">Admin Control Center</span>
              <h1 className="font-serif text-base sm:text-lg font-bold text-luxury-black truncate">
                Welcome back, {admin?.username || 'admin'} ✨
              </h1>
            </div>
          </div>

          {/* Admin Profile Dropdown Icon */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-2 bg-luxury-cream hover:bg-luxury-nude border border-luxury-nude transition-colors rounded-none"
              title="Admin Profile"
            >
              <div className="w-7 h-7 bg-luxury-black text-luxury-pink flex items-center justify-center font-bold text-xs">
                <User size={16} />
              </div>
              <span className="hidden sm:inline text-xs font-sans font-medium text-luxury-black">
                {admin?.username || 'admin'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-luxury-nude shadow-2xl py-1 z-50 text-xs font-sans">
                <div className="px-4 py-2 border-b border-gray-100 text-gray-500 text-[10px] uppercase">
                  Signed in as <strong className="text-luxury-black block truncate">{admin?.username || 'admin'}</strong>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-luxury-cream text-gray-700 flex items-center gap-2 uppercase tracking-wider"
                >
                  <Settings size={14} /> Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-2 uppercase tracking-wider border-t border-gray-100"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-luxury-black text-white p-6 space-y-3 absolute top-16 left-0 right-0 z-50 border-b border-luxury-charcoal shadow-2xl">
            <div className="text-xs text-gray-400 pb-2 border-b border-luxury-charcoal flex items-center gap-2">
              <User size={14} className="text-luxury-pink" /> Logged in as <strong>{admin?.username || 'admin'}</strong>
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest ${
                    isActive ? 'bg-luxury-pink text-luxury-black font-bold' : 'text-gray-300 hover:bg-luxury-charcoal'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Scrollable Main Content Area */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto bg-luxury-cream">
          <Outlet />
        </main>

      </div>

      {/* Admin Account Settings Modal */}
      <AdminSettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  );
}