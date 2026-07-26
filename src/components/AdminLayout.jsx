import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Layers, 
  Settings, LogOut, Sparkles, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard & Bookings', icon: LayoutDashboard },
    { path: '/admin/services', label: 'Manage Services', icon: Layers },
    { path: '/admin/schedule', label: 'Schedule & Blocks', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-black flex font-sans">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-luxury-black text-white flex flex-col justify-between border-r border-luxury-charcoal shrink-0 hidden md:flex">
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

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 font-sans font-light text-xs uppercase tracking-widest">
            {[
              { path: '/admin/dashboard', label: 'Dashboard & Bookings', icon: LayoutDashboard },
              { path: '/packages', label: 'View Public Shop', icon: Sparkles },
            ].map((item) => {
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

        {/* Sidebar Footer / Admin Profile */}
        <div className="p-4 border-t border-luxury-charcoal space-y-3">
          <div className="px-4 py-2 bg-luxury-charcoal text-xs text-gray-300">
            <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Logged in as</span>
            <strong className="text-white font-normal truncate block">{admin?.username || 'Administrator'}</strong>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900 text-red-300 font-sans font-light text-xs uppercase tracking-widest py-3 transition-colors border border-red-900/50"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Mobile Top Header for Admin */}
        <header className="md:hidden bg-luxury-black text-white p-4 flex justify-between items-center border-b border-luxury-charcoal">
          <span className="font-sans font-light text-sm uppercase tracking-widest text-luxury-pink">Benitha Admin</span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 font-light uppercase tracking-wider flex items-center gap-1"
          >
            <LogOut size={12} /> Logout
          </button>
        </header>

        {/* Content Outlet */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}