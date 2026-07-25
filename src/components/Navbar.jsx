import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Slim Top Announcement Bar */}
      <div className="bg-luxury-black text-luxury-gold py-1.5 px-4 text-xs text-center font-medium tracking-wide flex justify-between items-center max-w-7xl mx-auto rounded-b-sm shadow-md">
        <span>Now accepting bridal and special-event bookings in Kigali ✨</span>
        <a 
          href="https://wa.me/250795509978" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
        >
          <MessageCircle size={13} /> WhatsApp: +250 795 509 978
        </a>
      </div>

      {/* Main Nav */}
      <nav className={`transition-all duration-300 ${isScrolled ? 'bg-luxury-black/95 backdrop-blur-md shadow-xl py-3 text-white' : 'bg-luxury-cream/90 backdrop-blur-sm py-4 text-luxury-black'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-wider group-hover:text-luxury-rosegold transition-colors">
              BENITHA<span className="text-luxury-gold font-sans font-light text-xl">MAKEUP</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide">
            <Link to="/" className="hover:text-luxury-rosegold transition-colors">Home</Link>
            <Link to="/packages" className="hover:text-luxury-rosegold transition-colors">Packages & Pricing</Link>
            <Link to="/book" className="hover:text-luxury-rosegold transition-colors">Book Appointment</Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-luxury-gold/30 pl-4">
                <Link to="/admin/dashboard" className="text-luxury-gold hover:underline flex items-center gap-1">
                  <Shield size={16} /> Admin Portal
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }} 
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/book" 
              className="bg-luxury-gold hover:bg-luxury-rosegold text-luxury-black font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all duration-300 shadow-md flex items-center gap-2"
            >
              <Calendar size={14} /> Book Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-luxury-black text-white px-4 pt-4 pb-6 space-y-3 mt-2 border-t border-luxury-charcoal">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-luxury-gold">Home</Link>
            <Link to="/packages" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-luxury-gold">Packages & Pricing</Link>
            <Link to="/book" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-luxury-gold">Book Appointment</Link>
            
            {isAuthenticated ? (
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-luxury-gold">
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs text-gray-400">
                Staff Login
              </Link>
            )}

            <Link 
              to="/book" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full bg-luxury-gold text-luxury-black font-semibold text-xs uppercase py-3 rounded-full mt-4"
            >
              Book Your Appointment
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}