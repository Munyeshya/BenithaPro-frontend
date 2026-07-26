import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Sparkles, ChevronDown, Menu, X, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSettingsModal from './AdminSettingsModal';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Track window scroll to toggle top bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/packages', label: 'Packages & Pricing' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/track', label: 'Track Appointment' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 shadow-md">
        
        {/* TOP ANNOUNCEMENT / CONTACT BAR (Luxury Pink Theme with smooth scroll hide) */}
        <div 
          className={`bg-luxury-pink text-luxury-black font-sans text-[11px] font-medium px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300 ease-in-out ${
            scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-1.5 opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                <Sparkles size={12} /> BenithaMakeup Pro Studio • Kigali
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] sm:text-[11px]">
              <a href="tel:+250795509978" className="flex items-center gap-1 hover:underline font-semibold">
                <Phone size={12} /> +250 795 509 978
              </a>
              <span className="hidden sm:inline opacity-60">•</span>
              <a href="mailto:info@benithamakeup.com" className="flex items-center gap-1 hover:underline font-semibold">
                <Mail size={12} /> info@benithamakeup.com
              </a>
            </div>
          </div>
        </div>

        {/* MAIN NAVBAR */}
        <div className="bg-luxury-black text-white border-b border-luxury-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* 1. LEFT: Hamburger Menu Button & Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-white hover:text-luxury-pink transition-colors focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link to="/" className="hidden md:flex items-center group">
                <img 
                  src="/logo2.svg" 
                  alt="BenithaMakeup Pro Logo" 
                  className="h-9 sm:h-10 w-auto object-contain object-left" 
                />
              </Link>
            </div>

            {/* 2. CENTER: Proportional Navigation Links (Hidden on mobile) */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-sans text-xs uppercase tracking-widest font-light mx-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`transition-colors py-1.5 border-b-2 ${
                      isActive 
                        ? 'border-luxury-pink text-luxury-pink font-semibold' 
                        : 'border-transparent text-gray-300 hover:text-luxury-pink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT: Book Appointment & Admin Login / Dropdown */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <Link
                to="/book"
                className="bg-luxury-pink text-luxury-black hover:bg-white font-nav uppercase tracking-widest text-[10px] px-3.5 py-2 transition-colors font-bold shadow flex items-center gap-1.5"
              >
                <Sparkles size={14} /> Book Appointment
              </Link>

              {admin ? (
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 bg-luxury-charcoal hover:bg-black border border-luxury-nude/30 transition-colors"
                  >
                    <div className="w-6 h-6 bg-luxury-pink text-luxury-black flex items-center justify-center font-bold text-xs">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-sans font-medium text-white px-1">
                      {admin?.username || 'Admin'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white text-luxury-black border border-luxury-nude shadow-2xl py-1 z-50 text-xs font-sans">
                      <div className="px-4 py-2 border-b border-gray-100 text-gray-500 text-[10px] uppercase">
                        Signed in as <strong className="text-luxury-black block truncate">{admin?.username || 'admin'}</strong>
                      </div>

                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 hover:bg-luxury-cream text-gray-700 flex items-center gap-2 uppercase tracking-wider font-semibold"
                      >
                        <Sparkles size={14} className="text-luxury-pink" /> Admin Dashboard
                      </Link>

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
              ) : (
                <Link
                  to="/admin/login"
                  className="text-[10px] text-gray-400 hover:text-luxury-pink uppercase tracking-widest font-sans transition-colors"
                >
                  Admin Login
                </Link>
              )}
            </div>

            {/* MOBILE QUICK ACTION */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/book"
                className="bg-luxury-pink text-luxury-black font-nav uppercase tracking-widest text-[9px] px-3 py-1.5 font-bold flex items-center gap-1 shadow"
              >
                <Sparkles size={12} /> Book
              </Link>
            </div>

          </div>
        </div>

        {/* MOBILE COLLAPSIBLE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-luxury-black border-t border-luxury-charcoal px-6 py-5 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-2 font-sans text-xs uppercase tracking-widest">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-3 transition-colors ${
                      isActive 
                        ? 'bg-luxury-pink text-luxury-black font-bold' 
                        : 'text-gray-300 hover:bg-luxury-charcoal hover:text-luxury-pink'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-luxury-charcoal space-y-3 font-sans text-xs uppercase tracking-widest">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-luxury-pink text-luxury-black font-bold p-2.5 flex items-center justify-center gap-2 shadow text-center"
              >
                <Sparkles size={14} /> Book Appointment
              </Link>

              {admin ? (
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] text-gray-400 flex items-center gap-2 pb-1">
                    <User size={14} className="text-luxury-pink" /> Signed in as <strong>{admin?.username}</strong>
                  </div>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left p-2 bg-luxury-charcoal text-luxury-pink flex items-center gap-2 font-semibold"
                  >
                    <Sparkles size={14} /> Admin Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSettingsModalOpen(true);
                    }}
                    className="w-full text-left p-2 bg-luxury-charcoal text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <Settings size={14} /> Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left p-2 bg-red-950/50 text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-gray-400 hover:text-luxury-pink transition-colors text-center bg-luxury-charcoal/50"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Admin Settings Modal */}
      <AdminSettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </>
  );
}