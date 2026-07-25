import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

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
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://wa.me/250795509978" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors">
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