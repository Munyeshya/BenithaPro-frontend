import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-gray-300 pt-16 pb-8 border-t border-luxury-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-white tracking-wider">
            BENITHA<span className="text-luxury-gold font-sans font-light text-xl">MAKEUP</span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Professional makeup artistry based in Kigali, Rwanda. Dedicated to enhancing natural elegance for weddings, graduations, photoshoots, and special moments.
          </p>
          <div className="flex space-x-4 pt-2">
            {/* Instagram Custom SVG Icon */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-luxury-gold transition-colors"
              title="Follow on Instagram"
            >
              <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://wa.me/250795509978" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-luxury-gold transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-luxury-gold mb-4">Quick Navigation</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-white transition-colors">Home Experience</Link></li>
            <li><Link to="/packages" className="hover:text-white transition-colors">Makeup Packages</Link></li>
            <li><Link to="/book" className="hover:text-white transition-colors">Book Appointment</Link></li>
            <li><Link to="/admin/login" className="hover:text-white transition-colors">Staff Login</Link></li>
          </ul>
        </div>

        {/* Operating Hours */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-luxury-gold mb-4">Studio Hours</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex justify-between"><span>Monday - Saturday:</span> <span className="text-white">08:00 - 19:00</span></li>
            <li className="flex justify-between"><span>Sunday:</span> <span className="text-white">09:00 - 18:00</span></li>
            <li className="mt-3 text-[11px] italic text-luxury-rosegold">* On-location field services available by appointment.</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-luxury-gold mb-4">Studio Location</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-luxury-gold shrink-0 mt-0.5" />
              <span>Kigali, Rwanda (Studio & Field Services)</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-luxury-gold shrink-0" />
              <span>+250 795 509 978</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-luxury-gold shrink-0" />
              <span>info@benithamakeup.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-luxury-charcoal text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} BenithaMakeup Pro. All rights reserved.</p>
        <p className="text-[11px]">Designed with luxury for Kigali beauty.</p>
      </div>
    </footer>
  );
}