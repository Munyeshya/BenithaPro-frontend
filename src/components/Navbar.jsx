import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scissors, Calendar, User, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-black text-white shadow-md border-b border-luxury-charcoal transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-luxury-pink text-luxury-black flex items-center justify-center font-serif font-bold text-lg group-hover:scale-105 transition-transform shadow">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-white">
                Benitha<span className="text-luxury-pink">Makeup</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-sans">
                Professional Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-semibold">
            {[
              { path: '/', label: 'Home' },
              { path: '/packages', label: 'Services & Packages' },
              { path: '/gallery', label: 'Gallery' },
              { path: '/track', label: 'Track Appointment' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`transition-colors py-2 relative ${
                  isActive(path) 
                    ? 'text-luxury-pink font-bold' 
                    : 'text-gray-300 hover:text-luxury-pink'
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-pink rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions (Book Now / Admin) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/book"
              className="bg-luxury-pink text-luxury-black hover:bg-luxury-pink-light font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all duration-300 shadow flex items-center gap-2 hover:scale-105"
            >
              <Sparkles size={14} /> Book Glam
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/dashboard"
                  className="bg-luxury-charcoal hover:bg-black text-gray-200 border border-gray-700 text-xs px-4 py-2.5 rounded-full font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors uppercase tracking-wider font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-gray-400 hover:text-luxury-pink transition-colors rounded-full hover:bg-luxury-charcoal"
                title="Admin Portal"
              >
                <User size={18} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-luxury-charcoal text-gray-200 hover:text-luxury-pink transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-luxury-black border-t border-luxury-charcoal px-6 py-6 space-y-4 text-sm font-semibold uppercase tracking-wider">
          {[
            { path: '/', label: 'Home' },
            { path: '/packages', label: 'Services & Packages' },
            { path: '/gallery', label: 'Gallery' },
            { path: '/track', label: 'Track Appointment' },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`block py-2 ${isActive(path) ? 'text-luxury-pink' : 'text-gray-300'}`}
            >
              {label}
            </Link>
          ))}

          <div className="pt-4 border-t border-luxury-charcoal flex flex-col gap-3">
            <Link
              to="/book"
              onClick={() => setIsOpen(false)}
              className="w-full bg-luxury-pink text-luxury-black font-bold text-center py-3 rounded-full uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <Sparkles size={14} /> Book Glam
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-luxury-charcoal text-white text-center py-3 rounded-full text-xs"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-red-400 text-center py-2 text-xs"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-gray-400 text-center py-2 text-xs"
              >
                Admin Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}